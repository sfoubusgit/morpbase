import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { Recipe, RecipeInput, RecipeSettings } from '../../types';
import { Modal } from './Modal';
import './RecipeLibraryModal.css';

type FormState = {
  name: string;
  summary: string;
  notes: string;
  model: string;
  sampler: string;
  scheduler: string;
  steps: string;
  cfgMin: string;
  cfgMax: string;
  width: string;
  height: string;
  styleTail: string;
  negative: string;
  loraIds: string;
  universeId: string;
  styleId: string;
  projectTags: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  summary: '',
  notes: '',
  model: 'z-image-turbo',
  sampler: '',
  scheduler: '',
  steps: '8',
  cfgMin: '1.0',
  cfgMax: '1.5',
  width: '1024',
  height: '1280',
  styleTail: '',
  negative: '',
  loraIds: '',
  universeId: '',
  styleId: '',
  projectTags: '',
};

const formFromRecipe = (r: Recipe): FormState => ({
  name: r.name,
  summary: r.summary ?? '',
  notes: r.notes ?? '',
  model: r.settings.model,
  sampler: r.settings.sampler ?? '',
  scheduler: r.settings.scheduler ?? '',
  steps: String(r.settings.steps),
  cfgMin: String(r.settings.cfgMin),
  cfgMax: String(r.settings.cfgMax),
  width: String(r.settings.resolution.width),
  height: String(r.settings.resolution.height),
  styleTail: r.styleTail,
  negative: r.negative,
  loraIds: r.loraIds.join(', '),
  universeId: r.universeId ?? '',
  styleId: r.styleId ?? '',
  projectTags: r.projectTags.join(', '),
});

const parseCsv = (s: string): string[] =>
  s.split(',').map(t => t.trim()).filter(Boolean);

const parseNum = (s: string, fallback: number): number => {
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
};

const formToInput = (f: FormState): RecipeInput => {
  const cfgMin = parseNum(f.cfgMin, 1);
  const cfgMax = parseNum(f.cfgMax, cfgMin);
  const settings: RecipeSettings = {
    model: f.model.trim() || 'z-image-turbo',
    sampler: f.sampler.trim() || undefined,
    scheduler: f.scheduler.trim() || undefined,
    steps: Math.max(1, Math.round(parseNum(f.steps, 8))),
    cfgMin,
    cfgMax: cfgMax < cfgMin ? cfgMin : cfgMax,
    resolution: {
      width: Math.max(64, Math.round(parseNum(f.width, 1024))),
      height: Math.max(64, Math.round(parseNum(f.height, 1024))),
    },
  };
  return {
    name: f.name.trim(),
    summary: f.summary.trim() || undefined,
    notes: f.notes.trim() || undefined,
    settings,
    styleTail: f.styleTail.trim(),
    negative: f.negative.trim(),
    loraIds: parseCsv(f.loraIds),
    universeId: f.universeId.trim() || undefined,
    styleId: f.styleId.trim() || undefined,
    projectTags: parseCsv(f.projectTags),
  };
};

type RecipeLibraryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  isLoading?: boolean;
  onCreate: (input: RecipeInput) => Promise<Recipe>;
  onUpdate: (id: string, input: RecipeInput) => Promise<Recipe>;
  onDelete: (id: string) => Promise<void>;
};

