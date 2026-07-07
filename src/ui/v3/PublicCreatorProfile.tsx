import { useEffect, useMemo, useState } from 'react';
import type { CharacterIdentity } from '../../types/characters';
import type { RemoteLaneItem } from './laneItemsStore';
import { CharacterWall } from './CharacterWall';
import { LaneWall } from './LaneWall';
import { FollowButton } from './FollowButton';
import { listFollowing } from './followStore';
import { listFeedPosts, type FeedPost } from './channelImagesStore';
import { PostCard } from './PostCard';
import { getPublicProfileByAuthUid } from '../../engine/profileStore';
import type { PublicProfile } from '../../types';
import { useOnlineAuthUids } from '../hooks/useOnlineAuthUids';
import { OnlineDot } from './OnlineDot';

// keep in step with V3Profile's typed tabs
const LANE_INFO: Record<string, { label: string; accent: string; badge: string }> = {
  actions:     { label: 'Actions',     accent: 'var(--la-mood)',        badge: 'Action' },
  style:       { label: 'Style',       accent: 'var(--la-lighting)',    badge: 'Style' },
  scenery:     { label: 'Scenery',     accent: 'var(--la-scenery)',     badge: 'Scenery' },
  objects:     { label: 'Objects',     accent: 'var(--la-objects)',     badge: 'Object' },
  environment: { label: 'Environment', accent: 'var(--la-environment)', badge: 'Environment' },
  mood:        { label: 'Mood',        accent: 'var(--la-mood)',        badge: 'Mood' },
  lighting:    { label: 'Lighting',    accent: 'var(--la-lighting)',    badge: 'Lighting' },
  composition: { label: 'Composition', accent: 'var(--la-composition)', badge: 'Composition' },
};
const LANE_ORDER = ['actions', 'style', 'scenery', 'objects', 'environment', 'mood', 'lighting', 'composition'];
const tintOf = (id: string) => { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0; return Math.abs(h) % 6; };

type PublicCreatorProfileProps = {
  authUid: string;
  /** fallback name until the public profile loads */
  name: string;
  viewerAuthUid?: string | null;
  /** this creator's public characters */
  characters: CharacterIdentity[];
  /** this creator's public non-character lane objects */
  items: RemoteLaneItem[];
  scene: string[];
  favorites: string[];
  onBack: () => void;
  onAdd: (id: string) => void;
  onOpenChannel: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onMessage: (authUid: string, name: string) => void;
  onLogin?: () => void;
};

/**
 * The public profile of ANOTHER creator — the one and only place you follow or
 * message someone. Read-only: their characters + lane objects, follower counts,
 * online status, and the two social actions (Follow, Message). Mirrors the
 * visual language of your own V3Profile.
 */
