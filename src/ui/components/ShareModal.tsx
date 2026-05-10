import { useEffect, useState } from 'react';
import type { CommunityIdentityType } from '../../data/communityIdentities';
import { listCharacters } from '../../engine/characterStore';
import { listCompositionFrames } from '../../engine/compositionStore';
import { listEnvironments } from '../../engine/environmentStore';
import { listLightingSetups } from '../../engine/lightingStore';
import { listMoodPresets } from '../../engine/moodStore';
import { listNegativePresets } from '../../engine/negativeStore';
import { listStylePresets } from '../../engine/styleStore';
import { listOutfits } from '../../engine/wardrobeStore';
import { listWorlds } from '../../engine/worldStore';
import { listObjects } from '../../engine/objectStore';
import type { ShareIdentityInput } from '../../engine/communityStore';
import { Modal } from './Modal';
import './ShareModal.css';

type FlatIdentity = {
  id: string;
  name: string;
  type: CommunityIdentityType;
  phrases: string[];
  summary: string;
  coverImageUrl: string | null;
};

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

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  existingShared: Array<{ name: string; type: string }>;
  onShare: (input: ShareIdentityInput) => Promise<void>;
};

export function ShareModal({
  isOpen,
  onClose,
  existingShared,
  onShare,
}: ShareModalProps) {
  const [identities, setIdentities] = useState<FlatIdentity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [summary, setSummary] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [activeType, setActiveType] = useState<CommunityIdentityType | 'all'>('all');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setSelectedId(null);
    setSummary('');
    setCoverImageUrl('');
    setError(null);
    setActiveType('all');

    const load = async () => {
      try {
        const [
          characters,
          styles,
          lightings,
          environments,
          outfits,
          compositions,
          moods,
          negatives,
          worlds,
          objs,
        ] = await Promise.all([
          listCharacters(),
          listStylePresets(),
          listLightingSetups(),
          listEnvironments(),
          listOutfits(),
          listCompositionFrames(),
          listMoodPresets(),
          Promise.resolve(listNegativePresets()),
          Promise.resolve(listWorlds()),
          Promise.resolve(listObjects()),
        ]);

        const flat: FlatIdentity[] = [
          ...characters.map(c => ({
            id: c.id,
            name: c.name,
            type: 'character' as CommunityIdentityType,
            phrases: c.phraseBundle.core,
            summary: c.summary ?? '',
            coverImageUrl: c.coverImageUrl ?? null,
          })),
          ...styles.map(s => ({
            id: s.id,
            name: s.name,
            type: 'style' as CommunityIdentityType,
            phrases: s.phrases,
            summary: s.summary ?? '',
            coverImageUrl: s.coverImageUrl ?? null,
          })),
          ...lightings.map(l => ({
            id: l.id,
            name: l.name,
            type: 'lighting' as CommunityIdentityType,
            phrases: l.phrases,
            summary: l.summary ?? '',
            coverImageUrl: l.coverImageUrl ?? null,
          })),
          ...environments.map(e => ({
            id: e.id,
            name: e.name,
            type: 'environment' as CommunityIdentityType,
            phrases: e.phraseBundle.core,
            summary: e.summary ?? '',
            coverImageUrl: e.coverImageUrl ?? null,
          })),
          ...outfits.map(o => ({
            id: o.id,
            name: o.name,
            type: 'wardrobe' as CommunityIdentityType,
            phrases: o.phrases,
            summary: o.summary ?? '',
            coverImageUrl: o.coverImageUrl ?? null,
          })),
          ...compositions.map(c => ({
            id: c.id,
            name: c.name,
            type: 'composition' as CommunityIdentityType,
            phrases: c.phrases,
            summary: c.summary ?? '',
            coverImageUrl: c.coverImageUrl ?? null,
          })),
          ...moods.map(m => ({
            id: m.id,
            name: m.name,
            type: 'mood' as CommunityIdentityType,
            phrases: m.phrases,
            summary: m.summary ?? '',
            coverImageUrl: m.coverImageUrl ?? null,
          })),
          ...negatives.map(n => ({
            id: n.id,
            name: n.name,
            type: 'negative' as CommunityIdentityType,
            phrases: n.phrases,
            summary: n.summary ?? '',
            coverImageUrl: n.coverImageUrl ?? null,
          })),
          ...worlds.map(w => ({
            id: w.id,
            name: w.name,
            type: 'aura' as CommunityIdentityType,
            phrases: w.phrases.map(p => p.text),
            summary: '',
            coverImageUrl: (w as any).coverImageUrl ?? null,
          })),
          ...objs.map(o => ({
            id: o.id,
            name: o.name,
            type: 'object' as CommunityIdentityType,
            phrases: o.phrases,
            summary: o.summary ?? '',
            coverImageUrl: o.coverImageUrl ?? null,
          })),
        ];

        setIdentities(flat);
      } catch {
        setIdentities([]);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [isOpen]);

  const selected = identities.find(i => i.id === selectedId) ?? null;

  const handleSelect = (identity: FlatIdentity) => {
    setSelectedId(identity.id);
    setSummary(identity.summary);
    setCoverImageUrl(identity.coverImageUrl ?? '');
    setError(null);
  };

  const alreadyShared = (identity: FlatIdentity) =>
    existingShared.some(
      e => e.name.toLowerCase() === identity.name.toLowerCase() && e.type === identity.type,
    );

  const handleSubmit = async () => {
    if (!selected) return;
    if (alreadyShared(selected)) {
      setError('You have already shared an identity with this name and type.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onShare({
        name: selected.name,
        type: selected.type,
        phrases: selected.phrases,
        summary: summary.trim(),
        authorCoverImageUrl: coverImageUrl.trim() || null,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to share. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const TYPES: Array<CommunityIdentityType | 'all'> = [
    'all', 'character', 'style', 'lighting', 'environment',
    'wardrobe', 'composition', 'mood', 'negative', 'aura', 'object',
  ];

  const visible = activeType === 'all'
    ? identities
    : identities.filter(i => i.type === activeType);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share to Community" className="share-modal-container">
      <div className="share-modal">
        <p className="share-modal-description">
          Choose one of your identities to share with the MorpBase community.
        </p>

        {loading ? (
          <div className="share-modal-loading">Loading your identities…</div>
        ) : identities.length === 0 ? (
          <div className="share-modal-empty">
            You don't have any identities yet. Build some in your workspace lanes first.
          </div>
        ) : (
          <>
            <div className="share-modal-tabs">
              {TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  className={`share-modal-tab${activeType === t ? ' share-modal-tab-active' : ''}`}
                  onClick={() => { setActiveType(t); setSelectedId(null); }}
                >
                  {t === 'all' ? 'All' : TYPE_LABELS[t]}
                </button>
              ))}
            </div>

            <div className="share-modal-list">
              {visible.length === 0 ? (
                <div className="share-modal-empty-type">
                  No {activeType === 'all' ? '' : TYPE_LABELS[activeType as CommunityIdentityType] + ' '}identities found.
                </div>
              ) : (
                visible.map(identity => {
                  const shared = alreadyShared(identity);
                  return (
                    <button
                      key={identity.id}
                      type="button"
                      className={`share-modal-item${selectedId === identity.id ? ' share-modal-item-active' : ''}${shared ? ' share-modal-item-shared' : ''}`}
                      onClick={() => !shared && handleSelect(identity)}
                      disabled={shared}
                    >
                      <div className="share-modal-item-name">{identity.name}</div>
                      <div className="share-modal-item-right">
                        {shared && <span className="share-modal-item-badge-shared">Shared</span>}
                        <span className={`share-modal-item-type share-modal-item-type-${identity.type}`}>
                          {TYPE_LABELS[identity.type]}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {selected && (
              <div className="share-modal-detail">
                <div className="share-modal-detail-phrases">
                  {selected.phrases.slice(0, 5).map(p => (
                    <span key={p} className="share-modal-detail-phrase">{p}</span>
                  ))}
                </div>
                <div className="share-modal-summary-label">Summary (optional)</div>
                <textarea
                  className="share-modal-summary"
                  rows={2}
                  placeholder="Describe this identity in one sentence…"
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  maxLength={180}
                />
                <div className="share-modal-summary-label">Cover image URL (optional)</div>
                <input
                  type="text"
                  className="share-modal-cover-input"
                  placeholder="https://… shown as card background in Community"
                  value={coverImageUrl}
                  onChange={e => setCoverImageUrl(e.target.value)}
                />
                {coverImageUrl.trim() && (
                  <div className="share-modal-cover-preview">
                    <img src={coverImageUrl.trim()} alt="Cover preview" />
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {error && <div className="share-modal-error">{error}</div>}

        <div className="share-modal-footer">
          <button type="button" className="share-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="share-modal-submit"
            disabled={!selected || submitting}
            onClick={() => void handleSubmit()}
          >
            {submitting ? 'Sharing…' : 'Share to Community'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
