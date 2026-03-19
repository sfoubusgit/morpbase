import { useMemo, useState, useEffect } from 'react';
import type { PromptAdditionEntry, SavedPrompt } from '../../types';
import {
  createPrompt,
  deletePrompt,
  exportPromptsPayload,
  importPromptsPayload,
  listPrompts,
} from '../../engine/promptStore';
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
};

const LOCAL_STORE_KEY = 'promptgen:local_prompts:v1';
const KEEP_SAVE_FIELDS_KEY = 'promptgen:keep_save_fields_after_saving';
const SAVE_FORM_DRAFT_KEY = 'promptgen:save_prompt_form_draft';
const RECENT_LOCAL_PROMPTS_LIMIT = 4;

type SaveFormDraft = {
  name?: string;
  tags?: string;
  model?: string;
  purpose?: string;
  note?: string;
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
  const [name, setName] = useState(initialDraft.name ?? '');
  const [tags, setTags] = useState(initialDraft.tags ?? '');
  const [model, setModel] = useState(initialDraft.model ?? '');
  const [purpose, setPurpose] = useState(initialDraft.purpose ?? '');
  const [note, setNote] = useState(initialDraft.note ?? '');
  const [libraryJson, setLibraryJson] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [showAllLocalPrompts, setShowAllLocalPrompts] = useState(false);
  const [keepFieldsAfterSaving, setKeepFieldsAfterSaving] = useState<boolean>(initialKeepFieldsAfterSaving);

  const currentText = useMemo(
    () => buildPromptText(prompt, customAdditions, positionedAdditions, editedPositive, editedNegative),
    [prompt, customAdditions, positionedAdditions, editedPositive, editedNegative]
  );
  const visibleLocalPrompts = useMemo(
    () => showAllLocalPrompts ? localPrompts : localPrompts.slice(0, RECENT_LOCAL_PROMPTS_LIMIT),
    [localPrompts, showAllLocalPrompts]
  );
  const hiddenLocalPromptCount = Math.max(0, localPrompts.length - RECENT_LOCAL_PROMPTS_LIMIT);

  const refresh = async () => {
    try {
      const next = await listPrompts();
      setPrompts(next);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load prompts.');
    }
  };

  useEffect(() => {
    setLocalPrompts(loadLocalPrompts());
    if (authUser) {
      refresh();
    } else {
      setPrompts([]);
    }
  }, [authUser]);

  useEffect(() => {
    if (externalOpenSaveSignal > 0) {
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
        })
      );
    } catch {
      // ignore storage errors
    }
  }, [keepFieldsAfterSaving, name, tags, model, purpose, note]);

  const parseTags = (raw: string) =>
    raw
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

  const resetSaveFields = () => {
    setName('');
    setTags('');
    setModel('');
    setPurpose('');
    setNote('');
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
      await createPrompt({
        name,
        positive: currentText.positive,
        negative: currentText.negative,
        tags: parseTags(tags),
        model,
        purpose,
        note,
      });
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
  };

  const handleDeleteLocal = (promptId: string) => {
    const next = localPrompts.filter(item => item.id !== promptId);
    setLocalPrompts(next);
    saveLocalPrompts(next);
  };

  const handleSaveLocalToCloud = async (prompt: SavedPrompt) => {
    if (!authUser || !isPro) {
      setError('Upgrade to Pro to save prompts to the cloud.');
      return;
    }
    setError(null);
    setMessage(null);
    try {
      await createPrompt({
        name: prompt.name,
        positive: prompt.positive,
        negative: prompt.negative,
        tags: prompt.tags,
        model: prompt.model,
        purpose: prompt.purpose,
        note: prompt.note,
      });
      await refresh();
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
    } catch (err: any) {
      setError(err?.message ?? 'Failed to save prompt.');
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
                {localPrompts.length === 0 ? (
                  <div className="prompt-library-empty">No local prompts yet.</div>
                ) : (
                  visibleLocalPrompts.map(item => (
                    <div key={item.id} className="prompt-library-item">
                      <div className="prompt-library-item-main">
                        <div className="prompt-library-item-title">{item.name}</div>
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
                ) : prompts.length === 0 ? (
                  <div className="prompt-library-empty">No cloud prompts yet.</div>
                ) : (
                  prompts.map(item => (
                    <div key={item.id} className="prompt-library-item">
                      <div className="prompt-library-item-main">
                        <div className="prompt-library-item-title">{item.name}</div>
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
                        <button type="button" onClick={() => handleCopy(item)}>
                          Copy
                        </button>
                        <button type="button" onClick={() => onAddToPrompt?.(item.positive)}>
                          Add to Prompt
                        </button>
                        <button type="button" onClick={async () => {
                          await deletePrompt(item.id);
                          await refresh();
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
