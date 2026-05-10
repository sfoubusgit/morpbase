import type { MoodPreset, MoodPresetInput, MoodStore } from '../types';

const MOOD_STORE_KEY = 'promptgen:moods:v1';
const MOOD_STORE_BACKUP_KEY = 'promptgen:moods:backup:v1';
const MOOD_SEED_FLAG_KEY = 'promptgen:moods:seeded:v1';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const createId = (prefix: string): string => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `${prefix}_${crypto.randomUUID()}`;
    }
  } catch {
    // ignore
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const sortItems = <T extends MoodPreset>(items: T[]): T[] =>
  [...items].sort((a, b) => {
    if (b.updatedAt !== a.updatedAt) return b.updatedAt - a.updatedAt;
    if (b.createdAt !== a.createdAt) return b.createdAt - a.createdAt;
    return a.name.localeCompare(b.name);
  });

const readStorageItem = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorageItem = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

const parseJson = (raw: string | null): unknown => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const sanitizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => (typeof item === 'string' ? normalizeText(item) : ''))
    .filter(Boolean);
};

const sanitizeItem = (value: unknown): MoodPreset | null => {
  if (!isRecord(value)) return null;
  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const name = typeof value.name === 'string' ? normalizeText(value.name) : '';
  if (!id || !name) return null;
  const phrases = sanitizeStringArray(value.phrases);
  if (phrases.length === 0) return null;
  const createdAt = typeof value.createdAt === 'number' && Number.isFinite(value.createdAt)
    ? value.createdAt : Date.now();
  const updatedAt = typeof value.updatedAt === 'number' && Number.isFinite(value.updatedAt)
    ? value.updatedAt : createdAt;
  return {
    id,
    name,
    summary: typeof value.summary === 'string' ? normalizeText(value.summary) || undefined : undefined,
    coverImageUrl: typeof value.coverImageUrl === 'string' ? value.coverImageUrl.trim() || undefined : undefined,
    phrases,
    createdAt,
    updatedAt,
  };
};

const SEED_TS = 1746921600000;
const SEED_TS_2 = 1747008000000;

const DEFAULT_SEED_MOODS: MoodPreset[] = [
  {
    id: 'mood_seed_melancholic_quiet',
    name: 'Melancholic and Quiet',
    summary: 'Subdued color, stillness, introspective weight without drama.',
    phrases: [
      'melancholic quiet mood',
      'subdued color, stillness in the image',
      'introspective, weight without drama',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'mood_seed_tense_foreboding',
    name: 'Tense and Foreboding',
    summary: 'Uneasy stillness, something about to break, pressure in the composition.',
    phrases: [
      'tense foreboding atmosphere',
      'uneasy stillness, something about to break',
      'pressure in the composition, held breath',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'mood_seed_warm_intimate',
    name: 'Warm and Intimate',
    summary: 'Soft closeness, human scale, comfort and presence.',
    phrases: [
      'warm intimate mood',
      'soft closeness, human scale',
      'comfort and presence, private moment',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'mood_seed_triumphant_epic',
    name: 'Triumphant and Epic',
    summary: 'Grand scale, momentum in the composition, heroic register.',
    phrases: [
      'triumphant epic mood',
      'grand scale, momentum in the composition',
      'heroic register, expansive energy',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'mood_seed_strange_dreamlike',
    name: 'Strange and Dreamlike',
    summary: 'Logic slightly wrong, uncanny stillness, familiar made alien.',
    phrases: [
      'strange dreamlike atmosphere',
      'logic slightly wrong, uncanny stillness',
      'surreal undertone, familiar made alien',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'mood_seed_cold_remote',
    name: 'Cold and Remote',
    summary: 'Distance in the framing, emotional remove, austere.',
    phrases: [
      'cold remote detached mood',
      'distance in the framing, emotional remove',
      'austere, minimal warmth',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
];

const writeItems = (items: MoodPreset[]) => {
  const payload: MoodStore = { version: 1, items: sortItems(items) };
  writeStorageItem(MOOD_STORE_KEY, payload);
  writeStorageItem(MOOD_STORE_BACKUP_KEY, payload);
};

const maybeApplySeed = (items: MoodPreset[]): MoodPreset[] => {
  if (readStorageItem(MOOD_SEED_FLAG_KEY) !== null) return items;
  writeStorageItem(MOOD_SEED_FLAG_KEY, true);
  const existingIds = new Set(items.map(i => i.id));
  const toAdd = DEFAULT_SEED_MOODS.filter(i => !existingIds.has(i.id));
  if (toAdd.length === 0) return items;
  const merged = sortItems([...items, ...toAdd]);
  writeItems(merged);
  return merged;
};

const readItems = (): MoodPreset[] => {
  const candidates = [
    parseJson(readStorageItem(MOOD_STORE_KEY)),
    parseJson(readStorageItem(MOOD_STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const raw = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.items) ? candidate.items : null);
    if (!raw) continue;
    const parsed = sortItems(
      raw.map(sanitizeItem).filter((i): i is MoodPreset => Boolean(i))
    );
    if (parsed.length > 0 || raw.length === 0) return maybeApplySeed(parsed);
  }

  return maybeApplySeed([]);
};

const sanitizeInput = (input: MoodPresetInput): MoodPresetInput => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('Mood preset name is required.');
  const phrases = sanitizeStringArray(input.phrases);
  if (phrases.length === 0) throw new Error('At least one phrase is required.');
  return {
    name,
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
    phrases,
  };
};

export async function listMoodPresets(): Promise<MoodPreset[]> {
  return readItems();
}

export async function createMoodPreset(input: MoodPresetInput): Promise<MoodPreset> {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: MoodPreset = {
    id: createId('mood'),
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    phrases: sanitized.phrases,
    createdAt: now,
    updatedAt: now,
  };
  const items = readItems();
  writeItems([...items, next]);
  return next;
}

export async function updateMoodPreset(id: string, input: MoodPresetInput): Promise<MoodPreset> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Mood preset id is required.');
  const sanitized = sanitizeInput(input);
  const items = readItems();
  const existing = items.find(i => i.id === itemId);
  if (!existing) throw new Error('Mood preset not found.');
  const updated: MoodPreset = {
    ...existing,
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    phrases: sanitized.phrases,
    updatedAt: Date.now(),
  };
  writeItems(items.map(i => (i.id === itemId ? updated : i)));
  return updated;
}

export async function deleteMoodPreset(id: string): Promise<void> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Mood preset id is required.');
  const items = readItems();
  writeItems(items.filter(i => i.id !== itemId));
}
