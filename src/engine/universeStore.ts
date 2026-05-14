import type { Universe, UniverseInput } from '../types/universe';
import type { LaneUniverse } from '../types/laneSets';

const KEY = 'morpbase:universes:v1';
const UNIVERSE_SEED_FLAG_KEY = 'morpbase:universes:seeded:v1';
const UNIVERSE_SEED_FLAG_KEY_V2 = 'morpbase:universes:seeded:v2';

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

const SEED_UNIVERSE_V2_POOLS = {
  character: [
    'character_seed_alice_liddell',
    'character_seed_mad_hatter',
    'character_seed_cheshire_cat',
    'character_seed_red_queen',
    'character_seed_white_rabbit',
    'character_seed_march_hare',
    'character_seed_caterpillar',
    'character_seed_dormouse',
    'character_seed_tweedledee_tweedledum',
    'character_seed_white_queen',
    'character_seed_knave_of_hearts',
    'character_seed_duchess',
    'character_seed_gryphon',
  ],
  environment: [
    'environment_seed_wonderland_forest',
    'environment_seed_tea_party_grounds',
    'environment_seed_queens_croquet_ground',
    'environment_seed_rabbit_hole_descent',
    'environment_seed_pool_of_tears',
    'environment_seed_court_of_hearts',
    'environment_seed_tulgey_wood',
    'environment_seed_white_rabbit_house',
    'environment_seed_garden_live_flowers',
    'environment_seed_chess_landscape',
    'environment_seed_mushroom_glade',
    'environment_seed_duchess_kitchen',
    'environment_seed_looking_glass_room',
  ],
  wardrobe: [
    'outfit_aiw_alice_blue_pinafore',
    'outfit_aiw_playing_card_uniform',
    'outfit_aiw_red_queen_regalia',
    'outfit_aiw_mad_hatter_ensemble',
    'outfit_aiw_white_queen_gown',
    'outfit_aiw_victorian_visitor',
  ],
  mood: [
    'mood_aiw_uncanny_whimsy',
    'mood_aiw_victorian_dark',
    'mood_aiw_absurdist_calm',
    'mood_aiw_childlike_wonder',
    'mood_aiw_dream_logic',
    'mood_aiw_judgment_weight',
  ],
  style: [
    'style_aiw_storybook_illustration',
    'style_aiw_dark_fairy_tale',
    'style_aiw_handpainted_storybook',
    'style_aiw_tenniel_woodcut',
    'style_aiw_animated_storybook',
    'style_aiw_victorian_oil_portrait',
  ],
  lighting: [
    'lighting_aiw_wonderland_sourceless',
    'lighting_aiw_phosphorescent_undergrowth',
    'lighting_aiw_court_candlelight',
  ],
  object: [
    'object_aiw_pocket_watch',
    'object_aiw_hookah',
    'object_aiw_playing_cards',
    'object_aiw_mad_tea_service',
    'object_aiw_painted_roses',
    'object_aiw_flamingo_mallet',
    'object_aiw_drink_me_bottle',
    'object_aiw_eat_me_cake',
    'object_aiw_looking_glass',
    'object_aiw_cheshire_grin',
  ],
  aura: [
    'world_seed_alice_in_wonderland',
  ],
};

function maybeApplyUniverseSeedV2(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V2) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V2, 'true');
    const idx = universes.findIndex(u => u.id === SEED_UNIVERSE.id);
    if (idx === -1) return universes;
    const existing = universes[idx];
    const merged: Universe = {
      ...existing,
      pools: Object.fromEntries(
        Object.entries(SEED_UNIVERSE_V2_POOLS).map(([lane, ids]) => {
          const current: string[] = (existing.pools as Record<string, string[]>)[lane] ?? [];
          const union = Array.from(new Set([...current, ...ids]));
          return [lane, union];
        })
      ) as Universe['pools'],
      updatedAt: SEED_TS,
    };
    const next = [...universes.slice(0, idx), merged, ...universes.slice(idx + 1)];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

function maybeApplyUniverseSeed(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY) !== null) return maybeApplyUniverseSeedV2(universes);
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY, 'true');
    if (universes.some(u => u.id === SEED_UNIVERSE.id)) return maybeApplyUniverseSeedV2(universes);
    const next = [...universes, SEED_UNIVERSE];
    localStorage.setItem(KEY, JSON.stringify(next));
    return maybeApplyUniverseSeedV2(next);
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
