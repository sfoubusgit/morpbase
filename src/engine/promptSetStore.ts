import type { PromptSet } from '../types';
import { getProfile } from './authStore';
import { supabase } from './supabaseClient';

const PROMPT_SETS_STORAGE_KEY = 'promptgen:prompt_sets:v1';
const PROMPT_SETS_BACKUP_STORAGE_KEY = 'promptgen:prompt_sets:backup:v1';
const PROMPT_SET_ASSIGNMENTS_STORAGE_KEY = 'promptgen:prompt_set_assignments:v1';
const PROMPT_SET_ASSIGNMENTS_BACKUP_STORAGE_KEY = 'promptgen:prompt_set_assignments:backup:v1';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type PromptSetScope = 'local' | 'cloud';

type StoredPromptSet = PromptSet & {
  scope?: PromptSetScope;
};

type PromptSetState = {
  sets: PromptSet[];
  assignments: Record<string, string | null>;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const sortPromptSets = <T extends PromptSet>(sets: T[]): T[] =>
  [...sets].sort((left, right) => {
    if (right.updatedAt !== left.updatedAt) {
      return right.updatedAt - left.updatedAt;
    }
    if (right.createdAt !== left.createdAt) {
      return right.createdAt - left.createdAt;
    }
    return left.name.localeCompare(right.name);
  });

const toPublicPromptSet = (set: StoredPromptSet): PromptSet => ({
  id: set.id,
  name: set.name,
  description: set.description,
  createdAt: set.createdAt,
  updatedAt: set.updatedAt,
});

const toStoredPromptSet = (row: any): StoredPromptSet => ({
  id: row.id,
  name: row.name,
  description: row.description ?? undefined,
  createdAt: new Date(row.created_at).getTime(),
  updatedAt: new Date(row.updated_at).getTime(),
  scope: 'cloud',
});

const parseJson = (raw: string | null): unknown => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const readStorageItem = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const sanitizeStoredPromptSet = (value: unknown): StoredPromptSet | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const name = typeof value.name === 'string' ? normalizeText(value.name) : '';
  if (!id || !name) {
    return null;
  }

  const createdAt = typeof value.createdAt === 'number' && Number.isFinite(value.createdAt)
    ? value.createdAt
    : Date.now();
  const updatedAt = typeof value.updatedAt === 'number' && Number.isFinite(value.updatedAt)
    ? value.updatedAt
    : createdAt;
  const description = typeof value.description === 'string'
    ? (normalizeText(value.description) || undefined)
    : undefined;

  return {
    id,
    name,
    description,
    createdAt,
    updatedAt,
    scope: value.scope === 'cloud' ? 'cloud' : 'local',
  };
};

const readStoredPromptSets = (): StoredPromptSet[] => {
  const candidates = [
    parseJson(readStorageItem(PROMPT_SETS_STORAGE_KEY)),
    parseJson(readStorageItem(PROMPT_SETS_BACKUP_STORAGE_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) {
      continue;
    }

    const rawSets = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.sets) ? candidate.sets : null);
    if (!rawSets) {
      continue;
    }

    const parsed = sortPromptSets(
      rawSets
        .map(sanitizeStoredPromptSet)
        .filter((set): set is StoredPromptSet => Boolean(set))
    );

    if (parsed.length > 0 || rawSets.length === 0) {
      return parsed;
    }
  }

  return [];
};

const readPromptSetAssignmentsFromStorage = (): Record<string, string | null> => {
  const candidates = [
    parseJson(readStorageItem(PROMPT_SET_ASSIGNMENTS_STORAGE_KEY)),
    parseJson(readStorageItem(PROMPT_SET_ASSIGNMENTS_BACKUP_STORAGE_KEY)),
  ];

  for (const candidate of candidates) {
    if (!isRecord(candidate)) {
      continue;
    }

    const assignments: Record<string, string | null> = {};
    Object.entries(candidate).forEach(([promptId, setId]) => {
      if (typeof setId === 'string') {
        const trimmed = setId.trim();
        if (trimmed) {
          assignments[promptId] = trimmed;
        }
        return;
      }
      if (setId === null) {
        assignments[promptId] = null;
      }
    });
    return assignments;
  }

  return {};
};

