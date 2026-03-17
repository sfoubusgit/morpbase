export type PromptFragmentDefinition = {
  id: string;
  label: string;
  outputText: string;
  tags?: string[];
};

export const PROMPT_FRAGMENT_DEFINITIONS: PromptFragmentDefinition[] = [
  { id: 'masterpiece', label: 'Masterpiece', outputText: 'masterpiece', tags: ['quality'] },
  { id: 'highly_detailed', label: 'Highly Detailed', outputText: 'highly detailed', tags: ['quality'] },
  { id: 'interesting_composition', label: 'Interesting Composition', outputText: 'interesting composition', tags: ['composition'] },
  { id: 'cinematic_atmosphere', label: 'Cinematic Atmosphere', outputText: 'cinematic atmosphere', tags: ['cinematic'] },
  { id: 'rich_textures', label: 'Rich Textures', outputText: 'rich textures', tags: ['materials'] },
  { id: 'dramatic_lighting', label: 'Dramatic Lighting', outputText: 'dramatic lighting', tags: ['lighting'] },
  { id: 'sharp_focus', label: 'Sharp Focus', outputText: 'sharp focus', tags: ['quality'] },
  { id: 'polished_rendering', label: 'Polished Rendering', outputText: 'polished rendering', tags: ['quality'] },
  { id: 'atmospheric_depth', label: 'Atmospheric Depth', outputText: 'atmospheric depth', tags: ['atmosphere'] },
  { id: 'intricate_details', label: 'Intricate Details', outputText: 'intricate details', tags: ['detail'] },
  { id: 'epic_scale', label: 'Epic Scale', outputText: 'epic scale', tags: ['scale'] },
  { id: 'clean_render', label: 'Clean Render', outputText: 'clean render', tags: ['quality'] },
  { id: 'ultra_quality', label: 'Ultra Quality', outputText: 'ultra quality', tags: ['quality'] },
  { id: 'ornate_details', label: 'Ornate Details', outputText: 'ornate details', tags: ['detail'] },
  { id: 'immersive_scene', label: 'Immersive Scene', outputText: 'immersive scene', tags: ['scene'] },
  { id: 'beautiful_color_grading', label: 'Beautiful Color Grading', outputText: 'beautiful color grading', tags: ['color'] },
];
