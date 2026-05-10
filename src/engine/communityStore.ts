import { supabase } from './supabaseClient';
import type { CommunityIdentityType } from '../data/communityIdentities';

export type CommunitySharedIdentity = {
  id: string;
  name: string;
  type: CommunityIdentityType;
  phrases: string[];
  summary: string;
  authorId: string | null;
  authorName: string;
  authorCoverImageUrl: string | null;
  featured: boolean;
  createdAt: number;
};

export type ShareIdentityInput = {
  name: string;
  type: CommunityIdentityType;
  phrases: string[];
  summary: string;
  authorCoverImageUrl?: string | null;
};

type Row = {
  id: string;
  name: string;
  type: string;
  phrases: string[];
  summary: string;
  author_id: string | null;
  author_name: string;
  author_cover_image_url: string | null;
  featured: boolean;
  created_at: string;
};

const toIdentity = (row: Row): CommunitySharedIdentity => ({
  id: row.id,
  name: row.name,
  type: row.type as CommunityIdentityType,
  phrases: Array.isArray(row.phrases) ? row.phrases : [],
  summary: row.summary ?? '',
  authorId: row.author_id,
  authorName: row.author_name ?? 'Anonymous',
  authorCoverImageUrl: row.author_cover_image_url ?? null,
  featured: row.featured ?? false,
  createdAt: new Date(row.created_at).getTime(),
});

export async function listCommunityIdentities(
  type?: CommunityIdentityType,
): Promise<CommunitySharedIdentity[]> {
  try {
    let query = supabase
      .from('community_identities')
      .select('*')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error) return [];
    return (data ?? []).map(row => toIdentity(row as Row));
  } catch {
    return [];
  }
}

export async function shareIdentity(
  input: ShareIdentityInput,
  _userId: string,
  authorName: string,
): Promise<CommunitySharedIdentity> {
  // RLS policy requires auth.uid() = author_id
  const { data: { session } } = await supabase.auth.getSession();
  const authUid = session?.user?.id;
  if (!authUid) throw new Error('No active session.');

  const { data, error } = await supabase
    .from('community_identities')
    .insert({
      name: input.name.trim(),
      type: input.type,
      phrases: input.phrases,
      summary: input.summary.trim(),
      author_id: authUid,
      author_name: authorName.trim() || 'Anonymous',
      author_cover_image_url: input.authorCoverImageUrl?.trim() || null,
      featured: false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toIdentity(data as Row);
}

export async function removeSharedIdentity(id: string): Promise<void> {
  const { error } = await supabase
    .from('community_identities')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
