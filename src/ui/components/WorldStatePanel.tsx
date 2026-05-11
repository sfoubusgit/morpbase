import { useCallback } from 'react';
import type { WorldState, WorldStatePosition, WorldStateTemporal, WorldStateResonance } from '../../data/worldStateOverlays';
import {
  WORLD_STATE_POSITIONS,
  WORLD_STATE_TEMPORALS,
  WORLD_STATE_RESONANCES,
  DEFAULT_WORLD_STATE,
} from '../../data/worldStateOverlays';
import './WorldStatePanel.css';

type WorldStatePanelProps = {
  state: WorldState;
  onChange: (next: WorldState) => void;
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function WorldStatePanel({ state, onChange }: WorldStatePanelProps) {
  const handlePosition = (v: WorldStatePosition) =>
    onChange({ ...state, position: state.position === v ? null : v });

  const handleTemporal = (v: WorldStateTemporal | null) =>
    onChange({ ...state, temporal: state.temporal === v ? null : v });

  const handleResonance = (v: WorldStateResonance) =>
    onChange({ ...state, resonance: state.resonance === v ? null : v });

  const handleExplore = useCallback(() => {
    onChange({
      position: pickRandom(WORLD_STATE_POSITIONS).value,
      temporal: Math.random() > 0.5 ? pickRandom(WORLD_STATE_TEMPORALS).value : null,
      resonance: pickRandom(WORLD_STATE_RESONANCES).value,
    });
  }, [onChange]);

  const isActive = state.position !== null || state.temporal !== null || state.resonance !== null;

  const summaryParts = [
    state.position ? WORLD_STATE_POSITIONS.find(p => p.value === state.position)?.label : null,
    state.temporal ? WORLD_STATE_TEMPORALS.find(t => t.value === state.temporal)?.label : 'Now',
    state.resonance ? WORLD_STATE_RESONANCES.find(r => r.value === state.resonance)?.label : null,
  ].filter(Boolean);

  return (
    <div className="ws-world-state">
      <div className="ws-world-state-header">
        <span className="ws-world-state-title">World State</span>
        <div className="ws-world-state-header-actions">
          <button type="button" className="ws-world-state-explore" onClick={handleExplore}>
            Explore
          </button>
          {isActive && (
            <button type="button" className="ws-world-state-reset" onClick={() => onChange(DEFAULT_WORLD_STATE)}>
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="ws-world-state-rows">
        <div className="ws-world-state-row">
          <span className="ws-world-state-row-label">Position</span>
          <div className="ws-world-state-pills">
            {WORLD_STATE_POSITIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`ws-world-state-pill${state.position === value ? ' ws-world-state-pill--on' : ''}`}
                onClick={() => handlePosition(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="ws-world-state-row">
          <span className="ws-world-state-row-label">Moment</span>
          <div className="ws-world-state-pills">
            <button
              type="button"
              className={`ws-world-state-pill${state.temporal === null ? ' ws-world-state-pill--on' : ''}`}
              onClick={() => handleTemporal(null)}
            >
              Now
            </button>
            {WORLD_STATE_TEMPORALS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`ws-world-state-pill${state.temporal === value ? ' ws-world-state-pill--on' : ''}`}
                onClick={() => handleTemporal(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="ws-world-state-row">
          <span className="ws-world-state-row-label">Register</span>
          <div className="ws-world-state-pills">
            {WORLD_STATE_RESONANCES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`ws-world-state-pill ws-world-state-pill--${value}${state.resonance === value ? ' ws-world-state-pill--on' : ''}`}
                onClick={() => handleResonance(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {summaryParts.length > 0 && (
        <div className="ws-world-state-summary">
          {summaryParts.join(' · ')}
        </div>
      )}
    </div>
  );
}
