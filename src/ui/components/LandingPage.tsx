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
        <h1>Build prompts from reusable pieces.</h1>
        <p>
          MorpBase helps you build prompts from reusable pieces instead of rewriting them from
          scratch. Choose prompt elements by category, see the final prompt update as you go, and
          copy it into your workflow.
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
          Built for creators who want faster prompt building, cleaner reuse, and less repetition.
        </div>
      </header>

      <section className="landing-pipeline">
        <div className="landing-pipeline-title">The MorpBase pipeline</div>
        <div className="landing-pipeline-track">
          <div className="landing-node">
            <div className="landing-node-label">User Pools</div>
            <p>Save reusable prompt fragments you want to keep around.</p>
          </div>
          <div className="landing-node">
            <div className="landing-node-label">Working Sets</div>
            <p>Curate focused prompt kits for a specific style or project.</p>
          </div>
          <div className="landing-node">
            <div className="landing-node-label">Builder</div>
            <p>Choose prompt elements by category and build the final prompt step by step.</p>
          </div>
          <div className="landing-node">
            <div className="landing-node-label">Prompt Library</div>
            <p>Save finished prompts and return to them later.</p>
          </div>
        </div>
      </section>

      <section className="landing-benefits">
        <div className="landing-benefit">
          <h3>Structure beats chaos</h3>
          <p>Build prompts from clear parts instead of rewriting everything each time.</p>
        </div>
        <div className="landing-benefit">
          <h3>Reuse without friction</h3>
          <p>Keep the prompt fragments that work and reuse them when you need them.</p>
        </div>
        <div className="landing-benefit">
          <h3>Grow into advanced tools</h3>
          <p>Start with the Builder, then move into pools, working sets, and sharing when ready.</p>
        </div>
      </section>

      <section className="landing-community">
        <div>
          <h2>Community tools when you want them</h2>
          <p>
            The Pool Hub is a community library for reusable pools and working sets. Import what
            helps, publish what works, and keep your own workflow flexible.
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
          <h2>Start with one prompt</h2>
          <p>Enter MorpBase, build from categories, and copy the final prompt into your workflow.</p>
        </div>
        <button type="button" className="landing-primary" onClick={onEnter}>
          Enter MorpBase
        </button>
      </footer>
    </div>
  );
}
