import { LanePlaceholder } from './LanePlaceholder';

type LaneWallItem = {
  id: string;
  name: string;
  subtitle?: string;
  tint: number;
  image?: string | null;
  /** optional per-item overrides (for mixed walls like Favorites) */
  accent?: string;
  badge?: string;
  lane?: string;
};

type LaneWallProps = {
  items: LaneWallItem[];
  /** rgb-triplet CSS var for this lane's accent, e.g. 'var(--la-scenery)' */
  accent: string;
  badge: string;
  /** lane key for the colorless placeholder symbol */
  lane: string;
  selectedIds: string[];
  favorites: string[];
  onAdd: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  /** optional — lanes without channels (e.g. Scenery) omit it; the card then adds on click */
  onOpenChannel?: (id: string) => void;
  emptyHint?: string;
};

/**
 * Generic image-wall for non-character lanes. Same card language as the
 * character wall (badge, favorite, add), minus the per-item stats/channel that
 * are Characters-specific. Used for Scenery and future lanes.
 */
export function LaneWall({
  items,
  accent,
  badge,
  lane,
  selectedIds,
  favorites,
  onAdd,
  onToggleFavorite,
  onOpenChannel,
  emptyHint,
}: LaneWallProps) {
  if (items.length === 0) {
    return <div className="v3-empty">{emptyHint ?? 'Nothing here yet.'}</div>;
  }

  return (
    <div className="v3-grid">
      {items.map(item => {
        const img = item.image || null;
        const inScene = selectedIds.includes(item.id);
        const fav = favorites.includes(item.id);
        const shotStyle = img ? { backgroundImage: `url(${img})` } : undefined;
        const acc = item.accent ?? accent;
        const bdg = item.badge ?? badge;
        const ln = item.lane ?? lane;
        const primary = () => (onOpenChannel ? onOpenChannel(item.id) : onAdd(item.id));
        return (
          <button
            key={item.id}
            type="button"
            className="v3-card"
            style={{ ['--c' as string]: acc }}
            onClick={primary}
          >
            <div className={`v3-shot${img ? '' : ' v3-ph'}`} style={shotStyle}>
              {!img && <LanePlaceholder lane={ln} />}
              <span className="v3-badge">{bdg}</span>
              <span
                className={`v3-fav${fav ? ' on' : ''}`}
                role="button"
                tabIndex={-1}
                title={fav ? 'Remove from favorites' : 'Save to favorites'}
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
              >{fav ? '★' : '☆'}</span>
              <div className="v3-acts">
                <span
                  className={`v3-act add${inScene ? ' in' : ''}`}
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => { e.stopPropagation(); onAdd(item.id); }}
                >{inScene ? 'In scene' : '＋ Add'}</span>
                {onOpenChannel && (
                  <span
                    className="v3-act chan"
                    role="button"
                    tabIndex={-1}
                    onClick={(e) => { e.stopPropagation(); onOpenChannel(item.id); }}
                  >Channel</span>
                )}
              </div>
            </div>
            <div className="v3-cmeta">
              <div>
                <div className="nm">{item.name}</div>
                {item.subtitle && <div className="st">{item.subtitle}</div>}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
