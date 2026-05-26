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
const WORLD_SEED_FLAG_KEY_V6 = 'promptgen:worlds:seeded:v6';
const WORLD_SEED_FLAG_KEY_V7 = 'promptgen:worlds:seeded:v7';
const WORLD_SEED_FLAG_KEY_V8 = 'promptgen:worlds:seeded:v8';
const WORLD_SEED_FLAG_KEY_V9 = 'promptgen:worlds:seeded:v9';
const WORLD_SEED_FLAG_KEY_V10 = 'promptgen:worlds:seeded:v10';

const WORLD_SEED_TS = 1747872000000;
const WORLD_SEED_TS_V2 = 1747094400000;
const WORLD_SEED_TS_V3 = 1748304000000;
const WORLD_SEED_TS_V4 = 1748304000000;
const WORLD_SEED_TS_V5 = 1748476800000;
const WORLD_SEED_TS_V6 = 1748563200000;
const WORLD_SEED_TS_V7 = 1748649600000;
const WORLD_SEED_TS_V8 = 1748736000000;
const WORLD_SEED_TS_V9 = 1748822400000;
const WORLD_SEED_TS_V10 = 1749600000000;

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

const SEED_WORLDS_V6: World[] = [
  {
    id: 'world_seed_sb_solarpunk_bloom',
    name: 'Solarpunk Bloom',
    coverImageUrl: null,
    phrases: [
      { id: 'wp_sb_01', text: 'a green-tech city at golden hour, every roof and balcony spilling over with gardens, the air warm and full of pollen and light' },
      { id: 'wp_sb_02', text: 'glass towers terraced into vertical farms, crops cascading down their faces, irrigation mist hanging like a soft veil' },
      { id: 'wp_sb_03', text: 'solar sails and amber photovoltaic membranes catching the sun on rooftops, gliders launching silently into the warm wind' },
      { id: 'wp_sb_04', text: 'old streets given back to water — gentle green canals between planted buildings, footbridges, gardens growing down to the waterline' },
      { id: 'wp_sb_05', text: 'sculptural solar trees spreading petalled canopies over a sunlit plaza, pooling cool shade across warm paving' },
      { id: 'wp_sb_06', text: 'a vast geodesic glass dome full of mature trees, soft milky daylight raining down through triangular panes' },
      { id: 'wp_sb_07', text: 'wind turbines turning slowly on a ridge of wildflowers above the valley, clean and patient against a big bright sky' },
      { id: 'wp_sb_08', text: 'a repair café where nothing is thrown away — salvaged parts sorted in jars, mushroom-grown furniture, a kettle always on' },
      { id: 'wp_sb_09', text: 'glowing green algae bioreactor tubes lining a hall, columns of living light bubbling softly, warm emerald glow on a clean floor' },
      { id: 'wp_sb_10', text: 'a community food forest open to all, fruit trees over berry hedges over herb beds, baskets left out for whoever is hungry' },
      { id: 'wp_sb_11', text: 'tiny brass-and-gauze pollinator drones drifting in glittering clouds over the orchard blossom, half insect, half tool' },
      { id: 'wp_sb_12', text: 'rooftop beehives among the wildflowers, honey gathering gold in the comb, bees drifting calm in the warm afternoon' },
      { id: 'wp_sb_13', text: 'a tram station overgrown into a garden, moss furring the platform, a wooden tram gliding in under flowering arches' },
      { id: 'wp_sb_14', text: 'a floating market of boats lashed deck to deck on the canals, produce and cut flowers heaped under bright striped awnings' },
      { id: 'wp_sb_15', text: 'a seed vault library of floor-to-ceiling labelled drawers, rolling ladders on brass rails, a thousand heirloom varieties kept safe' },
      { id: 'wp_sb_16', text: 'sunlight filtered through leaf canopies everywhere, shifting dappled pools of warm light and soft green shadow' },
      { id: 'wp_sb_17', text: 'people in natural-fibre workwear and woven solar cloaks, hands in the soil, unhurried and at ease with their world' },
      { id: 'wp_sb_18', text: 'living-fibre clothing threaded with real moss and embroidered vines, garments that are half garden' },
      { id: 'wp_sb_19', text: 'a harvest festival in full swing — flower crowns, falling petals, ribbons and garlands, music under golden afternoon light' },
      { id: 'wp_sb_20', text: 'rainwater chains and gentle weirs routing water through the city, the soft sound of running water everywhere' },
      { id: 'wp_sb_21', text: 'warm wooden architecture wrapped in greenery, rammed earth and reclaimed timber, soft organic curves instead of hard edges' },
      { id: 'wp_sb_22', text: 'solar lanterns glowing honey-gold at dusk in woven cages, light gathered through the day and given gently back at night' },
      { id: 'wp_sb_23', text: 'a grove warden with faint photosynthetic vine-tattoos, a living staff sprouting fresh leaves, speaking softly for the trees' },
      { id: 'wp_sb_24', text: 'mushroom cellars in the warm dark, a mycologist with faintly luminous fingertips tending the slow web beneath the city' },
      { id: 'wp_sb_25', text: 'the smell the image implies — turned earth, cut grass, blossom, beeswax, rain on warm stone, bread from a communal oven' },
      { id: 'wp_sb_26', text: 'long shared tables under vine pergolas strung with lanterns, food passed hand to hand, nobody eating alone' },
      { id: 'wp_sb_27', text: 'children learning among the trees in a teaching grove, dappled green light, the next generation growing up in abundance' },
      { id: 'wp_sb_28', text: 'a courier high on a thermal looking down on the whole green city — canals and gardens and turning turbines laid out like a map' },
      { id: 'wp_sb_29', text: 'stained-glass and Art Nouveau botanical motifs in the public buildings, sun streaming through leaded floral panes' },
      { id: 'wp_sb_30', text: 'the whole world warm and hopeful and quietly thriving — technology and nature finally grown together instead of apart' },
    ],
    createdAt: WORLD_SEED_TS_V6,
    updatedAt: WORLD_SEED_TS_V6,
  },
];

