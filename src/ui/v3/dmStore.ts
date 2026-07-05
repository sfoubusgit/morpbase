/**
 * v3 Direct Messages — 1:1 threads between creators, Supabase-backed.
 *
 * Model: a thread has exactly two participants. The initiator's participant row
 * is `accepted = true`; the recipient's is `accepted = false` until they accept,
 * so first-contact from a stranger lands in a "Requests" inbox (spam / SFW gate)
 * rather than the main inbox. Message bodies are SFW-rated on the way in.
 *
 * Thread creation goes through a SECURITY DEFINER RPC (`v3_dm_get_or_create_thread`)
 * so the two participant rows are created atomically and a pair of users can never
 * end up with duplicate threads (enforced by a sorted `pair_key`).
 *
 * Attachments (sending a character / scene / prompt) are Phase 3: the schema
 * already carries `kind` + `payload`, so they slot in without a migration.
 */
import { supabase } from '../../engine/supabaseClient';
import { getPublicProfilesByAuthUids } from '../../engine/profileStore';
import { nsfwMatch } from './contentRating';

export type DmMessage = {
  id: string;
  threadId: string;
  senderAuthUid: string;
  body: string;
  kind: 'text' | 'attachment';
  createdAt: string;
};

export type DmThreadSummary = {
  threadId: string;
  otherAuthUid: string;
  otherName: string;
  otherAvatarUrl: string | null;
  lastBody: string;
  lastAt: string | null;
  lastFromMe: boolean;
  unread: boolean;
  /** a first-contact request TO me that I haven't accepted yet */
  isRequest: boolean;
};

type MsgRow = { id: string; thread_id: string; sender_auth_uid: string; body: string; kind: string; created_at: string };
type PartRow = { thread_id: string; auth_uid: string; accepted: boolean; last_read_at: string; left_at: string | null };
type ThreadRow = { id: string; created_by: string; last_message_at: string };

const toMsg = (r: MsgRow): DmMessage => ({
  id: r.id,
  threadId: r.thread_id,
  senderAuthUid: r.sender_auth_uid,
  body: r.body ?? '',
  kind: (r.kind as DmMessage['kind']) ?? 'text',
  createdAt: r.created_at,
});

export type CreatorHit = { authUid: string; name: string; avatarUrl: string | null };

/** Search people by display name to start a conversation. Excludes yourself. */
export async function searchCreators(query: string, myAuthUid: string): Promise<CreatorHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];
  // Honor the same privacy toggle as the rest of the app: users who opted out of
  // search discovery (discoverable_in_search = false) are not surfaced here.
  const { data: profs, error } = await supabase
    .from('public_profiles')
    .select('user_id, display_name, avatar_url')
    .eq('discoverable_in_search', true)
    .ilike('display_name', `%${q}%`)
    .limit(12);
  if (error || !profs || profs.length === 0) return [];
  const rows = profs as Array<{ user_id: string; display_name: string | null; avatar_url: string | null }>;
  const { data: users } = await supabase
    .from('user_profiles')
    .select('id, auth_uid')
    .in('id', rows.map(r => r.user_id));
  const idToAuth = new Map((users as Array<{ id: string; auth_uid: string }> ?? []).map(u => [u.id, u.auth_uid]));
  return rows
    .map(r => ({ authUid: idToAuth.get(r.user_id) ?? '', name: (r.display_name ?? '').trim() || 'creator', avatarUrl: r.avatar_url ?? null }))
    .filter(h => h.authUid && h.authUid !== myAuthUid);
}

/** Find or create the 1:1 thread with another user; returns the thread id. */
export async function getOrCreateThread(otherAuthUid: string): Promise<string> {
  const { data, error } = await supabase.rpc('v3_dm_get_or_create_thread', { p_other: otherAuthUid });
  if (error) throw new Error(error.message);
  return data as string;
}

/** Every thread I'm in, newest activity first, with the other person + unread. */
export async function listThreads(myAuthUid: string): Promise<DmThreadSummary[]> {
  // my participant rows (skip threads I've left)
  const { data: mine, error: e1 } = await supabase
    .from('v3_dm_participants')
    .select('thread_id, auth_uid, accepted, last_read_at, left_at')
    .eq('auth_uid', myAuthUid)
    .is('left_at', null);
  if (e1 || !mine || mine.length === 0) return [];
  const myParts = mine as PartRow[];
  const threadIds = myParts.map(p => p.thread_id);
  const myReadAt = new Map(myParts.map(p => [p.thread_id, p.last_read_at]));
  const myAccepted = new Map(myParts.map(p => [p.thread_id, p.accepted]));

  const [{ data: threads }, { data: others }, { data: msgs }] = await Promise.all([
    supabase.from('v3_dm_threads').select('id, created_by, last_message_at').in('id', threadIds),
    supabase.from('v3_dm_participants').select('thread_id, auth_uid, accepted, last_read_at, left_at').in('thread_id', threadIds).neq('auth_uid', myAuthUid),
    supabase.from('v3_dm_messages').select('id, thread_id, sender_auth_uid, body, kind, created_at').in('thread_id', threadIds).order('created_at', { ascending: false }).limit(600),
  ]);

  const threadRows = (threads ?? []) as ThreadRow[];
  const createdBy = new Map(threadRows.map(t => [t.id, t.created_by]));
  const lastAtOf = new Map(threadRows.map(t => [t.id, t.last_message_at]));
  const otherOf = new Map((others as PartRow[] ?? []).map(p => [p.thread_id, p.auth_uid]));

  // latest message per thread (msgs already newest-first)
  const latest = new Map<string, MsgRow>();
  for (const m of (msgs as MsgRow[] ?? [])) if (!latest.has(m.thread_id)) latest.set(m.thread_id, m);

  const otherUids = [...new Set([...otherOf.values()])];
  const profiles = await getPublicProfilesByAuthUids(otherUids);

  const summaries: DmThreadSummary[] = threadIds.map(tid => {
    const otherUid = otherOf.get(tid) ?? '';
    const prof = profiles.get(otherUid);
    const last = latest.get(tid);
    const readAt = myReadAt.get(tid) ?? '1970-01-01';
    const lastFromMe = last ? last.sender_auth_uid === myAuthUid : false;
    const unread = !!last && !lastFromMe && last.created_at > readAt;
    const accepted = myAccepted.get(tid) ?? true;
    const isRequest = !accepted && createdBy.get(tid) !== myAuthUid;
    return {
      threadId: tid,
      otherAuthUid: otherUid,
      otherName: prof?.displayName?.trim() || 'creator',
      otherAvatarUrl: prof?.avatarUrl ?? null,
      lastBody: last ? (last.kind === 'attachment' ? '📎 Attachment' : last.body) : '',
      lastAt: lastAtOf.get(tid) ?? last?.created_at ?? null,
      lastFromMe,
      unread,
      isRequest,
    };
  });
  // newest activity first
  summaries.sort((a, b) => (b.lastAt ?? '').localeCompare(a.lastAt ?? ''));
  return summaries;
}

