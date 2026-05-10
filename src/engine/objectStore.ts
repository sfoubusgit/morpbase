export type ObjectIdentity = {
  id: string;
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  phrases: string[];
  createdAt: number;
  updatedAt: number;
};

export type ObjectIdentityInput = {
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  phrases: string[];
};

const STORE_KEY = 'promptgen:objects:v1';
const BACKUP_KEY = 'promptgen:objects:backup:v1';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const createId = (): string => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `obj_${crypto.randomUUID()}`;
    }
  } catch {
    // ignore
  }
  return `obj_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const sanitizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => (typeof item === 'string' ? normalizeText(item) : ''))
    .filter(Boolean);
};

const sanitizeItem = (value: unknown): ObjectIdentity | null => {
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

const sortItems = (items: ObjectIdentity[]): ObjectIdentity[] =>
  [...items].sort((a, b) => {
    if (b.updatedAt !== a.updatedAt) return b.updatedAt - a.updatedAt;
    if (b.createdAt !== a.createdAt) return b.createdAt - a.createdAt;
    return a.name.localeCompare(b.name);
  });

const readStorageItem = (key: string): string | null => {
  try { return window.localStorage.getItem(key); } catch { return null; }
};

const writeStorageItem = (key: string, value: unknown) => {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
};

const parseJson = (raw: string | null): unknown => {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

const readItems = (): ObjectIdentity[] => {
  const candidates = [
    parseJson(readStorageItem(STORE_KEY)),
    parseJson(readStorageItem(BACKUP_KEY)),
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const raw = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.items) ? candidate.items : null);
    if (!raw) continue;
    const parsed = sortItems(
      raw.map(sanitizeItem).filter((i): i is ObjectIdentity => Boolean(i))
    );
    if (parsed.length > 0 || raw.length === 0) return parsed;
  }
  return [];
};

const writeItems = (items: ObjectIdentity[]) => {
  const payload = { version: 1, items: sortItems(items) };
  writeStorageItem(STORE_KEY, payload);
  writeStorageItem(BACKUP_KEY, payload);
};

const sanitizeInput = (input: ObjectIdentityInput): ObjectIdentityInput => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('Object name is required.');
  const phrases = sanitizeStringArray(input.phrases);
  if (phrases.length === 0) throw new Error('At least one phrase is required.');
  return {
    name,
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
    phrases,
  };
};

export function listObjects(): ObjectIdentity[] {
  return readItems();
}

export function createObject(input: ObjectIdentityInput): ObjectIdentity {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: ObjectIdentity = {
    id: createId(),
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    phrases: sanitized.phrases,
    createdAt: now,
    updatedAt: now,
  };
  writeItems([...readItems(), next]);
  return next;
}

export function updateObject(id: string, input: ObjectIdentityInput): ObjectIdentity {
  const sanitized = sanitizeInput(input);
  const items = readItems();
  const existing = items.find(i => i.id === id);
  if (!existing) throw new Error('Object not found.');
  const updated: ObjectIdentity = {
    ...existing,
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    phrases: sanitized.phrases,
    updatedAt: Date.now(),
  };
  writeItems(items.map(i => (i.id === id ? updated : i)));
  return updated;
}

export function deleteObject(id: string): void {
  writeItems(readItems().filter(i => i.id !== id));
}
