import type {
  EnvironmentIdentity,
  EnvironmentIdentityInput,
  EnvironmentStore,
} from '../types';

const ENVIRONMENT_STORE_KEY = 'promptgen:environments:v1';
const ENVIRONMENT_STORE_BACKUP_KEY = 'promptgen:environments:backup:v1';
const ENVIRONMENT_SEED_FLAG_KEY = 'promptgen:environments:seeded:v3';
const ENVIRONMENT_SEED_FLAG_KEY_V4 = 'promptgen:environments:seeded:v4';
const ENVIRONMENT_SEED_FLAG_KEY_V5 = 'promptgen:environments:seeded:v5';
const ENVIRONMENT_SEED_FLAG_KEY_V6 = 'promptgen:environments:seeded:v6';
const ENVIRONMENT_SEED_FLAG_KEY_V7 = 'promptgen:environments:seeded:v7';
const ENVIRONMENT_SEED_FLAG_KEY_V8 = 'promptgen:environments:seeded:v8';
const ENVIRONMENT_SEED_FLAG_KEY_V9 = 'promptgen:environments:seeded:v9';
const ENVIRONMENT_SEED_FLAG_KEY_V10 = 'promptgen:environments:seeded:v10';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const createId = (prefix: string): string => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `${prefix}_${crypto.randomUUID()}`;
    }
  } catch {
    // ignore and use fallback
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const sortEnvironments = <T extends EnvironmentIdentity>(environments: T[]): T[] =>
  [...environments].sort((left, right) => {
    if (right.updatedAt !== left.updatedAt) return right.updatedAt - left.updatedAt;
    if (right.createdAt !== left.createdAt) return right.createdAt - left.createdAt;
    return left.name.localeCompare(right.name);
  });

const readStorageItem = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorageItem = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
};

const parseJson = (raw: string | null): unknown => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const sanitizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => (typeof item === 'string' ? normalizeText(item) : ''))
    .filter(Boolean);
};

const sanitizeEnvironment = (value: unknown): EnvironmentIdentity | null => {
  if (!isRecord(value)) return null;

  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const name = typeof value.name === 'string' ? normalizeText(value.name) : '';
  if (!id || !name) return null;

  const phraseBundle = isRecord(value.phraseBundle)
    ? { core: sanitizeStringArray(value.phraseBundle.core) }
    : { core: [] };

  if (phraseBundle.core.length === 0) return null;

  const createdAt = typeof value.createdAt === 'number' && Number.isFinite(value.createdAt)
    ? value.createdAt
    : Date.now();
  const updatedAt = typeof value.updatedAt === 'number' && Number.isFinite(value.updatedAt)
    ? value.updatedAt
    : createdAt;

  return {
    id,
    name,
    summary: typeof value.summary === 'string' ? normalizeText(value.summary) || undefined : undefined,
    coverImageUrl: typeof value.coverImageUrl === 'string' ? value.coverImageUrl.trim() || undefined : undefined,
    phraseBundle,
    createdAt,
    updatedAt,
  };
};

const ENV_SEED_TS = 1746748800000;
const ENV_SEED_TS_2 = 1746835200000;
const ENV_SEED_TS_3 = 1747612800000;
const ENV_SEED_TS_4 = 1747785600000;
const ENV_SEED_TS_5 = 1748304000000;
const ENV_SEED_TS_6 = 1748217600000;
const ENV_SEED_TS_7 = 1748304000000;
const ENV_SEED_TS_8 = 1748476800000;
const ENV_SEED_TS_9 = 1748563200000;
const ENV_SEED_TS_10 = 1748649600000;

const DEFAULT_SEED_ENVIRONMENTS: EnvironmentIdentity[] = [
  {
    id: 'environment_seed_ancient_mountain_city',
    name: 'Ancient Mountain City — Year 3056',
    summary: 'Pre-collapse stone citadels in alpine peaks, still inhabited in 3056 alongside far-future infrastructure.',
    phraseBundle: {
      core: [
        'ancient stone city carved into mountain cliffs, year 3056',
        'crumbling colonnades and weathered ramparts draped in bioluminescent climbing vines',
        'thin cold mountain air, perpetual mist rolling through narrow canyon streets',
        'ruins of a pre-collapse civilization, orbital light arrays visible through cloud breaks',
        'worn flagstone plazas where eroded market stalls meet holographic waypoint beacons',
        'monolithic stone gates overgrown with pale lichen, transit sky-lanes passing silently overhead',
      ],
    },
    createdAt: ENV_SEED_TS,
    updatedAt: ENV_SEED_TS,
  },
  {
    id: 'environment_seed_sunken_bathhouse',
    name: 'Sunken Bathhouse — Midnight',
    summary: 'Ancient stone bathhouse, steaming mineral pools, amber lantern light, deep silence.',
    phraseBundle: {
      core: [
        'ancient stone bathhouse, midnight',
        'steaming mineral pools reflecting amber lantern light',
        'mossy columns and cracked tile floors, humid air',
        'arched ceiling dripping with condensation, hanging ferns',
        'dark still water broken only by rising steam',
        'deep silence, warmth, enclosing stone walls',
      ],
    },
    createdAt: ENV_SEED_TS_2,
    updatedAt: ENV_SEED_TS_2,
  },
  {
    id: 'environment_seed_observatory_rooftop',
    name: 'Overgrown Observatory Rooftop',
    summary: 'Stone terrace open to the night sky, crumbling dome, ivy and wind-worn instruments.',
    phraseBundle: {
      core: [
        'stone observatory rooftop, open to night sky',
        'crumbling dome with ivy crawling across weathered stonework',
        'scattered wind-worn star charts and brass instruments',
        'low flickering lantern, worn stone balustrade',
        'constellation-clear sky stretching to the horizon',
        'cold elevation, silence above the treeline',
      ],
    },
    createdAt: ENV_SEED_TS_2,
    updatedAt: ENV_SEED_TS_2,
  },
  {
    id: 'environment_seed_storm_spire',
    name: 'The Storm Spire',
    summary: 'A colossal obsidian tower at the peak of a mountain range, permanently wreathed in storm clouds and struck by continuous lightning.',
    phraseBundle: {
      core: [
        'colossal obsidian tower rising from a mountain peak',
        'permanently wreathed in storm clouds, continuous lightning striking the apex',
        'sheer vertical black stone faces slick with rain',
        'storm-charged air, wind so strong it bends the light',
        'the world below lost in cloud, nothing above but the tempest',
        'ancient rune channels carved into the stone, lit electric blue by each strike',
      ],
    },
    createdAt: ENV_SEED_TS_3,
    updatedAt: ENV_SEED_TS_3,
  },
  {
    id: 'environment_seed_drowned_cathedral',
    name: 'Drowned Cathedral of Static',
    summary: 'A vast underwater cathedral half-submerged in black water, bioluminescent electric light pulsing through flooded chambers.',
    phraseBundle: {
      core: [
        'ancient cathedral partially submerged in still black water',
        'arched nave flooded to the knee, waterline cutting the columns in half',
        'bioluminescent electric blue light pulsing through the water from unknown depths',
        'cracked stained glass above the waterline, long shafts of cold light descending',
        'the sound of dripping amplified by stone vaulted ceilings',
        'pale moss and luminous lichen covering every submerged surface',
      ],
    },
    createdAt: ENV_SEED_TS_3,
    updatedAt: ENV_SEED_TS_3,
  },
  {
    id: 'environment_seed_glacial_vault',
    name: 'The Glacial Vault',
    summary: 'A vast cavern carved deep inside a glacier, electric blue veins running through translucent ice walls of impossible scale.',
    phraseBundle: {
      core: [
        'immense cavern inside a glacier, walls of translucent blue-white ice',
        'electric blue veins running through the ice like frozen lightning',
        'cathedral scale, ice formations hanging from the ceiling like stalactites',
        'faint internal glow from deep within the ice, no external light source',
        'the air absolutely still, cold so total it has physical presence',
        'reflections multiplied infinitely through translucent ice planes',
      ],
    },
    createdAt: ENV_SEED_TS_3,
    updatedAt: ENV_SEED_TS_3,
  },
  {
    id: 'environment_seed_lightning_coast',
    name: 'The Lightning Coast',
    summary: 'Dramatic storm cliffs over a perpetually churning sea, lightning striking the water and the rock face in continuous cycles.',
    phraseBundle: {
      core: [
        'sheer cliffs dropping hundreds of meters to a storm-churned sea below',
        'lightning striking the water and cliff face in continuous cycles',
        'massive waves sending spray far above the clifftop',
        'the horizon erased by dark storm front stretching wall to wall',
        'wet black rock, ozone, the smell of salt and electricity',
        'momentary silence between strikes, then thunder that moves through the chest',
      ],
    },
    createdAt: ENV_SEED_TS_3,
    updatedAt: ENV_SEED_TS_3,
  },
  {
    id: 'environment_seed_azure_wastes',
    name: 'The Azure Crystalline Wastes',
    summary: 'A barren high plateau covered in strange sapphire crystal formations, the sky permanently charged and electric.',
    phraseBundle: {
      core: [
        'vast barren plateau covered in sapphire and cerulean crystal formations',
        'crystals ranging from ankle-height to thirty meters, geometric and asymmetric',
        'the sky a deep electric violet, permanently overcharged with atmospheric energy',
        'faint crackling sound from the crystals as they slowly accumulate static',
        'no soil, only fractured blue stone and the roots of crystal clusters',
        'distant thunder without cloud, the sound originating from the ground itself',
      ],
    },
    createdAt: ENV_SEED_TS_3,
    updatedAt: ENV_SEED_TS_3,
  },
];

