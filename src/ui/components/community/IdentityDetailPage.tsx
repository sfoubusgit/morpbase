import type { CommunitySharedIdentity } from '../../../engine/communityStore';
import type { WallPostIdentityTag } from '../../../types/community';
import './IdentityDetailPage.css';

const TYPE_COLORS: Record<string, string> = {
  character:   '#c4b5fd',
  style:       '#93c5fd',
  lighting:    '#fcd34d',
  environment: '#6ee7b7',
  wardrobe:    '#fda4af',
  composition: '#67e8f9',
  mood:        '#a5b4fc',
  negative:    '#fca5a5',
  aura:        '#fdba74',
  object:      '#fde68a',
};

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

type IdentityDetailPageProps = {
  identity: CommunitySharedIdentity;
  authUid: string | null;
  userId: string | null;
  userName: string | null;
  activeIdentityTags: WallPostIdentityTag[];
  onBack: () => void;
  onViewAuthor?: (authUid: string, name: string) => void;
  onAddIdentity?: (identity: CommunitySharedIdentity) => void;
};

export function IdentityDetailPage({
  identity,
  activeIdentityTags,
  onBack,
  onViewAuthor,
  onAddIdentity,
}: IdentityDetailPageProps) {
  const color = TYPE_COLORS[identity.type] ?? '#a78bfa';
  const alreadyAdded = activeIdentityTags.some(
    t => t.name === identity.name && t.type === identity.type,
  );

  return (
    <div className="identity-detail-page">
      <div className="identity-detail-inner">
        <button type="button" className="identity-detail-back" onClick={onBack}>
          ← Back
        </button>

        <div className="identity-detail-hero">
          <span className="identity-detail-dot" style={{ background: color }} />
          <div className="identity-detail-hero-text">
            <h1 className="identity-detail-name">{identity.name}</h1>
            <span className="identity-detail-type-badge" style={{ color, borderColor: `${color}44`, background: `${color}14` }}>
              {identity.type}
            </span>
          </div>
        </div>

        {identity.summary && (
          <p className="identity-detail-summary">{identity.summary}</p>
        )}

        {identity.phrases.length > 0 && (
          <div className="identity-detail-section">
            <div className="identity-detail-section-label">Phrases</div>
            <div className="identity-detail-phrases">
              {identity.phrases.map((phrase, i) => (
                <span key={i} className="identity-detail-phrase">{phrase}</span>
              ))}
            </div>
          </div>
        )}

        <div className="identity-detail-meta">
          <div className="identity-detail-meta-row">
            <span className="identity-detail-meta-label">By</span>
            {identity.authorId && onViewAuthor ? (
              <button
                type="button"
                className="identity-detail-author-btn"
                onClick={() => onViewAuthor(identity.authorId!, identity.authorName)}
              >
                {identity.authorName}
              </button>
            ) : (
              <span className="identity-detail-meta-value">{identity.authorName}</span>
            )}
          </div>
          <div className="identity-detail-meta-row">
            <span className="identity-detail-meta-label">Shared</span>
            <span className="identity-detail-meta-value">{formatDate(identity.createdAt)}</span>
          </div>
          {identity.remixCount > 0 && (
            <div className="identity-detail-meta-row">
              <span className="identity-detail-meta-label">Remixes</span>
              <span className="identity-detail-meta-value">{identity.remixCount}</span>
            </div>
          )}
          {identity.parentId && (
            <div className="identity-detail-meta-row">
              <span className="identity-detail-meta-label">Origin</span>
              <span className="identity-detail-meta-value identity-detail-meta-remix">Remixed identity</span>
            </div>
          )}
        </div>

        {onAddIdentity && (
          alreadyAdded ? (
            <div className="identity-detail-added">
              ✓ In your {identity.type}
            </div>
          ) : (
            <button
              type="button"
              className="identity-detail-add-btn"
              onClick={() => onAddIdentity(identity)}
            >
              Add to my {identity.type}
            </button>
          )
        )}
      </div>
    </div>
  );
}
