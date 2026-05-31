import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type {
  LoraModelFamily,
  WorkflowPlaceholderKey,
  WorkflowTemplate,
  WorkflowTemplateInput,
} from '../../types';
import { Modal } from './Modal';
import { detectPlaceholders, PLACEHOLDER_TOKENS } from '../../engine/workflowSubstitute';
import './WorkflowTemplateModal.css';

const MODEL_FAMILIES: LoraModelFamily[] = [
  'z-image-turbo',
  'flux',
  'illustrious',
  'sdxl',
  'other',
];

const RECOMMENDED_PLACEHOLDERS: WorkflowPlaceholderKey[] = [
  'positive',
  'negative',
  'seed',
  'steps',
  'cfg',
  'width',
  'height',
];

type FormState = {
  name: string;
  modelFamily: LoraModelFamily;
  summary: string;
  notes: string;
  body: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  modelFamily: 'z-image-turbo',
  summary: '',
  notes: '',
  body: '',
};

const formFromTemplate = (t: WorkflowTemplate): FormState => ({
  name: t.name,
  modelFamily: t.modelFamily,
  summary: t.summary ?? '',
  notes: t.notes ?? '',
  body: t.body,
});

const formToInput = (f: FormState): WorkflowTemplateInput => ({
  name: f.name.trim(),
  modelFamily: f.modelFamily,
  summary: f.summary.trim() || undefined,
  notes: f.notes.trim() || undefined,
  body: f.body,
});

const isValidJson = (text: string): boolean => {
  if (!text.trim()) return false;
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};

type WorkflowTemplateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  templates: WorkflowTemplate[];
  isLoading?: boolean;
  onCreate: (input: WorkflowTemplateInput) => Promise<WorkflowTemplate>;
  onUpdate: (id: string, input: WorkflowTemplateInput) => Promise<WorkflowTemplate>;
  onDelete: (id: string) => Promise<void>;
};

