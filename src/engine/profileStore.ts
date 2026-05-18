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
  coverImageUrl: row.cover_image_url ?? null,
  coverStoragePath: row.cover_storage_path ?? null,
  links: row.links ?? null,
  tags: row.tags ?? null,
  showPublicPrompts: row.show_public_prompts ?? null,
  showPublicPools: row.show_public_pools ?? null,
  discoverableInSearch: row.discoverable_in_search ?? null,
  showLinksPublicly: row.show_links_publicly ?? null,
  featuredBadgeIds: Array.isArray(row.featured_badge_ids) ? row.featured_badge_ids : [],
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

export const getPublicProfileByAuthUid = async (authUid: string): Promise<PublicProfile | null> => {
  try {
    const { data: userRow } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('auth_uid', authUid)
      .maybeSingle();
    if (!userRow) return null;
    return getPublicProfileByUserId(userRow.id);
  } catch {
    return null;
  }
};

const AVATAR_BUCKET = 'avatars';
const COVER_BUCKET = 'covers';

export const uploadAvatar = async (
  authUid: string,
  file: File,
): Promise<{ storagePath: string; publicUrl: string }> => {
  const ext = (file.name.split('.').pop() ?? 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
  const storagePath = `${authUid}/avatar-${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });
  if (uploadError) throw new Error(uploadError.message);
  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(storagePath);
  return { storagePath, publicUrl: data.publicUrl };
};

export const deleteAvatarFile = async (storagePath: string | null | undefined): Promise<void> => {
  if (!storagePath) return;
  try { await supabase.storage.from(AVATAR_BUCKET).remove([storagePath]); } catch { /* non-fatal */ }
};

export const uploadCover = async (
  authUid: string,
  file: File,
): Promise<{ storagePath: string; publicUrl: string }> => {
  const ext = (file.name.split('.').pop() ?? 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
  const storagePath = `${authUid}/cover-${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from(COVER_BUCKET)
    .upload(storagePath, file, { contentType: file.type, upsert: false });
  if (uploadError) throw new Error(uploadError.message);
  const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(storagePath);
  return { storagePath, publicUrl: data.publicUrl };
};

export const deleteCoverFile = async (storagePath: string | null | undefined): Promise<void> => {
  if (!storagePath) return;
  try { await supabase.storage.from(COVER_BUCKET).remove([storagePath]); } catch { /* non-fatal */ }
};

export const getPublicProfilesByAuthUids = async (
  authUids: string[],
): Promise<Map<string, PublicProfile>> => {
  const result = new Map<string, PublicProfile>();
  if (authUids.length === 0) return result;
  try {
    const { data: users } = await supabase
      .from('user_profiles')
      .select('id, auth_uid')
      .in('auth_uid', authUids);
    const rows = (users ?? []) as Array<{ id: string; auth_uid: string }>;
    if (rows.length === 0) return result;
    const idToAuth = new Map(rows.map(r => [r.id, r.auth_uid]));
    const { data: profiles } = await supabase
      .from('public_profiles')
      .select('*')
      .in('user_id', rows.map(r => r.id));
    for (const row of (profiles ?? []) as any[]) {
      const authUid = idToAuth.get(row.user_id);
      if (authUid) result.set(authUid, toPublicProfile(row));
    }
  } catch { /* non-fatal */ }
  return result;
};

export const getAvatarsByAuthUids = async (
  authUids: string[],
): Promise<Map<string, string | null>> => {
  const result = new Map<string, string | null>();
  if (authUids.length === 0) return result;
  try {
    const { data: users } = await supabase
      .from('user_profiles')
      .select('id, auth_uid')
      .in('auth_uid', authUids);
    const rows = (users ?? []) as Array<{ id: string; auth_uid: string }>;
    if (rows.length === 0) return result;
    const idToAuth = new Map(rows.map(r => [r.id, r.auth_uid]));
    const { data: profiles } = await supabase
      .from('public_profiles')
      .select('user_id, avatar_url')
      .in('user_id', rows.map(r => r.id));
    for (const row of (profiles ?? []) as Array<{ user_id: string; avatar_url: string | null }>) {
      const authUid = idToAuth.get(row.user_id);
      if (authUid) result.set(authUid, row.avatar_url ?? null);
    }
  } catch {
    // non-fatal — caller falls back to initials
  }
  return result;
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
  coverImageUrl?: string | null;
  coverStoragePath?: string | null;
  links?: Record<string, string> | null;
  tags?: string[] | null;
  showPublicPrompts?: boolean | null;
  showPublicPools?: boolean | null;
  discoverableInSearch?: boolean | null;
  showLinksPublicly?: boolean | null;
  featuredBadgeIds?: string[] | null;
}): Promise<PublicProfile> => {
  const profile = await getProfile();
  if (!profile) throw new Error('You must be logged in.');
  const payload = {
    user_id: profile.id,
    display_name: input.displayName.trim(),
    bio: input.bio?.trim() || null,
    avatar_url: input.avatarUrl?.trim() || null,
    avatar_storage_path: input.avatarStoragePath?.trim() || null,
    cover_image_url: input.coverImageUrl?.trim() || null,
    cover_storage_path: input.coverStoragePath?.trim() || null,
    links: input.links ?? null,
    tags: input.tags ?? null,
    show_public_prompts: input.showPublicPrompts ?? null,
    show_public_pools: input.showPublicPools ?? null,
    discoverable_in_search: input.discoverableInSearch ?? null,
    show_links_publicly: input.showLinksPublicly ?? null,
    featured_badge_ids: input.featuredBadgeIds ?? [],
  };
  const { data, error } = await supabase
    .from('public_profiles')
    .upsert(payload, { onConflict: 'user_id' })
    .select('*')
    .single();
  if (error) throw error;
  return toPublicProfile(data);
};