const V4_SEED_ENVIRONMENTS: EnvironmentIdentity[] = [
  {
    id: 'environment_seed_tidal_archive',
    name: 'The Tidal Archive',
    summary: 'A vast underwater library, shelves colonized by coral, pages drifting in slow current, bioluminescent jellyfish between the stacks.',
    phraseBundle: {
      core: [
        'vast underwater library, stone shelves colonized by coral and sea anemone',
        'waterlogged tomes open and drifting, pages turned by slow current',
        'bioluminescent jellyfish drifting silently between the stacks',
        'salt-encrusted reading tables and overturned candelabra on the seafloor',
        'diffuse green light filtering from far above, cold and even',
        'absolute silence except for the low groan of deep water pressure',
      ],
    },
    createdAt: ENV_SEED_TS_4,
    updatedAt: ENV_SEED_TS_4,
  },
  {
    id: 'environment_seed_salt_mirror',
    name: 'The Salt Mirror',
    summary: 'A vast salt flat at dusk, a thin film of water creating a perfect reflection of the sky — horizon indistinguishable.',
    phraseBundle: {
      core: [
        'vast salt flat at dusk, sky reflected without distortion in a thin film of still water',
        'indigo and burnt orange twilight, the horizon invisible where sky meets its mirror',
        'white crystalline salt beneath ankle-deep water, the world doubled and inverted underfoot',
        'no wind, no movement, total stillness in every direction',
        'distant dark mountain silhouettes at the very edge of the world',
        'silence that has physical weight, complete and permanent',
      ],
    },
    createdAt: ENV_SEED_TS_4,
    updatedAt: ENV_SEED_TS_4,
  },
  {
    id: 'environment_seed_ossuary_garden',
    name: 'The Ossuary Garden',
    summary: 'An ancient enclosed garden of carved bone arches and overgrown memorial stonework, wildflowers growing through ribcages.',
    phraseBundle: {
      core: [
        'ancient enclosed garden, carved skeletal arches spanning weathered stone paths',
        'wildflowers growing through ribcages and between vertebrae, vivid against bleached white bone',
        'climbing roses and thick moss reclaiming the ossuary, bones barely visible beneath',
        'soft overcast light, no hard shadows, the air quiet and enclosed',
        'stone garden walls covered in memorial script, mostly worn illegible',
        'the smell of rain, earth, and very old stone',
      ],
    },
    createdAt: ENV_SEED_TS_4,
    updatedAt: ENV_SEED_TS_4,
  },
  {
    id: 'environment_seed_hanging_forest',
    name: 'The Hanging Forest',
    summary: 'A forest grown on the underside of a massive cliff face — roots above, canopy below, trees descending into mist.',
    phraseBundle: {
      core: [
        'massive sandstone cliff, a forest growing from its underside, trees descending into open air',
        'roots gripping the rock ceiling above, canopy hanging below into mist',
        'looking down into the treetops, sky visible below the lowest branches',
        'warm amber light filtering upward through the inverted canopy',
        'deep mist threading between hanging branches, birds moving upward through it',
        'the sense of gravity quietly disagreeing with everything visible',
      ],
    },
    createdAt: ENV_SEED_TS_4,
    updatedAt: ENV_SEED_TS_4,
  },
  {
    id: 'environment_seed_glass_ruin',
    name: 'The Glass Ruin',
    summary: 'Ruins of an ancient city built entirely from glass, now shattered and overgrown, light refracting into spectrum across every surface.',
    phraseBundle: {
      core: [
        'ruins of a city built entirely from glass, collapsed and overgrown',
        'shattered colored panes everywhere, light refracting into spectrum fragments across moss and stone',
        'towers still partially standing, hollow and transparent, sky visible through their walls',
        'thick moss and creeping vines threading through glass debris and fallen arches',
        'every step crunches, every surface catches a different angle of light',
        'the sound of glass shifting in wind, faint and continuous',
      ],
    },
    createdAt: ENV_SEED_TS_4,
    updatedAt: ENV_SEED_TS_4,
  },
  {
    id: 'environment_seed_black_tide_docks',
    name: 'Black Tide Docks',
    summary: 'Rain-soaked floating docks at deep night, oil lanterns swinging, black water below, figures moving in fog.',
    phraseBundle: {
      core: [
        'rain-soaked floating docks at deep night, black water below',
        'oil lanterns swinging in the wind, amber smears across wet planking',
        'narrow platforms between moored vessels, ropes groaning in the swell',
        'figures in long coats moving between stalls, heads down against the rain',
        'the smell of brine, engine oil, and something being cooked somewhere nearby',
        'fog pressing down on everything above shoulder height, the sky gone',
      ],
    },
    createdAt: ENV_SEED_TS_4,
    updatedAt: ENV_SEED_TS_4,
  },
  {
    id: 'environment_seed_volcanic_shore',
    name: 'The Volcanic Shore',
    summary: 'Black volcanic rock coast where slow lava meets cold ocean — steam columns rising, orange glow, the world still being made.',
    phraseBundle: {
      core: [
        'black volcanic rock coast, slow lava meeting cold ocean at the waterline',
        'columns of white steam rising where lava touches sea, continuous and enormous',
        'deep orange and red glow from the lava surface, deep black sky above',
        'the rock underfoot still warm, cracked into geometric plates by cooling',
        'the hiss of superheated stone, waves breaking against rock that did not exist yesterday',
        'distant volcanic cone glowing at the horizon, the source of everything',
      ],
    },
    createdAt: ENV_SEED_TS_4,
    updatedAt: ENV_SEED_TS_4,
  },
  {
    id: 'environment_seed_drowned_planetarium',
    name: 'The Drowned Planetarium',
    summary: 'A vast domed planetarium submerged beneath a lake, star projectors still running, constellations turning slowly through cold water.',
    phraseBundle: {
      core: [
        'vast domed planetarium submerged under a still lake, dome cracked but holding',
        'star projectors still running, casting constellation patterns through the water',
        'constellations rotating slowly on the curved ceiling, shapes distorted by water',
        'overturned wooden seating, fine sediment settled on every surface',
        'cold clear water, visibility good, everything lit by the slowly turning projector',
        'the sky and the deep occupying the same space, indistinguishable',
      ],
    },
    createdAt: ENV_SEED_TS_4,
    updatedAt: ENV_SEED_TS_4,
  },
  {
    id: 'environment_seed_brine_caves',
    name: 'The Brine Caves',
    summary: 'A vast cave system of salt crystal formations, walls and ceiling dense with translucent white pillars, amber light through thick crystal.',
    phraseBundle: {
      core: [
        'vast cave system formed by salt crystallization, walls and ceiling covered in white formations',
        'translucent crystal pillars growing floor to ceiling, dense and geometric',
        'pink and amber light filtering through thick crystal walls, warm and sourceless',
        'a shallow brine pool on the cave floor, perfectly still and perfectly clear',
        'absolute silence, no wind, only the occasional slow drip from above',
        'crystal edges catching light at every angle, the cave never fully dark',
      ],
    },
    createdAt: ENV_SEED_TS_4,
    updatedAt: ENV_SEED_TS_4,
  },
  {
    id: 'environment_seed_fog_monastery',
    name: 'The Fog Monastery',
    summary: 'An ancient stone monastery on a narrow mountain ridge, perpetual fog on all sides — an island above the cloud line.',
    phraseBundle: {
      core: [
        'ancient stone monastery on a narrow mountain ridge, perpetual fog pressing in on all sides',
        'the monastery emerging from white fog like an island above the cloud line',
        'worn flagstone paths between stone buildings, lanterns lit at midday against the white',
        'fog so thick the building edges dissolve, architecture fading into pale nothing',
        'the sound of distant bells and wind moving through stone corridors',
        'total isolation, the world below the fog line, the sky above unreachable',
      ],
    },
    createdAt: ENV_SEED_TS_4,
    updatedAt: ENV_SEED_TS_4,
  },
];

