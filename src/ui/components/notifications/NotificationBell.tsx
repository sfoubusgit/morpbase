import { useCallback, useEffect, useRef, useState } from 'react';
import type { Notification } from '../../../types/community';
import { getUnreadCount, subscribeToNotifications } from '../../../engine/notificationStore';
import { NotificationsPanel } from './NotificationsPanel';
import './NotificationBell.css';

const POLL_INTERVAL_MS = 5 * 60_000;

type NotificationBellProps = {
  authUid: string;
  onNavigate?: (n: Notification) => void;
};

export function NotificationBell({ authUid, onNavigate }: NotificationBellProps) {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCount = useCallback(async () => {
    const count = await getUnreadCount(authUid);
    setUnread(count);
  }, [authUid]);

  useEffect(() => {
    void fetchCount();
    pollRef.current = setInterval(() => { void fetchCount(); }, POLL_INTERVAL_MS);
    const unsubscribe = subscribeToNotifications(authUid, () => {
      setUnread(prev => prev + 1);
    });
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      unsubscribe();
    };
  }, [fetchCount, authUid]);

  const handleAllRead = () => setUnread(0);

  return (
    <div className="notif-bell-wrapper">
      <button
        type="button"
        className={`notif-bell-btn${open ? ' notif-bell-btn--open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span className="notif-bell-badge">{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {open && (
        <NotificationsPanel
          authUid={authUid}
          onClose={() => setOpen(false)}
          onAllRead={handleAllRead}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
