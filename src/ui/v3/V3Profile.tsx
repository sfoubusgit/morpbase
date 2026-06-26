import { useState } from 'react';
import type { CharacterIdentity } from '../../types/characters';
import { CharacterWall } from './CharacterWall';

type V3ProfileProps = {
  viewerName: string;
  viewerAvatarUrl?: string | null;
  /** local characters == this creator's own creations */
  characters: CharacterIdentity[];
  favorites: string[];
  scene: string[];
  onAdd: (id: string) => void;
  onOpenChannel: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  onLogin?: () => void;
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
  characters,
  favorites,
  scene,
  onAdd,
  onOpenChannel,
  onToggleFavorite,
  isLoggedIn = true,
  onLogout,
  onLogin,
}: V3ProfileProps) {
  const [tab, setTab] = useState<ProfileTab>('created');

  const created = characters; // local store = this user's own creations
  const favs = characters.filter(c => favorites.includes(c.id));
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
          <button type="button" className="v3-btn secondary">Edit profile</button>
          {isLoggedIn
            ? <button type="button" className="v3-btn utility" onClick={onLogout}>Log out</button>
            : <button type="button" className="v3-btn utility" onClick={onLogin}>Log in</button>}
        </div>
      </div>

      <div className="v3-metrics v3-prof-metrics">
        <div className="v3-metric"><div className="v">{created.length}</div><div className="k">Characters</div></div>
        <div className="v3-metric"><div className="v">{favs.length}</div><div className="k">Favorites</div></div>
        <div className="v3-metric"><div className="v">0</div><div className="k">Generated</div></div>
      </div>

      <div className="v3-tabs">
        <button type="button" className={`v3-tab2${tab === 'created' ? ' on' : ''}`} onClick={() => setTab('created')}>Created · {created.length}</button>
        <button type="button" className={`v3-tab2${tab === 'favorites' ? ' on' : ''}`} onClick={() => setTab('favorites')}>Favorites · {favs.length}</button>
        <button type="button" className={`v3-tab2${tab === 'generated' ? ' on' : ''}`} onClick={() => setTab('generated')}>Generated</button>
      </div>

      {tab === 'generated' ? (
        <div className="v3-empty">Your generated images will appear here once you render and save them.</div>
      ) : (
        <CharacterWall
          characters={tab === 'created' ? created : favs}
          selectedIds={scene}
          favorites={favorites}
          onAdd={onAdd}
          onOpenChannel={onOpenChannel}
          onToggleFavorite={onToggleFavorite}
          emptyHint={tab === 'created'
            ? 'You haven’t created any characters yet.'
            : 'No favorites yet. Tap the ☆ on any thumbnail to save it here.'}
        />
      )}
    </div>
  );
}
