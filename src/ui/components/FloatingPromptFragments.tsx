import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { PROMPT_FRAGMENT_DEFINITIONS } from '../../data/promptFragments';
import './FloatingPromptFragments.css';

type FloatingPromptFragmentsProps = {
  selectedFragmentIds: string[];
  onToggleFragment: (fragmentId: string) => void;
};

type Position = {
  x: number;
  y: number;
};

const STORAGE_KEY = 'morpbase:global_phrase_layer_position';
const TRIGGER_WIDTH = 172;
const TRIGGER_HEIGHT = 48;
const PANEL_WIDTH = 320;
const SCREEN_MARGIN = 18;
const COMPACT_BREAKPOINT = 900;

function getDefaultPosition(): Position {
  if (typeof window === 'undefined') {
    return { x: 24, y: 24 };
  }

  return {
    x: Math.max(SCREEN_MARGIN, window.innerWidth - TRIGGER_WIDTH - 28),
    y: Math.max(SCREEN_MARGIN, window.innerHeight - TRIGGER_HEIGHT - 110),
  };
}

function clampPosition(position: Position, viewportWidth: number, viewportHeight: number): Position {
  return {
    x: Math.min(Math.max(position.x, SCREEN_MARGIN), Math.max(SCREEN_MARGIN, viewportWidth - TRIGGER_WIDTH - SCREEN_MARGIN)),
    y: Math.min(Math.max(position.y, SCREEN_MARGIN), Math.max(SCREEN_MARGIN, viewportHeight - TRIGGER_HEIGHT - SCREEN_MARGIN)),
  };
}

export function FloatingPromptFragments({
  selectedFragmentIds,
  onToggleFragment,
}: FloatingPromptFragmentsProps) {
  const [mounted, setMounted] = useState(false);
  const selectedIds = useMemo(() => new Set(selectedFragmentIds), [selectedFragmentIds]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= COMPACT_BREAKPOINT;
  });
  const [position, setPosition] = useState<Position>(() => {
    if (typeof window === 'undefined') return { x: 24, y: 24 };

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return getDefaultPosition();
      const parsed = JSON.parse(raw) as Position;
      if (typeof parsed?.x !== 'number' || typeof parsed?.y !== 'number') {
        return getDefaultPosition();
      }
      return clampPosition(parsed, window.innerWidth, window.innerHeight);
    } catch {
      return getDefaultPosition();
    }
  });

  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const compact = window.innerWidth <= COMPACT_BREAKPOINT;
      setIsCompact(compact);
      setPosition(previous => {
        if (compact) {
          return {
            x: Math.max(SCREEN_MARGIN, window.innerWidth - TRIGGER_WIDTH - 20),
            y: Math.max(SCREEN_MARGIN, window.innerHeight - TRIGGER_HEIGHT - 96),
          };
        }
        return clampPosition(previous, window.innerWidth, window.innerHeight);
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || isCompact) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(position));
    } catch {
      // Ignore persistence failures and keep the UI responsive.
    }
  }, [position, isCompact]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (isCompact) return;

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      moved: false,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId || isCompact) return;

    const nextX = dragState.originX + (event.clientX - dragState.startX);
    const nextY = dragState.originY + (event.clientY - dragState.startY);
    const clamped = clampPosition({ x: nextX, y: nextY }, window.innerWidth, window.innerHeight);

    if (Math.abs(event.clientX - dragState.startX) > 4 || Math.abs(event.clientY - dragState.startY) > 4) {
      dragState.moved = true;
    }

    setPosition(clamped);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    dragStateRef.current = null;

    if (!dragState.moved) {
      setIsOpen(previous => !previous);
    }
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    event.currentTarget.releasePointerCapture(event.pointerId);
    dragStateRef.current = null;
  };

  const panelPosition = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        top: position.y + TRIGGER_HEIGHT + 10,
        left: position.x,
      };
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let left = position.x;
    let top = position.y + TRIGGER_HEIGHT + 10;

    if (left + PANEL_WIDTH > viewportWidth - SCREEN_MARGIN) {
      left = Math.max(SCREEN_MARGIN, viewportWidth - PANEL_WIDTH - SCREEN_MARGIN);
    }

    const estimatedPanelHeight = 320;
    if (top + estimatedPanelHeight > viewportHeight - SCREEN_MARGIN) {
      top = Math.max(SCREEN_MARGIN, position.y - estimatedPanelHeight - 10);
    }

    return { top, left };
  }, [position]);

  const selectedCount = selectedFragmentIds.length;

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal((
    <div className="floating-prompt-fragments-root">
      <button
        type="button"
        className={`floating-prompt-fragments-trigger ${isOpen ? 'open' : ''}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        aria-expanded={isOpen}
        aria-controls="floating-global-phrase-panel"
      >
        <span className="floating-prompt-fragments-trigger-label">Global Phrase Layer</span>
        <span className="floating-prompt-fragments-trigger-meta">
          <span className="floating-prompt-fragments-trigger-count">{selectedCount}</span>
          <span className="floating-prompt-fragments-trigger-hint">{isCompact ? 'Open' : 'Drag or open'}</span>
        </span>
      </button>

      {isOpen && (
        <div
          id="floating-global-phrase-panel"
          className="floating-prompt-fragments-panel"
          style={{ left: `${panelPosition.left}px`, top: `${panelPosition.top}px` }}
        >
          <div className="floating-prompt-fragments-header">
            <div>
              <div className="floating-prompt-fragments-label">Prompt Fragments</div>
              <div className="floating-prompt-fragments-title">Global Phrase Layer</div>
            </div>
            <button
              type="button"
              className="floating-prompt-fragments-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close global phrase layer"
            >
              Close
            </button>
          </div>

          <div className="floating-prompt-fragments-copy">
            Your global phrases stay available across the workflow. Click any phrase to add or remove it from the current prompt.
          </div>

          <div className="floating-prompt-fragments-library">
            {PROMPT_FRAGMENT_DEFINITIONS.map(fragment => (
              <button
                key={fragment.id}
                type="button"
                className={`floating-prompt-fragments-chip ${selectedIds.has(fragment.id) ? 'selected' : ''}`}
                onClick={() => onToggleFragment(fragment.id)}
              >
                {fragment.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  ), document.body);
}
