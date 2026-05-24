import type { LightingSetup, LightingSetupInput, LightingStore } from '../types';

const LIGHTING_STORE_KEY = 'promptgen:lightings:v1';
const LIGHTING_STORE_BACKUP_KEY = 'promptgen:lightings:backup:v1';
const LIGHTING_SEED_FLAG_KEY = 'promptgen:lightings:seeded:v2';
const LIGHTING_SEED_FLAG_KEY_V3 = 'promptgen:lightings:seeded:v3';
const LIGHTING_SEED_FLAG_KEY_V4 = 'promptgen:lightings:seeded:v4';
const LIGHTING_SEED_FLAG_KEY_V5 = 'promptgen:lightings:seeded:v5';
const LIGHTING_SEED_FLAG_KEY_V6 = 'promptgen:lightings:seeded:v6';
const LIGHTING_SEED_FLAG_KEY_V7 = 'promptgen:lightings:seeded:v7';
const LIGHTING_SEED_FLAG_KEY_V8 = 'promptgen:lightings:seeded:v8';
const LIGHTING_SEED_FLAG_KEY_V9 = 'promptgen:lightings:seeded:v9';

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
const SEED_TS_5 = 1748476800000;
const SEED_TS_6 = 1748563200000;
const SEED_TS_7 = 1748649600000;
const SEED_TS_8 = 1748736000000;
const SEED_TS_9 = 1748822400000;

