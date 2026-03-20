import { useMemo, useState, useEffect, useRef } from 'react';
import type { PromptAdditionEntry, PromptSet, SavedPrompt } from '../../types';
import {
  createPrompt,
  deletePrompt,
  exportPromptsPayload,
  importPromptsPayload,
  listPrompts,
} from '../../engine/promptStore';
import {
  assignPromptToSet,
  createPromptSet,
  deletePromptSet,
  loadPromptSetState,
  updatePromptSet,
} from '../../engine/promptSetStore';
import { trackAnalyticsEvent } from '../../engine/analyticsStore';
import { Modal } from './Modal';
import { composePromptWithAdditions } from '../promptAdditions';
import './PromptLibrary.css';

type PromptLibraryProps = {
  prompt: any | null;
  customAdditions?: string[];
  positionedAdditions?: PromptAdditionEntry[];
  editedPositive?: string | null;
  editedNegative?: string | null;
  onAddToPrompt?: (text: string) => void;
  authUser?: { id: string } | null;
  isPro?: boolean;
  manualUrl?: string;
  showCloudPrompts?: boolean;
  showLocalPrompts?: boolean;
  hideSaveBar?: boolean;
  externalOpenSaveSignal?: number;
  renderLibraryShell?: boolean;
  onPromptSaved?: (message: string) => void;
};

const LOCAL_STORE_KEY = 'promptgen:local_prompts:v1';
const KEEP_SAVE_FIELDS_KEY = 'promptgen:keep_save_fields_after_saving';
const SAVE_FORM_DRAFT_KEY = 'promptgen:save_prompt_form_draft';
const RECENT_LOCAL_PROMPTS_LIMIT = 4;
const CREATE_NEW_PROMPT_SET_VALUE = '__create_new_prompt_set__';

type SaveFormDraft = {
  name?: string;
  tags?: string;
  model?: string;
  purpose?: string;
  note?: string;
  promptSetId?: string;
};

const loadLocalPrompts = (): SavedPrompt[] => {
  try {
    const raw = window.localStorage.getItem(LOCAL_STORE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { prompts?: SavedPrompt[] };
    if (!parsed || !Array.isArray(parsed.prompts)) return [];
    return parsed.prompts;
  } catch {
    return [];
  }
};

const saveLocalPrompts = (prompts: SavedPrompt[]) => {
  try {
    window.localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify({ prompts }));
  } catch {
    // ignore storage errors
  }
};

