import { useCallback, useEffect, useRef, useState } from 'react';
import type { WallPost, WallPostIdentityTag } from '../../../types/community';
import {
  deleteWallPost,
  getLikedPostIds,
  likePost,
  listWallPosts,
  unlikePost,
} from '../../../engine/wallStore';
import { getFollowingAuthUids } from '../../../engine/followStore';
import { getXPMap } from '../../../engine/xpStore';
import { useOnlineAuthUids } from '../../hooks/useOnlineAuthUids';
import { WallPostCard } from './WallPostCard';
import { WallPostComposer } from './WallPostComposer';
import './WallFeed.css';

const POLL_INTERVAL_MS = 45_000;
const LAST_VISITED_KEY = 'morpbase:community:last_visited';

type WallFeedProps = {
  authUid: string | null;
  userId: string | null;
  userName: string | null;
  activeIdentityTags: WallPostIdentityTag[];
  currentPromptText: string;
  onViewAuthor?: (authUid: string, name: string) => void;
};

type FilterMode = 'all' | 'following';

export function WallFeed({
  authUid,
  userId,
  userName,
  activeIdentityTags,
  currentPromptText,
  onViewAuthor,
}: WallFeedProps) {
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [followingUids, setFollowingUids] = useState<Set<string>>(new Set());
  const [authorXpMap, setAuthorXpMap] = useState<Map<string, number>>(new Map());
  const [filter, setFilter] = useState<FilterMode>('all');
  const [composerOpen, setComposerOpen] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastVisitedRef = useRef<number>(0);
  const onlineUids = useOnlineAuthUids();

  const fetchPosts = useCallback(async () => {
    const data = await listWallPosts({ limit: 60 });
    setPosts(data);
    setLoading(false);
    const authorUids = [...new Set(data.map(p => p.authUid))];
    const xpMap = await getXPMap(authorUids);
    setAuthorXpMap(xpMap);
  }, []);

  const fetchLikes = useCallback(async () => {
    if (!authUid) return;
    const ids = await getLikedPostIds(authUid);
    setLikedIds(new Set(ids));
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

    void fetchPosts();
    void fetchLikes();
    void fetchFollowing();
    pollRef.current = setInterval(() => { void fetchPosts(); }, POLL_INTERVAL_MS);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fetchPosts, fetchLikes, fetchFollowing]);

  const handlePosted = useCallback(() => {
    setComposerOpen(false);
    void fetchPosts();
  }, [fetchPosts]);

  const handleLike = useCallback(async (postId: string) => {
    if (!authUid) return;
    setLikedIds(prev => new Set([...prev, postId]));
    await likePost(postId, authUid);
  }, [authUid]);

  const handleUnlike = useCallback(async (postId: string) => {
    if (!authUid) return;
    setLikedIds(prev => { const n = new Set(prev); n.delete(postId); return n; });
    await unlikePost(postId, authUid);
  }, [authUid]);

  const handleDelete = useCallback(async (postId: string) => {
    await deleteWallPost(postId);
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);

  const visible = filter === 'following'
    ? posts.filter(p => followingUids.has(p.authUid))
    : posts;

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
          Log in to post to the Wall and like posts.
        </div>
      )}

      {loading ? (
        <div className="wall-feed-loading">Loading the Wall…</div>
      ) : visible.length === 0 ? (
        <div className="wall-feed-empty">
          {filter === 'following'
            ? 'No posts from people you follow yet. Follow some creators in the Creators tab.'
            : 'Nothing on the Wall yet. Be the first to post something.'}
        </div>
      ) : (
        <div className="wall-feed-list">
          {visible.map(post => (
            <WallPostCard
              key={post.id}
              post={post}
              isOwnPost={post.authUid === authUid}
              isLiked={likedIds.has(post.id)}
              isNew={post.createdAt > lastVisitedRef.current && lastVisitedRef.current > 0}
              authorXp={authorXpMap.get(post.authUid)}
              isAuthorOnline={onlineUids.has(post.authUid)}
              onLike={handleLike}
              onUnlike={handleUnlike}
              onDelete={handleDelete}
              onViewAuthor={onViewAuthor}
            />
          ))}
        </div>
      )}
    </div>
  );
}
