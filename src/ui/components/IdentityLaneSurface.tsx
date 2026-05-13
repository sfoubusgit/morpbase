import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { processCoverImage } from '../utils/coverImageUtils';
import './IdentityLaneSurface.css';

export type LaneItem = {
  id: string;
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  phrases: string[];
};

export type LaneItemInput = {
  name: string;
  summary?: string;
  coverImageUrl?: string | null;
  phrases: string[];
};

export type IdentityLaneSurfaceConfig = {
  kickerText: string;
  description: string;
  entityLabel: string;
  entityLabelPlural: string;
  phrasesPlaceholder: string;
  variant: 'style' | 'lighting' | 'composition' | 'mood' | 'negative';
};

type FormState = {
  name: string;
  summary: string;
  coverImageUrl: string;
  phrases: string;
};

const EMPTY_FORM: FormState = { name: '', summary: '', coverImageUrl: '', phrases: '' };

const formFromItem = (item: LaneItem): FormState => ({
  name: item.name,
  summary: item.summary ?? '',
  coverImageUrl: item.coverImageUrl ?? '',
  phrases: item.phrases.join('\n'),
});

const formToInput = (form: FormState): LaneItemInput => ({
  name: form.name.trim(),
  summary: form.summary.trim() || undefined,
  coverImageUrl: form.coverImageUrl.trim() || null,
  phrases: form.phrases.split('\n').map(l => l.trim()).filter(Boolean),
});

type IdentityLaneSurfaceProps = {
  config: IdentityLaneSurfaceConfig;
  items: LaneItem[];
  activeItemIds: string[];
  isLoading?: boolean;
  onSelectItem: (id: string) => void;
  onCreateItem: (input: LaneItemInput) => Promise<LaneItem>;
  onUpdateItem: (id: string, input: LaneItemInput) => Promise<LaneItem>;
  onDeleteItem: (id: string) => Promise<void>;
  onApplied?: () => void;
};

