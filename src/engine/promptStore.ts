import type { SavedPrompt, SavedPromptStore } from '../types';
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

const toSavedPrompt = (row: any): SavedPrompt => ({
  id: row.id,
  name: row.name,
  positive: row.positive,
  negative: row.negative ?? undefined,
  tags: row.tags ?? undefined,
  note: row.note ?? undefined,
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
  note?: string;
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
    note: input.note ? normalizeText(input.note) : null,
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
      note: prompt.note ? normalizeText(prompt.note) : null,
    }))
    .filter(prompt => !existingNames.has(prompt.name));

  if (sanitized.length > 0) {
    const { error } = await supabase.from('saved_prompts').insert(sanitized);
    if (error) throw error;
  }

  const merged = await listPrompts();
  return { version: 1, prompts: merged };
};
