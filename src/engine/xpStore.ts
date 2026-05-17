import { supabase } from './supabaseClient';
import { XP_PER_EVENT, getTitleForXp } from '../data/communityTitles';
import type { XPEventType } from '../types/community';
import { createNotification } from './notificationStore';

export async function getUserXP(authUid: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('user_xp')
      .select('total_xp')
      .eq('auth_uid', authUid)
      .maybeSingle();
    if (error) return 0;
    return data?.total_xp ?? 0;
  } catch {
    return 0;
  }
}

export async function getXPMap(authUids: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (authUids.length === 0) return map;
  try {
    const unique = [...new Set(authUids)];
    const { data, error } = await supabase
      .from('user_xp')
      .select('auth_uid, total_xp')
      .in('auth_uid', unique);
    if (error) return map;
    for (const row of data ?? []) {
      map.set(row.auth_uid, row.total_xp ?? 0);
    }
  } catch {
    // return empty map
  }
  return map;
}

export async function awardXP(authUid: string, eventType: XPEventType): Promise<void> {
  const amount = XP_PER_EVENT[eventType];
  if (!amount) return;
  try {
    await supabase.rpc('award_xp', { p_auth_uid: authUid, p_amount: amount });
    const newXp = await getUserXP(authUid);
    const prevTitle = getTitleForXp(Math.max(0, newXp - amount));
    const newTitle = getTitleForXp(newXp);
    if (newTitle.slug !== prevTitle.slug) {
      void createNotification(authUid, 'xp_milestone', { title: newTitle.label, xp: newXp });
    }
  } catch {
    // non-fatal
  }
}
