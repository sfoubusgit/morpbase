export type WorldPhrase = { id: string; text: string };

export type World = {
  id: string;
  name: string;
  phrases: WorldPhrase[];
  coverImageUrl?: string | null;
  createdAt: number;
  updatedAt: number;
};

const KEY = 'promptgen:worlds:v1';
const BACKUP_KEY = 'promptgen:worlds:backup:v1';
const WORLD_SEED_FLAG_KEY = 'promptgen:worlds:seeded:v1';
const WORLD_SEED_FLAG_KEY_V2 = 'promptgen:worlds:seeded:v2';
const WORLD_SEED_FLAG_KEY_V3 = 'promptgen:worlds:seeded:v3';
const WORLD_SEED_FLAG_KEY_V4 = 'promptgen:worlds:seeded:v4';
const WORLD_SEED_FLAG_KEY_V5 = 'promptgen:worlds:seeded:v5';

const WORLD_SEED_TS = 1747872000000;
const WORLD_SEED_TS_V2 = 1747094400000;
const WORLD_SEED_TS_V3 = 1748304000000;
const WORLD_SEED_TS_V4 = 1748304000000;
const WORLD_SEED_TS_V5 = 1748476800000;

const SEED_WORLDS: World[] = [
  {
    id: 'world_seed_beksinski',
    name: 'Beksiński',
    coverImageUrl: null,
    phrases: [
      { id: 'wp_bek_01', text: 'corroded iron surface, rust bleeding through the grain in long dark streaks' },
      { id: 'wp_bek_02', text: 'stretched dried skin pulled taut over hollow cavities, texture preserved, color long gone' },
      { id: 'wp_bek_03', text: 'pitted stone worn to powder at the edges, ancient and structural' },
      { id: 'wp_bek_04', text: 'bone-white mineral deposits lacing through dark rock like frozen lightning' },
      { id: 'wp_bek_05', text: 'cracked earth like a broken plate, deep fissures running to unreachable nothing' },
      { id: 'wp_bek_06', text: 'ancient rotting fabric, texture intact, color absorbed back into the wall behind it' },
      { id: 'wp_bek_07', text: 'oxidized metal patina, green and brown and somehow almost beautiful' },
      { id: 'wp_bek_08', text: 'grave-cold air, still and total, no warmth anywhere in the frame' },
      { id: 'wp_bek_09', text: 'thin grey sourceless light, directionless and cold, casting no real shadow' },
      { id: 'wp_bek_10', text: 'dust suspended motionless in the air, the world mid-exhale and holding it' },
      { id: 'wp_bek_11', text: 'silence with physical weight, pressing inward from every surface' },
      { id: 'wp_bek_12', text: 'a faint wind moving through the space, touching nothing, disturbing nothing' },
      { id: 'wp_bek_13', text: 'arching riblike formations of stone and bone fused together, structural and organic simultaneously' },
      { id: 'wp_bek_14', text: 'labyrinthine corridors narrowing into impenetrable dark at their far end' },
      { id: 'wp_bek_15', text: 'cathedral vaulting composed of vertebrae stacked and mortared in ancient repetition' },
      { id: 'wp_bek_16', text: 'impossible towers dissolving into grey haze long before reaching any apex' },
      { id: 'wp_bek_17', text: 'archways sealed shut, their curves suggesting a mouth that has not opened in centuries' },
      { id: 'wp_bek_18', text: 'walls curving inward like the inside of an enormous ribcage, the space breathing' },
      { id: 'wp_bek_19', text: 'a single distant light source, unreachable, casting no warmth, source unknown' },
      { id: 'wp_bek_20', text: 'a lone wrapped figure, bandages and robes indistinguishable from each other' },
      { id: 'wp_bek_21', text: 'featureless face worn smooth, by time or by intention, impossible to determine which' },
      { id: 'wp_bek_22', text: 'figures integrated into the wall — absorbed into it, or slowly emerging, unclear' },
      { id: 'wp_bek_23', text: 'a procession of shrouded forms retreating into the furthest distance, unhurried' },
      { id: 'wp_bek_24', text: 'elongated silhouette, impossibly tall, draped in something grey and indeterminate' },
      { id: 'wp_bek_25', text: 'ochre-stained ground darkening to rust at every fissure and seam' },
      { id: 'wp_bek_26', text: 'bone-white bleached surfaces against absolute black voids with no transition between them' },
      { id: 'wp_bek_27', text: 'sepia layered over grey, centuries of patina on every surface' },
      { id: 'wp_bek_28', text: 'deep arterial red appearing only at the oldest and deepest cracks in the stone' },
      { id: 'wp_bek_29', text: 'vast scale — the architecture dwarfs every figure to near-invisibility' },
      { id: 'wp_bek_30', text: 'the horror lives in the beauty of the surface, not in any single thing depicted' },
    ],
    createdAt: WORLD_SEED_TS,
    updatedAt: WORLD_SEED_TS,
  },
];

