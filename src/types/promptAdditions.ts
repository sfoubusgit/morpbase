export type PromptAdditionPosition = 'start' | 'middle' | 'end';

export type PromptAdditionEntry = {
  id: string;
  text: string;
  position: PromptAdditionPosition;
  sourceType?: 'pool' | 'territory' | 'fragment';
};

export type SelectedPromptFragment = {
  id: string;
  position: PromptAdditionPosition;
};
