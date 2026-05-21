import { useState } from 'react';
import type { LaneSet, MultiLaneConfig, SingleLaneConfig } from '../../types/laneSets';
import { Modal } from './Modal';
import './LaneSetsModal.css';

type LaneSetsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  laneSets: LaneSet[];
  onApply: (set: LaneSet) => void;
  onDelete: (id: string) => void;
  onSaveCurrent: (name: string, description?: string) => void;
};

type LaneBadge = { label: string; mode: 'fixed' | 'random' | 'off' };

function getLaneBadges(lanes: LaneSet['lanes']): LaneBadge[] {
  const multiMode = (cfg: MultiLaneConfig): 'fixed' | 'random' | 'off' =>
    cfg.mode === 'fixed' ? (cfg.ids.length > 0 ? 'fixed' : 'off') : cfg.mode;

  const singleMode = (cfg: SingleLaneConfig): 'fixed' | 'random' | 'off' =>
    cfg.mode === 'fixed' ? (cfg.id ? 'fixed' : 'off') : cfg.mode;

  return [
    { label: 'Char', mode: multiMode(lanes.character) },
    { label: 'Dyn', mode: singleMode(lanes.dynamics) },
    { label: 'Ward', mode: multiMode(lanes.wardrobe) },
    { label: 'Style', mode: multiMode(lanes.style) },
    { label: 'Light', mode: multiMode(lanes.lighting) },
    { label: 'Comp', mode: multiMode(lanes.composition) },
    { label: 'Mood', mode: multiMode(lanes.mood) },
    { label: 'Env', mode: multiMode(lanes.environment) },
    { label: 'Aura', mode: singleMode(lanes.aura) },
  ];
}

export function LaneSetCard({
  set,
  onApply,
  onDelete,
}: {
  set: LaneSet;
  onApply: () => void;
  onDelete: () => void;
}) {
  const badges = getLaneBadges(set.lanes);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="ls-card">
      <div className="ls-card-body">
        <div className="ls-card-name">{set.name}</div>
        {set.description && <div className="ls-card-desc">{set.description}</div>}
        {set.tags && set.tags.length > 0 && (
          <div className="ls-card-tags">
            {set.tags.map(t => <span key={t} className="ls-card-tag">{t}</span>)}
          </div>
        )}
        <div className="ls-card-badges">
          {badges.map(b => (
            <span key={b.label} className={`ls-badge ls-badge-${b.mode}`}>
              {b.label}
            </span>
          ))}
        </div>
      </div>
      <div className="ls-card-actions">
        <button type="button" className="ls-apply-btn" onClick={onApply}>
          Apply
        </button>
        {confirmDelete ? (
          <>
            <button type="button" className="ls-delete-confirm-btn" onClick={onDelete}>
              Confirm
            </button>
            <button type="button" className="ls-delete-cancel-btn" onClick={() => setConfirmDelete(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" className="ls-delete-btn" onClick={() => setConfirmDelete(true)} title="Delete set">
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export function LaneSetsModal({
  isOpen,
  onClose,
  laneSets,
  onApply,
  onDelete,
  onSaveCurrent,
}: LaneSetsModalProps) {
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDesc, setSaveDesc] = useState('');
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? laneSets.filter(s => {
        const q = query.toLowerCase();
        return (
          s.name.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.tags?.some(t => t.toLowerCase().includes(q))
        );
      })
    : laneSets;

  const handleSave = () => {
    if (!saveName.trim()) return;
    onSaveCurrent(saveName.trim(), saveDesc.trim() || undefined);
    setSaveName('');
    setSaveDesc('');
    setSaveOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lane Sets" className="lane-sets-modal">
      <div className="ls-modal-header">
        <p className="ls-modal-description">
          Named configurations spanning all lanes. Apply a set to load an entire scene setup in one click.
        </p>
        <button
          type="button"
          className="ls-save-current-btn"
          onClick={() => setSaveOpen(v => !v)}
        >
          {saveOpen ? 'Cancel' : '+ Save Current State'}
        </button>
      </div>

      {saveOpen && (
        <div className="ls-save-form">
          <input
            type="text"
            className="ls-save-input"
            placeholder="Set name (required)"
            value={saveName}
            onChange={e => setSaveName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
            autoFocus
          />
          <input
            type="text"
            className="ls-save-input"
            placeholder="Description (optional)"
            value={saveDesc}
            onChange={e => setSaveDesc(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
          />
          <button
            type="button"
            className="ls-save-submit-btn"
            onClick={handleSave}
            disabled={!saveName.trim()}
          >
            Save
          </button>
        </div>
      )}

      {laneSets.length > 4 && (
        <div className="ls-search-bar">
          <input
            type="text"
            className="ls-search-input"
            placeholder="Search sets..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      )}

      <div className="ls-card-list">
        {filtered.length === 0 ? (
          <div className="ls-empty">
            {laneSets.length === 0
              ? 'No lane sets yet. Save your current state to create one.'
              : 'No sets match your search.'}
          </div>
        ) : (
          filtered.map(set => (
            <LaneSetCard
              key={set.id}
              set={set}
              onApply={() => { onApply(set); onClose(); }}
              onDelete={() => onDelete(set.id)}
            />
          ))
        )}
      </div>

      <div className="ls-legend">
        <span className="ls-badge ls-badge-fixed">fixed</span> pinned selection
        <span className="ls-badge ls-badge-random">random</span> rolls on apply
        <span className="ls-badge ls-badge-off">off</span> lane disabled
      </div>
    </Modal>
  );
}