const writeJson = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
};

const removeStorageItem = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
};

const writePromptSetAssignments = (assignments: Record<string, string | null>) => {
  const normalized: Record<string, string | null> = {};
  Object.entries(assignments).forEach(([promptId, setId]) => {
    if (!setId) {
      return;
    }
    normalized[promptId] = setId;
  });
  writeJson(PROMPT_SET_ASSIGNMENTS_STORAGE_KEY, normalized);
  writeJson(PROMPT_SET_ASSIGNMENTS_BACKUP_STORAGE_KEY, normalized);
};

const getSafeProfile = async () => {
  try {
    return await getProfile();
  } catch {
    return null;
  }
};

const clearLegacyPromptSetStorage = () => {
  removeStorageItem(PROMPT_SETS_STORAGE_KEY);
  removeStorageItem(PROMPT_SETS_BACKUP_STORAGE_KEY);
};

const isRecoverablePromptSetCloudError = (error: any): boolean => {
  const code = typeof error?.code === 'string' ? error.code : '';
  const message = [
    typeof error?.message === 'string' ? error.message : '',
    typeof error?.details === 'string' ? error.details : '',
    typeof error?.hint === 'string' ? error.hint : '',
  ]
    .join(' ')
    .toLowerCase();

  return (
    code === '42P01' ||
    code === '42703' ||
    code === 'PGRST204' ||
    code === 'PGRST205' ||
    message.includes('prompt_sets') ||
    message.includes('prompt_set_id') ||
    message.includes('schema cache')
  );
};

const mergeStoredPromptSets = (
  localSets: StoredPromptSet[],
  cloudSets: StoredPromptSet[]
): StoredPromptSet[] => {
  const merged = new Map<string, StoredPromptSet>();

  localSets
    .filter(set => set.scope !== 'cloud')
    .forEach(set => {
      merged.set(set.id, { ...set, scope: set.scope ?? 'local' });
    });

  cloudSets.forEach(set => {
    merged.set(set.id, { ...set, scope: 'cloud' });
  });

  return sortPromptSets(Array.from(merged.values()));
};

const mergeAssignments = (
  localAssignments: Record<string, string | null>,
  cloudAssignments: Record<string, string | null>
): Record<string, string | null> => {
  const merged: Record<string, string | null> = { ...localAssignments };
  Object.entries(cloudAssignments).forEach(([promptId, setId]) => {
    if (!setId) {
      delete merged[promptId];
      return;
    }
    merged[promptId] = setId;
  });
  return merged;
};

const pruneAssignmentsForAvailableSets = (
  assignments: Record<string, string | null>,
  availableSetIds: Set<string>
): Record<string, string | null> => {
  const nextAssignments: Record<string, string | null> = {};
  Object.entries(assignments).forEach(([promptId, setId]) => {
    if (setId && availableSetIds.has(setId)) {
      nextAssignments[promptId] = setId;
    }
  });
  return nextAssignments;
};

const fetchCloudPromptSets = async (userId: string): Promise<StoredPromptSet[]> => {
  const { data, error } = await supabase
    .from('prompt_sets')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return sortPromptSets((data ?? []).map(toStoredPromptSet));
};

const syncLegacyPromptSetsToCloud = async (
  userId: string,
  localSets: StoredPromptSet[]
): Promise<StoredPromptSet[]> => {
  const syncCandidates = localSets.filter(set => set.scope !== 'cloud');
  if (syncCandidates.length === 0) {
    return [];
  }

  const payload = syncCandidates.map(set => ({
    id: set.id,
    user_id: userId,
    name: set.name,
    description: set.description ?? null,
    created_at: new Date(set.createdAt).toISOString(),
    updated_at: new Date(set.updatedAt).toISOString(),
    deleted_at: null,
  }));

  const { error } = await supabase
    .from('prompt_sets')
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    throw error;
  }

  return syncCandidates.map(set => ({ ...set, scope: 'cloud' as const }));
};

