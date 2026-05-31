import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type {
  Drop,
  DropInput,
  DropPromptInput,
  DropStatus,
  Recipe,
} from '../../types';
import { Modal } from './Modal';
import './DropLibraryModal.css';

type PromptDraft = {
  key: string;
  name: string;
  saveAs: string;
  prompt: string;
};

type FormState = {
  name: string;
  recipeId: string;
  summary: string;
  notes: string;
  projectTags: string;
  status: DropStatus;
  prompts: PromptDraft[];
};

const STATUS_OPTIONS: DropStatus[] = ['draft', 'ready', 'rendered', 'shipped'];

let draftCounter = 0;
const newDraftKey = () => `pdraft_${++draftCounter}`;

const blankPrompt = (): PromptDraft => ({
  key: newDraftKey(),
  name: '',
  saveAs: '',
  prompt: '',
});

const EMPTY_FORM: FormState = {
  name: '',
  recipeId: '',
  summary: '',
  notes: '',
  projectTags: '',
  status: 'draft',
  prompts: [blankPrompt()],
};

const formFromDrop = (d: Drop): FormState => ({
  name: d.name,
  recipeId: d.recipeId,
  summary: d.summary ?? '',
  notes: d.notes ?? '',
  projectTags: d.projectTags.join(', '),
  status: d.status,
  prompts: d.prompts.length > 0
    ? d.prompts.map(p => ({
        key: p.id,
        name: p.name,
        saveAs: p.saveAs ?? '',
        prompt: p.prompt,
      }))
    : [blankPrompt()],
});

const parseCsv = (s: string): string[] =>
  s.split(',').map(t => t.trim()).filter(Boolean);

const formToInput = (f: FormState): DropInput => ({
  name: f.name.trim(),
  recipeId: f.recipeId.trim(),
  summary: f.summary.trim() || undefined,
  notes: f.notes.trim() || undefined,
  projectTags: parseCsv(f.projectTags),
  status: f.status,
  prompts: f.prompts
    .map<DropPromptInput>(p => ({
      name: p.name.trim(),
      saveAs: p.saveAs.trim() || undefined,
      prompt: p.prompt.trim(),
    }))
    .filter(p => p.name && p.prompt),
});

type DropLibraryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  drops: Drop[];
  recipes: Recipe[];
  isLoading?: boolean;
  onCreate: (input: DropInput) => Promise<Drop>;
  onUpdate: (id: string, input: DropInput) => Promise<Drop>;
  onDelete: (id: string) => Promise<void>;
};

