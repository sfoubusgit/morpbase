import { useState, useMemo } from 'react';
import type { Pool } from '../../types';
import type { PoolHubEntry } from '../../types';
import { listHubEntries } from '../../engine/poolHubStore';
import { listWorlds } from '../../engine/worldStore';
import { Modal } from './Modal';
import './WorldModal.css';

type WorldEntry = {
  id: string;
  name: string;
  phrases: string[];
  summary?: string;
  source: 'hub' | 'user';
};

type WorldModalProps = {
  isOpen: boolean;
  onClose: () => void;
  activeWorldId: string | null;
  onSelectWorld: (id: string, name: string, phrases: string[]) => void;
  onDeactivate: () => void;
};

export function WorldModal({
  isOpen,
  onClose,
  activeWorldId,
  onSelectWorld,
  onDeactivate,
}: WorldModalProps) {
  const [search, setSearch] = useState('');
  const [hubEntries] = useState<PoolHubEntry[]>(() => listHubEntries());

  const worlds = useMemo<WorldEntry[]>(() => {
    const result: WorldEntry[] = [];

    listWorlds().forEach(world => {
      if (world.phrases.length === 0) return;
      result.push({
        id: `user:${world.id}`,
        name: world.name,
        phrases: world.phrases.map(p => p.text),
        source: 'user',
      });
    });

    hubEntries.forEach(entry => {
      const phrases = (entry.payload as Pool).items.map(item => item.text);
      if (phrases.length === 0) return;
      result.push({
        id: `hub:${entry.id}`,
        name: entry.title,
        phrases,
        summary: entry.summary,
        source: 'hub',
      });
    });

    return result;
  }, [hubEntries, isOpen]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return worlds;
    return worlds.filter(w =>
      w.name.toLowerCase().includes(term) ||
      w.summary?.toLowerCase().includes(term)
    );
  }, [worlds, search]);

  const handleSelect = (world: WorldEntry) => {
    onSelectWorld(world.id, world.name, world.phrases);
    onClose();
  };

  const handleDeactivate = () => {
    onDeactivate();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose an Aura" className="world-modal-container">
      <div className="world-modal">
        <div className="world-modal-description">
          Activate an aura to reshape your inspiration field with its phrases instead of the default pool.
        </div>
        <div className="world-modal-toolbar">
          <input
            type="text"
            className="world-modal-search"
            placeholder="Search auras..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {activeWorldId && (
            <button type="button" className="world-modal-deactivate" onClick={handleDeactivate}>
              Deactivate
            </button>
          )}
        </div>

        {worlds.length === 0 ? (
          <div className="world-modal-empty">
            No auras yet. Go to Auras to create one, then activate it here.
          </div>
        ) : filtered.length === 0 ? (
          <div className="world-modal-empty">No auras match that search.</div>
        ) : (
          <div className="world-modal-grid">
            {filtered.map(world => (
              <button
                key={world.id}
                type="button"
                className={`world-card${world.id === activeWorldId ? ' world-card-active' : ''}`}
                onClick={() => handleSelect(world)}
              >
                <div className="world-card-header">
                  <div className="world-card-name">{world.name}</div>
                  <div className="world-card-badges">
                    <span className={`world-card-source world-card-source-${world.source}`}>
                      {world.source === 'user' ? 'Your aura' : 'Hub'}
                    </span>
                    <span className="world-card-count">{world.phrases.length} phrases</span>
                    {world.id === activeWorldId && (
                      <span className="world-card-active-badge">Active</span>
                    )}
                  </div>
                </div>
                {world.summary && (
                  <div className="world-card-summary">{world.summary}</div>
                )}
                <div className="world-card-preview">
                  {world.phrases.slice(0, 5).map((phrase, i) => (
                    <span key={i} className="world-card-chip">{phrase}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
