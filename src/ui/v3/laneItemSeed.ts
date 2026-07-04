/**
 * DEV-only test lane objects.
 *
 * Emptied on purpose — the workspace now starts from a clean slate (no seeded
 * scenery/objects/environment/mood/lighting/composition). Kept as a seam so
 * fixtures can be re-added here later without touching V3LabPage. These would be
 * client-only (never inserted into Supabase) and merged in when DEV.
 */
import type { RemoteLaneItem } from './laneItemsStore';

export const DEV_LANE_ITEMS: RemoteLaneItem[] = [];
