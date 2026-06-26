/**
 * v3 Favorites — a user's bookmarks over public lane content.
 *
 * In the v3 model there is no "personal library": every lane object is publicly
 * browsable community content (CivitAI-style). What a user owns is their set of
 * *favorites* — items they bookmarked to reuse.
 *
 * localStorage stays the instant, synchronous source of truth so the UI never
 * waits on the network. When the viewer is authed we mirror every change to
 * Supabase (`v3_favorites`) in the background and, on login, merge the remote
 * set into the local one so favorites follow the user across devices.
 */
import { supabase } from '../../engine/supabaseClient';

const STORAGE_KEY = 'morpbase:v3:favorites:v1';

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* non-fatal */
  }
}

// ── remote mirror (best-effort; never throws into the UI) ──
async function remoteAdd(authUid: string, subjectId: string): Promise<void> {
  try {
    await supabase
      .from('v3_favorites')
      .upsert({ auth_uid: authUid, subject_id: subjectId }, { onConflict: 'auth_uid,subject_id' });
  } catch {
    /* offline — local copy still holds it */
  }
}

async function remoteRemove(authUid: string, subjectId: string): Promise<void> {
  try {
    await supabase
      .from('v3_favorites')
      .delete()
      .eq('auth_uid', authUid)
      .eq('subject_id', subjectId);
  } catch {
    /* offline */
  }
}

export const favoritesStore = {
  list(): string[] {
    return read();
  },
  has(id: string): boolean {
    return read().includes(id);
  },
  /** Toggle and return the new full list. Mirrors to Supabase when authed. */
  toggle(id: string, authUid?: string | null): string[] {
    const ids = read();
    const removing = ids.includes(id);
    const next = removing ? ids.filter(x => x !== id) : [...ids, id];
    write(next);
    if (authUid) {
      void (removing ? remoteRemove(authUid, id) : remoteAdd(authUid, id));
    }
    return next;
  },
  /**
   * Pull the user's remote favorites, union them with whatever is already
   * local, persist the merged set, and push any local-only ids up so a fresh
   * device inherits prior bookmarks. Returns the merged list (or local on
   * failure). Call this once the viewer's auth uid is known.
   */
  async sync(authUid: string): Promise<string[]> {
    const local = read();
    try {
      const { data, error } = await supabase
        .from('v3_favorites')
        .select('subject_id')
        .eq('auth_uid', authUid);
      if (error || !data) return local;
      const remote = data.map((r: { subject_id: string }) => r.subject_id);
      const merged = Array.from(new Set([...remote, ...local]));
      write(merged);
      // Push ids that exist locally but not yet remotely.
      const remoteSet = new Set(remote);
      const toPush = local.filter(id => !remoteSet.has(id));
      if (toPush.length > 0) {
        await supabase
          .from('v3_favorites')
          .upsert(toPush.map(id => ({ auth_uid: authUid, subject_id: id })), { onConflict: 'auth_uid,subject_id' });
      }
      return merged;
    } catch {
      return local;
    }
  },
};
