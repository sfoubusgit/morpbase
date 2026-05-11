export type WorldStatePosition = 'in-front' | 'behind' | 'inside' | 'above' | 'at-distance';
export type WorldStateTemporal = 'before' | 'after';
export type WorldStateResonance = 'sanctuary' | 'threshold' | 'exposure' | 'dread' | 'wonder';

export type WorldState = {
  position: WorldStatePosition | null;
  temporal: WorldStateTemporal | null;
  resonance: WorldStateResonance | null;
};

export const DEFAULT_WORLD_STATE: WorldState = {
  position: null,
  temporal: null,
  resonance: null,
};

const POSITION_OVERLAYS: Record<WorldStatePosition, string[]> = {
  'in-front':    ['viewed from the approach', 'facing forward', 'facade prominent'],
  'behind':      ['rear aspect', 'seen from behind', 'the hidden side'],
  'inside':      ['enclosed within', 'interior space', 'looking outward from within'],
  'above':       ['aerial vantage', 'looking down upon', 'overhead view'],
  'at-distance': ['seen from afar', 'environment as backdrop', 'full scale revealed'],
};

const TEMPORAL_OVERLAYS: Record<WorldStateTemporal, string[]> = {
  'before': ['not yet touched', 'anticipatory stillness', 'before the event'],
  'after':  ['traces remain', 'aftermath', 'time has passed'],
};

const RESONANCE_OVERLAYS: Record<WorldStateResonance, string[]> = {
  'sanctuary': ['warmth despite the cold', 'safe harbor', 'protected'],
  'threshold': ['liminal', 'between states', 'hovering at the edge'],
  'exposure':  ['nowhere to hide', 'open and seen', 'vulnerability'],
  'dread':     ['something is wrong', 'the light feels off', 'unease without source'],
  'wonder':    ['impossibly vast', 'the sublime', 'awe and discovery'],
};

export function getWorldStateOverlayPhrases(state: WorldState): string[] {
  const phrases: string[] = [];
  if (state.position) phrases.push(...POSITION_OVERLAYS[state.position]);
  if (state.temporal) phrases.push(...TEMPORAL_OVERLAYS[state.temporal]);
  if (state.resonance) phrases.push(...RESONANCE_OVERLAYS[state.resonance]);
  return phrases;
}

export const WORLD_STATE_POSITIONS: Array<{ value: WorldStatePosition; label: string }> = [
  { value: 'in-front',    label: 'In Front' },
  { value: 'behind',      label: 'Behind' },
  { value: 'inside',      label: 'Inside' },
  { value: 'above',       label: 'Above' },
  { value: 'at-distance', label: 'Distant' },
];

export const WORLD_STATE_TEMPORALS: Array<{ value: WorldStateTemporal; label: string }> = [
  { value: 'before', label: 'Before' },
  { value: 'after',  label: 'After' },
];

export const WORLD_STATE_RESONANCES: Array<{ value: WorldStateResonance; label: string }> = [
  { value: 'sanctuary', label: 'Sanctuary' },
  { value: 'threshold', label: 'Threshold' },
  { value: 'exposure',  label: 'Exposure' },
  { value: 'dread',     label: 'Dread' },
  { value: 'wonder',    label: 'Wonder' },
];
