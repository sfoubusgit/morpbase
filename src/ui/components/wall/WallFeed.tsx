import { useCallback, useEffect, useRef, useState } from 'react';
import type { WallPost, WallPostIdentityTag } from '../../../types/community';
import {
  deleteWallPost,
  listWallPosts,
} from '../../../engine/wallStore';
import {
  getReactionsForPosts,
  getMyReactions,
  addReaction,
  removeReaction,
  type PostReactions,
} from '../../../engine/reactionStore';
import { getFollowingAuthUids } from '../../../engine/followStore';
import { getXPMap } from '../../../engine/xpStore';
import { useOnlineAuthUids } from '../../hooks/useOnlineAuthUids';
import { WallPostCard } from './WallPostCard';
import { WallPostComposer } from './WallPostComposer';
import './WallFeed.css';

const POLL_INTERVAL_MS = 45_000;
const LAST_VISITED_KEY = 'morpbase:community:last_visited';
const ONBOARDED_KEY = 'morpbase:community:onboarded';

type WallFeedProps = {
  authUid: string | null;
  userId: string | null;
  userName: string | null;
  activeIdentityTags: WallPostIdentityTag[];
  currentPromptText: string;
  onViewAuthor?: (authUid: string, name: string) => void;
  onOpenPost?: (postId: string) => void;
};

type FilterMode = 'all' | 'following';

