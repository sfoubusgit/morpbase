import { supabase } from './supabaseClient';
import type { WallPost, CreateWallPostInput } from '../types/community';
import { awardXP } from './xpStore';
import { checkAndAwardWallPostBadges } from './badgeStore';
import { createNotification } from './notificationStore';

type WallPostRow = {
  id: string;
  auth_uid: string;
  author_id: string;
  author_name: string;
  caption: string | null;
  prompt_text: string;
  identity_tags: Array<{ name: string; type: string }>;
  post_type: string;
  parent_post_id: string | null;
  like_count: number;
  created_at: string;
};

const toWallPost = (row: WallPostRow): WallPost => ({
  id: row.id,
  authUid: row.auth_uid,
  authorId: row.author_id,
  authorName: row.author_name,
  caption: row.caption ?? null,
  promptText: row.prompt_text,
  identityTags: Array.isArray(row.identity_tags) ? row.identity_tags as WallPost['identityTags'] : [],
  postType: (row.post_type as WallPost['postType']) ?? 'standard',
  parentPostId: row.parent_post_id ?? null,
  likeCount: row.like_count ?? 0,
  createdAt: new Date(row.created_at).getTime(),
});

export async function listWallPosts(options?: {
  limit?: number;
  authorAuthUid?: string;
}): Promise<WallPost[]> {
  try {
    let query = supabase
      .from('wall_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(options?.limit ?? 50);

    if (options?.authorAuthUid) {
      query = query.eq('auth_uid', options.authorAuthUid);
    }

    const { data, error } = await query;
    if (error) return [];
    return (data ?? []).map(row => toWallPost(row as WallPostRow));
  } catch {
    return [];
  }
}

export async function createWallPost(
  input: CreateWallPostInput,
  authUid: string,
  authorId: string,
  authorName: string,
): Promise<WallPost> {
  const { data, error } = await supabase
    .from('wall_posts')
    .insert({
      auth_uid: authUid,
      author_id: authorId,
      author_name: authorName.trim() || 'Anonymous',
      caption: input.caption?.trim() || null,
      prompt_text: input.promptText.trim(),
      identity_tags: input.identityTags,
      post_type: input.postType ?? 'standard',
      parent_post_id: input.parentPostId ?? null,
      like_count: 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  const post = toWallPost(data as WallPostRow);
  void awardXP(authUid, 'post_to_wall');
  void checkAndAwardWallPostBadges(authUid);

  if (input.parentPostId) {
    void supabase
      .from('wall_posts')
      .select('auth_uid, post_type, identity_tags')
      .eq('id', input.parentPostId)
      .maybeSingle()
      .then(({ data: parent }) => {
        const parentRow = parent as { auth_uid?: string; post_type?: string; identity_tags?: Array<{ name: string; type: string }> } | null;
        if (!parentRow?.auth_uid || parentRow.auth_uid === authUid) return;
        const firstTag = Array.isArray(parentRow.identity_tags) ? parentRow.identity_tags[0] : null;
        void createNotification(parentRow.auth_uid, 'wall_post_replied', {
          replierAuthUid: authUid,
          replierName: authorName,
          parentPostId: input.parentPostId,
          parentPostType: parentRow.post_type ?? 'standard',
          identityName: firstTag?.name ?? null,
          identityType: firstTag?.type ?? null,
          excerpt: post.promptText.slice(0, 80),
        });
      });
  }

  return post;
}

export async function getWallPost(id: string): Promise<WallPost | null> {
  try {
    const { data, error } = await supabase
      .from('wall_posts')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return toWallPost(data as WallPostRow);
  } catch {
    return null;
  }
}

export async function getPostReplies(parentPostId: string): Promise<WallPost[]> {
  try {
    const { data, error } = await supabase
      .from('wall_posts')
      .select('*')
      .eq('parent_post_id', parentPostId)
      .order('created_at', { ascending: true });
    if (error) return [];
    return (data ?? []).map(row => toWallPost(row as WallPostRow));
  } catch {
    return [];
  }
}

export async function getIdentityDiscussionPost(
  authorAuthUid: string,
  identityName: string,
  identityType: string,
): Promise<WallPost | null> {
  try {
    const { data, error } = await supabase
      .from('wall_posts')
      .select('*')
      .eq('auth_uid', authorAuthUid)
      .eq('post_type', 'share_event')
      .contains('identity_tags', [{ name: identityName, type: identityType }])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return toWallPost(data as WallPostRow);
  } catch {
    return null;
  }
}

export async function deleteWallPost(id: string): Promise<void> {
  const { error } = await supabase
    .from('wall_posts')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function likePost(postId: string, authUid: string): Promise<void> {
  // Insert like row — unique constraint prevents duplicates
  const { error } = await supabase
    .from('wall_post_likes')
    .insert({ post_id: postId, auth_uid: authUid });

  if (error && error.code !== '23505') throw new Error(error.message); // ignore duplicate

  // Increment cached count (non-fatal)
  try { await supabase.rpc('increment_wall_post_likes', { post_id: postId }); } catch { /* */ }
}

export async function unlikePost(postId: string, authUid: string): Promise<void> {
  await supabase
    .from('wall_post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('auth_uid', authUid);

  try { await supabase.rpc('decrement_wall_post_likes', { post_id: postId }); } catch { /* */ }
}

export async function getLikedPostIds(authUid: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('wall_post_likes')
      .select('post_id')
      .eq('auth_uid', authUid);

    if (error) return [];
    return (data ?? []).map((r: { post_id: string }) => r.post_id);
  } catch {
    return [];
  }
}