const V5_SEED_ENVIRONMENTS: EnvironmentIdentity[] = [
  {
    id: 'environment_seed_ashveil_ridge',
    name: 'Ashveil Ridge',
    summary: 'A high volcanic mountain pass at the exact boundary where a permanent storm system meets a volcanic plateau — neither domain claims it, the divide itself.',
    phraseBundle: {
      core: [
        'a high volcanic mountain pass at the precise boundary where a permanent storm system meets a volcanic plateau',
        'storm side: heavy charged cloud pressing down, cold rain, ozone smell, ground slick and electric beneath grey stone',
        'volcanic side: ancient lava-flow channels grey with age, heat shimmer above cracked basalt plates, ash-grey and bone-dry',
        'the ridge itself: dry ash on fractured stone, thermal updraft from below grinding against cold downdraft from above',
        'the air at the centre carries both — a breath of sulfur, a charge of static, temperature at an uneasy equilibrium',
        'no shelter, no life, no structure — only the ancient geology of two weather systems that have ground against each other for ten thousand years',
      ],
    },
    createdAt: ENV_SEED_TS_5,
    updatedAt: ENV_SEED_TS_5,
  },
];

const V6_SEED_ENVIRONMENTS: EnvironmentIdentity[] = [
  {
    id: 'environment_seed_wonderland_forest',
    name: 'The Wonderland Forest',
    summary: 'A dense impossible forest with mushrooms the size of houses, caterpillar smoke drifting through the undergrowth, and light that has no clear source.',
    phraseBundle: {
      core: [
        'dense impossible forest, trees growing at wrong angles, canopy far above and fractally dense',
        'mushrooms the size of houses in every direction — red with white spots, pale blue-grey, deep violet, soft orange',
        'drifts of blue hookah smoke moving through the undergrowth at knee height, smelling of pepper and something floral',
        'light that has no clear source, soft and even from everywhere at once, casting no shadows',
        'playing card soldiers visible at intervals, standing at attention before rosebushes being painted red',
        'the sound of distant music from a direction that changes each time you turn',
      ],
    },
    createdAt: ENV_SEED_TS_6,
    updatedAt: ENV_SEED_TS_6,
  },
  {
    id: 'environment_seed_tea_party_grounds',
    name: 'The Tea Party Grounds',
    summary: 'A long table under an oak tree set for an enormous party that no one is finishing — cups everywhere, uneaten food, it is always six o\'clock.',
    phraseBundle: {
      core: [
        'long oak table stretching further than it has any right to, white linen cloth covered in teacups in every size and pattern',
        'dozens of mismatched teacups — painted china, cracked bone, plain tin, towers of stacked saucers between them',
        'bread and butter, untouched jam, a tiered cake stand, scones going stale at the far end',
        'paper chains and bunting hung between the trees overhead, faded and slightly damp',
        'enormous gnarled oak tree at the head of the table, a dormouse somewhere inside an upturned teapot',
        'it is always six o\'clock here, and there is always one more empty seat just beside you',
      ],
    },
    createdAt: ENV_SEED_TS_6,
    updatedAt: ENV_SEED_TS_6,
  },
  {
    id: 'environment_seed_queens_croquet_ground',
    name: "The Queen's Croquet Ground",
    summary: 'An immaculate red-and-white garden — card soldiers at attention, flamingos deployed as mallets, hedgehogs as balls, roses being painted red.',
    phraseBundle: {
      core: [
        'immaculate red-and-white striped croquet lawn under a sky of deep royal blue',
        'living playing card soldiers standing in rigid rows, spade and heart suits visible on their chests',
        'pale pink flamingos used as croquet mallets, necks twisted to aim, looking distinctly uncertain about this',
        'hedgehogs curled into croquet balls, occasionally uncurling to reposition themselves',
        'white rose bushes with their blossoms hastily painted red, brushes still damp in places',
        'the Red Queen\'s throne at the far end, red velvet and black hearts, the single focus of the entire lawn',
      ],
    },
    createdAt: ENV_SEED_TS_6,
    updatedAt: ENV_SEED_TS_6,
  },
];

