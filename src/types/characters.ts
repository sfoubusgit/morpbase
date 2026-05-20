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

export type CharacterAvatar = {
  dataUrl: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  width: number;
  height: number;
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
  coverImageUrl?: string | null;
  avatar?: CharacterAvatar;
  identity: CharacterIdentityFields;
  phraseBundle: CharacterPhraseBundle;
  tags?: string[];
  /** LoRA trigger word — when set, it's prepended to the prompt to activate the character's LoRA. */
  loraTrigger?: string;
  createdAt: number;
  updatedAt: number;
};

export type CharacterIdentityInput = {
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  avatar?: CharacterAvatar;
  identity: CharacterIdentityFields;
  phraseBundle: CharacterPhraseBundle;
  tags?: string[];
  loraTrigger?: string;
};

export type CharacterStore = {
  version: 1;
  characters: CharacterIdentity[];
};
