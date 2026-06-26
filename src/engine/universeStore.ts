import type { Universe, UniverseInput } from '../types/universe';
import type { LaneUniverse } from '../types/laneSets';

const KEY = 'morpbase:universes:v1';
const UNIVERSE_SEED_FLAG_KEY = 'morpbase:universes:seeded:v1';
const UNIVERSE_SEED_FLAG_KEY_V2 = 'morpbase:universes:seeded:v2';
const UNIVERSE_SEED_FLAG_KEY_V3 = 'morpbase:universes:seeded:v3';
const UNIVERSE_SEED_FLAG_KEY_V4 = 'morpbase:universes:seeded:v4';
const UNIVERSE_SEED_FLAG_KEY_V5 = 'morpbase:universes:seeded:v5';
const UNIVERSE_SEED_FLAG_KEY_V6 = 'morpbase:universes:seeded:v6';
const UNIVERSE_SEED_FLAG_KEY_V7 = 'morpbase:universes:seeded:v7';
const UNIVERSE_SEED_FLAG_KEY_V8 = 'morpbase:universes:seeded:v8';
const UNIVERSE_SEED_FLAG_KEY_V9 = 'morpbase:universes:seeded:v9';
const UNIVERSE_SEED_FLAG_KEY_V10 = 'morpbase:universes:seeded:v10';
const UNIVERSE_SEED_FLAG_KEY_V11 = 'morpbase:universes:seeded:v11';
const UNIVERSE_SEED_FLAG_KEY_V12 = 'morpbase:universes:seeded:v12';
const UNIVERSE_SEED_FLAG_KEY_V13 = 'morpbase:universes:seeded:v13';
const UNIVERSE_SEED_FLAG_KEY_V14 = 'morpbase:universes:seeded:v14';
const UNIVERSE_SEED_FLAG_KEY_V15 = 'morpbase:universes:seeded:v15';
const UNIVERSE_SEED_FLAG_KEY_V16 = 'morpbase:universes:seeded:v16';
const UNIVERSE_SEED_FLAG_KEY_V17 = 'morpbase:universes:seeded:v17';
const UNIVERSE_SEED_FLAG_KEY_V18 = 'morpbase:universes:seeded:v18';
const UNIVERSE_SEED_FLAG_KEY_V19 = 'morpbase:universes:seeded:v19';
const UNIVERSE_SEED_FLAG_KEY_V20 = 'morpbase:universes:seeded:v20';
const UNIVERSE_SEED_FLAG_KEY_V21 = 'morpbase:universes:seeded:v21';
const UNIVERSE_SEED_FLAG_KEY_V22 = 'morpbase:universes:seeded:v22';
const UNIVERSE_SEED_FLAG_KEY_V23 = 'morpbase:universes:seeded:v23';
const UNIVERSE_SEED_FLAG_KEY_V24 = 'morpbase:universes:seeded:v24';
const UNIVERSE_SEED_FLAG_KEY_V25 = 'morpbase:universes:seeded:v25';

const SEED_TS = 1748217600000;
const SEED_TS_NY = 1748476800000;
const SEED_TS_V4 = 1748563200000;
const SEED_TS_V5 = 1748649600000;
const SEED_TS_V6 = 1748736000000;
const SEED_TS_V7 = 1748822400000;
const SEED_TS_V8 = 1748908800000;
const SEED_TS_V9 = 1748995200000;
const SEED_TS_V10 = 1749081600000;
const SEED_TS_V11 = 1749168000000;
const SEED_TS_V12 = 1749254400000;
const SEED_TS_V13 = 1749340800000;
const SEED_TS_V14 = 1749427200000;
const SEED_TS_V15 = 1749513600000;
const SEED_TS_V16 = 1749686400000;
const SEED_TS_V17 = 1749772800000;
const SEED_TS_V18 = 1749945600000;
const SEED_TS_V19 = 1750032000000;
const SEED_TS_V20 = 1750118400000;
const SEED_TS_V21 = 1750291200000;
const SEED_TS_V22 = 1750377600000;
const SEED_TS_V23 = 1750464000000;
const SEED_TS_V24 = 1750550400000;
const SEED_TS_V25 = 1750636800000;

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

// V4 — merge previously orphaned ("directionless") lane items into coherent universes.
// Non-destructive: these universes only reference existing item IDs; nothing is deleted,
// and items may belong to more than one universe.
const SEED_UNIVERSE_BEKSINSKI: Universe = {
  id: 'universe_seed_beksinski',
  name: 'Beksiński',
  description: "Zdzisław Beksiński's dystopian dreamscape — corroded iron, bone and dried skin, vast melancholic decay rendered in beautiful wrongness.",
  pools: {
    style: ['style_seed_beksinski'],
    lighting: ['lighting_seed_abyss_underlight', 'lighting_seed_bioluminescent_glow', 'lighting_seed_moonlit_storm'],
    mood: ['mood_seed_ancient_and_terrible', 'mood_seed_cold_remote', 'mood_seed_strange_dreamlike', 'mood_seed_melancholic_quiet'],
    environment: [
      'environment_seed_sunken_bathhouse', 'environment_seed_drowned_cathedral', 'environment_seed_tidal_archive',
      'environment_seed_salt_mirror', 'environment_seed_ossuary_garden', 'environment_seed_glass_ruin',
      'environment_seed_black_tide_docks', 'environment_seed_drowned_planetarium', 'environment_seed_brine_caves',
      'environment_seed_fog_monastery',
    ],
    aura: ['world_seed_beksinski'],
  },
  createdAt: SEED_TS_V4,
  updatedAt: SEED_TS_V4,
};

