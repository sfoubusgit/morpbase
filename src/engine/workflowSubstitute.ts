import type {
  Drop,
  DropPrompt,
  Recipe,
  WorkflowPlaceholderKey,
  WorkflowTemplate,
} from '../types';

// Substitute placeholders in a workflow template body with values from
// (recipe, dropPrompt). Convention:
//   {{positive}}    -> dropPrompt.prompt          (string, lives inside JSON quotes)
//   {{negative}}    -> recipe.negative            (string)
//   {{seed}}        -> 32-bit random uint         (number, no quotes)
//   {{steps}}       -> recipe.settings.steps      (number)
//   {{cfg}}         -> midpoint of cfgMin..cfgMax (number, supports decimals)
//   {{width}}       -> recipe.settings.resolution.width   (number)
//   {{height}}      -> recipe.settings.resolution.height  (number)
//   {{sampler}}     -> recipe.settings.sampler ?? 'euler'  (string)
//   {{scheduler}}   -> recipe.settings.scheduler ?? 'simple' (string)
//   {{model}}       -> recipe.settings.model       (string)
//   {{promptName}}  -> dropPrompt.name             (string)
//   {{saveAs}}      -> dropPrompt.saveAs ?? promptName slug (string)
//
// String values are JSON-escaped (internal characters only — quotes stay
// in the template) so the result remains valid JSON.

const stringPlaceholderKeys: WorkflowPlaceholderKey[] = [
  'positive',
  'negative',
  'sampler',
  'scheduler',
  'model',
  'promptName',
  'saveAs',
];

const numericPlaceholderKeys: WorkflowPlaceholderKey[] = [
  'seed',
  'steps',
  'cfg',
  'width',
  'height',
];

const ALL_PLACEHOLDER_KEYS: WorkflowPlaceholderKey[] = [
  ...stringPlaceholderKeys,
  ...numericPlaceholderKeys,
];

const escapeForJsonString = (value: string): string => {
  // JSON.stringify wraps a string in quotes; slice the outer quotes off so
  // the placeholder (which already lives inside quotes in the template) is
  // replaced cleanly.
  const wrapped = JSON.stringify(value);
  return wrapped.slice(1, -1);
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || 'prompt';

export const PLACEHOLDER_TOKENS = ALL_PLACEHOLDER_KEYS.map(k => `{{${k}}}`);

export function detectPlaceholders(templateBody: string): WorkflowPlaceholderKey[] {
  const found = new Set<WorkflowPlaceholderKey>();
  for (const key of ALL_PLACEHOLDER_KEYS) {
    if (templateBody.includes(`{{${key}}}`)) found.add(key);
  }
  return Array.from(found);
}

export type SubstituteOptions = {
  seed?: number;
};

export function substituteWorkflow(
  template: WorkflowTemplate,
  recipe: Recipe,
  prompt: DropPrompt,
  options: SubstituteOptions = {}
): string {
  const seed = options.seed ?? Math.floor(Math.random() * 0xFFFFFFFF);
  const cfg = (recipe.settings.cfgMin + recipe.settings.cfgMax) / 2;

  const stringValues: Record<WorkflowPlaceholderKey, string> = {
    positive: prompt.prompt,
    negative: recipe.negative,
    sampler: recipe.settings.sampler ?? 'euler',
    scheduler: recipe.settings.scheduler ?? 'simple',
    model: recipe.settings.model,
    promptName: prompt.name,
    saveAs: prompt.saveAs ?? slugify(prompt.name),
    // numeric placeholders aren't used here; type satisfied by overwriting below
    seed: '',
    steps: '',
    cfg: '',
    width: '',
    height: '',
  };

  const numericValues: Record<WorkflowPlaceholderKey, number> = {
    seed,
    steps: recipe.settings.steps,
    cfg,
    width: prompt.resolution?.width ?? recipe.settings.resolution.width,
    height: prompt.resolution?.height ?? recipe.settings.resolution.height,
    // unused for numeric path
    positive: 0,
    negative: 0,
    sampler: 0,
    scheduler: 0,
    model: 0,
    promptName: 0,
    saveAs: 0,
  };

  let out = template.body;
  for (const key of stringPlaceholderKeys) {
    const token = `{{${key}}}`;
    if (out.includes(token)) {
      out = out.split(token).join(escapeForJsonString(stringValues[key]));
    }
  }
  for (const key of numericPlaceholderKeys) {
    const token = `{{${key}}}`;
    if (out.includes(token)) {
      out = out.split(token).join(String(numericValues[key]));
    }
  }
  return out;
}

export type WorkflowExportFilename = {
  base: string;
  extension: '.json';
};

export function buildExportFilename(drop: Drop, prompt: DropPrompt): WorkflowExportFilename {
  const dropSlug = slugify(drop.name);
  const promptSlug = prompt.saveAs
    ? slugify(prompt.saveAs.replace(/\.png$/i, ''))
    : slugify(prompt.name);
  return { base: `${dropSlug}__${promptSlug}_workflow`, extension: '.json' };
}

export function triggerDownload(filename: string, contents: string): void {
  const blob = new Blob([contents], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Slight delay so Safari doesn't kill the blob before download starts.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
