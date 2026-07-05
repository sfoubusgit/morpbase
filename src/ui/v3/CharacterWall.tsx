import type { CharacterIdentity } from '../../types/characters';
import { channelStore } from './channelStore';
import { LanePlaceholder } from './LanePlaceholder';
import { AdCard } from './AdCard';
import type { AdItem } from './adsStore';
import { characterImage, compact } from './media';

type CharacterWallProps = {
  characters: CharacterIdentity[];
  selectedIds: string[];
  favorites: string[];
  onAdd: (id: string) => void;
  onOpenChannel: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  ads?: AdItem[];
  adEvery?: number;
  /** ids to mark with an "18+" overlay (the owner's own adult content) */
  adultIds?: string[];
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
  ads,
  adEvery = 12,
  adultIds,
  emptyHint,
}: CharacterWallProps) {
  if (characters.length === 0) {
    return (
      <div className="v3-empty">
        {emptyHint ?? 'Nothing here yet.'}
      </div>
    );
  }

  const slots: Array<{ ad: AdItem; key: string } | { c: CharacterIdentity }> = [];
  let adIdx = 0;
  characters.forEach((c, i) => {
    slots.push({ c });
    if (ads && ads.length > 0 && (i + 1) % adEvery === 0) {
      slots.push({ ad: ads[adIdx % ads.length], key: `ad-${i}` });
      adIdx++;
    }
  });

  return (
    <div className="v3-grid">
      {slots.map(slot => {
        if ('ad' in slot) return <AdCard key={slot.key} ad={slot.ad} />;
        const c = slot.c;
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
              {adultIds?.includes(c.id) && <span className="v3-shot-adult" title="Adult — hidden from public lanes until the 18+ section opens">18+</span>}
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
                <div className="st">{stats.scenesMade > 0 ? `${compact(stats.scenesMade)} scene${stats.scenesMade === 1 ? '' : 's'} made` : 'New character'}</div>
              </div>
              {stats.likes > 0 && <div className="heart">♥ {compact(stats.likes)}</div>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