const SEED_UNIVERSE_DRAGON_STANDOFF: Universe = {
  id: 'universe_seed_dragon_standoff',
  name: 'Dragon Standoff',
  description: 'An elemental dark-fantasy realm where storm grinds against volcano — ancient creatures, sundered geology, and weather as a weapon.',
  pools: {
    style: ['style_seed_epic_fantasy_concept', 'style_seed_ancient_creature_concept', 'style_seed_cinematic_creature_render', 'style_seed_norse_saga_illumination'],
    lighting: ['lighting_seed_dual_elemental_opposition', 'lighting_seed_storm_strike', 'lighting_seed_moonlit_storm', 'lighting_seed_aurora_canopy', 'lighting_seed_abyss_underlight'],
    mood: ['mood_seed_tense_foreboding', 'mood_seed_triumphant_epic', 'mood_seed_storm_born_fury', 'mood_seed_cold_sovereign', 'mood_seed_mythic_awe', 'mood_seed_dormant_thunder', 'mood_seed_ancient_and_terrible'],
    environment: [
      'environment_seed_ancient_mountain_city', 'environment_seed_observatory_rooftop', 'environment_seed_storm_spire',
      'environment_seed_glacial_vault', 'environment_seed_lightning_coast', 'environment_seed_azure_wastes',
      'environment_seed_volcanic_shore', 'environment_seed_ashveil_ridge', 'environment_seed_hanging_forest',
    ],
    aura: ['world_seed_dragon_standoff'],
  },
  createdAt: SEED_TS_V4,
  updatedAt: SEED_TS_V4,
};

const SEED_UNIVERSE_CREATINE_GYM: Universe = {
  id: 'universe_seed_creatine_gym',
  name: 'Creatine Cyberspace Gym',
  description: 'A neon-grid gym in cyberspace — chrome, wireframe weights and electric-blue glow, the pump rendered as commercial sci-fi.',
  pools: {
    style: ['style_seed_cinematic_render'],
    lighting: ['lighting_seed_studio_portrait'],
    mood: ['mood_seed_triumphant_epic', 'mood_seed_warm_intimate'],
    aura: ['world_seed_creatine_cyberspace_gym'],
  },
  createdAt: SEED_TS_V4,
  updatedAt: SEED_TS_V4,
};

const SEED_UNIVERSE_OPEN_ATELIER: Universe = {
  id: 'universe_seed_open_atelier',
  name: 'Open Atelier',
  description: 'A general toolkit of cross-cutting art directions — painterly and photographic styles, classic lighting, and mood primitives usable in any scene.',
  pools: {
    style: ['style_seed_dark_fantasy_oil', 'style_seed_ethereal_ink_wash', 'style_seed_noir_photograph', 'style_seed_cinematic_render', 'style_seed_pen_and_ink', 'style_seed_impressionist_oil', 'style_seed_mythic_old_masters', 'style_seed_iridescent_ink_wash'],
    lighting: ['lighting_seed_golden_hour_rim', 'lighting_seed_harsh_underlit', 'lighting_seed_diffuse_overcast', 'lighting_seed_candlelight', 'lighting_seed_cold_moonlight', 'lighting_seed_studio_portrait'],
    mood: ['mood_seed_melancholic_quiet', 'mood_seed_warm_intimate', 'mood_seed_strange_dreamlike', 'mood_seed_weight_of_recognition'],
  },
  createdAt: SEED_TS_V4,
  updatedAt: SEED_TS_V4,
};

const SEED_UNIVERSE_SORAYA: Universe = {
  id: 'universe_seed_soraya_vex',
  name: 'Soraya Vex',
  description: 'Soraya Vex — an original recurring character identity with her own LoRA trigger.',
  pools: {
    character: ['character_seed_soraya_vex'],
  },
  createdAt: SEED_TS_V4,
  updatedAt: SEED_TS_V4,
};

function maybeApplyUniverseSeedV4(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V4) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V4, 'true');
    const additions = [
      SEED_UNIVERSE_BEKSINSKI,
      SEED_UNIVERSE_DRAGON_STANDOFF,
      SEED_UNIVERSE_CREATINE_GYM,
      SEED_UNIVERSE_OPEN_ATELIER,
      SEED_UNIVERSE_SORAYA,
    ];
    const existingIds = new Set(universes.map(u => u.id));
    const toAdd = additions.filter(u => !existingIds.has(u.id));
    if (toAdd.length === 0) return universes;
    const next = [...universes, ...toAdd];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V5 — Solarpunk Bloom: a full in-app universe, a lush green-tech utopia — the warm tonal opposite of Neon Yokai.
const SEED_UNIVERSE_SOLARPUNK_BLOOM: Universe = {
  id: 'universe_seed_solarpunk_bloom',
  name: 'Solarpunk Bloom',
  description: 'A green-tech city at golden hour where technology and nature have finally grown together — vertical farms cascading down glass towers, solar sails on every roof, canals where streets used to be, and a warm, hopeful community tending it all.',
  pools: {
    character: [
      'character_seed_sb_greenhouse_keeper',
      'character_seed_sb_solar_courier',
      'character_seed_sb_mycologist',
      'character_seed_sb_rooftop_beekeeper',
      'character_seed_sb_water_weaver',
      'character_seed_sb_seed_librarian',
      'character_seed_sb_turbine_climber',
      'character_seed_sb_repair_tinkerer',
      'character_seed_sb_pollinator_wrangler',
      'character_seed_sb_forager_cook',
      'character_seed_sb_grove_warden',
      'character_seed_sb_festival_dancer',
    ],
    environment: [
      'environment_seed_sb_vertical_farm',
      'environment_seed_sb_botanical_dome',
      'environment_seed_sb_rooftop_commons',
      'environment_seed_sb_skybridge_dock',
      'environment_seed_sb_living_tram_station',
      'environment_seed_sb_canal_district',
      'environment_seed_sb_repair_cafe',
      'environment_seed_sb_turbine_ridge',
      'environment_seed_sb_floating_market',
      'environment_seed_sb_food_forest',
      'environment_seed_sb_algae_hall',
      'environment_seed_sb_seed_vault',
      'environment_seed_sb_solar_plaza',
    ],
    wardrobe: [
      'outfit_sb_solar_cloak',
      'outfit_sb_botanist_workwear',
      'outfit_sb_glider_flightsuit',
      'outfit_sb_living_fiber_dress',
      'outfit_sb_repair_coveralls',
      'outfit_sb_festival_bloomwear',
    ],
    mood: [
      'mood_sb_hopeful_dawn',
      'mood_sb_quiet_cultivation',
      'mood_sb_communal_warmth',
      'mood_sb_verdant_serenity',
      'mood_sb_inventive_wonder',
      'mood_sb_festival_abundance',
    ],
    style: [
      'style_sb_solarpunk_storybook',
      'style_sb_ghibli_pastoral',
      'style_sb_art_nouveau_botanical',
      'style_sb_sunlit_render',
      'style_sb_eco_watercolor',
      'style_sb_stained_glass_bloom',
    ],
    lighting: [
      'lighting_sb_dappled_canopy',
      'lighting_sb_greenhouse_diffusion',
      'lighting_sb_solar_glint',
      'lighting_sb_algae_glow',
      'lighting_sb_golden_field',
      'lighting_sb_overcast_pearl',
    ],
    object: [
      'object_sb_seed_dispenser',
      'object_sb_solar_lantern',
      'object_sb_pollinator_drone',
      'object_sb_harvest_basket',
      'object_sb_terrarium_pendant',
      'object_sb_tool_roll',
      'object_sb_watering_globe',
    ],
    aura: [
      'world_seed_sb_solarpunk_bloom',
    ],
  },
  createdAt: SEED_TS_V5,
  updatedAt: SEED_TS_V5,
};

