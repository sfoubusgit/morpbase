export type WorldPhrase = { id: string; text: string };

export type World = {
  id: string;
  name: string;
  phrases: WorldPhrase[];
  coverImageUrl?: string | null;
  createdAt: number;
  updatedAt: number;
};

const KEY = 'promptgen:worlds:v1';
const BACKUP_KEY = 'promptgen:worlds:backup:v1';
const WORLD_SEED_FLAG_KEY = 'promptgen:worlds:seeded:v1';

const WORLD_SEED_TS = 1747872000000;

const SEED_WORLDS: World[] = [
  {
    id: 'world_seed_beksinski',
    name: 'Beksiński',
    coverImageUrl: null,
    phrases: [
      { id: 'wp_bek_01', text: 'corroded iron surface, rust bleeding through the grain in long dark streaks' },
      { id: 'wp_bek_02', text: 'stretched dried skin pulled taut over hollow cavities, texture preserved, color long gone' },
      { id: 'wp_bek_03', text: 'pitted stone worn to powder at the edges, ancient and structural' },
      { id: 'wp_bek_04', text: 'bone-white mineral deposits lacing through dark rock like frozen lightning' },
      { id: 'wp_bek_05', text: 'cracked earth like a broken plate, deep fissures running to unreachable nothing' },
      { id: 'wp_bek_06', text: 'ancient rotting fabric, texture intact, color absorbed back into the wall behind it' },
      { id: 'wp_bek_07', text: 'oxidized metal patina, green and brown and somehow almost beautiful' },
      { id: 'wp_bek_08', text: 'grave-cold air, still and total, no warmth anywhere in the frame' },
      { id: 'wp_bek_09', text: 'thin grey sourceless light, directionless and cold, casting no real shadow' },
      { id: 'wp_bek_10', text: 'dust suspended motionless in the air, the world mid-exhale and holding it' },
      { id: 'wp_bek_11', text: 'silence with physical weight, pressing inward from every surface' },
      { id: 'wp_bek_12', text: 'a faint wind moving through the space, touching nothing, disturbing nothing' },
      { id: 'wp_bek_13', text: 'arching riblike formations of stone and bone fused together, structural and organic simultaneously' },
      { id: 'wp_bek_14', text: 'labyrinthine corridors narrowing into impenetrable dark at their far end' },
      { id: 'wp_bek_15', text: 'cathedral vaulting composed of vertebrae stacked and mortared in ancient repetition' },
      { id: 'wp_bek_16', text: 'impossible towers dissolving into grey haze long before reaching any apex' },
      { id: 'wp_bek_17', text: 'archways sealed shut, their curves suggesting a mouth that has not opened in centuries' },
      { id: 'wp_bek_18', text: 'walls curving inward like the inside of an enormous ribcage, the space breathing' },
      { id: 'wp_bek_19', text: 'a single distant light source, unreachable, casting no warmth, source unknown' },
      { id: 'wp_bek_20', text: 'a lone wrapped figure, bandages and robes indistinguishable from each other' },
      { id: 'wp_bek_21', text: 'featureless face worn smooth, by time or by intention, impossible to determine which' },
      { id: 'wp_bek_22', text: 'figures integrated into the wall — absorbed into it, or slowly emerging, unclear' },
      { id: 'wp_bek_23', text: 'a procession of shrouded forms retreating into the furthest distance, unhurried' },
      { id: 'wp_bek_24', text: 'elongated silhouette, impossibly tall, draped in something grey and indeterminate' },
      { id: 'wp_bek_25', text: 'ochre-stained ground darkening to rust at every fissure and seam' },
      { id: 'wp_bek_26', text: 'bone-white bleached surfaces against absolute black voids with no transition between them' },
      { id: 'wp_bek_27', text: 'sepia layered over grey, centuries of patina on every surface' },
      { id: 'wp_bek_28', text: 'deep arterial red appearing only at the oldest and deepest cracks in the stone' },
      { id: 'wp_bek_29', text: 'vast scale — the architecture dwarfs every figure to near-invisibility' },
      { id: 'wp_bek_30', text: 'the horror lives in the beauty of the surface, not in any single thing depicted' },
    ],
    createdAt: WORLD_SEED_TS,
    updatedAt: WORLD_SEED_TS,
  },
];

