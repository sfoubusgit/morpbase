/**
 * v3 Universes — the level ABOVE all lanes.
 *
 * A universe is a cross-lane world: it curates items from every lane
 * (characters, scenery, mood, …) into one coherent set. In the v3 chrome the
 * universe is the top context (it sits above the lane nav). You browse lanes
 * *within* a universe, or switch to "All universes" to browse the global public
 * pool. Coherence across lanes is the whole point — pick a world, and every lane
 * is already scoped to it.
 *
 * Slice 1 ships a seeded set with a deterministic membership stand-in, so the
 * hierarchy (universe → lane → item) is tangible before real per-item universe
 * tagging lands in the backend (which the existing universeStore already models).
 */

export type V3Universe = {
  id: string;
  name: string;
  blurb: string;
  /** rgb tri... lane-style accent */
  accent: string;
};

export const ALL_UNIVERSES_ID = 'all';

export const UNIVERSES: V3Universe[] = [
  { id: 'neon-yokai', name: 'Neon Yokai', blurb: 'rain-soaked cyber folklore', accent: '110, 86, 249' },
  { id: 'deep-signal', name: 'Deep Signal', blurb: 'derelict deep-space salvage', accent: '96, 165, 250' },
  { id: 'porcelain-court', name: 'Porcelain Court', blurb: 'baroque courtly intrigue', accent: '244, 114, 182' },
  { id: 'solarpunk-bloom', name: 'Solarpunk Bloom', blurb: 'overgrown utopian futures', accent: '16, 185, 129' },
  { id: 'dust-run', name: 'Dust Run', blurb: 'high-desert outlaw chase', accent: '255, 138, 101' },
];

export function universeById(id: string): V3Universe | null {
  return UNIVERSES.find(u => u.id === id) ?? null;
}

/** Deterministic stand-in: which universe an item "belongs to" until real tagging exists. */
export function universeOfItem(itemId: string): string {
  let h = 0;
  for (let i = 0; i < itemId.length; i++) h = (h * 31 + itemId.charCodeAt(i)) >>> 0;
  return UNIVERSES[h % UNIVERSES.length].id;
}
