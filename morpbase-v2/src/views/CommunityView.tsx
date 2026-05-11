import type {
  CreatorProfile,
  KeptWork,
  PublicReusableAsset,
  PublicWorkflowResult,
  ResponseDirectionKey,
  ResponseLineageSummary,
  ReusableAsset,
} from "../morpbaseModel";
import type { ImpactSignal } from "../morpbaseReadings";
import {
  cleanReadableText,
  describePublicLineFamily,
  describeResponseLineage,
  getResponseDirectionCopy,
  getResponseDirectionLabel,
  getResponseLineageLabel,
  getVersionActionLabel,
} from "../morpbaseReadings";
import {
  CompactSectionHeading,
  CompactStackBody,
  CreatorStrip,
  FocusPrompt,
  ImpactCluster,
  InvitationNote,
  PathChipCluster,
  PracticeObjectCard,
  PublishingObjectCard,
  ThresholdBand,
  TraceBand,
} from "../morpbaseUiFragments";

type CommunityViewProps = {
  communityBridgeMessage: string;
  communityLens: "results" | "assets";
  publicResults: PublicWorkflowResult[];
  selectedPublic: PublicWorkflowResult | null;
  publicReusableAssets: PublicReusableAsset[];
  selectedPublicAsset: PublicReusableAsset | null;
  publicResultLineage: Map<number, ResponseLineageSummary>;
  selectedPublicLineage: ResponseLineageSummary | null;
  selectedPublicSource: KeptWork | null;
  hasSelectedPublicContinuity: boolean;
  selectedPublicImpact: ImpactSignal[];
  hasSelectedPublicAssetPrivate: boolean;
  hasSelectedPublicAssetContinuity: boolean;
  selectedPublicAssetImpact: ImpactSignal[];
  creatorProfile: CreatorProfile;
  creatorContinuityCount: number;
  publishableWorks: KeptWork[];
  publishableAssets: ReusableAsset[];
  keptWorks: KeptWork[];
  onChangeCommunityLens: (lens: "results" | "assets") => void;
  onOpenPublicResult: (result: PublicWorkflowResult) => void;
  onOpenPublicAsset: (asset: PublicReusableAsset) => void;
  onOpenWork: (work: KeptWork) => void;
  onOpenAsset: (asset: ReusableAsset) => void;
  onSetResponseDirection: (result: PublicWorkflowResult, direction: ResponseDirectionKey) => void;
  onBringIntoMemory: (
    result: PublicWorkflowResult,
    mode?: "import" | "continue" | "branch",
  ) => void;
  onOpenSourceKeep: (result: PublicWorkflowResult) => void;
  onToggleVersioning: (result: PublicWorkflowResult) => void;
  onToggleContinuation: (result: PublicWorkflowResult) => void;
  onBringAssetIntoMemory: (asset: PublicReusableAsset) => void;
  onOpenPublicAssetSource: (asset: PublicReusableAsset) => void;
  onShareToCommunity: (work: KeptWork) => void;
  onShareAssetToCommunity: (asset: ReusableAsset) => void;
  onWithdrawPublicResult: (result: PublicWorkflowResult) => void;
  onWithdrawPublicAsset: (asset: PublicReusableAsset) => void;
};

