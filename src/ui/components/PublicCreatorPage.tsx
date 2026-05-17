import { useEffect, useMemo, useState } from 'react';
import type { CreatorStats, PublicProfile, SavedPrompt } from '../../types';
import type { WallPost, EarnedBadge, WallPostIdentityTag } from '../../types/community';

type CreativeDna = {
  topTags: { type: string; name: string; count: number }[];
  recentPosts: number;
  previousPosts: number;
  totalPosts: number;
};

function computeCreativeDna(posts: WallPost[]): CreativeDna {
  const now = Date.now();
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  const tagCounts = new Map<string, { tag: WallPostIdentityTag; count: number }>();
  for (const post of posts) {
    for (const tag of post.identityTags) {
      const key = `${tag.type}\x00${tag.name}`;
      const entry = tagCounts.get(key);
      if (entry) entry.count++;
      else tagCounts.set(key, { tag, count: 1 });
    }
  }
  const topTags = [...tagCounts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map(({ tag, count }) => ({ type: tag.type, name: tag.name, count }));
  const recentPosts = posts.filter(p => now - p.createdAt < thirtyDays).length;
  const previousPosts = posts.filter(p => {
    const age = now - p.createdAt;
    return age >= thirtyDays && age < 2 * thirtyDays;
  }).length;
  return { topTags, recentPosts, previousPosts, totalPosts: posts.length };
}
import { getPublicProfileByUserId, getPublicProfileByAuthUid } from '../../engine/profileStore';
import { listPublicPromptsByUser } from '../../engine/promptStore';
import { listHubEntriesByCreator } from '../../engine/poolHubStore';
import { getCreatorStatsByUserId } from '../../engine/creatorStatsStore';
import { getCreatorSummaryFromPoolEntries, mergeCreatorSummaryWithStats } from '../../engine/creatorSummary';
import { getUserXP } from '../../engine/xpStore';
import { getEarnedBadges } from '../../engine/badgeStore';
import { listWallPosts } from '../../engine/wallStore';
import { getLastSeenAt } from '../../engine/presenceStore';
import { followUser, unfollowUser, isFollowing, getFollowerCount } from '../../engine/followStore';
import { getTitleForXp } from '../../data/communityTitles';
import { BADGE_REGISTRY } from '../../data/communityBadges';
import { useOnlineAuthUids } from '../hooks/useOnlineAuthUids';
import { TitleBadge } from './shared/TitleBadge';
import { OnlineIndicator } from './shared/OnlineIndicator';
import './PublicCreatorPage.css';

type PublicCreatorPageProps = {
  creatorId?: string | null;
  creatorAuthUid?: string | null;
  creatorName?: string | null;
  viewerAuthUid?: string | null;
  onBack?: () => void;
  onOpenPool?: (entryId: string) => void;
  onMessage?: (recipientAuthUid: string, recipientName: string) => void;
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function PublicCreatorPage({
  creatorId,
  creatorAuthUid,
  creatorName,
  viewerAuthUid,
  onBack,
  onOpenPool,
  onMessage,
}: PublicCreatorPageProps) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [publicPrompts, setPublicPrompts] = useState<SavedPrompt[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [creatorStats, setCreatorStats] = useState<CreatorStats | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [creatorXp, setCreatorXp] = useState<number | null>(null);
  const [creatorBadges, setCreatorBadges] = useState<EarnedBadge[]>([]);
  const [wallPosts, setWallPosts] = useState<WallPost[]>([]);
  const [loadingWall, setLoadingWall] = useState(false);
  const [lastSeenAt, setLastSeenAt] = useState<number | null>(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCreator, setFollowingCreator] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const onlineUids = useOnlineAuthUids();
  const isOnline = creatorAuthUid ? onlineUids.has(creatorAuthUid) : false;

  // Effective profile-UUID for pool/prompt lookups (may come from either prop or profile.userId)
  const [effectiveCreatorId, setEffectiveCreatorId] = useState<string | null>(creatorId ?? null);

  // Load profile — via userId or authUid
  useEffect(() => {
    let isActive = true;
    const idToFetch = creatorId || null;
    const authUidToFetch = creatorAuthUid || null;
    if (!idToFetch && !authUidToFetch) {
      setProfile(null);
      setProfileError(null);
      return () => { isActive = false; };
    }

    const loadProfile = async () => {
      setProfileError(null);
      try {
        const nextProfile = idToFetch
          ? await getPublicProfileByUserId(idToFetch)
          : await getPublicProfileByAuthUid(authUidToFetch!);
        if (isActive) {
          setProfile(nextProfile);
          if (nextProfile?.userId) setEffectiveCreatorId(nextProfile.userId);
        }
      } catch (err: any) {
        if (isActive) setProfileError(err?.message ?? 'Failed to load creator profile.');
      }
    };

    void loadProfile();
    return () => { isActive = false; };
  }, [creatorId, creatorAuthUid]);

  // Load creator stats (legacy system)
  useEffect(() => {
    let isActive = true;
    if (!effectiveCreatorId) { setCreatorStats(null); return () => { isActive = false; }; }
    const loadStats = async () => {
      try {
        const stats = await getCreatorStatsByUserId(effectiveCreatorId);
        if (isActive) setCreatorStats(stats);
      } catch {
        if (isActive) setCreatorStats(null);
      }
    };
    void loadStats();
    return () => { isActive = false; };
  }, [effectiveCreatorId]);

  // Load public prompts
  useEffect(() => {
    let isActive = true;
    if (!effectiveCreatorId || !profile?.showPublicPrompts) {
      setPublicPrompts([]);
      return () => { isActive = false; };
    }
    const loadPrompts = async () => {
      setLoadingPrompts(true);
      try {
        const prompts = await listPublicPromptsByUser(effectiveCreatorId);
        if (isActive) setPublicPrompts(prompts);
      } catch {
        // non-fatal
      } finally {
        if (isActive) setLoadingPrompts(false);
      }
    };
    void loadPrompts();
    return () => { isActive = false; };
  }, [effectiveCreatorId, profile?.showPublicPrompts]);

  // Load XP + badges from community system
  useEffect(() => {
    if (!creatorAuthUid) return;
    void getUserXP(creatorAuthUid).then(setCreatorXp);
    void getEarnedBadges(creatorAuthUid).then(setCreatorBadges);
  }, [creatorAuthUid]);

  // Fetch last_seen_at for offline indicator
  useEffect(() => {
    if (!effectiveCreatorId) return;
    void getLastSeenAt(effectiveCreatorId).then(setLastSeenAt);
  }, [effectiveCreatorId]);

  // Load follow state
  useEffect(() => {
    if (!creatorAuthUid) return;
    void getFollowerCount(creatorAuthUid).then(setFollowerCount);
    if (viewerAuthUid && viewerAuthUid !== creatorAuthUid) {
      void isFollowing(viewerAuthUid, creatorAuthUid).then(setFollowingCreator);
    }
  }, [creatorAuthUid, viewerAuthUid]);

  const handleFollowToggle = async () => {
    if (!viewerAuthUid || !creatorAuthUid || followLoading) return;
    setFollowLoading(true);
    const wasFollowing = followingCreator;
    setFollowingCreator(!wasFollowing);
    setFollowerCount(c => wasFollowing ? Math.max(0, c - 1) : c + 1);
    try {
      if (wasFollowing) {
        await unfollowUser(viewerAuthUid, creatorAuthUid);
      } else {
        await followUser(viewerAuthUid, creatorAuthUid, displayName);
      }
    } catch {
      setFollowingCreator(wasFollowing);
      setFollowerCount(c => wasFollowing ? c + 1 : Math.max(0, c - 1));
    } finally {
      setFollowLoading(false);
    }
  };

  // Load wall posts
  useEffect(() => {
    if (!creatorAuthUid) { setWallPosts([]); return; }
    setLoadingWall(true);
    void listWallPosts({ authorAuthUid: creatorAuthUid, limit: 30 }).then(posts => {
      setWallPosts(posts);
      setLoadingWall(false);
    });
  }, [creatorAuthUid]);

  const publicPools = useMemo(
    () => listHubEntriesByCreator({ creatorId: effectiveCreatorId, creatorName }),
    [effectiveCreatorId, creatorName],
  );

  const displayName = profile?.displayName ?? creatorName ?? 'Creator';
  const visiblePools =
    effectiveCreatorId && profile
      ? (profile.showPublicPools ? publicPools : [])
      : publicPools;

  const creatorSummary = useMemo(
    () => mergeCreatorSummaryWithStats(
      getCreatorSummaryFromPoolEntries(visiblePools, publicPrompts.length),
      creatorStats,
    ),
    [visiblePools, publicPrompts.length, creatorStats],
  );

  const title = creatorXp !== null ? getTitleForXp(creatorXp) : null;
  const creativeDna = useMemo(() => computeCreativeDna(wallPosts), [wallPosts]);

  const shareUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (creatorId) params.set('user', creatorId);
    if (creatorAuthUid) params.set('authuid', creatorAuthUid);
    if (creatorName) params.set('name', creatorName);
    const query = params.toString();
    const hash = query ? `#creator?${query}` : '';
    return `${window.location.origin}${window.location.pathname}${window.location.search}${hash}`;
  }, [creatorId, creatorAuthUid, creatorName]);

  return (
    <div className="pub-profile-page">
    <div className="pub-profile">

      {/* Top bar */}
      <div className="pub-profile-topbar">
        <button type="button" className="pub-profile-back" onClick={onBack}>
          ← Back
        </button>
        <div className="pub-profile-topbar-actions">
          <button
            type="button"
            className="pub-profile-action-btn"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl)
                .then(() => setShareMessage('Link copied.'))
                .catch(() => setShareMessage('Could not copy link.'));
            }}
          >
            Copy Link
          </button>
          {viewerAuthUid && creatorAuthUid && viewerAuthUid !== creatorAuthUid && (
            <button
              type="button"
              className={`pub-profile-follow-btn${followingCreator ? ' following' : ''}`}
              onClick={() => void handleFollowToggle()}
              disabled={followLoading}
            >
              {followingCreator ? 'Following' : 'Follow'}
            </button>
          )}
          {onMessage && viewerAuthUid && creatorAuthUid && viewerAuthUid !== creatorAuthUid && (
            <button
              type="button"
              className="pub-profile-action-btn pub-profile-action-btn--message"
              onClick={() => onMessage(creatorAuthUid, displayName)}
            >
              Message
            </button>
          )}
        </div>
      </div>

      {shareMessage && <div className="pub-profile-share-toast">{shareMessage}</div>}
      {profileError && <div className="pub-profile-error-banner">{profileError}</div>}

      {/* Hero */}
      <div className="pub-profile-hero">
        <div className="pub-profile-hero-main">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt={displayName} className="pub-profile-avatar" />
          ) : (
            <div className="pub-profile-avatar pub-profile-avatar--fallback">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="pub-profile-identity">
            <div className="pub-profile-name-row">
              <h1 className="pub-profile-name">{displayName}</h1>
              {title && <TitleBadge title={title} size="md" />}
              <OnlineIndicator isOnline={isOnline} lastSeenAt={lastSeenAt} showLastSeen />
            </div>
            {creatorXp !== null && (
              <div className="pub-profile-xp">{creatorXp.toLocaleString()} XP</div>
            )}
            {profile?.bio && (
              <p className="pub-profile-bio">{profile.bio}</p>
            )}
            {(profile?.showLinksPublicly && profile.links) || (profile?.tags && profile.tags.length > 0) ? (
              <div className="pub-profile-meta-chips">
                {profile?.showLinksPublicly && profile.links && Object.entries(profile.links).map(([label, url]) => (
                  <a key={label} href={url} target="_blank" rel="noreferrer" className="pub-profile-chip pub-profile-chip--link">{label}</a>
                ))}
                {profile?.tags && profile.tags.map(tag => (
                  <span key={tag} className="pub-profile-chip">{tag}</span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="pub-profile-stats">
          <div className="pub-profile-stat">
            <strong>{followerCount}</strong>
            <span>Followers</span>
          </div>
          <div className="pub-profile-stat">
            <strong>{wallPosts.length > 0 ? wallPosts.length : '—'}</strong>
            <span>Wall posts</span>
          </div>
          <div className="pub-profile-stat">
            <strong>{creatorSummary.uploads > 0 ? creatorSummary.uploads : '—'}</strong>
            <span>Pools</span>
          </div>
          <div className="pub-profile-stat">
            <strong>{creatorBadges.length > 0 ? creatorBadges.length : '—'}</strong>
            <span>Badges</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="pub-profile-body">

        {creatorBadges.length > 0 && (
          <section className="pub-profile-section">
            <div className="pub-profile-section-head">
              <h2>Badges</h2>
              <span className="pub-profile-section-meta">{creatorBadges.length} earned</span>
            </div>
            <div className="pub-profile-badges">
              {creatorBadges.map(b => {
                const def = BADGE_REGISTRY[b.badgeId];
                if (!def) return null;
                return (
                  <div key={b.badgeId} className={`pub-profile-badge pub-profile-badge--${def.rarity}`} title={def.description}>
                    <span className="pub-profile-badge-icon">{def.icon}</span>
                    <span className="pub-profile-badge-label">{def.label}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {creatorAuthUid && wallPosts.length > 0 && (
          <section className="pub-profile-section">
            <div className="pub-profile-section-head">
              <h2>Wall Posts</h2>
            </div>
            {loadingWall ? (
              <div className="pub-profile-empty">Loading…</div>
            ) : (
              <div className="pub-profile-wall-grid">
                {wallPosts.slice(0, 8).map(post => (
                  <div key={post.id} className="pub-profile-wall-card">
                    {post.caption && (
                      <div className="pub-profile-wall-caption">{post.caption}</div>
                    )}
                    <p className="pub-profile-wall-text">
                      {post.promptText.length > 160
                        ? post.promptText.slice(0, 160) + '…'
                        : post.promptText}
                    </p>
                    {post.identityTags.length > 0 && (
                      <div className="pub-profile-wall-tags">
                        {post.identityTags.slice(0, 4).map(tag => (
                          <span key={tag.name} className={`pub-profile-wall-tag pub-profile-wall-tag--${tag.type}`}>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="pub-profile-wall-meta">
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {creativeDna.totalPosts >= 2 && creativeDna.topTags.length > 0 && (
          <section className="pub-profile-section">
            <div className="pub-profile-section-head">
              <h2>Creative DNA</h2>
              <span className="pub-profile-section-meta">
                {creativeDna.totalPosts} posts{creativeDna.recentPosts > 0 && ` · ${creativeDna.recentPosts} this month`}{creativeDna.recentPosts > creativeDna.previousPosts && ' ↑'}
              </span>
            </div>
            <div className="pub-profile-dna-grid">
              {creativeDna.topTags.map(tag => (
                <div key={`${tag.type}_${tag.name}`} className={`pub-profile-dna-tag pub-profile-dna-tag--${tag.type}`}>
                  <span className="pub-profile-dna-type">{tag.type}</span>
                  <span className="pub-profile-dna-name">{tag.name}</span>
                  <span className="pub-profile-dna-count">{tag.count}×</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {visiblePools.length > 0 && (
          <section className="pub-profile-section">
            <div className="pub-profile-section-head">
              <h2>Pools</h2>
            </div>
            <div className="pub-profile-pool-grid">
              {visiblePools.map(entry => (
                <button
                  key={entry.id}
                  type="button"
                  className="pub-profile-pool-card"
                  onClick={() => onOpenPool?.(entry.id)}
                >
                  <div className="pub-profile-pool-head">
                    <span>{entry.category}</span>
                    <span>{entry.ratingAvg.toFixed(1)}</span>
                  </div>
                  <div className="pub-profile-pool-title">{entry.title}</div>
                  <div className="pub-profile-pool-summary">{entry.summary}</div>
                  <div className="pub-profile-pool-meta">
                    <span>{entry.downloads} downloads</span>
                    <span>{entry.payload.items.length} items</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {profile?.showPublicPrompts && publicPrompts.length > 0 && (
          <section className="pub-profile-section">
            <div className="pub-profile-section-head">
              <h2>Prompts</h2>
            </div>
            {loadingPrompts ? (
              <div className="pub-profile-empty">Loading…</div>
            ) : (
              <div className="pub-profile-prompt-list">
                {publicPrompts.map(prompt => (
                  <div key={prompt.id} className="pub-profile-prompt-card">
                    <div className="pub-profile-prompt-title">{prompt.name}</div>
                    <div className="pub-profile-prompt-text">{prompt.positive}</div>
                    {(prompt.model || prompt.purpose || prompt.tags?.length) && (
                      <div className="pub-profile-prompt-meta">
                        {prompt.model && <span>{prompt.model}</span>}
                        {prompt.purpose && <span>{prompt.purpose}</span>}
                        {prompt.tags && prompt.tags.length > 0 && <span>{prompt.tags.join(', ')}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

      </div>
    </div>
    </div>
  );
}
