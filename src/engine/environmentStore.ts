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
