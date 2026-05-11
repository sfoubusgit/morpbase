import type { KeptWork, ReusableAsset } from "../morpbaseModel";
import { cleanReadableText, type ImpactSignal } from "../morpbaseReadings";
import {
  FocusPrompt,
  ImpactCluster,
  InvitationNote,
  PathChipCluster,
  ThresholdBand,
  TraceBand,
} from "../morpbaseUiFragments";

type MemoryViewProps = {
  handoffMessage: string;
  keptWorks: KeptWork[];
  selectedWork: KeptWork | null;
  selectedWorkImpact: ImpactSignal[];
  hasSelectedWorkAsset: boolean;
  hasSelectedWorkPublic: boolean;
  hasSelectedWorkContinuity: boolean;
  onReturnToWorkspace: (work: KeptWork) => void;
  onBranchFromWork: (work: KeptWork) => void;
  onCreateReusableAsset: (work: KeptWork) => void;
  onShareToCommunity: (work: KeptWork) => void;
  onOpenContinuityFromMemory: (work: KeptWork) => void;
  onStartNewWorkspaceSession: () => void;
  onOpenWork: (work: KeptWork) => void;
  reusableAssets: ReusableAsset[];
  selectedAsset: ReusableAsset | null;
  selectedAssetImpact: ImpactSignal[];
  hasSelectedAssetSource: boolean;
  hasSelectedAssetPublic: boolean;
  onUseAssetInWorkspace: (asset: ReusableAsset) => void;
  onOpenAssetSource: (asset: ReusableAsset) => void;
  onShareAssetToCommunity: (asset: ReusableAsset) => void;
  onOpenAsset: (asset: ReusableAsset) => void;
};

