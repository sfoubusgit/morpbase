import type { Universe, UniverseInput } from '../types/universe';
import type { LaneUniverse } from '../types/laneSets';

const KEY = 'morpbase:universes:v1';
const UNIVERSE_SEED_FLAG_KEY = 'morpbase:universes:seeded:v1';

const SEED_TS = 1748217600000;

const SEED_UNIVERSE: Universe = {
  id: 'universe_seed_alice_in_wonderland',
  name: 'Alice in Wonderland',
  description: "Through the looking-glass — Carroll's impossible world of mad tea parties, riddles without answers, and logic turned delightfully on its head.",
  pools: {
    character: [
      'character_seed_alice_liddell',
      'character_seed_mad_hatter',
      'character_seed_cheshire_cat',
      'character_seed_red_queen',
      'character_seed_white_rabbit',
    ],
    environment: [
      'environment_seed_wonderland_forest',
      'environment_seed_tea_party_grounds',
      'environment_seed_queens_croquet_ground',
    ],
  },
  createdAt: SEED_TS,
  updatedAt: SEED_TS,
};

function createId(): string {
  return `universe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function maybeApplyUniverseSeed(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY, 'true');
    if (universes.some(u => u.id === SEED_UNIVERSE.id)) return universes;
    const next = [...universes, SEED_UNIVERSE];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

function load(): Universe[] {
  try {
    const raw = localStorage.getItem(KEY);
    const universes = raw ? (JSON.parse(raw) as Universe[]) : [];
    return maybeApplyUniverseSeed(universes);
  } catch {
    return maybeApplyUniverseSeed([]);
  }
}

function save(universes: Universe[]): void {
  localStorage.setItem(KEY, JSON.stringify(universes));
}

export function listUniverses(): Universe[] {
  return load();
}

export function createUniverse(input: UniverseInput): Universe {
  const universes = load();
  const now = Date.now();
  const next: Universe = {
    id: createId(),
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
    pools: input.pools ?? {},
    createdAt: now,
    updatedAt: now,
  };
  save([...universes, next]);
  return next;
}

export function updateUniversePools(id: string, pools: LaneUniverse): Universe | null {
  const universes = load();
  const index = universes.findIndex(u => u.id === id);
  if (index === -1) return null;
  const updated: Universe = { ...universes[index], pools, updatedAt: Date.now() };
  universes[index] = updated;
  save(universes);
  return updated;
}

export function deleteUniverse(id: string): void {
  save(load().filter(u => u.id !== id));
}
