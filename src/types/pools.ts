export type PoolItem = {
  id: string;
  text: string;
  tags?: string[];
  note?: string;
};

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
