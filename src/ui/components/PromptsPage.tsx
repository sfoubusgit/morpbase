import { useState, useEffect, useCallback } from 'react';
import type { PromptAdditionEntry } from '../../types';
import { PromptLibrary } from './PromptLibrary';
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

function CapturedSetsSection() {
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

  if (sets.length === 0) return null;

  return (
    <div className="capture-sets-section">
      <div className="capture-sets-header">
        <h2 className="capture-sets-title">Saved Sets</h2>
        <p className="capture-sets-sub">Prompt sessions captured from the Workspace.</p>
      </div>
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
      <CapturedSetsSection />

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
          showCloudPrompts
          showLocalPrompts={false}
        />
      </div>

    </div>
  );
}
