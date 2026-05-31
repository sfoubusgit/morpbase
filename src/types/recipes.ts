// Recipe & LoRA entities.
//
// A Recipe is a reusable render configuration — model, settings, style tail,
// negative, LoRA stack, and optional origin universe/style. Recipes are the
// spine of MorpBase's synthesis layer: a Drop is "this Recipe x this set of
// prompts", and the renderer (Phase 3) knows how to execute one because the
// Recipe carries everything ComfyUI needs.
//
// A LoraEntry tracks a single LoRA file (e.g. `new_pixel_core-ILL.safetensors`)
// with its model family, default weight, trigger words, and any compositional
// notes. Recipes reference LoRAs by id.

// ----- LoRA -----

export type LoraModelFamily =
  | 'illustrious'
  | 'flux'
  | 'z-image-turbo'
  | 'sdxl'
  | 'other';

export type LoraEntry = {
  id: string;
  name: string;
  summary?: string;
  filename: string;
  modelFamily: LoraModelFamily;
  defaultWeight: number;
  triggerWords: string[];
  notes?: string;
  coverImageUrl?: string | null;
  createdAt: number;
  updatedAt: number;
};

export type LoraEntryInput = {
  name: string;
  summary?: string;
  filename: string;
  modelFamily: LoraModelFamily;
  defaultWeight?: number;
  triggerWords?: string[];
  notes?: string;
  coverImageUrl?: string | null;
};

export type LoraStore = {
  version: 1;
  items: LoraEntry[];
};

// ----- Recipe -----

export type RenderResolution = {
  width: number;
  height: number;
};

export type RecipeSettings = {
  model: string;
  sampler?: string;
  scheduler?: string;
  steps: number;
  cfgMin: number;
  cfgMax: number;
  resolution: RenderResolution;
};

export type Recipe = {
  id: string;
  name: string;
  summary?: string;
  notes?: string;
  coverImageUrl?: string | null;
  settings: RecipeSettings;
  styleTail: string;
  negative: string;
  loraIds: string[];
  universeId?: string;
  styleId?: string;
  projectTags: string[];
  createdAt: number;
  updatedAt: number;
};

export type RecipeInput = {
  name: string;
  summary?: string;
  notes?: string;
  coverImageUrl?: string | null;
  settings: RecipeSettings;
  styleTail: string;
  negative: string;
  loraIds?: string[];
  universeId?: string;
  styleId?: string;
  projectTags?: string[];
};

export type RecipeStore = {
  version: 1;
  items: Recipe[];
};

// ----- Drop -----
//
// A Drop is a named batch of prompts bound to a Recipe. Each prompt is a
// complete text (subject + style detail + style tail, all woven together —
// matching the format of the existing drops/*.md catalogs).

export type DropStatus = 'draft' | 'ready' | 'rendered' | 'shipped';

export type DropPrompt = {
  id: string;
  name: string;
  saveAs?: string;
  prompt: string;
  resolution?: RenderResolution;
};

export type Drop = {
  id: string;
  name: string;
  recipeId: string;
  summary?: string;
  notes?: string;
  prompts: DropPrompt[];
  projectTags: string[];
  status: DropStatus;
  createdAt: number;
  updatedAt: number;
};

export type DropPromptInput = {
  name: string;
  saveAs?: string;
  prompt: string;
  resolution?: RenderResolution;
};

export type DropInput = {
  name: string;
  recipeId: string;
  summary?: string;
  notes?: string;
  prompts?: DropPromptInput[];
  projectTags?: string[];
  status?: DropStatus;
};

export type DropStore = {
  version: 1;
  items: Drop[];
};

// ----- WorkflowTemplate -----
//
// A WorkflowTemplate is a ComfyUI workflow JSON (UI graph format or API
// format — either works) with placeholder tokens like `{{positive}}`,
// `{{negative}}`, `{{seed}}`, `{{steps}}`, `{{cfg}}`, `{{width}}`,
// `{{height}}`, `{{sampler}}`, `{{scheduler}}` embedded where prompt /
// settings values should be injected at export time.
//
// At export, substituteWorkflow() does plain string-replacement on the
// body to produce a ready-to-load workflow file. String placeholders go
// inside JSON quotes ("text": "{{positive}}"); numeric placeholders go
// without quotes ("steps": {{steps}}).

export type WorkflowPlaceholderKey =
  | 'positive'
  | 'negative'
  | 'seed'
  | 'steps'
  | 'cfg'
  | 'width'
  | 'height'
  | 'sampler'
  | 'scheduler'
  | 'model'
  | 'promptName'
  | 'saveAs';

export type WorkflowTemplate = {
  id: string;
  name: string;
  modelFamily: LoraModelFamily;
  summary?: string;
  notes?: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

export type WorkflowTemplateInput = {
  name: string;
  modelFamily: LoraModelFamily;
  summary?: string;
  notes?: string;
  body: string;
};

export type WorkflowTemplateStore = {
  version: 1;
  items: WorkflowTemplate[];
};

// ----- PostTemplate -----
//
// A PostTemplate is a prose template for the copy that accompanies a Drop
// when it's posted (CivitAI Atlas-of-Made-Worlds post, IG caption, etc.).
// Placeholder tokens are filled at draft time from:
//   - the Drop (name, project tags, prompt count)
//   - the Recipe (name, model)
//   - the resolved universe / style names
//   - the user's draft-time inputs (lore caption, CTA, style notes, extra tags)
//
// Substitution is plain string-replace, no JSON escaping (output is prose).

export type PostTarget = 'civitai' | 'instagram' | 'twitter' | 'other';

export type PostPlaceholderKey =
  | 'dropName'
  | 'recipeName'
  | 'universeName'
  | 'styleName'
  | 'model'
  | 'promptCount'
  | 'projectTagsCsv'
  | 'projectTagsHashtags'
  | 'loreCaption'
  | 'cta'
  | 'styleNotes'
  | 'extraTags'
  | 'extraTagsHashtags';

export type PostTemplate = {
  id: string;
  name: string;
  target: PostTarget;
  summary?: string;
  notes?: string;
  body: string;
  createdAt: number;
  updatedAt: number;
};

export type PostTemplateInput = {
  name: string;
  target: PostTarget;
  summary?: string;
  notes?: string;
  body: string;
};

export type PostTemplateStore = {
  version: 1;
  items: PostTemplate[];
};

// Optional draft-time inputs the user fills at "Draft Post" time. These
// aren't persisted on the Drop in v1; they live in the dialog form only.
export type PostDraftInputs = {
  loreCaption?: string;
  cta?: string;
  styleNotes?: string;
  extraTags?: string;
};

// ----- ComboNote -----
//
// A ComboNote is a tiny annotation on a (Universe, Style) pair. This is the
// "library of validated combos" surface — replaces the heavier Recipe entity
// that was over-engineered for the user's actual workflow.
//
// Identity: a ComboNote is uniquely identified by its (universeId, styleId)
// pair. The store upserts on that pair rather than allowing duplicates.

export type ComboStatus = 'untried' | 'sampled' | 'won' | 'failed';

export type ComboNote = {
  id: string;
  universeId: string;
  styleId: string;
  status: ComboStatus;
  notes: string;
  createdAt: number;
  updatedAt: number;
};

export type ComboNoteInput = {
  universeId: string;
  styleId: string;
  status?: ComboStatus;
  notes?: string;
};

export type ComboNoteStore = {
  version: 1;
  items: ComboNote[];
};
