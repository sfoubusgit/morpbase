const STORE_KEY = 'promptgen:capture_sets:v1';

export type CaptureSet = {
  id: string;
  name: string;
  prompts: string[];
  createdAt: number;
};

const createId = (): string =>
  `capture_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const read = (): CaptureSet[] => {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CaptureSet[]) : [];
  } catch {
    return [];
  }
};

const write = (sets: CaptureSet[]): void => {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(sets));
  } catch {
    // ignore storage errors
  }
};

export function listCaptureSets(): CaptureSet[] {
  return read();
}

export function saveCaptureSet(name: string, prompts: string[]): CaptureSet {
  const set: CaptureSet = {
    id: createId(),
    name: name.trim() || `Session — ${new Date().toLocaleDateString()}`,
    prompts,
    createdAt: Date.now(),
  };
  write([set, ...read()]);
  return set;
}

export function deleteCaptureSet(id: string): void {
  write(read().filter(s => s.id !== id));
}
