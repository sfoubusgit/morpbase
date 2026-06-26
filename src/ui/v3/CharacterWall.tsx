import type { CharacterIdentity } from '../../types/characters';
import { channelStore } from './channelStore';
import { LanePlaceholder } from './LanePlaceholder';
import { characterImage, compact } from './media';

type CharacterWallProps = {
  characters: CharacterIdentity[];
  selectedIds: string[];
  favorites: string[];
  onAdd: (id: string) => void;
  onOpenChannel: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  emptyHint?: string;
};

/**
 * The Characters lane rendered as an image wall. Each card is either added to
 * the scene (＋) or opened to its origin Channel (↗). Reads real characters
 * from characterStore via props; stats come from the local channel seam.
 */
export function CharacterWall({
  characters,
  selectedIds,
  favorites,
  onAdd,
  onOpenChannel,
  onToggleFavorite,
  emptyHint,
}: CharacterWallProps) {
  if (characters.length === 0) {
    return (
      <div className="v3-empty">
        {emptyHint ?? 'Nothing here yet.'}
      </div>
    );
  }

  return (
    <div className="v3-grid">
      {characters.map(c => {
        const img = characterImage(c);
        const stats = channelStore.getChannel(c.id).stats;
        const inScene = selectedIds.includes(c.id);
        const fav = favorites.includes(c.id);
        const shotStyle = img ? { backgroundImage: `url(${img})` } : undefined;
        return (
          <button
            key={c.id}
            type="button"
            className="v3-card"
            style={{ ['--c' as string]: 'var(--la-character)' }}
            onClick={() => onOpenChannel(c.id)}
          >
            <div className={`v3-shot${img ? '' : ' v3-ph'}`} style={shotStyle}>
              {!img && <LanePlaceholder lane="character" />}
              <span className="v3-badge">Character</span>
              <span
                className={`v3-fav${fav ? ' on' : ''}`}
                role="button"
                tabIndex={-1}
                title={fav ? 'Remove from favorites' : 'Save to favorites'}
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(c.id); }}
              >{fav ? '★' : '☆'}</span>
              <span className="v3-who"><span className="a" />{c.tags?.[0] ?? 'community'}</span>
              <div className="v3-acts">
                <span
                  className={`v3-act add${inScene ? ' in' : ''}`}
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => { e.stopPropagation(); onAdd(c.id); }}
                >
                  {inScene ? 'In scene' : '＋ Add'}
                </span>
              </div>
            </div>
            <div className="v3-cmeta">
              <div>
                <div className="nm">{c.name}</div>
                <div className="st">{compact(stats.scenesMade)} scenes</div>
              </div>
              <div className="heart">♥ {compact(stats.likes)}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
