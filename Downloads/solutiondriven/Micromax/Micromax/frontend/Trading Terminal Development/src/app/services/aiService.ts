// AI Model Types
export type AIModel =
  | 'gpt-4'
  | 'gpt-3.5-turbo'
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'gemini-2.5-flash'
  | 'gemini-2.5-pro'
  | 'gemini-2.0-flash'
  | 'gemini-flash-latest'
  | 'gemini-pro-latest'
  | 'micromax';

// Configuration interface
export interface AIConfig {
  openaiApiKey?: string;
}

// Message interface
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

interface SavedStrategyRecord {
  id?: string;
  name: string;
  description?: string;
  entryRules?: string[];
  exitRules?: string[];
  riskRules?: string[];
  updatedAt?: string;
  createdAt?: string;
}

// Rate limiting interface
interface RateLimitData {
  messageCount: number;
  tokenCount: number;
  lastReset: number;
}

class AIService {
  private config: AIConfig = {};
  private googleApiKey: string = '';
  private workingModel: string = '';
  
  // Rate limiting constants (free tier limits)
  private readonly MAX_MESSAGES_PER_DAY = 50;
  private readonly MAX_TOKENS_PER_DAY = 25000;
  private readonly RATE_LIMIT_RESET_MS = 24 * 60 * 60 * 1000; // 24 hours
  
  // Models to try in order (latest available models)
  private readonly MODELS_TO_TRY = [
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash',
    'gemini-flash-latest',
    'gemini-pro-latest',
  ];

  constructor() {
    // Get API key from environment
    this.googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
    if (this.googleApiKey) {
      console.log('âœ… Google Gemini API key loaded successfully');
    } else {
      console.warn('âš ï¸ Google Gemini API key not found in environment');
    }
    
    // Try to load cached working model
    const cached = localStorage.getItem('micromax_working_gemini_model');
    if (cached) {
      this.workingModel = cached;
      console.log(`ðŸ“¦ Using cached Gemini model: ${this.workingModel}`);
    }
  }

  private normalizeText(text: string): string {
    return text
      .replace(/Ã¢Å“â€¦/g, '✅')
      .replace(/Ã¢Å¡Â Ã¯Â¸Â/g, '⚠️')
      .replace(/Ã¢ÂÅ’/g, '❌')
      .replace(/Ã°Å¸â€˜â€¹/g, '👋')
      .replace(/Ã°Å¸â€œÅ /g, '📊')
      .replace(/Ã°Å¸â€œÂ¸/g, '📸')
      .replace(/Ã°Å¸Å½Â¯/g, '🎯')
      .replace(/Ã°Å¸â€œâ€¹/g, '📋')
      .replace(/Ã°Å¸â€œË†/g, '📈')
      .replace(/Ã°Å¸Å¸Â¢/g, '🟢')
      .replace(/Ã°Å¸â€™Â¡/g, '💡')
      .replace(/Ã¢â‚¬Â¢/g, '•')
      .replace(/Ã¢â€°Ë†/g, '≈');
  }
  // Rate limiting check
  private checkRateLimit(): { allowed: boolean; message?: string; remaining?: { messages: number; tokens: number } } {
    const rateLimitData = this.getRateLimitData();
    const now = Date.now();
    
    // Reset if 24 hours have passed
    if (now - rateLimitData.lastReset > this.RATE_LIMIT_RESET_MS) {
      this.resetRateLimit();
      return { 
        allowed: true, 
        remaining: { 
          messages: this.MAX_MESSAGES_PER_DAY, 
          tokens: this.MAX_TOKENS_PER_DAY 
        } 
      };
    }
    
    // Check limits
    if (rateLimitData.messageCount >= this.MAX_MESSAGES_PER_DAY) {
      const hoursUntilReset = Math.ceil((this.RATE_LIMIT_RESET_MS - (now - rateLimitData.lastReset)) / (60 * 60 * 1000));
      return { 
        allowed: false, 
        message: `Daily message limit reached (${this.MAX_MESSAGES_PER_DAY}). Resets in ${hoursUntilReset} hours.` 
      };
    }
    
    if (rateLimitData.tokenCount >= this.MAX_TOKENS_PER_DAY) {
      const hoursUntilReset = Math.ceil((this.RATE_LIMIT_RESET_MS - (now - rateLimitData.lastReset)) / (60 * 60 * 1000));
      return { 
        allowed: false, 
        message: `Daily token limit reached (${this.MAX_TOKENS_PER_DAY}). Resets in ${hoursUntilReset} hours.` 
      };
    }
    
    return { 
      allowed: true,
      remaining: {
        messages: this.MAX_MESSAGES_PER_DAY - rateLimitData.messageCount,
        tokens: this.MAX_TOKENS_PER_DAY - rateLimitData.tokenCount
      }
    };
  }

