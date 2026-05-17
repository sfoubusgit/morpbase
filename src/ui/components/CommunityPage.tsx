import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type CommunityIdentityType,
  COMMUNITY_IDENTITIES,
} from '../../data/communityIdentities';
import {
  type CommunitySharedIdentity,
  listCommunityIdentities,
  removeSharedIdentity,
  shareIdentity,
} from '../../engine/communityStore';
import type { ShareIdentityInput } from '../../engine/communityStore';
import { createCharacter } from '../../engine/characterStore';
import { createCompositionFrame } from '../../engine/compositionStore';
import { createEnvironment } from '../../engine/environmentStore';
import { createLightingSetup } from '../../engine/lightingStore';
import { createMoodPreset } from '../../engine/moodStore';
import { createNegativePreset } from '../../engine/negativeStore';
import { createStylePreset } from '../../engine/styleStore';
import { createOutfit } from '../../engine/wardrobeStore';
import { createWorld, addWorldPhrase } from '../../engine/worldStore';
import { createObject } from '../../engine/objectStore';
import { logIdentityUsage } from '../../engine/identityUsageStore';
import { ShareModal } from './ShareModal';
import { WallFeed } from './wall/WallFeed';
import { CreatorGrid } from './creators/CreatorGrid';
import { ChallengesPanel } from './challenges/ChallengesPanel';
import { DMInbox } from './dm/DMInbox';
import { PulsePanel } from './wall/PulsePanel';
import type { WallPostIdentityTag } from '../../types/community';
import './CommunityPage.css';

const TYPE_LABELS: Record<CommunityIdentityType, string> = {
  character: 'Character',
  style: 'Style',
  lighting: 'Lighting',
  environment: 'Environment',
  wardrobe: 'Wardrobe',
  composition: 'Composition',
  mood: 'Mood',
  negative: 'Negative',
  aura: 'Aura',
  object: 'Object',
};

const TAB_ORDER: Array<CommunityIdentityType | 'all'> = [
  'all', 'character', 'style', 'lighting', 'environment',
  'wardrobe', 'composition', 'mood', 'negative', 'aura', 'object',
];

type CardState = 'idle' | 'adding' | 'done' | 'error';

async function addToLibrary(
  type: CommunityIdentityType,
  name: string,
  summary: string,
  phrases: string[],
): Promise<void> {
  switch (type) {
    case 'character':
      await createCharacter({
        name, summary,
        identity: {
          visualAnchors: [{ id: 'anchor_1', label: 'Identity', kind: 'other', text: phrases[0] ?? name }],
          motifs: [],
        },
        phraseBundle: { core: phrases },
      });
      break;
    case 'style':
      await createStylePreset({ name, summary, phrases });
      break;
    case 'lighting':
      await createLightingSetup({ name, summary, phrases });
      break;
    case 'environment':
      await createEnvironment({ name, summary, phraseBundle: { core: phrases } });
      break;
    case 'wardrobe':
      await createOutfit({ name, summary, phrases });
      break;
    case 'composition':
      await createCompositionFrame({ name, summary, phrases });
      break;
    case 'mood':
      await createMoodPreset({ name, summary, phrases });
      break;
    case 'negative':
      createNegativePreset({ name, summary, phrases });
      break;
    case 'aura': {
      const w = createWorld(name);
      for (const phrase of phrases) {
        addWorldPhrase(w.id, phrase);
      }
      break;
    }
    case 'object':
      createObject({ name, summary, phrases });
      break;
  }
}

type DisplayIdentity = {
  id: string;
  name: string;
  type: CommunityIdentityType;
  phrases: string[];
  summary: string;
  authorName: string;
  authorId: string | null;
  authorCoverImageUrl: string | null;
  isCurated: boolean;
  parentId: string | null;
  remixCount: number;
};

type CommunitySection = 'wall' | 'pulse' | 'identities' | 'creators' | 'challenges' | 'messages';

type CommunityPageProps = {
  userId: string | null;
  authUid: string | null;
  userName: string | null;
  onIdentityAdded?: () => Promise<void>;
  onViewCreator?: (authUid: string, name: string) => void;
  activeIdentityTags?: WallPostIdentityTag[];
  currentPromptText?: string;
  dmInitialRecipient?: { authUid: string; name: string } | null;
};

