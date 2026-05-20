export type ObjectIdentity = {
  id: string;
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  phrases: string[];
  createdAt: number;
  updatedAt: number;
};

export type ObjectIdentityInput = {
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  phrases: string[];
};

const STORE_KEY = 'promptgen:objects:v1';
const BACKUP_KEY = 'promptgen:objects:backup:v1';
const SEED_FLAG_KEY = 'promptgen:objects:seeded:v1';
const SEED_FLAG_KEY_V2 = 'promptgen:objects:seeded:v2';
const SEED_TS = 1748304000000;
const SEED_TS_2 = 1748476800000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const createId = (): string => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `obj_${crypto.randomUUID()}`;
    }
  } catch {
    // ignore
  }
  return `obj_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const sanitizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => (typeof item === 'string' ? normalizeText(item) : ''))
    .filter(Boolean);
};

const sanitizeItem = (value: unknown): ObjectIdentity | null => {
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

const sortItems = (items: ObjectIdentity[]): ObjectIdentity[] =>
  [...items].sort((a, b) => {
    if (b.updatedAt !== a.updatedAt) return b.updatedAt - a.updatedAt;
    if (b.createdAt !== a.createdAt) return b.createdAt - a.createdAt;
    return a.name.localeCompare(b.name);
  });

const readStorageItem = (key: string): string | null => {
  try { return window.localStorage.getItem(key); } catch { return null; }
};

const writeStorageItem = (key: string, value: unknown) => {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
};

const parseJson = (raw: string | null): unknown => {
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

const readItems = (): ObjectIdentity[] => {
  const candidates = [
    parseJson(readStorageItem(STORE_KEY)),
    parseJson(readStorageItem(BACKUP_KEY)),
  ];
  for (const candidate of candidates) {
    if (!candidate) continue;
    const raw = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.items) ? candidate.items : null);
    if (!raw) continue;
    const parsed = sortItems(
      raw.map(sanitizeItem).filter((i): i is ObjectIdentity => Boolean(i))
    );
    if (parsed.length > 0 || raw.length === 0) return maybeApplySeed(parsed);
  }
  return maybeApplySeed([]);
};

const DEFAULT_SEED_OBJECTS: ObjectIdentity[] = [
  {
    id: 'object_aiw_pocket_watch',
    name: "The White Rabbit's Pocket Watch",
    summary: 'A gold pocket watch, open, its hands in disagreement with every clock you have seen, belonging to someone who is always late.',
    phrases: [
      'an open gold pocket watch, engraved case, the hands at an angle no real time occupies',
      'worn chain looped over a waistcoat button, the weight of something checked too often',
      'the crystal face slightly fogged, the numbers present and the time absent',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'object_aiw_hookah',
    name: "The Caterpillar's Hookah",
    summary: 'A tall ornate hookah emitting blue smoke — still lit, still drawing, the occupant recently or not recently present.',
    phrases: [
      'tall ornate hookah on a flat mushroom surface, blue smoke rising in slow deliberate columns',
      'the bowl still lit, the hose draped down and slightly coiled, the smoke forming shapes before dispersing',
      'elaborate painted glasswork in deep blue and gold, designed for extended and unhurried use',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'object_aiw_playing_cards',
    name: 'Playing Card Soldiers',
    summary: 'Animated playing cards deployed as soldiers — flat-painted, rigidly upright, serving the Queen with the discipline of things that know the alternative.',
    phrases: [
      'playing card soldiers standing at attention, their suit emblems flat and precise on their chests',
      'red and white paint, the geometry of a card applied to a standing body with complete commitment',
      'spades, hearts, diamonds, clubs — each figure in formation, posture rigid, opinions suppressed',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'object_aiw_mad_tea_service',
    name: 'The Mad Tea Service',
    summary: 'The infinite mismatched tea service of the perpetual party — cups in every pattern and state, none of them finished, all of them present.',
    phrases: [
      'dozens of mismatched teacups across a long table — painted china, cracked bone, plain tin, none of them matching',
      'towers of stacked saucers between the cups, a teapot at the center still pouring into something already full',
      'bread and butter, jam, scones going stale — the hospitality abundant and the moment frozen at six o\'clock',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'object_aiw_painted_roses',
    name: 'The Painted Roses',
    summary: 'White roses being painted red — brushes still wet, the paint slightly uneven, the card soldiers working with the urgency of people who know what the alternative looks like.',
    phrases: [
      'white rose bushes, several blossoms hastily painted red, the brushwork covering but not perfectly',
      'wet paint brushes leaned against the base of the bush, the red not quite dry in places',
      'the white still visible at the petal edges where the brush did not reach — the work in progress',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'object_aiw_flamingo_mallet',
    name: 'The Flamingo Mallet',
    summary: 'A pink flamingo deployed as a croquet mallet — neck bent in an uncertain arc, participating in the game with visible reservations.',
    phrases: [
      'a pink flamingo held as a croquet mallet, neck curved to aim, the expression suggesting reservations about this arrangement',
      'the plumage slightly ruffled, the beak at the striking end, the legs loosely folded out of the way',
      'an entirely cooperative flamingo, which is different from a willing one',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'object_aiw_drink_me_bottle',
    name: 'The Drink Me Bottle',
    summary: 'A small glass bottle with a paper label tied at the neck reading DRINK ME — hand lettered, the instruction absolute.',
    phrases: [
      'a small glass bottle, clear, a paper label tied at the neck with fine string',
      'the words DRINK ME hand lettered on the label in careful ink, slightly uneven, entirely sincere',
      'the contents visible — liquid, colourless, not quite any colour you could name precisely',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'object_aiw_eat_me_cake',
    name: 'The Eat Me Cake',
    summary: 'A small cake on a white plate, the words EAT ME written across its surface in currants — precise, patient, unambiguous.',
    phrases: [
      'a small round cake on a white plate, the surface iced and smooth',
      'the words EAT ME spelled in currants across the top, each letter placed with care',
      'the cake otherwise unremarkable, the instruction the only unusual element, the instruction everything',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'object_aiw_looking_glass',
    name: 'The Looking Glass',
    summary: 'An ornate tarnished wall mirror — the reflection extending further than the room allows, lit from a source with no counterpart on this side.',
    phrases: [
      'an ornate wall mirror in a heavily tarnished silver frame, the glass old and slightly warm in tone',
      'the reflection showing the same room and not the same room — the furniture present but rearranged in a way that might be a trick of angle',
      'a corridor visible in the glass extending further than the wall permits, lit from no matching source',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'object_aiw_cheshire_grin',
    name: "The Cheshire Cat's Grin",
    summary: 'The grin remaining after the cat has gone — present in the space between branches, a curve of white visible before the face, and after it.',
    phrases: [
      'a broad white crescent grin visible in the negative space between branches, the rest of the cat not present',
      'the smile existing where a face would be, occupying the outline of something that has chosen to be mostly elsewhere',
      'wider than a cat\'s face, more certain than any expression has a right to be, entirely at home in the empty air',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
];

const V2_SEED_OBJECTS: ObjectIdentity[] = [
  {
    id: 'object_ny_paper_charm',
    name: 'Glowing Paper Charm',
    summary: 'A traditional ofuda paper charm reprinted with circuit traces — the protective script glowing faint neon, half prayer, half firmware.',
    phrases: [
      'a traditional ofuda paper charm, the printed script overlaid with glowing circuit traces',
      'faint neon light pulsing along the kanji, half protective prayer and half firmware',
      'edges singed, the paper old but the glow new',
      'the kind of ward that stops both demons and surveillance drones',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'object_ny_vending_machine',
    name: 'Haunted Vending Machine',
    summary: 'A glowing drinks machine humming on a black street — one row of cans flickering, an extra unlabelled slot that was not there yesterday.',
    phrases: [
      'a glowing drinks vending machine humming alone on a dark street',
      'rows of brightly lit cans, one row flickering and mislabelled',
      'an extra unmarked slot offering something that has no price',
      'cold blue-white light spilling onto the wet pavement around it',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'object_ny_neon_torii',
    name: 'Neon Torii Gate',
    summary: 'A shrine gate rebuilt in glowing neon tube — the traditional vermilion replaced by humming electric red, marking the threshold between worlds.',
    phrases: [
      'a torii shrine gate rebuilt from glowing neon tubing, humming electric red',
      'the traditional vermilion form rendered in light, buzzing faintly',
      'reflections of the gate doubled in the wet ground beneath it',
      'a threshold marker between the human city and the spirit one',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'object_ny_spirit_lantern',
    name: 'Spirit Lantern',
    summary: 'A round paper lantern carried by a yokai — the flame inside replaced by a captive will-o-wisp glowing cold blue, swaying without wind.',
    phrases: [
      'a round paper lantern, the flame inside replaced by a captive blue will-o-wisp',
      'cold spectral light glowing through the paper, swaying gently without any wind',
      'faded calligraphy on the side, the paper translucent and worn',
      'the small contained ghost casting a trembling pale glow',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'object_ny_cracked_phone',
    name: 'Cracked Smartphone',
    summary: 'A phone with a spiderwebbed screen showing a call from a number with too many digits — the glow leaking through the cracks in the wrong colour.',
    phrases: [
      'a smartphone with a heavily spiderwebbed cracked screen',
      'an incoming call displayed from a number with far too many digits',
      'the screen glow leaking through the cracks in a colour screens do not make',
      'held loosely, the only light on a dark face',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'object_ny_sake_cup',
    name: 'Offering Sake Cup',
    summary: 'A small ceramic sake cup left on a ledge as an offering — the liquid inside catching neon, a single coin and a folded note beside it.',
    phrases: [
      'a small ceramic sake cup left as an offering on a stone ledge',
      'the liquid inside trembling, catching and holding the neon colour above',
      'a single coin and a folded paper note placed carefully beside it',
      'a quiet transaction with something unseen, recently made',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'object_ny_fox_mask',
    name: 'Neon Kitsune Mask',
    summary: 'A white fox festival mask edged in glowing line — worn pushed to the side of the head, the painted grin lit faintly from within.',
    phrases: [
      'a white kitsune fox festival mask, the markings edged in glowing neon line',
      'worn pushed to the side of the head, the painted grin lit faintly from within',
      'lacquered surface catching the city colour, eyeholes dark',
      'traditional festival craft wired with quiet light',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
];

const maybeApplySeed = (items: ObjectIdentity[]): ObjectIdentity[] => {
  let result = items;

  if (readStorageItem(SEED_FLAG_KEY) === null) {
    writeStorageItem(SEED_FLAG_KEY, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = DEFAULT_SEED_OBJECTS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  if (readStorageItem(SEED_FLAG_KEY_V2) === null) {
    writeStorageItem(SEED_FLAG_KEY_V2, true);
    const existingIds = new Set(result.map(i => i.id));
    const toAdd = V2_SEED_OBJECTS.filter(i => !existingIds.has(i.id));
    if (toAdd.length > 0) {
      result = sortItems([...result, ...toAdd]);
      writeItems(result);
    }
  }

  return result;
};

const writeItems = (items: ObjectIdentity[]) => {
  const payload = { version: 1, items: sortItems(items) };
  writeStorageItem(STORE_KEY, payload);
  writeStorageItem(BACKUP_KEY, payload);
};

const sanitizeInput = (input: ObjectIdentityInput): ObjectIdentityInput => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('Object name is required.');
  const phrases = sanitizeStringArray(input.phrases);
  if (phrases.length === 0) throw new Error('At least one phrase is required.');
  return {
    name,
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
    phrases,
  };
};

export function listObjects(): ObjectIdentity[] {
  return readItems();
}

export function createObject(input: ObjectIdentityInput): ObjectIdentity {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: ObjectIdentity = {
    id: createId(),
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    phrases: sanitized.phrases,
    createdAt: now,
    updatedAt: now,
  };
  writeItems([...readItems(), next]);
  return next;
}

export function updateObject(id: string, input: ObjectIdentityInput): ObjectIdentity {
  const sanitized = sanitizeInput(input);
  const items = readItems();
  const existing = items.find(i => i.id === id);
  if (!existing) throw new Error('Object not found.');
  const updated: ObjectIdentity = {
    ...existing,
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    phrases: sanitized.phrases,
    updatedAt: Date.now(),
  };
  writeItems(items.map(i => (i.id === id ? updated : i)));
  return updated;
}

export function deleteObject(id: string): void {
  writeItems(readItems().filter(i => i.id !== id));
}
