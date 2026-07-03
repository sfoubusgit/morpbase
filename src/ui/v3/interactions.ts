/**
 * v3 Actions — what a character is doing in a scene.
 *
 * An action is a verb attached to one subject, optionally pointing at a target.
 * Two arities ship in v0:
 *   • solo (intransitive) — "{A} {rel}", e.g. "is kneeling" (no second character)
 *   • pair (character-directed) — "{A} {rel} {B}", e.g. "is chasing"
 * The face is dead simple (an emblem image); the spine can grow richer later
 * (object-directed actions, pose/mood/composition hints).
 */
export type Interaction = {
  id: string;
  /** button/chip label, e.g. "Kissing" */
  label: string;
  /** relation phrase: "{A} {rel}" (solo) or "{A} {rel} {B}" (pair) */
  rel: string;
  /** true = applies to a single character (no target); default false = pair */
  solo?: boolean;
};

export const INTERACTIONS: Interaction[] = [
  // ── pair (character → character) ──
  { id: 'fighting', label: 'Fighting', rel: 'is fighting with' },
  { id: 'flirting', label: 'Flirting', rel: 'is flirting with' },
  { id: 'kissing', label: 'Kissing', rel: 'is kissing' },
  { id: 'embracing', label: 'Embracing', rel: 'is embracing' },
  { id: 'protecting', label: 'Protecting', rel: 'is protecting' },
  { id: 'chasing', label: 'Chasing', rel: 'is chasing' },
  { id: 'confronting', label: 'Confronting', rel: 'is confronting' },
  { id: 'comforting', label: 'Comforting', rel: 'is comforting' },
  // ── solo (one character, no target) ──
  { id: 'kneeling', label: 'Kneeling', rel: 'is kneeling', solo: true },
  { id: 'jumping', label: 'Jumping', rel: 'leaps into the air', solo: true },
  { id: 'laughing', label: 'Laughing', rel: 'is laughing', solo: true },
  { id: 'sitting', label: 'Sitting', rel: 'is sitting', solo: true },
  { id: 'running', label: 'Running', rel: 'is running', solo: true },
  { id: 'reaching', label: 'Reaching', rel: 'is reaching upward', solo: true },
  { id: 'crying', label: 'Crying', rel: 'is crying', solo: true },
  { id: 'standing', label: 'Standing', rel: 'stands still', solo: true },
];
