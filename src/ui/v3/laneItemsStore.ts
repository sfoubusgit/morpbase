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
  authorAuthUid: string | null;
  world: string;
  /** for actions only — the relation phrase, e.g. "is dancing with" / "is kneeling" */
  relation: string;
  /** for actions only — true = solo (one character), false = pair (two) */
  solo: boolean;
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
  author_auth_uid: string | null;
  world: string | null;
  relation: string | null;
  solo: boolean | null;
  created_at: string;
};

// Select every column so a not-yet-migrated column (e.g. world/relation/solo on
// an out-of-date DB) can't break reads — toItem defaults anything missing.
const COLS = '*';

const toItem = (r: Row): RemoteLaneItem => ({
  id: r.id,
  lane: r.lane,
  name: r.name,
  summary: r.summary || '',
  phrases: Array.isArray(r.phrases) ? r.phrases : [],
  coverUrl: r.cover_url,
  author: r.author_label || 'creator',
  authorAuthUid: r.author_auth_uid,
  world: (r.world || '').trim(),
  relation: (r.relation || '').trim(),
  solo: !!r.solo,
  createdAt: r.created_at,
});

/** Public — every user-created lane item, newest first (all lanes). */
export async function listLaneItems(): Promise<RemoteLaneItem[]> {
  const { data, error } = await supabase
    .from('v3_lane_items')
    .select(COLS)
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) { console.error('[listLaneItems] read failed —', error.message); return []; }
  if (!data) return [];
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
  world?: string;
  relation?: string;
  solo?: boolean;
  coverBlob?: Blob | null;
}): Promise<RemoteLaneItem> {
  const { lane, authUid, authorLabel, name, summary, phrases, world, relation, solo, coverBlob } = params;

  let coverUrl: string | null = null;
  let storagePath: string | null = null;
  if (coverBlob) {
    const path = `${authUid}/lane-${lane}-${Date.now()}.png`;
    const up = await supabase.storage.from(BUCKET).upload(path, coverBlob, { contentType: 'image/png', upsert: false });
    if (up.error) throw new Error(up.error.message);
    coverUrl = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    storagePath = path;
  }

  // Base columns exist on every deployed DB. The optional ones (world/relation/
  // solo) come from later migrations — if a DB hasn't run them yet, inserting
  // them 400s with a schema-cache error and would lose the whole object. So try
  // the full insert, and on a missing-column error retry with base columns only
  // (a character/object needs none of the optional ones anyway).
  const baseRow = {
    lane,
    name,
    summary,
    phrases,
    cover_url: coverUrl,
    storage_path: storagePath,
    author_auth_uid: authUid,
    author_label: authorLabel,
  };
  const fullRow = {
    ...baseRow,
    world: (world || '').trim() || null,
    relation: (relation || '').trim() || null,
    solo: !!solo,
  };

  const insert = (row: object) => supabase.from('v3_lane_items').insert(row).select(COLS).single();
  const isMissingColumn = (msg: string) => /could not find|schema cache|column .* does not exist|PGRST204/i.test(msg);

  let { data, error } = await insert(fullRow);
  if (error && isMissingColumn(error.message)) {
    // DB is behind on migrations — persist the object with the columns that exist.
    console.warn('[createLaneItem] optional columns missing, saving base fields only —', error.message);
    ({ data, error } = await insert(baseRow));
  }
  if (error) {
    console.error('[createLaneItem] insert failed for lane', lane, '—', error.message);
    throw new Error(error.message);
  }
  return toItem(data as Row);
}

/** Authenticated — delete one of the caller's own lane items. */
export async function deleteLaneItem(id: string): Promise<void> {
  const { error } = await supabase.from('v3_lane_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
