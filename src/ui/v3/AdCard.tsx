import type { AdItem } from './adsStore';

/**
 * A native, in-grid sponsored card. Matches the lane card's silhouette so the
 * wall keeps its rhythm, but is clearly labelled "Sponsored" and opens the
 * advertiser's link in a new tab.
 */
export function AdCard({ ad }: { ad: AdItem }) {
  return (
    <a
      className="v3-card v3-ad"
      href={ad.linkUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
    >
      <div className="v3-shot" style={{ backgroundImage: `url(${ad.imageUrl})` }}>
        <span className="v3-ad-tag">Sponsored</span>
      </div>
      <div className="v3-cmeta">
        <div>
          <div className="nm">{ad.headline || ad.label}</div>
          <div className="st">{ad.headline ? ad.label : 'Ad'}</div>
        </div>
      </div>
    </a>
  );
}
