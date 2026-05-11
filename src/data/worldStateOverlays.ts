export const VARIATION_PHRASE_POOL: string[] = [
  // camera angle & framing
  'extreme low angle, shot from the ground looking steeply upward',
  'bird\'s eye view directly overhead',
  'wide establishing shot, the full environment visible',
  'extreme close-up, surface texture fills the frame',
  'over the shoulder, figure silhouetted in foreground',
  'viewed from behind the subject',
  'framed by an archway or doorway',
  'dutch angle, slightly tilted frame',
  'fisheye lens, curved and distorted edges',
  'shot through a narrow gap or opening',
  'from the threshold, neither inside nor outside',
  'elevated vantage looking down across the space',
  'ground level, intimate and low to the earth',
  'reflection visible in water or a mirrored surface',
  'rear approach, the back side of the environment',
  'the subject at the very edge of the frame',
  'partial view, composition deliberately cut off',
  'seen from a hidden vantage, partially obscured',

  // distance & scale
  'tiny figure, the environment dwarfing everything',
  'the subject fills the entire frame, no environment visible',
  'extreme distance, subject barely discernible',
  'depth and layered planes receding into the background',
  'foreground element dominates, background compressed',
  'the background carries all the visual weight',
  'intimate proximity, close enough to touch the surface',
  'vast panoramic scale, beyond what the eye can hold',

  // lighting & atmosphere
  'single shaft of light cutting through deep shadow',
  'strong directional side lighting, half the scene in darkness',
  'silhouette against a bright open sky',
  'underlighting, source coming from directly below',
  'golden hour, warm raking sun from the side',
  'deep night, illuminated by a single concentrated source',
  'overcast flat light, no shadows anywhere',
  'harsh noon light, black shadows straight down',
  'rim light from behind, subject outlined in light',
  'fog or mist softening all edges and distances',
  'volumetric rays of light through dust or smoke',
  'stormy sky, dramatic charged atmosphere',
  'moonlight, cool blue-white, sharp deep shadows',

  // time & condition
  'pre-dawn, the moment before light arrives',
  'dusk, last light fading from the sky',
  'deep night at its darkest point',
  'early morning, long cold shadows',
  'abandoned and overgrown, nature reclaiming the space',
  'pristine and untouched, perfect condition',
  'worn and aged, years of use visible in every surface',
  'recently abandoned, still warm from occupancy',
  'flooded, water covering the lower surfaces',
  'heavy snowfall, everything blanketed and muffled',
  'after rain, wet reflective surfaces everywhere',
  'dry heat, bleached and sun-scorched',
  'fire light, flickering warm source nearby',

  // composition emphasis
  'strong geometric lines leading the eye into depth',
  'symmetrical composition, mirrored on both sides',
  'the architecture frames the sky',
  'shadow and light dividing the frame in half',
  'a single point of brightness in an otherwise dark frame',
  'the path through the space made visible',
  'the environment in full silhouette against the sky',
];

const PICK_COUNT = 4;

export function getVariationPhrases(excludePhrases?: string[]): string[] {
  const pool = excludePhrases?.length
    ? VARIATION_PHRASE_POOL.filter(p => !excludePhrases.includes(p))
    : VARIATION_PHRASE_POOL;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(PICK_COUNT, shuffled.length));
}
