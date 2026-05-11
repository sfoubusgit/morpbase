import { BADGE_REGISTRY } from '../../../data/communityBadges';
import type { EarnedBadge } from '../../../types/community';
import './BadgeStrip.css';

type BadgeStripProps = {
  badges: EarnedBadge[];
  max?: number;
};

export function BadgeStrip({ badges, max = 5 }: BadgeStripProps) {
  if (badges.length === 0) return null;

  const visible = badges.slice(0, max);
  const overflow = badges.length - visible.length;

  return (
    <div className="badge-strip">
      {visible.map(({ badgeId }) => {
        const def = BADGE_REGISTRY[badgeId];
        if (!def) return null;
        return (
          <span
            key={badgeId}
            className={`badge-chip badge-chip--${def.rarity}`}
            title={`${def.label}: ${def.description}`}
          >
            {def.icon}
          </span>
        );
      })}
      {overflow > 0 && (
        <span className="badge-chip badge-chip--overflow">+{overflow}</span>
      )}
    </div>
  );
}
