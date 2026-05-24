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

const maybeApplySeed = (characters: CharacterIdentity[]): CharacterIdentity[] => {
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

export async function listCharacters(): Promise<CharacterIdentity[]> {
  return readCharacters();
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
