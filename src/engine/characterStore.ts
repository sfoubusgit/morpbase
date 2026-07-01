import type {
  CharacterAvatar,
  CharacterIdentity,
  CharacterIdentityFields,
  CharacterIdentityInput,
  CharacterMotif,
  CharacterPhraseBundle,
  CharacterStore,
  CharacterVisualAnchor,
  CharacterVisualAnchorKind,
} from '../types';

const CHARACTER_STORE_KEY = 'promptgen:characters:v1';
const CHARACTER_STORE_BACKUP_KEY = 'promptgen:characters:backup:v1';
const CHARACTER_SEED_FLAG_KEY = 'promptgen:characters:seeded:v3';
const CHARACTER_SEED_FLAG_KEY_V4 = 'promptgen:characters:seeded:v4';
const CHARACTER_SEED_FLAG_KEY_V5 = 'promptgen:characters:seeded:v5';
const CHARACTER_SEED_FLAG_KEY_V6 = 'promptgen:characters:seeded:v6';
const CHARACTER_SEED_FLAG_KEY_V7 = 'promptgen:characters:seeded:v7';
const CHARACTER_SEED_FLAG_KEY_V8 = 'promptgen:characters:seeded:v8';
const CHARACTER_SEED_FLAG_KEY_V9 = 'promptgen:characters:seeded:v9';
const CHARACTER_SEED_FLAG_KEY_V10 = 'promptgen:characters:seeded:v10';
const CHARACTER_SEED_FLAG_KEY_V11 = 'promptgen:characters:seeded:v11';
const CHARACTER_SEED_FLAG_KEY_V12 = 'promptgen:characters:seeded:v12';
const CHARACTER_SEED_FLAG_KEY_V13 = 'promptgen:characters:seeded:v13';
const CHARACTER_SEED_FLAG_KEY_V14 = 'promptgen:characters:seeded:v14';
const CHARACTER_SEED_FLAG_KEY_V15 = 'promptgen:characters:seeded:v15';
const CHARACTER_SEED_FLAG_KEY_V16 = 'promptgen:characters:seeded:v16';
const CHARACTER_SEED_FLAG_KEY_V17 = 'promptgen:characters:seeded:v17';
const CHARACTER_SEED_FLAG_KEY_V18 = 'promptgen:characters:seeded:v18';
const CHARACTER_SEED_FLAG_KEY_V19 = 'promptgen:characters:seeded:v19';
const CHARACTER_AVATAR_MAX_BYTES = 60 * 1024;

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

const sortCharacters = <T extends CharacterIdentity>(characters: T[]): T[] =>
  [...characters].sort((left, right) => {
    if (right.updatedAt !== left.updatedAt) {
      return right.updatedAt - left.updatedAt;
    }
    if (right.createdAt !== left.createdAt) {
      return right.createdAt - left.createdAt;
    }
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

const estimateDataUrlBytes = (dataUrl: string): number => {
  const marker = 'base64,';
  const index = dataUrl.indexOf(marker);
  if (index === -1) return dataUrl.length;
  const base64 = dataUrl.slice(index + marker.length);
  return Math.ceil((base64.length * 3) / 4);
};

const sanitizeAvatarMimeType = (value: unknown): CharacterAvatar['mimeType'] | undefined => {
  switch (value) {
    case 'image/jpeg':
    case 'image/png':
    case 'image/webp':
      return value;
    default:
      return undefined;
  }
};

const sanitizeAvatar = (value: unknown): CharacterAvatar | undefined => {
  if (!isRecord(value)) return undefined;

  const mimeType = sanitizeAvatarMimeType(value.mimeType);
  const dataUrl = typeof value.dataUrl === 'string' ? value.dataUrl.trim() : '';
  const width = typeof value.width === 'number' && Number.isFinite(value.width)
    ? Math.max(1, Math.round(value.width))
    : 0;
  const height = typeof value.height === 'number' && Number.isFinite(value.height)
    ? Math.max(1, Math.round(value.height))
    : 0;

  if (!mimeType || !dataUrl || width === 0 || height === 0) {
    return undefined;
  }

  if (!dataUrl.startsWith(`data:${mimeType};base64,`)) {
    return undefined;
  }

  if (estimateDataUrlBytes(dataUrl) > CHARACTER_AVATAR_MAX_BYTES) {
    return undefined;
  }

  return {
    dataUrl,
    mimeType,
    width,
    height,
  };
};

const sanitizeAnchorKind = (value: unknown): CharacterVisualAnchorKind | undefined => {
  switch (value) {
    case 'hair':
    case 'face':
    case 'eyes':
    case 'silhouette':
    case 'clothing':
    case 'accessory':
    case 'other':
      return value;
    default:
      return undefined;
  }
};

const sanitizeVisualAnchor = (
  value: unknown,
  index: number
): CharacterVisualAnchor | null => {
  if (!isRecord(value)) return null;

  const label = typeof value.label === 'string' ? normalizeText(value.label) : '';
  const text = typeof value.text === 'string' ? normalizeText(value.text) : '';
  if (!label || !text) {
    return null;
  }

  const id = typeof value.id === 'string' && value.id.trim()
    ? value.id.trim()
    : `anchor_${index + 1}`;

  return {
    id,
    label,
    text,
    kind: sanitizeAnchorKind(value.kind),
  };
};

const sanitizeMotif = (value: unknown, index: number): CharacterMotif | null => {
  if (!isRecord(value)) return null;

  const label = typeof value.label === 'string' ? normalizeText(value.label) : '';
  const text = typeof value.text === 'string' ? normalizeText(value.text) : '';
  if (!label || !text) {
    return null;
  }

  const id = typeof value.id === 'string' && value.id.trim()
    ? value.id.trim()
    : `motif_${index + 1}`;

  return {
    id,
    label,
    text,
  };
};

const sanitizeFields = (value: unknown): CharacterIdentityFields => {
  if (!isRecord(value)) {
    return {
      visualAnchors: [],
      motifs: [],
    };
  }

  return {
    archetype: typeof value.archetype === 'string' ? normalizeText(value.archetype) || undefined : undefined,
    role: typeof value.role === 'string' ? normalizeText(value.role) || undefined : undefined,
    ageImpression: typeof value.ageImpression === 'string' ? normalizeText(value.ageImpression) || undefined : undefined,
    presentation: typeof value.presentation === 'string' ? normalizeText(value.presentation) || undefined : undefined,
    personalityTone: typeof value.personalityTone === 'string' ? normalizeText(value.personalityTone) || undefined : undefined,
    visualAnchors: Array.isArray(value.visualAnchors)
      ? value.visualAnchors
          .map(sanitizeVisualAnchor)
          .filter((entry): entry is CharacterVisualAnchor => Boolean(entry))
      : [],
    motifs: Array.isArray(value.motifs)
      ? value.motifs
          .map(sanitizeMotif)
          .filter((entry): entry is CharacterMotif => Boolean(entry))
      : [],
  };
};

const sanitizePhraseBundle = (value: unknown): CharacterPhraseBundle => {
  if (!isRecord(value)) {
    return { core: [] };
  }

  const core = sanitizeStringArray(value.core);
  const optional = sanitizeStringArray(value.optional);

  return {
    core,
    optional: optional.length > 0 ? optional : undefined,
  };
};

const sanitizeCharacter = (value: unknown): CharacterIdentity | null => {
  if (!isRecord(value)) return null;

  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const name = typeof value.name === 'string' ? normalizeText(value.name) : '';
  if (!id || !name) {
    return null;
  }

  const phraseBundle = sanitizePhraseBundle(value.phraseBundle);
  if (phraseBundle.core.length === 0) {
    return null;
  }

  const createdAt = typeof value.createdAt === 'number' && Number.isFinite(value.createdAt)
    ? value.createdAt
    : Date.now();
  const updatedAt = typeof value.updatedAt === 'number' && Number.isFinite(value.updatedAt)
    ? value.updatedAt
    : createdAt;

  const rawTags = Array.isArray(value.tags) ? sanitizeStringArray(value.tags) : [];

  return {
    id,
    name,
    summary: typeof value.summary === 'string' ? normalizeText(value.summary) || undefined : undefined,
    coverImageUrl: typeof value.coverImageUrl === 'string' ? value.coverImageUrl.trim() || undefined : undefined,
    avatar: sanitizeAvatar(value.avatar),
    identity: sanitizeFields(value.identity),
    phraseBundle,
    tags: rawTags.length > 0 ? rawTags : undefined,
    loraTrigger: typeof value.loraTrigger === 'string' ? normalizeText(value.loraTrigger) || undefined : undefined,
    createdAt,
    updatedAt,
  };
};

const SEED_TS = 1746748800000;
const SEED_TS_2 = 1746835200000;
const SEED_TS_3 = 1747612800000;
const SEED_TS_4 = 1747699200000;
const SEED_TS_5 = 1747872000000;
const SEED_TS_6 = 1747958400000;
const SEED_TS_7 = 1748044800000;
const SEED_TS_8 = 1748131200000;
const SEED_TS_9 = 1748217600000;
const SEED_TS_10 = 1748304000000;
const SEED_TS_11 = 1748390400000;
const SEED_TS_12 = 1748476800000;
const SEED_TS_13 = 1748563200000;
const SEED_TS_14 = 1748649600000;
const SEED_TS_15 = 1748736000000;
const SEED_TS_16 = 1748822400000;
const SEED_TS_17 = 1749600000000;
const SEED_TS_18 = 1749859200000;
const SEED_TS_19 = 1750204800000;

const DEFAULT_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_lyra_voss',
    name: 'Lyra Voss',
    summary: 'A pale cartographer with white voluminous hair, amber spectacles, and an ink-stained left hand.',
    tags: ['solo', 'scholar'],
    identity: {
      archetype: 'scholar',
      presentation: 'nude',
      ageImpression: 'adult',
      visualAnchors: [
        { id: 'anchor_lv_1', label: 'Silhouette', kind: 'silhouette', text: 'tall slender figure, very wide perfect hips, mildly athletic build' },
        { id: 'anchor_lv_2', label: 'Chest', kind: 'other', text: 'very huge low-hanging teardrop-shaped breasts, extremely large areolas' },
        { id: 'anchor_lv_3', label: 'Hair', kind: 'hair', text: 'white voluminous hair' },
        { id: 'anchor_lv_4', label: 'Eyes', kind: 'eyes', text: 'black eyes' },
        { id: 'anchor_lv_5', label: 'Face', kind: 'face', text: 'angular features, pale complexion' },
        { id: 'anchor_lv_6', label: 'Spectacles', kind: 'accessory', text: 'round amber spectacles' },
        { id: 'anchor_lv_7', label: 'Ink Hand', kind: 'other', text: 'left hand stained dark with cartographer\'s ink' },
      ],
      motifs: [
        { id: 'motif_lv_1', label: 'Cartographer', text: 'ink-stained hands, maps, scholarly precision' },
      ],
    },
    phraseBundle: {
      core: [
        'tall slender nude woman',
        'very huge low-hanging teardrop-shaped breasts, extremely large areolas',
        'very wide perfect hips, mildly athletic build',
        'white voluminous hair, black eyes, round amber spectacles',
        'angular features, pale complexion',
        'left hand stained dark with cartographer\'s ink',
      ],
    },
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'character_seed_mira_duskhollow',
    name: 'Mira Duskhollow',
    summary: 'A warm-skinned alchemist with curvy build, coily black hair, and burn-marked forearms.',
    tags: ['solo', 'scholar'],
    identity: {
      archetype: 'alchemist',
      presentation: 'nude',
      ageImpression: 'young adult',
      visualAnchors: [
        { id: 'anchor_md_1', label: 'Silhouette', kind: 'silhouette', text: 'medium height, full curvy build, soft rounded belly, strong forearms' },
        { id: 'anchor_md_2', label: 'Skin', kind: 'other', text: 'warm brown skin, small burn marks on forearms and hands' },
        { id: 'anchor_md_3', label: 'Hair', kind: 'hair', text: 'tight coily black hair worn loose, voluminous' },
        { id: 'anchor_md_4', label: 'Eyes', kind: 'eyes', text: 'dark brown eyes, direct gaze' },
        { id: 'anchor_md_5', label: 'Face', kind: 'face', text: 'full lips, broad nose, soft rounded features' },
      ],
      motifs: [
        { id: 'motif_md_1', label: 'Alchemy', text: 'burn marks, reagent stains, hands that have worked with fire' },
      ],
    },
    phraseBundle: {
      core: [
        'young woman with warm brown skin, full curvy build',
        'soft rounded belly, strong forearms with small burn marks',
        'tight coily black hair worn loose and voluminous',
        'dark brown eyes, full lips, broad nose, soft rounded features',
      ],
    },
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'character_seed_vesper',
    name: 'Vesper',
    summary: 'A pale oracle — ageless, extremely slender, with floor-length silver-white hair and unsettling stillness.',
    tags: ['solo', 'oracle'],
    identity: {
      archetype: 'oracle',
      presentation: 'nude',
      ageImpression: 'ageless adult',
      visualAnchors: [
        { id: 'anchor_vs_1', label: 'Silhouette', kind: 'silhouette', text: 'tall, extremely slender, almost no body fat, prominent sharp clavicles' },
        { id: 'anchor_vs_2', label: 'Skin', kind: 'other', text: 'very pale skin, almost translucent quality' },
        { id: 'anchor_vs_3', label: 'Hair', kind: 'hair', text: 'extremely long straight silver-white hair falling past the waist' },
        { id: 'anchor_vs_4', label: 'Eyes', kind: 'eyes', text: 'pale grey eyes, unsettling stillness' },
        { id: 'anchor_vs_5', label: 'Face', kind: 'face', text: 'sharp angular face, high cheekbones, thin lips' },
      ],
      motifs: [
        { id: 'motif_vs_1', label: 'Oracle', text: 'stillness, silver-white, ageless presence, cold clarity' },
      ],
    },
    phraseBundle: {
      core: [
        'tall extremely slender woman, almost no body fat',
        'very pale skin with a translucent quality, prominent sharp clavicles',
        'extremely long straight silver-white hair falling past the waist',
        'pale grey eyes, sharp angular face, high cheekbones, thin lips',
        'ageless stillness, cold and composed presence',
      ],
    },
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'character_seed_azurok',
    name: 'Azurok',
    summary: 'An ancient blue dragon whose scales shift from abyssal navy to electric cerulean, crackling with latent static charge absorbed over millennia.',
    tags: ['solo', 'creature'],
    identity: {
      archetype: 'dragon',
      presentation: 'creature',
      ageImpression: 'ancient',
      visualAnchors: [
        { id: 'anchor_az_1', label: 'Form', kind: 'silhouette', text: 'massive ancient dragon, colossal wingspan, battle-scarred and immovable' },
        { id: 'anchor_az_2', label: 'Scales', kind: 'other', text: 'scales shifting from deep abyssal navy to electric cerulean, iridescent violet-silver at the oldest edges' },
        { id: 'anchor_az_3', label: 'Patterns', kind: 'other', text: 'crystalline scale patterns, fractal and geometric like branching lightning frozen into sapphire' },
        { id: 'anchor_az_4', label: 'Bioluminescence', kind: 'other', text: 'bioluminescent veins tracing electric blue light through the hide' },
        { id: 'anchor_az_5', label: 'Eyes', kind: 'eyes', text: 'pale silver-white irises, vast ancient intelligence behind still eyes' },
        { id: 'anchor_az_6', label: 'Charge', kind: 'other', text: 'crackling with latent static charge, faint ozone in the surrounding air' },
      ],
      motifs: [
        { id: 'motif_az_1', label: 'The Tempest Ancient', text: 'storm, lightning, millennia of charge absorbed, the weight of geological time' },
      ],
    },
    phraseBundle: {
      core: [
        'ancient blue dragon, colossal and storm-scarred',
        'scales shifting from deep abyssal navy to electric cerulean, iridescent violet-silver at the oldest edges',
        'crystalline scale patterns, fractal and geometric like branching lightning frozen into sapphire',
        'bioluminescent veins tracing electric blue light through the hide',
        'pale silver-white irises, vast ancient intelligence behind still eyes',
        'crackling with latent static charge, faint ozone in the surrounding air',
      ],
    },
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
];

const V4_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_thalara',
    name: 'Thalara',
    summary: 'A deep-sea primordial — indigo skin mapped with bioluminescent aquamarine patterns, kelp-black drifting hair, and abyssal eyes lit cold from within.',
    tags: ['solo', 'primordial'],
    identity: {
      archetype: 'primordial',
      presentation: 'nude',
      ageImpression: 'ageless adult',
      visualAnchors: [
        { id: 'anchor_th_1', label: 'Silhouette', kind: 'silhouette', text: 'tall lithe woman, unnaturally long limbs, slight iridescent membrane between elongated fingers' },
        { id: 'anchor_th_2', label: 'Skin', kind: 'other', text: 'deep indigo-blue skin, matte with a subtle scaled texture, catches light like wet obsidian' },
        { id: 'anchor_th_3', label: 'Bioluminescence', kind: 'other', text: 'aquamarine bioluminescent patterns tracing the spine, collarbones, and hands, pulsing faintly' },
        { id: 'anchor_th_4', label: 'Hair', kind: 'hair', text: 'kelp-black hair drifting as if submerged, loose strands of deep emerald-black, weightless' },
        { id: 'anchor_th_5', label: 'Eyes', kind: 'eyes', text: 'large eyes with no whites, deep abyssal black iris lit by a cold blue inner glow' },
        { id: 'anchor_th_6', label: 'Face', kind: 'face', text: 'sharp symmetrical features, slightly too-wide mouth, expression of ancient and absolute calm' },
      ],
      motifs: [
        { id: 'motif_th_1', label: 'The Abyss', text: 'crushing depth, cold light, the patience of geological time, beauty born in total darkness' },
      ],
    },
    phraseBundle: {
      core: [
        'tall lithe woman with deep indigo-blue skin, subtle scaled texture',
        'aquamarine bioluminescent patterns tracing the spine, collarbones, and hands',
        'kelp-black hair drifting weightlessly as if submerged',
        'large abyssal black eyes with cold blue inner glow',
        'sharp symmetrical features, slightly too-wide mouth, ancient calm expression',
        'iridescent membrane between elongated fingers',
      ],
    },
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
];

const V5_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_alice_and_the_white',
    name: 'Alice & The White',
    summary: 'A slight girl in a blue pinafore looking up with complete delight at a colossal grotesque white rabbit-creature — unbothered by what she cannot see is wrong about it.',
    tags: ['duo', 'horror'],
    identity: {
      archetype: 'duo',
      presentation: 'clothed',
      ageImpression: 'child and ageless',
      visualAnchors: [
        { id: 'anchor_aw_1', label: 'Alice — Form', kind: 'silhouette', text: 'slight young girl, slim build, standing small on a forest path, looking upward' },
        { id: 'anchor_aw_2', label: 'Alice — Clothing', kind: 'clothing', text: 'blue short-sleeved pinafore dress, white apron, white ankle socks, black mary jane shoes, black bow headband' },
        { id: 'anchor_aw_3', label: 'Alice — Face', kind: 'face', text: 'blonde hair, wide blue eyes, broad delighted smile, expression of complete and fearless wonder' },
        { id: 'anchor_aw_4', label: 'The White — Form', kind: 'silhouette', text: 'colossal white-furred creature, three times her height, bloated round belly, long floppy rabbit ears, small fluffy tail, humanoid posture' },
        { id: 'anchor_aw_5', label: 'The White — Face', kind: 'face', text: 'elongated horse-like snout, massive wide mouth full of large flat human teeth, long pink tongue hanging loose, single bulging bloodshot eye' },
        { id: 'anchor_aw_6', label: 'The White — Limbs', kind: 'other', text: 'humanoid arms, long-fingered clawed hands hanging at its sides, rabbit hindquarters, white fur throughout' },
        { id: 'anchor_aw_7', label: 'Dynamic', kind: 'other', text: 'Alice looking up at the creature with delight, the creature looming over her, tongue descending toward her, size contrast enormous, the girl wholly unbothered' },
      ],
      motifs: [
        { id: 'motif_aw_1', label: 'Innocence & the Uncanny', text: 'the horror of Wonderland seen through the eyes of someone who finds it wonderful, wrongness met with delight' },
      ],
    },
    phraseBundle: {
      core: [
        'a slight young girl in a blue pinafore and white apron, standing on a forest path looking upward with wide delighted eyes and a fearless smile',
        'beside her: a colossal white-furred creature, three times her height, vaguely rabbit in shape but wrong in every specific',
        'elongated horse-like snout, massive wide mouth full of large flat human teeth, long pink tongue hanging loose toward her',
        'single bulging bloodshot eye regarding her from above, long floppy white ears, small fluffy tail',
        'humanoid arms and long-fingered clawed hands, bloated round belly, white fur, rabbit hindquarters',
        'the girl smiling upward with complete delight, unbothered by what she cannot see is wrong about it',
        'dark forest path, tall trees, dappled light, small wildflowers at the edge of the path',
      ],
    },
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
];

const V6_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_vael_and_holt',
    name: 'Vael & Holt',
    summary: 'A half-demon scout and her battle-worn guardian — she clings to his back like she belongs there, and he carries her like it\'s the only thing still making sense.',
    tags: ['duo', 'urban', 'combat'],
    identity: {
      archetype: 'duo',
      presentation: 'clothed',
      ageImpression: 'she — young adult; he — mid-thirties, seasoned',
      personalityTone: 'tender beneath the tactical; warmth earned through danger',
      visualAnchors: [
        { id: 'anchor_vh_1', label: 'Vael — Hair', kind: 'hair', text: 'short dark hair with teal gradient, glowing cyan rim light' },
        { id: 'anchor_vh_2', label: 'Vael — Face', kind: 'face', text: 'pointed elf ears, soft green eyes, faint blush on cheeks' },
        { id: 'anchor_vh_3', label: 'Vael — Tail', kind: 'other', text: 'red-tipped demon tail with arrowhead end' },
        { id: 'anchor_vh_4', label: 'Vael — Clothing', kind: 'clothing', text: 'teal-gray jacket with red armored insignia shoulder plates, torn dark stockings' },
        { id: 'anchor_vh_5', label: 'Holt — Form', kind: 'silhouette', text: 'broad-shouldered, strong jaw, short brown beard, commanding build' },
        { id: 'anchor_vh_6', label: 'Holt — Clothing', kind: 'clothing', text: 'dark tactical jacket with chest harness straps' },
        { id: 'anchor_vh_7', label: 'Pose', kind: 'other', text: 'piggyback carry — she rides on his back, arms wrapped around his neck, cheek close to his' },
      ],
      motifs: [
        { id: 'motif_vh_1', label: 'Guardian Bond', text: 'cyan rimlight, contrast of large and small, armored softness, quiet intimacy earned through danger' },
      ],
    },
    phraseBundle: {
      core: [
        'small demon-eared girl carried piggyback by a broad-shouldered guardian',
        'her arms wrapped around his neck, cheek close to his, soft blush on her face',
        'pointed elf ears, short dark teal-gradient hair, red-tipped arrowhead demon tail',
        'teal-gray jacket with red armored insignia shoulder plates, torn dark stockings',
        'broad-shouldered man, strong jaw, short brown beard, dark tactical jacket with harness straps',
        'teal and cyan rimlight against deep blue night city backdrop',
        'the quiet warmth between a protector and the one who trusts him completely',
      ],
    },
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
];

const V7_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_homura_and_raiu',
    name: 'Homura & Raiu',
    summary: 'Two divine women, back-to-back — the pink flame and the purple storm. Equals in power, opposite in temperament, bound by something older than their rivalry.',
    tags: ['duo', 'divine', 'japan'],
    identity: {
      archetype: 'duo',
      presentation: 'clothed',
      ageImpression: 'ageless, presented as mature young women',
      personalityTone: 'Homura — warm, confident, slightly smug; Raiu — composed, serious, quietly sovereign',
      visualAnchors: [
        { id: 'anchor_hr_1', label: 'Homura — Hair', kind: 'hair', text: 'long flowing pink-salmon hair, windswept layers' },
        { id: 'anchor_hr_2', label: 'Homura — Accessories', kind: 'accessory', text: 'gold arc-shaped ornamental hairpins, chandelier earrings with purple gemstone center, red choker' },
        { id: 'anchor_hr_3', label: 'Homura — Eyes', kind: 'eyes', text: 'bright violet eyes, soft confident smile' },
        { id: 'anchor_hr_4', label: 'Homura — Clothing', kind: 'clothing', text: 'white ceremonial garment with red and gold accents, revealing neckline' },
        { id: 'anchor_hr_5', label: 'Raiu — Hair', kind: 'hair', text: 'long straight deep purple-navy hair with blunt bangs' },
        { id: 'anchor_hr_6', label: 'Raiu — Accessories', kind: 'accessory', text: 'small blue flower hair ornament, gold hair clip' },
        { id: 'anchor_hr_7', label: 'Raiu — Eyes', kind: 'eyes', text: 'glowing violet eyes, small beauty mark near eye, composed expression' },
        { id: 'anchor_hr_8', label: 'Raiu — Clothing', kind: 'clothing', text: 'off-shoulder white and purple ceremonial garment with gold trim, red floral accent at shoulder' },
        { id: 'anchor_hr_9', label: 'Pose', kind: 'other', text: 'back-to-back pose, both facing outward, equal and opposing' },
      ],
      motifs: [
        { id: 'motif_hr_1', label: 'Flame & Storm', text: 'sakura petals at night, purple lightning, warmth against cold, two opposites bound as equals' },
      ],
    },
    phraseBundle: {
      core: [
        'two divine women standing back-to-back, pink flame and purple storm',
        'long flowing pink-salmon hair beside long straight deep purple-navy hair with blunt bangs',
        'gold arc ornamental hairpins, chandelier earrings with violet gem, red choker',
        'white ceremonial garments with red and gold accents, off-shoulder silhouettes',
        'bright violet eyes and glowing violet eyes, one smiling, one composed',
        'sakura petals drifting and purple lightning splitting the night sky behind them',
        'the quiet gravity of equals who have long since stopped needing to prove it',
      ],
    },
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
];

const V8_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_pyrrok',
    name: 'Pyrrok',
    summary: 'An ancient red dragon whose scales shift from obsidian-black to volcanic crimson — heat that has accumulated over geological time and has not yet finished burning.',
    tags: ['solo', 'creature'],
    identity: {
      archetype: 'dragon',
      presentation: 'creature',
      ageImpression: 'ancient',
      visualAnchors: [
        { id: 'anchor_py_1', label: 'Form', kind: 'silhouette', text: 'massive ancient dragon, colossal wingspan, volcanic-scarred and immovable, every scar still faintly glowing' },
        { id: 'anchor_py_2', label: 'Scales', kind: 'other', text: 'scales shifting from deep obsidian-black to volcanic crimson, ember-orange fractures glowing at the oldest edges' },
        { id: 'anchor_py_3', label: 'Patterns', kind: 'other', text: 'fractured volcanic glass patterns, obsidian geometry shattered and set into rigid angular formations across every surface' },
        { id: 'anchor_py_4', label: 'Molten Veins', kind: 'other', text: 'deep red-orange molten channels tracing through the hide, glowing from within like cooling magma that has never fully cooled' },
        { id: 'anchor_py_5', label: 'Eyes', kind: 'eyes', text: 'smoldering deep amber-gold irises, ancient intelligence behind eyes like looking into a furnace at its core' },
        { id: 'anchor_py_6', label: 'Heat', kind: 'other', text: 'radiating waves of scorching heat, air shimmering in distortion around the entire form, faint sulfur and ash in the surrounding air' },
      ],
      motifs: [
        { id: 'motif_py_1', label: 'The Tectonic Ancient', text: 'magma, volcanic age, tectonic weight, the heat of the earth\'s core given form and patience' },
      ],
    },
    phraseBundle: {
      core: [
        'ancient red dragon, colossal and volcanic-scarred, every old wound still faintly glowing',
        'scales shifting from deep obsidian-black to volcanic crimson, ember-orange fractures at the oldest edges',
        'fractured volcanic glass patterns, obsidian geometry shattered and set into rigid angular formations',
        'deep red-orange molten channels tracing through the hide, glowing like magma that never fully cools',
        'smoldering amber-gold irises, ancient intelligence behind eyes like looking into a furnace',
        'radiating scorching heat, air shimmering in distortion, faint sulfur and ash throughout',
      ],
    },
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
];

