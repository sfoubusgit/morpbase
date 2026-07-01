/**
 * v3 Interactions — directed actions that link two characters in a scene.
 *
 * The face is dead simple (a verb chip: "A —kissing→ B"); the spine can grow
 * rich later (pose/mood/composition hints). v0 keeps only a display label and a
 * relation phrase used to state the interaction to the synthesizer.
 */
export type Interaction = {
  id: string;
  /** button/chip label, e.g. "Kissing" */
  label: string;
  /** relation phrase inserted between the two names: "{A} {rel} {B}" */
  rel: string;
};

export const INTERACTIONS: Interaction[] = [
  { id: 'fighting', label: 'Fighting', rel: 'is fighting with' },
  { id: 'flirting', label: 'Flirting', rel: 'is flirting with' },
  { id: 'kissing', label: 'Kissing', rel: 'is kissing' },
  { id: 'embracing', label: 'Embracing', rel: 'is embracing' },
  { id: 'protecting', label: 'Protecting', rel: 'is protecting' },
  { id: 'chasing', label: 'Chasing', rel: 'is chasing' },
  { id: 'confronting', label: 'Confronting', rel: 'is confronting' },
  { id: 'comforting', label: 'Comforting', rel: 'is comforting' },
];
