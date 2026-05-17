import { supabase } from './supabaseClient';
import { awardXP } from './xpStore';

export async function logIdentityUsage(params: {
  identityId: string;
  identityName: string;
  identityType: string;
  authorAuthUid: string;
  userAuthUid: string;
}): Promise<void> {
  try {
    await supabase.from('identity_usages').insert({
      identity_id:     params.identityId,
      identity_name:   params.identityName,
      identity_type:   params.identityType,
      author_auth_uid: params.authorAuthUid,
      user_auth_uid:   params.userAuthUid,
    });
    void awardXP(params.authorAuthUid, 'identity_added_by_other');
  } catch {
    // non-fatal — usage tracking must never block the add flow
  }
}

export async function getReachScores(
  authorAuthUids: string[],
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (authorAuthUids.length === 0) return map;
  try {
    const unique = [...new Set(authorAuthUids)];
    const { data, error } = await supabase
      .from('identity_usages')
      .select('author_auth_uid, user_auth_uid')
      .in('author_auth_uid', unique);

    if (error) return map;

    // Count distinct user_auth_uid per author, excluding self-use
    const seen = new Map<string, Set<string>>();
    for (const row of data ?? []) {
      if (row.user_auth_uid === row.author_auth_uid) continue;
      const set = seen.get(row.author_auth_uid) ?? new Set<string>();
      set.add(row.user_auth_uid);
      seen.set(row.author_auth_uid, set);
    }
    for (const [uid, users] of seen) {
      map.set(uid, users.size);
    }
  } catch {
    // return empty map
  }
  return map;
}
