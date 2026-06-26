/**
 * v3 Scenery lane — the "what happens" of the image.
 *
 * Where Characters/Objects are nouns, Scenery is the verb: the action or moment
 * the scene captures. The synthesis art-director hangs the nouns on this verb.
 * Seeded locally for the slice (Neon Yokai–flavored), behind the same lane shape.
 */

export type SceneryItem = {
  id: string;
  name: string;
  summary: string;
  /** the action phrases fed into synthesis */
  phrases: string[];
  /** v3 tint-palette index for the placeholder tile */
  tint: number;
};

export const SCENERY_ITEMS: SceneryItem[] = [
  { id: 'scenery_rooftop_standoff', name: 'Rooftop standoff', summary: 'A tense face-off across a rain-slicked neon rooftop.',
    phrases: ['a tense standoff at the edge of a rain-slicked neon rooftop', 'braced and still, eyes locked on an unseen threat across the gap', 'the city glowing far below, rain hanging in the cold air'], tint: 0 },
  { id: 'scenery_rain_duel', name: 'Rain duel', summary: 'Two figures clash in a downpour, blades drawn.', tint: 5,
    phrases: ['a duel in heavy rain, blades drawn and dripping', 'water flying from a hard parry, neon streaking the wet street', 'one figure mid-lunge, the other turning to meet it'] },
  { id: 'scenery_last_train', name: 'Last-train encounter', summary: 'A quiet, charged meeting in an empty late-night carriage.', tint: 7,
    phrases: ['an empty late-night subway carriage, fluorescent and humming', 'two strangers sharing the long silence of the last train', 'reflections doubling in the dark window glass'] },
  { id: 'scenery_alley_chase', name: 'Alley chase', summary: 'A breakneck pursuit through tight neon backstreets.', tint: 8,
    phrases: ['a breakneck chase through a tight neon backstreet', 'puddles exploding underfoot, signs blurring past', 'one figure vaulting an obstacle, another close behind'] },
  { id: 'scenery_festival_night', name: 'Festival night', summary: 'Lantern-lit crowds, stalls, and drifting smoke.', tint: 3,
    phrases: ['a crowded night festival under strings of paper lanterns', 'food-stall smoke drifting through warm coloured light', 'a quiet figure standing apart from the moving crowd'] },
  { id: 'scenery_neon_vows', name: 'Neon vows', summary: 'A tender moment under a wash of city signage.', tint: 6,
    phrases: ['a tender, close moment beneath a wash of neon signage', 'two figures sharing a small still space in the loud city', 'pink and cyan light pooling on wet pavement around them'] },
  { id: 'scenery_backroom_deal', name: 'Backroom deal', summary: 'A low-lit exchange, all leverage and held breath.', tint: 9,
    phrases: ['a low-lit backroom exchange, all leverage and held breath', 'a single hanging lamp over a table, faces half in shadow', 'something changing hands, watched from the doorway'] },
  { id: 'scenery_bridge_farewell', name: 'Bridge farewell', summary: 'A parting on a span above the glowing river.', tint: 2,
    phrases: ['a parting on a bridge above a glowing river of lights', 'one figure walking away, the other watching them go', 'cold wind, distant traffic, the city smeared in reflection'] },
  { id: 'scenery_market_haggle', name: 'Market haggle', summary: 'A sharp negotiation amid a cramped night market.', tint: 4,
    phrases: ['a sharp negotiation amid a cramped, glowing night market', 'hanging wares and steam, a vendor and a buyer mid-argument', 'narrow aisle packed with light, colour, and motion'] },
  { id: 'scenery_signal_lost', name: 'Signal lost', summary: 'A lone figure in a dead, flickering district.', tint: 1,
    phrases: ['a lone figure in a dead district of flickering, failing signs', 'half the neon out, the street unnaturally quiet and dim', 'a sense of something gone wrong in the silence'] },
];