const loadSaveFormDraft = (): SaveFormDraft => {
  try {
    const raw = window.localStorage.getItem(SAVE_FORM_DRAFT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SaveFormDraft;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const buildPromptText = (
  prompt: any,
  customAdditions: string[],
  positionedAdditions: PromptAdditionEntry[],
  editedPositive?: string | null,
  editedNegative?: string | null
) => {
  const normalizedAdditions = positionedAdditions.length > 0
    ? positionedAdditions
    : customAdditions.filter(Boolean).map((text, index) => ({
        id: `legacy_addition_${index}`,
        text,
        position: 'end' as const,
      }));
  const positive = prompt && 'positiveTokens' in prompt ? prompt.positiveTokens : '';
  const combinedPositive = composePromptWithAdditions(positive, normalizedAdditions);
  const negative = prompt && 'negativeTokens' in prompt ? prompt.negativeTokens : '';
  const effectivePositive = editedPositive ?? combinedPositive;
  const effectiveNegative = editedNegative ?? negative;
  return {
    positive: effectivePositive,
    negative: effectiveNegative,
    full: effectiveNegative ? `${effectivePositive}\n\nNEGATIVE PROMPT:\n${effectiveNegative}` : effectivePositive,
  };
};

export function PromptLibrary({
  prompt,
  customAdditions = [],
  positionedAdditions = [],
  editedPositive,
  editedNegative,
  onAddToPrompt,
  authUser,
  isPro = false,
  manualUrl,
  showCloudPrompts = false,
  showLocalPrompts = true,
  hideSaveBar = false,
  externalOpenSaveSignal = 0,
  renderLibraryShell = true,
  onPromptSaved,
}: PromptLibraryProps) {
  const initialKeepFieldsAfterSaving = (() => {
    try {
      return window.localStorage.getItem(KEEP_SAVE_FIELDS_KEY) === '1';
    } catch {
      return false;
    }
  })();
  const initialDraft = initialKeepFieldsAfterSaving ? loadSaveFormDraft() : {};
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [localPrompts, setLocalPrompts] = useState<SavedPrompt[]>([]);
  const [promptSets, setPromptSets] = useState<PromptSet[]>([]);
  const [promptSetAssignments, setPromptSetAssignments] = useState<Record<string, string | null>>({});
  const [name, setName] = useState(initialDraft.name ?? '');
  const [tags, setTags] = useState(initialDraft.tags ?? '');
  const [model, setModel] = useState(initialDraft.model ?? '');
  const [purpose, setPurpose] = useState(initialDraft.purpose ?? '');
  const [note, setNote] = useState(initialDraft.note ?? '');
  const [selectedPromptSetId, setSelectedPromptSetId] = useState(initialDraft.promptSetId ?? '');
  const [libraryJson, setLibraryJson] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const lastHandledOpenSignalRef = useRef(externalOpenSaveSignal);
  const [showAllLocalPrompts, setShowAllLocalPrompts] = useState(false);
  const [keepFieldsAfterSaving, setKeepFieldsAfterSaving] = useState<boolean>(initialKeepFieldsAfterSaving);
  const [activePromptSetFilter, setActivePromptSetFilter] = useState<string>('all');
  const [isCreatingPromptSetInline, setIsCreatingPromptSetInline] = useState(false);
  const [newPromptSetName, setNewPromptSetName] = useState('');
  const [newPromptSetDescription, setNewPromptSetDescription] = useState('');
  const [newPromptSetMessage, setNewPromptSetMessage] = useState<string | null>(null);
  const [editingPromptSetId, setEditingPromptSetId] = useState<string | null>(null);
  const [editingPromptSetName, setEditingPromptSetName] = useState('');
  const canUsePromptSets = Boolean(authUser);

  const currentText = useMemo(
    () => buildPromptText(prompt, customAdditions, positionedAdditions, editedPositive, editedNegative),
    [prompt, customAdditions, positionedAdditions, editedPositive, editedNegative]
  );
  const promptSetOptions = useMemo(
    () => promptSets.map(set => ({ value: set.id, label: set.name })),
    [promptSets]
  );
  const getAssignedPromptSet = (promptId: string) => {
    const setId = promptSetAssignments[promptId];
    if (!setId) return null;
    return promptSets.find(set => set.id === setId) ?? null;
  };
  const filterPromptsBySet = (items: SavedPrompt[]) => {
    if (activePromptSetFilter === 'all') return items;
    if (activePromptSetFilter === 'unassigned') {
      return items.filter(item => !promptSetAssignments[item.id]);
    }
    return items.filter(item => promptSetAssignments[item.id] === activePromptSetFilter);
  };
  const filteredLocalPromptPool = useMemo(
    () => filterPromptsBySet(localPrompts),
    [activePromptSetFilter, promptSetAssignments, localPrompts]
  );
  const visibleLocalPrompts = useMemo(
    () => showAllLocalPrompts ? filteredLocalPromptPool : filteredLocalPromptPool.slice(0, RECENT_LOCAL_PROMPTS_LIMIT),
    [filteredLocalPromptPool, showAllLocalPrompts]
  );
  const hiddenLocalPromptCount = Math.max(0, filteredLocalPromptPool.length - RECENT_LOCAL_PROMPTS_LIMIT);
  const filteredLocalPrompts = useMemo(
    () => visibleLocalPrompts,
    [visibleLocalPrompts]
  );
  const filteredCloudPrompts = useMemo(
    () => filterPromptsBySet(prompts),
    [activePromptSetFilter, promptSetAssignments, prompts]
  );

  const refresh = async () => {
    try {
      const next = await listPrompts();
      setPrompts(next);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load prompts.');
    }
  };

  const refreshPromptSets = async () => {
    try {
      const state = await loadPromptSetState();
      setPromptSets(state.sets);
      setPromptSetAssignments(state.assignments);
    } catch {
      setPromptSets([]);
      setPromptSetAssignments({});
    }
  };

  useEffect(() => {
    setLocalPrompts(loadLocalPrompts());
    void refreshPromptSets();
    if (authUser) {
      void refresh();
    } else {
      setPrompts([]);
    }
  }, [authUser]);

  useEffect(() => {
    if (!canUsePromptSets) {
      setActivePromptSetFilter('all');
      setSelectedPromptSetId('');
      setIsCreatingPromptSetInline(false);
    }
  }, [canUsePromptSets]);

  useEffect(() => {
    if (externalOpenSaveSignal > lastHandledOpenSignalRef.current) {
      lastHandledOpenSignalRef.current = externalOpenSaveSignal;
      setIsSaveModalOpen(true);
    }
  }, [externalOpenSaveSignal]);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEEP_SAVE_FIELDS_KEY, keepFieldsAfterSaving ? '1' : '0');
    } catch {
      // ignore storage errors
    }
  }, [keepFieldsAfterSaving]);

  useEffect(() => {
    if (!keepFieldsAfterSaving) {
      try {
        window.localStorage.removeItem(SAVE_FORM_DRAFT_KEY);
      } catch {
        // ignore storage errors
      }
      return;
    }

    try {
      window.localStorage.setItem(
        SAVE_FORM_DRAFT_KEY,
        JSON.stringify({
          name,
          tags,
          model,
          purpose,
          note,
          promptSetId: selectedPromptSetId,
        })
      );
    } catch {
      // ignore storage errors
    }
  }, [keepFieldsAfterSaving, name, tags, model, purpose, note, selectedPromptSetId]);

  const parseTags = (raw: string) =>
    raw
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

  const resolveSelectedPromptSetId = () =>
    selectedPromptSetId && selectedPromptSetId !== CREATE_NEW_PROMPT_SET_VALUE
      ? selectedPromptSetId
      : null;

  const resetSaveFields = () => {
    setName('');
    setTags('');
    setModel('');
    setPurpose('');
    setNote('');
    setSelectedPromptSetId('');
    try {
      window.localStorage.removeItem(SAVE_FORM_DRAFT_KEY);
    } catch {
      // ignore storage errors
    }
  };

  const handleSave = async () => {
    if (!authUser || !isPro) {
      setError('Upgrade to Pro to save prompts to the cloud.');
      return;
    }
    setError(null);
    setMessage(null);
    try {
      const savedPrompt = await createPrompt({
        name,
        positive: currentText.positive,
        negative: currentText.negative,
        tags: parseTags(tags),
        model,
        purpose,
        note,
      });
      await assignPromptToSet(savedPrompt.id, resolveSelectedPromptSetId());
      await refreshPromptSets();
      if (!keepFieldsAfterSaving) {
        resetSaveFields();
      }
      setIsSaveModalOpen(false);
      await refresh();
      void trackAnalyticsEvent({
        eventType: 'prompt_save',
        pageKey: 'generator',
        userId: authUser.id,
        metadata: {
          storage: 'cloud',
          tagCount: parseTags(tags).length,
          hasNegative: Boolean(currentText.negative?.trim()),
          hasModel: Boolean(model.trim()),
          hasPurpose: Boolean(purpose.trim()),
        },
      });
      setMessage('Saved to cloud.');
      onPromptSaved?.('Prompt saved to the cloud.');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save prompt.');
    }
  };

  const handleSaveLocal = () => {
    setError(null);
    setMessage(null);
    const trimmedName = name.trim();
    const positive = currentText.positive.trim();
    if (!trimmedName) {
      setError('Prompt name cannot be empty.');
      return;
    }
    if (!positive) {
      setError('Prompt text cannot be empty.');
      return;
    }
    const now = Date.now();
    const nextPrompt: SavedPrompt = {
      id: `local_${now}_${Math.random().toString(36).slice(2, 6)}`,
      name: trimmedName,
      positive,
      negative: currentText.negative || undefined,
      tags: parseTags(tags),
      model: model.trim() || undefined,
      purpose: purpose.trim() || undefined,
      usedAt: new Date(now).toISOString(),
      note: note.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };
    const next = [nextPrompt, ...localPrompts];
    setLocalPrompts(next);
    saveLocalPrompts(next);
    void assignPromptToSet(nextPrompt.id, resolveSelectedPromptSetId()).then(() => {
      void refreshPromptSets();
    });
    if (!keepFieldsAfterSaving) {
      resetSaveFields();
    }
    setIsSaveModalOpen(false);
    void trackAnalyticsEvent({
      eventType: 'prompt_save',
      pageKey: 'generator',
      userId: authUser?.id ?? null,
      metadata: {
        storage: 'local',
        tagCount: parseTags(tags).length,
        hasNegative: Boolean(currentText.negative?.trim()),
        hasModel: Boolean(model.trim()),
        hasPurpose: Boolean(purpose.trim()),
      },
    });
    setMessage('Saved locally.');
    onPromptSaved?.('Prompt saved locally.');
  };

  const handleDeleteLocal = (promptId: string) => {
    const next = localPrompts.filter(item => item.id !== promptId);
    setLocalPrompts(next);
    saveLocalPrompts(next);
    void assignPromptToSet(promptId, null).then(() => {
      void refreshPromptSets();
    });
  };

  const handleSaveLocalToCloud = async (prompt: SavedPrompt) => {
    if (!authUser || !isPro) {
      setError('Upgrade to Pro to save prompts to the cloud.');
      return;
    }
    setError(null);
    setMessage(null);
    try {
      const savedPrompt = await createPrompt({
        name: prompt.name,
        positive: prompt.positive,
        negative: prompt.negative,
        tags: prompt.tags,
        model: prompt.model,
        purpose: prompt.purpose,
        note: prompt.note,
      });
      await assignPromptToSet(savedPrompt.id, promptSetAssignments[prompt.id] ?? null);
      await refresh();
      await refreshPromptSets();
      void trackAnalyticsEvent({
        eventType: 'prompt_save',
        pageKey: 'generator',
        userId: authUser.id,
        metadata: {
          storage: 'cloud_from_local',
          sourcePromptId: prompt.id,
          tagCount: prompt.tags?.length ?? 0,
          hasNegative: Boolean(prompt.negative?.trim()),
          hasModel: Boolean(prompt.model?.trim()),
          hasPurpose: Boolean(prompt.purpose?.trim()),
        },
      });
      setMessage('Saved to cloud.');
      onPromptSaved?.('Prompt saved to the cloud.');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save prompt.');
    }
  };

  const handleCreatePromptSetInline = async () => {
    setError(null);
    setNewPromptSetMessage(null);
    try {
      const created = await createPromptSet({
        name: newPromptSetName,
        description: newPromptSetDescription,
      });
      await refreshPromptSets();
      setSelectedPromptSetId(created.id);
      setIsCreatingPromptSetInline(false);
      setNewPromptSetName('');
      setNewPromptSetDescription('');
      setNewPromptSetMessage('Prompt Set created.');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to create Prompt Set.');
    }
  };

  const handleRenamePromptSet = async (setId: string) => {
    setError(null);
    try {
      await updatePromptSet(setId, {
        name: editingPromptSetName,
      });
      await refreshPromptSets();
      setEditingPromptSetId(null);
      setEditingPromptSetName('');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to rename Prompt Set.');
    }
  };

  const handleDeletePromptSet = async (setId: string) => {
    setError(null);
    try {
      await deletePromptSet(setId);
      await refreshPromptSets();
      if (selectedPromptSetId === setId) {
        setSelectedPromptSetId('');
      }
      if (activePromptSetFilter === setId) {
        setActivePromptSetFilter('all');
      }
    } catch (err: any) {
      setError(err?.message ?? 'Failed to delete Prompt Set.');
    }
  };

  const handleMovePromptToSet = async (promptId: string, setId: string) => {
    setError(null);
    try {
      await assignPromptToSet(promptId, setId || null);
      await refreshPromptSets();
      setMessage(setId ? 'Prompt moved to set.' : 'Prompt removed from set.');
    } catch (err: any) {
      setError(err?.message ?? 'Failed to move prompt.');
    }
  };

  const handleExport = async () => {
    if (!authUser || !isPro) {
      setError('Upgrade to Pro to export prompts.');
      return;
    }
    try {
      const payload = await exportPromptsPayload();
      setLibraryJson(JSON.stringify(payload, null, 2));
      setMessage('Exported prompts.');
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to export.');
    }
  };

  const handleImport = async () => {
    if (!authUser || !isPro) {
      setError('Upgrade to Pro to import prompts.');
      return;
    }
    try {
      const parsed = JSON.parse(libraryJson);
      await importPromptsPayload(parsed);
      await refresh();
      setMessage('Imported prompts.');
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? 'Invalid prompts JSON.');
    }
  };

  const handleDownload = async () => {
    if (!authUser || !isPro) {
      setError('Upgrade to Pro to download prompts.');
      return;
    }
    try {
      const payload = await exportPromptsPayload();
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'saved-prompts.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage('Downloaded prompts JSON.');
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to download.');
    }
  };

  const handleCopy = (prompt: SavedPrompt) => {
    const full = prompt.negative
      ? `${prompt.positive}\n\nNEGATIVE PROMPT:\n${prompt.negative}`
      : prompt.positive;
    navigator.clipboard.writeText(full).catch(() => {
      // ignore
    });
    setMessage('Copied prompt.');
  };

  return (
    <>
      {renderLibraryShell && (
        <div className="prompt-library">
          <div className="prompt-library-header">
            <h3>Saved Prompts</h3>
            {manualUrl && (
              <a
                className="prompt-library-manual-link"
                href={`${manualUrl}#prompt-library`}
                target="_blank"
                rel="noreferrer"
              >
                Learn more
              </a>
            )}
            <span className="prompt-library-count">{prompts.length}</span>
          </div>
          {!hideSaveBar && (
            <div className="prompt-library-save-bar">
              <div className="prompt-library-save-copy">
                Save the current prompt with a name, tags, and optional metadata.
              </div>
              <button type="button" className="prompt-library-save-open" onClick={() => setIsSaveModalOpen(true)}>
                Save Prompt
              </button>
            </div>
          )}
          <details className="prompt-library-io">
            <summary>Import / Export</summary>
            <textarea
              rows={5}
              placeholder="Prompts JSON import/export"
              value={libraryJson}
              onChange={event => setLibraryJson(event.target.value)}
            />
            <div className="prompt-library-actions">
              <button type="button" onClick={handleExport}>
                Export Prompts
              </button>
              <button type="button" onClick={handleImport}>
                Import Prompts
              </button>
              <button type="button" onClick={handleDownload}>
                Download Prompts
              </button>
            </div>
          </details>
          {error && <div className="prompt-library-error">{error}</div>}
          {message && <div className="prompt-library-message">{message}</div>}
          <div className="prompt-library-set-panel">
            <div className="prompt-library-section-header">
              <div className="prompt-library-section-title">Prompt Sets</div>
              {canUsePromptSets && (
                <button
                  type="button"
                  className="prompt-library-section-toggle"
                  onClick={() => {
                    setIsCreatingPromptSetInline(prev => !prev);
                    setNewPromptSetMessage(null);
                  }}
                >
                  {isCreatingPromptSetInline ? 'Cancel' : 'Create set'}
                </button>
              )}
            </div>
            {canUsePromptSets && isCreatingPromptSetInline && (
              <div className="prompt-library-set-create">
                <input
                  type="text"
                  placeholder="Prompt Set name"
                  value={newPromptSetName}
                  onChange={event => setNewPromptSetName(event.target.value)}
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newPromptSetDescription}
                  onChange={event => setNewPromptSetDescription(event.target.value)}
                />
                <div className="prompt-library-set-create-actions">
                  <button type="button" onClick={handleCreatePromptSetInline}>
                    Create Prompt Set
                  </button>
                </div>
              </div>
            )}
            {newPromptSetMessage && <div className="prompt-library-message">{newPromptSetMessage}</div>}
            {!canUsePromptSets ? (
              <div className="prompt-library-empty">Log in to access your Prompt Sets.</div>
            ) : promptSets.length === 0 ? (
              <div className="prompt-library-empty">No Prompt Sets yet.</div>
            ) : (
              <div className="prompt-library-set-list">
                {promptSets.map(set => (
                  <div key={set.id} className="prompt-library-set-item">
                    {editingPromptSetId === set.id ? (
                      <>
                        <input
                          type="text"
                          value={editingPromptSetName}
                          onChange={event => setEditingPromptSetName(event.target.value)}
                        />
                        <div className="prompt-library-set-item-actions">
                          <button type="button" onClick={() => handleRenamePromptSet(set.id)}>
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPromptSetId(null);
                              setEditingPromptSetName('');
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="prompt-library-set-item-main">
                          <div className="prompt-library-set-item-title">{set.name}</div>
                          {set.description && (
                            <div className="prompt-library-set-item-description">{set.description}</div>
                          )}
                        </div>
                        <div className="prompt-library-set-item-actions">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPromptSetId(set.id);
                              setEditingPromptSetName(set.name);
                            }}
                          >
                            Rename
                          </button>
                          <button type="button" onClick={() => void handleDeletePromptSet(set.id)}>
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {canUsePromptSets && (
            <div className="prompt-library-filter-row">
              <label className="prompt-library-filter">
                <span>Filter by Set</span>
                <select
                value={activePromptSetFilter}
                onChange={event => setActivePromptSetFilter(event.target.value)}
              >
                <option value="all">All prompts</option>
                <option value="unassigned">Unassigned</option>
                {promptSetOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            </div>
          )}
          <div className="prompt-library-list">
            {showLocalPrompts && (
              <div className="prompt-library-section">
                <div className="prompt-library-section-header">
                  <div className="prompt-library-section-title">Local Prompts</div>
                  {hiddenLocalPromptCount > 0 && (
                    <button
                      type="button"
                      className="prompt-library-section-toggle"
                      onClick={() => setShowAllLocalPrompts(prev => !prev)}
                    >
                      {showAllLocalPrompts
                        ? 'Show recent only'
                        : `Show ${hiddenLocalPromptCount} older`}
                    </button>
                  )}
                </div>
                {filteredLocalPrompts.length === 0 ? (
                  <div className="prompt-library-empty">No local prompts yet.</div>
                ) : (
                  filteredLocalPrompts.map(item => (
                    <div key={item.id} className="prompt-library-item">
                      <div className="prompt-library-item-main">
                        <div className="prompt-library-item-title">{item.name}</div>
                        {getAssignedPromptSet(item.id) && (
                          <div className="prompt-library-item-set-chip">
                            {getAssignedPromptSet(item.id)?.name}
                          </div>
                        )}
                        <div className="prompt-library-item-text">{item.positive}</div>
                        {(item.model || item.purpose || item.usedAt) && (
                          <div className="prompt-library-item-meta">
                            {item.model && <span>Model: {item.model}</span>}
                            {item.purpose && <span>Purpose: {item.purpose}</span>}
                            {item.usedAt && <span>Used: {item.usedAt}</span>}
                          </div>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="prompt-library-item-tags">{item.tags.join(', ')}</div>
                        )}
                      </div>
                      <div className="prompt-library-item-actions">
                        {canUsePromptSets && (
                          <label className="prompt-library-item-set-selector">
                            <span>Set</span>
                            <select
                              value={promptSetAssignments[item.id] ?? ''}
                              onChange={event => void handleMovePromptToSet(item.id, event.target.value)}
                            >
                              <option value="">No set</option>
                              {promptSetOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                        )}
                        <button type="button" onClick={() => handleCopy(item)}>
                          Copy
                        </button>
                        <button type="button" onClick={() => onAddToPrompt?.(item.positive)}>
                          Add to Prompt
                        </button>
                        <button type="button" onClick={() => handleSaveLocalToCloud(item)}>
                          Save to Cloud
                        </button>
                        <button type="button" onClick={() => handleDeleteLocal(item.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            {showCloudPrompts && (
              <div className="prompt-library-section">
                <div className="prompt-library-section-title">Cloud Prompts</div>
                {!authUser ? (
                  <div className="prompt-library-empty">Log in to access your cloud prompts.</div>
                ) : !isPro ? (
                  <div className="prompt-library-empty">Upgrade to Pro to unlock cloud prompts.</div>
                ) : filteredCloudPrompts.length === 0 ? (
                  <div className="prompt-library-empty">No cloud prompts yet.</div>
                ) : (
                  filteredCloudPrompts.map(item => (
                    <div key={item.id} className="prompt-library-item">
                      <div className="prompt-library-item-main">
                        <div className="prompt-library-item-title">{item.name}</div>
                        {getAssignedPromptSet(item.id) && (
                          <div className="prompt-library-item-set-chip">
                            {getAssignedPromptSet(item.id)?.name}
                          </div>
                        )}
                        <div className="prompt-library-item-text">{item.positive}</div>
                        {(item.model || item.purpose || item.usedAt) && (
                          <div className="prompt-library-item-meta">
                            {item.model && <span>Model: {item.model}</span>}
                            {item.purpose && <span>Purpose: {item.purpose}</span>}
                            {item.usedAt && <span>Used: {item.usedAt}</span>}
                          </div>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="prompt-library-item-tags">{item.tags.join(', ')}</div>
                        )}
                      </div>
                      <div className="prompt-library-item-actions">
                        {canUsePromptSets && (
                          <label className="prompt-library-item-set-selector">
                            <span>Set</span>
                            <select
                              value={promptSetAssignments[item.id] ?? ''}
                              onChange={event => void handleMovePromptToSet(item.id, event.target.value)}
                            >
                              <option value="">No set</option>
                              {promptSetOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                        )}
                        <button type="button" onClick={() => handleCopy(item)}>
                          Copy
                        </button>
                        <button type="button" onClick={() => onAddToPrompt?.(item.positive)}>
                          Add to Prompt
                        </button>
                        <button type="button" onClick={async () => {
                          await deletePrompt(item.id);
                          await assignPromptToSet(item.id, null);
                          await refresh();
                          await refreshPromptSets();
                        }}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Save Prompt"
        className="prompt-library-save-modal"
      >
        <div className="prompt-library-save">
          <input
            type="text"
            placeholder="Prompt name"
            value={name}
            onChange={event => setName(event.target.value)}
          />
          {canUsePromptSets ? (
            <>
              <select
                value={selectedPromptSetId}
                onChange={event => {
                  const value = event.target.value;
                  setSelectedPromptSetId(value);
                  setNewPromptSetMessage(null);
                  if (value === CREATE_NEW_PROMPT_SET_VALUE) {
                    setIsCreatingPromptSetInline(true);
                  } else {
                    setIsCreatingPromptSetInline(false);
                  }
                }}
              >
                <option value="">No Prompt Set</option>
                {promptSetOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
                <option value={CREATE_NEW_PROMPT_SET_VALUE}>Create new set</option>
              </select>
              {isCreatingPromptSetInline && (
                <div className="prompt-library-set-create prompt-library-set-create-inline">
                  <input
                    type="text"
                    placeholder="Prompt Set name"
                    value={newPromptSetName}
                    onChange={event => setNewPromptSetName(event.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newPromptSetDescription}
                    onChange={event => setNewPromptSetDescription(event.target.value)}
                  />
                  <div className="prompt-library-set-create-actions">
                    <button type="button" onClick={handleCreatePromptSetInline}>
                      Create set
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingPromptSetInline(false);
                        setSelectedPromptSetId('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="prompt-library-empty">Log in to organize prompts with Prompt Sets.</div>
          )}
          <input
            type="text"
            placeholder="Tags (comma)"
            value={tags}
            onChange={event => setTags(event.target.value)}
          />
          <input
            type="text"
            placeholder="Model (free text)"
            value={model}
            onChange={event => setModel(event.target.value)}
          />
          <input
            type="text"
            placeholder="Purpose (free text)"
            value={purpose}
            onChange={event => setPurpose(event.target.value)}
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={event => setNote(event.target.value)}
          />
          <label className="prompt-library-save-toggle">
            <input
              type="checkbox"
              checked={keepFieldsAfterSaving}
              onChange={event => setKeepFieldsAfterSaving(event.target.checked)}
            />
            <span>Keep fields after saving</span>
          </label>
          <div className="prompt-library-save-actions">
            <button type="button" onClick={handleSaveLocal}>
              Save Locally
            </button>
            <button type="button" onClick={handleSave}>
              Save to Cloud
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
