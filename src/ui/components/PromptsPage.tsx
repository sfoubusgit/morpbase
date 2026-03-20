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
};

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
}: PromptsPageProps) {
  return (
    <div className="prompts-page">
      <header className="prompts-header">
        <div>
          <h2>Prompt Archive</h2>
          <p>Save, organize, and reuse the Builder outputs worth keeping.</p>
        </div>
        {manualUrl && (
          <a
            className="prompts-manual-link"
            href={`${manualUrl}#prompt-library`}
            target="_blank"
            rel="noreferrer"
          >
            Prompt Archive manual
          </a>
        )}
      </header>

      <div className="prompts-layout">
        <section className="prompts-panel prompts-panel-main">
          <div className="prompts-library-card prompts-library-card-simple">
            <div className="prompts-library-intro prompts-library-intro-simple">
              <div className="prompts-library-eyebrow">Downstream from Builder</div>
              <h3>Keep the workflow outputs that deserve to stick</h3>
              <p>
                Builder is where prompt workflows are authored. This archive is where the finished
                results get saved, filtered, grouped into Prompt Sets, and reused later.
              </p>
            </div>
            <div className="prompts-library-relationship">
              <div className="prompts-library-relationship-item">
                <div className="prompts-library-relationship-label">1. Shape in Builder</div>
                <div className="prompts-library-relationship-text">
                  Build and refine the live prompt workflow.
                </div>
              </div>
              <div className="prompts-library-relationship-item">
                <div className="prompts-library-relationship-label">2. Review in Prompt Preview</div>
                <div className="prompts-library-relationship-text">
                  Check the current output and decide what is worth keeping.
                </div>
              </div>
              <div className="prompts-library-relationship-item">
                <div className="prompts-library-relationship-label">3. Save into the Archive</div>
                <div className="prompts-library-relationship-text">
                  Organize proven outputs so they are easy to find and reuse.
                </div>
              </div>
            </div>
          </div>
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
            showCloudPrompts
            showLocalPrompts={false}
          />
        </section>
      </div>
    </div>
  );
}
