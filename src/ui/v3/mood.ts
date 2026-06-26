/** v3 Mood lane — the emotional charge that colours the whole frame. */
export type MoodItem = { id: string; name: string; summary: string; phrases: string[]; tint: number };

export const MOOD_ITEMS: MoodItem[] = [
  { id: 'mood_tense', name: 'Tense', summary: 'Coiled stillness on the edge of action.', tint: 0,
    phrases: ['a tense, charged atmosphere', 'coiled stillness on the edge of violence'] },
  { id: 'mood_melancholy', name: 'Melancholy', summary: 'A quiet, blue-lit ache.', tint: 5,
    phrases: ['a melancholy, wistful mood', 'quiet loneliness under cold light'] },
  { id: 'mood_defiant', name: 'Defiant', summary: 'Chin up, holding ground.', tint: 8,
    phrases: ['a defiant, unbroken mood', 'standing ground, chin up, refusing to yield'] },
  { id: 'mood_serene', name: 'Serene', summary: 'Calm and unhurried.', tint: 6,
    phrases: ['a serene, calm and unhurried mood', 'soft stillness, nothing pressing'] },
  { id: 'mood_tender', name: 'Tender', summary: 'Soft, intimate warmth.', tint: 3,
    phrases: ['a tender, intimate warmth', 'a soft and gentle closeness'] },
  { id: 'mood_ominous', name: 'Ominous', summary: 'Something wrong, just out of frame.', tint: 9,
    phrases: ['an ominous, foreboding mood', 'a sense of something wrong waiting just out of frame'] },
  { id: 'mood_playful', name: 'Playful', summary: 'Light, mischievous energy.', tint: 4,
    phrases: ['a playful, mischievous energy', 'light and teasing, a half-smile'] },
  { id: 'mood_frantic', name: 'Frantic', summary: 'Motion, urgency, no time.', tint: 1,
    phrases: ['a frantic, urgent mood', 'everything in motion, no time to think'] },
];
