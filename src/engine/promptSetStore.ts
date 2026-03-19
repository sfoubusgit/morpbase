import type { PromptSet } from '../types';

const PROMPT_SETS_STORAGE_KEY = 'promptgen:prompt_sets:v1';
const PROMPT_SET_ASSIGNMENTS_STORAGE_KEY = 'promptgen:prompt_set_assignments:v1';

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
};

const normalizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

export const listPromptSets = async (): Promise<PromptSet[]> => {
  const parsed = readJson<{ sets?: PromptSet[] }>(PROMPT_SETS_STORAGE_KEY, { sets: [] });
  return Array.isArray(parsed.sets) ? parsed.sets : [];
};

export const createPromptSet = async (input: {
  name: string;
  description?: string;
}): Promise<PromptSet> => {
  const name = normalizeText(input.name);
  if (!name) {
    throw new Error('Prompt Set name cannot be empty.');
  }

  const existing = await listPromptSets();
  const normalizedExistingNames = new Set(existing.map(set => set.name.toLowerCase()));
  if (normalizedExistingNames.has(name.toLowerCase())) {
    throw new Error('A Prompt Set with that name already exists.');
  }

  const now = Date.now();
  const nextSet: PromptSet = {
    id: `prompt_set_${now}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    description: input.description ? normalizeText(input.description) : undefined,
    createdAt: now,
    updatedAt: now,
  };

  writeJson(PROMPT_SETS_STORAGE_KEY, {
    sets: [nextSet, ...existing],
  });

  return nextSet;
};

export const updatePromptSet = async (
  setId: string,
  patch: { name?: string; description?: string }
): Promise<PromptSet> => {
  const existing = await listPromptSets();
  const target = existing.find(set => set.id === setId);
  if (!target) {
    throw new Error('Prompt Set not found.');
  }

  const nextName = patch.name !== undefined ? normalizeText(patch.name) : target.name;
  if (!nextName) {
    throw new Error('Prompt Set name cannot be empty.');
  }

  const normalizedExistingNames = new Set(
    existing
      .filter(set => set.id !== setId)
      .map(set => set.name.toLowerCase())
  );
  if (normalizedExistingNames.has(nextName.toLowerCase())) {
    throw new Error('A Prompt Set with that name already exists.');
  }

  const next: PromptSet = {
    ...target,
    name: nextName,
    description: patch.description !== undefined
      ? (normalizeText(patch.description) || undefined)
      : target.description,
    updatedAt: Date.now(),
  };

  writeJson(PROMPT_SETS_STORAGE_KEY, {
    sets: existing.map(set => (set.id === setId ? next : set)),
  });

  return next;
};

export const deletePromptSet = async (setId: string): Promise<void> => {
  const existing = await listPromptSets();
  writeJson(PROMPT_SETS_STORAGE_KEY, {
    sets: existing.filter(set => set.id !== setId),
  });

  const assignments = readJson<Record<string, string | null>>(PROMPT_SET_ASSIGNMENTS_STORAGE_KEY, {});
  const nextAssignments: Record<string, string | null> = {};
  Object.entries(assignments).forEach(([promptId, assignedSetId]) => {
    if (assignedSetId !== setId) {
      nextAssignments[promptId] = assignedSetId;
    }
  });
  writeJson(PROMPT_SET_ASSIGNMENTS_STORAGE_KEY, nextAssignments);
};

export const listPromptSetAssignments = async (): Promise<Record<string, string | null>> =>
  readJson<Record<string, string | null>>(PROMPT_SET_ASSIGNMENTS_STORAGE_KEY, {});

export const assignPromptToSet = async (promptId: string, setId: string | null): Promise<void> => {
  const assignments = await listPromptSetAssignments();
  const nextAssignments = { ...assignments };
  if (!setId) {
    delete nextAssignments[promptId];
  } else {
    nextAssignments[promptId] = setId;
  }
  writeJson(PROMPT_SET_ASSIGNMENTS_STORAGE_KEY, nextAssignments);
};
