import { useEffect, useMemo, useState, type FormEvent } from 'react';
import type { CharacterIdentity, CharacterIdentityInput } from '../../types';
import { Modal } from './Modal';
import './CharacterLibraryModal.css';

type CharacterLibraryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  characters: CharacterIdentity[];
  activeCharacterId: string | null;
  isLoading?: boolean;
  onSelectCharacter: (characterId: string) => void;
  onCreateCharacter: (input: CharacterIdentityInput) => Promise<CharacterIdentity>;
  onUpdateCharacter: (characterId: string, input: CharacterIdentityInput) => Promise<CharacterIdentity>;
  onDeleteCharacter: (characterId: string) => Promise<void>;
};

type CharacterFormState = {
  name: string;
  summary: string;
  archetype: string;
  role: string;
  ageImpression: string;
  presentation: string;
  personalityTone: string;
  visualAnchors: string;
  motifs: string;
  corePhrases: string;
};

const EMPTY_FORM: CharacterFormState = {
  name: '',
  summary: '',
  archetype: '',
  role: '',
  ageImpression: '',
  presentation: '',
  personalityTone: '',
  visualAnchors: '',
  motifs: '',
  corePhrases: '',
};

const createEntryId = (prefix: string, index: number): string =>
  `${prefix}_${index + 1}_${Math.random().toString(36).slice(2, 8)}`;

const toMultiline = (items: Array<{ label: string; text: string }>) =>
  items.map(item => (
    item.label === item.text
      ? item.text
      : `${item.label} | ${item.text}`
  )).join('\n');

const formFromCharacter = (character: CharacterIdentity): CharacterFormState => ({
  name: character.name,
  summary: character.summary ?? '',
  archetype: character.identity.archetype ?? '',
  role: character.identity.role ?? '',
  ageImpression: character.identity.ageImpression ?? '',
  presentation: character.identity.presentation ?? '',
  personalityTone: character.identity.personalityTone ?? '',
  visualAnchors: toMultiline(character.identity.visualAnchors),
  motifs: toMultiline(character.identity.motifs),
  corePhrases: character.phraseBundle.core.join('\n'),
});

const parseLineItems = (
  value: string,
  prefix: string
): Array<{ id: string; label: string; text: string }> => (
  value
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const delimiter = line.includes('|') ? '|' : (line.includes(':') ? ':' : null);
      if (!delimiter) {
        return {
          id: createEntryId(prefix, index),
          label: line,
          text: line,
        };
      }

      const [rawLabel, ...rest] = line.split(delimiter);
      const label = rawLabel.trim();
      const text = rest.join(delimiter).trim();
      return {
        id: createEntryId(prefix, index),
        label: label || text,
        text: text || label,
      };
    })
);

const parseStringList = (value: string): string[] => (
  value
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
);

const buildCharacterInput = (form: CharacterFormState): CharacterIdentityInput => ({
  name: form.name.trim(),
  summary: form.summary.trim() || undefined,
  identity: {
    archetype: form.archetype.trim() || undefined,
    role: form.role.trim() || undefined,
    ageImpression: form.ageImpression.trim() || undefined,
    presentation: form.presentation.trim() || undefined,
    personalityTone: form.personalityTone.trim() || undefined,
    visualAnchors: parseLineItems(form.visualAnchors, 'anchor'),
    motifs: parseLineItems(form.motifs, 'motif'),
  },
  phraseBundle: {
    core: parseStringList(form.corePhrases),
  },
});

const validateCharacterInput = (input: CharacterIdentityInput): string | null => {
  if (!input.name.trim()) {
    return 'Character name is required.';
  }
  if (input.identity.visualAnchors.length === 0) {
    return 'Add at least one visual anchor to keep the character identity reusable.';
  }
  if (input.phraseBundle.core.length === 0) {
    return 'Add at least one core identity phrase.';
  }
  return null;
};

const characterNeedsVisualAnchorRepair = (character: CharacterIdentity): boolean =>
  character.identity.visualAnchors.length === 0;

