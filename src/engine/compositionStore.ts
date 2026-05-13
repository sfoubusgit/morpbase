import type { CompositionFrame, CompositionFrameInput, CompositionStore } from '../types';

const COMPOSITION_STORE_KEY = 'promptgen:compositions:v1';
const COMPOSITION_STORE_BACKUP_KEY = 'promptgen:compositions:backup:v1';
const COMPOSITION_SEED_FLAG_KEY = 'promptgen:compositions:seeded:v2';
const COMPOSITION_SEED_FLAG_KEY_V3 = 'promptgen:compositions:seeded:v3';

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

const sortItems = <T extends CompositionFrame>(items: T[]): T[] =>
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

const sanitizeItem = (value: unknown): CompositionFrame | null => {
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

const DEFAULT_SEED_COMPOSITIONS: CompositionFrame[] = [
  {
    id: 'composition_seed_tight_bust',
    name: 'Tight Bust Portrait',
    summary: 'Close crop, rule of thirds, shallow depth of field.',
    phrases: [
      'tight bust portrait crop',
      'rule of thirds, slight off-center',
      'shallow depth of field, face in sharp focus',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'composition_seed_wide_environmental',
    name: 'Wide Environmental',
    summary: 'Full figure in environment, deep depth of field, context dominant.',
    phrases: [
      'full figure in environment, wide establishing shot',
      'subject occupies lower third, environment dominant',
      'deep depth of field, context visible throughout',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'composition_seed_low_angle_hero',
    name: 'Low-Angle Hero',
    summary: 'Looking up at subject, sky visible above, dramatic perspective.',
    phrases: [
      'low camera angle, looking up at subject',
      'sky visible above, powerful stance',
      'foreshortened figure, dramatic perspective',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'composition_seed_dutch_angle',
    name: 'Dutch Angle Close',
    summary: 'Tilted frame, close to subject, dynamic diagonal energy.',
    phrases: [
      'tilted frame, slight dutch angle',
      'close to subject, tension in composition',
      'dynamic diagonal, off-balance energy',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'composition_seed_symmetrical',
    name: 'Symmetrical Centered',
    summary: 'Perfectly centered, direct frontal, formal and deliberate.',
    phrases: [
      'perfectly centered symmetrical composition',
      'direct frontal, formal and deliberate',
      'equal negative space both sides',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'composition_seed_over_shoulder',
    name: 'Over-Shoulder',
    summary: 'Back of subject dominant, scene ahead visible, implied POV.',
    phrases: [
      'over-the-shoulder framing',
      'back of subject dominant, scene ahead visible',
      'implied point of view, world opening forward',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'composition_seed_scale_texture_closeup',
    name: 'Scale Texture Close-Up',
    summary: 'Extreme macro — surface texture dominates the frame, one eye visible at the edge, the full form implied but not shown.',
    phrases: [
      'extreme close-up macro, surface texture filling the frame',
      'one eye partially visible at the far edge of the composition',
      'the full form implied beyond the frame, never fully revealed',
      'razor-sharp foreground, everything beyond dissolving into bokeh',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'composition_seed_full_form_horizon',
    name: 'Full Form Horizon',
    summary: 'Wide establishing shot — the complete form visible against a vast environment, scale undeniable.',
    phrases: [
      'wide establishing shot, the complete form visible from head to tail',
      'vast environment framing the subject on all sides',
      'horizon line low, the subject filling the upper two-thirds',
      'the scale of the subject versus the landscape made undeniable',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'composition_seed_ground_angle_dominance',
    name: 'Ground Angle Dominance',
    summary: 'Shot from ground level looking steeply upward — the subject looms against the storm sky, viewer dwarfed.',
    phrases: [
      'low ground-level angle, camera pointing steeply upward',
      'the subject looming overhead, occupying the full upper frame',
      'storm sky visible behind, the environment compressed below',
      'the viewer implied as tiny, dwarfed by what stands above',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'composition_seed_eye_level_confrontation',
    name: 'Eye Level Confrontation',
    summary: 'Camera exactly at eye level — intimate and direct, neither above nor below, a confrontation of equals.',
    phrases: [
      'camera exactly at eye level, perfectly horizontal',
      'direct confrontation, the gaze meeting the lens without deflection',
      'neither dominant nor submissive, a confrontation of equals',
      'tight framing, head and upper body only, environment secondary',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'composition_seed_aerial_overview',
    name: 'Aerial Overview',
    summary: 'Shot from far above — the subject rendered as a massive landscape feature, the terrain spreading in all directions.',
    phrases: [
      'aerial view from directly above, the subject seen as a landscape feature',
      'terrain and environment spreading in all directions around the form',
      'the full scale of the subject against the ground finally legible',
      'no horizon, only the top-down plane, shadow spreading below',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
];

const V3_SEED_COMPOSITIONS: CompositionFrame[] = [
  {
    id: 'composition_seed_bilateral_standoff',
    name: 'The Bilateral Standoff',
    summary: 'Two massive subjects flanking the frame on opposing sides, facing inward. Vast negative space between them — the gap is the subject.',
    phrases: [
      'two subjects flanking the frame on opposing sides, both in full form head to tail',
      'vast negative space between them — the gap is the subject of the image',
      'camera slightly below eye level, looking horizontally across the divide',
      'both subjects equal in frame weight, neither pushed forward or back',
      'wide framing, the scale of the distance between them made undeniable',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
];

const writeItems = (items: CompositionFrame[]) => {
  const payload: CompositionStore = { version: 1, items: sortItems(items) };
  writeStorageItem(COMPOSITION_STORE_KEY, payload);
  writeStorageItem(COMPOSITION_STORE_BACKUP_KEY, payload);
};

const maybeApplySeed = (items: CompositionFrame[]): CompositionFrame[] => {
  let result = items;

  if (readStorageItem(COMPOSITION_SEED_FLAG_KEY) === null) {
    writeStorageItem(COMPOSITION_SEED_FLAG_KEY, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = DEFAULT_SEED_COMPOSITIONS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(COMPOSITION_SEED_FLAG_KEY_V3) === null) {
    writeStorageItem(COMPOSITION_SEED_FLAG_KEY_V3, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V3_SEED_COMPOSITIONS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  return result;
};

const readItems = (): CompositionFrame[] => {
  const candidates = [
    parseJson(readStorageItem(COMPOSITION_STORE_KEY)),
    parseJson(readStorageItem(COMPOSITION_STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const raw = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.items) ? candidate.items : null);
    if (!raw) continue;
    const parsed = sortItems(
      raw.map(sanitizeItem).filter((i): i is CompositionFrame => Boolean(i))
    );
    if (parsed.length > 0 || raw.length === 0) return maybeApplySeed(parsed);
  }

  return maybeApplySeed([]);
};

const sanitizeInput = (input: CompositionFrameInput): CompositionFrameInput => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('Composition frame name is required.');
  const phrases = sanitizeStringArray(input.phrases);
  if (phrases.length === 0) throw new Error('At least one phrase is required.');
  return {
    name,
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
    phrases,
  };
};

export async function listCompositionFrames(): Promise<CompositionFrame[]> {
  return readItems();
}

export async function createCompositionFrame(input: CompositionFrameInput): Promise<CompositionFrame> {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: CompositionFrame = {
    id: createId('composition'),
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

export async function updateCompositionFrame(id: string, input: CompositionFrameInput): Promise<CompositionFrame> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Composition frame id is required.');
  const sanitized = sanitizeInput(input);
  const items = readItems();
  const existing = items.find(i => i.id === itemId);
  if (!existing) throw new Error('Composition frame not found.');
  const updated: CompositionFrame = {
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

export async function deleteCompositionFrame(id: string): Promise<void> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Composition frame id is required.');
  const items = readItems();
  writeItems(items.filter(i => i.id !== itemId));
}
