export type CharacterVisualAnchorKind =
  | 'hair'
  | 'face'
  | 'eyes'
  | 'silhouette'
  | 'clothing'
  | 'accessory'
  | 'other';

export type CharacterVisualAnchor = {
  id: string;
  label: string;
  text: string;
  kind?: CharacterVisualAnchorKind;
};

export type CharacterMotif = {
  id: string;
  label: string;
  text: string;
};

export type CharacterPhraseBundle = {
  core: string[];
  optional?: string[];
};

export type CharacterIdentityFields = {
  archetype?: string;
  role?: string;
  ageImpression?: string;
  presentation?: string;
  personalityTone?: string;
  visualAnchors: CharacterVisualAnchor[];
  motifs: CharacterMotif[];
};

export type CharacterIdentity = {
  id: string;
  name: string;
  summary?: string;
  identity: CharacterIdentityFields;
  phraseBundle: CharacterPhraseBundle;
  createdAt: number;
  updatedAt: number;
};

export type CharacterIdentityInput = {
  name: string;
  summary?: string;
  identity: CharacterIdentityFields;
  phraseBundle: CharacterPhraseBundle;
};

export type CharacterStore = {
  version: 1;
  characters: CharacterIdentity[];
};
