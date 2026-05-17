import { supabase } from './supabaseClient';
import { checkAndAwardFollowerBadges } from './badgeStore';
import { createNotification } from './notificationStore';
import { awardXP } from './xpStore';

export async function followUser(followerAuthUid: string, followingAuthUid: string, followerName?: string): Promise<void> {
  const { error } = await supabase
    .from('follows')
    .insert({ follower_auth_uid: followerAuthUid, following_auth_uid: followingAuthUid });

  if (error && error.code !== '23505') throw new Error(error.message);
  void checkAndAwardFollowerBadges(followingAuthUid);
  void awardXP(followingAuthUid, 'got_followed');
  void createNotification(followingAuthUid, 'new_follower', {
    followerAuthUid,
    followerName: followerName ?? null,
  });
}

export async function unfollowUser(followerAuthUid: string, followingAuthUid: string): Promise<void> {
  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower_auth_uid', followerAuthUid)
    .eq('following_auth_uid', followingAuthUid);

  if (error) throw new Error(error.message);
}

export async function isFollowing(followerAuthUid: string, followingAuthUid: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('follower_auth_uid')
      .eq('follower_auth_uid', followerAuthUid)
      .eq('following_auth_uid', followingAuthUid)
      .maybeSingle();
    if (error) return false;
    return data !== null;
  } catch {
    return false;
  }
}

export async function getFollowingAuthUids(authUid: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('following_auth_uid')
      .eq('follower_auth_uid', authUid);
    if (error) return [];
    return (data ?? []).map((r: { following_auth_uid: string }) => r.following_auth_uid);
  } catch {
    return [];
  }
}

export async function getFollowerCount(authUid: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_auth_uid', authUid);
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getFollowingCount(authUid: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_auth_uid', authUid);
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