export function CommunityPage({
  userId,
  authUid,
  userName,
  onIdentityAdded,
  onViewCreator,
  activeIdentityTags = [],
  currentPromptText = '',
  dmInitialRecipient,
}: CommunityPageProps) {
  const [activeSection, setActiveSection] = useState<CommunitySection>('wall');
  const [activeTab, setActiveTab] = useState<CommunityIdentityType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [sharedItems, setSharedItems] = useState<CommunitySharedIdentity[]>([]);
  const [loadingShared, setLoadingShared] = useState(true);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [remixTarget, setRemixTarget] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (dmInitialRecipient) setActiveSection('messages');
  }, [dmInitialRecipient]);

  const fetchShared = useCallback(async () => {
    setLoadingShared(true);
    const items = await listCommunityIdentities();
    setSharedItems(items);
    setLoadingShared(false);
  }, []);

  useEffect(() => {
    void fetchShared();
  }, [fetchShared]);

  const curated: DisplayIdentity[] = useMemo(
    () => COMMUNITY_IDENTITIES.map(c => ({
      id: c.id,
      name: c.name,
      type: c.type,
      phrases: c.phrases,
      summary: c.summary,
      authorName: 'MorpBase',
      authorId: null,
      // Morp gets a test gradient so the cover-image effect is always visible
      authorCoverImageUrl: c.id === 'ci_mascot_morp' ? '__test_gradient__' : null,
      isCurated: true,
      parentId: null,
      remixCount: 0,
    })),
    [],
  );

  const community: DisplayIdentity[] = useMemo(
    () => sharedItems.map(s => ({
      id: s.id,
      name: s.name,
      type: s.type,
      phrases: s.phrases,
      summary: s.summary,
      authorName: s.authorName,
      authorId: s.authorId,
      authorCoverImageUrl: s.authorCoverImageUrl,
      isCurated: false,
      parentId: s.parentId,
      remixCount: s.remixCount,
    })),
    [sharedItems],
  );

  const all: DisplayIdentity[] = useMemo(
    () => [...curated, ...community],
    [curated, community],
  );

  const visible = useMemo(() => {
    const byTab = activeTab === 'all' ? all : all.filter(i => i.type === activeTab);
    const term = search.trim().toLowerCase();
    if (!term) return byTab;
    return byTab.filter(i =>
      i.name.toLowerCase().includes(term) ||
      i.summary.toLowerCase().includes(term) ||
      i.authorName.toLowerCase().includes(term) ||
      i.phrases.some(p => p.toLowerCase().includes(term)),
    );
  }, [all, activeTab, search]);

  const existingShared = useMemo(
    () => sharedItems.filter(s => s.authorId === authUid).map(s => ({ name: s.name, type: s.type })),
    [sharedItems, authUid],
  );

  const handleAdd = async (item: DisplayIdentity) => {
    setCardStates(prev => ({ ...prev, [item.id]: 'adding' }));
    try {
      await addToLibrary(item.type, item.name, item.summary, item.phrases);
      await onIdentityAdded?.();
      // Log usage for Reach reputation — only for community identities with a real author
      if (authUid && item.authorId && item.authorId !== authUid) {
        void logIdentityUsage({
          identityId:     item.id,
          identityName:   item.name,
          identityType:   item.type,
          authorAuthUid:  item.authorId,
          userAuthUid:    authUid,
        });
      }
      setCardStates(prev => ({ ...prev, [item.id]: 'done' }));
      setTimeout(() => setCardStates(prev => ({ ...prev, [item.id]: 'idle' })), 2200);
    } catch {
      setCardStates(prev => ({ ...prev, [item.id]: 'error' }));
      setTimeout(() => setCardStates(prev => ({ ...prev, [item.id]: 'idle' })), 2200);
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm('Remove this identity from the community?')) return;
    setRemovingId(id);
    try {
      await removeSharedIdentity(id);
      setSharedItems(prev => prev.filter(s => s.id !== id));
    } catch {
      // silently fail — item stays visible
    } finally {
      setRemovingId(null);
    }
  };

  const handleShare = async (input: ShareIdentityInput) => {
    if (!userId || !userName) throw new Error('You must be logged in to share.');
    await shareIdentity(input, userId, userName);
    await fetchShared();
  };

  const countFor = (tab: CommunityIdentityType | 'all') =>
    tab === 'all' ? all.length : all.filter(i => i.type === tab).length;

  return (
    <div className="community-page">
      <div className="community-inner">

        <div className="community-header">
          <div className="community-header-top">
            <div>
              <h1 className="community-title">Community</h1>
              <p className="community-subtitle">
                A living creative space — share prompts, discover identities, and connect with other makers.
              </p>
            </div>
            <div className="community-header-actions">
              {activeSection === 'identities' && (
                userId ? (
                  <button
                    type="button"
                    className="community-share-btn"
                    onClick={() => setIsShareOpen(true)}
                  >
                    Share an Identity
                  </button>
                ) : (
                  <span className="community-login-hint">Log in to share</span>
                )
              )}
            </div>
          </div>

          <div className="community-section-tabs">
            {(['wall', 'pulse', 'identities', 'creators', 'challenges', 'messages'] as CommunitySection[]).map(s => (
              <button
                key={s}
                type="button"
                className={`community-section-tab${activeSection === s ? ' community-section-tab--active' : ''}`}
                onClick={() => setActiveSection(s)}
              >
                {s === 'creators' ? 'Users' : s === 'pulse' ? 'Pulse' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeSection === 'wall' && (
          <WallFeed
            authUid={authUid}
            userId={userId}
            userName={userName}
            activeIdentityTags={activeIdentityTags}
            currentPromptText={currentPromptText}
            onViewAuthor={onViewCreator}
          />
        )}

        {activeSection === 'pulse' && (
          <PulsePanel onViewAuthor={onViewCreator} />
        )}

        {activeSection === 'creators' && (
          <CreatorGrid
            authUid={authUid}
            onViewCreator={onViewCreator}
          />
        )}

        {activeSection === 'messages' && authUid ? (
          <DMInbox
            authUid={authUid}
            authName={userName ?? ''}
            initialRecipient={dmInitialRecipient}
          />
        ) : activeSection === 'messages' && (
          <p className="community-login-hint">Log in to send and receive messages.</p>
        )}

        {activeSection === 'challenges' && (
          <ChallengesPanel
            authUid={authUid}
            userId={userId}
            userName={userName}
            activeIdentityTags={activeIdentityTags}
            currentPromptText={currentPromptText}
          />
        )}

        {activeSection === 'identities' && (
          <>
            <div className="community-tabs">
              {TAB_ORDER.map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={`community-tab${activeTab === tab ? ' community-tab-active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'all' ? 'All' : TYPE_LABELS[tab]}
                  <span className="community-tab-count">{countFor(tab)}</span>
                </button>
              ))}
            </div>

            <div className="community-search-row">
              <input
                type="text"
                className="community-search"
                placeholder="Search by name, phrase, or author…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button
                  type="button"
                  className="community-search-clear"
                  onClick={() => setSearch('')}
                >
                  Clear
                </button>
              )}
            </div>

            {loadingShared && sharedItems.length === 0 ? (
              <div className="community-loading">Loading community identities…</div>
            ) : visible.length === 0 ? (
              <div className="community-empty">
                {search.trim()
                  ? `No results for "${search.trim()}".`
                  : `No ${activeTab === 'all' ? '' : TYPE_LABELS[activeTab] + ' '}identities yet.${userId ? ' Be the first to share one.' : ''}`
                }
              </div>
            ) : (
              <div className="community-grid">
                {visible.map(item => {
                  const state = cardStates[item.id] ?? 'idle';
                  const isOwn = !item.isCurated && item.authorId === authUid;
                  const addLabel =
                    state === 'done' ? 'Added' :
                    state === 'error' ? 'Failed' :
                    state === 'adding' ? '…' :
                    `Add to my ${TYPE_LABELS[item.type]}`;

                  const parentName = item.parentId
                    ? (all.find(i => i.id === item.parentId)?.name ?? null)
                    : null;

                  const coverStyle: React.CSSProperties | undefined =
                    item.authorCoverImageUrl === '__test_gradient__'
                      ? undefined
                      : item.authorCoverImageUrl
                        ? { '--card-cover': `url(${item.authorCoverImageUrl})` } as React.CSSProperties
                        : undefined;

                  return (
                    <div
                      key={item.id}
                      className={`community-card community-card--${item.type}${item.isCurated ? ' community-card-curated' : ''}${item.authorCoverImageUrl === '__test_gradient__' ? ' community-card--test-cover' : ''}`}
                      data-has-cover={item.authorCoverImageUrl && item.authorCoverImageUrl !== '__test_gradient__' ? 'true' : undefined}
                      style={coverStyle}
                    >
                      <div className="community-card-header">
                        <div className="community-card-name">{item.name}</div>
                        <div className="community-card-header-right">
                          {item.remixCount > 0 && (
                            <span className="community-card-remix-count">↺ {item.remixCount}</span>
                          )}
                          <span className={`community-card-type community-card-type-${item.type}`}>
                            {TYPE_LABELS[item.type]}
                          </span>
                        </div>
                      </div>

                      <div className="community-card-author">
                        <span className="community-card-author-by">by </span>
                        <span className={item.isCurated ? 'community-card-author-morpbase' : 'community-card-author-user'}>
                          {item.authorName}
                        </span>
                        {parentName && (
                          <span className="community-card-lineage"> · ↺ {parentName}</span>
                        )}
                      </div>

                      {item.summary && (
                        <div className="community-card-summary">{item.summary}</div>
                      )}

                      <div className="community-card-phrases">
                        {item.phrases.slice(0, 4).map(phrase => (
                          <span key={phrase} className="community-card-phrase">{phrase}</span>
                        ))}
                      </div>

                      <div className="community-card-footer">
                        <button
                          type="button"
                          className={`community-card-add community-card-add-${state}`}
                          disabled={state === 'adding' || state === 'done'}
                          onClick={() => void handleAdd(item)}
                        >
                          {addLabel}
                        </button>
                        {authUid && !isOwn && (
                          <button
                            type="button"
                            className="community-card-remix"
                            onClick={() => {
                              setRemixTarget({ id: item.id, name: item.name });
                              setIsShareOpen(true);
                            }}
                          >
                            ↺ Remix
                          </button>
                        )}
                        {isOwn && (
                          <button
                            type="button"
                            className="community-card-remove"
                            disabled={removingId === item.id}
                            onClick={() => void handleRemove(item.id)}
                            title="Remove from community"
                          >
                            {removingId === item.id ? '…' : 'Remove'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => { setIsShareOpen(false); setRemixTarget(null); }}
        userId={userId ?? ''}
        userName={userName ?? ''}
        existingShared={existingShared}
        onShare={handleShare}
        remixOf={remixTarget}
      />
    </div>
  );
}