const SEED_WORLDS_V2: World[] = [
  {
    id: 'world_seed_creatine_cyberspace_gym',
    name: 'Creatine Cyberspace Gym',
    coverImageUrl: null,
    phrases: [
      { id: 'wp_ccg_01', text: 'glowing neon grid floor, each square pulsing faintly under heavy footfall' },
      { id: 'wp_ccg_02', text: 'chrome dumbbells catching electric blue light, reflections fragmenting across the ceiling' },
      { id: 'wp_ccg_03', text: 'barbell suspended in a holographic rack, weight plates rendered in wireframe light' },
      { id: 'wp_ccg_04', text: 'protein shake foam catching neon, iridescent and chemical and slightly wrong' },
      { id: 'wp_ccg_05', text: 'sweat on polished mirror surfaces, heat haze distorting everything reflected behind' },
      { id: 'wp_ccg_06', text: 'motivational text dissolving and reforming on every wall in five-pixel bitmap font' },
      { id: 'wp_ccg_07', text: 'chalk dust rising in slow drifts, each particle lit electric pink before it fades' },
      { id: 'wp_ccg_08', text: 'weight plates stacked like server disks in a rack stretching into the dark' },
      { id: 'wp_ccg_09', text: 'resistance band pulled taut and glowing, the tension visible as heat shimmer' },
      { id: 'wp_ccg_10', text: 'mirror wall floor to ceiling, the reflection fractured by sweat streaks and fingerprints' },
      { id: 'wp_ccg_11', text: 'ceiling fans spinning in the fog of creatine powder and exhaled breath' },
      { id: 'wp_ccg_12', text: 'the compound scent of iron and voltage, a smell this space never fully loses' },
      { id: 'wp_ccg_13', text: 'squat rack silhouette against a grid of blue light, structural and electric' },
      { id: 'wp_ccg_14', text: 'heart rate monitor readout floating holographically at eye level, numbers still climbing' },
      { id: 'wp_ccg_15', text: 'pre-workout ritual — scoop, measure, pour, the powder catching the light before it dissolves' },
      { id: 'wp_ccg_16', text: 'cardio machines glowing in standby mode, displays idle, treadmill belt still warm' },
      { id: 'wp_ccg_17', text: 'foam roller tracks pressed into the rubber mat like tire marks in hot asphalt' },
      { id: 'wp_ccg_18', text: 'creatine crystals in the measuring scoop, each grain fractured like synthetic diamond' },
      { id: 'wp_ccg_19', text: 'a figure mid-rep, form perfect, lit from below in electric blue and hot magenta' },
      { id: 'wp_ccg_20', text: 'the pump — veins raised and mapping pathways beneath the skin, visible and deliberate' },
      { id: 'wp_ccg_21', text: 'bench press bar bending slightly at peak load, chrome surface under full pressure' },
      { id: 'wp_ccg_22', text: 'neon progress bar rendering on the wall, 85% and climbing, no label needed' },
      { id: 'wp_ccg_23', text: 'supplement labels with impossible font stacks, illegible at distance, glowing close up' },
      { id: 'wp_ccg_24', text: 'cable machine weight stack catching sequential light as the plates separate' },
      { id: 'wp_ccg_25', text: 'the low electric hum of everything powered on at once, a frequency the body absorbs' },
      { id: 'wp_ccg_26', text: 'cooling fan exhaust mixing with chalk fog, the air turbulent and fully lit' },
      { id: 'wp_ccg_27', text: 'timer countdown in bitmap numerals at the top of the visual field, silent and precise' },
      { id: 'wp_ccg_28', text: 'locker room tile with puddles catching overhead pink light, each reflection a small world' },
      { id: 'wp_ccg_29', text: 'gym bag unzipped on the floor, contents spilling out into neon-highlighted chaos' },
      { id: 'wp_ccg_30', text: 'set complete — bars re-racked, breath returning slowly, the neon holding perfectly still' },
    ],
    createdAt: WORLD_SEED_TS_V2,
    updatedAt: WORLD_SEED_TS_V2,
  },
];

