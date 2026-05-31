import type {
  LoraModelFamily,
  WorkflowTemplate,
  WorkflowTemplateInput,
  WorkflowTemplateStore,
} from '../types';

const TEMPLATE_STORE_KEY = 'promptgen:workflow_templates:v1';
const TEMPLATE_STORE_BACKUP_KEY = 'promptgen:workflow_templates:backup:v1';

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

const sortItems = <T extends WorkflowTemplate>(items: T[]): T[] =>
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

const sanitizeFamily = (value: unknown): LoraModelFamily => {
  if (typeof value === 'string') {
    const trimmed = value.trim() as LoraModelFamily;
    if ((VALID_FAMILIES as string[]).includes(trimmed)) return trimmed;
  }
  return 'other';
};

const sanitizeItem = (value: unknown): WorkflowTemplate | null => {
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
    modelFamily: sanitizeFamily(value.modelFamily),
    summary: typeof value.summary === 'string' ? normalizeText(value.summary) || undefined : undefined,
    notes: typeof value.notes === 'string' ? normalizeText(value.notes) || undefined : undefined,
    body,
    createdAt,
    updatedAt,
  };
};

const writeItems = (items: WorkflowTemplate[]) => {
  const payload: WorkflowTemplateStore = { version: 1, items: sortItems(items) };
  writeStorageItem(TEMPLATE_STORE_KEY, payload);
  writeStorageItem(TEMPLATE_STORE_BACKUP_KEY, payload);
};

const readItems = (): WorkflowTemplate[] => {
  const candidates = [
    parseJson(readStorageItem(TEMPLATE_STORE_KEY)),
    parseJson(readStorageItem(TEMPLATE_STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const raw = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.items) ? candidate.items : null);
    if (!raw) continue;
    const parsed = sortItems(
      raw.map(sanitizeItem).filter((i): i is WorkflowTemplate => Boolean(i))
    );
    if (parsed.length > 0 || raw.length === 0) return parsed;
  }

  return [];
};

const sanitizeInput = (input: WorkflowTemplateInput): WorkflowTemplateInput => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('Template name is required.');
  const body = input.body;
  if (!body || !body.trim()) throw new Error('Template body is required.');
  return {
    name,
    modelFamily: sanitizeFamily(input.modelFamily),
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    notes: input.notes ? normalizeText(input.notes) || undefined : undefined,
    body,
  };
};

export async function listWorkflowTemplates(): Promise<WorkflowTemplate[]> {
  return readItems();
}

export async function getWorkflowTemplate(id: string): Promise<WorkflowTemplate | null> {
  const itemId = id.trim();
  if (!itemId) return null;
  return readItems().find(i => i.id === itemId) ?? null;
}

export async function createWorkflowTemplate(input: WorkflowTemplateInput): Promise<WorkflowTemplate> {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: WorkflowTemplate = {
    id: createId('wftpl'),
    name: sanitized.name,
    modelFamily: sanitized.modelFamily,
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

export async function updateWorkflowTemplate(id: string, input: WorkflowTemplateInput): Promise<WorkflowTemplate> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Template id is required.');
  const sanitized = sanitizeInput(input);
  const items = readItems();
  const existing = items.find(i => i.id === itemId);
  if (!existing) throw new Error('Template not found.');
  const updated: WorkflowTemplate = {
    ...existing,
    name: sanitized.name,
    modelFamily: sanitized.modelFamily,
    summary: sanitized.summary,
    notes: sanitized.notes,
    body: sanitized.body,
    updatedAt: Date.now(),
  };
  writeItems(items.map(i => (i.id === itemId ? updated : i)));
  return updated;
}

export async function deleteWorkflowTemplate(id: string): Promise<void> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Template id is required.');
  const items = readItems();
  writeItems(items.filter(i => i.id !== itemId));
}
