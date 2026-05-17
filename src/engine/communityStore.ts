import { supabase } from './supabaseClient';
import type { CommunityIdentityType } from '../data/communityIdentities';
import { awardXP } from './xpStore';
import { checkAndAwardShareBadges, checkAndAwardRemixBadges } from './badgeStore';
import { createNotification } from './notificationStore';
import { createWallPost } from './wallStore';

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
  parentId: string | null;
  remixCount: number;
};

export type ShareIdentityInput = {
  name: string;
  type: CommunityIdentityType;
  phrases: string[];
  summary: string;
  authorCoverImageUrl?: string | null;
  parentId?: string | null;
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
  parent_id: string | null;
  remix_count: number;
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
  parentId: row.parent_id ?? null,
  remixCount: row.remix_count ?? 0,
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
  userId: string,
  authorName: string,
): Promise<CommunitySharedIdentity> {
  const { data: { session } } = await supabase.auth.getSession();
  const authUid = session?.user?.id;
  if (!authUid) throw new Error('No active session.');

  const isUuid = (s: string | null | undefined): boolean =>
    !!s && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

  const parentId = isUuid(input.parentId) ? (input.parentId ?? null) : null;

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
      parent_id: parentId,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // If this is a remix, increment the parent's remix_count (non-fatal)
  if (parentId) {
    try {
      await supabase.rpc('increment_remix_count', { identity_id: parentId });
    } catch {
      // remix_count is a convenience cache — failure here is non-fatal
    }
  }

  // Auto-post a share event to the wall (non-fatal)
  void createWallPost(
    {
      promptText: input.phrases.slice(0, 3).join(' · ') || input.summary,
      identityTags: [{ name: input.name, type: input.type }],
      postType: 'share_event',
    },
    authUid,
    userId,
    authorName,
  );

  void awardXP(authUid, 'share_identity');
  void checkAndAwardShareBadges(authUid);
  if (parentId) {
    // Look up the original author's auth_uid so we can award them the remix-received badge and notify them
    supabase
      .from('community_identities')
      .select('author_id, name')
      .eq('id', parentId)
      .maybeSingle()
      .then(({ data: parentRow }) => {
        if (parentRow?.author_id) {
          void checkAndAwardRemixBadges(authUid, parentRow.author_id as string);
          void createNotification(parentRow.author_id as string, 'identity_remixed', {
            remixerAuthUid: authUid,
            remixerName: authorName,
            identityName: parentRow.name as string,
          });
        }
      });
  }
  return toIdentity(data as Row);
}

export async function removeSharedIdentity(id: string): Promise<void> {
  const { error } = await supabase
    .from('community_identities')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