const SEED_WORLDS_V3: World[] = [
  {
    id: 'world_seed_dragon_standoff',
    name: 'Dragon Standoff',
    coverImageUrl: null,
    phrases: [
      { id: 'wp_ds_01', text: 'the air between them carrying both charges simultaneously — sulfur and ozone, neither element winning' },
      { id: 'wp_ds_02', text: 'temperature at a dead equilibrium in the gap — neither the cold of the storm nor the heat of the magma reaching the center' },
      { id: 'wp_ds_03', text: 'light splitting at the midpoint — blue-white on one side, deep amber-red on the other, no gradation between them' },
      { id: 'wp_ds_04', text: 'two electromagnetic weather systems pressing against each other without resolution, the boundary visible in the light itself' },
      { id: 'wp_ds_05', text: 'a faint sulfur taste and a static tingle at the same moment — both signals arriving from opposite directions' },
      { id: 'wp_ds_06', text: 'basalt cracked into perfect geometric plates by millennia of heat and cold cycling, each plate a record of the same process repeated' },
      { id: 'wp_ds_07', text: 'volcanic glass veins running through grey stone, catching the red light from the east and holding it' },
      { id: 'wp_ds_08', text: 'old lava channels carved grey and cold, the flow direction still readable in the surface geometry long after the fire is gone' },
      { id: 'wp_ds_09', text: 'frost crystals forming at the edge of volcanic ridges in the storm shadow before the heat dissolves them — an hourly cycle, repeated forever' },
      { id: 'wp_ds_10', text: 'ash settled into every crevice, grey and fine, preserving the negative shape of the last wind that moved through here' },
      { id: 'wp_ds_11', text: 'the sky divided — storm-grey pressing from one side, volcanic haze diffusing from the other, a seam of clear dark where they meet overhead' },
      { id: 'wp_ds_12', text: 'deep cobalt and electric blue dominating the left half of the frame, completely absent on the right' },
      { id: 'wp_ds_13', text: 'ember orange and volcanic crimson rising from the lower right, cooling to nothing before they reach the center' },
      { id: 'wp_ds_14', text: 'the neutral zone between: absolute grey, neither color reaching, the palette deadened to nothing at the exact midpoint' },
      { id: 'wp_ds_15', text: 'two rim lights visible on any surface in the gap — one cold edge, one warm edge, neither touching, both present' },
      { id: 'wp_ds_16', text: 'the geological age of everything — nothing here is young, nothing placed, all of it accumulated over more time than can be held in mind' },
      { id: 'wp_ds_17', text: 'wind erosion patterns in the stone faces reading the direction of ten thousand years of storm from the same side' },
      { id: 'wp_ds_18', text: 'heat-fractured stone on the volcanic side, every surface bearing the fine-line scarring of thermal expansion and contraction' },
      { id: 'wp_ds_19', text: 'the ridge worn smooth at the exact line where the two wind systems grind — a polished seam in the rock, the oldest surface here' },
      { id: 'wp_ds_20', text: 'stone at the center neither quite matte nor reflective — polished by competing weather until the surface has no decided quality' },
      { id: 'wp_ds_21', text: 'thin columns of steam rising where cold rain strikes volcanic-warm rock, dissolving in the competing winds before they reach any height' },
      { id: 'wp_ds_22', text: 'faint blue static filaments visible along the edges of volcanic rock where the storm charge reaches the basalt surface' },
      { id: 'wp_ds_23', text: 'heat shimmer making the volcanic horizon uncertain, the air above it behaving like liquid, forms on that side softened and wavering' },
      { id: 'wp_ds_24', text: 'ice forming and melting in the same hour at the boundary — frost at the cold turn, gone before it can accumulate, returned the same evening' },
      { id: 'wp_ds_25', text: 'two sounds beneath everything — the storm\'s low continuous roar from the west, the volcanic plateau\'s deep subsonic rumble from the east, audible at the same time' },
      { id: 'wp_ds_26', text: 'the scale of both forms making the ridge itself appear fragile — a thin seam of stone between two things that predate the stone' },
      { id: 'wp_ds_27', text: 'competing shadows in the gap — each light source casting a shadow that the other partially erases, the darkness between them never quite resolved' },
      { id: 'wp_ds_28', text: 'the quality of air around mass this enormous — density, a slight atmospheric bend, the space differently pressured in their immediate radius' },
      { id: 'wp_ds_29', text: 'impact scars in the ancient stone of the ridge — not carved, not placed, struck, each one predating any name for what made it' },
      { id: 'wp_ds_30', text: 'everything loaded, nothing released — the weight of the moment preserved in the stillness of the rock and the silence of what stands on either side of it' },
    ],
    createdAt: WORLD_SEED_TS_V3,
    updatedAt: WORLD_SEED_TS_V3,
  },
];

