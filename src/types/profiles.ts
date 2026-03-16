export type PublicProfile = {
  id: string;
  userId: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  avatarStoragePath?: string | null;
  links?: Record<string, string> | null;
  tags?: string[] | null;
  showPublicPrompts?: boolean | null;
  showPublicPools?: boolean | null;
  discoverableInSearch?: boolean | null;
  showLinksPublicly?: boolean | null;
  createdAt: number;
  updatedAt: number;
};

export type CreatorSummary = {
  uploads: number;
  totalDownloads: number;
  avgRating: number;
  promptCount: number;
  topTags: string[];
};
