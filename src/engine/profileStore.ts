import type { PublicProfile } from '../types';
import { supabase } from './supabaseClient';
import { getProfile } from './authStore';

const toPublicProfile = (row: any): PublicProfile => ({
  id: row.id,
  userId: row.user_id,
  displayName: row.display_name,
  bio: row.bio ?? null,
  avatarUrl: row.avatar_url ?? null,
  avatarStoragePath: row.avatar_storage_path ?? null,
  links: row.links ?? null,
  tags: row.tags ?? null,
  showPublicPrompts: row.show_public_prompts ?? null,
  showPublicPools: row.show_public_pools ?? null,
  discoverableInSearch: row.discoverable_in_search ?? null,
  showLinksPublicly: row.show_links_publicly ?? null,
  createdAt: new Date(row.created_at).getTime(),
  updatedAt: new Date(row.updated_at).getTime(),
});

export const listPublicProfiles = async (): Promise<PublicProfile[]> => {
  const { data, error } = await supabase
    .from('public_profiles')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toPublicProfile);
};

export const getMyPublicProfile = async (): Promise<PublicProfile | null> => {
  const profile = await getProfile();
  if (!profile) return null;
  const { data, error } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('user_id', profile.id)
    .maybeSingle();
  if (error) throw error;
  return data ? toPublicProfile(data) : null;
};

export const getPublicProfileByUserId = async (userId: string): Promise<PublicProfile | null> => {
  const { data, error } = await supabase
    .from('public_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data ? toPublicProfile(data) : null;
};

export const searchPublicProfiles = async (input: {
  query?: string;
  tags?: string[];
  discoverableOnly?: boolean;
} = {}): Promise<PublicProfile[]> => {
  let query = supabase
    .from('public_profiles')
    .select('*')
    .order('updated_at', { ascending: false });

  if (input.discoverableOnly !== false) {
    query = query.eq('discoverable_in_search', true);
  }

  const normalizedQuery = input.query?.trim();
  if (normalizedQuery) {
    query = query.or(`display_name.ilike.%${normalizedQuery}%,bio.ilike.%${normalizedQuery}%`);
  }

  const normalizedTags = input.tags?.map(tag => tag.trim()).filter(Boolean) ?? [];
  if (normalizedTags.length > 0) {
    query = query.overlaps('tags', normalizedTags);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toPublicProfile);
};

export const upsertMyPublicProfile = async (input: {
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  avatarStoragePath?: string | null;
  links?: Record<string, string> | null;
  tags?: string[] | null;
  showPublicPrompts?: boolean | null;
  showPublicPools?: boolean | null;
  discoverableInSearch?: boolean | null;
  showLinksPublicly?: boolean | null;
}): Promise<PublicProfile> => {
  const profile = await getProfile();
  if (!profile) throw new Error('You must be logged in.');
  const payload = {
    user_id: profile.id,
    display_name: input.displayName.trim(),
    bio: input.bio?.trim() || null,
    avatar_url: input.avatarUrl?.trim() || null,
    avatar_storage_path: input.avatarStoragePath?.trim() || null,
    links: input.links ?? null,
    tags: input.tags ?? null,
    show_public_prompts: input.showPublicPrompts ?? null,
    show_public_pools: input.showPublicPools ?? null,
    discoverable_in_search: input.discoverableInSearch ?? null,
    show_links_publicly: input.showLinksPublicly ?? null,
  };
  const { data, error } = await supabase
    .from('public_profiles')
    .upsert(payload, { onConflict: 'user_id' })
    .select('*')
    .single();
  if (error) throw error;
  return toPublicProfile(data);
};
