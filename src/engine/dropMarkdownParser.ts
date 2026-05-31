import type { DropPromptInput } from '../types';

// Parses the markdown format used in the drops/*.md catalog files. Format:
//
//   # Drop Title — Style — N-Prompt Set (Model)
//
//   description prose...
//
//   **Recipe — Name × Universe (Model)**
//   - **Model:** Z-Image-Turbo
//   - ...
//   - **Style tail:** *style description*
//
//   **Shared negative:**
//   ```
//   negative text
//   ```
//
//   ---
//
//   ## 01 — Prompt Name (hero)
//   **Save as:** `01_prompt_name.png` · 1024×1280
//   ```
//   full prompt text
//   ```
//
//   ## 02 — Another Prompt
//   ...
//
// Parser is forgiving: a missing piece just yields a partial result.

export type ParsedDrop = {
  title?: string;
  recipeHint?: string;
  modelHint?: string;
  styleTailHint?: string;
  negativeHint?: string;
  prompts: DropPromptInput[];
};

const stripTrailingParens = (s: string): string =>
  s.replace(/\s*\(hero\)\s*$/i, '').replace(/\s*\(wide hero\)\s*$/i, '').trim();

const cleanTitle = (raw: string): string => {
  // Drop the trailing " — N-Prompt Set" / " (Model)" cruft for a cleaner name.
  return raw
    .replace(/\s*—\s*\d+-Prompt Set.*$/i, '')
    .replace(/\s*\(.*\)\s*$/, '')
    .trim();
};

const extractFirstCodeBlock = (text: string): string | null => {
  // Match the first fenced code block (any language tag).
  const match = text.match(/```[a-zA-Z]*\n([\s\S]*?)\n```/);
  return match ? match[1].trim() : null;
};

const extractInlineCodeAfter = (text: string, label: string): string | null => {
  // e.g. **Save as:** `01_thing.png` · 1024×1280
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\*\\*${escaped}:?\\*\\*\\s*\`([^\`]+)\``, 'i');
  const m = text.match(re);
  return m ? m[1].trim() : null;
};

const extractItalicAfter = (text: string, label: string): string | null => {
  // e.g. **Style tail:** *italic description*
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\*\\*${escaped}:?\\*\\*\\s*\\*([^*]+)\\*`, 'i');
  const m = text.match(re);
  return m ? m[1].trim() : null;
};

const extractLineAfter = (text: string, label: string): string | null => {
  // e.g. **Model:** Z-Image-Turbo
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\*\\*${escaped}:?\\*\\*\\s*([^\\n]+)`, 'i');
  const m = text.match(re);
  return m ? m[1].trim() : null;
};

export function parseDropMarkdown(md: string): ParsedDrop {
  const result: ParsedDrop = { prompts: [] };

  // Title from first H1.
  const titleMatch = md.match(/^#\s+(.+?)\s*$/m);
  if (titleMatch) {
    result.title = cleanTitle(titleMatch[1]);
  }

  // Recipe-level metadata. Try to grab style tail (italic after **Style tail:**)
  // and model (line after **Model:**). These are hints only.
  const styleTail = extractItalicAfter(md, 'Style tail');
  if (styleTail) result.styleTailHint = styleTail;

  const model = extractLineAfter(md, 'Model');
  if (model) result.modelHint = model;

  // Recipe name — try to pull from the **Recipe — Name × ...** header.
  const recipeMatch = md.match(/\*\*Recipe\s*[—-]\s*([^*\n]+?)\*\*/);
  if (recipeMatch) result.recipeHint = recipeMatch[1].trim();

  // Negative — first code block after a "**Shared negative:**" or similar label.
  const negIdx = md.search(/\*\*Shared negative:?\*\*/i);
  if (negIdx >= 0) {
    const tail = md.slice(negIdx);
    const negBlock = extractFirstCodeBlock(tail);
    if (negBlock) result.negativeHint = negBlock;
  }

  // Prompt sections. Split on H2 (^## ) — anything before the first one is
  // the recipe preamble and gets ignored here.
  const parts = md.split(/^##\s+/m);
  // parts[0] is the preamble; the rest are prompt sections.
  for (let i = 1; i < parts.length; i++) {
    const section = parts[i];
    const newlineIdx = section.indexOf('\n');
    const header = (newlineIdx >= 0 ? section.slice(0, newlineIdx) : section).trim();
    const body = newlineIdx >= 0 ? section.slice(newlineIdx + 1) : '';

    // Header like "01 — Patchwork Bride (hero)" or "01 — Patchwork Bride"
    // Strip the leading number/em-dash and (hero) suffix.
    const nameOnly = header.replace(/^\d+\s*[—\-:]\s*/, '');
    const name = stripTrailingParens(nameOnly) || header;

    const saveAs = extractInlineCodeAfter(body, 'Save as') ?? undefined;
    const prompt = extractFirstCodeBlock(body);
    if (!prompt) continue;

    result.prompts.push({
      name,
      saveAs,
      prompt,
    });
  }

  return result;
}