const syncCachedCloudAssignments = async (
  userId: string,
  localAssignments: Record<string, string | null>,
  availableSetIds: Set<string>
): Promise<Record<string, string | null>> => {
  const { data, error } = await supabase
    .from('saved_prompts')
    .select('id, prompt_set_id')
    .eq('user_id', userId)
    .is('deleted_at', null);

  if (error) {
    throw error;
  }

  const rows = data ?? [];
  const updates = rows
    .map(row => {
      const promptId = row.id as string;
      const remoteSetId = typeof row.prompt_set_id === 'string' ? row.prompt_set_id : null;
      const localSetId = Object.prototype.hasOwnProperty.call(localAssignments, promptId)
        ? localAssignments[promptId]
        : undefined;

      const desiredSetId = localSetId === undefined
        ? remoteSetId
        : (localSetId && availableSetIds.has(localSetId) ? localSetId : null);

      return {
        promptId,
        remoteSetId,
        desiredSetId,
      };
    })
    .filter(entry => entry.desiredSetId !== entry.remoteSetId);

  const updateResults = await Promise.all(
    updates.map(entry =>
      supabase
        .from('saved_prompts')
        .update({ prompt_set_id: entry.desiredSetId })
        .eq('id', entry.promptId)
        .eq('user_id', userId)
    )
  );

  const firstError = updateResults.find(result => result.error)?.error;
  if (firstError) {
    throw firstError;
  }

  const nextAssignments: Record<string, string | null> = {};
  rows.forEach(row => {
    const promptId = row.id as string;
    const localSetId = Object.prototype.hasOwnProperty.call(localAssignments, promptId)
      ? localAssignments[promptId]
      : undefined;
    const desiredSetId = localSetId === undefined
      ? (typeof row.prompt_set_id === 'string' ? row.prompt_set_id : null)
      : (localSetId && availableSetIds.has(localSetId) ? localSetId : null);
    nextAssignments[promptId] = desiredSetId;
  });

  return nextAssignments;
};

const removeAssignmentsForSet = (setId: string) => {
  const assignments = readPromptSetAssignmentsFromStorage();
  const nextAssignments: Record<string, string | null> = {};
  Object.entries(assignments).forEach(([promptId, assignedSetId]) => {
    if (assignedSetId && assignedSetId !== setId) {
      nextAssignments[promptId] = assignedSetId;
    }
  });
  writePromptSetAssignments(nextAssignments);
  return nextAssignments;
};

const updateLocalAssignment = (promptId: string, setId: string | null) => {
  const assignments = readPromptSetAssignmentsFromStorage();
  const nextAssignments = { ...assignments };
  if (!setId) {
    delete nextAssignments[promptId];
  } else {
    nextAssignments[promptId] = setId;
  }
  writePromptSetAssignments(nextAssignments);
  return nextAssignments;
};

export const loadPromptSetState = async (): Promise<PromptSetState> => {
  const profile = await getSafeProfile();

  if (!profile) {
    return {
      sets: [],
      assignments: {},
    };
  }

  const legacySets = readStoredPromptSets();

  try {
    if (legacySets.length > 0) {
      await syncLegacyPromptSetsToCloud(profile.id, legacySets);
    }

    const cloudSets = sortPromptSets(await fetchCloudPromptSets(profile.id));
    if (legacySets.length > 0) {
      clearLegacyPromptSetStorage();
    }

    const availableSetIds = new Set(cloudSets.map(set => set.id));
    const localAssignments = pruneAssignmentsForAvailableSets(
      readPromptSetAssignmentsFromStorage(),
      availableSetIds
    );
    const cloudAssignments = await syncCachedCloudAssignments(
      profile.id,
      localAssignments,
      availableSetIds
    );
    const mergedAssignments = pruneAssignmentsForAvailableSets(
      mergeAssignments(localAssignments, cloudAssignments),
      availableSetIds
    );

    writePromptSetAssignments(mergedAssignments);

    return {
      sets: cloudSets.map(toPublicPromptSet),
      assignments: mergedAssignments,
    };
  } catch (error) {
    if (!isRecoverablePromptSetCloudError(error)) {
      console.warn('Prompt Set cloud sync failed.', error);
    }
    return {
      sets: [],
      assignments: {},
    };
  }
};

export const listPromptSets = async (): Promise<PromptSet[]> => {
  const state = await loadPromptSetState();
  return state.sets;
};

export const listPromptSetAssignments = async (): Promise<Record<string, string | null>> => {
  const state = await loadPromptSetState();
  return state.assignments;
};

