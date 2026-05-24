import { useState, useEffect, useMemo } from 'react';
import {
  type ObjectIdentity,
  type ObjectIdentityInput,
  listObjects,
  createObject,
  deleteObject,
} from '../../engine/objectStore';
import { Modal } from './Modal';
import './ObjectLibraryModal.css';

type ObjectLibraryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  activeObjectIds: string[];
  onAdd: (id: string, name: string, phrases: string[]) => void;
  onRemove: (id: string) => void;
  onItemCreated?: (id: string) => void;
  universeFilter?: string[];
  universeName?: string;
};

export function ObjectLibraryModal({
  isOpen,
  onClose,
  activeObjectIds,
  onAdd,
  onRemove,
  onItemCreated,
  universeFilter,
  universeName,
}: ObjectLibraryModalProps) {
  const [objects, setObjects] = useState<ObjectIdentity[]>([]);
  const [newName, setNewName] = useState('');
  const [newPhrases, setNewPhrases] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      setObjects(listObjects());
      setSearch('');
      setIsCreating(false);
      setNewName('');
      setNewPhrases('');
      setNewSummary('');
    }
  }, [isOpen]);

  const reload = () => setObjects(listObjects());

  const handleCreate = () => {
    const name = newName.trim();
    const phrases = newPhrases.split('\n').map(p => p.trim()).filter(Boolean);
    if (!name || phrases.length === 0) return;
    const input: ObjectIdentityInput = { name, phrases, summary: newSummary.trim() || undefined };
    const created = createObject(input);
    reload();
    setNewName('');
    setNewPhrases('');
    setNewSummary('');
    setIsCreating(false);
    onItemCreated?.(created.id);
    onAdd(created.id, created.name, created.phrases);
    onClose();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this object?')) return;
    deleteObject(id);
    onRemove(id);
    reload();
  };

  const universeObjects = useMemo(
    () => universeFilter && universeFilter.length > 0
      ? objects.filter(o => universeFilter.includes(o.id))
      : objects,
    [objects, universeFilter]
  );

  const filtered = search.trim()
    ? universeObjects.filter(o =>
        o.name.toLowerCase().includes(search.toLowerCase()) ||
        o.summary?.toLowerCase().includes(search.toLowerCase())
      )
    : universeObjects;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Objects" className="obj-modal-container">
      <div className="obj-modal">

        {universeFilter && universeFilter.length > 0 && (
          <div className="identity-lane-universe-banner">
            {universeName ? `Universe: ${universeName}` : 'Universe active'} — showing {universeFilter.length} curated object{universeFilter.length === 1 ? '' : 's'}
          </div>
        )}

        <div className="obj-modal-toolbar">
          <input
            type="text"
            className="obj-modal-search"
            placeholder="Search objects…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="obj-modal-new-btn"
            onClick={() => setIsCreating(v => !v)}
          >
            {isCreating ? 'Cancel' : '+ New'}
          </button>
        </div>

        {isCreating && (
          <div className="obj-modal-create">
            <input
              type="text"
              className="obj-modal-input"
              placeholder="Object name…"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              autoFocus
            />
            <input
              type="text"
              className="obj-modal-input"
              placeholder="Short description (optional)…"
              value={newSummary}
              onChange={e => setNewSummary(e.target.value)}
            />
            <textarea
              className="obj-modal-phrases"
              placeholder="One phrase per line…"
              rows={4}
              value={newPhrases}
              onChange={e => setNewPhrases(e.target.value)}
            />
            <button
              type="button"
              className="obj-modal-create-btn"
              onClick={handleCreate}
              disabled={!newName.trim() || !newPhrases.trim()}
            >
              Create & Add
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="obj-modal-empty">
            {objects.length === 0
              ? 'No objects yet. Create one above.'
              : 'No objects match that search.'}
          </div>
        ) : (
          <div className="obj-modal-list">
            {filtered.map(obj => {
              const isActive = activeObjectIds.includes(obj.id);
              return (
                <div
                  key={obj.id}
                  className={`obj-card${isActive ? ' obj-card-active' : ''}`}
                >
                  <div className="obj-card-info">
                    <div className="obj-card-name">{obj.name}</div>
                    {obj.summary && <div className="obj-card-summary">{obj.summary}</div>}
                    <div className="obj-card-phrases">
                      {obj.phrases.slice(0, 3).map(p => (
                        <span key={p} className="obj-card-phrase">{p}</span>
                      ))}
                    </div>
                  </div>
                  <div className="obj-card-actions">
                    {isActive ? (
                      <button
                        type="button"
                        className="obj-card-btn obj-card-btn-remove"
                        onClick={() => onRemove(obj.id)}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="obj-card-btn obj-card-btn-add"
                        onClick={() => { onAdd(obj.id, obj.name, obj.phrases); }}
                      >
                        Add
                      </button>
                    )}
                    <button
                      type="button"
                      className="obj-card-btn obj-card-btn-delete"
                      onClick={() => handleDelete(obj.id)}
                      title="Delete object"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </Modal>
  );
}