const SEED_WORLDS_V4: World[] = [
  {
    id: 'world_seed_alice_in_wonderland',
    name: 'Alice in Wonderland',
    coverImageUrl: null,
    phrases: [
      { id: 'wp_aiw_01', text: 'a corridor of impossible length, the door at the far end the wrong size, the key in your hand also the wrong size' },
      { id: 'wp_aiw_02', text: 'blue hookah smoke drifting at knee height through the mushroom forest, smelling of pepper and something impossible to name' },
      { id: 'wp_aiw_03', text: 'white roses on a bush, three playing card soldiers crouched at its base painting them red with broad brushes and guilty speed' },
      { id: 'wp_aiw_04', text: 'a pocket watch open and ticking, the hands in no agreement with any clock you have seen, the rabbit already gone' },
      { id: 'wp_aiw_05', text: 'long oak table stretching into the distance, mismatched teacups stacked and scattered, the party in full session with nowhere to sit' },
      { id: 'wp_aiw_06', text: 'a grin visible in the space between branches — present before the cat, remaining after the cat, occupying the interval where a face should be' },
      { id: 'wp_aiw_07', text: 'a courtroom where every bench is full, the evidence is a dish of tarts, and the verdict was written before anyone arrived' },
      { id: 'wp_aiw_08', text: 'a small bottle with a paper label tied at the neck: DRINK ME — hand lettered, the ink slightly smudged, the instruction absolute' },
      { id: 'wp_aiw_09', text: 'a cake on a white plate, the words EAT ME spelled out in currants across its surface, precise and patient' },
      { id: 'wp_aiw_10', text: 'a looking glass on the far wall showing the same room and not the same room — the clock on the mantelpiece showing different hands' },
      { id: 'wp_aiw_11', text: 'a large mushroom in a clearing, one side of the cap producing one result and the other producing another, the caterpillar unbothered by either' },
      { id: 'wp_aiw_12', text: 'flamingos deployed as croquet mallets, necks bent in uncertain arcs, the hedgehogs curled as balls and occasionally uncurling to investigate their situation' },
      { id: 'wp_aiw_13', text: 'a garden where the flowers have faces and opinions, the tiger lilies direct, the roses watchful, the daisies conferring until observed' },
      { id: 'wp_aiw_14', text: 'card soldiers standing in precise rows, their flat suits visible, their posture rigid, their interest in events around them carefully managed' },
      { id: 'wp_aiw_15', text: 'a small house at the end of a path, its windows at the right height for a specific occupant who has recently and abruptly vacated' },
      { id: 'wp_aiw_16', text: 'a large inland sea that should not exist in this space, its company treading water without discussing how they arrived or why the water is warm' },
      { id: 'wp_aiw_17', text: 'a chess landscape visible from above — each square its own distinct world, the pieces in the distance moving with the patience of things that have all the time there is' },
      { id: 'wp_aiw_18', text: 'a very long fall past a very furnished tunnel — jam jars, bookshelves, a clock with no hands, none of it accelerating, all of it noticed' },
      { id: 'wp_aiw_19', text: 'a door at the base of a tree, the tree scale and the door scale belonging to entirely different agreements about size' },
      { id: 'wp_aiw_20', text: 'a dense dark wood where the trees fork at wrong angles and something has moved through recently, the undergrowth still recording its direction' },
      { id: 'wp_aiw_21', text: 'a kitchen where pepper is the primary medium — surfaces, air, visibility all in agreement that pepper is the correct approach to everything' },
      { id: 'wp_aiw_22', text: 'a large ornate mirror in a tarnished frame, the reflection extending further than the room allows, lit from a source with no counterpart on this side' },
      { id: 'wp_aiw_23', text: 'a dormouse somewhere inside an upturned teapot, occasionally surfacing to contribute to a conversation and then subsiding again' },
      { id: 'wp_aiw_24', text: 'a croquet lawn in red and white, precisely maintained, the queen\'s throne at the far end the only fixed point of reference in the activity' },
      { id: 'wp_aiw_25', text: 'a hookah of considerable ornament, unattended but still lit, the smoke forming shapes that do not quite resolve into anything identifiable' },
    ],
    createdAt: WORLD_SEED_TS_V4,
    updatedAt: WORLD_SEED_TS_V4,
  },
];

