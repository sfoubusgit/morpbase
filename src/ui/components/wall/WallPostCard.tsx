import { useState } from 'react';
import type { WallPost, EarnedBadge } from '../../../types/community';
import { TitleBadge } from '../shared/TitleBadge';
import { BadgeStrip } from '../shared/BadgeStrip';
import { getTitleForXp } from '../../../data/communityTitles';
import './WallPostCard.css';

const TYPE_COLORS: Record<string, string> = {
  character:   '#c4b5fd',
  style:       '#93c5fd',
  lighting:    '#fcd34d',
  environment: '#6ee7b7',
  wardrobe:    '#fda4af',
  composition: '#67e8f9',
  mood:        '#a5b4fc',
  negative:    '#fca5a5',
  aura:        '#fdba74',
  object:      '#fde68a',
};

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

const PROMPT_PREVIEW_LENGTH = 220;

type WallPostCardProps = {
  post: WallPost;
  isOwnPost: boolean;
  isLiked: boolean;
  authorXp?: number;
  authorBadges?: EarnedBadge[];
  onLike: (postId: string) => void;
  onUnlike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onViewAuthor?: (authUid: string, name: string) => void;
};

export function WallPostCard({
  post,
  isOwnPost,
  isLiked,
  authorXp,
  authorBadges = [],
  onLike,
  onUnlike,
  onDelete,
  onViewAuthor,
}: WallPostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [liked, setLiked] = useState(isLiked);

  const isLong = post.promptText.length > PROMPT_PREVIEW_LENGTH;
  const displayText = expanded || !isLong
    ? post.promptText
    : post.promptText.slice(0, PROMPT_PREVIEW_LENGTH) + '…';

  const title = authorXp !== undefined ? getTitleForXp(authorXp) : null;

  const handleLikeToggle = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(c => Math.max(0, c - 1));
      onUnlike(post.id);
    } else {
      setLiked(true);
      setLikeCount(c => c + 1);
      onLike(post.id);
    }
  };

  return (
    <div className="wall-card">
      <div className="wall-card-header">
        <div className="wall-card-author-row">
          <button
            type="button"
            className="wall-card-author-name"
            onClick={() => onViewAuthor?.(post.authUid, post.authorName)}
          >
            {post.authorName}
          </button>
          {title && <TitleBadge title={title} size="sm" />}
          <BadgeStrip badges={authorBadges} max={4} />
        </div>
        <span className="wall-card-time">{formatRelativeTime(post.createdAt)}</span>
      </div>

      {post.caption && (
        <div className="wall-card-caption">{post.caption}</div>
      )}

      <div className="wall-card-prompt">
        {displayText}
        {isLong && (
          <button
            type="button"
            className="wall-card-expand"
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {post.identityTags.length > 0 && (
        <div className="wall-card-tags">
          {post.identityTags.map(tag => (
            <span
              key={`${tag.type}-${tag.name}`}
              className="wall-card-tag"
              style={{ color: TYPE_COLORS[tag.type] ?? '#94a3b8' }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="wall-card-footer">
        <button
          type="button"
          className={`wall-card-like${liked ? ' wall-card-like--active' : ''}`}
          onClick={handleLikeToggle}
          title={liked ? 'Unlike' : 'Like'}
        >
          <span className="wall-card-like-icon">{liked ? '♥' : '♡'}</span>
          {likeCount > 0 && <span className="wall-card-like-count">{likeCount}</span>}
        </button>

        {isOwnPost && (
          <button
            type="button"
            className="wall-card-delete"
            onClick={() => {
              if (window.confirm('Remove this post from the Wall?')) onDelete(post.id);
            }}
            title="Delete post"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
