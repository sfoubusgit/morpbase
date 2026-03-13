import type { AdminBackfillResult, AdminUserRecord } from '../types';
import { supabase } from './supabaseClient';

type AdminUserRow = {
  user_id: string;
  display_name: string;
  email: string;
  created_at: string;
  has_public_profile: boolean;
  pool_hub_visible: boolean;
  upload_count: number;
};

const toAdminUserRecord = (row: AdminUserRow): AdminUserRecord => ({
  userId: row.user_id,
  displayName: row.display_name,
  email: row.email,
  createdAt: new Date(row.created_at).getTime(),
  hasPublicProfile: Boolean(row.has_public_profile),
  poolHubVisible: Boolean(row.pool_hub_visible),
  uploadCount: Number(row.upload_count ?? 0),
});

export const isCurrentUserAdmin = async (): Promise<boolean> => {
  const { data, error } = await supabase.rpc('admin_is_current_user');
  if (error) {
    throw error;
  }
  return Boolean(data);
};

export const listAdminUsers = async (): Promise<AdminUserRecord[]> => {
  const { data, error } = await supabase.rpc('admin_list_users');
  if (error) {
    throw error;
  }
  return ((data ?? []) as AdminUserRow[]).map(toAdminUserRecord);
};

export const createMissingPublicProfile = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase.rpc('admin_create_missing_public_profile', {
    target_user_id: userId,
  });
  if (error) {
    throw error;
  }
  return Boolean(data);
};

export const backfillMissingPublicProfiles = async (): Promise<AdminBackfillResult> => {
  const { data, error } = await supabase.rpc('admin_backfill_missing_public_profiles');
  if (error) {
    throw error;
  }
  return {
    createdCount: Number(data ?? 0),
  };
};
