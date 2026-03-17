import type { BuilderCategoryId, BuilderModeConfig, BuilderModeId } from '../types';

const createStage = (
  id: 'define' | 'refine' | 'finish',
  hint: string,
  categories: BuilderCategoryId[],
  optional = false
) => ({
  id,
  label: id.charAt(0).toUpperCase() + id.slice(1),
  hint,
  categories,
  optional,
});

export const BUILDER_MODE_CONFIGS: Record<BuilderModeId, BuilderModeConfig> = {
  balanced: {
    id: 'balanced',
    label: 'Balanced',
    description: 'Build freely across the core image layers. Start wherever your idea feels strongest.',
    startCategoryId: 'subject',
    categoryOrder: [
      'subject',
      'environment',
      'style',
      'lighting',
      'camera',
      'actions',
      'anatomy-details',
      'effects',
      'quality',
      'post-processing',
    ],
    suggestedNextOrder: [
      'subject',
      'environment',
      'style',
      'lighting',
      'camera',
      'actions',
      'effects',
      'quality',
      'post-processing',
      'anatomy-details',
    ],
    stages: [
      createStage('define', 'Start with the core image layers.', ['subject', 'environment', 'style']),
      createStage('refine', 'Shape mood, framing, and subject behavior.', ['lighting', 'camera', 'actions', 'anatomy-details']),
      createStage('finish', 'Optional polish, atmosphere, and final treatment.', ['effects', 'quality', 'post-processing'], true),
    ],
  },
  'character-first': {
    id: 'character-first',
    label: 'Character-First',
    description: 'Define the figure first, then build the surrounding scene around them.',
    startCategoryId: 'subject',
    categoryOrder: [
      'subject',
      'anatomy-details',
      'actions',
      'style',
      'lighting',
      'camera',
      'environment',
      'effects',
      'quality',
      'post-processing',
    ],
    suggestedNextOrder: [
      'subject',
      'anatomy-details',
      'actions',
      'style',
      'lighting',
      'camera',
      'environment',
      'effects',
      'quality',
      'post-processing',
    ],
    stages: [
      createStage('define', 'Start with figure identity, form, and action.', ['subject', 'anatomy-details', 'actions']),
      createStage('refine', 'Shape how the figure is styled, lit, and framed.', ['style', 'lighting', 'camera']),
      createStage('finish', 'Use scene support and polish after the figure reads clearly.', ['environment', 'effects', 'quality', 'post-processing'], true),
    ],
  },
  'environment-first': {
    id: 'environment-first',
    label: 'Environment-First',
    description: 'Build the place first. Define atmosphere, space, and mood before adding anchors.',
    startCategoryId: 'environment',
    categoryOrder: [
      'environment',
      'lighting',
      'camera',
      'style',
      'effects',
      'subject',
      'quality',
      'actions',
      'post-processing',
      'anatomy-details',
    ],
    suggestedNextOrder: [
      'environment',
      'lighting',
      'camera',
      'style',
      'effects',
      'subject',
      'quality',
      'actions',
      'post-processing',
      'anatomy-details',
    ],
    stages: [
      createStage('define', 'Start with place, atmosphere, and spatial framing.', ['environment', 'lighting', 'camera']),
      createStage('refine', 'Deepen the world, then add a focal anchor if needed.', ['style', 'effects', 'subject']),
      createStage('finish', 'Use polish and action only after the world reads clearly.', ['quality', 'actions', 'post-processing', 'anatomy-details'], true),
    ],
  },
  'scene-first': {
    id: 'scene-first',
    label: 'Scene-First',
    description: 'Build the full moment by balancing subject, setting, and action early.',
    startCategoryId: 'subject',
    categoryOrder: [
      'subject',
      'environment',
      'actions',
      'lighting',
      'camera',
      'style',
      'effects',
      'quality',
      'post-processing',
      'anatomy-details',
    ],
    suggestedNextOrder: [
      'subject',
      'environment',
      'actions',
      'lighting',
      'camera',
      'style',
      'effects',
      'quality',
      'post-processing',
      'anatomy-details',
    ],
    stages: [
      createStage('define', 'Establish the core moment through subject, place, and action.', ['subject', 'environment', 'actions']),
      createStage('refine', 'Shape the scene through lighting, framing, and style.', ['lighting', 'camera', 'style']),
      createStage('finish', 'Layer intensity and polish after the moment is readable.', ['effects', 'quality', 'post-processing', 'anatomy-details'], true),
    ],
  },
};

export const BUILDER_MODE_ORDER: BuilderModeId[] = [
  'balanced',
  'character-first',
  'environment-first',
  'scene-first',
];

export const DEFAULT_BUILDER_MODE_ID: BuilderModeId = 'balanced';

export const getBuilderModeConfig = (modeId: BuilderModeId): BuilderModeConfig =>
  BUILDER_MODE_CONFIGS[modeId];
