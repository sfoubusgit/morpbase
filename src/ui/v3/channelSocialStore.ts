/**
 * v3 channel social — real (Supabase-backed) comments + ratings for a channel.
 * Reads are public; writes require auth. Keyed by the stable character id.
 */
import { supabase } from '../../engine/supabaseClient';

export type RemoteComment = { id: string; author: string; body: string; createdAt: string };
export type RatingSummary = { avg: number; count: number; mine: number | null };

// ── comments ──
export async function listComments(subjectId: string): Promise<RemoteComment[]> {
  const { data, error } = await supabase
    .from('v3_channel_comments')
    .select('id, author_label, body, created_at')
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error || !data) return [];
  return data.map((r: { id: string; author_label: string | null; body: string; created_at: string }) => ({
    id: r.id,
    author: r.author_label || 'creator',
    body: r.body,
    createdAt: r.created_at,
  }));
}

export async function addComment(params: {
  subjectId: string;
  authUid: string;
  authorLabel: string;
  body: string;
}): Promise<RemoteComment> {
  const { subjectId, authUid, authorLabel, body } = params;
  const { data, error } = await supabase
    .from('v3_channel_comments')
    .insert({ subject_id: subjectId, author_auth_uid: authUid, author_label: authorLabel, body })
    .select('id, created_at')
    .single();
  if (error) throw new Error(error.message);
  return { id: data.id as string, author: authorLabel, body, createdAt: data.created_at as string };
}

// ── ratings ──
export async function getRatings(subjectId: string, myAuthUid?: string | null): Promise<RatingSummary> {
  const { data, error } = await supabase
    .from('v3_channel_ratings')
    .select('auth_uid, rating')
    .eq('subject_id', subjectId)
    .limit(2000);
  if (error || !data || data.length === 0) return { avg: 0, count: 0, mine: null };
  const rows = data as Array<{ auth_uid: string; rating: number }>;
  const sum = rows.reduce((a, r) => a + r.rating, 0);
  const mine = myAuthUid ? (rows.find(r => r.auth_uid === myAuthUid)?.rating ?? null) : null;
  return { avg: Math.round((sum / rows.length) * 10) / 10, count: rows.length, mine };
}

export async function setRating(params: { subjectId: string; authUid: string; rating: number }): Promise<void> {
  const { subjectId, authUid, rating } = params;
  const { error } = await supabase
    .from('v3_channel_ratings')
    .upsert({ subject_id: subjectId, auth_uid: authUid, rating, updated_at: new Date().toISOString() }, { onConflict: 'subject_id,auth_uid' });
  if (error) throw new Error(error.message);
}
