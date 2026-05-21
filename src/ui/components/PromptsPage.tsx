import type { PromptAdditionEntry } from '../../types';
import { PromptLibrary } from './PromptLibrary';
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
