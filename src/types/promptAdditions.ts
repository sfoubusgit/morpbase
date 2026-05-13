export type PromptAdditionPosition = 'start' | 'middle' | 'end';

export type PromptAdditionEntry = {
  id: string;
  text: string;
  position: PromptAdditionPosition;
  section?: string;
  sourceType?: 'pool' | 'territory' | 'fragment' | 'pool-default' | 'idp-set' | 'character' | 'interaction' | 'environment' | 'outfit' | 'object' | 'style' | 'lighting' | 'composition' | 'mood';
};

export type SelectedPromptFragment = {
  id: string;
};