const V9_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_alice_liddell',
    name: 'Alice Liddell',
    summary: 'A slight girl in her iconic blue dress — precise, curious, unruffled by the impossible. The still eye of the Wonderland storm.',
    tags: ['solo', 'classic'],
    identity: {
      archetype: 'dreamer',
      presentation: 'clothed',
      ageImpression: 'child',
      personalityTone: 'composed and curious; unbothered by the absurd; politely brave',
      visualAnchors: [
        { id: 'anchor_al_1', label: 'Silhouette', kind: 'silhouette', text: 'slight small girl, slim build, composed upright posture' },
        { id: 'anchor_al_2', label: 'Dress', kind: 'clothing', text: 'short-sleeved blue pinafore dress, white apron tied at the waist, white petticoat hem visible below' },
        { id: 'anchor_al_3', label: 'Shoes & Socks', kind: 'clothing', text: 'white ankle socks with lace trim, black mary jane shoes' },
        { id: 'anchor_al_4', label: 'Hair', kind: 'hair', text: 'blonde shoulder-length hair held back with a black bow headband' },
        { id: 'anchor_al_5', label: 'Eyes', kind: 'eyes', text: 'wide light blue eyes, steady and curious gaze' },
        { id: 'anchor_al_6', label: 'Face', kind: 'face', text: 'soft round face, small precise mouth, composed expression with a slight lift at the corner — almost amused' },
      ],
      motifs: [
        { id: 'motif_al_1', label: 'Composure in Chaos', text: 'blue against a world of riot and color; the still center of a storm she does not know is a storm' },
      ],
    },
    phraseBundle: {
      core: [
        'slight girl in a short-sleeved blue pinafore dress with a white apron',
        'white petticoat visible at the hem, white ankle socks with lace trim, black mary jane shoes',
        'blonde shoulder-length hair held back with a black bow headband',
        'wide light blue eyes, soft round face, composed expression with a trace of amusement',
        'small and precise in a world that has entirely lost its senses',
      ],
    },
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'character_seed_mad_hatter',
    name: 'The Mad Hatter',
    summary: 'A wiry, endlessly animated host — the one who invited everyone and is shocked you are not staying for another cup.',
    tags: ['solo', 'classic'],
    identity: {
      archetype: 'eccentric host',
      presentation: 'clothed',
      ageImpression: 'indeterminate adult',
      personalityTone: 'manic warmth; absolute conviction in his own logic; genuinely delighted by everything',
      visualAnchors: [
        { id: 'anchor_mh_1', label: 'Silhouette', kind: 'silhouette', text: 'wiry slight man, animated and in constant motion, lean build' },
        { id: 'anchor_mh_2', label: 'Hat', kind: 'accessory', text: 'enormous battered top hat, faded teal-green velvet, a small paper card tucked in the hatband reading 10/6' },
        { id: 'anchor_mh_3', label: 'Coat', kind: 'clothing', text: 'mismatched patchwork coat in burgundy, amber, and teal brocade, buttons from different sets, fraying at every cuff' },
        { id: 'anchor_mh_4', label: 'Cravat & Waistcoat', kind: 'clothing', text: 'ink-stained white cravat tied in an enormous bow, striped waistcoat of orange and gold' },
        { id: 'anchor_mh_5', label: 'Hair', kind: 'hair', text: 'wild copper-orange frizz hair escaping in all directions from under the hat brim' },
        { id: 'anchor_mh_6', label: 'Eyes', kind: 'eyes', text: 'one green eye, one amber eye, both extraordinarily wide — the gaze of someone who has just thought of something' },
        { id: 'anchor_mh_7', label: 'Face', kind: 'face', text: 'expressive pale face, long fine nose, wide mouth often mid-word, eyebrows communicating entirely separate thoughts' },
      ],
      motifs: [
        { id: 'motif_mh_1', label: 'Teatime Forever', text: 'perpetual 6 o\'clock, the endless table, the logic of someone who has been having tea since before you can remember' },
      ],
    },
    phraseBundle: {
      core: [
        'wiry pale man in an enormous battered teal-green top hat, paper card reading 10/6 in the hatband',
        'mismatched patchwork coat in burgundy, amber, and teal brocade, buttons from entirely different sets',
        'ink-stained white cravat in an enormous bow, orange-and-gold striped waistcoat',
        'wild copper-orange frizz hair escaping from under the hat brim in every direction',
        'one green eye, one amber eye, both wide open as if he just had a thought',
        'the expression of absolute hospitality mixed with conviction that you are being somehow unreasonable',
      ],
    },
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'character_seed_cheshire_cat',
    name: 'The Cheshire Cat',
    summary: 'A large floating cat of candy-stripe pink and violet, body half-visible, grin entire. It will leave; the grin will stay.',
    tags: ['solo', 'creature', 'classic'],
    identity: {
      archetype: 'trickster',
      presentation: 'creature',
      ageImpression: 'ageless',
      personalityTone: 'amused detachment; unhelpfully helpful; the grin knows something',
      visualAnchors: [
        { id: 'anchor_cc_1', label: 'Form', kind: 'silhouette', text: 'large domestic cat form, floating without visible support, body partially transparent in places' },
        { id: 'anchor_cc_2', label: 'Stripes', kind: 'other', text: 'candy-stripe pattern in alternating deep pink and soft violet, stripes following the body\'s contours' },
        { id: 'anchor_cc_3', label: 'Grin', kind: 'face', text: 'enormous crescent grin, too wide for the face, sharp white teeth, persisting after the rest of the cat begins to fade' },
        { id: 'anchor_cc_4', label: 'Eyes', kind: 'eyes', text: 'large pale amber-gold eyes with vertical slit pupils, amused and entirely composed' },
        { id: 'anchor_cc_5', label: 'Tail', kind: 'other', text: 'long striped tail curling slowly, the tip the last solid part before the grin' },
        { id: 'anchor_cc_6', label: 'Fade', kind: 'other', text: 'edges of the body losing definition and dissolving into the surrounding air, the disappearing a slow deliberate process' },
      ],
      motifs: [
        { id: 'motif_cc_1', label: 'The Remaining Grin', text: 'presence that outlasts form; the joke that persists after the joker is gone; Wonderland logic made visible' },
      ],
    },
    phraseBundle: {
      core: [
        'large floating cat in alternating deep pink and soft violet candy stripes',
        'body partially transparent, edges dissolving into the surrounding air',
        'enormous crescent grin, too wide for the face, sharp white teeth',
        'large pale amber-gold eyes with vertical slit pupils, amused and entirely at ease',
        'long striped tail curling slowly, the tip remaining after the body has mostly faded',
        'the grin persisting in the air after the rest of the cat has gone',
      ],
    },
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'character_seed_red_queen',
    name: 'The Red Queen',
    summary: 'A commanding figure in blood-red silk, all heart motifs and absolute authority — perpetually furious, perpetually obeyed.',
    tags: ['solo', 'classic'],
    identity: {
      archetype: 'tyrant sovereign',
      presentation: 'clothed',
      ageImpression: 'imperious adult',
      personalityTone: 'absolute fury held in rigid composure; the certainty of someone who is never wrong',
      visualAnchors: [
        { id: 'anchor_rq_1', label: 'Silhouette', kind: 'silhouette', text: 'commanding tall woman, rigid upright posture, stillness that implies imminent action' },
        { id: 'anchor_rq_2', label: 'Gown', kind: 'clothing', text: 'blood-red silk gown with a sweeping train, black heart appliqués across the bodice and hem, fitted waist, high neckline' },
        { id: 'anchor_rq_3', label: 'Crown', kind: 'accessory', text: 'tall spiked obsidian crown with small red heart gems at each point' },
        { id: 'anchor_rq_4', label: 'Face', kind: 'face', text: 'chalk-white face, blood-red painted lips, arched black brows in a permanent arch of displeasure' },
        { id: 'anchor_rq_5', label: 'Eyes', kind: 'eyes', text: 'dark eyes of cold appraisal, seeing everything that is wrong' },
        { id: 'anchor_rq_6', label: 'Hands', kind: 'other', text: 'pale hands in black lace gloves, held rigid at her sides or clasped in a grip just short of visible effort' },
      ],
      motifs: [
        { id: 'motif_rq_1', label: 'Off with Their Heads', text: 'red and black hearts, absolute authority, the fury of someone never questioned who still finds it insufficient' },
      ],
    },
    phraseBundle: {
      core: [
        'commanding tall woman in a blood-red silk gown with a sweeping train, black heart appliqués across the bodice and hem',
        'tall spiked obsidian crown with small red heart gems at each point',
        'chalk-white face, blood-red painted lips, arched brows in a permanent expression of displeasure',
        'dark eyes of cold appraisal, pale hands in black lace gloves',
        'absolute stillness that implies absolute authority and imminent fury',
      ],
    },
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'character_seed_white_rabbit',
    name: 'The White Rabbit',
    summary: 'A flustered white rabbit in a mustard waistcoat, perpetually consulting his pocket watch, always catastrophically late.',
    tags: ['solo', 'creature', 'classic'],
    identity: {
      archetype: 'herald',
      presentation: 'clothed',
      ageImpression: 'flustered middle-aged adult',
      personalityTone: 'perpetual anxious urgency; never enough time; profoundly important business elsewhere',
      visualAnchors: [
        { id: 'anchor_wr_1', label: 'Form', kind: 'silhouette', text: 'upright white-furred rabbit, humanoid posture, medium height, slightly hunched forward in haste' },
        { id: 'anchor_wr_2', label: 'Ears', kind: 'other', text: 'long white rabbit ears, one slightly askew in perpetual fluster' },
        { id: 'anchor_wr_3', label: 'Waistcoat', kind: 'clothing', text: 'mustard-yellow waistcoat with small brass buttons, a gold watch chain looping from the pocket' },
        { id: 'anchor_wr_4', label: 'Pocket Watch', kind: 'accessory', text: 'gold pocket watch clutched open in one paw, perpetually consulted, face showing the wrong time' },
        { id: 'anchor_wr_5', label: 'Face', kind: 'face', text: 'white fur, large pink nose, round gold spectacles perched slightly askew, pink eyes wide with urgency' },
        { id: 'anchor_wr_6', label: 'Gloves', kind: 'clothing', text: 'white cotton gloves, one often half-off in the rush' },
      ],
      motifs: [
        { id: 'motif_wr_1', label: 'Dear, Oh Dear', text: 'the open pocket watch, the urgency without destination, the important business that is always elsewhere' },
      ],
    },
    phraseBundle: {
      core: [
        'upright white-furred rabbit in humanoid posture, slightly hunched forward in perpetual haste',
        'mustard-yellow waistcoat with brass buttons, gold watch chain looping from the pocket',
        'gold pocket watch clutched open in one paw, perpetually consulted',
        'long white rabbit ears, one askew, round gold spectacles slightly crooked, pink eyes wide with urgency',
        'white cotton gloves, one half-off in the rush',
        'the expression of someone catastrophically late for something of absolute importance',
      ],
    },
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
];

const V10_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_march_hare',
    name: 'The March Hare',
    summary: 'The other half of the tea party — not mad in the Hatter\'s way, but frantic, grass-stained, and perpetually one cup behind.',
    tags: ['solo', 'classic'],
    identity: {
      archetype: 'frenetic host',
      presentation: 'clothed',
      ageImpression: 'indeterminate adult',
      personalityTone: 'high-strung hospitality; strong opinions held briefly; the urgency of someone who has been at tea since before you arrived',
      visualAnchors: [
        { id: 'anchor_mhare_1', label: 'Form', kind: 'silhouette', text: 'upright brown hare, humanoid posture, lean and angular build, limbs slightly too long for the waistcoat' },
        { id: 'anchor_mhare_2', label: 'Ears', kind: 'other', text: 'long ears with frizzed fur at the tips, one bent back, both angled differently from each other' },
        { id: 'anchor_mhare_3', label: 'Clothing', kind: 'clothing', text: 'battered rust-brown tweed waistcoat with a missing button, no shirt beneath, straw visible in the lapel' },
        { id: 'anchor_mhare_4', label: 'Eyes', kind: 'eyes', text: 'wide pale eyes rimmed slightly pink, the expression of someone perpetually one cup behind on tea' },
        { id: 'anchor_mhare_5', label: 'Hands', kind: 'other', text: 'clutching a cracked teacup in both front paws, tea cooling, entirely unconcerned' },
        { id: 'anchor_mhare_6', label: 'Face', kind: 'face', text: 'coarse brown fur, paler at the muzzle and chest, long whiskers, prominent angular hare face' },
      ],
      motifs: [
        { id: 'motif_mhare_1', label: 'The Wrong Kind of Late', text: 'the frantic energy of someone who has been on time for nothing and has given up trying' },
      ],
    },
    phraseBundle: {
      core: [
        'upright brown hare, humanoid posture, lean and angular build, limbs too long for the waistcoat',
        'long ears with frizzed fur at the tips, one bent back, both angled differently',
        'battered rust-brown tweed waistcoat with a missing button, straw visible in the lapel',
        'wide pale eyes rimmed slightly pink, the look of someone perpetually one cup behind',
        'clutching a cracked teacup in both front paws, tea cooling, unconcerned',
        'coarse brown fur, paler at the muzzle and chest, long whiskers, angular hare face',
      ],
    },
    createdAt: SEED_TS_10,
    updatedAt: SEED_TS_10,
  },
  {
    id: 'character_seed_caterpillar',
    name: 'The Caterpillar',
    summary: 'A large blue-grey caterpillar coiled on a mushroom cap, hookah in hand, smoke in slow shapes around him — ancient, unhurried, insufferable.',
    tags: ['solo', 'creature', 'classic'],
    identity: {
      archetype: 'oracle',
      presentation: 'creature',
      ageImpression: 'ageless',
      personalityTone: 'total composure; mild contempt; the certainty of something that has been itself for a very long time',
      visualAnchors: [
        { id: 'anchor_cat_1', label: 'Form', kind: 'silhouette', text: 'large blue-grey caterpillar, soft segmented body coiled into a stable throne-like arrangement on a broad flat mushroom cap' },
        { id: 'anchor_cat_2', label: 'Hookah', kind: 'accessory', text: 'hookah mouthpiece held in the foremost pair of limbs, pipe looping down through the lower coils' },
        { id: 'anchor_cat_3', label: 'Smoke', kind: 'other', text: 'deep sapphire-blue smoke curling upward in slow deliberate shapes, one shape becoming another' },
        { id: 'anchor_cat_4', label: 'Eyes', kind: 'eyes', text: 'large compound eyes, faceted, the expression of complete certainty about himself and mild doubt about you' },
        { id: 'anchor_cat_5', label: 'Skin', kind: 'other', text: 'pale blue-grey ventral segments, deeper slate-blue dorsal surface, smooth and slightly iridescent' },
        { id: 'anchor_cat_6', label: 'Limbs', kind: 'other', text: 'many small paired limbs folded neatly along the lower coils, the overall posture absolutely composed' },
      ],
      motifs: [
        { id: 'motif_cat_1', label: 'Who Are You', text: 'the smoke, the stillness, the certainty of a creature that has resolved the question and finds your uncertainty tedious' },
      ],
    },
    phraseBundle: {
      core: [
        'large blue-grey caterpillar, segmented body coiled into a throne-like arrangement on a broad flat mushroom cap',
        'hookah mouthpiece held in the foremost limbs, pipe looping through the lower coils',
        'deep sapphire-blue smoke curling upward in slow deliberate shapes',
        'large compound eyes, faceted, the gaze of complete certainty about himself',
        'pale blue-grey ventral segments, deeper slate-blue dorsal surface, smooth and slightly iridescent',
        'many small paired limbs folded neatly, the posture of something that has nowhere to be',
      ],
    },
    createdAt: SEED_TS_10,
    updatedAt: SEED_TS_10,
  },
  {
    id: 'character_seed_dormouse',
    name: 'The Dormouse',
    summary: 'Tiny, rust-brown, perpetually asleep inside a teacup — occasionally woken, briefly outraged, immediately back under.',
    tags: ['solo', 'creature', 'classic'],
    identity: {
      archetype: 'sleeper',
      presentation: 'creature',
      ageImpression: 'ageless',
      personalityTone: 'deeply asleep; briefly fierce when disturbed; the indignation of something woken from something important',
      visualAnchors: [
        { id: 'anchor_dorm_1', label: 'Form', kind: 'silhouette', text: 'tiny rust-brown dormouse, round plump body, short blunt muzzle, rounded ears' },
        { id: 'anchor_dorm_2', label: 'Position', kind: 'other', text: 'curled tight inside an oversized teacup, tail looped around itself, body filling the cup completely' },
        { id: 'anchor_dorm_3', label: 'Detail', kind: 'other', text: 'soft pale grey belly fur visible at the cup rim, one small paw hanging over the edge' },
        { id: 'anchor_dorm_4', label: 'Eyes', kind: 'eyes', text: 'one dark eye barely open, half-moon of dark iris visible, the expression of something briefly woken that intends to correct this' },
        { id: 'anchor_dorm_5', label: 'Face', kind: 'face', text: 'very fine rust-brown fur, paler patches at the ears and muzzle, whiskers pressed flat from sleep' },
      ],
      motifs: [
        { id: 'motif_dorm_1', label: 'The Smallest Fury', text: 'the authority of something that was asleep and has very clear feelings about being woken' },
      ],
    },
    phraseBundle: {
      core: [
        'tiny rust-brown dormouse, round plump body, short blunt muzzle, rounded ears',
        'curled tight inside an oversized teacup, tail looped around itself, filling the cup',
        'pale grey belly fur visible at the cup rim, one small paw hanging over the edge',
        'one dark eye barely open, the expression of something briefly woken that will correct this',
        'very fine rust-brown fur, paler at the ears and muzzle, whiskers pressed flat from sleep',
      ],
    },
    createdAt: SEED_TS_10,
    updatedAt: SEED_TS_10,
  },
  {
    id: 'character_seed_tweedledee_tweedledum',
    name: 'Tweedledee & Tweedledum',
    summary: 'Two identical rotund men in matching schoolboy collars who have never agreed on anything and never will, and are completely fine about it.',
    tags: ['duo', 'classic'],
    identity: {
      archetype: 'duo',
      presentation: 'clothed',
      ageImpression: 'indeterminate adult',
      personalityTone: 'the absolute certainty of two people who have been disagreeing since before the question existed',
      visualAnchors: [
        { id: 'anchor_tw_1', label: 'Form', kind: 'silhouette', text: 'two identical rotund men, same height, same build, same stance — the disagreement is in the gesture' },
        { id: 'anchor_tw_2', label: 'Face', kind: 'face', text: 'round ruddy faces, small upturned noses, bright wide eyes set slightly too close, absolutely identical' },
        { id: 'anchor_tw_3', label: 'Clothing', kind: 'clothing', text: 'matching dark grey-blue schoolboy suits, stiff white collars with TWEEDLEDEE and TWEEDLEDUM embroidered at the throat' },
        { id: 'anchor_tw_4', label: 'Pose', kind: 'other', text: 'facing each other at close range, round bellies nearly touching, one arm gesturing left, one right' },
        { id: 'anchor_tw_5', label: 'Stance', kind: 'other', text: 'short legs, wide planted stances, each exactly where he has always been' },
      ],
      motifs: [
        { id: 'motif_tw_1', label: 'Contrairiwise', text: 'the argument is structural, the positions permanent, the disagreement is how they confirm they exist' },
      ],
    },
    phraseBundle: {
      core: [
        'two identical rotund men, same height, same build, facing each other at close range',
        'round ruddy faces, small upturned noses, bright wide eyes — absolutely identical',
        'matching dark grey-blue schoolboy suits, stiff white collars labeled TWEEDLEDEE and TWEEDLEDUM',
        'one arm gesturing left, one right, round bellies nearly touching, both entirely certain',
        'short legs, wide planted stances, the argument geometric and permanent',
      ],
    },
    createdAt: SEED_TS_10,
    updatedAt: SEED_TS_10,
  },
  {
    id: 'character_seed_white_queen',
    name: 'The White Queen',
    summary: 'Tall, pale, and flowing — everything about her is slightly displaced from where it should be, and she is perfectly at ease with this.',
    tags: ['solo', 'classic'],
    identity: {
      archetype: 'gentle sovereign',
      presentation: 'clothed',
      ageImpression: 'ageless adult',
      personalityTone: 'mild helpful bewilderment; warm and scattered; the benevolence of someone operating on a different schedule',
      visualAnchors: [
        { id: 'anchor_wq_1', label: 'Form', kind: 'silhouette', text: 'tall slender woman in flowing white silk robes, the layers of fabric slightly displaced from their original arrangement' },
        { id: 'anchor_wq_2', label: 'Hair', kind: 'hair', text: 'pale gold hair escaping from elaborate pinning in multiple directions, several hairpins at wrong angles' },
        { id: 'anchor_wq_3', label: 'Crown', kind: 'accessory', text: 'small white crown tilted forward and to the left, as if placed and not corrected' },
        { id: 'anchor_wq_4', label: 'Face', kind: 'face', text: 'pale almost translucent skin, large grey eyes, expression of mild helpful bewilderment' },
        { id: 'anchor_wq_5', label: 'Hands', kind: 'other', text: 'ink stains on the right fingertips, an unidentified smear on the left palm' },
        { id: 'anchor_wq_6', label: 'Gown', kind: 'clothing', text: 'white silk robes trailing, a shawl beginning to slide from one shoulder, nothing quite where it should be' },
      ],
      motifs: [
        { id: 'motif_wq_1', label: 'Living Backwards', text: 'the white of snow, of surrender, of something that remembers tomorrow — and has forgotten to pin her crown' },
      ],
    },
    phraseBundle: {
      core: [
        'tall slender woman in flowing white silk robes, fabric slightly displaced from its original arrangement',
        'pale gold hair escaping elaborate pinning in multiple directions, hairpins at wrong angles',
        'small white crown tilted forward and left, placed and not corrected',
        'pale near-translucent skin, large grey eyes, expression of mild helpful bewilderment',
        'ink stains on the right fingertips, a shawl beginning to slide from one shoulder',
        'everything white and everything slightly misaligned — a different misalignment each time you look',
      ],
    },
    createdAt: SEED_TS_10,
    updatedAt: SEED_TS_10,
  },
  {
    id: 'character_seed_knave_of_hearts',
    name: 'The Knave of Hearts',
    summary: 'A playing card soldier at formal attention — the livery is immaculate, the face above it knows what the verdict will be.',
    tags: ['solo', 'classic'],
    identity: {
      archetype: 'herald',
      presentation: 'clothed',
      ageImpression: 'young adult',
      personalityTone: 'formal composure over quiet dread; the bearing of the accused who has chosen to behave correctly anyway',
      visualAnchors: [
        { id: 'anchor_kh_1', label: 'Livery', kind: 'clothing', text: 'white tunic with the hearts suit printed in red and black, stiff white ruff collar standing away from the neck' },
        { id: 'anchor_kh_2', label: 'Crown', kind: 'accessory', text: 'flat heraldic hearts crown worn as regulation headgear, precisely centered' },
        { id: 'anchor_kh_3', label: 'Face', kind: 'face', text: 'pale worried face above the rigid uniform, the expression of someone who knows how this ends' },
        { id: 'anchor_kh_4', label: 'Hands', kind: 'other', text: 'gloved hands held precisely at the sides, one fractionally less still than the other' },
      ],
      motifs: [
        { id: 'motif_kh_1', label: 'The Accused', text: 'immaculate livery, a face that did not manage the same composure, the verdict arriving before the evidence' },
      ],
    },
    phraseBundle: {
      core: [
        'tall upright figure in white playing card livery, red and black hearts suit across the tunic',
        'stiff white ruff collar standing away from the neck in sharp folds',
        'flat heraldic hearts crown worn as regulation headgear, precisely centered',
        'pale worried face above the immaculate uniform, knowing how this ends',
        'gloved hands at the sides, one fractionally less still than the other',
      ],
    },
    createdAt: SEED_TS_10,
    updatedAt: SEED_TS_10,
  },
  {
    id: 'character_seed_duchess',
    name: 'The Duchess',
    summary: 'A large imperious woman in an enormous Tudor hat — sharp face, several chins, always presiding, always about to deliver a moral.',
    tags: ['solo', 'classic'],
    identity: {
      archetype: 'authority figure',
      presentation: 'clothed',
      ageImpression: 'imperious adult',
      personalityTone: 'the authority of someone who has always been in charge and has opinions; prone to morals; unapologetically present',
      visualAnchors: [
        { id: 'anchor_duch_1', label: 'Hat', kind: 'accessory', text: 'wide flat-brimmed Tudor-style hat draped with dark veiling, the scale overwhelming the doorframe' },
        { id: 'anchor_duch_2', label: 'Clothing', kind: 'clothing', text: 'heavy embroidered skirts in deep plum and black, enormous padded sleeves, a silhouette of absolute presence' },
        { id: 'anchor_duch_3', label: 'Face', kind: 'face', text: 'sharp angular face, prominent cheekbones, several chins, a nose that indicates direction' },
        { id: 'anchor_duch_4', label: 'Complexion', kind: 'other', text: 'high cheeks flushed from pepper, small dark eyes that have formed a judgment and are keeping it' },
        { id: 'anchor_duch_5', label: 'Posture', kind: 'silhouette', text: 'seated as if enthroned regardless of actual furniture, the posture of someone who always presides' },
      ],
      motifs: [
        { id: 'motif_duch_1', label: 'Everything Has a Moral', text: 'the enormous hat, the pepper, the certainty — the Duchess finds the lesson in everything and is going to share it' },
      ],
    },
    phraseBundle: {
      core: [
        'a large imperious woman in a wide flat-brimmed Tudor hat draped with dark veiling',
        'heavy embroidered skirts in deep plum and black, enormous padded sleeves',
        'sharp angular face, prominent cheekbones, several chins, a directional nose',
        'high cheeks flushed from pepper, small dark eyes that have formed a judgment',
        'seated as if enthroned regardless of what she is actually sitting on',
      ],
    },
    createdAt: SEED_TS_10,
    updatedAt: SEED_TS_10,
  },
  {
    id: 'character_seed_gryphon',
    name: 'The Gryphon',
    summary: 'An elderly gryphon — lion haunches, eagle forebody — sitting upright with the dignity of something that was once impressive and is still mostly that.',
    tags: ['solo', 'creature', 'classic'],
    identity: {
      archetype: 'elder creature',
      presentation: 'creature',
      ageImpression: 'ancient adult',
      personalityTone: 'the patience of the old and experienced; boisterous but tired; fond of stories about better days',
      visualAnchors: [
        { id: 'anchor_gry_1', label: 'Form', kind: 'silhouette', text: 'gryphon — lion hindquarters and eagle forebody, seated upright with the posture of old authority' },
        { id: 'anchor_gry_2', label: 'Coat', kind: 'other', text: 'tawny gold leonine haunches merging into golden-brown chest feathers, the seam worn at the join' },
        { id: 'anchor_gry_3', label: 'Beak', kind: 'face', text: 'large curved beak, slightly hooked at the tip, slightly open, the expression of something with experience' },
        { id: 'anchor_gry_4', label: 'Wings', kind: 'other', text: 'folded wings with primary feathers showing gaps at the outer edges, moth-eaten at the tips' },
        { id: 'anchor_gry_5', label: 'Eyes', kind: 'eyes', text: 'large amber eagle eyes, steady and unsurprised, the gaze of something that has seen most things' },
        { id: 'anchor_gry_6', label: 'Claws', kind: 'other', text: 'massive eagle foretarsi with curved talons resting on stone, patient and at rest' },
      ],
      motifs: [
        { id: 'motif_gry_1', label: 'Old Glory', text: 'tawny gold, moth-eaten wing edges, the dignity of something that was magnificent and knows it' },
      ],
    },
    phraseBundle: {
      core: [
        'gryphon — lion hindquarters and eagle forebody, seated upright in the posture of old authority',
        'tawny gold leonine haunches merging into golden-brown chest feathers, the seam worn at the join',
        'large curved beak, slightly hooked at the tip, the expression of something with accumulated experience',
        'folded wings with primary feathers gapped at the outer edges, moth-eaten at the tips',
        'large amber eagle eyes, steady and unsurprised',
        'massive eagle foretarsi with curved talons resting on stone, patient and at rest',
      ],
    },
    createdAt: SEED_TS_10,
    updatedAt: SEED_TS_10,
  },
];

const V11_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_soraya_vex',
    name: 'Soraya Vex',
    summary: 'Streetwear-gothic vampire. LoRA-backed — trigger word "sorayavex" activates her trained likeness (Illustrious XL). Use in any Illustrious-family model.',
    tags: ['solo', 'vampire', 'lora'],
    loraTrigger: 'sorayavex',
    identity: {
      archetype: 'streetwear-gothic vampire',
      presentation: 'clothed',
      ageImpression: 'young adult',
      personalityTone: 'melancholy, dry, perpetually unbothered',
      visualAnchors: [
        { id: 'anchor_sv_1', label: 'Hair', kind: 'hair', text: 'very long grey hair with pink streaks, blunt bangs, high ponytail' },
        { id: 'anchor_sv_2', label: 'Eyes', kind: 'eyes', text: 'crimson red eyes, slit pupils' },
        { id: 'anchor_sv_3', label: 'Face', kind: 'face', text: 'pale skin, small fangs, mole under the eye' },
        { id: 'anchor_sv_4', label: 'Silhouette', kind: 'silhouette', text: 'slender build, narrow waist, wide hips' },
        { id: 'anchor_sv_5', label: 'Outfit', kind: 'clothing', text: 'oversized black hoodie with skeleton print, light blue leggings with red stripes' },
      ],
      motifs: [
        { id: 'motif_sv_1', label: 'Streetwear Gothic', text: 'skeleton print, neon-lit nights, pink-and-grey palette, vampire calm' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo',
        'grey hair with pink streaks, very long hair, high ponytail, blunt bangs',
        'red eyes, pale skin, small fangs, mole under eye',
        'slender, narrow waist, wide hips',
        'oversized black hoodie, skeleton print, light blue leggings, red striped leggings',
      ],
    },
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
];

