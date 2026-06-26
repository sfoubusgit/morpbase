/**
 * v3 channel images — the first real (Supabase-backed) slice of the channel.
 *
 * Generated images saved to a channel are uploaded to the public 'gen-images'
 * bucket and recorded in v3_channel_images, keyed by the stable character id.
 * Reads are public (anyone browsing the channel sees them); writes require auth.
 */
import { supabase } from '../../engine/supabaseClient';

const BUCKET = 'gen-images';

export type RemoteImage = { id: string; author: string; url: string; createdAt: string };

/** Public — list the generated images shared to a subject's channel. */
export async function listGeneratedImages(subjectId: string): Promise<RemoteImage[]> {
  const { data, error } = await supabase
    .from('v3_channel_images')
    .select('id, author_label, url, created_at')
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: false })
    .limit(60);
  if (error || !data) return [];
  return data.map((r: { id: string; author_label: string | null; url: string; created_at: string }) => ({
    id: r.id,
    author: r.author_label || 'creator',
    url: r.url,
    createdAt: r.created_at,
  }));
}

/** Public — list every image a given user has generated, newest first. */
export async function listMyGeneratedImages(authUid: string): Promise<RemoteImage[]> {
  const { data, error } = await supabase
    .from('v3_channel_images')
    .select('id, author_label, url, created_at')
    .eq('author_auth_uid', authUid)
    .order('created_at', { ascending: false })
    .limit(120);
  if (error || !data) return [];
  return data.map((r: { id: string; author_label: string | null; url: string; created_at: string }) => ({
    id: r.id,
    author: r.author_label || 'creator',
    url: r.url,
    createdAt: r.created_at,
  }));
}

/** Authenticated — upload a generated image blob and record it on the channel. */
export async function saveGeneratedImage(params: {
  subjectId: string;
  authUid: string;
  authorLabel: string;
  blob: Blob;
}): Promise<RemoteImage> {
  const { subjectId, authUid, authorLabel, blob } = params;
  const path = `${authUid}/${subjectId}-${Date.now()}.png`;

  const up = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: 'image/png', upsert: false });
  if (up.error) throw new Error(up.error.message);

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const url = pub.publicUrl;

  const { data, error } = await supabase
    .from('v3_channel_images')
    .insert({ subject_id: subjectId, author_auth_uid: authUid, author_label: authorLabel, url, storage_path: path })
    .select('id, created_at')
    .single();
  if (error) throw new Error(error.message);

  return { id: data.id as string, author: authorLabel, url, createdAt: data.created_at as string };
}
