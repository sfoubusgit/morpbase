import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import type { EnvironmentIdentity, EnvironmentIdentityInput } from '../../types';
import { processCoverImage } from '../utils/coverImageUtils';
import './EnvironmentLibrarySurface.css';

type EnvironmentLibrarySurfaceProps = {
  environments: EnvironmentIdentity[];
  activeEnvironmentIds: string[];
  isLoading?: boolean;
  onSelectEnvironment: (environmentId: string) => void;
  onCreateEnvironment: (input: EnvironmentIdentityInput) => Promise<EnvironmentIdentity>;
  onUpdateEnvironment: (environmentId: string, input: EnvironmentIdentityInput) => Promise<EnvironmentIdentity>;
  onDeleteEnvironment: (environmentId: string) => Promise<void>;
  universeFilter?: string[];
  universeName?: string;
};

type EnvironmentFormState = {
  name: string;
  summary: string;
  coverImageUrl: string;
  corePhrases: string;
};

const EMPTY_FORM: EnvironmentFormState = {
  name: '',
  summary: '',
  coverImageUrl: '',
  corePhrases: '',
};

const formFromEnvironment = (env: EnvironmentIdentity): EnvironmentFormState => ({
  name: env.name,
  summary: env.summary ?? '',
  coverImageUrl: env.coverImageUrl ?? '',
  corePhrases: env.phraseBundle.core.join('\n'),
});

const formToInput = (form: EnvironmentFormState): EnvironmentIdentityInput => ({
  name: form.name.trim(),
  summary: form.summary.trim() || undefined,
  coverImageUrl: form.coverImageUrl.trim() || null,
  phraseBundle: {
    core: form.corePhrases
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean),
  },
});

