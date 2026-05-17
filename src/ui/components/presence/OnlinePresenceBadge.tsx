import { useEffect, useRef, useState } from 'react';
import { useOnlineAuthUids } from '../../hooks/useOnlineAuthUids';
import { getNamesByAuthUids } from '../../../engine/presenceStore';
import './OnlinePresenceBadge.css';

type Props = {
  selfAuthUid: string | null;
  onViewUser?: (authUid: string, name: string) => void;
};

export function OnlinePresenceBadge({ selfAuthUid, onViewUser }: Props) {
  const onlineUids = useOnlineAuthUids();
  const [nameMap, setNameMap] = useState<Map<string, string>>(new Map());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const others = [...onlineUids].filter(uid => uid !== selfAuthUid);

  useEffect(() => {
    if (others.length === 0) { setNameMap(new Map()); return; }
    void getNamesByAuthUids(others).then(setNameMap);
  }, [others.join(',')]);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  if (others.length === 0) return null;

  const names = others.map(uid => ({ uid, name: nameMap.get(uid) ?? '…' }));

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
          {names.slice(0, 8).map(({ uid, name }) => (
            <button
              key={uid}
              type="button"
              className="presence-dropdown-user"
              onClick={() => { onViewUser?.(uid, name); setOpen(false); }}
            >
              {name}
            </button>
          ))}
          {names.length > 8 && (
            <div className="presence-dropdown-more">+{names.length - 8} more</div>
          )}
        </div>
      )}
    </div>
  );
}
