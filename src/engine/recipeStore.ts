import type {
  Recipe,
  RecipeInput,
  RecipeSettings,
  RecipeStore,
  RenderResolution,
} from '../types';

const RECIPE_STORE_KEY = 'promptgen:recipes:v1';
const RECIPE_STORE_BACKUP_KEY = 'promptgen:recipes:backup:v1';
const RECIPE_SEED_FLAG_KEY = 'promptgen:recipes:seeded:v1';

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

const sortItems = <T extends Recipe>(items: T[]): T[] =>
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

const sanitizeFiniteNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

const sanitizeResolution = (value: unknown): RenderResolution => {
  if (isRecord(value)) {
    const width = sanitizeFiniteNumber(value.width, 1024);
    const height = sanitizeFiniteNumber(value.height, 1024);
    return { width, height };
  }
  return { width: 1024, height: 1024 };
};

const sanitizeSettings = (value: unknown): RecipeSettings => {
  if (!isRecord(value)) {
    return {
      model: 'z-image-turbo',
      steps: 8,
      cfgMin: 1,
      cfgMax: 1.5,
      resolution: { width: 1024, height: 1024 },
    };
  }
  const cfgMin = sanitizeFiniteNumber(value.cfgMin, 1);
  const cfgMax = sanitizeFiniteNumber(value.cfgMax, cfgMin);
  return {
    model: typeof value.model === 'string' && value.model.trim() ? value.model.trim() : 'z-image-turbo',
    sampler: typeof value.sampler === 'string' ? value.sampler.trim() || undefined : undefined,
    scheduler: typeof value.scheduler === 'string' ? value.scheduler.trim() || undefined : undefined,
    steps: Math.max(1, Math.round(sanitizeFiniteNumber(value.steps, 8))),
    cfgMin,
    cfgMax: cfgMax < cfgMin ? cfgMin : cfgMax,
    resolution: sanitizeResolution(value.resolution),
  };
};

const sanitizeItem = (value: unknown): Recipe | null => {
  if (!isRecord(value)) return null;
  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const name = typeof value.name === 'string' ? normalizeText(value.name) : '';
  const styleTail = typeof value.styleTail === 'string' ? normalizeText(value.styleTail) : '';
  if (!id || !name || !styleTail) return null;
  const createdAt = typeof value.createdAt === 'number' && Number.isFinite(value.createdAt)
    ? value.createdAt : Date.now();
  const updatedAt = typeof value.updatedAt === 'number' && Number.isFinite(value.updatedAt)
    ? value.updatedAt : createdAt;
  return {
    id,
    name,
    summary: typeof value.summary === 'string' ? normalizeText(value.summary) || undefined : undefined,
    notes: typeof value.notes === 'string' ? normalizeText(value.notes) || undefined : undefined,
    coverImageUrl: typeof value.coverImageUrl === 'string' ? value.coverImageUrl.trim() || undefined : undefined,
    settings: sanitizeSettings(value.settings),
    styleTail,
    negative: typeof value.negative === 'string' ? normalizeText(value.negative) : '',
    loraIds: sanitizeStringArray(value.loraIds),
    universeId: typeof value.universeId === 'string' ? value.universeId.trim() || undefined : undefined,
    styleId: typeof value.styleId === 'string' ? value.styleId.trim() || undefined : undefined,
    projectTags: sanitizeStringArray(value.projectTags),
    createdAt,
    updatedAt,
  };
};

const SEED_TS = 1780272000000;

// ----- Style tails (long descriptors that get appended to per-prompt subjects) -----

const STYLE_TAIL_DORE_ENGRAVING =
  'a dramatic 19th-century Gustave Doré-style religious steel engraving, dense black ink hatching and crosshatch throughout, biblical tenebrism with luminous god-rays piercing the gloom, towering gothic sacred composition, ornate flowing drapery, hand-engraved line texture, cobalt-tinted ink wash in the deepest shadows';

const STYLE_TAIL_STAINED_GLASS_NEON =
  'a cinematic stained-glass neon film still, glowing leaded panels in saturated jewel-tone neon, dramatic shafts of god-rays piercing dust-haze, cathedral interior as cosmic stage, soft volumetric light, anamorphic lens flare, painterly highlights blended into stained-glass forms, atmospheric depth';

const STYLE_TAIL_RANKIN_BASS =
  'a 1960s-70s Rankin/Bass-style stop-motion holiday-special diorama scene, felt and fuzzy fabric textures with visible stitched seams, miniature handcrafted gothic boudoir sets with painted cardboard backdrops, soft warm tungsten lighting from set lamps, slight shallow depth of field, tactile handmade puppet quality, gothic Victorian dark glamour, sensual boudoir composition';

const STYLE_TAIL_BURTON_STOP_MOTION =
  'a Tim-Burton-style stop-motion puppet diorama scene, elongated stitched puppets with sunken hollow eyes and oversized expressive hands, spiral-twist hair and patchwork stitched costumes with visible seams, bone-white and ash-grey palette with sickly green cyan and rust accents, twisted spiral gothic architecture and German Expressionist hatched-line painted backdrops, candle-wax dripping, ash drifting, whimsical melancholy mood, tactile handmade puppet quality';

