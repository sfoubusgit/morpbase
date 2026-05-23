import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import type { CharacterAvatar, CharacterIdentity, CharacterIdentityInput } from '../../types';
import { processCoverImage } from '../utils/coverImageUtils';
import './CharacterLibraryModal.css';

type CharacterLibrarySurfaceProps = {
  characters: CharacterIdentity[];
  activeCharacterIds: string[];
  isLoading?: boolean;
  onSelectCharacter: (characterId: string) => void;
  onCreateCharacter: (input: CharacterIdentityInput) => Promise<CharacterIdentity>;
  onUpdateCharacter: (characterId: string, input: CharacterIdentityInput) => Promise<CharacterIdentity>;
  onDeleteCharacter: (characterId: string) => Promise<void>;
  universeFilter?: string[];
  universeName?: string;
};

type CharacterFormState = {
  name: string;
  summary: string;
  coverImageUrl: string;
  avatar: CharacterAvatar | null;
  archetype: string;
  role: string;
  ageImpression: string;
  presentation: string;
  personalityTone: string;
  visualAnchors: string;
  motifs: string;
  corePhrases: string;
  tags: string[];
  loraTrigger: string;
};

const EMPTY_FORM: CharacterFormState = {
  name: '',
  summary: '',
  coverImageUrl: '',
  avatar: null,
  archetype: '',
  role: '',
  ageImpression: '',
  presentation: '',
  personalityTone: '',
  visualAnchors: '',
  motifs: '',
  corePhrases: '',
  tags: [],
  loraTrigger: '',
};

const CHARACTER_AVATAR_SIZE = 160;
const CHARACTER_AVATAR_MAX_BYTES = 60 * 1024;
const CHARACTER_AVATAR_ACCEPT = 'image/png,image/jpeg,image/webp';

const getCharacterInitials = (name: string): string => {
  const normalized = name.trim();
  if (!normalized) return '?';
  const parts = normalized.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
};

const estimateDataUrlBytes = (dataUrl: string): number => {
  const marker = 'base64,';
  const index = dataUrl.indexOf(marker);
  if (index === -1) return dataUrl.length;
  const base64 = dataUrl.slice(index + marker.length);
  return Math.ceil((base64.length * 3) / 4);
};

const readFileAsDataUrl = (file: File): Promise<string> => (
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(new Error('Failed to read the selected image.'));
    };
    reader.onerror = () => reject(new Error('Failed to read the selected image.'));
    reader.readAsDataURL(file);
  })
);

const loadImageElement = (src: string): Promise<HTMLImageElement> => (
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load the selected image.'));
    image.src = src;
  })
);

const processCharacterAvatar = async (file: File): Promise<CharacterAvatar> => {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    throw new Error('Please choose a PNG, JPEG, or WebP image.');
  }

  const dataUrl = await readFileAsDataUrl(file);
  const image = await loadImageElement(dataUrl);
  const cropSize = Math.min(image.width, image.height);
  const cropX = Math.max(0, Math.floor((image.width - cropSize) / 2));
  const cropY = Math.max(0, Math.floor((image.height - cropSize) / 2));

  const canvas = document.createElement('canvas');
  canvas.width = CHARACTER_AVATAR_SIZE;
  canvas.height = CHARACTER_AVATAR_SIZE;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Avatar processing is not available in this browser.');
  }

  context.drawImage(
    image,
    cropX,
    cropY,
    cropSize,
    cropSize,
    0,
    0,
    CHARACTER_AVATAR_SIZE,
    CHARACTER_AVATAR_SIZE
  );

  const variants: Array<{ mimeType: CharacterAvatar['mimeType']; quality?: number }> = [
    { mimeType: 'image/webp', quality: 0.82 },
    { mimeType: 'image/webp', quality: 0.68 },
    { mimeType: 'image/jpeg', quality: 0.82 },
    { mimeType: 'image/jpeg', quality: 0.68 },
    { mimeType: 'image/png' },
  ];

  for (const variant of variants) {
    const nextDataUrl = variant.quality === undefined
      ? canvas.toDataURL(variant.mimeType)
      : canvas.toDataURL(variant.mimeType, variant.quality);

    if (!nextDataUrl.startsWith(`data:${variant.mimeType};base64,`)) {
      continue;
    }

    if (estimateDataUrlBytes(nextDataUrl) <= CHARACTER_AVATAR_MAX_BYTES) {
      return {
        dataUrl: nextDataUrl,
        mimeType: variant.mimeType,
        width: CHARACTER_AVATAR_SIZE,
        height: CHARACTER_AVATAR_SIZE,
      };
    }
  }

  throw new Error('Avatar is still too large after processing. Please choose a simpler image.');
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
  coverImageUrl: character.coverImageUrl ?? '',
  avatar: character.avatar ?? null,
  archetype: character.identity.archetype ?? '',
  role: character.identity.role ?? '',
  ageImpression: character.identity.ageImpression ?? '',
  presentation: character.identity.presentation ?? '',
  personalityTone: character.identity.personalityTone ?? '',
  visualAnchors: toMultiline(character.identity.visualAnchors),
  motifs: toMultiline(character.identity.motifs),
  corePhrases: character.phraseBundle.core.join('\n'),
  tags: character.tags ?? [],
  loraTrigger: character.loraTrigger ?? '',
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
  coverImageUrl: form.coverImageUrl.trim() || null,
  avatar: form.avatar ?? undefined,
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
  tags: form.tags.length > 0 ? form.tags : undefined,
  loraTrigger: form.loraTrigger.trim() || undefined,
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

