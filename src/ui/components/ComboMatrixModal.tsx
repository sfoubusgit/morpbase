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
  onUpsert: (input: ComboNoteInput) => Promise<ComboNote>;
  onDelete: (id: string) => Promise<void>;
  onActivate: (universeId: string, styleId: string) => void;
};

type FilterMode = 'all' | 'tried' | 'untried';

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
  onUpsert,
  onDelete,
  onActivate,
}: ComboMatrixModalProps) {
  const [selected, setSelected] = useState<{ universeId: string; styleId: string } | null>(null);
  const [editStatus, setEditStatus] = useState<ComboStatus>('sampled');
  const [editNotes, setEditNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterMode>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelected(null);
      setEditStatus('sampled');
      setEditNotes('');
      setError(null);
      setFilter('all');
      setQuery('');
    }
  }, [isOpen]);

  // Index notes by (universeId, styleId) for O(1) cell lookups.
  const noteByPair = useMemo(() => {
    const map = new Map<string, ComboNote>();
    for (const n of notes) {
      map.set(`${n.universeId}::${n.styleId}`, n);
    }
    return map;
  }, [notes]);

  const cellNote = (uId: string, sId: string): ComboNote | undefined =>
    noteByPair.get(`${uId}::${sId}`);

  // Apply text query and tried/untried filter.
  const q = query.trim().toLowerCase();
  const filteredUniverses = useMemo(() => {
    let list = universes;
    if (q) list = list.filter(u => u.name.toLowerCase().includes(q));
    if (filter === 'tried') {
      list = list.filter(u => notes.some(n => n.universeId === u.id && n.status !== 'untried'));
    }
    return list;
  }, [universes, notes, filter, q]);

  const filteredStyles = useMemo(() => {
    let list = styles;
    if (q) list = list.filter(s => s.name.toLowerCase().includes(q));
    if (filter === 'tried') {
      list = list.filter(s => notes.some(n => n.styleId === s.id && n.status !== 'untried'));
    }
    return list;
  }, [styles, notes, filter, q]);

  const selectedNote = selected ? cellNote(selected.universeId, selected.styleId) : undefined;
  const selectedUniverse = selected ? universes.find(u => u.id === selected.universeId) : null;
  const selectedStyle = selected ? styles.find(s => s.id === selected.styleId) : null;

  const handleSelectCell = (universeId: string, styleId: string) => {
    setSelected({ universeId, styleId });
    const existing = cellNote(universeId, styleId);
    setEditStatus(existing?.status ?? 'sampled');
    setEditNotes(existing?.notes ?? '');
    setError(null);
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
    if (!selectedNote) return;
    if (!window.confirm('Remove this combo note? The (universe, style) pair will go back to untried.')) return;
    setIsSaving(true);
    setError(null);
    try {
      await onDelete(selectedNote.id);
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

  // Summary counts for the toolbar.
  const summary = useMemo(() => {
    const counts = { won: 0, sampled: 0, failed: 0, untried: 0 };
    for (const n of notes) {
      counts[n.status] += 1;
    }
    return counts;
  }, [notes]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Combos" className="combo-matrix-modal">
      <div className="combo-mtx">
        <div className="combo-mtx__toolbar">
          <input
            type="search"
            className="combo-mtx__search"
            placeholder="Filter universes/styles by name…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <div className="combo-mtx__filters">
            <button
              type="button"
              className={`combo-mtx__filter${filter === 'all' ? ' is-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`combo-mtx__filter${filter === 'tried' ? ' is-active' : ''}`}
              onClick={() => setFilter('tried')}
            >
              Tried only
            </button>
            <button
              type="button"
              className={`combo-mtx__filter${filter === 'untried' ? ' is-active' : ''}`}
              onClick={() => setFilter('untried')}
            >
              Untried only
            </button>
          </div>
          <div className="combo-mtx__summary">
            <span className="combo-mtx__chip combo-mtx__chip--won">✓ {summary.won}</span>
            <span className="combo-mtx__chip combo-mtx__chip--sampled">○ {summary.sampled}</span>
            <span className="combo-mtx__chip combo-mtx__chip--failed">✗ {summary.failed}</span>
          </div>
        </div>

        {isLoading && <div className="combo-mtx__status">Loading combos…</div>}

        {!isLoading && (filteredUniverses.length === 0 || filteredStyles.length === 0) && (
          <div className="combo-mtx__status">
            {universes.length === 0
              ? 'No universes yet — create one in ◈ Universes to start tracking combos.'
              : styles.length === 0
                ? 'No styles yet — create some in the Style lane to start tracking combos.'
                : 'No matches for the current filter.'}
          </div>
        )}

        {!isLoading && filteredUniverses.length > 0 && filteredStyles.length > 0 && (
          <div className="combo-mtx__grid-wrap">
            <table className="combo-mtx__grid">
              <thead>
                <tr>
                  <th className="combo-mtx__corner"></th>
                  {filteredStyles.map(s => (
                    <th
                      key={s.id}
                      className="combo-mtx__col-head"
                      title={s.name}
                    >
                      <span>{s.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUniverses.map(u => (
                  <tr key={u.id}>
                    <th className="combo-mtx__row-head" title={u.name}>{u.name}</th>
                    {filteredStyles.map(s => {
                      const note = cellNote(u.id, s.id);
                      const status = note?.status;
                      const isSel = selected?.universeId === u.id && selected?.styleId === s.id;
                      const klass = [
                        'combo-mtx__cell',
                        status ? `combo-mtx__cell--${status}` : 'combo-mtx__cell--empty',
                        isSel ? 'is-selected' : '',
                      ].filter(Boolean).join(' ');
                      const title = note
                        ? `${u.name} × ${s.name}\n${statusLabel(status!)}${note.notes ? '\n— ' + note.notes : ''}`
                        : `${u.name} × ${s.name}\nUntried`;
                      return (
                        <td
                          key={s.id}
                          className={klass}
                          onClick={() => handleSelectCell(u.id, s.id)}
                          title={title}
                        >
                          {statusGlyph(status)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
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
