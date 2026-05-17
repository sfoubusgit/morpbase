import { useEffect, useRef, useState } from 'react';
import { usePresenceStates } from '../../hooks/usePresenceStates';
import './OnlinePresenceBadge.css';

type Props = {
  selfAuthUid: string | null;
  onViewUser?: (authUid: string, name: string) => void;
};

export function OnlinePresenceBadge({ selfAuthUid, onViewUser }: Props) {
  const states = usePresenceStates();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const others = [...states.entries()].filter(([uid]) => uid !== selfAuthUid);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  if (others.length === 0) return null;

  return (
    <div className="presence-badge" ref={ref}>
      <button
        type="button"
        className={`presence-badge-btn${open ? ' open' : ''}`}
        onClick={() => setOpen(o => !o)}
        title={`${others.length} building now`}
      >
        <span className="presence-dot" />
        <span className="presence-count">{others.length}</span>
      </button>

      {open && (
        <div className="presence-dropdown">
          <div className="presence-dropdown-label">Building now</div>
          {others.slice(0, 8).map(([uid, state]) => (
            <button
              key={uid}
              type="button"
              className="presence-dropdown-user"
              onClick={() => { onViewUser?.(uid, state.name); setOpen(false); }}
            >
              <span className="presence-dropdown-name">{state.name}</span>
              {state.studio && (
                <span className="presence-dropdown-studio">{state.studio}</span>
              )}
            </button>
          ))}
          {others.length > 8 && (
            <div className="presence-dropdown-more">+{others.length - 8} more</div>
          )}
        </div>
      )}
    </div>
  );
}
