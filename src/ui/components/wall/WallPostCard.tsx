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
  canReply: boolean;
  authorXp?: number;
  isAuthorOnline?: boolean;
  onReact: (postId: string, emoji: string) => void;
  onReply: (postId: string, authorName: string) => void;
  onDelete: (postId: string) => void;
  onViewAuthor?: (authUid: string, name: string) => void;
  onOpenPost?: (postId: string) => void;
};

export function WallPostCard({
  post,
  isOwnPost,
  isNew,
  reactions,
  myReactions,
  canReact,
  canReply,
  authorXp,
  isAuthorOnline,
  onReact,
  onReply,
  onDelete,
  onViewAuthor,
  onOpenPost,
}: WallPostCardProps) {
  const displayText = post.promptText.length > PROMPT_PREVIEW_LENGTH
    ? post.promptText.slice(0, PROMPT_PREVIEW_LENGTH) + '…'
    : post.promptText;

  const title = authorXp !== undefined ? getTitleForXp(authorXp) : null;

  return (
    <div className="wall-card">

      {/* Content first */}
      {post.postType === 'share_event' && (
        <div className="wall-card-event-label">shared an identity</div>
      )}

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

      <div
        className={`wall-card-body${onOpenPost ? ' wall-card-body--clickable' : ''}`}
        onClick={() => onOpenPost?.(post.id)}
        role={onOpenPost ? 'button' : undefined}
        tabIndex={onOpenPost ? 0 : undefined}
        onKeyDown={onOpenPost ? (e) => { if (e.key === 'Enter') onOpenPost(post.id); } : undefined}
      >
        {post.caption && (
          <div className="wall-card-caption">{post.caption}</div>
        )}
        <div className="wall-card-prompt">{displayText}</div>
      </div>

      {/* Author + meta at the bottom */}
      <div className="wall-card-meta">
        <div className="wall-card-meta-left">
          <button
            type="button"
            className="wall-card-author-name"
            onClick={() => onViewAuthor?.(post.authUid, post.authorName)}
          >
            {post.authorName}
          </button>
          <OnlineIndicator isOnline={!!isAuthorOnline} />
          {title && <TitleBadge title={title} size="sm" />}
        </div>
        <div className="wall-card-time-row">
          {isNew && <span className="wall-card-new">NEW</span>}
          <span className="wall-card-time">{formatRelativeTime(post.createdAt)}</span>
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
        </div>

        {canReply && post.postType !== 'response' && (
          <button
            type="button"
            className="wall-card-reply"
            onClick={() => onReply(post.id, post.authorName)}
            title="Reply"
          >
            Reply
          </button>
        )}

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
