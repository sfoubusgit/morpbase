import { supabase } from './supabaseClient';

type UidListener = (uids: Set<string>) => void;

export type StudioState = { name: string; studio?: string };
type StatesListener = (states: Map<string, StudioState>) => void;

let channel: ReturnType<typeof supabase.channel> | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let onlineAuthUids = new Set<string>();
let presenceStates = new Map<string, StudioState>();
let _currentAuthUid = '';
let _currentName = '';
let _currentStudio: string | undefined;

const uidListeners = new Set<UidListener>();
const stateListeners = new Set<StatesListener>();

function notify(): void {
  const uids = new Set(onlineAuthUids);
  for (const cb of uidListeners) cb(uids);
  const states = new Map(presenceStates);
  for (const cb of stateListeners) cb(states);
}

function syncFromChannel(): void {
  if (!channel) return;
  const raw = channel.presenceState() as Record<string, Array<Record<string, unknown>>>;
  onlineAuthUids = new Set(Object.keys(raw));
  presenceStates = new Map();
  for (const [uid, entries] of Object.entries(raw)) {
    const entry = entries[0] ?? {};
    presenceStates.set(uid, {
      name: (entry.name as string) ?? 'Anonymous',
      studio: (entry.studio as string) || undefined,
    });
  }
}

export function subscribeToOnlineAuthUids(cb: UidListener): () => void {
  uidListeners.add(cb);
  cb(new Set(onlineAuthUids));
  return () => { uidListeners.delete(cb); };
}

export function subscribeToPresenceStates(cb: StatesListener): () => void {
  stateListeners.add(cb);
  cb(new Map(presenceStates));
  return () => { stateListeners.delete(cb); };
}

export async function initPresence(authUid: string, userId: string, name: string): Promise<void> {
  destroyPresence();
  _currentAuthUid = authUid;
  _currentName = name;
  _currentStudio = undefined;

  const updateLastSeen = async () => {
    const { error } = await supabase
      .from('public_profiles')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('user_id', userId);
    if (error) {
      // Column missing (migration 0017 not run) or RLS — stop the heartbeat so it
      // can't hammer the endpoint and flood the console.
      console.warn('[presence] last_seen heartbeat disabled —', error.message);
      if (heartbeatTimer !== null) { clearInterval(heartbeatTimer); heartbeatTimer = null; }
    }
  };

  void updateLastSeen();
  heartbeatTimer = setInterval(() => { void updateLastSeen(); }, 60_000);

  channel = supabase.channel('global:presence', {
    config: { presence: { key: authUid } },
  });

  channel.on('presence', { event: 'sync' }, () => {
    syncFromChannel();
    notify();
  });

  channel.on('presence', { event: 'join' }, () => {
    syncFromChannel();
    notify();
  });

  channel.on('presence', { event: 'leave' }, () => {
    syncFromChannel();
    notify();
  });

  await channel.subscribe(async (status: string) => {
    if (status === 'SUBSCRIBED' && channel) {
      await channel.track({ auth_uid: authUid, name, studio: _currentStudio });
    }
  });
}

export async function updateStudioState(studio: string | undefined): Promise<void> {
  _currentStudio = studio || undefined;
  if (!channel) return;
  try {
    await channel.track({ auth_uid: _currentAuthUid, name: _currentName, studio: _currentStudio });
  } catch { /* non-fatal */ }
}

export function destroyPresence(): void {
  if (heartbeatTimer !== null) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
  if (channel !== null) {
    void supabase.removeChannel(channel);
    channel = null;
  }
  onlineAuthUids.clear();
  presenceStates.clear();
  notify();
}

export async function getLastSeenAt(userId: string): Promise<number | null> {
  const { data } = await supabase
    .from('public_profiles')
    .select('last_seen_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (!data?.last_seen_at) return null;
  return new Date(data.last_seen_at as string).getTime();
}
