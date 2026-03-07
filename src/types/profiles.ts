export type PublicProfile = {
  id: string;
  userId: string;
  displayName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  links?: Record<string, string> | null;
  tags?: string[] | null;
  showPublicPrompts?: boolean | null;
  createdAt: number;
  updatedAt: number;
};
