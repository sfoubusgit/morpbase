import { supabase } from './supabaseClient';
import type { Challenge, ChallengeEntry, WallPostIdentityTag } from '../types/community';
import { awardXP } from './xpStore';
import { checkAndAwardChallengeBadges } from './badgeStore';
import { createWallPost } from './wallStore';
import { createNotification } from './notificationStore';

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
  winner_entry_id: string | null;
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
  winnerEntryId: row.winner_entry_id ?? null,
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
  voteCount: number;
  iVoted: boolean;
};

export async function listChallengeEntries(
  challengeId: string,
  viewerAuthUid?: string | null,
): Promise<ChallengeEntryWithPost[]> {
  try {
    const { data, error } = await supabase
      .from('challenge_entries')
      .select('id, auth_uid, created_at, wall_posts(prompt_text, author_name)')
      .eq('challenge_id', challengeId)
      .order('created_at', { ascending: false })
      .limit(40);

    if (error || !data) return [];

    const rows = (data as any[]).filter(row => row.wall_posts);
    const entryIds = rows.map(r => r.id as string);

    const [voteCounts, myVotes] = await Promise.all([
      getVoteCountsForEntries(entryIds),
      viewerAuthUid ? getMyVoteEntryIds(viewerAuthUid, entryIds) : Promise.resolve(new Set<string>()),
    ]);

    const mapped = rows.map(row => ({
      entryId: row.id as string,
      authUid: row.auth_uid as string,
      authorName: (row.wall_posts as any).author_name as string,
      promptText: (row.wall_posts as any).prompt_text as string,
      createdAt: new Date(row.created_at as string).getTime(),
      voteCount: voteCounts.get(row.id as string) ?? 0,
      iVoted: myVotes.has(row.id as string),
    }));

    // Leaderboard sort: most votes first; ties break by newest.
    mapped.sort((a, b) => b.voteCount - a.voteCount || b.createdAt - a.createdAt);
    return mapped;
  } catch {
    return [];
  }
}

async function getVoteCountsForEntries(entryIds: string[]): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (entryIds.length === 0) return counts;
  try {
    const { data } = await supabase
      .from('challenge_entry_votes')
      .select('entry_id')
      .in('entry_id', entryIds);
    for (const row of (data ?? []) as Array<{ entry_id: string }>) {
      counts.set(row.entry_id, (counts.get(row.entry_id) ?? 0) + 1);
    }
  } catch { /* non-fatal */ }
  return counts;
}

async function getMyVoteEntryIds(authUid: string, entryIds: string[]): Promise<Set<string>> {
  const set = new Set<string>();
  if (entryIds.length === 0) return set;
  try {
    const { data } = await supabase
      .from('challenge_entry_votes')
      .select('entry_id')
      .eq('voter_auth_uid', authUid)
      .in('entry_id', entryIds);
    for (const row of (data ?? []) as Array<{ entry_id: string }>) set.add(row.entry_id);
  } catch { /* non-fatal */ }
  return set;
}

export async function voteForEntry(
  entryId: string,
  challengeId: string,
  voterAuthUid: string,
): Promise<void> {
  try {
    await supabase
      .from('challenge_entry_votes')
      .insert({ entry_id: entryId, challenge_id: challengeId, voter_auth_uid: voterAuthUid });
  } catch { /* unique-violation = already voted, ignore */ }
}

export async function unvoteEntry(entryId: string, voterAuthUid: string): Promise<void> {
  try {
    await supabase
      .from('challenge_entry_votes')
      .delete()
      .eq('entry_id', entryId)
      .eq('voter_auth_uid', voterAuthUid);
  } catch { /* non-fatal */ }
}

export async function setChallengeWinner(
  challengeId: string,
  winnerEntryId: string | null,
): Promise<void> {
  const { error } = await supabase
    .from('challenges')
    .update({ winner_entry_id: winnerEntryId })
    .eq('id', challengeId);
  if (error) throw new Error(error.message);

  if (!winnerEntryId) return;
  try {
    const { data: entry } = await supabase
      .from('challenge_entries')
      .select('auth_uid')
      .eq('id', winnerEntryId)
      .maybeSingle();
    const winnerAuthUid = (entry as { auth_uid: string } | null)?.auth_uid;
    if (!winnerAuthUid) return;
    const { data: challenge } = await supabase
      .from('challenges')
      .select('number, title')
      .eq('id', challengeId)
      .maybeSingle();
    const c = challenge as { number: number; title: string } | null;
    void createNotification(winnerAuthUid, 'challenge_won', {
      challengeId,
      challengeNumber: c?.number ?? null,
      challengeTitle: c?.title ?? null,
      entryId: winnerEntryId,
    });
  } catch { /* non-fatal */ }
}

export type ChallengeWinner = {
  entryId: string;
  authUid: string;
  authorName: string;
  promptText: string;
};

export async function getWinnersForChallenges(
  challengeIds: string[],
): Promise<Map<string, ChallengeWinner>> {
  const result = new Map<string, ChallengeWinner>();
  if (challengeIds.length === 0) return result;
  try {
    const { data } = await supabase
      .from('challenges')
      .select('id, winner_entry_id, challenge_entries!winner_entry_id(id, auth_uid, wall_posts(prompt_text, author_name))')
      .in('id', challengeIds)
      .not('winner_entry_id', 'is', null);
    for (const row of (data ?? []) as any[]) {
      const entry = row.challenge_entries;
      const post = entry?.wall_posts;
      if (!entry || !post) continue;
      result.set(row.id as string, {
        entryId: entry.id as string,
        authUid: entry.auth_uid as string,
        authorName: post.author_name as string,
        promptText: post.prompt_text as string,
      });
    }
  } catch { /* non-fatal */ }
  return result;
}

export function subscribeToChallengeEntries(
  challengeId: string,
  onChange: () => void,
): () => void {
  const channel = supabase
    .channel(`challenge:${challengeId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'challenge_entries', filter: `challenge_id=eq.${challengeId}` },
      () => { try { onChange(); } catch { /* non-fatal */ } },
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'challenge_entry_votes', filter: `challenge_id=eq.${challengeId}` },
      () => { try { onChange(); } catch { /* non-fatal */ } },
    )
    .subscribe();
  return () => { try { void supabase.removeChannel(channel); } catch { /* non-fatal */ } };
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
