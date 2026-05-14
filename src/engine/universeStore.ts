import type { Universe, UniverseInput } from '../types/universe';
import type { LaneUniverse } from '../types/laneSets';

const KEY = 'morpbase:universes:v1';

function createId(): string {
  return `universe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function load(): Universe[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Universe[];
  } catch {
    return [];
  }
}

function save(universes: Universe[]): void {
  localStorage.setItem(KEY, JSON.stringify(universes));
}

export function listUniverses(): Universe[] {
  return load();
}

export function createUniverse(input: UniverseInput): Universe {
  const universes = load();
  const now = Date.now();
  const next: Universe = {
    id: createId(),
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
    pools: input.pools ?? {},
    createdAt: now,
    updatedAt: now,
  };
  save([...universes, next]);
  return next;
}

export function updateUniversePools(id: string, pools: LaneUniverse): Universe | null {
  const universes = load();
  const index = universes.findIndex(u => u.id === id);
  if (index === -1) return null;
  const updated: Universe = { ...universes[index], pools, updatedAt: Date.now() };
  universes[index] = updated;
  save(universes);
  return updated;
}

export function deleteUniverse(id: string): void {
  save(load().filter(u => u.id !== id));
}
