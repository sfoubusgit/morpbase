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

// Best-effort: a public profile is secondary to auth. We only insert columns
// guaranteed by the base schema (migration 0003) so schema drift in optional
// flag columns can't block sign-in, and any failure here is swallowed rather
// than nulling out the whole session.
const ensurePublicProfile = async (profile: ProfileRow): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('public_profiles')
      .select('id')
      .eq('user_id', profile.id)
      .maybeSingle();

    if (error || data) return;

    await supabase
      .from('public_profiles')
      .insert({
        user_id: profile.id,
        display_name: profile.display_name,
      });
  } catch {
    /* non-fatal — login proceeds on the users row alone */
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

  // OAuth providers (e.g. Google) hand us a profile picture + name in user_metadata.
  const oauthAvatar =
    (typeof user.user_metadata?.avatar_url === 'string' && user.user_metadata.avatar_url) ||
    (typeof user.user_metadata?.picture === 'string' && user.user_metadata.picture) ||
    null;
  const oauthName =
    (typeof user.user_metadata?.display_name === 'string' && user.user_metadata.display_name.trim()) ||
    (typeof user.user_metadata?.name === 'string' && user.user_metadata.name.trim()) ||
    (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim()) ||
    '';
  const emailName = user.email ? user.email.split('@')[0] : '';

  if (existing) {
    const row = existing as ProfileRow;
    await ensurePublicProfile(row);
    const { data: pub } = await supabase
      .from('public_profiles')
      .select('avatar_url, display_name')
      .eq('user_id', row.id)
      .maybeSingle();
    const pubName = ((pub as { display_name?: string | null } | null)?.display_name ?? '').trim();
    // Never surface an empty name (which the UI renders as the literal "you").
    // Prefer the users row, then OAuth, then the public profile, then email.
    const name = (row.display_name ?? '').trim() || oauthName || pubName || emailName || 'User';
    // Heal a blank users.display_name so it's fixed for good, not just this session.
    if (!(row.display_name ?? '').trim()) {
      try { await supabase.from('users').update({ display_name: name }).eq('id', row.id); } catch { /* non-fatal */ }
    }
    const avatarUrl = (pub as { avatar_url: string | null } | null)?.avatar_url ?? oauthAvatar;
    return { ...toAuthUser(row, user.id, avatarUrl), name };
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
  return toAuthUser(inserted as ProfileRow, user.id, oauthAvatar);
};

/** A minimal user built straight from the auth session (no DB rows needed). */
const sessionUser = (user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> }): AuthUser => {
  const md = user.user_metadata ?? {};
  const name =
    (typeof md.display_name === 'string' && md.display_name.trim()) ||
    (typeof md.name === 'string' && md.name.trim()) ||
    (typeof md.full_name === 'string' && md.full_name.trim()) ||
    (user.email ? user.email.split('@')[0] : '') ||
    'User';
  const avatarUrl =
    (typeof md.avatar_url === 'string' && md.avatar_url) ||
    (typeof md.picture === 'string' && md.picture) ||
    null;
  return { id: user.id, authUid: user.id, name, email: user.email ?? '', avatarUrl };
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  let sessionUserObj: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null = null;
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!sessionData.session?.user) return null; // genuinely logged out
    sessionUserObj = sessionData.session.user;
    return await ensureProfile();
  } catch (err) {
    // A valid session must NOT appear logged out just because provisioning
    // (users/public_profiles row or a missing column) hiccuped. Fall back to a
    // session-only user so the person stays logged in with the right auth uid.
    console.error('[auth] provisioning failed; using session fallback:', err);
    return sessionUserObj ? sessionUser(sessionUserObj) : null;
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

/**
 * Start the Google OAuth flow. This triggers a full-page redirect to Google
 * and back to the app; on return, supabase-js detects the session from the URL
 * and the app's mount effect (getCurrentUser) provisions the profile. The
 * promise typically does not resolve in-page — the browser navigates away.
 */
export const signInWithGoogle = async (): Promise<void> => {
  const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  if (error) throw error;
};

export const logoutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Subscribe to auth changes. Crucial for OAuth (Google): the redirect back
 * from the provider resolves the session asynchronously, which can land just
 * after the initial mount check — this fires SIGNED_IN once it does. Also keeps
 * the app in sync on cross-tab logout. Returns an unsubscribe fn.
 */
export const onAuthChange = (
  onSignedIn: (user: AuthUser) => void,
  onSignedOut: () => void,
): (() => void) => {
  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_IN') {
      void getCurrentUser().then(user => { if (user) onSignedIn(user); });
    } else if (event === 'SIGNED_OUT') {
      onSignedOut();
    }
  });
  return () => data.subscription.unsubscribe();
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