const SEED_WORLDS_V5: World[] = [
  {
    id: 'world_seed_ny_neon_yokai',
    name: 'Neon Yokai',
    coverImageUrl: null,
    phrases: [
      { id: 'wp_ny_01', text: 'a rain-slick megacity at 3am, every surface mirroring magenta and cyan signage, the streets emptier than the lights suggest' },
      { id: 'wp_ny_02', text: 'old gods and ghosts wearing the city like a disguise — a fox behind a barista, a ghost behind a cashier, none of them noticed' },
      { id: 'wp_ny_03', text: 'neon kanji buzzing and flickering overhead, half the characters dead, the surviving ones spelling something almost coherent' },
      { id: 'wp_ny_04', text: 'wet asphalt holding the full reflection of the signage above, the puddles brighter and more honest than the street' },
      { id: 'wp_ny_05', text: 'a torii gate rebuilt in glowing neon tube, humming faintly, marking a threshold between the human city and the spirit one' },
      { id: 'wp_ny_06', text: 'vending machines glowing alone on black streets, each one a small island of cold light, one slot offering something unpriced' },
      { id: 'wp_ny_07', text: 'paper lanterns and electroluminescent wire strung together down a yokocho alley, tradition and voltage sharing the same string' },
      { id: 'wp_ny_08', text: 'steam rising from a ramen stall under a bridge, lit from below by a hotplate and from above by passing train light' },
      { id: 'wp_ny_09', text: 'the last train of the night, fluorescent-lit and nearly empty, one passenger who is not casting a reflection in the dark glass' },
      { id: 'wp_ny_10', text: 'ofuda paper charms overlaid with glowing circuit traces, taped to doorframes, warding off both demons and surveillance' },
      { id: 'wp_ny_11', text: 'a convenience store at the corner, merciless white fluorescent light spilling onto the wet pavement, open and waiting' },
      { id: 'wp_ny_12', text: 'spectral figures lit from within, pale neon luminescence radiating off them onto the puddles at their feet' },
      { id: 'wp_ny_13', text: 'the scramble crossing seen from above, umbrellas and neon and a single still figure the crowd flows around without seeing' },
      { id: 'wp_ny_14', text: 'a shrine swallowed by the city, its stone foxes flanked by drink machines, incense smoke mixing with exhaust' },
      { id: 'wp_ny_15', text: 'capsule hotel corridors glowing in rows, each pod a lit cell, something breathing softly in the one with the curtain drawn' },
      { id: 'wp_ny_16', text: 'the low electric hum beneath everything — transformers, signage, the city itself running warm in the rain' },
      { id: 'wp_ny_17', text: 'a kitsune mask edged in glowing line, pushed to the side of a head, the painted grin lit faintly from within' },
      { id: 'wp_ny_18', text: 'rooftop sprawl of antennas and water tanks and signage backs, the unglamorous machinery behind the glowing face of the city' },
      { id: 'wp_ny_19', text: 'a pachinko parlor entrance flooding the street with chaotic colour and noise, a doorway into manufactured frenzy' },
      { id: 'wp_ny_20', text: 'cherry blossoms and falling rain caught in the same neon glow, beauty and decay sharing one colour temperature' },
      { id: 'wp_ny_21', text: 'a flooded gutter running with light, the reflected signage broken and reassembled in the moving water' },
      { id: 'wp_ny_22', text: 'an offering left on a ledge — a sake cup, a coin, a folded note — a quiet transaction with something unseen, recently made' },
      { id: 'wp_ny_23', text: 'the love hotel district glowing in lurid pinks and purples, discreet entrances, the architecture pretending not to be looked at' },
      { id: 'wp_ny_24', text: 'a smartphone with a cracked screen showing a call from a number with too many digits, the glow leaking through in the wrong colour' },
      { id: 'wp_ny_25', text: 'an abandoned shrine deeper in, the neon not reaching, only a will-o-wisp glowing cold blue between the dark torii' },
      { id: 'wp_ny_26', text: 'salarymen asleep on benches, drunk and harmless, stepped over by things that are neither' },
      { id: 'wp_ny_27', text: 'the smell the image implies — rain on hot concrete, fryer oil, ozone, incense, the specific perfume of a city that never fully dries' },
      { id: 'wp_ny_28', text: 'a back alley shrine the size of a phone booth, lit by a single red bulb, immaculately kept by hands no one has seen' },
      { id: 'wp_ny_29', text: 'reflections that lag a half-second behind, or show one too many figures, in every dark window along the street' },
      { id: 'wp_ny_30', text: 'the whole city beautiful and lonely and quietly haunted — the neon indifferent, the spirits patient, the rain washing none of it away' },
    ],
    createdAt: WORLD_SEED_TS_V5,
    updatedAt: WORLD_SEED_TS_V5,
  },
];

