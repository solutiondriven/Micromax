const axios = require('axios');

const TASK_MODEL_POLICY = {
  chat: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
  chart: ['gemini-2.5-pro', 'gemini-2.5-flash'],
  strategy: ['gemini-2.5-flash', 'gemini-2.0-flash'],
  journal: ['gemini-2.5-flash'],
};

const DEFAULT_ALLOWED_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-pro-latest',
];

function estimateTokens(text = '') {
  return Math.max(1, Math.ceil(String(text).length / 4));
}

function normalizeContent(content) {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => item?.text || item?.image_url?.url || item?.type || '')
      .filter(Boolean)
      .join('\n');
  }

  return '';
}

function extractLastUserMessage(messages = []) {
  const userMessage = [...messages].reverse().find((message) => message?.role === 'user');
  return normalizeContent(userMessage?.content || '');
}

class AiGateway {
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || '';
    this.allowedModels = (process.env.AI_ALLOWED_MODELS || '')
      .split(',')
      .map((model) => model.trim())
      .filter(Boolean);
    this.messageLimit = Number(process.env.AI_RATE_LIMIT_MESSAGES || 50);
    this.tokenLimit = Number(process.env.AI_RATE_LIMIT_TOKENS || 25000);
    this.resetWindowMs = 24 * 60 * 60 * 1000;
    this.usage = new Map();
  }

  getPolicy() {
    return TASK_MODEL_POLICY;
  }

  getAvailableModels() {
    return this.allowedModels.length ? this.allowedModels : DEFAULT_ALLOWED_MODELS;
  }

  getTaskModels(task) {
    const policy = TASK_MODEL_POLICY[task] || TASK_MODEL_POLICY.chat;
    const available = this.getAvailableModels();
    const allowed = policy.filter((model) => available.includes(model));
    return allowed.length ? allowed : available;
  }

  pickModel(task, requestedModel) {
    const taskModels = this.getTaskModels(task);
    if (requestedModel && taskModels.includes(requestedModel)) {
      return requestedModel;
    }
    return taskModels[0] || this.getAvailableModels()[0];
  }

  getBucket(key) {
    const now = Date.now();
    const current = this.usage.get(key);

    if (!current || now - current.lastReset > this.resetWindowMs) {
      const bucket = {
        messageCount: 0,
        tokenCount: 0,
        lastReset: now,
      };
      this.usage.set(key, bucket);
      return bucket;
    }

    return current;
  }

  getRemaining(key) {
    const bucket = this.getBucket(key);
    return {
      messages: Math.max(0, this.messageLimit - bucket.messageCount),
      tokens: Math.max(0, this.tokenLimit - bucket.tokenCount),
    };
  }

  checkLimit(key, estimatedTokens = 0) {
    const bucket = this.getBucket(key);
    if (bucket.messageCount >= this.messageLimit) {
      return {
        allowed: false,
        message: `AI daily message limit reached (${this.messageLimit}).`,
        remaining: this.getRemaining(key),
      };
    }

    if (bucket.tokenCount + estimatedTokens > this.tokenLimit) {
      return {
        allowed: false,
        message: `AI daily token limit reached (${this.tokenLimit}).`,
        remaining: this.getRemaining(key),
      };
    }

    return {
      allowed: true,
      remaining: this.getRemaining(key),
    };
  }

  recordUsage(key, usedTokens) {
    const bucket = this.getBucket(key);
    bucket.messageCount += 1;
    bucket.tokenCount += Math.max(1, usedTokens);
    bucket.lastReset = bucket.lastReset || Date.now();
    this.usage.set(key, bucket);
    return this.getRemaining(key);
  }

  toGeminiContents(messages = []) {
    const systemMessages = messages.filter((message) => message?.role === 'system');
    const nonSystemMessages = messages.filter((message) => message?.role !== 'system');

    const systemPrompt = systemMessages
      .map((message) => normalizeContent(message.content))
      .filter(Boolean)
      .join('\n\n');

    const contents = nonSystemMessages.map((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [
        {
          text: normalizeContent(message.content),
        },
      ],
    }));

    return {
      systemPrompt,
      contents,
    };
  }

  async generateText({
    task = 'chat',
    userId = 'guest',
    messages = [],
    model,
    temperature = 0.7,
    maxTokens = 1400,
  }) {
    const bucketKey = `ai:${userId}:${task}`;
    const estimatedTokens = estimateTokens(JSON.stringify(messages)) + maxTokens;
    const limitCheck = this.checkLimit(bucketKey, estimatedTokens);
    if (!limitCheck.allowed) {
      const error = new Error(limitCheck.message);
      error.statusCode = 429;
      error.remaining = limitCheck.remaining;
      throw error;
    }

    if (!this.apiKey) {
      const error = new Error('Server-side Gemini API key is not configured.');
      error.statusCode = 503;
      error.remaining = limitCheck.remaining;
      throw error;
    }

    const selectedModel = this.pickModel(task, model);
    const modelCandidates = [selectedModel, ...this.getTaskModels(task).filter((candidate) => candidate !== selectedModel)];
    const { systemPrompt, contents } = this.toGeminiContents(messages);

    if (!contents.length) {
      throw new Error('No user messages provided to the AI gateway.');
    }

    for (const candidate of modelCandidates) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent`,
          {
            ...(systemPrompt ? { systemInstruction: { parts: [{ text: systemPrompt }] } } : {}),
            contents,
            generationConfig: {
              temperature,
              maxOutputTokens: maxTokens,
            },
          },
          {
            params: { key: this.apiKey },
            timeout: task === 'chart' ? 30000 : 15000,
          }
        );

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const remaining = this.recordUsage(bucketKey, estimatedTokens + estimateTokens(text));

        return {
          text,
          model: candidate,
          remaining,
          policy: this.getPolicy()[task] || this.getPolicy().chat,
        };
      } catch (error) {
        const status = error?.response?.status;
        const message = error?.response?.data?.error?.message || error.message || 'AI generation failed';
        if (candidate === modelCandidates[modelCandidates.length - 1]) {
          const finalError = new Error(message);
          finalError.statusCode = status || 500;
          finalError.remaining = limitCheck.remaining;
          throw finalError;
        }
      }
    }

    throw new Error('AI generation failed.');
  }

  async analyzeChart({
    userId = 'guest',
    imageBase64,
    userQuery,
    model,
    temperature = 0.7,
    maxTokens = 4096,
  }) {
    const bucketKey = `ai:${userId}:chart`;
    const estimatedTokens = estimateTokens(imageBase64) + estimateTokens(userQuery || '') + maxTokens;
    const limitCheck = this.checkLimit(bucketKey, estimatedTokens);
    if (!limitCheck.allowed) {
      const error = new Error(limitCheck.message);
      error.statusCode = 429;
      error.remaining = limitCheck.remaining;
      throw error;
    }

    if (!this.apiKey) {
      const error = new Error('Server-side Gemini API key is not configured.');
      error.statusCode = 503;
      error.remaining = limitCheck.remaining;
      throw error;
    }

    const selectedModel = this.pickModel('chart', model);
    const modelCandidates = [selectedModel, ...this.getTaskModels('chart').filter((candidate) => candidate !== selectedModel)];
    const cleanImage = String(imageBase64 || '')
      .replace(/^data:image\/jpeg;base64,/, '')
      .replace(/^data:image\/png;base64,/, '');
    const prompt =
      userQuery || 'Please analyze this trading chart. Tell me what you see: chart patterns, technical levels, support and resistance, drawings, price action, indicators, and any trading signals.';

    for (const candidate of modelCandidates) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:generateContent`,
          {
            contents: [
              {
                role: 'user',
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: cleanImage.startsWith('/9j/')
                        ? 'image/jpeg'
                        : 'image/png',
                      data: cleanImage,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature,
              maxOutputTokens: maxTokens,
            },
          },
          {
            params: { key: this.apiKey },
            timeout: 30000,
          }
        );

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const remaining = this.recordUsage(bucketKey, estimatedTokens + estimateTokens(text));

        return {
          text,
          model: candidate,
          remaining,
          policy: this.getPolicy().chart,
        };
      } catch (error) {
        const status = error?.response?.status;
        const message = error?.response?.data?.error?.message || error.message || 'AI chart analysis failed';
        if (candidate === modelCandidates[modelCandidates.length - 1]) {
          const finalError = new Error(message);
          finalError.statusCode = status || 500;
          finalError.remaining = limitCheck.remaining;
          throw finalError;
        }
      }
    }

    throw new Error('AI chart analysis failed.');
  }
}

module.exports = {
  AiGateway,
};

