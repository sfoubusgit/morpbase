import type { NegativePreset, NegativePresetInput } from '../types';

const STORE_KEY = 'promptgen:negatives:v1';
const BACKUP_KEY = 'promptgen:negatives:backup:v1';
const SEEDED_KEY = 'promptgen:negatives:seeded:v1';

const SEED_TS = 1746921600000;
const SEED_TS_2 = 1747008000000;

const SEED_PRESETS: NegativePreset[] = [
  {
    id: 'seed-neg-anatomy',
    name: 'Anatomy Clean',
    summary: 'Removes common body deformation artifacts.',
    phrases: [
      'bad anatomy',
      'extra limbs',
      'missing limbs',
      'deformed hands',
      'malformed fingers',
      'bad proportions',
      'mutated body',
      'fused fingers',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'seed-neg-quality',
    name: 'Quality Filter',
    summary: 'Filters out low-quality output and unwanted overlays.',
    phrases: [
      'blurry',
      'low quality',
      'jpeg artifacts',
      'pixelated',
      'watermark',
      'signature',
      'text',
      'username',
      'logo',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'seed-neg-face',
    name: 'Face Fix',
    summary: 'Reduces face and eye deformation.',
    phrases: [
      'bad face',
      'deformed face',
      'asymmetrical eyes',
      'cross-eyed',
      'ugly face',
      'distorted features',
      'poorly drawn face',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'seed-neg-composition',
    name: 'Composition Guard',
    summary: 'Prevents cropping and out-of-frame errors.',
    phrases: [
      'cropped',
      'out of frame',
      'cut off',
      'poorly framed',
      'bad composition',
      'partial figure',
    ],
    createdAt: SEED_TS,
    updatedAt: SEED_TS,
  },
  {
    id: 'seed-neg-duplicates',
    name: 'No Duplicates',
    summary: 'Prevents duplicated subjects and mirrored artifacts.',
    phrases: [
      'duplicate',
      'multiple copies',
      'clone',
      'mirrored subject',
      'repeated figure',
      'double',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
  {
    id: 'seed-neg-full',
    name: 'Full Baseline',
    summary: 'Broad catch-all for the most common generation errors.',
    phrases: [
      'bad anatomy',
      'extra limbs',
      'deformed hands',
      'blurry',
      'low quality',
      'watermark',
      'bad face',
      'ugly',
      'cropped',
      'duplicate',
    ],
    createdAt: SEED_TS_2,
    updatedAt: SEED_TS_2,
  },
];

function load(): NegativePreset[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as NegativePreset[];
  } catch {
    return [];
  }
}

function save(presets: NegativePreset[]): void {
  const json = JSON.stringify(presets);
  localStorage.setItem(STORE_KEY, json);
  localStorage.setItem(BACKUP_KEY, json);
}

function seedIfNeeded(): void {
  if (localStorage.getItem(SEEDED_KEY)) return;
  const existing = load();
  const existingIds = new Set(existing.map(p => p.id));
  const toAdd = SEED_PRESETS.filter(s => !existingIds.has(s.id));
  if (toAdd.length > 0) save([...existing, ...toAdd]);
  localStorage.setItem(SEEDED_KEY, '1');
}

export function listNegativePresets(): NegativePreset[] {
  seedIfNeeded();
  return load().sort((a, b) => a.createdAt - b.createdAt);
}

export function createNegativePreset(input: NegativePresetInput): NegativePreset {
  const preset: NegativePreset = {
    id: `neg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: input.name.trim(),
    summary: input.summary?.trim(),
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
    phrases: input.phrases.map(p => p.trim()).filter(Boolean),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  save([...load(), preset]);
  return preset;
}

export function updateNegativePreset(id: string, input: NegativePresetInput): NegativePreset | null {
  const presets = load();
  const idx = presets.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const updated: NegativePreset = {
    ...presets[idx],
    name: input.name.trim(),
    summary: input.summary?.trim(),
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
    phrases: input.phrases.map(p => p.trim()).filter(Boolean),
    updatedAt: Date.now(),
  };
  presets[idx] = updated;
  save(presets);
  return updated;
}

export function deleteNegativePreset(id: string): void {
  save(load().filter(p => p.id !== id));
}
