import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import type { OutfitIdentity, OutfitIdentityInput } from '../../types';
import { processCoverImage } from '../utils/coverImageUtils';
import './WardrobeSurface.css';

type WardrobeSurfaceProps = {
  outfits: OutfitIdentity[];
  activeOutfitIds: string[];
  isLoading?: boolean;
  onSelectOutfit: (outfitId: string) => void;
  onCreateOutfit: (input: OutfitIdentityInput) => Promise<OutfitIdentity>;
  onUpdateOutfit: (outfitId: string, input: OutfitIdentityInput) => Promise<OutfitIdentity>;
  onDeleteOutfit: (outfitId: string) => Promise<void>;
  onApplied?: () => void;
};

type OutfitFormState = {
  name: string;
  summary: string;
  coverImageUrl: string;
  phrases: string;
};

const EMPTY_FORM: OutfitFormState = { name: '', summary: '', coverImageUrl: '', phrases: '' };

const formFromOutfit = (outfit: OutfitIdentity): OutfitFormState => ({
  name: outfit.name,
  summary: outfit.summary ?? '',
  coverImageUrl: outfit.coverImageUrl ?? '',
  phrases: outfit.phrases.join('\n'),
});

const formToInput = (form: OutfitFormState): OutfitIdentityInput => ({
  name: form.name.trim(),
  summary: form.summary.trim() || undefined,
  coverImageUrl: form.coverImageUrl.trim() || null,
  phrases: form.phrases.split('\n').map(l => l.trim()).filter(Boolean),
});