const createId = () => `w_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

function maybeApplySeed(worlds: World[]): World[] {
  let current = worlds;

  if (localStorage.getItem(WORLD_SEED_FLAG_KEY) === null) {
    localStorage.setItem(WORLD_SEED_FLAG_KEY, 'true');
    const existingIds = new Set(current.map(w => w.id));
    const toAdd = SEED_WORLDS.filter(w => !existingIds.has(w.id));
    if (toAdd.length > 0) {
      current = [...current, ...toAdd];
      save(current);
    }
  }

  if (localStorage.getItem(WORLD_SEED_FLAG_KEY_V2) === null) {
    localStorage.setItem(WORLD_SEED_FLAG_KEY_V2, 'true');
    const existingIds = new Set(current.map(w => w.id));
    const toAdd = SEED_WORLDS_V2.filter(w => !existingIds.has(w.id));
    if (toAdd.length > 0) {
      current = [...current, ...toAdd];
      save(current);
    }
  }

  if (localStorage.getItem(WORLD_SEED_FLAG_KEY_V3) === null) {
    localStorage.setItem(WORLD_SEED_FLAG_KEY_V3, 'true');
    const existingIds = new Set(current.map(w => w.id));
    const toAdd = SEED_WORLDS_V3.filter(w => !existingIds.has(w.id));
    if (toAdd.length > 0) {
      current = [...current, ...toAdd];
      save(current);
    }
  }

  if (localStorage.getItem(WORLD_SEED_FLAG_KEY_V4) === null) {
    localStorage.setItem(WORLD_SEED_FLAG_KEY_V4, 'true');
    const existingIds = new Set(current.map(w => w.id));
    const toAdd = SEED_WORLDS_V4.filter(w => !existingIds.has(w.id));
    if (toAdd.length > 0) {
      current = [...current, ...toAdd];
      save(current);
    }
  }

  if (localStorage.getItem(WORLD_SEED_FLAG_KEY_V5) === null) {
    localStorage.setItem(WORLD_SEED_FLAG_KEY_V5, 'true');
    const existingIds = new Set(current.map(w => w.id));
    const toAdd = SEED_WORLDS_V5.filter(w => !existingIds.has(w.id));
    if (toAdd.length > 0) {
      current = [...current, ...toAdd];
      save(current);
    }
  }

  return current;
}

function load(): World[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return maybeApplySeed([]);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return maybeApplySeed([]);
    return maybeApplySeed(parsed as World[]);
  } catch {
    return [];
  }
}

function save(worlds: World[]): void {
  try {
    localStorage.setItem(BACKUP_KEY, localStorage.getItem(KEY) ?? '[]');
    localStorage.setItem(KEY, JSON.stringify(worlds));
  } catch {
    // storage full — silently fail
  }
}

export function listWorlds(): World[] {
  return load();
}

export function createWorld(name: string, coverImageUrl?: string | null): World {
  const worlds = load();
  const now = Date.now();
  const world: World = { id: createId(), name: name.trim(), phrases: [], coverImageUrl: coverImageUrl?.trim() || null, createdAt: now, updatedAt: now };
  save([...worlds, world]);
  return world;
}

export function renameWorld(id: string, name: string): World | null {
  const worlds = load();
  const index = worlds.findIndex(w => w.id === id);
  if (index === -1) return null;
  const updated = { ...worlds[index], name: name.trim(), updatedAt: Date.now() };
  worlds[index] = updated;
  save(worlds);
  return updated;
}

export function deleteWorld(id: string): void {
  save(load().filter(w => w.id !== id));
}

export function addWorldPhrase(id: string, text: string): World | null {
  const worlds = load();
  const index = worlds.findIndex(w => w.id === id);
  if (index === -1) return null;
  const phrase: WorldPhrase = { id: createId(), text: text.trim() };
  const updated = { ...worlds[index], phrases: [...worlds[index].phrases, phrase], updatedAt: Date.now() };
  worlds[index] = updated;
  save(worlds);
  return updated;
}

export function updateWorldPhrase(id: string, phraseId: string, text: string): World | null {
  const worlds = load();
  const index = worlds.findIndex(w => w.id === id);
  if (index === -1) return null;
  const updated = {
    ...worlds[index],
    phrases: worlds[index].phrases.map(p => p.id === phraseId ? { ...p, text: text.trim() } : p),
    updatedAt: Date.now(),
  };
  worlds[index] = updated;
  save(worlds);
  return updated;
}

export function removeWorldPhrase(id: string, phraseId: string): World | null {
  const worlds = load();
  const index = worlds.findIndex(w => w.id === id);
  if (index === -1) return null;
  const updated = {
    ...worlds[index],
    phrases: worlds[index].phrases.filter(p => p.id !== phraseId),
    updatedAt: Date.now(),
  };
  worlds[index] = updated;
  save(worlds);
  return updated;
}

export function updateWorldCoverImage(id: string, coverImageUrl: string | null): World | null {
  const worlds = load();
  const index = worlds.findIndex(w => w.id === id);
  if (index === -1) return null;
  const updated = { ...worlds[index], coverImageUrl: coverImageUrl?.trim() || null, updatedAt: Date.now() };
  worlds[index] = updated;
  save(worlds);
  return updated;
}