export function CommunityView({
  communityBridgeMessage,
  communityLens,
  publicResults,
  selectedPublic,
  publicReusableAssets,
  selectedPublicAsset,
  publicResultLineage,
  selectedPublicLineage,
  selectedPublicSource,
  hasSelectedPublicContinuity,
  selectedPublicImpact,
  hasSelectedPublicAssetPrivate,
  hasSelectedPublicAssetContinuity,
  selectedPublicAssetImpact,
  creatorProfile,
  creatorContinuityCount,
  publishableWorks,
  publishableAssets,
  keptWorks,
  onChangeCommunityLens,
  onOpenPublicResult,
  onOpenPublicAsset,
  onOpenWork,
  onOpenAsset,
  onSetResponseDirection,
  onBringIntoMemory,
  onOpenSourceKeep,
  onToggleVersioning,
  onToggleContinuation,
  onBringAssetIntoMemory,
  onOpenPublicAssetSource,
  onShareToCommunity,
  onShareAssetToCommunity,
  onWithdrawPublicResult,
  onWithdrawPublicAsset,
}: CommunityViewProps) {
  const publishThresholdOpen = publishableWorks.length + publishableAssets.length > 0;

  return (
    <div className="view-shell community-view">
      <section className="community-main">
        <div className="panel-header">
          <span className="eyebrow">Community</span>
          <h1>Public life should grow from real MorpBase work.</h1>
          <p>
            This Community slice stays calm and object-led while beginning to show that MorpBase
            can circulate more than one meaningful public object type.
          </p>
        </div>

        <div className="community-banner">
          <strong>{communityBridgeMessage}</strong>
          <span>
            Images help prove why something matters here, but the real objects are still reusable
            results and reusable shaping material.
          </span>
        </div>

        <div className="community-layout">
          <section className="discover-list">
            <header className="section-head">
              <div>
                <span className="eyebrow">Discover</span>
                <h2>Public objects</h2>
              </div>
            </header>

            <div className="community-lens-bar">
              <button
                className={communityLens === "results" ? "lens-chip active" : "lens-chip"}
                onClick={() => onChangeCommunityLens("results")}
                type="button"
              >
                Workflow Results
              </button>
              <button
                className={communityLens === "assets" ? "lens-chip active" : "lens-chip"}
                onClick={() => onChangeCommunityLens("assets")}
                type="button"
              >
                Reusable Assets
              </button>
            </div>

            <div className="discover-note">
              <span className="mini-label">Circulation</span>
              <strong>
                Public objects should feel worth opening because they can still guide future work,
                not just because they look finished.
              </strong>
            </div>

            {communityLens === "results" ? (
              publicResults.length === 0 ? (
                <div className="empty-card">
                  <h3>No public results yet.</h3>
                  <p>
                    Release a kept work item from Memory to make public workflow circulation feel
                    real.
                  </p>
                </div>
              ) : (
                <div className="card-stack">
                  {publicResults.map((result) => {
                    const lineage = publicResultLineage.get(result.id);
                    return (
                      <button
                        key={result.id}
                        className={
                          result.id === selectedPublic?.id ? "public-card selected" : "public-card"
                        }
                        onClick={() => onOpenPublicResult(result)}
                        type="button"
                      >
                        <div className="public-card-image">{result.imageLabel}</div>
                        <div className="public-card-copy">
                          <small className="card-tag">Workflow Result</small>
                          <strong>{result.title}</strong>
                          <span>{result.publicNote}</span>
                          {lineage && lineage.total > 0 ? (
                            <small className="lineage-inline-note">
                              Sparked {describeResponseLineage(lineage)}
                            </small>
                          ) : null}
                          <small>
                            Published {result.publishedAt}
                            {result.openToVersioning ? " / invites versions" : ""}
                          </small>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )
            ) : publicReusableAssets.length === 0 ? (
              <div className="empty-card">
                <h3>No public reusable assets yet.</h3>
                <p>
                  Release a reusable asset from Memory once it feels worth carrying into other
                  people&apos;s future work.
                </p>
              </div>
            ) : (
              <div className="card-stack">
                {publicReusableAssets.map((asset) => (
                  <button
                    key={asset.id}
                    className={
                      asset.id === selectedPublicAsset?.id
                        ? "public-asset-card selected"
                        : "public-asset-card"
                    }
                    onClick={() => onOpenPublicAsset(asset)}
                    type="button"
                  >
                    <div className="public-asset-card-image">{asset.imageLabel}</div>
                    <div className="public-asset-card-copy">
                      <small className="card-tag">Reusable Asset</small>
                      <strong>{asset.title}</strong>
                      <span>{asset.publicNote}</span>
                      <small>Published {asset.publishedAt}</small>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <aside className="public-focus signature-surface signature-community">
            <header className="section-head">
              <div>
                <span className="eyebrow">
                  {communityLens === "results" ? "Public Result Focus" : "Public Asset Focus"}
                </span>
                <h2>
                  {communityLens === "results"
                    ? selectedPublic
                      ? selectedPublic.title
                      : "Choose a public result"
                    : selectedPublicAsset
                      ? selectedPublicAsset.title
                      : "Choose a public reusable asset"}
                </h2>
              </div>
            </header>
            {communityLens === "results" ? (
              selectedPublic ? (
                <>
                  <div className="surface-signature-strip community-signature-strip">
                    <div className="surface-reading-card">
                      <span className="mini-label">Public Reading</span>
                      <strong>Circulating work</strong>
                      <p>
                        This is where a real line takes on public life without becoming detached
                        from creation.
                      </p>
                    </div>
                    <div className="surface-reading-card">
                      <span className="mini-label">Why Open It</span>
                      <strong>
                        {selectedPublicLineage && selectedPublicLineage.total > 0
                          ? "It already sparked response."
                          : "It can still spark return."}
                      </strong>
                      <p>
                        {selectedPublicLineage && selectedPublicLineage.total > 0
                          ? "This line already proved it can move other work inward, forward, or into new versions."
                          : "This line is publicly alive because it can still guide another line back into the engine."}
                      </p>
                    </div>
                  </div>
                  <div className="focus-image">{selectedPublic.imageLabel}</div>
                  <p className="focus-summary">{cleanReadableText(selectedPublic.summary)}</p>
                  <FocusPrompt label="Public Framing">
                    <p>{selectedPublic.publicNote}</p>
                  </FocusPrompt>
                  <TraceBand
                    wrapperClassName="public-carried-trace-band"
                    family="community"
                    state={selectedPublicLineage && selectedPublicLineage.total > 0 ? "active" : "dormant"}
                    label="Public Trace"
                    title={
                      selectedPublicLineage && selectedPublicLineage.total > 0
                        ? "This public line left readable response traces"
                        : "This public line now carries readable outward value"
                    }
                    copy={
                      selectedPublicLineage && selectedPublicLineage.total > 0
                        ? "Public travel is now visible not only in release, but in the inward responses this line sparked."
                        : "Even before responses appear, the line now carries a readable outward identity through Community."
                    }
                  />
                  <div className="public-trace-block">
                    <span className="mini-label">What Travels Publicly</span>
                    <div className="public-trace-row">
                      <span className="public-trace-chip">
                        {selectedPublic.sourceDraft.subject ?? "subject still open"}
                      </span>
                      <span className="public-trace-chip">
                        {selectedPublic.sourceDraft.visual
                          ? `${selectedPublic.sourceDraft.visual} look`
                          : "look still open"}
                      </span>
                      <span className="public-trace-chip">
                        {selectedPublic.sourceDraft.framing
                          ? `${selectedPublic.sourceDraft.framing} framing`
                          : "framing still open"}
                      </span>
                      {selectedPublic.sourceDraft.mood ? (
                        <span className="public-trace-chip">
                          {selectedPublic.sourceDraft.mood} tone
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <PathChipCluster label="Carried Across">
                    <span className={`path-chip memory ${selectedPublicSource ? "strong" : ""}`}>
                      {selectedPublicSource ? "Came from kept work" : "Can re-enter Memory"}
                    </span>
                    {selectedPublic.sourceDraft.subject ? (
                      <span
                        className={`path-chip continuity ${hasSelectedPublicContinuity ? "strong" : "muted"}`}
                      >
                        {hasSelectedPublicContinuity
                          ? "Continuity line present"
                          : "Continuity can read this line inward"}
                      </span>
                    ) : null}
                    {selectedPublic.openToVersioning ? (
                      <span className="path-chip playful strong">Invites new versions</span>
                    ) : null}
                    <span className="path-chip workspace">Returns to Workspace through Memory</span>
                  </PathChipCluster>
                  <CreatorStrip profile={creatorProfile} />
                  <ImpactCluster signals={selectedPublicImpact} />
                  <div className="response-lineage-panel">
                    <TraceBand
                      wrapperClassName="response-lineage-trace-band"
                      family="community"
                      state={selectedPublicLineage && selectedPublicLineage.total > 0 ? "active" : "dormant"}
                      label="Response Trace"
                      title={
                        selectedPublicLineage && selectedPublicLineage.total > 0
                          ? "The responses this line sparked are now readable"
                          : "Response traces will gather here once the line is picked up inward"
                      }
                    />
                    <div className="response-lineage-head">
                      <div>
                        <span className="mini-label">Response Lineage</span>
                        <strong>
                          {selectedPublicLineage && selectedPublicLineage.total > 0
                            ? `This public result sparked ${selectedPublicLineage.total} response${
                                selectedPublicLineage.total === 1 ? "" : "s"
                              }`
                            : "This public result has not sparked inward responses yet"}
                        </strong>
                      </div>
                      {selectedPublicLineage && selectedPublicLineage.total > 0 ? (
                        <span className="response-lineage-summary">
                          {describeResponseLineage(selectedPublicLineage)}
                        </span>
                      ) : null}
                    </div>
                    {selectedPublicLineage && selectedPublicLineage.total > 0 ? (
                      <>
                        <div className="response-lineage-stats">
                          {selectedPublicLineage.returns > 0 ? (
                            <span className="response-lineage-stat memory">
                              {selectedPublicLineage.returns} inward return
                              {selectedPublicLineage.returns === 1 ? "" : "s"}
                            </span>
                          ) : null}
                          {selectedPublicLineage.continuations > 0 ? (
                            <span className="response-lineage-stat workspace">
                              {selectedPublicLineage.continuations} continuation
                              {selectedPublicLineage.continuations === 1 ? "" : "s"}
                            </span>
                          ) : null}
                          {selectedPublicLineage.versions > 0 ? (
                            <span className="response-lineage-stat playful">
                              {selectedPublicLineage.versions} version
                              {selectedPublicLineage.versions === 1 ? "" : "s"}
                            </span>
                          ) : null}
                        </div>
                        <div className="response-lineage-list">
                          {selectedPublicLineage.recent.map((entry) => (
                            <div key={entry.id} className="response-lineage-item">
                              <div className="response-lineage-copy">
                                <small className="card-tag">
                                  {getResponseLineageLabel(entry.mode)}
                                </small>
                                <strong>{entry.title}</strong>
                                <span>{entry.summary}</span>
                              </div>
                              <small>{entry.keptAt}</small>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="response-lineage-empty">
                        Once this result returns inward, continues, or sparks a new version, that
                        life should be readable here without turning into metrics.
                      </p>
                    )}
                  </div>
                  <div className="line-family-panel">
                    <div className="line-family-head">
                      <div>
                        <span className="mini-label">Public Line Family</span>
                        <strong>
                          {selectedPublicSource || (selectedPublicLineage && selectedPublicLineage.total > 0)
                            ? "This public result now sits inside a readable line family"
                            : "This public result is still mostly standing alone"}
                        </strong>
                      </div>
                      <span className="response-lineage-summary">
                        {describePublicLineFamily(Boolean(selectedPublicSource), selectedPublicLineage)}
                      </span>
                    </div>
                    <div className="line-family-cluster">
                      {selectedPublicSource ? (
                        <button
                          className="line-family-card"
                          onClick={() => onOpenWork(selectedPublicSource)}
                          type="button"
                        >
                          <small className="card-tag">Original Line</small>
                          <strong>{selectedPublicSource.title}</strong>
                          <span>{cleanReadableText(selectedPublicSource.summary)}</span>
                        </button>
                      ) : (
                        <div className="line-family-card static">
                          <small className="card-tag">Original Line</small>
                          <strong>No readable original line</strong>
                          <span>This public result can still grow a family from here.</span>
                        </div>
                      )}
                      <div className="line-family-center">
                        <small className="card-tag">Shared Middle</small>
                        <strong>{selectedPublic.title}</strong>
                        <span>This public release is the shared public center of the line.</span>
                      </div>
                      <div className="line-family-side">
                        <small className="card-tag">Connected Responses</small>
                        {selectedPublicLineage && selectedPublicLineage.recent.length > 0 ? (
                          <div className="line-family-response-list">
                            {selectedPublicLineage.recent.map((entry) => {
                              const work = keptWorks.find((item) => item.id === entry.id) ?? null;
                              return (
                                <button
                                  key={entry.id}
                                  className="line-family-response"
                                  onClick={() => {
                                    if (work) {
                                      onOpenWork(work);
                                    }
                                  }}
                                  type="button"
                                >
                                  <small className="card-tag">
                                    {getResponseLineageLabel(entry.mode)}
                                  </small>
                                  <strong>{entry.title}</strong>
                                  <span>{entry.summary}</span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="line-family-empty">
                            Connected inward lines will appear here once this public result starts
                            getting picked up.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedPublic.openToVersioning ? (
                    <div className="playful-note">
                      <span className="mini-label">Playful Invitation</span>
                      <p>
                        This public result invites a new version inward. The point is not to
                        compete with it, but to answer it with another real line of work.
                      </p>
                    </div>
                  ) : null}
                  <div className="response-direction-panel">
                    <div className="response-direction-head">
                      <div>
                        <span className="mini-label">Response Direction</span>
                        <strong>{getResponseDirectionLabel(selectedPublic.responseDirection)}</strong>
                      </div>
                      <span className="response-lineage-summary">Creator-set and calm</span>
                    </div>
                    <p>{getResponseDirectionCopy(selectedPublic)}</p>
                    <div className="response-direction-choices">
                      {(["somewhere-new", "shift-mood", "shift-look"] as const).map((direction) => (
                        <button
                          key={direction}
                          className={
                            direction === selectedPublic.responseDirection
                              ? "lens-chip active"
                              : "lens-chip"
                          }
                          onClick={() => onSetResponseDirection(selectedPublic, direction)}
                          type="button"
                        >
                          {getResponseDirectionLabel(direction)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <InvitationNote
                    copy={
                      selectedPublic.openToVersioning
                        ? `This result can now trigger a lighter creative response: ${getResponseDirectionLabel(
                            selectedPublic.responseDirection,
                          ).toLowerCase()}, bring it inward, and let the new line become real work.`
                        : selectedPublic.openToContinuation
                          ? "This public result is open to continuation, so another person can take it inward and keep the line moving."
                          : "This public result matters most if it can return inward and turn into another real line of work."
                    }
                  />
                  {selectedPublic.openToContinuation ? (
                    <div className="collaboration-note">
                      <span className="mini-label">Continuation Bridge</span>
                      <p>
                        This result is open to continuation through Memory and Workspace, not
                        through chat or shared editing.
                      </p>
                    </div>
                  ) : null}
                  <FocusPrompt label="Prompt Snapshot">
                    <p>{selectedPublic.prompt}</p>
                  </FocusPrompt>
                  <div className="focus-actions">
                    <button
                      className="primary-action"
                      onClick={() =>
                        onBringIntoMemory(
                          selectedPublic,
                          selectedPublic.openToVersioning
                            ? "branch"
                            : selectedPublic.openToContinuation
                              ? "continue"
                              : "import",
                        )
                      }
                      type="button"
                    >
                      {selectedPublic.openToVersioning
                        ? getVersionActionLabel(selectedPublic.responseDirection)
                        : selectedPublic.openToContinuation
                          ? "Continue this line inward"
                          : "Bring inward and branch"}
                    </button>
                    {selectedPublic.openToVersioning && selectedPublic.openToContinuation ? (
                      <button
                        className="ghost-action"
                        onClick={() => onBringIntoMemory(selectedPublic, "continue")}
                        type="button"
                      >
                        Continue this line inward
                      </button>
                    ) : null}
                    <button
                      className="ghost-action"
                      onClick={() => onOpenSourceKeep(selectedPublic)}
                      type="button"
                    >
                      Open Original Keep
                    </button>
                  </div>
                  <div className="focus-actions secondary">
                    <button
                      className="ghost-action"
                      onClick={() => onToggleVersioning(selectedPublic)}
                      type="button"
                    >
                      {selectedPublic.openToVersioning ? "Close Versions" : "Invite Versions"}
                    </button>
                    <button
                      className="ghost-action"
                      onClick={() => onToggleContinuation(selectedPublic)}
                      type="button"
                    >
                      {selectedPublic.openToContinuation
                        ? "Close Continuation"
                        : "Open To Continuation"}
                    </button>
                  </div>
                  <div className="support-note community-loop-note">
                    <strong>Current loop</strong>
                    <span>
                      {selectedPublic.openToVersioning && selectedPublic.openToContinuation
                        ? "Memory -> Community -> versions or continuation -> Memory"
                        : selectedPublic.openToVersioning
                          ? "Memory -> Community -> make your own version -> Memory"
                          : selectedPublic.openToContinuation
                            ? "Memory -> Community -> shared continuation -> Memory"
                            : "Memory -> Community -> Memory"}
                    </span>
                  </div>
                </>
              ) : (
                <div className="empty-card">
                  <h3>No public result selected.</h3>
                  <p>
                    This focus area should prove that public work in MorpBase is still reusable,
                    inspectable, and return-worthy.
                  </p>
                </div>
              )
            ) : selectedPublicAsset ? (
              <>
                <div className="focus-image asset-image">{selectedPublicAsset.imageLabel}</div>
                <p className="focus-summary">{selectedPublicAsset.summary}</p>
                <FocusPrompt label="Public Framing">
                  <p>{selectedPublicAsset.publicNote}</p>
                </FocusPrompt>
                <PathChipCluster label="Carried Across">
                  <span className={`path-chip memory ${hasSelectedPublicAssetPrivate ? "strong" : ""}`}>
                    {hasSelectedPublicAssetPrivate ? "Private asset exists" : "Can re-enter Memory"}
                  </span>
                  {selectedPublicAsset.sourceDraft.subject ? (
                    <span
                      className={`path-chip continuity ${
                        hasSelectedPublicAssetContinuity ? "strong" : "muted"
                      }`}
                    >
                      {hasSelectedPublicAssetContinuity
                        ? "Continuity line present"
                        : "Continuity can read this line inward"}
                    </span>
                  ) : null}
                  <span className="path-chip workspace">Returns to Workspace through Memory</span>
                </PathChipCluster>
                <CreatorStrip profile={creatorProfile} />
                <ImpactCluster signals={selectedPublicAssetImpact} />
                <InvitationNote copy="This public asset should still behave like shaping material: bring it inward and let it guide future work." />
                <FocusPrompt label="Shaping Reading">
                  <p>{selectedPublicAsset.shapingReading}</p>
                </FocusPrompt>
                <div className="focus-actions">
                  <button
                    className="primary-action"
                    onClick={() => onBringAssetIntoMemory(selectedPublicAsset)}
                    type="button"
                  >
                    Bring inward and use
                  </button>
                  <button
                    className="ghost-action"
                    onClick={() => onOpenPublicAssetSource(selectedPublicAsset)}
                    type="button"
                  >
                    Open Original Asset
                  </button>
                </div>
                <div className="support-note community-loop-note">
                  <strong>Current loop</strong>
                  <span>{"Memory -> Community -> Memory"}</span>
                </div>
              </>
            ) : (
              <div className="empty-card">
                <h3>No public reusable asset selected.</h3>
                <p>
                  This focus area should prove that public reusable assets still feel like shaping
                  material, not like a detached library object.
                </p>
              </div>
            )}
          </aside>
        </div>

        <section className="creator-practice-panel">
          <header className="section-head">
            <div>
              <span className="eyebrow">Creator Practice</span>
              <h2>{creatorProfile.name}</h2>
            </div>
          </header>

          <div className="creator-practice-card">
            <div className="creator-avatar large">{creatorProfile.initials}</div>
            <div className="creator-practice-copy">
              <p className="focus-summary">{creatorProfile.practiceReading}</p>
              <FocusPrompt label="Public Reading">
                <p>{creatorProfile.publicReading}</p>
              </FocusPrompt>
              <div className="path-chip-row">
                <span className={`path-chip community ${publicResults.length > 0 ? "strong" : "muted"}`}>
                  {publicResults.length > 0
                    ? "Workflow results released"
                    : "Workflow results will appear here"}
                </span>
                <span className={`path-chip memory ${publicReusableAssets.length > 0 ? "strong" : "muted"}`}>
                  {publicReusableAssets.length > 0
                    ? "Reusable assets released"
                    : "Reusable assets will appear here"}
                </span>
                <span className={`path-chip continuity ${creatorContinuityCount > 0 ? "strong" : "muted"}`}>
                  {creatorContinuityCount > 0
                    ? "Continuity traces visible"
                    : "Continuity can surface later"}
                </span>
              </div>
            </div>
          </div>

          <div className="creator-practice-shelf">
            <div className="creator-practice-column">
              <CompactSectionHeading label="Workflow Results" />
              <CompactStackBody
                hasItems={publicResults.length > 0}
                empty={<p>No released workflow results yet.</p>}
              >
                {publicResults.slice(0, 2).map((result) => (
                  <PracticeObjectCard
                    key={result.id}
                    title={result.title}
                    note={result.publicNote}
                    onClick={() => onOpenPublicResult(result)}
                  />
                ))}
              </CompactStackBody>
            </div>

            <div className="creator-practice-column">
              <CompactSectionHeading label="Reusable Assets" />
              <CompactStackBody
                hasItems={publicReusableAssets.length > 0}
                empty={<p>No released reusable assets yet.</p>}
              >
                {publicReusableAssets.slice(0, 2).map((asset) => (
                  <PracticeObjectCard
                    key={asset.id}
                    title={asset.title}
                    note={asset.publicNote}
                    onClick={() => onOpenPublicAsset(asset)}
                  />
                ))}
              </CompactStackBody>
            </div>
          </div>
        </section>

        <section className="publishing-panel">
          <header className="section-head">
            <div>
              <span className="eyebrow">Publishing</span>
              <h2>Public circulation desk</h2>
            </div>
          </header>

          <div className="publishing-note">
            <strong>Publishing should feel like release and care, not administration.</strong>
            <span>
              Ready objects come from `Memory`. Public objects stay manageable here without
              turning Community into a dashboard.
            </span>
          </div>

          <ThresholdBand
            wrapperClassName="publishing-threshold-band"
            family="publish"
            state={publishThresholdOpen ? "open" : "held"}
            label="Publish Crossing"
            title={publishThresholdOpen ? "Public crossing is open" : "Public crossing waits for ready work"}
            copy={
              publishThresholdOpen
                ? "Ready work can cross into Community as public life without leaving the engine behind."
                : "When kept work or distilled assets are ready, Publish becomes the outward crossing into Community."
            }
          />

          <div className="publishing-grid">
            <section className="publishing-column">
              <CompactSectionHeading
                wrapperClassName="publishing-column-head"
                label="Ready To Release"
                title={
                  publishableWorks.length + publishableAssets.length > 0
                    ? `${publishableWorks.length + publishableAssets.length} object${
                        publishableWorks.length + publishableAssets.length === 1 ? "" : "s"
                      } ready`
                    : "Nothing is waiting yet"
                }
              />

              <CompactStackBody
                hasItems={publishableWorks.length + publishableAssets.length > 0}
                empty={
                  <p>Keep or distill more work in Memory to make public release candidates appear here.</p>
                }
              >
                {publishableWorks.map((work) => (
                  <PublishingObjectCard
                    key={work.id}
                    tag="Workflow Result"
                    title={work.title}
                    summary={cleanReadableText(work.summary)}
                    actions={
                      <>
                        <button
                          className="primary-action compact-action publish-action"
                          onClick={() => onShareToCommunity(work)}
                          type="button"
                        >
                          Release
                        </button>
                        <button
                          className="ghost-action compact-action"
                          onClick={() => onOpenWork(work)}
                          type="button"
                        >
                          Open in Memory
                        </button>
                      </>
                    }
                  />
                ))}

                {publishableAssets.map((asset) => (
                  <PublishingObjectCard
                    key={asset.id}
                    tag="Reusable Asset"
                    title={asset.title}
                    summary={asset.shapingReading}
                    actions={
                      <>
                        <button
                          className="primary-action compact-action publish-action"
                          onClick={() => onShareAssetToCommunity(asset)}
                          type="button"
                        >
                          Release
                        </button>
                        <button
                          className="ghost-action compact-action"
                          onClick={() => onOpenAsset(asset)}
                          type="button"
                        >
                          Open in Memory
                        </button>
                      </>
                    }
                  />
                ))}
              </CompactStackBody>
            </section>

            <section className="publishing-column">
              <CompactSectionHeading
                wrapperClassName="publishing-column-head"
                label="Already Public"
                title={
                  publicResults.length + publicReusableAssets.length > 0
                    ? `${publicResults.length + publicReusableAssets.length} object${
                        publicResults.length + publicReusableAssets.length === 1 ? "" : "s"
                      } live`
                    : "No public objects yet"
                }
              />

              <CompactStackBody
                hasItems={publicResults.length + publicReusableAssets.length > 0}
                empty={
                  <p>Released objects will appear here once Community has real public life to manage.</p>
                }
              >
                {publicResults.map((result) => {
                  const lineage = publicResultLineage.get(result.id);
                  return (
                    <PublishingObjectCard
                      key={result.id}
                      tag="Workflow Result"
                      title={result.title}
                      summary={result.publicNote}
                      details={
                        <>
                          <small>
                            {result.openToVersioning ? "Invites versions" : "Version invitation closed"} /{" "}
                            {result.openToContinuation ? "Open to continuation" : "Continuation closed"}
                          </small>
                          <small className="lineage-inline-note">
                            Direction: {getResponseDirectionLabel(result.responseDirection)}
                          </small>
                          {lineage && lineage.total > 0 ? (
                            <small className="lineage-inline-note">
                              Response lineage: {describeResponseLineage(lineage)}
                            </small>
                          ) : (
                            <small className="lineage-inline-note">No inward responses yet</small>
                          )}
                          <small className="lineage-inline-note">
                            Family: {describePublicLineFamily(Boolean(result.sourceKeepId), lineage ?? null)}
                          </small>
                        </>
                      }
                      actions={
                        <>
                          <button
                            className="ghost-action compact-action"
                            onClick={() => onOpenPublicResult(result)}
                            type="button"
                          >
                            Open Public
                          </button>
                          <button
                            className="ghost-action compact-action"
                            onClick={() => onToggleVersioning(result)}
                            type="button"
                          >
                            {result.openToVersioning ? "Close Versions" : "Invite Versions"}
                          </button>
                          <button
                            className="ghost-action compact-action"
                            onClick={() => onToggleContinuation(result)}
                            type="button"
                          >
                            {result.openToContinuation ? "Close Continuation" : "Open To Continuation"}
                          </button>
                          <button
                            className="ghost-action compact-action danger-action"
                            onClick={() => onWithdrawPublicResult(result)}
                            type="button"
                          >
                            Withdraw
                          </button>
                        </>
                      }
                    />
                  );
                })}

                {publicReusableAssets.map((asset) => (
                  <PublishingObjectCard
                    key={asset.id}
                    tag="Reusable Asset"
                    title={asset.title}
                    summary={asset.publicNote}
                    actions={
                      <>
                        <button
                          className="ghost-action compact-action"
                          onClick={() => onOpenPublicAsset(asset)}
                          type="button"
                        >
                          Open Public
                        </button>
                        <button
                          className="ghost-action compact-action danger-action"
                          onClick={() => onWithdrawPublicAsset(asset)}
                          type="button"
                        >
                          Withdraw
                        </button>
                      </>
                    }
                  />
                ))}
              </CompactStackBody>
            </section>
          </div>
        </section>
      </section>
    </div>
  );
}
