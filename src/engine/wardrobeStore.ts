import type { OutfitIdentity, OutfitIdentityInput, WardrobeStore } from '../types';

const WARDROBE_STORE_KEY = 'promptgen:wardrobe:v1';
const WARDROBE_STORE_BACKUP_KEY = 'promptgen:wardrobe:backup:v1';
const WARDROBE_SEED_FLAG_KEY = 'promptgen:wardrobe:seeded:v3';

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
    // ignore
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const sortOutfits = <T extends OutfitIdentity>(outfits: T[]): T[] =>
  [...outfits].sort((a, b) => {
    if (b.updatedAt !== a.updatedAt) return b.updatedAt - a.updatedAt;
    if (b.createdAt !== a.createdAt) return b.createdAt - a.createdAt;
    return a.name.localeCompare(b.name);
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
    // ignore
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

const sanitizeOutfit = (value: unknown): OutfitIdentity | null => {
  if (!isRecord(value)) return null;
  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const name = typeof value.name === 'string' ? normalizeText(value.name) : '';
  if (!id || !name) return null;
  const phrases = sanitizeStringArray(value.phrases);
  if (phrases.length === 0) return null;
  const createdAt = typeof value.createdAt === 'number' && Number.isFinite(value.createdAt)
    ? value.createdAt : Date.now();
  const updatedAt = typeof value.updatedAt === 'number' && Number.isFinite(value.updatedAt)
    ? value.updatedAt : createdAt;
  return {
    id,
    name,
    summary: typeof value.summary === 'string' ? normalizeText(value.summary) || undefined : undefined,
    coverImageUrl: typeof value.coverImageUrl === 'string' ? value.coverImageUrl.trim() || undefined : undefined,
    phrases,
    createdAt,
    updatedAt,
  };
};

const SEED_TS = 1746748800000;
const SEED_TS_2 = 1746835200000;
const SEED_TS_3 = 1747612800000;

const DEFAULT_SEED_OUTFITS: OutfitIdentity[] = [
  {
    id: 'outfit_seed_traveling_cloak',
    name: 'Traveling Cloak',
    summary: 'Heavy weathered wool, worn for long journeys.',
    phrases: [
      'heavy weathered wool cloak, hood down',
      'leather shoulder clasp and travel-worn boots',
      'cloak hem dusty from long roads',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'outfit_seed_ceremonial_robe',
    name: 'Ceremonial Robe',
    summary: 'Floor-length embroidered silk for formal occasions.',
    phrases: [
      'floor-length embroidered silk robe',
      'wide ceremonial sash, deep crimson and gold',
      'draped sleeves that pool at the wrists',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'outfit_seed_field_gear',
    name: "Cartographer's Field Gear",
    summary: 'Practical working attire for mapping expeditions.',
    phrases: [
      'worn leather vest over loose linen shirt, sleeves rolled up',
      'ink-stained cuffs, tool loops at the belt',
      'sturdy canvas trousers tucked into ankle boots',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'outfit_seed_alchemist_apron',
    name: "Alchemist's Working Apron",
    summary: 'Heavy canvas apron with tool loops, gloves tucked at the belt.',
    phrases: [
      'heavy waxed canvas apron, front-tied',
      'leather gloves tucked at the belt',
      'small vials and pouches clipped to the straps',
      'sleeves pushed high, forearms exposed',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'outfit_seed_linen_house_robe',
    name: 'Loose Linen House Robe',
    summary: 'Soft undyed linen, open collar, ungathered and comfortable.',
    phrases: [
      'loose undyed linen robe, open collar',
      'wide draping sleeves, soft fabric',
      'simple drawstring waist, ungathered',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'outfit_seed_midnight_court_gown',
    name: 'Midnight Court Gown',
    summary: 'Deep indigo silk with silver embroidery, bare shoulders, long trailing skirt.',
    phrases: [
      'deep indigo silk gown, fitted bodice',
      'silver thread embroidery at neckline and cuffs',
      'long trailing skirt with subtle sheen',
      'bare shoulders, structured silhouette',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'outfit_seed_stormcaller_robes',
    name: "Stormcaller's Robes",
    summary: 'Deep blue and silver mage robes with crackling static at the hems and collar.',
    phrases: [
      'deep midnight blue mage robes, wide layered sleeves',
      'silver runic trim at hem and collar, faintly crackling with static',
      'open-chested inner robe, heavy outer layer swept back',
      'bare feet, the hem barely touching the ground',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'outfit_seed_lightning_forged_plate',
    name: 'Lightning-Forged Plate',
    summary: 'Black plate armor with electric blue runes etched across every surface, permanently magnetized by repeated lightning strikes.',
    phrases: [
      'black full plate armor, surface darkened by heat and repeated lightning strikes',
      'electric blue runes etched across every panel, faintly luminous',
      'pauldrons shaped like storm clouds, edges jagged',
      'no visor, the face exposed and calm above the heavy gorget',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'outfit_seed_scale_weave_mantle',
    name: 'Scale-Weave Mantle',
    summary: 'A deep navy mantle woven with iridescent dragon scales, shifting between blue and violet in different light.',
    phrases: [
      'deep navy mantle falling to mid-thigh, hood down',
      'surface woven with iridescent scales, shifting blue to violet',
      'heavy and still, does not move with the wind',
      'simple dark clothing beneath, the mantle the only statement',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'outfit_seed_sapphire_court_dress',
    name: 'Sapphire Court Dress',
    summary: 'A formal gown in deep sapphire silk with silver lightning bolt embroidery down the skirt.',
    phrases: [
      'deep sapphire silk gown, fitted through the waist',
      'silver lightning bolt embroidery running the full length of the skirt',
      'off-shoulder neckline, structured bodice with boning',
      'long trailing hem, no ornamentation except the embroidery',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'outfit_seed_tempest_channeler',
    name: "Tempest Channeler's Vest",
    summary: 'Leather tactical vest with copper conducting rings, built to direct electrical energy through the body safely.',
    phrases: [
      'dark leather tactical vest, close-fitted with multiple buckle closures',
      'copper conducting rings along the spine and forearms',
      'bare arms, the conducting rings continuing to the wrists',
      'worn canvas trousers, heavy boots with copper-tipped soles',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
];

const writeOutfits = (outfits: OutfitIdentity[]) => {
  const payload: WardrobeStore = { version: 1, outfits: sortOutfits(outfits) };
  writeStorageItem(WARDROBE_STORE_KEY, payload);
  writeStorageItem(WARDROBE_STORE_BACKUP_KEY, payload);
};

const maybeApplySeed = (outfits: OutfitIdentity[]): OutfitIdentity[] => {
  if (readStorageItem(WARDROBE_SEED_FLAG_KEY) !== null) return outfits;
  writeStorageItem(WARDROBE_SEED_FLAG_KEY, true);
  const existingIds = new Set(outfits.map(o => o.id));
  const toAdd = DEFAULT_SEED_OUTFITS.filter(o => !existingIds.has(o.id));
  if (toAdd.length === 0) return outfits;
  const merged = sortOutfits([...outfits, ...toAdd]);
  writeOutfits(merged);
  return merged;
};

const readOutfits = (): OutfitIdentity[] => {
  const candidates = [
    parseJson(readStorageItem(WARDROBE_STORE_KEY)),
    parseJson(readStorageItem(WARDROBE_STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const raw = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.outfits) ? candidate.outfits : null);
    if (!raw) continue;
    const parsed = sortOutfits(
      raw.map(sanitizeOutfit).filter((o): o is OutfitIdentity => Boolean(o))
    );
    if (parsed.length > 0 || raw.length === 0) return maybeApplySeed(parsed);
  }

  return maybeApplySeed([]);
};

const sanitizeInput = (input: OutfitIdentityInput): OutfitIdentityInput => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('Outfit name is required.');
  const phrases = sanitizeStringArray(input.phrases);
  if (phrases.length === 0) throw new Error('At least one phrase is required.');
  return {
    name,
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
    phrases,
  };
};

export async function listOutfits(): Promise<OutfitIdentity[]> {
  return readOutfits();
}

export async function createOutfit(input: OutfitIdentityInput): Promise<OutfitIdentity> {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: OutfitIdentity = {
    id: createId('outfit'),
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    phrases: sanitized.phrases,
    createdAt: now,
    updatedAt: now,
  };
  const outfits = readOutfits();
  writeOutfits([...outfits, next]);
  return next;
}

export async function updateOutfit(id: string, input: OutfitIdentityInput): Promise<OutfitIdentity> {
  const outfitId = id.trim();
  if (!outfitId) throw new Error('Outfit id is required.');
  const sanitized = sanitizeInput(input);
  const outfits = readOutfits();
  const existing = outfits.find(o => o.id === outfitId);
  if (!existing) throw new Error('Outfit not found.');
  const updated: OutfitIdentity = {
    ...existing,
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    phrases: sanitized.phrases,
    updatedAt: Date.now(),
  };
  writeOutfits(outfits.map(o => (o.id === outfitId ? updated : o)));
  return updated;
}

export async function deleteOutfit(id: string): Promise<void> {
  const outfitId = id.trim();
  if (!outfitId) throw new Error('Outfit id is required.');
  const outfits = readOutfits();
  writeOutfits(outfits.filter(o => o.id !== outfitId));
}
