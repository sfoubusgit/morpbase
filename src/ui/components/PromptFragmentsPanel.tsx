import { PROMPT_FRAGMENT_DEFINITIONS } from '../../data/promptFragments';
import type { PromptAdditionPosition, SelectedPromptFragment } from '../../types';
import './PromptFragmentsPanel.css';

type PromptFragmentsPanelProps = {
  selectedFragments: SelectedPromptFragment[];
  onAddFragment: (fragmentId: string) => void;
  onRemoveFragment: (fragmentId: string) => void;
  onChangePosition: (fragmentId: string, position: PromptAdditionPosition) => void;
};

export function PromptFragmentsPanel({
  selectedFragments,
  onAddFragment,
  onRemoveFragment,
  onChangePosition,
}: PromptFragmentsPanelProps) {
  const selectedIds = new Set(selectedFragments.map(fragment => fragment.id));

  return (
    <div className="builder-sidebar-panel prompt-fragments-panel">
      <div className="builder-sidebar-panel-header">
        <div>
          <div className="builder-sidebar-panel-label">Prompt Fragments</div>
          <div className="builder-sidebar-panel-title">Global Phrase Layer</div>
        </div>
      </div>
      <div className="prompt-fragments-copy">
        Add reusable phrases like quality or framing enhancers without forcing them into the normal Builder categories.
      </div>

      {selectedFragments.length > 0 && (
        <div className="prompt-fragments-selected">
          {selectedFragments.map(fragment => {
            const definition = PROMPT_FRAGMENT_DEFINITIONS.find(item => item.id === fragment.id);
            if (!definition) return null;
            return (
              <div key={fragment.id} className="prompt-fragments-selected-item">
                <div className="prompt-fragments-selected-main">
                  <div className="prompt-fragments-selected-label">{definition.label}</div>
                  <div className="prompt-fragments-selected-text">{definition.outputText}</div>
                </div>
                <div className="prompt-fragments-selected-controls">
                  <select
                    value={fragment.position}
                    onChange={(event) => onChangePosition(fragment.id, event.target.value as PromptAdditionPosition)}
                  >
                    <option value="start">Start</option>
                    <option value="middle">Middle</option>
                    <option value="end">End</option>
                  </select>
                  <button type="button" onClick={() => onRemoveFragment(fragment.id)}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="prompt-fragments-library">
        {PROMPT_FRAGMENT_DEFINITIONS.map(fragment => (
          <button
            key={fragment.id}
            type="button"
            className={`prompt-fragments-chip ${selectedIds.has(fragment.id) ? 'selected' : ''}`}
            onClick={() => (selectedIds.has(fragment.id) ? onRemoveFragment(fragment.id) : onAddFragment(fragment.id))}
          >
            {fragment.label}
          </button>
        ))}
      </div>
    </div>
  );
}
