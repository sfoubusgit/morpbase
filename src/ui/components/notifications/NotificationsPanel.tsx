import { useEffect, useState } from 'react';
import type { Notification } from '../../../types/community';
import { listNotifications, markRead, markAllRead, subscribeToNotifications } from '../../../engine/notificationStore';
import './NotificationsPanel.css';

type NotificationGroup = {
  key: string;
  representative: Notification;
  ids: string[];
  count: number;
  actorNames: string[];
  hasUnread: boolean;
};

function groupKey(n: Notification): string {
  const p = n.payload;
  switch (n.type) {
    case 'wall_post_liked':
      return `wall_post_liked:${typeof p.postId === 'string' ? p.postId : 'unknown'}`;
    case 'identity_remixed':
      return `identity_remixed:${typeof p.remixIdentityId === 'string' ? p.remixIdentityId : (typeof p.identityName === 'string' ? p.identityName : 'unknown')}`;
    case 'new_follower':
      return 'new_follower';
    case 'dm_received':
      return `dm_received:${typeof p.senderAuthUid === 'string' ? p.senderAuthUid : 'unknown'}`;
    default:
      return `${n.type}:${n.id}`;
  }
}

function groupActor(n: Notification): string | null {
  const p = n.payload;
  if (n.type === 'wall_post_liked' && typeof p.reactorName === 'string') return p.reactorName;
  if (n.type === 'identity_remixed' && typeof p.remixerName === 'string') return p.remixerName;
  if (n.type === 'new_follower' && typeof p.followerName === 'string') return p.followerName;
  if (n.type === 'dm_received' && typeof p.senderName === 'string') return p.senderName;
  return null;
}