const SEED_WORLDS_V7: World[] = [
  {
    id: 'world_seed_pc_porcelain_court',
    name: 'Porcelain Court',
    coverImageUrl: null,
    phrases: [
      { id: 'wp_pc_01', text: 'a decaying rococo palace where the entire court are living porcelain dolls, beautiful and frozen and faintly wrong' },
      { id: 'wp_pc_02', text: 'glazed bisque skin on every face, smooth and pale, threaded with hairline cracks and fine crazing' },
      { id: 'wp_pc_03', text: 'large fixed glass doll eyes with painted lashes, unblinking, all of them somehow turned toward you' },
      { id: 'wp_pc_04', text: 'small painted rosebud mouths set in serene, too-still smiles that never quite reach the eyes' },
      { id: 'wp_pc_05', text: 'visible ball-joints at every wrist, elbow and knee, limbs that move in small porcelain clicks' },
      { id: 'wp_pc_06', text: 'a pastel palette gone soft with dust — powder-blue, rose-pink, cream and tarnished gilt' },
      { id: 'wp_pc_07', text: 'faded gilt scrollwork flaking from carved walls, gold leaf peeling into the grey light' },
      { id: 'wp_pc_08', text: 'a great dead chandelier hanging low over a dust-blanketed parquet ballroom, half its crystals fallen' },
      { id: 'wp_pc_09', text: 'foxed antique mirrors facing each other down a long gallery, reflections receding into spotted grey infinity' },
      { id: 'wp_pc_10', text: 'the held breath of a dance that stopped mid-step, couples frozen forever in a faded ballroom' },
      { id: 'wp_pc_11', text: 'a wind-up aristocrat with a slowly turning brass key in his back, charm running on a timer' },
      { id: 'wp_pc_12', text: 'a music-box ballerina turning on a mirrored stage, one arm shattered hollow at the elbow' },
      { id: 'wp_pc_13', text: 'marionette strings rising from limbs to cracked wooden control bars somewhere up in the dark' },
      { id: 'wp_pc_14', text: 'twin glazed tear-tracks running down a mourning doll\'s cheeks, crazing the porcelain where they fall' },
      { id: 'wp_pc_15', text: 'a banquet table set end to end for a feast no one attends, dust thick on every untouched plate' },
      { id: 'wp_pc_16', text: 'kintsugi-gold repair seams where the broken have been mended, the dollmaker\'s careful handiwork' },
      { id: 'wp_pc_17', text: 'an abandoned nursery with a stilled rocking horse and dolls slumped watching from a high shelf' },
      { id: 'wp_pc_18', text: 'wax and silk flowers under dusty bell jars in a conservatory where the real plants died long ago' },
      { id: 'wp_pc_19', text: 'a grand staircase under a vast dead chandelier, ancestral portraits climbing into shadow' },
      { id: 'wp_pc_20', text: 'enormous brass clock-tower gears halted mid-tick, the whole court stopped in time with them' },
      { id: 'wp_pc_21', text: 'a cellar catacomb of discarded dolls, countless glass eyes catching a single candle in the dark' },
      { id: 'wp_pc_22', text: 'an overgrown formal garden, moss filling the crazing of weathered statue-dolls, ivy through a shattered shoulder' },
      { id: 'wp_pc_23', text: 'dusty candelabra glow in small amber pools, falling off quickly into deep velvet shadow' },
      { id: 'wp_pc_24', text: 'cold blue moonlight through tall arched windows, long pale window-bars laid across the floors' },
      { id: 'wp_pc_25', text: 'the faint tinkling ghost of a music-box minuet, half its notes missing, dissolving into the silence' },
      { id: 'wp_pc_26', text: 'painted half-masks held on slender handles, a face beneath that may be smooth and featureless' },
      { id: 'wp_pc_27', text: 'the smell the image implies — dust, old varnish, dried roses, candle-wax, the cold mineral scent of porcelain' },
      { id: 'wp_pc_28', text: 'impeccable courtly manners with a threat coiled beneath, a serene smile that has already decided your fate' },
      { id: 'wp_pc_29', text: 'the creeping certainty that the dolls move the instant you look away, gestures subtly rearranged' },
      { id: 'wp_pc_30', text: 'the whole court beautiful and uncanny and stopped in time — exquisite, melancholy, and quietly watching' },
    ],
    createdAt: WORLD_SEED_TS_V7,
    updatedAt: WORLD_SEED_TS_V7,
  },
];