export function MemoryView({
  handoffMessage,
  keptWorks,
  selectedWork,
  selectedWorkImpact,
  hasSelectedWorkAsset,
  hasSelectedWorkPublic,
  hasSelectedWorkContinuity,
  onReturnToWorkspace,
  onBranchFromWork,
  onCreateReusableAsset,
  onShareToCommunity,
  onOpenContinuityFromMemory,
  onStartNewWorkspaceSession,
  onOpenWork,
  reusableAssets,
  selectedAsset,
  selectedAssetImpact,
  hasSelectedAssetSource,
  hasSelectedAssetPublic,
  onUseAssetInWorkspace,
  onOpenAssetSource,
  onShareAssetToCommunity,
  onOpenAsset,
}: MemoryViewProps) {
  return (
    <div className="view-shell memory-view">
      <section className="memory-main">
        <div className="panel-header">
          <span className="eyebrow">Memory</span>
          <h1>A second home for work that still matters.</h1>
          <p>
            Kept work should not go dead here. It should feel ready to continue, reopen, branch,
            or move into public circulation.
          </p>
        </div>

        <div className="memory-banner">
          <strong>{handoffMessage}</strong>
          <span>Memory is where useful work stays alive, not where it gets filed away.</span>
        </div>

        <div className="memory-layout">
          <aside className="saved-work-focus signature-surface signature-memory">
            <header className="section-head">
              <div>
                <span className="eyebrow">Memory Home</span>
                <h2>{selectedWork ? "Continue this line" : "Memory will grow from real keeps"}</h2>
              </div>
            </header>

            {selectedWork ? (
              <>
                <div className="surface-signature-strip memory-signature-strip">
                  <div className="surface-reading-card">
                    <span className="mini-label">Memory Reading</span>
                    <strong>Living return point</strong>
                    <p>
                      This line now lives here as preserved value that can still re-enter
                      creation.
                    </p>
                  </div>
                  <div className="surface-reading-card">
                    <span className="mini-label">What Endures</span>
                    <strong>{selectedWork.title}</strong>
                    <p>
                      {selectedWork.origin.kind === "public-result"
                        ? "Even after crossing back inward, the line still carries its strongest recognizable anchors."
                        : "The strongest recognizable anchors of this line are now durable enough to return from."}
                    </p>
                  </div>
                </div>
                <div className="focus-image">{selectedWork.imageLabel}</div>
                <p className="focus-summary">
                  {selectedWork.title} is currently the strongest return point in Memory.
                </p>
                <FocusPrompt label="Why It Matters">
                  <p>{cleanReadableText(selectedWork.summary)}</p>
                </FocusPrompt>
                <TraceBand
                  wrapperClassName="memory-carried-trace-band"
                  family="memory"
                  label="Carried Trace"
                  title={
                    selectedWork.origin.kind === "public-result"
                      ? "This line remained readable after returning inward"
                      : "This line left a durable trace in Memory"
                  }
                  copy={
                    selectedWork.origin.kind === "public-result"
                      ? "Even after crossing back from public life, the line still leaves a stable return reading here."
                      : "The kept line now leaves behind a stable return reading that can keep shaping future work."
                  }
                />
                <div className="memory-trace-block">
                  <span className="mini-label">What Endures</span>
                  <div className="memory-trace-row">
                    <span className="memory-trace-chip">
                      {selectedWork.draft.subject ?? "subject still open"}
                    </span>
                    <span className="memory-trace-chip">
                      {selectedWork.draft.visual
                        ? `${selectedWork.draft.visual} look`
                        : "look still open"}
                    </span>
                    <span className="memory-trace-chip">
                      {selectedWork.draft.framing
                        ? `${selectedWork.draft.framing} framing`
                        : "framing still open"}
                    </span>
                    {selectedWork.draft.presence ? (
                      <span className="memory-trace-chip">
                        {selectedWork.draft.presence} presence
                      </span>
                    ) : null}
                  </div>
                </div>
                <PathChipCluster label="Live Paths">
                  <span className="path-chip workspace strong">Return to Workspace</span>
                  <span className={`path-chip memory ${hasSelectedWorkAsset ? "strong" : ""}`}>
                    {hasSelectedWorkAsset
                      ? "Reusable asset distilled"
                      : "Can become reusable material"}
                  </span>
                  <span className={`path-chip community ${hasSelectedWorkPublic ? "strong" : ""}`}>
                    {hasSelectedWorkPublic
                      ? "Public result already live"
                      : "Can release to Community"}
                  </span>
                  {selectedWork.draft.subject ? (
                    <span
                      className={`path-chip continuity ${hasSelectedWorkContinuity ? "strong" : ""}`}
                    >
                      Readable in Continuity
                    </span>
                  ) : null}
                </PathChipCluster>
                <ImpactCluster signals={selectedWorkImpact} />
                <InvitationNote
                  copy={
                    selectedWork.origin.kind === "public-result" &&
                    selectedWork.origin.mode === "branch"
                      ? "This line began as your own version of public work. Keep changing it, distill something from it, or release the new version later."
                      : "This line feels ready to keep living. Continue it, branch from it, or let it become reusable shaping material."
                  }
                />
                <div className="focus-actions">
                  <button
                    className="primary-action"
                    onClick={() => onReturnToWorkspace(selectedWork)}
                    type="button"
                  >
                    Continue this line
                  </button>
                  <button
                    className="ghost-action"
                    onClick={() => onBranchFromWork(selectedWork)}
                    type="button"
                  >
                    Branch from this line
                  </button>
                </div>
                <div className="focus-actions secondary">
                  <button
                    className="ghost-action"
                    onClick={() => onCreateReusableAsset(selectedWork)}
                    type="button"
                  >
                    {hasSelectedWorkAsset
                      ? "Open Reusable Asset"
                      : "Distill into Reusable Asset"}
                  </button>
                  <button
                    className="ghost-action"
                    onClick={() => onShareToCommunity(selectedWork)}
                    type="button"
                  >
                    Release to Community
                  </button>
                  {selectedWork.draft.subject ? (
                    <button
                      className="ghost-action"
                      onClick={() => onOpenContinuityFromMemory(selectedWork)}
                      type="button"
                    >
                      Read in Continuity
                    </button>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="empty-card">
                <h3>Nothing is active yet.</h3>
                <p>The first meaningful Keep creates the first real return path for this realm.</p>
              </div>
            )}
          </aside>

          <section className="saved-work-list">
            <header className="section-head">
              <div>
                <span className="eyebrow">Saved Work</span>
                <h2>Recent kept work</h2>
              </div>
              <button className="ghost-action" onClick={onStartNewWorkspaceSession} type="button">
                New Workspace Session
              </button>
            </header>

            {keptWorks.length === 0 ? (
              <div className="empty-card">
                <h3>No kept work yet.</h3>
                <p>
                  The first meaningful Keep from Workspace will make Memory start to feel real.
                </p>
              </div>
            ) : (
              <div className="card-stack">
                {keptWorks.map((work) => (
                  <button
                    key={work.id}
                    className={work.id === selectedWork?.id ? "memory-card selected" : "memory-card"}
                    onClick={() => onOpenWork(work)}
                    type="button"
                  >
                    <div className="memory-card-image">{work.imageLabel}</div>
                    <div className="memory-card-copy">
                      <strong>{work.title}</strong>
                      <span>{cleanReadableText(work.summary)}</span>
                      <small>Kept {work.keptAt}</small>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="assets-zone">
          <header className="section-head">
            <div>
              <span className="eyebrow">Reusable Assets</span>
              <h2>Reusable shaping material</h2>
            </div>
            <span className="assets-meta">
              {reusableAssets.length > 0
                ? `${reusableAssets.length} reusable asset${reusableAssets.length === 1 ? "" : "s"}`
                : "Distill from real kept work"}
            </span>
          </header>

          {reusableAssets.length === 0 ? (
            <div className="empty-card">
              <h3>No reusable assets yet.</h3>
              <p>
                Distill a strong kept work into reusable shaping material once it feels worth
                carrying into future lines.
              </p>
            </div>
          ) : (
            <div className="asset-layout">
              <aside className="asset-focus">
                <header className="section-head">
                  <div>
                    <span className="eyebrow">Asset Focus</span>
                    <h2>{selectedAsset ? selectedAsset.title : "Choose a reusable asset"}</h2>
                  </div>
                </header>

                {selectedAsset ? (
                  <>
                    <div className="focus-image asset-image">{selectedAsset.imageLabel}</div>
                    <p className="focus-summary">
                      {selectedAsset.title} turns one strong keep into reusable shaping material for
                      future work.
                    </p>
                    <FocusPrompt label="Reusable Reading">
                      <p>{selectedAsset.summary}</p>
                    </FocusPrompt>
                    <FocusPrompt label="What It Carries">
                      <p>{selectedAsset.shapingReading}</p>
                    </FocusPrompt>
                    <ThresholdBand
                      wrapperClassName="asset-threshold-band"
                      family="use"
                      state="open"
                      label="Use Crossing"
                      title="Return crossing into Workspace is open"
                      copy="This shaping material can cross back into live creation as a new starting line."
                    />
                    <PathChipCluster label="Where It Leads">
                      <span className="path-chip workspace strong">Use in Workspace</span>
                      <span className="path-chip memory strong">Lives inside Memory</span>
                      <span className={`path-chip community ${hasSelectedAssetPublic ? "strong" : "muted"}`}>
                        {hasSelectedAssetPublic ? "Public asset already live" : "Can gain public life"}
                      </span>
                    </PathChipCluster>
                    <ImpactCluster signals={selectedAssetImpact} />
                    <InvitationNote copy="This shaping material is strongest when it starts a new line in Workspace, not when it sits here unused." />
                    <div className="focus-actions">
                      <button
                        className="primary-action use-action"
                        onClick={() => onUseAssetInWorkspace(selectedAsset)}
                        type="button"
                      >
                        Start from this asset
                      </button>
                      {hasSelectedAssetSource ? (
                        <button
                          className="ghost-action"
                          onClick={() => onOpenAssetSource(selectedAsset)}
                          type="button"
                        >
                          Open Source Keep
                        </button>
                      ) : null}
                    </div>
                    <div className="focus-actions secondary">
                      <button
                        className="ghost-action"
                        onClick={() => onShareAssetToCommunity(selectedAsset)}
                        type="button"
                      >
                        {hasSelectedAssetPublic
                          ? "Open Public Asset"
                          : "Release Asset to Community"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-card">
                    <h3>No reusable asset selected.</h3>
                    <p>
                      Reusable assets should feel like distilled shaping value, not just another
                      save type.
                    </p>
                  </div>
                )}
              </aside>

              <section className="asset-list">
                <header className="section-head">
                  <div>
                    <span className="eyebrow">Asset Shelf</span>
                    <h2>Available shaping material</h2>
                  </div>
                </header>

                <div className="card-stack">
                  {reusableAssets.map((asset) => (
                    <button
                      key={asset.id}
                      className={asset.id === selectedAsset?.id ? "asset-card selected" : "asset-card"}
                      onClick={() => onOpenAsset(asset)}
                      type="button"
                    >
                      <div className="asset-card-image">{asset.imageLabel}</div>
                      <div className="asset-card-copy">
                        <small className="card-tag">Reusable Asset</small>
                        <strong>{asset.title}</strong>
                        <span>{asset.summary}</span>
                        <small>Distilled {asset.createdAt}</small>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </section>
      </section>
    </div>
  );
}