function maybeApplyUniverseSeedV5(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V5) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V5, 'true');
    if (universes.some(u => u.id === SEED_UNIVERSE_SOLARPUNK_BLOOM.id)) return universes;
    const next = [...universes, SEED_UNIVERSE_SOLARPUNK_BLOOM];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V6 — Porcelain Court: a full in-app universe, an eerie rococo doll-court.
const SEED_UNIVERSE_PORCELAIN_COURT: Universe = {
  id: 'universe_seed_porcelain_court',
  name: 'Porcelain Court',
  description: 'A decaying rococo palace where the entire court are living porcelain dolls — glazed bisque skin and glass eyes, hairline cracks beneath the gilt, exquisite manners over genteel menace. Beautiful, melancholy, and stopped in time.',
  pools: {
    character: [
      'character_seed_pc_doll_queen',
      'character_seed_pc_clockwork_prince',
      'character_seed_pc_cracked_ballerina',
      'character_seed_pc_masked_courtier',
      'character_seed_pc_tea_maid',
      'character_seed_pc_marionette_jester',
      'character_seed_pc_weeping_countess',
      'character_seed_pc_child_heir',
      'character_seed_pc_harpsichordist',
      'character_seed_pc_dollmaker',
      'character_seed_pc_hollow_twins',
      'character_seed_pc_garden_statue_lady',
    ],
    environment: [
      'environment_seed_pc_throne_room',
      'environment_seed_pc_ballroom',
      'environment_seed_pc_mirror_gallery',
      'environment_seed_pc_music_chamber',
      'environment_seed_pc_doll_atelier',
      'environment_seed_pc_rococo_garden',
      'environment_seed_pc_banquet_hall',
      'environment_seed_pc_nursery',
      'environment_seed_pc_boudoir',
      'environment_seed_pc_conservatory',
      'environment_seed_pc_grand_staircase',
      'environment_seed_pc_clock_tower',
      'environment_seed_pc_doll_crypt',
    ],
    wardrobe: [
      'outfit_pc_court_gown',
      'outfit_pc_aristocrat_suit',
      'outfit_pc_ballerina_tutu',
      'outfit_pc_maid_pinafore',
      'outfit_pc_mourning_black',
      'outfit_pc_masquerade',
    ],
    mood: [
      'mood_pc_uncanny_elegance',
      'mood_pc_faded_grandeur',
      'mood_pc_frozen_stillness',
      'mood_pc_dollhouse_dread',
      'mood_pc_wistful_nostalgia',
      'mood_pc_genteel_menace',
    ],
    style: [
      'style_pc_rococo_oil',
      'style_pc_porcelain_render',
      'style_pc_gothic_storybook',
      'style_pc_faded_daguerreotype',
      'style_pc_pastel_gothic',
      'style_pc_baroque_chiaroscuro',
    ],
    lighting: [
      'lighting_pc_candelabra_glow',
      'lighting_pc_grimy_window',
      'lighting_pc_chandelier_refraction',
      'lighting_pc_tall_window_moonlight',
      'lighting_pc_gilt_bounce',
      'lighting_pc_musicbox_footlight',
    ],
    object: [
      'object_pc_cracked_mask',
      'object_pc_music_box',
      'object_pc_hand_fan',
      'object_pc_antique_doll',
      'object_pc_tea_service',
      'object_pc_stopped_clock',
      'object_pc_rose_dome',
    ],
    aura: [
      'world_seed_pc_porcelain_court',
    ],
  },
  createdAt: SEED_TS_V6,
  updatedAt: SEED_TS_V6,
};

function maybeApplyUniverseSeedV6(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V6) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V6, 'true');
    if (universes.some(u => u.id === SEED_UNIVERSE_PORCELAIN_COURT.id)) return universes;
    const next = [...universes, SEED_UNIVERSE_PORCELAIN_COURT];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V7 — Dust Run: a full in-app universe, a post-apocalyptic desert (spaghetti-western-meets-Mad-Max).
