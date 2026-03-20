export type SavedPromptCharacterLineage = {
  characterId: string;
  nameSnapshot: string;
};

export type SavedPrompt = {
  id: string;
  name: string;
  positive: string;
  negative?: string;
  tags?: string[];
  model?: string;
  purpose?: string;
  usedAt?: string;
  note?: string;
  characterLineage?: SavedPromptCharacterLineage;
  createdAt: number;
  updatedAt: number;
};

export type PromptSet = {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
};

export type SavedPromptStore = {
  version: 1;
  prompts: SavedPrompt[];
};
