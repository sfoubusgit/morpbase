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

export async function listAllChallenges(): Promise<Challenge[]> {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .order('number', { ascending: false });
    if (error) return [];
    return (data ?? []).map(row => toChallenge(row as ChallengeRow));
  } catch {
    return [];
  }
}

export async function createChallenge(input: {
  title: string;
  constraintText: string;
  description?: string | null;
  type: 'weekly' | 'monthly' | 'flash';
  startsAt: Date;
  endsAt: Date;
}): Promise<Challenge> {
  const { data: maxRow } = await supabase
    .from('challenges')
    .select('number')
    .order('number', { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextNumber = ((maxRow as { number: number } | null)?.number ?? 0) + 1;

  const { data, error } = await supabase
    .from('challenges')
    .insert({
      number: nextNumber,
      title: input.title.trim(),
      constraint_text: input.constraintText.trim(),
      description: input.description?.trim() || null,
      type: input.type,
      starts_at: input.startsAt.toISOString(),
      ends_at: input.endsAt.toISOString(),
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return toChallenge(data as ChallengeRow);
}

export type ChallengeEntryWithPost = {
  entryId: string;
  authUid: string;
  authorName: string;
  promptText: string;
  createdAt: number;
};

export async function listChallengeEntries(challengeId: string): Promise<ChallengeEntryWithPost[]> {
  try {
    const { data, error } = await supabase
      .from('challenge_entries')
      .select('id, auth_uid, created_at, wall_posts(prompt_text, author_name)')
      .eq('challenge_id', challengeId)
      .order('created_at', { ascending: false })
      .limit(40);

    if (error || !data) return [];

    return (data as any[])
      .filter(row => row.wall_posts)
      .map(row => ({
        entryId: row.id as string,
        authUid: row.auth_uid as string,
        authorName: (row.wall_posts as any).author_name as string,
        promptText: (row.wall_posts as any).prompt_text as string,
        createdAt: new Date(row.created_at as string).getTime(),
      }));
  } catch {
    return [];
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
