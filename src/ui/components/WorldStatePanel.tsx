import './WorldStatePanel.css';

type WorldStatePanelProps = {
  enabled: boolean;
  onToggle: () => void;
  onNext: () => void;
};

export function WorldStatePanel({ enabled, onToggle, onNext }: WorldStatePanelProps) {
  return (
    <div className="ws-variation-bar">
      <button
        type="button"
        className={`ws-variation-toggle${enabled ? ' ws-variation-toggle--on' : ''}`}
        onClick={onToggle}
      >
        Variation {enabled ? 'On' : 'Off'}
      </button>
      {enabled && (
        <button
          type="button"
          className="ws-variation-next"
          onClick={onNext}
          title="Next variation"
        >
          →
        </button>
      )}
    </div>
  );
}