export function IdentityLaneSurface({
  config,
  items,
  activeItemIds,
  isLoading = false,
  onSelectItem,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
  onApplied,
}: IdentityLaneSurfaceProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingCover, setIsProcessingCover] = useState(false);

  const selectedItem = items.find(i => i.id === selectedId) ?? null;
  const showForm = isCreating || selectedId !== null;

  const handleSelectItem = (id: string) => {
    setSelectedId(id);
    setIsCreating(false);
    const item = items.find(i => i.id === id);
    if (item) setForm(formFromItem(item));
    setError(null);
  };

  const handleStartCreate = () => {
    setSelectedId(null);
    setIsCreating(true);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const handleApply = (id: string) => {
    const isActive = activeItemIds.includes(id);
    onSelectItem(id);
    if (!isActive) onApplied?.();
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      const input = formToInput(form);
      if (isCreating) {
        const created = await onCreateItem(input);
        setSelectedId(created.id);
        setIsCreating(false);
        setForm(formFromItem(created));
      } else if (selectedId) {
        const updated = await onUpdateItem(selectedId, input);
        setForm(formFromItem(updated));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const item = items.find(i => i.id === selectedId);
    if (!item) return;
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    try {
      await onDeleteItem(selectedId);
      if (selectedId && activeItemIds.includes(selectedId)) onSelectItem(selectedId);
      setSelectedId(null);
      setIsCreating(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    }
  };

  const handleCancel = () => {
    if (selectedItem) {
      setForm(formFromItem(selectedItem));
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

  return (
    <div className="identity-lane-surface" data-variant={config.variant}>
      <input
        ref={coverInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        style={{ display: 'none' }}
        onChange={e => void handleCoverSelected(e)}
      />
      <div className="identity-lane-intro">
        <div>
          <div className="identity-lane-kicker">{config.kickerText}</div>
          <p className="identity-lane-description">{config.description}</p>
        </div>
        <button type="button" className="identity-lane-primary-button" onClick={handleStartCreate}>
          New {config.entityLabel}
        </button>
      </div>

      <div className="identity-lane-layout">
        <div className="identity-lane-panel">
          <div className="identity-lane-panel-header">
            <div className="identity-lane-panel-title">{config.entityLabelPlural}</div>
            <div className="identity-lane-panel-subtitle">
              {items.length} {items.length === 1 ? config.entityLabel.toLowerCase() : config.entityLabelPlural.toLowerCase()}
            </div>
          </div>

          {isLoading && <div className="identity-lane-empty">Loading…</div>}

          {!isLoading && items.length === 0 && (
            <div className="identity-lane-empty">
              <strong>No {config.entityLabelPlural.toLowerCase()} yet.</strong>
              <span>Create one to start building your library.</span>
            </div>
          )}

          {!isLoading && items.length > 0 && (
            <div className="identity-lane-list">
              {items.map(item => {
                const isActive = activeItemIds.includes(item.id);
                const isSelected = item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      'identity-lane-item',
                      isSelected ? 'identity-lane-item-selected' : '',
                      isActive ? 'identity-lane-item-active' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => handleSelectItem(item.id)}
                  >
                    <div className="identity-lane-item-name">{item.name}</div>
                    {item.summary && (
                      <div className="identity-lane-item-summary">{item.summary}</div>
                    )}
                    {isActive && <div className="identity-lane-item-badge">Active</div>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="identity-lane-panel">
          {!showForm && (
            <div className="identity-lane-empty-state">
              <div className="identity-lane-empty-state-title">
                Select or create a {config.entityLabel.toLowerCase()}
              </div>
              <p>
                {config.entityLabelPlural} are reusable phrase bundles.
                Activate one and its phrases are injected into every prompt you generate.
              </p>
            </div>
          )}

          {showForm && (
            <form className="identity-lane-form" onSubmit={handleSave}>
              <div className="identity-lane-form-header">
                <div className="identity-lane-form-title">
                  {isCreating ? `New ${config.entityLabel}` : (selectedItem?.name ?? `Edit ${config.entityLabel}`)}
                </div>
                {selectedId && !isCreating && (
                  <button
                    type="button"
                    className={`identity-lane-activate-button ${activeItemIds.includes(selectedId) ? 'identity-lane-activate-button-on' : ''}`}
                    onClick={() => handleApply(selectedId)}
                  >
                    {activeItemIds.includes(selectedId) ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </div>

              {error && <div className="identity-lane-error">{error}</div>}

              <label className="identity-lane-field">
                <span>Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={`e.g. My ${config.entityLabel}`}
                  required
                />
              </label>

              <label className="identity-lane-field">
                <span>Summary <span className="identity-lane-optional">(optional)</span></span>
                <input
                  type="text"
                  value={form.summary}
                  onChange={e => setForm(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="One sentence describing this preset"
                />
              </label>

              <div className="identity-lane-field">
                <span>Cover image <span className="identity-lane-optional">(optional)</span></span>
                <div className="identity-lane-cover-upload">
                  <button
                    type="button"
                    className="identity-lane-secondary-button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isProcessingCover || isSaving}
                  >
                    {isProcessingCover ? 'Processing…' : form.coverImageUrl ? 'Change Cover' : 'Upload Cover'}
                  </button>
                  {form.coverImageUrl && (
                    <button
                      type="button"
                      className="identity-lane-danger-button"
                      onClick={() => setForm(prev => ({ ...prev, coverImageUrl: '' }))}
                      disabled={isProcessingCover || isSaving}
                    >
                      Remove
                    </button>
                  )}
                </div>
                {form.coverImageUrl && (
                  <div className="identity-lane-cover-preview">
                    <img src={form.coverImageUrl} alt="Cover preview" />
                  </div>
                )}
              </div>

              <label className="identity-lane-field">
                <span>Phrases <span className="identity-lane-hint">one per line</span></span>
                <textarea
                  value={form.phrases}
                  onChange={e => setForm(prev => ({ ...prev, phrases: e.target.value }))}
                  placeholder={config.phrasesPlaceholder}
                  rows={6}
                />
              </label>

              <div className="identity-lane-form-actions">
                <button type="submit" className="identity-lane-primary-button" disabled={isSaving}>
                  {isSaving ? 'Saving…' : isCreating ? 'Create' : 'Save'}
                </button>
                {!isCreating && selectedId && (
                  <button type="button" className="identity-lane-danger-button" onClick={handleDelete}>
                    Delete
                  </button>
                )}
                <button type="button" className="identity-lane-secondary-button" onClick={handleCancel}>
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
