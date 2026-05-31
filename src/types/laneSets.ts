// Pool structure carried on a Universe — arrays of curated lane-item IDs.
// This is the only thing left in this file after the LaneSet feature was
// cut in audit Phase 5 (2026-05-31). The MultiLaneConfig / SingleLaneConfig
// / LaneSet / LaneSetLanes types lived here too but were only consumed by
// the removed LaneSetsModal + laneSetStore.

export type LaneUniverse = {
  character?: string[];
  wardrobe?: string[];
  style?: string[];
  lighting?: string[];
  composition?: string[];
  mood?: string[];
  environment?: string[];
  object?: string[];
  negative?: string[];
  aura?: string[];
};
