import type {
  Drop,
  PostDraftInputs,
  PostPlaceholderKey,
  PostTemplate,
  Recipe,
} from '../types';

// Post-template substitution. Plain string-replace on a prose body — no
// JSON escaping (unlike workflowSubstitute, since the output isn't JSON).
//
// Resolved tokens:
//   {{dropName}}              - drop.name
//   {{recipeName}}            - recipe.name
//   {{universeName}}          - resolved by caller (empty if none)
//   {{styleName}}             - resolved by caller (empty if none)
//   {{model}}                 - recipe.settings.model
//   {{promptCount}}           - drop.prompts.length
//   {{projectTagsCsv}}        - drop.projectTags.join(', ')
//   {{projectTagsHashtags}}   - drop.projectTags.map(t => '#' + t).join(' ')
//
// User-filled at draft time:
//   {{loreCaption}}           - free-form prose
//   {{cta}}                   - call-to-action line
//   {{styleNotes}}            - style read note
//   {{extraTags}}             - drop.extraTags CSV
//   {{extraTagsHashtags}}     - drop.extraTags as # space-joined

const ALL_KEYS: PostPlaceholderKey[] = [
  'dropName',
  'recipeName',
  'universeName',
  'styleName',
  'model',
  'promptCount',
  'projectTagsCsv',
  'projectTagsHashtags',
  'loreCaption',
  'cta',
  'styleNotes',
  'extraTags',
  'extraTagsHashtags',
];

export const POST_PLACEHOLDER_TOKENS = ALL_KEYS.map(k => `{{${k}}}`);

export function detectPostPlaceholders(body: string): PostPlaceholderKey[] {
  const found = new Set<PostPlaceholderKey>();
  for (const key of ALL_KEYS) {
    if (body.includes(`{{${key}}}`)) found.add(key);
  }
  return Array.from(found);
}

export type SubstitutePostContext = {
  template: PostTemplate;
  drop: Drop;
  recipe: Recipe;
  universeName?: string;
  styleName?: string;
  draft: PostDraftInputs;
};

const tagsToHashtags = (csv: string): string =>
  csv
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
    .map(t => `#${t.replace(/\s+/g, '_')}`)
    .join(' ');

export function substitutePost(ctx: SubstitutePostContext): string {
  const { template, drop, recipe, universeName, styleName, draft } = ctx;

  const values: Record<PostPlaceholderKey, string> = {
    dropName: drop.name,
    recipeName: recipe.name,
    universeName: universeName ?? '',
    styleName: styleName ?? '',
    model: recipe.settings.model,
    promptCount: String(drop.prompts.length),
    projectTagsCsv: drop.projectTags.join(', '),
    projectTagsHashtags: drop.projectTags.map(t => `#${t.replace(/\s+/g, '_')}`).join(' '),
    loreCaption: draft.loreCaption ?? '',
    cta: draft.cta ?? '',
    styleNotes: draft.styleNotes ?? '',
    extraTags: draft.extraTags ?? '',
    extraTagsHashtags: tagsToHashtags(draft.extraTags ?? ''),
  };

  let out = template.body;
  for (const key of ALL_KEYS) {
    const token = `{{${key}}}`;
    if (out.includes(token)) {
      out = out.split(token).join(values[key]);
    }
  }
  return out;
}