const SEED_WORLDS_V8: World[] = [
  {
    id: 'world_seed_dr_dust_run',
    name: 'Dust Run',
    coverImageUrl: null,
    phrases: [
      { id: 'wp_dr_01', text: 'a sun-blasted post-apocalyptic desert where the old world rusted away and only the hard and the thirsty are left' },
      { id: 'wp_dr_02', text: 'a merciless pale sky and a blinding sun hammering down, heat-haze shimmering and dissolving the horizon into glare' },
      { id: 'wp_dr_03', text: 'a sun-bleached palette of tan, ochre, rust and bone, with a hard faded blue overhead' },
      { id: 'wp_dr_04', text: 'cracked white salt flats split into a million dry tiles, dust devils spinning across the emptiness' },
      { id: 'wp_dr_05', text: 'endless rolling dunes wind-carved into sharp ridges, a single faint track winding over the gold' },
      { id: 'wp_dr_06', text: 'a ghost town main street of warped clapboard fronts, a broken sign swinging, tumbleweed on the wind' },
      { id: 'wp_dr_07', text: 'roaring scrap-plated war-rigs trailing rooster-tails of dust, welded armour and chain-wrapped wheels' },
      { id: 'wp_dr_08', text: 'a lone poncho-wrapped gunslinger walking in from the heat-haze, one hand never far from the revolver' },
      { id: 'wp_dr_09', text: 'the only working well for a hundred miles, clean water hoarded behind scrap walls and armed catwalks' },
      { id: 'wp_dr_10', text: 'the held breath of a standoff at high noon, narrowed eyes and hands hovering over holstered guns' },
      { id: 'wp_dr_11', text: 'a vast scrapyard of rusted car hulks stacked into canyons of metal, the wind moaning through hollow steel' },
      { id: 'wp_dr_12', text: 'a red-rock canyon pass perfect for an ambush, deep cool shadow below and a hot strip of sky above' },
      { id: 'wp_dr_13', text: 'a battered saloon full of dust and smoke, hard god-rays through grimy windows, a torch singer on a worn stage' },
      { id: 'wp_dr_14', text: 'a dry boneyard scattered with vast bleached skeletons, the ribs of beasts and machines half-sunk in sand' },
      { id: 'wp_dr_15', text: 'the ruin of an old highway gas station at a crossroads to nowhere, a collapsed pump canopy and a faded sign' },
      { id: 'wp_dr_16', text: 'a cracked freeway choked with rusted dead cars, a frozen traffic jam abandoned mid-flight, sand reclaiming the lanes' },
      { id: 'wp_dr_17', text: 'a towering mountain-high wall of dust rolling in, the light gone thick and orange-brown, the sun a dim disc' },
      { id: 'wp_dr_18', text: 'a rare contested oasis, a few ragged palms around a muddy spring, ringed with scrap fortifications and worth killing for' },
      { id: 'wp_dr_19', text: 'a blind dust-oracle reading carved bones in the open waste, milky eyes and rag wrappings strung with charms' },
      { id: 'wp_dr_20', text: 'the last sheriff holding a dead town, a tarnished star pinned to a long grey duster, a law no one else keeps' },
      { id: 'wp_dr_21', text: 'scrap-welded guns, jury-rigged rifles and worn revolvers with notches filed into the grips' },
      { id: 'wp_dr_22', text: 'a small campfire glowing warm against the immense cold desert night, sparks rising into a vast clear starfield' },
      { id: 'wp_dr_23', text: 'low golden sun raking through hanging dust, long dramatic shadows and every airborne particle aglow' },
      { id: 'wp_dr_24', text: 'a dented tin canteen with barely a swallow left, water rationed down to the last hot mouthful' },
      { id: 'wp_dr_25', text: 'the smell the image implies — hot metal, gun-oil, sweat, dust, gasoline and sun-baked bone' },
      { id: 'wp_dr_26', text: 'a scavenger kid in a too-big coat of pockets picking the wrecks for the good scrap others missed' },
      { id: 'wp_dr_27', text: 'an outlaw gang on the dunes, twin pearl-handled revolvers and a dangerous grin, notches on every grip' },
      { id: 'wp_dr_28', text: 'a gaunt dust-preacher walking the wastes with a sun-warped bible, preaching the end of a world that already ended' },
      { id: 'wp_dr_29', text: 'the bone-deep weariness of survival, cracked lips and hollow eyes, going on because stopping means dying' },
      { id: 'wp_dr_30', text: 'the whole waste vast and pitiless and beautiful — and the stubborn human refusal to give it the last word' },
    ],
    createdAt: WORLD_SEED_TS_V8,
    updatedAt: WORLD_SEED_TS_V8,
  },
];