const SEED_UNIVERSE_DUST_RUN: Universe = {
  id: 'universe_seed_dust_run',
  name: 'Dust Run',
  description: 'A sun-blasted post-apocalyptic desert where the old world rusted away and only the hard and the thirsty are left — drifters and outlaws, water barons and scrap war-rigs, ghost towns and dune seas under a merciless sun. Spaghetti-western grit meets Mad-Max wasteland.',
  pools: {
    character: [
      'character_seed_dr_drifter',
      'character_seed_dr_water_baron',
      'character_seed_dr_mechanic',
      'character_seed_dr_bounty_hunter',
      'character_seed_dr_dust_oracle',
      'character_seed_dr_sheriff',
      'character_seed_dr_scavenger_kid',
      'character_seed_dr_road_warrior',
      'character_seed_dr_saloon_singer',
      'character_seed_dr_preacher',
      'character_seed_dr_outlaw_queen',
    ],
    environment: [
      'environment_seed_dr_salt_flats',
      'environment_seed_dr_dead_town',
      'environment_seed_dr_rust_garage',
      'environment_seed_dr_water_refinery',
      'environment_seed_dr_dune_sea',
      'environment_seed_dr_canyon_pass',
      'environment_seed_dr_saloon',
      'environment_seed_dr_scrapyard',
      'environment_seed_dr_gas_station',
      'environment_seed_dr_bone_yard',
      'environment_seed_dr_storm_wall',
      'environment_seed_dr_oasis',
      'environment_seed_dr_highway_wreck',
    ],
    wardrobe: [
      'outfit_dr_drifter_poncho',
      'outfit_dr_road_armor',
      'outfit_dr_scavenger_rags',
      'outfit_dr_saloon_dress',
      'outfit_dr_lawman_duster',
      'outfit_dr_desert_wraps',
    ],
    mood: [
      'mood_dr_sunbaked_desolation',
      'mood_dr_standoff_tension',
      'mood_dr_outlaw_swagger',
      'mood_dr_weary_survival',
      'mood_dr_lawless_menace',
      'mood_dr_last_hope_grit',
    ],
    style: [
      'style_dr_spaghetti_western',
      'style_dr_postapoc_concept',
      'style_dr_dustbowl_sepia',
      'style_dr_graphic_novel_ink',
      'style_dr_sunbleached_render',
      'style_dr_painted_poster',
    ],
    lighting: [
      'lighting_dr_harsh_noon',
      'lighting_dr_golden_dust',
      'lighting_dr_backlit_silhouette',
      'lighting_dr_saloon_shafts',
      'lighting_dr_campfire_night',
      'lighting_dr_duststorm_murk',
    ],
    object: [
      'object_dr_revolver',
      'object_dr_jerrycan',
      'object_dr_skull',
      'object_dr_hat',
      'object_dr_scrap_rifle',
      'object_dr_compass',
      'object_dr_canteen',
    ],
    aura: [
      'world_seed_dr_dust_run',
    ],
  },
  createdAt: SEED_TS_V7,
  updatedAt: SEED_TS_V7,
};

function maybeApplyUniverseSeedV7(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V7) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V7, 'true');
    if (universes.some(u => u.id === SEED_UNIVERSE_DUST_RUN.id)) return universes;
    const next = [...universes, SEED_UNIVERSE_DUST_RUN];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V8 — Deep Signal: a full in-app universe, a bioluminescent deep-sea station drifting toward cosmic horror.
const SEED_UNIVERSE_DEEP_SIGNAL: Universe = {
  id: 'universe_seed_deep_signal',
  name: 'Deep Signal',
  description: 'A bioluminescent deep-sea research station clinging to a black trench wall, miles down, slowly failing — a crew coming apart as a signal from the abyss takes hold and the dark begins to rewrite them. Crushing isolation, glowing horrors, and something vast and ancient awake below.',
  pools: {
    character: [
      'character_seed_ds_commander',
      'character_seed_ds_biologist',
      'character_seed_ds_diver',
      'character_seed_ds_engineer',
      'character_seed_ds_comms',
      'character_seed_ds_doctor',
      'character_seed_ds_cultist',
      'character_seed_ds_changed',
      'character_seed_ds_siren',
      'character_seed_ds_drowned',
      'character_seed_ds_herald',
    ],
    environment: [
      'environment_seed_ds_observation_dome',
      'environment_seed_ds_command_deck',
      'environment_seed_ds_moon_pool',
      'environment_seed_ds_specimen_lab',
      'environment_seed_ds_corridors',
      'environment_seed_ds_engine_core',
      'environment_seed_ds_dive_bay',
      'environment_seed_ds_crew_quarters',
      'environment_seed_ds_trench_exterior',
      'environment_seed_ds_bioluminescent_reef',
      'environment_seed_ds_hydrothermal_vents',
      'environment_seed_ds_wreck',
      'environment_seed_ds_eldritch_depths',
    ],
    wardrobe: [
      'outfit_ds_dive_suit',
      'outfit_ds_station_jumpsuit',
      'outfit_ds_lab_wetgear',
      'outfit_ds_engineer_rig',
      'outfit_ds_cult_robes',
      'outfit_ds_changed_fleshsuit',
    ],
    mood: [
      'mood_ds_crushing_isolation',
      'mood_ds_creeping_dread',
      'mood_ds_bioluminescent_wonder',
      'mood_ds_claustrophobic_panic',
      'mood_ds_eldritch_awe',
      'mood_ds_cold_abyssal_calm',
    ],
    style: [
      'style_ds_deepsea_render',
      'style_ds_cosmic_horror',
      'style_ds_biolum_ink',
      'style_ds_found_footage',
      'style_ds_painterly_horror',
      'style_ds_iridescent_abyssal',
    ],
    lighting: [
      'lighting_ds_bioluminescent',
      'lighting_ds_submersible_flood',
      'lighting_ds_emergency_red',
      'lighting_ds_console_glow',
      'lighting_ds_lure_light',
      'lighting_ds_abyssal_dark',
    ],
    object: [
      'object_ds_diving_helmet',
      'object_ds_specimen_jar',
      'object_ds_hydrophone',
      'object_ds_distress_beacon',
      'object_ds_speargun',
      'object_ds_eldritch_idol',
      'object_ds_rebreather',
    ],
    aura: [
      'world_seed_ds_deep_signal',
    ],
  },
  createdAt: SEED_TS_V8,
  updatedAt: SEED_TS_V8,
};

function maybeApplyUniverseSeedV8(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V8) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V8, 'true');
    if (universes.some(u => u.id === SEED_UNIVERSE_DEEP_SIGNAL.id)) return universes;
    const next = [...universes, SEED_UNIVERSE_DEEP_SIGNAL];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V9 — Style Lab: a toolkit universe of reusable, subject-agnostic art styles usable in any other universe.
const SEED_UNIVERSE_STYLE_LAB: Universe = {
  id: 'universe_seed_style_lab',
  name: 'Style Lab',
  description: 'A toolkit of reusable art directions — oil, watercolor, 3D render, anime, noir photo and more. Not a story world: activate it (or just pull from its Style pool) to drop any look onto any subject from any universe.',
  pools: {
    style: [
      'style_lab_oil_painting',
      'style_lab_watercolor',
      'style_lab_gouache',
      'style_lab_ink_wash',
      'style_lab_charcoal',
      'style_lab_pen_ink',
      'style_lab_3d_render',
      'style_lab_claymation',
      'style_lab_pixel_art',
      'style_lab_anime_cel',
      'style_lab_painterly_anime',
      'style_lab_comic',
      'style_lab_noir_photo',
      'style_lab_film_35mm',
      'style_lab_polaroid',
      'style_lab_art_nouveau',
      'style_lab_ukiyoe',
      'style_lab_bauhaus',
      'style_lab_vaporwave',
      'style_lab_risograph',
      'style_lab_graphic_scifi',
      'style_lab_charcoal_drawing',
      'style_lab_charcoal_dark_anime',
      'style_lab_charcoal_anime',
      'style_lab_dark_charcoal_anime',
      'style_lab_stained_glass_neon',
    ],
  },
  createdAt: SEED_TS_V9,
  updatedAt: SEED_TS_V9,
};

