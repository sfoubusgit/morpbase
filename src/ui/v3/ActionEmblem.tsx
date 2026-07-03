import type { ReactNode } from 'react';

/**
 * Colorless emblem "images" for actions — the v0 stand-in until real
 * community-made exemplar images exist. Actions are shown purely as these
 * images (never as verb text) in the scene sentence and the action picker.
 */
const EMBLEMS: Record<string, ReactNode> = {
  // heart
  kissing: <path d="M12 20s-7-4.5-7-9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 7 3.5c0 5-7 9.5-7 9.5z" />,
  // heart + sparkle
  flirting: (<>
    <path d="M11 19s-6-4-6-8.5A3 3 0 0 1 11 7a3 3 0 0 1 6 3.5c0 4.5-6 8.5-6 8.5z" />
    <path d="M18 4v3M16.5 5.5h3" />
  </>),
  // crossed strokes
  fighting: <path d="M5 5l14 14M19 5L5 19" />,
  // two interlocking arcs (embrace)
  embracing: (<>
    <path d="M4 15a5 5 0 0 1 8-4" />
    <path d="M20 15a5 5 0 0 0-8-4" />
    <circle cx="12" cy="8" r="1.4" />
  </>),
  // shield
  protecting: <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" />,
  // chevrons (motion)
  chasing: <path d="M4 6l6 6-6 6M12 6l6 6-6 6" />,
  // opposing arrows
  confronting: <path d="M3 12h6m-3-3l3 3-3 3M21 12h-6m3-3l-3 3 3 3" />,
  // open hand / soft curve (comfort)
  comforting: (<>
    <path d="M6 20a6 6 0 0 1 12 0" />
    <path d="M12 4v6M9 6.5l3-3 3 3" />
  </>),

  // ── solo actions ──
  // bent-knee figure
  kneeling: (<>
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v6l-4 6M12 13l4 3v3" />
  </>),
  // upward chevrons (leap)
  jumping: (<>
    <circle cx="12" cy="6" r="1.8" />
    <path d="M6 11l6-3 6 3M9 20l3-8 3 8" />
  </>),
  // smile arc + spark
  laughing: (<>
    <circle cx="12" cy="12" r="8" />
    <path d="M8 13a4 4 0 0 0 8 0M9 9h.01M15 9h.01" />
  </>),
  // seated figure
  sitting: (<>
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v5h5M12 12l-4 4v3" />
  </>),
  // running strokes
  running: (<>
    <circle cx="13" cy="5" r="1.8" />
    <path d="M13 7l-3 4 3 2 1 6M10 11l-4 1M14 13l3 2" />
  </>),
  // reaching-up figure
  reaching: (<>
    <circle cx="12" cy="6" r="1.8" />
    <path d="M12 8v6l-3 5M12 14l3 5M12 8l-4-3M12 8l4-3" />
  </>),
  // teardrop
  crying: (<>
    <circle cx="12" cy="10" r="6" />
    <path d="M9 9h.01M15 9h.01M9 13a4 4 0 0 1 6 0M12 18v3" />
  </>),
  // standing figure
  standing: (<>
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v8M12 15l-2 5M12 15l2 5M8 10h8" />
  </>),
};

export function ActionEmblem({ id }: { id: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {EMBLEMS[id] ?? <path d="M7 12h10M13 8l4 4-4 4" />}
    </svg>
  );
}
