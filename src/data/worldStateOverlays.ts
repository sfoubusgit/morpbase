export const VARIATION_PHRASE_POOL: string[] = [
  // position & spatial relationship
  'viewed from below, looking up',
  'aerial view looking down upon the scene',
  'seen from behind',
  'interior space, enclosed within',
  'looking outward from within',
  'at great distance, environment as backdrop',
  'viewed from the threshold',
  'hidden vantage point, partially obscured',
  'from the periphery, edge of the space',
  'the facade facing directly forward',
  'rear approach, the hidden side',
  'looking through an opening in the structure',
  'elevated vantage, above the main level',
  'ground level, close to the earth',
  'submerged perspective, world looming above',
  'framed by the architecture',
  'the subject dwarfed by the environment',
  'intimate proximity to the surface',
  'viewed from a narrow passage',
  'standing at the boundary between inside and outside',

  // temporal & narrative moment
  'before anything has happened',
  'traces of what came before remain',
  'long after everyone has left',
  'before the first arrival',
  'time has passed visibly',
  'caught mid-transition',
  'the day is ending',
  'the night is at its deepest point',
  'early morning stillness, not yet awake',
  'the light is in the middle of changing',
  'suspended in anticipation of what comes next',
  'the moment just after the event',
  'preserved against decay, held in stasis',
  'overgrown with time, reclaimed',
  'recently abandoned, still warm',
  'lived-in and worn by years of use',
  'pristine and unused, waiting',

  // atmosphere & register
  'warmth despite the cold surroundings',
  'nowhere to hide, fully exposed',
  'something is wrong, difficult to name',
  'the light feels displaced, off',
  'impossibly vast, scale beyond comprehension',
  'awe and quiet discovery',
  'safe harbor, the world outside cannot enter',
  'liminal, between states, neither here nor there',
  'oppressive presence, the space pressing inward',
  'unease without visible source',
  'wonder and scale overwhelming the senses',
  'deep intimacy and enclosure',
  'exposed and observed from an unseen direction',
  'suspended silence, sound absorbed',
  'charged with memory and absence',
  'emptiness that has physical weight',
  'the sublime, too large to fully perceive',
  'gentle and quietly forgotten',
  'melancholy without cause',
  'relief, as if arriving after a long journey',

  // scale & detail emphasis
  'texture and surface detail fill the frame',
  'the full scale of the environment revealed',
  'close enough to touch the surface',
  'a single detail dominates everything',
  'depth and layered planes of space',
  'foreground elements dominate the composition',
  'the background carries the emotional weight',
  'partial view, cut off at the edges',
  'the architecture frames the sky',
  'shadow and light divide the space equally',
  'a single light source from an unexpected angle',
  'diffused light, no hard shadows',
  'the environment in silhouette',
  'reflected surfaces doubling the space',
  'the path through the space made visible',
];

const PICK_COUNT = 3;

export function getVariationPhrases(excludePhrases?: string[]): string[] {
  const pool = excludePhrases?.length
    ? VARIATION_PHRASE_POOL.filter(p => !excludePhrases.includes(p))
    : VARIATION_PHRASE_POOL;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(PICK_COUNT, shuffled.length));
}
