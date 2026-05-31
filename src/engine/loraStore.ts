import type {
  LoraEntry,
  LoraEntryInput,
  LoraModelFamily,
  LoraStore,
} from '../types';

const LORA_STORE_KEY = 'promptgen:loras:v1';
const LORA_STORE_BACKUP_KEY = 'promptgen:loras:backup:v1';
const LORA_SEED_FLAG_KEY = 'promptgen:loras:seeded:v1';

const VALID_FAMILIES: LoraModelFamily[] = [
  'illustrious',
  'flux',
  'z-image-turbo',
  'sdxl',
  'other',
];

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

const sortItems = <T extends LoraEntry>(items: T[]): T[] =>
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

const sanitizeFamily = (value: unknown): LoraModelFamily => {
  if (typeof value === 'string') {
    const trimmed = value.trim() as LoraModelFamily;
    if ((VALID_FAMILIES as string[]).includes(trimmed)) return trimmed;
  }
  return 'other';
};

const sanitizeWeight = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    if (value < 0) return 0;
    if (value > 2) return 2;
    return value;
  }
  return 1;
};

const sanitizeItem = (value: unknown): LoraEntry | null => {
  if (!isRecord(value)) return null;
  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const name = typeof value.name === 'string' ? normalizeText(value.name) : '';
  const filename = typeof value.filename === 'string' ? value.filename.trim() : '';
  if (!id || !name || !filename) return null;
  const createdAt = typeof value.createdAt === 'number' && Number.isFinite(value.createdAt)
    ? value.createdAt : Date.now();
  const updatedAt = typeof value.updatedAt === 'number' && Number.isFinite(value.updatedAt)
    ? value.updatedAt : createdAt;
  return {
    id,
    name,
    summary: typeof value.summary === 'string' ? normalizeText(value.summary) || undefined : undefined,
    filename,
    modelFamily: sanitizeFamily(value.modelFamily),
    defaultWeight: sanitizeWeight(value.defaultWeight),
    triggerWords: sanitizeStringArray(value.triggerWords),
    notes: typeof value.notes === 'string' ? normalizeText(value.notes) || undefined : undefined,
    coverImageUrl: typeof value.coverImageUrl === 'string' ? value.coverImageUrl.trim() || undefined : undefined,
    createdAt,
    updatedAt,
  };
};

const SEED_TS = 1780272000000;

const DEFAULT_SEED_LORAS: LoraEntry[] = [
  {
    id: 'lora_seed_new_pixel_core_ill',
    name: 'New Pixel Core (Illustrious)',
    summary: 'Decorative pixel-art LoRA for Illustrious checkpoints.',
    filename: 'new_pixel_core-ILL.safetensors',
    modelFamily: 'illustrious',
    defaultWeight: 0.8,
    triggerWords: ['new_pixel_core', 'pixel art'],
    notes: 'Strong compositional bias: forces sun-halo + arched-portico backdrop on nearly every output. Pair only with decorative/iconic styles (Art Nouveau, stained glass, religious icon). Avoid noir / shadow / low-key intents — the halo and arches will fight you.',
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
];

const writeItems = (items: LoraEntry[]) => {
  const payload: LoraStore = { version: 1, items: sortItems(items) };
  writeStorageItem(LORA_STORE_KEY, payload);
  writeStorageItem(LORA_STORE_BACKUP_KEY, payload);
};

const maybeApplySeed = (items: LoraEntry[]): LoraEntry[] => {
  let result = items;

  if (readStorageItem(LORA_SEED_FLAG_KEY) === null) {
    writeStorageItem(LORA_SEED_FLAG_KEY, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = DEFAULT_SEED_LORAS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  return result;
};

const readItems = (): LoraEntry[] => {
  const candidates = [
    parseJson(readStorageItem(LORA_STORE_KEY)),
    parseJson(readStorageItem(LORA_STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const raw = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.items) ? candidate.items : null);
    if (!raw) continue;
    const parsed = sortItems(
      raw.map(sanitizeItem).filter((i): i is LoraEntry => Boolean(i))
    );
    if (parsed.length > 0 || raw.length === 0) return maybeApplySeed(parsed);
  }

  return maybeApplySeed([]);
};

const sanitizeInput = (input: LoraEntryInput): Required<Pick<LoraEntryInput, 'name' | 'filename' | 'modelFamily'>> & LoraEntryInput => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('LoRA name is required.');
  const filename = input.filename.trim();
  if (!filename) throw new Error('LoRA filename is required.');
  return {
    name,
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    filename,
    modelFamily: sanitizeFamily(input.modelFamily),
    defaultWeight: sanitizeWeight(input.defaultWeight),
    triggerWords: sanitizeStringArray(input.triggerWords),
    notes: input.notes ? normalizeText(input.notes) || undefined : undefined,
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
  };
};

export async function listLoraEntries(): Promise<LoraEntry[]> {
  return readItems();
}

export async function getLoraEntry(id: string): Promise<LoraEntry | null> {
  const itemId = id.trim();
  if (!itemId) return null;
  return readItems().find(i => i.id === itemId) ?? null;
}

export async function createLoraEntry(input: LoraEntryInput): Promise<LoraEntry> {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: LoraEntry = {
    id: createId('lora'),
    name: sanitized.name,
    summary: sanitized.summary,
    filename: sanitized.filename,
    modelFamily: sanitized.modelFamily,
    defaultWeight: sanitized.defaultWeight ?? 1,
    triggerWords: sanitized.triggerWords ?? [],
    notes: sanitized.notes,
    coverImageUrl: sanitized.coverImageUrl,
    createdAt: now,
    updatedAt: now,
  };
  const items = readItems();
  writeItems([...items, next]);
  return next;
}

export async function updateLoraEntry(id: string, input: LoraEntryInput): Promise<LoraEntry> {
  const itemId = id.trim();
  if (!itemId) throw new Error('LoRA id is required.');
  const sanitized = sanitizeInput(input);
  const items = readItems();
  const existing = items.find(i => i.id === itemId);
  if (!existing) throw new Error('LoRA not found.');
  const updated: LoraEntry = {
    ...existing,
    name: sanitized.name,
    summary: sanitized.summary,
    filename: sanitized.filename,
    modelFamily: sanitized.modelFamily,
    defaultWeight: sanitized.defaultWeight ?? existing.defaultWeight,
    triggerWords: sanitized.triggerWords ?? existing.triggerWords,
    notes: sanitized.notes,
    coverImageUrl: sanitized.coverImageUrl,
    updatedAt: Date.now(),
  };
  writeItems(items.map(i => (i.id === itemId ? updated : i)));
  return updated;
}

export async function deleteLoraEntry(id: string): Promise<void> {
  const itemId = id.trim();
  if (!itemId) throw new Error('LoRA id is required.');
  const items = readItems();
  writeItems(items.filter(i => i.id !== itemId));
}
