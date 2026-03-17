import { PROMPT_FRAGMENT_DEFINITIONS } from '../../data/promptFragments';
import './PromptFragmentsPanel.css';

type PromptFragmentsPanelProps = {
  selectedFragmentIds: string[];
  onToggleFragment: (fragmentId: string) => void;
};

export function PromptFragmentsPanel({
  selectedFragmentIds,
  onToggleFragment,
}: PromptFragmentsPanelProps) {
  const selectedIds = new Set(selectedFragmentIds);

  return (
    <div className="builder-sidebar-panel prompt-fragments-panel">
      <div className="builder-sidebar-panel-header">
        <div>
          <div className="builder-sidebar-panel-label">Prompt Fragments</div>
          <div className="builder-sidebar-panel-title">Global Phrase Layer</div>
        </div>
      </div>
      <div className="prompt-fragments-copy">
        Click any phrase to add it straight into the prompt. Click it again to remove it.
      </div>

      <div className="prompt-fragments-library">
        {PROMPT_FRAGMENT_DEFINITIONS.map(fragment => (
          <button
            key={fragment.id}
            type="button"
            className={`prompt-fragments-chip ${selectedIds.has(fragment.id) ? 'selected' : ''}`}
            onClick={() => onToggleFragment(fragment.id)}
          >
            {fragment.label}
          </button>
        ))}
      </div>
    </div>
  );
}