function CharacterAvatarTile({
  name,
  avatar,
  size = 'small',
}: {
  name: string;
  avatar?: CharacterAvatar | null;
  size?: 'small' | 'large' | 'editor';
}) {
  if (avatar?.dataUrl) {
    return (
      <div className={`character-avatar-tile character-avatar-tile-${size}`}>
        <img src={avatar.dataUrl} alt={`${name} avatar`} className="character-avatar-image" />
      </div>
    );
  }

  return (
    <div className={`character-avatar-tile character-avatar-tile-${size} character-avatar-fallback`}>
      <span>{getCharacterInitials(name)}</span>
    </div>
  );
}

export function CharacterLibrarySurface({
  characters,
  activeCharacterIds,
  isLoading = false,
  onSelectCharacter,
  onCreateCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
  universeFilter,
  universeName,
}: CharacterLibrarySurfaceProps) {
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  const [form, setForm] = useState<CharacterFormState>(EMPTY_FORM);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);
  const [isProcessingCover, setIsProcessingCover] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [activeTagFilter, setActiveTagFilter] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [previewCharacterId, setPreviewCharacterId] = useState<string | null>(null);

  const activeCharacter = useMemo(
    () => characters.find(character => activeCharacterIds.includes(character.id)) ?? null,
    [characters, activeCharacterIds]
  );
  const editingCharacter = useMemo(
    () => characters.find(character => character.id === editingCharacterId) ?? null,
    [characters, editingCharacterId]
  );
  const previewCharacter = useMemo(
    () => previewCharacterId ? characters.find(c => c.id === previewCharacterId) ?? null : null,
    [characters, previewCharacterId]
  );

  useEffect(() => {
    setMessage(null);
    setError(null);
  }, [activeCharacterIds]);

  const handleFormChange = <K extends keyof CharacterFormState,>(key: K, value: CharacterFormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetAvatarInput = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.value = '';
    }
  };

  const handleBeginCreate = () => {
    setIsCreating(true);
    setEditingCharacterId(null);
    setPreviewCharacterId(null);
    setForm(EMPTY_FORM);
    setMessage(null);
    setError(null);
    resetAvatarInput();
  };

  const handleBeginEdit = (character: CharacterIdentity) => {
    setIsCreating(false);
    setEditingCharacterId(character.id);
    setPreviewCharacterId(null);
    setForm(formFromCharacter(character));
    setMessage(null);
    setError(null);
    resetAvatarInput();
  };

  const handleCancelEditor = () => {
    setIsCreating(false);
    setEditingCharacterId(null);
    setForm(EMPTY_FORM);
    setError(null);
    resetAvatarInput();
  };

  const handleChooseAvatar = () => {
    avatarInputRef.current?.click();
  };

  const handleRemoveAvatar = () => {
    setForm(prev => ({ ...prev, avatar: null }));
    resetAvatarInput();
  };

  const handleCoverImageSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setIsProcessingCover(true);
      setError(null);
      const dataUrl = await processCoverImage(file);
      setForm(prev => ({ ...prev, coverImageUrl: dataUrl }));
    } catch (err: any) {
      setError(err?.message ?? 'Failed to process the selected cover image.');
    } finally {
      setIsProcessingCover(false);
      event.target.value = '';
    }
  };

  const handleAvatarSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessingAvatar(true);
      setError(null);
      const avatar = await processCharacterAvatar(file);
      setForm(prev => ({ ...prev, avatar }));
    } catch (err: any) {
      setError(err?.message ?? 'Failed to process the selected avatar.');
    } finally {
      setIsProcessingAvatar(false);
      event.target.value = '';
    }
  };

  const handleUseCharacter = (character: CharacterIdentity) => {
    onSelectCharacter(character.id);
    setPreviewCharacterId(null);
    setMessage(null);
    setError(null);
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
        resetAvatarInput();
        return;
      }

      const created = await onCreateCharacter(payload);
      onSelectCharacter(created.id);
      resetAvatarInput();
      setMessage(`Created and applied "${created.name}" to the current workflow.`);
      setIsCreating(false);
      setEditingCharacterId(null);
      setForm(EMPTY_FORM);
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
  const displayCharacter = previewCharacter ?? activeCharacter;
  const displayCharacterIsActive = displayCharacter ? activeCharacterIds.includes(displayCharacter.id) : false;

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    characters.forEach(c => c.tags?.forEach(t => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [characters]);

  const filteredCharacters = useMemo(() => {
    let result = universeFilter && universeFilter.length > 0
      ? characters.filter(c => universeFilter.includes(c.id))
      : characters;
    if (activeTagFilter) result = result.filter(c => c.tags?.includes(activeTagFilter));
    const ql = query.trim().toLowerCase();
    if (ql) result = result.filter(c =>
      c.name.toLowerCase().includes(ql) ||
      (c.summary?.toLowerCase().includes(ql) ?? false) ||
      (c.tags?.some(t => t.toLowerCase().includes(ql)) ?? false)
    );
    return result;
  }, [characters, activeTagFilter, universeFilter, query]);

  const handleAddTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase().replace(/\s+/g, '-');
    if (!trimmed || form.tags.includes(trimmed)) return;
    handleFormChange('tags', [...form.tags, trimmed]);
  };

  const handleRemoveTag = (tag: string) => {
    handleFormChange('tags', form.tags.filter(t => t !== tag));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput);
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && form.tags.length > 0) {
      handleFormChange('tags', form.tags.slice(0, -1));
    }
  };

  return (
    <div className="character-library">
      <input
        ref={avatarInputRef}
        type="file"
        accept={CHARACTER_AVATAR_ACCEPT}
        className="character-avatar-input"
        onChange={event => void handleAvatarSelected(event)}
      />
      <input
        ref={coverImageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="character-avatar-input"
        onChange={event => void handleCoverImageSelected(event)}
      />
      <div className="character-library-intro">
        <div>
          <div className="character-library-kicker">Character identity lane</div>
          <p className="character-library-description">
            Create reusable character identities here, then apply one into the current workflow from Prompt Preview or the Identity Systems realm.
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
              {universeFilter && universeFilter.length > 0
                ? `${universeFilter.length} of ${characters.length} character${characters.length === 1 ? ' identity' : ' identities'}`
                : `${characters.length} reusable character${characters.length === 1 ? ' identity' : ' identities'}`}
            </div>
          </div>

          {universeFilter && universeFilter.length > 0 && (
            <div className="identity-lane-universe-banner">
              {universeName ? `Universe: ${universeName}` : 'Universe active'} — showing {universeFilter.length} curated character{universeFilter.length === 1 ? '' : 's'}
            </div>
          )}

          {!isLoading && characters.length > 0 && (
            <input
              type="text"
              className="character-library-search"
              placeholder="Search characters…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          )}

          {allTags.length > 0 && (
            <div className="character-tag-filter-bar">
              <button
                type="button"
                className={`character-tag-filter-chip${!activeTagFilter ? ' active' : ''}`}
                onClick={() => setActiveTagFilter(null)}
              >
                All
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`character-tag-filter-chip${activeTagFilter === tag ? ' active' : ''}`}
                  onClick={() => setActiveTagFilter(prev => prev === tag ? null : tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="character-library-empty">Loading characters...</div>
          ) : characters.length === 0 ? (
            <div className="character-library-empty">
              <strong>No characters yet.</strong>
              <span>Create one to start building recurring character continuity across workflows.</span>
            </div>
          ) : filteredCharacters.length === 0 ? (
            <div className="character-library-empty">
              <strong>No matches.</strong>
              <span>Try a different search{activeTagFilter ? ' or clear the tag filter' : ''}.</span>
            </div>
          ) : (
            <div className="character-library-list">
              {filteredCharacters.map(character => {
                const isActive = activeCharacterIds.includes(character.id);
                const isSelected = previewCharacterId === character.id;
                const needsVisualAnchorRepair = characterNeedsVisualAnchorRepair(character);
                const hasMeta = isActive || needsVisualAnchorRepair || (character.tags?.length ?? 0) > 0;
                return (
                  <div
                    key={character.id}
                    role="button"
                    tabIndex={0}
                    className={[
                      'character-library-item',
                      isSelected ? 'character-library-item-selected' : '',
                      isActive ? 'character-library-item-active' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => setPreviewCharacterId(character.id)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPreviewCharacterId(character.id); } }}
                  >
                    <CharacterAvatarTile
                      name={character.name}
                      avatar={character.avatar}
                      size="small"
                    />
                    <div className="character-library-item-main">
                      <div className="character-library-item-name">{character.name}</div>
                      {character.summary && (
                        <div className="character-library-item-summary">{character.summary}</div>
                      )}
                      {hasMeta && (
                        <div className="character-library-item-meta">
                          {isActive && <span className="character-library-active-badge">In Workflow</span>}
                          {needsVisualAnchorRepair && (
                            <span className="character-library-warning-badge">Needs Anchor</span>
                          )}
                          {character.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="character-card-tag-chip">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className={`character-library-item-toggle${isActive ? ' character-library-item-toggle-on' : ''}`}
                      onClick={e => { e.stopPropagation(); onSelectCharacter(character.id); }}
                      title={isActive ? 'Remove from workflow' : 'Add to workflow'}
                    >
                      {isActive ? '✓' : '+'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="character-library-panel character-library-editor-panel">
          <div className="character-library-panel-header">
            <div className="character-library-panel-title">
              {editingCharacter ? `Editing ${editingCharacter.name}` : isCreating ? 'Create Character' : displayCharacter ? (displayCharacterIsActive ? 'Active Character' : 'Character Preview') : 'Workflow Character'}
            </div>
            <div className="character-library-panel-subtitle">
              {isEditorOpen
                ? 'Keep this small and identity-focused.'
                : displayCharacter && !displayCharacterIsActive
                  ? 'Click Apply to add this character to the current workflow.'
                  : displayCharacter
                    ? 'The character identity currently applied to this workflow appears here.'
                    : 'Select a character or create one to begin.'}
            </div>
          </div>

          {isEditorOpen ? (
            <form className="character-editor-form" onSubmit={event => void handleSubmit(event)}>
              <div className="character-editor-grid">
                <div className="character-editor-avatar-row character-editor-field-wide">
                  <CharacterAvatarTile
                    name={form.name || 'Character'}
                    avatar={form.avatar}
                    size="editor"
                  />
                  <div className="character-editor-avatar-content">
                    <span className="character-editor-avatar-label">Avatar</span>
                    <div className="character-editor-field-hint">
                      Optional. Upload one lightweight square image to make the character easier to recognize in the library.
                    </div>
                    <div className="character-editor-avatar-actions">
                      <button
                        type="button"
                        className="character-library-secondary-button"
                        onClick={handleChooseAvatar}
                        disabled={isProcessingAvatar || isSubmitting}
                      >
                        {isProcessingAvatar
                          ? 'Processing Avatar...'
                          : form.avatar
                            ? 'Change Avatar'
                            : 'Upload Avatar'}
                      </button>
                      {form.avatar && (
                        <button
                          type="button"
                          className="character-library-danger-button"
                          onClick={handleRemoveAvatar}
                          disabled={isProcessingAvatar || isSubmitting}
                        >
                          Remove Avatar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
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
                  <span>LoRA trigger word <span className="character-editor-cover-optional">(optional)</span></span>
                  <input
                    type="text"
                    value={form.loraTrigger}
                    onChange={event => handleFormChange('loraTrigger', event.target.value)}
                    placeholder="e.g. sorayavex — added to the front of the prompt to activate this character's LoRA"
                  />
                </label>
                <div className="character-editor-field character-editor-field-wide">
                  <span>Cover image <span className="character-editor-cover-optional">(optional)</span></span>
                  <div className="character-editor-cover-upload">
                    <button
                      type="button"
                      className="character-library-secondary-button"
                      onClick={() => coverImageInputRef.current?.click()}
                      disabled={isProcessingCover || isSubmitting}
                    >
                      {isProcessingCover ? 'Processing…' : form.coverImageUrl ? 'Change Cover' : 'Upload Cover'}
                    </button>
                    {form.coverImageUrl && (
                      <button
                        type="button"
                        className="character-library-danger-button"
                        onClick={() => handleFormChange('coverImageUrl', '')}
                        disabled={isProcessingCover || isSubmitting}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  {form.coverImageUrl && (
                    <div className="character-editor-cover-preview">
                      <img src={form.coverImageUrl} alt="Cover preview" />
                    </div>
                  )}
                </div>
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
                <div className="character-editor-field character-editor-field-wide">
                  <span>Tags</span>
                  <div className="character-tag-editor">
                    {form.tags.map(tag => (
                      <span key={tag} className="character-tag-chip">
                        {tag}
                        <button
                          type="button"
                          className="character-tag-chip-remove"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      className="character-tag-input"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      onBlur={() => {
                        if (tagInput.trim()) {
                          handleAddTag(tagInput);
                          setTagInput('');
                        }
                      }}
                      placeholder={form.tags.length === 0 ? 'solo, duo, horror…' : 'Add tag…'}
                    />
                  </div>
                  <div className="character-editor-field-hint">Press Enter or comma to add. Backspace removes the last tag.</div>
                </div>
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
                  disabled={isSubmitting || isProcessingAvatar}
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
          ) : displayCharacter ? (
            <div className="character-library-details">
              <div className="character-library-details-header">
                <CharacterAvatarTile
                  name={displayCharacter.name}
                  avatar={displayCharacter.avatar}
                  size="large"
                />
                <div>
                  <div className="character-library-details-name">{displayCharacter.name}</div>
                  {displayCharacter.summary && (
                    <p className="character-library-details-summary">{displayCharacter.summary}</p>
                  )}
                </div>
              </div>
              {characterNeedsVisualAnchorRepair(displayCharacter) && (
                <div className="character-library-warning-note">
                  This legacy character is still usable, but it needs at least one visual anchor before it can be saved again.
                </div>
              )}
              <div className="character-library-details-grid">
                {displayCharacter.identity.archetype && (
                  <div className="character-library-detail-item">
                    <span>Archetype</span>
                    <strong>{displayCharacter.identity.archetype}</strong>
                  </div>
                )}
                {displayCharacter.identity.role && (
                  <div className="character-library-detail-item">
                    <span>Role</span>
                    <strong>{displayCharacter.identity.role}</strong>
                  </div>
                )}
                {displayCharacter.identity.personalityTone && (
                  <div className="character-library-detail-item">
                    <span>Tone</span>
                    <strong>{displayCharacter.identity.personalityTone}</strong>
                  </div>
                )}
              </div>
              <div className="character-library-detail-section">
                <div className="character-library-detail-heading">Core Identity Phrases</div>
                <div className="character-editor-preview-chips">
                  {displayCharacter.phraseBundle.core.map((phrase, index) => (
                    <span key={`${displayCharacter.id}-core-${index}`} className="character-library-phrase-chip">
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
              <div className="character-library-card-actions">
                {!displayCharacterIsActive && (
                  <button
                    type="button"
                    className="character-library-primary-button"
                    onClick={() => handleUseCharacter(displayCharacter)}
                  >
                    Apply to Workflow
                  </button>
                )}
                <button
                  type="button"
                  className="character-library-secondary-button"
                  onClick={() => handleBeginEdit(displayCharacter)}
                >
                  {displayCharacterIsActive ? 'Edit Active Character' : 'Edit'}
                </button>
                <button
                  type="button"
                  className="character-library-danger-button"
                  onClick={() => void handleDelete(displayCharacter)}
                >
                  Delete
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
  );
}
