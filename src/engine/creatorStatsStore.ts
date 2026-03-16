import type { CreatorStats } from '../types';
import { supabase } from './supabaseClient';

const toCreatorStats = (row: any): CreatorStats => ({
  userId: row.user_id,
  publicPoolCount: Number(row.public_pool_count ?? 0),
  publicPromptCount: Number(row.public_prompt_count ?? 0),
  totalDownloads: Number(row.total_downloads ?? 0),
  avgRating: Number(row.avg_rating ?? 0),
  ratingCount: Number(row.rating_count ?? 0),
  updatedAt: new Date(row.updated_at).getTime(),
});

export const getCreatorStatsByUserId = async (userId: string): Promise<CreatorStats | null> => {
  const { data, error } = await supabase
    .from('creator_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data ? toCreatorStats(data) : null;
};

export const listCreatorStatsByUserIds = async (userIds: string[]): Promise<CreatorStats[]> => {
  const normalizedUserIds = [...new Set(userIds.map(id => id.trim()).filter(Boolean))];
  if (normalizedUserIds.length === 0) return [];

  const { data, error } = await supabase
    .from('creator_stats')
    .select('*')
    .in('user_id', normalizedUserIds);
  if (error) throw error;
  return (data ?? []).map(toCreatorStats);
};
