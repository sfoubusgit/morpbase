import { useCallback, useEffect, useState } from 'react';
import type { WallPost, WallPostIdentityTag } from '../../../types/community';
import { getWallPost, getPostReplies } from '../../../engine/wallStore';
import {
  getReactionsForPosts,
  getMyReactions,
  addReaction,
  removeReaction,
  REACTION_EMOJIS,
  type PostReactions,
} from '../../../engine/reactionStore';
import { getXPMap } from '../../../engine/xpStore';
import { getTitleForXp } from '../../../data/communityTitles';
import { ReactionIcon } from '../shared/ReactionIcon';
import { TitleBadge } from '../shared/TitleBadge';
import { WallPostComposer } from './WallPostComposer';
import './PostDetailPage.css';

const TYPE_LABELS: Record<string, string> = {
  character:   'Character',
  style:       'Style',
  lighting:    'Lighting',
  environment: 'Environment',
  wardrobe:    'Wardrobe',
  composition: 'Composition',
  mood:        'Mood',
  negative:    'Negative',
  aura:        'Aura',
  object:      'Object',
};

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

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

type PostDetailPageProps = {
  postId: string;
  authUid: string | null;
  userId: string | null;
  userName: string | null;
  onBack: () => void;
  onViewAuthor?: (authUid: string, name: string) => void;
  onOpenIdentity?: (name: string, type: string) => void;
};

