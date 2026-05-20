import type { Universe, UniverseInput } from '../types/universe';
import type { LaneUniverse } from '../types/laneSets';

const KEY = 'morpbase:universes:v1';
const UNIVERSE_SEED_FLAG_KEY = 'morpbase:universes:seeded:v1';
const UNIVERSE_SEED_FLAG_KEY_V2 = 'morpbase:universes:seeded:v2';
const UNIVERSE_SEED_FLAG_KEY_V3 = 'morpbase:universes:seeded:v3';

const SEED_TS = 1748217600000;
const SEED_TS_NY = 1748476800000;

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

const SEED_UNIVERSE_NEON_YOKAI: Universe = {
  id: 'universe_seed_neon_yokai',
  name: 'Neon Yokai',
  description: 'A rain-slick megacity at 3am where old gods and ghosts wear the modern world like a disguise — kitsune behind the counter, ghosts on the last train, neon torii marking the threshold between the human city and the spirit one.',
  pools: {
    character: [
      'character_seed_ny_konbini_yurei',
      'character_seed_ny_subway_kitsune',
      'character_seed_ny_neon_oni',
      'character_seed_ny_kasa_obake',
      'character_seed_ny_rokurokubi',
      'character_seed_ny_tengu_courier',
      'character_seed_ny_nekomata_barista',
      'character_seed_ny_yuki_onna',
      'character_seed_ny_jorogumo',
      'character_seed_ny_bakeneko_idol',
      'character_seed_ny_zashiki_warashi',
      'character_seed_ny_nopperabo',
    ],
    environment: [
      'environment_seed_ny_scramble_crossing',
      'environment_seed_ny_konbini_interior',
      'environment_seed_ny_shrine_alley',
      'environment_seed_ny_subway_platform_night',
      'environment_seed_ny_yokocho_alley',
      'environment_seed_ny_capsule_corridor',
      'environment_seed_ny_rooftop_sprawl',
      'environment_seed_ny_pachinko_parlor',
      'environment_seed_ny_ramen_under_bridge',
      'environment_seed_ny_flooded_gutter',
      'environment_seed_ny_love_hotel_district',
      'environment_seed_ny_abandoned_shrine',
      'environment_seed_ny_late_train_interior',
    ],
    wardrobe: [
      'outfit_ny_neon_streetwear',
      'outfit_ny_cyber_kimono',
      'outfit_ny_konbini_uniform',
      'outfit_ny_holographic_idol',
      'outfit_ny_rain_slicker',
      'outfit_ny_yokai_formal',
    ],
    mood: [
      'mood_ny_neon_melancholy',
      'mood_ny_haunted_serenity',
      'mood_ny_electric_menace',
      'mood_ny_midnight_mischief',
      'mood_ny_rain_soaked_calm',
      'mood_ny_festival_fever',
    ],
    style: [
      'style_ny_neon_noir_anime',
      'style_ny_ukiyoe_neon',
      'style_ny_sumi_neon_ink',
      'style_ny_rain_slick_render',
      'style_ny_vhs_glitch',
      'style_ny_holographic_pop',
    ],
    lighting: [
      'lighting_ny_neon_sign_wash',
      'lighting_ny_konbini_fluorescent',
      'lighting_ny_paper_lantern_glow',
      'lighting_ny_spectral_self_glow',
      'lighting_ny_vending_machine_bloom',
      'lighting_ny_train_window_strobe',
    ],
    object: [
      'object_ny_paper_charm',
      'object_ny_vending_machine',
      'object_ny_neon_torii',
      'object_ny_spirit_lantern',
      'object_ny_cracked_phone',
      'object_ny_sake_cup',
      'object_ny_fox_mask',
    ],
    aura: [
      'world_seed_ny_neon_yokai',
    ],
  },
  createdAt: SEED_TS_NY,
  updatedAt: SEED_TS_NY,
};

function maybeApplyUniverseSeedV3(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V3) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V3, 'true');
    if (universes.some(u => u.id === SEED_UNIVERSE_NEON_YOKAI.id)) return universes;
    const next = [...universes, SEED_UNIVERSE_NEON_YOKAI];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

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
    return maybeApplyUniverseSeedV3(maybeApplyUniverseSeed(universes));
  } catch {
    return maybeApplyUniverseSeedV3(maybeApplyUniverseSeed([]));
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
