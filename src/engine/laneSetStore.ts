import type { LaneSet, LaneSetInput } from '../types/laneSets';

const KEY = 'promptgen:lanesets:v1';
const BACKUP_KEY = 'promptgen:lanesets:backup:v1';
const SEED_FLAG = 'promptgen:lanesets:seeded:v1';

const SEED_TS = 1748131200000;

const SEED_LANE_SETS: LaneSet[] = [
  {
    id: 'laneset_seed_dragon_standoff',
    name: 'Dragon Standoff',
    description: 'Azurok and Pyrrok — blue storm vs volcanic fire. Every lane built for this specific confrontation: opposing elemental lighting, bilateral framing, mutual recognition.',
    tags: ['creature', 'duo', 'conflict'],
    lanes: {
      character: { mode: 'fixed', ids: ['character_seed_azurok', 'character_seed_pyrrok'] },
      dynamics: { mode: 'fixed', id: 'ip_29' },
      style: { mode: 'fixed', ids: ['style_seed_ancient_creature_concept'] },
      lighting: { mode: 'fixed', ids: ['lighting_seed_dual_elemental_opposition'] },
      composition: { mode: 'fixed', ids: ['composition_seed_bilateral_standoff'] },
      mood: { mode: 'fixed', ids: ['mood_seed_weight_of_recognition'] },
      wardrobe: { mode: 'off' },
      environment: { mode: 'fixed', ids: ['environment_seed_ashveil_ridge'] },
      aura: { mode: 'fixed', id: 'world_seed_dragon_standoff' },
    },
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'laneset_seed_creatine_cyberspace_gym',
    name: 'Creatine Cyberspace Gym',
    description: 'Vael & Holt and Alice & The White in the neon gym. Two duos, one aura, everything else rolls.',
    tags: ['duo', 'urban', 'horror', 'creature'],
    lanes: {
      character: { mode: 'fixed', ids: ['character_seed_vael_and_holt', 'character_seed_alice_and_the_white'] },
      dynamics: { mode: 'random' },
      style: { mode: 'random', count: 2 },
      lighting: { mode: 'random', count: 1 },
      composition: { mode: 'random', count: 1 },
      mood: { mode: 'random', count: 1 },
      wardrobe: { mode: 'off' },
      environment: { mode: 'random', count: 1 },
      aura: { mode: 'fixed', id: 'world_seed_creatine_cyberspace_gym' },
    },
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'laneset_seed_oracle_in_darkness',
    name: 'Oracle in Darkness',
    description: 'Vesper alone in the Beksiński aura — ageless, still, bone-cold. Everything else rolls.',
    tags: ['solo', 'oracle', 'horror'],
    lanes: {
      character: { mode: 'fixed', ids: ['character_seed_vesper'] },
      dynamics: { mode: 'off' },
      style: { mode: 'random', count: 1 },
      lighting: { mode: 'random', count: 1 },
      composition: { mode: 'random', count: 1 },
      mood: { mode: 'random', count: 1 },
      wardrobe: { mode: 'off' },
      environment: { mode: 'off' },
      aura: { mode: 'fixed', id: 'world_seed_beksinski' },
    },
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
];

const createId = () =>
  `ls_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

function load(): LaneSet[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return maybeApplySeed([]);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return maybeApplySeed([]);
    return maybeApplySeed(parsed as LaneSet[]);
  } catch {
    return maybeApplySeed([]);
  }
}

function save(sets: LaneSet[]): void {
  try {
    localStorage.setItem(BACKUP_KEY, localStorage.getItem(KEY) ?? '[]');
    localStorage.setItem(KEY, JSON.stringify(sets));
  } catch {
    // storage full
  }
}

function maybeApplySeed(sets: LaneSet[]): LaneSet[] {
  if (localStorage.getItem(SEED_FLAG) !== null) return sets;
  localStorage.setItem(SEED_FLAG, 'true');
  const existingIds = new Set(sets.map(s => s.id));
  const toAdd = SEED_LANE_SETS.filter(s => !existingIds.has(s.id));
  if (toAdd.length === 0) return sets;
  const merged = [...sets, ...toAdd];
  save(merged);
  return merged;
}

export function listLaneSets(): LaneSet[] {
  return load();
}

export function createLaneSet(input: LaneSetInput): LaneSet {
  const sets = load();
  const now = Date.now();
  const next: LaneSet = {
    id: createId(),
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
    tags: input.tags && input.tags.length > 0 ? input.tags : undefined,
    lanes: input.lanes,
    createdAt: now,
    updatedAt: now,
  };
  save([...sets, next]);
  return next;
}

export function updateLaneSet(id: string, input: LaneSetInput): LaneSet | null {
  const sets = load();
  const index = sets.findIndex(s => s.id === id);
  if (index === -1) return null;
  const updated: LaneSet = {
    ...sets[index],
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
    tags: input.tags && input.tags.length > 0 ? input.tags : undefined,
    lanes: input.lanes,
    updatedAt: Date.now(),
  };
  sets[index] = updated;
  save(sets);
  return updated;
}

export function deleteLaneSet(id: string): void {
  save(load().filter(s => s.id !== id));
}
