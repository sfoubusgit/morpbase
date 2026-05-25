import type { StylePreset, StylePresetInput, StyleStore } from '../types';

const STYLE_STORE_KEY = 'promptgen:styles:v1';
const STYLE_STORE_BACKUP_KEY = 'promptgen:styles:backup:v1';
const STYLE_SEED_FLAG_KEY = 'promptgen:styles:seeded:v2';
const STYLE_SEED_FLAG_KEY_V3 = 'promptgen:styles:seeded:v3';
const STYLE_SEED_FLAG_KEY_V4 = 'promptgen:styles:seeded:v4';
const STYLE_SEED_FLAG_KEY_V5 = 'promptgen:styles:seeded:v5';
const STYLE_SEED_FLAG_KEY_V6 = 'promptgen:styles:seeded:v6';
const STYLE_SEED_FLAG_KEY_V7 = 'promptgen:styles:seeded:v7';
const STYLE_SEED_FLAG_KEY_V8 = 'promptgen:styles:seeded:v8';
const STYLE_SEED_FLAG_KEY_V9 = 'promptgen:styles:seeded:v9';
const STYLE_SEED_FLAG_KEY_V10 = 'promptgen:styles:seeded:v10';
const STYLE_SEED_FLAG_KEY_V11 = 'promptgen:styles:seeded:v11';
const STYLE_SEED_FLAG_KEY_V12 = 'promptgen:styles:seeded:v12';
const STYLE_SEED_FLAG_KEY_V13 = 'promptgen:styles:seeded:v13';
const STYLE_SEED_FLAG_KEY_V14 = 'promptgen:styles:seeded:v14';

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
const SEED_TS_7 = 1748563200000;
const SEED_TS_8 = 1748649600000;
const SEED_TS_9 = 1748736000000;
const SEED_TS_10 = 1748822400000;
const SEED_TS_11 = 1748908800000;
const SEED_TS_12 = 1748995200000;
const SEED_TS_13 = 1749081600000;
const SEED_TS_14 = 1749168000000;

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