function maybeApplyUniverseSeedV9(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V9) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V9, 'true');
    if (universes.some(u => u.id === SEED_UNIVERSE_STYLE_LAB.id)) return universes;
    const next = [...universes, SEED_UNIVERSE_STYLE_LAB];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V10 — non-destructive: merge the new 'style_lab_graphic_scifi' style into the
// existing Style Lab universe pool for users who already seeded V9.
function maybeApplyUniverseSeedV10(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V10) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V10, 'true');
    const idx = universes.findIndex(u => u.id === SEED_UNIVERSE_STYLE_LAB.id);
    if (idx === -1) return universes;
    const existing = universes[idx];
    const currentStyle = existing.pools.style ?? [];
    if (currentStyle.includes('style_lab_graphic_scifi')) return universes;
    const merged: Universe = {
      ...existing,
      pools: { ...existing.pools, style: [...currentStyle, 'style_lab_graphic_scifi'] },
      updatedAt: SEED_TS_V10,
    };
    const next = [...universes.slice(0, idx), merged, ...universes.slice(idx + 1)];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V11 — non-destructive: merge the new 'style_lab_charcoal_drawing' style into the
// existing Style Lab universe pool for users who already seeded earlier.
function maybeApplyUniverseSeedV11(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V11) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V11, 'true');
    const idx = universes.findIndex(u => u.id === SEED_UNIVERSE_STYLE_LAB.id);
    if (idx === -1) return universes;
    const existing = universes[idx];
    const currentStyle = existing.pools.style ?? [];
    if (currentStyle.includes('style_lab_charcoal_drawing')) return universes;
    const merged: Universe = {
      ...existing,
      pools: { ...existing.pools, style: [...currentStyle, 'style_lab_charcoal_drawing'] },
      updatedAt: SEED_TS_V11,
    };
    const next = [...universes.slice(0, idx), merged, ...universes.slice(idx + 1)];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V12 — non-destructive: merge the new 'style_lab_charcoal_dark_anime' style into
// the existing Style Lab universe pool for users who already seeded earlier.
function maybeApplyUniverseSeedV12(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V12) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V12, 'true');
    const idx = universes.findIndex(u => u.id === SEED_UNIVERSE_STYLE_LAB.id);
    if (idx === -1) return universes;
    const existing = universes[idx];
    const currentStyle = existing.pools.style ?? [];
    if (currentStyle.includes('style_lab_charcoal_dark_anime')) return universes;
    const merged: Universe = {
      ...existing,
      pools: { ...existing.pools, style: [...currentStyle, 'style_lab_charcoal_dark_anime'] },
      updatedAt: SEED_TS_V12,
    };
    const next = [...universes.slice(0, idx), merged, ...universes.slice(idx + 1)];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V13 — non-destructive: merge the new 'style_lab_charcoal_anime' style into the
// existing Style Lab universe pool for users who already seeded earlier.
function maybeApplyUniverseSeedV13(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V13) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V13, 'true');
    const idx = universes.findIndex(u => u.id === SEED_UNIVERSE_STYLE_LAB.id);
    if (idx === -1) return universes;
    const existing = universes[idx];
    const currentStyle = existing.pools.style ?? [];
    if (currentStyle.includes('style_lab_charcoal_anime')) return universes;
    const merged: Universe = {
      ...existing,
      pools: { ...existing.pools, style: [...currentStyle, 'style_lab_charcoal_anime'] },
      updatedAt: SEED_TS_V13,
    };
    const next = [...universes.slice(0, idx), merged, ...universes.slice(idx + 1)];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V14 — non-destructive: merge the new 'style_lab_dark_charcoal_anime' style into
// the existing Style Lab universe pool for users who already seeded earlier.
function maybeApplyUniverseSeedV14(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V14) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V14, 'true');
    const idx = universes.findIndex(u => u.id === SEED_UNIVERSE_STYLE_LAB.id);
    if (idx === -1) return universes;
    const existing = universes[idx];
    const currentStyle = existing.pools.style ?? [];
    if (currentStyle.includes('style_lab_dark_charcoal_anime')) return universes;
    const merged: Universe = {
      ...existing,
      pools: { ...existing.pools, style: [...currentStyle, 'style_lab_dark_charcoal_anime'] },
      updatedAt: SEED_TS_V14,
    };
    const next = [...universes.slice(0, idx), merged, ...universes.slice(idx + 1)];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V15 — non-destructive: merge the new 'style_lab_stained_glass_neon' style into
// the existing Style Lab universe pool for users who already seeded earlier.
function maybeApplyUniverseSeedV15(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V15) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V15, 'true');
    const idx = universes.findIndex(u => u.id === SEED_UNIVERSE_STYLE_LAB.id);
    if (idx === -1) return universes;
    const existing = universes[idx];
    const currentStyle = existing.pools.style ?? [];
    if (currentStyle.includes('style_lab_stained_glass_neon')) return universes;
    const merged: Universe = {
      ...existing,
      pools: { ...existing.pools, style: [...currentStyle, 'style_lab_stained_glass_neon'] },
      updatedAt: SEED_TS_V15,
    };
    const next = [...universes.slice(0, idx), merged, ...universes.slice(idx + 1)];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V16 — Saint Circuit: a full in-app universe, a blue-saturated religious-cyberpunk cathedral-city.
