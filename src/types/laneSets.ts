// A multi-select lane (character, style, lighting, etc.) — stores an array of IDs
export type MultiLaneConfig =
  | { mode: 'fixed'; ids: string[] }
  | { mode: 'random'; count: number }
  | { mode: 'off' };

// A single-select lane (dynamics, aura) — stores one ID or null
export type SingleLaneConfig =
  | { mode: 'fixed'; id: string | null }
  | { mode: 'random' }
  | { mode: 'off' };

export type LaneSetLanes = {
  character: MultiLaneConfig;
  dynamics: SingleLaneConfig;
  wardrobe: MultiLaneConfig;
  style: MultiLaneConfig;
  lighting: MultiLaneConfig;
  composition: MultiLaneConfig;
  mood: MultiLaneConfig;
  environment: MultiLaneConfig;
  aura: SingleLaneConfig;
};

export type LaneSet = {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  lanes: LaneSetLanes;
  createdAt: number;
  updatedAt: number;
};

export type LaneSetInput = {
  name: string;
  description?: string;
  tags?: string[];
  lanes: LaneSetLanes;
};
