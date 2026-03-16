import { useEffect, useMemo, useState } from 'react';
import type { PoolHubEntry, PublicProfile, SavedPrompt } from '../../types';
import { getPublicProfileByUserId } from '../../engine/profileStore';
import { listPublicPromptsByUser } from '../../engine/promptStore';
import { listHubEntriesByCreator } from '../../engine/poolHubStore';
import './PublicCreatorPage.css';

type PublicCreatorPageProps = {
  creatorId?: string | null;
  creatorName?: string | null;
  onBack?: () => void;
  onOpenPool?: (entryId: string) => void;
};

export function PublicCreatorPage({
  creatorId,
  creatorName,
  onBack,
  onOpenPool,
}: PublicCreatorPageProps) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [publicPrompts, setPublicPrompts] = useState<SavedPrompt[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [promptsError, setPromptsError] = useState<string | null>(null);

  const publicPools = useMemo(
    () => listHubEntriesByCreator({ creatorId, creatorName }),
    [creatorId, creatorName]
  );

  useEffect(() => {
    let isActive = true;
    if (!creatorId) {
      setProfile(null);
      setProfileError(null);
      return () => {
        isActive = false;
      };
    }

    const loadProfile = async () => {
      setLoadingProfile(true);
      setProfileError(null);
      try {
        const nextProfile = await getPublicProfileByUserId(creatorId);
        if (isActive) {
          setProfile(nextProfile);
        }
      } catch (err: any) {
        if (isActive) {
          setProfileError(err?.message ?? 'Failed to load creator profile.');
        }
      } finally {
        if (isActive) {
          setLoadingProfile(false);
        }
      }
    };

    void loadProfile();
    return () => {
      isActive = false;
    };
  }, [creatorId]);

  useEffect(() => {
    let isActive = true;
    if (!creatorId || !profile?.showPublicPrompts) {
      setPublicPrompts([]);
      setPromptsError(null);
      return () => {
        isActive = false;
      };
    }

    const loadPrompts = async () => {
      setLoadingPrompts(true);
      setPromptsError(null);
      try {
        const prompts = await listPublicPromptsByUser(creatorId);
        if (isActive) {
          setPublicPrompts(prompts);
        }
      } catch (err: any) {
        if (isActive) {
          setPromptsError(err?.message ?? 'Failed to load public prompts.');
        }
      } finally {
        if (isActive) {
          setLoadingPrompts(false);
        }
      }
    };

    void loadPrompts();
    return () => {
      isActive = false;
    };
  }, [creatorId, profile?.showPublicPrompts]);

  const displayName = profile?.displayName ?? creatorName ?? 'Creator';
  const visiblePools =
    creatorId && profile
      ? (profile.showPublicPools ? publicPools : [])
      : publicPools;
  const totalDownloads = visiblePools.reduce((sum, entry) => sum + entry.downloads, 0);
  const averageRating = visiblePools.length === 0
    ? 0
    : visiblePools.reduce((sum, entry) => sum + entry.ratingAvg, 0) / visiblePools.length;

  return (
    <div className="public-creator-page">
      <div className="public-creator-hero">
        <button type="button" className="public-creator-back" onClick={onBack}>
          Back
        </button>
        <div className="public-creator-hero-main">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt={displayName} className="public-creator-avatar" />
          ) : (
            <div className="public-creator-avatar public-creator-avatar-fallback">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="public-creator-identity">
            <div className="public-creator-eyebrow">Public Creator Page</div>
            <h1>{displayName}</h1>
            {profile?.bio ? (
              <p>{profile.bio}</p>
            ) : (
              <p className="public-creator-empty-copy">This creator has not added a public bio yet.</p>
            )}
            {profile?.showLinksPublicly && profile.links && (
              <div className="public-creator-links">
                {Object.entries(profile.links).map(([label, url]) => (
                  <a key={label} href={url} target="_blank" rel="noreferrer">
                    {label}
                  </a>
                ))}
              </div>
            )}
            {profile?.tags && profile.tags.length > 0 && (
              <div className="public-creator-tags">
                {profile.tags.map(tag => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="public-creator-stats">
          <div>
            <strong>{visiblePools.length}</strong>
            <span>Public pools</span>
          </div>
          <div>
            <strong>{publicPrompts.length}</strong>
            <span>Public prompts</span>
          </div>
          <div>
            <strong>{totalDownloads}</strong>
            <span>Downloads</span>
          </div>
          <div>
            <strong>{averageRating.toFixed(1)}</strong>
            <span>Avg rating</span>
          </div>
        </div>
      </div>

      {loadingProfile && <div className="public-creator-callout">Loading creator profile...</div>}
      {profileError && <div className="public-creator-callout public-creator-error">{profileError}</div>}

      <div className="public-creator-layout">
        <section className="public-creator-section">
          <div className="public-creator-section-head">
            <h2>Public Pools</h2>
            <p>
              {creatorId && profile && !profile.showPublicPools
                ? 'This creator keeps shared pools private on their public page.'
                : 'Pools this creator has made publicly visible through MorpBase.'}
            </p>
          </div>
          {visiblePools.length === 0 ? (
            <div className="public-creator-empty">
              {creatorId && profile && !profile.showPublicPools
                ? 'No public pools are visible.'
                : 'No public pools yet.'}
            </div>
          ) : (
            <div className="public-creator-pool-grid">
              {visiblePools.map(entry => (
                <button
                  key={entry.id}
                  type="button"
                  className="public-creator-pool-card"
                  onClick={() => onOpenPool?.(entry.id)}
                >
                  <div className="public-creator-pool-card-head">
                    <span>{entry.category}</span>
                    <span>{entry.ratingAvg.toFixed(1)}</span>
                  </div>
                  <div className="public-creator-pool-title">{entry.title}</div>
                  <div className="public-creator-pool-summary">{entry.summary}</div>
                  <div className="public-creator-pool-meta">
                    <span>{entry.downloads} downloads</span>
                    <span>{entry.payload.items.length} items</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="public-creator-section">
          <div className="public-creator-section-head">
            <h2>Public Prompts</h2>
            <p>
              {profile?.showPublicPrompts
                ? 'Prompt work this creator has chosen to expose publicly.'
                : 'This creator keeps prompts private on their public page.'}
            </p>
          </div>
          {!profile?.showPublicPrompts ? (
            <div className="public-creator-empty">No public prompts are visible.</div>
          ) : loadingPrompts ? (
            <div className="public-creator-empty">Loading public prompts...</div>
          ) : promptsError ? (
            <div className="public-creator-callout public-creator-error">{promptsError}</div>
          ) : publicPrompts.length === 0 ? (
            <div className="public-creator-empty">No public prompts yet.</div>
          ) : (
            <div className="public-creator-prompt-list">
              {publicPrompts.map(prompt => (
                <div key={prompt.id} className="public-creator-prompt-card">
                  <div className="public-creator-prompt-title">{prompt.name}</div>
                  <div className="public-creator-prompt-text">{prompt.positive}</div>
                  {(prompt.model || prompt.purpose || prompt.tags?.length) && (
                    <div className="public-creator-prompt-meta">
                      {prompt.model && <span>Model: {prompt.model}</span>}
                      {prompt.purpose && <span>Purpose: {prompt.purpose}</span>}
                      {prompt.tags && prompt.tags.length > 0 && <span>{prompt.tags.join(', ')}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
