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