export function CharacterLibraryModal({
  isOpen,
  onClose,
  characters,
  activeCharacterId,
  isLoading = false,
  onSelectCharacter,
  onCreateCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
}: CharacterLibraryModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  const [form, setForm] = useState<CharacterFormState>(EMPTY_FORM);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeCharacter = useMemo(
    () => characters.find(character => character.id === activeCharacterId) ?? null,
    [characters, activeCharacterId]
  );
  const editingCharacter = useMemo(
    () => characters.find(character => character.id === editingCharacterId) ?? null,
    [characters, editingCharacterId]
  );

  useEffect(() => {
    if (isOpen) {
      return;
    }

    setIsCreating(false);
    setEditingCharacterId(null);
    setForm(EMPTY_FORM);
    setMessage(null);
    setError(null);
    setIsSubmitting(false);
  }, [isOpen]);

  const handleFormChange = <K extends keyof CharacterFormState,>(key: K, value: CharacterFormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleBeginCreate = () => {
    setIsCreating(true);
    setEditingCharacterId(null);
    setForm(EMPTY_FORM);
    setMessage(null);
    setError(null);
  };

  const handleBeginEdit = (character: CharacterIdentity) => {
    setIsCreating(false);
    setEditingCharacterId(character.id);
    setForm(formFromCharacter(character));
    setMessage(null);
    setError(null);
  };

  const handleCancelEditor = () => {
    setIsCreating(false);
    setEditingCharacterId(null);
    setForm(EMPTY_FORM);
    setError(null);
  };

  const handleUseCharacter = (characterId: string) => {
    onSelectCharacter(characterId);
    onClose();
  };

  const handleDelete = async (character: CharacterIdentity) => {
    if (!window.confirm(`Delete "${character.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      setError(null);
      setMessage(null);
      await onDeleteCharacter(character.id);
      if (editingCharacterId === character.id) {
        handleCancelEditor();
      }
      setMessage(`Deleted "${character.name}".`);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to delete character.');
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      setMessage(null);
      const payload = buildCharacterInput(form);
      const validationError = validateCharacterInput(payload);
      if (validationError) {
        setError(validationError);
        return;
      }

      if (editingCharacterId) {
        const updated = await onUpdateCharacter(editingCharacterId, payload);
        setMessage(`Saved changes to "${updated.name}".`);
        setEditingCharacterId(null);
        setForm(EMPTY_FORM);
        setIsCreating(false);
        return;
      }

      const created = await onCreateCharacter(payload);
      onSelectCharacter(created.id);
      onClose();
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save character.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewPhrases = useMemo(
    () => parseStringList(form.corePhrases),
    [form.corePhrases]
  );
  const isEditorOpen = isCreating || Boolean(editingCharacterId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Characters"
      className="character-library-modal"
    >
      <div className="character-library">
        <div className="character-library-intro">
          <div>
            <div className="character-library-kicker">Character identity lane</div>
            <p className="character-library-description">
              Create reusable character identities here, then apply one into the current workflow from Prompt Preview.
            </p>
          </div>
          <button
            type="button"
            className="character-library-primary-button"
            onClick={handleBeginCreate}
          >
            Create Character
          </button>
        </div>

        {message && <div className="character-library-message">{message}</div>}
        {error && <div className="character-library-error">{error}</div>}

        <div className="character-library-layout">
          <section className="character-library-panel character-library-list-panel">
            <div className="character-library-panel-header">
              <div className="character-library-panel-title">Character Library</div>
              <div className="character-library-panel-subtitle">
                {characters.length} reusable character{characters.length === 1 ? ' identity' : ' identities'}
              </div>
            </div>

            {isLoading ? (
              <div className="character-library-empty">Loading characters...</div>
            ) : characters.length === 0 ? (
              <div className="character-library-empty">
                <strong>No characters yet.</strong>
                <span>Create one to start building recurring character continuity across workflows.</span>
              </div>
            ) : (
              <div className="character-library-list">
                {characters.map(character => {
                  const isActive = character.id === activeCharacterId;
                  const needsVisualAnchorRepair = characterNeedsVisualAnchorRepair(character);
                  return (
                    <article
                      key={character.id}
                      className={`character-library-card ${isActive ? 'active' : ''}`}
                    >
                      <div className="character-library-card-header">
                        <div>
                          <div className="character-library-card-title-row">
                            <h3 className="character-library-card-title">{character.name}</h3>
                            {isActive && <span className="character-library-active-badge">In Workflow</span>}
                            {needsVisualAnchorRepair && (
                              <span className="character-library-warning-badge">Needs Anchor</span>
                            )}
                          </div>
                          <p className="character-library-card-summary">
                            {character.summary || 'No summary yet.'}
                          </p>
                          {needsVisualAnchorRepair && (
                            <p className="character-library-card-warning">
                              This legacy character needs at least one visual anchor before it can be saved again.
                            </p>
                          )}
                        </div>
                      </div>
                      {character.phraseBundle.core.length > 0 && (
                        <div className="character-library-card-phrases">
                          {character.phraseBundle.core.slice(0, 3).map((phrase, index) => (
                            <span key={`${character.id}-${index}`} className="character-library-phrase-chip">
                              {phrase}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="character-library-card-actions">
                        <button
                          type="button"
                          className="character-library-secondary-button"
                          onClick={() => handleUseCharacter(character.id)}
                          disabled={isActive}
                        >
                          {isActive ? 'Active' : 'Apply'}
                        </button>
                        <button
                          type="button"
                          className="character-library-secondary-button"
                          onClick={() => handleBeginEdit(character)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="character-library-danger-button"
                          onClick={() => void handleDelete(character)}
                        >
                          Delete
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="character-library-panel character-library-editor-panel">
            <div className="character-library-panel-header">
              <div className="character-library-panel-title">
                {editingCharacter ? `Editing ${editingCharacter.name}` : isCreating ? 'Create Character' : 'Workflow Character'}
              </div>
              <div className="character-library-panel-subtitle">
                {isEditorOpen
                  ? 'Keep this small and identity-focused.'
                  : activeCharacter
                    ? 'The character identity currently applied to this workflow appears here.'
                    : 'Select or create a character identity to begin.'}
              </div>
            </div>

            {isEditorOpen ? (
              <form className="character-editor-form" onSubmit={event => void handleSubmit(event)}>
                <div className="character-editor-grid">
                  <label className="character-editor-field">
                    <span>Name</span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={event => handleFormChange('name', event.target.value)}
                      placeholder="Oracle Girl"
                    />
                  </label>
                  <label className="character-editor-field">
                    <span>Summary</span>
                    <input
                      type="text"
                      value={form.summary}
                      onChange={event => handleFormChange('summary', event.target.value)}
                      placeholder="Recurring mystic heroine with luminous ornamented features."
                    />
                  </label>
                  <label className="character-editor-field">
                    <span>Archetype</span>
                    <input
                      type="text"
                      value={form.archetype}
                      onChange={event => handleFormChange('archetype', event.target.value)}
                      placeholder="oracle"
                    />
                  </label>
                  <label className="character-editor-field">
                    <span>Role</span>
                    <input
                      type="text"
                      value={form.role}
                      onChange={event => handleFormChange('role', event.target.value)}
                      placeholder="wandering seer"
                    />
                  </label>
                  <label className="character-editor-field">
                    <span>Age Impression</span>
                    <input
                      type="text"
                      value={form.ageImpression}
                      onChange={event => handleFormChange('ageImpression', event.target.value)}
                      placeholder="young adult"
                    />
                  </label>
                  <label className="character-editor-field">
                    <span>Presentation</span>
                    <input
                      type="text"
                      value={form.presentation}
                      onChange={event => handleFormChange('presentation', event.target.value)}
                      placeholder="feminine"
                    />
                  </label>
                  <label className="character-editor-field character-editor-field-wide">
                    <span>Personality Tone</span>
                    <input
                      type="text"
                      value={form.personalityTone}
                      onChange={event => handleFormChange('personalityTone', event.target.value)}
                      placeholder="calm, ceremonial, slightly distant"
                    />
                  </label>
                  <label className="character-editor-field character-editor-field-wide">
                    <span>Visual Anchors</span>
                    <textarea
                      rows={5}
                      value={form.visualAnchors}
                      onChange={event => handleFormChange('visualAnchors', event.target.value)}
                      placeholder={`violet eyes | luminous violet eyes\nsilver braid | long silver braid with beads`}
                    />
                    <div className="character-editor-field-hint">
                      Required. Add at least one visual anchor to keep this character identity reusable across workflows.
                    </div>
                  </label>
                  <label className="character-editor-field character-editor-field-wide">
                    <span>Motifs</span>
                    <textarea
                      rows={4}
                      value={form.motifs}
                      onChange={event => handleFormChange('motifs', event.target.value)}
                      placeholder={`moon sigils | recurring moon sigils\nprayer ribbons | ceremonial prayer ribbons`}
                    />
                  </label>
                  <label className="character-editor-field character-editor-field-wide">
                    <span>Core Identity Phrases</span>
                    <textarea
                      rows={6}
                      value={form.corePhrases}
                      onChange={event => handleFormChange('corePhrases', event.target.value)}
                      placeholder={`luminous young oracle with long silver braid\nviolet eyes and ceremonial prayer ribbons\nornamented mystic heroine with moon sigils`}
                    />
                  </label>
                </div>

                <div className="character-editor-preview">
                  <div className="character-editor-preview-title">Workflow Phrase Preview</div>
                  {previewPhrases.length > 0 ? (
                    <div className="character-editor-preview-chips">
                      {previewPhrases.map((phrase, index) => (
                        <span key={`${phrase}-${index}`} className="character-library-phrase-chip">
                          {phrase}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="character-editor-preview-empty">
                      Add at least one core identity phrase to make this character reusable across workflows.
                    </div>
                  )}
                </div>

                <div className="character-editor-actions">
                  <button
                    type="submit"
                    className="character-library-primary-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? 'Saving...'
                      : editingCharacterId
                        ? 'Save Changes'
                        : 'Save and Apply'}
                  </button>
                  <button
                    type="button"
                    className="character-library-secondary-button"
                    onClick={handleCancelEditor}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : activeCharacter ? (
              <div className="character-library-details">
                <div className="character-library-details-name">{activeCharacter.name}</div>
                {activeCharacter.summary && (
                  <p className="character-library-details-summary">{activeCharacter.summary}</p>
                )}
                {characterNeedsVisualAnchorRepair(activeCharacter) && (
                  <div className="character-library-warning-note">
                    This legacy character is still usable, but it needs at least one visual anchor before it can be saved again.
                  </div>
                )}
                <div className="character-library-details-grid">
                  {activeCharacter.identity.archetype && (
                    <div className="character-library-detail-item">
                      <span>Archetype</span>
                      <strong>{activeCharacter.identity.archetype}</strong>
                    </div>
                  )}
                  {activeCharacter.identity.role && (
                    <div className="character-library-detail-item">
                      <span>Role</span>
                      <strong>{activeCharacter.identity.role}</strong>
                    </div>
                  )}
                  {activeCharacter.identity.personalityTone && (
                    <div className="character-library-detail-item">
                      <span>Tone</span>
                      <strong>{activeCharacter.identity.personalityTone}</strong>
                    </div>
                  )}
                </div>
                <div className="character-library-detail-section">
                  <div className="character-library-detail-heading">Core Identity Phrases</div>
                  <div className="character-editor-preview-chips">
                    {activeCharacter.phraseBundle.core.map((phrase, index) => (
                      <span key={`${activeCharacter.id}-core-${index}`} className="character-library-phrase-chip">
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="character-library-card-actions">
                  <button
                    type="button"
                    className="character-library-secondary-button"
                    onClick={() => handleBeginEdit(activeCharacter)}
                  >
                    Edit Active Character
                  </button>
                </div>
              </div>
            ) : (
              <div className="character-library-empty character-library-empty-detail">
                <strong>No active character identity.</strong>
                <span>Choose an existing character or create one here, then apply it to the current workflow.</span>
              </div>
            )}
          </section>
        </div>
      </div>
    </Modal>
  );
}
