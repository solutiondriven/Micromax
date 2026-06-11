export type JournalSource = 'manual' | 'ai' | 'notion';

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  source: JournalSource;
  createdAt: string;
  updatedAt: string;
}

export interface JournalSyncConfig {
  enabled: boolean;
  target: 'local' | 'notion';
  notionToken?: string;
  notionDatabaseId?: string;
  notionParentPageId?: string;
  lastSyncedAt?: string;
}

const JOURNAL_ENTRIES_PREFIX = 'micromax_journal_entries_';
const JOURNAL_SYNC_PREFIX = 'micromax_journal_sync_';

function readJson<T>(storageKey: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

function writeJson(storageKey: string, value: unknown) {
  localStorage.setItem(storageKey, JSON.stringify(value));
}

function entryKey(userId: string) {
  return `${JOURNAL_ENTRIES_PREFIX}${userId}`;
}

function syncKey(userId: string) {
  return `${JOURNAL_SYNC_PREFIX}${userId}`;
}

function normalizeTags(tags: string[]): string[] {
  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  ).slice(0, 12);
}

export const journalService = {
  listEntries(userId: string): JournalEntry[] {
    if (!userId) return [];
    return readJson<JournalEntry[]>(entryKey(userId), []).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  },

  saveEntry(
    userId: string,
    payload: Pick<JournalEntry, 'title' | 'content' | 'mood' | 'source'> & { tags?: string[] },
    existingId?: string,
  ): JournalEntry {
    const entries = this.listEntries(userId);
    const now = new Date().toISOString();
    const nextEntry: JournalEntry = {
      id: existingId || `journal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId,
      title: payload.title.trim() || 'Untitled note',
      content: payload.content.trim(),
      mood: payload.mood || 'Focused',
      tags: normalizeTags(payload.tags || []),
      source: payload.source,
      createdAt: entries.find((entry) => entry.id === existingId)?.createdAt || now,
      updatedAt: now,
    };

    const nextEntries = [nextEntry, ...entries.filter((entry) => entry.id !== nextEntry.id)];
    writeJson(entryKey(userId), nextEntries);
    return nextEntry;
  },

  deleteEntry(userId: string, entryId: string) {
    const nextEntries = this.listEntries(userId).filter((entry) => entry.id !== entryId);
    writeJson(entryKey(userId), nextEntries);
  },

  clearEntries(userId: string) {
    writeJson(entryKey(userId), []);
  },

  getSyncConfig(userId: string): JournalSyncConfig {
    return readJson<JournalSyncConfig>(syncKey(userId), {
      enabled: false,
      target: 'local',
    });
  },

  saveSyncConfig(userId: string, config: JournalSyncConfig) {
    writeJson(syncKey(userId), {
      ...this.getSyncConfig(userId),
      ...config,
    });
  },

  exportEntriesAsMarkdown(userId: string) {
    const entries = this.listEntries(userId);
    return entries
      .map(
        (entry) => `## ${entry.title}\n\n- Mood: ${entry.mood}\n- Tags: ${entry.tags.join(', ') || 'none'}\n- Source: ${entry.source}\n- Updated: ${entry.updatedAt}\n\n${entry.content}`,
      )
      .join('\n\n---\n\n');
  },

  buildNotionPayload(entry: JournalEntry, databaseId?: string): Record<string, unknown> {
    return {
      ...(databaseId ? { parent: { database_id: databaseId } } : {}),
      properties: {
        Name: {
          title: [
            {
              text: { content: entry.title },
            },
          ],
        },
        Mood: {
          select: { name: entry.mood },
        },
        Tags: {
          multi_select: entry.tags.map((tag) => ({ name: tag })),
        },
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: { content: entry.content },
              },
            ],
          },
        },
      ],
    };
  },
};
