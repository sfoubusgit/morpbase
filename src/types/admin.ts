export type AdminUserRecord = {
  userId: string;
  displayName: string;
  email: string;
  createdAt: number;
  hasPublicProfile: boolean;
  poolHubVisible: boolean;
  uploadCount: number;
};

export type AdminBackfillResult = {
  createdCount: number;
};