const STYLE_TAIL_BURTON_INK =
  'a Tim-Burton-style sketchbook ink-and-watercolor illustration, loose nervous black ink linework with visible scratchy pen strokes, pale watercolor washes in cool ash-grey muted cyan and rust, stretched spindly figures with oversized round black eyes and spiral hair, cross-hatched shadows ink smudges and white sketchbook paper showing through, childlike-melancholy mixed-media drawing feel';

// ----- Negatives -----

const NEG_BOUDOIR_SFW =
  'text, watermark, signature, lowres, blurry, deformed hands, extra fingers, photoreal, photograph, 3d render, smooth digital, vector, painterly, gloss, plastic, bare breasts, nipples, exposed genitals, explicit nudity';

const NEG_BOUDOIR_BURTON =
  'text, watermark, signature, lowres, blurry, deformed hands, extra fingers, photoreal, photograph, 3d render, smooth digital, vector, painterly, gloss, plastic, bare breasts, nipples, exposed genitals, explicit nudity, warm friendly, holiday-cheerful';

const NEG_BURTON_INK =
  'text, watermark, signature, lowres, blurry, deformed hands, extra fingers, photoreal, photograph, 3d render, smooth digital, vector, gloss, plastic, painted oil, polished, bare breasts, nipples, exposed genitals, explicit nudity';

const NEG_CIVITAI_CINEMATIC =
  'text, watermark, signature, lowres, blurry, deformed hands, extra fingers, modern photograph, 3d render, smooth digital, vector, plastic, washed out';

// ----- Seed recipes -----

const Z_IMAGE_PORTRAIT_4x5: RenderResolution = { width: 1024, height: 1280 };
const Z_IMAGE_PORTRAIT_TALL: RenderResolution = { width: 1024, height: 1536 };

const Z_IMAGE_BASE: Pick<RecipeSettings, 'model' | 'steps' | 'cfgMin' | 'cfgMax'> = {
  model: 'z-image-turbo',
  steps: 8,
  cfgMin: 1.0,
  cfgMax: 1.5,
};

