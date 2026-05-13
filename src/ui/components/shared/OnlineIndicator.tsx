import './OnlineIndicator.css';

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

type OnlineIndicatorProps = {
  isOnline: boolean;
  lastSeenAt?: number | null;
  showLastSeen?: boolean;
};

export function OnlineIndicator({ isOnline, lastSeenAt, showLastSeen = false }: OnlineIndicatorProps) {
  if (isOnline) {
    return <span className="online-dot online-dot--active" title="Online now" />;
  }
  if (showLastSeen && lastSeenAt) {
    return (
      <span className="online-last-seen">
        <span className="online-dot" />
        {formatRelativeTime(lastSeenAt)}
      </span>
    );
  }
  return null;
}