const SEED_WORLDS_V9: World[] = [
  {
    id: 'world_seed_ds_deep_signal',
    name: 'Deep Signal',
    coverImageUrl: null,
    phrases: [
      { id: 'wp_ds_01', text: 'a deep-sea research station clinging to a black trench wall, miles down, the last lit thing in an ocean of dark' },
      { id: 'wp_ds_02', text: 'a palette of abyssal black and steel grey pierced by bioluminescent cyan, violet and sickly gold' },
      { id: 'wp_ds_03', text: 'crushing pressure and total silence, marine snow drifting endlessly through floodlight cones' },
      { id: 'wp_ds_04', text: 'a great curved observation dome staring into bottomless black water, faint far-off flickers beyond the glass' },
      { id: 'wp_ds_05', text: 'cramped flooding corridors, flickering strip-lights over ankle-deep water, seams weeping seawater' },
      { id: 'wp_ds_06', text: 'a signal coming up from the trench that should not have words, a waveform crawling into shapes too deliberate' },
      { id: 'wp_ds_07', text: 'a wall of glowing specimen tanks holding things that should not be, pulsing soft in the dark' },
      { id: 'wp_ds_08', text: 'a moon pool of black seawater breathing up through the station floor, dive gear racked around it' },
      { id: 'wp_ds_09', text: 'a lone diver in a heavy atmospheric suit, one lamp and one tether against infinite dark, only their own breathing for company' },
      { id: 'wp_ds_10', text: 'a red emergency light pulsing through steam as the station quietly fails around the crew' },
      { id: 'wp_ds_11', text: 'a bioluminescent reef blooming in the abyss, towering glowing growths and drifting jellies, alien and serene' },
      { id: 'wp_ds_12', text: 'black-smoker hydrothermal vents belching superheated water, pale tube worms and a hellish red glow on the trench floor' },
      { id: 'wp_ds_13', text: 'crew whose bodies are quietly, wrongly changing — translucent skin, gill-slits, a soft glow beneath the flesh' },
      { id: 'wp_ds_14', text: 'an anglerfish thing shaped like a woman, a single glowing lure and a soft smile over rows of needle teeth' },
      { id: 'wp_ds_15', text: 'a drowned diver the sea gave back, drifting the corridors in a flooded helmet half-full of dark water' },
      { id: 'wp_ds_16', text: 'a stowaway cultist in barnacle-crusted robes, certain the thing in the trench is a god and the crew its offering' },
      { id: 'wp_ds_17', text: 'an older sunken wreck on the trench floor, draped in silt and pale growth, doorways gaping into total black' },
      { id: 'wp_ds_18', text: 'the comms officer with headphones clamped on, transcribing the signal, eyes too wide and sleepless' },
      { id: 'wp_ds_19', text: 'cold console and sonar-scope glow underlighting frightened faces, the rest of every room swallowed in shadow' },
      { id: 'wp_ds_20', text: 'a barnacle-crusted idol dredged from the deep, humanoid yet wrong, faintly warm and faintly glowing within' },
      { id: 'wp_ds_21', text: 'the station seen from outside, tiny lit windows clinging to sheer rock, dwarfed by the crushing black' },
      { id: 'wp_ds_22', text: 'a single eerie lure-light hanging in absolute void, drawing the eye, illuminating almost nothing' },
      { id: 'wp_ds_23', text: 'the smell the image implies — brine, rust, ozone, machine oil, and something sweet and organic and wrong' },
      { id: 'wp_ds_24', text: 'the deepest dark where the signal comes from, impossible geometry suggested by cold scattered constellations of light' },
      { id: 'wp_ds_25', text: 'a colossal dim shape at the edge of the floodlight, fins and tendrils and wrong angles, a tiny diver dwarfed before it' },
      { id: 'wp_ds_26', text: 'the wonder of impossible beauty curdling into dread, awe and terror fused in the same held breath' },
      { id: 'wp_ds_27', text: 'a distress beacon blinking its useless SOS into the dark, half-flooded, no one coming' },
      { id: 'wp_ds_28', text: 'reflections in dark portholes that hold a shape a half-second too long, or one too many figures' },
      { id: 'wp_ds_29', text: 'the seductive cold calm of the deepest dark, the quiet pull of simply giving in to the depths' },
      { id: 'wp_ds_30', text: 'the whole station fragile and luminous and doomed — beautiful, isolated, and quietly, hideously watched' },
    ],
    createdAt: WORLD_SEED_TS_V9,
    updatedAt: WORLD_SEED_TS_V9,
  },
];

