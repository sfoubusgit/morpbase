import { useEffect, useMemo, useState } from 'react';
import type { CharacterIdentity } from '../../types/characters';
import { CharacterWall } from './CharacterWall';
import { LaneWall } from './LaneWall';
import { listMyGeneratedImages, type RemoteImage } from './channelImagesStore';
import type { RemoteLaneItem } from './laneItemsStore';

/** Favorites span every lane, so the profile renders them with the generic wall. */
export type ProfileFavItem = { id: string; name: string; tint: number; image?: string | null; accent?: string; badge?: string; lane?: string };

type V3ProfileProps = {
  viewerName: string;
  viewerAvatarUrl?: string | null;
  viewerAuthUid?: string | null;
  /** this viewer's own creations (Supabase-authored + legacy local) */
  createdCharacters: CharacterIdentity[];
  /** this viewer's own non-character lane objects (scenery, actions, …) */
  createdItems: RemoteLaneItem[];
  /** favorited items across every lane, ready for the generic wall */
  favItems: ProfileFavItem[];
  favorites: string[];
  scene: string[];
  onAdd: (id: string) => void;
  onOpenChannel: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onLogin?: () => void;
  onEditProfile?: () => void;
};

// Per-lane display info for the typed tabs (keyed by the stored lane value).
const LANE_INFO: Record<string, { label: string; accent: string; badge: string }> = {
  actions:     { label: 'Actions',     accent: 'var(--la-mood)',        badge: 'Action' },
  scenery:     { label: 'Scenery',     accent: 'var(--la-scenery)',     badge: 'Scenery' },
  objects:     { label: 'Objects',     accent: 'var(--la-objects)',     badge: 'Object' },
  environment: { label: 'Environment', accent: 'var(--la-environment)', badge: 'Environment' },
  mood:        { label: 'Mood',        accent: 'var(--la-mood)',        badge: 'Mood' },
  lighting:    { label: 'Lighting',    accent: 'var(--la-lighting)',    badge: 'Lighting' },
  composition: { label: 'Composition', accent: 'var(--la-composition)', badge: 'Composition' },
};
const LANE_ORDER = ['actions', 'scenery', 'objects', 'environment', 'mood', 'lighting', 'composition'];
const tintOf = (id: string) => { let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0; return Math.abs(h) % 6; };

/**
 * V3-native creator profile — CivitAI-style: cover + avatar header, stats, and
 * tabs that reuse the image wall (Created / Favorites / Generated). Replaces the
 * legacy MyProfilePage inside the v3 workspace so the surface stays consistent.
 */
export function V3Profile({
  viewerName,
  viewerAvatarUrl,
  viewerAuthUid,
  createdCharacters,
  createdItems,
  favItems,
  favorites,
  scene,
  onAdd,
  onOpenChannel,
  onToggleFavorite,
  isLoggedIn = true,
  onLogin,
  onEditProfile,
}: V3ProfileProps) {
  const [tab, setTab] = useState<string>('characters');
  const [generated, setGenerated] = useState<RemoteImage[]>([]);

  // Pull the real images this user has generated + saved to channels.
  useEffect(() => {
    if (!viewerAuthUid) { setGenerated([]); return; }
    let live = true;
    listMyGeneratedImages(viewerAuthUid).then(v => { if (live) setGenerated(v); }).catch(() => { /* offline */ });
    return () => { live = false; };
  }, [viewerAuthUid]);

  const created = createdCharacters;
  const handle = viewerName.toLowerCase().replace(/\s+/g, '');

  // Group the viewer's lane objects by type → one tab per type they actually use.
  const byLane = useMemo(() => {
    const m: Record<string, RemoteLaneItem[]> = {};
    for (const it of createdItems) (m[it.lane] ||= []).push(it);
    return m;
  }, [createdItems]);
  const laneTabs = LANE_ORDER.filter(l => byLane[l]?.length);

  return (
    <div className="v3-prof">
      <div className="v3-prof-cover" />
      <div className="v3-prof-head">
        {viewerAvatarUrl
          ? <img className="v3-prof-av img" src={viewerAvatarUrl} alt={viewerName} />
          : <span className="v3-prof-av">{viewerName[0]?.toUpperCase() ?? '?'}</span>}
        <div className="v3-prof-id">
          <div className="v3-eyebrow">Creator</div>
          <h2>{viewerName}</h2>
          <div className="v3-prof-handle">@{handle}</div>
        </div>
        <div className="v3-prof-actions">
          {isLoggedIn
            ? <button type="button" className="v3-btn secondary" onClick={onEditProfile}>Edit profile</button>
            : <button type="button" className="v3-btn primary" onClick={onLogin}>Log in</button>}
        </div>
      </div>

      <div className="v3-metrics v3-prof-metrics">
        <div className="v3-metric"><div className="v">{created.length}</div><div className="k">Characters</div></div>
        <div className="v3-metric"><div className="v">{createdItems.length}</div><div className="k">Objects</div></div>
        <div className="v3-metric"><div className="v">{favItems.length}</div><div className="k">Favorites</div></div>
        <div className="v3-metric"><div className="v">{generated.length}</div><div className="k">Generated</div></div>
      </div>

      <div className="v3-tabs">
        <button type="button" className={`v3-tab2${tab === 'characters' ? ' on' : ''}`} onClick={() => setTab('characters')}>Characters · {created.length}</button>
        {laneTabs.map(l => (
          <button type="button" key={l} className={`v3-tab2${tab === l ? ' on' : ''}`} onClick={() => setTab(l)}>{LANE_INFO[l].label} · {byLane[l].length}</button>
        ))}
        <button type="button" className={`v3-tab2${tab === 'favorites' ? ' on' : ''}`} onClick={() => setTab('favorites')}>Favorites · {favItems.length}</button>
        <button type="button" className={`v3-tab2${tab === 'generated' ? ' on' : ''}`} onClick={() => setTab('generated')}>Generated{generated.length > 0 ? ` · ${generated.length}` : ''}</button>
      </div>

      {tab === 'generated' ? (
        generated.length === 0 ? (
          <div className="v3-empty">
            {viewerAuthUid
              ? 'Your generated images will appear here once you render and save them to a channel.'
              : 'Log in to see the images you’ve generated.'}
          </div>
        ) : (
          <div className="v3-gal">
            {generated.map(g => (
              <div key={g.id} className="g" style={{ backgroundImage: `url(${g.url})` }}><small>@{g.author}</small></div>
            ))}
          </div>
        )
      ) : tab === 'favorites' ? (
        <LaneWall
          items={favItems}
          accent="var(--la-character)"
          badge="Item"
          lane="character"
          selectedIds={scene}
          favorites={favorites}
          onAdd={onAdd}
          onOpen={onOpenChannel}
          onToggleFavorite={onToggleFavorite}
          emptyHint="No favorites yet. Tap the ☆ on any thumbnail to save it here."
        />
      ) : tab === 'characters' ? (
        <CharacterWall
          characters={created}
          selectedIds={scene}
          favorites={favorites}
          onAdd={onAdd}
          onOpenChannel={onOpenChannel}
          onToggleFavorite={onToggleFavorite}
          emptyHint="You haven’t created any characters yet."
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
