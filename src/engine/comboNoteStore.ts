import type {
  ComboNote,
  ComboNoteInput,
  ComboNoteStore,
  ComboStatus,
} from '../types';

const STORE_KEY = 'promptgen:combo_notes:v1';
const STORE_BACKUP_KEY = 'promptgen:combo_notes:backup:v1';

const VALID_STATUSES: ComboStatus[] = ['untried', 'sampled', 'won', 'failed'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const createId = (): string => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `combo_${crypto.randomUUID()}`;
    }
  } catch {
    // ignore
  }
  return `combo_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const sortItems = (items: ComboNote[]): ComboNote[] =>
  [...items].sort((a, b) => {
    if (b.updatedAt !== a.updatedAt) return b.updatedAt - a.updatedAt;
    return b.createdAt - a.createdAt;
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

const sanitizeStatus = (value: unknown): ComboStatus => {
  if (typeof value === 'string') {
    const trimmed = value.trim() as ComboStatus;
    if ((VALID_STATUSES as string[]).includes(trimmed)) return trimmed;
  }
  return 'untried';
};

const sanitizeItem = (value: unknown): ComboNote | null => {
  if (!isRecord(value)) return null;
  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const universeId = typeof value.universeId === 'string' ? value.universeId.trim() : '';
  const styleId = typeof value.styleId === 'string' ? value.styleId.trim() : '';
  if (!id || !universeId || !styleId) return null;
  const createdAt = typeof value.createdAt === 'number' && Number.isFinite(value.createdAt)
    ? value.createdAt : Date.now();
  const updatedAt = typeof value.updatedAt === 'number' && Number.isFinite(value.updatedAt)
    ? value.updatedAt : createdAt;
  return {
    id,
    universeId,
    styleId,
    status: sanitizeStatus(value.status),
    notes: typeof value.notes === 'string' ? normalizeText(value.notes) : '',
    createdAt,
    updatedAt,
  };
};

const writeItems = (items: ComboNote[]) => {
  const payload: ComboNoteStore = { version: 1, items: sortItems(items) };
  writeStorageItem(STORE_KEY, payload);
  writeStorageItem(STORE_BACKUP_KEY, payload);
};

const readItems = (): ComboNote[] => {
  const candidates = [
    parseJson(readStorageItem(STORE_KEY)),
    parseJson(readStorageItem(STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const raw = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.items) ? candidate.items : null);
    if (!raw) continue;
    const parsed = sortItems(
      raw.map(sanitizeItem).filter((i): i is ComboNote => Boolean(i))
    );
    if (parsed.length > 0 || raw.length === 0) return parsed;
  }

  return [];
};

const findByPair = (items: ComboNote[], universeId: string, styleId: string): ComboNote | undefined =>
  items.find(i => i.universeId === universeId && i.styleId === styleId);

export async function listComboNotes(): Promise<ComboNote[]> {
  return readItems();
}

export async function getComboNote(universeId: string, styleId: string): Promise<ComboNote | null> {
  const u = universeId.trim();
  const s = styleId.trim();
  if (!u || !s) return null;
  return findByPair(readItems(), u, s) ?? null;
}

// Upsert: if a ComboNote already exists for the (universeId, styleId) pair,
// update it; otherwise create a new one. This is the primary mutation surface.
export async function upsertComboNote(input: ComboNoteInput): Promise<ComboNote> {
  const universeId = input.universeId.trim();
  const styleId = input.styleId.trim();
  if (!universeId) throw new Error('Universe is required.');
  if (!styleId) throw new Error('Style is required.');
  const status = sanitizeStatus(input.status);
  const notes = normalizeText(input.notes ?? '');

  const items = readItems();
  const existing = findByPair(items, universeId, styleId);
  const now = Date.now();

  if (existing) {
    const updated: ComboNote = {
      ...existing,
      status,
      notes,
      updatedAt: now,
    };
    writeItems(items.map(i => (i.id === existing.id ? updated : i)));
    return updated;
  }

  const next: ComboNote = {
    id: createId(),
    universeId,
    styleId,
    status,
    notes,
    createdAt: now,
    updatedAt: now,
  };
  writeItems([...items, next]);
  return next;
}

export async function deleteComboNote(id: string): Promise<void> {
  const itemId = id.trim();
  if (!itemId) throw new Error('ComboNote id is required.');
  const items = readItems();
  writeItems(items.filter(i => i.id !== itemId));
}
