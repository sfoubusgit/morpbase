import { useState } from 'react';
import type { WallPost } from '../../../types/community';
import { TitleBadge } from '../shared/TitleBadge';
import { OnlineIndicator } from '../shared/OnlineIndicator';
import { getTitleForXp } from '../../../data/communityTitles';
import { REACTION_EMOJIS, type PostReactions } from '../../../engine/reactionStore';
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
  isNew?: boolean;
  reactions: PostReactions;
  myReactions: Set<string>;
  canReact: boolean;
  authorXp?: number;
  isAuthorOnline?: boolean;
  onReact: (postId: string, emoji: string) => void;
  onDelete: (postId: string) => void;
  onViewAuthor?: (authUid: string, name: string) => void;
};

export function WallPostCard({
  post,
  isOwnPost,
  isNew,
  reactions,
  myReactions,
  canReact,
  authorXp,
  isAuthorOnline,
  onReact,
  onDelete,
  onViewAuthor,
}: WallPostCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isLong = post.promptText.length > PROMPT_PREVIEW_LENGTH;
  const displayText = expanded || !isLong
    ? post.promptText
    : post.promptText.slice(0, PROMPT_PREVIEW_LENGTH) + '…';

  const title = authorXp !== undefined ? getTitleForXp(authorXp) : null;

  const totalReactions = REACTION_EMOJIS.reduce((sum, e) => sum + (reactions[e] ?? 0), 0);

  return (
    <div className="wall-card">
      <div className="wall-card-header">
        <div className="wall-card-author-block">
          <div className="wall-card-author-row">
            <button
              type="button"
              className="wall-card-author-name"
              onClick={() => onViewAuthor?.(post.authUid, post.authorName)}
            >
              {post.authorName}
            </button>
            <OnlineIndicator isOnline={!!isAuthorOnline} />
          </div>
          {title && <TitleBadge title={title} size="sm" />}
        </div>
        <div className="wall-card-time-row">
          {isNew && <span className="wall-card-new">NEW</span>}
          <span className="wall-card-time">{formatRelativeTime(post.createdAt)}</span>
        </div>
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

      <div className="wall-card-body">
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
      </div>

      <div className="wall-card-footer">
        <div className="wall-card-reactions">
          {REACTION_EMOJIS.map(emoji => {
            const count = reactions[emoji] ?? 0;
            const active = myReactions.has(emoji);
            return (
              <button
                key={emoji}
                type="button"
                className={`wall-card-reaction${active ? ' wall-card-reaction--active' : ''}`}
                onClick={() => canReact && onReact(post.id, emoji)}
                title={canReact ? (active ? `Remove ${emoji}` : `React with ${emoji}`) : 'Log in to react'}
                disabled={!canReact}
              >
                <span className="wall-card-reaction-emoji">{emoji}</span>
                {count > 0 && <span className="wall-card-reaction-count">{count}</span>}
              </button>
            );
          })}
          {totalReactions === 0 && !canReact && null}
        </div>

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