const V7_SEED_ENVIRONMENTS: EnvironmentIdentity[] = [
  {
    id: 'environment_seed_rabbit_hole_descent',
    name: 'The Rabbit Hole Descent',
    summary: 'A vertical fall through a cylindrical tunnel lined with bookshelves, jam jars, and furniture in slow suspension — long enough to notice things.',
    phraseBundle: {
      core: [
        'a cylindrical vertical tunnel, walls lined floor to ceiling with bookshelves, cupboards, jam jars, and framed maps',
        'objects drifting past in slow suspension — a lamp, an armchair, a jar of orange marmalade with a legible label',
        'warm amber light from no identifiable source, even distribution, no shadows cast in any direction',
        'no floor visible below, no ceiling above, the tunnel curving so the end is always just out of view',
        'dust motes suspended mid-fall alongside the falling furniture, a clock on one shelf with no hands',
        'the quality of a very long fall through a very furnished space — neither urgent nor alarming',
      ],
    },
    createdAt: ENV_SEED_TS_7,
    updatedAt: ENV_SEED_TS_7,
  },
  {
    id: 'environment_seed_pool_of_tears',
    name: 'The Pool of Tears',
    summary: 'A shallow inland sea that shouldn\'t exist — flat, salt, and warm, its strange company treading water without discussing its origin.',
    phraseBundle: {
      core: [
        'a shallow inland sea extending further than the space should allow, the surface perfectly flat and still',
        'strange mixed company treading water — a large mouse, a dodo, a creature with an uncertain neck',
        'pale pebble shore curving away in both directions, the waterline too precise, the sea too still',
        'floating debris: a thimble, a length of blue ribbon, a small sealed bottle, drifting without direction',
        'the water salt and slightly warm, its origin not discussed by those currently in it',
        'flat even overcast light, no wind, the sound of water with no particular wave producing it',
      ],
    },
    createdAt: ENV_SEED_TS_7,
    updatedAt: ENV_SEED_TS_7,
  },
  {
    id: 'environment_seed_court_of_hearts',
    name: 'The Court of Hearts',
    summary: 'A courtroom assembled from playing card soldiers, with a tart as evidence and a verdict already written somewhere before the proceedings began.',
    phraseBundle: {
      core: [
        'a courtroom assembled entirely from playing card soldiers — all four suits standing as walls, jury, and guard',
        'a throne at the far end, oversized, a velvet cushion bearing a dish of tarts as the central evidence',
        'painted rose trees flanking the entrance, the brushes still wet and leaned against the trunks',
        'high painted ceiling in red and gold heart patterns, no windows, institutional formal illumination',
        'every bench occupied, every face turned to the same fixed point, the formality absolute',
        'the verdict is already written — the proceedings are the architecture of a foregone conclusion',
      ],
    },
    createdAt: ENV_SEED_TS_7,
    updatedAt: ENV_SEED_TS_7,
  },
  {
    id: 'environment_seed_tulgey_wood',
    name: 'The Tulgey Wood',
    summary: 'A dense dark forest where the trees fork wrong and the undergrowth moves — Jabberwock country, or recently was.',
    phraseBundle: {
      core: [
        'dense dark forest, trees with trunks that fork at wrong angles and bark that faces inward',
        'the undergrowth full of creatures that are combinations of other creatures, moving between the roots',
        'thin whistling sound from no fixed direction, leaves that orient toward movement and then away',
        'light that never reaches the floor fully — filtered, grey-green, arriving at the wrong angle',
        'no path visible but clear evidence that something large has moved through recently',
        'the Jabberwock is here, or was, or will be — the wood holds the information and will not share it',
      ],
    },
    createdAt: ENV_SEED_TS_7,
    updatedAt: ENV_SEED_TS_7,
  },
  {
    id: 'environment_seed_white_rabbit_house',
    name: "The White Rabbit's House",
    summary: 'A small precise English cottage recently fled by its owner — gloves on the hall table, correspondence in progress, everything in its place except him.',
    phraseBundle: {
      core: [
        'a small precise English cottage, tidy garden gate ajar, path recently used, a boot scraper outside the white door',
        'a pair of white gloves visible through the hall window, interior low-ceilinged and carefully arranged',
        'a writing desk with correspondence in progress, a pen still wet, the letter unfinished',
        'rooms that were the exact right size for one specific occupant and are demonstrably no longer',
        'a garden with careful beds, one end recently and significantly disturbed',
        'the calm of the recently vacated — everything in its place except the reason things were placed',
      ],
    },
    createdAt: ENV_SEED_TS_7,
    updatedAt: ENV_SEED_TS_7,
  },
  {
    id: 'environment_seed_garden_live_flowers',
    name: 'The Garden of Live Flowers',
    summary: 'A formal garden where the flowers have faces and opinions — tiger lilies sharp, roses watchful, daisies whispering until observed.',
    phraseBundle: {
      core: [
        'a formal garden where the flowers have faces — tiger lilies with striped petals and direct expressions',
        'roses in red and white fully upright and watching the path, attentive without moving',
        'daisies in a cluster with heads close together — they stop when observed',
        'box hedges trimmed into shapes that almost form letters and then, looked at directly, do not',
        'diffuse warm garden light, even across all beds, every petal fully and clearly visible',
        'a garden that should be peaceful, and would be, if you could not tell it was evaluating you',
      ],
    },
    createdAt: ENV_SEED_TS_7,
    updatedAt: ENV_SEED_TS_7,
  },
  {
    id: 'environment_seed_chess_landscape',
    name: 'The Looking-Glass Chess Landscape',
    summary: 'A landscape divided into a precise chess grid where each square is its own world — tall pieces moving in the distance, a train crossing one square, the path always one square ahead.',
    phraseBundle: {
      core: [
        'a rolling landscape divided into a precise chess grid by hedges, streams, and low wooden fences',
        'each square its own distinct character — some in shadow, some in full light, the transition instant at the boundary',
        'a train crossing one of the far squares, full scale and enormous, briefly present and then not',
        'tall chess pieces visible in the distance in full slow motion — a White Knight, a Red Castle',
        'hills in the distance that read as hills and also as a chess diagram when viewed from above',
        'the path always leads to the adjacent square, the destination always one square further than arrived',
      ],
    },
    createdAt: ENV_SEED_TS_7,
    updatedAt: ENV_SEED_TS_7,
  },
  {
    id: 'environment_seed_mushroom_glade',
    name: "The Caterpillar's Mushroom Glade",
    summary: 'A clearing where the mushrooms stand as large as trees — flat caps at canopy height, blue hookah smoke drifting at mid-level, arranged entirely for one occupant.',
    phraseBundle: {
      core: [
        'a forest clearing where the mushrooms stand as large as trees, flat caps forming a second canopy',
        'the undersides of the largest caps at eye level when standing, gills pink and clearly visible from below',
        'deep blue hookah smoke drifting between the stems at mid-height, slow and slightly directional',
        'pale diffuse light above the caps, the floor of the glade in soft perpetual half-shadow',
        'ground covered in perfect circles where smaller mushrooms were, recently gone or taken',
        'the atmosphere of a space that has had one occupant for a very long time and is arranged for him alone',
      ],
    },
    createdAt: ENV_SEED_TS_7,
    updatedAt: ENV_SEED_TS_7,
  },
  {
    id: 'environment_seed_duchess_kitchen',
    name: "The Duchess's Kitchen",
    summary: 'A large smoky kitchen drowning in pepper — crockery at dangerous angles, a cauldron boiling violently, visibility poor above chest height.',
    phraseBundle: {
      core: [
        'a large smoky kitchen, every surface dusted black with pepper — counters, pots, floor, and air equally coated',
        'enormous open fireplace, a cauldron of something boiling violently at its center, steam and pepper combined',
        'crockery in stacks at dangerous heights, some units already mid-arc, some having recently landed',
        'visibility poor above chest height from combined smoke and pepper, the air physically thick',
        'a broad table with nothing on it except a deep layer of pepper and a salt cellar at the center',
        'the chaos of a kitchen that has always operated this way and sees no reason to examine it',
      ],
    },
    createdAt: ENV_SEED_TS_7,
    updatedAt: ENV_SEED_TS_7,
  },
  {
    id: 'environment_seed_looking_glass_room',
    name: 'The Looking-Glass Room',
    summary: 'A Victorian drawing room and its mirror twin — the reflection extends further than the room allows, and the mantelpiece clock shows a different time.',
    phraseBundle: {
      core: [
        'a Victorian drawing room, fireplace on the left, chessboard-patterned floor, winter light from a window on the right',
        'a large wall mirror in an elaborately tarnished ornate frame occupying the center of the far wall',
        'the reflection showing the same room but with the mantelpiece clock face showing different hands',
        'a corridor visible in the glass extending further than the room allows, lit from no matching source',
        'soft winter light from the window — the mirror\'s version has light from no clear origin, slightly warmer',
        'a room that has a copy of itself, and the question of which one is the original is not resolved',
      ],
    },
    createdAt: ENV_SEED_TS_7,
    updatedAt: ENV_SEED_TS_7,
  },
];

