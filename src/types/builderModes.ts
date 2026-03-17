export const BUILDER_MODE_IDS = [
  'balanced',
  'character-first',
  'environment-first',
  'scene-first',
] as const;

export type BuilderModeId = (typeof BUILDER_MODE_IDS)[number];

export const BUILDER_STAGE_IDS = [
  'define',
  'refine',
  'finish',
] as const;

export type BuilderStageId = (typeof BUILDER_STAGE_IDS)[number];

export const BUILDER_CATEGORY_IDS = [
  'subject',
  'style',
  'lighting',
  'camera',
  'environment',
  'quality',
  'effects',
  'post-processing',
  'actions',
  'anatomy-details',
] as const;

export type BuilderCategoryId = (typeof BUILDER_CATEGORY_IDS)[number];

export type BuilderStageDefinition = {
  id: BuilderStageId;
  label: string;
  hint: string;
  categories: BuilderCategoryId[];
  optional?: boolean;
};

export type BuilderModeConfig = {
  id: BuilderModeId;
  label: string;
  description: string;
  startCategoryId: BuilderCategoryId;
  categoryOrder: BuilderCategoryId[];
  suggestedNextOrder: BuilderCategoryId[];
  stages: BuilderStageDefinition[];
};