/** Full message history for a thread, oldest → newest. */
export async function listMessages(threadId: string): Promise<DmMessage[]> {
  const { data, error } = await supabase
    .from('v3_dm_messages')
    .select('id, thread_id, sender_auth_uid, body, kind, created_at')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true })
    .limit(1000);
  if (error || !data) return [];
  return (data as MsgRow[]).map(toMsg);
}

/** Send a text message. SFW-rated: NSFW bodies are rejected (parity with lanes). */
export async function sendMessage(threadId: string, body: string): Promise<DmMessage> {
  const trimmed = body.trim();
  if (!trimmed) throw new Error('Empty message.');
  if (nsfwMatch(trimmed)) throw new Error('That message was flagged 18+ — MorpBase is SFW for now, so it can’t be sent.');
  const { data, error } = await supabase
    .from('v3_dm_messages')
    .insert({ thread_id: threadId, body: trimmed, kind: 'text', rating: 'sfw' })
    .select('id, thread_id, sender_auth_uid, body, kind, created_at')
    .single();
  if (error) throw new Error(error.message);
  return toMsg(data as MsgRow);
}

/** Mark a thread read up to now (clears its unread state for me). */
export async function markRead(threadId: string, myAuthUid: string): Promise<void> {
  await supabase
    .from('v3_dm_participants')
    .update({ last_read_at: new Date().toISOString() })
    .eq('thread_id', threadId)
    .eq('auth_uid', myAuthUid);
}

/** Accept a request thread — moves it from Requests into the main inbox. */
export async function acceptRequest(threadId: string, myAuthUid: string): Promise<void> {
  await supabase
    .from('v3_dm_participants')
    .update({ accepted: true })
    .eq('thread_id', threadId)
    .eq('auth_uid', myAuthUid);
}

/** Number of threads with unread messages — for the inbox badge. */
export async function countUnreadThreads(myAuthUid: string): Promise<number> {
  const threads = await listThreads(myAuthUid);
  return threads.filter(t => t.unread && !t.isRequest).length;
}

export async function blockUser(blockedAuthUid: string): Promise<void> {
  const { error } = await supabase.from('v3_blocks').insert({ blocked_auth_uid: blockedAuthUid });
  if (error && !/duplicate|unique/i.test(error.message)) throw new Error(error.message);
}

export async function unblockUser(blockedAuthUid: string, myAuthUid: string): Promise<void> {
  await supabase.from('v3_blocks').delete().eq('blocker_auth_uid', myAuthUid).eq('blocked_auth_uid', blockedAuthUid);
}

/** True if I've blocked them, or they've blocked me (either way, no messaging). */
export async function isBlocked(otherAuthUid: string, myAuthUid: string): Promise<boolean> {
  const { data } = await supabase
    .from('v3_blocks')
    .select('blocker_auth_uid, blocked_auth_uid')
    .or(`and(blocker_auth_uid.eq.${myAuthUid},blocked_auth_uid.eq.${otherAuthUid}),and(blocker_auth_uid.eq.${otherAuthUid},blocked_auth_uid.eq.${myAuthUid})`)
    .limit(1);
  return !!data && data.length > 0;
}

/** Realtime: fire `cb` whenever any DM message is inserted (RLS scopes delivery
 * to my own threads). Callers re-query to refresh unread / the open thread. */
export function subscribeInbox(myAuthUid: string, cb: () => void): () => void {
  const channel = supabase
    .channel(`dm-inbox-${myAuthUid}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'v3_dm_messages' }, () => cb())
    .subscribe();
  return () => { void supabase.removeChannel(channel); };
}

/** Realtime for a single open thread — fire `cb` on new messages in it. */
export function subscribeThread(threadId: string, cb: (m: DmMessage) => void): () => void {
  const channel = supabase
    .channel(`dm-thread-${threadId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'v3_dm_messages', filter: `thread_id=eq.${threadId}` },
      payload => cb(toMsg(payload.new as MsgRow)),
    )
    .subscribe();
  return () => { void supabase.removeChannel(channel); };
}
