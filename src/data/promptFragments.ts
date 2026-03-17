import type { PromptAdditionPosition } from '../types';

export type PromptFragmentDefinition = {
  id: string;
  label: string;
  outputText: string;
  defaultPosition: PromptAdditionPosition;
  tags?: string[];
};

export const PROMPT_FRAGMENT_DEFINITIONS: PromptFragmentDefinition[] = [
  { id: 'masterpiece', label: 'Masterpiece', outputText: 'masterpiece', defaultPosition: 'start', tags: ['quality'] },
  { id: 'highly_detailed', label: 'Highly Detailed', outputText: 'highly detailed', defaultPosition: 'start', tags: ['quality'] },
  { id: 'interesting_composition', label: 'Interesting Composition', outputText: 'interesting composition', defaultPosition: 'middle', tags: ['composition'] },
  { id: 'cinematic_atmosphere', label: 'Cinematic Atmosphere', outputText: 'cinematic atmosphere', defaultPosition: 'start', tags: ['cinematic'] },
  { id: 'rich_textures', label: 'Rich Textures', outputText: 'rich textures', defaultPosition: 'middle', tags: ['materials'] },
  { id: 'dramatic_lighting', label: 'Dramatic Lighting', outputText: 'dramatic lighting', defaultPosition: 'middle', tags: ['lighting'] },
  { id: 'sharp_focus', label: 'Sharp Focus', outputText: 'sharp focus', defaultPosition: 'end', tags: ['quality'] },
  { id: 'polished_rendering', label: 'Polished Rendering', outputText: 'polished rendering', defaultPosition: 'end', tags: ['quality'] },
  { id: 'atmospheric_depth', label: 'Atmospheric Depth', outputText: 'atmospheric depth', defaultPosition: 'middle', tags: ['atmosphere'] },
  { id: 'intricate_details', label: 'Intricate Details', outputText: 'intricate details', defaultPosition: 'end', tags: ['detail'] },
  { id: 'epic_scale', label: 'Epic Scale', outputText: 'epic scale', defaultPosition: 'start', tags: ['scale'] },
  { id: 'clean_render', label: 'Clean Render', outputText: 'clean render', defaultPosition: 'end', tags: ['quality'] },
  { id: 'ultra_quality', label: 'Ultra Quality', outputText: 'ultra quality', defaultPosition: 'start', tags: ['quality'] },
  { id: 'ornate_details', label: 'Ornate Details', outputText: 'ornate details', defaultPosition: 'middle', tags: ['detail'] },
  { id: 'immersive_scene', label: 'Immersive Scene', outputText: 'immersive scene', defaultPosition: 'middle', tags: ['scene'] },
  { id: 'beautiful_color_grading', label: 'Beautiful Color Grading', outputText: 'beautiful color grading', defaultPosition: 'end', tags: ['color'] },
];
