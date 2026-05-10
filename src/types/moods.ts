export type MoodPreset = {
  id: string;
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  phrases: string[];
  createdAt: number;
  updatedAt: number;
};

export type MoodPresetInput = {
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  phrases: string[];
};

export type MoodStore = {
  version: 1;
  items: MoodPreset[];
};
