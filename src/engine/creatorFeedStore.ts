import { supabase } from './supabaseClient';

export type CreatorSummary = {
  authUid: string;
  name: string;
  wallPostCount: number;
  identityCount: number;
};

export async function listCreators(): Promise<CreatorSummary[]> {
  try {
    // Pull distinct authors from wall_posts
    const { data: wallData, error: wallError } = await supabase
      .from('wall_posts')
      .select('auth_uid, author_name');

    if (wallError) return [];

    // Pull distinct authors from community_identities
    const { data: identityData } = await supabase
      .from('community_identities')
      .select('author_id, author_name');

    const map = new Map<string, CreatorSummary>();

    for (const row of wallData ?? []) {
      const uid: string = row.auth_uid;
      const existing = map.get(uid);
      if (existing) {
        existing.wallPostCount += 1;
      } else {
        map.set(uid, {
          authUid: uid,
          name: row.author_name ?? 'Anonymous',
          wallPostCount: 1,
          identityCount: 0,
        });
      }
    }

    for (const row of identityData ?? []) {
      const uid: string = row.author_id;
      if (!uid) continue;
      const existing = map.get(uid);
      if (existing) {
        existing.identityCount += 1;
      } else {
        map.set(uid, {
          authUid: uid,
          name: row.author_name ?? 'Anonymous',
          wallPostCount: 0,
          identityCount: 1,
        });
      }
    }

    return [...map.values()].sort((a, b) => (b.wallPostCount + b.identityCount) - (a.wallPostCount + a.identityCount));
  } catch {
    return [];
  }
}
