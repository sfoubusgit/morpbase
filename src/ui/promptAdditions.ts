import type { PromptAdditionEntry, PromptAdditionPosition } from '../types';

const POSITION_ORDER: PromptAdditionPosition[] = ['start', 'middle', 'end'];

export const splitPromptAdditions = (entries: PromptAdditionEntry[]) => {
  const grouped: Record<PromptAdditionPosition, string[]> = {
    start: [],
    middle: [],
    end: [],
  };

  entries.forEach(entry => {
    const text = entry.text.trim();
    if (!text) return;
    grouped[entry.position].push(text);
  });

  return grouped;
};

export const composePromptWithAdditions = (baseText: string, entries: PromptAdditionEntry[]) => {
  const grouped = splitPromptAdditions(entries);
  return [...grouped.start, baseText.trim(), ...grouped.middle, ...grouped.end]
    .map(part => part.trim())
    .filter(Boolean)
    .join(', ');
};

export const composeStructuredAdditionSections = (entries: PromptAdditionEntry[]) => {
  const grouped = splitPromptAdditions(entries);
  return POSITION_ORDER
    .map(position => {
      const texts = grouped[position];
      if (texts.length === 0) return null;
      return {
        label: position === 'start' ? 'Start Fragments' : position === 'middle' ? 'Middle Fragments' : 'End Fragments',
        text: texts.join(', '),
      };
    })
    .filter(Boolean) as Array<{ label: string; text: string }>;
};
