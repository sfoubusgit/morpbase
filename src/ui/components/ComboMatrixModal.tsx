import { useEffect, useMemo, useState } from 'react';
import type {
  ComboNote,
  ComboNoteInput,
  ComboStatus,
} from '../../types';
import { Modal } from './Modal';
import './ComboMatrixModal.css';

type UniverseRef = { id: string; name: string };
type StyleRef = { id: string; name: string };

type ComboMatrixModalProps = {
  isOpen: boolean;
  onClose: () => void;
  universes: UniverseRef[];
  styles: StyleRef[];
  notes: ComboNote[];
  isLoading?: boolean;
  // When set, the modal opens with this (universeId, styleId) pre-selected
  // and the editor pre-filled. Used by the workspace "★ Mark Combo" button.
  initialSelection?: { universeId: string; styleId: string } | null;
  onUpsert: (input: ComboNoteInput) => Promise<ComboNote>;
  onDelete: (id: string) => Promise<void>;
  onActivate: (universeId: string, styleId: string) => void;
};

const STATUS_OPTIONS: ComboStatus[] = ['untried', 'sampled', 'won', 'failed'];

const statusGlyph = (status: ComboStatus | undefined): string => {
  switch (status) {
    case 'won': return '✓';
    case 'failed': return '✗';
    case 'sampled': return '○';
    default: return '·';
  }
};

const statusLabel = (status: ComboStatus): string => {
  switch (status) {
    case 'won': return 'Won — this combo works';
    case 'failed': return 'Failed — does not work';
    case 'sampled': return 'Sampled — jury still out';
    case 'untried': return 'Untried';
  }
};