const V8_SEED_ENVIRONMENTS: EnvironmentIdentity[] = [
  {
    id: 'environment_seed_ny_scramble_crossing',
    name: 'Neon Scramble Crossing',
    summary: 'A rain-slick pedestrian scramble at night, drowned in towering neon signage and the glow of a thousand screens.',
    phraseBundle: {
      core: [
        'a vast pedestrian scramble crossing at night, wet asphalt mirroring the lights',
        'towering walls of neon signage and giant video screens in pink, cyan, and electric blue',
        'crowds blurred in motion under a fine drizzle, umbrellas catching the glow',
        'kanji and katakana signage stacked storey upon storey, advertising everything at once',
        'puddles fracturing the neon into long colored streaks across the road',
        'the hum of the city at its most awake and most anonymous',
      ],
    },
    createdAt: ENV_SEED_TS_8,
    updatedAt: ENV_SEED_TS_8,
  },
  {
    id: 'environment_seed_ny_konbini_interior',
    name: '24-Hour Convenience Store',
    summary: 'The flat fluorescent calm of an all-night konbini — stocked shelves, a softly humming cooler, nobody and everybody passing through.',
    phraseBundle: {
      core: [
        'interior of a 24-hour Japanese convenience store at night, flat white fluorescent light',
        'neat rows of brightly packaged snacks, onigiri, and bento on clean shelves',
        'a glowing drinks cooler humming softly along one wall',
        'magazine rack by the window, the dark street and faint neon beyond the glass',
        'spotless tiled floor reflecting the ceiling lights, a quiet liminal stillness',
        'the specific loneliness of a bright shop at 3am',
      ],
    },
    createdAt: ENV_SEED_TS_8,
    updatedAt: ENV_SEED_TS_8,
  },
  {
    id: 'environment_seed_ny_shrine_alley',
    name: 'Shrine Alley with Vending Machines',
    summary: 'A narrow backstreet where a small old shrine and its red torii sit between glowing vending machines and tangled wires.',
    phraseBundle: {
      core: [
        'a narrow night backstreet, a small old Shinto shrine wedged between buildings',
        'a faded red torii gate, stone fox statues, a worn offering box',
        'a row of glowing vending machines casting warm and cold light on the pavement',
        'tangled overhead power lines, moss in the gutter cracks, a paper lantern swaying',
        'incense smoke drifting against the electric glow, old and new pressed together',
        'quiet and sacred and faintly humming with current',
      ],
    },
    createdAt: ENV_SEED_TS_8,
    updatedAt: ENV_SEED_TS_8,
  },
  {
    id: 'environment_seed_ny_subway_platform_night',
    name: 'Last-Train Subway Platform',
    summary: 'An empty subway platform near the last train — tiled, fluorescent, faintly echoing, the city asleep above.',
    phraseBundle: {
      core: [
        'an empty subway platform late at night, long and tiled and fluorescent-lit',
        'yellow tactile paving along the platform edge, a single waiting figure far down',
        'station signage in Japanese, a digital board counting down the last train',
        'the dark mouth of the tunnel, faint rails catching the light',
        'reflections on polished floor tiles, vending machines glowing against the wall',
        'the hollow echoing quiet of the system\'s final hour',
      ],
    },
    createdAt: ENV_SEED_TS_8,
    updatedAt: ENV_SEED_TS_8,
  },
  {
    id: 'environment_seed_ny_yokocho_alley',
    name: 'Yokocho Lantern Alley',
    summary: 'A tight alley of tiny bars and ramen counters, strung with red paper lanterns and warm amber light, barely two people wide.',
    phraseBundle: {
      core: [
        'a tight narrow yokocho alley lined with tiny bars and food counters',
        'rows of red paper lanterns strung overhead glowing warm amber',
        'handwritten wooden signs and noren curtains, stools spilling into the lane',
        'steam rising from a yakitori grill, smoke and savory haze in the air',
        'wet cobblestones reflecting the lantern light, barely two people wide',
        'cramped, warm, and alive with low conversation',
      ],
    },
    createdAt: ENV_SEED_TS_8,
    updatedAt: ENV_SEED_TS_8,
  },
  {
    id: 'environment_seed_ny_capsule_corridor',
    name: 'Capsule Hotel Corridor',
    summary: 'Stacked sleeping pods receding down a dim corridor lit cold blue, each capsule a glowing rectangle of private dark.',
    phraseBundle: {
      core: [
        'a capsule hotel corridor, two stacked rows of sleeping pods receding into the distance',
        'cool blue ambient light along the pod openings, each capsule a small glowing rectangle',
        'small ladders to the upper pods, numbered panels, neat and futuristic',
        'soft carpet, low ceiling, the muffled hush of many people sleeping in boxes',
        'a vending corner glowing at the far end of the corridor',
        'clean, claustrophobic, and quietly science-fictional',
      ],
    },
    createdAt: ENV_SEED_TS_8,
    updatedAt: ENV_SEED_TS_8,
  },
  {
    id: 'environment_seed_ny_rooftop_sprawl',
    name: 'Rooftop Over the Neon Sprawl',
    summary: 'A water-tank rooftop overlooking an endless neon city — chain-link fence, distant towers, the whole glittering grid below.',
    phraseBundle: {
      core: [
        'a building rooftop at night overlooking an endless neon city sprawl',
        'water tanks, ventilation units, and a chain-link fence at the edge',
        'distant skyscrapers studded with lit windows and rooftop signage to the horizon',
        'a haze of light pollution glowing orange-pink against low clouds',
        'the city grid stretching out in glittering circuits below',
        'wind, height, and the quiet of being above it all',
      ],
    },
    createdAt: ENV_SEED_TS_8,
    updatedAt: ENV_SEED_TS_8,
  },
  {
    id: 'environment_seed_ny_pachinko_parlor',
    name: 'Pachinko Parlor',
    summary: 'A wall-to-wall blaze of pachinko machines — chaotic light, mirrored ceilings, and a roar of falling steel balls.',
    phraseBundle: {
      core: [
        'the interior of a pachinko parlor, endless rows of glowing machines wall to wall',
        'chaotic flashing light in every color, mirrored ceiling doubling the chaos',
        'screens, jackpots, and cascading steel balls behind glass',
        'narrow aisles between the machines, plush stools, smoke-tinged air',
        'overwhelming sensory blaze, garish and hypnotic',
        'the relentless mechanical roar of a hundred machines at once',
      ],
    },
    createdAt: ENV_SEED_TS_8,
    updatedAt: ENV_SEED_TS_8,
  },
  {
    id: 'environment_seed_ny_ramen_under_bridge',
    name: 'Ramen Stall Under the Tracks',
    summary: 'A tiny ramen counter tucked beneath a railway bridge, steam and warm light pooling as trains rumble overhead.',
    phraseBundle: {
      core: [
        'a tiny ramen stall tucked under a railway bridge at night',
        'a short wooden counter with a few stools, warm light from a single bulb',
        'thick steam rising from the broth pots, fogging the night air',
        'concrete bridge supports, a train rumbling across the tracks overhead',
        'handwritten menu strips on the wall, noren curtain at the entrance',
        'cramped, warm, and steeped in savory steam',
      ],
    },
    createdAt: ENV_SEED_TS_8,
    updatedAt: ENV_SEED_TS_8,
  },
  {
    id: 'environment_seed_ny_flooded_gutter',
    name: 'Typhoon-Night Gutter',
    summary: 'A flooded street gutter on a storm night, every neon sign doubled and rippling in the running water.',
    phraseBundle: {
      core: [
        'a flooded city street on a typhoon night, water running ankle-deep along the gutter',
        'every neon sign reflected and rippling, doubled in the moving water',
        'heavy rain streaking through the glow, droplets exploding on the surface',
        'overflowing drains, a swaying traffic light, debris caught at the curb',
        'dramatic reflections fractured by the current, color smeared across the wet road',
        'the drama and isolation of a storm-soaked night',
      ],
    },
    createdAt: ENV_SEED_TS_8,
    updatedAt: ENV_SEED_TS_8,
  },
  {
    id: 'environment_seed_ny_love_hotel_district',
    name: 'Love Hotel District',
    summary: 'A backstreet of lurid themed facades and heart-shaped signs, drenched in pink and purple light and discreet quiet.',
    phraseBundle: {
      core: [
        'a love hotel district backstreet at night, lurid themed building facades',
        'heart-shaped and crown-shaped neon signs glowing pink, purple, and red',
        'gaudy ornate exteriors, discreet curtained entrances, vacancy panels lit',
        'wet pavement saturated with magenta and violet light',
        'empty street, a single figure passing, an air of secrecy',
        'kitsch, lurid, and strangely lonely',
      ],
    },
    createdAt: ENV_SEED_TS_8,
    updatedAt: ENV_SEED_TS_8,
  },
  {
    id: 'environment_seed_ny_abandoned_shrine',
    name: 'Shrine Swallowed by the City',
    summary: 'A neglected old shrine boxed in by towering modern buildings — overgrown, forgotten, lit only by the spill of distant neon.',
    phraseBundle: {
      core: [
        'a small abandoned Shinto shrine hemmed in on all sides by towering modern buildings',
        'cracked stone steps overgrown with weeds, a leaning weathered torii',
        'faded shimenawa rope, moss-covered guardian statues, a collapsed offering hall',
        'no direct light except the spill of distant neon over the rooftops',
        'a pocket of old silence trapped inside the roaring city',
        'forgotten, sacred, and quietly waiting',
      ],
    },
    createdAt: ENV_SEED_TS_8,
    updatedAt: ENV_SEED_TS_8,
  },
  {
    id: 'environment_seed_ny_late_train_interior',
    name: 'Late-Night Train Carriage',
    summary: 'The fluorescent interior of a near-empty late train, dark suburbs sliding past the windows in streaks of distant light.',
    phraseBundle: {
      core: [
        'the interior of a near-empty commuter train carriage late at night',
        'flat fluorescent ceiling light, rows of empty priority seats and hanging straps',
        'dark windows with the city sliding past in streaks of distant light',
        'a lone passenger or two, reflections doubled in the black glass',
        'worn floor, route map above the doors, gentle rocking motion implied',
        'the suspended, dreamlike quiet of the last train home',
      ],
    },
    createdAt: ENV_SEED_TS_8,
    updatedAt: ENV_SEED_TS_8,
  },
];

