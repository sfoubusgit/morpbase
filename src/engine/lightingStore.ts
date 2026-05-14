import type { LightingSetup, LightingSetupInput, LightingStore } from '../types';

const LIGHTING_STORE_KEY = 'promptgen:lightings:v1';
const LIGHTING_STORE_BACKUP_KEY = 'promptgen:lightings:backup:v1';
const LIGHTING_SEED_FLAG_KEY = 'promptgen:lightings:seeded:v2';
const LIGHTING_SEED_FLAG_KEY_V3 = 'promptgen:lightings:seeded:v3';
const LIGHTING_SEED_FLAG_KEY_V4 = 'promptgen:lightings:seeded:v4';

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

const sortItems = <T extends LightingSetup>(items: T[]): T[] =>
  [...items].sort((a, b) => {
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

const sanitizeItem = (value: unknown): LightingSetup | null => {
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

const SEED_TS = 1746921600000;
const SEED_TS_2 = 1747008000000;
const SEED_TS_3 = 1747612800000;
const SEED_TS_4 = 1748304000000;

const V4_SEED_LIGHTINGS: LightingSetup[] = [
  {
    id: 'lighting_aiw_wonderland_sourceless',
    name: 'Wonderland Sourceless Light',
    summary: 'Even, directionless illumination with no identifiable origin — everything visible, nothing casting a shadow, the light present like weather.',
    phrases: [
      'even directionless illumination, no identifiable source, no cast shadows anywhere',
      'every surface equally lit from all angles simultaneously',
      'the light present like weather — ambient, total, and without explanation',
      'no highlights, no shadow pools — only the flat completeness of a world that forgot to have a sun',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
  {
    id: 'lighting_aiw_phosphorescent_undergrowth',
    name: 'Phosphorescent Undergrowth',
    summary: 'Cold soft glow rising from below — mushrooms and roots emitting their own pale light, blue-green and sourceless, the forest floor brighter than the canopy.',
    phrases: [
      'cold soft phosphorescent glow rising from the ground level — mushrooms and root networks emitting pale blue-green light',
      'the forest floor brighter than the canopy above, light direction inverted',
      'faces lit from below by diffuse bioluminescent fill, no warmth anywhere in the spectrum',
      'shadows pointing upward, canopy dark, the underground the source of all visible light',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
  {
    id: 'lighting_aiw_court_candlelight',
    name: 'Court Candlelight',
    summary: 'Dense warm candlelight from the throne end — hundreds of small sources pooling into a single amber direction, deep shadow behind.',
    phrases: [
      'dense warm candlelight from the throne end of the room — hundreds of small sources combining into one amber direction',
      'warm gold illumination on all surfaces facing the source, deep shadow on everything turned away',
      'candle flicker visible in the slight unevenness of the light — nothing is perfectly still',
      'faces half-lit, the lit half warm and specific, the shadow half lost to rich dark',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
];

const V3_SEED_LIGHTINGS: LightingSetup[] = [
  {
    id: 'lighting_seed_dual_elemental_opposition',
    name: 'Dual Elemental Opposition',
    summary: 'Two hostile key sources, no fill — cold blue-white storm light from upper left, deep red-orange volcanic glow from lower right, with pure shadow between.',
    phrases: [
      'two hostile key light sources with no fill, no reconciliation between them',
      'cold blue-white storm light from upper left — hard, electric, cutting across from the Azurok side',
      'deep red-orange volcanic ember glow from lower right — rising, furnace-hot, from the Pyrrok side',
      'a dead corridor of pure shadow between the two subjects, neither source reaching across the divide',
      'no ambient fill, no bounce light — each form lit only by its own elemental source',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
];

const DEFAULT_SEED_LIGHTINGS: LightingSetup[] = [
  {
    id: 'lighting_seed_golden_hour_rim',
    name: 'Golden Hour Rim',
    summary: 'Warm backlight, glowing rim along hair and shoulders, amber warmth.',
    phrases: [
      'golden hour warm backlight',
      'glowing rim light along hair and shoulders',
      'long soft shadows, amber warmth',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'lighting_seed_harsh_underlit',
    name: 'Harsh Underlighting',
    summary: 'Single source below, dramatic upward cast shadows, deep shadow pools.',
    phrases: [
      'harsh underlighting, single source below',
      'dramatic upward cast shadows on face',
      'deep shadow pools above brow and cheekbones',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'lighting_seed_diffuse_overcast',
    name: 'Diffuse Overcast Fill',
    summary: 'Even shadowless daylight, cool neutral light, no hard cast shadows.',
    phrases: [
      'overcast soft diffuse daylight',
      'even shadowless fill, no hard cast shadows',
      'cool neutral light, gentle detail throughout',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'lighting_seed_candlelight',
    name: 'Candlelight',
    summary: 'Close warm flame source, amber flicker, deep surrounding shadow.',
    phrases: [
      'close warm candlelight, single flame source',
      'amber flicker, soft bloom at light edges',
      'deep surrounding shadow, intimate warmth',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'lighting_seed_cold_moonlight',
    name: 'Cold Moonlight',
    summary: 'Blue-white moonlight from above, sharp cool shadows, night atmosphere.',
    phrases: [
      'cold blue-white moonlight from above',
      'sharp cool shadows, silvered highlights',
      'deep surrounding darkness, night atmosphere',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'lighting_seed_studio_portrait',
    name: 'Studio Portrait Light',
    summary: 'Clean three-point portrait lighting, controlled and professional.',
    phrases: [
      'clean studio three-point portrait lighting',
      'soft key light, gentle fill, subtle rim separation',
      'controlled neutral background, professional',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'lighting_seed_storm_strike',
    name: 'Storm Strike',
    summary: 'Blue-white lightning from directly above, harsh shadows cutting downward, the world frozen in a millisecond of discharge.',
    phrases: [
      'blue-white lightning from directly overhead, single frozen discharge',
      'harsh downward shadows cut with electric precision',
      'everything else dark, only the strike source illuminating',
      'charged atmosphere, faint corona glow around exposed edges',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'lighting_seed_bioluminescent_glow',
    name: 'Bioluminescent Self-Glow',
    summary: 'Subject emits its own electric blue light from within — no external source, pure internal luminescence.',
    phrases: [
      'bioluminescent internal glow, electric blue light source within the subject',
      'no external lighting, the subject itself illuminating the surrounding space',
      'soft blue-white corona emanating from surface details',
      'deep shadow everywhere outside the glow radius',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'lighting_seed_moonlit_storm',
    name: 'Moonlit Storm',
    summary: 'Cold blue moonlight filtering through storm clouds, periodically erased by lightning flashes.',
    phrases: [
      'cold blue moonlight filtering through heavy storm cloud breaks',
      'intermittent lightning flashes bleaching all color momentarily',
      'blue-grey ambient wash, deep indigo shadows',
      'rain catching the light in diagonal silver streaks',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'lighting_seed_abyss_underlight',
    name: 'Abyss Underlight',
    summary: 'Light rising from below — glowing fissures, bioluminescent water, or subterranean fire — casting strange upward shadows.',
    phrases: [
      'light source from directly below, rising from glowing fissures or luminous water',
      'upward-cast shadows, the face lit from an impossible angle',
      'electric blue or deep amber underlighting, context-dependent',
      'the space above dark, all luminosity concentrated at the ground plane',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'lighting_seed_aurora_canopy',
    name: 'Aurora Canopy',
    summary: 'Northern lights overhead — rippling curtains of blue-green and violet light falling from the sky.',
    phrases: [
      'aurora borealis overhead, rippling curtains of blue-green and violet light',
      'soft diffuse illumination from the sky, no hard shadows',
      'cool blue-green ambient wash, faint pink and violet accents',
      'stars visible between the aurora bands, the sky the primary light source',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
];

const writeItems = (items: LightingSetup[]) => {
  const payload: LightingStore = { version: 1, items: sortItems(items) };
  writeStorageItem(LIGHTING_STORE_KEY, payload);
  writeStorageItem(LIGHTING_STORE_BACKUP_KEY, payload);
};

const maybeApplySeed = (items: LightingSetup[]): LightingSetup[] => {
  let result = items;

  if (readStorageItem(LIGHTING_SEED_FLAG_KEY) === null) {
    writeStorageItem(LIGHTING_SEED_FLAG_KEY, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = DEFAULT_SEED_LIGHTINGS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(LIGHTING_SEED_FLAG_KEY_V3) === null) {
    writeStorageItem(LIGHTING_SEED_FLAG_KEY_V3, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V3_SEED_LIGHTINGS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(LIGHTING_SEED_FLAG_KEY_V4) === null) {
    writeStorageItem(LIGHTING_SEED_FLAG_KEY_V4, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V4_SEED_LIGHTINGS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  return result;
};

const readItems = (): LightingSetup[] => {
  const candidates = [
    parseJson(readStorageItem(LIGHTING_STORE_KEY)),
    parseJson(readStorageItem(LIGHTING_STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const raw = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.items) ? candidate.items : null);
    if (!raw) continue;
    const parsed = sortItems(
      raw.map(sanitizeItem).filter((i): i is LightingSetup => Boolean(i))
    );
    if (parsed.length > 0 || raw.length === 0) return maybeApplySeed(parsed);
  }

  return maybeApplySeed([]);
};

const sanitizeInput = (input: LightingSetupInput): LightingSetupInput => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('Lighting setup name is required.');
  const phrases = sanitizeStringArray(input.phrases);
  if (phrases.length === 0) throw new Error('At least one phrase is required.');
  return {
    name,
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
    phrases,
  };
};

export async function listLightingSetups(): Promise<LightingSetup[]> {
  return readItems();
}

export async function createLightingSetup(input: LightingSetupInput): Promise<LightingSetup> {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: LightingSetup = {
    id: createId('lighting'),
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    phrases: sanitized.phrases,
    createdAt: now,
    updatedAt: now,
  };
  const items = readItems();
  writeItems([...items, next]);
  return next;
}

export async function updateLightingSetup(id: string, input: LightingSetupInput): Promise<LightingSetup> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Lighting setup id is required.');
  const sanitized = sanitizeInput(input);
  const items = readItems();
  const existing = items.find(i => i.id === itemId);
  if (!existing) throw new Error('Lighting setup not found.');
  const updated: LightingSetup = {
    ...existing,
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    phrases: sanitized.phrases,
    updatedAt: Date.now(),
  };
  writeItems(items.map(i => (i.id === itemId ? updated : i)));
  return updated;
}

export async function deleteLightingSetup(id: string): Promise<void> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Lighting setup id is required.');
  const items = readItems();
  writeItems(items.filter(i => i.id !== itemId));
}
