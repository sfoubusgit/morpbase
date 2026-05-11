import type { UserTitle } from '../../../types/community';
import './TitleBadge.css';

type TitleBadgeProps = {
  title: UserTitle | null;
  size?: 'sm' | 'md';
};

export function TitleBadge({ title, size = 'sm' }: TitleBadgeProps) {
  if (!title) return null;
  return (
    <span className={`title-badge title-badge--${size} title-badge--${title.slug}`}>
      {title.label}
    </span>
  );
}
