/**
 * "Doings" — what a character is doing in a scene. Not a lane, not an object,
 * not a graph: a transient, subject-scoped action phrase. This module only holds
 * the curated suggestion vocabulary shown in the editor; free text always wins,
 * and a doing can optionally target another cast member (an interaction).
 */

/** Common single-subject actions offered as quick chips. */
export const DOING_SUGGESTIONS: string[] = [
  'standing', 'sitting', 'kneeling', 'crouching', 'lying down',
  'walking', 'running', 'jumping', 'reaching out', 'crossing their arms',
  'looking at the viewer', 'looking away', 'looking over their shoulder',
  'laughing', 'crying', 'shouting', 'smirking',
  'holding something', 'holding a weapon', 'reading', 'drinking', 'sleeping', 'dancing',
];

/** Common two-character actions offered when the doing targets another character. */
export const DOING_INTERACTIONS: string[] = [
  'chasing', 'fighting', 'protecting', 'embracing', 'kissing',
  'confronting', 'comforting', 'reaching for', 'looking at', 'talking to',
];
