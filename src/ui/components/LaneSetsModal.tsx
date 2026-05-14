import { useMemo, useState } from 'react';
import type { LaneSet, LaneUniverse, MultiLaneConfig, SingleLaneConfig } from '../../types/laneSets';
import { listObjects } from '../../engine/objectStore';
import { listWorlds } from '../../engine/worldStore';
import { Modal } from './Modal';
import './LaneSetsModal.css';

type LibraryEntry = { id: string; name: string };

type LibraryData = {
  characters: LibraryEntry[];
  environments: LibraryEntry[];
  wardrobe: LibraryEntry[];
  styles: LibraryEntry[];
  lighting: LibraryEntry[];
  composition: LibraryEntry[];
  mood: LibraryEntry[];
  negative: LibraryEntry[];
};

type UniverseLaneKey = keyof LaneUniverse;

const UNIVERSE_TABS: Array<{ key: UniverseLaneKey; label: string }> = [
  { key: 'character', label: 'Characters' },
  { key: 'environment', label: 'Environments' },
  { key: 'wardrobe', label: 'Wardrobe' },
  { key: 'style', label: 'Styles' },
  { key: 'lighting', label: 'Lighting' },
  { key: 'composition', label: 'Composition' },
  { key: 'mood', label: 'Mood' },
  { key: 'negative', label: 'Negative' },
  { key: 'aura', label: 'Auras' },
  { key: 'object', label: 'Objects' },
];

type LaneSetsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  laneSets: LaneSet[];
  onApply: (set: LaneSet) => void;
  onDelete: (id: string) => void;
  onSaveCurrent: (name: string, description?: string) => void;
  onUpdateUniverse: (id: string, universe: LaneUniverse) => void;
  libraryData: LibraryData;
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

function UniverseEditor({
  set,
  libraryData,
  onBack,
  onToggle,
}: {
  set: LaneSet;
  libraryData: LibraryData;
  onBack: () => void;
  onToggle: (laneKey: UniverseLaneKey, itemId: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<UniverseLaneKey>('character');

  const localObjects = useMemo<LibraryEntry[]>(
    () => listObjects().map(o => ({ id: o.id, name: o.name })),
    []
  );
  const localAuras = useMemo<LibraryEntry[]>(
    () => listWorlds().map(w => ({ id: w.id, name: w.name })),
    []
  );

  const universe = set.universe ?? {};

  const getItems = (key: UniverseLaneKey): LibraryEntry[] => {
    switch (key) {
      case 'character': return libraryData.characters;
      case 'environment': return libraryData.environments;
      case 'wardrobe': return libraryData.wardrobe;
      case 'style': return libraryData.styles;
      case 'lighting': return libraryData.lighting;
      case 'composition': return libraryData.composition;
      case 'mood': return libraryData.mood;
      case 'negative': return libraryData.negative;
      case 'aura': return localAuras;
      case 'object': return localObjects;
    }
  };

  const activeItems = getItems(activeTab);
  const activeIds = universe[activeTab] ?? [];
  const activeLabel = UNIVERSE_TABS.find(t => t.key === activeTab)?.label ?? '';

  const totalCurated = UNIVERSE_TABS.reduce(
    (sum, tab) => sum + (universe[tab.key]?.length ?? 0),
    0
  );

  return (
    <div className="ls-universe-editor">
      <div className="ls-universe-header">
        <button type="button" className="ls-universe-back" onClick={onBack}>
          ← Back
        </button>
        <div className="ls-universe-title">{set.name}</div>
        {totalCurated > 0 && (
          <div className="ls-universe-total">{totalCurated} curated</div>
        )}
      </div>

      <p className="ls-universe-desc">
        Curate each lane's pool. When this set is active, pickers show only these items and Randomize draws from them. Empty lanes stay open (full library).
      </p>

      <div className="ls-universe-tabs">
        {UNIVERSE_TABS.map(tab => {
          const count = (universe[tab.key] ?? []).length;
          return (
            <button
              key={tab.key}
              type="button"
              className={`ls-universe-tab${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {count > 0 && <span className="ls-universe-tab-count">{count}</span>}
            </button>
          );
        })}
      </div>

      {activeItems.length === 0 ? (
        <div className="ls-universe-empty">
          No {activeLabel.toLowerCase()} in your library yet.
        </div>
      ) : (
        <div className="ls-universe-items">
          {activeItems.map(item => {
            const included = activeIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={`ls-universe-item${included ? ' included' : ''}`}
                onClick={() => onToggle(activeTab, item.id)}
                title={included ? 'Remove from universe' : 'Add to universe'}
              >
                {included && <span className="ls-universe-check">✓</span>}
                {item.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LaneSetCard({
  set,
  onApply,
  onDelete,
  onEditUniverse,
}: {
  set: LaneSet;
  onApply: () => void;
  onDelete: () => void;
  onEditUniverse: () => void;
}) {
  const badges = getLaneBadges(set.lanes);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const universeCount = set.universe
    ? Object.values(set.universe).reduce((sum, ids) => sum + (ids?.length ?? 0), 0)
    : 0;

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
          {universeCount > 0 && (
            <span className="ls-badge ls-badge-universe">
              {universeCount} in universe
            </span>
          )}
        </div>
      </div>
      <div className="ls-card-actions">
        <button type="button" className="ls-apply-btn" onClick={onApply}>
          Apply
        </button>
        <button type="button" className="ls-universe-btn" onClick={onEditUniverse}>
          Universe
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
  onUpdateUniverse,
  libraryData,
}: LaneSetsModalProps) {
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDesc, setSaveDesc] = useState('');
  const [query, setQuery] = useState('');
  const [editingUniverseSetId, setEditingUniverseSetId] = useState<string | null>(null);

  const editingSet = editingUniverseSetId
    ? laneSets.find(s => s.id === editingUniverseSetId) ?? null
    : null;

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

  const handleToggleUniverseItem = (laneKey: UniverseLaneKey, itemId: string) => {
    if (!editingSet) return;
    const currentUniverse = editingSet.universe ?? {};
    const currentIds = currentUniverse[laneKey] ?? [];
    const newIds = currentIds.includes(itemId)
      ? currentIds.filter(id => id !== itemId)
      : [...currentIds, itemId];
    onUpdateUniverse(editingSet.id, { ...currentUniverse, [laneKey]: newIds });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lane Sets" className="lane-sets-modal">
      {editingSet ? (
        <UniverseEditor
          set={editingSet}
          libraryData={libraryData}
          onBack={() => setEditingUniverseSetId(null)}
          onToggle={handleToggleUniverseItem}
        />
      ) : (
        <>
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
                  onEditUniverse={() => setEditingUniverseSetId(set.id)}
                />
              ))
            )}
          </div>

          <div className="ls-legend">
            <span className="ls-badge ls-badge-fixed">fixed</span> pinned selection
            <span className="ls-badge ls-badge-random">random</span> rolls on apply
            <span className="ls-badge ls-badge-off">off</span> lane disabled
          </div>
        </>
      )}
    </Modal>
  );
}
