export type PromptAdditionPosition = 'start' | 'middle' | 'end';

export type PromptAdditionEntry = {
  id: string;
  text: string;
  position: PromptAdditionPosition;
  sourceType?: 'pool' | 'territory' | 'fragment' | 'pool-default' | 'idp-set';
};

export type SelectedPromptFragment = {
  id: string;
};
