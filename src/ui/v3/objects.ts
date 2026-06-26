/**
 * v3 Objects lane — props and artifacts that recur across scenes.
 *
 * Nouns that aren't the subject: a weapon, a charm, a vehicle. The synthesis
 * art-director folds them into the frame ("…with {objects}"). Seeded locally
 * (Neon Yokai–flavored), same lane shape as Scenery.
 */

export type ObjectItem = {
  id: string;
  name: string;
  summary: string;
  phrases: string[];
  /** v3 tint-palette index for the placeholder tile */
  tint: number;
};

export const OBJECT_ITEMS: ObjectItem[] = [
  { id: 'object_cyber_katana', name: 'Cyber-katana', summary: 'A slim blade with a softly glowing edge.', tint: 0,
    phrases: ['a slim cyber-katana with a softly glowing energy edge', 'thin lines of light running the length of the blade'] },
  { id: 'object_paper_lantern', name: 'Paper lantern', summary: 'A warm hand-held lantern in the dark.', tint: 4,
    phrases: ['a warm paper lantern casting a small pool of amber light', 'soft glow leaking through thin painted paper'] },
  { id: 'object_drone_moth', name: 'Drone moth', summary: 'A palm-sized mechanical moth with lit wings.', tint: 5,
    phrases: ['a palm-sized mechanical moth drone with faintly lit wings', 'hovering close, casting tiny shifting reflections'] },
  { id: 'object_neon_umbrella', name: 'Neon umbrella', summary: 'A clear umbrella full of reflected city light.', tint: 7,
    phrases: ['a transparent vinyl umbrella glowing with reflected neon', 'rain beading and running off its curved surface'] },
  { id: 'object_fox_mask', name: 'Fox mask', summary: 'A lacquered kitsune mask, half-worn.', tint: 8,
    phrases: ['a lacquered white-and-red fox mask, pushed up or half-worn', 'catching a sharp highlight along its painted edge'] },
  { id: 'object_foxfire_briefcase', name: 'Fox-fire briefcase', summary: 'A dark case leaking pale blue flame at the seams.', tint: 2,
    phrases: ['a dark briefcase leaking thin wisps of pale blue fox-fire from its seams', 'cold flame light flickering on the hand that holds it'] },
  { id: 'object_capsule_charm', name: 'Capsule charm', summary: 'A tiny glowing gachapon charm on a strap.', tint: 6,
    phrases: ['a tiny glowing capsule-toy charm dangling from a phone strap', 'a small bright point of colour in the frame'] },
  { id: 'object_idol_mic', name: 'Holo mic', summary: 'A wireless mic trailing holographic light.', tint: 3,
    phrases: ['a wireless idol microphone trailing ribbons of holographic light', 'magenta and cyan motes drifting from its head'] },
];
