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
