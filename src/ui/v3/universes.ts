/**
 * v3 Universes — the level ABOVE all lanes (a cross-lane world).
 * Content wiped to a clean slate (2026-06-27); no universes defined yet.
 */

export type V3Universe = {
  id: string;
  name: string;
  blurb: string;
  /** rgb-triplet, lane-style accent */
  accent: string;
};

export const ALL_UNIVERSES_ID = 'all';

export const UNIVERSES: V3Universe[] = [];

export function universeById(id: string): V3Universe | null {
  return UNIVERSES.find(u => u.id === id) ?? null;
}

/** Which universe an item belongs to. With no universes defined, everything is global. */
export function universeOfItem(_itemId: string): string {
  return ALL_UNIVERSES_ID;
}
