import { supabase } from './supabaseClient';
import type { Challenge, ChallengeEntry, WallPostIdentityTag } from '../types/community';
import { awardXP } from './xpStore';
import { checkAndAwardChallengeBadges } from './badgeStore';
import { createWallPost } from './wallStore';

type ChallengeRow = {
  id: string;
  number: number;
  title: string;
  constraint_text: string;
  description: string | null;
  type: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
};

type EntryRow = {
  id: string;
  challenge_id: string;
  auth_uid: string;
  author_id: string;
  wall_post_id: string | null;
  created_at: string;
};

const toChallenge = (row: ChallengeRow): Challenge => ({
  id: row.id,
  number: row.number,
  title: row.title,
  constraintText: row.constraint_text,
  description: row.description,
  type: row.type as Challenge['type'],
  startsAt: new Date(row.starts_at).getTime(),
  endsAt: new Date(row.ends_at).getTime(),
  createdAt: new Date(row.created_at).getTime(),
});

const toEntry = (row: EntryRow): ChallengeEntry => ({
  id: row.id,
  challengeId: row.challenge_id,
  authUid: row.auth_uid,
  authorId: row.author_id,
  wallPostId: row.wall_post_id,
  createdAt: new Date(row.created_at).getTime(),
});

export async function listActiveChallenges(): Promise<Challenge[]> {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .lte('starts_at', now)
      .gte('ends_at', now)
      .order('number', { ascending: false });
    if (error) return [];
    return (data ?? []).map(row => toChallenge(row as ChallengeRow));
  } catch {
    return [];
  }
}

export async function listPastChallenges(): Promise<Challenge[]> {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .lt('ends_at', now)
      .order('number', { ascending: false })
      .limit(10);
    if (error) return [];
    return (data ?? []).map(row => toChallenge(row as ChallengeRow));
  } catch {
    return [];
  }
}

export async function getChallengeEntryCount(challengeId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('challenge_entries')
      .select('*', { count: 'exact', head: true })
      .eq('challenge_id', challengeId);
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getUserChallengeEntry(
  challengeId: string,
  authUid: string,
): Promise<ChallengeEntry | null> {
  try {
    const { data, error } = await supabase
      .from('challenge_entries')
      .select('*')
      .eq('challenge_id', challengeId)
      .eq('auth_uid', authUid)
      .maybeSingle();
    if (error || !data) return null;
    return toEntry(data as EntryRow);
  } catch {
    return null;
  }
}

export async function enterChallenge(
  challenge: Challenge,
  authUid: string,
  authorId: string,
  authorName: string,
  promptText: string,
  identityTags: WallPostIdentityTag[],
): Promise<ChallengeEntry> {
  const post = await createWallPost(
    {
      promptText,
      identityTags,
      caption: `Challenge #${challenge.number}: ${challenge.title}`,
    },
    authUid,
    authorId,
    authorName,
  );

  const { data, error } = await supabase
    .from('challenge_entries')
    .insert({
      challenge_id: challenge.id,
      auth_uid: authUid,
      author_id: authorId,
      wall_post_id: post.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  void awardXP(authUid, 'complete_challenge');
  void checkAndAwardChallengeBadges(authUid, challenge.number);

  return toEntry(data as EntryRow);
}
