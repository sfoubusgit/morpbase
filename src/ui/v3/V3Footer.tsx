import type { MouseEvent } from 'react';

/**
 * The workspace footer — the "SFW-forward" lean bar: wordmark + SFW badge on the
 * left, the mandatory legal links center, socials + © on the right. A slim,
 * always-present bar at the bottom of the v3 shell.
 *
 * Links + socials are stubbed (they no-op) until real pages/handles exist — wire
 * the hrefs when Terms/Privacy/Content Policy pages and Discord/X accounts are up.
 */
const DISCORD_D = 'M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.6 12.6 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.2 14.2 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 0 0-.031-.03zM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z';
const X_D = 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z';

export function V3Footer() {
  const stub = (e: MouseEvent) => e.preventDefault(); // TODO: wire when pages/handles exist
  const year = new Date().getFullYear();
  return (
    <footer className="v3-footer">
      <span className="lead">
        <span className="v3-wordmark"><span className="base">MORPBASE</span><span className="ai">AI</span></span>
        <span className="sfw" title="Safe for work — the age-gated section is separate">SFW</span>
      </span>

      <nav className="links" aria-label="Legal">
        <a href="#" onClick={stub}>Terms</a> · <a href="#" onClick={stub}>Privacy</a> · <a href="#" onClick={stub}>Content Policy</a> · <a href="#" onClick={stub}>Contact</a>
      </nav>

      <span className="right">
        <a href="#" onClick={stub} className="soc" aria-label="Discord" title="Discord">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ic"><path d={DISCORD_D} /></svg>
        </a>
        <a href="#" onClick={stub} className="soc" aria-label="X" title="X">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="ic"><path d={X_D} /></svg>
        </a>
        <span className="copy">© {year}</span>
      </span>
    </footer>
  );
}
