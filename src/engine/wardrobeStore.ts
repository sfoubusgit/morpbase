import type { OutfitIdentity, OutfitIdentityInput, WardrobeStore } from '../types';

const WARDROBE_STORE_KEY = 'promptgen:wardrobe:v1';
const WARDROBE_STORE_BACKUP_KEY = 'promptgen:wardrobe:backup:v1';
const WARDROBE_SEED_FLAG_KEY = 'promptgen:wardrobe:seeded:v3';
const WARDROBE_SEED_FLAG_KEY_V4 = 'promptgen:wardrobe:seeded:v4';
const WARDROBE_SEED_FLAG_KEY_V5 = 'promptgen:wardrobe:seeded:v5';
const WARDROBE_SEED_FLAG_KEY_V6 = 'promptgen:wardrobe:seeded:v6';

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
const SEED_TS_4 = 1748304000000;
const SEED_TS_5 = 1748476800000;
const SEED_TS_6 = 1748563200000;

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

const V5_SEED_OUTFITS: OutfitIdentity[] = [
  {
    id: 'outfit_ny_neon_streetwear',
    name: 'Neon Techwear Streetwear',
    summary: 'Layered black techwear lit by integrated LED piping — utility straps, a cropped shell jacket, glowing seams that trace the body in the dark.',
    phrases: [
      'layered black techwear, cropped technical shell jacket with utility straps',
      'integrated electroluminescent piping glowing cyan and magenta along the seams',
      'cargo trousers with buckles and zips, chunky high-top sneakers',
      'the LED lines tracing the silhouette in the dark, function and glow combined',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'outfit_ny_cyber_kimono',
    name: 'Cyber Kimono',
    summary: 'A short modernised kimono in synthetic fabric — traditional silhouette cut for the street, obi reworked as a tech harness, neon-printed lining.',
    phrases: [
      'short modernised kimono in iridescent synthetic fabric, traditional silhouette cut short for the street',
      'obi reworked as a buckled tech harness across the waist',
      'neon-printed inner lining flashing colour with movement',
      'paired with platform sandals and mesh leggings, old form rebuilt for a new city',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'outfit_ny_konbini_uniform',
    name: 'Convenience Store Uniform',
    summary: 'The mundane konbini work uniform — striped collared shirt, apron, name tag, cap — worn by a spirit pretending to belong.',
    phrases: [
      'convenience store work uniform, striped collared shirt with a branded apron',
      'plastic name tag, soft visor cap, sleeves rolled to the elbow',
      'utterly ordinary retail clothing, deliberately unremarkable',
      'the camouflage of the everyday worn by something that is not an employee',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'outfit_ny_holographic_idol',
    name: 'Holographic Idol Costume',
    summary: 'A stage idol outfit in holographic fabric — frilled skirt, ribbon accents, light-reactive sequins that shatter neon into rainbow.',
    phrases: [
      'holographic idol stage costume, frilled tiered skirt with ribbon accents',
      'light-reactive sequins shattering neon into rainbow flecks',
      'fingerless gloves, thigh-high boots, oversized bow at the collar',
      'engineered to catch and throw every coloured stage light',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'outfit_ny_rain_slicker',
    name: 'Translucent Rain Slicker',
    summary: 'A clear vinyl rain slicker over neon clothing — the city lights glowing through wet plastic, hood up, droplets beaded on the surface.',
    phrases: [
      'transparent vinyl rain slicker worn over glowing neon clothing beneath',
      'city lights diffusing through the wet translucent plastic',
      'hood up, drawstring tight, droplets beaded across the surface',
      'the colour underneath softened and smeared by the rain-streaked vinyl',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'outfit_ny_yokai_formal',
    name: 'Spirit Formalwear',
    summary: 'A spirit dressed for the night in dark tailoring threaded with traditional motifs — a sharp suit or haori with embroidered yokai crests, understated and uncanny.',
    phrases: [
      'sharp dark tailoring threaded with traditional motifs, a suit or haori cut clean',
      'embroidered yokai family crests in metallic thread catching the neon',
      'understated, elegant, expensive — old money from an older world',
      'a quiet uncanny formality, dressed for a night that humans were not invited to',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
];

const V4_SEED_OUTFITS: OutfitIdentity[] = [
  {
    id: 'outfit_aiw_alice_blue_pinafore',
    name: "Alice's Blue Pinafore Dress",
    summary: 'The classic: pale blue dress with white pinafore apron, puffed sleeves, black strap shoes, white knee socks.',
    phrases: [
      'pale blue dress with short puffed sleeves, fitted through the bodice',
      'white pinafore apron tied at the back in a large bow',
      'white knee socks and black strap shoes, worn and slightly dusty from travel',
      'neat but increasingly dishevelled — the pinafore still white, the dress not quite where it started',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
  {
    id: 'outfit_aiw_playing_card_uniform',
    name: 'Playing Card Soldier Uniform',
    summary: 'Flat painted uniform in the manner of a playing card — suit emblems on the chest, stiff posture implied by the geometry.',
    phrases: [
      'flat painted playing card soldier uniform, suit emblem prominent on the chest',
      'red and white colour division, the geometry of a card face applied to a standing figure',
      'stiff vertical posture, the uniform suggesting a two-dimensional object choosing to occupy three dimensions',
      'no expression visible — the suit is the identity',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
  {
    id: 'outfit_aiw_red_queen_regalia',
    name: "Red Queen's Regalia",
    summary: 'Full court dress in deep crimson and black — crown, stiff collar, the geometric authority of someone who has never once considered being wrong.',
    phrases: [
      'deep crimson court dress, structured bodice and full skirt, black heart embroidery throughout',
      'high stiff collar framing the face, crown fixed above it — both immovable',
      'wide silhouette, the skirt held to shape by unseen structure, the effect monumental',
      'black gloves to the elbow, the red and black palette absolute and unrelieved',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
  {
    id: 'outfit_aiw_mad_hatter_ensemble',
    name: "Mad Hatter's Ensemble",
    summary: 'A formal suit that has been through several entirely different fashion periods simultaneously — too much hat, price tag intact, every layer competing.',
    phrases: [
      'tall stovepipe hat with a price tag attached to the band, slightly tilted, enormous',
      'layered formal coat in clashing fabrics — plaid waistcoat, striped trousers, spotted cravat knotted large',
      'too many buttons, each a different size and colour, none of them matching the buttonholes they serve',
      'formally chaotic — everything a deliberate choice, the choices in complete disagreement with each other',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
  {
    id: 'outfit_aiw_white_queen_gown',
    name: "White Queen's Gown",
    summary: 'Disordered white gown on a figure who cannot quite keep herself arranged — hair escaping, crown askew, everything white and increasingly approximate.',
    phrases: [
      'white gown in soft unstructured fabric, layers slightly misaligned',
      'hair in a state of active escape from whatever arrangement it was in, a crown sitting at an angle it was not placed at',
      'everything white — gown, gloves, hair, complexion — the whiteness both regal and slightly alarming',
      'the impression of a woman whose clothes cannot keep up with her and has stopped concerning herself with this',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
  {
    id: 'outfit_aiw_victorian_visitor',
    name: 'Victorian Visitor',
    summary: 'Neat Victorian child\'s day dress — proper for the surface world, increasingly inappropriate for this one.',
    phrases: [
      'neat Victorian child\'s day dress, appropriate for afternoon visits in the world above',
      'high collar, long sleeves, sensible shoes, the whole ensemble constructed for propriety',
      'visibly out of place — the dress correct for a world where the rules still apply',
      'slightly too tidy for the current environment, the contrast part of the point',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
];

// V6 — Solarpunk Bloom: natural-fibre green-tech workwear and festival dress.
const V6_SEED_OUTFITS: OutfitIdentity[] = [
  {
    id: 'outfit_sb_solar_cloak',
    name: 'Woven Solar Cloak',
    summary: 'A flowing cloak woven with flexible photovoltaic threads — natural linen shot through with faintly iridescent solar panels that catch the light.',
    phrases: [
      'a flowing natural-linen cloak woven with flexible photovoltaic threads',
      'faintly iridescent solar panels set like scales across the shoulders',
      'earthy undyed fabric edged with subtle copper conductive trim',
      'practical and elegant, function and grace in one garment',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'outfit_sb_botanist_workwear',
    name: "Botanist's Workwear",
    summary: 'Practical garden workwear — rolled-sleeve linen, a canvas tool apron full of seed packets, sturdy boots and gloves.',
    phrases: [
      'practical botanist workwear, rolled-sleeve linen shirt and sturdy trousers',
      'a canvas tool apron with deep pockets full of seed packets and trowels',
      'worn leather gloves tucked in the belt, scuffed work boots',
      'earth-toned, hard-wearing, comfortably lived-in',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'outfit_sb_glider_flightsuit',
    name: 'Glider Flightsuit',
    summary: 'A streamlined courier flightsuit — light linen and leather harness straps cut for the wind, with a furled solar wing-sail at the back.',
    phrases: [
      'a streamlined linen glider flightsuit cut close for the wind',
      'leather harness straps and buckles across the chest, fingerless gloves',
      'a furled translucent amber solar wing-sail folded at the back',
      'lightweight, aerodynamic, built for the open air',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'outfit_sb_living_fiber_dress',
    name: 'Living-Fibre Dress',
    summary: 'A soft dress of living fibre — undyed cloth threaded with real growing moss and embroidered vines that seem to creep across the fabric.',
    phrases: [
      'a soft flowing dress of undyed living fibre cloth',
      'real growing moss and small ferns threaded along the seams',
      'embroidered vines and leaves creeping across the fabric',
      'organic and gentle, clothing that is half garden',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'outfit_sb_repair_coveralls',
    name: 'Repair-Café Coveralls',
    summary: 'Hard-working patched coveralls — hand-mended in mismatched fabric, hung with tools, a leather tool-roll apron over the top.',
    phrases: [
      'well-worn work coveralls, visibly patched and hand-mended in mismatched cloth',
      'loops and pockets hung with small hand tools',
      'a leather tool-roll apron stained with oil and solder',
      'utilitarian, thrifty, proudly repaired',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'outfit_sb_festival_bloomwear',
    name: 'Festival Bloomwear',
    summary: 'Ceremonial harvest-festival dress — flowing petal-toned layers, ribbons and garlands, crowned with living flowers.',
    phrases: [
      'flowing ceremonial festival dress in petal-pink, cream and gold layers',
      'trailing ribbons and looping flower garlands',
      'a full crown of living blooms cascading into the hair',
      'celebratory, abundant, dressed for the harvest dance',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
];

const writeOutfits = (outfits: OutfitIdentity[]) => {
  const payload: WardrobeStore = { version: 1, outfits: sortOutfits(outfits) };
  writeStorageItem(WARDROBE_STORE_KEY, payload);
  writeStorageItem(WARDROBE_STORE_BACKUP_KEY, payload);
};

const maybeApplySeed = (outfits: OutfitIdentity[]): OutfitIdentity[] => {
  let result = outfits;

  if (readStorageItem(WARDROBE_SEED_FLAG_KEY) === null) {
    writeStorageItem(WARDROBE_SEED_FLAG_KEY, true);
    const existingIds = new Set(result.map(o => o.id));
    const toAdd = DEFAULT_SEED_OUTFITS.filter(o => !existingIds.has(o.id));
    if (toAdd.length > 0) {
      result = sortOutfits([...result, ...toAdd]);
      writeOutfits(result);
    }
  }

  if (readStorageItem(WARDROBE_SEED_FLAG_KEY_V4) === null) {
    writeStorageItem(WARDROBE_SEED_FLAG_KEY_V4, true);
    const existingIds = new Set(result.map(o => o.id));
    const toAdd = V4_SEED_OUTFITS.filter(o => !existingIds.has(o.id));
    if (toAdd.length > 0) {
      result = sortOutfits([...result, ...toAdd]);
      writeOutfits(result);
    }
  }

  if (readStorageItem(WARDROBE_SEED_FLAG_KEY_V5) === null) {
    writeStorageItem(WARDROBE_SEED_FLAG_KEY_V5, true);
    const existingIds = new Set(result.map(o => o.id));
    const toAdd = V5_SEED_OUTFITS.filter(o => !existingIds.has(o.id));
    if (toAdd.length > 0) {
      result = sortOutfits([...result, ...toAdd]);
      writeOutfits(result);
    }
  }

  if (readStorageItem(WARDROBE_SEED_FLAG_KEY_V6) === null) {
    writeStorageItem(WARDROBE_SEED_FLAG_KEY_V6, true);
    const existingIds = new Set(result.map(o => o.id));
    const toAdd = V6_SEED_OUTFITS.filter(o => !existingIds.has(o.id));
    if (toAdd.length > 0) {
      result = sortOutfits([...result, ...toAdd]);
      writeOutfits(result);
    }
  }

  return result;
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
