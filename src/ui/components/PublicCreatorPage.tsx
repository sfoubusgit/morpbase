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
import { getTitleForXp } from '../../data/communityTitles';
import { useOnlineAuthUids } from '../hooks/useOnlineAuthUids';
import { TitleBadge } from './shared/TitleBadge';
import { BadgeStrip } from './shared/BadgeStrip';
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
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [publicPrompts, setPublicPrompts] = useState<SavedPrompt[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [promptsError, setPromptsError] = useState<string | null>(null);
  const [creatorStats, setCreatorStats] = useState<CreatorStats | null>(null);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [creatorXp, setCreatorXp] = useState<number | null>(null);
  const [creatorBadges, setCreatorBadges] = useState<EarnedBadge[]>([]);
  const [wallPosts, setWallPosts] = useState<WallPost[]>([]);
  const [loadingWall, setLoadingWall] = useState(false);
  const [lastSeenAt, setLastSeenAt] = useState<number | null>(null);

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
      setLoadingProfile(true);
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
      } finally {
        if (isActive) setLoadingProfile(false);
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
      setPromptsError(null);
      return () => { isActive = false; };
    }
    const loadPrompts = async () => {
      setLoadingPrompts(true);
      setPromptsError(null);
      try {
        const prompts = await listPublicPromptsByUser(effectiveCreatorId);
        if (isActive) setPublicPrompts(prompts);
      } catch (err: any) {
        if (isActive) setPromptsError(err?.message ?? 'Failed to load public prompts.');
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

  const profileStateItems = useMemo(() => ([
    {
      label: 'Bio',
      state: profile?.bio?.trim() ? 'complete' : 'missing',
      detail: profile?.bio?.trim() ? 'Creator added a public bio.' : 'No public bio yet.',
    },
    {
      label: 'Links',
      state: profile?.showLinksPublicly && profile?.links && Object.keys(profile.links).length > 0 ? 'complete' : 'hidden',
      detail: profile?.showLinksPublicly
        ? (profile?.links && Object.keys(profile.links).length > 0 ? 'Public links are visible.' : 'No public links yet.')
        : 'Links are hidden on this page.',
    },
    {
      label: 'Pools',
      state: profile?.showPublicPools ? (creatorSummary.uploads > 0 ? 'complete' : 'empty') : 'hidden',
      detail: profile?.showPublicPools
        ? (creatorSummary.uploads > 0 ? 'Public pools are visible.' : 'No public pools published yet.')
        : 'Pools are hidden on this page.',
    },
    {
      label: 'Prompts',
      state: profile?.showPublicPrompts ? (creatorSummary.promptCount > 0 ? 'complete' : 'empty') : 'hidden',
      detail: profile?.showPublicPrompts
        ? (creatorSummary.promptCount > 0 ? 'Public prompts are visible.' : 'No public prompts published yet.')
        : 'Prompts are hidden on this page.',
    },
  ]), [profile, creatorSummary]);

  const profileStateSummary = useMemo(() => {
    const visibleCount = profileStateItems.filter(item => item.state === 'complete').length;
    const hiddenCount = profileStateItems.filter(item => item.state === 'hidden').length;
    if (visibleCount === 0 && hiddenCount >= 2) return 'This creator is keeping most public profile sections private right now.';
    if (visibleCount === 0) return 'This creator has only partially set up their public profile so far.';
    if (visibleCount >= 3) return 'This creator has a strong public profile presence on MorpBase.';
    return 'This public creator page is partially filled out and still growing.';
  }, [profileStateItems]);

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
    <div className="public-creator-page">
      <div className="public-creator-hero">
        <div className="public-creator-hero-actions">
          <button type="button" className="public-creator-back" onClick={onBack}>
            Back
          </button>
          <button
            type="button"
            className="public-creator-share"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl)
                .then(() => setShareMessage('Creator link copied.'))
                .catch(() => setShareMessage('Could not copy creator link.'));
            }}
          >
            Copy Link
          </button>
          {onMessage && viewerAuthUid && creatorAuthUid && viewerAuthUid !== creatorAuthUid && (
            <button
              type="button"
              className="public-creator-message-btn"
              onClick={() => onMessage(creatorAuthUid, displayName)}
            >
              Send Message
            </button>
          )}
        </div>

        <div className="public-creator-hero-main">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt={displayName} className="public-creator-avatar" />
          ) : (
            <div className="public-creator-avatar public-creator-avatar-fallback">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="public-creator-identity">
            <div className="public-creator-eyebrow">Community Presence</div>
            <div className="public-creator-name-row">
              <h1>{displayName}</h1>
              {title && <TitleBadge title={title} size="md" />}
              <OnlineIndicator isOnline={isOnline} lastSeenAt={lastSeenAt} showLastSeen />
            </div>
            {creatorXp !== null && (
              <div className="public-creator-xp">{creatorXp.toLocaleString()} XP</div>
            )}
            {creatorBadges.length > 0 && (
              <div className="public-creator-badges">
                <BadgeStrip badges={creatorBadges} max={8} />
              </div>
            )}
            {profile?.bio ? (
              <p>{profile.bio}</p>
            ) : (
              <p className="public-creator-empty-copy">This creator has not added a public bio yet.</p>
            )}
            {profile?.showLinksPublicly && profile.links && (
              <div className="public-creator-links">
                {Object.entries(profile.links).map(([label, url]) => (
                  <a key={label} href={url} target="_blank" rel="noreferrer">{label}</a>
                ))}
              </div>
            )}
            {profile?.tags && profile.tags.length > 0 && (
              <div className="public-creator-tags">
                {profile.tags.map(tag => <span key={tag}>{tag}</span>)}
              </div>
            )}
          </div>
        </div>

        <div className="public-creator-stats">
          <div>
            <strong>{creatorSummary.uploads}</strong>
            <span>Public pools</span>
          </div>
          <div>
            <strong>{creatorSummary.promptCount}</strong>
            <span>Public prompts</span>
          </div>
          <div>
            <strong>{wallPosts.length > 0 ? wallPosts.length : creatorSummary.totalDownloads}</strong>
            <span>{wallPosts.length > 0 ? 'Wall posts' : 'Downloads'}</span>
          </div>
          <div>
            <strong>{creatorBadges.length}</strong>
            <span>Badges</span>
          </div>
        </div>

        {shareMessage && <div className="public-creator-share-message">{shareMessage}</div>}
      </div>

      {loadingProfile && <div className="public-creator-callout">Loading creator profile…</div>}
      {profileError && <div className="public-creator-callout public-creator-error">{profileError}</div>}

      <div className="public-creator-layout">

        {/* Wall Posts — shown when we have community data */}
        {creatorAuthUid && (
          <section className="public-creator-section">
            <div className="public-creator-section-head">
              <h2>Wall Posts</h2>
              <p>Prompts this creator has shared on the community wall.</p>
            </div>
            {loadingWall ? (
              <div className="public-creator-empty">Loading wall posts…</div>
            ) : wallPosts.length === 0 ? (
              <div className="public-creator-empty">No wall posts yet.</div>
            ) : (
              <div className="public-creator-wall-list">
                {wallPosts.slice(0, 8).map(post => (
                  <div key={post.id} className="public-creator-wall-card">
                    {post.caption && (
                      <div className="public-creator-wall-caption">{post.caption}</div>
                    )}
                    <p className="public-creator-wall-text">
                      {post.promptText.length > 220
                        ? post.promptText.slice(0, 220) + '…'
                        : post.promptText}
                    </p>
                    {post.identityTags.length > 0 && (
                      <div className="public-creator-wall-tags">
                        {post.identityTags.map(tag => (
                          <span key={tag.name} className={`public-creator-wall-tag public-creator-wall-tag--${tag.type}`}>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="public-creator-wall-meta">
                      <span>{formatDate(post.createdAt)}</span>
                      {post.likeCount > 0 && <span>{post.likeCount} {post.likeCount === 1 ? 'like' : 'likes'}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {creativeDna.totalPosts >= 2 && creativeDna.topTags.length > 0 && (
          <section className="public-creator-section">
            <div className="public-creator-section-head">
              <h2>Creative DNA</h2>
              <p>
                Identity patterns across {creativeDna.totalPosts} wall {creativeDna.totalPosts === 1 ? 'post' : 'posts'}
                {creativeDna.recentPosts > 0 && ` · ${creativeDna.recentPosts} this month`}
                {creativeDna.recentPosts > creativeDna.previousPosts && ' ↑'}
              </p>
            </div>
            <div className="public-creator-dna-grid">
              {creativeDna.topTags.map(tag => (
                <div key={`${tag.type}_${tag.name}`} className={`public-creator-dna-tag public-creator-dna-tag--${tag.type}`}>
                  <span className="public-creator-dna-type">{tag.type}</span>
                  <span className="public-creator-dna-name">{tag.name}</span>
                  <span className="public-creator-dna-count">{tag.count}×</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="public-creator-section public-creator-section-overview">
          <div className="public-creator-section-head">
            <h2>Community Presence</h2>
            <p>{profileStateSummary}</p>
          </div>
          <div className="public-creator-state-grid">
            {profileStateItems.map(item => (
              <div key={item.label} className={`public-creator-state-card state-${item.state}`}>
                <div className="public-creator-state-top">
                  <span className="public-creator-state-label">{item.label}</span>
                  <span className="public-creator-state-badge">
                    {item.state === 'complete' ? 'Visible' : item.state === 'hidden' ? 'Hidden' : 'Empty'}
                  </span>
                </div>
                <div className="public-creator-state-detail">{item.detail}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="public-creator-section">
          <div className="public-creator-section-head">
            <h2>Shared Pools</h2>
            <p>
              {effectiveCreatorId && profile && !profile.showPublicPools
                ? 'This creator keeps shared pools private on their community surface.'
                : 'Pools this creator has chosen to share through MorpBase.'}
            </p>
          </div>
          {visiblePools.length === 0 ? (
            <div className="public-creator-empty">
              {effectiveCreatorId && profile && !profile.showPublicPools
                ? 'No shared pools are visible.'
                : 'No shared pools yet.'}
            </div>
          ) : (
            <div className="public-creator-pool-grid">
              {visiblePools.map(entry => (
                <button
                  key={entry.id}
                  type="button"
                  className="public-creator-pool-card"
                  onClick={() => onOpenPool?.(entry.id)}
                >
                  <div className="public-creator-pool-card-head">
                    <span>{entry.category}</span>
                    <span>{entry.ratingAvg.toFixed(1)}</span>
                  </div>
                  <div className="public-creator-pool-title">{entry.title}</div>
                  <div className="public-creator-pool-summary">{entry.summary}</div>
                  <div className="public-creator-pool-meta">
                    <span>{entry.downloads} downloads</span>
                    <span>{entry.payload.items.length} items</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="public-creator-section">
          <div className="public-creator-section-head">
            <h2>Shared Prompts</h2>
            <p>
              {profile?.showPublicPrompts
                ? 'Prompt work this creator has chosen to share through MorpBase.'
                : 'This creator keeps prompt work private on their community surface.'}
            </p>
          </div>
          {!profile?.showPublicPrompts ? (
            <div className="public-creator-empty">No shared prompts are visible.</div>
          ) : loadingPrompts ? (
            <div className="public-creator-empty">Loading shared prompts…</div>
          ) : promptsError ? (
            <div className="public-creator-callout public-creator-error">{promptsError}</div>
          ) : publicPrompts.length === 0 ? (
            <div className="public-creator-empty">No shared prompts yet.</div>
          ) : (
            <div className="public-creator-prompt-list">
              {publicPrompts.map(prompt => (
                <div key={prompt.id} className="public-creator-prompt-card">
                  <div className="public-creator-prompt-title">{prompt.name}</div>
                  <div className="public-creator-prompt-text">{prompt.positive}</div>
                  {(prompt.model || prompt.purpose || prompt.tags?.length) && (
                    <div className="public-creator-prompt-meta">
                      {prompt.model && <span>Model: {prompt.model}</span>}
                      {prompt.purpose && <span>Purpose: {prompt.purpose}</span>}
                      {prompt.tags && prompt.tags.length > 0 && <span>{prompt.tags.join(', ')}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
