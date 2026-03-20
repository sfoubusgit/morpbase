import { POOL_SECTION_OPTIONS, type PromptAdditionEntry, type PromptAdditionPosition, type PoolSection } from '../types';

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
  const groupedBySection = new Map<string, string[]>();
  const unsectioned: string[] = [];

  entries.forEach(entry => {
    const text = entry.text.trim();
    if (!text) return;

    const section = entry.section?.trim();
    if (!section) {
      unsectioned.push(text);
      return;
    }

    const existing = groupedBySection.get(section) ?? [];
    existing.push(text);
    groupedBySection.set(section, existing);
  });

  const orderedSections = [
    ...POOL_SECTION_OPTIONS.filter(section => groupedBySection.has(section)),
    ...Array.from(groupedBySection.keys()).filter(
      section => !POOL_SECTION_OPTIONS.includes(section as PoolSection)
    ),
  ];

  const sections = orderedSections.map(section => ({
    label: section,
    text: groupedBySection.get(section)!.join(', '),
  }));

  if (unsectioned.length > 0) {
    sections.push({
      label: 'Additional Fragments',
      text: unsectioned.join(', '),
    });
  }

  return sections;
};