export function ComboMatrixModal({
  isOpen,
  onClose,
  universes,
  styles,
  notes,
  isLoading = false,
  initialSelection = null,
  onUpsert,
  onDelete,
  onActivate,
}: ComboMatrixModalProps) {
  const [selected, setSelected] = useState<{ universeId: string; styleId: string } | null>(null);
  const [editStatus, setEditStatus] = useState<ComboStatus>('sampled');
  const [editNotes, setEditNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [expandedUniverses, setExpandedUniverses] = useState<Set<string>>(() => new Set());
  const [expandedUntried, setExpandedUntried] = useState<Set<string>>(() => new Set());

  // Index notes by universeId for fast section lookups.
  const notesByUniverse = useMemo(() => {
    const map = new Map<string, ComboNote[]>();
    for (const u of universes) map.set(u.id, []);
    for (const n of notes) {
      const arr = map.get(n.universeId);
      if (arr) arr.push(n);
    }
    // Newest-updated first inside each universe
    for (const arr of map.values()) {
      arr.sort((a, b) => b.updatedAt - a.updatedAt);
    }
    return map;
  }, [universes, notes]);

  const styleById = useMemo(() => {
    const map = new Map<string, StyleRef>();
    for (const s of styles) map.set(s.id, s);
    return map;
  }, [styles]);

  // Reset transient state on open. Auto-expand any universe that has at
  // least one noted combo so users land on their existing data without an
  // extra click.
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setQuery('');

    const autoExpand = new Set<string>();
    for (const u of universes) {
      if ((notesByUniverse.get(u.id) ?? []).length > 0) autoExpand.add(u.id);
    }
    setExpandedUntried(new Set());

    if (initialSelection && initialSelection.universeId && initialSelection.styleId) {
      // Always expand the initial selection's universe so the editor surface
      // is contextual, even if it has no notes yet.
      autoExpand.add(initialSelection.universeId);
      const existing = notes.find(
        n => n.universeId === initialSelection.universeId && n.styleId === initialSelection.styleId
      );
      // If the chosen style is currently untried for that universe, expand
      // the Untried sub-section too so the user can see the row.
      if (!existing) {
        setExpandedUntried(prev => {
          const next = new Set(prev);
          next.add(initialSelection.universeId);
          return next;
        });
      }
      setSelected({ universeId: initialSelection.universeId, styleId: initialSelection.styleId });
      setEditStatus(existing?.status ?? 'sampled');
      setEditNotes(existing?.notes ?? '');
    } else {
      setSelected(null);
      setEditStatus('sampled');
      setEditNotes('');
    }

    setExpandedUniverses(autoExpand);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialSelection]);

  // Summary counts for the toolbar.
  const summary = useMemo(() => {
    const counts = { won: 0, sampled: 0, failed: 0, untried: 0 };
    for (const n of notes) counts[n.status] += 1;
    return counts;
  }, [notes]);

  // Apply the search query at the universe level — show a universe if its
  // name matches, or if any of its noted-combo style names / notes match,
  // or if any of its still-untried style names match.
  const q = query.trim().toLowerCase();
  const visibleUniverses = useMemo(() => {
    if (!q) return universes;
    return universes.filter(u => {
      if (u.name.toLowerCase().includes(q)) return true;
      const universeNotes = notesByUniverse.get(u.id) ?? [];
      for (const n of universeNotes) {
        const s = styleById.get(n.styleId);
        if (s && s.name.toLowerCase().includes(q)) return true;
        if (n.notes.toLowerCase().includes(q)) return true;
      }
      // Match against still-untried style names too
      const notedStyleIds = new Set(universeNotes.map(n => n.styleId));
      for (const s of styles) {
        if (notedStyleIds.has(s.id)) continue;
        if (s.name.toLowerCase().includes(q)) return true;
      }
      return false;
    });
  }, [universes, q, notesByUniverse, styleById, styles]);

  const handleSelectRow = (universeId: string, styleId: string) => {
    const existing = notes.find(n => n.universeId === universeId && n.styleId === styleId);
    setSelected({ universeId, styleId });
    setEditStatus(existing?.status ?? 'sampled');
    setEditNotes(existing?.notes ?? '');
    setError(null);
  };

  const handleToggleUniverse = (id: string) => {
    setExpandedUniverses(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleToggleUntried = (id: string) => {
    setExpandedUntried(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    if (!selected) return;
    setIsSaving(true);
    setError(null);
    try {
      await onUpsert({
        universeId: selected.universeId,
        styleId: selected.styleId,
        status: editStatus,
        notes: editNotes,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save combo note.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = async () => {
    if (!selected) return;
    const existing = notes.find(n => n.universeId === selected.universeId && n.styleId === selected.styleId);
    if (!existing) return;
    if (!window.confirm('Remove this combo note? The pair will go back to untried.')) return;
    setIsSaving(true);
    setError(null);
    try {
      await onDelete(existing.id);
      setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear combo note.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleActivate = () => {
    if (!selected) return;
    onActivate(selected.universeId, selected.styleId);
  };

  const selectedNote = selected
    ? notes.find(n => n.universeId === selected.universeId && n.styleId === selected.styleId) ?? null
    : null;
  const selectedUniverse = selected ? universes.find(u => u.id === selected.universeId) ?? null : null;
  const selectedStyle = selected ? styleById.get(selected.styleId) ?? null : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Combos" className="combo-matrix-modal">
      <div className="combo-mtx">
        <div className="combo-mtx__toolbar">
          <input
            type="search"
            className="combo-mtx__search"
            placeholder="Search universes, styles, or notes…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="combo-mtx__summary">
            <span className="combo-mtx__chip combo-mtx__chip--won">✓ {summary.won}</span>
            <span className="combo-mtx__chip combo-mtx__chip--sampled">○ {summary.sampled}</span>
            <span className="combo-mtx__chip combo-mtx__chip--failed">✗ {summary.failed}</span>
          </div>
        </div>

        {isLoading && <div className="combo-mtx__status">Loading combos…</div>}

        {!isLoading && universes.length === 0 && (
          <div className="combo-mtx__status">
            No universes yet — create one in ◈ Universes to start tracking combos.
          </div>
        )}

        {!isLoading && universes.length > 0 && visibleUniverses.length === 0 && (
          <div className="combo-mtx__status">No universes match.</div>
        )}

        {!isLoading && visibleUniverses.length > 0 && (
          <div className="combo-mtx__list">
            {visibleUniverses.map(u => {
              const universeNotes = notesByUniverse.get(u.id) ?? [];
              const notedStyleIds = new Set(universeNotes.map(n => n.styleId));
              const untriedStyles = styles.filter(s => !notedStyleIds.has(s.id));
              const isOpen = expandedUniverses.has(u.id);
              const isUntriedOpen = expandedUntried.has(u.id);

              return (
                <section key={u.id} className="combo-mtx__universe">
                  <button
                    type="button"
                    className="combo-mtx__universe-head"
                    onClick={() => handleToggleUniverse(u.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="combo-mtx__chevron">{isOpen ? '▾' : '▸'}</span>
                    <span className="combo-mtx__universe-name">{u.name}</span>
                    <span className="combo-mtx__universe-meta">
                      {universeNotes.length > 0
                        ? `${universeNotes.length} noted`
                        : 'none noted'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="combo-mtx__rows">
                      {universeNotes.map(n => {
                        const s = styleById.get(n.styleId);
                        const isSelected =
                          selected?.universeId === n.universeId && selected?.styleId === n.styleId;
                        return (
                          <button
                            type="button"
                            key={n.id}
                            className={`combo-mtx__row combo-mtx__row--${n.status}${isSelected ? ' is-selected' : ''}`}
                            onClick={() => handleSelectRow(n.universeId, n.styleId)}
                            title={statusLabel(n.status)}
                          >
                            <span className="combo-mtx__row-status">{statusGlyph(n.status)}</span>
                            <span className="combo-mtx__row-style">
                              {s ? s.name : <em>(missing style: {n.styleId})</em>}
                            </span>
                            <span className="combo-mtx__row-notes">
                              {n.notes || <em className="combo-mtx__row-notes-empty">no note</em>}
                            </span>
                          </button>
                        );
                      })}

                      {untriedStyles.length > 0 && (
                        <div className="combo-mtx__untried">
                          <button
                            type="button"
                            className="combo-mtx__untried-head"
                            onClick={() => handleToggleUntried(u.id)}
                            aria-expanded={isUntriedOpen}
                          >
                            <span className="combo-mtx__chevron combo-mtx__chevron--small">
                              {isUntriedOpen ? '▾' : '▸'}
                            </span>
                            <span>Untried ({untriedStyles.length})</span>
                          </button>
                          {isUntriedOpen && (
                            <div className="combo-mtx__untried-rows">
                              {untriedStyles.map(s => {
                                const isSelected =
                                  selected?.universeId === u.id && selected?.styleId === s.id;
                                return (
                                  <button
                                    type="button"
                                    key={s.id}
                                    className={`combo-mtx__row combo-mtx__row--untried${isSelected ? ' is-selected' : ''}`}
                                    onClick={() => handleSelectRow(u.id, s.id)}
                                    title="Untried — click to mark"
                                  >
                                    <span className="combo-mtx__row-status">·</span>
                                    <span className="combo-mtx__row-style">{s.name}</span>
                                    <span className="combo-mtx__row-notes combo-mtx__row-notes-untried">
                                      mark as tried…
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}

        {selected && selectedUniverse && selectedStyle && (
          <aside className="combo-mtx__editor">
            <div className="combo-mtx__editor-head">
              <div>
                <div className="combo-mtx__editor-label">Combo</div>
                <div className="combo-mtx__editor-title">
                  <strong>{selectedUniverse.name}</strong> × <strong>{selectedStyle.name}</strong>
                </div>
              </div>
              <button
                type="button"
                className="combo-mtx__activate-btn"
                onClick={handleActivate}
                title="Activate this universe + style in the workspace"
              >
                ◉ Activate in Workspace
              </button>
            </div>

            <label className="combo-mtx__field">
              <span>Status</span>
              <select
                value={editStatus}
                onChange={e => setEditStatus(e.target.value as ComboStatus)}
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{statusLabel(s)}</option>
                ))}
              </select>
            </label>

            <label className="combo-mtx__field">
              <span>Notes</span>
              <textarea
                rows={3}
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                placeholder="What happened? e.g. 'Doré strips the cyberpunk read — reframe as religious art'"
              />
            </label>

            {error && <div className="combo-mtx__error">{error}</div>}

            <div className="combo-mtx__editor-actions">
              {selectedNote && (
                <button
                  type="button"
                  className="combo-mtx__clear-btn"
                  onClick={handleClear}
                  disabled={isSaving}
                >
                  Clear note
                </button>
              )}
              <div className="combo-mtx__editor-spacer" />
              <button
                type="button"
                onClick={() => setSelected(null)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="combo-mtx__save-btn"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving…' : selectedNote ? 'Save Changes' : 'Save Note'}
              </button>
            </div>
          </aside>
        )}
      </div>
    </Modal>
  );
}
