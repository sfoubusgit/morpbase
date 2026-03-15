export type PoolItem = {
  id: string;
  text: string;
  section?: string;
  tags?: string[];
  note?: string;
};

export const POOL_SECTION_OPTIONS = [
  'Subjects',
  'Environment',
  'Props',
  'Lighting',
  'Mood',
  'Materials',
  'Style',
  'Composition',
  'Effects',
] as const;

export type PoolSection = (typeof POOL_SECTION_OPTIONS)[number];

export type PoolFolder = {
  id: string;
  name: string;
  sortOrder: number;
  createdAt: number;
  updatedAt: number;
};

export type Pool = {
  id: string;
  name: string;
  folderId?: string;
  folderName?: string;
  createdAt: number;
  updatedAt: number;
  items: PoolItem[];
};

export type PoolStore = {
  version: 1;
  pools: Pool[];
};
