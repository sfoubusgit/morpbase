export type EnvironmentPhraseBundle = {
  core: string[];
};

export type EnvironmentIdentity = {
  id: string;
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  phraseBundle: EnvironmentPhraseBundle;
  createdAt: number;
  updatedAt: number;
};

export type EnvironmentIdentityInput = {
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  phraseBundle: EnvironmentPhraseBundle;
};

export type EnvironmentStore = {
  version: 1;
  environments: EnvironmentIdentity[];
};
