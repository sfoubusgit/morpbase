import type {
  Drop,
  DropInput,
  DropPrompt,
  DropPromptInput,
  DropStatus,
  DropStore,
  RenderResolution,
} from '../types';

const DROP_STORE_KEY = 'promptgen:drops:v1';
const DROP_STORE_BACKUP_KEY = 'promptgen:drops:backup:v1';

const VALID_STATUSES: DropStatus[] = ['draft', 'ready', 'rendered', 'shipped'];

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

const sortItems = <T extends Drop>(items: T[]): T[] =>
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

const sanitizeStatus = (value: unknown): DropStatus => {
  if (typeof value === 'string') {
    const trimmed = value.trim() as DropStatus;
    if ((VALID_STATUSES as string[]).includes(trimmed)) return trimmed;
  }
  return 'draft';
};

const sanitizeResolution = (value: unknown): RenderResolution | undefined => {
  if (!isRecord(value)) return undefined;
  const w = typeof value.width === 'number' && Number.isFinite(value.width) ? value.width : NaN;
  const h = typeof value.height === 'number' && Number.isFinite(value.height) ? value.height : NaN;
  if (!Number.isFinite(w) || !Number.isFinite(h)) return undefined;
  return { width: w, height: h };
};

const sanitizePrompt = (value: unknown): DropPrompt | null => {
  if (!isRecord(value)) return null;
  const name = typeof value.name === 'string' ? normalizeText(value.name) : '';
  const prompt = typeof value.prompt === 'string' ? value.prompt.trim() : '';
  if (!name || !prompt) return null;
  return {
    id: typeof value.id === 'string' && value.id.trim() ? value.id.trim() : createId('dp'),
    name,
    saveAs: typeof value.saveAs === 'string' ? value.saveAs.trim() || undefined : undefined,
    prompt,
    resolution: sanitizeResolution(value.resolution),
  };
};

const sanitizePromptInput = (value: DropPromptInput): DropPrompt | null => {
  const name = normalizeText(value.name);
  const prompt = value.prompt.trim();
  if (!name || !prompt) return null;
  return {
    id: createId('dp'),
    name,
    saveAs: value.saveAs?.trim() || undefined,
    prompt,
    resolution: value.resolution,
  };
};

const sanitizeItem = (value: unknown): Drop | null => {
  if (!isRecord(value)) return null;
  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const name = typeof value.name === 'string' ? normalizeText(value.name) : '';
  const recipeId = typeof value.recipeId === 'string' ? value.recipeId.trim() : '';
  if (!id || !name || !recipeId) return null;
  const createdAt = typeof value.createdAt === 'number' && Number.isFinite(value.createdAt)
    ? value.createdAt : Date.now();
  const updatedAt = typeof value.updatedAt === 'number' && Number.isFinite(value.updatedAt)
    ? value.updatedAt : createdAt;
  const rawPrompts = Array.isArray(value.prompts) ? value.prompts : [];
  return {
    id,
    name,
    recipeId,
    summary: typeof value.summary === 'string' ? normalizeText(value.summary) || undefined : undefined,
    notes: typeof value.notes === 'string' ? normalizeText(value.notes) || undefined : undefined,
    prompts: rawPrompts.map(sanitizePrompt).filter((p): p is DropPrompt => Boolean(p)),
    projectTags: sanitizeStringArray(value.projectTags),
    status: sanitizeStatus(value.status),
    createdAt,
    updatedAt,
  };
};

const writeItems = (items: Drop[]) => {
  const payload: DropStore = { version: 1, items: sortItems(items) };
  writeStorageItem(DROP_STORE_KEY, payload);
  writeStorageItem(DROP_STORE_BACKUP_KEY, payload);
};

const readItems = (): Drop[] => {
  const candidates = [
    parseJson(readStorageItem(DROP_STORE_KEY)),
    parseJson(readStorageItem(DROP_STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const raw = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.items) ? candidate.items : null);
    if (!raw) continue;
    const parsed = sortItems(
      raw.map(sanitizeItem).filter((i): i is Drop => Boolean(i))
    );
    if (parsed.length > 0 || raw.length === 0) return parsed;
  }

  return [];
};

const sanitizeInput = (input: DropInput) => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('Drop name is required.');
  const recipeId = input.recipeId.trim();
  if (!recipeId) throw new Error('Drop must reference a recipe.');
  const prompts = (input.prompts ?? [])
    .map(sanitizePromptInput)
    .filter((p): p is DropPrompt => Boolean(p));
  return {
    name,
    recipeId,
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    notes: input.notes ? normalizeText(input.notes) || undefined : undefined,
    prompts,
    projectTags: sanitizeStringArray(input.projectTags),
    status: sanitizeStatus(input.status),
  };
};

export async function listDrops(): Promise<Drop[]> {
  return readItems();
}

export async function getDrop(id: string): Promise<Drop | null> {
  const itemId = id.trim();
  if (!itemId) return null;
  return readItems().find(i => i.id === itemId) ?? null;
}

export async function createDrop(input: DropInput): Promise<Drop> {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: Drop = {
    id: createId('drop'),
    name: sanitized.name,
    recipeId: sanitized.recipeId,
    summary: sanitized.summary,
    notes: sanitized.notes,
    prompts: sanitized.prompts,
    projectTags: sanitized.projectTags,
    status: sanitized.status,
    createdAt: now,
    updatedAt: now,
  };
  const items = readItems();
  writeItems([...items, next]);
  return next;
}

export async function updateDrop(id: string, input: DropInput): Promise<Drop> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Drop id is required.');
  const sanitized = sanitizeInput(input);
  const items = readItems();
  const existing = items.find(i => i.id === itemId);
  if (!existing) throw new Error('Drop not found.');
  const updated: Drop = {
    ...existing,
    name: sanitized.name,
    recipeId: sanitized.recipeId,
    summary: sanitized.summary,
    notes: sanitized.notes,
    prompts: sanitized.prompts,
    projectTags: sanitized.projectTags,
    status: sanitized.status,
    updatedAt: Date.now(),
  };
  writeItems(items.map(i => (i.id === itemId ? updated : i)));
  return updated;
}

export async function deleteDrop(id: string): Promise<void> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Drop id is required.');
  const items = readItems();
  writeItems(items.filter(i => i.id !== itemId));
}
