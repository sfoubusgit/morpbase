export type TerritorySourceInput = {
  poolId: string;
  poolName: string;
  section: string;
};

export type TerritorySource = TerritorySourceInput & {
  id: string;
  sortOrder: number;
  addedAt: number;
};

export type Territory = {
  id: string;
  name: string;
  description?: string;
  sources: TerritorySource[];
  createdAt: number;
  updatedAt: number;
};

export type TerritoryStore = {
  version: 1;
  activeId: string | null;
  territories: Territory[];
};