const V5_SEED_LIGHTINGS: LightingSetup[] = [
  {
    id: 'lighting_ny_neon_sign_wash',
    name: 'Neon Sign Wash',
    summary: 'Saturated coloured light from off-screen signage — magenta and cyan washing across the subject from opposing sides, no neutral fill.',
    phrases: [
      'saturated neon signage light from off-screen, no neutral fill anywhere',
      'magenta key from one side, electric cyan from the other, colours meeting on the skin',
      'hard coloured rim light tracing every edge, deep shadow between the two hues',
      'the glow of a hundred signs reflected back as ambient colour',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'lighting_ny_konbini_fluorescent',
    name: 'Convenience Store Fluorescent',
    summary: 'Flat clinical overhead fluorescent — even cold white light, faint green cast, the merciless honesty of a 3am konbini.',
    phrases: [
      'flat overhead fluorescent tube lighting, clinical and even',
      'cold white with a faint sickly green cast, no warmth in the spectrum',
      'shadowless merciless illumination, every detail exposed',
      'the specific honest ugliness of a 3am convenience store interior',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'lighting_ny_paper_lantern_glow',
    name: 'Paper Lantern Glow',
    summary: 'Warm red-orange light from hanging paper lanterns — soft, diffused through paper, swaying pools of amber in the dark alley.',
    phrases: [
      'warm red-orange light from hanging paper lanterns, diffused soft through paper',
      'multiple small swaying sources casting overlapping amber pools',
      'deep blue shadow filling the spaces between the lantern light',
      'gentle flicker, the intimate warmth of a yokocho alley after dark',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'lighting_ny_spectral_self_glow',
    name: 'Spectral Self-Glow',
    summary: 'A yokai lit from within — pale neon luminescence radiating from the spirit itself, illuminating the wet street around it.',
    phrases: [
      'spectral internal glow, pale neon luminescence radiating from within the figure',
      'the spirit itself the light source, no external illumination',
      'soft cyan or magenta corona spilling onto the wet ground nearby',
      'everything beyond the glow radius swallowed by night',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'lighting_ny_vending_machine_bloom',
    name: 'Vending Machine Bloom',
    summary: 'A lone vending machine as the only light — cold blue-white glow blooming into the rain, the single bright island on a black street.',
    phrases: [
      'a single vending machine as the sole light source on a black street',
      'cold blue-white glow blooming outward into the rain and mist',
      'one bright island of illumination surrounded by total dark',
      'long reflections of the machine stretched across wet asphalt',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'lighting_ny_train_window_strobe',
    name: 'Train Window Strobe',
    summary: 'Passing light through train windows — rhythmic strobing of tunnel lamps and platform signage raking across the interior.',
    phrases: [
      'rhythmic strobing light through train windows, tunnel lamps passing in sequence',
      'bands of light and dark raking across the interior at speed',
      'cold platform fluorescents and neon flashing intermittently',
      'motion-blurred streaks of colour smearing past the glass',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
];

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

// V6 — Solarpunk Bloom: warm natural daylight and gentle green-tech glow.
const V6_SEED_LIGHTINGS: LightingSetup[] = [
  {
    id: 'lighting_sb_dappled_canopy',
    name: 'Dappled Canopy Light',
    summary: 'Sunlight filtered through leaves — shifting pools of warm light and soft green shadow, flecks of brightness scattered across everything.',
    phrases: [
      'warm sunlight filtered through a leaf canopy, shifting dappled pools of light',
      'soft green-tinted shadow between bright sun-flecks',
      'gentle contrast, light scattered and broken by foliage',
      'the alive, moving quality of sun through moving leaves',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'lighting_sb_greenhouse_diffusion',
    name: 'Greenhouse Glass Diffusion',
    summary: 'Soft milky daylight through greenhouse glass — even, shadowless, gently warm, the diffuse glow of a sunlit conservatory.',
    phrases: [
      'soft diffused daylight through frosted greenhouse glass, even and shadowless',
      'milky warm ambient light wrapping every surface gently',
      'faint humid glow, light scattered by mist and condensation',
      'the calm bright softness of a sunlit conservatory',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'lighting_sb_solar_glint',
    name: 'Solar-Panel Glint',
    summary: 'Sharp warm reflections off solar surfaces — clean bright highlights and crisp glints raking across glass and panel.',
    phrases: [
      'sharp warm sunlight glinting off solar panels and glass',
      'crisp bright specular highlights raking across clean surfaces',
      'clear high-key daylight, deep blue sky reflections',
      'the bright optimistic sparkle of sun on photovoltaic glass',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'lighting_sb_algae_glow',
    name: 'Algae-Tube Glow',
    summary: 'Warm green light from bioreactor tubes — living emerald luminescence glowing softly through glass into a dim hall.',
    phrases: [
      'warm green light radiating from glowing algae bioreactor tubes',
      'living emerald luminescence glowing softly through glass',
      'gentle green underlight and soft reflections on a dim floor',
      'a calm bio-luminous interior glow, organic and futuristic',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'lighting_sb_golden_field',
    name: 'Golden Hour Field Light',
    summary: 'Low warm sun across open ground — long soft shadows, honeyed rim light, the whole scene gilded by a setting sun.',
    phrases: [
      'low warm golden-hour sun across open ground, long soft shadows',
      'honeyed rim light gilding every edge, backlit grass and pollen aglow',
      'rich amber tones, gentle haze in the warm air',
      'the generous nostalgic glow of a setting sun over fields',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'lighting_sb_overcast_pearl',
    name: 'Overcast Pearl Light',
    summary: 'Soft warm-grey overcast — flat gentle illumination, no harsh shadows, colours rich and saturated under a pearl sky.',
    phrases: [
      'soft warm-grey overcast daylight, flat and gentle, no harsh shadows',
      'even pearly illumination making colours deep and saturated',
      'cool diffuse sky light balanced by warm earth tones below',
      'the calm restful softness of a bright cloudy day',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
];

// V7 — Porcelain Court: dim, dusty, candlelit and grey-windowed light.
const V7_SEED_LIGHTINGS: LightingSetup[] = [
  {
    id: 'lighting_pc_candelabra_glow',
    name: 'Dusty Candelabra Glow',
    summary: 'Warm guttering candlelight from a tarnished candelabra — small pools of amber against deep shadow, dust drifting in the beams.',
    phrases: [
      'warm guttering candlelight from a tarnished candelabra, small amber pools',
      'soft flickering glow falling off quickly into deep shadow',
      'dust motes drifting visibly through the candle beams',
      'intimate, golden, and surrounded by dark',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'lighting_pc_grimy_window',
    name: 'Grimy Window Daylight',
    summary: 'Pale flat daylight through dirty tall windows — cold, dim and diffuse, sifting grey through grime and torn lace curtains.',
    phrases: [
      'pale flat daylight filtering through tall grimy windows',
      'cold dim diffuse light sifted grey through dust and torn lace',
      'soft shadowless illumination, colours muted and faded',
      'the wan quiet light of a long-shuttered room',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'lighting_pc_chandelier_refraction',
    name: 'Chandelier Crystal Refraction',
    summary: 'Fractured light through a dusty crystal chandelier — scattered glints and faint prismatic flecks falling across the gloom.',
    phrases: [
      'fractured light scattering through a dusty crystal chandelier',
      'tiny glints and faint prismatic flecks cast across the room',
      'a dim sparkle drifting over dust and faded gilt',
      'delicate broken light in a vast shadowy space',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'lighting_pc_tall_window_moonlight',
    name: 'Tall-Window Moonlight',
    summary: 'Cold blue moonlight through high arched windows — long pale window-bars cast across dusty floors, deep silver shadow elsewhere.',
    phrases: [
      'cold blue moonlight pouring through tall arched windows',
      'long pale window-bar shadows stretched across a dusty floor',
      'silver-edged highlights, deep blue shadow filling the rest',
      'still, lunar, and quietly haunted',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'lighting_pc_gilt_bounce',
    name: 'Faded Gilt Bounce',
    summary: 'Soft warm light bounced off tarnished gold — a dim amber ambient glow from flaking gilt walls and mirror frames.',
    phrases: [
      'soft warm light bounced off tarnished gold leaf and gilt scrollwork',
      'a dim amber ambient glow filling a faded ornate room',
      'gentle reflections off old mirror frames and picture frames',
      'mellow, antique, and richly dim',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'lighting_pc_musicbox_footlight',
    name: 'Music-Box Footlight',
    summary: 'A low warm stage glow from below — a single footlight on the turning doll, dramatic up-lighting against a dark velvet surround.',
    phrases: [
      'a single low warm footlight glowing up onto the subject',
      'dramatic stage up-lighting against a dark velvet surround',
      'a small spotlit turning stage, everything beyond it in shadow',
      'theatrical, intimate, and faintly sinister',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
];

// V8 — Dust Run: harsh sun, dust haze and campfire dark.
const V8_SEED_LIGHTINGS: LightingSetup[] = [
  {
    id: 'lighting_dr_harsh_noon',
    name: 'Harsh Noon Sun',
    summary: 'The merciless overhead sun — blown-out highlights, hard black shadows straight down, blinding glare with no mercy and no shade.',
    phrases: [
      'merciless overhead noon sun, blinding and direct',
      'blown-out highlights and hard black shadows pooling straight down',
      'extreme contrast, glare bouncing off pale ground',
      'heat shimmer rising, no shade anywhere',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'lighting_dr_golden_dust',
    name: 'Golden Dust Haze',
    summary: 'Low sun raking through hanging dust — warm amber light, long shadows, every particle in the air glowing gold.',
    phrases: [
      'low warm sun raking through hanging desert dust',
      'thick golden amber light, every airborne particle aglow',
      'long dramatic shadows stretched across the sand',
      'soft hazy atmosphere, warm and cinematic',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'lighting_dr_backlit_silhouette',
    name: 'Backlit Dust Silhouette',
    summary: 'A figure thrown into silhouette against the bright sky — blazing rim light, dust glowing around the edges, the face in shadow.',
    phrases: [
      'a figure backlit into near-silhouette against a blazing bright sky',
      'a hot rim of light tracing the edges, dust glowing around them',
      'the face and front dropped into deep shadow',
      'dramatic contre-jour, a lone dark shape in the glare',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'lighting_dr_saloon_shafts',
    name: 'Saloon Window Shafts',
    summary: 'Hard god-rays through grimy windows — solid shafts of dusty light cutting the dim interior, smoke and dust drifting through the beams.',
    phrases: [
      'hard shafts of daylight stabbing through grimy saloon windows',
      'solid dusty god-rays cutting across a dim smoky interior',
      'drifting dust and smoke catching the light beams',
      'bright pools on the floor, deep shadow between',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'lighting_dr_campfire_night',
    name: 'Campfire Night Glow',
    summary: 'A small fire against the desert dark — warm flickering orange on faces, cold blue night beyond, sparks rising into a vast starfield.',
    phrases: [
      'a small campfire glowing warm orange against the desert night',
      'flickering firelight on faces, deep cold blue dark beyond',
      'sparks rising toward a vast clear starfield',
      'intimate pool of warmth in an immense black emptiness',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'lighting_dr_duststorm_murk',
    name: 'Dust-Storm Murk',
    summary: 'The choking light inside a sandstorm — thick orange-brown haze, the sun a dim disc, everything flattened and dimmed by airborne grit.',
    phrases: [
      'the choking diffuse light inside a dust storm',
      'thick orange-brown haze, the sun reduced to a dim glowing disc',
      'everything flattened and dimmed by airborne grit',
      'low visibility, eerie monochrome amber murk',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
];

// V9 — Deep Signal: bioluminescent, floodlit and abyssal-dark light.
const V9_SEED_LIGHTINGS: LightingSetup[] = [
  {
    id: 'lighting_ds_bioluminescent',
    name: 'Bioluminescent Glow',
    summary: 'Light made by living things — soft self-illuminating cyan, violet and gold radiating from creatures into surrounding black water.',
    phrases: [
      'soft bioluminescent glow radiating from living things',
      'self-illuminating cyan, violet and gold in black water',
      'gentle falloff into total surrounding darkness',
      'colour pulsing slowly, the only light in the deep',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'lighting_ds_submersible_flood',
    name: 'Submersible Floodlight',
    summary: 'A hard cone of artificial light in the abyss — a bright floodlight cutting murky water, full of drifting particles, black beyond its reach.',
    phrases: [
      'a hard cone of submersible floodlight cutting the murky water',
      'a bright beam thick with drifting marine snow and particles',
      'total black beyond the reach of the light',
      'strong volumetric shafts, harsh falloff',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'lighting_ds_emergency_red',
    name: 'Flickering Emergency Red',
    summary: 'Alarm light in a failing station — a pulsing red emergency lamp strobing through steam and shadow, everything washed in alarm.',
    phrases: [
      'a pulsing red emergency light strobing through a dim interior',
      'alarm-red wash over steam, shadow and wet steel',
      'rhythmic flashing, deep black between the pulses',
      'tense, claustrophobic, and failing',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'lighting_ds_console_glow',
    name: 'Cold Console Glow',
    summary: 'Screens in the dark — cold blue and green console and sonar-scope light underlighting a face, the rest of the room swallowed in shadow.',
    phrases: [
      'cold blue and green console and sonar-scope light in the dark',
      'screen-glow underlighting a face from below',
      'the rest of the room swallowed in deep shadow',
      'electronic, eerie, and isolating',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'lighting_ds_lure_light',
    name: 'Anglerfish Lure Light',
    summary: 'A single eerie point in the void — one small glowing lure hanging in absolute black, drawing the eye, illuminating almost nothing.',
    phrases: [
      'a single small glowing lure-light hanging in absolute black',
      'one eerie point of soft gold drawing the eye in the void',
      'almost nothing else illuminated, faint hints at the edges',
      'beckoning, isolated, and ominous',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'lighting_ds_abyssal_dark',
    name: 'Abyssal Darkness',
    summary: 'Near-total black — the lightless deep where only faint shapes and the dimmest glows resolve, dread pressing in from every side.',
    phrases: [
      'near-total abyssal darkness, the lightless deep',
      'only faint shapes and the dimmest glows resolving from the black',
      'overwhelming negative space, dread pressing from every side',
      'minimal light, maximal void',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
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

  if (readStorageItem(LIGHTING_SEED_FLAG_KEY_V5) === null) {
    writeStorageItem(LIGHTING_SEED_FLAG_KEY_V5, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V5_SEED_LIGHTINGS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(LIGHTING_SEED_FLAG_KEY_V6) === null) {
    writeStorageItem(LIGHTING_SEED_FLAG_KEY_V6, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V6_SEED_LIGHTINGS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(LIGHTING_SEED_FLAG_KEY_V7) === null) {
    writeStorageItem(LIGHTING_SEED_FLAG_KEY_V7, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V7_SEED_LIGHTINGS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(LIGHTING_SEED_FLAG_KEY_V8) === null) {
    writeStorageItem(LIGHTING_SEED_FLAG_KEY_V8, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V8_SEED_LIGHTINGS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(LIGHTING_SEED_FLAG_KEY_V9) === null) {
    writeStorageItem(LIGHTING_SEED_FLAG_KEY_V9, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V9_SEED_LIGHTINGS.filter(i => !existingIds.has(i.id));
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
