import { supabase } from './supabaseClient';
import type { Notification, NotificationType } from '../types/community';

type NotifRow = {
  id: string;
  auth_uid: string;
  type: string;
  payload: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};

const toNotif = (row: NotifRow): Notification => ({
  id: row.id,
  authUid: row.auth_uid,
  type: row.type as NotificationType,
  payload: row.payload ?? {},
  readAt: row.read_at ? new Date(row.read_at).getTime() : null,
  createdAt: new Date(row.created_at).getTime(),
});

export async function createNotification(
  recipientAuthUid: string,
  type: NotificationType,
  payload: Record<string, unknown>,
): Promise<void> {
  try {
    await supabase.from('notifications').insert({
      auth_uid: recipientAuthUid,
      type,
      payload,
    });
  } catch {
    // non-fatal
  }
}

export async function listNotifications(
  authUid: string,
  limit = 30,
): Promise<Notification[]> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('auth_uid', authUid)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data ?? []).map(row => toNotif(row as NotifRow));
  } catch {
    return [];
  }
}

export async function getUnreadCount(authUid: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('auth_uid', authUid)
      .is('read_at', null);
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function markRead(id: string): Promise<void> {
  try {
    await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)
      .is('read_at', null);
  } catch {
    // non-fatal
  }
}

export async function markAllRead(authUid: string): Promise<void> {
  try {
    await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('auth_uid', authUid)
      .is('read_at', null);
  } catch {
    // non-fatal
  }
}
