import type { OutfitIdentity, OutfitIdentityInput, WardrobeStore } from '../types';

const WARDROBE_STORE_KEY = 'promptgen:wardrobe:v1';
const WARDROBE_STORE_BACKUP_KEY = 'promptgen:wardrobe:backup:v1';
const WARDROBE_SEED_FLAG_KEY = 'promptgen:wardrobe:seeded:v2';

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
