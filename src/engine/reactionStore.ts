import { supabase } from './supabaseClient';

export const REACTION_EMOJIS = ['🔥', '💜', '✨', '👁', '🎨'] as const;
export type ReactionEmoji = typeof REACTION_EMOJIS[number];

export type PostReactions = Record<string, number>; // emoji → count

export async function getReactionsForPosts(
  postIds: string[],
): Promise<Record<string, PostReactions>> {
  const result: Record<string, PostReactions> = {};
  if (postIds.length === 0) return result;
  try {
    const { data, error } = await supabase
      .from('post_reactions')
      .select('post_id, emoji')
      .in('post_id', postIds);
    if (error) return result;
    for (const row of data ?? []) {
      const map = result[row.post_id] ?? {};
      map[row.emoji] = (map[row.emoji] ?? 0) + 1;
      result[row.post_id] = map;
    }
  } catch {
    // return empty
  }
  return result;
}

export async function getMyReactions(
  authUid: string,
  postIds: string[],
): Promise<Record<string, Set<string>>> {
  const result: Record<string, Set<string>> = {};
  if (postIds.length === 0) return result;
  try {
    const { data, error } = await supabase
      .from('post_reactions')
      .select('post_id, emoji')
      .eq('auth_uid', authUid)
      .in('post_id', postIds);
    if (error) return result;
    for (const row of data ?? []) {
      const set = result[row.post_id] ?? new Set<string>();
      set.add(row.emoji);
      result[row.post_id] = set;
    }
  } catch {
    // return empty
  }
  return result;
}

export async function addReaction(
  postId: string,
  authUid: string,
  emoji: string,
): Promise<void> {
  try {
    await supabase
      .from('post_reactions')
      .insert({ post_id: postId, auth_uid: authUid, emoji });
  } catch {
    // unique constraint violation = already reacted, ignore
  }
}

export async function removeReaction(
  postId: string,
  authUid: string,
  emoji: string,
): Promise<void> {
  try {
    await supabase
      .from('post_reactions')
      .delete()
      .eq('post_id', postId)
      .eq('auth_uid', authUid)
      .eq('emoji', emoji);
  } catch {
    // non-fatal
  }
}
