/**
 * v3 lane items — user-created lane objects, shared via Supabase.
 *
 * A lane object is a name + summary + a few prompt phrases + an optional cover.
 * Reads are public (lanes are browsable); writes require auth. Covers reuse the
 * public 'gen-images' bucket so we don't need a second bucket.
 */
import { supabase } from '../../engine/supabaseClient';

const BUCKET = 'gen-images';

export type RemoteLaneItem = {
  id: string;
  lane: string;
  name: string;
  summary: string;
  phrases: string[];
  coverUrl: string | null;
  author: string;
  createdAt: string;
};

type Row = {
  id: string;
  lane: string;
  name: string;
  summary: string | null;
  phrases: string[] | null;
  cover_url: string | null;
  author_label: string | null;
  created_at: string;
};

const toItem = (r: Row): RemoteLaneItem => ({
  id: r.id,
  lane: r.lane,
  name: r.name,
  summary: r.summary || '',
  phrases: Array.isArray(r.phrases) ? r.phrases : [],
  coverUrl: r.cover_url,
  author: r.author_label || 'creator',
  createdAt: r.created_at,
});

/** Public — every user-created lane item, newest first (all lanes). */
export async function listLaneItems(): Promise<RemoteLaneItem[]> {
  const { data, error } = await supabase
    .from('v3_lane_items')
    .select('id, lane, name, summary, phrases, cover_url, author_label, created_at')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error || !data) return [];
  return (data as Row[]).map(toItem);
}

/** Authenticated — create a lane item, optionally uploading a cover blob first. */
export async function createLaneItem(params: {
  lane: string;
  authUid: string;
  authorLabel: string;
  name: string;
  summary: string;
  phrases: string[];
  coverBlob?: Blob | null;
}): Promise<RemoteLaneItem> {
  const { lane, authUid, authorLabel, name, summary, phrases, coverBlob } = params;

  let coverUrl: string | null = null;
  let storagePath: string | null = null;
  if (coverBlob) {
    const path = `${authUid}/lane-${lane}-${Date.now()}.png`;
    const up = await supabase.storage.from(BUCKET).upload(path, coverBlob, { contentType: 'image/png', upsert: false });
    if (up.error) throw new Error(up.error.message);
    coverUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    storagePath = path;
  }

  const { data, error } = await supabase
    .from('v3_lane_items')
    .insert({
      lane,
      name,
      summary,
      phrases,
      cover_url: coverUrl,
      storage_path: storagePath,
      author_auth_uid: authUid,
      author_label: authorLabel,
    })
    .select('id, lane, name, summary, phrases, cover_url, author_label, created_at')
    .single();
  if (error) throw new Error(error.message);
  return toItem(data as Row);
}

/** Authenticated — delete one of the caller's own lane items. */
export async function deleteLaneItem(id: string): Promise<void> {
  const { error } = await supabase.from('v3_lane_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
