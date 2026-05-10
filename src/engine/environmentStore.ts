import type {
  EnvironmentIdentity,
  EnvironmentIdentityInput,
  EnvironmentStore,
} from '../types';

const ENVIRONMENT_STORE_KEY = 'promptgen:environments:v1';
const ENVIRONMENT_STORE_BACKUP_KEY = 'promptgen:environments:backup:v1';
const ENVIRONMENT_SEED_FLAG_KEY = 'promptgen:environments:seeded:v2';

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
    // ignore and use fallback
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const sortEnvironments = <T extends EnvironmentIdentity>(environments: T[]): T[] =>
  [...environments].sort((left, right) => {
    if (right.updatedAt !== left.updatedAt) return right.updatedAt - left.updatedAt;
    if (right.createdAt !== left.createdAt) return right.createdAt - left.createdAt;
    return left.name.localeCompare(right.name);
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
    // ignore storage errors
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

const sanitizeEnvironment = (value: unknown): EnvironmentIdentity | null => {
  if (!isRecord(value)) return null;

  const id = typeof value.id === 'string' ? value.id.trim() : '';
  const name = typeof value.name === 'string' ? normalizeText(value.name) : '';
  if (!id || !name) return null;

  const phraseBundle = isRecord(value.phraseBundle)
    ? { core: sanitizeStringArray(value.phraseBundle.core) }
    : { core: [] };

  if (phraseBundle.core.length === 0) return null;

  const createdAt = typeof value.createdAt === 'number' && Number.isFinite(value.createdAt)
    ? value.createdAt
    : Date.now();
  const updatedAt = typeof value.updatedAt === 'number' && Number.isFinite(value.updatedAt)
    ? value.updatedAt
    : createdAt;

  return {
    id,
    name,
    summary: typeof value.summary === 'string' ? normalizeText(value.summary) || undefined : undefined,
    coverImageUrl: typeof value.coverImageUrl === 'string' ? value.coverImageUrl.trim() || undefined : undefined,
    phraseBundle,
    createdAt,
    updatedAt,
  };
};

const ENV_SEED_TS = 1746748800000;
const ENV_SEED_TS_2 = 1746835200000;

const DEFAULT_SEED_ENVIRONMENTS: EnvironmentIdentity[] = [
  {
    id: 'environment_seed_ancient_mountain_city',
    name: 'Ancient Mountain City — Year 3056',
    summary: 'Pre-collapse stone citadels in alpine peaks, still inhabited in 3056 alongside far-future infrastructure.',
    phraseBundle: {
      core: [
        'ancient stone city carved into mountain cliffs, year 3056',
        'crumbling colonnades and weathered ramparts draped in bioluminescent climbing vines',
        'thin cold mountain air, perpetual mist rolling through narrow canyon streets',
        'ruins of a pre-collapse civilization, orbital light arrays visible through cloud breaks',
        'worn flagstone plazas where eroded market stalls meet holographic waypoint beacons',
        'monolithic stone gates overgrown with pale lichen, transit sky-lanes passing silently overhead',
      ],
    },
    createdAt: ENV_SEED_TS,
    updatedAt: ENV_SEED_TS,
  },
  {
    id: 'environment_seed_sunken_bathhouse',
    name: 'Sunken Bathhouse — Midnight',
    summary: 'Ancient stone bathhouse, steaming mineral pools, amber lantern light, deep silence.',
    phraseBundle: {
      core: [
        'ancient stone bathhouse, midnight',
        'steaming mineral pools reflecting amber lantern light',
        'mossy columns and cracked tile floors, humid air',
        'arched ceiling dripping with condensation, hanging ferns',
        'dark still water broken only by rising steam',
        'deep silence, warmth, enclosing stone walls',
      ],
    },
    createdAt: ENV_SEED_TS_2,
    updatedAt: ENV_SEED_TS_2,
  },
  {
    id: 'environment_seed_observatory_rooftop',
    name: 'Overgrown Observatory Rooftop',
    summary: 'Stone terrace open to the night sky, crumbling dome, ivy and wind-worn instruments.',
    phraseBundle: {
      core: [
        'stone observatory rooftop, open to night sky',
        'crumbling dome with ivy crawling across weathered stonework',
        'scattered wind-worn star charts and brass instruments',
        'low flickering lantern, worn stone balustrade',
        'constellation-clear sky stretching to the horizon',
        'cold elevation, silence above the treeline',
      ],
    },
    createdAt: ENV_SEED_TS_2,
    updatedAt: ENV_SEED_TS_2,
  },
];

const readEnvironments = (): EnvironmentIdentity[] => {
  const candidates = [
    parseJson(readStorageItem(ENVIRONMENT_STORE_KEY)),
    parseJson(readStorageItem(ENVIRONMENT_STORE_BACKUP_KEY)),
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    const rawEnvironments = Array.isArray(candidate)
      ? candidate
      : (isRecord(candidate) && Array.isArray(candidate.environments) ? candidate.environments : null);
    if (!rawEnvironments) continue;

    const parsed = sortEnvironments(
      rawEnvironments
        .map(sanitizeEnvironment)
        .filter((env): env is EnvironmentIdentity => Boolean(env))
    );

    if (parsed.length > 0 || rawEnvironments.length === 0) return maybeApplyEnvSeed(parsed);
  }

  return maybeApplyEnvSeed([]);
};

const writeEnvironments = (environments: EnvironmentIdentity[]) => {
  const payload: EnvironmentStore = {
    version: 1,
    environments: sortEnvironments(environments),
  };
  writeStorageItem(ENVIRONMENT_STORE_KEY, payload);
  writeStorageItem(ENVIRONMENT_STORE_BACKUP_KEY, payload);
};

const maybeApplyEnvSeed = (environments: EnvironmentIdentity[]): EnvironmentIdentity[] => {
  if (readStorageItem(ENVIRONMENT_SEED_FLAG_KEY) !== null) return environments;
  writeStorageItem(ENVIRONMENT_SEED_FLAG_KEY, true);
  const existingIds = new Set(environments.map(e => e.id));
  const toAdd = DEFAULT_SEED_ENVIRONMENTS.filter(e => !existingIds.has(e.id));
  if (toAdd.length === 0) return environments;
  const merged = sortEnvironments([...environments, ...toAdd]);
  writeEnvironments(merged);
  return merged;
};

const sanitizeInput = (input: EnvironmentIdentityInput): EnvironmentIdentityInput => {
  const name = normalizeText(input.name);
  if (!name) throw new Error('Environment name is required.');

  const core = sanitizeStringArray(input.phraseBundle.core);
  if (core.length === 0) throw new Error('At least one core phrase is required.');

  return {
    name,
    summary: input.summary ? normalizeText(input.summary) || undefined : undefined,
    coverImageUrl: input.coverImageUrl?.trim() || undefined,
    phraseBundle: { core },
  };
};

export async function listEnvironments(): Promise<EnvironmentIdentity[]> {
  return readEnvironments();
}

export async function createEnvironment(input: EnvironmentIdentityInput): Promise<EnvironmentIdentity> {
  const sanitized = sanitizeInput(input);
  const now = Date.now();
  const next: EnvironmentIdentity = {
    id: createId('environment'),
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    phraseBundle: sanitized.phraseBundle,
    createdAt: now,
    updatedAt: now,
  };
  const environments = readEnvironments();
  writeEnvironments([...environments, next]);
  return next;
}

export async function updateEnvironment(
  id: string,
  input: EnvironmentIdentityInput
): Promise<EnvironmentIdentity> {
  const environmentId = id.trim();
  if (!environmentId) throw new Error('Environment id is required.');

  const sanitized = sanitizeInput(input);
  const environments = readEnvironments();
  const existing = environments.find(e => e.id === environmentId);
  if (!existing) throw new Error('Environment not found.');

  const updated: EnvironmentIdentity = {
    ...existing,
    name: sanitized.name,
    summary: sanitized.summary,
    coverImageUrl: sanitized.coverImageUrl,
    phraseBundle: sanitized.phraseBundle,
    updatedAt: Date.now(),
  };

  writeEnvironments(environments.map(e => (e.id === environmentId ? updated : e)));
  return updated;
}

export async function deleteEnvironment(id: string): Promise<void> {
  const environmentId = id.trim();
  if (!environmentId) throw new Error('Environment id is required.');

  const environments = readEnvironments();
  writeEnvironments(environments.filter(e => e.id !== environmentId));
}
