/**
 * v3 follows — follow a creator (the person who authored a character / lane
 * object). Reads are public (follower counts, who you follow); writes require
 * auth and are scoped to your own follow rows. Keyed by creator auth uid.
 */
import { supabase } from '../../engine/supabaseClient';

export type FollowState = { count: number; following: boolean };

/** Follower count for a creator, plus whether the given viewer follows them. */
export async function getFollowState(creatorAuthUid: string, myAuthUid?: string | null): Promise<FollowState> {
  const { data, error } = await supabase
    .from('v3_follows')
    .select('follower_auth_uid')
    .eq('creator_auth_uid', creatorAuthUid)
    .limit(5000);
  if (error || !data) return { count: 0, following: false };
  const rows = data as Array<{ follower_auth_uid: string }>;
  return {
    count: rows.length,
    following: myAuthUid ? rows.some(r => r.follower_auth_uid === myAuthUid) : false,
  };
}

export async function follow(creatorAuthUid: string, myAuthUid: string): Promise<void> {
  const { error } = await supabase
    .from('v3_follows')
    .upsert({ follower_auth_uid: myAuthUid, creator_auth_uid: creatorAuthUid }, { onConflict: 'follower_auth_uid,creator_auth_uid' });
  if (error) throw new Error(error.message);
}

export async function unfollow(creatorAuthUid: string, myAuthUid: string): Promise<void> {
  const { error } = await supabase
    .from('v3_follows')
    .delete()
    .eq('follower_auth_uid', myAuthUid)
    .eq('creator_auth_uid', creatorAuthUid);
  if (error) throw new Error(error.message);
}

/** The set of creator auth uids the viewer follows (for a "Following" filter). */
export async function listFollowing(myAuthUid: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('v3_follows')
    .select('creator_auth_uid')
    .eq('follower_auth_uid', myAuthUid)
    .limit(5000);
  if (error || !data) return [];
  return (data as Array<{ creator_auth_uid: string }>).map(r => r.creator_auth_uid);
}
