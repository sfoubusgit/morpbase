import { useState, useEffect, useCallback } from 'react';
import type { PromptAdditionEntry } from '../../types';
import type { LaneSet } from '../../types/laneSets';
import { PromptLibrary } from './PromptLibrary';
import { LaneSetCard } from './LaneSetsModal';
import { listCaptureSets, deleteCaptureSet, type CaptureSet } from '../../engine/captureStore';
import './PromptsPage.css';

type PromptsPageProps = {
  prompt?: any | null;
  customAdditions?: string[];
  positionedAdditions?: PromptAdditionEntry[];
  editedPositive?: string | null;
  editedNegative?: string | null;
  onAddToPrompt?: (text: string) => void;
  authUser?: { id: string } | null;
  isPro?: boolean;
  manualUrl?: string;
  activeCharacterId?: string | null;
  activeCharacterName?: string | null;
  externalOpenSaveSignal?: number;
  defaultSaveName?: string;
  laneSets?: LaneSet[];
  onApplyLaneSet?: (set: LaneSet) => void;
  onDeleteLaneSet?: (id: string) => void;
};

const FLOW_STEPS = [
  {
    num: '1',
    label: 'Shape in Workspace',
    text: 'Build and refine the live prompt workflow.',
  },
  {
    num: '2',
    label: 'Review in Prompt Preview',
    text: 'Check the output and decide what is worth keeping.',
  },
  {
    num: '3',
    label: 'Keep in Memory',
    text: 'Organize proven outputs so they are easy to find and reuse.',
  },
];