  private getRateLimitData(): RateLimitData {
    const stored = localStorage.getItem('rate_limit_data');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      messageCount: 0,
      tokenCount: 0,
      lastReset: Date.now()
    };
  }

  private updateRateLimit(tokensUsed: number) {
    const data = this.getRateLimitData();
    data.messageCount += 1;
    data.tokenCount += tokensUsed;
    localStorage.setItem('rate_limit_data', JSON.stringify(data));
  }

  private resetRateLimit() {
    const data: RateLimitData = {
      messageCount: 0,
      tokenCount: 0,
      lastReset: Date.now()
    };
    localStorage.setItem('rate_limit_data', JSON.stringify(data));
  }

  public getRateLimitStatus() {
    return this.checkRateLimit();
  }

  private getGatewayBaseUrl() {
    return import.meta.env.VITE_AI_GATEWAY_URL || '';
  }

  private async callGateway(
    path: string,
    body: Record<string, unknown>,
  ): Promise<{ text?: string; model?: string; remaining?: { messages?: number; tokens?: number } }> {
    const baseUrl = this.getGatewayBaseUrl();
    const url = `${baseUrl}${path}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errorMessage = payload?.error || payload?.message || `Gateway request failed (${response.status})`;
      throw new Error(errorMessage);
    }

    return payload;
  }

  // Update API keys
  public setApiKey(provider: 'openai' | 'anthropic' | 'micromax', apiKey: string) {
    switch (provider) {
      case 'openai':
        this.config.openaiApiKey = apiKey;
        break;
      default:
        throw new Error(`${provider} is handled by the server configuration.`);
    }
  }

  // Check if API keys are configured
  public hasApiKey(provider: 'openai' | 'anthropic' | 'micromax'): boolean {
    switch (provider) {
      case 'openai':
      case 'anthropic':
      case 'micromax':
        return true;
    }
  }

  // Main chat completion method
  public async chat(
    messages: AIMessage[],
    model: AIModel = 'gpt-3.5-turbo',
    options?: {
      temperature?: number;
      maxTokens?: number;
      systemPrompt?: string;
      userId?: string;
    }
  ): Promise<string> {
    // Check rate limits first
    const rateLimitCheck = this.checkRateLimit();
    if (!rateLimitCheck.allowed) {
      throw new Error(rateLimitCheck.message);
    }

    const systemPrompt = options?.systemPrompt || 
      "You are Micromax, an expert AI trading assistant. You specialize in technical analysis, chart patterns, trading signals, and risk management. Provide concise, actionable insights for traders.";

    const strategyMemory = options?.userId ? await this.buildStrategyMemoryPrompt(options.userId) : '';
    const allMessages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...(strategyMemory ? [{ role: 'system' as const, content: strategyMemory }] : []),
      ...messages,
    ];

    try {
      const response = this.normalizeText(await this.chatWithServer(allMessages, model, options));
      
      // Estimate tokens used (rough approximation: 1 token â‰ˆ 4 characters)
      const tokensUsed = Math.ceil((response.length + JSON.stringify(messages).length) / 4);
      this.updateRateLimit(tokensUsed);
      
      return response;
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Still update rate limit for failed attempts
      this.updateRateLimit(100);
      
      // Fallback to mock response if API fails
      return this.normalizeText(this.getMockResponse(messages[messages.length - 1]?.content?.toString() || ''));
    }
  }

  private async buildStrategyMemoryPrompt(userId: string): Promise<string> {
    const cachedKey = `micromax_saved_strategies_${userId}`;
    const cachedStrategies = this.readCachedStrategies(cachedKey);
    const apiStrategies = await this.fetchSavedStrategies(userId);
    const strategies = apiStrategies.length ? apiStrategies : cachedStrategies;

    if (!strategies.length) {
      return '';
    }

    const prompt = strategies
      .map((strategy, index) => {
        const entryRules = (strategy.entryRules || []).slice(0, 8).join('; ') || 'No saved entry rules';
        const exitRules = (strategy.exitRules || []).slice(0, 8).join('; ') || 'No saved exit rules';
        const riskRules = (strategy.riskRules || []).slice(0, 8).join('; ') || 'No saved risk rules';
        return [
          `${index + 1}. Strategy Name: ${strategy.name}`,
          strategy.description ? `Description: ${strategy.description}` : '',
          `Entry Rules: ${entryRules}`,
          `Exit Rules: ${exitRules}`,
          `Risk Rules: ${riskRules}`,
        ].filter(Boolean).join('\n');
      })
      .join('\n\n');

    return [
      'The user has saved trading strategies. Always check these rules before answering.',
      'If the user refers to a strategy by name, obey the matching strategy exactly and remind the user of its entry, exit, and risk rules.',
      'Do not contradict saved rules unless the user explicitly asks to edit or replace the strategy.',
      'Saved Strategies:',
      prompt,
    ].join('\n');
  }

  private readCachedStrategies(storageKey: string): SavedStrategyRecord[] {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Failed to read cached strategies:', error);
      return [];
    }
  }

  private cacheStrategies(storageKey: string, strategies: SavedStrategyRecord[]) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(strategies));
    } catch (error) {
      console.warn('Failed to cache strategies:', error);
    }
  }

  private async fetchSavedStrategies(userId: string): Promise<SavedStrategyRecord[]> {
    try {
      const response = await fetch(`/api/strategies/list?userId=${encodeURIComponent(userId)}`);
      if (!response.ok) return [];

      const payload = await response.json();
      const strategies = Array.isArray(payload?.strategies) ? payload.strategies : [];
      const normalized = strategies.map((strategy: SavedStrategyRecord) => ({
        id: strategy.id,
        name: strategy.name,
        description: strategy.description,
        entryRules: Array.isArray(strategy.entryRules) ? strategy.entryRules : [],
        exitRules: Array.isArray(strategy.exitRules) ? strategy.exitRules : [],
        riskRules: Array.isArray(strategy.riskRules) ? strategy.riskRules : [],
        updatedAt: strategy.updatedAt,
        createdAt: strategy.createdAt,
      }));

      this.cacheStrategies(`micromax_saved_strategies_${userId}`, normalized);
      return normalized;
    } catch (error) {
      console.warn('Failed to load saved strategies for AI context:', error);
      return [];
    }
  }

  private async chatWithServer(
    messages: AIMessage[],
    model: AIModel,
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<string> {
    try {
      const gateway = await this.callGateway('/api/ai/chat', {
        task: 'chat',
        model,
        messages,
        userId: options?.userId,
        temperature: options?.temperature,
        maxTokens: options?.maxTokens,
      });

      if (gateway?.text) {
        if (gateway.model) {
          this.workingModel = gateway.model;
          localStorage.setItem('micromax_working_gemini_model', gateway.model);
        }
        return gateway.text;
      }
    } catch (error) {
      console.warn('AI gateway chat failed, falling back to direct Gemini:', error);
    }

    // Use Google Gemini API directly if API key is available
    if (this.googleApiKey) {
      console.log('ðŸš€ Calling Google Gemini API directly...');
      return this.callGoogleGeminiAPI(messages, options);
    }

    console.log('âš ï¸ Google Gemini API key not available, falling back to mock response');
    
    // Fallback to mock response
    return this.normalizeText(this.getMockResponse(messages[messages.length - 1]?.content?.toString() || ''));
  }

  private async callGoogleGeminiAPI(
    messages: AIMessage[],
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<string> {
    try {
      // Convert messages to Google format, excluding system messages
      const contents = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ 
            text: typeof msg.content === 'string' ? msg.content : 
                  Array.isArray(msg.content) ? msg.content.map(c => c.text || c.type).join('\n') : '' 
          }],
        }));

      // Ensure we have at least one user message
      if (contents.length === 0) {
        return this.normalizeText(this.getMockResponse('No message to send'));
      }

      const requestBody = {
        contents: contents,
        generationConfig: {
          temperature: options?.temperature ?? 0.7,
          maxOutputTokens: options?.maxTokens ?? 1400,
        },
      };

      console.log('ðŸ“¤ Sending to Google Gemini:', { messageCount: messages.length, apiKeyExists: !!this.googleApiKey });

      // Try cached model first, then fallback to trying all models
      const modelsToTry = this.workingModel 
        ? [this.workingModel, ...this.MODELS_TO_TRY.filter(m => m !== this.workingModel)]
        : this.MODELS_TO_TRY;

      let allFailed = true;
      let lastError: string = '';
      
      for (const model of modelsToTry) {
        try {
          console.log(`ðŸ”„ Trying model: ${model}`);
          
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.googleApiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
              signal: AbortSignal.timeout(10000), // 10 second timeout
            }
          );

          const payload = await response.json();
          
          if (!response.ok) {
            const errorMsg = payload?.error?.message || `API failed with status ${response.status}`;
            console.warn(`âš ï¸ Model ${model} failed: ${errorMsg}`);
            lastError = errorMsg;
            continue; // Try next model
          }

          // Success! Cache this model
          allFailed = false;
          this.workingModel = model;
          localStorage.setItem('micromax_working_gemini_model', model);
          console.log(`âœ… Model ${model} works! Cached for next time.`);
          
          const responseText = this.normalizeText(payload.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated');
          console.log('âœ… Google Gemini Response:', responseText.substring(0, 150) + '...');
          
          return responseText;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          console.warn(`âš ï¸ Model ${model} error: ${errorMsg}`);
          lastError = errorMsg;
          continue; // Try next model
        }
      }

      // All models failed - try to diagnose the issue
      if (allFailed) {
        console.error('âŒ All Gemini models failed. Attempting to diagnose...');
        
        // Try to list available models to diagnose the issue
        try {
          const listResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models?key=${this.googleApiKey}`,
            { method: 'GET', signal: AbortSignal.timeout(5000) }
          );
          const listPayload = await listResponse.json();
          
          if (listResponse.ok && listPayload.models) {
            console.log('ðŸ“‹ Available models:', listPayload.models.map((m: any) => m.name));
            // Try the first available model
            const firstModel = listPayload.models[0]?.name?.split('/')?.pop();
            if (firstModel) {
              console.log(`ðŸ”„ Trying first available model: ${firstModel}`);
              const retryResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${firstModel}:generateContent?key=${this.googleApiKey}`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(requestBody),
                  signal: AbortSignal.timeout(10000),
                }
              );
              const retryPayload = await retryResponse.json();
              if (retryResponse.ok) {
                this.workingModel = firstModel;
                localStorage.setItem('micromax_working_gemini_model', firstModel);
                const responseText = this.normalizeText(retryPayload.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated');
                console.log(`âœ… Model ${firstModel} works!`);
                return responseText;
              }
            }
          } else {
            console.error('âŒ API Key Issue - ListModels failed:', listPayload?.error?.message || 'Unknown error');
            console.error('ðŸ’¡ Verify your Google Gemini API key is valid and enabled');
          }
        } catch (diagError) {
          console.error('âŒ Diagnosis failed:', diagError instanceof Error ? diagError.message : String(diagError));
        }
      }

      // Final fallback to mock response
      console.log('ðŸ“¦ Using mock response (API unavailable or invalid key)');
      console.log('ðŸ’¡ To fix: 1) Verify API key in .env, 2) Enable Generative AI API in Google Cloud Console, 3) Ensure quota/billing is active');
      
      return this.normalizeText(this.getMockResponse(messages[messages.length - 1]?.content?.toString() || ''));
    } catch (error) {
      console.error('âŒ Google Gemini API Call Failed:', error);
      console.log('ðŸ“¦ Using mock response');
      return this.normalizeText(this.getMockResponse(messages[messages.length - 1]?.content?.toString() || ''));
    }
  }

  // Mock response for fallback or demo
  private getMockResponse(userInput: string, isMicromax: boolean = false): string {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('screenshot') || lowerInput.includes('chart') || lowerInput.includes('analyze')) {
      return `📸 Chart Analysis:\n\n• Pattern: Bullish divergence forming on RSI\n• Price Action: Lower lows vs RSI higher lows\n• Momentum: Building upward pressure\n• Key Level: Strong support at $70,500\n• Signal: Potential long entry at $71,200\n• Target: $73,500 (3.2% gain)\n• Stop Loss: $69,800 (-2.0%)\n• Risk/Reward: 1:1.6\n• Confidence: 76%\n\n⚠️ Wait for confirmation above $71,500 with volume spike.`;
    }

    if (lowerInput.includes('signal') || lowerInput.includes('trade') || lowerInput.includes('buy') || lowerInput.includes('sell')) {
      return `📊 ${isMicromax ? 'Micromax' : 'Trading'} Signal:\n\n🟢 BUY Signal Detected\n\nSymbol: BTC/USDT\nEntry: $71,270\nTargets:\n• TP1: $72,800 (+2.1%)\n• TP2: $73,500 (+3.1%)\n• TP3: $74,900 (+5.1%)\n\nStop Loss: $69,800 (-2.1%)\nPosition Size: 2-3% of portfolio\nTimeframe: 4H\nConfidence: ${isMicromax ? '82%' : '76%'}\n\n✅ Indicators aligned: RSI(55), MACD bullish crossover, Volume increasing`;
    }

    if (lowerInput.includes('support') || lowerInput.includes('resistance') || lowerInput.includes('level')) {
      return `🎯 Key Levels Analysis:\n\nSupport Zones:\n• S1: $70,500 (Strong)\n• S2: $69,200 (Medium)\n• S3: $68,000 (Weekly)\n\nResistance Zones:\n• R1: $72,800 (Current test)\n• R2: $74,500 (Major)\n• R3: $76,200 (ATH proximity)\n\nCurrent Price: Testing R1\nBias: Bullish above $70,500\nBreakout target: $76,000+`;
    }

    if (lowerInput.includes('risk') || lowerInput.includes('position') || lowerInput.includes('size')) {
      return `⚖️ Risk Management:\n\nRecommended Position Sizing:\n• Conservative: 1-2% per trade\n• Moderate: 2-3% per trade\n• Aggressive: 3-5% per trade\n\nCurrent Market Conditions:\n• Volatility: Moderate (14%)\n• Trend: Bullish short-term\n• Risk Level: Medium\n\n💡 Never risk more than 1% on a single trade. Use stop losses always.`;
    }

    if (lowerInput.includes('strategy') || lowerInput.includes('plan')) {
      return `📋 Trading Strategy:\n\n1. Wait for Setup\n   • Confluence of 2+ indicators\n   • Volume confirmation\n   • Key level approach\n\n2. Entry Rules\n   • Buy: Break & retest\n   • Sell: Rejection at resistance\n   • Scale in: 50%-30%-20%\n\n3. Exit Strategy\n   • Take partial profits at TP1\n   • Move SL to breakeven\n   • Trail stop for remaining position\n\n4. Risk Management\n   • Max 3 concurrent positions\n   • 2:1 minimum R/R ratio`;
    }

    return `I'm ${isMicromax ? 'Micromax, your specialized trading AI' : 'your AI assistant'}. I can help you with:\n\n📊 Trade signals & analysis\n📈 Chart pattern recognition\n🎯 Support/resistance levels\n⚖️ Risk management advice\n📋 Strategy development\n📸 Screenshot analysis\n\nWhat would you like to explore?`;
  }
  // Analyze screenshot using Google Gemini Vision API
  public async analyzeChartScreenshot(
    imageBase64: string,
    userQuery?: string,
    userId?: string
  ): Promise<string> {
    // Check rate limits
    const rateLimitCheck = this.checkRateLimit();
    if (!rateLimitCheck.allowed) {
      throw new Error(rateLimitCheck.message);
    }

    try {
      const gateway = await this.callGateway('/api/ai/analyze-chart', {
        task: 'chart',
        imageBase64,
        userQuery,
        userId,
      });

      if (gateway?.text) {
        if (gateway.model) {
          this.workingModel = gateway.model;
          localStorage.setItem('micromax_working_gemini_model', gateway.model);
        }
        this.updateRateLimit(Math.ceil(gateway.text.length / 4) + 300);
        return gateway.text;
      }
    } catch (error) {
      console.warn('AI gateway chart analysis failed, falling back to direct Gemini:', error);
    }

    if (!this.googleApiKey) {
      throw new Error('Chart analysis is unavailable because the Gemini API key is missing.');
    }

    try {
      console.log('ðŸš€ Analyzing chart screenshot with Google Gemini Vision API...');

      // Prepare the request with image data
      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: userQuery || 'Please analyze this trading chart. Tell me what you see: chart patterns, technical levels, support/resistance, any drawings or analysis visible, price action, indicators, and any trading signals.'
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64.replace(/^data:image\/jpeg;base64,/, '').replace(/^data:image\/png;base64,/, '')
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        }
      };

      console.log('ðŸ“¤ Sending image to Google Gemini Vision API...');

      // Try cached model first
      const modelsToTry = this.workingModel 
        ? [this.workingModel, ...this.MODELS_TO_TRY.filter(m => m !== this.workingModel)]
        : this.MODELS_TO_TRY;
      let lastVisionError = 'Chart analysis is temporarily unavailable. Please try again in a moment.';

      for (const model of modelsToTry) {
        try {
          console.log(`ðŸ”„ Trying vision model: ${model}`);
          
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.googleApiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody),
              signal: AbortSignal.timeout(30000), // 30 second timeout for image processing
            }
          );

          const payload = await response.json();
          
          if (!response.ok) {
            const errorMsg = payload?.error?.message || `API failed with status ${response.status}`;
            lastVisionError = this.getChartAnalysisErrorMessage(errorMsg, response.status);
            console.warn(`âš ï¸ Model ${model} failed: ${errorMsg}`);
            continue;
          }

          // Success!
          this.workingModel = model;
          localStorage.setItem('micromax_working_gemini_model', model);
          console.log(`âœ… Vision model ${model} works!`);
          
          const analysisText = this.normalizeText(payload.candidates?.[0]?.content?.parts?.[0]?.text || 'Analysis failed');
          const finishReason = payload.candidates?.[0]?.finishReason || 'UNKNOWN';
          console.log('âœ… Chart Analysis Finish Reason:', finishReason);
          console.log('âœ… Chart Analysis Length:', analysisText.length);
          console.log('âœ… Chart Analysis Preview:', analysisText.slice(0, 400));
          
          // Update rate limit with token estimate
          this.updateRateLimit(Math.ceil(analysisText.length / 4) + 300);
          
          return analysisText;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error);
          lastVisionError = this.getChartAnalysisErrorMessage(errorMsg);
          console.warn(`âš ï¸ Vision model ${model} error: ${errorMsg}`);
          continue;
        }
      }

      // All models failed
      console.error('âŒ All vision models failed');
      throw new Error(lastVisionError);

    } catch (error) {
      console.error('Screenshot analysis error:', error);
      throw error instanceof Error
        ? error
        : new Error('Chart analysis failed. Please try again.');
    }
  }

  private getChartAnalysisErrorMessage(message: string, status?: number): string {
    const normalized = message.toLowerCase();

    if (normalized.includes('timed out') || normalized.includes('timeout')) {
      return 'The AI chart analysis took too long to respond. Please try again in a few moments.';
    }

    if (
      status === 429 ||
      normalized.includes('quota exceeded') ||
      normalized.includes('too many requests') ||
      normalized.includes('rate limit')
    ) {
      return 'The AI chart analysis limit has been reached right now. Please wait a bit and try again.';
    }

    if (normalized.includes('api key')) {
      return 'The AI chart analysis service is not configured correctly right now.';
    }

    return 'The AI chart analysis service is unavailable right now. Please try again shortly.';
  }

  // Parse trading strategy description and convert to code logic
  public async parseStrategyDescription(strategyDescription: string, strategyName?: string): Promise<{
    name: string;
    description: string;
    code: string;
    entryRules: string[];
    exitRules: string[];
    riskRules: string[];
  }> {
    try {
      const prompt = `You are a trading strategy assistant. Analyze this trading strategy description and convert it into a concise strategy name and implementable logic.

Strategy Description: "${strategyDescription}"

Provide a JSON response with:
{
  "name": "Strategy Name (auto-generated if not provided)",
  "code": "JavaScript-like pseudocode for the strategy"
}

Make sure:
- keep the code clear, commented, and implementable
- only summarize the strategy logic that the user actually described
- do not invent entry, exit, or risk sections that were not explicitly described by the user
- the rule library will be shown separately in the UI, so keep this response focused on naming and logic`;

      const response = await this.chat(
        [
          {
            role: 'system',
            content: 'You are a trading strategy expert that converts strategy descriptions into code logic and rules.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        'gemini-2.5-flash',
        {
          systemPrompt: 'You convert trading strategy descriptions into concise JSON with a name and code block.',
          maxTokens: 1200,
        }
      );

      // Parse the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse strategy response');
      }

      const strategyData = JSON.parse(jsonMatch[0]);
      const extracted = this.extractStrategyClauses(strategyDescription);
      return {
        name: strategyName || strategyData.name || 'Custom Strategy',
        description: strategyDescription,
        code: strategyData.code,
        entryRules: extracted.entryRules,
        exitRules: extracted.exitRules,
        riskRules: extracted.riskRules,
      };
    } catch (error) {
      console.error('Error parsing strategy:', error);
      // Return a structured default response for fallback
      const extracted = this.extractStrategyClauses(strategyDescription);
      return {
        name: strategyName || 'Custom Strategy',
        description: strategyDescription,
        code: `// ${strategyName || 'Custom'} Strategy\nmodule.exports = {\n  name: "${strategyName || 'Custom Strategy'}",\n  onTick(symbol, price, indicators) {\n    // Implement your strategy logic here\n    return null;\n  }\n};`,
        entryRules: extracted.entryRules,
        exitRules: extracted.exitRules,
        riskRules: extracted.riskRules,
      };
    }
  }

  private expandStrategyRules(
    strategyDescription: string,
    strategyName: string | undefined,
    strategyData: { code?: string; name?: string }
  ) {
    const extracted = this.extractStrategyClauses(strategyDescription);
    const entryRules = this.ensureRuleCount(
      [
        ...extracted.entryRules,
      ],
      'entry',
      100,
    );
    const exitRules = this.ensureRuleCount(
      [
        ...extracted.exitRules,
      ],
      'exit',
      100,
    );
    const riskRules = this.ensureRuleCount(
      [
        ...extracted.riskRules,
      ],
      'risk',
      100,
    );

    return {
      name: strategyName || strategyData.name || 'Custom Strategy',
      code: strategyData.code || '',
      entryRules,
      exitRules,
      riskRules,
    };
  }

  private extractStrategyClauses(strategyDescription: string) {
    const cleaned = strategyDescription.replace(/\s+/g, ' ').trim();
    const clauses = cleaned
      .split(/[.;\n]/)
      .map((part) => part.trim())
      .filter(Boolean);

    const entryRules: string[] = [];
    const exitRules: string[] = [];
    const riskRules: string[] = [];
    const generalRules: string[] = [];

    const entryPattern = /\b(entry|buy|long|open|trigger|setup|signal|breakout|momentum|scalp|accumulate|add position)\b/;
    const exitPattern = /\b(exit|take profit|tp|sell|close|target|short|reverse|scale out|partial profit)\b/;
    const riskPattern = /\b(risk|stop loss|sl|position size|size|rr|reward|loss|drawdown|breakeven|trail|exposure|max loss)\b/;

    for (const clause of clauses) {
      const lower = clause.toLowerCase();
      if (exitPattern.test(lower)) {
        exitRules.push(clause);
        continue;
      }
      if (riskPattern.test(lower)) {
        riskRules.push(clause);
        continue;
      }
      if (entryPattern.test(lower)) {
        entryRules.push(clause);
        continue;
      }
      generalRules.push(clause);
    }

    if (!entryRules.length && !exitRules.length && !riskRules.length && generalRules.length) {
      entryRules.push(generalRules[0]);
    } else if (!entryRules.length && clauses.length) {
      entryRules.push(clauses[0]);
    }

    return {
      entryRules,
      exitRules,
      riskRules,
      generalRules,
    };
  }

  private ensureRuleCount(existingRules: string[], type: 'entry' | 'exit' | 'risk', targetCount: number) {
    const uniqueRules: string[] = [];
    const seen = new Set<string>();

    const addRule = (rule: string) => {
      const normalized = rule.replace(/\s+/g, ' ').trim();
      if (!normalized) return;
      const key = normalized.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      uniqueRules.push(normalized);
    };

    existingRules.forEach(addRule);

    const templates = this.getRuleTemplates(type);
    for (const template of templates) {
      addRule(template);
      if (uniqueRules.length >= targetCount) break;
    }

    return uniqueRules.slice(0, targetCount);
  }

  private getRuleTemplates(type: 'entry' | 'exit' | 'risk') {
    const entryBases = [
      'Confirm the higher timeframe trend before taking any entry',
      'Wait for a candle close beyond the trigger level',
      'Require a volume spike above recent average before entering',
      'Only enter when momentum supports the signal',
      'Avoid entries when the market is ranging tightly',
      'Enter on a clean retest of the broken level',
      'Require price to respect support or resistance before entry',
      'Check that spread and slippage remain acceptable',
      'Use the nearest support or resistance as the setup anchor',
      'Verify that the signal appears during active market hours',
      'Confirm the market structure shift before entering',
      'Allow price to sweep liquidity before taking the setup',
      'Look for a clean breakout candle with strong body expansion',
      'Demand alignment between price action and indicator bias',
      'Wait for confirmation from both trend and momentum filters',
      'Enter only after the pullback holds above the invalidation level',
      'Avoid chasing entries after extended impulsive moves',
      'Require the trigger candle to close in the direction of the trade',
      'Trade only when session liquidity supports the setup',
      'Check that spread remains stable before sending the order',
    ];
    const exitBases = [
      'Exit when the opposite signal confirms on candle close',
      'Exit if momentum fades for two consecutive candles',
      'Take partial profit at the first target area',
      'Move the stop to breakeven after the setup confirms',
      'Exit if price closes back inside the breakout zone',
      'Exit if volume collapses after the entry spike',
      'Exit when the planned time limit is reached',
      'Exit if the market structure turns against the setup',
      'Exit when risk-to-reward is no longer favorable',
      'Exit if a stronger opposing setup appears',
      'Exit when price loses the projected target structure',
      'Exit after a failed continuation candle confirms weakness',
      'Exit if a key level rejects price and momentum fades',
      'Exit when volatility compresses after the move matures',
      'Exit once the reward target is fully reached',
      'Exit if the market re-enters the prior consolidation zone',
      'Exit when the move no longer respects the trailing structure',
      'Exit if the trade no longer matches the session bias',
      'Exit when the candle body shows clear exhaustion',
    ];
    const riskBases = [
      'Risk a fixed percentage of the account on each trade',
      'Cap the maximum daily loss before any new entries',
      'Keep position size aligned with stop-loss distance',
      'Avoid overexposure by limiting simultaneous positions',
      'Use a hard stop loss on every trade',
      'Reduce size when volatility expands sharply',
      'Avoid trading after a major loss until conditions reset',
      'Use a minimum risk-to-reward target before entry',
      'Never add to a losing position without a new setup',
      'Protect gains by trailing the stop when appropriate',
      'Respect the maximum loss threshold before adding new trades',
      'Size positions so no single stop-out can damage the account',
      'Avoid stacking correlated positions against the same move',
      'Keep exposure low when news volatility is expected',
      'Use reduced size if the instrument has wide spreads',
      'Lock in partial profits before the final target area',
      'Protect open profits with a stop that trails structure',
      'Avoid revenge entries after a stopped-out trade',
      'Only risk capital that fits the broader account plan',
    ];

    const entryVariants = [
      'and wait for a full candle confirmation',
      'and only proceed when volume remains above the baseline',
      'with a clean retest of the breakout level',
      'and confirm the move is not news-driven noise',
      'with a confirmed swing failure or momentum shift',
      'after liquidity is cleared and the level is respected',
      'once the trend filter and trigger align',
      'only after the setup is validated by the session flow',
    ];
    const exitVariants = [
      'and close the trade without hesitation',
      'while preserving the best available profit',
      'and avoid giving back more than planned',
      'once the target extension is reached',
      'after a clear reversal candle forms',
      'when the move stalls beneath resistance',
      'if continuation fails to appear',
    ];
    const riskVariants = [
      'while keeping exposure small and repeatable',
      'and maintain a disciplined account-level cap',
      'to prevent one trade from dominating the session',
      'while respecting the hard stop and daily loss cap',
      'and keep the account protected from oversized risk',
      'while leaving room for a second confirmed setup',
      'to avoid compounding losses in a weak market',
    ];

    const expand = (bases: string[], variants: string[]) => {
      const rules: string[] = [];
      for (const base of bases) {
        for (const variant of variants) {
          rules.push(`${base} ${variant}`.replace(/\s+/g, ' ').trim());
        }
      }

      // Add extra structured variations so the library can scale to 100 rules
      // without removing any of the original templates.
      const extensionPrefixes = [
        'Use',
        'Prefer',
        'Require',
        'Allow',
        'Maintain',
      ];
      const extensionSuffixes = [
        'during high-liquidity sessions',
        'when the trend remains aligned',
        'only after the setup is confirmed',
        'while keeping the trade plan simple',
        'and avoid overcomplicating the entry',
      ];

      for (const prefix of extensionPrefixes) {
        for (const base of bases.slice(0, 8)) {
          for (const suffix of extensionSuffixes) {
            rules.push(`${prefix} ${base.toLowerCase()} ${suffix}`.replace(/\s+/g, ' ').trim());
          }
        }
      }

      return rules;
    };

    if (type === 'entry') return expand(entryBases, entryVariants);
    if (type === 'exit') return expand(exitBases, exitVariants);
    return expand(riskBases, riskVariants);
  }

  public getStrategyTemplatePreview() {
    return {
      entryRules: this.getRuleTemplates('entry').slice(0, 5),
      exitRules: this.getRuleTemplates('exit').slice(0, 5),
      riskRules: this.getRuleTemplates('risk').slice(0, 5),
    };
  }

  public getStrategyRuleLibrary() {
    return {
      entryRules: this.getRuleTemplates('entry'),
      exitRules: this.getRuleTemplates('exit'),
      riskRules: this.getRuleTemplates('risk'),
    };
  }
}

// Export singleton instance
export const aiService = new AIService();

