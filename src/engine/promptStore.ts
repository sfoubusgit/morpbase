import type { SavedPrompt, SavedPromptCharacterLineage, SavedPromptStore } from '../types';
import { supabase } from './supabaseClient';
import { getProfile } from './authStore';

const normalizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const requireProfileId = async (): Promise<string> => {
  const profile = await getProfile();
  if (!profile) {
    throw new Error('You must be logged in.');
  }
  return profile.id;
};

const toSavedPromptCharacterLineage = (row: any): SavedPromptCharacterLineage | undefined => {
  const characterId = typeof row?.character_id === 'string'
    ? normalizeText(row.character_id)
    : '';
  const nameSnapshot = typeof row?.character_name_snapshot === 'string'
    ? normalizeText(row.character_name_snapshot)
    : '';

  if (!characterId || !nameSnapshot) {
    return undefined;
  }

  return {
    characterId,
    nameSnapshot,
  };
};

const toStoredCharacterLineage = (
  lineage?: SavedPromptCharacterLineage
): { character_id: string | null; character_name_snapshot: string | null } => {
  const characterId = typeof lineage?.characterId === 'string'
    ? normalizeText(lineage.characterId)
    : '';
  const nameSnapshot = typeof lineage?.nameSnapshot === 'string'
    ? normalizeText(lineage.nameSnapshot)
    : '';

  if (!characterId || !nameSnapshot) {
    return {
      character_id: null,
      character_name_snapshot: null,
    };
  }

  return {
    character_id: characterId,
    character_name_snapshot: nameSnapshot,
  };
};

const toSavedPrompt = (row: any): SavedPrompt => ({
  id: row.id,
  name: row.name,
  positive: row.positive,
  negative: row.negative ?? undefined,
  tags: row.tags ?? undefined,
  model: row.model ?? undefined,
  purpose: row.purpose ?? undefined,
  usedAt: row.used_at ?? undefined,
  note: row.note ?? undefined,
  characterLineage: toSavedPromptCharacterLineage(row),
  createdAt: new Date(row.created_at).getTime(),
  updatedAt: new Date(row.updated_at).getTime(),
});

export const listPrompts = async (): Promise<SavedPrompt[]> => {
  const userId = await requireProfileId();
  const { data, error } = await supabase
    .from('saved_prompts')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toSavedPrompt);
};

export const createPrompt = async (input: {
  name: string;
  positive: string;
  negative?: string;
  tags?: string[];
  model?: string;
  purpose?: string;
  usedAt?: string;
  note?: string;
  characterLineage?: SavedPromptCharacterLineage;
}): Promise<SavedPrompt> => {
  const name = normalizeText(input.name);
  const positive = normalizeText(input.positive);
  if (!name) {
    throw new Error('Prompt name cannot be empty.');
  }
  if (!positive) {
    throw new Error('Prompt text cannot be empty.');
  }
  const userId = await requireProfileId();
  const payload = {
    user_id: userId,
    name,
    positive,
    negative: input.negative ? normalizeText(input.negative) : null,
    tags: input.tags?.map(normalizeText).filter(Boolean) ?? null,
    model: input.model ? normalizeText(input.model) : null,
    purpose: input.purpose ? normalizeText(input.purpose) : null,
    used_at: input.usedAt ? normalizeText(input.usedAt) : new Date().toISOString(),
    note: input.note ? normalizeText(input.note) : null,
    ...toStoredCharacterLineage(input.characterLineage),
  };
  const { data, error } = await supabase
    .from('saved_prompts')
    .insert(payload)
    .select('*')
    .single();
  if (error) throw error;
  return toSavedPrompt(data);
};

export const deletePrompt = async (promptId: string): Promise<void> => {
  const { error } = await supabase
    .from('saved_prompts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', promptId);
  if (error) throw error;
};

export const listPublicPromptsByUser = async (userId: string): Promise<SavedPrompt[]> => {
  const { data, error } = await supabase
    .from('saved_prompts')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toSavedPrompt);
};

export const exportPromptsPayload = async (): Promise<SavedPromptStore> => {
  const prompts = await listPrompts();
  return { version: 1, prompts };
};

export const importPromptsPayload = async (payload: SavedPromptStore): Promise<SavedPromptStore> => {
  if (!payload || payload.version !== 1 || !Array.isArray(payload.prompts)) {
    throw new Error('Invalid prompts payload.');
  }
  const userId = await requireProfileId();
  const existing = await listPrompts();
  const existingNames = new Set(existing.map(prompt => prompt.name));
  const sanitized = payload.prompts
    .filter(prompt => prompt && prompt.name && prompt.positive)
    .map(prompt => ({
      user_id: userId,
      name: normalizeText(prompt.name),
      positive: normalizeText(prompt.positive),
      negative: prompt.negative ? normalizeText(prompt.negative) : null,
      tags: prompt.tags?.map(normalizeText).filter(Boolean) ?? null,
      model: prompt.model ? normalizeText(prompt.model) : null,
      purpose: prompt.purpose ? normalizeText(prompt.purpose) : null,
      used_at: prompt.usedAt ? normalizeText(prompt.usedAt) : null,
      note: prompt.note ? normalizeText(prompt.note) : null,
      ...toStoredCharacterLineage(prompt.characterLineage),
    }))
    .filter(prompt => !existingNames.has(prompt.name));

  if (sanitized.length > 0) {
    const { error } = await supabase.from('saved_prompts').insert(sanitized);
    if (error) throw error;
  }

  const merged = await listPrompts();
  return { version: 1, prompts: merged };
};