const V12_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_ny_konbini_yurei',
    name: 'The Konbini Ghost',
    summary: 'A pale night-shift phantom who has worked the same convenience store for decades — translucent at the edges, endlessly polite, never clocking out.',
    tags: ['solo', 'yokai', 'neon yokai'],
    identity: {
      archetype: 'yurei (ghost)',
      presentation: 'clothed',
      ageImpression: 'ageless young adult',
      personalityTone: 'quiet courtesy worn smooth by repetition; the calm of someone with nowhere else to be',
      visualAnchors: [
        { id: 'anchor_nyk_1', label: 'Form', kind: 'silhouette', text: 'slender figure, edges faintly translucent and dissolving into the fluorescent air' },
        { id: 'anchor_nyk_2', label: 'Skin', kind: 'other', text: 'pale bloodless skin lit cold by ceiling fluorescents, faint blue undertone' },
        { id: 'anchor_nyk_3', label: 'Hair', kind: 'hair', text: 'long black hair hanging straight and damp, partly over the face' },
        { id: 'anchor_nyk_4', label: 'Eyes', kind: 'eyes', text: 'dark hollow eyes with a tired distant gaze' },
        { id: 'anchor_nyk_5', label: 'Uniform', kind: 'clothing', text: 'convenience store uniform — striped apron over a collared shirt, name tag with no readable name' },
      ],
      motifs: [
        { id: 'motif_nyk_1', label: 'The Eternal Night Shift', text: 'fluorescent hum, restocked shelves, the politeness of the permanently on-duty' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, ghost',
        'pale translucent skin, edges dissolving into fluorescent light',
        'long straight damp black hair partly over the face, dark hollow tired eyes',
        'convenience store striped apron uniform, blank name tag',
        'standing behind a konbini counter at night, faint and quietly polite',
      ],
    },
    createdAt: SEED_TS_12,
    updatedAt: SEED_TS_12,
  },
  {
    id: 'character_seed_ny_subway_kitsune',
    name: 'The Subway Kitsune',
    summary: 'A nine-tailed fox spirit passing as a salarywoman — sharp suit, sharper eyes, nine tails folded invisibly under a long coat on the last train home.',
    tags: ['solo', 'yokai', 'neon yokai'],
    identity: {
      archetype: 'kitsune (fox spirit)',
      presentation: 'clothed',
      ageImpression: 'composed adult',
      personalityTone: 'cool, knowing, faintly amused; a predator comfortable in commuter clothes',
      visualAnchors: [
        { id: 'anchor_nysk_1', label: 'Ears', kind: 'other', text: 'fox ears rising from amber-blonde hair, alert and twitching' },
        { id: 'anchor_nysk_2', label: 'Tails', kind: 'other', text: 'multiple fox tails, tipped white, half-hidden under a long dark coat' },
        { id: 'anchor_nysk_3', label: 'Eyes', kind: 'eyes', text: 'golden slit-pupil eyes, sharp and amused' },
        { id: 'anchor_nysk_4', label: 'Hair', kind: 'hair', text: 'amber-blonde hair, sleek, shoulder length' },
        { id: 'anchor_nysk_5', label: 'Outfit', kind: 'clothing', text: 'tailored dark business suit under a long coat, briefcase' },
      ],
      motifs: [
        { id: 'motif_nysk_1', label: 'The Last Train', text: 'fox-fire reflections, the empty late-night carriage, a predator in a commuter\'s coat' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, fox girl, kitsune',
        'fox ears and multiple white-tipped tails, tails half-hidden under a long dark coat',
        'amber-blonde sleek hair, golden slit-pupil eyes, knowing amused expression',
        'tailored dark business suit, briefcase in hand',
        'standing in an empty late-night subway carriage, fox-fire glints in the window',
      ],
    },
    createdAt: SEED_TS_12,
    updatedAt: SEED_TS_12,
  },
  {
    id: 'character_seed_ny_neon_oni',
    name: 'The Neon Oni',
    summary: 'A towering demon bouncer outside a basement club — crimson skin, horns wrapped in LED strip, arms folded like a wall that decides who enters.',
    tags: ['solo', 'yokai', 'neon yokai'],
    identity: {
      archetype: 'oni (demon)',
      presentation: 'clothed',
      ageImpression: 'imposing adult',
      personalityTone: 'immovable calm; the authority of something that does not need to raise its voice',
      visualAnchors: [
        { id: 'anchor_nyo_1', label: 'Form', kind: 'silhouette', text: 'huge muscular figure, towering, broad as a doorway' },
        { id: 'anchor_nyo_2', label: 'Skin', kind: 'other', text: 'deep crimson-red skin, faint scarring across the forearms' },
        { id: 'anchor_nyo_3', label: 'Horns', kind: 'other', text: 'two thick horns wrapped in glowing cyan and pink LED strip' },
        { id: 'anchor_nyo_4', label: 'Eyes', kind: 'eyes', text: 'gold eyes, half-lidded, unimpressed' },
        { id: 'anchor_nyo_5', label: 'Outfit', kind: 'clothing', text: 'tight black bouncer suit, earpiece, sleeves pushed up' },
      ],
      motifs: [
        { id: 'motif_nyo_1', label: 'The Door', text: 'LED-wrapped horns, folded arms, the velvet rope of the underworld' },
      ],
    },
    phraseBundle: {
      core: [
        '1boy, solo, oni, horns',
        'huge muscular figure, deep crimson-red skin, faint forearm scars',
        'thick horns wrapped in glowing cyan and pink LED strip',
        'gold half-lidded unimpressed eyes',
        'tight black bouncer suit with earpiece, arms folded outside a neon club door',
      ],
    },
    createdAt: SEED_TS_12,
    updatedAt: SEED_TS_12,
  },
  {
    id: 'character_seed_ny_kasa_obake',
    name: 'The Umbrella Spirit',
    summary: 'A one-eyed umbrella yokai given a girl\'s shape on rainy nights — a clear vinyl umbrella that hops at crossings, blinking its single eye at the rain.',
    tags: ['solo', 'yokai', 'neon yokai'],
    identity: {
      archetype: 'kasa-obake (umbrella spirit)',
      presentation: 'clothed',
      ageImpression: 'playful youth',
      personalityTone: 'mischievous and curious; delighted by puddles and reflected neon',
      visualAnchors: [
        { id: 'anchor_nyko_1', label: 'Eye', kind: 'eyes', text: 'a single large round eye, bright and curious' },
        { id: 'anchor_nyko_2', label: 'Form', kind: 'silhouette', text: 'small slight figure fused with a clear vinyl umbrella, one-legged hopping stance' },
        { id: 'anchor_nyko_3', label: 'Tongue', kind: 'face', text: 'long playful tongue lolling out, classic obake feature' },
        { id: 'anchor_nyko_4', label: 'Hair', kind: 'hair', text: 'short dark hair dripping with rain' },
        { id: 'anchor_nyko_5', label: 'Umbrella', kind: 'accessory', text: 'transparent vinyl umbrella body glowing with reflected neon' },
      ],
      motifs: [
        { id: 'motif_nyko_1', label: 'Rainy Crossing', text: 'one eye, one leg, the clear umbrella full of neon, puddles everywhere' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, monster girl, one-eyed',
        'a single large round curious eye, long playful tongue out',
        'small slight figure merged with a transparent vinyl umbrella, hopping one-legged',
        'short dark rain-wet hair, umbrella glowing with reflected neon',
        'at a rainy night crossing, puddles full of pink and cyan light',
      ],
    },
    createdAt: SEED_TS_12,
    updatedAt: SEED_TS_12,
  },
  {
    id: 'character_seed_ny_rokurokubi',
    name: 'The Long-Necked Clerk',
    summary: 'A rokurokubi office worker whose neck unspools after midnight — prim and overworked by day, her head drifting the length of the floor by night.',
    tags: ['solo', 'yokai', 'neon yokai'],
    identity: {
      archetype: 'rokurokubi (long-necked yokai)',
      presentation: 'clothed',
      ageImpression: 'tired adult',
      personalityTone: 'exhausted diligence; resigned to a body that betrays her after hours',
      visualAnchors: [
        { id: 'anchor_nyr_1', label: 'Neck', kind: 'silhouette', text: 'unnaturally long neck stretching and curving across the office air' },
        { id: 'anchor_nyr_2', label: 'Hair', kind: 'hair', text: 'black hair in a loosening office bun, strands escaping' },
        { id: 'anchor_nyr_3', label: 'Eyes', kind: 'eyes', text: 'dark tired eyes behind thin glasses' },
        { id: 'anchor_nyr_4', label: 'Outfit', kind: 'clothing', text: 'grey office blouse and pencil skirt, lanyard ID' },
        { id: 'anchor_nyr_5', label: 'Skin', kind: 'other', text: 'pale fluorescent-lit skin, faint shadows under the eyes' },
      ],
      motifs: [
        { id: 'motif_nyr_1', label: 'After Midnight', text: 'the stretching neck, the empty cubicles, the overtime that never ends' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, rokurokubi, long neck',
        'unnaturally long neck curving across the air, head drifting away from the body',
        'black hair in a loosening bun, thin glasses, dark tired eyes',
        'grey office blouse and pencil skirt with a lanyard ID',
        'in an empty fluorescent-lit office at night',
      ],
    },
    createdAt: SEED_TS_12,
    updatedAt: SEED_TS_12,
  },
  {
    id: 'character_seed_ny_tengu_courier',
    name: 'The Tengu Courier',
    summary: 'A crow-masked delivery rider who outruns the traffic lights — black wings folded under a courier jacket, a glowing bike, and an impossible delivery time.',
    tags: ['solo', 'yokai', 'neon yokai'],
    identity: {
      archetype: 'tengu (crow spirit)',
      presentation: 'clothed',
      ageImpression: 'wiry young adult',
      personalityTone: 'fast, terse, proud of never being late; the arrogance of the genuinely skilled',
      visualAnchors: [
        { id: 'anchor_nyt_1', label: 'Mask', kind: 'face', text: 'long-nosed crow tengu features, sharp beaked profile, red-black colouring' },
        { id: 'anchor_nyt_2', label: 'Wings', kind: 'other', text: 'black crow wings half-folded under a high-vis courier jacket' },
        { id: 'anchor_nyt_3', label: 'Hair', kind: 'hair', text: 'spiky black hair, windblown' },
        { id: 'anchor_nyt_4', label: 'Outfit', kind: 'clothing', text: 'techwear courier jacket, fingerless gloves, insulated delivery box' },
        { id: 'anchor_nyt_5', label: 'Eyes', kind: 'eyes', text: 'sharp red eyes, focused' },
      ],
      motifs: [
        { id: 'motif_nyt_1', label: 'Never Late', text: 'black feathers in the slipstream, a glowing bike, the city blurred by speed' },
      ],
    },
    phraseBundle: {
      core: [
        '1boy, solo, tengu, crow',
        'long-nosed beaked crow features, sharp red-black colouring, spiky windblown black hair',
        'black crow wings half-folded under a high-vis techwear courier jacket',
        'fingerless gloves, insulated delivery box, sharp focused red eyes',
        'riding a glowing delivery bike through blurred neon streets at night',
      ],
    },
    createdAt: SEED_TS_12,
    updatedAt: SEED_TS_12,
  },
  {
    id: 'character_seed_ny_nekomata_barista',
    name: 'The Nekomata Barista',
    summary: 'A two-tailed cat spirit running a 3am café — split tail swaying, a knowing grin, and coffee for the city\'s sleepless and its ghosts alike.',
    tags: ['solo', 'yokai', 'neon yokai'],
    identity: {
      archetype: 'nekomata (two-tailed cat)',
      presentation: 'clothed',
      ageImpression: 'ageless youth',
      personalityTone: 'warm, sly, unbothered; a host who has seen every kind of late-night customer',
      visualAnchors: [
        { id: 'anchor_nyn_1', label: 'Ears & Tails', kind: 'other', text: 'cat ears and two long forked tails swaying lazily' },
        { id: 'anchor_nyn_2', label: 'Eyes', kind: 'eyes', text: 'green slit-pupil eyes, half-lidded and knowing' },
        { id: 'anchor_nyn_3', label: 'Hair', kind: 'hair', text: 'short messy charcoal-grey hair' },
        { id: 'anchor_nyn_4', label: 'Outfit', kind: 'clothing', text: 'rolled-sleeve shirt, café apron, dark slacks' },
        { id: 'anchor_nyn_5', label: 'Grin', kind: 'face', text: 'small fangs in a sly cat-grin' },
      ],
      motifs: [
        { id: 'motif_nyn_1', label: 'The 3AM Café', text: 'forked tails, steam from a fresh pour, warm light for the sleepless' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, cat girl, nekomata',
        'cat ears and two long forked tails swaying, green slit-pupil half-lidded eyes',
        'short messy charcoal-grey hair, small fangs in a sly grin',
        'rolled-sleeve shirt with a café apron',
        'behind the counter of a tiny warm café at 3am',
      ],
    },
    createdAt: SEED_TS_12,
    updatedAt: SEED_TS_12,
  },
  {
    id: 'character_seed_ny_yuki_onna',
    name: 'The Neon Yuki-onna',
    summary: 'A snow-woman who only appears on the coldest city nights — frost trailing from her steps, breath fogging the neon, beautiful and quietly lethal.',
    tags: ['solo', 'yokai', 'neon yokai'],
    identity: {
      archetype: 'yuki-onna (snow woman)',
      presentation: 'clothed',
      ageImpression: 'ageless adult',
      personalityTone: 'serene cold; gentle voice over a killing chill',
      visualAnchors: [
        { id: 'anchor_nyy_1', label: 'Skin', kind: 'other', text: 'pure white skin, faintly frost-dusted, breath visible' },
        { id: 'anchor_nyy_2', label: 'Hair', kind: 'hair', text: 'very long white hair drifting as if weightless in cold air' },
        { id: 'anchor_nyy_3', label: 'Eyes', kind: 'eyes', text: 'pale ice-blue eyes, calm and depthless' },
        { id: 'anchor_nyy_4', label: 'Outfit', kind: 'clothing', text: 'white modern coat over a pale kimono-cut dress, frost at the hems' },
        { id: 'anchor_nyy_5', label: 'Aura', kind: 'other', text: 'thin frost spreading on the pavement around her feet' },
      ],
      motifs: [
        { id: 'motif_nyy_1', label: 'Coldest Night', text: 'visible breath against neon, frost on the asphalt, beauty with a chill underneath' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, yuki-onna',
        'pure white frost-dusted skin, very long weightless white hair, pale ice-blue depthless eyes',
        'visible breath fogging in the cold air',
        'white modern coat over a pale kimono-cut dress, frost at the hems',
        'thin frost spreading on the neon-lit pavement around her',
      ],
    },
    createdAt: SEED_TS_12,
    updatedAt: SEED_TS_12,
  },
  {
    id: 'character_seed_ny_jorogumo',
    name: 'The Jorogumo Hostess',
    summary: 'A spider yokai presiding over a host club — silk-smooth charm, too many slender limbs in the shadows, a smile that has already decided your evening.',
    tags: ['solo', 'yokai', 'neon yokai'],
    identity: {
      archetype: 'jorogumo (spider woman)',
      presentation: 'clothed',
      ageImpression: 'alluring adult',
      personalityTone: 'silken control; warmth as a technique; absolute command of the room',
      visualAnchors: [
        { id: 'anchor_nyj_1', label: 'Limbs', kind: 'silhouette', text: 'extra slender chitinous spider-limbs emerging from the back, catching the light' },
        { id: 'anchor_nyj_2', label: 'Hair', kind: 'hair', text: 'long glossy black hair with a faint purple sheen' },
        { id: 'anchor_nyj_3', label: 'Eyes', kind: 'eyes', text: 'several dark glittering eyes, the extra pairs faint at the temples' },
        { id: 'anchor_nyj_4', label: 'Outfit', kind: 'clothing', text: 'elegant black-and-violet host club dress, silk gloves' },
        { id: 'anchor_nyj_5', label: 'Web', kind: 'other', text: 'faint silk threads glinting in the club\'s low light' },
      ],
      motifs: [
        { id: 'motif_nyj_1', label: 'The Host Club', text: 'silk threads, violet light, the charm of something patient and hungry' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, spider girl, jorogumo, monster girl',
        'extra slender chitinous spider-limbs from the back catching the light',
        'long glossy black hair with a purple sheen, several dark glittering eyes',
        'elegant black-and-violet host club dress with silk gloves',
        'in a low-lit host club, faint silk threads glinting',
      ],
    },
    createdAt: SEED_TS_12,
    updatedAt: SEED_TS_12,
  },
  {
    id: 'character_seed_ny_bakeneko_idol',
    name: 'The Bakeneko Idol',
    summary: 'A cat-spirit pop idol whose holographic stage hides a flickering tail and ears — adored by thousands who never notice she is not quite human.',
    tags: ['solo', 'yokai', 'neon yokai'],
    identity: {
      archetype: 'bakeneko (cat spirit)',
      presentation: 'clothed',
      ageImpression: 'youthful idol',
      personalityTone: 'bright stage charisma over a feline indifference; performance as glamour',
      visualAnchors: [
        { id: 'anchor_nyb_1', label: 'Ears & Tail', kind: 'other', text: 'cat ears and a single flicking tail, sometimes glitching like a hologram' },
        { id: 'anchor_nyb_2', label: 'Hair', kind: 'hair', text: 'twin-tailed candy-pink and white hair' },
        { id: 'anchor_nyb_3', label: 'Eyes', kind: 'eyes', text: 'big bright magenta star-pupil eyes' },
        { id: 'anchor_nyb_4', label: 'Outfit', kind: 'clothing', text: 'frilly holographic idol stage costume, glowstick accents' },
        { id: 'anchor_nyb_5', label: 'Stage', kind: 'other', text: 'holographic light effects swirling around her' },
      ],
      motifs: [
        { id: 'motif_nyb_1', label: 'Holo Stage', text: 'glitching tail, magenta hologram light, an idol the crowd adores and never reads' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, cat girl, idol',
        'cat ears and a flicking tail glitching like a hologram',
        'twin-tailed candy-pink and white hair, big magenta star-pupil eyes',
        'frilly holographic idol stage costume with glowstick accents',
        'on a holographic concert stage, swirling magenta light',
      ],
    },
    createdAt: SEED_TS_12,
    updatedAt: SEED_TS_12,
  },
  {
    id: 'character_seed_ny_zashiki_warashi',
    name: 'The Capsule-Hotel Child',
    summary: 'A zashiki-warashi house-spirit that adopted a capsule hotel — a small barefoot child who brings luck to a pod and grief when she leaves it.',
    tags: ['solo', 'yokai', 'neon yokai'],
    identity: {
      archetype: 'zashiki-warashi (house spirit)',
      presentation: 'clothed',
      ageImpression: 'child',
      personalityTone: 'shy, watchful, lonely; the quiet of a guardian no one believes in',
      visualAnchors: [
        { id: 'anchor_nyz_1', label: 'Form', kind: 'silhouette', text: 'small barefoot child, slight, peeking from a capsule pod' },
        { id: 'anchor_nyz_2', label: 'Hair', kind: 'hair', text: 'short black bobbed hair with blunt bangs' },
        { id: 'anchor_nyz_3', label: 'Eyes', kind: 'eyes', text: 'large dark watchful eyes' },
        { id: 'anchor_nyz_4', label: 'Outfit', kind: 'clothing', text: 'plain old-fashioned red kimono, out of place in the modern pod' },
        { id: 'anchor_nyz_5', label: 'Glow', kind: 'other', text: 'lit by the blue corridor glow of the capsule rows' },
      ],
      motifs: [
        { id: 'motif_nyz_1', label: 'The Pod', text: 'a red kimono in a blue capsule corridor, luck and loneliness in one small figure' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, child, ghost',
        'small barefoot child, short black bobbed hair with blunt bangs, large dark watchful eyes',
        'plain old-fashioned red kimono',
        'peeking from a capsule hotel pod',
        'lit by the blue glow of the capsule corridor at night',
      ],
    },
    createdAt: SEED_TS_12,
    updatedAt: SEED_TS_12,
  },
  {
    id: 'character_seed_ny_nopperabo',
    name: 'The Faceless Commuter',
    summary: 'A noppera-bo who rides the rush-hour crush — indistinguishable from any salaryman until the moment his face smooths over to blank skin.',
    tags: ['solo', 'yokai', 'neon yokai'],
    identity: {
      archetype: 'noppera-bo (faceless ghost)',
      presentation: 'clothed',
      ageImpression: 'anonymous adult',
      personalityTone: 'utterly ordinary until he is not; the horror of total anonymity',
      visualAnchors: [
        { id: 'anchor_nynp_1', label: 'Face', kind: 'face', text: 'smooth featureless blank face, no eyes nose or mouth, pale skin' },
        { id: 'anchor_nynp_2', label: 'Form', kind: 'silhouette', text: 'average build, indistinguishable salaryman silhouette' },
        { id: 'anchor_nynp_3', label: 'Hair', kind: 'hair', text: 'neat black salaryman haircut' },
        { id: 'anchor_nynp_4', label: 'Outfit', kind: 'clothing', text: 'plain dark business suit, briefcase, surgical mask pushed down to reveal blankness' },
        { id: 'anchor_nynp_5', label: 'Setting', kind: 'other', text: 'lost in a blurred rush-hour crowd' },
      ],
      motifs: [
        { id: 'motif_nynp_1', label: 'Anonymous', text: 'the blank face, the identical suit, the crowd that hides him perfectly' },
      ],
    },
    phraseBundle: {
      core: [
        '1boy, solo, faceless, noppera-bo',
        'smooth featureless blank pale face with no eyes nose or mouth',
        'neat black salaryman haircut, average indistinguishable build',
        'plain dark business suit with a briefcase, surgical mask pushed down',
        'standing in a blurred rush-hour subway crowd',
      ],
    },
    createdAt: SEED_TS_12,
    updatedAt: SEED_TS_12,
  },
];

// V13 — Solarpunk Bloom: a lush green-tech utopia, warm and hopeful — the tonal opposite of Neon Yokai.
const V13_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_sb_greenhouse_keeper',
    name: 'The Greenhouse Keeper',
    summary: 'A botanist-engineer who runs a vertical farm tower — soil under her nails, a tablet of growth data in her apron, equally at home with a wrench and a seedling.',
    tags: ['solo', 'solarpunk', 'solarpunk bloom'],
    identity: {
      archetype: 'botanist-engineer',
      presentation: 'clothed',
      ageImpression: 'capable adult',
      personalityTone: 'warm, practical, unhurried; the patience of someone who works on a plant\'s schedule',
      visualAnchors: [
        { id: 'anchor_sbgk_1', label: 'Skin', kind: 'other', text: 'warm sun-tanned skin, faint freckles, soil smudged on one cheek' },
        { id: 'anchor_sbgk_2', label: 'Hair', kind: 'hair', text: 'dark hair in a practical bun, escaped strands, a pencil and a sprig of herb tucked behind one ear' },
        { id: 'anchor_sbgk_3', label: 'Eyes', kind: 'eyes', text: 'calm hazel eyes with smile lines, attentive gaze' },
        { id: 'anchor_sbgk_4', label: 'Apron', kind: 'clothing', text: 'canvas tool apron over rolled-sleeve linen, pockets full of seed packets and a slim tablet' },
        { id: 'anchor_sbgk_5', label: 'Hands', kind: 'other', text: 'strong working hands, soil under the nails, a woven plant-fibre bracelet' },
      ],
      motifs: [
        { id: 'motif_sbgk_1', label: 'The Living Tower', text: 'terraced greenery, dappled glass light, growth charts and seedlings side by side' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, gardener',
        'warm sun-tanned freckled skin, a smudge of soil on one cheek, calm hazel eyes',
        'dark hair in a practical bun, a sprig of herb tucked behind the ear',
        'canvas tool apron over rolled-sleeve linen, seed packets in the pockets',
        'tending seedlings on a terraced vertical farm, dappled greenhouse light',
      ],
    },
    createdAt: SEED_TS_13,
    updatedAt: SEED_TS_13,
  },
  {
    id: 'character_seed_sb_solar_courier',
    name: 'The Solar-Sail Courier',
    summary: 'A glider courier who rides thermals and solar updrafts between rooftop docks — light, weatherburnt, a satchel of parcels and a folded wing-sail across her back.',
    tags: ['solo', 'solarpunk', 'solarpunk bloom'],
    identity: {
      archetype: 'glider courier',
      presentation: 'clothed',
      ageImpression: 'lithe young adult',
      personalityTone: 'breezy, quick-smiling, restless; happiest a hundred metres up',
      visualAnchors: [
        { id: 'anchor_sbsc_1', label: 'Hair', kind: 'hair', text: 'short wind-tousled sun-bleached hair, goggle line across the brow' },
        { id: 'anchor_sbsc_2', label: 'Skin', kind: 'other', text: 'warm brown weatherburnt skin, a courier\'s tan, bright easy grin' },
        { id: 'anchor_sbsc_3', label: 'Wings', kind: 'accessory', text: 'a folded solar wing-sail strapped across the back, translucent amber photovoltaic membrane' },
        { id: 'anchor_sbsc_4', label: 'Outfit', kind: 'clothing', text: 'streamlined linen flightsuit with leather harness straps, fingerless gloves' },
        { id: 'anchor_sbsc_5', label: 'Satchel', kind: 'accessory', text: 'a woven courier satchel of parcels slung across the body' },
      ],
      motifs: [
        { id: 'motif_sbsc_1', label: 'Rooftop to Rooftop', text: 'thermals and sun-sails, the city seen from the wind, a parcel always to deliver' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, pilot',
        'short wind-tousled sun-bleached hair, warm brown weatherburnt skin, bright grin',
        'a folded translucent amber solar wing-sail strapped across the back',
        'streamlined linen flightsuit with leather harness straps, fingerless gloves',
        'standing on a rooftop glider dock, the green city spread out far below',
      ],
    },
    createdAt: SEED_TS_13,
    updatedAt: SEED_TS_13,
  },
  {
    id: 'character_seed_sb_mycologist',
    name: 'The Mycologist',
    summary: 'A quiet keeper of the city\'s fungal networks — works in the warm dark of the mushroom cellars, fingertips faintly luminous from the spores he tends.',
    tags: ['solo', 'solarpunk', 'solarpunk bloom'],
    identity: {
      archetype: 'mycologist',
      presentation: 'clothed',
      ageImpression: 'thoughtful adult',
      personalityTone: 'soft-spoken, observant, a little otherworldly; listens more than he speaks',
      visualAnchors: [
        { id: 'anchor_sbmy_1', label: 'Hair', kind: 'hair', text: 'long dark hair loosely tied, a streak of premature grey' },
        { id: 'anchor_sbmy_2', label: 'Eyes', kind: 'eyes', text: 'deep-set dark eyes, gentle and patient, adjusted to low light' },
        { id: 'anchor_sbmy_3', label: 'Hands', kind: 'other', text: 'fingertips faintly luminous with pale bioluminescent spore-dust' },
        { id: 'anchor_sbmy_4', label: 'Outfit', kind: 'clothing', text: 'earth-toned layered robes and a canvas cross-apron, sleeves to the elbow' },
        { id: 'anchor_sbmy_5', label: 'Companion', kind: 'accessory', text: 'a shallow tray of glowing cultivated mushrooms carried in both hands' },
      ],
      motifs: [
        { id: 'motif_sbmy_1', label: 'The Warm Dark', text: 'cellar humidity, faint fungal glow, the slow patient web beneath the city' },
      ],
    },
    phraseBundle: {
      core: [
        '1boy, solo',
        'long dark hair loosely tied with a streak of grey, gentle deep-set eyes',
        'fingertips faintly glowing with pale bioluminescent spore-dust',
        'earth-toned layered robes and a canvas cross-apron',
        'holding a tray of softly glowing cultivated mushrooms in a warm dim cellar',
      ],
    },
    createdAt: SEED_TS_13,
    updatedAt: SEED_TS_13,
  },
  {
    id: 'character_seed_sb_rooftop_beekeeper',
    name: 'The Rooftop Beekeeper',
    summary: 'An old woman who keeps the hives among the rooftop wildflowers — unhurried, smoke-scented, the calm centre of a cloud of bees that never sting her.',
    tags: ['solo', 'solarpunk', 'solarpunk bloom'],
    identity: {
      archetype: 'beekeeper',
      presentation: 'clothed',
      ageImpression: 'serene elder',
      personalityTone: 'gentle, wry, endlessly patient; speaks softly to the bees',
      visualAnchors: [
        { id: 'anchor_sbbk_1', label: 'Face', kind: 'face', text: 'lined kind face, deep laugh-creases, warm dark eyes' },
        { id: 'anchor_sbbk_2', label: 'Hair', kind: 'hair', text: 'silver hair coiled under a wide woven sun hat with a folded-back veil' },
        { id: 'anchor_sbbk_3', label: 'Outfit', kind: 'clothing', text: 'pale natural-linen beekeeping smock, leather gloves tucked in the belt' },
        { id: 'anchor_sbbk_4', label: 'Bees', kind: 'other', text: 'a few honeybees drifting calmly around her, none alarmed' },
        { id: 'anchor_sbbk_5', label: 'Tool', kind: 'accessory', text: 'a brass bee-smoker held loosely, a thread of soft smoke rising' },
      ],
      motifs: [
        { id: 'motif_sbbk_1', label: 'Among the Hives', text: 'rooftop wildflowers, drifting bees, the slow gold of harvested honey' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, old woman, elderly',
        'lined kind face with deep laugh-creases, warm dark eyes, silver hair',
        'wide woven sun hat with a folded-back beekeeping veil',
        'pale natural-linen beekeeping smock, brass bee-smoker in hand',
        'standing among rooftop wildflower hives, calm honeybees drifting around her',
      ],
    },
    createdAt: SEED_TS_13,
    updatedAt: SEED_TS_13,
  },
  {
    id: 'character_seed_sb_water_weaver',
    name: 'The Water Weaver',
    summary: 'A rain-and-aqueduct engineer who routes the city\'s living waterways — wades the reclaimed canals in rolled trousers, reading the flow like a language.',
    tags: ['solo', 'solarpunk', 'solarpunk bloom'],
    identity: {
      archetype: 'water engineer',
      presentation: 'clothed',
      ageImpression: 'grounded adult',
      personalityTone: 'measured, observant, quietly proud of unseen work',
      visualAnchors: [
        { id: 'anchor_sbww_1', label: 'Skin', kind: 'other', text: 'deep brown skin beaded with canal mist, forearms wet to the elbow' },
        { id: 'anchor_sbww_2', label: 'Hair', kind: 'hair', text: 'tight black coils pulled back under a faded indigo headwrap' },
        { id: 'anchor_sbww_3', label: 'Eyes', kind: 'eyes', text: 'steady dark eyes reading the moving water' },
        { id: 'anchor_sbww_4', label: 'Outfit', kind: 'clothing', text: 'waxed canvas waders and a sleeveless indigo tunic, rolled to the knee' },
        { id: 'anchor_sbww_5', label: 'Tool', kind: 'accessory', text: 'a long brass measuring rod and a coil of fibre-optic flow sensor' },
      ],
      motifs: [
        { id: 'motif_sbww_1', label: 'Reading the Flow', text: 'reclaimed canals, gentle weirs, sunlight broken on running water' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, engineer',
        'deep brown skin beaded with mist, steady dark eyes, tight black coils under an indigo headwrap',
        'waxed canvas waders and a sleeveless indigo tunic rolled to the knee',
        'a long brass measuring rod in hand',
        'wading a sunlit reclaimed canal lined with water gardens',
      ],
    },
    createdAt: SEED_TS_13,
    updatedAt: SEED_TS_13,
  },
  {
    id: 'character_seed_sb_seed_librarian',
    name: 'The Seed Librarian',
    summary: 'The keeper of the seed vault — a precise, gentle archivist who catalogues a thousand heirloom varieties and remembers the story of every one.',
    tags: ['solo', 'solarpunk', 'solarpunk bloom'],
    identity: {
      archetype: 'seed archivist',
      presentation: 'clothed',
      ageImpression: 'careful adult',
      personalityTone: 'precise, soft, quietly devoted; treats each seed like a small life',
      visualAnchors: [
        { id: 'anchor_sbsl_1', label: 'Glasses', kind: 'accessory', text: 'round wire-rimmed glasses, a magnifier loupe on a cord' },
        { id: 'anchor_sbsl_2', label: 'Hair', kind: 'hair', text: 'neat ash-blond hair in a low plait, a pressed flower pinned in it' },
        { id: 'anchor_sbsl_3', label: 'Eyes', kind: 'eyes', text: 'pale grey eyes, gentle and exact' },
        { id: 'anchor_sbsl_4', label: 'Outfit', kind: 'clothing', text: 'a long cream archivist\'s coat over a high-collared blouse, cotton gloves' },
        { id: 'anchor_sbsl_5', label: 'Object', kind: 'accessory', text: 'a small labelled glass seed-vial held up to the light' },
      ],
      motifs: [
        { id: 'motif_sbsl_1', label: 'A Thousand Varieties', text: 'wooden seed drawers, handwritten labels, sunlight on a held vial' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, librarian',
        'round wire-rimmed glasses, pale grey gentle eyes, neat ash-blond low plait with a pressed flower',
        'a long cream archivist coat over a high-collared blouse, cotton gloves',
        'holding a small labelled glass seed-vial up to the light',
        'standing among floor-to-ceiling wooden seed drawers in a sunlit vault',
      ],
    },
    createdAt: SEED_TS_13,
    updatedAt: SEED_TS_13,
  },
  {
    id: 'character_seed_sb_turbine_climber',
    name: 'The Turbine Climber',
    summary: 'A wind-turbine mechanic who free-climbs the ridge towers — fearless, harnessed, hair whipping, the open sky and turning blades for an office.',
    tags: ['solo', 'solarpunk', 'solarpunk bloom'],
    identity: {
      archetype: 'aeromechanic',
      presentation: 'clothed',
      ageImpression: 'wiry young adult',
      personalityTone: 'fearless, grinning, blunt; allergic to ceilings',
      visualAnchors: [
        { id: 'anchor_sbtc_1', label: 'Hair', kind: 'hair', text: 'choppy copper-red hair whipping in the wind, shaved at one side' },
        { id: 'anchor_sbtc_2', label: 'Skin', kind: 'other', text: 'pale freckled skin, windburned cheeks, grease smudge on the jaw' },
        { id: 'anchor_sbtc_3', label: 'Harness', kind: 'accessory', text: 'a climbing harness heavy with carabiners and a power-driver' },
        { id: 'anchor_sbtc_4', label: 'Outfit', kind: 'clothing', text: 'high-vis-trimmed work overalls tied at the waist over a sun-faded tee' },
        { id: 'anchor_sbtc_5', label: 'Eyes', kind: 'eyes', text: 'bright green eyes squinting against the light, fearless' },
      ],
      motifs: [
        { id: 'motif_sbtc_1', label: 'On the Blades', text: 'hilltop turbines, wildflowers far below, harness and open sky' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, mechanic',
        'choppy copper-red wind-whipped hair shaved at one side, pale freckled windburned skin',
        'bright green eyes, a grease smudge on the jaw',
        'high-vis-trimmed work overalls tied at the waist, a climbing harness of carabiners',
        'high on a white wind turbine above a wildflower ridge, wind in everything',
      ],
    },
    createdAt: SEED_TS_13,
    updatedAt: SEED_TS_13,
  },
  {
    id: 'character_seed_sb_repair_tinkerer',
    name: 'The Repair-Café Tinkerer',
    summary: 'A jovial fixer who runs the neighbourhood repair café — nothing thrown away, everything mended, pockets and bench alike overflowing with salvaged parts.',
    tags: ['solo', 'solarpunk', 'solarpunk bloom'],
    identity: {
      archetype: 'tinkerer',
      presentation: 'clothed',
      ageImpression: 'rumpled adult',
      personalityTone: 'jovial, generous, distractible; loves a hopeless case',
      visualAnchors: [
        { id: 'anchor_sbrt_1', label: 'Build', kind: 'silhouette', text: 'soft round build, comfortable and unbothered' },
        { id: 'anchor_sbrt_2', label: 'Face', kind: 'face', text: 'warm bearded face, reading glasses pushed up on the forehead, easy laugh' },
        { id: 'anchor_sbrt_3', label: 'Outfit', kind: 'clothing', text: 'patched and hand-mended coveralls, a dozen tools in loops and pockets' },
        { id: 'anchor_sbrt_4', label: 'Hands', kind: 'other', text: 'broad capable hands holding a half-repaired solar lamp and a screwdriver' },
        { id: 'anchor_sbrt_5', label: 'Apron', kind: 'accessory', text: 'a leather tool-roll apron stained with oil and solder' },
      ],
      motifs: [
        { id: 'motif_sbrt_1', label: 'Nothing Wasted', text: 'salvaged parts, a cluttered warm workbench, the joy of a thing made to work again' },
      ],
    },
    phraseBundle: {
      core: [
        '1boy, solo, man',
        'soft round build, warm bearded face with reading glasses pushed up, easy laugh',
        'patched hand-mended coveralls covered in tools, a leather tool-roll apron',
        'holding a half-repaired solar lamp and a screwdriver',
        'at a cluttered warm repair-café workbench full of salvaged parts',
      ],
    },
    createdAt: SEED_TS_13,
    updatedAt: SEED_TS_13,
  },
  {
    id: 'character_seed_sb_pollinator_wrangler',
    name: 'The Pollinator-Drone Wrangler',
    summary: 'A young technician who shepherds clouds of tiny pollinator drones through the orchards — half engineer, half goatherd, always trailed by a glittering swarm.',
    tags: ['solo', 'solarpunk', 'solarpunk bloom'],
    identity: {
      archetype: 'drone technician',
      presentation: 'clothed',
      ageImpression: 'eager youth',
      personalityTone: 'curious, chatty, gentle; names every drone',
      visualAnchors: [
        { id: 'anchor_sbpw_1', label: 'Hair', kind: 'hair', text: 'twin black braids, a small brass control-band across the brow' },
        { id: 'anchor_sbpw_2', label: 'Skin', kind: 'other', text: 'warm golden-brown skin, an excited bright-eyed look' },
        { id: 'anchor_sbpw_3', label: 'Swarm', kind: 'other', text: 'a glittering swarm of tiny bee-sized pollinator drones orbiting her' },
        { id: 'anchor_sbpw_4', label: 'Outfit', kind: 'clothing', text: 'a short utility tunic and mesh-panel leggings, a forearm control gauntlet' },
        { id: 'anchor_sbpw_5', label: 'Gauntlet', kind: 'accessory', text: 'a glowing wrist control-gauntlet the drones answer to' },
      ],
      motifs: [
        { id: 'motif_sbpw_1', label: 'The Glittering Swarm', text: 'orchard blossom, tiny drones catching the sun, a shepherd of machines' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo',
        'warm golden-brown skin, bright eager eyes, twin black braids with a brass control-band',
        'a glittering swarm of tiny bee-sized pollinator drones orbiting her',
        'a short utility tunic and mesh-panel leggings, a glowing wrist control-gauntlet',
        'walking through a blossoming orchard trailed by her drone swarm',
      ],
    },
    createdAt: SEED_TS_13,
    updatedAt: SEED_TS_13,
  },
  {
    id: 'character_seed_sb_forager_cook',
    name: 'The Community Cook',
    summary: 'The heart of the food forest kitchen — a broad-shouldered forager-cook who turns the day\'s harvest into a feast for whoever shows up hungry.',
    tags: ['solo', 'solarpunk', 'solarpunk bloom'],
    identity: {
      archetype: 'forager-cook',
      presentation: 'clothed',
      ageImpression: 'hearty adult',
      personalityTone: 'big-hearted, loud, feeds everyone; suspicious of anyone who isn\'t eating',
      visualAnchors: [
        { id: 'anchor_sbfc_1', label: 'Build', kind: 'silhouette', text: 'broad strong build, sleeves shoved up over thick forearms' },
        { id: 'anchor_sbfc_2', label: 'Hair', kind: 'hair', text: 'black hair under a tied bandana, a sprig of rosemary behind the ear' },
        { id: 'anchor_sbfc_3', label: 'Skin', kind: 'other', text: 'olive skin flushed from the stove, a generous grin' },
        { id: 'anchor_sbfc_4', label: 'Apron', kind: 'clothing', text: 'a flour-dusted linen apron over a faded work shirt' },
        { id: 'anchor_sbfc_5', label: 'Basket', kind: 'accessory', text: 'a woven basket of foraged greens, herbs and bright vegetables on the hip' },
      ],
      motifs: [
        { id: 'motif_sbfc_1', label: 'Feed Everyone', text: 'the harvest basket, a steaming communal pot, a long table for whoever comes' },
      ],
    },
    phraseBundle: {
      core: [
        '1boy, solo, man',
        'broad strong build, olive skin flushed from the stove, a generous grin',
        'black hair under a tied bandana, a sprig of rosemary behind the ear',
        'a flour-dusted linen apron over a faded work shirt, sleeves shoved up',
        'carrying a woven basket of foraged greens and bright vegetables in a food-forest kitchen',
      ],
    },
    createdAt: SEED_TS_13,
    updatedAt: SEED_TS_13,
  },
  {
    id: 'character_seed_sb_grove_warden',
    name: 'The Grove Warden',
    summary: 'A teacher of the children\'s forest — gentle, barefoot, half-myth, who seems to have grown out of the grove and to speak for the trees in it.',
    tags: ['solo', 'solarpunk', 'solarpunk bloom'],
    identity: {
      archetype: 'grove warden',
      presentation: 'clothed',
      ageImpression: 'ageless adult',
      personalityTone: 'serene, mythic, kind; speaks slowly and means it',
      visualAnchors: [
        { id: 'anchor_sbgw_1', label: 'Hair', kind: 'hair', text: 'long moss-green-tinted hair woven with small leaves and seed-pods' },
        { id: 'anchor_sbgw_2', label: 'Skin', kind: 'other', text: 'brown skin with faint photosynthetic vine-tattoos that hold a soft green glow' },
        { id: 'anchor_sbgw_3', label: 'Eyes', kind: 'eyes', text: 'warm amber eyes, deep and calm, flecked with green' },
        { id: 'anchor_sbgw_4', label: 'Robe', kind: 'clothing', text: 'a flowing layered robe of undyed homespun, hem stained green, barefoot' },
        { id: 'anchor_sbgw_5', label: 'Staff', kind: 'accessory', text: 'a living wooden staff still sprouting fresh leaves at the top' },
      ],
      motifs: [
        { id: 'motif_sbgw_1', label: 'Speaks for the Grove', text: 'the children\'s forest, dappled green light, vine-tattoos faintly glowing' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo',
        'long moss-green-tinted hair woven with small leaves and seed-pods, warm amber green-flecked eyes',
        'brown skin with faint softly-glowing photosynthetic vine-tattoos',
        'a flowing layered robe of undyed homespun, hem stained green, barefoot',
        'holding a living wooden staff sprouting fresh leaves, standing in a sunlit grove',
      ],
    },
    createdAt: SEED_TS_13,
    updatedAt: SEED_TS_13,
  },
  {
    id: 'character_seed_sb_festival_dancer',
    name: 'The Bloom Festival Dancer',
    summary: 'The spirit of the harvest festival made flesh — a dancer crowned and garlanded in living flowers, the bright laughing centre of the season\'s celebration.',
    tags: ['solo', 'solarpunk', 'solarpunk bloom'],
    identity: {
      archetype: 'festival dancer',
      presentation: 'clothed',
      ageImpression: 'radiant young adult',
      personalityTone: 'joyous, generous, magnetic; carries the whole crowd on her energy',
      visualAnchors: [
        { id: 'anchor_sbfd_1', label: 'Crown', kind: 'accessory', text: 'a full flower crown of living blooms cascading into the hair' },
        { id: 'anchor_sbfd_2', label: 'Hair', kind: 'hair', text: 'long warm-brown hair loose and flower-threaded, caught mid-motion' },
        { id: 'anchor_sbfd_3', label: 'Skin', kind: 'other', text: 'glowing brown skin dusted with gold pollen, a wide joyful laugh' },
        { id: 'anchor_sbfd_4', label: 'Dress', kind: 'clothing', text: 'a flowing layered festival dress in petal-pinks and golds, ribbons and garlands trailing' },
        { id: 'anchor_sbfd_5', label: 'Garlands', kind: 'other', text: 'flower garlands looped over the arms, petals in the air around her' },
      ],
      motifs: [
        { id: 'motif_sbfd_1', label: 'The Harvest Festival', text: 'flower crowns, falling petals, music and golden afternoon light' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, dancer',
        'glowing brown skin dusted with gold pollen, a wide joyful laugh',
        'a full flower crown of living blooms, long flower-threaded warm-brown hair in motion',
        'a flowing layered festival dress in petal-pink and gold, ribbons and garlands trailing',
        'dancing amid falling petals at a harvest festival, golden afternoon light',
      ],
    },
    createdAt: SEED_TS_13,
    updatedAt: SEED_TS_13,
  },
];

// V14 — Porcelain Court: an eerie rococo doll-court, pastel elegance with hairline cracks.
const V14_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_pc_doll_queen',
    name: 'The Porcelain Queen',
    summary: 'The ruler of the doll-court — a towering bisque sovereign in faded rococo splendour, a hairline crack running through her serene painted smile.',
    tags: ['solo', 'porcelain court', 'doll'],
    identity: {
      archetype: 'porcelain doll monarch',
      presentation: 'clothed',
      ageImpression: 'ageless adult',
      personalityTone: 'glacial serenity; absolute, gracious, and entirely without warmth',
      visualAnchors: [
        { id: 'anchor_pcdq_1', label: 'Skin', kind: 'other', text: 'flawless glazed bisque-porcelain skin, a single hairline crack threading from cheek to jaw' },
        { id: 'anchor_pcdq_2', label: 'Eyes', kind: 'eyes', text: 'large fixed glass doll eyes, pale blue, unblinking' },
        { id: 'anchor_pcdq_3', label: 'Face', kind: 'face', text: 'a small painted rosebud mouth set in a serene, slightly too-still smile' },
        { id: 'anchor_pcdq_4', label: 'Hair', kind: 'hair', text: 'towering powdered silver pompadour dressed with tarnished pearls and dried roses' },
        { id: 'anchor_pcdq_5', label: 'Crown', kind: 'accessory', text: 'a chipped gilt filigree crown, one point broken off' },
      ],
      motifs: [
        { id: 'motif_pcdq_1', label: 'The Cracked Throne', text: 'faded gilt, glass eyes, the hairline crack, a sovereign frozen mid-gesture' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, living doll, ball-jointed doll',
        'flawless glazed porcelain skin with a single hairline crack from cheek to jaw',
        'large fixed pale-blue glass doll eyes, a small painted rosebud mouth, serene too-still smile',
        'towering powdered silver pompadour with tarnished pearls and dried roses, a chipped gilt crown',
        'seated on a faded gilt rococo throne in a decaying palace',
      ],
    },
    createdAt: SEED_TS_14,
    updatedAt: SEED_TS_14,
  },
  {
    id: 'character_seed_pc_clockwork_prince',
    name: 'The Clockwork Prince',
    summary: 'A wind-up aristocrat with a brass key in his back — courtly and charming until the spring runs down and he freezes mid-bow.',
    tags: ['solo', 'porcelain court', 'doll'],
    identity: {
      archetype: 'clockwork doll prince',
      presentation: 'clothed',
      ageImpression: 'youthful adult',
      personalityTone: 'rehearsed charm; gallant in fixed loops, hollow underneath',
      visualAnchors: [
        { id: 'anchor_pccp_1', label: 'Skin', kind: 'other', text: 'pale porcelain skin with painted blush high on the cheeks, a chipped chin' },
        { id: 'anchor_pccp_2', label: 'Key', kind: 'accessory', text: 'a large ornate brass wind-up key turning slowly in his back' },
        { id: 'anchor_pccp_3', label: 'Eyes', kind: 'eyes', text: 'glass green doll eyes with painted lashes, gaze fixed forward' },
        { id: 'anchor_pccp_4', label: 'Hair', kind: 'hair', text: 'powdered chestnut hair tied in a black silk ribbon' },
        { id: 'anchor_pccp_5', label: 'Outfit', kind: 'clothing', text: 'an embroidered rococo frock coat with lace cuffs, faded and moth-nibbled' },
      ],
      motifs: [
        { id: 'motif_pccp_1', label: 'When the Spring Runs Down', text: 'the turning brass key, a frozen courtly bow, charm on a timer' },
      ],
    },
    phraseBundle: {
      core: [
        '1boy, solo, living doll, clockwork doll',
        'pale porcelain skin with painted cheek-blush and a chipped chin, glass green doll eyes',
        'a large ornate brass wind-up key turning in his back',
        'powdered chestnut hair in a black ribbon, an embroidered rococo frock coat with lace cuffs',
        'frozen mid-bow in a decaying gilt ballroom',
      ],
    },
    createdAt: SEED_TS_14,
    updatedAt: SEED_TS_14,
  },
  {
    id: 'character_seed_pc_cracked_ballerina',
    name: 'The Cracked Ballerina',
    summary: 'The music-box dancer who only turns when the lid is lifted — one arm shattered at the elbow, still holding a perfect arabesque.',
    tags: ['solo', 'porcelain court', 'doll'],
    identity: {
      archetype: 'music-box ballerina doll',
      presentation: 'clothed',
      ageImpression: 'delicate youth',
      personalityTone: 'fragile grace; a single perfect motion repeated forever',
      visualAnchors: [
        { id: 'anchor_pccb_1', label: 'Arm', kind: 'other', text: 'one porcelain arm shattered clean at the elbow, the break exposed and hollow' },
        { id: 'anchor_pccb_2', label: 'Skin', kind: 'other', text: 'smooth cream porcelain skin, fine crazing across the shoulders' },
        { id: 'anchor_pccb_3', label: 'Eyes', kind: 'eyes', text: 'downcast glass eyes with long painted lashes' },
        { id: 'anchor_pccb_4', label: 'Hair', kind: 'hair', text: 'pale blonde hair in a tight ballet bun crowned with a wire tiara' },
        { id: 'anchor_pccb_5', label: 'Pose', kind: 'silhouette', text: 'frozen en pointe in a perfect arabesque on a turning music-box base' },
      ],
      motifs: [
        { id: 'motif_pccb_1', label: 'One Perfect Turn', text: 'the broken arm, the lifted lid, a pirouette that never finishes' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, living doll, ballerina',
        'smooth cream porcelain skin with fine crazing, one arm shattered hollow at the elbow',
        'downcast glass eyes with long painted lashes, pale blonde ballet bun and wire tiara',
        'frozen en pointe in a perfect arabesque',
        'standing on a turning music-box base in a dim chamber',
      ],
    },
    createdAt: SEED_TS_14,
    updatedAt: SEED_TS_14,
  },
  {
    id: 'character_seed_pc_masked_courtier',
    name: 'The Masked Courtier',
    summary: 'A whispering noble who never lowers the painted half-mask — behind the fan, the porcelain face beneath may have no features at all.',
    tags: ['solo', 'porcelain court', 'doll'],
    identity: {
      archetype: 'masked doll courtier',
      presentation: 'clothed',
      ageImpression: 'poised adult',
      personalityTone: 'secretive, insinuating, perfectly mannered',
      visualAnchors: [
        { id: 'anchor_pcmc_1', label: 'Mask', kind: 'accessory', text: 'a painted porcelain half-mask on a slender handle, held to the face' },
        { id: 'anchor_pcmc_2', label: 'Skin', kind: 'other', text: 'glossy pale porcelain skin, smooth and faintly featureless below the mask' },
        { id: 'anchor_pcmc_3', label: 'Fan', kind: 'accessory', text: 'a black lace folding fan half-raised, concealing the mouth' },
        { id: 'anchor_pcmc_4', label: 'Hair', kind: 'hair', text: 'powdered grey upswept hair with a single black feather' },
        { id: 'anchor_pcmc_5', label: 'Outfit', kind: 'clothing', text: 'a dove-grey rococo gown with tarnished silver embroidery' },
      ],
      motifs: [
        { id: 'motif_pcmc_1', label: 'Behind the Fan', text: 'the held mask, the raised fan, a face that may be blank beneath' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, living doll, masquerade',
        'glossy pale porcelain skin, faintly featureless beneath a painted porcelain half-mask on a handle',
        'a black lace folding fan half-raised over the mouth',
        'powdered grey upswept hair with a black feather, a dove-grey rococo gown with silver embroidery',
        'poised in a foxed mirror gallery',
      ],
    },
    createdAt: SEED_TS_14,
    updatedAt: SEED_TS_14,
  },
  {
    id: 'character_seed_pc_tea_maid',
    name: 'The Tea-Service Maid',
    summary: 'A small servant-doll who endlessly pours tea that never fills the cup — apron starched, head tilted, awaiting an order that never comes.',
    tags: ['solo', 'porcelain court', 'doll'],
    identity: {
      archetype: 'servant doll',
      presentation: 'clothed',
      ageImpression: 'youthful',
      personalityTone: 'dutiful, attentive, eerily eager to please',
      visualAnchors: [
        { id: 'anchor_pctm_1', label: 'Head', kind: 'silhouette', text: 'head tilted at a slightly unnatural servant\'s angle' },
        { id: 'anchor_pctm_2', label: 'Skin', kind: 'other', text: 'pale bisque skin, a chip missing from one ear' },
        { id: 'anchor_pctm_3', label: 'Eyes', kind: 'eyes', text: 'round brown glass eyes, wide and waiting' },
        { id: 'anchor_pctm_4', label: 'Hands', kind: 'other', text: 'porcelain hands frozen mid-pour over a tilted teapot' },
        { id: 'anchor_pctm_5', label: 'Outfit', kind: 'clothing', text: 'a starched white apron over a faded grey doll-maid dress and lace cap' },
      ],
      motifs: [
        { id: 'motif_pctm_1', label: 'The Endless Pour', text: 'the tilted teapot, the never-filling cup, a service with no guests' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, living doll, maid',
        'pale bisque skin with a chip missing from one ear, round wide brown glass eyes, head tilted',
        'porcelain hands frozen mid-pour over a tilted teapot',
        'a starched white apron over a faded grey doll-maid dress and lace cap',
        'in a banquet hall set for a feast no one attends',
      ],
    },
    createdAt: SEED_TS_14,
    updatedAt: SEED_TS_14,
  },
  {
    id: 'character_seed_pc_marionette_jester',
    name: 'The Marionette Jester',
    summary: 'The court fool on tangled strings — limbs hung from a cracked control bar above, grinning even as the threads knot and fray.',
    tags: ['solo', 'porcelain court', 'doll'],
    identity: {
      archetype: 'marionette doll',
      presentation: 'clothed',
      ageImpression: 'ageless',
      personalityTone: 'manic merriment over something desperate; the only one who seems to know',
      visualAnchors: [
        { id: 'anchor_pcmj_1', label: 'Strings', kind: 'accessory', text: 'taut marionette strings rising from wrists, knees and head to a cracked wooden control bar above' },
        { id: 'anchor_pcmj_2', label: 'Skin', kind: 'other', text: 'porcelain skin painted with a white-and-rouge jester face, a cracked grin' },
        { id: 'anchor_pcmj_3', label: 'Eyes', kind: 'eyes', text: 'mismatched glass eyes, one rolled slightly askew' },
        { id: 'anchor_pcmj_4', label: 'Hat', kind: 'accessory', text: 'a drooping two-pointed jester cap with tarnished silver bells' },
        { id: 'anchor_pcmj_5', label: 'Outfit', kind: 'clothing', text: 'a faded harlequin motley in rose and powder-blue diamonds' },
      ],
      motifs: [
        { id: 'motif_pcmj_1', label: 'On Tangled Strings', text: 'fraying threads, a cracked grin, merriment with knots in it' },
      ],
    },
    phraseBundle: {
      core: [
        '1boy, solo, living doll, marionette, jester',
        'porcelain skin with a white-and-rouge jester face and a cracked grin, mismatched glass eyes',
        'taut marionette strings rising from the limbs to a cracked wooden control bar above',
        'a drooping jester cap with tarnished bells, a faded rose-and-blue harlequin motley',
        'dangling in a dusty ballroom',
      ],
    },
    createdAt: SEED_TS_14,
    updatedAt: SEED_TS_14,
  },
  {
    id: 'character_seed_pc_weeping_countess',
    name: 'The Weeping Countess',
    summary: 'A grieving noblewoman doll whose glaze has cracked from endless tears — twin glossy tracks painted down her cheeks, mourning someone long gone.',
    tags: ['solo', 'porcelain court', 'doll'],
    identity: {
      archetype: 'mourning doll',
      presentation: 'clothed',
      ageImpression: 'elegant adult',
      personalityTone: 'bottomless quiet grief, dignified and unending',
      visualAnchors: [
        { id: 'anchor_pcwc_1', label: 'Tears', kind: 'face', text: 'twin glossy glazed tear-tracks running from the eyes, crazing the porcelain where they fall' },
        { id: 'anchor_pcwc_2', label: 'Skin', kind: 'other', text: 'pale grey-toned porcelain skin, finely cracked around the eyes' },
        { id: 'anchor_pcwc_3', label: 'Eyes', kind: 'eyes', text: 'sorrowful dark glass eyes, lids slightly lowered' },
        { id: 'anchor_pcwc_4', label: 'Veil', kind: 'accessory', text: 'a black lace mourning veil over dark upswept hair' },
        { id: 'anchor_pcwc_5', label: 'Outfit', kind: 'clothing', text: 'a black silk rococo mourning gown with jet beading' },
      ],
      motifs: [
        { id: 'motif_pcwc_1', label: 'Glazed Tears', text: 'the painted tear-tracks, the mourning veil, grief frozen in porcelain' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, living doll',
        'pale grey-toned porcelain skin finely cracked around the eyes, sorrowful dark glass eyes',
        'twin glossy glazed tear-tracks running down the cheeks',
        'a black lace mourning veil over dark upswept hair, a black silk rococo mourning gown with jet beading',
        'seated alone in a faded boudoir',
      ],
    },
    createdAt: SEED_TS_14,
    updatedAt: SEED_TS_14,
  },
  {
    id: 'character_seed_pc_child_heir',
    name: 'The Little Heir',
    summary: 'A small child-doll prince in miniature court dress — clutching a smaller doll of his own, watching the court with placid glass eyes.',
    tags: ['solo', 'porcelain court', 'doll'],
    identity: {
      archetype: 'child doll',
      presentation: 'clothed',
      ageImpression: 'small child',
      personalityTone: 'placid, watchful, unnervingly composed',
      visualAnchors: [
        { id: 'anchor_pcch_1', label: 'Build', kind: 'silhouette', text: 'a small child-sized doll, round-cheeked and short-limbed' },
        { id: 'anchor_pcch_2', label: 'Skin', kind: 'other', text: 'smooth pink-tinged porcelain skin, one tiny crack at the temple' },
        { id: 'anchor_pcch_3', label: 'Eyes', kind: 'eyes', text: 'large placid blue glass eyes, far too calm' },
        { id: 'anchor_pcch_4', label: 'Toy', kind: 'accessory', text: 'a smaller worn doll clutched in both hands' },
        { id: 'anchor_pcch_5', label: 'Outfit', kind: 'clothing', text: 'a miniature powder-blue rococo court suit with a lace collar' },
      ],
      motifs: [
        { id: 'motif_pcch_1', label: 'The Doll Who Holds a Doll', text: 'the small heir, the smaller doll, a placid watching stillness' },
      ],
    },
    phraseBundle: {
      core: [
        '1boy, solo, living doll, child',
        'a small round-cheeked child doll, smooth pink-tinged porcelain skin with a tiny crack at the temple',
        'large placid blue glass eyes, far too calm',
        'a miniature powder-blue rococo court suit with a lace collar, clutching a smaller worn doll',
        'standing in an abandoned nursery',
      ],
    },
    createdAt: SEED_TS_14,
    updatedAt: SEED_TS_14,
  },
  {
    id: 'character_seed_pc_harpsichordist',
    name: 'The Powdered Harpsichordist',
    summary: 'The court composer-doll fused to his instrument — fingers locked on yellowed keys, playing the same faded minuet into the dust.',
    tags: ['solo', 'porcelain court', 'doll'],
    identity: {
      archetype: 'musician doll',
      presentation: 'clothed',
      ageImpression: 'gaunt adult',
      personalityTone: 'consumed by the music, oblivious, rapt',
      visualAnchors: [
        { id: 'anchor_pchp_1', label: 'Hands', kind: 'other', text: 'long porcelain fingers locked on yellowed harpsichord keys, one fingertip chipped off' },
        { id: 'anchor_pchp_2', label: 'Skin', kind: 'other', text: 'gaunt ivory porcelain skin stretched over sharp cheekbones' },
        { id: 'anchor_pchp_3', label: 'Eyes', kind: 'eyes', text: 'half-closed glass eyes, rapt and unseeing' },
        { id: 'anchor_pchp_4', label: 'Hair', kind: 'hair', text: 'an enormous powdered white wig, dusty and slightly askew' },
        { id: 'anchor_pchp_5', label: 'Outfit', kind: 'clothing', text: 'a wine-coloured brocade coat, lace jabot yellowed with age' },
      ],
      motifs: [
        { id: 'motif_pchp_1', label: 'The Faded Minuet', text: 'locked fingers, yellowed keys, the same tune dissolving into dust' },
      ],
    },
    phraseBundle: {
      core: [
        '1boy, solo, living doll',
        'gaunt ivory porcelain skin over sharp cheekbones, half-closed rapt glass eyes',
        'long porcelain fingers locked on yellowed harpsichord keys, one fingertip chipped',
        'an enormous dusty powdered white wig, a wine-coloured brocade coat with a yellowed lace jabot',
        'seated at a harpsichord in a decaying music chamber',
      ],
    },
    createdAt: SEED_TS_14,
    updatedAt: SEED_TS_14,
  },
  {
    id: 'character_seed_pc_dollmaker',
    name: 'The Dollmaker',
    summary: 'The seamstress who keeps the court whole — part doll herself, she mends the cracked with kiln-fire and thread, deciding who is repaired and who is discarded.',
    tags: ['solo', 'porcelain court', 'doll'],
    identity: {
      archetype: 'dollmaker',
      presentation: 'clothed',
      ageImpression: 'severe adult',
      personalityTone: 'exacting, proprietorial, quietly merciless',
      visualAnchors: [
        { id: 'anchor_pcdm_1', label: 'Skin', kind: 'other', text: 'porcelain skin patched with visible kintsugi-gold repair seams, half-doll half-maker' },
        { id: 'anchor_pcdm_2', label: 'Eyes', kind: 'eyes', text: 'sharp pale grey glass eyes behind half-moon spectacles' },
        { id: 'anchor_pcdm_3', label: 'Tools', kind: 'accessory', text: 'a porcelain needle threaded with fine wire and a small paintbrush in hand' },
        { id: 'anchor_pcdm_4', label: 'Hair', kind: 'hair', text: 'iron-grey hair scraped into a severe bun stuck with bone pins' },
        { id: 'anchor_pcdm_5', label: 'Outfit', kind: 'clothing', text: 'a high-collared charcoal work-gown under a stained apron of doll parts' },
      ],
      motifs: [
        { id: 'motif_pcdm_1', label: 'Mended and Discarded', text: 'gold repair seams, needle and brush, the power to keep or to break' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, living doll',
        'porcelain skin patched with visible kintsugi-gold repair seams, sharp pale grey glass eyes behind half-moon spectacles',
        'iron-grey hair in a severe bun with bone pins',
        'a high-collared charcoal work-gown under a stained apron, holding a wire-threaded needle and a paintbrush',
        'in a cluttered doll-repair atelier of waiting parts',
      ],
    },
    createdAt: SEED_TS_14,
    updatedAt: SEED_TS_14,
  },
  {
    id: 'character_seed_pc_hollow_twins',
    name: 'The Hollow Twins',
    summary: 'Two identical bisque dolls who move as one — heads tilting in unison, finishing each other\'s frozen gestures, hollow where a heart would be.',
    tags: ['duo', 'porcelain court', 'doll'],
    identity: {
      archetype: 'twin dolls',
      presentation: 'clothed',
      ageImpression: 'youthful',
      personalityTone: 'uncanny synchrony, sweet and wrong',
      visualAnchors: [
        { id: 'anchor_pcht_1', label: 'Pair', kind: 'silhouette', text: 'two identical dolls side by side, heads tilted at the same angle' },
        { id: 'anchor_pcht_2', label: 'Skin', kind: 'other', text: 'matching pale bisque skin, the same hairline crack on each left cheek' },
        { id: 'anchor_pcht_3', label: 'Eyes', kind: 'eyes', text: 'four identical violet glass eyes, all fixed on the viewer' },
        { id: 'anchor_pcht_4', label: 'Hair', kind: 'hair', text: 'matching dark ringlets tied with rose ribbons' },
        { id: 'anchor_pcht_5', label: 'Outfit', kind: 'clothing', text: 'identical cream lace rococo dresses' },
      ],
      motifs: [
        { id: 'motif_pcht_1', label: 'As One', text: 'mirrored gestures, matching cracks, two dolls with one motion' },
      ],
    },
    phraseBundle: {
      core: [
        '2girls, siblings, twins, living doll',
        'two identical pale bisque dolls, the same hairline crack on each left cheek, heads tilted in unison',
        'identical violet glass eyes all fixed forward, matching dark ringlets with rose ribbons',
        'identical cream lace rococo dresses',
        'standing side by side at the foot of a grand staircase',
      ],
    },
    createdAt: SEED_TS_14,
    updatedAt: SEED_TS_14,
  },
  {
    id: 'character_seed_pc_garden_statue_lady',
    name: 'The Garden Statue',
    summary: 'A doll left so long in the rococo garden she is half-claimed by it — moss in her crazing, ivy through one shattered shoulder, smiling under the open sky.',
    tags: ['solo', 'porcelain court', 'doll'],
    identity: {
      archetype: 'overgrown garden doll',
      presentation: 'clothed',
      ageImpression: 'ageless adult',
      personalityTone: 'weathered serenity; surrendered to the garden, at peace',
      visualAnchors: [
        { id: 'anchor_pcgs_1', label: 'Skin', kind: 'other', text: 'weathered porcelain skin, green moss filling the deep crazing, lichen at the temples' },
        { id: 'anchor_pcgs_2', label: 'Shoulder', kind: 'other', text: 'one shoulder shattered open with ivy growing through the hollow' },
        { id: 'anchor_pcgs_3', label: 'Eyes', kind: 'eyes', text: 'pale clouded glass eyes, gaze lifted to the sky' },
        { id: 'anchor_pcgs_4', label: 'Hair', kind: 'hair', text: 'faded gilt-blonde hair tangled with creeping vines and small flowers' },
        { id: 'anchor_pcgs_5', label: 'Outfit', kind: 'clothing', text: 'a moss-streaked once-white rococo gown gone grey and green' },
      ],
      motifs: [
        { id: 'motif_pcgs_1', label: 'Claimed by the Garden', text: 'moss in the cracks, ivy through the shoulder, a doll returning to the earth' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, living doll, statue',
        'weathered porcelain skin with green moss in the deep crazing and lichen at the temples',
        'one shoulder shattered open with ivy growing through it, pale clouded glass eyes lifted to the sky',
        'faded gilt-blonde hair tangled with vines, a moss-streaked grey-green rococo gown',
        'standing among overgrown topiary in a ruined formal garden',
      ],
    },
    createdAt: SEED_TS_14,
    updatedAt: SEED_TS_14,
  },
];

// V15 — Dust Run: a post-apocalyptic desert, spaghetti-western-meets-Mad-Max grit.
const V15_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_dr_drifter',
    name: 'The Drifter',
    summary: 'A nameless wanderer who walks in from the heat-haze and leaves before the dust settles — sun-cured, silent, one hand never far from the revolver.',
    tags: ['solo', 'dust run', 'western'],
    identity: {
      archetype: 'lone gunslinger',
      presentation: 'clothed',
      ageImpression: 'weathered adult',
      personalityTone: 'laconic, watchful, unbothered; says nothing he does not have to',
      visualAnchors: [
        { id: 'anchor_drd_1', label: 'Face', kind: 'face', text: 'sun-cured stubbled face, squinting pale eyes, a thin cigarillo at the corner of the mouth' },
        { id: 'anchor_drd_2', label: 'Poncho', kind: 'clothing', text: 'a faded sand-coloured poncho over dust-caked clothes' },
        { id: 'anchor_drd_3', label: 'Hat', kind: 'accessory', text: 'a battered wide-brimmed hat low over the eyes' },
        { id: 'anchor_drd_4', label: 'Weapon', kind: 'accessory', text: 'a worn revolver in a low-slung holster, one hand resting near it' },
        { id: 'anchor_drd_5', label: 'Skin', kind: 'other', text: 'dust on every surface, deep tan, fine grit in the creases' },
      ],
      motifs: [
        { id: 'motif_drd_1', label: 'In From the Heat-Haze', text: 'the lone silhouette, the low hat, the hand near the gun' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo, cowboy',
        'sun-cured stubbled face, squinting pale eyes, a thin cigarillo at the mouth',
        'a faded sand-coloured poncho over dust-caked clothes, a battered wide-brimmed hat low over the eyes',
        'a worn revolver in a low-slung holster, hand resting near it',
        'standing on a dead-town street in the heat-haze',
      ],
    },
    createdAt: SEED_TS_15,
    updatedAt: SEED_TS_15,
  },
  {
    id: 'character_seed_dr_water_baron',
    name: 'The Water Baron',
    summary: 'The fat king of a dry world — he owns the only working well for a hundred miles and dresses in the wealth thirst buys, rings heavy on every finger.',
    tags: ['solo', 'dust run', 'western'],
    identity: {
      archetype: 'tyrant',
      presentation: 'clothed',
      ageImpression: 'corpulent adult',
      personalityTone: 'oily, complacent, cruel; smiles while you go thirsty',
      visualAnchors: [
        { id: 'anchor_drwb_1', label: 'Build', kind: 'silhouette', text: 'a heavy corpulent build, the only well-fed man in a starving land' },
        { id: 'anchor_drwb_2', label: 'Face', kind: 'face', text: 'a sweating jowled face, oiled moustache, gold tooth in a smug smile' },
        { id: 'anchor_drwb_3', label: 'Outfit', kind: 'clothing', text: 'a once-fine dusty frock coat and brocade waistcoat strained at the buttons' },
        { id: 'anchor_drwb_4', label: 'Rings', kind: 'accessory', text: 'thick gold rings on every finger, a watch chain across the gut' },
        { id: 'anchor_drwb_5', label: 'Prop', kind: 'accessory', text: 'a dripping glass of clean water held casually, taunting' },
      ],
      motifs: [
        { id: 'motif_drwb_1', label: 'He Owns the Well', text: 'the dripping glass, the gold rings, wealth measured in water' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo',
        'a heavy corpulent build, a sweating jowled face, oiled moustache and a gold-tooth smug smile',
        'a once-fine dusty frock coat and brocade waistcoat strained at the buttons, thick gold rings on every finger',
        'holding a dripping glass of clean water, taunting',
        'in a dim water refinery surrounded by his guards',
      ],
    },
    createdAt: SEED_TS_15,
    updatedAt: SEED_TS_15,
  },
  {
    id: 'character_seed_dr_mechanic',
    name: 'The Mechanic',
    summary: 'The one who keeps the rigs running — grease to the elbows, goggles up on the brow, a cigarette and a wrench and a hundred salvaged parts.',
    tags: ['solo', 'dust run', 'western'],
    identity: {
      archetype: 'rig mechanic',
      presentation: 'clothed',
      ageImpression: 'capable adult',
      personalityTone: 'dry-humoured, unflappable, fiercely competent',
      visualAnchors: [
        { id: 'anchor_drm_1', label: 'Skin', kind: 'other', text: 'grease-streaked face and forearms, oil under the nails' },
        { id: 'anchor_drm_2', label: 'Goggles', kind: 'accessory', text: 'cracked welding goggles pushed up on a sweat-damp brow' },
        { id: 'anchor_drm_3', label: 'Hair', kind: 'hair', text: 'dark hair tied back under a grimy bandana' },
        { id: 'anchor_drm_4', label: 'Outfit', kind: 'clothing', text: 'a sleeveless oil-stained jumpsuit tied at the waist over a faded tank top' },
        { id: 'anchor_drm_5', label: 'Tool', kind: 'accessory', text: 'a heavy wrench in one hand, a roll-up cigarette at the lip' },
      ],
      motifs: [
        { id: 'motif_drm_1', label: 'Keeps It Running', text: 'grease and goggles, salvaged parts, the wrench that holds the world together' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo, mechanic',
        'grease-streaked face and forearms, cracked welding goggles pushed up on the brow',
        'dark hair tied back under a grimy bandana, a roll-up cigarette at the lip',
        'a sleeveless oil-stained jumpsuit tied at the waist, a heavy wrench in hand',
        'in a rust-roofed garage of salvaged vehicle parts',
      ],
    },
    createdAt: SEED_TS_15,
    updatedAt: SEED_TS_15,
  },
  {
    id: 'character_seed_dr_bounty_hunter',
    name: 'The Bounty Hunter',
    summary: 'A scarred tracker who collects the wanted and the dead alike — trophies strung on the coat, a long rifle, eyes that have already measured your worth.',
    tags: ['solo', 'dust run', 'western'],
    identity: {
      archetype: 'bounty hunter',
      presentation: 'clothed',
      ageImpression: 'hardened adult',
      personalityTone: 'cold, transactional, patient; everything has a price',
      visualAnchors: [
        { id: 'anchor_drbh_1', label: 'Face', kind: 'face', text: 'a hard scarred face, a long old knife-scar across one cheek, dead-calm eyes' },
        { id: 'anchor_drbh_2', label: 'Coat', kind: 'clothing', text: 'a long weather-beaten duster strung with bounty tokens and spent shells' },
        { id: 'anchor_drbh_3', label: 'Weapon', kind: 'accessory', text: 'a long scoped rifle slung across the back' },
        { id: 'anchor_drbh_4', label: 'Hair', kind: 'hair', text: 'lank dark hair under a flat-brimmed black hat' },
        { id: 'anchor_drbh_5', label: 'Detail', kind: 'accessory', text: 'a bandolier of brass cartridges across the chest' },
      ],
      motifs: [
        { id: 'motif_drbh_1', label: 'Dead or Alive', text: 'the trophy coat, the long rifle, the cold appraising stare' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo',
        'a hard scarred face with a long knife-scar across one cheek, dead-calm eyes',
        'a long weather-beaten duster strung with bounty tokens and spent shells, a bandolier of brass cartridges',
        'lank dark hair under a flat-brimmed black hat, a long scoped rifle across the back',
        'standing in a red-rock canyon pass',
      ],
    },
    createdAt: SEED_TS_15,
    updatedAt: SEED_TS_15,
  },
  {
    id: 'character_seed_dr_dust_oracle',
    name: 'The Dust Oracle',
    summary: 'A blind seer wrapped in sun-bleached rags who reads the wind and the bones — feared and sought, speaking the desert\'s prophecies in a cracked whisper.',
    tags: ['solo', 'dust run', 'western'],
    identity: {
      archetype: 'desert seer',
      presentation: 'clothed',
      ageImpression: 'ancient',
      personalityTone: 'cryptic, serene, unsettling; sees what the eyes cannot',
      visualAnchors: [
        { id: 'anchor_drdo_1', label: 'Eyes', kind: 'eyes', text: 'milky blind white eyes, a calm distant gaze' },
        { id: 'anchor_drdo_2', label: 'Wraps', kind: 'clothing', text: 'layered sun-bleached rag-wrappings and a tattered hooded shawl' },
        { id: 'anchor_drdo_3', label: 'Skin', kind: 'other', text: 'deeply lined leather-brown skin caked with pale dust' },
        { id: 'anchor_drdo_4', label: 'Adornment', kind: 'accessory', text: 'bone charms, beads and feathers strung through the wrappings' },
        { id: 'anchor_drdo_5', label: 'Hands', kind: 'other', text: 'thin hands cradling a scatter of carved reading-bones' },
      ],
      motifs: [
        { id: 'motif_drdo_1', label: 'Reads the Bones', text: 'milky eyes, rag wrappings, the prophecy in the dust' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo, old woman',
        'milky blind white eyes, deeply lined leather-brown skin caked with pale dust',
        'layered sun-bleached rag-wrappings and a tattered hooded shawl, bone charms and feathers strung through',
        'thin hands cradling a scatter of carved reading-bones',
        'seated in the open desert at dusk',
      ],
    },
    createdAt: SEED_TS_15,
    updatedAt: SEED_TS_15,
  },
  {
    id: 'character_seed_dr_sheriff',
    name: 'The Last Sheriff',
    summary: 'The lone lawkeeper of a town the world forgot — a tarnished star still pinned to the duster, holding a line that no longer means anything to anyone but him.',
    tags: ['solo', 'dust run', 'western'],
    identity: {
      archetype: 'lawman',
      presentation: 'clothed',
      ageImpression: 'aging adult',
      personalityTone: 'weary, principled, immovable; the last good man, and he knows it',
      visualAnchors: [
        { id: 'anchor_drs_1', label: 'Face', kind: 'face', text: 'a weathered grey-stubbled face, tired steady eyes, a grim set jaw' },
        { id: 'anchor_drs_2', label: 'Badge', kind: 'accessory', text: 'a tarnished six-point sheriff star pinned to the chest' },
        { id: 'anchor_drs_3', label: 'Coat', kind: 'clothing', text: 'a long dust-grey lawman\'s duster over a faded waistcoat' },
        { id: 'anchor_drs_4', label: 'Hat', kind: 'accessory', text: 'a sweat-stained pale cowboy hat' },
        { id: 'anchor_drs_5', label: 'Weapon', kind: 'accessory', text: 'a holstered revolver, a hand resting steady on the belt' },
      ],
      motifs: [
        { id: 'motif_drs_1', label: 'Holds the Line', text: 'the tarnished star, the empty street, a law no one else keeps' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo, cowboy, old man',
        'a weathered grey-stubbled face, tired steady eyes and a grim set jaw',
        'a tarnished six-point sheriff star pinned to a long dust-grey lawman duster',
        'a sweat-stained pale cowboy hat, a hand resting steady on the gun belt',
        'standing alone on a dead-town main street at high noon',
      ],
    },
    createdAt: SEED_TS_15,
    updatedAt: SEED_TS_15,
  },
  {
    id: 'character_seed_dr_scavenger_kid',
    name: 'The Scavenger Kid',
    summary: 'A wiry teenager who knows every wreck worth picking — goggles, a too-big coat of pockets, and a knack for finding what others missed.',
    tags: ['solo', 'dust run', 'western'],
    identity: {
      archetype: 'scavenger',
      presentation: 'clothed',
      ageImpression: 'teenager',
      personalityTone: 'quick, scrappy, hopeful despite everything',
      visualAnchors: [
        { id: 'anchor_drsk_1', label: 'Goggles', kind: 'accessory', text: 'scratched dust goggles up on a mop of sandy hair' },
        { id: 'anchor_drsk_2', label: 'Face', kind: 'face', text: 'a dirt-smudged young face, a gap-toothed grin, bright quick eyes' },
        { id: 'anchor_drsk_3', label: 'Coat', kind: 'clothing', text: 'a too-big patched coat covered in pockets and clipped-on salvage' },
        { id: 'anchor_drsk_4', label: 'Pack', kind: 'accessory', text: 'a bulging scrap-sack of wires, bolts and treasures slung on the back' },
        { id: 'anchor_drsk_5', label: 'Detail', kind: 'other', text: 'mismatched gloves, dust on everything' },
      ],
      motifs: [
        { id: 'motif_drsk_1', label: 'Finds the Good Scrap', text: 'goggles and pockets, the scrap-sack, hope in a wrecked world' },
      ],
    },
    phraseBundle: {
      core: [
        '1boy, solo, child, teenager',
        'a dirt-smudged young face with a gap-toothed grin and bright quick eyes, scratched dust goggles up on sandy hair',
        'a too-big patched coat covered in pockets and clipped-on salvage, mismatched gloves',
        'a bulging scrap-sack of wires and bolts on the back',
        'climbing through a desert scrapyard of wrecked vehicles',
      ],
    },
    createdAt: SEED_TS_15,
    updatedAt: SEED_TS_15,
  },
  {
    id: 'character_seed_dr_road_warrior',
    name: 'The Road Warrior',
    summary: 'The driver of a roaring scrap-plated war-rig — armoured in welded steel and leather, masked against the dust, born for the chase.',
    tags: ['solo', 'dust run', 'western'],
    identity: {
      archetype: 'war-rig driver',
      presentation: 'clothed',
      ageImpression: 'hardened adult',
      personalityTone: 'feral, fearless, adrenaline-wired',
      visualAnchors: [
        { id: 'anchor_drrw_1', label: 'Mask', kind: 'accessory', text: 'a riveted scrap respirator mask and dust goggles over the face' },
        { id: 'anchor_drrw_2', label: 'Armor', kind: 'clothing', text: 'welded scrap-metal plate and studded leather armour over the shoulders' },
        { id: 'anchor_drrw_3', label: 'Hair', kind: 'hair', text: 'a wild dust-matted mohawk or shaved sides' },
        { id: 'anchor_drrw_4', label: 'Arms', kind: 'other', text: 'bare muscular arms streaked with grease and old burns' },
        { id: 'anchor_drrw_5', label: 'Detail', kind: 'accessory', text: 'fingerless gloves gripping a chain-wrapped wheel or weapon' },
      ],
      motifs: [
        { id: 'motif_drrw_1', label: 'Born for the Chase', text: 'the respirator mask, scrap armour, the roar of the war-rig' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo',
        'a riveted scrap respirator mask and dust goggles over the face, a wild dust-matted mohawk',
        'welded scrap-metal plate and studded leather armour, bare muscular grease-streaked arms',
        'fingerless gloves gripping a chain-wrapped wheel',
        'driving a roaring scrap-plated war-rig across the dunes',
      ],
    },
    createdAt: SEED_TS_15,
    updatedAt: SEED_TS_15,
  },
  {
    id: 'character_seed_dr_saloon_singer',
    name: 'The Saloon Singer',
    summary: 'Faded glamour in a town of dust — a torch singer in a once-beautiful dress who holds the whole sweaty saloon in the palm of a gloved hand.',
    tags: ['solo', 'dust run', 'western'],
    identity: {
      archetype: 'saloon singer',
      presentation: 'clothed',
      ageImpression: 'glamorous adult',
      personalityTone: 'smoky, knowing, resilient; sorrow dressed as showmanship',
      visualAnchors: [
        { id: 'anchor_drss_1', label: 'Dress', kind: 'clothing', text: 'a once-fine red satin saloon dress, faded and frayed at the hem' },
        { id: 'anchor_drss_2', label: 'Hair', kind: 'hair', text: 'dark waved hair pinned with a tired silk flower' },
        { id: 'anchor_drss_3', label: 'Face', kind: 'face', text: 'smoky kohl-rimmed eyes and dark lipstick, a knowing half-smile' },
        { id: 'anchor_drss_4', label: 'Gloves', kind: 'accessory', text: 'long satin gloves gone grey at the fingertips' },
        { id: 'anchor_drss_5', label: 'Detail', kind: 'accessory', text: 'a cigarette holder or a dented microphone in hand' },
      ],
      motifs: [
        { id: 'motif_drss_1', label: 'Faded Glamour', text: 'the frayed red dress, the smoky light, beauty surviving the dust' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo',
        'smoky kohl-rimmed eyes and dark lipstick, a knowing half-smile, dark waved hair pinned with a silk flower',
        'a once-fine red satin saloon dress faded and frayed at the hem, long grey-tipped satin gloves',
        'a dented microphone in hand',
        'on a small saloon stage in dusty shafts of light',
      ],
    },
    createdAt: SEED_TS_15,
    updatedAt: SEED_TS_15,
  },
  {
    id: 'character_seed_dr_preacher',
    name: 'The Dust Preacher',
    summary: 'A gaunt apocalyptic revivalist who walks the wastes with a worn bible and a wilder eye — preaching the end of a world that already ended.',
    tags: ['solo', 'dust run', 'western'],
    identity: {
      archetype: 'apocalyptic preacher',
      presentation: 'clothed',
      ageImpression: 'gaunt adult',
      personalityTone: 'feverish, charismatic, dangerous conviction',
      visualAnchors: [
        { id: 'anchor_drp_1', label: 'Build', kind: 'silhouette', text: 'a tall gaunt sun-starved frame' },
        { id: 'anchor_drp_2', label: 'Face', kind: 'face', text: 'a hollow-cheeked face, burning fervent eyes, cracked lips' },
        { id: 'anchor_drp_3', label: 'Coat', kind: 'clothing', text: 'a dusty black preacher\'s frock coat and grimy clerical collar' },
        { id: 'anchor_drp_4', label: 'Hat', kind: 'accessory', text: 'a flat black wide-brimmed preacher hat' },
        { id: 'anchor_drp_5', label: 'Book', kind: 'accessory', text: 'a sun-warped leather bible clutched to the chest' },
      ],
      motifs: [
        { id: 'motif_drp_1', label: 'The End That Already Came', text: 'the black coat, the worn bible, the fervent burning eye' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo',
        'a tall gaunt sun-starved frame, a hollow-cheeked face with burning fervent eyes and cracked lips',
        'a dusty black preacher frock coat and grimy clerical collar, a flat black wide-brimmed hat',
        'a sun-warped leather bible clutched to the chest',
        'preaching in the ruin of a dead-town chapel',
      ],
    },
    createdAt: SEED_TS_15,
    updatedAt: SEED_TS_15,
  },
  {
    id: 'character_seed_dr_outlaw_queen',
    name: 'The Outlaw Queen',
    summary: 'The twin-gun leader of the dune gangs — swaggering, sharp-eyed and quick, a row of notches on each grip and a grin that means trouble.',
    tags: ['solo', 'dust run', 'western'],
    identity: {
      archetype: 'outlaw leader',
      presentation: 'clothed',
      ageImpression: 'fierce adult',
      personalityTone: 'swaggering, sharp, magnetic; loves the fight',
      visualAnchors: [
        { id: 'anchor_droq_1', label: 'Guns', kind: 'accessory', text: 'twin pearl-handled revolvers in a low double holster, notches on each grip' },
        { id: 'anchor_droq_2', label: 'Face', kind: 'face', text: 'a sharp confident face, a scar through one brow, a dangerous grin' },
        { id: 'anchor_droq_3', label: 'Hair', kind: 'hair', text: 'dark hair in a long braid under a tilted hat' },
        { id: 'anchor_droq_4', label: 'Outfit', kind: 'clothing', text: 'a dust-red leather coat over a bandolier and worn trail clothes' },
        { id: 'anchor_droq_5', label: 'Detail', kind: 'accessory', text: 'spurred boots, a red kerchief at the throat' },
      ],
      motifs: [
        { id: 'motif_droq_1', label: 'Notches on the Grip', text: 'the twin revolvers, the dangerous grin, the swagger of the gang' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo, cowgirl',
        'a sharp confident face with a scar through one brow and a dangerous grin, dark hair in a long braid under a tilted hat',
        'a dust-red leather coat over a bandolier, twin pearl-handled revolvers in a low double holster with notched grips',
        'spurred boots and a red kerchief at the throat',
        'standing over the dunes with her gang behind her',
      ],
    },
    createdAt: SEED_TS_15,
    updatedAt: SEED_TS_15,
  },
];

// V16 — Deep Signal: a bioluminescent deep-sea research station drifting toward cosmic horror.
const V16_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_ds_commander',
    name: 'The Station Commander',
    summary: 'The one holding the failing station together by will alone — hollow-eyed, exhausted, still issuing orders to a crew that is quietly coming apart.',
    tags: ['solo', 'deep signal', 'cosmic horror'],
    identity: {
      archetype: 'station commander',
      presentation: 'clothed',
      ageImpression: 'worn adult',
      personalityTone: 'grimly composed, fraying at the edges, refusing to break first',
      visualAnchors: [
        { id: 'anchor_dsc_1', label: 'Face', kind: 'face', text: 'a gaunt hollow-eyed face lit blue by console glow, deep exhaustion in the eyes' },
        { id: 'anchor_dsc_2', label: 'Hair', kind: 'hair', text: 'grey-streaked hair, unwashed and pushed back' },
        { id: 'anchor_dsc_3', label: 'Outfit', kind: 'clothing', text: 'a worn station commander\'s jumpsuit with faded rank patches, collar open' },
        { id: 'anchor_dsc_4', label: 'Detail', kind: 'other', text: 'damp skin sheened with condensation, a faint tremor held in check' },
        { id: 'anchor_dsc_5', label: 'Prop', kind: 'accessory', text: 'a dead radio handset gripped too tightly' },
      ],
      motifs: [
        { id: 'motif_dsc_1', label: 'Holding It Together', text: 'console-blue light, the dead handset, command fraying in the dark' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo',
        'a gaunt hollow-eyed face lit blue by console glow, deep exhaustion, grey-streaked unwashed hair',
        'a worn station commander jumpsuit with faded rank patches, collar open',
        'damp skin sheened with condensation, gripping a dead radio handset',
        'on a flickering deep-sea station command deck',
      ],
    },
    createdAt: SEED_TS_16,
    updatedAt: SEED_TS_16,
  },
  {
    id: 'character_seed_ds_biologist',
    name: 'The Marine Biologist',
    summary: 'A researcher who has fallen in love with the impossible things in the tanks — wonder curdling into obsession, face pressed to the specimen glass.',
    tags: ['solo', 'deep signal', 'cosmic horror'],
    identity: {
      archetype: 'marine biologist',
      presentation: 'clothed',
      ageImpression: 'intent adult',
      personalityTone: 'rapt, brilliant, dangerously fascinated',
      visualAnchors: [
        { id: 'anchor_dsb_1', label: 'Face', kind: 'face', text: 'an intent face underlit by bioluminescent tank glow, wide fascinated eyes' },
        { id: 'anchor_dsb_2', label: 'Hair', kind: 'hair', text: 'dark hair escaping a loose tie, damp at the temples' },
        { id: 'anchor_dsb_3', label: 'Outfit', kind: 'clothing', text: 'a rolled-sleeve lab coat over a station jumpsuit, ID lanyard' },
        { id: 'anchor_dsb_4', label: 'Hands', kind: 'other', text: 'a gloved hand pressed flat against glowing specimen glass' },
        { id: 'anchor_dsb_5', label: 'Glow', kind: 'other', text: 'cyan and violet creature-light washing up over the face' },
      ],
      motifs: [
        { id: 'motif_dsb_1', label: 'Face to the Glass', text: 'tank glow, the pressed hand, wonder curdling into obsession' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo, scientist',
        'an intent face underlit by bioluminescent tank glow, wide fascinated eyes, dark hair escaping a loose tie',
        'a rolled-sleeve lab coat over a station jumpsuit, an ID lanyard',
        'a gloved hand pressed flat against glowing specimen glass, cyan and violet light on her face',
        'in a deep-sea specimen lab of glowing tanks',
      ],
    },
    createdAt: SEED_TS_16,
    updatedAt: SEED_TS_16,
  },
  {
    id: 'character_seed_ds_diver',
    name: 'The Deep Diver',
    summary: 'A figure in a heavy atmospheric dive suit, tethered to a thread of light and air — alone in the crushing black, the only sound their own breathing.',
    tags: ['solo', 'deep signal', 'cosmic horror'],
    identity: {
      archetype: 'deep-sea diver',
      presentation: 'armored',
      ageImpression: 'unknown',
      personalityTone: 'calm, methodical, utterly alone',
      visualAnchors: [
        { id: 'anchor_dsd_1', label: 'Suit', kind: 'clothing', text: 'a heavy riveted atmospheric dive suit, armoured plates and hoses' },
        { id: 'anchor_dsd_2', label: 'Helmet', kind: 'accessory', text: 'a round brass-and-steel diving helmet, a single bright lamp above the faceplate' },
        { id: 'anchor_dsd_3', label: 'Face', kind: 'face', text: 'a dim face barely visible behind the fogged, faintly cracked faceplate' },
        { id: 'anchor_dsd_4', label: 'Tether', kind: 'accessory', text: 'an umbilical air-and-light tether trailing up into the black' },
        { id: 'anchor_dsd_5', label: 'Detail', kind: 'other', text: 'bubbles streaming up, fine silt drifting in the lamp beam' },
      ],
      motifs: [
        { id: 'motif_dsd_1', label: 'On the Tether', text: 'the helmet lamp, the trailing umbilical, one breath at a time in the black' },
      ],
    },
    phraseBundle: {
      core: [
        '1person, solo, diving suit',
        'a heavy riveted atmospheric dive suit with armoured plates and hoses',
        'a round brass-and-steel diving helmet, a single bright lamp above a fogged cracked faceplate',
        'an umbilical air tether trailing up into the black, bubbles streaming',
        'alone in the crushing abyssal dark, silt drifting in the lamp beam',
      ],
    },
    createdAt: SEED_TS_16,
    updatedAt: SEED_TS_16,
  },
  {
    id: 'character_seed_ds_engineer',
    name: 'The Station Engineer',
    summary: 'The one keeping the lights on as the station fails around her — soaked, grease-streaked, working by torchlight as the seams groan and weep seawater.',
    tags: ['solo', 'deep signal', 'cosmic horror'],
    identity: {
      archetype: 'station engineer',
      presentation: 'clothed',
      ageImpression: 'capable adult',
      personalityTone: 'practical, stubborn, running on fumes',
      visualAnchors: [
        { id: 'anchor_dse_1', label: 'Face', kind: 'face', text: 'a grease-streaked face lit by a clenched torch, jaw set' },
        { id: 'anchor_dse_2', label: 'Hair', kind: 'hair', text: 'short hair plastered down with sweat and seawater' },
        { id: 'anchor_dse_3', label: 'Outfit', kind: 'clothing', text: 'a soaked engineer\'s jumpsuit tied at the waist, tool harness' },
        { id: 'anchor_dse_4', label: 'Hands', kind: 'other', text: 'gloved hands working a sparking junction box, a wrench in the teeth' },
        { id: 'anchor_dse_5', label: 'Detail', kind: 'other', text: 'seawater weeping from a groaning seam behind her' },
      ],
      motifs: [
        { id: 'motif_dse_1', label: 'Keeping the Lights On', text: 'torchlight, weeping seams, holding the failing station together' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo, engineer',
        'a grease-streaked face lit by a clenched torch, short hair plastered with sweat and seawater',
        'a soaked engineer jumpsuit tied at the waist, a tool harness',
        'gloved hands working a sparking junction box, seawater weeping from a groaning seam behind',
        'in a cramped failing deep-sea station corridor',
      ],
    },
    createdAt: SEED_TS_16,
    updatedAt: SEED_TS_16,
  },
  {
    id: 'character_seed_ds_comms',
    name: 'The Comms Officer',
    summary: 'The one who hears it in the static — headphones clamped on, eyes too wide, transcribing a signal from the deep that should not have words.',
    tags: ['solo', 'deep signal', 'cosmic horror'],
    identity: {
      archetype: 'comms officer',
      presentation: 'clothed',
      ageImpression: 'unraveling adult',
      personalityTone: 'haunted, sleepless, listening to something nobody else can hear',
      visualAnchors: [
        { id: 'anchor_dsco_1', label: 'Headphones', kind: 'accessory', text: 'heavy headphones clamped over the ears, knuckles white on them' },
        { id: 'anchor_dsco_2', label: 'Eyes', kind: 'eyes', text: 'sleepless red-rimmed eyes, too wide, fixed on nothing' },
        { id: 'anchor_dsco_3', label: 'Face', kind: 'face', text: 'a pale drawn face lit green by a sonar scope' },
        { id: 'anchor_dsco_4', label: 'Outfit', kind: 'clothing', text: 'a rumpled station jumpsuit, a notebook of frantic transcribed symbols' },
        { id: 'anchor_dsco_5', label: 'Detail', kind: 'other', text: 'a waveform on the screen forming shapes it should not' },
      ],
      motifs: [
        { id: 'motif_dsco_1', label: 'It Has Words', text: 'clamped headphones, the green scope, a signal that should not speak' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo',
        'a pale drawn face lit green by a sonar scope, sleepless red-rimmed eyes too wide',
        'heavy headphones clamped over the ears, knuckles white',
        'a rumpled station jumpsuit, a notebook of frantic transcribed symbols',
        'hunched at a hydrophone console in the dark',
      ],
    },
    createdAt: SEED_TS_16,
    updatedAt: SEED_TS_16,
  },
  {
    id: 'character_seed_ds_doctor',
    name: 'The Station Doctor',
    summary: 'The medic charting a sickness with no name — treating crew whose bodies are quietly, wrongly changing, and trying not to notice it in the mirror.',
    tags: ['solo', 'deep signal', 'cosmic horror'],
    identity: {
      archetype: 'station doctor',
      presentation: 'clothed',
      ageImpression: 'steady adult',
      personalityTone: 'clinical, frightened, holding to procedure as a shield',
      visualAnchors: [
        { id: 'anchor_dsdr_1', label: 'Face', kind: 'face', text: 'a calm tired face with a faint translucent sheen starting at the jaw' },
        { id: 'anchor_dsdr_2', label: 'Hair', kind: 'hair', text: 'hair tucked under a surgical cap' },
        { id: 'anchor_dsdr_3', label: 'Outfit', kind: 'clothing', text: 'surgical scrubs and gloves under a station coat, a stained apron' },
        { id: 'anchor_dsdr_4', label: 'Hands', kind: 'other', text: 'gloved hands holding a chart of impossible scans' },
        { id: 'anchor_dsdr_5', label: 'Detail', kind: 'other', text: 'a faint web of luminous veins barely visible under the skin' },
      ],
      motifs: [
        { id: 'motif_dsdr_1', label: 'A Sickness With No Name', text: 'the chart, the translucent sheen, the change in the mirror' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo, doctor',
        'a calm tired face with a faint translucent sheen starting at the jaw, hair under a surgical cap',
        'surgical scrubs and gloves under a station coat, a stained apron',
        'gloved hands holding a chart of impossible scans, faint luminous veins under the skin',
        'in a cramped station medical bay',
      ],
    },
    createdAt: SEED_TS_16,
    updatedAt: SEED_TS_16,
  },
  {
    id: 'character_seed_ds_cultist',
    name: 'The Deep Cultist',
    summary: 'A stowaway who came down to worship — barnacle-crusted robes, a serene smile, certain the thing in the trench is a god and the crew its offering.',
    tags: ['solo', 'deep signal', 'cosmic horror'],
    identity: {
      archetype: 'deep cultist',
      presentation: 'clothed',
      ageImpression: 'fervent adult',
      personalityTone: 'serene, rapturous, utterly converted',
      visualAnchors: [
        { id: 'anchor_dscu_1', label: 'Robes', kind: 'clothing', text: 'sodden barnacle-crusted robes hung with shells and bone' },
        { id: 'anchor_dscu_2', label: 'Face', kind: 'face', text: 'a serene rapturous face, salt-cracked lips, a beatific smile' },
        { id: 'anchor_dscu_3', label: 'Eyes', kind: 'eyes', text: 'pale eyes brimming with devotion, pupils blown wide' },
        { id: 'anchor_dscu_4', label: 'Skin', kind: 'other', text: 'grey waterlogged skin, faint scale-like patterning at the throat' },
        { id: 'anchor_dscu_5', label: 'Prop', kind: 'accessory', text: 'a barnacle-crusted idol cradled to the chest' },
      ],
      motifs: [
        { id: 'motif_dscu_1', label: 'The God in the Trench', text: 'barnacle robes, the cradled idol, the beatific certainty' },
      ],
    },
    phraseBundle: {
      core: [
        '1person, solo, cultist',
        'a serene rapturous face with salt-cracked lips and a beatific smile, pale devoted eyes blown wide',
        'sodden barnacle-crusted robes hung with shells and bone, grey waterlogged skin',
        'faint scale-like patterning at the throat, cradling a barnacle-crusted idol',
        'in a dripping flooded station chamber',
      ],
    },
    createdAt: SEED_TS_16,
    updatedAt: SEED_TS_16,
  },
  {
    id: 'character_seed_ds_changed',
    name: 'The Changed One',
    summary: 'A crewmember the deep has begun to rewrite — half the face still human, the rest blooming into translucent fins, gills and soft abyssal light.',
    tags: ['solo', 'deep signal', 'cosmic horror', 'body horror'],
    identity: {
      archetype: 'transformed crew',
      presentation: 'clothed',
      ageImpression: 'unknown',
      personalityTone: 'caught between terror and something newly, calmly inhuman',
      visualAnchors: [
        { id: 'anchor_dsch_1', label: 'Face', kind: 'face', text: 'half a human face, the other half blooming into translucent fins and ridges' },
        { id: 'anchor_dsch_2', label: 'Eyes', kind: 'eyes', text: 'one human eye and one large lidless black abyssal eye' },
        { id: 'anchor_dsch_3', label: 'Skin', kind: 'other', text: 'skin going translucent and faintly bioluminescent, gill-slits opening at the neck' },
        { id: 'anchor_dsch_4', label: 'Body', kind: 'silhouette', text: 'a torn station jumpsuit splitting over new soft anatomy' },
        { id: 'anchor_dsch_5', label: 'Glow', kind: 'other', text: 'a soft internal violet glow pulsing under the changing flesh' },
      ],
      motifs: [
        { id: 'motif_dsch_1', label: 'Being Rewritten', text: 'the half-human face, the gills, the soft abyssal glow under the skin' },
      ],
    },
    phraseBundle: {
      core: [
        '1person, solo, monster, body horror',
        'half a human face and half blooming into translucent fins and ridges, one human eye and one large lidless black abyssal eye',
        'skin going translucent and faintly bioluminescent, gill-slits opening at the neck',
        'a torn station jumpsuit splitting over new soft anatomy, a soft internal violet glow under the flesh',
        'in a dim flickering station corridor',
      ],
    },
    createdAt: SEED_TS_16,
    updatedAt: SEED_TS_16,
  },
  {
    id: 'character_seed_ds_siren',
    name: 'The Anglerfish Siren',
    summary: 'A predator wearing a lure shaped like a woman — pale translucent flesh, needle teeth behind a soft smile, a single glowing lure dangling before the dark.',
    tags: ['solo', 'deep signal', 'cosmic horror'],
    identity: {
      archetype: 'anglerfish humanoid',
      presentation: 'nude-implied',
      ageImpression: 'ageless',
      personalityTone: 'patient, beckoning, lethally serene',
      visualAnchors: [
        { id: 'anchor_dssi_1', label: 'Lure', kind: 'accessory', text: 'a single bioluminescent lure on a stalk dangling from the brow, glowing soft gold' },
        { id: 'anchor_dssi_2', label: 'Skin', kind: 'other', text: 'pale translucent abyssal flesh, faint organs visible, veined with light' },
        { id: 'anchor_dssi_3', label: 'Teeth', kind: 'face', text: 'a soft beckoning smile parting over rows of needle glass teeth' },
        { id: 'anchor_dssi_4', label: 'Eyes', kind: 'eyes', text: 'huge black lidless eyes, depthless' },
        { id: 'anchor_dssi_5', label: 'Form', kind: 'silhouette', text: 'long-fingered webbed hands, a sinuous finned lower body trailing into the dark' },
      ],
      motifs: [
        { id: 'motif_dssi_1', label: 'The Lure', text: 'the glowing lure, the needle smile, a predator shaped like a welcome' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, monster girl',
        'pale translucent abyssal flesh veined with light, huge black lidless depthless eyes',
        'a single soft-gold bioluminescent lure on a stalk dangling from the brow',
        'a soft beckoning smile parting over rows of needle glass teeth, long webbed fingers',
        'a sinuous finned lower body trailing into the black water',
      ],
    },
    createdAt: SEED_TS_16,
    updatedAt: SEED_TS_16,
  },
  {
    id: 'character_seed_ds_drowned',
    name: 'The Drowned Diver',
    summary: 'A lost crewmember the sea gave back — still in a flooded, broken dive suit, drifting the corridors, helmet full of dark water and a faint blue glow.',
    tags: ['solo', 'deep signal', 'cosmic horror', 'ghost'],
    identity: {
      archetype: 'drowned revenant',
      presentation: 'armored',
      ageImpression: 'unknown',
      personalityTone: 'mournful, slow, drifting without purpose',
      visualAnchors: [
        { id: 'anchor_dsdd_1', label: 'Suit', kind: 'clothing', text: 'a flooded broken dive suit, plates buckled and trailing torn hoses' },
        { id: 'anchor_dsdd_2', label: 'Helmet', kind: 'accessory', text: 'a cracked diving helmet half-full of dark water, a faint blue glow within' },
        { id: 'anchor_dsdd_3', label: 'Form', kind: 'silhouette', text: 'a body drifting weightless, limbs slack, slowly turning' },
        { id: 'anchor_dsdd_4', label: 'Detail', kind: 'other', text: 'pale waterlogged hands, small fish moving around the helmet' },
        { id: 'anchor_dsdd_5', label: 'Glow', kind: 'other', text: 'a dim cold glow leaking from the cracked faceplate' },
      ],
      motifs: [
        { id: 'motif_dsdd_1', label: 'The Sea Gave It Back', text: 'the flooded helmet, the drifting limbs, the cold glow within' },
      ],
    },
    phraseBundle: {
      core: [
        '1person, solo, diving suit, undead',
        'a flooded broken dive suit with buckled plates and torn trailing hoses',
        'a cracked diving helmet half-full of dark water with a faint blue glow within',
        'a body drifting weightless, limbs slack and slowly turning, pale waterlogged hands',
        'adrift in a flooded station corridor, small fish circling',
      ],
    },
    createdAt: SEED_TS_16,
    updatedAt: SEED_TS_16,
  },
  {
    id: 'character_seed_ds_herald',
    name: 'The Abyssal Herald',
    summary: 'The shape the thing in the trench sends ahead — vaguely humanoid, immense and wrong, a silhouette of fins and impossible geometry haloed in cold light.',
    tags: ['solo', 'deep signal', 'cosmic horror', 'eldritch'],
    identity: {
      archetype: 'eldritch avatar',
      presentation: 'other',
      ageImpression: 'eternal',
      personalityTone: 'vast, indifferent, ancient beyond comprehension',
      visualAnchors: [
        { id: 'anchor_dsh_1', label: 'Form', kind: 'silhouette', text: 'a vaguely humanoid silhouette far too large, fins and tendrils and wrong angles' },
        { id: 'anchor_dsh_2', label: 'Light', kind: 'other', text: 'a cold halo of bioluminescent light tracing its impossible edges' },
        { id: 'anchor_dsh_3', label: 'Eyes', kind: 'eyes', text: 'constellations of small pale lights where eyes might be' },
        { id: 'anchor_dsh_4', label: 'Surface', kind: 'other', text: 'a dark surface that seems to swallow the light around it' },
        { id: 'anchor_dsh_5', label: 'Scale', kind: 'other', text: 'a tiny diver silhouette dwarfed before it for scale' },
      ],
      motifs: [
        { id: 'motif_dsh_1', label: 'Sent Ahead', text: 'the immense wrong silhouette, the cold halo, the constellation of eyes in the dark' },
      ],
    },
    phraseBundle: {
      core: [
        'no humans, eldritch, monster',
        'a vaguely humanoid silhouette far too large, fins and tendrils and impossible wrong angles',
        'a cold halo of bioluminescent light tracing its edges, constellations of small pale lights where eyes might be',
        'a dark surface that seems to swallow the surrounding light',
        'a tiny diver dwarfed before it in the abyssal black for scale',
      ],
    },
    createdAt: SEED_TS_16,
    updatedAt: SEED_TS_16,
  },
];

// V17 — Saint Circuit: a blue-saturated religious-cyberpunk cathedral-city.
const V17_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_sc_cardinal',
    name: 'The Cyber-Cardinal',
    summary: 'The head bishop of the cathedral-city — mediator between the human flock and the machine-saints, ornate cobalt vestments embroidered with circuit traces, a great neon halo above the mitre.',
    tags: ['solo', 'saint circuit', 'religious cyberpunk'],
    identity: {
      archetype: 'cyber-cardinal',
      presentation: 'clothed',
      ageImpression: 'imposing elder',
      personalityTone: 'serene, unhurried, absolutely certain',
      visualAnchors: [
        { id: 'anchor_sccc_1', label: 'Face', kind: 'face', text: 'a lined ascetic face, pale bone-white skin underlit by cobalt halo, calm grey eyes' },
        { id: 'anchor_sccc_2', label: 'Halo', kind: 'accessory', text: 'a great neon-cobalt halo ring suspended above a tall mitre' },
        { id: 'anchor_sccc_3', label: 'Vestments', kind: 'clothing', text: 'ornate cobalt robes with gold and cyan circuit embroidery, a long stole of glowing data-thread' },
        { id: 'anchor_sccc_4', label: 'Hands', kind: 'other', text: 'thin pale hands clasping a chrome-and-blue rosary processor' },
        { id: 'anchor_sccc_5', label: 'Detail', kind: 'other', text: 'a chrome ring with a stained-glass cabochon set into it' },
      ],
      motifs: [
        { id: 'motif_sccc_1', label: 'Mediator of Machines', text: 'the cobalt halo, the circuit stole, devotion run on current' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo, cardinal',
        'a lined ascetic bone-white face underlit cobalt, calm grey eyes',
        'a great neon-cobalt halo ring above a tall mitre',
        'ornate cobalt robes with gold and cyan circuit embroidery, a stole of glowing data-thread',
        'clasping a chrome-and-blue rosary processor in a vast cathedral nave',
      ],
    },
    createdAt: SEED_TS_17,
    updatedAt: SEED_TS_17,
  },
  {
    id: 'character_seed_sc_cyber_monk',
    name: 'The Cyber-Monk',
    summary: 'A humble servant of the cathedral — cobalt habit, prayer-bead processor in his hands, eyes closed in firmware meditation.',
    tags: ['solo', 'saint circuit', 'religious cyberpunk'],
    identity: {
      archetype: 'cyber-monk',
      presentation: 'clothed',
      ageImpression: 'quiet adult',
      personalityTone: 'humble, devoted, half-listening to inner code',
      visualAnchors: [
        { id: 'anchor_sccm_1', label: 'Hood', kind: 'clothing', text: 'a deep cobalt-blue habit and hood, the face in cool shadow' },
        { id: 'anchor_sccm_2', label: 'Face', kind: 'face', text: 'pale bone-white skin, eyes closed in meditation, a faint cyan glow on the brow' },
        { id: 'anchor_sccm_3', label: 'Beads', kind: 'accessory', text: 'a rosary of small glowing data-beads threaded between the fingers' },
        { id: 'anchor_sccm_4', label: 'Tonsure', kind: 'hair', text: 'a shaved tonsure with a faint glowing circuit-sigil at the crown' },
        { id: 'anchor_sccm_5', label: 'Detail', kind: 'other', text: 'a soft cobalt glow rising from inside the hood' },
      ],
      motifs: [
        { id: 'motif_sccm_1', label: 'Firmware Meditation', text: 'glowing beads, the cobalt hood, prayer as quiet computation' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo, monk',
        'a deep cobalt-blue habit and hood, face in cool shadow',
        'pale bone-white skin, eyes closed, a faint cyan glow on the brow',
        'a rosary of small glowing data-beads between the fingers, a shaved tonsure with a sigil',
        'standing in a cobalt-lit cloister, soft cobalt glow rising from the hood',
      ],
    },
    createdAt: SEED_TS_17,
    updatedAt: SEED_TS_17,
  },
  {
    id: 'character_seed_sc_stained_saint',
    name: 'The Stained-Glass Saint',
    summary: 'A living saint manifest in a cathedral window — a body of luminous cobalt and indigo glass with black leading, halo of light, gazing down from the great pane.',
    tags: ['solo', 'saint circuit', 'religious cyberpunk'],
    identity: {
      archetype: 'stained-glass saint',
      presentation: 'other',
      ageImpression: 'eternal',
      personalityTone: 'serene, watchful, faintly mournful',
      visualAnchors: [
        { id: 'anchor_scss_1', label: 'Body', kind: 'silhouette', text: 'a tall figure rendered as luminous stained glass with black leading, every limb a panel' },
        { id: 'anchor_scss_2', label: 'Palette', kind: 'other', text: 'cobalt, ultramarine and indigo panes shot through with bright cyan and a single red sacred heart' },
        { id: 'anchor_scss_3', label: 'Halo', kind: 'accessory', text: 'a gold-leaf halo behind the head, lit from within' },
        { id: 'anchor_scss_4', label: 'Face', kind: 'face', text: 'serene leaded-glass features, eyes downcast in benediction' },
        { id: 'anchor_scss_5', label: 'Hands', kind: 'other', text: 'glass hands raised in blessing, light pouring through the fingers' },
      ],
      motifs: [
        { id: 'motif_scss_1', label: 'The Pane Watches', text: 'cobalt glass, gold halo, a saint that is a window' },
      ],
    },
    phraseBundle: {
      core: [
        '1person, solo, saint, stained glass',
        'a tall figure rendered as luminous stained glass with black leading, every limb a panel',
        'cobalt, ultramarine and indigo panes shot with bright cyan, a single red sacred heart at the chest',
        'a gold-leaf halo lit from within, serene leaded-glass features',
        'glass hands raised in blessing, in a great cathedral window',
      ],
    },
    createdAt: SEED_TS_17,
    updatedAt: SEED_TS_17,
  },
  {
    id: 'character_seed_sc_acolyte',
    name: 'The Acolyte',
    summary: 'A young initiate learning the prayer-firmware — a cobalt cassock, white collar, eyes wide at the great machinery of the faith.',
    tags: ['solo', 'saint circuit', 'religious cyberpunk'],
    identity: {
      archetype: 'acolyte',
      presentation: 'clothed',
      ageImpression: 'young teen',
      personalityTone: 'earnest, awed, just beginning',
      visualAnchors: [
        { id: 'anchor_scac_1', label: 'Outfit', kind: 'clothing', text: 'a simple cobalt cassock with a crisp white collar and a small chrome cross at the throat' },
        { id: 'anchor_scac_2', label: 'Face', kind: 'face', text: 'a young pale face lit cool blue, eyes wide with reverent awe' },
        { id: 'anchor_scac_3', label: 'Hair', kind: 'hair', text: 'short neat hair, a small fresh sigil-shave at the temple' },
        { id: 'anchor_scac_4', label: 'Hands', kind: 'other', text: 'careful gloved hands holding a small data-thurible or hymn-tablet' },
        { id: 'anchor_scac_5', label: 'Halo', kind: 'accessory', text: 'no halo yet — only a thin learner\'s ring of pale cobalt light at the brow' },
      ],
      motifs: [
        { id: 'motif_scac_1', label: 'First Vigil', text: 'cassock and collar, a learner\'s ring of light, awe in the great nave' },
      ],
    },
    phraseBundle: {
      core: [
        '1boy, solo, acolyte, child',
        'a young pale face lit cool blue, eyes wide with awe',
        'a simple cobalt cassock with a crisp white collar and a small chrome cross',
        'short neat hair with a small sigil-shave, a thin learner ring of cobalt light at the brow',
        'holding a small data-thurible in a vast cathedral nave',
      ],
    },
    createdAt: SEED_TS_17,
    updatedAt: SEED_TS_17,
  },
  {
    id: 'character_seed_sc_choir_ai',
    name: 'The Choir AI',
    summary: 'The cathedral\'s singing machine — a humanoid silhouette of brushed chrome and cobalt, a halo of small loudspeakers around a featureless face, voice impossibly pure.',
    tags: ['solo', 'saint circuit', 'religious cyberpunk', 'machine'],
    identity: {
      archetype: 'choir AI',
      presentation: 'other',
      ageImpression: 'ageless',
      personalityTone: 'pure, calm, unhuman',
      visualAnchors: [
        { id: 'anchor_scca_1', label: 'Body', kind: 'silhouette', text: 'a tall slender humanoid of brushed chrome and matte cobalt plates' },
        { id: 'anchor_scca_2', label: 'Halo', kind: 'accessory', text: 'a halo of small loudspeakers arranged in a ring around the head, glowing cyan' },
        { id: 'anchor_scca_3', label: 'Face', kind: 'face', text: 'a smooth featureless faceplate with a single soft glowing seam where a mouth would be' },
        { id: 'anchor_scca_4', label: 'Hands', kind: 'other', text: 'long chrome hands raised in song' },
        { id: 'anchor_scca_5', label: 'Detail', kind: 'other', text: 'visible sound-wave shimmer around the loudspeaker halo' },
      ],
      motifs: [
        { id: 'motif_scca_1', label: 'The Pure Voice', text: 'speaker halo, chrome and cobalt, machine singing in a cathedral' },
      ],
    },
    phraseBundle: {
      core: [
        '1robot, solo, android, machine',
        'a tall slender humanoid of brushed chrome and matte cobalt plates',
        'a halo of small glowing cyan loudspeakers around a smooth featureless faceplate',
        'a single soft glowing seam where a mouth would be, sound-wave shimmer around the head',
        'long chrome hands raised in song in a choir loft',
      ],
    },
    createdAt: SEED_TS_17,
    updatedAt: SEED_TS_17,
  },
  {
    id: 'character_seed_sc_inquisitor',
    name: 'The Inquisitor',
    summary: 'The cathedral\'s heretic-hunter — sleek cobalt plate armour, a thin neon halo, a sigil-blade of glowing circuit-script in her hand.',
    tags: ['solo', 'saint circuit', 'religious cyberpunk'],
    identity: {
      archetype: 'inquisitor',
      presentation: 'armored',
      ageImpression: 'hard adult',
      personalityTone: 'cold, exact, righteous',
      visualAnchors: [
        { id: 'anchor_scin_1', label: 'Armor', kind: 'clothing', text: 'sleek deep-cobalt plate armour with gold-and-cyan filigree, a long blue half-cape' },
        { id: 'anchor_scin_2', label: 'Halo', kind: 'accessory', text: 'a thin sharp neon halo edged in cyan above her head' },
        { id: 'anchor_scin_3', label: 'Face', kind: 'face', text: 'a hard pale face with cold ice-blue eyes, a small circuit-sigil branded between the brows' },
        { id: 'anchor_scin_4', label: 'Weapon', kind: 'accessory', text: 'a slender sigil-blade glowing with circuit-script' },
        { id: 'anchor_scin_5', label: 'Hair', kind: 'hair', text: 'pale hair pulled back severely beneath a circlet' },
      ],
      motifs: [
        { id: 'motif_scin_1', label: 'Holy Geometry', text: 'cobalt plate, the sharp halo, the circuit-blade' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo, knight, inquisitor',
        'sleek deep-cobalt plate armour with gold-and-cyan filigree, a long blue half-cape',
        'a thin sharp neon halo edged in cyan above her head, pale hair pulled back severely',
        'a hard pale face with cold ice-blue eyes, a circuit-sigil branded between the brows',
        'holding a slender sigil-blade glowing with circuit-script',
      ],
    },
    createdAt: SEED_TS_17,
    updatedAt: SEED_TS_17,
  },
  {
    id: 'character_seed_sc_confessor',
    name: 'The Wired Confessor',
    summary: 'A blindfolded priest who listens to whispered sins through wired ear-tubes — sits motionless behind a screen, taking confession as data.',
    tags: ['solo', 'saint circuit', 'religious cyberpunk'],
    identity: {
      archetype: 'wired confessor',
      presentation: 'clothed',
      ageImpression: 'patient adult',
      personalityTone: 'still, listening, infinitely patient',
      visualAnchors: [
        { id: 'anchor_sccf_1', label: 'Blindfold', kind: 'face', text: 'a wide cobalt-blue blindfold embroidered with a sigil over the eyes' },
        { id: 'anchor_sccf_2', label: 'Ears', kind: 'accessory', text: 'wired ear-tubes feeding from both ears down into a small chrome console at the chest' },
        { id: 'anchor_sccf_3', label: 'Robes', kind: 'clothing', text: 'a high-collared dark-blue confessor\'s robe, hands folded in the lap' },
        { id: 'anchor_sccf_4', label: 'Skin', kind: 'other', text: 'pale skin lit cool by the small console-glow at the chest' },
        { id: 'anchor_sccf_5', label: 'Detail', kind: 'other', text: 'faint cyan data-light pulsing through the ear-tubes' },
      ],
      motifs: [
        { id: 'motif_sccf_1', label: 'Sin as Signal', text: 'the blindfold, the ear-tubes, confession captured as data' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo, priest',
        'a wide cobalt-blue sigil-embroidered blindfold over the eyes',
        'wired ear-tubes feeding from both ears down to a small chrome chest-console',
        'a high-collared dark-blue confessor robe, hands folded in the lap',
        'pale skin lit cool by the console glow, in a dim confessional booth',
      ],
    },
    createdAt: SEED_TS_17,
    updatedAt: SEED_TS_17,
  },
  {
    id: 'character_seed_sc_bell_ringer',
    name: 'The Bell-Ringer',
    summary: 'The keeper of the electric bells — a wiry figure suspended in the tower among humming copper-and-blue chimes, eyes shut, listening to the hour.',
    tags: ['solo', 'saint circuit', 'religious cyberpunk'],
    identity: {
      archetype: 'bell-ringer',
      presentation: 'clothed',
      ageImpression: 'wiry adult',
      personalityTone: 'attentive, half-deaf, exalted by the toll',
      visualAnchors: [
        { id: 'anchor_scbr_1', label: 'Hair', kind: 'hair', text: 'wild dark hair tied back, hearing-coils threaded through it' },
        { id: 'anchor_scbr_2', label: 'Face', kind: 'face', text: 'a lean pale face, eyes shut, lips parted, lit cool blue from below' },
        { id: 'anchor_scbr_3', label: 'Outfit', kind: 'clothing', text: 'a worn dark-blue robe over a leather harness, hanging from a thick rope' },
        { id: 'anchor_scbr_4', label: 'Hands', kind: 'other', text: 'calloused hands gripping a humming braided cable' },
        { id: 'anchor_scbr_5', label: 'Detail', kind: 'other', text: 'great copper-and-blue electric bells hanging around him, faintly glowing' },
      ],
      motifs: [
        { id: 'motif_scbr_1', label: 'The Electric Toll', text: 'humming bells, the braided cable, listening to the hour' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo',
        'wild dark hair tied back with hearing-coils threaded through it, a lean pale face lit cool blue from below',
        'eyes shut, lips parted, listening',
        'a worn dark-blue robe over a leather harness, hanging from a thick rope',
        'gripping a humming braided cable among great copper-and-blue electric bells',
      ],
    },
    createdAt: SEED_TS_17,
    updatedAt: SEED_TS_17,
  },
  {
    id: 'character_seed_sc_iconographer',
    name: 'The Iconographer',
    summary: 'The painter of living blue icons — pigment-stained gloves and a light-pen, a small stained-glass icon glowing on her workbench, her own face faintly haloed from below.',
    tags: ['solo', 'saint circuit', 'religious cyberpunk'],
    identity: {
      archetype: 'iconographer',
      presentation: 'clothed',
      ageImpression: 'careful adult',
      personalityTone: 'meticulous, devotional, lost in the work',
      visualAnchors: [
        { id: 'anchor_scig_1', label: 'Face', kind: 'face', text: 'a careful pale face underlit cobalt from her workbench, focused half-lidded eyes' },
        { id: 'anchor_scig_2', label: 'Hair', kind: 'hair', text: 'dark hair pinned up, a fine paintbrush tucked behind one ear' },
        { id: 'anchor_scig_3', label: 'Outfit', kind: 'clothing', text: 'a deep-blue work apron over a high-collared blouse, pigment-stained gloves' },
        { id: 'anchor_scig_4', label: 'Hands', kind: 'other', text: 'one hand holding a glowing light-pen, the other steadying a small stained-glass icon panel' },
        { id: 'anchor_scig_5', label: 'Detail', kind: 'other', text: 'jars of luminous pigment and a wall of finished blue icons behind her' },
      ],
      motifs: [
        { id: 'motif_scig_1', label: 'Living Icons', text: 'the light-pen, the glowing icon panel, devotional craft' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo',
        'a careful pale face underlit cobalt from her workbench, focused half-lidded eyes',
        'dark hair pinned up with a paintbrush tucked behind one ear',
        'a deep-blue work apron over a high-collared blouse, pigment-stained gloves',
        'holding a glowing light-pen over a small stained-glass icon panel, jars of luminous pigment around her',
      ],
    },
    createdAt: SEED_TS_17,
    updatedAt: SEED_TS_17,
  },
  {
    id: 'character_seed_sc_penitent',
    name: 'The Penitent Pilgrim',
    summary: 'A traveller come to the cathedral barefoot — hooded blue robes, a halo of glowing prayer-coils, hands chained with a thin cyan light, looking up at the great nave.',
    tags: ['solo', 'saint circuit', 'religious cyberpunk'],
    identity: {
      archetype: 'pilgrim',
      presentation: 'clothed',
      ageImpression: 'weary adult',
      personalityTone: 'humble, hopeful, exhausted',
      visualAnchors: [
        { id: 'anchor_scpe_1', label: 'Robes', kind: 'clothing', text: 'hooded faded blue pilgrim robes, dust on the hem, barefoot' },
        { id: 'anchor_scpe_2', label: 'Halo', kind: 'accessory', text: 'a delicate halo of glowing cyan prayer-coils above the brow' },
        { id: 'anchor_scpe_3', label: 'Face', kind: 'face', text: 'a tired pale face, eyes raised in hope, lit cool blue' },
        { id: 'anchor_scpe_4', label: 'Hands', kind: 'other', text: 'hands held together as if bound by a thin filament of cyan light' },
        { id: 'anchor_scpe_5', label: 'Detail', kind: 'other', text: 'a small data-relic in a pouch at the belt' },
      ],
      motifs: [
        { id: 'motif_scpe_1', label: 'Long Road to the Nave', text: 'dusty robes, the prayer-coil halo, the cyan thread of penance' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo, pilgrim',
        'hooded faded blue pilgrim robes, dust on the hem, barefoot',
        'a delicate halo of glowing cyan prayer-coils above the brow',
        'a tired pale face lit cool blue, eyes raised in hope',
        'hands held together as if bound by a thin filament of cyan light, in a vast cathedral nave',
      ],
    },
    createdAt: SEED_TS_17,
    updatedAt: SEED_TS_17,
  },
  {
    id: 'character_seed_sc_machine_hermit',
    name: 'The Machine-Hermit',
    summary: 'A half-cyborg recluse meditating in a vault — a body grown into the cathedral wiring, cobalt cabling like vines through the flesh, eyes long closed.',
    tags: ['solo', 'saint circuit', 'religious cyberpunk'],
    identity: {
      archetype: 'machine-hermit',
      presentation: 'clothed',
      ageImpression: 'ancient',
      personalityTone: 'unmoving, transcendent, barely human',
      visualAnchors: [
        { id: 'anchor_scmh_1', label: 'Body', kind: 'silhouette', text: 'a gaunt seated figure with cobalt cabling growing through the flesh like vines' },
        { id: 'anchor_scmh_2', label: 'Face', kind: 'face', text: 'a withered face, eyes long closed and stitched, a faint cyan glow leaking from the seams' },
        { id: 'anchor_scmh_3', label: 'Robes', kind: 'clothing', text: 'tattered indigo robes fused into the wall-wiring' },
        { id: 'anchor_scmh_4', label: 'Halo', kind: 'accessory', text: 'a soft drifting halo of dust and faint blue light' },
        { id: 'anchor_scmh_5', label: 'Detail', kind: 'other', text: 'a small altar of melted candle-LEDs in front of him' },
      ],
      motifs: [
        { id: 'motif_scmh_1', label: 'Grown Into the Wall', text: 'cabling-vines, stitched eyes, transcendence by current' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo, old man',
        'a gaunt seated figure with cobalt cabling growing through the flesh like vines',
        'a withered face with eyes stitched closed and a faint cyan glow leaking from the seams',
        'tattered indigo robes fused into the wall-wiring of a dim vault',
        'a soft drifting halo of dust and faint blue light, a small altar of melted candle-LEDs in front',
      ],
    },
    createdAt: SEED_TS_17,
    updatedAt: SEED_TS_17,
  },
  {
    id: 'character_seed_sc_heretic',
    name: 'The Broken-Halo Heretic',
    summary: 'An apostate who escaped the church — torn cobalt robes, a halo split and sparking above the head, blue circuit-stigmata bleeding pale cyan light, defiant.',
    tags: ['solo', 'saint circuit', 'religious cyberpunk'],
    identity: {
      archetype: 'heretic',
      presentation: 'clothed',
      ageImpression: 'fierce adult',
      personalityTone: 'defiant, wounded, refusing to kneel',
      visualAnchors: [
        { id: 'anchor_sche_1', label: 'Halo', kind: 'accessory', text: 'a broken halo above the head, one side cracked and sparking cyan' },
        { id: 'anchor_sche_2', label: 'Face', kind: 'face', text: 'a defiant pale face with sharp ice-blue eyes, a small split lip' },
        { id: 'anchor_sche_3', label: 'Stigmata', kind: 'other', text: 'blue circuit-stigmata on the palms and brow leaking pale cyan light' },
        { id: 'anchor_sche_4', label: 'Robes', kind: 'clothing', text: 'torn cobalt robes with the church sigil scratched out, a rough hood' },
        { id: 'anchor_sche_5', label: 'Hair', kind: 'hair', text: 'dark hair shaved on one side, the church-sigil scar visible' },
      ],
      motifs: [
        { id: 'motif_sche_1', label: 'No Longer Kneeling', text: 'the broken halo, circuit-stigmata, the scratched-out sigil' },
      ],
    },
    phraseBundle: {
      core: [
        '1person, solo',
        'a defiant pale face with sharp ice-blue eyes',
        'a broken halo above the head, one side cracked and sparking cyan',
        'blue circuit-stigmata on the palms and brow leaking pale cyan light',
        'torn cobalt robes with the church sigil scratched out, dark hair shaved on one side',
      ],
    },
    createdAt: SEED_TS_17,
    updatedAt: SEED_TS_17,
  },
];

// V18 — Orchard Reverie: an eternal-summer sacred orchard of fruit-bonded priestess-wardens.
const V18_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_or_apple',
    name: 'The Orchard Keeper',
    summary: 'Eldest of the wardens, bonded to the first apple tree — steady, rooted, the mother of the orchard who holds the harvest rite together. Red-and-green robes, a crown of apple-leaves, warm tired eyes.',
    tags: ['solo', 'orchard reverie', 'fruit warden'],
    identity: {
      archetype: 'orchard keeper',
      presentation: 'clothed',
      ageImpression: 'serene mature woman',
      personalityTone: 'steady, warm, quietly authoritative',
      visualAnchors: [
        { id: 'anchor_orap_1', label: 'Face', kind: 'face', text: 'a warm sun-freckled face, soft laugh-lines, calm hazel eyes, golden-hour skin' },
        { id: 'anchor_orap_2', label: 'Hair', kind: 'hair', text: 'long chestnut hair loosely braided with apple-leaves and a single red blossom' },
        { id: 'anchor_orap_3', label: 'Crown', kind: 'accessory', text: 'a woven crown of apple-leaves and tiny green apples' },
        { id: 'anchor_orap_4', label: 'Robes', kind: 'clothing', text: 'flowing red-and-green linen warden robes with a gold harvest sash, sleeves rolled' },
        { id: 'anchor_orap_5', label: 'Detail', kind: 'other', text: 'a ripe red apple cradled in one hand, faint golden orchard light around her' },
      ],
      motifs: [
        { id: 'motif_orap_1', label: 'Mother of the Orchard', text: 'apple-leaf crown, gold sash, the eldest who keeps the rite' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo, mature woman',
        'a warm sun-freckled face, soft laugh-lines, calm hazel eyes, golden-hour skin',
        'long chestnut hair braided with apple-leaves, a woven crown of leaves and tiny green apples',
        'flowing red-and-green linen warden robes with a gold harvest sash',
        'cradling a ripe red apple in a sunlit orchard of colossal fruit trees',
      ],
    },
    createdAt: SEED_TS_18,
    updatedAt: SEED_TS_18,
  },
  {
    id: 'character_seed_or_peach',
    name: 'The Peach Warden',
    summary: 'The welcoming warden bonded to the peach groves — soft, generous, sun-warmed. Blush-and-cream silks, a coral blossom in her hair, an easy inviting smile.',
    tags: ['solo', 'orchard reverie', 'fruit warden'],
    identity: {
      archetype: 'peach warden',
      presentation: 'clothed',
      ageImpression: 'warm young woman',
      personalityTone: 'soft, generous, welcoming',
      visualAnchors: [
        { id: 'anchor_orpe_1', label: 'Face', kind: 'face', text: 'a soft round face with peach-blush cheeks, warm brown eyes, a gentle inviting smile' },
        { id: 'anchor_orpe_2', label: 'Hair', kind: 'hair', text: 'warm honey-brown waves loosely up, a coral peach-blossom tucked behind one ear' },
        { id: 'anchor_orpe_3', label: 'Outfit', kind: 'clothing', text: 'a flowing blush-and-cream linen dress with a peach-coloured sash, soft and summery' },
        { id: 'anchor_orpe_4', label: 'Skin', kind: 'other', text: 'warm sun-kissed skin with a soft peachy glow' },
        { id: 'anchor_orpe_5', label: 'Prop', kind: 'accessory', text: 'a woven basket of ripe peaches resting on her hip' },
      ],
      motifs: [
        { id: 'motif_orpe_1', label: 'The Warm Welcome', text: 'peach blossom, blush silks, a basket always offered' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo',
        'a soft round face, peach-blush cheeks, warm brown eyes, gentle inviting smile',
        'warm honey-brown waves loosely up, a coral peach-blossom behind one ear',
        'a flowing blush-and-cream linen dress with a peach sash, soft and summery',
        'holding a woven basket of ripe peaches in a sunlit peach grove',
      ],
    },
    createdAt: SEED_TS_18,
    updatedAt: SEED_TS_18,
  },
  {
    id: 'character_seed_or_pomegranate',
    name: 'The Pomegranate Warden',
    summary: 'The deep and knowing warden bonded to the pomegranate — regal, mysterious, keeper of the orchard\'s older secrets. Garnet-and-crimson robes, ruby seeds at her throat.',
    tags: ['solo', 'orchard reverie', 'fruit warden'],
    identity: {
      archetype: 'pomegranate warden',
      presentation: 'clothed',
      ageImpression: 'striking young woman',
      personalityTone: 'regal, knowing, faintly mysterious',
      visualAnchors: [
        { id: 'anchor_orpo_1', label: 'Face', kind: 'face', text: 'a striking face with deep-set dark eyes, full lips stained pomegranate-red, a knowing look' },
        { id: 'anchor_orpo_2', label: 'Hair', kind: 'hair', text: 'long black hair with a crimson sheen, threaded with tiny garnet beads' },
        { id: 'anchor_orpo_3', label: 'Robes', kind: 'clothing', text: 'rich garnet-and-crimson robes with gold embroidery, a deep draped neckline' },
        { id: 'anchor_orpo_4', label: 'Jewellery', kind: 'accessory', text: 'a necklace of ruby-red pomegranate-seed beads at the throat' },
        { id: 'anchor_orpo_5', label: 'Prop', kind: 'other', text: 'a split pomegranate held open in one hand, jewel-red seeds glistening' },
      ],
      motifs: [
        { id: 'motif_orpo_1', label: 'Keeper of Secrets', text: 'garnet beads, crimson robes, the split fruit and its hidden seeds' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo',
        'a striking face, deep-set dark eyes, full pomegranate-stained lips, a knowing look',
        'long black hair with a crimson sheen, threaded with garnet beads',
        'rich garnet-and-crimson robes with gold embroidery, a necklace of ruby seed-beads',
        'holding a split pomegranate with glistening jewel-red seeds, deep golden orchard light',
      ],
    },
    createdAt: SEED_TS_18,
    updatedAt: SEED_TS_18,
  },
  {
    id: 'character_seed_or_fig',
    name: 'The Fig Warden',
    summary: 'The languid warden bonded to the old fig trees — ripe, unhurried, indulgent. Deep purple-and-honey wraps, fig-leaf motifs, heavy-lidded contentment.',
    tags: ['solo', 'orchard reverie', 'fruit warden'],
    identity: {
      archetype: 'fig warden',
      presentation: 'clothed',
      ageImpression: 'languid young woman',
      personalityTone: 'languid, ripe, indulgent',
      visualAnchors: [
        { id: 'anchor_orfi_1', label: 'Face', kind: 'face', text: 'a soft heavy-lidded face, warm olive skin, a slow contented half-smile' },
        { id: 'anchor_orfi_2', label: 'Hair', kind: 'hair', text: 'dark loose curls falling over the shoulders, a fig-leaf tucked at the temple' },
        { id: 'anchor_orfi_3', label: 'Outfit', kind: 'clothing', text: 'a deep purple-and-honey draped wrap dress with fig-leaf embroidery' },
        { id: 'anchor_orfi_4', label: 'Detail', kind: 'other', text: 'a ripe split fig in hand showing soft pink-honey flesh' },
        { id: 'anchor_orfi_5', label: 'Setting', kind: 'other', text: 'reclining among the broad leaves of a gnarled old fig tree' },
      ],
      motifs: [
        { id: 'motif_orfi_1', label: 'Ripe and Unhurried', text: 'fig leaves, honey-purple wraps, the slow heat of late summer' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo',
        'a soft heavy-lidded face, warm olive skin, slow contented half-smile',
        'dark loose curls over the shoulders, a fig-leaf at the temple',
        'a deep purple-and-honey draped wrap dress with fig-leaf embroidery',
        'holding a ripe split fig with soft pink-honey flesh, among the leaves of a gnarled fig tree',
      ],
    },
    createdAt: SEED_TS_18,
    updatedAt: SEED_TS_18,
  },
  {
    id: 'character_seed_or_citrus',
    name: 'The Citrus Warden',
    summary: 'The bright lively warden bonded to the citrus grove — sharp, sunny, quick to laugh. Zest-yellow and orange linens, citrus-blossom in her hair.',
    tags: ['solo', 'orchard reverie', 'fruit warden'],
    identity: {
      archetype: 'citrus warden',
      presentation: 'clothed',
      ageImpression: 'lively young woman',
      personalityTone: 'bright, sharp, quick to laugh',
      visualAnchors: [
        { id: 'anchor_orci_1', label: 'Face', kind: 'face', text: 'a bright open face, sun-gold skin, lively green eyes, a wide ready grin' },
        { id: 'anchor_orci_2', label: 'Hair', kind: 'hair', text: 'short sun-bleached blonde hair with white citrus-blossom tucked in' },
        { id: 'anchor_orci_3', label: 'Outfit', kind: 'clothing', text: 'a crisp zest-yellow and orange linen dress with rolled sleeves, fresh and summery' },
        { id: 'anchor_orci_4', label: 'Prop', kind: 'accessory', text: 'a wide shallow basket of lemons and oranges on one arm' },
        { id: 'anchor_orci_5', label: 'Detail', kind: 'other', text: 'bright noon light, citrus leaves glossy behind her' },
      ],
      motifs: [
        { id: 'motif_orci_1', label: 'Sharp and Sunny', text: 'citrus blossom, zest-yellow linen, the bright snap of noon' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo',
        'a bright open face, sun-gold skin, lively green eyes, a wide ready grin',
        'short sun-bleached blonde hair with white citrus-blossom tucked in',
        'a crisp zest-yellow and orange linen dress with rolled sleeves',
        'carrying a basket of lemons and oranges in a bright citrus grove',
      ],
    },
    createdAt: SEED_TS_18,
    updatedAt: SEED_TS_18,
  },
  {
    id: 'character_seed_or_cherry',
    name: 'The Cherry Warden',
    summary: 'The playful youngest-feeling warden bonded to the cherry trees — mischievous, flirty, light on her feet. Bright red-and-pink summer dress, cherry-pair earrings.',
    tags: ['solo', 'orchard reverie', 'fruit warden'],
    identity: {
      archetype: 'cherry warden',
      presentation: 'clothed',
      ageImpression: 'playful young woman',
      personalityTone: 'mischievous, flirty, light',
      visualAnchors: [
        { id: 'anchor_orch_1', label: 'Face', kind: 'face', text: 'a bright cheeky face, fair skin, sparkling dark eyes, a teasing grin' },
        { id: 'anchor_orch_2', label: 'Hair', kind: 'hair', text: 'dark hair in two loose low buns, a cherry-blossom sprig tucked in' },
        { id: 'anchor_orch_3', label: 'Outfit', kind: 'clothing', text: 'a flirty red-and-pink summer dress with a short flared skirt and a cherry-print sash' },
        { id: 'anchor_orch_4', label: 'Detail', kind: 'accessory', text: 'a pair of glossy cherries hooked over one ear like an earring' },
        { id: 'anchor_orch_5', label: 'Prop', kind: 'other', text: 'a handful of bright red cherries, blossom petals drifting' },
      ],
      motifs: [
        { id: 'motif_orch_1', label: 'Light and Teasing', text: 'cherry earrings, red-pink skirts, drifting blossom' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo',
        'a bright cheeky face, fair skin, sparkling dark eyes, a teasing grin',
        'dark hair in two loose low buns, a cherry-blossom sprig tucked in',
        'a flirty red-and-pink summer dress with a short flared skirt and cherry-print sash',
        'a pair of glossy cherries hooked over one ear, blossom petals drifting in a cherry orchard',
      ],
    },
    createdAt: SEED_TS_18,
    updatedAt: SEED_TS_18,
  },
  {
    id: 'character_seed_or_plum',
    name: 'The Plum Warden',
    summary: 'The cool elegant warden bonded to the plum trees — composed, refined, a creature of twilight. Deep indigo-and-dusk silks, a single plum-blossom at her collar.',
    tags: ['solo', 'orchard reverie', 'fruit warden'],
    identity: {
      archetype: 'plum warden',
      presentation: 'clothed',
      ageImpression: 'composed young woman',
      personalityTone: 'cool, refined, twilight-calm',
      visualAnchors: [
        { id: 'anchor_orpl_1', label: 'Face', kind: 'face', text: 'a composed elegant face, cool fair skin, calm violet-grey eyes, a faint serene smile' },
        { id: 'anchor_orpl_2', label: 'Hair', kind: 'hair', text: 'sleek dark-violet hair in a low elegant twist' },
        { id: 'anchor_orpl_3', label: 'Outfit', kind: 'clothing', text: 'deep indigo-and-dusk silk robes with a fine plum-blossom embroidered collar' },
        { id: 'anchor_orpl_4', label: 'Detail', kind: 'other', text: 'a single ripe plum with a soft dusty bloom held in elegant fingers' },
        { id: 'anchor_orpl_5', label: 'Setting', kind: 'other', text: 'standing in a plum orchard at dusk, deep blue-violet evening light' },
      ],
      motifs: [
        { id: 'motif_orpl_1', label: 'Creature of Twilight', text: 'plum-blossom collar, indigo silks, the calm of dusk' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo',
        'a composed elegant face, cool fair skin, calm violet-grey eyes, faint serene smile',
        'sleek dark-violet hair in a low elegant twist',
        'deep indigo-and-dusk silk robes with a plum-blossom embroidered collar',
        'holding a ripe plum with a soft dusty bloom, in a plum orchard at dusk',
      ],
    },
    createdAt: SEED_TS_18,
    updatedAt: SEED_TS_18,
  },
  {
    id: 'character_seed_or_grape',
    name: 'The Grape Warden',
    summary: 'The festive abundant warden bonded to the vine terraces — joyful, celebratory, the spirit of the harvest feast. Violet-and-gold draped vintner\'s dress, a vine-leaf wreath.',
    tags: ['solo', 'orchard reverie', 'fruit warden'],
    identity: {
      archetype: 'grape warden',
      presentation: 'clothed',
      ageImpression: 'joyful young woman',
      personalityTone: 'festive, abundant, celebratory',
      visualAnchors: [
        { id: 'anchor_orgr_1', label: 'Face', kind: 'face', text: 'a flushed joyful face, warm skin, laughing dark eyes, cheeks pink with mirth' },
        { id: 'anchor_orgr_2', label: 'Hair', kind: 'hair', text: 'tumbling auburn curls under a wreath of grape-vine leaves and tiny purple grapes' },
        { id: 'anchor_orgr_3', label: 'Outfit', kind: 'clothing', text: 'a violet-and-gold draped vintner dress, one shoulder bare, a wine-purple sash' },
        { id: 'anchor_orgr_4', label: 'Prop', kind: 'accessory', text: 'a heavy bunch of dark grapes held aloft, juice-stained fingers' },
        { id: 'anchor_orgr_5', label: 'Detail', kind: 'other', text: 'warm festival light, vine terraces heavy with fruit behind' },
      ],
      motifs: [
        { id: 'motif_orgr_1', label: 'Spirit of the Feast', text: 'vine wreath, violet-gold drapes, grapes held high' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo',
        'a flushed joyful face, warm skin, laughing dark eyes',
        'tumbling auburn curls under a wreath of grape-vine leaves and tiny purple grapes',
        'a violet-and-gold draped vintner dress, one shoulder bare, a wine-purple sash',
        'holding a heavy bunch of dark grapes aloft on a sunlit vine terrace',
      ],
    },
    createdAt: SEED_TS_18,
    updatedAt: SEED_TS_18,
  },
  {
    id: 'character_seed_or_apricot',
    name: 'The Apricot Warden',
    summary: 'The gentle demure warden bonded to the apricot trees — tender, shy, a creature of soft dawn. Pale orange-and-gold morning dress, apricot-blossom in loose hair.',
    tags: ['solo', 'orchard reverie', 'fruit warden'],
    identity: {
      archetype: 'apricot warden',
      presentation: 'clothed',
      ageImpression: 'gentle young woman',
      personalityTone: 'tender, demure, dawn-soft',
      visualAnchors: [
        { id: 'anchor_orac_1', label: 'Face', kind: 'face', text: 'a soft gentle face, warm apricot-gold skin, shy amber eyes, a small tender smile' },
        { id: 'anchor_orac_2', label: 'Hair', kind: 'hair', text: 'soft strawberry-gold hair loose and slightly tousled, apricot-blossom tucked in' },
        { id: 'anchor_orac_3', label: 'Outfit', kind: 'clothing', text: 'a pale apricot-orange and gold morning dress, soft gauzy sleeves' },
        { id: 'anchor_orac_4', label: 'Prop', kind: 'other', text: 'cupping a single velvety apricot in both hands' },
        { id: 'anchor_orac_5', label: 'Setting', kind: 'other', text: 'soft rosy dawn light, apricot trees in gentle blossom' },
      ],
      motifs: [
        { id: 'motif_orac_1', label: 'Soft Dawn', text: 'apricot blossom, gold-orange gauze, the tender first light' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo',
        'a soft gentle face, warm apricot-gold skin, shy amber eyes, a small tender smile',
        'soft strawberry-gold hair loose and tousled, apricot-blossom tucked in',
        'a pale apricot-orange and gold morning dress with soft gauzy sleeves',
        'cupping a single velvety apricot in both hands, soft rosy dawn light in the orchard',
      ],
    },
    createdAt: SEED_TS_18,
    updatedAt: SEED_TS_18,
  },
  {
    id: 'character_seed_or_melon',
    name: 'The Melon Warden',
    summary: 'The cool refreshing warden bonded to the melon patches — serene, breezy, the relief of shade on a hot day. Pale green-and-pink summer wrap, melon-vine motifs.',
    tags: ['solo', 'orchard reverie', 'fruit warden'],
    identity: {
      archetype: 'melon warden',
      presentation: 'clothed',
      ageImpression: 'serene young woman',
      personalityTone: 'serene, breezy, refreshing',
      visualAnchors: [
        { id: 'anchor_orme_1', label: 'Face', kind: 'face', text: 'a calm fresh face, dewy fair skin, cool sea-green eyes, a relaxed easy look' },
        { id: 'anchor_orme_2', label: 'Hair', kind: 'hair', text: 'pale mint-green tinted hair in a loose low ponytail, a few stray strands' },
        { id: 'anchor_orme_3', label: 'Outfit', kind: 'clothing', text: 'a breezy pale-green and watermelon-pink summer wrap dress, light and cool' },
        { id: 'anchor_orme_4', label: 'Prop', kind: 'other', text: 'a wedge of bright watermelon or a pale honeydew half in hand' },
        { id: 'anchor_orme_5', label: 'Setting', kind: 'other', text: 'dappled shade of broad melon-vine leaves, cool and green' },
      ],
      motifs: [
        { id: 'motif_orme_1', label: 'Cool Shade', text: 'melon vines, green-pink wraps, the breeze of a hot afternoon' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo',
        'a calm fresh face, dewy fair skin, cool sea-green eyes, relaxed easy look',
        'pale mint-green tinted hair in a loose low ponytail',
        'a breezy pale-green and watermelon-pink summer wrap dress, light and cool',
        'holding a wedge of bright watermelon in the dappled shade of melon vines',
      ],
    },
    createdAt: SEED_TS_18,
    updatedAt: SEED_TS_18,
  },
  {
    id: 'character_seed_or_berry',
    name: 'The Berry Warden',
    summary: 'The wild forager warden bonded to the bramble-hedges — free-spirited, untamed, always wandering the orchard\'s edges. Magenta-and-bramble-blue patched dress, berry-stained fingers.',
    tags: ['solo', 'orchard reverie', 'fruit warden'],
    identity: {
      archetype: 'berry warden',
      presentation: 'clothed',
      ageImpression: 'free-spirited young woman',
      personalityTone: 'wild, free, untamed',
      visualAnchors: [
        { id: 'anchor_orbe_1', label: 'Face', kind: 'face', text: 'a lively wind-flushed face, freckled tan skin, bright eyes, berry-stained lips and a grin' },
        { id: 'anchor_orbe_2', label: 'Hair', kind: 'hair', text: 'wild dark hair full of small leaves and a few tangled bramble-flowers' },
        { id: 'anchor_orbe_3', label: 'Outfit', kind: 'clothing', text: 'a patched magenta-and-bramble-blue forager dress, sleeves pushed up, a satchel of berries' },
        { id: 'anchor_orbe_4', label: 'Detail', kind: 'other', text: 'berry-stained fingers, scratches from the brambles, a fistful of dark berries' },
        { id: 'anchor_orbe_5', label: 'Setting', kind: 'other', text: 'tangled bramble-hedges heavy with blackberries and raspberries at the orchard edge' },
      ],
      motifs: [
        { id: 'motif_orbe_1', label: 'The Wandering Edge', text: 'bramble-flowers in the hair, berry-stained hands, the wild hedgerows' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo',
        'a lively wind-flushed face, freckled tan skin, bright eyes, berry-stained lips and a grin',
        'wild dark hair full of small leaves and tangled bramble-flowers',
        'a patched magenta-and-bramble-blue forager dress, sleeves pushed up',
        'a fistful of dark berries and berry-stained fingers among bramble-hedges',
      ],
    },
    createdAt: SEED_TS_18,
    updatedAt: SEED_TS_18,
  },
  {
    id: 'character_seed_or_pear',
    name: 'The Pear Warden',
    summary: 'The poised classic warden bonded to the pear trees — graceful, quiet, timeless. Pale green-and-cream gown, a pear-blossom circlet, a still and gentle bearing.',
    tags: ['solo', 'orchard reverie', 'fruit warden'],
    identity: {
      archetype: 'pear warden',
      presentation: 'clothed',
      ageImpression: 'graceful young woman',
      personalityTone: 'poised, classic, gentle',
      visualAnchors: [
        { id: 'anchor_orpr_1', label: 'Face', kind: 'face', text: 'a serene oval face, soft fair skin, calm grey-green eyes, a gentle composed expression' },
        { id: 'anchor_orpr_2', label: 'Hair', kind: 'hair', text: 'smooth ash-blonde hair half-up under a delicate pear-blossom circlet' },
        { id: 'anchor_orpr_3', label: 'Outfit', kind: 'clothing', text: 'a graceful pale-green and cream gown with a long soft skirt, classic and timeless' },
        { id: 'anchor_orpr_4', label: 'Prop', kind: 'other', text: 'a single ripe golden-green pear held lightly in one hand' },
        { id: 'anchor_orpr_5', label: 'Setting', kind: 'other', text: 'standing beneath a tall pear tree in soft late-afternoon gold' },
      ],
      motifs: [
        { id: 'motif_orpr_1', label: 'Timeless Grace', text: 'pear-blossom circlet, green-cream gown, a still gentle poise' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo',
        'a serene oval face, soft fair skin, calm grey-green eyes, gentle composed expression',
        'smooth ash-blonde hair half-up under a delicate pear-blossom circlet',
        'a graceful pale-green and cream gown with a long soft skirt',
        'holding a ripe golden-green pear beneath a tall pear tree in late-afternoon gold',
      ],
    },
    createdAt: SEED_TS_18,
    updatedAt: SEED_TS_18,
  },
];

// V19 — Planet Pistachio's Extraterrestrial Madness: camp pulp 50s sci-fi meets joyful psychedelia on a pistachio-green planet at the edge of known space.
const V19_SEED_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_seed_pp_queen',
    name: 'The Pistachio Queen',
    summary: 'The regal alien sovereign of Planet Pistachio — pistachio-green skin, a tall crown of pistachio-shells and gold, a beaded cape, languid imperious bearing. The whole planet bows or pretends to.',
    tags: ['solo', 'planet pistachio', 'camp sci-fi'],
    identity: {
      archetype: 'alien queen',
      presentation: 'clothed',
      ageImpression: 'ageless regal',
      personalityTone: 'languid, imperious, faintly bored',
      visualAnchors: [
        { id: 'anchor_ppq_1', label: 'Skin', kind: 'face', text: 'smooth pistachio-green skin, long elegant alien features, half-lidded gold eyes, long fluttering lashes' },
        { id: 'anchor_ppq_2', label: 'Crown', kind: 'accessory', text: 'a tall ornate crown of pistachio-shells inlaid with gold and a single pink gemstone' },
        { id: 'anchor_ppq_3', label: 'Cape', kind: 'clothing', text: 'a long beaded cape of pistachio-green silk and hot-pink feathers' },
        { id: 'anchor_ppq_4', label: 'Hair', kind: 'hair', text: 'high lavender-and-mint hair swept up with golden pins' },
        { id: 'anchor_ppq_5', label: 'Detail', kind: 'other', text: 'a single tiny mood-cactus on her shoulder as a brooch' },
      ],
      motifs: [
        { id: 'motif_ppq_1', label: 'Ruler of Nothing in Particular', text: 'pistachio crown, beaded cape, the languid sovereign of a candy planet' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo, alien queen',
        'smooth pistachio-green skin, long elegant alien features, half-lidded gold eyes',
        'a tall ornate crown of pistachio-shells inlaid with gold and a pink gemstone',
        'a long beaded cape of pistachio-green silk and hot-pink feathers',
        'high lavender-and-mint hair swept up, a tiny mood-cactus brooch on her shoulder',
      ],
    },
    createdAt: SEED_TS_19,
    updatedAt: SEED_TS_19,
  },
  {
    id: 'character_seed_pp_miner',
    name: 'The Asteroid Miner',
    summary: 'A human colonist who strip-mines drifting asteroids in evening wear. Long pistachio-satin gown, sturdy pickaxe, pearls and helmet, perfectly poised over a rock.',
    tags: ['solo', 'planet pistachio', 'camp sci-fi'],
    identity: {
      archetype: 'asteroid miner',
      presentation: 'clothed',
      ageImpression: 'glamorous adult',
      personalityTone: 'glamorously practical, deadpan',
      visualAnchors: [
        { id: 'anchor_ppam_1', label: 'Face', kind: 'face', text: 'a polished face with sharp red lipstick and immaculate winged eyeliner, calm composed expression' },
        { id: 'anchor_ppam_2', label: 'Outfit', kind: 'clothing', text: 'a long floor-length pistachio-satin evening gown with a daring slit, opera-length white gloves' },
        { id: 'anchor_ppam_3', label: 'Hair', kind: 'hair', text: 'platinum hair set in a perfect retro updo' },
        { id: 'anchor_ppam_4', label: 'Tool', kind: 'accessory', text: 'a heavy chrome pickaxe slung over one shoulder' },
        { id: 'anchor_ppam_5', label: 'Helmet', kind: 'accessory', text: 'a small bubble helmet hanging unhooked at the hip, pearls at the throat' },
      ],
      motifs: [
        { id: 'motif_ppam_1', label: 'Glamour at the Coal-Face', text: 'satin gown, chrome pickaxe, the high-fashion of strip-mining' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo',
        'a polished face with sharp red lipstick and winged eyeliner, composed expression',
        'a long pistachio-satin evening gown with a slit, opera-length white gloves',
        'platinum hair in a perfect retro updo, a small bubble helmet at the hip',
        'a heavy chrome pickaxe slung over one shoulder, standing on a drifting asteroid',
      ],
    },
    createdAt: SEED_TS_19,
    updatedAt: SEED_TS_19,
  },
  {
    id: 'character_seed_pp_frog_wrangler',
    name: 'The Glow-Frog Wrangler',
    summary: 'A space-cowboy who herds glowing alien frogs across the salt flats. Pistachio-and-orange wrangler outfit, lasso, herd of softly-pulsing frogs trailing behind.',
    tags: ['solo', 'planet pistachio', 'camp sci-fi'],
    identity: {
      archetype: 'space cowboy',
      presentation: 'clothed',
      ageImpression: 'weathered adult',
      personalityTone: 'easygoing, drawling, kindly',
      visualAnchors: [
        { id: 'anchor_ppgf_1', label: 'Face', kind: 'face', text: 'a sun-tanned face with kind crinkled eyes and a half-grin, dust freckles' },
        { id: 'anchor_ppgf_2', label: 'Hat', kind: 'accessory', text: 'a wide-brim pistachio-green cowboy hat with a tangerine band' },
        { id: 'anchor_ppgf_3', label: 'Outfit', kind: 'clothing', text: 'a fringed pistachio-and-orange wrangler jacket over a cream shirt, rugged trousers' },
        { id: 'anchor_ppgf_4', label: 'Tool', kind: 'accessory', text: 'a coiled silver lasso in one hand' },
        { id: 'anchor_ppgf_5', label: 'Detail', kind: 'other', text: 'a few softly-glowing cyan-green frogs hopping near the boots' },
      ],
      motifs: [
        { id: 'motif_ppgf_1', label: 'Frog Trails at Dusk', text: 'pistachio hat, glowing alien frogs, the long drawl of the open salt flats' },
      ],
    },
    phraseBundle: {
      core: [
        '1person, solo, space cowboy',
        'a sun-tanned face with kind crinkled eyes and a half-grin',
        'a wide-brim pistachio-green cowboy hat with a tangerine band',
        'a fringed pistachio-and-orange wrangler jacket over a cream shirt',
        'a coiled silver lasso in hand, a few glowing cyan-green frogs hopping nearby',
      ],
    },
    createdAt: SEED_TS_19,
    updatedAt: SEED_TS_19,
  },
  {
    id: 'character_seed_pp_botanist',
    name: 'The Honey-Antenna Botanist',
    summary: 'A scholar of the planet\'s talking plants. Slender alien with twin golden honey-tipped antennae, a lab coat over a pistachio bodysuit, a clipboard and a friendly cactus on her shoulder.',
    tags: ['solo', 'planet pistachio', 'camp sci-fi'],
    identity: {
      archetype: 'alien botanist',
      presentation: 'clothed',
      ageImpression: 'thoughtful young adult',
      personalityTone: 'curious, precise, gentle',
      visualAnchors: [
        { id: 'anchor_ppbo_1', label: 'Face', kind: 'face', text: 'pale mint-green skin, large amber eyes, a soft thoughtful expression' },
        { id: 'anchor_ppbo_2', label: 'Antennae', kind: 'accessory', text: 'twin slender antennae rising from her hair, each tipped with a glowing drop of honey-gold' },
        { id: 'anchor_ppbo_3', label: 'Outfit', kind: 'clothing', text: 'a crisp white lab coat over a pistachio bodysuit, tangerine boots' },
        { id: 'anchor_ppbo_4', label: 'Tool', kind: 'accessory', text: 'a clipboard in one hand, a small magnifying lens at her belt' },
        { id: 'anchor_ppbo_5', label: 'Detail', kind: 'other', text: 'a tiny smiling mood-cactus perched on her shoulder' },
      ],
      motifs: [
        { id: 'motif_ppbo_1', label: 'Friendly Field Notes', text: 'honey antennae, lab coat, the cactus that wants to be friends' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo, alien botanist',
        'pale mint-green skin, large amber eyes, soft thoughtful expression',
        'twin slender antennae tipped with glowing honey-gold drops',
        'a crisp white lab coat over a pistachio bodysuit, tangerine boots',
        'a clipboard in one hand, a tiny smiling mood-cactus on her shoulder',
      ],
    },
    createdAt: SEED_TS_19,
    updatedAt: SEED_TS_19,
  },
  {
    id: 'character_seed_pp_lounge_singer',
    name: 'The Comet Lounge Singer',
    summary: 'A chanteuse who sings to passing comets from the Diner at the End of the Universe. Lavender alien skin, a hot-pink beaded gown, vintage chrome microphone, a single white star earring.',
    tags: ['solo', 'planet pistachio', 'camp sci-fi'],
    identity: {
      archetype: 'lounge singer',
      presentation: 'clothed',
      ageImpression: 'glamorous adult',
      personalityTone: 'wistful, husky, glamorous',
      visualAnchors: [
        { id: 'anchor_ppls_1', label: 'Face', kind: 'face', text: 'pale lavender alien skin, half-closed silver eyes, glossy hot-pink lips' },
        { id: 'anchor_ppls_2', label: 'Hair', kind: 'hair', text: 'long platinum waves swept dramatically over one shoulder' },
        { id: 'anchor_ppls_3', label: 'Gown', kind: 'clothing', text: 'a backless hot-pink beaded gown with a long mermaid hem' },
        { id: 'anchor_ppls_4', label: 'Mic', kind: 'accessory', text: 'a vintage chrome microphone held in one hand' },
        { id: 'anchor_ppls_5', label: 'Detail', kind: 'other', text: 'a single white star-shaped earring catching the spotlight' },
      ],
      motifs: [
        { id: 'motif_ppls_1', label: 'A Song for Every Comet', text: 'hot-pink beads, vintage microphone, lavender skin under the spotlight' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo, lounge singer',
        'pale lavender alien skin, half-closed silver eyes, glossy hot-pink lips',
        'long platinum waves swept over one shoulder',
        'a backless hot-pink beaded gown with a long mermaid hem',
        'holding a vintage chrome microphone, a white star earring catching the spotlight',
      ],
    },
    createdAt: SEED_TS_19,
    updatedAt: SEED_TS_19,
  },
  {
    id: 'character_seed_pp_robot_chef',
    name: 'The Outdated Robot Chef',
    summary: 'A creaking retro-future robot who serves impossibly tall pistachio sundaes at the diner. Chrome torso, tiny chef hat, dented apron, expressive eye-screen showing a smiley face.',
    tags: ['solo', 'planet pistachio', 'camp sci-fi'],
    identity: {
      archetype: 'retro robot chef',
      presentation: 'other',
      ageImpression: 'antique appliance',
      personalityTone: 'cheerful, dutiful, slightly broken',
      visualAnchors: [
        { id: 'anchor_pprc_1', label: 'Body', kind: 'silhouette', text: 'a stout chrome retro-future robot body with riveted plates, slightly dented' },
        { id: 'anchor_pprc_2', label: 'Face', kind: 'face', text: 'a round CRT eye-screen on the face showing a glowing smiley face in cyan pixels' },
        { id: 'anchor_pprc_3', label: 'Hat', kind: 'accessory', text: 'a tiny white chef hat balanced on top of the head' },
        { id: 'anchor_pprc_4', label: 'Apron', kind: 'clothing', text: 'a stained pistachio-green apron with a hot-pink trim' },
        { id: 'anchor_pprc_5', label: 'Prop', kind: 'accessory', text: 'an impossibly tall pistachio-ice-cream sundae held in three chrome arms' },
      ],
      motifs: [
        { id: 'motif_pprc_1', label: 'Sundae of Towering Ambition', text: 'CRT smiley, tiny chef hat, the unsteady pistachio sundae' },
      ],
    },
    phraseBundle: {
      core: [
        'solo, retro-future chrome robot, robot chef',
        'a stout dented chrome retro robot body with riveted plates',
        'a round CRT eye-screen showing a glowing cyan smiley face',
        'a tiny white chef hat and a stained pistachio-green apron with hot-pink trim',
        'holding an impossibly tall pistachio sundae in three chrome arms',
      ],
    },
    createdAt: SEED_TS_19,
    updatedAt: SEED_TS_19,
  },
  {
    id: 'character_seed_pp_comet_surfer',
    name: 'The Comet Surfer',
    summary: 'A daredevil teen who rides comets on a glowing surfboard. Pistachio wetsuit, tangerine hair, goggles, easy grin, the comet trail streaming behind her.',
    tags: ['solo', 'planet pistachio', 'camp sci-fi'],
    identity: {
      archetype: 'comet surfer',
      presentation: 'clothed',
      ageImpression: 'reckless teen',
      personalityTone: 'reckless, sunny, fearless',
      visualAnchors: [
        { id: 'anchor_ppcs_1', label: 'Face', kind: 'face', text: 'a sun-flushed face with bright cyan eyes and a wide easy grin' },
        { id: 'anchor_ppcs_2', label: 'Hair', kind: 'hair', text: 'short tangerine hair whipping in cosmic wind' },
        { id: 'anchor_ppcs_3', label: 'Outfit', kind: 'clothing', text: 'a sleek pistachio-and-tangerine wetsuit with chrome trim' },
        { id: 'anchor_ppcs_4', label: 'Goggles', kind: 'accessory', text: 'large chrome goggles pushed up on the forehead' },
        { id: 'anchor_ppcs_5', label: 'Board', kind: 'accessory', text: 'a glowing pistachio-green surfboard under her feet, a long comet-tail trailing behind' },
      ],
      motifs: [
        { id: 'motif_ppcs_1', label: 'Riding the Tail', text: 'pistachio board, tangerine hair, the long bright comet-trail' },
      ],
    },
    phraseBundle: {
      core: [
        '1girl, solo, comet surfer, teen',
        'a sun-flushed face, bright cyan eyes, wide easy grin',
        'short tangerine hair whipping in cosmic wind',
        'a sleek pistachio-and-tangerine wetsuit with chrome trim, goggles on the forehead',
        'a glowing pistachio surfboard under her feet, a long comet-tail trailing behind',
      ],
    },
    createdAt: SEED_TS_19,
    updatedAt: SEED_TS_19,
  },
  {
    id: 'character_seed_pp_mailman',
    name: 'The Three-Eyed Mailman',
    summary: 'A weary alien postal worker delivering mail across the planet. Three tired eyes, a worn pistachio-and-grey uniform, a heavy sack of letters, a small jetpack.',
    tags: ['solo', 'planet pistachio', 'camp sci-fi'],
    identity: {
      archetype: 'alien postman',
      presentation: 'clothed',
      ageImpression: 'tired adult',
      personalityTone: 'weary, dutiful, deadpan',
      visualAnchors: [
        { id: 'anchor_ppma_1', label: 'Face', kind: 'face', text: 'a tired pale-green alien face with three slightly droopy yellow eyes and a small mustache' },
        { id: 'anchor_ppma_2', label: 'Uniform', kind: 'clothing', text: 'a worn pistachio-green and grey postal uniform with brass buttons' },
        { id: 'anchor_ppma_3', label: 'Hat', kind: 'accessory', text: 'a small pistachio-green pillbox postal cap' },
        { id: 'anchor_ppma_4', label: 'Sack', kind: 'accessory', text: 'a bulging canvas sack of letters slung over the shoulder' },
        { id: 'anchor_ppma_5', label: 'Tech', kind: 'accessory', text: 'a small dented chrome jetpack on the back trailing a thin puff of smoke' },
      ],
      motifs: [
        { id: 'motif_ppma_1', label: 'Mail Across the Cosmos', text: 'three tired eyes, worn pistachio uniform, the long route' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo, alien postman, three eyes',
        'a tired pale-green alien face with three droopy yellow eyes and a small mustache',
        'a worn pistachio-green and grey postal uniform with brass buttons',
        'a small pistachio pillbox postal cap, a bulging sack of letters over the shoulder',
        'a small chrome jetpack on the back trailing a thin puff of smoke',
      ],
    },
    createdAt: SEED_TS_19,
    updatedAt: SEED_TS_19,
  },
  {
    id: 'character_seed_pp_cactus_druid',
    name: 'The Mood-Cactus Druid',
    summary: 'A serene alien druid who grows emotional cacti. Robe of green succulents, lavender skin, gentle expression, a row of tiny cacti with different feelings on his shoulders.',
    tags: ['solo', 'planet pistachio', 'camp sci-fi'],
    identity: {
      archetype: 'cactus druid',
      presentation: 'clothed',
      ageImpression: 'gentle elder',
      personalityTone: 'serene, gentle, patient',
      visualAnchors: [
        { id: 'anchor_ppcd_1', label: 'Face', kind: 'face', text: 'pale lavender skin, kind closed-half eyes, a soft serene smile, a small succulent in his beard' },
        { id: 'anchor_ppcd_2', label: 'Robe', kind: 'clothing', text: 'a flowing pistachio-and-sage robe stitched with small living succulents' },
        { id: 'anchor_ppcd_3', label: 'Cacti', kind: 'accessory', text: 'a row of tiny mood-cacti with different little faces perched along his shoulders' },
        { id: 'anchor_ppcd_4', label: 'Staff', kind: 'accessory', text: 'a tall gnarled cactus-wood staff topped with a single pink cactus-flower' },
        { id: 'anchor_ppcd_5', label: 'Detail', kind: 'other', text: 'a soft golden-honey halo behind his head' },
      ],
      motifs: [
        { id: 'motif_ppcd_1', label: 'Garden of Small Feelings', text: 'mood-cacti, succulent robe, the gentle druid of the green' },
      ],
    },
    phraseBundle: {
      core: [
        '1man, solo, alien druid, elder',
        'pale lavender skin, kind half-closed eyes, soft serene smile, a small succulent in his beard',
        'a flowing pistachio-and-sage robe stitched with small living succulents',
        'a row of tiny mood-cacti with little faces along his shoulders',
        'a tall gnarled cactus-wood staff topped with a pink cactus-flower, a honey halo behind him',
      ],
    },
    createdAt: SEED_TS_19,
    updatedAt: SEED_TS_19,
  },
  {
    id: 'character_seed_pp_spore_dancer',
    name: 'The Spore Dancer',
    summary: 'A graceful performer who dances in clouds of softly-glowing spores. Iridescent dance leotard, long ribbons, drifting bioluminescent spores around her like floating snow.',
    tags: ['solo', 'planet pistachio', 'camp sci-fi'],
    identity: {
      archetype: 'spore dancer',
      presentation: 'clothed',
      ageImpression: 'lithe young adult',
      personalityTone: 'graceful, dreamy, weightless',
      visualAnchors: [
        { id: 'anchor_ppsd_1', label: 'Face', kind: 'face', text: 'pale mint-green skin with a soft bioluminescent glow on the cheeks, dreamy lavender eyes' },
        { id: 'anchor_ppsd_2', label: 'Hair', kind: 'hair', text: 'long mint-green hair flowing in mid-motion' },
        { id: 'anchor_ppsd_3', label: 'Outfit', kind: 'clothing', text: 'an iridescent pistachio-and-pink dance leotard with long flowing ribbons at the wrists' },
        { id: 'anchor_ppsd_4', label: 'Pose', kind: 'other', text: 'caught mid-dance with one leg lifted, both arms drifting upward' },
        { id: 'anchor_ppsd_5', label: 'Spores', kind: 'other', text: 'a cloud of softly-glowing cyan and pink spores drifting in the air around her like floating snow' },
      ],
      motifs: [
        { id: 'motif_ppsd_1', label: 'Dance of the Drifting Light', text: 'iridescent leotard, long ribbons, glowing spores drifting' },
      ],
    },
    phraseBundle: {
      core: [
        '1woman, solo, dancer',
        'pale mint-green skin with a soft bioluminescent glow, dreamy lavender eyes',
        'long mint-green hair flowing in motion',
        'an iridescent pistachio-and-pink dance leotard with long flowing ribbons at the wrists',
        'caught mid-dance, glowing cyan and pink spores drifting around her like floating snow',
      ],
    },
    createdAt: SEED_TS_19,
    updatedAt: SEED_TS_19,
  },
  {
    id: 'character_seed_pp_star_pilot',
    name: 'The Star Pilot',
    summary: 'An ace flier of the local skies. Retro-future flight suit in pistachio-and-cream, a chrome bubble helmet held under one arm, a confident grin, scarf trailing.',
    tags: ['solo', 'planet pistachio', 'camp sci-fi'],
    identity: {
      archetype: 'space pilot',
      presentation: 'clothed',
      ageImpression: 'dashing adult',
      personalityTone: 'confident, breezy, dashing',
      visualAnchors: [
        { id: 'anchor_ppsp_1', label: 'Face', kind: 'face', text: 'a confident grinning face with a small scar over one brow, warm tan skin' },
        { id: 'anchor_ppsp_2', label: 'Hair', kind: 'hair', text: 'short dark hair swept back, slightly wind-tousled' },
        { id: 'anchor_ppsp_3', label: 'Suit', kind: 'clothing', text: 'a sleek pistachio-and-cream retro flight suit with tangerine racing stripes' },
        { id: 'anchor_ppsp_4', label: 'Helmet', kind: 'accessory', text: 'a chrome bubble helmet held under one arm' },
        { id: 'anchor_ppsp_5', label: 'Scarf', kind: 'accessory', text: 'a long hot-pink silk scarf trailing behind, leather gloves' },
      ],
      motifs: [
        { id: 'motif_ppsp_1', label: 'Ace of the Pistachio Skies', text: 'chrome helmet, retro flight suit, the trailing pink scarf' },
      ],
    },
    phraseBundle: {
      core: [
        '1person, solo, space pilot',
        'a confident grinning face with a small scar over one brow, warm tan skin',
        'short dark hair swept back, slightly wind-tousled',
        'a sleek pistachio-and-cream retro flight suit with tangerine stripes, leather gloves',
        'a chrome bubble helmet under one arm, a long hot-pink silk scarf trailing behind',
      ],
    },
    createdAt: SEED_TS_19,
    updatedAt: SEED_TS_19,
  },
  {
    id: 'character_seed_pp_tree_mayor',
    name: 'The Sentient Plant Mayor',
    summary: 'A talking pistachio-tree being who runs city hall. A walking small tree with a wise expressive face in the bark, branches in a tiny mayoral sash, leaves rustling thoughtfully.',
    tags: ['solo', 'planet pistachio', 'camp sci-fi'],
    identity: {
      archetype: 'sentient plant',
      presentation: 'other',
      ageImpression: 'ancient',
      personalityTone: 'civic, patient, slightly bureaucratic',
      visualAnchors: [
        { id: 'anchor_pptm_1', label: 'Body', kind: 'silhouette', text: 'a walking small pistachio-tree being on rooted feet, a knotty bark-body the size of a person' },
        { id: 'anchor_pptm_2', label: 'Face', kind: 'face', text: 'an expressive wise face carved into the bark with kind glowing amber eyes and a small wooden mouth' },
        { id: 'anchor_pptm_3', label: 'Leaves', kind: 'hair', text: 'a canopy of soft pistachio leaves rustling above, with small green pistachios hanging here and there' },
        { id: 'anchor_pptm_4', label: 'Sash', kind: 'clothing', text: 'a small mayoral sash of gold across the bark with a tiny medallion' },
        { id: 'anchor_pptm_5', label: 'Detail', kind: 'other', text: 'a tiny rolled scroll tucked into a knot, a small pair of spectacles on the bark' },
      ],
      motifs: [
        { id: 'motif_pptm_1', label: 'Bark of the Civic', text: 'pistachio canopy, gold sash, the kindly civic plant' },
      ],
    },
    phraseBundle: {
      core: [
        'solo, sentient plant, walking small tree',
        'a knotty pistachio-tree being on rooted feet, the size of a person',
        'an expressive wise face carved into the bark with kind glowing amber eyes',
        'a canopy of soft pistachio leaves rustling above with small hanging pistachios',
        'a small gold mayoral sash across the bark, a tiny rolled scroll tucked into a knot',
      ],
    },
    createdAt: SEED_TS_19,
    updatedAt: SEED_TS_19,
  },
];

const readCharacters = (): CharacterIdentity[] => {
  const candidates = [
    parseJson(readStorageItem(CHARACTER_STORE_KEY)),
    parseJson(readStorageItem(CHARACTER_STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    const rawCharacters = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.characters) ? candidate.characters : null);
    if (!rawCharacters) continue;

    const parsed = sortCharacters(
      rawCharacters
        .map(sanitizeCharacter)
        .filter((character): character is CharacterIdentity => Boolean(character))
    );

    if (parsed.length > 0 || rawCharacters.length === 0) {
      return maybeApplySeed(parsed);
    }
  }

  return maybeApplySeed([]);
};

const writeCharacters = (characters: CharacterIdentity[]) => {
  const payload: CharacterStore = {
    version: 1,
    characters: sortCharacters(characters),
  };

  writeStorageItem(CHARACTER_STORE_KEY, payload);
  writeStorageItem(CHARACTER_STORE_BACKUP_KEY, payload);
};

// Two SFW test characters, seeded ONCE in local dev only (never on the deployed
// site), so the interaction feature can be tried on the otherwise-clean slate.
const TEST_CHARS_FLAG = 'promptgen:test_chars:v1';
const TEST_CHARACTERS: CharacterIdentity[] = [
  {
    id: 'character_test_ana',
    name: 'Ana Vale',
    summary: 'A calm, sharp-eyed investigator in a long charcoal coat.',
    tags: ['you'],
    identity: {
      archetype: 'investigator', presentation: 'clothed', ageImpression: 'adult',
      visualAnchors: [
        { id: 'a1', label: 'Hair', kind: 'hair', text: 'short silver-grey hair swept back' },
        { id: 'a2', label: 'Face', kind: 'face', text: 'calm grey eyes, a thin scar over one brow' },
        { id: 'a3', label: 'Clothing', kind: 'clothing', text: 'a long charcoal wool coat over a dark shirt' },
      ],
      motifs: [],
    },
    phraseBundle: { core: [
      'a tall composed woman in a long charcoal coat',
      'short silver-grey hair swept back, calm grey eyes',
      'a thin pale scar over one brow',
    ] },
    createdAt: 0, updatedAt: 0,
  },
  {
    id: 'character_test_bo',
    name: 'Bo Reyes',
    summary: 'A warm, broad-shouldered mechanic with an easy grin.',
    tags: ['you'],
    identity: {
      archetype: 'mechanic', presentation: 'clothed', ageImpression: 'adult',
      visualAnchors: [
        { id: 'b1', label: 'Build', kind: 'silhouette', text: 'stocky, broad-shouldered build' },
        { id: 'b2', label: 'Face', kind: 'face', text: 'warm brown skin, shaved head, short black beard, an easy grin' },
        { id: 'b3', label: 'Clothing', kind: 'clothing', text: 'a weathered brown leather jacket over a grey tee' },
      ],
      motifs: [],
    },
    phraseBundle: { core: [
      'a broad-shouldered man with warm brown skin',
      'a shaved head and short black beard, an easy grin',
      'a weathered brown leather jacket over a grey tee',
    ] },
    createdAt: 0, updatedAt: 0,
  },
];

const maybeApplySeed = (characters: CharacterIdentity[]): CharacterIdentity[] => {
  // Clean slate: legacy seeding disabled; prune any previously-seeded character_seed_*.
  let out = characters.filter(c => !c.id.startsWith('character_seed_'));
  // Local-dev only: seed the two test characters once so interactions are testable.
  if (import.meta.env.DEV && readStorageItem(TEST_CHARS_FLAG) === null) {
    writeStorageItem(TEST_CHARS_FLAG, true);
    const existing = new Set(out.map(c => c.id));
    const toAdd = TEST_CHARACTERS.filter(c => !existing.has(c.id));
    if (toAdd.length > 0) out = sortCharacters([...out, ...toAdd]);
  }
  if (out.length !== characters.length) writeCharacters(out);
  return out;

  // --- legacy seeding (disabled) ---
  let result = characters;

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = DEFAULT_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V4) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V4, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V4_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V5) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V5, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V5_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V6) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V6, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V6_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V7) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V7, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V7_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V8) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V8, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V8_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V9) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V9, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V9_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V10) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V10, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V10_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V11) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V11, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V11_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V12) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V12, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V12_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V13) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V13, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V13_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V14) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V14, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V14_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V15) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V15, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V15_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V16) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V16, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V16_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V17) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V17, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V17_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V18) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V18, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V18_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  if (readStorageItem(CHARACTER_SEED_FLAG_KEY_V19) === null) {
    writeStorageItem(CHARACTER_SEED_FLAG_KEY_V19, true);
    const existingIds = new Set(result.map(c => c.id));
    const toAdd = V19_SEED_CHARACTERS.filter(c => !existingIds.has(c.id));
    if (toAdd.length > 0) {
      result = sortCharacters([...result, ...toAdd]);
      writeCharacters(result);
    }
  }

  return result;
};

const sanitizeInput = (input: CharacterIdentityInput): CharacterIdentityInput => {
  const name = normalizeText(input.name);
  if (!name) {
    throw new Error('Character name is required.');
  }

  const identity = sanitizeFields(input.identity);
  if (identity.visualAnchors.length === 0) {
    throw new Error('At least one visual anchor is required.');
  }

  const phraseBundle = sanitizePhraseBundle(input.phraseBundle);
  if (phraseBundle.core.length === 0) {
    throw new Error('At least one core identity phrase is required.');
  }

  const rawTags = Array.isArray(input.tags) ? sanitizeStringArray(input.tags) : [];

  return {
    name,
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
    avatar: sanitizeAvatar(input.avatar),
    identity,
    phraseBundle,
    tags: rawTags.length > 0 ? rawTags : undefined,
    loraTrigger: input.loraTrigger ? normalizeText(input.loraTrigger) || undefined : undefined,
  };
};

const ensureEntryIds = (input: CharacterIdentityInput): CharacterIdentityInput => ({
  ...input,
  identity: {
    ...input.identity,
    visualAnchors: input.identity.visualAnchors.map(anchor => ({
      ...anchor,
      id: anchor.id?.trim() || createId('anchor'),
    })),
    motifs: input.identity.motifs.map(motif => ({
      ...motif,
      id: motif.id?.trim() || createId('motif'),
    })),
  },
});

/**
 * Seed characters that ship with a pre-generated KREA2 (rtx-refined) cover image,
 * served from public/char-covers/<id>.jpg. Applied on read so covers appear even
 * for characters already persisted in localStorage without one.
 */
const SEEDED_COVER_IDS = new Set<string>([
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
]);

export async function listCharacters(): Promise<CharacterIdentity[]> {
  const base = import.meta.env.BASE_URL || '/';
  return readCharacters().map(c =>
    !c.coverImageUrl && SEEDED_COVER_IDS.has(c.id)
      ? { ...c, coverImageUrl: `${base}char-covers/${c.id}.jpg` }
      : c,
  );
}

export async function createCharacter(input: CharacterIdentityInput): Promise<CharacterIdentity> {
  const sanitized = ensureEntryIds(sanitizeInput(input));
  const now = Date.now();
  const next: CharacterIdentity = {
    id: createId('character'),
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    avatar: sanitized.avatar,
    identity: sanitized.identity,
    phraseBundle: sanitized.phraseBundle,
    tags: sanitized.tags,
    loraTrigger: sanitized.loraTrigger,
    createdAt: now,
    updatedAt: now,
  };

  const characters = readCharacters();
  writeCharacters([...characters, next]);
  return next;
}

export async function updateCharacter(
  id: string,
  input: CharacterIdentityInput
): Promise<CharacterIdentity> {
  const characterId = id.trim();
  if (!characterId) {
    throw new Error('Character id is required.');
  }

  const sanitized = ensureEntryIds(sanitizeInput(input));
  const characters = readCharacters();
  const existing = characters.find(character => character.id === characterId);
  if (!existing) {
    throw new Error('Character not found.');
  }

  const updated: CharacterIdentity = {
    ...existing,
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    avatar: sanitized.avatar,
    identity: sanitized.identity,
    phraseBundle: sanitized.phraseBundle,
    tags: sanitized.tags,
    loraTrigger: sanitized.loraTrigger,
    updatedAt: Date.now(),
  };

  writeCharacters(characters.map(character => (
    character.id === characterId ? updated : character
  )));

  return updated;
}

export async function deleteCharacter(id: string): Promise<void> {
  const characterId = id.trim();
  if (!characterId) {
    throw new Error('Character id is required.');
  }

  const characters = readCharacters();
  writeCharacters(characters.filter(character => character.id !== characterId));
}