const DEFAULT_SEED_RECIPES: Recipe[] = [
  {
    id: 'recipe_seed_saint_circuit_dore',
    name: 'Saint Circuit × Doré Engraving',
    summary: 'Religious-cyberpunk universe rendered as 19th-century steel engraving with cobalt ink wash.',
    notes: 'Doré strips cyberpunk visual cues — output reads as 19th-century religious art rather than cyberpunk. Frame post copy accordingly, or pick a different style if the cyberpunk read is required.',
    settings: { ...Z_IMAGE_BASE, resolution: Z_IMAGE_PORTRAIT_TALL },
    styleTail: STYLE_TAIL_DORE_ENGRAVING,
    negative: NEG_CIVITAI_CINEMATIC,
    loraIds: [],
    universeId: 'universe_seed_saint_circuit',
    styleId: 'style_sc_dore_engraving',
    projectTags: ['civitai'],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'recipe_seed_saint_circuit_stained_glass',
    name: 'Saint Circuit × Cinematic Stained-Glass Neon',
    summary: 'Cathedral-as-spacescape film still with god-rays and saturated stained-glass neon. Softens cyberpunk like Doré does.',
    notes: 'Validated recipe on Saint Circuit. Reuse on any cathedral-interior universe — the god-rays + leaded-glass treatment is universe-portable.',
    settings: { ...Z_IMAGE_BASE, resolution: Z_IMAGE_PORTRAIT_TALL },
    styleTail: STYLE_TAIL_STAINED_GLASS_NEON,
    negative: NEG_CIVITAI_CINEMATIC,
    loraIds: [],
    universeId: 'universe_seed_saint_circuit',
    styleId: 'style_lab_cinematic_stained_glass_neon',
    projectTags: ['civitai'],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'recipe_seed_gothic_boudoir_rankin_bass',
    name: 'Gothic Boudoir × Stop-Motion Diorama (Rankin/Bass)',
    summary: 'Felt-puppet gothic boudoir — corsets, lace bustiers, stockings, garters. Warm tungsten Rankin/Bass palette.',
    notes: 'Felt-puppet medium does the SFW covering (no exposed nipples/genitals) while preserving full erotic-glamour energy. Sister recipe to the Burton Stop-Motion variant.',
    settings: { ...Z_IMAGE_BASE, resolution: Z_IMAGE_PORTRAIT_4x5 },
    styleTail: STYLE_TAIL_RANKIN_BASS,
    negative: NEG_BOUDOIR_SFW,
    loraIds: [],
    styleId: 'style_pp_stop_motion',
    projectTags: ['ig-erotic'],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'recipe_seed_gothic_boudoir_burton_stop_motion',
    name: 'Gothic Boudoir × Burton Stop-Motion Diorama',
    summary: 'Elongated stitched goth-puppets — bone-white / ash-grey / sickly-green palette. Cold melancholy counterpart to the Rankin/Bass take.',
    notes: 'Same goth-archetype roster as the Rankin/Bass recipe, opposite emotional palette. Same SFW covering trick via the felt-puppet medium.',
    settings: { ...Z_IMAGE_BASE, resolution: Z_IMAGE_PORTRAIT_4x5 },
    styleTail: STYLE_TAIL_BURTON_STOP_MOTION,
    negative: NEG_BOUDOIR_BURTON,
    loraIds: [],
    styleId: 'style_lab_burton_stop_motion',
    projectTags: ['ig-erotic'],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'recipe_seed_gothic_boudoir_burton_ink',
    name: 'Gothic Boudoir × Burton Ink Sketchbook',
    summary: 'Loose Tim-Burton sketchbook ink-and-watercolor goth boudoir — flat 2D drawing register instead of dimensional puppets.',
    notes: 'Sister to the Burton Stop-Motion recipe. Same archetypes, drawn rather than sculpted. White sketchbook paper showing through is part of the look.',
    settings: { ...Z_IMAGE_BASE, resolution: Z_IMAGE_PORTRAIT_4x5 },
    styleTail: STYLE_TAIL_BURTON_INK,
    negative: NEG_BURTON_INK,
    loraIds: [],
    styleId: 'style_lab_burton_ink_sketchbook',
    projectTags: ['ig-erotic'],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
];

const writeItems = (items: Recipe[]) => {
  const payload: RecipeStore = { version: 1, items: sortItems(items) };
  writeStorageItem(RECIPE_STORE_KEY, payload);
  writeStorageItem(RECIPE_STORE_BACKUP_KEY, payload);
};

const maybeApplySeed = (items: Recipe[]): Recipe[] => {
  let result = items;

  if (readStorageItem(RECIPE_SEED_FLAG_KEY) === null) {
    writeStorageItem(RECIPE_SEED_FLAG_KEY, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = DEFAULT_SEED_RECIPES.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  return result;
};

const readItems = (): Recipe[] => {
  const candidates = [
    parseJson(readStorageItem(RECIPE_STORE_KEY)),
    parseJson(readStorageItem(RECIPE_STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const raw = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.items) ? candidate.items : null);
    if (!raw) continue;
    const parsed = sortItems(
      raw.map(sanitizeItem).filter((i): i is Recipe => Boolean(i))
    );
    if (parsed.length > 0 || raw.length === 0) return maybeApplySeed(parsed);
  }

  return maybeApplySeed([]);
};

const sanitizeInput = (input: RecipeInput): RecipeInput => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('Recipe name is required.');
  const styleTail = normalizeText(input.styleTail);
  if (!styleTail) throw new Error('Recipe style tail is required.');
  return {
    name,
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    notes: input.notes ? normalizeText(input.notes) || undefined : undefined,
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
    settings: sanitizeSettings(input.settings),
    styleTail,
    negative: normalizeText(input.negative ?? ''),
    loraIds: sanitizeStringArray(input.loraIds),
    universeId: input.universeId?.trim() || undefined,
    styleId: input.styleId?.trim() || undefined,
    projectTags: sanitizeStringArray(input.projectTags),
  };
};

export async function listRecipes(): Promise<Recipe[]> {
  return readItems();
}

export async function getRecipe(id: string): Promise<Recipe | null> {
  const itemId = id.trim();
  if (!itemId) return null;
  return readItems().find(i => i.id === itemId) ?? null;
}

export async function createRecipe(input: RecipeInput): Promise<Recipe> {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: Recipe = {
    id: createId('recipe'),
    name: sanitized.name,
    summary: sanitized.summary,
    notes: sanitized.notes,
    coverImageUrl: sanitized.coverImageUrl,
    settings: sanitized.settings,
    styleTail: sanitized.styleTail,
    negative: sanitized.negative,
    loraIds: sanitized.loraIds ?? [],
    universeId: sanitized.universeId,
    styleId: sanitized.styleId,
    projectTags: sanitized.projectTags ?? [],
    createdAt: now,
    updatedAt: now,
  };
  const items = readItems();
  writeItems([...items, next]);
  return next;
}

export async function updateRecipe(id: string, input: RecipeInput): Promise<Recipe> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Recipe id is required.');
  const sanitized = sanitizeInput(input);
  const items = readItems();
  const existing = items.find(i => i.id === itemId);
  if (!existing) throw new Error('Recipe not found.');
  const updated: Recipe = {
    ...existing,
    name: sanitized.name,
    summary: sanitized.summary,
    notes: sanitized.notes,
    coverImageUrl: sanitized.coverImageUrl,
    settings: sanitized.settings,
    styleTail: sanitized.styleTail,
    negative: sanitized.negative,
    loraIds: sanitized.loraIds ?? existing.loraIds,
    universeId: sanitized.universeId,
    styleId: sanitized.styleId,
    projectTags: sanitized.projectTags ?? existing.projectTags,
    updatedAt: Date.now(),
  };
  writeItems(items.map(i => (i.id === itemId ? updated : i)));
  return updated;
}

export async function deleteRecipe(id: string): Promise<void> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Recipe id is required.');
  const items = readItems();
  writeItems(items.filter(i => i.id !== itemId));
}
