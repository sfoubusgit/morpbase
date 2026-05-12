import { useMemo, useState, useEffect, useRef } from 'react';
import type {
  PromptAdditionEntry,
  PromptSet,
  SavedPrompt,
  SavedPromptCharacterLineage,
} from '../../types';
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
  defaultSaveName?: string;
  renderLibraryShell?: boolean;
  onPromptSaved?: (message: string) => void;
  activeCharacterId?: string | null;
  activeCharacterName?: string | null;
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
  defaultSaveName,
  renderLibraryShell = true,
  onPromptSaved,
  activeCharacterId = null,
  activeCharacterName = null,
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
  const activeCharacterLineage = useMemo<SavedPromptCharacterLineage | undefined>(() => {
    const characterId = activeCharacterId?.trim() ?? '';
    const nameSnapshot = activeCharacterName?.trim() ?? '';
    if (!characterId || !nameSnapshot) {
      return undefined;
    }
    return {
      characterId,
      nameSnapshot,
    };
  }, [activeCharacterId, activeCharacterName]);
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
      if (defaultSaveName && !name) {
        setName(defaultSaveName);
      }
      setIsSaveModalOpen(true);
    }
  }, [externalOpenSaveSignal, defaultSaveName, name]);

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
        characterLineage: activeCharacterLineage,
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
      setMessage('Kept in cloud memory.');
      onPromptSaved?.('Prompt kept in cloud memory.');
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
      characterLineage: activeCharacterLineage,
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
    setMessage('Kept in local memory.');
    onPromptSaved?.('Prompt kept in local memory.');
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
        characterLineage: prompt.characterLineage,
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
      setMessage('Moved into cloud memory.');
      onPromptSaved?.('Prompt moved into cloud memory.');
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
      setMessage(setId ? 'Kept work moved to set.' : 'Kept work removed from set.');
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
    setMessage('Copied kept work.');
  };

  return (
    <>
      {renderLibraryShell && (
        <div className="prompt-library">

          {/* ── 1. Save action + Import/Export ── */}
          {!hideSaveBar && (
            <div className="prompt-library-save-bar">
              <div className="prompt-library-save-copy">
                Keep the current prompt in Memory with a name, tags, and optional metadata.
              </div>
              <button type="button" className="prompt-library-save-open" onClick={() => { setError(null); setMessage(null); setIsSaveModalOpen(true); }}>
                Keep in Memory
              </button>
            </div>
          )}
          <details className="prompt-library-io">
            <summary>Import / Export</summary>
            <textarea
              rows={5}
              placeholder="Paste exported prompts JSON here to import, or export below."
              value={libraryJson}
              onChange={event => setLibraryJson(event.target.value)}
            />
            <div className="prompt-library-actions">
              <button type="button" onClick={handleExport}>Export</button>
              <button type="button" onClick={handleImport}>Import</button>
              <button type="button" onClick={handleDownload}>Download JSON</button>
            </div>
          </details>

          {/* ── 2. Feedback ── */}
          {error && <div className="prompt-library-error">{error}</div>}
          {message && <div className="prompt-library-message">{message}</div>}

          {/* ── 3. Two-column body: list + sets sidebar ── */}
          <div className="prompt-library-body">

            {/* Main: prompt list */}
            <div className="prompt-library-main">
              {showLocalPrompts && (
                <div className="prompt-library-section">
                  <div className="prompt-library-section-header">
                    <div className="prompt-library-section-title">Local Memory</div>
                    {hiddenLocalPromptCount > 0 && (
                      <button
                        type="button"
                        className="prompt-library-section-toggle"
                        onClick={() => setShowAllLocalPrompts(prev => !prev)}
                      >
                        {showAllLocalPrompts ? 'Show recent only' : `Show ${hiddenLocalPromptCount} older`}
                      </button>
                    )}
                  </div>
                  {filteredLocalPrompts.length === 0 ? (
                    <div className="prompt-library-empty">No kept work lives here yet.</div>
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
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </select>
                            </label>
                          )}
                          <button type="button" onClick={() => handleCopy(item)}>Copy</button>
                          <button type="button" onClick={() => onAddToPrompt?.(item.positive)}>Return to Workspace</button>
                          <button type="button" onClick={() => handleSaveLocalToCloud(item)}>Move to Cloud</button>
                          <button type="button" onClick={() => handleDeleteLocal(item.id)}>Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              {showCloudPrompts && (
                <div className="prompt-library-section">
                  <div className="prompt-library-section-header">
                    <div className="prompt-library-section-title">Cloud Memory</div>
                    {prompts.length > 0 && (
                      <span className="prompt-library-count">{prompts.length}</span>
                    )}
                  </div>
                  {!authUser ? (
                    <div className="prompt-library-empty">Log in to access your cloud memory.</div>
                  ) : !isPro ? (
                    <div className="prompt-library-empty">Upgrade to Pro to unlock cloud memory.</div>
                  ) : filteredCloudPrompts.length === 0 ? (
                    <div className="prompt-library-empty">No kept work lives in cloud memory yet.</div>
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
                                  <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                              </select>
                            </label>
                          )}
                          <button type="button" onClick={() => handleCopy(item)}>Copy</button>
                          <button type="button" onClick={() => onAddToPrompt?.(item.positive)}>Return to Workspace</button>
                          <button type="button" onClick={async () => {
                            await deletePrompt(item.id);
                            await assignPromptToSet(item.id, null);
                            await refresh();
                            await refreshPromptSets();
                          }}>Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Sidebar: Prompt Sets + filter */}
            {canUsePromptSets && (
              <aside className="prompt-library-sets-aside">
                <div className="prompt-library-sets-module">

                  {/* Header */}
                  <div className="prompt-library-sets-head">
                    <span className="prompt-library-sets-kicker">Prompt Sets</span>
                    <button
                      type="button"
                      className="prompt-library-section-toggle"
                      onClick={() => { setIsCreatingPromptSetInline(prev => !prev); setNewPromptSetMessage(null); }}
                    >
                      {isCreatingPromptSetInline ? 'Cancel' : 'New set'}
                    </button>
                  </div>

                  {/* Filter — sits right under the header */}
                  {promptSets.length > 0 && (
                    <div className="prompt-library-sets-filter">
                      <select
                        value={activePromptSetFilter}
                        onChange={event => setActivePromptSetFilter(event.target.value)}
                      >
                        <option value="all">All prompts</option>
                        <option value="unassigned">Unassigned</option>
                        {promptSetOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Inline create form */}
                  {isCreatingPromptSetInline && (
                    <div className="prompt-library-set-create">
                      <input
                        type="text"
                        placeholder="Set name"
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
                        <button type="button" onClick={handleCreatePromptSetInline}>Create</button>
                      </div>
                    </div>
                  )}
                  {newPromptSetMessage && <div className="prompt-library-message">{newPromptSetMessage}</div>}

                  {/* Set list */}
                  {promptSets.length === 0 ? (
                    <div className="prompt-library-empty">No sets yet — create one to organize.</div>
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
                                <button type="button" onClick={() => handleRenamePromptSet(set.id)}>Save</button>
                                <button type="button" onClick={() => { setEditingPromptSetId(null); setEditingPromptSetName(''); }}>Cancel</button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                className={`prompt-library-set-item-main${activePromptSetFilter === set.id ? ' active' : ''}`}
                                role="button"
                                tabIndex={0}
                                onClick={() => setActivePromptSetFilter(activePromptSetFilter === set.id ? 'all' : set.id)}
                                onKeyDown={e => e.key === 'Enter' && setActivePromptSetFilter(activePromptSetFilter === set.id ? 'all' : set.id)}
                              >
                                <div className="prompt-library-set-item-title">{set.name}</div>
                                {set.description && (
                                  <div className="prompt-library-set-item-description">{set.description}</div>
                                )}
                              </div>
                              <div className="prompt-library-set-item-actions">
                                <button type="button" onClick={() => { setEditingPromptSetId(set.id); setEditingPromptSetName(set.name); }}>Rename</button>
                                <button type="button" onClick={() => void handleDeletePromptSet(set.id)}>Delete</button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </aside>
            )}

          </div>

        </div>
      )}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        title="Keep in Memory"
        className="prompt-library-save-modal"
      >
        <div className="prompt-library-save">
          {error && <div className="prompt-library-error">{error}</div>}
          {message && <div className="prompt-library-message">{message}</div>}

          <div className="prompt-library-save-field">
            <label className="prompt-library-save-label" htmlFor="pls-name">Name</label>
            <input
              id="pls-name"
              type="text"
              className="prompt-library-save-input"
              placeholder="e.g. Cinematic portrait, low light"
              value={name}
              onChange={event => setName(event.target.value)}
            />
          </div>

          {canUsePromptSets ? (
            <>
              <div className="prompt-library-save-field">
                <label className="prompt-library-save-label" htmlFor="pls-set">Prompt Set</label>
                <select
                  id="pls-set"
                  className="prompt-library-save-input"
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
                  <option value={CREATE_NEW_PROMPT_SET_VALUE}>+ Create new set</option>
                </select>
              </div>
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
            <div className="prompt-library-empty">Log in to organize kept work into Prompt Sets.</div>
          )}

          <div className="prompt-library-save-row">
            <div className="prompt-library-save-field">
              <label className="prompt-library-save-label" htmlFor="pls-tags">Tags</label>
              <input
                id="pls-tags"
                type="text"
                className="prompt-library-save-input"
                placeholder="cinematic, portrait, fantasy"
                value={tags}
                onChange={event => setTags(event.target.value)}
              />
            </div>
            <div className="prompt-library-save-field">
              <label className="prompt-library-save-label" htmlFor="pls-model">Model</label>
              <input
                id="pls-model"
                type="text"
                className="prompt-library-save-input"
                placeholder="SDXL, Flux, Midjourney…"
                value={model}
                onChange={event => setModel(event.target.value)}
              />
            </div>
          </div>

          <div className="prompt-library-save-row">
            <div className="prompt-library-save-field">
              <label className="prompt-library-save-label" htmlFor="pls-purpose">Purpose</label>
              <input
                id="pls-purpose"
                type="text"
                className="prompt-library-save-input"
                placeholder="Reference, test, final…"
                value={purpose}
                onChange={event => setPurpose(event.target.value)}
              />
            </div>
            <div className="prompt-library-save-field">
              <label className="prompt-library-save-label" htmlFor="pls-note">Note</label>
              <input
                id="pls-note"
                type="text"
                className="prompt-library-save-input"
                placeholder="Optional"
                value={note}
                onChange={event => setNote(event.target.value)}
              />
            </div>
          </div>

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
              Keep Locally
            </button>
            <button type="button" onClick={handleSave}>
              Keep in Cloud
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