export function DropLibraryModal({
  isOpen,
  onClose,
  drops,
  recipes,
  isLoading = false,
  onCreate,
  onUpdate,
  onDelete,
}: DropLibraryModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [copyFlash, setCopyFlash] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedId(null);
      setIsCreating(false);
      setForm(EMPTY_FORM);
      setError(null);
      setQuery('');
    }
  }, [isOpen]);

  const selected = useMemo(
    () => (selectedId ? drops.find(d => d.id === selectedId) ?? null : null),
    [selectedId, drops]
  );

  const recipeById = useMemo(() => {
    const map = new Map<string, Recipe>();
    recipes.forEach(r => map.set(r.id, r));
    return map;
  }, [recipes]);

  const q = query.trim().toLowerCase();
  const visible = q
    ? drops.filter(d => {
        const recipeName = recipeById.get(d.recipeId)?.name.toLowerCase() ?? '';
        return (
          d.name.toLowerCase().includes(q) ||
          (d.summary?.toLowerCase().includes(q) ?? false) ||
          recipeName.includes(q) ||
          d.projectTags.some(t => t.toLowerCase().includes(q))
        );
      })
    : drops;

  const showForm = isCreating || selected !== null;

  const handleSelect = (id: string) => {
    const d = drops.find(x => x.id === id);
    setSelectedId(id);
    setIsCreating(false);
    if (d) setForm(formFromDrop(d));
    setError(null);
  };

  const handleStartCreate = () => {
    setSelectedId(null);
    setIsCreating(true);
    const defaultRecipe = recipes[0]?.id ?? '';
    setForm({ ...EMPTY_FORM, recipeId: defaultRecipe, prompts: [blankPrompt()] });
    setError(null);
  };

  const handleCancel = () => {
    setSelectedId(null);
    setIsCreating(false);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const handleAddPrompt = () => {
    setForm(f => ({ ...f, prompts: [...f.prompts, blankPrompt()] }));
  };

  const handleRemovePrompt = (key: string) => {
    setForm(f => ({
      ...f,
      prompts: f.prompts.length > 1 ? f.prompts.filter(p => p.key !== key) : f.prompts,
    }));
  };

  const handlePromptChange = (key: string, field: keyof PromptDraft, value: string) => {
    setForm(f => ({
      ...f,
      prompts: f.prompts.map(p => (p.key === key ? { ...p, [field]: value } : p)),
    }));
  };

  const flashCopied = (label: string) => {
    setCopyFlash(label);
    window.setTimeout(() => setCopyFlash(prev => (prev === label ? null : prev)), 1400);
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      flashCopied(label);
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const input = formToInput(form);
    if (!input.name) {
      setError('Drop name is required.');
      return;
    }
    if (!input.recipeId) {
      setError('Pick a recipe for this drop.');
      return;
    }
    if (!input.prompts || input.prompts.length === 0) {
      setError('Add at least one prompt (name + text).');
      return;
    }
    setIsSaving(true);
    try {
      if (selected) {
        await onUpdate(selected.id, input);
      } else {
        const created = await onCreate(input);
        setSelectedId(created.id);
        setIsCreating(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save drop.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm(`Delete drop "${selected.name}"? This cannot be undone.`)) return;
    setIsSaving(true);
    try {
      await onDelete(selected.id);
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete drop.');
    } finally {
      setIsSaving(false);
    }
  };

  const selectedRecipe = selected ? recipeById.get(selected.recipeId) : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Drops" className="drop-library-modal">
      <div className="drop-lib">
        <aside className="drop-lib__list">
          <div className="drop-lib__list-head">
            <input
              type="search"
              className="drop-lib__search"
              placeholder="Search drops…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button
              type="button"
              className="drop-lib__new-btn"
              onClick={handleStartCreate}
              disabled={recipes.length === 0}
              title={recipes.length === 0 ? 'Create a recipe first' : 'New drop from a recipe'}
            >
              + New Drop
            </button>
          </div>
          {isLoading && <div className="drop-lib__status">Loading drops…</div>}
          {!isLoading && drops.length === 0 && (
            <div className="drop-lib__status">No drops yet. Click + New Drop to create one.</div>
          )}
          {!isLoading && drops.length > 0 && visible.length === 0 && (
            <div className="drop-lib__status">No drops match.</div>
          )}
          <ul className="drop-lib__items">
            {visible.map(d => {
              const r = recipeById.get(d.recipeId);
              return (
                <li key={d.id}>
                  <button
                    type="button"
                    className={`drop-lib__item${d.id === selectedId ? ' is-selected' : ''}`}
                    onClick={() => handleSelect(d.id)}
                  >
                    <div className="drop-lib__item-name">{d.name}</div>
                    <div className="drop-lib__item-recipe">
                      {r ? r.name : <em>(missing recipe)</em>}
                    </div>
                    <div className="drop-lib__item-meta">
                      <span className={`drop-lib__chip drop-lib__chip--status drop-lib__chip--${d.status}`}>
                        {d.status}
                      </span>
                      <span className="drop-lib__chip drop-lib__chip--count">
                        {d.prompts.length} prompt{d.prompts.length === 1 ? '' : 's'}
                      </span>
                      {d.projectTags.map(tag => (
                        <span key={tag} className="drop-lib__chip drop-lib__chip--tag">{tag}</span>
                      ))}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="drop-lib__detail">
          {!showForm && (
            <div className="drop-lib__empty">
              <p>Select a drop to inspect, or start a new one from a recipe.</p>
            </div>
          )}
          {showForm && (
            <form className="drop-lib__form" onSubmit={handleSubmit}>
              <div className="drop-lib__form-head">
                <h3>{isCreating ? 'New Drop' : selected?.name}</h3>
                {selected && !isCreating && (
                  <button
                    type="button"
                    className="drop-lib__delete-btn"
                    onClick={handleDelete}
                    disabled={isSaving}
                  >
                    Delete
                  </button>
                )}
              </div>

              {selectedRecipe && !isCreating && (
                <div className="drop-lib__recipe-card">
                  <div className="drop-lib__recipe-card-label">Recipe</div>
                  <div className="drop-lib__recipe-card-name">{selectedRecipe.name}</div>
                  {selectedRecipe.summary && (
                    <div className="drop-lib__recipe-card-summary">{selectedRecipe.summary}</div>
                  )}
                  <div className="drop-lib__recipe-card-meta">
                    <span>{selectedRecipe.settings.model}</span>
                    <span>·</span>
                    <span>
                      {selectedRecipe.settings.steps} steps · CFG {selectedRecipe.settings.cfgMin}
                      {selectedRecipe.settings.cfgMax !== selectedRecipe.settings.cfgMin
                        ? `–${selectedRecipe.settings.cfgMax}`
                        : ''}
                    </span>
                    <span>·</span>
                    <span>
                      {selectedRecipe.settings.resolution.width}×{selectedRecipe.settings.resolution.height}
                    </span>
                  </div>
                </div>
              )}

              <div className="drop-lib__row">
                <label className="drop-lib__field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </label>
                <label className="drop-lib__field">
                  <span>Recipe</span>
                  <select
                    value={form.recipeId}
                    onChange={e => setForm(f => ({ ...f, recipeId: e.target.value }))}
                    required
                  >
                    <option value="">— pick a recipe —</option>
                    {recipes.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="drop-lib__row">
                <label className="drop-lib__field">
                  <span>Status</span>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value as DropStatus }))}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </label>
                <label className="drop-lib__field">
                  <span>Project tags (comma-separated)</span>
                  <input
                    type="text"
                    value={form.projectTags}
                    onChange={e => setForm(f => ({ ...f, projectTags: e.target.value }))}
                    placeholder="civitai, ig-erotic"
                  />
                </label>
              </div>

              <label className="drop-lib__field">
                <span>Summary</span>
                <input
                  type="text"
                  value={form.summary}
                  onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                  placeholder="One-line description"
                />
              </label>

              <label className="drop-lib__field">
                <span>Notes</span>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Drop-level notes (e.g. universe variations, special subject roster)"
                />
              </label>

              <div className="drop-lib__prompts-head">
                <h4>Prompts ({form.prompts.length})</h4>
                <button type="button" className="drop-lib__add-prompt" onClick={handleAddPrompt}>
                  + Add prompt
                </button>
              </div>

              <ul className="drop-lib__prompts">
                {form.prompts.map((p, idx) => (
                  <li key={p.key} className="drop-lib__prompt">
                    <div className="drop-lib__prompt-head">
                      <span className="drop-lib__prompt-idx">{String(idx + 1).padStart(2, '0')}</span>
                      <input
                        type="text"
                        className="drop-lib__prompt-name"
                        placeholder="Prompt name (e.g. Patchwork Bride)"
                        value={p.name}
                        onChange={e => handlePromptChange(p.key, 'name', e.target.value)}
                      />
                      <input
                        type="text"
                        className="drop-lib__prompt-saveas"
                        placeholder="save-as (optional)"
                        value={p.saveAs}
                        onChange={e => handlePromptChange(p.key, 'saveAs', e.target.value)}
                      />
                      {p.prompt.trim() && (
                        <button
                          type="button"
                          className="drop-lib__prompt-copy"
                          onClick={() => handleCopy(p.prompt, `prompt_${p.key}`)}
                          title="Copy this prompt to clipboard"
                        >
                          {copyFlash === `prompt_${p.key}` ? '✓' : '⎘'}
                        </button>
                      )}
                      {form.prompts.length > 1 && (
                        <button
                          type="button"
                          className="drop-lib__prompt-remove"
                          onClick={() => handleRemovePrompt(p.key)}
                          title="Remove this prompt"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <textarea
                      rows={4}
                      className="drop-lib__prompt-text"
                      placeholder="Full prompt text (subject + style detail + style tail, woven together)"
                      value={p.prompt}
                      onChange={e => handlePromptChange(p.key, 'prompt', e.target.value)}
                    />
                  </li>
                ))}
              </ul>

              {error && <div className="drop-lib__error">{error}</div>}

              <div className="drop-lib__form-actions">
                <button type="button" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </button>
                <button type="submit" className="drop-lib__save-btn" disabled={isSaving}>
                  {isSaving ? 'Saving…' : isCreating ? 'Create Drop' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </Modal>
  );
}