export function RecipeLibraryModal({
  isOpen,
  onClose,
  recipes,
  isLoading = false,
  onCreate,
  onUpdate,
  onDelete,
}: RecipeLibraryModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [query, setQuery] = useState('');

  // Reset transient state when the modal opens.
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
    () => (selectedId ? recipes.find(r => r.id === selectedId) ?? null : null),
    [selectedId, recipes]
  );

  const q = query.trim().toLowerCase();
  const visible = q
    ? recipes.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.summary?.toLowerCase().includes(q) ?? false) ||
        r.projectTags.some(t => t.toLowerCase().includes(q))
      )
    : recipes;

  const showForm = isCreating || selected !== null;

  const handleSelect = (id: string) => {
    const r = recipes.find(x => x.id === id);
    setSelectedId(id);
    setIsCreating(false);
    if (r) setForm(formFromRecipe(r));
    setError(null);
  };

  const handleStartCreate = () => {
    setSelectedId(null);
    setIsCreating(true);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const handleCancel = () => {
    setSelectedId(null);
    setIsCreating(false);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const input = formToInput(form);
    if (!input.name) {
      setError('Name is required.');
      return;
    }
    if (!input.styleTail) {
      setError('Style tail is required.');
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
      setError(err instanceof Error ? err.message : 'Failed to save recipe.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm(`Delete recipe "${selected.name}"? This cannot be undone.`)) return;
    setIsSaving(true);
    try {
      await onDelete(selected.id);
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recipes" className="recipe-library-modal">
      <div className="recipe-lib">
        <aside className="recipe-lib__list">
          <div className="recipe-lib__list-head">
            <input
              type="search"
              className="recipe-lib__search"
              placeholder="Search recipes…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="button" className="recipe-lib__new-btn" onClick={handleStartCreate}>
              + New Recipe
            </button>
          </div>
          {isLoading && <div className="recipe-lib__status">Loading recipes…</div>}
          {!isLoading && visible.length === 0 && (
            <div className="recipe-lib__status">No recipes match.</div>
          )}
          <ul className="recipe-lib__items">
            {visible.map(r => (
              <li key={r.id}>
                <button
                  type="button"
                  className={`recipe-lib__item${r.id === selectedId ? ' is-selected' : ''}`}
                  onClick={() => handleSelect(r.id)}
                >
                  <div className="recipe-lib__item-name">{r.name}</div>
                  {r.summary && <div className="recipe-lib__item-summary">{r.summary}</div>}
                  <div className="recipe-lib__item-meta">
                    <span className="recipe-lib__chip recipe-lib__chip--model">{r.settings.model}</span>
                    {r.projectTags.map(tag => (
                      <span key={tag} className="recipe-lib__chip recipe-lib__chip--tag">{tag}</span>
                    ))}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="recipe-lib__detail">
          {!showForm && (
            <div className="recipe-lib__empty">
              <p>Select a recipe to inspect or edit, or start a new one.</p>
            </div>
          )}
          {showForm && (
            <form className="recipe-lib__form" onSubmit={handleSubmit}>
              <div className="recipe-lib__form-head">
                <h3>{isCreating ? 'New Recipe' : selected?.name}</h3>
                {selected && !isCreating && (
                  <button
                    type="button"
                    className="recipe-lib__delete-btn"
                    onClick={handleDelete}
                    disabled={isSaving}
                  >
                    Delete
                  </button>
                )}
              </div>

              <label className="recipe-lib__field">
                <span>Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </label>

              <label className="recipe-lib__field">
                <span>Summary</span>
                <input
                  type="text"
                  value={form.summary}
                  onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                  placeholder="One-line description"
                />
              </label>

              <label className="recipe-lib__field">
                <span>Notes</span>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="Gotchas, validated context, usage warnings…"
                />
              </label>

              <fieldset className="recipe-lib__settings">
                <legend>Render Settings</legend>
                <div className="recipe-lib__settings-grid">
                  <label className="recipe-lib__field">
                    <span>Model</span>
                    <input
                      type="text"
                      value={form.model}
                      onChange={e => setForm(f => ({ ...f, model: e.target.value }))}
                    />
                  </label>
                  <label className="recipe-lib__field">
                    <span>Sampler</span>
                    <input
                      type="text"
                      value={form.sampler}
                      onChange={e => setForm(f => ({ ...f, sampler: e.target.value }))}
                      placeholder="(default per model)"
                    />
                  </label>
                  <label className="recipe-lib__field">
                    <span>Scheduler</span>
                    <input
                      type="text"
                      value={form.scheduler}
                      onChange={e => setForm(f => ({ ...f, scheduler: e.target.value }))}
                      placeholder="(default)"
                    />
                  </label>
                  <label className="recipe-lib__field">
                    <span>Steps</span>
                    <input
                      type="number"
                      min={1}
                      value={form.steps}
                      onChange={e => setForm(f => ({ ...f, steps: e.target.value }))}
                    />
                  </label>
                  <label className="recipe-lib__field">
                    <span>CFG min</span>
                    <input
                      type="number"
                      step="0.1"
                      value={form.cfgMin}
                      onChange={e => setForm(f => ({ ...f, cfgMin: e.target.value }))}
                    />
                  </label>
                  <label className="recipe-lib__field">
                    <span>CFG max</span>
                    <input
                      type="number"
                      step="0.1"
                      value={form.cfgMax}
                      onChange={e => setForm(f => ({ ...f, cfgMax: e.target.value }))}
                    />
                  </label>
                  <label className="recipe-lib__field">
                    <span>Width</span>
                    <input
                      type="number"
                      min={64}
                      value={form.width}
                      onChange={e => setForm(f => ({ ...f, width: e.target.value }))}
                    />
                  </label>
                  <label className="recipe-lib__field">
                    <span>Height</span>
                    <input
                      type="number"
                      min={64}
                      value={form.height}
                      onChange={e => setForm(f => ({ ...f, height: e.target.value }))}
                    />
                  </label>
                </div>
              </fieldset>

              <label className="recipe-lib__field">
                <span>Style tail</span>
                <textarea
                  rows={5}
                  value={form.styleTail}
                  onChange={e => setForm(f => ({ ...f, styleTail: e.target.value }))}
                  placeholder="Style descriptor appended to every prompt"
                  required
                />
              </label>

              <label className="recipe-lib__field">
                <span>Negative</span>
                <textarea
                  rows={3}
                  value={form.negative}
                  onChange={e => setForm(f => ({ ...f, negative: e.target.value }))}
                  placeholder="Negative prompt"
                />
              </label>

              <div className="recipe-lib__row">
                <label className="recipe-lib__field">
                  <span>LoRA IDs (comma-separated)</span>
                  <input
                    type="text"
                    value={form.loraIds}
                    onChange={e => setForm(f => ({ ...f, loraIds: e.target.value }))}
                    placeholder="lora_seed_..."
                  />
                </label>
                <label className="recipe-lib__field">
                  <span>Project tags (comma-separated)</span>
                  <input
                    type="text"
                    value={form.projectTags}
                    onChange={e => setForm(f => ({ ...f, projectTags: e.target.value }))}
                    placeholder="civitai, ig-erotic"
                  />
                </label>
              </div>

              <div className="recipe-lib__row">
                <label className="recipe-lib__field">
                  <span>Universe ID</span>
                  <input
                    type="text"
                    value={form.universeId}
                    onChange={e => setForm(f => ({ ...f, universeId: e.target.value }))}
                    placeholder="universe_seed_..."
                  />
                </label>
                <label className="recipe-lib__field">
                  <span>Style ID</span>
                  <input
                    type="text"
                    value={form.styleId}
                    onChange={e => setForm(f => ({ ...f, styleId: e.target.value }))}
                    placeholder="style_lab_..."
                  />
                </label>
              </div>

              {error && <div className="recipe-lib__error">{error}</div>}

              <div className="recipe-lib__form-actions">
                <button type="button" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </button>
                <button type="submit" className="recipe-lib__save-btn" disabled={isSaving}>
                  {isSaving ? 'Saving…' : isCreating ? 'Create Recipe' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </Modal>
  );
}
