import type { Universe } from '../../types/universe';
import './WorkspaceLandingScreen.css';

type WorkspaceLandingScreenProps = {
  universes: Universe[];
  onPickUniverse: (id: string) => void;
  onJustExperiment: () => void;
  onNewUniverse: () => void;
};

// Deterministic accent colour per universe id so each card has a stable
// look even without a real hero image. Hashes the id into the violet/cyan
// hue range so the palette stays cohesive.
const hueFromId = (id: string): number => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 200 + (h % 90); // 200–290 covers violet → cyan → purple
};

const initialsOf = (name: string): string => {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0] ?? '').join('').toUpperCase() || '◈';
};

export function WorkspaceLandingScreen({
  universes,
  onPickUniverse,
  onJustExperiment,
  onNewUniverse,
}: WorkspaceLandingScreenProps) {
  return (
    <div className="ws-landing">
      <header className="ws-landing__head">
        <h1 className="ws-landing__title">Working in</h1>
        <p className="ws-landing__hint">
          Pick a universe to focus the lanes around it, or just experiment.
        </p>
      </header>

      <div className="ws-landing__grid">
        {universes.map(u => {
          const hue = hueFromId(u.id);
          return (
            <button
              key={u.id}
              type="button"
              className="ws-landing__card"
              onClick={() => onPickUniverse(u.id)}
              title={u.description || u.name}
            >
              <div
                className="ws-landing__card-art"
                style={{
                  background: `linear-gradient(135deg, hsl(${hue}, 55%, 28%), hsl(${(hue + 40) % 360}, 55%, 18%))`,
                }}
              >
                <span className="ws-landing__card-initials">{initialsOf(u.name)}</span>
              </div>
              <div className="ws-landing__card-name">{u.name}</div>
            </button>
          );
        })}

        <button
          type="button"
          className="ws-landing__card ws-landing__card--new"
          onClick={onNewUniverse}
          title="Create a new universe"
        >
          <div className="ws-landing__card-art ws-landing__card-art--new">
            <span className="ws-landing__card-plus">+</span>
          </div>
          <div className="ws-landing__card-name">New Universe</div>
        </button>
      </div>

      <div className="ws-landing__divider">
        <span>or</span>
      </div>

      <button
        type="button"
        className="ws-landing__experiment-btn"
        onClick={onJustExperiment}
      >
        Just experiment (no universe)
      </button>
    </div>
  );
}
