import { PromptPreview } from './PromptPreview';
import { PromptLibrary } from './PromptLibrary';
import './PromptsPage.css';

type PromptsPageProps = {
  prompt?: any | null;
  customAdditions?: string[];
  freeformPrompt?: string;
  onFreeformPromptChange?: (value: string) => void;
  onClearPrompt?: () => void;
  onUndoClearPrompt?: () => void;
  canUndoClearPrompt?: boolean;
  onAddToPrompt?: (text: string) => void;
  authUser?: { id: string } | null;
  isPro?: boolean;
  manualUrl?: string;
};

export function PromptsPage({
  prompt,
  customAdditions = [],
  freeformPrompt = '',
  onFreeformPromptChange,
  onClearPrompt,
  onUndoClearPrompt,
  canUndoClearPrompt = false,
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
          <PromptLibrary
            prompt={prompt ?? null}
            customAdditions={customAdditions}
            onAddToPrompt={onAddToPrompt}
            authUser={authUser}
            isPro={isPro}
            manualUrl={manualUrl}
            showCloudPrompts
            showLocalPrompts={false}
          />
        </section>

        <aside className="prompts-panel prompts-panel-sidebar">
          <div className="prompts-library-card">
          <div className="prompts-library-intro">
            <h3>Library Tips</h3>
            <p>Use tags to group prompt styles, then export or import your library when you want backups or reuse.</p>
          </div>
        </div>
          <PromptPreview
            prompt={prompt ?? null}
            customAdditions={customAdditions}
            freeformPrompt={freeformPrompt}
            onClear={onClearPrompt}
            onUndoClear={onUndoClearPrompt}
            canUndoClear={canUndoClearPrompt}
          />
        </aside>
      </div>
    </div>
  );
}
