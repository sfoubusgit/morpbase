import './LandingPage.css';

type LandingPageProps = {
  onEnter: () => void;
  manualUrl?: string;
};

export function LandingPage({ onEnter, manualUrl }: LandingPageProps) {
  return (
    <div className="landing-page">
      <header className="landing-hero">
        <span className="landing-eyebrow">MorpBase</span>
        <h1>Prompts are built, not typed.</h1>
        <p>
          MorpBase is a pro prompt workspace for IMG/VIDEO creators who iterate fast. Structure
          your elements, assemble repeatable prompts, and maintain a permanent cloud library that
          scales with you.
        </p>
        <div className="landing-cta">
          <button type="button" className="landing-primary" onClick={onEnter}>
            Enter MorpBase
          </button>
          {manualUrl && (
            <a
              className="landing-secondary"
              href={`${manualUrl}#quick-start`}
              target="_blank"
              rel="noreferrer"
            >
              Read the manual
            </a>
          )}
        </div>
        <div className="landing-subtext">
          Built for heavy prompt workflows, teams, and creators who treat prompts as assets.
        </div>
      </header>

      <section className="landing-pipeline">
        <div className="landing-pipeline-title">The MorpBase pipeline</div>
        <div className="landing-pipeline-track">
          <div className="landing-node">
            <div className="landing-node-label">User Pools</div>
            <p>Collect raw prompt elements and reuse them across projects.</p>
          </div>
          <div className="landing-node">
            <div className="landing-node-label">Working Sets</div>
            <p>Curate focused sets for specific styles, clients, or models.</p>
          </div>
          <div className="landing-node">
            <div className="landing-node-label">Builder</div>
            <p>Assemble structured prompts with precision and consistency.</p>
          </div>
          <div className="landing-node">
            <div className="landing-node-label">Prompt Library</div>
            <p>Archive every prompt with model, purpose, and usage metadata.</p>
          </div>
        </div>
      </section>

      <section className="landing-benefits">
        <div className="landing-benefit">
          <h3>Structure beats chaos</h3>
          <p>Design repeatable frameworks instead of rewriting prompts from scratch.</p>
        </div>
        <div className="landing-benefit">
          <h3>Reuse without friction</h3>
          <p>Save, remix, and scale the best prompt building blocks instantly.</p>
        </div>
        <div className="landing-benefit">
          <h3>Community-ready</h3>
          <p>Share pools and working sets with verified creator profiles when you want.</p>
        </div>
      </section>

      <section className="landing-community">
        <div>
          <h2>Designed for serious prompt creators</h2>
          <p>
            The Pool Hub lets you discover curated pools and working sets, while auth-backed
            profiles keep credits and ownership clear. You control if your prompts are public.
          </p>
        </div>
        <div className="landing-community-card">
          <div className="landing-community-title">Community Highlights</div>
          <ul>
            <li>Verified creator profiles</li>
            <li>Optional public prompt libraries</li>
            <li>One-click import into your workspace</li>
          </ul>
        </div>
      </section>

      <footer className="landing-footer">
        <div>
          <h2>Start building your library</h2>
          <p>Enter MorpBase and shape your prompt workflow in minutes.</p>
        </div>
        <button type="button" className="landing-primary" onClick={onEnter}>
          Enter MorpBase
        </button>
      </footer>
    </div>
  );
}
