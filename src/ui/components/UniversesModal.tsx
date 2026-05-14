import { useMemo, useState } from 'react';
import type { Universe, UniverseInput } from '../../types/universe';
import type { LaneUniverse } from '../../types/laneSets';
import { listObjects } from '../../engine/objectStore';
import { listWorlds } from '../../engine/worldStore';
import { Modal } from './Modal';
import './UniversesModal.css';

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

const POOL_TABS: Array<{ key: UniverseLaneKey; label: string; short: string }> = [
  { key: 'character', label: 'Characters', short: 'Characters' },
  { key: 'environment', label: 'Environments', short: 'Envs' },
  { key: 'wardrobe', label: 'Wardrobe', short: 'Wardrobe' },
  { key: 'style', label: 'Styles', short: 'Styles' },
  { key: 'lighting', label: 'Lighting', short: 'Lighting' },
  { key: 'composition', label: 'Composition', short: 'Comp' },
  { key: 'mood', label: 'Mood', short: 'Mood' },
  { key: 'negative', label: 'Negative', short: 'Negative' },
  { key: 'aura', label: 'Auras', short: 'Auras' },
  { key: 'object', label: 'Objects', short: 'Objects' },
];

type UniversesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  universes: Universe[];
  activeUniverseId: string | null;
  onActivate: (id: string) => void;
  onDeactivate: () => void;
  onCreateUniverse: (input: UniverseInput) => void;
  onUpdatePools: (id: string, pools: LaneUniverse) => void;
  onDeleteUniverse: (id: string) => void;
  libraryData: LibraryData;
};