// V9 — Solarpunk Bloom: a lush green-tech utopia, warm and hopeful — the tonal opposite of Neon Yokai.
const V9_SEED_ENVIRONMENTS: EnvironmentIdentity[] = [
  {
    id: 'environment_seed_sb_vertical_farm',
    name: 'Vertical Farm Tower',
    summary: 'A green skyscraper terraced floor to roof with crops — sunlight pouring through glass, irrigation misting in the warm air.',
    phraseBundle: {
      core: [
        'the interior of a vertical farm tower, terraced planting beds rising floor upon floor',
        'lush rows of vegetables and trailing vines spilling over every terrace edge',
        'tall sunlit glass walls, warm daylight pouring across the greenery',
        'fine irrigation mist drifting in the air, droplets catching the light',
        'wooden walkways and rope rails between the growing tiers',
        'the warm humid calm of a building that is mostly garden',
      ],
    },
    createdAt: ENV_SEED_TS_9,
    updatedAt: ENV_SEED_TS_9,
  },
  {
    id: 'environment_seed_sb_botanical_dome',
    name: 'Botanical Glass Dome',
    summary: 'A vast geodesic greenhouse atrium — a cathedral of glass and steel filled with trees, soft diffused light raining down.',
    phraseBundle: {
      core: [
        'a vast geodesic glass dome greenhouse, a cathedral of triangular panes and slim steel ribs',
        'mature trees and dense tropical planting filling the interior',
        'soft milky daylight diffusing down through the high glass',
        'hanging ferns and walkways spiralling among the canopy',
        'a still reflecting pool at the centre, lily pads and koi',
        'humid, green, and serenely luminous',
      ],
    },
    createdAt: ENV_SEED_TS_9,
    updatedAt: ENV_SEED_TS_9,
  },
  {
    id: 'environment_seed_sb_rooftop_commons',
    name: 'Rooftop Garden Commons',
    summary: 'A shared rooftop of raised beds, wildflowers and beehives, the green city rolling away beyond a low planted parapet.',
    phraseBundle: {
      core: [
        'a communal rooftop garden, raised planter beds heavy with vegetables and wildflowers',
        'rows of beehives and a small tool shed wrapped in climbing beans',
        'a planted parapet of trailing greenery edging the roof',
        'the green city sprawling beyond — more rooftops bright with gardens to the horizon',
        'a long shared table under a vine pergola, lanterns strung above it',
        'open sky, gentle breeze, the easy warmth of a shared place',
      ],
    },
    createdAt: ENV_SEED_TS_9,
    updatedAt: ENV_SEED_TS_9,
  },
  {
    id: 'environment_seed_sb_skybridge_dock',
    name: 'Solar-Sail Skybridge Dock',
    summary: 'A high glider dock between towers — amber solar sails furled on racks, wind socks streaming, the city far below in green.',
    phraseBundle: {
      core: [
        'a high glider launch dock bridging two green towers, open to the wind',
        'racks of furled amber solar wing-sails, translucent photovoltaic membrane glowing',
        'wind socks and prayer-flag-like indicators streaming in the breeze',
        'a slim cantilevered launch ramp over a long bright drop',
        'the green city far below, canals and gardens laid out like a map',
        'high, breezy, and quietly exhilarating',
      ],
    },
    createdAt: ENV_SEED_TS_9,
    updatedAt: ENV_SEED_TS_9,
  },
  {
    id: 'environment_seed_sb_living_tram_station',
    name: 'Living Tram Station',
    summary: 'A tram stop swallowed by greenery — moss-furred platforms, vine-wrapped pillars, a wooden tram gliding in under flowering arches.',
    phraseBundle: {
      core: [
        'a tram station overgrown into a garden, platform pillars wrapped in flowering vines',
        'soft moss furring the edges of the worn stone platform',
        'a sleek wooden-bodied electric tram gliding in beneath flowering arches',
        'hanging baskets and climbing roses along the canopy beams',
        'dappled light falling through the leaf-covered roof onto the rails',
        'unhurried, green, gently humming with quiet electric movement',
      ],
    },
    createdAt: ENV_SEED_TS_9,
    updatedAt: ENV_SEED_TS_9,
  },
  {
    id: 'environment_seed_sb_canal_district',
    name: 'Reclaimed Canal District',
    summary: 'Old streets given back to water — gentle green canals between planted buildings, footbridges, and gardens growing down to the waterline.',
    phraseBundle: {
      core: [
        'a reclaimed canal district, former streets turned to gentle green waterways',
        'planted buildings rising straight from the water, gardens cascading to the waterline',
        'arched footbridges and stone steps down to small mooring docks',
        'small boats among water lilies and reed beds, reflections doubling the greenery',
        'sunlight broken into bright coins on the slow-moving water',
        'tranquil, verdant, the city softened by water and growth',
      ],
    },
    createdAt: ENV_SEED_TS_9,
    updatedAt: ENV_SEED_TS_9,
  },
  {
    id: 'environment_seed_sb_repair_cafe',
    name: 'Mycelium Repair Café',
    summary: 'A warm cluttered workshop-café — salvaged parts, mushroom-grown furniture, tools on every wall and a kettle always on.',
    phraseBundle: {
      core: [
        'the interior of a repair café, a warm cluttered workshop full of half-mended things',
        'walls hung with hand tools, shelves of salvaged and sorted parts in jars',
        'furniture grown from moulded mycelium, soft and pale and organic',
        'workbenches under warm pendant lamps, a kettle steaming in the corner',
        'pot plants on every surface, a cat asleep among the tools',
        'cosy, lived-in, and quietly industrious',
      ],
    },
    createdAt: ENV_SEED_TS_9,
    updatedAt: ENV_SEED_TS_9,
  },
  {
    id: 'environment_seed_sb_turbine_ridge',
    name: 'Wind-Turbine Ridge',
    summary: 'A breezy hilltop of slow white turbines standing over a meadow of wildflowers, the green valley and city beyond.',
    phraseBundle: {
      core: [
        'a high windy ridge lined with tall slow-turning white wind turbines',
        'a meadow of wildflowers and long grass rippling in the wind below them',
        'the green valley and the garden-city spread out far in the distance',
        'big bright sky with high scattered clouds moving fast',
        'a narrow footpath winding up between the turbine bases',
        'open, breezy, and full of clean turning movement',
      ],
    },
    createdAt: ENV_SEED_TS_9,
    updatedAt: ENV_SEED_TS_9,
  },
  {
    id: 'environment_seed_sb_floating_market',
    name: 'Floating Canal Market',
    summary: 'A bustling market of boats on the green canals — produce, flowers and bread heaped on decks under bright awnings.',
    phraseBundle: {
      core: [
        'a floating market crowding the green canals, boats lashed together deck to deck',
        'produce, cut flowers, bread and preserves heaped under bright striped awnings',
        'vendors calling between boats, baskets passed hand to hand over the water',
        'strings of bunting and hanging herbs swaying above the decks',
        'warm reflections and ripples between the hulls, petals on the water',
        'busy, colourful, and full of good-natured noise',
      ],
    },
    createdAt: ENV_SEED_TS_9,
    updatedAt: ENV_SEED_TS_9,
  },
  {
    id: 'environment_seed_sb_food_forest',
    name: 'Community Food Forest',
    summary: 'A layered orchard-garden open to all — fruit trees, berry hedges and winding paths, a long communal table at its heart.',
    phraseBundle: {
      core: [
        'a layered community food forest, fruit trees over berry hedges over herb beds',
        'winding mulch paths between heavy-laden branches, baskets left for picking',
        'a long communal table in a sunlit clearing at the heart of it',
        'espaliered fruit along low fences, bees working the blossom',
        'dappled golden light falling through the orchard canopy',
        'abundant, generous, and open to anyone who wanders in',
      ],
    },
    createdAt: ENV_SEED_TS_9,
    updatedAt: ENV_SEED_TS_9,
  },
  {
    id: 'environment_seed_sb_algae_hall',
    name: 'Algae Bioreactor Hall',
    summary: 'A long hall of glowing green algae tubes — columns of bright living liquid bubbling softly, casting warm emerald light.',
    phraseBundle: {
      core: [
        'a long hall filled with tall vertical glass algae bioreactor tubes',
        'columns of bright living green liquid bubbling and circulating softly',
        'warm emerald light glowing from the tubes across the clean floor',
        'a lattice of slim pipes and brass valves linking the columns',
        'gentle condensation on the glass, a soft mechanical hum',
        'luminous, green, and quietly futuristic',
      ],
    },
    createdAt: ENV_SEED_TS_9,
    updatedAt: ENV_SEED_TS_9,
  },
  {
    id: 'environment_seed_sb_seed_vault',
    name: 'The Seed Vault Library',
    summary: 'A warm wooden archive of seeds — floor-to-ceiling labelled drawers, ladders on rails, shafts of dust-flecked sunlight.',
    phraseBundle: {
      core: [
        'a seed vault library, floor-to-ceiling cabinets of small labelled wooden drawers',
        'rolling ladders on brass rails reaching the upper rows',
        'long reading tables with magnifiers, scattered seed-vials and notebooks',
        'shafts of warm dust-flecked sunlight from high windows',
        'jars of catalogued seeds glowing amber on the shelves',
        'hushed, warm, and reverent as a library',
      ],
    },
    createdAt: ENV_SEED_TS_9,
    updatedAt: ENV_SEED_TS_9,
  },
  {
    id: 'environment_seed_sb_solar_plaza',
    name: 'Solar-Tree Plaza',
    summary: 'A sun-drenched public square shaded by sculptural solar trees — petalled photovoltaic canopies, fountains, and people at ease.',
    phraseBundle: {
      core: [
        'a sun-drenched public plaza shaded by sculptural solar trees',
        'branching steel trunks spreading into petalled photovoltaic canopies',
        'soft pools of shade thrown across warm paving, fountains running',
        'planters and benches around the bases, climbing flowers everywhere',
        'people sitting and passing at ease in the bright open square',
        'open, civic, and full of warm midday light',
      ],
    },
    createdAt: ENV_SEED_TS_9,
    updatedAt: ENV_SEED_TS_9,
  },
];