const SEED_UNIVERSE_SAINT_CIRCUIT: Universe = {
  id: 'universe_seed_saint_circuit',
  name: 'Saint Circuit',
  description: 'A cathedral-city where the machine is holy — cyber-monks in cobalt robes, machine-saints with neon halos, stained-glass screens broadcasting liturgy, and the steady electric-blue hum of the great prayer-engines beneath the nave. Devotion runs on current. Lit almost entirely in Marian-blue and electric cyan.',
  pools: {
    character: [
      'character_seed_sc_cardinal',
      'character_seed_sc_cyber_monk',
      'character_seed_sc_stained_saint',
      'character_seed_sc_acolyte',
      'character_seed_sc_choir_ai',
      'character_seed_sc_inquisitor',
      'character_seed_sc_confessor',
      'character_seed_sc_bell_ringer',
      'character_seed_sc_iconographer',
      'character_seed_sc_penitent',
      'character_seed_sc_machine_hermit',
      'character_seed_sc_heretic',
    ],
    environment: [
      'environment_seed_sc_great_nave',
      'environment_seed_sc_datapane_wall',
      'environment_seed_sc_prayer_engine',
      'environment_seed_sc_cloister',
      'environment_seed_sc_confessional',
      'environment_seed_sc_bell_tower',
      'environment_seed_sc_crypt',
      'environment_seed_sc_firmware_library',
      'environment_seed_sc_choir_loft',
      'environment_seed_sc_inquisition_hall',
      'environment_seed_sc_outer_court',
      'environment_seed_sc_heretic_tunnels',
      'environment_seed_sc_rooftop_spires',
    ],
    wardrobe: [
      'outfit_sc_cardinal_vestments',
      'outfit_sc_monk_habit',
      'outfit_sc_inquisitor_armor',
      'outfit_sc_acolyte_cassock',
      'outfit_sc_penitent_robes',
      'outfit_sc_heretic_rags',
    ],
    mood: [
      'mood_sc_sacred_awe',
      'mood_sc_cold_liturgy',
      'mood_sc_electric_penitence',
      'mood_sc_inquisitorial_menace',
      'mood_sc_holy_stillness',
      'mood_sc_heretic_defiance',
    ],
    style: [
      'style_sc_stained_glass_icon',
      'style_sc_byzantine_mosaic',
      'style_sc_gothic_render',
      'style_sc_iconic_halftone',
      'style_sc_sacred_realism',
      'style_sc_cathedral_photo',
      'style_sc_illuminated_manuscript',
      'style_sc_orthodox_icon',
      'style_sc_dore_engraving',
      'style_sc_cathedral_fresco',
      'style_sc_cobalt_cyanotype',
    ],
    lighting: [
      'lighting_sc_cobalt_glass',
      'lighting_sc_neon_halo',
      'lighting_sc_engine_underglow',
      'lighting_sc_candle_led',
      'lighting_sc_inquisitor_spot',
      'lighting_sc_bell_moonlight',
    ],
    object: [
      'object_sc_rosary_processor',
      'object_sc_sigil_blade',
      'object_sc_halo_crown',
      'object_sc_datapane',
      'object_sc_censer_drone',
      'object_sc_bell_wires',
      'object_sc_icono_stylus',
    ],
    aura: [
      'world_seed_sc_saint_circuit',
    ],
  },
  createdAt: SEED_TS_V16,
  updatedAt: SEED_TS_V16,
};

function maybeApplyUniverseSeedV16(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V16) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V16, 'true');
    if (universes.some(u => u.id === SEED_UNIVERSE_SAINT_CIRCUIT.id)) return universes;
    const next = [...universes, SEED_UNIVERSE_SAINT_CIRCUIT];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V17 — non-destructive: merge the 5 new Saint Circuit native styles into the
// existing Saint Circuit universe style pool for users who already seeded V16.
function maybeApplyUniverseSeedV17(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V17) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V17, 'true');
    const idx = universes.findIndex(u => u.id === SEED_UNIVERSE_SAINT_CIRCUIT.id);
    if (idx === -1) return universes;
    const existing = universes[idx];
    const currentStyle = existing.pools.style ?? [];
    const additions = [
      'style_sc_illuminated_manuscript',
      'style_sc_orthodox_icon',
      'style_sc_dore_engraving',
      'style_sc_cathedral_fresco',
      'style_sc_cobalt_cyanotype',
    ].filter(id => !currentStyle.includes(id));
    if (additions.length === 0) return universes;
    const merged: Universe = {
      ...existing,
      pools: { ...existing.pools, style: [...currentStyle, ...additions] },
      updatedAt: SEED_TS_V17,
    };
    const next = [...universes.slice(0, idx), merged, ...universes.slice(idx + 1)];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

const SEED_UNIVERSE_ORCHARD_REVERIE: Universe = {
  id: 'universe_seed_orchard_reverie',
  name: 'Orchard Reverie',
  description: 'An eternal-summer sacred orchard over endless golden grasslands. An order of fruit-bonded priestess-wardens — peach, pomegranate, cherry, plum, grape and more — tend colossal ancient fruit-trees through a perpetual harvest rite. The summer stays eternal only so long as the rite is kept, lending a quiet, precious fragility beneath the warmth. Lit always in honey-gold, peach and soft green. Glamour-pastoral, alluring but wholesome. (Style lane falls back to Style Lab — pair with any look.)',
  pools: {
    character: [
      'character_seed_or_apple',
      'character_seed_or_peach',
      'character_seed_or_pomegranate',
      'character_seed_or_fig',
      'character_seed_or_citrus',
      'character_seed_or_cherry',
      'character_seed_or_plum',
      'character_seed_or_grape',
      'character_seed_or_apricot',
      'character_seed_or_melon',
      'character_seed_or_berry',
      'character_seed_or_pear',
    ],
    environment: [
      'environment_seed_or_endless_grove',
      'environment_seed_or_heart_tree',
      'environment_seed_or_festival_grounds',
      'environment_seed_or_cider_hall',
      'environment_seed_or_bathing_springs',
      'environment_seed_or_orchard_market',
      'environment_seed_or_grass_sea',
      'environment_seed_or_wardens_bower',
      'environment_seed_or_sun_shrine',
      'environment_seed_or_preserving_cellar',
      'environment_seed_or_blossom_vale',
      'environment_seed_or_granary_windmill',
      'environment_seed_or_last_light_hill',
    ],
    wardrobe: [
      'outfit_or_warden_regalia',
      'outfit_or_linen_sundress',
      'outfit_or_festival_attire',
      'outfit_or_bathing_wrap',
      'outfit_or_blossom_robe',
      'outfit_or_gardener_wrap',
    ],
    mood: [
      'mood_or_summer_idyll',
      'mood_or_harvest_reverence',
      'mood_or_languid_ripeness',
      'mood_or_festival_joy',
      'mood_or_autumn_wistful',
      'mood_or_blossom_tenderness',
    ],
    lighting: [
      'lighting_or_golden_grass',
      'lighting_or_dappled_canopy',
      'lighting_or_lantern_festival',
      'lighting_or_dawn_mist',
      'lighting_or_honey_backlight',
      'lighting_or_last_amber',
    ],
    object: [
      'object_or_harvest_basket',
      'object_or_warden_sickle',
      'object_or_sun_medallion',
      'object_or_cider_jug',
      'object_or_blossom_crown',
      'object_or_fruit_bough',
    ],
    aura: [
      'world_seed_or_orchard_reverie',
    ],
  },
  createdAt: SEED_TS_V18,
  updatedAt: SEED_TS_V18,
};

