import type { StylePreset, StylePresetInput, StyleStore } from '../types';

const STYLE_STORE_KEY = 'promptgen:styles:v1';
const STYLE_STORE_BACKUP_KEY = 'promptgen:styles:backup:v1';
const STYLE_SEED_FLAG_KEY = 'promptgen:styles:seeded:v2';
const STYLE_SEED_FLAG_KEY_V3 = 'promptgen:styles:seeded:v3';
const STYLE_SEED_FLAG_KEY_V4 = 'promptgen:styles:seeded:v4';
const STYLE_SEED_FLAG_KEY_V5 = 'promptgen:styles:seeded:v5';
const STYLE_SEED_FLAG_KEY_V6 = 'promptgen:styles:seeded:v6';

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
const SEED_TS_4 = 1747872000000;
const SEED_TS_5 = 1748304000000;
const SEED_TS_6 = 1748476800000;

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

const V4_SEED_STYLES: StylePreset[] = [
  {
    id: 'style_seed_ancient_creature_concept',
    name: 'Ancient Creature Concept Art',
    summary: 'Analytical creature illustration — surface material study, elemental wear, anatomical weight. Two opposing material languages in one frame.',
    phrases: [
      'ancient creature concept illustration, anatomical detail emphasis',
      'surface material study — scale texture, elemental wear, geological age visible in every ridge and fracture',
      'bilateral elemental contrast in a single frame, two opposing material languages each completely realized',
      'dark neutral background, subjects only, no competing environment elements',
      'detailed linework underlying painterly surface, creature design discipline throughout',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
];

const V5_SEED_STYLES: StylePreset[] = [
  {
    id: 'style_aiw_storybook_illustration',
    name: 'Victorian Storybook Illustration',
    summary: 'Fine pen linework with flat watercolour washes, hatched shadows, decorative border elements — the visual language of Carroll\'s original era.',
    phrases: [
      'Victorian storybook illustration style, fine pen linework with flat watercolour washes',
      'hatched cross-hatched shadows, clean ink outlines throughout',
      'warm aged paper tone underlying the colour, slightly muted palette',
      'decorative chapter-header framing elements at the image border',
      'the visual weight and precision of late nineteenth century children\'s book printing',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'style_aiw_dark_fairy_tale',
    name: 'Dark Fairy Tale Illustration',
    summary: 'Deep saturated ink and watercolour with expressionistic shadow — whimsy pushed until the edges curdle.',
    phrases: [
      'dark fairy tale illustration, deep saturated ink and watercolour',
      'expressionistic shadow pools, forms dissolving at their dark edges',
      'slightly wrong proportions — heads too large, spaces too deep, perspective tilted just past comfort',
      'rich jewel-toned palette: deep teal, crimson, gold, violet — nothing pale',
      'whimsy on the surface, unease in the structure',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'style_aiw_handpainted_storybook',
    name: 'Handpainted Storybook Watercolour',
    summary: 'Loose wet-on-wet watercolour, visible brushwork, soft bloomed edges — the deliberate imprecision of a handmade picture book.',
    phrases: [
      'loose handpainted watercolour illustration, wet-on-wet bleed at the edges',
      'visible brushstroke direction, pigment pooling at the wet margins',
      'soft bloomed boundaries between colour zones, forms suggested more than defined',
      'white paper showing through in the light areas, luminous and unworked',
      'the deliberate imprecision of a handmade picture book, warmth over precision',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'style_aiw_tenniel_woodcut',
    name: 'Tenniel Woodcut Engraving',
    summary: 'John Tenniel\'s original Alice illustrations — dense hatching, high contrast monochrome, the particular weight of Victorian wood engraving.',
    phrases: [
      'John Tenniel-style Victorian wood engraving, monochrome pen and ink',
      'dense parallel hatching building tonal value, no flat blacks',
      'high contrast, thick outlines, characters slightly caricatured but precisely rendered',
      'the specific visual authority of nineteenth century illustrated children\'s books',
      'white background, no atmospheric wash — pure line and hatch',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'style_aiw_animated_storybook',
    name: 'Animated Storybook',
    summary: 'Flat cel-shaded colour with visible ink outlines — the visual register of animated fairy tale features.',
    phrases: [
      'animated storybook style, flat cel-shaded colour with clean ink outlines',
      'simplified forms, no texture — colour fills bounded by decisive line',
      'bright saturated palette, characters slightly stylised but expressive',
      'background painted in a looser register than the characters, depth from simplification',
      'the visual warmth of hand-drawn animation from the classic feature era',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'style_aiw_victorian_oil_portrait',
    name: 'Victorian Oil Portrait',
    summary: 'Formal sitting-room portraiture — dark background, precise rendering of fabric and face, the institutional weight of Victorian court painting.',
    phrases: [
      'Victorian formal oil portrait, dark studio background',
      'precise rendering of fabric texture and jewellery, face lit from upper left',
      'rich warm shadow tones, academic glazing technique',
      'the composed stillness of a formal commissioned sitting',
      'institutional gravity — painted to record status and presence, not feeling',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
];

const V6_SEED_STYLES: StylePreset[] = [
  {
    id: 'style_ny_neon_noir_anime',
    name: 'Neon Noir Anime',
    summary: 'Rain-soaked cyberpunk anime — wet neon reflections, deep blacks, hard rim light, the saturated grime of a midnight city.',
    phrases: [
      'neon noir anime illustration, cinematic cyberpunk night',
      'wet reflective streets mirroring magenta and cyan neon signage',
      'deep crushed blacks, hard rim lighting on every silhouette',
      'volumetric haze threaded with coloured light, dense atmosphere',
      'saturated grime and glow, the look of a late-night seinen anime key frame',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'style_ny_ukiyoe_neon',
    name: 'Ukiyo-e Neon Fusion',
    summary: 'Edo woodblock composition collided with electric signage — flat carved waves and clouds lit by impossible neon colour.',
    phrases: [
      'ukiyo-e woodblock print fused with neon cyberpunk colour',
      'flat carved linework, traditional wave and cloud patterning',
      'electric magenta, cyan and acid green replacing the natural palette',
      'visible woodgrain texture and registration, bokashi gradient skies glowing like signage',
      'Edo composition discipline lit by a city that should not exist',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'style_ny_sumi_neon_ink',
    name: 'Sumi-e Neon Ink Wash',
    summary: 'Loose black ink brushwork bleeding into luminous neon washes — restraint and electricity in the same stroke.',
    phrases: [
      'sumi-e ink wash with neon pigment bleeding through the black',
      'loose confident brushstrokes, vast luminous negative space',
      'electric cyan and magenta blooming wet-on-wet at the wash edges',
      'minimal detail, gesture over description, single decisive marks',
      'traditional ink restraint shot through with electric colour',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'style_ny_rain_slick_render',
    name: 'Rain-Slick Cinematic Render',
    summary: 'Photoreal night render — wet asphalt, lens bloom, anamorphic flares, the glistening surface of a neon downpour.',
    phrases: [
      'photorealistic cinematic night render, rain-slick city surfaces',
      'wet asphalt with mirror-bright neon reflections, puddle ripples',
      'anamorphic lens flares, soft bloom around every light source',
      'volumetric rain and atmospheric haze, shallow depth of field',
      'film-grade colour grade, teal shadows and magenta highlights',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'style_ny_vhs_glitch',
    name: 'VHS Glitch Horror',
    summary: 'Degraded analogue video aesthetic — scanlines, chromatic tearing, tracking errors haunting a neon ghost story.',
    phrases: [
      'degraded VHS analogue horror aesthetic, heavy scanlines',
      'chromatic aberration tearing colour channels apart at the edges',
      'tracking glitches, signal noise, timestamp burn-in artefacts',
      'neon glow smeared by tape bloom, muddy blacks and bleeding reds',
      'the unsettling lo-fi dread of a found late-night broadcast',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'style_ny_holographic_pop',
    name: 'Holographic City Pop',
    summary: 'Bright 80s-revival city pop — airbrushed gradients, chrome type, holographic iridescence over a cheerful neon night.',
    phrases: [
      'retro city pop illustration, 1980s airbrush revival',
      'smooth gradient skies, chrome and holographic iridescent surfaces',
      'bright optimistic neon palette — hot pink, electric blue, gold',
      'crisp highlight glints, glossy clean rendering, no grime',
      'the polished commercial sheen of vintage anime album art',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
];

const V3_SEED_STYLES: StylePreset[] = [
  {
    id: 'style_seed_beksinski',
    name: 'Beksiński — Dystopian Dreamscape',
    summary: 'Zdzisław Beksiński\'s signature style: organic-architectural fusion, rust and bone palette, corroded textures, vast scale, shrouded figures, melancholic cosmic silence.',
    phrases: [
      'Zdzisław Beksiński oil painting style, dystopian surrealist dreamscape',
      'muted palette of ochre, rust, ash-grey and bone-white, desaturated and aged',
      'organic-architectural fusion — structures of stretched skin, corroded iron and exposed bone that breathe like living things',
      'extremely fine photorealistic texture throughout: rust, dried fabric, cracked stone, pitted metal, ancient decay',
      'vast impossible scale, lone shrouded or bandaged figures dwarfed by labyrinthine cathedral-like forms',
      'deep perspective drawing the eye into oppressive darkness, melancholic and ancient atmosphere',
      'no explicit horror — the dread lives in the beautiful wrongness of every surface',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
];

const writeItems = (items: StylePreset[]) => {
  const payload: StyleStore = { version: 1, items: sortItems(items) };
  writeStorageItem(STYLE_STORE_KEY, payload);
  writeStorageItem(STYLE_STORE_BACKUP_KEY, payload);
};

const maybeApplySeed = (items: StylePreset[]): StylePreset[] => {
  let result = items;

  if (readStorageItem(STYLE_SEED_FLAG_KEY) === null) {
    writeStorageItem(STYLE_SEED_FLAG_KEY, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = DEFAULT_SEED_STYLES.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(STYLE_SEED_FLAG_KEY_V3) === null) {
    writeStorageItem(STYLE_SEED_FLAG_KEY_V3, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V3_SEED_STYLES.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(STYLE_SEED_FLAG_KEY_V4) === null) {
    writeStorageItem(STYLE_SEED_FLAG_KEY_V4, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V4_SEED_STYLES.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(STYLE_SEED_FLAG_KEY_V5) === null) {
    writeStorageItem(STYLE_SEED_FLAG_KEY_V5, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V5_SEED_STYLES.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(STYLE_SEED_FLAG_KEY_V6) === null) {
    writeStorageItem(STYLE_SEED_FLAG_KEY_V6, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V6_SEED_STYLES.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  return result;
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
