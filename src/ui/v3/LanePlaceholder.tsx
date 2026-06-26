import type { ReactNode } from 'react';

/**
 * Colorless, lane-specific placeholder symbols shown when a lane item has no
 * cover image. Monochrome line icons on a neutral surface — quieter than the
 * old colorful gradient tints.
 */
const ICONS: Record<string, ReactNode> = {
  // a character bust
  character: (
    <>
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M5 20c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5" />
    </>
  ),
  // a scene: sun over rolling hills + horizon
  scenery: (
    <>
      <circle cx="8" cy="9" r="2.6" />
      <path d="M2 18c2.5-3 4-3 6 0M9 18c2.5-4 5-4 8 0" />
      <path d="M2 20.5h20" />
    </>
  ),
  // an isometric cube / artifact
  object: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
    </>
  ),
  // a theatre mask
  mood: (
    <>
      <path d="M5 5h14v6a7 7 0 0 1-14 0z" />
      <circle cx="9.2" cy="10" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="10" r="0.7" fill="currentColor" stroke="none" />
      <path d="M9 13.6c1.2 1.4 4.8 1.4 6 0" />
    </>
  ),
  // a light bulb
  lighting: (
    <>
      <path d="M9.5 18h5M10.5 21h3" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z" />
    </>
  ),
  // a framing grid (rule of thirds)
  composition: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" />
      <path d="M3.5 9.2h17M3.5 14.8h17M9.2 3.5v17M14.8 3.5v17" />
    </>
  ),
  // a city skyline
  environment: (
    <>
      <path d="M3 21V9l5-2.5V21M8 21V12l5-2.5V21M13 21V7l5 2.5V21" />
      <path d="M3 21h18" />
    </>
  ),
};

export function LanePlaceholder({ lane }: { lane: string }) {
  return (
    <span className="v3-ph-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[lane] ?? ICONS.object}
      </svg>
    </span>
  );
}