function PoolEditor({
  universe,
  libraryData,
  onBack,
  onToggle,
}: {
  universe: Universe;
  libraryData: LibraryData;
  onBack: () => void;
  onToggle: (key: UniverseLaneKey, itemId: string) => void;
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

  const pools = universe.pools;

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
  const activeIds = pools[activeTab] ?? [];
  const activeLabel = POOL_TABS.find(t => t.key === activeTab)?.label ?? '';

  const totalCurated = POOL_TABS.reduce(
    (sum, tab) => sum + (pools[tab.key]?.length ?? 0),
    0
  );

  return (
    <div className="uv-editor">
      <div className="uv-editor-header">
        <button type="button" className="uv-back-btn" onClick={onBack}>
          ← Back
        </button>
        <div className="uv-editor-title">{universe.name}</div>
        {totalCurated > 0 && (
          <span className="uv-curated-badge">{totalCurated} curated</span>
        )}
      </div>

      <p className="uv-editor-hint">
        Click items to include them in this universe. Empty lanes stay open — the full library is used.
      </p>

      <div className="uv-tabs">
        {POOL_TABS.map(tab => {
          const count = (pools[tab.key] ?? []).length;
          return (
            <button
              key={tab.key}
              type="button"
              className={`uv-tab${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.short}
              {count > 0 && <span className="uv-tab-count">{count}</span>}
            </button>
          );
        })}
      </div>

      {activeItems.length === 0 ? (
        <div className="uv-empty-lane">
          No {activeLabel.toLowerCase()} in your library yet.
        </div>
      ) : (
        <div className="uv-items">
          {activeItems.map(item => {
            const included = activeIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                className={`uv-item${included ? ' included' : ''}`}
                onClick={() => onToggle(activeTab, item.id)}
              >
                {included && <span className="uv-item-check">✓</span>}
                {item.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function poolSummary(pools: LaneUniverse): string {
  return POOL_TABS
    .filter(tab => (pools[tab.key]?.length ?? 0) > 0)
    .map(tab => `${tab.short} (${pools[tab.key]!.length})`)
    .join(' · ');
}

function UniverseCard({
  universe,
  isActive,
  onActivate,
  onDeactivate,
  onEdit,
  onDelete,
}: {
  universe: Universe;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const summary = poolSummary(universe.pools);
  const totalCurated = POOL_TABS.reduce(
    (sum, tab) => sum + (universe.pools[tab.key]?.length ?? 0),
    0
  );

  return (
    <div className={`uv-card${isActive ? ' uv-card-active' : ''}`}>
      {isActive && <div className="uv-card-active-bar">Active Universe</div>}
      <div className="uv-card-body">
        <div className="uv-card-name">{universe.name}</div>
        {universe.description && (
          <div className="uv-card-desc">{universe.description}</div>
        )}
        {summary ? (
          <div className="uv-card-summary">{summary}</div>
        ) : (
          <div className="uv-card-summary uv-card-summary-empty">
            No pools defined yet — click Edit to curate this universe.
          </div>
        )}
      </div>
      <div className="uv-card-actions">
        {isActive ? (
          <button type="button" className="uv-deactivate-btn" onClick={onDeactivate}>
            Deactivate
          </button>
        ) : (
          <button type="button" className="uv-activate-btn" onClick={onActivate}>
            Activate
          </button>
        )}
        <button
          type="button"
          className={`uv-edit-btn${totalCurated === 0 ? ' uv-edit-btn-nudge' : ''}`}
          onClick={onEdit}
        >
          Edit pools
        </button>
        {confirmDelete ? (
          <>
            <button type="button" className="uv-confirm-delete-btn" onClick={onDelete}>
              Confirm
            </button>
            <button type="button" className="uv-cancel-delete-btn" onClick={() => setConfirmDelete(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className="uv-delete-btn"
            onClick={() => setConfirmDelete(true)}
            title="Delete universe"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export function UniversesModal({
  isOpen,
  onClose,
  universes,
  activeUniverseId,
  onActivate,
  onDeactivate,
  onCreateUniverse,
  onUpdatePools,
  onDeleteUniverse,
  libraryData,
}: UniversesModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');

  const editingUniverse = editingId
    ? universes.find(u => u.id === editingId) ?? null
    : null;

  const handleCreate = () => {
    if (!createName.trim()) return;
    onCreateUniverse({ name: createName.trim(), description: createDesc.trim() || undefined, pools: {} });
    setCreateName('');
    setCreateDesc('');
    setCreateOpen(false);
  };

  const handleTogglePool = (key: UniverseLaneKey, itemId: string) => {
    if (!editingUniverse) return;
    const current = editingUniverse.pools[key] ?? [];
    const next = current.includes(itemId)
      ? current.filter(id => id !== itemId)
      : [...current, itemId];
    onUpdatePools(editingUniverse.id, { ...editingUniverse.pools, [key]: next });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Universes" className="universes-modal">
      {editingUniverse ? (
        <PoolEditor
          universe={editingUniverse}
          libraryData={libraryData}
          onBack={() => setEditingId(null)}
          onToggle={handleTogglePool}
        />
      ) : (
        <>
          <div className="uv-modal-header">
            <p className="uv-modal-desc">
              Creative worlds that scope every picker and the randomizer to a curated pool per lane. Activate one to enter that world.
            </p>
            <button
              type="button"
              className="uv-create-btn"
              onClick={() => setCreateOpen(v => !v)}
            >
              {createOpen ? 'Cancel' : '+ New Universe'}
            </button>
          </div>

          {createOpen && (
            <div className="uv-create-form">
              <input
                type="text"
                className="uv-input"
                placeholder="Universe name (required)"
                value={createName}
                onChange={e => setCreateName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
                autoFocus
              />
              <input
                type="text"
                className="uv-input"
                placeholder="Description (optional)"
                value={createDesc}
                onChange={e => setCreateDesc(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
              />
              <button
                type="button"
                className="uv-create-submit-btn"
                onClick={handleCreate}
                disabled={!createName.trim()}
              >
                Create
              </button>
            </div>
          )}

          <div className="uv-card-list">
            {universes.length === 0 ? (
              <div className="uv-empty">
                No universes yet. Create one to start building thematic worlds.
              </div>
            ) : (
              universes.map(u => (
                <UniverseCard
                  key={u.id}
                  universe={u}
                  isActive={u.id === activeUniverseId}
                  onActivate={() => { onActivate(u.id); onClose(); }}
                  onDeactivate={() => { onDeactivate(); onClose(); }}
                  onEdit={() => setEditingId(u.id)}
                  onDelete={() => onDeleteUniverse(u.id)}
                />
              ))
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
