import { useEffect, useState } from 'react';
import type { CharacterIdentity } from '../../types/characters';
import { CharacterWall } from './CharacterWall';
import { LaneWall } from './LaneWall';
import { listMyGeneratedImages, type RemoteImage } from './channelImagesStore';

/** Favorites span every lane, so the profile renders them with the generic wall. */
export type ProfileFavItem = { id: string; name: string; tint: number; image?: string | null; accent?: string; badge?: string; lane?: string };

type V3ProfileProps = {
  viewerName: string;
  viewerAvatarUrl?: string | null;
  viewerAuthUid?: string | null;
  /** this viewer's own creations (Supabase-authored + legacy local) */
  createdCharacters: CharacterIdentity[];
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


type ProfileTab = 'created' | 'favorites' | 'generated';

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
  const [tab, setTab] = useState<ProfileTab>('created');
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
        <div className="v3-metric"><div className="v">{favItems.length}</div><div className="k">Favorites</div></div>
        <div className="v3-metric"><div className="v">{generated.length}</div><div className="k">Generated</div></div>
      </div>

      <div className="v3-tabs">
        <button type="button" className={`v3-tab2${tab === 'created' ? ' on' : ''}`} onClick={() => setTab('created')}>Created · {created.length}</button>
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
      ) : (
        <CharacterWall
          characters={created}
          selectedIds={scene}
          favorites={favorites}
          onAdd={onAdd}
          onOpenChannel={onOpenChannel}
          onToggleFavorite={onToggleFavorite}
          emptyHint="You haven’t created any characters yet."
        />
      )}
    </div>
  );
}