export function PublicCreatorProfile({
  authUid,
  name,
  viewerAuthUid,
  characters,
  items,
  scene,
  favorites,
  onBack,
  onAdd,
  onOpenChannel,
  onToggleFavorite,
  onMessage,
  onLogin,
}: PublicCreatorProfileProps) {
  const [tab, setTab] = useState<string>('characters');
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [following, setFollowing] = useState(0);
  const [posts, setPosts] = useState<FeedPost[]>([]);

  useEffect(() => {
    let live = true;
    setProfile(null); setPosts([]);
    getPublicProfileByAuthUid(authUid).then(p => { if (live) setProfile(p); }).catch(() => { /* offline */ });
    listFollowing(authUid).then(ids => { if (live) setFollowing(ids.length); }).catch(() => { /* offline */ });
    listFeedPosts([authUid]).then(v => { if (live) setPosts(v); }).catch(() => { /* offline */ });
    return () => { live = false; };
  }, [authUid]);

  const displayName = profile?.displayName?.trim() || name;
  const handle = displayName.toLowerCase().replace(/\s+/g, '');
  const avatarUrl = profile?.avatarUrl ?? null;
  const coverUrl = profile?.coverImageUrl ?? null;
  const onlineUids = useOnlineAuthUids();
  const isOnline = onlineUids.has(authUid);
  const isSelf = Boolean(viewerAuthUid && viewerAuthUid === authUid);

  const byLane = useMemo(() => {
    const m: Record<string, RemoteLaneItem[]> = {};
    for (const it of items) (m[it.lane] ||= []).push(it);
    return m;
  }, [items]);
  const laneTabs = LANE_ORDER.filter(l => byLane[l]?.length);

  // Resolve a credited subject id → name for post tags (this creator's items).
  const nameOf = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of characters) m.set(c.id, c.name);
    for (const it of items) m.set(it.id, it.name);
    return (id: string) => m.get(id);
  }, [characters, items]);

  return (
    <div className="v3-prof">
      <div className="v3-prof-cover" style={coverUrl ? { backgroundImage: `url(${coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
        <button type="button" className="v3-chan-back v3-prof-back" onClick={onBack}>← Back</button>
      </div>
      <div className="v3-prof-head">
        <div className="v3-prof-avwrap">
          {avatarUrl
            ? <img className="v3-prof-av img" src={avatarUrl} alt={displayName} />
            : <span className="v3-prof-av">{displayName[0]?.toUpperCase() ?? '?'}</span>}
          <OnlineDot online={isOnline} className="av-dot" />
        </div>
        <div className="v3-prof-id">
          <div className="v3-eyebrow">Creator</div>
          <h2>{displayName}</h2>
          <div className="v3-prof-handle">@{handle}</div>
          <div className="v3-prof-social">
            <OnlineDot online={isOnline} label /> · <b>{following}</b> following
          </div>
          {profile?.bio && <div className="v3-prof-bio">{profile.bio}</div>}
        </div>
        <div className="v3-prof-actions">
          {!isSelf && (
            <>
              <FollowButton creatorAuthUid={authUid} viewerAuthUid={viewerAuthUid} showCount onRequireLogin={onLogin} />
              <button
                type="button"
                className="v3-btn primary"
                onClick={() => (viewerAuthUid ? onMessage(authUid, displayName) : onLogin?.())}
                title={viewerAuthUid ? `Message ${displayName}` : 'Log in to message'}
              >
                ✉ Message
              </button>
            </>
          )}
        </div>
      </div>

      <div className="v3-metrics v3-prof-metrics">
        <div className="v3-metric"><div className="v">{characters.length}</div><div className="k">Characters</div></div>
        <div className="v3-metric"><div className="v">{items.length}</div><div className="k">Objects</div></div>
      </div>

      <div className="v3-tabs">
        <button type="button" className={`v3-tab2${tab === 'posts' ? ' on' : ''}`} onClick={() => setTab('posts')}>Posts{posts.length > 0 ? ` · ${posts.length}` : ''}</button>
        <button type="button" className={`v3-tab2${tab === 'characters' ? ' on' : ''}`} onClick={() => setTab('characters')}>Characters · {characters.length}</button>
        {laneTabs.map(l => (
          <button type="button" key={l} className={`v3-tab2${tab === l ? ' on' : ''}`} onClick={() => setTab(l)}>{LANE_INFO[l].label} · {byLane[l].length}</button>
        ))}
      </div>

      {tab === 'posts' ? (
        posts.length === 0 ? (
          <div className="v3-empty">@{handle} hasn’t posted anything yet.</div>
        ) : (
          <div className="v3-feed">
            {posts.map(p => (
              <PostCard key={p.postId} post={p} nameOf={nameOf} onOpenSubject={onOpenChannel} />
            ))}
          </div>
        )
      ) : tab === 'characters' ? (
        <CharacterWall
          characters={characters}
          selectedIds={scene}
          favorites={favorites}
          onAdd={onAdd}
          onOpenChannel={onOpenChannel}
          onToggleFavorite={onToggleFavorite}
          emptyHint={`@${handle} hasn’t shared any characters yet.`}
        />
      ) : (
        <LaneWall
          items={(byLane[tab] ?? []).map(it => ({ id: it.id, name: it.name, subtitle: it.summary, tint: tintOf(it.id), image: it.coverUrl }))}
          accent={LANE_INFO[tab]?.accent ?? 'var(--la-character)'}
          badge={LANE_INFO[tab]?.badge ?? 'Item'}
          lane={tab}
          selectedIds={scene}
          favorites={favorites}
          onAdd={onAdd}
          onOpen={onOpenChannel}
          onToggleFavorite={onToggleFavorite}
          emptyHint={`No ${LANE_INFO[tab]?.label.toLowerCase() ?? 'items'} yet.`}
        />
      )}
    </div>
  );
}
