import { supabase } from './supabaseClient';

export type AuthUser = {
  id: string;
  authUid: string;
  name: string;
  email: string;
  avatarUrl: string | null;
};

type ProfileRow = {
  id: string;
  auth_user_id: string;
  email: string;
  display_name: string;
};

const toAuthUser = (profile: ProfileRow, authUid: string, avatarUrl: string | null = null): AuthUser => ({
  id: profile.id,
  authUid,
  name: profile.display_name,
  email: profile.email,
  avatarUrl,
});

const ensurePublicProfile = async (profile: ProfileRow): Promise<void> => {
  const { data, error } = await supabase
    .from('public_profiles')
    .select('id')
    .eq('user_id', profile.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (data) {
    return;
  }

  const { error: insertError } = await supabase
    .from('public_profiles')
    .insert({
      user_id: profile.id,
      display_name: profile.display_name,
      show_public_prompts: false,
      show_public_pools: false,
      discoverable_in_search: true,
      show_links_publicly: true,
    });

  if (insertError) {
    throw insertError;
  }
};

export type AuthProfile = ProfileRow;

export const getProfile = async (): Promise<AuthProfile | null> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const user = sessionData.session?.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('id, auth_user_id, email, display_name')
    .eq('auth_user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  return (data as ProfileRow) ?? null;
};

const ensureProfile = async (): Promise<AuthUser> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const user = sessionData.session?.user;
  if (!user) {
    throw new Error('No active session.');
  }

  const { data: existing, error: selectError } = await supabase
    .from('users')
    .select('id, auth_user_id, email, display_name')
    .eq('auth_user_id', user.id)
    .single();

  if (selectError && selectError.code !== 'PGRST116') {
    throw selectError;
  }

  if (existing) {
    await ensurePublicProfile(existing as ProfileRow);
    const { data: pub } = await supabase
      .from('public_profiles')
      .select('avatar_url')
      .eq('user_id', (existing as ProfileRow).id)
      .maybeSingle();
    const avatarUrl = (pub as { avatar_url: string | null } | null)?.avatar_url ?? null;
    return toAuthUser(existing as ProfileRow, user.id, avatarUrl);
  }

  const displayName =
    (typeof user.user_metadata?.display_name === 'string' && user.user_metadata.display_name.trim()) ||
    (typeof user.user_metadata?.name === 'string' && user.user_metadata.name.trim()) ||
    (user.email ? user.email.split('@')[0] : 'User');

  const { data: inserted, error: insertError } = await supabase
    .from('users')
    .insert({
      auth_user_id: user.id,
      email: user.email ?? '',
      display_name: displayName,
    })
    .select('id, auth_user_id, email, display_name')
    .single();

  if (insertError) throw insertError;
  await ensurePublicProfile(inserted as ProfileRow);
  return toAuthUser(inserted as ProfileRow, user.id);
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!sessionData.session?.user) return null;
    return await ensureProfile();
  } catch {
    return null;
  }
};

export const registerUser = async (name: string, email: string, password: string): Promise<AuthUser> => {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();
  if (!trimmedName) throw new Error('Name is required.');
  if (!trimmedEmail) throw new Error('Email is required.');
  if (trimmedPassword.length < 6) throw new Error('Password must be at least 6 characters.');

  const { data, error } = await supabase.auth.signUp({
    email: trimmedEmail,
    password: trimmedPassword,
    options: {
      data: { display_name: trimmedName },
    },
  });

  if (error) throw error;

  if (!data.session?.user) {
    throw new Error('Check your email to confirm your account, then log in.');
  }

  return ensureProfile();
};

export const loginUser = async (email: string, password: string): Promise<AuthUser> => {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password.trim();
  const { error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password: trimmedPassword,
  });
  if (error) throw error;
  return ensureProfile();
};

export const logoutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const updateUserName = async (name: string): Promise<AuthUser> => {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Name is required.');
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user) throw new Error('No active session.');

  const { data, error } = await supabase
    .from('users')
    .update({ display_name: trimmed })
    .eq('auth_user_id', user.id)
    .select('id, auth_user_id, email, display_name')
    .single();
  if (error) throw error;
  return toAuthUser(data as ProfileRow, user.id);
};

export const changeUserPassword = async (currentPassword: string, nextPassword: string): Promise<void> => {
  const current = currentPassword.trim();
  const next = nextPassword.trim();
  if (next.length < 6) throw new Error('Password must be at least 6 characters.');
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData.session?.user;
  if (!user || !user.email) throw new Error('No active session.');

  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: current,
  });
  if (reauthError) throw new Error('Current password is incorrect.');

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) throw error;
};

export const deleteCurrentUser = async (_currentPassword: string): Promise<void> => {
  throw new Error('Account deletion is not available yet.');
};