function SetsSection({
  laneSets = [],
  onApplyLaneSet,
  onDeleteLaneSet,
}: {
  laneSets?: LaneSet[];
  onApplyLaneSet?: (set: LaneSet) => void;
  onDeleteLaneSet?: (id: string) => void;
}) {
  const [tab, setTab] = useState<'recipes' | 'prompts'>(laneSets.length > 0 ? 'recipes' : 'prompts');
  const [sets, setSets] = useState<CaptureSet[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  useEffect(() => {
    setSets(listCaptureSets());
  }, []);

  const handleDelete = useCallback((id: string) => {
    deleteCaptureSet(id);
    setSets(prev => prev.filter(s => s.id !== id));
  }, []);

  const handleCopy = useCallback((text: string, key: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedIdx(key);
    setTimeout(() => setCopiedIdx(null), 1500);
  }, []);

  const handleCopyAll = useCallback((set: CaptureSet) => {
    void navigator.clipboard.writeText(set.prompts.join('\n\n'));
    setCopiedIdx(`all:${set.id}`);
    setTimeout(() => setCopiedIdx(null), 1500);
  }, []);

  const handleDownload = useCallback((set: CaptureSet) => {
    const safeName = set.name.replace(/[^a-z0-9-_ ]/gi, '').trim().replace(/\s+/g, '_') || 'prompt_set';
    const blob = new Blob([set.prompts.join('\n\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  if (laneSets.length === 0 && sets.length === 0) return null;

  return (
    <div className="capture-sets-section">
      <div className="capture-sets-header">
        <h2 className="capture-sets-title">Saved Sets</h2>
        <p className="capture-sets-sub">Reusable builder recipes and captured prompt batches, together in one place.</p>
      </div>

      <div className="sets-tabs">
        <button
          type="button"
          className={`sets-tab${tab === 'recipes' ? ' sets-tab--active' : ''}`}
          onClick={() => setTab('recipes')}
        >
          Recipes ({laneSets.length})
        </button>
        <button
          type="button"
          className={`sets-tab${tab === 'prompts' ? ' sets-tab--active' : ''}`}
          onClick={() => setTab('prompts')}
        >
          Prompt Sets ({sets.length})
        </button>
      </div>

      {tab === 'recipes' ? (
        laneSets.length === 0 ? (
          <div className="sets-empty">No recipes yet. In the Workspace, open the Sets panel and save your current state to create one.</div>
        ) : (
          <div className="ls-card-list">
            {laneSets.map(set => (
              <LaneSetCard
                key={set.id}
                set={set}
                onApply={() => onApplyLaneSet?.(set)}
                onDelete={() => onDeleteLaneSet?.(set.id)}
              />
            ))}
          </div>
        )
      ) : (
        sets.length === 0 ? (
          <div className="sets-empty">No prompt sets yet. Capture prompts in the Workspace and save them as a set.</div>
        ) : (
          <div className="capture-sets-list">
            {sets.map(set => (
              <div key={set.id} className="capture-set-card">
                <div className="capture-set-top">
                  <button
                    type="button"
                    className="capture-set-name-btn"
                    onClick={() => setExpandedId(prev => prev === set.id ? null : set.id)}
                  >
                    <span className="capture-set-name">{set.name}</span>
                    <span className="capture-set-meta">{set.prompts.length} prompt{set.prompts.length !== 1 ? 's' : ''} · {new Date(set.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                  </button>
                  <button
                    type="button"
                    className="capture-set-copy-btn"
                    onClick={() => handleCopyAll(set)}
                    title="Copy all prompts to clipboard"
                  >
                    {copiedIdx === `all:${set.id}` ? 'Copied' : 'Copy All'}
                  </button>
                  <button
                    type="button"
                    className="capture-set-copy-btn"
                    onClick={() => handleDownload(set)}
                    title="Download all prompts as a .txt file"
                  >
                    Download
                  </button>
                  <button type="button" className="capture-set-delete-btn" onClick={() => handleDelete(set.id)} title="Delete set">×</button>
                </div>
                {expandedId === set.id && (
                  <div className="capture-set-prompts">
                    {set.prompts.map((text, i) => {
                      const key = `${set.id}:${i}`;
                      return (
                        <div key={key} className="capture-set-prompt-row">
                          <span className="capture-set-prompt-num">#{i + 1}</span>
                          <p className="capture-set-prompt-text">{text}</p>
                          <button
                            type="button"
                            className="capture-set-copy-btn"
                            onClick={() => handleCopy(text, key)}
                          >
                            {copiedIdx === key ? 'Copied' : 'Copy'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export function PromptsPage({
  prompt,
  customAdditions = [],
  positionedAdditions = [],
  editedPositive,
  editedNegative,
  onAddToPrompt,
  authUser,
  isPro = false,
  manualUrl,
  activeCharacterId = null,
  activeCharacterName = null,
  externalOpenSaveSignal,
  defaultSaveName,
  laneSets,
  onApplyLaneSet,
  onDeleteLaneSet,
}: PromptsPageProps) {
  return (
    <div className="memory-page">

      {/* Hero */}
      <div className="memory-hero">
        <div className="memory-hero-left">
          <div className="memory-eyebrow">Memory Realm</div>
          <h1 className="memory-hero-title">Memory</h1>
          <p className="memory-hero-sub">
            Keep, organize, and reuse the Workspace outputs worth returning to.
          </p>
          {manualUrl && (
            <a
              className="memory-manual-link"
              href={`${manualUrl}#prompt-library`}
              target="_blank"
              rel="noreferrer"
            >
              Memory manual ↗
            </a>
          )}
        </div>

        <div className="memory-hero-flow">
          {FLOW_STEPS.map((step, i) => (
            <div key={step.num} className="memory-flow-item">
              {i > 0 && <div className="memory-flow-divider" />}
              <div className="memory-flow-card">
                <span className="memory-flow-num">{step.num}</span>
                <div className="memory-flow-body">
                  <div className="memory-flow-label">{step.label}</div>
                  <div className="memory-flow-text">{step.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Sets */}
      <SetsSection
        laneSets={laneSets}
        onApplyLaneSet={onApplyLaneSet}
        onDeleteLaneSet={onDeleteLaneSet}
      />

      {/* Library */}
      <div className="memory-body">
        <PromptLibrary
          prompt={prompt ?? null}
          customAdditions={customAdditions}
          positionedAdditions={positionedAdditions}
          editedPositive={editedPositive}
          editedNegative={editedNegative}
          onAddToPrompt={onAddToPrompt}
          authUser={authUser}
          isPro={isPro}
          manualUrl={manualUrl}
          activeCharacterId={activeCharacterId}
          activeCharacterName={activeCharacterName}
          externalOpenSaveSignal={externalOpenSaveSignal}
          defaultSaveName={defaultSaveName}
          showCloudPrompts
          showLocalPrompts={false}
        />
      </div>

    </div>
  );
}
