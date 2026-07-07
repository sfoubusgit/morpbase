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

/** Public — list every image a given user has generated, newest first.
 * Deduped by url: a post attached to N subjects writes N rows sharing one url,
 * so the profile grid would otherwise show the same image N times. */
export async function listMyGeneratedImages(authUid: string): Promise<RemoteImage[]> {
  const { data, error } = await supabase
    .from('v3_channel_images')
    .select('id, author_label, url, created_at')
    .eq('author_auth_uid', authUid)
    .order('created_at', { ascending: false })
    .limit(300);
  if (error || !data) return [];
  const seen = new Set<string>();
  const out: RemoteImage[] = [];
  for (const r of data as Array<{ id: string; author_label: string | null; url: string; created_at: string }>) {
    if (seen.has(r.url)) continue;
    seen.add(r.url);
    out.push({ id: r.id, author: r.author_label || 'creator', url: r.url, createdAt: r.created_at });
  }
  return out;
}

export type FeedPost = {
  postId: string;
  author: string;
  authorAuthUid: string;
  caption: string;
  createdAt: string;
  images: string[];        // unique image urls in the post
  subjectIds: string[];    // the characters/objects this post was made with
};

/** Recent posts from a set of creators (the Following feed), newest first.
 * Groups the flat image rows back into posts by post_id (legacy rows without a
 * post_id become single-image posts keyed by their own id). */
export async function listFeedPosts(authUids: string[], limit = 40): Promise<FeedPost[]> {
  if (authUids.length === 0) return [];
  const { data, error } = await supabase
    .from('v3_channel_images')
    .select('id, subject_id, author_auth_uid, author_label, url, caption, post_id, created_at')
    .in('author_auth_uid', authUids)
    .order('created_at', { ascending: false })
    .limit(400);
  if (error || !data) return [];
  const rows = data as Array<{ id: string; subject_id: string; author_auth_uid: string; author_label: string | null; url: string; caption: string | null; post_id: string | null; created_at: string }>;
  const byPost = new Map<string, FeedPost>();
  const order: string[] = [];
  for (const r of rows) {
    const key = r.post_id || r.id;
    let p = byPost.get(key);
    if (!p) {
      p = { postId: key, author: r.author_label || 'creator', authorAuthUid: r.author_auth_uid, caption: r.caption || '', createdAt: r.created_at, images: [], subjectIds: [] };
      byPost.set(key, p);
      order.push(key);
    }
    if (!p.images.includes(r.url)) p.images.push(r.url);
    if (r.subject_id && !p.subjectIds.includes(r.subject_id)) p.subjectIds.push(r.subject_id);
    if (!p.caption && r.caption) p.caption = r.caption;
  }
  return order.map(k => byPost.get(k) as FeedPost).slice(0, limit);
}

/** A single post by id (its own page). Groups the flat rows sharing this post_id
 * (or a legacy single-image row whose own id is the post id). */
export async function getPost(postId: string): Promise<FeedPost | null> {
  const { data, error } = await supabase
    .from('v3_channel_images')
    .select('id, subject_id, author_auth_uid, author_label, url, caption, post_id, created_at')
    .or(`post_id.eq.${postId},id.eq.${postId}`)
    .order('created_at', { ascending: true });
  if (error || !data || data.length === 0) return null;
  const rows = data as Array<{ id: string; subject_id: string; author_auth_uid: string; author_label: string | null; url: string; caption: string | null; post_id: string | null; created_at: string }>;
  const first = rows[0];
  const post: FeedPost = { postId, author: first.author_label || 'creator', authorAuthUid: first.author_auth_uid, caption: '', createdAt: first.created_at, images: [], subjectIds: [] };
  for (const r of rows) {
    if (!post.images.includes(r.url)) post.images.push(r.url);
    if (r.subject_id && !post.subjectIds.includes(r.subject_id)) post.subjectIds.push(r.subject_id);
    if (!post.caption && r.caption) post.caption = r.caption;
  }
  return post;
}

/** Authenticated — delete a post (RLS scopes the delete to the owner's rows).
 * Best-effort removal of the underlying storage files too. */
export async function deletePost(postId: string): Promise<void> {
  const { data } = await supabase
    .from('v3_channel_images')
    .select('storage_path')
    .or(`post_id.eq.${postId},id.eq.${postId}`);
  const paths = ((data ?? []) as Array<{ storage_path: string | null }>).map(r => r.storage_path).filter((p): p is string => !!p);
  const { error } = await supabase.from('v3_channel_images').delete().or(`post_id.eq.${postId},id.eq.${postId}`);
  if (error) throw new Error(error.message);
  if (paths.length) { try { await supabase.storage.from(BUCKET).remove([...new Set(paths)]); } catch { /* non-fatal */ } }
}

/** Authenticated — create a post: upload each image once, then write one row per
 * (image × attached subject) sharing a post_id, so every subject's gallery gets
 * the image via the existing subject_id read path. */
export async function createPost(params: {
  authUid: string;
  authorLabel: string;
  caption: string;
  subjectIds: string[];      // at least one — a post is attributed to what it used
  blobs: Blob[];             // at least one image
}): Promise<void> {
  const { authUid, authorLabel, caption, subjectIds, blobs } = params;
  if (subjectIds.length === 0) throw new Error('Attach at least one character or object you used.');
  if (blobs.length === 0) throw new Error('Add at least one image.');
  const postId = crypto.randomUUID();

  // upload each image once
  const uploaded: { url: string; path: string }[] = [];
  for (let i = 0; i < blobs.length; i++) {
    const path = `${authUid}/post-${postId}-${i}.png`;
    const up = await supabase.storage.from(BUCKET).upload(path, blobs[i], { contentType: blobs[i].type || 'image/png', upsert: false });
    if (up.error) throw new Error(up.error.message);
    const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
    uploaded.push({ url: pub.publicUrl, path });
  }

  // one row per (subject × image)
  const fullRows = subjectIds.flatMap(subjectId =>
    uploaded.map(u => ({
      subject_id: subjectId,
      author_auth_uid: authUid,
      author_label: authorLabel,
      url: u.url,
      storage_path: u.path,
      caption: caption.trim() || null,
      post_id: postId,
    })),
  );
  let { error } = await supabase.from('v3_channel_images').insert(fullRows);
  // If migration 0039 hasn't run yet, caption/post_id don't exist — degrade to the
  // base columns so the images still land in each subject's gallery (as single-
  // image posts) rather than failing the whole post.
  if (error && /could not find|schema cache|column .* does not exist|PGRST204/i.test(error.message)) {
    const baseRows = fullRows.map(({ caption: _c, post_id: _p, ...base }) => base);
    ({ error } = await supabase.from('v3_channel_images').insert(baseRows));
  }
  if (error) throw new Error(error.message);
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