export function WardrobeSurface({
  outfits,
  activeOutfitIds,
  isLoading = false,
  onSelectOutfit,
  onCreateOutfit,
  onUpdateOutfit,
  onDeleteOutfit,
  onApplied,
}: WardrobeSurfaceProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<OutfitFormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingCover, setIsProcessingCover] = useState(false);

  const selectedOutfit = outfits.find(o => o.id === selectedId) ?? null;
  const showForm = isCreating || selectedId !== null;

  const handleSelectItem = (id: string) => {
    setSelectedId(id);
    setIsCreating(false);
    const outfit = outfits.find(o => o.id === id);
    if (outfit) setForm(formFromOutfit(outfit));
    setError(null);
  };

  const handleStartCreate = () => {
    setSelectedId(null);
    setIsCreating(true);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const handleApply = (id: string) => {
    const isActive = activeOutfitIds.includes(id);
    onSelectOutfit(id);
    if (!isActive) onApplied?.();
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);
    try {
      const input = formToInput(form);
      if (isCreating) {
        const created = await onCreateOutfit(input);
        setSelectedId(created.id);
        setIsCreating(false);
        setForm(formFromOutfit(created));
      } else if (selectedId) {
        const updated = await onUpdateOutfit(selectedId, input);
        setForm(formFromOutfit(updated));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    const outfit = outfits.find(o => o.id === selectedId);
    if (!outfit) return;
    if (!window.confirm(`Delete "${outfit.name}"? This cannot be undone.`)) return;
    try {
      await onDeleteOutfit(selectedId);
      if (selectedId && activeOutfitIds.includes(selectedId)) onSelectOutfit(selectedId);
      setSelectedId(null);
      setIsCreating(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    }
  };

  const handleCancel = () => {
    if (selectedOutfit) {
      setForm(formFromOutfit(selectedOutfit));
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
    <div className="wardrobe-surface">
      <input
        ref={coverInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        style={{ display: 'none' }}
        onChange={e => void handleCoverSelected(e)}
      />
      <div className="wardrobe-intro">
        <div>
          <div className="wardrobe-kicker">Global Wardrobe</div>
          <p className="wardrobe-description">
            Outfits are shared across all characters. Activate one to append its phrases to the current prompt alongside the active character.
          </p>
        </div>
        <button type="button" className="wardrobe-primary-button" onClick={handleStartCreate}>
          New Outfit
        </button>
      </div>

      <div className="wardrobe-layout">
        <div className="wardrobe-panel">
          <div className="wardrobe-panel-header">
            <div className="wardrobe-panel-title">Wardrobe Library</div>
            <div className="wardrobe-panel-subtitle">
              {outfits.length} outfit{outfits.length === 1 ? '' : 's'}
            </div>
          </div>

          {isLoading && <div className="wardrobe-empty">Loading…</div>}

          {!isLoading && outfits.length === 0 && (
            <div className="wardrobe-empty">
              <strong>No outfits yet.</strong>
              <span>Create one to start building your wardrobe library.</span>
            </div>
          )}

          {!isLoading && outfits.length > 0 && (
            <div className="wardrobe-list">
              {outfits.map(outfit => {
                const isActive = activeOutfitIds.includes(outfit.id);
                const isSelected = outfit.id === selectedId;
                return (
                  <button
                    key={outfit.id}
                    type="button"
                    className={[
                      'wardrobe-item',
                      isSelected ? 'wardrobe-item-selected' : '',
                      isActive ? 'wardrobe-item-active' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => handleSelectItem(outfit.id)}
                  >
                    <div className="wardrobe-item-name">{outfit.name}</div>
                    {outfit.summary && (
                      <div className="wardrobe-item-summary">{outfit.summary}</div>
                    )}
                    {isActive && <div className="wardrobe-item-badge">Active</div>}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="wardrobe-panel">
          {!showForm && (
            <div className="wardrobe-empty-state">
              <div className="wardrobe-empty-state-title">Select or create an outfit</div>
              <p>Outfits are reusable collections of appearance phrases. Activate one and its phrases join the prompt alongside the character.</p>
            </div>
          )}

          {showForm && (
            <form className="wardrobe-form" onSubmit={handleSave}>
              <div className="wardrobe-form-header">
                <div className="wardrobe-form-title">
                  {isCreating ? 'New Outfit' : selectedOutfit?.name ?? 'Edit Outfit'}
                </div>
                {selectedId && !isCreating && (
                  <button
                    type="button"
                    className={`wardrobe-activate-button ${activeOutfitIds.includes(selectedId) ? 'wardrobe-activate-button-on' : ''}`}
                    onClick={() => handleApply(selectedId)}
                  >
                    {activeOutfitIds.includes(selectedId) ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </div>

              {error && <div className="wardrobe-error">{error}</div>}

              <label className="wardrobe-field">
                <span>Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Traveling Cloak"
                  required
                />
              </label>

              <label className="wardrobe-field">
                <span>Summary <span className="wardrobe-optional">(optional)</span></span>
                <input
                  type="text"
                  value={form.summary}
                  onChange={e => setForm(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="One sentence about this outfit"
                />
              </label>

              <div className="wardrobe-field">
                <span>Cover image <span className="wardrobe-optional">(optional)</span></span>
                <div className="wardrobe-cover-upload">
                  <button
                    type="button"
                    className="wardrobe-secondary-button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={isProcessingCover || isSaving}
                  >
                    {isProcessingCover ? 'Processing…' : form.coverImageUrl ? 'Change Cover' : 'Upload Cover'}
                  </button>
                  {form.coverImageUrl && (
                    <button
                      type="button"
                      className="wardrobe-danger-button"
                      onClick={() => setForm(prev => ({ ...prev, coverImageUrl: '' }))}
                      disabled={isProcessingCover || isSaving}
                    >
                      Remove
                    </button>
                  )}
                </div>
                {form.coverImageUrl && (
                  <div className="wardrobe-cover-preview">
                    <img src={form.coverImageUrl} alt="Cover preview" />
                  </div>
                )}
              </div>

              <label className="wardrobe-field">
                <span>Phrases <span className="wardrobe-hint">one per line</span></span>
                <textarea
                  value={form.phrases}
                  onChange={e => setForm(prev => ({ ...prev, phrases: e.target.value }))}
                  placeholder={`heavy weathered wool cloak, hood down\nleather shoulder clasp and travel-worn boots`}
                  rows={6}
                />
              </label>

              <div className="wardrobe-form-actions">
                <button type="submit" className="wardrobe-primary-button" disabled={isSaving}>
                  {isSaving ? 'Saving…' : isCreating ? 'Create' : 'Save'}
                </button>
                {!isCreating && selectedId && (
                  <button type="button" className="wardrobe-danger-button" onClick={handleDelete}>
                    Delete
                  </button>
                )}
                <button type="button" className="wardrobe-secondary-button" onClick={handleCancel}>
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