// V7 — Solarpunk Bloom: warm, hopeful, painterly green-tech art directions.
const V7_SEED_STYLES: StylePreset[] = [
  {
    id: 'style_sb_solarpunk_storybook',
    name: 'Solarpunk Storybook',
    summary: 'Warm gouache storybook illustration — soft edges, sun-washed greens and golds, hopeful and hand-painted.',
    phrases: [
      'warm gouache storybook illustration, soft painterly edges',
      'sun-washed palette of leaf-green, honey-gold and sky-blue',
      'gentle rounded shapes, cosy hand-painted texture',
      'optimistic solarpunk picture-book mood, light and inviting',
      'visible brushwork and paper grain, no harsh lines',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'style_sb_ghibli_pastoral',
    name: 'Ghibli Pastoral',
    summary: 'Lush hand-painted anime pastoral — layered foliage, soft cinematic light, the loving detail of a Studio Ghibli background.',
    phrases: [
      'lush hand-painted anime pastoral, Studio Ghibli background art sensibility',
      'densely layered foliage, every leaf lovingly rendered',
      'soft cinematic daylight, gentle volumetric haze',
      'rich natural greens with warm highlights, painterly clouds',
      'wholesome nostalgic warmth, immersive and detailed',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'style_sb_art_nouveau_botanical',
    name: 'Art Nouveau Botanical',
    summary: 'Mucha-style organic line — sinuous botanical borders, flat decorative colour, gold accents and flowing whiplash curves.',
    phrases: [
      'Art Nouveau illustration in the manner of Alphonse Mucha',
      'sinuous flowing whiplash linework, ornate botanical borders',
      'flat decorative colour fields, muted naturals with gold leaf accents',
      'elegant framing arches wreathed in stylised flowers and vines',
      'decorative, organic, and richly patterned',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'style_sb_sunlit_render',
    name: 'Sunlit Cinematic Render',
    summary: 'Photoreal golden render — warm bounce light, lush depth of field, the glossy hopeful look of a green-future film still.',
    phrases: [
      'photorealistic cinematic render bathed in warm golden daylight',
      'soft warm bounce light, lush shallow depth of field',
      'verdant greens and honeyed highlights, gentle lens bloom',
      'clean optimistic colour grade, airy and bright',
      'the polished hopeful look of a solarpunk film still',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'style_sb_eco_watercolor',
    name: 'Eco Watercolor Concept',
    summary: 'Loose architectural watercolour — washy greens, bleeding edges, ink-line structure, the airy feel of a hopeful concept board.',
    phrases: [
      'loose architectural watercolour concept art, washy and luminous',
      'soft bleeding green and ochre washes over light ink linework',
      'lots of bright paper showing through, airy negative space',
      'quick confident gesture, foliage suggested not laboured',
      'fresh, hopeful, exploratory concept-board feel',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'style_sb_stained_glass_bloom',
    name: 'Stained-Glass Bloom',
    summary: 'Luminous leaded glass — bold dark cames, glowing translucent colour, floral motifs lit from behind by the sun.',
    phrases: [
      'luminous stained-glass illustration, bold dark leaded cames outlining every shape',
      'glowing translucent panes of emerald, amber and rose',
      'symmetrical floral and leaf motifs, sun streaming through from behind',
      'jewel-bright backlit colour, radiant and devotional',
      'the warm glow of light through a botanical cathedral window',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
];

// V8 — Porcelain Court: eerie rococo doll-court art directions.
const V8_SEED_STYLES: StylePreset[] = [
  {
    id: 'style_pc_rococo_oil',
    name: 'Rococo Oil Painting',
    summary: 'Fragonard-and-Boucher pastel oil — feathery brushwork, pearly skin, powder-blue and rose, gilt and gauze in soft diffused light.',
    phrases: [
      'rococo oil painting in the manner of Fragonard and Boucher',
      'feathery delicate brushwork, pearly luminous skin tones',
      'a pastel palette of powder-blue, rose-pink, cream and gilt',
      'soft diffused light, gauzy fabrics and ornate gold scrollwork',
      'elegant, frivolous, and gorgeously decadent',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'style_pc_porcelain_render',
    name: 'Porcelain Doll Render',
    summary: 'Glossy bisque-porcelain render — smooth glazed surfaces, fine crazing and hairline cracks, ball-joints and glass eyes in crisp studio detail.',
    phrases: [
      'highly detailed render of glazed bisque porcelain, smooth glossy surfaces',
      'fine crazing and hairline cracks across the glaze, visible ball-joints',
      'glass doll eyes with painted lashes, subtle subsurface sheen',
      'crisp product-studio detail, delicate chips and seams',
      'beautiful and uncanny, the perfection of an antique doll',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'style_pc_gothic_storybook',
    name: 'Gothic Doll Storybook',
    summary: 'Macabre storybook illustration — spindly ink line, muted pastel-and-grey wash, the elegant creepiness of a Victorian fairy-tale plate.',
    phrases: [
      'macabre gothic storybook illustration, spindly expressive ink linework',
      'muted pastel-and-grey watercolour wash over the line',
      'elongated elegant figures, decorative dark whimsy',
      'the refined creepiness of a Victorian fairy-tale plate',
      'pretty and sinister in equal measure',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'style_pc_faded_daguerreotype',
    name: 'Faded Daguerreotype',
    summary: 'Antique photographic plate — silvery tarnished tones, soft focus, foxing and scratches, the haunted stillness of a 19th-century portrait.',
    phrases: [
      'antique daguerreotype photograph, silvery tarnished monochrome tones',
      'soft shallow focus, slight motion-blur ghosting',
      'foxing, scratches and chemical staining across the plate',
      'a vignette of darkness around a still formal portrait',
      'the haunted solemn stillness of early photography',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'style_pc_pastel_gothic',
    name: 'Pastel Gothic',
    summary: 'Sweet-and-sinister pastel goth illustration — candy pastels soured with grey, lace and bows over cracks and gloom.',
    phrases: [
      'pastel gothic illustration, sweet candy pastels soured with cold grey',
      'lace, ribbons and bows set against cracks, dust and gloom',
      'soft cel-like rendering with delicate dark linework',
      'pretty pinks and blues haunted by something melancholy',
      'adorable and unsettling at once',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'style_pc_baroque_chiaroscuro',
    name: 'Baroque Chiaroscuro',
    summary: 'Dramatic old-master chiaroscuro — a single warm light carving figures from deep shadow, rich darks, candle-gold highlights.',
    phrases: [
      'dramatic baroque chiaroscuro, old-master oil rendering',
      'a single warm light source carving the subject from deep shadow',
      'rich velvety darks, candle-gold highlights on skin and gilt',
      'theatrical tenebrism, most of the frame in shadow',
      'solemn, opulent, and gravely beautiful',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
];

// V9 — Dust Run: post-apocalyptic spaghetti-western art directions.
const V9_SEED_STYLES: StylePreset[] = [
  {
    id: 'style_dr_spaghetti_western',
    name: 'Spaghetti Western Film Still',
    summary: 'Sergio Leone film still — extreme telephoto compression, sun-blasted grain, deep tans and dust, tense widescreen framing.',
    phrases: [
      'a Sergio Leone spaghetti-western film still, anamorphic widescreen',
      'extreme telephoto lens compression, sun-blasted 35mm grain',
      'sun-bleached palette of tan, ochre, dust and faded blue sky',
      'tense composition with deep focus and dramatic negative space',
      'cinematic, gritty, and baking in the heat',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'style_dr_postapoc_concept',
    name: 'Post-Apocalyptic Concept Art',
    summary: 'Mad-Max wasteland concept art — scrap-and-rust detail, sun-scorched grit, dynamic vehicular chaos, painterly cinematic realism.',
    phrases: [
      'post-apocalyptic wasteland concept art, Mad Max sensibility',
      'highly detailed scrap-metal, rust and welded-junk design',
      'sun-scorched grit, dust haze and harsh contrast',
      'dynamic cinematic composition, painterly realism',
      'rugged, kinetic, and richly textured',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'style_dr_dustbowl_sepia',
    name: 'Dust-Bowl Sepia Photograph',
    summary: 'A Depression-era sepia photograph — warm monochrome, fine dust grain, sun-cracked weariness, the documentary look of a vanished frontier.',
    phrases: [
      'a Dust-Bowl-era sepia photograph, warm faded monochrome',
      'fine grain and dust, scratches and aged paper tone',
      'sun-cracked weathered detail, documentary realism',
      'soft vignette, hard noon light, weary frontier mood',
      'nostalgic, austere, and historic',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'style_dr_graphic_novel_ink',
    name: 'Gritty Graphic-Novel Ink',
    summary: 'Heavy noir ink — bold black shadows, rough crosshatching, high-contrast sun-and-shade, the look of a western graphic novel.',
    phrases: [
      'gritty western graphic-novel ink illustration',
      'bold heavy black shadows and rough crosshatching',
      'high-contrast sun-and-shade, stark white highlights',
      'limited dusty spot-colour over strong inked linework',
      'rugged, graphic, and dramatic',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'style_dr_sunbleached_render',
    name: 'Sun-Bleached Cinematic Render',
    summary: 'Photoreal desert render — blown-out highlights, dust in the air, heat shimmer, a harsh bleached colour grade.',
    phrases: [
      'photorealistic sun-bleached cinematic render of the desert',
      'blown-out highlights and deep crushed shadows, harsh sun',
      'dust suspended in the air, heat shimmer and lens flare',
      'bleached desaturated tan-and-blue colour grade',
      'harsh, hyper-real, and parched',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'style_dr_painted_poster',
    name: 'Painted Western Poster',
    summary: 'A vintage hand-painted western movie poster — bold dramatic figures, warm saturated dusk palette, gouache texture and heroic framing.',
    phrases: [
      'a vintage hand-painted western movie poster, gouache texture',
      'bold dramatic figures arranged in a heroic montage',
      'warm saturated dusk palette of orange, gold and deep brown',
      'painterly brushwork, strong rim light and theatrical poses',
      'epic, romantic, and larger than life',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
];

// V10 — Deep Signal: deep-sea cosmic-horror art directions.
const V10_SEED_STYLES: StylePreset[] = [
  {
    id: 'style_ds_deepsea_render',
    name: 'Deep-Sea Cinematic Render',
    summary: 'Photoreal abyssal render — murky water, floodlit volumetrics, marine snow, crushing dark and cold blue depth.',
    phrases: [
      'photorealistic deep-sea cinematic render, murky abyssal water',
      'floodlit volumetric light cones, drifting marine snow',
      'crushing darkness, cold blue and teal depth',
      'fine particulate haze and soft caustics, immense pressure',
      'atmospheric, claustrophobic, and submerged',
    ],
    createdAt: SEED_TS_10,
    updatedAt: SEED_TS_10,
  },
  {
    id: 'style_ds_cosmic_horror',
    name: 'Cosmic Horror Concept Art',
    summary: 'Lovecraftian concept art — vast wrong forms half-seen in gloom, dread scale, muted palette pierced by sickly light.',
    phrases: [
      'Lovecraftian cosmic-horror concept art, vast wrong forms half-seen in the gloom',
      'oppressive dread and impossible scale, the eye refusing to resolve it',
      'muted desaturated palette pierced by sickly bioluminescent light',
      'painterly realism with deep shadow swallowing detail',
      'eldritch, ominous, and sublime',
    ],
    createdAt: SEED_TS_10,
    updatedAt: SEED_TS_10,
  },
  {
    id: 'style_ds_biolum_ink',
    name: 'Bioluminescent Ink Wash',
    summary: 'Black ink drowned in glowing colour — vast dark washes with luminous cyan and violet bleeding through, minimal and eerie.',
    phrases: [
      'black ink wash drowned in glowing abyssal colour',
      'vast dark negative space with luminous cyan and violet bleeding through',
      'soft glowing edges against deep black, wet-on-wet bloom',
      'minimal suggestion of form, gesture over detail',
      'eerie, atmospheric, and luminous',
    ],
    createdAt: SEED_TS_10,
    updatedAt: SEED_TS_10,
  },
  {
    id: 'style_ds_found_footage',
    name: 'Submersible Cam Footage',
    summary: 'Grainy found-footage submersible feed — fisheye distortion, timestamp burn-in, signal noise and floodlit murk caught on a failing camera.',
    phrases: [
      'grainy found-footage submersible camera feed',
      'fisheye lens distortion, timestamp and depth readout burn-in',
      'analogue signal noise, chromatic glitching and dropouts',
      'a harsh on-cam floodlight blowing out the murk',
      'lo-fi, documentary, and dread-soaked',
    ],
    createdAt: SEED_TS_10,
    updatedAt: SEED_TS_10,
  },
  {
    id: 'style_ds_painterly_horror',
    name: 'Painterly Sci-Fi Horror',
    summary: 'Moody painted sci-fi horror — rich brushwork, deep gloom, a single cold light source, the cinematic dread of a drowned station.',
    phrases: [
      'moody painterly sci-fi horror illustration, rich visible brushwork',
      'deep enveloping gloom with one cold light source',
      'desaturated steel and shadow shot through with bioluminescent accents',
      'cinematic dramatic composition, atmosphere over detail',
      'tense, oppressive, and beautifully grim',
    ],
    createdAt: SEED_TS_10,
    updatedAt: SEED_TS_10,
  },
  {
    id: 'style_ds_iridescent_abyssal',
    name: 'Iridescent Abyssal Illustration',
    summary: 'Dark fantasy illustration shimmering with deep-sea iridescence — oil-slick colour over black, pearlescent creature sheen, jewel-bright bioluminescence.',
    phrases: [
      'dark fantasy illustration shimmering with deep-sea iridescence',
      'oil-slick pearlescent colour playing over near-black water',
      'jewel-bright bioluminescent accents, translucent creature sheen',
      'smooth refined rendering, elegant and otherworldly',
      'gorgeous, alien, and unsettling',
    ],
    createdAt: SEED_TS_10,
    updatedAt: SEED_TS_10,
  },
];

// V11 — Style Lab: a toolkit of reusable, subject-agnostic art directions usable in any universe.
const V11_SEED_STYLES: StylePreset[] = [
  {
    id: 'style_lab_oil_painting',
    name: 'Classical Oil Painting',
    summary: 'Rich old-master oil — visible brushwork, impasto texture, luminous glazed colour and chiaroscuro.',
    phrases: [
      'classical oil painting, rich visible brushwork and impasto texture',
      'deep luminous colour with soft blended transitions',
      'warm old-master glazing and chiaroscuro',
      'canvas grain showing through, gallery-quality finish',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_watercolor',
    name: 'Watercolor',
    summary: 'Loose translucent washes, soft bleeding edges, wet-on-wet blooms and light paper showing through.',
    phrases: [
      'loose watercolour painting, translucent washes and soft bleeding edges',
      'wet-on-wet blooms, bright paper showing through',
      'delicate granulation and gentle colour pooling',
      'airy, fresh, and luminous',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_gouache',
    name: 'Gouache Illustration',
    summary: 'Matte opaque gouache — flat rich pigment, soft edges, confident simple shapes, storybook warmth.',
    phrases: [
      'matte gouache illustration, opaque flat colour with soft edges',
      'painterly but clean, rich pigment and gentle texture',
      'storybook warmth, confident simple shapes',
      'velvety matte finish',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_ink_wash',
    name: 'Sumi-e Ink Wash',
    summary: 'Loose black brush ink, vast negative space, soft grey gradients bleeding wet-on-wet, gesture over detail.',
    phrases: [
      'traditional sumi-e ink wash, loose confident black brushstrokes',
      'vast luminous negative space, gesture over detail',
      'soft grey gradients bleeding wet-on-wet',
      'minimal, meditative, and expressive',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_charcoal',
    name: 'Charcoal Sketch',
    summary: 'Expressive charcoal — smudged greys and deep blacks, gestural strokes, visible paper tooth, dramatic shading.',
    phrases: [
      'expressive charcoal sketch, soft smudged greys and deep blacks',
      'loose gestural strokes, visible paper tooth',
      'dramatic high-contrast shading, fingertip blending',
      'raw, immediate, and tonal',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_pen_ink',
    name: 'Pen & Ink Etching',
    summary: 'Fine crosshatching and stippling, crisp black linework, engraving-like precision, antique illustration feel.',
    phrases: [
      'detailed pen-and-ink etching, fine crosshatching and stippling',
      'crisp black linework on white, engraving-like precision',
      'dense hatched shadows, antique illustration feel',
      'intricate, graphic, and high-contrast',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_3d_render',
    name: '3D CGI Render',
    summary: 'Polished modern CGI — clean subsurface surfaces, soft global illumination, realistic materials, gentle depth of field.',
    phrases: [
      'polished 3D CGI render, clean subsurface-scattered surfaces',
      'soft global illumination and realistic materials',
      'smooth modern animated-film look, gentle depth of field',
      'crisp, glossy, and dimensional',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_claymation',
    name: 'Claymation',
    summary: 'Handmade stop-motion clay — modelling-clay textures, fingerprints and tool marks, miniature practical sets.',
    phrases: [
      'stop-motion claymation look, handmade modelling-clay textures',
      'visible fingerprints and tool marks, soft matte surfaces',
      'miniature set with practical lighting, slight charming imperfection',
      'tactile and handcrafted',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_pixel_art',
    name: 'Pixel Art',
    summary: 'Crisp limited-palette pixel art — blocky readable forms, dithering, sharp pixel edges, retro 16-bit aesthetic.',
    phrases: [
      'detailed pixel art, crisp limited-palette dithering',
      'clean blocky forms and readable silhouettes',
      'retro 16-bit game aesthetic, sharp pixel edges',
      'nostalgic, graphic, and precise',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_anime_cel',
    name: 'Anime Cel',
    summary: 'Clean modern anime — bold confident lineart, flat cel colour with crisp shadow shapes, expressive eyes.',
    phrases: [
      'clean anime cel shading, bold confident lineart',
      'flat cel colour with crisp shadow shapes',
      'bright expressive eyes, polished modern anime look',
      'vibrant, sharp, and graphic',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_painterly_anime',
    name: 'Painterly Anime',
    summary: 'Lush hand-painted anime background art — soft cinematic light, densely detailed nature, warm nostalgic colour.',
    phrases: [
      'lush hand-painted anime background art, Studio Ghibli sensibility',
      'soft cinematic light and densely detailed nature',
      'warm nostalgic colour, painterly clouds and foliage',
      'wholesome, immersive, and gentle',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_comic',
    name: 'Comic / Graphic Novel',
    summary: 'Bold inked comic art — strong outlines, dynamic flat colour with halftone shading, dramatic action framing.',
    phrases: [
      'bold comic-book and graphic-novel art, strong inked outlines',
      'dynamic flat colour with halftone shading',
      'dramatic high-contrast lighting and action framing',
      'punchy, graphic, and energetic',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_noir_photo',
    name: 'Noir Photograph',
    summary: 'High-contrast black-and-white noir — dramatic chiaroscuro, hard key light, film grain and smoky atmosphere.',
    phrases: [
      'high-contrast black-and-white noir photograph',
      'dramatic chiaroscuro, deep shadows and hard key light',
      'film grain and smoky atmosphere',
      'moody, cinematic, and timeless',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_film_35mm',
    name: 'Cinematic 35mm Film',
    summary: 'Filmic 35mm still — natural film colour grade, soft grain, gentle halation, shallow depth of field.',
    phrases: [
      'cinematic 35mm film still, natural filmic colour grade',
      'soft grain, gentle halation and shallow depth of field',
      'anamorphic framing, realistic ambient lighting',
      'filmic, atmospheric, and photographic',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_polaroid',
    name: 'Vintage Polaroid',
    summary: 'Soft faded instant photo — warm cast, slight overexposure, gentle vignette and light leaks, square format.',
    phrases: [
      'vintage instant Polaroid photo, soft faded colour',
      'slight overexposure, warm cast and a gentle vignette',
      'square format, low contrast, subtle light leaks',
      'nostalgic, casual, and analogue',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_art_nouveau',
    name: 'Art Nouveau',
    summary: 'Mucha-style organic line — sinuous whiplash linework, ornate floral borders, flat decorative colour and gold.',
    phrases: [
      'Art Nouveau illustration in the manner of Alphonse Mucha',
      'sinuous flowing whiplash linework and ornate floral borders',
      'flat decorative colour fields with gold-leaf accents',
      'elegant, organic, and richly patterned',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_ukiyoe',
    name: 'Ukiyo-e Woodblock',
    summary: 'Edo woodblock print — flat carved linework, bokashi gradient skies, muted pigments, visible woodgrain.',
    phrases: [
      'traditional ukiyo-e woodblock print',
      'flat carved linework and bokashi gradient skies',
      'muted natural pigments, visible woodgrain and registration',
      'Edo-period composition, elegant and graphic',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_bauhaus',
    name: 'Bauhaus Geometric',
    summary: 'Modernist Bauhaus poster — bold primary colours, clean abstract geometric shapes, strong diagonal composition.',
    phrases: [
      'Bauhaus geometric poster style, bold primary colours',
      'clean abstract shapes and strong diagonal composition',
      'minimal flat modernist design',
      'graphic, balanced, and striking',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_vaporwave',
    name: 'Vaporwave / Synthwave',
    summary: 'Retro-futuristic neon — pink and cyan gradients, 80s grids, chrome, glitch and sunset glow.',
    phrases: [
      'vaporwave synthwave aesthetic, neon pink and cyan gradients',
      'retro 80s grids, chrome surfaces and sunset glow',
      'dreamy nostalgic digital surrealism with subtle glitch',
      'glowing, retro-futuristic, and saturated',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
  {
    id: 'style_lab_risograph',
    name: 'Risograph Print',
    summary: 'Indie riso print — limited spot-colour layers slightly misregistered, grainy ink, visible halftone overprint.',
    phrases: [
      'risograph print look, limited spot-colour layers slightly misregistered',
      'grainy textured ink in bright fluorescent colours',
      'visible halftone and overprint blends',
      'handmade indie-zine aesthetic',
    ],
    createdAt: SEED_TS_11,
    updatedAt: SEED_TS_11,
  },
];

// V12 — Style Lab addition: a bold graphic dystopian sci-fi poster look (from a CivitAI reference).
const V12_SEED_STYLES: StylePreset[] = [
  {
    id: 'style_lab_graphic_scifi',
    name: 'Bold Graphic Sci-Fi',
    summary: 'Graphic dystopian sci-fi poster — thick clean outlines with a bright rim-light glow, flat painterly cinematic shapes, a crimson-and-teal complementary palette with hot orange accents.',
    phrases: [
      'bold graphic sci-fi illustration, thick clean outlines with a bright rim-light glow tracing the silhouette',
      'flat painterly cinematic shapes, semi-realistic but graphic',
      'limited complementary palette of crimson red and teal-green with hot orange glow accents',
      'dramatic low-angle heroic poster composition, gritty dystopian industrial mood',
      'high contrast, subtle grain and floating sparks',
    ],
    createdAt: SEED_TS_12,
    updatedAt: SEED_TS_12,
  },
];

// V13 — Style Lab addition: a finished charcoal drawing (distinct from the looser Charcoal Sketch).
const V13_SEED_STYLES: StylePreset[] = [
  {
    id: 'style_lab_charcoal_drawing',
    name: 'Charcoal Drawing',
    summary: 'A finished charcoal drawing — rich full tonal range, soft blended shading, deep velvety blacks and lifted white highlights on textured paper.',
    phrases: [
      'a finished charcoal drawing on textured paper, rich full tonal range',
      'soft blended shading, deep velvety blacks and lifted white highlights',
      'subtle smudging and fine hatching, controlled and carefully rendered',
      'monochrome charcoal greyscale, expressive but refined',
    ],
    createdAt: SEED_TS_13,
    updatedAt: SEED_TS_13,
  },
];

// V14 — Style Lab addition: vintage dark anime rendered with charcoal texture.
const V14_SEED_STYLES: StylePreset[] = [
  {
    id: 'style_lab_charcoal_dark_anime',
    name: 'Charcoal Dark Classic Anime',
    summary: 'Vintage 80s/90s OVA anime rendered in charcoal — grainy hand-drawn shading, bold retro cel linework, deep shadows and a muted, desaturated dark palette.',
    phrases: [
      'dark classic anime illustration in the style of vintage 1980s-90s OVA, rendered with charcoal texture',
      'bold retro hand-drawn cel linework, grainy charcoal-and-ink shading and smudged graphite tones',
      'low-key moody lighting, deep velvety shadows, muted desaturated near-monochrome palette',
      'paper grain and film grain, nostalgic analogue anime atmosphere',
      'ominous, atmospheric, hand-crafted',
    ],
    createdAt: SEED_TS_14,
    updatedAt: SEED_TS_14,
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

  if (readStorageItem(STYLE_SEED_FLAG_KEY_V7) === null) {
    writeStorageItem(STYLE_SEED_FLAG_KEY_V7, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V7_SEED_STYLES.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(STYLE_SEED_FLAG_KEY_V8) === null) {
    writeStorageItem(STYLE_SEED_FLAG_KEY_V8, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V8_SEED_STYLES.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(STYLE_SEED_FLAG_KEY_V9) === null) {
    writeStorageItem(STYLE_SEED_FLAG_KEY_V9, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V9_SEED_STYLES.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(STYLE_SEED_FLAG_KEY_V10) === null) {
    writeStorageItem(STYLE_SEED_FLAG_KEY_V10, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V10_SEED_STYLES.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(STYLE_SEED_FLAG_KEY_V11) === null) {
    writeStorageItem(STYLE_SEED_FLAG_KEY_V11, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V11_SEED_STYLES.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(STYLE_SEED_FLAG_KEY_V12) === null) {
    writeStorageItem(STYLE_SEED_FLAG_KEY_V12, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V12_SEED_STYLES.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(STYLE_SEED_FLAG_KEY_V13) === null) {
    writeStorageItem(STYLE_SEED_FLAG_KEY_V13, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V13_SEED_STYLES.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(STYLE_SEED_FLAG_KEY_V14) === null) {
    writeStorageItem(STYLE_SEED_FLAG_KEY_V14, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V14_SEED_STYLES.filter(i => !existingIds.has(i.id));
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
