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
        <h1>A prompt workflow studio for image generation.</h1>
        <p>
          MorpBase gives you one Workspace for shaping a live prompt workflow. Use
          Territories when you want a stronger workflow focus, keep reusable source material in
          Pools, and move useful outputs into Memory when the workflow lands where you want it.
        </p>
        <div className="landing-cta">
          <button type="button" className="landing-primary" onClick={onEnter}>
            Open Workspace
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
          Built for creators who want one workspace for structured prompt authoring, reusable
          context, and cleaner iteration.
        </div>
      </header>

      <section className="landing-pipeline">
        <div className="landing-pipeline-title">How the workspace is structured</div>
        <div className="landing-pipeline-track">
          <div className="landing-node">
            <div className="landing-node-label">Workspace</div>
            <p>Author the live prompt workflow, move through the workflow areas, and shape the result step by step.</p>
          </div>
          <div className="landing-node">
            <div className="landing-node-label">Prompt Preview</div>
            <p>See what the active workflow is producing, refine the output, and control what gets saved or exported.</p>
          </div>
          <div className="landing-node">
            <div className="landing-node-label">Territory Context</div>
            <p>Apply a focused workflow space when you want Builder to stay inside a stronger style, project, or use-case lane.</p>
          </div>
          <div className="landing-node">
            <div className="landing-node-label">Source Pools</div>
            <p>Keep reusable source material behind your workflows and use it to build stronger Territory contexts later.</p>
          </div>
        </div>
        <div className="landing-pipeline-note">
          Prompt Library sits downstream of the workspace so you can keep the outputs that are worth reusing.
        </div>
      </section>

      <section className="landing-benefits">
        <div className="landing-benefit">
          <h3>One workspace, clearer center</h3>
          <p>Builder stays the main place where MorpBase happens instead of becoming one more tool tab.</p>
        </div>
        <div className="landing-benefit">
          <h3>Focused workflows when needed</h3>
          <p>Territories give the workspace a stronger lane without replacing Builder as the center.</p>
        </div>
        <div className="landing-benefit">
          <h3>Reuse behind the scenes</h3>
          <p>Pools, saved prompts, and sharing support the workflow instead of competing with it for meaning.</p>
        </div>
      </section>

      <section className="landing-community">
        <div>
          <h2>Community when you want it</h2>
          <p>
            Community is where reusable public pools and creator presence can circulate. Import what helps, publish what
            works, and keep your own workflow flexible.
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
          <h2>Start in the workspace</h2>
          <p>Open Builder, shape the workflow, and save the outputs that are worth keeping.</p>
        </div>
        <button type="button" className="landing-primary" onClick={onEnter}>
          Open Workspace
        </button>
      </footer>
    </div>
  );
}
