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

const createId = () => `w_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

function load(): World[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as World[];
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
