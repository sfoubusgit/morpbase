import type { LaneUniverse } from './laneSets';

export type Universe = {
  id: string;
  name: string;
  description?: string;
  pools: LaneUniverse;
  createdAt: number;
  updatedAt: number;
};

export type UniverseInput = {
  name: string;
  description?: string;
  pools?: LaneUniverse;
};