function maybeApplyUniverseSeedV18(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V18) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V18, 'true');
    if (universes.some(u => u.id === SEED_UNIVERSE_ORCHARD_REVERIE.id)) return universes;
    const next = [...universes, SEED_UNIVERSE_ORCHARD_REVERIE];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

const SEED_UNIVERSE_EROS_ATELIER: Universe = {
  id: 'universe_seed_eros_atelier',
  name: 'Eros Atelier',
  description: 'A curated library of art styles for tasteful erotic and glamour body work. Each style was chosen because the medium itself either does the covering or provides the dramatic framing for sensual subjects. Spans painting, illustration, photography, and original signature looks. Apply any style here to any character, environment or pose elsewhere in MorpBase.',
  pools: {
    style: [
      'style_eros_mucha_panel',
      'style_eros_klimt_gold',
      'style_eros_caravaggio',
      'style_eros_pre_raphaelite',
      'style_eros_nagel_pop',
      'style_eros_smoke_couture',
      'style_eros_backlit_sheer',
      'style_eros_charcoal_study',
      'style_eros_pierre_gilles',
      'style_eros_sumi_e',
    ],
  },
  createdAt: SEED_TS_V19,
  updatedAt: SEED_TS_V19,
};

function maybeApplyUniverseSeedV19(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V19) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V19, 'true');
    if (universes.some(u => u.id === SEED_UNIVERSE_EROS_ATELIER.id)) return universes;
    const next = [...universes, SEED_UNIVERSE_EROS_ATELIER];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V20 — non-destructive: merge the new 'style_lab_cinematic_stained_glass_neon'
// style into the existing Style Lab universe pool for users who already seeded earlier.
function maybeApplyUniverseSeedV20(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V20) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V20, 'true');
    const idx = universes.findIndex(u => u.id === SEED_UNIVERSE_STYLE_LAB.id);
    if (idx === -1) return universes;
    const existing = universes[idx];
    const currentStyle = existing.pools.style ?? [];
    if (currentStyle.includes('style_lab_cinematic_stained_glass_neon')) return universes;
    const merged: Universe = {
      ...existing,
      pools: { ...existing.pools, style: [...currentStyle, 'style_lab_cinematic_stained_glass_neon'] },
      updatedAt: SEED_TS_V20,
    };
    const next = [...universes.slice(0, idx), merged, ...universes.slice(idx + 1)];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

const SEED_UNIVERSE_PLANET_PISTACHIO: Universe = {
  id: 'universe_seed_planet_pistachio',
  name: 'Planet Pistachio\'s Extraterrestrial Madness',
  description: 'A pistachio-green planet at the edge of known space where the camp pulp 1950s sci-fi never ended and joyful psychedelia keeps it weird. Alien queens with shell-crowns rule from baroque palaces, glamorous miners chip at drifting asteroids in evening gowns, lounge singers serenade comets at the diner at the end of the universe, sentient pumpkins debate philosophy in chrome greenhouses. Talking plants, glow-frogs, mood-cacti, lava-lamp skies. Madness as in unhinged-joy. Palette: pistachio-green, hot pink, tangerine, lavender, gold. (Style lane falls back to Style Lab — pair with any look.)',
  pools: {
    character: [
      'character_seed_pp_queen',
      'character_seed_pp_miner',
      'character_seed_pp_frog_wrangler',
      'character_seed_pp_botanist',
      'character_seed_pp_lounge_singer',
      'character_seed_pp_robot_chef',
      'character_seed_pp_comet_surfer',
      'character_seed_pp_mailman',
      'character_seed_pp_cactus_druid',
      'character_seed_pp_spore_dancer',
      'character_seed_pp_star_pilot',
      'character_seed_pp_tree_mayor',
    ],
    environment: [
      'environment_seed_pp_pistachio_sea',
      'environment_seed_pp_salt_flats',
      'environment_seed_pp_bobble_forest',
      'environment_seed_pp_honey_caves',
      'environment_seed_pp_diner',
      'environment_seed_pp_asteroid_mines',
      'environment_seed_pp_lava_lamp_sky',
      'environment_seed_pp_carnival',
      'environment_seed_pp_comet_harbor',
      'environment_seed_pp_greenhouse',
      'environment_seed_pp_palace',
      'environment_seed_pp_trampoline_crater',
      'environment_seed_pp_listening_pond',
    ],
    wardrobe: [
      'outfit_pp_satin_gown',
      'outfit_pp_retro_flight_suit',
      'outfit_pp_lounge_gown',
      'outfit_pp_lab_coat',
      'outfit_pp_wrangler',
      'outfit_pp_carnival_jumpsuit',
    ],
    mood: [
      'mood_pp_camp_glee',
      'mood_pp_retro_chic',
      'mood_pp_psychedelic_calm',
      'mood_pp_kitsch_wonder',
      'mood_pp_ridiculous_menace',
      'mood_pp_lo_gravity_play',
    ],
    lighting: [
      'lighting_pp_pistachio_noon',
      'lighting_pp_twin_moon',
      'lighting_pp_comet_flare',
      'lighting_pp_lava_lamp_dusk',
      'lighting_pp_spore_bioluminescence',
      'lighting_pp_neon_diner',
    ],
    object: [
      'object_pp_shell_crown',
      'object_pp_glow_frog',
      'object_pp_comet_board',
      'object_pp_mood_cactus',
      'object_pp_pistachio_sundae',
      'object_pp_ray_gun',
    ],
    style: [
      'style_pp_pulp_cover',
      'style_pp_drive_in_poster',
      'style_pp_travel_poster',
      'style_pp_wes_anderson',
      'style_pp_saul_bass',
      'style_pp_atomic_mosaic',
      'style_pp_lava_lamp',
      'style_pp_upa_cartoon',
      'style_pp_riso_lounge',
      'style_pp_sunday_comic',
      'style_pp_stop_motion',
    ],
    aura: [
      'world_seed_pp_planet_pistachio',
    ],
  },
  createdAt: SEED_TS_V21,
  updatedAt: SEED_TS_V21,
};