function groupNotifications(notifs: Notification[]): NotificationGroup[] {
  const map = new Map<string, NotificationGroup>();
  for (const n of notifs) {
    const key = groupKey(n);
    const actor = groupActor(n);
    const existing = map.get(key);
    if (existing) {
      existing.ids.push(n.id);
      existing.count += 1;
      if (actor && !existing.actorNames.includes(actor)) existing.actorNames.push(actor);
      if (!n.readAt) existing.hasUnread = true;
    } else {
      map.set(key, {
        key,
        representative: n,
        ids: [n.id],
        count: 1,
        actorNames: actor ? [actor] : [],
        hasUnread: !n.readAt,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.representative.createdAt - a.representative.createdAt);
}

function formatActors(names: string[], extra: number): string {
  if (names.length === 0) return extra > 0 ? `${extra} people` : 'Someone';
  if (names.length === 1) return extra === 0 ? names[0] : `${names[0]} and ${extra} other${extra === 1 ? '' : 's'}`;
  if (names.length === 2 && extra === 0) return `${names[0]} and ${names[1]}`;
  return `${names[0]}, ${names[1]} and ${extra + names.length - 2} other${extra + names.length - 2 === 1 ? '' : 's'}`;
}

function groupMessage(g: NotificationGroup): string {
  const n = g.representative;
  const p = n.payload;
  if (g.count === 1) {
    return notifMessage(n);
  }
  const shown = g.actorNames.slice(0, 2);
  const extra = g.count - shown.length;
  const who = formatActors(shown, extra);
  switch (n.type) {
    case 'wall_post_liked':
      return `${who} reacted to your wall post.`;
    case 'identity_remixed':
      return `${who} remixed your "${p.identityName ?? 'identity'}".`;
    case 'new_follower':
      return `${who} started following you.`;
    case 'dm_received':
      return `${g.count} new messages from ${p.senderName ?? 'someone'}.`;
    default:
      return notifMessage(n);
  }
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function notifMessage(n: Notification): string {
  const p = n.payload;
  switch (n.type) {
    case 'new_follower':
      return p.followerName
        ? `${p.followerName} started following you.`
        : 'Someone new started following you.';
    case 'identity_remixed':
      return p.remixerName
        ? `${p.remixerName} remixed your "${p.identityName}".`
        : `Your identity "${p.identityName}" was remixed.`;
    case 'wall_post_liked': {
      const who = p.reactorName ?? 'Someone';
      const what = p.emoji ? ` ${p.emoji}` : '';
      return `${who} reacted${what} to your wall post.`;
    }
    case 'dm_received':
      return p.senderName
        ? `New message from ${p.senderName}.`
        : 'You have a new message.';
    case 'badge_earned': {
      const icon = p.badgeIcon ? `${p.badgeIcon} ` : '';
      return p.badgeLabel
        ? `${icon}You earned the "${p.badgeLabel}" badge!`
        : 'You earned a new badge!';
    }
    case 'xp_milestone':
      return p.title
        ? `You reached the "${p.title}" title!`
        : 'You hit a new XP milestone!';
    default:
      return 'New notification.';
  }
}

function notifIcon(type: string): string {
  switch (type) {
    case 'new_follower':      return '👤';
    case 'identity_remixed':  return '↺';
    case 'wall_post_liked':   return '♥';
    case 'dm_received':       return '✉';
    case 'badge_earned':      return '🏅';
    case 'xp_milestone':      return '⭐';
    default:                  return '·';
  }
}

type NotificationsPanelProps = {
  authUid: string;
  onClose: () => void;
  onAllRead: () => void;
  onNavigate?: (n: Notification) => void;
};

export function NotificationsPanel({ authUid, onClose, onAllRead, onNavigate }: NotificationsPanelProps) {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void listNotifications(authUid).then(data => {
      setNotifs(data);
      setLoading(false);
    });
    const unsubscribe = subscribeToNotifications(authUid, newNotif => {
      setNotifs(prev => prev.some(x => x.id === newNotif.id) ? prev : [newNotif, ...prev]);
    });
    return unsubscribe;
  }, [authUid]);

  const handleGroupClick = (g: NotificationGroup) => {
    if (g.hasUnread) {
      const now = Date.now();
      const idSet = new Set(g.ids);
      for (const id of g.ids) void markRead(id);
      setNotifs(prev => prev.map(x => idSet.has(x.id) ? { ...x, readAt: x.readAt ?? now } : x));
    }
    if (onNavigate) {
      onNavigate(g.representative);
      onClose();
    }
  };

  const handleMarkAll = () => {
    void markAllRead(authUid);
    setNotifs(prev => prev.map(x => ({ ...x, readAt: x.readAt ?? Date.now() })));
    onAllRead();
  };

  const hasUnread = notifs.some(n => !n.readAt);
  const groups = groupNotifications(notifs);

  return (
    <>
      <div className="notif-panel-backdrop" onClick={onClose} />
      <div className="notif-panel">
        <div className="notif-panel-header">
          <span className="notif-panel-title">Notifications</span>
          {hasUnread && (
            <button type="button" className="notif-panel-mark-all" onClick={handleMarkAll}>
              Mark all read
            </button>
          )}
        </div>

        <div className="notif-panel-list">
          {loading ? (
            <div className="notif-panel-empty">Loading…</div>
          ) : notifs.length === 0 ? (
            <div className="notif-panel-empty">No notifications yet.</div>
          ) : (
            groups.map(g => (
              <button
                key={g.key}
                type="button"
                className={`notif-item${!g.hasUnread ? ' notif-item--read' : ''}${onNavigate ? ' notif-item--clickable' : ''}`}
                onClick={() => handleGroupClick(g)}
              >
                <span className="notif-item-icon">{notifIcon(g.representative.type)}</span>
                <div className="notif-item-body">
                  <span className="notif-item-message">{groupMessage(g)}</span>
                  <span className="notif-item-time">{formatRelative(g.representative.createdAt)}</span>
                </div>
                {g.hasUnread && <span className="notif-item-dot" />}
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
