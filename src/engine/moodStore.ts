import type { MoodPreset, MoodPresetInput, MoodStore } from '../types';

const MOOD_STORE_KEY = 'promptgen:moods:v1';
const MOOD_STORE_BACKUP_KEY = 'promptgen:moods:backup:v1';
const MOOD_SEED_FLAG_KEY = 'promptgen:moods:seeded:v2';
const MOOD_SEED_FLAG_KEY_V3 = 'promptgen:moods:seeded:v3';
const MOOD_SEED_FLAG_KEY_V4 = 'promptgen:moods:seeded:v4';
const MOOD_SEED_FLAG_KEY_V5 = 'promptgen:moods:seeded:v5';
const MOOD_SEED_FLAG_KEY_V6 = 'promptgen:moods:seeded:v6';
const MOOD_SEED_FLAG_KEY_V7 = 'promptgen:moods:seeded:v7';
const MOOD_SEED_FLAG_KEY_V8 = 'promptgen:moods:seeded:v8';
const MOOD_SEED_FLAG_KEY_V9 = 'promptgen:moods:seeded:v9';

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

const sortItems = <T extends MoodPreset>(items: T[]): T[] =>
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

const sanitizeItem = (value: unknown): MoodPreset | null => {
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

const V5_SEED_MOODS: MoodPreset[] = [
  {
    id: 'mood_ny_neon_melancholy',
    name: 'Neon Melancholy',
    summary: 'Beautiful loneliness under electric light — the quiet ache of a glowing city that never looks back at you.',
    phrases: [
      'beautiful loneliness under electric light, a glowing city indifferent to the figure within it',
      'quiet ache and longing, solitude made gorgeous by colour',
      'the specific melancholy of being awake when everything else is asleep',
      'warmth visible everywhere but unreachable, glass between you and the glow',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'mood_ny_haunted_serenity',
    name: 'Haunted Serenity',
    summary: 'A spirit perfectly at peace among the living who cannot see it — calm, patient, slightly sorrowful presence.',
    phrases: [
      'a calm patient presence moving among the living who cannot perceive it',
      'serene rather than vengeful, sorrow worn smooth by time',
      'stillness in the centre of a moving city, unbothered and apart',
      'the gentle melancholy of a ghost who has stopped trying to be noticed',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'mood_ny_electric_menace',
    name: 'Electric Menace',
    summary: 'Predatory energy crackling under the neon — a yokai about to drop the human disguise, tension wound tight.',
    phrases: [
      'predatory tension wound tight beneath a thin human surface',
      'a disguise about to slip, something hungry waiting just behind the eyes',
      'electric charge in the air, the moment before the mask comes off',
      'sharp, coiled, dangerous — the city as hunting ground',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'mood_ny_midnight_mischief',
    name: 'Midnight Mischief',
    summary: 'Playful trickster delight — a spirit having fun at the city\'s expense, grinning, light-footed, harmless until it isn\'t.',
    phrases: [
      'playful trickster delight, a spirit enjoying itself at the city\'s expense',
      'light-footed mischief, a grin that promises minor chaos',
      'cheerful and quick, harmless on the surface with a sly edge underneath',
      'the buoyant energy of a prank in progress under the neon',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'mood_ny_rain_soaked_calm',
    name: 'Rain-Soaked Calm',
    summary: 'The hushed peace of heavy rain at night — sound muffled, world softened, a meditative stillness in the downpour.',
    phrases: [
      'the hushed meditative peace of heavy rain at night, all sound muffled',
      'the world softened and slowed, edges blurred by water',
      'contemplative stillness, breath held, the city washed quiet',
      'a private calm found inside the noise of the downpour',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
  {
    id: 'mood_ny_festival_fever',
    name: 'Festival Fever',
    summary: 'Frenetic matsuri energy — crowds, lanterns, music and spirits mingling, joy edged with the wildness of a night out of bounds.',
    phrases: [
      'frenetic festival energy, crowds and lanterns and overlapping music',
      'joy edged with wildness, a night where the usual rules are suspended',
      'spirits and humans mingling unnoticed in the press of bodies',
      'heat, colour, motion — euphoria with an undertow of the uncanny',
    ],
    createdAt: SEED_TS_5,
    updatedAt: SEED_TS_5,
  },
];

const DEFAULT_SEED_MOODS: MoodPreset[] = [
  {
    id: 'mood_seed_melancholic_quiet',
    name: 'Melancholic and Quiet',
    summary: 'Subdued color, stillness, introspective weight without drama.',
    phrases: [
      'melancholic quiet mood',
      'subdued color, stillness in the image',
      'introspective, weight without drama',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'mood_seed_tense_foreboding',
    name: 'Tense and Foreboding',
    summary: 'Uneasy stillness, something about to break, pressure in the composition.',
    phrases: [
      'tense foreboding atmosphere',
      'uneasy stillness, something about to break',
      'pressure in the composition, held breath',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'mood_seed_warm_intimate',
    name: 'Warm and Intimate',
    summary: 'Soft closeness, human scale, comfort and presence.',
    phrases: [
      'warm intimate mood',
      'soft closeness, human scale',
      'comfort and presence, private moment',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'mood_seed_triumphant_epic',
    name: 'Triumphant and Epic',
    summary: 'Grand scale, momentum in the composition, heroic register.',
    phrases: [
      'triumphant epic mood',
      'grand scale, momentum in the composition',
      'heroic register, expansive energy',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'mood_seed_strange_dreamlike',
    name: 'Strange and Dreamlike',
    summary: 'Logic slightly wrong, uncanny stillness, familiar made alien.',
    phrases: [
      'strange dreamlike atmosphere',
      'logic slightly wrong, uncanny stillness',
      'surreal undertone, familiar made alien',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'mood_seed_cold_remote',
    name: 'Cold and Remote',
    summary: 'Distance in the framing, emotional remove, austere.',
    phrases: [
      'cold remote detached mood',
      'distance in the framing, emotional remove',
      'austere, minimal warmth',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'mood_seed_ancient_and_terrible',
    name: 'Ancient and Terrible',
    summary: 'The weight of geological time, patient menace — a presence that has outlasted civilizations and expects to outlast more.',
    phrases: [
      'the weight of geological time, patient and unhurried menace',
      'a presence that predates civilization and expects to outlast it',
      'no anger, only the quiet inevitability of something vast and permanent',
      'awe without warmth, power without display',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'mood_seed_storm_born_fury',
    name: 'Storm-Born Fury',
    summary: 'Raw elemental violence at its peak — the world tearing itself apart, nothing withheld.',
    phrases: [
      'raw elemental violence, nothing withheld or restrained',
      'the world at the peak of its fury, tearing at itself',
      'chaos made physical, energy beyond what the frame can hold',
      'terrifying and magnificent in equal measure',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'mood_seed_cold_sovereign',
    name: 'Cold Sovereign Stillness',
    summary: 'Regal quiet authority — the certainty of something that has never been challenged and never needed to display its power.',
    phrases: [
      'regal stillness, absolute quiet authority',
      'the certainty of something that has never been challenged',
      'power held completely in reserve, no display necessary',
      'cold composure, the world arranged around its presence',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'mood_seed_mythic_awe',
    name: 'Mythic Awe',
    summary: 'The feeling of encountering something that should not exist — wonder and terror arriving simultaneously.',
    phrases: [
      'the feeling of encountering something that should not exist',
      'wonder and terror arriving at the same moment, inseparable',
      'the viewer reduced to witness, all agency dissolved',
      'mythic scale, the world reorganized by the presence of something impossible',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
  {
    id: 'mood_seed_dormant_thunder',
    name: 'Dormant Thunder',
    summary: 'The charged silence before the strike — potential so total it changes the quality of the air.',
    phrases: [
      'charged silence, the absolute stillness before the strike',
      'potential so total it changes the quality of the air and light',
      'everything held in suspension, nothing yet released',
      'the world waiting, the next moment already decided but not yet arrived',
    ],
    createdAt: SEED_TS_3,
    updatedAt: SEED_TS_3,
  },
];

const V3_SEED_MOODS: MoodPreset[] = [
  {
    id: 'mood_seed_weight_of_recognition',
    name: 'The Weight of Recognition',
    summary: 'The specific quality of meeting an equal after centuries alone — not challenge, not submission, only the cold acknowledgment of two things that understand each other completely.',
    phrases: [
      'the quality of meeting an equal after centuries alone — recognition, not challenge',
      'neither aggression nor submission, only the absolute stillness of mutual understanding',
      'ancient and cold, coiled but not tense, waiting without impatience',
      'this may never become a fight — both know exactly what it would cost',
      'the heaviest silence — not empty, but full of what is already decided',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
];

const V4_SEED_MOODS: MoodPreset[] = [
  {
    id: 'mood_aiw_uncanny_whimsy',
    name: 'Uncanny Whimsy',
    summary: 'Charming on the surface, slightly wrong underneath — something in the proportion or logic that presses gently against comfort.',
    phrases: [
      'charming surface with a pressure underneath it — nothing quite wrong enough to name',
      'delight and unease occupying the same space without resolving',
      'the specific quality of a smile that is two degrees too wide',
      'bright colours, friendly forms, and something in the arrangement that does not add up',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
  {
    id: 'mood_aiw_victorian_dark',
    name: 'Victorian Dark',
    summary: 'The politeness is real but the darkness underneath it is older — severity dressed in propriety.',
    phrases: [
      'propriety maintained over something older and considerably darker',
      'the particular severity of an era that expressed cruelty through procedure',
      'formal, correct, and genuinely threatening — the rules are the danger',
      'deep shadow and warm lamplight, both immaculate and cold',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
  {
    id: 'mood_aiw_absurdist_calm',
    name: 'Absurdist Calm',
    summary: 'The rules stopped applying long ago and everyone has made their peace with it — a deep unruffled acceptance of the inexplicable.',
    phrases: [
      'the deep calm of a world where the rules stopped applying and no one minds',
      'inexplicable things treated with complete matter-of-factness',
      'no anxiety about the impossible — only mild interest, mild impatience, mild tea',
      'the atmosphere of a situation that has always been like this and sees no reason to change',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
  {
    id: 'mood_aiw_childlike_wonder',
    name: 'Childlike Wonder',
    summary: 'Genuinely open to the strange — curiosity before caution, the world large and interesting and not yet required to make sense.',
    phrases: [
      'genuinely open to the strange — curiosity arriving well before caution',
      'the world large, interesting, and not yet required to make sense',
      'delight in the specific, absorption in the detail, no impatience for the meaning',
      'wonder without naivety — attentive, present, and ready for the next impossible thing',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
  {
    id: 'mood_aiw_dream_logic',
    name: 'Dream Logic',
    summary: 'The internal consistency is perfect while you are in it — each thing following from the last by rules that cannot be examined directly.',
    phrases: [
      'internal consistency perfect while you are inside it',
      'each thing following from the last by rules that shift if examined too directly',
      'no gap between cause and consequence — only the sequence, and the certainty that it is right',
      'the particular confidence of a dream that has not yet noticed it is one',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
  {
    id: 'mood_aiw_judgment_weight',
    name: 'The Weight of Judgment',
    summary: 'Under evaluation — the verdict is already written and the proceedings are its architecture.',
    phrases: [
      'under evaluation, every surface observed, every gesture recorded',
      'the verdict already written — the proceedings are its formal architecture',
      'formality as pressure, procedure as sentence',
      'the specific weight of being judged by a court that has already decided',
    ],
    createdAt: SEED_TS_4,
    updatedAt: SEED_TS_4,
  },
];

// V6 — Solarpunk Bloom: warm, hopeful, communal emotional registers.
const V6_SEED_MOODS: MoodPreset[] = [
  {
    id: 'mood_sb_hopeful_dawn',
    name: 'Hopeful Dawn',
    summary: 'Bright early optimism — the clean uplift of a new day in a world that is being made better, light and forward-looking.',
    phrases: [
      'bright hopeful optimism, the clean uplift of a fresh new morning',
      'a sense of a world being mended, forward-looking and warm',
      'gentle excitement, possibility in the air',
      'light, open-hearted, quietly inspiring',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'mood_sb_quiet_cultivation',
    name: 'Quiet Cultivation',
    summary: 'The patient calm of tending — slow, absorbed, content; the meditative peace of growing something with care.',
    phrases: [
      'the patient meditative calm of tending growing things',
      'slow absorbed contentment, hands busy and mind at rest',
      'unhurried care, attention given freely to small living tasks',
      'a peaceful, grounded, deeply settled feeling',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'mood_sb_communal_warmth',
    name: 'Communal Warmth',
    summary: 'The glow of shared work and belonging — many hands, easy laughter, the warmth of a community at ease with itself.',
    phrases: [
      'the warm glow of shared work and belonging, many hands together',
      'easy laughter and unforced companionship',
      'a community at ease with itself, generous and welcoming',
      'cosy collective warmth, nobody alone',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'mood_sb_verdant_serenity',
    name: 'Verdant Serenity',
    summary: 'Deep green calm — the restorative stillness of being surrounded by growth, breath slowing, the world gone gentle and alive.',
    phrases: [
      'deep restorative green calm, surrounded by living growth',
      'breath slowing, the stillness of a place that is thriving',
      'serene and lush, the gentle aliveness of a garden',
      'tranquil, restorative, quietly abundant',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'mood_sb_inventive_wonder',
    name: 'Inventive Wonder',
    summary: 'The bright curiosity of making — the delighted focus of a tinkerer mid-idea, problem-solving as play.',
    phrases: [
      'bright inventive curiosity, the delight of figuring something out',
      'playful focused problem-solving, ideas catching light',
      'the cheerful energy of making and mending',
      'engaged, optimistic, a little mischievous with possibility',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
  {
    id: 'mood_sb_festival_abundance',
    name: 'Festival Abundance',
    summary: 'Joyful harvest celebration — petals and music and overflowing tables, gratitude turned to dancing, generous and alive.',
    phrases: [
      'joyful harvest-festival abundance, petals and music and overflowing tables',
      'gratitude turning to dancing, generous and overflowing',
      'bright collective celebration, colour and laughter everywhere',
      'warm euphoric plenty, a season giving back its best',
    ],
    createdAt: SEED_TS_6,
    updatedAt: SEED_TS_6,
  },
];

// V7 — Porcelain Court: uncanny, melancholy, genteel-sinister registers.
const V7_SEED_MOODS: MoodPreset[] = [
  {
    id: 'mood_pc_uncanny_elegance',
    name: 'Uncanny Elegance',
    summary: 'Beautiful and wrong — exquisite refinement with something not-quite-alive underneath, grace that raises the hair on your neck.',
    phrases: [
      'beautiful and subtly wrong, exquisite refinement with something not-quite-alive beneath',
      'flawless grace that raises a quiet dread',
      'the uncanny valley of a too-perfect, too-still elegance',
      'lovely on the surface, deeply unsettling underneath',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'mood_pc_faded_grandeur',
    name: 'Faded Grandeur',
    summary: 'The melancholy of magnificence in decay — gilt going to dust, splendour outliving its purpose, beauty in the rot.',
    phrases: [
      'the melancholy of magnificence fallen into decay',
      'gilt and silk going quietly to dust, splendour outliving its purpose',
      'a wistful grandeur, beauty made poignant by ruin',
      'opulent, mournful, and slowly crumbling',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'mood_pc_frozen_stillness',
    name: 'Frozen Stillness',
    summary: 'A held breath — everything stopped mid-gesture, time suspended, the silence of a paused music box.',
    phrases: [
      'a held breath, everything stopped mid-gesture and suspended in time',
      'absolute motionless silence, the pause of a stilled music box',
      'figures frozen as if the moment will never resume',
      'tense, airless, expectant stillness',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'mood_pc_dollhouse_dread',
    name: "Doll-House Dread",
    summary: 'The quiet horror of being watched by the inanimate — too many glass eyes, the sense that the dolls move when you look away.',
    phrases: [
      'the quiet horror of being watched by inanimate things',
      'too many glass eyes turned toward the viewer, patient and fixed',
      'the creeping sense the dolls move the moment you look away',
      'soft, suffocating, low-grade dread',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'mood_pc_wistful_nostalgia',
    name: 'Wistful Nostalgia',
    summary: 'A tender ache for something lost — childhood, a vanished world, the bittersweet sweetness of old toys and faded play.',
    phrases: [
      'a tender bittersweet ache for something long lost',
      'the sweet sorrow of old toys and faded childhood play',
      'gentle nostalgia for a vanished, gentler world',
      'fond, melancholy, and quietly heartbreaking',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
  {
    id: 'mood_pc_genteel_menace',
    name: 'Genteel Menace',
    summary: 'Politeness with teeth — perfect manners barely covering a threat, a smile that has already decided your fate.',
    phrases: [
      'impeccable politeness with a threat coiled just beneath it',
      'perfect courtly manners barely concealing menace',
      'a serene smile that has already decided your fate',
      'refined, controlled, and quietly dangerous',
    ],
    createdAt: SEED_TS_7,
    updatedAt: SEED_TS_7,
  },
];

// V8 — Dust Run: harsh, lawless, weary-survivor registers.
const V8_SEED_MOODS: MoodPreset[] = [
  {
    id: 'mood_dr_sunbaked_desolation',
    name: 'Sun-Baked Desolation',
    summary: 'The vast indifferent emptiness of the waste — silence, glare, and the smallness of one figure under an enormous merciless sky.',
    phrases: [
      'vast indifferent emptiness, a tiny figure under an enormous sky',
      'silence and glare, the loneliness of the open waste',
      'heat-stunned stillness, nothing moving for miles',
      'desolate, immense, and pitiless',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'mood_dr_standoff_tension',
    name: 'Standoff Tension',
    summary: 'The held breath before the draw — narrowed eyes, a hand near a gun, the whole world gone silent and waiting to break.',
    phrases: [
      'the held breath before the draw, taut and silent',
      'narrowed eyes, a hand hovering near a gun',
      'the whole world stopped, waiting for the first move',
      'coiled, electric, a heartbeat from violence',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'mood_dr_outlaw_swagger',
    name: 'Outlaw Swagger',
    summary: 'Cocky lawless bravado — a dangerous grin, a loose easy stance, the confidence of someone with nothing to lose and good aim.',
    phrases: [
      'cocky lawless bravado, a dangerous easy grin',
      'a loose confident swagger, nothing left to lose',
      'reckless charm with a gun on the hip',
      'bold, defiant, and trouble-loving',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'mood_dr_weary_survival',
    name: 'Weary Survival',
    summary: 'The bone-deep tiredness of just enduring — cracked lips, hollow eyes, grit and resignation, going on because stopping means dying.',
    phrases: [
      'bone-deep tiredness, the grind of simply enduring',
      'cracked lips and hollow eyes, dust in every line',
      'grim resignation, going on because stopping is death',
      'worn-down, parched, and stubbornly alive',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'mood_dr_lawless_menace',
    name: 'Lawless Menace',
    summary: 'Predatory danger in a place with no rules — cruelty without consequence, the threat of those who take what they want.',
    phrases: [
      'predatory danger in a place with no law',
      'cruelty without consequence, menace that takes what it wants',
      'a hostile, violent edge under the dust',
      'brutal, lawless, and unsafe',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
  {
    id: 'mood_dr_last_hope_grit',
    name: 'Last-Hope Grit',
    summary: 'Defiant resolve against impossible odds — a jaw set, a stand made, the stubborn human refusal to give the desert the last word.',
    phrases: [
      'defiant resolve against impossible odds, a jaw set hard',
      'the stubborn refusal to let the waste win',
      'one last stand, courage scraped from nothing',
      'hardscrabble, determined, and quietly heroic',
    ],
    createdAt: SEED_TS_8,
    updatedAt: SEED_TS_8,
  },
];

// V9 — Deep Signal: isolated, dread-soaked, eldritch-awe registers.
const V9_SEED_MOODS: MoodPreset[] = [
  {
    id: 'mood_ds_crushing_isolation',
    name: 'Crushing Isolation',
    summary: 'Utterly alone under miles of water — the cold, pressing solitude of the deep, no rescue, no surface, only the dark and the breathing.',
    phrases: [
      'utterly alone under miles of crushing water, no rescue coming',
      'the cold pressing solitude of the deep, no surface to reach',
      'silence broken only by one\'s own breathing',
      'isolated, weighed-down, and small',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'mood_ds_creeping_dread',
    name: 'Creeping Dread',
    summary: 'The slow certainty that something is wrong — a wrongness building at the edges, the hair rising before anything has happened.',
    phrases: [
      'the slow building certainty that something is deeply wrong',
      'wrongness gathering at the edges of perception',
      'the hair rising before anything has happened',
      'quiet, mounting, inescapable dread',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'mood_ds_bioluminescent_wonder',
    name: 'Bioluminescent Wonder',
    summary: 'Awe at the impossible beauty of the deep — glowing life blooming in the black, breathtaking and serene before the dread sets in.',
    phrases: [
      'awe at the impossible beauty of glowing life in the black',
      'breathtaking serene wonder, colour blooming in the dark',
      'a hushed reverence for the alien deep',
      'beautiful, tranquil, and otherworldly',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'mood_ds_claustrophobic_panic',
    name: 'Claustrophobic Panic',
    summary: 'The walls closing in as the water rises — racing pulse, flooding corridors, no way out and the air running short.',
    phrases: [
      'the walls closing in as cold water rises',
      'racing pulse, flooding corridors, the air running short',
      'frantic trapped energy with nowhere to run',
      'tight, breathless, rising panic',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'mood_ds_eldritch_awe',
    name: 'Eldritch Awe',
    summary: 'The mind buckling before the vast and wrong — terror and reverence fused, the sublime horror of something far too large and old.',
    phrases: [
      'the mind buckling before something vast and wrong',
      'terror and reverence fused into sublime horror',
      'awe at a presence far too large and old to comprehend',
      'overwhelming, cosmic, and unmooring',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
  {
    id: 'mood_ds_cold_abyssal_calm',
    name: 'Cold Abyssal Calm',
    summary: 'The eerie peace of the deepest dark — a still, weightless, indifferent calm, the seductive quiet of giving in to the depths.',
    phrases: [
      'the eerie weightless peace of the deepest dark',
      'a still, cold, indifferent calm with no urgency left',
      'the seductive quiet of surrendering to the depths',
      'serene, detached, and faintly sinister',
    ],
    createdAt: SEED_TS_9,
    updatedAt: SEED_TS_9,
  },
];

const writeItems = (items: MoodPreset[]) => {
  const payload: MoodStore = { version: 1, items: sortItems(items) };
  writeStorageItem(MOOD_STORE_KEY, payload);
  writeStorageItem(MOOD_STORE_BACKUP_KEY, payload);
};

const maybeApplySeed = (items: MoodPreset[]): MoodPreset[] => {
  let result = items;

  if (readStorageItem(MOOD_SEED_FLAG_KEY) === null) {
    writeStorageItem(MOOD_SEED_FLAG_KEY, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = DEFAULT_SEED_MOODS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(MOOD_SEED_FLAG_KEY_V3) === null) {
    writeStorageItem(MOOD_SEED_FLAG_KEY_V3, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V3_SEED_MOODS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(MOOD_SEED_FLAG_KEY_V4) === null) {
    writeStorageItem(MOOD_SEED_FLAG_KEY_V4, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V4_SEED_MOODS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(MOOD_SEED_FLAG_KEY_V5) === null) {
    writeStorageItem(MOOD_SEED_FLAG_KEY_V5, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V5_SEED_MOODS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(MOOD_SEED_FLAG_KEY_V6) === null) {
    writeStorageItem(MOOD_SEED_FLAG_KEY_V6, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V6_SEED_MOODS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(MOOD_SEED_FLAG_KEY_V7) === null) {
    writeStorageItem(MOOD_SEED_FLAG_KEY_V7, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V7_SEED_MOODS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(MOOD_SEED_FLAG_KEY_V8) === null) {
    writeStorageItem(MOOD_SEED_FLAG_KEY_V8, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V8_SEED_MOODS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(MOOD_SEED_FLAG_KEY_V9) === null) {
    writeStorageItem(MOOD_SEED_FLAG_KEY_V9, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V9_SEED_MOODS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  return result;
};

const readItems = (): MoodPreset[] => {
  const candidates = [
    parseJson(readStorageItem(MOOD_STORE_KEY)),
    parseJson(readStorageItem(MOOD_STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const raw = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.items) ? candidate.items : null);
    if (!raw) continue;
    const parsed = sortItems(
      raw.map(sanitizeItem).filter((i): i is MoodPreset => Boolean(i))
    );
    if (parsed.length > 0 || raw.length === 0) return maybeApplySeed(parsed);
  }

  return maybeApplySeed([]);
};

const sanitizeInput = (input: MoodPresetInput): MoodPresetInput => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('Mood preset name is required.');
  const phrases = sanitizeStringArray(input.phrases);
  if (phrases.length === 0) throw new Error('At least one phrase is required.');
  return {
    name,
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
    phrases,
  };
};

export async function listMoodPresets(): Promise<MoodPreset[]> {
  return readItems();
}

export async function createMoodPreset(input: MoodPresetInput): Promise<MoodPreset> {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: MoodPreset = {
    id: createId('mood'),
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

export async function updateMoodPreset(id: string, input: MoodPresetInput): Promise<MoodPreset> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Mood preset id is required.');
  const sanitized = sanitizeInput(input);
  const items = readItems();
  const existing = items.find(i => i.id === itemId);
  if (!existing) throw new Error('Mood preset not found.');
  const updated: MoodPreset = {
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

export async function deleteMoodPreset(id: string): Promise<void> {
  const itemId = id.trim();
  if (!itemId) throw new Error('Mood preset id is required.');
  const items = readItems();
  writeItems(items.filter(i => i.id !== itemId));
}
