import type {
  AdminAnalyticsPageStat,
  AdminAnalyticsRecentEvent,
  AdminAnalyticsSummary,
} from '../types';
import { supabase } from './supabaseClient';

type AdminAnalyticsSummaryRow = {
  total_events: number | null;
  unique_sessions: number | null;
  identified_users: number | null;
  last_24h_events: number | null;
  page_views: number | null;
  prompt_saves: number | null;
  territory_activations: number | null;
  pool_opens: number | null;
};

type AdminAnalyticsRecentEventRow = {
  id: string;
  event_type: string;
  page_key: string | null;
  path: string | null;
  user_id: string | null;
  session_id: string;
  referrer_host: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

type AdminAnalyticsPageStatRow = {
  page_key: string;
  event_count: number | null;
};

const toSummary = (row: AdminAnalyticsSummaryRow): AdminAnalyticsSummary => ({
  totalEvents: Number(row.total_events ?? 0),
  uniqueSessions: Number(row.unique_sessions ?? 0),
  identifiedUsers: Number(row.identified_users ?? 0),
  last24hEvents: Number(row.last_24h_events ?? 0),
  pageViews: Number(row.page_views ?? 0),
  promptSaves: Number(row.prompt_saves ?? 0),
  territoryActivations: Number(row.territory_activations ?? 0),
  poolOpens: Number(row.pool_opens ?? 0),
});

const toRecentEvent = (row: AdminAnalyticsRecentEventRow): AdminAnalyticsRecentEvent => ({
  id: row.id,
  eventType: row.event_type,
  pageKey: row.page_key,
  path: row.path,
  userId: row.user_id,
  sessionId: row.session_id,
  referrerHost: row.referrer_host,
  metadata: row.metadata ?? null,
  createdAt: new Date(row.created_at).getTime(),
});

const toPageStat = (row: AdminAnalyticsPageStatRow): AdminAnalyticsPageStat => ({
  pageKey: row.page_key,
  eventCount: Number(row.event_count ?? 0),
});

export const getAdminAnalyticsSummary = async (): Promise<AdminAnalyticsSummary> => {
  const { data, error } = await supabase.rpc('admin_analytics_summary');
  if (error) throw error;
  const row = Array.isArray(data) ? data[0] : null;
  return toSummary((row ?? {}) as AdminAnalyticsSummaryRow);
};

export const listAdminRecentAnalyticsEvents = async (limit = 40): Promise<AdminAnalyticsRecentEvent[]> => {
  const { data, error } = await supabase.rpc('admin_recent_analytics_events', {
    limit_count: limit,
  });
  if (error) throw error;
  return ((data ?? []) as AdminAnalyticsRecentEventRow[]).map(toRecentEvent);
};

export const listAdminAnalyticsPageBreakdown = async (limit = 12): Promise<AdminAnalyticsPageStat[]> => {
  const { data, error } = await supabase.rpc('admin_analytics_page_breakdown', {
    limit_count: limit,
  });
  if (error) throw error;
  return ((data ?? []) as AdminAnalyticsPageStatRow[]).map(toPageStat);
};