// V10 — Porcelain Court: an eerie rococo doll-court, pastel elegance with hairline cracks.
const V10_SEED_ENVIRONMENTS: EnvironmentIdentity[] = [
  {
    id: 'environment_seed_pc_throne_room',
    name: 'The Cracked Throne Room',
    summary: 'A vast rococo throne room gone to faded gilt and dust — a great cracked throne on a worn dais beneath a sagging canopy of moth-eaten silk.',
    phraseBundle: {
      core: [
        'a vast rococo throne room in faded grandeur, gilt flaking from carved walls',
        'a great cracked throne on a worn dais beneath a sagging canopy of moth-eaten silk',
        'dust thick on the marble floor, pale light from tall grimy windows',
        'tarnished candelabra and a faded portrait gallery along the walls',
        'cobwebs strung between chandelier crystals overhead',
        'silent, opulent, and slowly crumbling',
      ],
    },
    createdAt: ENV_SEED_TS_10,
    updatedAt: ENV_SEED_TS_10,
  },
  {
    id: 'environment_seed_pc_ballroom',
    name: 'The Dust Ballroom',
    summary: 'A grand mirrored ballroom where the dancing stopped long ago — parquet under grey dust, a dead orchestra, frozen couples mid-step.',
    phraseBundle: {
      core: [
        'a grand rococo ballroom, vast parquet floor under a soft grey blanket of dust',
        'towering windows and a flaking gilt mirrored wall doubling the emptiness',
        'a great dead chandelier hanging low, half its crystals fallen',
        'faded pastel frescoes of clouds and cherubs on the high ceiling',
        'abandoned music stands and a silent harpsichord in the corner',
        'the held breath of a dance that stopped mid-step',
      ],
    },
    createdAt: ENV_SEED_TS_10,
    updatedAt: ENV_SEED_TS_10,
  },
  {
    id: 'environment_seed_pc_mirror_gallery',
    name: 'The Mirror Gallery',
    summary: 'A long hall of foxed antique mirrors facing each other — reflections receding into grey infinity, the glass spotted black with age.',
    phraseBundle: {
      core: [
        'a long narrow gallery lined with tall foxed antique mirrors facing each other',
        'reflections receding into grey spotted infinity down both walls',
        'the silvering blackened and bubbling at the edges of every glass',
        'a worn runner carpet and a row of dusty gilt console tables',
        'pale grey light with no clear source, doubled endlessly',
        'disorienting, hushed, and faintly wrong',
      ],
    },
    createdAt: ENV_SEED_TS_10,
    updatedAt: ENV_SEED_TS_10,
  },
  {
    id: 'environment_seed_pc_music_chamber',
    name: 'The Music-Box Chamber',
    summary: 'An intimate chamber built like the inside of a music box — a cylinder-and-comb mechanism set in the floor, a small mirrored turning stage at its centre.',
    phraseBundle: {
      core: [
        'an intimate chamber built like the inside of a giant music box',
        'a brass pinned-cylinder and tuned-comb mechanism set into the floor',
        'a small mirrored turning stage at the centre under a glass dome',
        'walls of faded rose silk and tarnished gilt scrollwork',
        'warm low light glinting off the delicate mechanism',
        'a sense that it might begin to play at any moment',
      ],
    },
    createdAt: ENV_SEED_TS_10,
    updatedAt: ENV_SEED_TS_10,
  },
  {
    id: 'environment_seed_pc_doll_atelier',
    name: 'The Doll Atelier',
    summary: 'The dollmaker\'s workshop — shelves of porcelain limbs and blank heads, a kiln glowing in the corner, tools and paint laid out for repairs.',
    phraseBundle: {
      core: [
        'a cluttered doll-repair atelier, shelves crowded with porcelain limbs and blank waiting heads',
        'rows of glass eyes in trays and spools of fine wire and thread',
        'a small kiln glowing warm in the corner, tools and paint pots on the bench',
        'half-mended dolls propped in a row, gold repair-seams drying',
        'jars of pigment and a wall of tiny labelled drawers',
        'workmanlike, intimate, and quietly unsettling',
      ],
    },
    createdAt: ENV_SEED_TS_10,
    updatedAt: ENV_SEED_TS_10,
  },
  {
    id: 'environment_seed_pc_rococo_garden',
    name: 'The Overgrown Rococo Garden',
    summary: 'A formal garden run wild — collapsing topiary, mossy statues, a dry tiered fountain, gravel paths swallowed by weeds under a pale sky.',
    phraseBundle: {
      core: [
        'a formal rococo garden run wild, once-geometric topiary collapsing into shapeless green',
        'moss-eaten marble statues and cracked balustrades among the overgrowth',
        'a dry tiered fountain stained with lichen, its basin full of dead leaves',
        'gravel paths swallowed by weeds, roses gone feral over broken trellises',
        'a pale overcast sky, soft flat light over everything',
        'melancholy, fragrant, and beautifully abandoned',
      ],
    },
    createdAt: ENV_SEED_TS_10,
    updatedAt: ENV_SEED_TS_10,
  },
  {
    id: 'environment_seed_pc_banquet_hall',
    name: 'The Endless Banquet Hall',
    summary: 'A long banquet table set for a feast that never came — porcelain place settings, candelabra burned to stubs, dust on every untouched plate.',
    phraseBundle: {
      core: [
        'a long banquet hall, an enormous table set end to end for a feast no one attended',
        'fine porcelain place settings and tarnished silver at every empty chair',
        'candelabra burned down to cold wax stubs along the centre',
        'dust settled thick on every untouched plate and crystal glass',
        'wilted centrepieces and a faded damask cloth gone grey',
        'expectant, formal, and utterly deserted',
      ],
    },
    createdAt: ENV_SEED_TS_10,
    updatedAt: ENV_SEED_TS_10,
  },
  {
    id: 'environment_seed_pc_nursery',
    name: 'The Abandoned Nursery',
    summary: 'A child\'s nursery left mid-play — a dusty rocking horse, scattered toys, an empty cradle, dolls slumped watching from the shelf.',
    phraseBundle: {
      core: [
        'an abandoned nursery, soft faded pastel wallpaper peeling at the seams',
        'a dusty rocking horse stilled mid-rock, scattered wooden toys on the floor',
        'an empty lace-draped cradle and a toppled toy chest',
        'rows of old dolls slumped watching from a high shelf',
        'pale daylight through a grimy window with a torn curtain',
        'tender, faded, and quietly forsaken',
      ],
    },
    createdAt: ENV_SEED_TS_10,
    updatedAt: ENV_SEED_TS_10,
  },
  {
    id: 'environment_seed_pc_boudoir',
    name: 'The Powder Boudoir',
    summary: 'A lady\'s dressing room frozen in time — a great cracked vanity mirror, spilled powder, dried perfume, a stool drawn out as if just left.',
    phraseBundle: {
      core: [
        'an intimate rococo boudoir, a great gilt vanity with a cracked oval mirror',
        'spilled face-powder gone to dust, dried perfume bottles and tarnished brushes',
        'a velvet stool drawn out as if just vacated, a faded silk robe over the chair',
        'rose-and-cream striped walls, a canopied bed with grey draperies',
        'soft pale light through gauze curtains',
        'private, perfumed, and stopped mid-moment',
      ],
    },
    createdAt: ENV_SEED_TS_10,
    updatedAt: ENV_SEED_TS_10,
  },
  {
    id: 'environment_seed_pc_conservatory',
    name: 'The Wax-Flower Conservatory',
    summary: 'A glass conservatory of false flowers — wax and silk blooms under dusty bell jars, the real plants long dead, light grey through grimy panes.',
    phraseBundle: {
      core: [
        'a rococo glass conservatory full of false flowers, wax and silk blooms under dusty bell jars',
        'the real plants long dead and brown in their cracked porcelain pots',
        'grimy glass panes letting in flat grey light, a few cracked and webbed',
        'wrought-iron benches and a dry ornamental pool green with algae',
        'artificial roses faded to grey, petals furred with dust',
        'a strange airless stillness, beauty preserved past death',
      ],
    },
    createdAt: ENV_SEED_TS_10,
    updatedAt: ENV_SEED_TS_10,
  },
  {
    id: 'environment_seed_pc_grand_staircase',
    name: 'The Grand Staircase',
    summary: 'A sweeping double staircase under a vast dead chandelier — worn red carpet, cobwebbed gilt banisters, ancestral portraits climbing the wall.',
    phraseBundle: {
      core: [
        'a sweeping rococo double staircase curving up beneath a vast dead chandelier',
        'threadbare red carpet on the steps, cobwebbed gilt banisters',
        'ancestral portraits in tarnished frames climbing the high wall',
        'a checkerboard marble floor below, dust drifting in a pale shaft of light',
        'a domed ceiling fresco cracked and water-stained above',
        'grand, hushed, and heavy with faded importance',
      ],
    },
    createdAt: ENV_SEED_TS_10,
    updatedAt: ENV_SEED_TS_10,
  },
  {
    id: 'environment_seed_pc_clock_tower',
    name: 'The Stopped Clock Tower',
    summary: 'The palace clockwork interior — enormous brass gears halted mid-tick, dust on the teeth, a cracked clock face glowing pale from behind.',
    phraseBundle: {
      core: [
        'the interior of a great palace clock tower, enormous brass gears halted mid-tick',
        'dust furring the cogs and the long stilled pendulum',
        'a huge translucent clock face glowing pale grey from behind, hands frozen',
        'wooden scaffolding and iron walkways among the mechanism',
        'a single shaft of dim light through the cracked dial',
        'monumental, silent, and stopped in time',
      ],
    },
    createdAt: ENV_SEED_TS_10,
    updatedAt: ENV_SEED_TS_10,
  },
  {
    id: 'environment_seed_pc_doll_crypt',
    name: 'The Crypt of Discarded Dolls',
    summary: 'A cellar catacomb where the broken are laid to rest — shelves and heaps of cracked porcelain dolls in the dark, glass eyes catching the candlelight.',
    phraseBundle: {
      core: [
        'a dim vaulted cellar catacomb, the resting place of broken dolls',
        'stone shelves and soft heaps of cracked porcelain dolls in the shadows',
        'countless glass eyes catching a single candle\'s light',
        'shattered limbs and chipped heads piled gently, almost reverent',
        'cobwebs and cold damp stone, a low arched ceiling',
        'mournful, macabre, and strangely tender',
      ],
    },
    createdAt: ENV_SEED_TS_10,
    updatedAt: ENV_SEED_TS_10,
  },
];