export function WorkflowTemplateModal({
  isOpen,
  onClose,
  templates,
  isLoading = false,
  onCreate,
  onUpdate,
  onDelete,
}: WorkflowTemplateModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedId(null);
      setIsCreating(false);
      setForm(EMPTY_FORM);
      setError(null);
    }
  }, [isOpen]);

  const selected = useMemo(
    () => (selectedId ? templates.find(t => t.id === selectedId) ?? null : null),
    [selectedId, templates]
  );

  const placeholdersFound = useMemo(() => detectPlaceholders(form.body), [form.body]);
  const placeholdersMissing = RECOMMENDED_PLACEHOLDERS.filter(p => !placeholdersFound.includes(p));
  const bodyValidJson = useMemo(() => isValidJson(form.body), [form.body]);

  const showForm = isCreating || selected !== null;

  const handleSelect = (id: string) => {
    const t = templates.find(x => x.id === id);
    setSelectedId(id);
    setIsCreating(false);
    if (t) setForm(formFromTemplate(t));
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
      setError('Template name is required.');
      return;
    }
    if (!input.body.trim()) {
      setError('Paste your ComfyUI workflow JSON in the body field.');
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
      setError(err instanceof Error ? err.message : 'Failed to save template.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!window.confirm(`Delete template "${selected.name}"? This cannot be undone.`)) return;
    setIsSaving(true);
    try {
      await onDelete(selected.id);
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Workflow Templates" className="workflow-template-modal">
      <div className="wft-lib">
        <aside className="wft-lib__list">
          <div className="wft-lib__list-head">
            <button type="button" className="wft-lib__new-btn" onClick={handleStartCreate}>
              + New Template
            </button>
          </div>
          {isLoading && <div className="wft-lib__status">Loading templates…</div>}
          {!isLoading && templates.length === 0 && (
            <div className="wft-lib__status">
              No templates yet. Click + New Template, paste your ComfyUI workflow JSON,
              and replace prompt/seed/etc. values with the placeholder tokens listed on the right.
            </div>
          )}
          <ul className="wft-lib__items">
            {templates.map(t => (
              <li key={t.id}>
                <button
                  type="button"
                  className={`wft-lib__item${t.id === selectedId ? ' is-selected' : ''}`}
                  onClick={() => handleSelect(t.id)}
                >
                  <div className="wft-lib__item-name">{t.name}</div>
                  {t.summary && <div className="wft-lib__item-summary">{t.summary}</div>}
                  <div className="wft-lib__item-meta">
                    <span className="wft-lib__chip wft-lib__chip--family">{t.modelFamily}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="wft-lib__detail">
          {!showForm && (
            <div className="wft-lib__empty">
              <p>Select a template to inspect or edit, or paste a new ComfyUI workflow.</p>
              <div className="wft-lib__placeholder-help">
                <strong>Placeholder tokens to embed in your workflow JSON:</strong>
                <ul>
                  {PLACEHOLDER_TOKENS.map(tok => (
                    <li key={tok}><code>{tok}</code></li>
                  ))}
                </ul>
                <p>
                  String tokens (e.g. <code>{'{{positive}}'}</code>) go inside JSON quotes;
                  numeric tokens (e.g. <code>{'{{steps}}'}</code>) go without quotes.
                  Substitution is plain string-replace at export time.
                </p>
              </div>
            </div>
          )}
          {showForm && (
            <form className="wft-lib__form" onSubmit={handleSubmit}>
              <div className="wft-lib__form-head">
                <h3>{isCreating ? 'New Template' : selected?.name}</h3>
                {selected && !isCreating && (
                  <button
                    type="button"
                    className="wft-lib__delete-btn"
                    onClick={handleDelete}
                    disabled={isSaving}
                  >
                    Delete
                  </button>
                )}
              </div>

              <div className="wft-lib__row">
                <label className="wft-lib__field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Z-Image-Turbo Basic 4:5"
                    required
                  />
                </label>
                <label className="wft-lib__field">
                  <span>Model family</span>
                  <select
                    value={form.modelFamily}
                    onChange={e => setForm(f => ({ ...f, modelFamily: e.target.value as LoraModelFamily }))}
                  >
                    {MODEL_FAMILIES.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="wft-lib__field">
                <span>Summary</span>
                <input
                  type="text"
                  value={form.summary}
                  onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                  placeholder="One-line description"
                />
              </label>

              <label className="wft-lib__field">
                <span>Notes</span>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="LoRA setup, sampler quirks, anything worth remembering"
                />
              </label>

              <label className="wft-lib__field">
                <span>
                  Workflow JSON body{' '}
                  {bodyValidJson ? (
                    <span className="wft-lib__valid-badge">✓ valid JSON</span>
                  ) : form.body.trim() ? (
                    <span className="wft-lib__invalid-badge">! invalid JSON (substitution still runs)</span>
                  ) : null}
                </span>
                <textarea
                  rows={14}
                  className="wft-lib__body"
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder='Paste your ComfyUI workflow JSON here, then replace the prompt text with {{positive}}, the negative with {{negative}}, the seed with {{seed}}, etc.'
                  spellCheck={false}
                />
              </label>

              <div className="wft-lib__placeholder-status">
                <div className="wft-lib__placeholder-row">
                  <strong>Placeholders found:</strong>{' '}
                  {placeholdersFound.length === 0 ? (
                    <em className="wft-lib__placeholder-none">none yet</em>
                  ) : (
                    placeholdersFound.map(p => (
                      <code key={p} className="wft-lib__placeholder-found">{'{{'}{p}{'}}'}</code>
                    ))
                  )}
                </div>
                {placeholdersMissing.length > 0 && (
                  <div className="wft-lib__placeholder-row">
                    <strong>Recommended but missing:</strong>{' '}
                    {placeholdersMissing.map(p => (
                      <code key={p} className="wft-lib__placeholder-missing">{'{{'}{p}{'}}'}</code>
                    ))}
                  </div>
                )}
              </div>

              {error && <div className="wft-lib__error">{error}</div>}

              <div className="wft-lib__form-actions">
                <button type="button" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </button>
                <button type="submit" className="wft-lib__save-btn" disabled={isSaving}>
                  {isSaving ? 'Saving…' : isCreating ? 'Create Template' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </Modal>
  );
}
