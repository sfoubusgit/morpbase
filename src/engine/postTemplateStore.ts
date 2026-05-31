import type {
  PostTarget,
  PostTemplate,
  PostTemplateInput,
  PostTemplateStore,
} from '../types';

const POST_STORE_KEY = 'promptgen:post_templates:v1';
const POST_STORE_BACKUP_KEY = 'promptgen:post_templates:backup:v1';

const VALID_TARGETS: PostTarget[] = ['civitai', 'instagram', 'twitter', 'other'];

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

const sortItems = <T extends PostTemplate>(items: T[]): T[] =>
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

const sanitizeTarget = (value: unknown): PostTarget => {
  if (typeof value === 'string') {
    const trimmed = value.trim() as PostTarget;
    if ((VALID_TARGETS as string[]).includes(trimmed)) return trimmed;
  }
  return 'other';
};

const sanitizeItem = (value: unknown): PostTemplate | null => {
  if (!isRecord(value)) return null;
  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const name = typeof value.name === 'string' ? normalizeText(value.name) : '';
  const body = typeof value.body === 'string' ? value.body : '';
  if (!id || !name || !body.trim()) return null;
  const createdAt = typeof value.createdAt === 'number' && Number.isFinite(value.createdAt)
    ? value.createdAt : Date.now();
  const updatedAt = typeof value.updatedAt === 'number' && Number.isFinite(value.updatedAt)
    ? value.updatedAt : createdAt;
  return {
    id,
    name,
    target: sanitizeTarget(value.target),
    summary: typeof value.summary === 'string' ? normalizeText(value.summary) || undefined : undefined,
    notes: typeof value.notes === 'string' ? normalizeText(value.notes) || undefined : undefined,
    body,
    createdAt,
    updatedAt,
  };
};

const writeItems = (items: PostTemplate[]) => {
  const payload: PostTemplateStore = { version: 1, items: sortItems(items) };
  writeStorageItem(POST_STORE_KEY, payload);
  writeStorageItem(POST_STORE_BACKUP_KEY, payload);
};

const readItems = (): PostTemplate[] => {
  const candidates = [
    parseJson(readStorageItem(POST_STORE_KEY)),
    parseJson(readStorageItem(POST_STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const raw = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.items) ? candidate.items : null);
    if (!raw) continue;
    const parsed = sortItems(
      raw.map(sanitizeItem).filter((i): i is PostTemplate => Boolean(i))
    );
    if (parsed.length > 0 || raw.length === 0) return parsed;
  }

  return [];
};

const sanitizeInput = (input: PostTemplateInput): PostTemplateInput => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('Post template name is required.');
  const body = input.body;
  if (!body || !body.trim()) throw new Error('Post template body is required.');
  return {
    name,
    target: sanitizeTarget(input.target),
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    notes: input.notes ? normalizeText(input.notes) || undefined : undefined,
    body,
  };
};

export async function listPostTemplates(): Promise<PostTemplate[]> {
  return readItems();
}

export async function getPostTemplate(id: string): Promise<PostTemplate | null> {
  const itemId = id.trim();
  if (!itemId) return null;
  return readItems().find(i => i.id === itemId) ?? null;
}

export async function createPostTemplate(input: PostTemplateInput): Promise<PostTemplate> {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: PostTemplate = {
    id: createId('post'),
    name: sanitized.name,
    target: sanitized.target,
    summary: sanitized.summary,
    notes: sanitized.notes,
    body: sanitized.body,
    createdAt: now,
    updatedAt: now,
  };
  const items = readItems();
  writeItems([...items, next]);
  return next;
}

export async function updatePostTemplate(id: string, input: PostTemplateInput): Promise<PostTemplate> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Post template id is required.');
  const sanitized = sanitizeInput(input);
  const items = readItems();
  const existing = items.find(i => i.id === itemId);
  if (!existing) throw new Error('Post template not found.');
  const updated: PostTemplate = {
    ...existing,
    name: sanitized.name,
    target: sanitized.target,
    summary: sanitized.summary,
    notes: sanitized.notes,
    body: sanitized.body,
    updatedAt: Date.now(),
  };
  writeItems(items.map(i => (i.id === itemId ? updated : i)));
  return updated;
}

export async function deletePostTemplate(id: string): Promise<void> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Post template id is required.');
  const items = readItems();
  writeItems(items.filter(i => i.id !== itemId));
}
