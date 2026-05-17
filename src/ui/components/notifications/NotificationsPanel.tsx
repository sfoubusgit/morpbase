import { useEffect, useState } from 'react';
import type { Notification } from '../../../types/community';
import { listNotifications, markRead, markAllRead } from '../../../engine/notificationStore';
import './NotificationsPanel.css';

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
  }, [authUid]);

  const handleClick = (n: Notification) => {
    if (!n.readAt) {
      void markRead(n.id);
      setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, readAt: Date.now() } : x));
    }
    if (onNavigate) {
      onNavigate(n);
      onClose();
    }
  };

  const handleMarkAll = () => {
    void markAllRead(authUid);
    setNotifs(prev => prev.map(x => ({ ...x, readAt: x.readAt ?? Date.now() })));
    onAllRead();
  };

  const hasUnread = notifs.some(n => !n.readAt);

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
            notifs.map(n => (
              <button
                key={n.id}
                type="button"
                className={`notif-item${n.readAt ? ' notif-item--read' : ''}${onNavigate ? ' notif-item--clickable' : ''}`}
                onClick={() => handleClick(n)}
              >
                <span className="notif-item-icon">{notifIcon(n.type)}</span>
                <div className="notif-item-body">
                  <span className="notif-item-message">{notifMessage(n)}</span>
                  <span className="notif-item-time">{formatRelative(n.createdAt)}</span>
                </div>
                {!n.readAt && <span className="notif-item-dot" />}
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
