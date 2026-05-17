import { useCallback, useEffect, useRef, useState } from 'react';
import type { WallPost } from '../../../types/community';
import { listWallPosts } from '../../../engine/wallStore';
import './PulsePanel.css';

const POLL_INTERVAL_MS = 45_000;

const EVENT_ICONS: Record<string, string> = {
  standard:    '✍️',
  share_event: '✦',
  response:    '↩',
};

function actionText(post: WallPost): string {
  if (post.postType === 'share_event') {
    const tag = post.identityTags[0];
    return tag ? `shared "${tag.name}"` : 'shared an identity';
  }
  if (post.postType === 'response') return 'replied to the wall';
  return 'posted a prompt';
}

function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

function dayLabel(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
}

type PulsePanelProps = {
  onViewAuthor?: (authUid: string, name: string) => void;
};

export function PulsePanel({ onViewAuthor }: PulsePanelProps) {
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [loading, setLoading] = useState(true);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetch = useCallback(async () => {
    const data = await listWallPosts({ limit: 25 });
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetch();
    pollRef.current = setInterval(() => { void fetch(); }, POLL_INTERVAL_MS);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetch]);

  if (loading) return <div className="pulse-empty">Loading…</div>;
  if (posts.length === 0) return <div className="pulse-empty">Nothing yet — be the first to post.</div>;

  // Group by calendar day
  const groups: { label: string; items: WallPost[] }[] = [];
  let currentLabel = '';
  for (const post of posts) {
    const label = dayLabel(post.createdAt);
    if (label !== currentLabel) {
      groups.push({ label, items: [] });
      currentLabel = label;
    }
    groups[groups.length - 1].items.push(post);
  }

  return (
    <div className="pulse-panel">
      {groups.map(group => (
        <div key={group.label} className="pulse-group">
          <div className="pulse-day-label">{group.label}</div>
          {group.items.map(post => (
            <div key={post.id} className="pulse-item" data-type={post.postType}>
              <span className="pulse-item-icon">{EVENT_ICONS[post.postType] ?? '·'}</span>
              <div className="pulse-item-body">
                <button
                  type="button"
                  className="pulse-item-author"
                  onClick={() => onViewAuthor?.(post.authUid, post.authorName)}
                >
                  {post.authorName}
                </button>
                <span className="pulse-item-action">{actionText(post)}</span>
              </div>
              <span className="pulse-item-time">{formatRelativeTime(post.createdAt)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
