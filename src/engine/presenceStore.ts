import { supabase } from './supabaseClient';

type Listener = (uids: Set<string>) => void;

let channel: ReturnType<typeof supabase.channel> | null = null;
let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
let onlineAuthUids = new Set<string>();
const listeners = new Set<Listener>();

function notify(): void {
  const snapshot = new Set(onlineAuthUids);
  for (const cb of listeners) cb(snapshot);
}

export function subscribeToOnlineAuthUids(cb: Listener): () => void {
  listeners.add(cb);
  cb(new Set(onlineAuthUids));
  return () => { listeners.delete(cb); };
}

export async function initPresence(authUid: string, userId: string): Promise<void> {
  destroyPresence();

  const updateLastSeen = async () => {
    await supabase
      .from('public_profiles')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('user_id', userId);
  };

  void updateLastSeen();
  heartbeatTimer = setInterval(() => { void updateLastSeen(); }, 60_000);

  channel = supabase.channel('global:presence', {
    config: { presence: { key: authUid } },
  });

  channel.on('presence', { event: 'sync' }, () => {
    if (!channel) return;
    onlineAuthUids = new Set(Object.keys(channel.presenceState()));
    notify();
  });

  channel.on('presence', { event: 'join' }, ({ key }: { key: string }) => {
    onlineAuthUids.add(key);
    notify();
  });

  channel.on('presence', { event: 'leave' }, ({ key }: { key: string }) => {
    onlineAuthUids.delete(key);
    notify();
  });

  await channel.subscribe(async (status: string) => {
    if (status === 'SUBSCRIBED' && channel) {
      await channel.track({ auth_uid: authUid });
    }
  });
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
