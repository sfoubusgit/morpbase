/** v3 Composition lane — framing and camera language for the shot. */
export type CompositionItem = { id: string; name: string; summary: string; phrases: string[]; tint: number };

export const COMPOSITION_ITEMS: CompositionItem[] = [
  { id: 'composition_low_standoff', name: 'Low stand-off', summary: 'Low angle looking up at the subject.', tint: 0,
    phrases: ['low camera angle looking up at the subject', 'imposing, the figure tall against the sky'] },
  { id: 'composition_over_shoulder', name: 'Over-shoulder', summary: 'Framed past a foreground shoulder.', tint: 5,
    phrases: ['over-the-shoulder framing past a foreground figure', 'depth from a soft out-of-focus shoulder in front'] },
  { id: 'composition_wide_establishing', name: 'Wide establishing', summary: 'Subject small within a large space.', tint: 7,
    phrases: ['a wide establishing shot, the subject small within a large space', 'lots of environment, sense of place'] },
  { id: 'composition_tight_closeup', name: 'Tight close-up', summary: 'Face filling the frame.', tint: 3,
    phrases: ['a tight close-up, the face filling the frame', 'shallow depth of field, intimate and detailed'] },
  { id: 'composition_dutch_tilt', name: 'Dutch tilt', summary: 'Canted, unsettled horizon.', tint: 8,
    phrases: ['a canted dutch-tilt angle, the horizon off-level', 'an unsettled, dynamic sense of imbalance'] },
  { id: 'composition_centered', name: 'Centered symmetry', summary: 'Balanced, symmetrical framing.', tint: 6,
    phrases: ['a centered, symmetrical composition', 'balanced framing, the subject squared to camera'] },
];