export function EnvironmentLibrarySurface({
  environments,
  activeEnvironmentIds,
  isLoading = false,
  onSelectEnvironment,
  onCreateEnvironment,
  onUpdateEnvironment,
  onDeleteEnvironment,
  universeFilter,
  universeName,
}: EnvironmentLibrarySurfaceProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<EnvironmentFormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingCover, setIsProcessingCover] = useState(false);

  const selectedEnvironment = environments.find(e => e.id === selectedId) ?? null;

  const handleSelectItem = (id: string) => {
    setSelectedId(id);
    setIsCreating(false);
    const env = environments.find(e => e.id === id);
    if (env) setForm(formFromEnvironment(env));
    setError(null);
  };

  const handleStartCreate = () => {
    setSelectedId(null);
    setIsCreating(true);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const handleApply = (id: string) => {
    onSelectEnvironment(id);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      const input = formToInput(form);
      if (isCreating) {
        const created = await onCreateEnvironment(input);
        setSelectedId(created.id);
        setIsCreating(false);
        setForm(formFromEnvironment(created));
      } else if (selectedId) {
        const updated = await onUpdateEnvironment(selectedId, input);
        setForm(formFromEnvironment(updated));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const env = environments.find(e => e.id === selectedId);
    if (!env) return;
    if (!window.confirm(`Delete "${env.name}"? This cannot be undone.`)) return;
    try {
      await onDeleteEnvironment(selectedId);
      setSelectedId(null);
      setIsCreating(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    }
  };

  const handleCancel = () => {
    if (selectedEnvironment) {
      setForm(formFromEnvironment(selectedEnvironment));
    } else {
      setIsCreating(false);
      setForm(EMPTY_FORM);
    }
    setError(null);
  };

  const handleCoverSelected = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessingCover(true);
      setError(null);
      const dataUrl = await processCoverImage(file);
      setForm(prev => ({ ...prev, coverImageUrl: dataUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process cover image.');
    } finally {
      setIsProcessingCover(false);
      e.target.value = '';
    }
  };

  const visibleEnvironments = useMemo(
    () => universeFilter && universeFilter.length > 0
      ? environments.filter(e => universeFilter.includes(e.id))
      : environments,
    [environments, universeFilter]
  );

  const showForm = isCreating || selectedId !== null;

  return (
    <div className="environment-library">
      <input
        ref={coverInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        style={{ display: 'none' }}
        onChange={e => void handleCoverSelected(e)}
      />

      <div className="environment-library-intro">
        <div>
          <div className="environment-library-kicker">Environment Identity Lane</div>
          <p className="environment-library-description">
            Build reusable scene identities. Activate one to inject its core phrases into every prompt alongside your character.
          </p>
        </div>
        <button type="button" className="environment-library-new-button" onClick={handleStartCreate}>
          New Environment
        </button>
      </div>

      <div className="environment-library-layout">
        <div className="environment-library-panel">
          <div className="environment-library-panel-header">
            <div className="environment-library-panel-title">Saved Environments</div>
            <button
              type="button"
              className="environment-library-new-button"
              onClick={handleStartCreate}
            >
              + New
            </button>
          </div>

          {universeFilter && universeFilter.length > 0 && (
            <div className="identity-lane-universe-banner">
              {universeName ? `Universe: ${universeName}` : 'Universe active'} — showing {universeFilter.length} curated environment{universeFilter.length === 1 ? '' : 's'}
            </div>
          )}

          {isLoading && (
            <div className="environment-library-message">Loading…</div>
          )}

          {!isLoading && environments.length === 0 && (
            <div className="environment-library-empty">
              No environments yet. Create your first one.
            </div>
          )}

          {!isLoading && environments.length > 0 && (
            <div className="environment-library-list">
              {visibleEnvironments.map(env => {
                const isActive = activeEnvironmentIds.includes(env.id);
                const isSelected = selectedId === env.id;
                return (
                  <div
                    key={env.id}
                    role="button"
                    tabIndex={0}
                    className={[
                      'environment-library-item',
                      isSelected ? 'environment-library-item-selected' : '',
                      isActive ? 'environment-library-item-active' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => handleSelectItem(env.id)}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleSelectItem(env.id)}
                  >
                    <div className="environment-library-item-main">
                      <div className="environment-library-item-name">{env.name}</div>
                      {env.summary && (
                        <div className="environment-library-item-summary">{env.summary}</div>
                      )}
                      {isActive && (
                        <div className="environment-library-item-badge">Active</div>
                      )}
                    </div>
                    <button
                      type="button"
                      className={`environment-library-item-toggle${isActive ? ' environment-library-item-toggle-on' : ''}`}
                      onClick={e => { e.stopPropagation(); onSelectEnvironment(env.id); }}
                      title={isActive ? 'Remove' : 'Add to prompt'}
                    >
                      {isActive ? '✓' : '+'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="environment-library-panel">
          {!showForm && (
            <div className="environment-library-empty-state">
              <div className="environment-library-empty-state-title">Select or create an environment</div>
              <p>An Environment Identity is a reusable named scene — a place with its own phrase bundle that activates into the prompt.</p>
            </div>
          )}

          {showForm && (
            <form className="environment-library-form" onSubmit={handleSave}>
              <div className="environment-library-form-header">
                <div className="environment-library-form-title">
                  {isCreating ? 'New Environment' : selectedEnvironment?.name ?? 'Edit Environment'}
                </div>
                {selectedId && !isCreating && (
                  <button
                    type="button"
                    className="environment-library-apply-button"
                    onClick={() => handleApply(selectedId)}
                  >
                    Select
                  </button>
                )}
              </div>

              {error && <div className="environment-library-error">{error}</div>}

              <label className="environment-library-field">
                <span>Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Obsidian Market at Dusk"
                  required
                />
              </label>

              <label className="environment-library-field">
                <span>Summary <span className="environment-library-optional">(optional)</span></span>
                <input
                  type="text"
                  value={form.summary}
                  onChange={e => setForm(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="One sentence about this place"
                />
              </label>

              <div className="environment-library-field">
                <span>Cover image <span className="environment-library-optional">(optional)</span></span>
                <div className="environment-library-cover-upload">
                  <button
                    type="button"
                    className="environment-library-cancel-button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isProcessingCover || isSaving}
                  >
                    {isProcessingCover ? 'Processing…' : form.coverImageUrl ? 'Change Cover' : 'Upload Cover'}
                  </button>
                  {form.coverImageUrl && (
                    <button
                      type="button"
                      className="environment-library-delete-button"
                      onClick={() => setForm(prev => ({ ...prev, coverImageUrl: '' }))}
                      disabled={isProcessingCover || isSaving}
                    >
                      Remove
                    </button>
                  )}
                </div>
                {form.coverImageUrl && (
                  <div className="environment-library-cover-preview">
                    <img src={form.coverImageUrl} alt="Cover preview" />
                  </div>
                )}
              </div>

              <label className="environment-library-field">
                <span>Core phrases <span className="environment-library-hint">one per line</span></span>
                <textarea
                  value={form.corePhrases}
                  onChange={e => setForm(prev => ({ ...prev, corePhrases: e.target.value }))}
                  placeholder={`ancient obsidian marketplace\nwarm lantern light against deep blue dusk sky\nstone archways carved with geometric patterns`}
                  rows={6}
                />
              </label>

              <div className="environment-library-form-actions">
                <button
                  type="submit"
                  className="environment-library-save-button"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving…' : isCreating ? 'Create' : 'Save'}
                </button>
                {!isCreating && selectedId && (
                  <button
                    type="button"
                    className="environment-library-delete-button"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  className="environment-library-cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
