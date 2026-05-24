import { useState } from 'react';
import {
  type World,
  addWorldPhrase,
  createWorld,
  deleteWorld,
  listWorlds,
  removeWorldPhrase,
  renameWorld,
  updateWorldPhrase,
} from '../../engine/worldStore';
import './WorldsPage.css';

type WorldsPageProps = {
  isLoggedIn: boolean;
  onWorldCreated?: (id: string) => void;
  onWorldDeleted?: (id: string) => void;
};

export function WorldsPage({ isLoggedIn: _isLoggedIn, onWorldCreated, onWorldDeleted }: WorldsPageProps) {
  const [worlds, setWorlds] = useState<World[]>(() => listWorlds());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newWorldName, setNewWorldName] = useState('');
  const [newPhrase, setNewPhrase] = useState('');
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [editingNameText, setEditingNameText] = useState('');
  const [editingPhraseId, setEditingPhraseId] = useState<string | null>(null);
  const [editingPhraseText, setEditingPhraseText] = useState('');

  const reload = () => setWorlds(listWorlds());

  const selected = worlds.find(w => w.id === selectedId) ?? null;

  const handleCreate = () => {
    const name = newWorldName.trim();
    if (!name) return;
    const world = createWorld(name);
    reload();
    setNewWorldName('');
    setSelectedId(world.id);
    onWorldCreated?.(world.id);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this aura and all its phrases?')) return;
    deleteWorld(id);
    onWorldDeleted?.(id);
    if (selectedId === id) setSelectedId(null);
    reload();
  };

  const handleRename = (id: string) => {
    const name = editingNameText.trim();
    setEditingNameId(null);
    if (!name) return;
    renameWorld(id, name);
    reload();
  };

  const handleAddPhrase = () => {
    if (!selected || !newPhrase.trim()) return;
    addWorldPhrase(selected.id, newPhrase.trim());
    setNewPhrase('');
    reload();
  };

  const handleDeletePhrase = (phraseId: string) => {
    if (!selected) return;
    removeWorldPhrase(selected.id, phraseId);
    reload();
  };

  const handleEditPhrase = (phraseId: string) => {
    if (!selected) return;
    const text = editingPhraseText.trim();
    setEditingPhraseId(null);
    if (!text) return;
    updateWorldPhrase(selected.id, phraseId, text);
    reload();
  };

  return (
    <div className="worlds-page">
      <div className="worlds-layout">

        {/* Left: world list */}
        <aside className="worlds-sidebar">
          <div className="worlds-sidebar-header">
            <span className="worlds-sidebar-title">Auras</span>
            <span className="worlds-sidebar-count">{worlds.length}</span>
          </div>

          <div className="worlds-create">
            <input
              type="text"
              className="worlds-create-input"
              placeholder="New aura name..."
              value={newWorldName}
              onChange={e => setNewWorldName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
            />
            <button
              type="button"
              className="worlds-create-btn"
              onClick={handleCreate}
              disabled={!newWorldName.trim()}
            >
              Create
            </button>
          </div>

          <div className="worlds-list">
            {worlds.length === 0 ? (
              <div className="worlds-empty-list">No auras yet. Create one above.</div>
            ) : (
              worlds.map(world => (
                <button
                  key={world.id}
                  type="button"
                  className={`worlds-card${world.id === selectedId ? ' worlds-card-active' : ''}`}
                  onClick={() => setSelectedId(world.id)}
                >
                  <div className="worlds-card-name">{world.name}</div>
                  <div className="worlds-card-count">{world.phrases.length} phrase{world.phrases.length === 1 ? '' : 's'}</div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Right: phrases */}
        <div className="worlds-detail">
          {!selected ? (
            <div className="worlds-detail-empty">
              Select an aura to edit its phrases, or create a new one.
            </div>
          ) : (
            <div className="worlds-detail-inner">
              <div className="worlds-detail-header">
                {editingNameId === selected.id ? (
                  <input
                    type="text"
                    className="worlds-name-input"
                    value={editingNameText}
                    autoFocus
                    onChange={e => setEditingNameText(e.target.value)}
                    onBlur={() => handleRename(selected.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleRename(selected.id);
                      if (e.key === 'Escape') setEditingNameId(null);
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    className="worlds-detail-name"
                    title="Click to rename"
                    onClick={() => { setEditingNameId(selected.id); setEditingNameText(selected.name); }}
                  >
                    {selected.name}
                  </button>
                )}
                <button
                  type="button"
                  className="worlds-delete-btn"
                  onClick={() => handleDelete(selected.id)}
                >
                  Delete aura
                </button>
              </div>

              <div className="worlds-phrases">
                {selected.phrases.length === 0 ? (
                  <div className="worlds-phrases-empty">No phrases yet. Add one below.</div>
                ) : (
                  selected.phrases.map(phrase => (
                    <div key={phrase.id} className="worlds-phrase">
                      {editingPhraseId === phrase.id ? (
                        <input
                          type="text"
                          className="worlds-phrase-edit"
                          value={editingPhraseText}
                          autoFocus
                          onChange={e => setEditingPhraseText(e.target.value)}
                          onBlur={() => handleEditPhrase(phrase.id)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleEditPhrase(phrase.id);
                            if (e.key === 'Escape') setEditingPhraseId(null);
                          }}
                        />
                      ) : (
                        <button
                          type="button"
                          className="worlds-phrase-text"
                          onClick={() => { setEditingPhraseId(phrase.id); setEditingPhraseText(phrase.text); }}
                        >
                          {phrase.text}
                        </button>
                      )}
                      <button
                        type="button"
                        className="worlds-phrase-remove"
                        onClick={() => handleDeletePhrase(phrase.id)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="worlds-add-phrase">
                <input
                  type="text"
                  className="worlds-add-input"
                  placeholder="Add a phrase and press Enter..."
                  value={newPhrase}
                  onChange={e => setNewPhrase(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddPhrase(); }}
                />
                <button
                  type="button"
                  className="worlds-add-btn"
                  onClick={handleAddPhrase}
                  disabled={!newPhrase.trim()}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