export function WallFeed({
  authUid,
  userId,
  userName,
  activeIdentityTags,
  currentPromptText,
  onViewAuthor,
  onOpenPost,
}: WallFeedProps) {
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [reactionMap, setReactionMap] = useState<Record<string, PostReactions>>({});
  const [myReactionMap, setMyReactionMap] = useState<Record<string, Set<string>>>({});
  const [followingUids, setFollowingUids] = useState<Set<string>>(new Set());
  const [authorXpMap, setAuthorXpMap] = useState<Map<string, number>>(new Map());
  const [filter, setFilter] = useState<FilterMode>('all');
  const [composerOpen, setComposerOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ postId: string; authorName: string } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(
    () => !!authUid && !localStorage.getItem(ONBOARDED_KEY),
  );
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastVisitedRef = useRef<number>(0);
  const onlineUids = useOnlineAuthUids();

  const fetchPosts = useCallback(async () => {
    const data = await listWallPosts({ limit: 60 });
    setPosts(data);
    setLoading(false);
    const postIds = data.map(p => p.id);
    const authorUids = [...new Set(data.map(p => p.authUid))];
    const [xpMap, reactions] = await Promise.all([
      getXPMap(authorUids),
      getReactionsForPosts(postIds),
    ]);
    setAuthorXpMap(xpMap);
    setReactionMap(reactions);
    return postIds;
  }, []);

  const fetchMyReactions = useCallback(async (postIds: string[]) => {
    if (!authUid || postIds.length === 0) return;
    const mine = await getMyReactions(authUid, postIds);
    setMyReactionMap(mine);
  }, [authUid]);

  const fetchFollowing = useCallback(async () => {
    if (!authUid) return;
    const uids = await getFollowingAuthUids(authUid);
    setFollowingUids(new Set(uids));
  }, [authUid]);

  useEffect(() => {
    const stored = localStorage.getItem(LAST_VISITED_KEY);
    lastVisitedRef.current = stored ? parseInt(stored, 10) : 0;
    localStorage.setItem(LAST_VISITED_KEY, String(Date.now()));

    void (async () => {
      const postIds = await fetchPosts();
      await fetchMyReactions(postIds);
    })();
    void fetchFollowing();
    pollRef.current = setInterval(async () => {
      const postIds = await fetchPosts();
      await fetchMyReactions(postIds);
    }, POLL_INTERVAL_MS);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchPosts, fetchMyReactions, fetchFollowing]);

  const dismissOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDED_KEY, '1');
    setShowOnboarding(false);
  }, []);

  const handlePosted = useCallback(() => {
    setComposerOpen(false);
    dismissOnboarding();
    void fetchPosts();
  }, [fetchPosts, dismissOnboarding]);

  const handleReact = useCallback(async (postId: string, emoji: string) => {
    if (!authUid) return;
    const alreadyReacted = myReactionMap[postId]?.has(emoji);
    // optimistic update
    setMyReactionMap(prev => {
      const next = { ...prev };
      const set = new Set(prev[postId] ?? []);
      if (alreadyReacted) set.delete(emoji); else set.add(emoji);
      next[postId] = set;
      return next;
    });
    setReactionMap(prev => {
      const next = { ...prev };
      const counts = { ...(prev[postId] ?? {}) };
      counts[emoji] = Math.max(0, (counts[emoji] ?? 0) + (alreadyReacted ? -1 : 1));
      next[postId] = counts;
      return next;
    });
    if (alreadyReacted) {
      await removeReaction(postId, authUid, emoji);
    } else {
      const postAuthorAuthUid = posts.find(p => p.id === postId)?.authUid;
      await addReaction(postId, authUid, emoji, { postAuthorAuthUid, reactorName: userName ?? undefined });
    }
  }, [authUid, myReactionMap, posts, userName]);

  const handleDelete = useCallback(async (postId: string) => {
    await deleteWallPost(postId);
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);

  const handleReply = useCallback((postId: string, authorName: string) => {
    setReplyingTo({ postId, authorName });
    setComposerOpen(false);
  }, []);

  const handleReplied = useCallback(() => {
    setReplyingTo(null);
    void fetchPosts();
  }, [fetchPosts]);

  const visible = filter === 'following'
    ? posts.filter(p => followingUids.has(p.authUid) && !p.parentPostId)
    : posts.filter(p => !p.parentPostId);

  const repliesMap = new Map<string, WallPost[]>();
  for (const post of posts) {
    if (post.parentPostId) {
      const arr = repliesMap.get(post.parentPostId) ?? [];
      arr.push(post);
      repliesMap.set(post.parentPostId, arr);
    }
  }

  return (
    <div className="wall-feed">

      <div className="wall-feed-toolbar">
        <div className="wall-feed-filters">
          <button
            type="button"
            className={`wall-feed-filter${filter === 'all' ? ' wall-feed-filter--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`wall-feed-filter${filter === 'following' ? ' wall-feed-filter--active' : ''}`}
            onClick={() => setFilter('following')}
          >
            Following
          </button>
        </div>

        {authUid && userId && userName && !composerOpen && (
          <button
            type="button"
            className="wall-feed-post-btn"
            onClick={() => setComposerOpen(true)}
          >
            + Post to Wall
          </button>
        )}
      </div>

      {showOnboarding && !composerOpen && (
        <div className="wall-onboarding">
          <div className="wall-onboarding-body">
            <p className="wall-onboarding-title">Welcome to the Wall</p>
            <p className="wall-onboarding-text">
              This is where creators share prompts and identities. Post something — your work inspires others.
            </p>
            {authUid && userId && userName && (
              <button
                type="button"
                className="wall-onboarding-cta"
                onClick={() => { setComposerOpen(true); }}
              >
                Post your first prompt
              </button>
            )}
          </div>
          <button
            type="button"
            className="wall-onboarding-dismiss"
            onClick={dismissOnboarding}
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {composerOpen && authUid && userId && userName && (
        <WallPostComposer
          authUid={authUid}
          userId={userId}
          userName={userName}
          availableIdentityTags={activeIdentityTags}
          promptText={currentPromptText}
          onPosted={handlePosted}
          onCancel={() => setComposerOpen(false)}
        />
      )}

      {!authUid && (
        <div className="wall-feed-login-nudge">
          Log in to post to the Wall and react to posts.
        </div>
      )}

      {loading ? (
        <div className="wall-feed-loading">Loading the Wall…</div>
      ) : visible.length === 0 ? (
        <div className="wall-feed-empty">
          {filter === 'following'
            ? 'No posts from people you follow yet. Follow some users in the Users tab.'
            : 'Nothing on the Wall yet. Be the first to post something.'}
        </div>
      ) : (
        <div className="wall-feed-list">
          {visible.map(post => (
            <div key={post.id} className="wall-thread">
              <WallPostCard
                post={post}
                isOwnPost={post.authUid === authUid}
                isNew={post.createdAt > lastVisitedRef.current && lastVisitedRef.current > 0}
                reactions={reactionMap[post.id] ?? {}}
                myReactions={myReactionMap[post.id] ?? new Set()}
                canReact={!!authUid}
                canReply={!!authUid}
                authorXp={authorXpMap.get(post.authUid)}
                isAuthorOnline={onlineUids.has(post.authUid)}
                onReact={handleReact}
                onReply={handleReply}
                onDelete={handleDelete}
                onViewAuthor={onViewAuthor}
                onOpenPost={onOpenPost}
              />

              {(repliesMap.get(post.id) ?? []).map(reply => (
                <div key={reply.id} className="wall-thread-reply">
                  <WallPostCard
                    post={reply}
                    isOwnPost={reply.authUid === authUid}
                    isNew={reply.createdAt > lastVisitedRef.current && lastVisitedRef.current > 0}
                    reactions={reactionMap[reply.id] ?? {}}
                    myReactions={myReactionMap[reply.id] ?? new Set()}
                    canReact={!!authUid}
                    canReply={false}
                    authorXp={authorXpMap.get(reply.authUid)}
                    isAuthorOnline={onlineUids.has(reply.authUid)}
                    onReact={handleReact}
                    onReply={handleReply}
                    onDelete={handleDelete}
                    onViewAuthor={onViewAuthor}
                  />
                </div>
              ))}

              {replyingTo?.postId === post.id && authUid && userId && userName && (
                <div className="wall-thread-composer">
                  <WallPostComposer
                    authUid={authUid}
                    userId={userId}
                    userName={userName}
                    availableIdentityTags={[]}
                    promptText=""
                    parentPostId={post.id}
                    replyToName={replyingTo.authorName}
                    onPosted={handleReplied}
                    onCancel={() => setReplyingTo(null)}
                    compact
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
