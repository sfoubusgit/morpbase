export type OutfitIdentity = {
  id: string;
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  phrases: string[];
  createdAt: number;
  updatedAt: number;
};

export type OutfitIdentityInput = {
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  phrases: string[];
};

export type WardrobeStore = {
  version: 1;
  outfits: OutfitIdentity[];
};
