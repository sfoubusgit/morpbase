import type { StylePreset, StylePresetInput, StyleStore } from '../types';

const STYLE_STORE_KEY = 'promptgen:styles:v1';
const STYLE_STORE_BACKUP_KEY = 'promptgen:styles:backup:v1';
const STYLE_SEED_FLAG_KEY = 'promptgen:styles:seeded:v2';

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

const sortItems = <T extends StylePreset>(items: T[]): T[] =>
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

const sanitizeItem = (value: unknown): StylePreset | null => {
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

const DEFAULT_SEED_STYLES: StylePreset[] = [
  {
    id: 'style_seed_dark_fantasy_oil',
    name: 'Dark Fantasy Oil Painting',
    summary: 'Thick impasto brushwork, dramatic chiaroscuro, rich deep color.',
    phrases: [
      'dark fantasy oil painting',
      'thick impasto brushwork, rich deep color',
      'dramatic chiaroscuro, painterly texture throughout',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'style_seed_ethereal_ink_wash',
    name: 'Ethereal Ink Wash',
    summary: 'Loose fluid brushwork, luminous white space, atmospheric.',
    phrases: [
      'ethereal ink wash illustration',
      'loose fluid brushwork, luminous white space',
      'soft diffuse edges, minimal detail, atmospheric',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'style_seed_noir_photograph',
    name: 'Hard-Lit Noir Photograph',
    summary: 'Black and white film noir, extreme high contrast, deep cast shadows.',
    phrases: [
      'black and white film noir photograph',
      'extreme high contrast, deep cast shadows',
      'sharp grain, harsh single-source light, cinematic',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'style_seed_cinematic_render',
    name: 'Cinematic Digital Render',
    summary: 'Photorealistic, volumetric light, intricate detail, professional color grade.',
    phrases: [
      'cinematic photorealistic digital render',
      'volumetric light, subsurface skin scatter, sharp focus',
      '8k, intricate detail, professional color grade',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'style_seed_pen_and_ink',
    name: 'Detailed Pen and Ink',
    summary: 'Fine crosshatching, precise linework, bold outlines.',
    phrases: [
      'detailed pen and ink illustration',
      'fine crosshatching, precise linework throughout',
      'bold outlines, textured negative space',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'style_seed_impressionist_oil',
    name: 'Impressionist Oil Study',
    summary: 'Loose gestural brushstrokes, color over form, visible brushwork.',
    phrases: [
      'impressionist oil painting study',
      'loose gestural brushstrokes, color over form',
      'warm palette, painterly texture, visible brushwork',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'style_seed_epic_fantasy_concept',
    name: 'Epic Dark Fantasy Concept Art',
    summary: 'High-contrast cinematic concept art, electric highlights, hyper-detailed creature and environment design.',
    phrases: [
      'epic dark fantasy concept art, cinematic quality',
      'extreme high contrast, electric blue accent highlights',
      'hyper-detailed scale and surface rendering',
      'professional creature design, dynamic lighting throughout',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'style_seed_mythic_old_masters',
    name: 'Mythic Old Masters Oil',
    summary: 'Old masters oil technique applied to mythic subject matter — rich deep blues, gold, dramatic shadow.',
    phrases: [
      'mythic oil painting in the old masters tradition',
      'rich deep blue and gold palette, glazed layers',
      'dramatic shadow, luminous highlighted surfaces',
      'museum quality, slow and considered brushwork',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'style_seed_iridescent_ink_wash',
    name: 'Iridescent Ink Wash',
    summary: 'Fluid ink wash with shimmering metallic highlights and electric blue accents bleeding through.',
    phrases: [
      'iridescent ink wash illustration',
      'fluid wet-on-wet brushwork, soft diffuse edges',
      'shimmering metallic blue and violet highlights bleeding through the wash',
      'luminous white paper showing through, electric accent lines',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'style_seed_cinematic_creature_render',
    name: 'Cinematic Creature Design Render',
    summary: 'Photorealistic creature design render — subsurface scale detail, volumetric atmosphere, film-quality lighting.',
    phrases: [
      'cinematic photorealistic creature design render',
      'subsurface scale detail, iridescent surface sheen',
      'volumetric atmosphere, depth haze, film-quality lighting',
      'ILM production quality, extreme fidelity throughout',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'style_seed_norse_saga_illumination',
    name: 'Norse Saga Illumination',
    summary: 'Bold graphic illustration in the tradition of illuminated manuscripts — electric blue, black, silver, rune aesthetics.',
    phrases: [
      'Norse saga illuminated manuscript style',
      'bold graphic forms, thick black outline, flat color fills',
      'electric blue and silver palette, gold leaf accent',
      'rune border decorations, mythic symmetry',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
];

const writeItems = (items: StylePreset[]) => {
  const payload: StyleStore = { version: 1, items: sortItems(items) };
  writeStorageItem(STYLE_STORE_KEY, payload);
  writeStorageItem(STYLE_STORE_BACKUP_KEY, payload);
};

const maybeApplySeed = (items: StylePreset[]): StylePreset[] => {
  if (readStorageItem(STYLE_SEED_FLAG_KEY) !== null) return items;
  writeStorageItem(STYLE_SEED_FLAG_KEY, true);
  const existingIds = new Set(items.map(i => i.id));
  const toAdd = DEFAULT_SEED_STYLES.filter(i => !existingIds.has(i.id));
  if (toAdd.length === 0) return items;
  const merged = sortItems([...items, ...toAdd]);
  writeItems(merged);
  return merged;
};

const readItems = (): StylePreset[] => {
  const candidates = [
    parseJson(readStorageItem(STYLE_STORE_KEY)),
    parseJson(readStorageItem(STYLE_STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const raw = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.items) ? candidate.items : null);
    if (!raw) continue;
    const parsed = sortItems(
      raw.map(sanitizeItem).filter((i): i is StylePreset => Boolean(i))
    );
    if (parsed.length > 0 || raw.length === 0) return maybeApplySeed(parsed);
  }

  return maybeApplySeed([]);
};

const sanitizeInput = (input: StylePresetInput): StylePresetInput => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('Style preset name is required.');
  const phrases = sanitizeStringArray(input.phrases);
  if (phrases.length === 0) throw new Error('At least one phrase is required.');
  return {
    name,
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
    phrases,
  };
};

export async function listStylePresets(): Promise<StylePreset[]> {
  return readItems();
}

export async function createStylePreset(input: StylePresetInput): Promise<StylePreset> {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: StylePreset = {
    id: createId('style'),
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

export async function updateStylePreset(id: string, input: StylePresetInput): Promise<StylePreset> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Style preset id is required.');
  const sanitized = sanitizeInput(input);
  const items = readItems();
  const existing = items.find(i => i.id === itemId);
  if (!existing) throw new Error('Style preset not found.');
  const updated: StylePreset = {
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

export async function deleteStylePreset(id: string): Promise<void> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Style preset id is required.');
  const items = readItems();
  writeItems(items.filter(i => i.id !== itemId));
}
