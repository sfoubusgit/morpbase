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

export type AdminAnalyticsSummary = {
  totalEvents: number;
  uniqueSessions: number;
  identifiedUsers: number;
  last24hEvents: number;
  pageViews: number;
  promptSaves: number;
  territoryActivations: number;
  poolOpens: number;
};

export type AdminAnalyticsRecentEvent = {
  id: string;
  eventType: string;
  pageKey?: string | null;
  path?: string | null;
  userId?: string | null;
  sessionId: string;
  referrerHost?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: number;
};

export type AdminAnalyticsPageStat = {
  pageKey: string;
  eventCount: number;
};