export const createPromptSet = async (input: {
  name: string;
  description?: string;
}): Promise<PromptSet> => {
  const profile = await getProfile();
  if (!profile) {
    throw new Error('Log in to use Prompt Sets.');
  }

  const name = normalizeText(input.name);
  if (!name) {
    throw new Error('Prompt Set name cannot be empty.');
  }

  const state = await loadPromptSetState();
  const normalizedExistingNames = new Set(state.sets.map(set => set.name.toLowerCase()));
  if (normalizedExistingNames.has(name.toLowerCase())) {
    throw new Error('A Prompt Set with that name already exists.');
  }

  const now = Date.now();
  const nextSet: StoredPromptSet = {
    id: `prompt_set_${now}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    description: input.description ? normalizeText(input.description) || undefined : undefined,
    createdAt: now,
    updatedAt: now,
    scope: 'local',
  };

  const { data, error } = await supabase
    .from('prompt_sets')
    .insert({
      id: nextSet.id,
      user_id: profile.id,
      name: nextSet.name,
      description: nextSet.description ?? null,
      created_at: new Date(nextSet.createdAt).toISOString(),
      updated_at: new Date(nextSet.updatedAt).toISOString(),
      deleted_at: null,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return toPublicPromptSet(toStoredPromptSet(data));
};

export const updatePromptSet = async (
  setId: string,
  patch: { name?: string; description?: string }
): Promise<PromptSet> => {
  const profile = await getProfile();
  if (!profile) {
    throw new Error('Log in to use Prompt Sets.');
  }

  const state = await loadPromptSetState();
  const target = state.sets.find(set => set.id === setId);
  if (!target) {
    throw new Error('Prompt Set not found.');
  }

  const nextName = patch.name !== undefined ? normalizeText(patch.name) : target.name;
  if (!nextName) {
    throw new Error('Prompt Set name cannot be empty.');
  }

  const normalizedExistingNames = new Set(
    state.sets
      .filter(set => set.id !== setId)
      .map(set => set.name.toLowerCase())
  );
  if (normalizedExistingNames.has(nextName.toLowerCase())) {
    throw new Error('A Prompt Set with that name already exists.');
  }

  const nextSet: PromptSet = {
    ...target,
    name: nextName,
    description: patch.description !== undefined
      ? (normalizeText(patch.description) || undefined)
      : target.description,
    updatedAt: Date.now(),
  };

  const { data, error } = await supabase
    .from('prompt_sets')
    .update({
      name: nextSet.name,
      description: nextSet.description ?? null,
      updated_at: new Date(nextSet.updatedAt).toISOString(),
    })
    .eq('id', setId)
    .eq('user_id', profile.id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return toPublicPromptSet(toStoredPromptSet(data));
};

export const deletePromptSet = async (setId: string): Promise<void> => {
  const profile = await getProfile();
  if (!profile) {
    throw new Error('Log in to use Prompt Sets.');
  }

  const deletedAt = new Date().toISOString();
  const [{ error: setError }, { error: promptError }] = await Promise.all([
    supabase
      .from('prompt_sets')
      .update({ deleted_at: deletedAt })
      .eq('id', setId)
      .eq('user_id', profile.id),
    supabase
      .from('saved_prompts')
      .update({ prompt_set_id: null })
      .eq('user_id', profile.id)
      .eq('prompt_set_id', setId),
  ]);

  if (setError) {
    throw setError;
  }
  if (promptError) {
    throw promptError;
  }

  removeAssignmentsForSet(setId);
};

export const assignPromptToSet = async (promptId: string, setId: string | null): Promise<void> => {
  updateLocalAssignment(promptId, setId);

  if (!UUID_PATTERN.test(promptId)) {
    return;
  }

  const profile = await getSafeProfile();
  if (!profile) {
    return;
  }

  try {
    const { error } = await supabase
      .from('saved_prompts')
      .update({ prompt_set_id: setId })
      .eq('id', promptId)
      .eq('user_id', profile.id);

    if (error) {
      throw error;
    }
  } catch (error) {
    if (!isRecoverablePromptSetCloudError(error)) {
      console.warn('Prompt Set cloud assignment failed. Local assignment was kept.', error);
    }
  }
};