function maybeApplyUniverseSeedV21(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V21) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V21, 'true');
    if (universes.some(u => u.id === SEED_UNIVERSE_PLANET_PISTACHIO.id)) return universes;
    const next = [...universes, SEED_UNIVERSE_PLANET_PISTACHIO];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V25 — non-destructive: merge the new Burton Ink Sketchbook style into
// the existing Style Lab universe pool for already-seeded users.
function maybeApplyUniverseSeedV25(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V25) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V25, 'true');
    const idx = universes.findIndex(u => u.id === SEED_UNIVERSE_STYLE_LAB.id);
    if (idx === -1) return universes;
    const existing = universes[idx];
    const currentStyle = existing.pools.style ?? [];
    if (currentStyle.includes('style_lab_burton_ink_sketchbook')) return universes;
    const merged: Universe = {
      ...existing,
      pools: { ...existing.pools, style: [...currentStyle, 'style_lab_burton_ink_sketchbook'] },
      updatedAt: SEED_TS_V25,
    };
    const next = [...universes.slice(0, idx), merged, ...universes.slice(idx + 1)];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V24 — non-destructive: merge the new Burton Stop-Motion Diorama style into
// the existing Style Lab universe pool for already-seeded users.
function maybeApplyUniverseSeedV24(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V24) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V24, 'true');
    const idx = universes.findIndex(u => u.id === SEED_UNIVERSE_STYLE_LAB.id);
    if (idx === -1) return universes;
    const existing = universes[idx];
    const currentStyle = existing.pools.style ?? [];
    if (currentStyle.includes('style_lab_burton_stop_motion')) return universes;
    const merged: Universe = {
      ...existing,
      pools: { ...existing.pools, style: [...currentStyle, 'style_lab_burton_stop_motion'] },
      updatedAt: SEED_TS_V24,
    };
    const next = [...universes.slice(0, idx), merged, ...universes.slice(idx + 1)];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V23 — non-destructive: merge the new Stop-Motion Diorama style into
// the existing Planet Pistachio universe style pool for already-seeded users.
function maybeApplyUniverseSeedV23(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V23) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V23, 'true');
    const idx = universes.findIndex(u => u.id === SEED_UNIVERSE_PLANET_PISTACHIO.id);
    if (idx === -1) return universes;
    const existing = universes[idx];
    const currentStyle = existing.pools.style ?? [];
    if (currentStyle.includes('style_pp_stop_motion')) return universes;
    const merged: Universe = {
      ...existing,
      pools: { ...existing.pools, style: [...currentStyle, 'style_pp_stop_motion'] },
      updatedAt: SEED_TS_V23,
    };
    const next = [...universes.slice(0, idx), merged, ...universes.slice(idx + 1)];
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return universes;
  }
}

// V22 — non-destructive: merge the 10 new Planet Pistachio native styles into
// the existing Planet Pistachio universe style pool for users who already seeded V21.
function maybeApplyUniverseSeedV22(universes: Universe[]): Universe[] {
  try {
    if (localStorage.getItem(UNIVERSE_SEED_FLAG_KEY_V22) !== null) return universes;
    localStorage.setItem(UNIVERSE_SEED_FLAG_KEY_V22, 'true');
    const idx = universes.findIndex(u => u.id === SEED_UNIVERSE_PLANET_PISTACHIO.id);
    if (idx === -1) return universes;
    const existing = universes[idx];
    const currentStyle = existing.pools.style ?? [];
    const additions = [
      'style_pp_pulp_cover',
      'style_pp_drive_in_poster',
      'style_pp_travel_poster',
      'style_pp_wes_anderson',
      'style_pp_saul_bass',
      'style_pp_atomic_mosaic',
      'style_pp_lava_lamp',
      'style_pp_upa_cartoon',
      'style_pp_riso_lounge',
      'style_pp_sunday_comic',
    ].filter(id => !currentStyle.includes(id));
    if (additions.length === 0) return universes;
    const merged: Universe = {
      ...existing,
      pools: { ...existing.pools, style: [...currentStyle, ...additions] },
      updatedAt: SEED_TS_V22,
    };
    const next = [...universes.slice(0, idx), merged, ...universes.slice(idx + 1)];
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
    return maybeApplyUniverseSeedV25(maybeApplyUniverseSeedV24(maybeApplyUniverseSeedV23(maybeApplyUniverseSeedV22(maybeApplyUniverseSeedV21(maybeApplyUniverseSeedV20(maybeApplyUniverseSeedV19(maybeApplyUniverseSeedV18(maybeApplyUniverseSeedV17(maybeApplyUniverseSeedV16(maybeApplyUniverseSeedV15(maybeApplyUniverseSeedV14(maybeApplyUniverseSeedV13(maybeApplyUniverseSeedV12(maybeApplyUniverseSeedV11(maybeApplyUniverseSeedV10(maybeApplyUniverseSeedV9(maybeApplyUniverseSeedV8(maybeApplyUniverseSeedV7(maybeApplyUniverseSeedV6(maybeApplyUniverseSeedV5(maybeApplyUniverseSeedV4(maybeApplyUniverseSeedV3(maybeApplyUniverseSeed(universes))))))))))))))))))))))));
  } catch {
    return maybeApplyUniverseSeedV4(maybeApplyUniverseSeedV3(maybeApplyUniverseSeed([])));
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