export function PostDetailPage({
  postId,
  authUid,
  userId,
  userName,
  onBack,
  onViewAuthor,
  onOpenIdentity,
}: PostDetailPageProps) {
  const [post, setPost] = useState<WallPost | null>(null);
  const [replies, setReplies] = useState<WallPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [reactionMap, setReactionMap] = useState<Record<string, PostReactions>>({});
  const [myReactionMap, setMyReactionMap] = useState<Record<string, Set<string>>>({});
  const [xpMap, setXpMap] = useState<Map<string, number>>(new Map());
  const [composerOpen, setComposerOpen] = useState(false);

  const load = useCallback(async () => {
    const [fetchedPost, fetchedReplies] = await Promise.all([
      getWallPost(postId),
      getPostReplies(postId),
    ]);
    if (!fetchedPost) { setLoading(false); return; }
    setPost(fetchedPost);
    setReplies(fetchedReplies);
    setLoading(false);

    const allIds = [fetchedPost.id, ...fetchedReplies.map(r => r.id)];
    const allUids = [...new Set([fetchedPost.authUid, ...fetchedReplies.map(r => r.authUid)])];
    const [reactions, xp] = await Promise.all([
      getReactionsForPosts(allIds),
      getXPMap(allUids),
    ]);
    setReactionMap(reactions);
    setXpMap(xp);

    if (authUid) {
      const mine = await getMyReactions(authUid, allIds);
      setMyReactionMap(mine);
    }
  }, [postId, authUid]);

  useEffect(() => { void load(); }, [load]);

  const handleReact = useCallback(async (targetPostId: string, emoji: string) => {
    if (!authUid) return;
    const alreadyReacted = myReactionMap[targetPostId]?.has(emoji);
    setMyReactionMap(prev => {
      const next = { ...prev };
      const set = new Set(prev[targetPostId] ?? []);
      if (alreadyReacted) set.delete(emoji); else set.add(emoji);
      next[targetPostId] = set;
      return next;
    });
    setReactionMap(prev => {
      const next = { ...prev };
      const counts = { ...(prev[targetPostId] ?? {}) };
      counts[emoji] = Math.max(0, (counts[emoji] ?? 0) + (alreadyReacted ? -1 : 1));
      next[targetPostId] = counts;
      return next;
    });
    if (alreadyReacted) {
      await removeReaction(targetPostId, authUid, emoji);
    } else {
      const postAuthorAuthUid = targetPostId === post?.id
        ? post?.authUid
        : replies.find(r => r.id === targetPostId)?.authUid;
      await addReaction(targetPostId, authUid, emoji, { postAuthorAuthUid, reactorName: userName ?? undefined });
    }
  }, [authUid, myReactionMap, post, replies, userName]);

  const handleReplied = useCallback(() => {
    setComposerOpen(false);
    void load();
  }, [load]);

  if (loading) return <div className="post-detail-loading">Loading…</div>;
  if (!post) return (
    <div className="post-detail-not-found">
      <button type="button" className="post-detail-back" onClick={onBack}>← Wall</button>
      <p>Post not found.</p>
    </div>
  );

  // Group identity tags by type for the "Built with" section
  const tagsByType = new Map<string, WallPostIdentityTag[]>();
  for (const tag of post.identityTags) {
    const arr = tagsByType.get(tag.type) ?? [];
    arr.push(tag);
    tagsByType.set(tag.type, arr);
  }

  const authorTitle = xpMap.has(post.authUid) ? getTitleForXp(xpMap.get(post.authUid)!) : null;

  return (
    <div className="post-detail">
      <div className="post-detail-inner">

        <button type="button" className="post-detail-back" onClick={onBack}>
          ← Wall
        </button>

        {/* ── Main content ── */}
        <div className="post-detail-content">
          {post.caption && (
            <p className="post-detail-caption">{post.caption}</p>
          )}

          <div className="post-detail-prompt">{post.promptText}</div>
        </div>

        {/* ── Built with ── */}
        {tagsByType.size > 0 && (
          <div className="post-detail-build">
            <div className="post-detail-section-label">Built with</div>
            <div className="post-detail-build-rows">
              {[...tagsByType.entries()].map(([type, tags]) => (
                <div key={type} className="post-detail-build-row">
                  <span className="post-detail-build-lane">{TYPE_LABELS[type] ?? type}</span>
                  <div className="post-detail-build-tags">
                    {tags.map(tag => (
                      <button
                        key={tag.name}
                        type="button"
                        className="post-detail-build-tag"
                        style={{ color: TYPE_COLORS[type] ?? '#94a3b8' }}
                        onClick={() => onOpenIdentity?.(tag.name, tag.type)}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Author ── */}
        <div className="post-detail-author-row">
          <button
            type="button"
            className="post-detail-author-name"
            onClick={() => onViewAuthor?.(post.authUid, post.authorName)}
          >
            {post.authorName}
          </button>
          {authorTitle && <TitleBadge title={authorTitle} size="sm" />}
          <span className="post-detail-time">{formatTime(post.createdAt)}</span>
        </div>

        {/* ── Reactions ── */}
        <div className="post-detail-reactions">
          {REACTION_EMOJIS.map(key => {
            const count = (reactionMap[post.id] ?? {})[key] ?? 0;
            const active = myReactionMap[post.id]?.has(key) ?? false;
            return (
              <button
                key={key}
                type="button"
                className={`post-detail-reaction${active ? ' post-detail-reaction--active' : ''}`}
                onClick={() => authUid && handleReact(post.id, key)}
                disabled={!authUid}
                title={authUid ? (active ? 'Remove' : 'React') : 'Log in to react'}
              >
                <ReactionIcon type={key} size={16} />
                {count > 0 && <span className="post-detail-reaction-count">{count}</span>}
              </button>
            );
          })}
        </div>

        {/* ── Comments ── */}
        <div className="post-detail-comments">
          <div className="post-detail-section-label">
            Comments {replies.length > 0 && `(${replies.length})`}
          </div>

          {replies.length === 0 && !composerOpen && (
            <p className="post-detail-no-comments">No comments yet.</p>
          )}

          {replies.map(reply => {
            const replyTitle = xpMap.has(reply.authUid) ? getTitleForXp(xpMap.get(reply.authUid)!) : null;
            return (
              <div key={reply.id} className="post-detail-comment">
                <div className="post-detail-comment-header">
                  <button
                    type="button"
                    className="post-detail-comment-author"
                    onClick={() => onViewAuthor?.(reply.authUid, reply.authorName)}
                  >
                    {reply.authorName}
                  </button>
                  {replyTitle && <TitleBadge title={replyTitle} size="sm" />}
                  <span className="post-detail-comment-time">{formatTime(reply.createdAt)}</span>
                </div>
                <p className="post-detail-comment-body">{reply.promptText}</p>
                <div className="post-detail-comment-reactions">
                  {REACTION_EMOJIS.map(key => {
                    const count = (reactionMap[reply.id] ?? {})[key] ?? 0;
                    const active = myReactionMap[reply.id]?.has(key) ?? false;
                    if (count === 0 && !authUid) return null;
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`post-detail-reaction post-detail-reaction--sm${active ? ' post-detail-reaction--active' : ''}`}
                        onClick={() => authUid && handleReact(reply.id, key)}
                        disabled={!authUid}
                      >
                        <ReactionIcon type={key} size={13} />
                        {count > 0 && <span className="post-detail-reaction-count">{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {authUid && userId && userName && (
            composerOpen ? (
              <WallPostComposer
                authUid={authUid}
                userId={userId}
                userName={userName}
                availableIdentityTags={[]}
                promptText=""
                parentPostId={post.id}
                replyToName={post.authorName}
                onPosted={handleReplied}
                onCancel={() => setComposerOpen(false)}
                compact
              />
            ) : (
              <button
                type="button"
                className="post-detail-add-comment"
                onClick={() => setComposerOpen(true)}
              >
                Add a comment…
              </button>
            )
          )}
        </div>

      </div>
    </div>
  );
}
