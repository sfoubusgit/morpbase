import { useState, useEffect, useCallback } from 'react';
import './InspirationField.css';

const CONCEPTS = [
  'a woman at the edge of a cliff',
  'a figure emerging from smoke',
  'a girl in an empty subway car',
  'someone watching rain on a window',
  'a woman asleep in tall grass',
  'a silhouette in a bright doorway',
  'a person surrounded by falling petals',
  'a woman standing in a flooded street',
  'a girl on a fire escape at night',
  'someone looking up at a sky full of birds',
  'the moment before everything changes',
  'something beautiful breaking apart',
  'the last light of the day',
  'a secret being kept',
  'an abandoned place that used to matter',
  'between two versions of herself',
  'the quiet after something loud',
  'the beginning of a long walk',
  'a door left open',
  'reflected in still water',
  'silhouetted against neon signs',
  'lit only by candlelight',
  'in the middle of a crowd, alone',
  'surrounded by wildflowers',
  'underwater, looking up toward light',
  'at the edge of a city at night',
  'seen through frosted glass',
  'casting a long shadow',
  'reaching for something out of frame',
  'looking over her shoulder',
  'eyes closed, listening',
  'sitting on a rooftop at night',
  'lying in the rain',
  'standing very still while the world moves',
  'running toward something',
  'holding something carefully',
  'the weight of wanting',
  'a feeling that has no name',
  'light through broken glass',
  'something soft and something sharp',
  'warmth in a cold place',
  'the space between two choices',
  'something ending slowly',
  'a world slightly wrong',
  'midnight market, warm lanterns',
  'a desert highway, empty',
  'flooded streets at golden hour',
  'a greenhouse at night',
  'the roof of a building at sunrise',
  'a burning thing, no one watching',
  'two moons, one sky',
  'a city seen from above, sleeping',
  'a creature that is not afraid',
  'fog so thick it has weight',
  'a bridge at the edge of a map',
  'salt flats at dusk',
];

const CHARACTER_TEMPLATES: Array<(name: string) => string> = [
  name => `${name} in an unfamiliar place`,
  name => `${name} with her back to the camera`,
  name => `${name} in the rain`,
  name => `${name} at night, alone`,
  name => `${name} looking at something just offscreen`,
  name => `${name} surrounded by light`,
  name => `${name} on a rooftop`,
  name => `${name} in a crowd`,
];

type ChipData = {
  id: string;
  text: string;
  size: 'sm' | 'md' | 'lg';
  opacity: number;
  nudgeY: number;
};

const SIZE_PATTERN: Array<'sm' | 'md' | 'lg'> = [
  'sm', 'md', 'sm', 'lg', 'md', 'sm', 'md', 'lg',
  'sm', 'md', 'sm', 'md', 'lg', 'sm', 'md', 'sm',
];

function generateChips(
  characterName: string | null,
  worldPhrases: string[] | undefined,
  excludeTexts: string[],
): ChipData[] {
  const charConcepts = characterName
    ? CHARACTER_TEMPLATES.map(t => t(characterName))
    : [];

  const basePool = worldPhrases && worldPhrases.length > 0 ? worldPhrases : CONCEPTS;
  const pool = [...charConcepts, ...basePool].filter(t => !excludeTexts.includes(t));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, 55);

  return picked.map((text, i) => ({
    id: `${i}-${Math.random().toString(36).slice(2, 6)}`,
    text,
    size: SIZE_PATTERN[i % SIZE_PATTERN.length],
    opacity: 0.38 + Math.random() * 0.52,
    nudgeY: Math.floor(Math.random() * 18),
  }));
}

type InspirationFieldProps = {
  activeCharacterName: string | null;
  worldPhrases?: string[];
  activeTexts: string[];
  onChipToggle: (text: string) => void;
};

export function InspirationField({
  activeCharacterName,
  worldPhrases,
  activeTexts,
  onChipToggle,
}: InspirationFieldProps) {
  const [chips, setChips] = useState<ChipData[]>(() =>
    generateChips(null, worldPhrases, activeTexts),
  );

  useEffect(() => {
    setChips(generateChips(activeCharacterName, worldPhrases, activeTexts));
  }, [activeCharacterName, worldPhrases]);

  const handleRefresh = useCallback(() => {
    setChips(generateChips(activeCharacterName, worldPhrases, activeTexts));
  }, [activeCharacterName, worldPhrases, activeTexts]);

  return (
    <div className="inspiration-field">
      <div className="inspiration-field-header">
        <span className="inspiration-field-label">Starting Points</span>
        <button type="button" className="inspiration-field-refresh" onClick={handleRefresh}>
          Refresh
        </button>
      </div>
      <div className="inspiration-field-chips">
        {activeTexts.map(text => (
          <button
            key={`active:${text}`}
            type="button"
            className="inspiration-chip inspiration-chip-md inspiration-chip-active"
            onClick={() => onChipToggle(text)}
          >
            {text}
          </button>
        ))}
        {chips.map(chip => (
          <button
            key={chip.id}
            type="button"
            className={`inspiration-chip inspiration-chip-${chip.size}`}
            style={{ opacity: chip.opacity, marginTop: chip.nudgeY }}
            onClick={() => onChipToggle(chip.text)}
          >
            {chip.text}
          </button>
        ))}
      </div>
    </div>
  );
}
