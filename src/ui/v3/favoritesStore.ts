/**
 * v3 Favorites — local bookmarks over public lane content.
 *
 * In the v3 model there is no "personal library": every lane object is publicly
 * browsable community content (CivitAI-style). What a user owns is their set of
 * *favorites* — items they bookmarked to reuse. Slice 1 keeps this client-side;
 * a Supabase-backed favorites table can replace the impl later without UI change.
 */

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

export const favoritesStore = {
  list(): string[] {
    return read();
  },
  has(id: string): boolean {
    return read().includes(id);
  },
  /** toggle and return the new full list */
  toggle(id: string): string[] {
    const ids = read();
    const next = ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id];
    write(next);
    return next;
  },
};
