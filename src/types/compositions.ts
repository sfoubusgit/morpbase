export type CompositionFrame = {
  id: string;
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  phrases: string[];
  createdAt: number;
  updatedAt: number;
};

export type CompositionFrameInput = {
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  phrases: string[];
};

export type CompositionStore = {
  version: 1;
  items: CompositionFrame[];
};
