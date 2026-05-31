import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type {
  PostPlaceholderKey,
  PostTarget,
  PostTemplate,
  PostTemplateInput,
} from '../../types';
import { Modal } from './Modal';
import { detectPostPlaceholders, POST_PLACEHOLDER_TOKENS } from '../../engine/postSubstitute';
import './PostTemplateModal.css';

const TARGETS: PostTarget[] = ['civitai', 'instagram', 'twitter', 'other'];

const RECOMMENDED_PLACEHOLDERS: PostPlaceholderKey[] = [
  'dropName',
  'loreCaption',
  'cta',
];

type FormState = {
  name: string;
  target: PostTarget;
  summary: string;
  notes: string;
  body: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  target: 'civitai',
  summary: '',
  notes: '',
  body: '',
};

const formFromTemplate = (t: PostTemplate): FormState => ({
  name: t.name,
  target: t.target,
  summary: t.summary ?? '',
  notes: t.notes ?? '',
  body: t.body,
});

const formToInput = (f: FormState): PostTemplateInput => ({
  name: f.name.trim(),
  target: f.target,
  summary: f.summary.trim() || undefined,
  notes: f.notes.trim() || undefined,
  body: f.body,
});

type PostTemplateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  templates: PostTemplate[];
  isLoading?: boolean;
  onCreate: (input: PostTemplateInput) => Promise<PostTemplate>;
  onUpdate: (id: string, input: PostTemplateInput) => Promise<PostTemplate>;
  onDelete: (id: string) => Promise<void>;
};

export function PostTemplateModal({
  isOpen,
  onClose,
  templates,
  isLoading = false,
  onCreate,
  onUpdate,
  onDelete,
}: PostTemplateModalProps) {
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

  const placeholdersFound = useMemo(() => detectPostPlaceholders(form.body), [form.body]);
  const placeholdersMissing = RECOMMENDED_PLACEHOLDERS.filter(p => !placeholdersFound.includes(p));

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
      setError('Paste your post body in the body field.');
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
    if (!window.confirm(`Delete post template "${selected.name}"? This cannot be undone.`)) return;
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
    <Modal isOpen={isOpen} onClose={onClose} title="Post Templates" className="post-template-modal">
      <div className="post-lib">
        <aside className="post-lib__list">
          <div className="post-lib__list-head">
            <button type="button" className="post-lib__new-btn" onClick={handleStartCreate}>
              + New Post Template
            </button>
          </div>
          {isLoading && <div className="post-lib__status">Loading templates…</div>}
          {!isLoading && templates.length === 0 && (
            <div className="post-lib__status">
              No post templates yet. Click + New, paste a sample post body, and embed
              tokens like <code>{'{{dropName}}'}</code>, <code>{'{{loreCaption}}'}</code>,
              and <code>{'{{cta}}'}</code> where the per-drop values should be filled.
            </div>
          )}
          <ul className="post-lib__items">
            {templates.map(t => (
              <li key={t.id}>
                <button
                  type="button"
                  className={`post-lib__item${t.id === selectedId ? ' is-selected' : ''}`}
                  onClick={() => handleSelect(t.id)}
                >
                  <div className="post-lib__item-name">{t.name}</div>
                  {t.summary && <div className="post-lib__item-summary">{t.summary}</div>}
                  <div className="post-lib__item-meta">
                    <span className="post-lib__chip post-lib__chip--target">{t.target}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="post-lib__detail">
          {!showForm && (
            <div className="post-lib__empty">
              <p>Select a template to inspect or edit, or paste a new one.</p>
              <div className="post-lib__placeholder-help">
                <strong>Tokens available in the body:</strong>
                <ul>
                  {POST_PLACEHOLDER_TOKENS.map(tok => (
                    <li key={tok}><code>{tok}</code></li>
                  ))}
                </ul>
                <p>
                  All tokens are plain string replacement (no JSON escaping — output is prose).
                  Auto-filled tokens come from the Drop/Recipe/Universe; the <code>loreCaption</code> /
                  <code>cta</code> / <code>styleNotes</code> / <code>extraTags</code> tokens are filled
                  per drop at "Draft Post" time.
                </p>
              </div>
            </div>
          )}
          {showForm && (
            <form className="post-lib__form" onSubmit={handleSubmit}>
              <div className="post-lib__form-head">
                <h3>{isCreating ? 'New Post Template' : selected?.name}</h3>
                {selected && !isCreating && (
                  <button
                    type="button"
                    className="post-lib__delete-btn"
                    onClick={handleDelete}
                    disabled={isSaving}
                  >
                    Delete
                  </button>
                )}
              </div>

              <div className="post-lib__row">
                <label className="post-lib__field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. CivitAI Atlas Post"
                    required
                  />
                </label>
                <label className="post-lib__field">
                  <span>Target</span>
                  <select
                    value={form.target}
                    onChange={e => setForm(f => ({ ...f, target: e.target.value as PostTarget }))}
                  >
                    {TARGETS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="post-lib__field">
                <span>Summary</span>
                <input
                  type="text"
                  value={form.summary}
                  onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                  placeholder="One-line description"
                />
              </label>

              <label className="post-lib__field">
                <span>Notes</span>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  placeholder="When to use this template, voice/tone guidance, etc."
                />
              </label>

              <label className="post-lib__field">
                <span>Post body</span>
                <textarea
                  rows={14}
                  className="post-lib__body"
                  value={form.body}
                  onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                  placeholder={'Paste your post template here. Use tokens like {{dropName}}, {{loreCaption}}, {{cta}}, {{projectTagsHashtags}} where per-drop values should go.'}
                />
              </label>

              <div className="post-lib__placeholder-status">
                <div className="post-lib__placeholder-row">
                  <strong>Tokens found:</strong>{' '}
                  {placeholdersFound.length === 0 ? (
                    <em className="post-lib__placeholder-none">none yet</em>
                  ) : (
                    placeholdersFound.map(p => (
                      <code key={p} className="post-lib__placeholder-found">{'{{'}{p}{'}}'}</code>
                    ))
                  )}
                </div>
                {placeholdersMissing.length > 0 && (
                  <div className="post-lib__placeholder-row">
                    <strong>Recommended but missing:</strong>{' '}
                    {placeholdersMissing.map(p => (
                      <code key={p} className="post-lib__placeholder-missing">{'{{'}{p}{'}}'}</code>
                    ))}
                  </div>
                )}
              </div>

              {error && <div className="post-lib__error">{error}</div>}

              <div className="post-lib__form-actions">
                <button type="button" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </button>
                <button type="submit" className="post-lib__save-btn" disabled={isSaving}>
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
