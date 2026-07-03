/**
 * DEV-only test lane objects.
 *
 * The production content DB is a deliberate clean slate, so these fixtures live
 * only in the client (never inserted into Supabase) and are merged into the lane
 * walls when `import.meta.env.DEV` is true — the same pattern as the two test
 * characters in characterStore. They carry no author, so they're read-only (no
 * delete affordance) and belong to no world (only visible under "All worlds").
 *
 * Gives every lane 2 objects for testing: scenery, objects, environment, mood,
 * lighting, composition, and actions. (Characters already get 2 via characterStore.)
 */
import type { RemoteLaneItem } from './laneItemsStore';

const T = '2026-01-01T00:00:00.000Z';

const mk = (
  lane: string,
  n: number,
  name: string,
  summary: string,
  phrases: string[],
  relation = '',
  solo = false,
): RemoteLaneItem => ({
  id: `seed_test_${lane}_${n}`,
  lane,
  name,
  summary,
  phrases,
  coverUrl: null,
  author: 'MorpBase',
  authorAuthUid: null,
  world: '',
  relation,
  solo,
  createdAt: T,
});

export const DEV_LANE_ITEMS: RemoteLaneItem[] = [
  // ── scenery ──
  mk('scenery', 1, 'Rooftop standoff', 'A tense face-off on a rain-slicked neon rooftop.', [
    'a tense standoff on a rain-slicked neon rooftop',
    'the city glowing far below, rain hanging in the cold air',
  ]),
  mk('scenery', 2, 'Market chase', 'A breathless dash through a crowded sunlit bazaar.', [
    'a breathless chase through a crowded sunlit market',
    'stalls of spices and hanging silks blurring past',
  ]),

  // ── objects ──
  mk('objects', 1, 'Worn leather satchel', 'A well-travelled bag, buckles scuffed from years on the road.', [
    'a worn leather satchel with scuffed brass buckles',
    'straps softened and darkened from years of use',
  ]),
  mk('objects', 2, 'Antique brass compass', 'A heavy navigator’s compass, glass fogged with age.', [
    'an antique brass compass, its glass fogged with age',
    'engraved bezel catching a glint of light',
  ]),

  // ── environment ──
  mk('environment', 1, 'Fog-drowned harbor', 'A quiet dock at dawn, swallowed by pale mist.', [
    'a fog-drowned harbor at dawn, boats as grey silhouettes',
    'pale mist swallowing the water and the far shore',
  ]),
  mk('environment', 2, 'Desert highway', 'An endless sun-baked road shimmering with heat.', [
    'a sun-baked desert highway stretching to the horizon',
    'heat shimmer rising off cracked asphalt',
  ]),

  // ── mood ──
  mk('mood', 1, 'Tense and electric', 'A charged, on-edge atmosphere before something breaks.', [
    'a tense, electric atmosphere, charged and on edge',
  ]),
  mk('mood', 2, 'Quiet melancholy', 'A soft, wistful stillness that settles over everything.', [
    'a quiet, wistful melancholy settling over the scene',
  ]),

  // ── lighting ──
  mk('lighting', 1, 'Golden hour backlight', 'Warm low sun haloing the subject from behind.', [
    'warm golden-hour sun backlighting the subject',
    'a soft rim of light haloing edges, long shadows',
  ]),
  mk('lighting', 2, 'Hard noir shadows', 'High-contrast light slicing deep, dramatic shadows.', [
    'hard high-contrast noir lighting, deep black shadows',
    'a single harsh key light raking across the frame',
  ]),

  // ── composition ──
  mk('composition', 1, 'Low-angle hero shot', 'Camera looking up, making the subject loom large.', [
    'a low-angle hero shot looking up at the subject',
    'the figure looming large against the sky',
  ]),
  mk('composition', 2, 'Over-the-shoulder', 'A tight framing from just behind one figure.', [
    'a tight over-the-shoulder framing',
    'foreground shoulder soft, the subject sharp beyond',
  ]),

  // ── actions ── (pair + solo)
  mk('actions', 1, 'Dancing', 'Two figures caught mid-turn in a close dance.', [
    'mid-turn, hands clasped, a blur of motion',
  ], 'is dancing with'),
  mk('actions', 2, 'Arguing', 'A heated exchange, leaning in, tension crackling.', [
    'leaning in, jaws set, a heated exchange',
  ], 'is arguing with'),
  mk('actions', 3, 'Holding something', 'A single figure cradling an unseen object.', [
    'both hands cupped, holding something close',
  ], 'is holding something', true),
  mk('actions', 4, 'Gazing up', 'A lone figure looking to the sky.', [
    'chin lifted, eyes toward the sky',
  ], 'gazes upward', true),
];
