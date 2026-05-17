import { useCallback, useEffect, useState } from 'react';
import type { WallPost, WallPostIdentityTag } from '../../../types/community';
import {
  getIdentityDiscussionPost,
  getPostReplies,
  createWallPost,
} from '../../../engine/wallStore';
import {
  getReactionsForPosts,
  getMyReactions,
  addReaction,
  removeReaction,
  REACTION_EMOJIS,
  type PostReactions,
} from '../../../engine/reactionStore';
import { ReactionIcon } from '../shared/ReactionIcon';
import './IdentityDetailPage.css';

export type SharedIdentityData = {
  id: string;
  name: string;
  type: string;
  phrases: string[];
  summary: string;
  authorName: string;
  authorId: string | null;
  remixCount: number;
  parentId: string | null;
  createdAt?: number;
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

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(ts).toLocaleDateString();
}

type IdentityDetailPageProps = {
  identity: SharedIdentityData;
  authUid: string | null;
  userId: string | null;
  userName: string | null;
  activeIdentityTags: WallPostIdentityTag[];
  onBack: () => void;
  onViewAuthor?: (authUid: string, name: string) => void;
};

export function IdentityDetailPage({
  identity,
  authUid,
  userId,
  userName,
  activeIdentityTags,
  onBack,
  onViewAuthor,
}: IdentityDetailPageProps) {
  const color = TYPE_COLORS[identity.type] ?? '#a78bfa';
  const alreadyAdded = activeIdentityTags.some(
    t => t.name === identity.name && t.type === identity.type,
  );

  const [discussionPost, setDiscussionPost] = useState<WallPost | null>(null);
  const [replies, setReplies] = useState<WallPost[]>([]);
  const [reactionMap, setReactionMap] = useState<Record<string, PostReactions>>({});
  const [myReactionMap, setMyReactionMap] = useState<Record<string, Set<string>>>({});
  const [discussionLoading, setDiscussionLoading] = useState(!!identity.authorId);
  const [commentText, setCommentText] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!identity.authorId) return;
    setDiscussionLoading(true);
    void getIdentityDiscussionPost(identity.authorId, identity.name, identity.type).then(async post => {
      setDiscussionPost(post);
      if (post) {
        const postReplies = await getPostReplies(post.id);
        setReplies(postReplies);
        const allIds = [post.id, ...postReplies.map(r => r.id)];
        const reactions = await getReactionsForPosts(allIds);
        setReactionMap(reactions);
        if (authUid) {
          const myR = await getMyReactions(authUid, allIds);
          setMyReactionMap(myR);
        }
      }
      setDiscussionLoading(false);
    });
  }, [identity.authorId, identity.name, identity.type, authUid]);

  const ensureDiscussionPost = async (): Promise<WallPost | null> => {
    if (discussionPost) return discussionPost;
    if (!authUid || !userId || !userName || !identity.authorId) return null;
    try {
      const post = await createWallPost(
        {
          promptText: identity.phrases.slice(0, 3).join(' · ') || identity.summary || identity.name,
          identityTags: [{ name: identity.name, type: identity.type }],
          postType: 'share_event',
        },
        authUid, userId, userName,
      );
      setDiscussionPost(post);
      return post;
    } catch { return null; }
  };

  const handleReactOnRoot = useCallback(async (emoji: string) => {
    if (!authUid) return;
    let post = discussionPost;
    if (!post) {
      post = await ensureDiscussionPost();
      if (!post) return;
    }
    const targetPostId = post.id;
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
      await addReaction(targetPostId, authUid, emoji, { postAuthorAuthUid: post.authUid, reactorName: userName ?? undefined });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUid, myReactionMap, discussionPost, userName]);

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
    const postAuthorAuthUid = replies.find(r => r.id === targetPostId)?.authUid;
    if (alreadyReacted) {
      await removeReaction(targetPostId, authUid, emoji);
    } else {
      await addReaction(targetPostId, authUid, emoji, { postAuthorAuthUid, reactorName: userName ?? undefined });
    }
  }, [authUid, myReactionMap, replies, userName]);

  const handleSubmitComment = async () => {
    if (!authUid || !userId || !userName || !commentText.trim()) return;
    setSubmitting(true);
    try {
      const post = await ensureDiscussionPost();
      if (!post) return;
      const reply = await createWallPost(
        { promptText: commentText.trim(), identityTags: [], parentPostId: post.id },
        authUid, userId, userName,
      );
      setReplies(prev => [...prev, reply]);
      setCommentText('');
      setComposerOpen(false);
    } catch { /* non-fatal */ } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="identity-detail-page">
      <div className="identity-detail-inner">
        <button type="button" className="identity-detail-back" onClick={onBack}>
          ← Back
        </button>

        <div className="identity-detail-hero">
          <span className="identity-detail-dot" style={{ background: color }} />
          <div className="identity-detail-hero-text">
            <h1 className="identity-detail-name">{identity.name}</h1>
            <span className="identity-detail-type-badge" style={{ color, borderColor: `${color}44`, background: `${color}14` }}>
              {identity.type}
            </span>
          </div>
        </div>

        {identity.summary && (
          <p className="identity-detail-summary">{identity.summary}</p>
        )}

        {identity.phrases.length > 0 && (
          <div className="identity-detail-section">
            <div className="identity-detail-section-label">Phrases</div>
            <div className="identity-detail-phrases">
              {identity.phrases.map((phrase, i) => (
                <span key={i} className="identity-detail-phrase">{phrase}</span>
              ))}
            </div>
          </div>
        )}

        <div className="identity-detail-meta">
          <div className="identity-detail-meta-row">
            <span className="identity-detail-meta-label">By</span>
            {identity.authorId && onViewAuthor ? (
              <button
                type="button"
                className="identity-detail-author-btn"
                onClick={() => onViewAuthor(identity.authorId!, identity.authorName)}
              >
                {identity.authorName}
              </button>
            ) : (
              <span className="identity-detail-meta-value">{identity.authorName}</span>
            )}
          </div>
          {identity.createdAt && (
            <div className="identity-detail-meta-row">
              <span className="identity-detail-meta-label">Shared</span>
              <span className="identity-detail-meta-value">{formatDate(identity.createdAt)}</span>
            </div>
          )}
          {identity.remixCount > 0 && (
            <div className="identity-detail-meta-row">
              <span className="identity-detail-meta-label">Remixes</span>
              <span className="identity-detail-meta-value">{identity.remixCount}</span>
            </div>
          )}
          {identity.parentId && (
            <div className="identity-detail-meta-row">
              <span className="identity-detail-meta-label">Origin</span>
              <span className="identity-detail-meta-value identity-detail-meta-remix">Remixed identity</span>
            </div>
          )}
        </div>

        {alreadyAdded && (
          <div className="identity-detail-added">✓ In your {identity.type}</div>
        )}

        {/* Reactions + Comments */}
        {identity.authorId && (
          <div className="identity-detail-discussion">
            {discussionLoading ? (
              <p className="identity-detail-discuss-loading">Loading…</p>
            ) : (
              <>
                {/* Reactions */}
                <div className="identity-detail-reactions">
                  {REACTION_EMOJIS.map(key => {
                    const count = discussionPost ? ((reactionMap[discussionPost.id] ?? {})[key] ?? 0) : 0;
                    const active = discussionPost ? (myReactionMap[discussionPost.id]?.has(key) ?? false) : false;
                    return (
                      <button
                        key={key}
                        type="button"
                        className={`identity-detail-reaction${active ? ' identity-detail-reaction--active' : ''}`}
                        onClick={() => void handleReactOnRoot(key)}
                        disabled={!authUid}
                        title={authUid ? (active ? 'Remove reaction' : 'React') : 'Log in to react'}
                      >
                        <ReactionIcon type={key} size={16} />
                        {count > 0 && <span className="identity-detail-reaction-count">{count}</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Comments */}
                <div className="identity-detail-comments">
                  <div className="identity-detail-section-label">
                    Comments{replies.length > 0 ? ` (${replies.length})` : ''}
                  </div>

                  {replies.length === 0 && !composerOpen && (
                    <p className="identity-detail-no-comments">No comments yet. Be the first.</p>
                  )}

                  {replies.map(reply => (
                    <div key={reply.id} className="identity-detail-comment">
                      <div className="identity-detail-comment-header">
                        <button
                          type="button"
                          className="identity-detail-comment-author"
                          onClick={() => onViewAuthor?.(reply.authUid, reply.authorName)}
                        >
                          {reply.authorName}
                        </button>
                        <span className="identity-detail-comment-time">{formatTime(reply.createdAt)}</span>
                      </div>
                      <p className="identity-detail-comment-body">{reply.promptText}</p>
                      <div className="identity-detail-comment-reactions">
                        {REACTION_EMOJIS.map(key => {
                          const count = (reactionMap[reply.id] ?? {})[key] ?? 0;
                          const active = myReactionMap[reply.id]?.has(key) ?? false;
                          if (count === 0 && !authUid) return null;
                          return (
                            <button
                              key={key}
                              type="button"
                              className={`identity-detail-reaction identity-detail-reaction--sm${active ? ' identity-detail-reaction--active' : ''}`}
                              onClick={() => void handleReact(reply.id, key)}
                              disabled={!authUid}
                            >
                              <ReactionIcon type={key} size={13} />
                              {count > 0 && <span className="identity-detail-reaction-count">{count}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {authUid && userId && userName && (
                    composerOpen ? (
                      <div className="identity-detail-composer">
                        <textarea
                          className="identity-detail-composer-input"
                          placeholder="Write a comment…"
                          value={commentText}
                          onChange={e => setCommentText(e.target.value)}
                          rows={3}
                        />
                        <div className="identity-detail-composer-actions">
                          <button
                            type="button"
                            className="identity-detail-composer-cancel"
                            onClick={() => { setComposerOpen(false); setCommentText(''); }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="identity-detail-composer-submit"
                            disabled={!commentText.trim() || submitting}
                            onClick={() => void handleSubmitComment()}
                          >
                            {submitting ? 'Posting…' : 'Post'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="identity-detail-add-comment"
                        onClick={() => setComposerOpen(true)}
                      >
                        Add a comment…
                      </button>
                    )
                  )}

                  {!authUid && (
                    <p className="identity-detail-no-comments">Log in to react and comment.</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
