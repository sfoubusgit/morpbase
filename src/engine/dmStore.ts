import { supabase } from './supabaseClient';
import type { DirectMessage, DMThread } from '../types/community';
import { createNotification } from './notificationStore';

type DMRow = {
  id: string;
  sender_auth_uid: string;
  sender_name: string;
  recipient_auth_uid: string;
  recipient_name: string;
  body: string;
  prompt_snapshot: string | null;
  read_at: string | null;
  created_at: string;
};

const toMessage = (row: DMRow): DirectMessage => ({
  id: row.id,
  senderAuthUid: row.sender_auth_uid,
  recipientAuthUid: row.recipient_auth_uid,
  body: row.body,
  promptSnapshot: row.prompt_snapshot ?? null,
  readAt: row.read_at ? new Date(row.read_at).getTime() : null,
  createdAt: new Date(row.created_at).getTime(),
});

export async function sendDM(
  senderAuthUid: string,
  senderName: string,
  recipientAuthUid: string,
  recipientName: string,
  body: string,
  promptSnapshot?: string | null,
): Promise<DirectMessage> {
  const { data, error } = await supabase
    .from('direct_messages')
    .insert({
      sender_auth_uid: senderAuthUid,
      sender_name: senderName.trim() || 'Unknown',
      recipient_auth_uid: recipientAuthUid,
      recipient_name: recipientName.trim() || 'Unknown',
      body: body.trim(),
      prompt_snapshot: promptSnapshot?.trim() || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  void createNotification(recipientAuthUid, 'dm_received', {
    senderAuthUid,
    senderName,
  });

  return toMessage(data as DMRow);
}

export async function listThreads(authUid: string): Promise<DMThread[]> {
  try {
    const { data, error } = await supabase
      .from('direct_messages')
      .select('*')
      .or(`sender_auth_uid.eq.${authUid},recipient_auth_uid.eq.${authUid}`)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    const threadMap = new Map<string, { lastMsg: DMRow; unread: number; otherName: string }>();

    for (const row of data as DMRow[]) {
      const isSent = row.sender_auth_uid === authUid;
      const otherUid = isSent ? row.recipient_auth_uid : row.sender_auth_uid;
      const otherName = isSent ? row.recipient_name : row.sender_name;

      if (!threadMap.has(otherUid)) {
        threadMap.set(otherUid, { lastMsg: row, unread: 0, otherName });
      }
      // Count unread messages sent to me that I haven't read
      if (!isSent && !row.read_at) {
        threadMap.get(otherUid)!.unread++;
      }
    }

    return Array.from(threadMap.entries()).map(([otherUid, { lastMsg, unread, otherName }]) => ({
      otherAuthUid: otherUid,
      otherName,
      lastMessage: toMessage(lastMsg),
      unreadCount: unread,
    }));
  } catch {
    return [];
  }
}

export async function listMessages(
  myAuthUid: string,
  otherAuthUid: string,
): Promise<DirectMessage[]> {
  try {
    const { data, error } = await supabase
      .from('direct_messages')
      .select('*')
      .or(
        `and(sender_auth_uid.eq.${myAuthUid},recipient_auth_uid.eq.${otherAuthUid}),` +
        `and(sender_auth_uid.eq.${otherAuthUid},recipient_auth_uid.eq.${myAuthUid})`,
      )
      .order('created_at', { ascending: true });

    if (error) return [];
    return (data ?? []).map(row => toMessage(row as DMRow));
  } catch {
    return [];
  }
}

export async function markThreadRead(myAuthUid: string, otherAuthUid: string): Promise<void> {
  try {
    await supabase
      .from('direct_messages')
      .update({ read_at: new Date().toISOString() })
      .eq('sender_auth_uid', otherAuthUid)
      .eq('recipient_auth_uid', myAuthUid)
      .is('read_at', null);
  } catch {
    // non-fatal
  }
}

export async function getUnreadDMCount(authUid: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('direct_messages')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_auth_uid', authUid)
      .is('read_at', null);
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
