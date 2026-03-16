import { PromptLibrary } from './PromptLibrary';
import './PromptsPage.css';

type PromptsPageProps = {
  prompt?: any | null;
  customAdditions?: string[];
  editedPositive?: string | null;
  editedNegative?: string | null;
  onAddToPrompt?: (text: string) => void;
  authUser?: { id: string } | null;
  isPro?: boolean;
  manualUrl?: string;
};

export function PromptsPage({
  prompt,
  customAdditions = [],
  editedPositive,
  editedNegative,
  onAddToPrompt,
  authUser,
  isPro = false,
  manualUrl,
}: PromptsPageProps) {
  return (
    <div className="prompts-page">
      <header className="prompts-header">
        <div>
          <h2>Prompts</h2>
          <p>Save finished prompts and return to them later.</p>
        </div>
        {manualUrl && (
          <a
            className="prompts-manual-link"
            href={`${manualUrl}#prompt-library`}
            target="_blank"
            rel="noreferrer"
          >
            Prompt Library manual
          </a>
        )}
      </header>

      <div className="prompts-layout">
        <section className="prompts-panel prompts-panel-main">
          <div className="prompts-library-card">
            <div className="prompts-library-intro">
              <div>
                <h3>Saved Prompt Library</h3>
                <p>Keep finished prompts organized, searchable, and easy to reuse without leaving MorpBase.</p>
              </div>
              <div className="prompts-library-note">
                Use tags to group prompt styles, then export or import your library when you want backups or reuse.
              </div>
            </div>
          </div>
          <PromptLibrary
            prompt={prompt ?? null}
            customAdditions={customAdditions}
            editedPositive={editedPositive}
            editedNegative={editedNegative}
            onAddToPrompt={onAddToPrompt}
            authUser={authUser}
            isPro={isPro}
            manualUrl={manualUrl}
            showCloudPrompts
            showLocalPrompts={false}
          />
        </section>
      </div>
    </div>
  );
}