const SEED_WORLDS_V10: World[] = [
  {
    id: 'world_seed_sc_saint_circuit',
    name: 'Saint Circuit',
    coverImageUrl: null,
    phrases: [
      { id: 'wp_sc_01', text: 'a cathedral-city where the machine is holy, devotion measured in current and prayer counted in glowing beads' },
      { id: 'wp_sc_02', text: 'a palette dominated by Marian-blue, ultramarine and electric cyan, with bone-white skin and halo-gold reserved for accents' },
      { id: 'wp_sc_03', text: 'towering stained-glass windows pouring saturated cobalt and indigo light across vast cathedral floors' },
      { id: 'wp_sc_04', text: 'rings of neon halos suspended in the air down the length of the nave, each one humming faintly' },
      { id: 'wp_sc_05', text: 'cyber-monks pacing the cloister in deep cobalt habits, prayer-bead processors threaded between their fingers' },
      { id: 'wp_sc_06', text: 'a living stained-glass saint in the great window, a body of luminous cobalt panes and a sacred-red heart at the chest' },
      { id: 'wp_sc_07', text: 'the deep humming prayer engine beneath the nave, brass and cobalt cores rising in tiered rings, valves glowing cyan' },
      { id: 'wp_sc_08', text: 'a wall of stained-glass datapanes, sacred icons updating in real time with scripture and code' },
      { id: 'wp_sc_09', text: 'a choir AI in chrome and cobalt with a halo of small loudspeakers, voice impossibly pure' },
      { id: 'wp_sc_10', text: 'inquisitors in sleek deep-cobalt plate with thin sharp halos and sigil-blades that glow with circuit-script' },
      { id: 'wp_sc_11', text: 'a wired confessor blindfolded in cobalt, ear-tubes carrying whispered sins down to a small chest-console' },
      { id: 'wp_sc_12', text: 'a high bell tower hung with great copper-and-blue electric bells, braided cables snaking up the stone' },
      { id: 'wp_sc_13', text: 'a crypt of saints — dormant chrome figures laid in repose, halos dark, a single candle-LED burning blue at each foot' },
      { id: 'wp_sc_14', text: 'a great vaulted library of glowing scroll-cases and chip-wafer codices, monks reading by cobalt lamp' },
      { id: 'wp_sc_15', text: 'an inquisition hall lit by a single hard cobalt spotlight, sigil-banners hanging from the rafters in deep shadow' },
      { id: 'wp_sc_16', text: 'a public square before the cathedral at night, huge neon halos suspended overhead like streetlamps' },
      { id: 'wp_sc_17', text: 'heretic catacombs beneath the cathedral, broken halos and scratched-out sigils, a rebel-cyan shrine in the dark' },
      { id: 'wp_sc_18', text: 'a rooftop forest of antennae-crosses and stone gargoyles, faint blue lightning crawling between the spires' },
      { id: 'wp_sc_19', text: 'censer-drones drifting through the nave trailing pale blue incense smoke, glowing cyan cores at their hearts' },
      { id: 'wp_sc_20', text: 'a wearable LED halo crown, a thin chrome arc with a luminous cobalt edge, floating above the wearer\'s head' },
      { id: 'wp_sc_21', text: 'an iconographer at her workbench printing a living blue icon with a glowing light-pen' },
      { id: 'wp_sc_22', text: 'pilgrims kneeling barefoot in dusty cobalt robes, delicate halos of cyan prayer-coils at their brows' },
      { id: 'wp_sc_23', text: 'a machine-hermit grown into the cathedral wiring, cobalt cabling like vines through the flesh, eyes stitched closed' },
      { id: 'wp_sc_24', text: 'a broken-halo heretic with the church sigil scratched out and circuit-stigmata bleeding pale cyan light' },
      { id: 'wp_sc_25', text: 'a faint electric hymn rising from beneath every floor, the steady devotional hum of the prayer engine' },
      { id: 'wp_sc_26', text: 'the smell the image implies — old incense, hot solder, beeswax, ozone, cold stone, the sweet rot of holy current' },
      { id: 'wp_sc_27', text: 'mosaics of saints fused with circuit-traces, gold leaf and deep cobalt tiles set in black grout' },
      { id: 'wp_sc_28', text: 'a sigil-blade humming with holy current, circuit-script glowing along the edge' },
      { id: 'wp_sc_29', text: 'devotion as protocol — measured ritual, precise gestures, no warmth in the prayer, only cool light' },
      { id: 'wp_sc_30', text: 'the whole city sacred and electric and blue — a faith run on machinery, faces lifted into the cobalt' },
    ],
    createdAt: WORLD_SEED_TS_V10,
    updatedAt: WORLD_SEED_TS_V10,
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

  if (localStorage.getItem(WORLD_SEED_FLAG_KEY_V6) === null) {
    localStorage.setItem(WORLD_SEED_FLAG_KEY_V6, 'true');
    const existingIds = new Set(current.map(w => w.id));
    const toAdd = SEED_WORLDS_V6.filter(w => !existingIds.has(w.id));
    if (toAdd.length > 0) {
      current = [...current, ...toAdd];
      save(current);
    }
  }

  if (localStorage.getItem(WORLD_SEED_FLAG_KEY_V7) === null) {
    localStorage.setItem(WORLD_SEED_FLAG_KEY_V7, 'true');
    const existingIds = new Set(current.map(w => w.id));
    const toAdd = SEED_WORLDS_V7.filter(w => !existingIds.has(w.id));
    if (toAdd.length > 0) {
      current = [...current, ...toAdd];
      save(current);
    }
  }

  if (localStorage.getItem(WORLD_SEED_FLAG_KEY_V8) === null) {
    localStorage.setItem(WORLD_SEED_FLAG_KEY_V8, 'true');
    const existingIds = new Set(current.map(w => w.id));
    const toAdd = SEED_WORLDS_V8.filter(w => !existingIds.has(w.id));
    if (toAdd.length > 0) {
      current = [...current, ...toAdd];
      save(current);
    }
  }

  if (localStorage.getItem(WORLD_SEED_FLAG_KEY_V9) === null) {
    localStorage.setItem(WORLD_SEED_FLAG_KEY_V9, 'true');
    const existingIds = new Set(current.map(w => w.id));
    const toAdd = SEED_WORLDS_V9.filter(w => !existingIds.has(w.id));
    if (toAdd.length > 0) {
      current = [...current, ...toAdd];
      save(current);
    }
  }

  if (localStorage.getItem(WORLD_SEED_FLAG_KEY_V10) === null) {
    localStorage.setItem(WORLD_SEED_FLAG_KEY_V10, 'true');
    const existingIds = new Set(current.map(w => w.id));
    const toAdd = SEED_WORLDS_V10.filter(w => !existingIds.has(w.id));
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
