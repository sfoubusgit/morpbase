import { supabase } from './supabaseClient';
import type { BadgeId, EarnedBadge } from '../types/community';

export async function getEarnedBadges(authUid: string): Promise<EarnedBadge[]> {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select('badge_id, earned_at')
      .eq('auth_uid', authUid)
      .order('earned_at', { ascending: true });
    if (error) return [];
    return (data ?? []).map((r: { badge_id: string; earned_at: string }) => ({
      badgeId: r.badge_id as BadgeId,
      earnedAt: new Date(r.earned_at).getTime(),
    }));
  } catch {
    return [];
  }
}

export async function getBadgeMap(authUids: string[]): Promise<Map<string, EarnedBadge[]>> {
  const map = new Map<string, EarnedBadge[]>();
  if (authUids.length === 0) return map;
  try {
    const unique = [...new Set(authUids)];
    const { data, error } = await supabase
      .from('user_badges')
      .select('auth_uid, badge_id, earned_at')
      .in('auth_uid', unique);
    if (error) return map;
    for (const row of data ?? []) {
      const list = map.get(row.auth_uid) ?? [];
      list.push({ badgeId: row.badge_id as BadgeId, earnedAt: new Date(row.earned_at).getTime() });
      map.set(row.auth_uid, list);
    }
  } catch {
    // return empty map
  }
  return map;
}

async function hasBadge(authUid: string, badgeId: BadgeId): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('auth_uid', authUid)
      .eq('badge_id', badgeId)
      .maybeSingle();
    return data !== null;
  } catch {
    return false;
  }
}

async function grantBadge(authUid: string, badgeId: BadgeId): Promise<void> {
  try {
    await supabase
      .from('user_badges')
      .insert({ auth_uid: authUid, badge_id: badgeId });
  } catch {
    // unique constraint means duplicate = already earned, ignore
  }
}

export async function checkAndAwardWallPostBadges(authUid: string): Promise<void> {
  const already = await hasBadge(authUid, 'first_wall_post');
  if (!already) await grantBadge(authUid, 'first_wall_post');
}

export async function checkAndAwardShareBadges(authUid: string): Promise<void> {
  const already = await hasBadge(authUid, 'first_share');
  if (!already) await grantBadge(authUid, 'first_share');
}

export async function checkAndAwardFollowerBadges(followingAuthUid: string): Promise<void> {
  const already = await hasBadge(followingAuthUid, 'first_follower');
  if (!already) await grantBadge(followingAuthUid, 'first_follower');
}

export async function checkAndAwardChallengeBadges(
  authUid: string,
  challengeNumber: number,
): Promise<void> {
  const alreadyFirst = await hasBadge(authUid, 'first_challenge_entry');
  if (!alreadyFirst) await grantBadge(authUid, 'first_challenge_entry');
  if (challengeNumber === 1) {
    const alreadyPioneer = await hasBadge(authUid, 'challenge_pioneer');
    if (!alreadyPioneer) await grantBadge(authUid, 'challenge_pioneer');
  }
}

export async function checkAndAwardRemixBadges(
  remixerAuthUid: string,
  originalAuthorAuthUid: string,
): Promise<void> {
  const [alreadyGiven, alreadyReceived] = await Promise.all([
    hasBadge(remixerAuthUid, 'first_remix_given'),
    hasBadge(originalAuthorAuthUid, 'first_remix_received'),
  ]);
  if (!alreadyGiven) await grantBadge(remixerAuthUid, 'first_remix_given');
  if (!alreadyReceived) await grantBadge(originalAuthorAuthUid, 'first_remix_received');
}