const createId = () => `w_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

function maybeApplySeed(worlds: World[]): World[] {
  if (localStorage.getItem(WORLD_SEED_FLAG_KEY) !== null) return worlds;
  localStorage.setItem(WORLD_SEED_FLAG_KEY, 'true');
  const existingIds = new Set(worlds.map(w => w.id));
  const toAdd = SEED_WORLDS.filter(w => !existingIds.has(w.id));
  if (toAdd.length === 0) return worlds;
  const merged = [...worlds, ...toAdd];
  save(merged);
  return merged;
}

function load(): World[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return maybeApplySeed([]);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return maybeApplySeed([]);
    return maybeApplySeed(parsed as World[]);
  } catch {
    return [];
  }
}

function save(worlds: World[]): void {
  try {
    localStorage.setItem(BACKUP_KEY, localStorage.getItem(KEY) ?? '[]');
    localStorage.setItem(KEY, JSON.stringify(worlds));
  } catch {
    // storage full — silently fail
  }
}

export function listWorlds(): World[] {
  return load();
}

export function createWorld(name: string, coverImageUrl?: string | null): World {
  const worlds = load();
  const now = Date.now();
  const world: World = { id: createId(), name: name.trim(), phrases: [], coverImageUrl: coverImageUrl?.trim() || null, createdAt: now, updatedAt: now };
  save([...worlds, world]);
  return world;
}

export function renameWorld(id: string, name: string): World | null {
  const worlds = load();
  const index = worlds.findIndex(w => w.id === id);
  if (index === -1) return null;
  const updated = { ...worlds[index], name: name.trim(), updatedAt: Date.now() };
  worlds[index] = updated;
  save(worlds);
  return updated;
}

export function deleteWorld(id: string): void {
  save(load().filter(w => w.id !== id));
}

export function addWorldPhrase(id: string, text: string): World | null {
  const worlds = load();
  const index = worlds.findIndex(w => w.id === id);
  if (index === -1) return null;
  const phrase: WorldPhrase = { id: createId(), text: text.trim() };
  const updated = { ...worlds[index], phrases: [...worlds[index].phrases, phrase], updatedAt: Date.now() };
  worlds[index] = updated;
  save(worlds);
  return updated;
}

export function updateWorldPhrase(id: string, phraseId: string, text: string): World | null {
  const worlds = load();
  const index = worlds.findIndex(w => w.id === id);
  if (index === -1) return null;
  const updated = {
    ...worlds[index],
    phrases: worlds[index].phrases.map(p => p.id === phraseId ? { ...p, text: text.trim() } : p),
    updatedAt: Date.now(),
  };
  worlds[index] = updated;
  save(worlds);
  return updated;
}

export function removeWorldPhrase(id: string, phraseId: string): World | null {
  const worlds = load();
  const index = worlds.findIndex(w => w.id === id);
  if (index === -1) return null;
  const updated = {
    ...worlds[index],
    phrases: worlds[index].phrases.filter(p => p.id !== phraseId),
    updatedAt: Date.now(),
  };
  worlds[index] = updated;
  save(worlds);
  return updated;
}

export function updateWorldCoverImage(id: string, coverImageUrl: string | null): World | null {
  const worlds = load();
  const index = worlds.findIndex(w => w.id === id);
  if (index === -1) return null;
  const updated = { ...worlds[index], coverImageUrl: coverImageUrl?.trim() || null, updatedAt: Date.now() };
  worlds[index] = updated;
  save(worlds);
  return updated;
}