const readEnvironments = (): EnvironmentIdentity[] => {
  const candidates = [
    parseJson(readStorageItem(ENVIRONMENT_STORE_KEY)),
    parseJson(readStorageItem(ENVIRONMENT_STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    const rawEnvironments = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.environments) ? candidate.environments : null);
    if (!rawEnvironments) continue;

    const parsed = sortEnvironments(
      rawEnvironments
        .map(sanitizeEnvironment)
        .filter((env): env is EnvironmentIdentity => Boolean(env))
    );

    if (parsed.length > 0 || rawEnvironments.length === 0) return maybeApplyEnvSeed(parsed);
  }

  return maybeApplyEnvSeed([]);
};

const writeEnvironments = (environments: EnvironmentIdentity[]) => {
  const payload: EnvironmentStore = {
    version: 1,
    environments: sortEnvironments(environments),
  };
  writeStorageItem(ENVIRONMENT_STORE_KEY, payload);
  writeStorageItem(ENVIRONMENT_STORE_BACKUP_KEY, payload);
};

const maybeApplyEnvSeed = (environments: EnvironmentIdentity[]): EnvironmentIdentity[] => {
  let result = environments;

  if (readStorageItem(ENVIRONMENT_SEED_FLAG_KEY) === null) {
    writeStorageItem(ENVIRONMENT_SEED_FLAG_KEY, true);
    const existingIds = new Set(result.map(e => e.id));
    const toAdd = DEFAULT_SEED_ENVIRONMENTS.filter(e => !existingIds.has(e.id));
    if (toAdd.length > 0) {
      result = sortEnvironments([...result, ...toAdd]);
      writeEnvironments(result);
    }
  }

  if (readStorageItem(ENVIRONMENT_SEED_FLAG_KEY_V4) === null) {
    writeStorageItem(ENVIRONMENT_SEED_FLAG_KEY_V4, true);
    const existingIds = new Set(result.map(e => e.id));
    const toAdd = V4_SEED_ENVIRONMENTS.filter(e => !existingIds.has(e.id));
    if (toAdd.length > 0) {
      result = sortEnvironments([...result, ...toAdd]);
      writeEnvironments(result);
    }
  }

  if (readStorageItem(ENVIRONMENT_SEED_FLAG_KEY_V5) === null) {
    writeStorageItem(ENVIRONMENT_SEED_FLAG_KEY_V5, true);
    const existingIds = new Set(result.map(e => e.id));
    const toAdd = V5_SEED_ENVIRONMENTS.filter(e => !existingIds.has(e.id));
    if (toAdd.length > 0) {
      result = sortEnvironments([...result, ...toAdd]);
      writeEnvironments(result);
    }
  }

  if (readStorageItem(ENVIRONMENT_SEED_FLAG_KEY_V6) === null) {
    writeStorageItem(ENVIRONMENT_SEED_FLAG_KEY_V6, true);
    const existingIds = new Set(result.map(e => e.id));
    const toAdd = V6_SEED_ENVIRONMENTS.filter(e => !existingIds.has(e.id));
    if (toAdd.length > 0) {
      result = sortEnvironments([...result, ...toAdd]);
      writeEnvironments(result);
    }
  }

  if (readStorageItem(ENVIRONMENT_SEED_FLAG_KEY_V7) === null) {
    writeStorageItem(ENVIRONMENT_SEED_FLAG_KEY_V7, true);
    const existingIds = new Set(result.map(e => e.id));
    const toAdd = V7_SEED_ENVIRONMENTS.filter(e => !existingIds.has(e.id));
    if (toAdd.length > 0) {
      result = sortEnvironments([...result, ...toAdd]);
      writeEnvironments(result);
    }
  }

  if (readStorageItem(ENVIRONMENT_SEED_FLAG_KEY_V8) === null) {
    writeStorageItem(ENVIRONMENT_SEED_FLAG_KEY_V8, true);
    const existingIds = new Set(result.map(e => e.id));
    const toAdd = V8_SEED_ENVIRONMENTS.filter(e => !existingIds.has(e.id));
    if (toAdd.length > 0) {
      result = sortEnvironments([...result, ...toAdd]);
      writeEnvironments(result);
    }
  }

  if (readStorageItem(ENVIRONMENT_SEED_FLAG_KEY_V9) === null) {
    writeStorageItem(ENVIRONMENT_SEED_FLAG_KEY_V9, true);
    const existingIds = new Set(result.map(e => e.id));
    const toAdd = V9_SEED_ENVIRONMENTS.filter(e => !existingIds.has(e.id));
    if (toAdd.length > 0) {
      result = sortEnvironments([...result, ...toAdd]);
      writeEnvironments(result);
    }
  }

  if (readStorageItem(ENVIRONMENT_SEED_FLAG_KEY_V10) === null) {
    writeStorageItem(ENVIRONMENT_SEED_FLAG_KEY_V10, true);
    const existingIds = new Set(result.map(e => e.id));
    const toAdd = V10_SEED_ENVIRONMENTS.filter(e => !existingIds.has(e.id));
    if (toAdd.length > 0) {
      result = sortEnvironments([...result, ...toAdd]);
      writeEnvironments(result);
    }
  }

  return result;
};

const sanitizeInput = (input: EnvironmentIdentityInput): EnvironmentIdentityInput => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('Environment name is required.');

  const core = sanitizeStringArray(input.phraseBundle.core);
  if (core.length === 0) throw new Error('At least one core phrase is required.');

  return {
    name,
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
    phraseBundle: { core },
  };
};

export async function listEnvironments(): Promise<EnvironmentIdentity[]> {
  return readEnvironments();
}

export async function createEnvironment(input: EnvironmentIdentityInput): Promise<EnvironmentIdentity> {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: EnvironmentIdentity = {
    id: createId('environment'),
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    phraseBundle: sanitized.phraseBundle,
    createdAt: now,
    updatedAt: now,
  };
  const environments = readEnvironments();
  writeEnvironments([...environments, next]);
  return next;
}

export async function updateEnvironment(
  id: string,
  input: EnvironmentIdentityInput
): Promise<EnvironmentIdentity> {
  const environmentId = id.trim();
  if (!environmentId) throw new Error('Environment id is required.');

  const sanitized = sanitizeInput(input);
  const environments = readEnvironments();
  const existing = environments.find(e => e.id === environmentId);
  if (!existing) throw new Error('Environment not found.');

  const updated: EnvironmentIdentity = {
    ...existing,
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    phraseBundle: sanitized.phraseBundle,
    updatedAt: Date.now(),
  };

  writeEnvironments(environments.map(e => (e.id === environmentId ? updated : e)));
  return updated;
}

export async function deleteEnvironment(id: string): Promise<void> {
  const environmentId = id.trim();
  if (!environmentId) throw new Error('Environment id is required.');

  const environments = readEnvironments();
  writeEnvironments(environments.filter(e => e.id !== environmentId));
}
