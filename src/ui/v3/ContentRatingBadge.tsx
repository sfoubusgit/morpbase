import type { ContentRating } from './contentRating';

/**
 * Small always-visible rating chip (CivitAI-style). Makes the SFW gate
 * transparent: content is badged, never silently hidden. "SFW" is muted;
 * "18+" is amber and means it's kept out of public lanes until the age-gated
 * section opens.
 */
export function ContentRatingBadge({ rating, title }: { rating: ContentRating; title?: string }) {
  const adult = rating === 'nsfw';
  return (
    <span
      className={`v3-rating-badge${adult ? ' adult' : ''}`}
      title={title ?? (adult ? 'Adult — hidden from public lanes until the 18+ section opens' : 'Safe for work — visible everywhere')}
    >
      {adult ? '18+' : 'SFW'}
    </span>
  );
}
