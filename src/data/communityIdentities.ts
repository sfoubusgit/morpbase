export type CommunityIdentityType =
  | 'character'
  | 'style'
  | 'lighting'
  | 'environment'
  | 'wardrobe'
  | 'composition'
  | 'mood'
  | 'negative'
  | 'aura'
  | 'object';

export type CommunityIdentity = {
  id: string;
  name: string;
  type: CommunityIdentityType;
  phrases: string[];
  summary: string;
};

export const COMMUNITY_IDENTITIES: CommunityIdentity[] = [
  // ── Mascot ────────────────────────────────────────────────────────────────
  {
    id: 'ci_mascot_morp',
    name: 'Morp',
    type: 'character',
    summary: 'The MorpBase moth. Small, upright, always drawn toward something just out of frame. Curious without being anxious.',
    phrases: [
      'Morp, the MorpBase moth mascot',
      'small upright anthropomorphic moth, standing on two legs',
      'deep violet and soft lavender wings, large and expressive',
      'faint glowing glyph patterns across wing surface',
      'large warm amber eyes, curious and unhurried',
      'thin antennae with glowing violet orb tips',
      'tiny arms held gently outward',
      'soft inner bioluminescence, violet light from within',
      'asymmetric wing markings, organic and deliberate',
      'expression of quiet wonder',
      'drawn toward the nearest light source',
      'small in scale, significant in presence',
    ],
  },

  // ── Characters ───────────────────────────────────────────────────────────
  {
    id: 'ci_char_elena',
    name: 'Elena Vasquez',
    type: 'character',
    summary: 'Searching, melancholic, quiet inner strength.',
    phrases: [
      'Elena Vasquez',
      'dark shoulder-length hair, sharp cheekbones',
      'searching eyes, perpetual quiet sadness',
      'measured movements, deliberate stillness',
      'presence like a held breath',
    ],
  },
  {
    id: 'ci_char_marcus',
    name: 'Marcus Stone',
    type: 'character',
    summary: 'Weathered, stoic, carries years of unspoken weight.',
    phrases: [
      'Marcus Stone',
      'weathered face, deep-set eyes',
      'broad frame, economic movement',
      'expression like a door that rarely opens',
      'grey at the temples, hands of a working man',
    ],
  },
  {
    id: 'ci_char_yuna',
    name: 'Yuna',
    type: 'character',
    summary: 'Ethereal, distant, luminous.',
    phrases: [
      'Yuna',
      'pale luminous skin, dark wide eyes',
      'graceful stillness, otherworldly calm',
      'long dark hair, loose and natural',
      'presence like early morning light',
    ],
  },

  // ── Styles ────────────────────────────────────────────────────────────────
  {
    id: 'ci_style_analog',
    name: 'Analog 35mm',
    type: 'style',
    summary: 'Grain, warmth, beautiful imperfection.',
    phrases: [
      'analog 35mm film photograph',
      'visible grain, warm color cast',
      'slight lens aberration, natural imperfection',
    ],
  },
  {
    id: 'ci_style_watercolor',
    name: 'Soft Watercolor',
    type: 'style',
    summary: 'Fluid, luminous, delicate edge handling.',
    phrases: [
      'soft watercolor illustration',
      'fluid wet-on-wet washes, luminous white paper showing through',
      'delicate edges, gentle color bleed',
    ],
  },
  {
    id: 'ci_style_brutalist',
    name: 'Brutalist Documentary',
    type: 'style',
    summary: 'Harsh, direct, raw without sentiment.',
    phrases: [
      'high contrast documentary photograph',
      'harsh direct flash, flat unforgiving light',
      'raw and direct, no aesthetic softening',
    ],
  },
  {
    id: 'ci_style_cinematic',
    name: 'Cinematic',
    type: 'style',
    summary: 'Widescreen, color-graded, feels like a still from a film.',
    phrases: [
      'cinematic widescreen composition',
      'anamorphic lens quality, subtle horizontal flare',
      'color graded, teal and orange separation',
      'film-like depth of field, deliberate framing',
      'narrative stillness, a moment extracted from a story',
    ],
  },
  {
    id: 'ci_style_chiaroscuro',
    name: 'Chiaroscuro Oil',
    type: 'style',
    summary: 'Old master darkness, candlelit subject, surrounding shadow.',
    phrases: [
      'oil painting in the style of the old masters',
      'deep chiaroscuro, extreme light and shadow contrast',
      'warm candlelit subject emerging from dark background',
      'rich impasto texture, painterly edges',
      'Rembrandt-influenced dramatic illumination',
    ],
  },

  // ── Lighting ──────────────────────────────────────────────────────────────
  {
    id: 'ci_light_golden',
    name: 'Golden Hour Sidelight',
    type: 'lighting',
    summary: 'Warm directional light, long shadows, rich texture.',
    phrases: [
      'golden hour sidelight',
      'warm directional sun, long cast shadows',
      'rim light on edges, rich skin texture',
    ],
  },
  {
    id: 'ci_light_window',
    name: 'Cold Window Light',
    type: 'lighting',
    summary: 'Blue-grey natural diffusion, introspective and flat.',
    phrases: [
      'overcast window light',
      'cold blue-grey natural diffusion',
      'soft shadows, introspective flat quality',
    ],
  },
  {
    id: 'ci_light_harsh_flash',
    name: 'Harsh Direct Flash',
    type: 'lighting',
    summary: 'On-camera strobe, flat and unforgiving, nothing hidden.',
    phrases: [
      'harsh on-camera direct flash',
      'flat blown highlights, hard edge shadows',
      'no fill light, no softening',
      'faces caught without preparation',
      'clinical and confrontational light quality',
    ],
  },
  {
    id: 'ci_light_forest_canopy',
    name: 'Forest Canopy Light',
    type: 'lighting',
    summary: 'Diffused green light through leaves, dappled and organic.',
    phrases: [
      'diffused light filtering through forest canopy',
      'soft green ambient fill, dappled light patches',
      'cool indirect illumination, warm gaps where sun breaks through',
      'light from above, uneven and organic',
      'natural and unhurried light quality',
    ],
  },
  {
    id: 'ci_light_candle',
    name: 'Candlelight',
    type: 'lighting',
    summary: 'Intimate, warm, faces half in darkness.',
    phrases: [
      'single candle light source',
      'intimate warm orange glow',
      'deep surrounding shadow, faces half in darkness',
    ],
  },

  // ── Environments ──────────────────────────────────────────────────────────
  {
    id: 'ci_env_factory',
    name: 'Abandoned Factory Floor',
    type: 'environment',
    summary: 'Industrial decay, dust particles, overwhelming scale.',
    phrases: [
      'abandoned factory floor',
      'rusted metal, cracked concrete, industrial decay',
      'dust particles in shafts of light, overwhelming scale',
    ],
  },
  {
    id: 'ci_env_nightmarket',
    name: 'Dense Night Market',
    type: 'environment',
    summary: 'Crowded, alive, warm light sources everywhere.',
    phrases: [
      'dense night market',
      'crowded narrow lanes, warm lantern glow',
      'steam, smoke, layers of texture and noise',
    ],
  },
  {
    id: 'ci_env_coastal',
    name: 'Empty Coastal Road',
    type: 'environment',
    summary: 'Open, windswept, melancholic distance.',
    phrases: [
      'empty coastal highway',
      'windswept, grey sky, open horizon',
      'salt air, solitude, melancholic distance',
    ],
  },

  // ── Wardrobe ──────────────────────────────────────────────────────────────
  {
    id: 'ci_ward_field',
    name: 'Worn Field Jacket',
    type: 'wardrobe',
    summary: 'Utilitarian, lived-in, carrying history.',
    phrases: [
      'worn olive field jacket',
      'utilitarian pockets, faded patches',
      'lived-in fabric, a garment with history',
    ],
  },
  {
    id: 'ci_ward_linen',
    name: 'Soft Linen Layer',
    type: 'wardrobe',
    summary: 'Relaxed, natural, quiet elegance.',
    phrases: [
      'loose soft linen top',
      'natural fabric drape, relaxed fit',
      'muted earthy tones, quiet elegance',
    ],
  },
  {
    id: 'ci_ward_tailored',
    name: 'Dark Tailoring',
    type: 'wardrobe',
    summary: 'Sharp, controlled, restrained formality.',
    phrases: [
      'dark tailored jacket',
      'sharp lapels, precise fit',
      'restrained formality, controlled presence',
    ],
  },

  // ── Composition ───────────────────────────────────────────────────────────
  {
    id: 'ci_comp_closeup',
    name: 'Intimate Close-Up',
    type: 'composition',
    summary: 'Close, personal, shallow depth of field.',
    phrases: [
      'intimate close-up framing',
      'shallow depth of field, subject fills frame',
      'personal proximity, detail over context',
    ],
  },
  {
    id: 'ci_comp_environmental',
    name: 'Environmental Portrait',
    type: 'composition',
    summary: 'Subject in context, space to breathe.',
    phrases: [
      'environmental portrait framing',
      'subject within their space, room to breathe',
      'context visible, world around the person',
    ],
  },
  {
    id: 'ci_comp_low',
    name: 'Low Angle',
    type: 'composition',
    summary: 'Looking up, weight and presence.',
    phrases: [
      'low angle looking up at subject',
      'subject has weight and presence',
      'sky or ceiling visible, ground-level perspective',
    ],
  },

  // ── Mood ──────────────────────────────────────────────────────────────────
  {
    id: 'ci_mood_unease',
    name: 'Quiet Unease',
    type: 'mood',
    summary: 'Tension without a visible cause.',
    phrases: [
      'quiet unease',
      'tension without visible cause',
      'something is slightly wrong, off-balance atmosphere',
    ],
  },
  {
    id: 'ci_mood_tender',
    name: 'Tender Distance',
    type: 'mood',
    summary: 'Warmth held at arm\'s length.',
    phrases: [
      'tender emotional distance',
      'warmth withheld, connection almost made',
      'longing, careful, soft sadness',
    ],
  },
  {
    id: 'ci_mood_clarity',
    name: 'Fractured Clarity',
    type: 'mood',
    summary: 'Sharp detail amid emotional turbulence.',
    phrases: [
      'fractured clarity',
      'hyper-sharp detail amid emotional fog',
      'things are very clear and very uncertain at once',
    ],
  },

  // ── Worlds ────────────────────────────────────────────────────────────────
  {
    id: 'ci_world_neon_city',
    name: 'Neon City',
    type: 'aura',
    summary: 'Rain-soaked cyberpunk streets, neon reflections, human density.',
    phrases: [
      'rain-slicked streets reflecting neon',
      'dense urban sprawl, layered signage',
      'steam rising from grates',
      'crowd of indifferent faces',
      'corporate towers above, street life below',
    ],
  },
  {
    id: 'ci_world_quiet_village',
    name: 'Quiet Village',
    type: 'aura',
    summary: 'Slow rural life, old materials, forgotten pace.',
    phrases: [
      'small village, unpaved roads',
      'old stone buildings, worn wood',
      'slow pace, distant fields',
      'morning light through shutters',
      'handmade things, practical beauty',
    ],
  },
  {
    id: 'ci_world_deep_forest',
    name: 'Deep Forest',
    type: 'aura',
    summary: 'Ancient trees, diffused green light, something watching.',
    phrases: [
      'ancient forest, towering canopy',
      'diffused green light filtering down',
      'moss-covered roots, damp earth',
      'silence broken only by distant birds',
      'feeling of being observed',
    ],
  },

  {
    id: 'ci_world_brutalist_city',
    name: 'Brutalist City',
    type: 'aura',
    summary: 'Overwhelming concrete, Soviet-era scale, indifferent architecture.',
    phrases: [
      'massive brutalist concrete structures',
      'overwhelming scale, human figures dwarfed',
      'grey sky, no softening greenery',
      'monumental stairways, empty plazas',
      'architecture that does not care if you are there',
    ],
  },
  {
    id: 'ci_world_desert_highway',
    name: 'Desert Highway',
    type: 'aura',
    summary: 'Flat heat, infinite road, nothing for miles.',
    phrases: [
      'long straight highway disappearing into heat haze',
      'flat desert on both sides, scrub brush',
      'bleached sky, brutal midday sun',
      'telephone poles counting the distance',
      'no destination visible, no origin visible',
    ],
  },
  {
    id: 'ci_world_underwater_ruin',
    name: 'Underwater Ruin',
    type: 'aura',
    summary: 'Submerged architecture, filtered blue light, absolute silence.',
    phrases: [
      'submerged ruins, ancient stone columns',
      'deep blue-green water filtering light',
      'silt drifting slowly through shafts of light',
      'coral growing over carved doorways',
      'absolute stillness, pressure of depth',
    ],
  },
  {
    id: 'ci_world_winter_city',
    name: 'Winter City',
    type: 'aura',
    summary: 'Snow-covered streets, muffled sound, amber windows from outside.',
    phrases: [
      'snow-covered city streets at night',
      'amber light from windows against blue-grey dark',
      'sound muffled, footsteps soft',
      'breath visible, cold sharp and clean',
      'storefronts lit, few people out',
    ],
  },
  {
    id: 'ci_world_rooftop',
    name: 'Rooftop',
    type: 'aura',
    summary: 'Above the city, between buildings and sky, neither inside nor out.',
    phrases: [
      'rooftop above the city',
      'skyline visible, distance and height',
      'wind, open air, exposed',
      'city noise from below, muffled',
      'between the building and the sky, suspended',
    ],
  },

  // ── Negative ──────────────────────────────────────────────────────────────
  {
    id: 'ci_neg_quality',
    name: 'Quality Baseline',
    type: 'negative',
    summary: 'Standard quality and anatomy exclusions.',
    phrases: [
      'blurry, out of focus, motion blur',
      'text, watermark, signature, logo',
      'jpeg artifacts, compression noise',
      'deformed, distorted, disfigured',
      'extra limbs, missing limbs, bad anatomy',
    ],
  },
  {
    id: 'ci_neg_clean',
    name: 'Clean Composition',
    type: 'negative',
    summary: 'No clutter, no multiple subjects.',
    phrases: [
      'cluttered background, busy composition',
      'multiple subjects, crowd',
      'split composition, double exposure',
    ],
  },
];
