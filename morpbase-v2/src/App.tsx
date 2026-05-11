import { useMemo, useState } from "react";
import {
  defaultDraft,
  freshWorkspaceOrigin,
} from "./morpbaseModel";
import { readPersistedState } from "./morpbasePersistence";
import { deriveSupportViewDerivations } from "./morpbaseDerivations";
import {
  useCommunityLensGuardEffect,
  usePersistenceWriteEffect,
  useSelectedContinuityGuardEffect,
  useSelectedIdGuardEffect,
  useWorkspacePhaseResetGuardEffect,
} from "./morpbaseControllerEffects";
import {
  createKeptWorkFromDraft,
  createKeptWorkFromPublicResult,
  createPublicReusableAssetFromReusableAsset,
  createPublicWorkflowResultFromKeptWork,
  createReusableAssetFromKeptWork,
  createReusableAssetFromPublicAsset,
} from "./morpbaseTransitions";
import { WorkspaceView } from "./views/WorkspaceView";
import { MemoryView } from "./views/MemoryView";
import { CommunityView } from "./views/CommunityView";
import { ContinuityView } from "./views/ContinuityView";
import {
  deriveContinuityEntities,
  derivePublicResultLineage,
  formatNow,
  getResponseDirectionLabel,
  hasDraftStarted,
} from "./morpbaseReadings";
import type {
  ContinuityEntity,
  KeptWork,
  PublicReusableAsset,
  PublicWorkflowResult,
  Realm,
  ResponseDirectionKey,
  ReusableAsset,
  WorkspaceDraft,
  WorkspaceOrigin,
} from "./morpbaseModel";

function App() {
  const [bootstrap] = useState(readPersistedState);
  const [realm, setRealm] = useState<Realm>(bootstrap.realm);
  const [focusedWorkspacePhase, setFocusedWorkspacePhase] = useState<number | null>(null);
  const [draft, setDraft] = useState<WorkspaceDraft>(bootstrap.draft);
  const [draftOrigin, setDraftOrigin] = useState<WorkspaceOrigin>(bootstrap.draftOrigin);
  const [keptWorks, setKeptWorks] = useState<KeptWork[]>(bootstrap.keptWorks);
  const [selectedKeepId, setSelectedKeepId] = useState<number | null>(bootstrap.selectedKeepId);
  const [handoffMessage, setHandoffMessage] = useState(bootstrap.handoffMessage);
  const [workspaceBridgeMessage, setWorkspaceBridgeMessage] = useState(
    bootstrap.workspaceBridgeMessage,
  );
  const [reusableAssets, setReusableAssets] = useState<ReusableAsset[]>(
    bootstrap.reusableAssets,
  );
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(
    bootstrap.selectedAssetId,
  );
  const [publicResults, setPublicResults] = useState<PublicWorkflowResult[]>(
    bootstrap.publicResults,
  );
  const [selectedPublicId, setSelectedPublicId] = useState<number | null>(
    bootstrap.selectedPublicId,
  );
  const [publicReusableAssets, setPublicReusableAssets] = useState<PublicReusableAsset[]>(
    bootstrap.publicReusableAssets,
  );
  const [selectedPublicAssetId, setSelectedPublicAssetId] = useState<number | null>(
    bootstrap.selectedPublicAssetId,
  );
  const [communityLens, setCommunityLens] = useState<"results" | "assets">(bootstrap.communityLens);
  const [communityBridgeMessage, setCommunityBridgeMessage] = useState(
    bootstrap.communityBridgeMessage,
  );
  const [selectedContinuityKey, setSelectedContinuityKey] = useState<string | null>(
    bootstrap.selectedContinuityKey,
  );
  const [continuityBridgeMessage, setContinuityBridgeMessage] = useState(
    bootstrap.continuityBridgeMessage,
  );

  const keepReady = Boolean(draft.subject && draft.visual && draft.framing);
  const selectedWork =
    keptWorks.find((work) => work.id === selectedKeepId) ?? keptWorks[0] ?? null;
  const selectedAsset =
    reusableAssets.find((asset) => asset.id === selectedAssetId) ?? reusableAssets[0] ?? null;
  const selectedPublic =
    publicResults.find((result) => result.id === selectedPublicId) ??
    publicResults[0] ??
    null;
  const selectedPublicAsset =
    publicReusableAssets.find((asset) => asset.id === selectedPublicAssetId) ??
    publicReusableAssets[0] ??
    null;
  const continuityEntities = useMemo(() => deriveContinuityEntities(keptWorks), [keptWorks]);
  const selectedContinuity =
    continuityEntities.find((entity) => entity.key === selectedContinuityKey) ??
    continuityEntities[0] ??
    null;
  const publicResultLineage = useMemo(
    () => derivePublicResultLineage(publicResults, keptWorks),
    [publicResults, keptWorks],
  );
  const {
    selectedWorkPublic,
    selectedWorkAsset,
    selectedWorkContinuity,
    selectedPublicSource,
    selectedAssetSource,
    selectedAssetPublic,
    selectedPublicContinuity,
    selectedPublicAssetPrivate,
    selectedPublicAssetContinuity,
    selectedContinuityPublic,
    selectedContinuityPublicAsset,
    selectedWorkImpact,
    selectedAssetImpact,
    selectedPublicImpact,
    selectedPublicLineage,
    selectedPublicAssetImpact,
    selectedContinuityImpact,
    publishableWorks,
    publishableAssets,
    creatorContinuityCount,
    creatorProfile,
    engineNodes,
    engineSnapshot,
    shellCompass,
  } = deriveSupportViewDerivations({
    realm,
    communityLens,
    draft,
    keepReady,
    keptWorks,
    reusableAssets,
    publicResults,
    publicReusableAssets,
    continuityEntities,
    publicResultLineage,
    selectedWork,
    selectedAsset,
    selectedPublic,
    selectedPublicAsset,
    selectedContinuity,
  });

  usePersistenceWriteEffect({
    realm,
    draft,
    draftOrigin,
    keptWorks,
    selectedKeepId,
    handoffMessage,
    workspaceBridgeMessage,
    reusableAssets,
    selectedAssetId,
    publicResults,
    selectedPublicId,
    publicReusableAssets,
    selectedPublicAssetId,
    communityLens,
    communityBridgeMessage,
    selectedContinuityKey,
    continuityBridgeMessage,
  });

  useSelectedIdGuardEffect({
    items: reusableAssets,
    selectedId: selectedAssetId,
    setSelectedId: setSelectedAssetId,
  });

  useCommunityLensGuardEffect({
    communityLens,
    publicReusableAssets,
    setCommunityLens,
  });

  useSelectedIdGuardEffect({
    items: publicReusableAssets,
    selectedId: selectedPublicAssetId,
    setSelectedId: setSelectedPublicAssetId,
  });

  useSelectedContinuityGuardEffect({
    items: continuityEntities,
    selectedKey: selectedContinuityKey,
    setSelectedKey: setSelectedContinuityKey,
  });

  useWorkspacePhaseResetGuardEffect({
    realm,
    focusedWorkspacePhase,
    setFocusedWorkspacePhase,
  });

  function updateDraft<K extends keyof WorkspaceDraft>(key: K, value: WorkspaceDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleToggleWorkspacePhase(index: number) {
    setFocusedWorkspacePhase((current) => (current === index ? null : index));
  }

  function handleFocusRecommendedWorkspacePhase(index: number) {
    setFocusedWorkspacePhase(index);
  }

  function handleKeep() {
    if (!keepReady) {
      return;
    }

    const keep = createKeptWorkFromDraft({
      id: Date.now(),
      keptAt: formatNow(),
      draft,
      draftOrigin,
    });

    setKeptWorks((current) => [keep, ...current]);
    setSelectedKeepId(keep.id);
    setHandoffMessage(`${keep.title} was kept and moved into Memory.`);
    setWorkspaceBridgeMessage(`${keep.title} is now available as a living return point in Memory.`);
    if (keep.draft.subject) {
      setSelectedContinuityKey(keep.draft.subject.toLowerCase());
      setContinuityBridgeMessage(`${keep.title} can now extend the ${keep.draft.subject} continuity line.`);
    }
    setRealm("memory");
  }

  function handleOpenWork(work: KeptWork) {
    setSelectedKeepId(work.id);
    setRealm("memory");
    setHandoffMessage(`${work.title} is active in Memory.`);
  }

  function handleReturnToWorkspace(work: KeptWork) {
    setDraft({ ...work.draft });
    setDraftOrigin({
      kind: "keep",
      mode: "continue",
      sourceId: work.id,
      label: work.title,
    });
    setRealm("workspace");
    setHandoffMessage(`Returned to Workspace from ${work.title}.`);
    setWorkspaceBridgeMessage(`Continuing ${work.title} from Memory.`);
  }

  function handleBranchFromWork(work: KeptWork) {
    setDraft({
      ...work.draft,
      subjectClue: work.draft.subjectClue
        ? `${work.draft.subjectClue} with a new variation`
        : "Carry one recognizable change from this kept work.",
    });
    setDraftOrigin({
      kind: "keep",
      mode: "branch",
      sourceId: work.id,
      label: work.title,
    });
    setRealm("workspace");
    setHandoffMessage(`Branched a new workspace line from ${work.title}.`);
    setWorkspaceBridgeMessage(`Branched from ${work.title}. This is a new line, not just a reopen.`);
  }

  function handleStartNewWorkspaceSession() {
    setDraft(defaultDraft());
    setDraftOrigin(freshWorkspaceOrigin());
    setRealm("workspace");
    setHandoffMessage("Shape something worth keeping.");
    setWorkspaceBridgeMessage("Fresh session started. Shape something worth keeping.");
  }

  function handleCreateReusableAsset(work: KeptWork) {
    const existing = reusableAssets.find((asset) => asset.sourceKeepId === work.id);
    if (existing) {
      setSelectedAssetId(existing.id);
      setHandoffMessage(`${existing.title} is already active in Reusable Assets.`);
      setRealm("memory");
      return;
    }

    const asset = createReusableAssetFromKeptWork({
      id: Date.now(),
      createdAt: formatNow(),
      work,
    });

    setReusableAssets((current) => [asset, ...current]);
    setSelectedAssetId(asset.id);
    setHandoffMessage(`${asset.title} was distilled from ${work.title}.`);
    setWorkspaceBridgeMessage(`${asset.title} can now guide a new workspace line from Memory.`);
    setRealm("memory");
  }

  function handleOpenAsset(asset: ReusableAsset) {
    setSelectedAssetId(asset.id);
    setHandoffMessage(`${asset.title} is active in Reusable Assets.`);
    setRealm("memory");
  }

  function handleUseAssetInWorkspace(asset: ReusableAsset) {
    setDraft({ ...asset.sourceDraft });
    setDraftOrigin({
      kind: "asset",
      mode: "use",
      sourceId: asset.id,
      label: asset.title,
    });
    setRealm("workspace");
    setHandoffMessage(`${asset.title} was applied as reusable shaping material.`);
    setWorkspaceBridgeMessage(`Started from ${asset.title} in Memory.`);
  }

  function handleOpenAssetSource(asset: ReusableAsset) {
    if (!asset.sourceKeepId) {
      return;
    }

    const source = keptWorks.find((work) => work.id === asset.sourceKeepId);
    if (!source) {
      return;
    }

    setSelectedKeepId(source.id);
    setRealm("memory");
    setHandoffMessage(`Opened the kept work behind ${asset.title}.`);
  }

  function handleShareAssetToCommunity(asset: ReusableAsset) {
    const existing = publicReusableAssets.find((publicAsset) => publicAsset.sourceAssetId === asset.id);
    if (existing) {
      setSelectedPublicAssetId(existing.id);
      setCommunityLens("assets");
      setCommunityBridgeMessage(`${existing.title} is already active in Community.`);
      setRealm("community");
      return;
    }

    const publicAsset = createPublicReusableAssetFromReusableAsset({
      id: Date.now(),
      publishedAt: formatNow(),
      asset,
    });

    setPublicReusableAssets((current) => [publicAsset, ...current]);
    setSelectedPublicAssetId(publicAsset.id);
    setCommunityLens("assets");
    setCommunityBridgeMessage(`${publicAsset.title} moved from Memory into public reusable circulation.`);
    setRealm("community");
  }

  function handleOpenPublicAsset(asset: PublicReusableAsset) {
    setSelectedPublicAssetId(asset.id);
    setCommunityLens("assets");
    setCommunityBridgeMessage(`${asset.title} is active in Community.`);
    setRealm("community");
  }

  function handleBringAssetIntoMemory(asset: PublicReusableAsset) {
    const existing = asset.sourceAssetId
      ? reusableAssets.find((reusableAsset) => reusableAsset.id === asset.sourceAssetId) ?? null
      : null;

    if (existing) {
      setSelectedAssetId(existing.id);
      setHandoffMessage(`${asset.title} returned through an existing reusable asset in Memory.`);
      setRealm("memory");
      return;
    }

    const reusableAsset = createReusableAssetFromPublicAsset({
      id: Date.now(),
      createdAt: formatNow(),
      asset,
    });

    setReusableAssets((current) => [reusableAsset, ...current]);
    setSelectedAssetId(reusableAsset.id);
    setHandoffMessage(`${asset.title} was brought back into Memory as reusable shaping material.`);
    setWorkspaceBridgeMessage(`${asset.title} can now guide future work through Memory.`);
    setRealm("memory");
  }

  function handleOpenPublicAssetSource(asset: PublicReusableAsset) {
    if (asset.sourceAssetId) {
      const sourceAsset =
        reusableAssets.find((reusableAsset) => reusableAsset.id === asset.sourceAssetId) ?? null;
      if (sourceAsset) {
        setSelectedAssetId(sourceAsset.id);
        setRealm("memory");
        setHandoffMessage(`Opened the source reusable asset behind ${asset.title}.`);
        return;
      }
    }

    if (asset.sourceKeepId) {
      const sourceKeep = keptWorks.find((work) => work.id === asset.sourceKeepId) ?? null;
      if (sourceKeep) {
        setSelectedKeepId(sourceKeep.id);
        setRealm("memory");
        setHandoffMessage(`Opened the kept work behind ${asset.title}.`);
      }
    }
  }

  function handleShareToCommunity(work: KeptWork) {
    const result = createPublicWorkflowResultFromKeptWork({
      id: Date.now(),
      publishedAt: formatNow(),
      work,
    });

    setPublicResults((current) => [result, ...current]);
    setSelectedPublicId(result.id);
    setCommunityLens("results");
    setCommunityBridgeMessage(`${result.title} moved from Memory into Discover.`);
    setRealm("community");
  }

  function handleOpenPublicResult(result: PublicWorkflowResult) {
    setSelectedPublicId(result.id);
    setCommunityLens("results");
    setCommunityBridgeMessage(`${result.title} is active in Discover.`);
    setRealm("community");
  }

  function handleToggleContinuation(result: PublicWorkflowResult) {
    setPublicResults((current) =>
      current.map((item) =>
        item.id === result.id ? { ...item, openToContinuation: !item.openToContinuation } : item,
      ),
    );
    setCommunityBridgeMessage(
      result.openToContinuation
        ? `${result.title} is no longer open to continuation.`
        : `${result.title} is now open to continuation.`,
    );
    setRealm("community");
  }

  function handleToggleVersioning(result: PublicWorkflowResult) {
    setPublicResults((current) =>
      current.map((item) =>
        item.id === result.id ? { ...item, openToVersioning: !item.openToVersioning } : item,
      ),
    );
    setCommunityBridgeMessage(
      result.openToVersioning
        ? `${result.title} no longer invites new versions.`
        : `${result.title} now invites new versions.`,
    );
    setRealm("community");
  }

  function handleSetResponseDirection(result: PublicWorkflowResult, direction: ResponseDirectionKey) {
    setPublicResults((current) =>
      current.map((item) => (item.id === result.id ? { ...item, responseDirection: direction } : item)),
    );
    setCommunityBridgeMessage(
      `${result.title} now points responses toward "${getResponseDirectionLabel(direction).toLowerCase()}".`,
    );
    setRealm("community");
  }

  function handleBringIntoMemory(
    result: PublicWorkflowResult,
    mode: "import" | "continue" | "branch" = "import",
  ) {
    const keep = createKeptWorkFromPublicResult({
      id: Date.now(),
      keptAt: formatNow(),
      result,
      mode,
    });

    setKeptWorks((current) => [keep, ...current]);
    setSelectedKeepId(keep.id);
    setHandoffMessage(
      mode === "continue"
        ? `${result.title} started a new continuation line in Memory.`
        : mode === "branch"
          ? `${result.title} started a new version line in Memory.`
          : `${result.title} was brought back into Memory.`,
    );
    setWorkspaceBridgeMessage(
      mode === "continue"
        ? `This line came inward as a continuation from Community and can keep growing in Workspace.`
        : mode === "branch"
          ? `This line began as your own version from Community and can now keep changing in Workspace.`
          : `This line came back through Community and can continue in Workspace.`,
    );
    if (keep.draft.subject) {
      setSelectedContinuityKey(keep.draft.subject.toLowerCase());
      setContinuityBridgeMessage(
        mode === "branch"
          ? `${keep.title} now carries the ${keep.draft.subject} line forward through a new version.`
          : `${keep.title} strengthens the ${keep.draft.subject} continuity line.`,
      );
    }
    setRealm("memory");
  }

  function handleOpenSourceKeep(result: PublicWorkflowResult) {
    if (!result.sourceKeepId) {
      handleBringIntoMemory(result);
      return;
    }

    const source = keptWorks.find((work) => work.id === result.sourceKeepId);
    if (!source) {
      handleBringIntoMemory(result);
      return;
    }

    setSelectedKeepId(source.id);
    setRealm("memory");
    setHandoffMessage(`Opened the original kept work behind ${result.title}.`);
  }

  function handleOpenContinuityFromMemory(work: KeptWork) {
    const subject = work.draft.subject;
    if (!subject) {
      return;
    }

    setSelectedContinuityKey(subject.toLowerCase());
    setContinuityBridgeMessage(`${work.title} is now read as part of the ${subject} continuity line.`);
    setRealm("continuity");
  }

  function handleOpenContinuityEntity(entity: ContinuityEntity) {
    setSelectedContinuityKey(entity.key);
    setContinuityBridgeMessage(`${entity.name} is active in Continuity.`);
    setRealm("continuity");
  }

  function handleActivateContinuity(entity: ContinuityEntity) {
    const latest = entity.appearances[0];
    if (!latest) {
      return;
    }

    setDraft({ ...latest.draft });
    setDraftOrigin({
      kind: "continuity",
      mode: "activate",
      sourceId: null,
      label: entity.name,
    });
    setRealm("workspace");
    setWorkspaceBridgeMessage(`Activated ${entity.name} back into Workspace.`);
    setHandoffMessage(`${entity.name} was activated from Continuity.`);
  }

  function handleOpenAppearanceInMemory(work: KeptWork) {
    setSelectedKeepId(work.id);
    setRealm("memory");
    setHandoffMessage(`${work.title} opened from Continuity.`);
  }

  function handleWithdrawPublicResult(result: PublicWorkflowResult) {
    setPublicResults((current) => current.filter((item) => item.id !== result.id));
    setCommunityBridgeMessage(`${result.title} was withdrawn from public circulation.`);
    setRealm("community");
  }

  function handleWithdrawPublicAsset(asset: PublicReusableAsset) {
    setPublicReusableAssets((current) => current.filter((item) => item.id !== asset.id));
    setCommunityBridgeMessage(`${asset.title} was withdrawn from public circulation.`);
    setRealm("community");
  }

  function renderWorkspace() {
    return (
      <WorkspaceView
        draft={draft}
        draftOrigin={draftOrigin}
        focusedWorkspacePhase={focusedWorkspacePhase}
        workspaceBridgeMessage={workspaceBridgeMessage}
        onUpdateDraft={updateDraft}
        onToggleWorkspacePhase={handleToggleWorkspacePhase}
        onFocusRecommendedPhase={handleFocusRecommendedWorkspacePhase}
        onKeep={handleKeep}
      />
    );
  }

  function renderMemory() {
    return (
      <MemoryView
        handoffMessage={handoffMessage}
        keptWorks={keptWorks}
        selectedWork={selectedWork}
        selectedWorkImpact={selectedWorkImpact}
        hasSelectedWorkAsset={Boolean(selectedWorkAsset)}
        hasSelectedWorkPublic={Boolean(selectedWorkPublic)}
        hasSelectedWorkContinuity={Boolean(selectedWorkContinuity)}
        onReturnToWorkspace={handleReturnToWorkspace}
        onBranchFromWork={handleBranchFromWork}
        onCreateReusableAsset={handleCreateReusableAsset}
        onShareToCommunity={handleShareToCommunity}
        onOpenContinuityFromMemory={handleOpenContinuityFromMemory}
        onStartNewWorkspaceSession={handleStartNewWorkspaceSession}
        onOpenWork={handleOpenWork}
        reusableAssets={reusableAssets}
        selectedAsset={selectedAsset}
        selectedAssetImpact={selectedAssetImpact}
        hasSelectedAssetSource={Boolean(selectedAssetSource)}
        hasSelectedAssetPublic={Boolean(selectedAssetPublic)}
        onUseAssetInWorkspace={handleUseAssetInWorkspace}
        onOpenAssetSource={handleOpenAssetSource}
        onShareAssetToCommunity={handleShareAssetToCommunity}
        onOpenAsset={handleOpenAsset}
      />
    );
  }

  function renderCommunity() {
    return (
      <CommunityView
        communityBridgeMessage={communityBridgeMessage}
        communityLens={communityLens}
        publicResults={publicResults}
        selectedPublic={selectedPublic}
        publicReusableAssets={publicReusableAssets}
        selectedPublicAsset={selectedPublicAsset}
        publicResultLineage={publicResultLineage}
        selectedPublicLineage={selectedPublicLineage}
        selectedPublicSource={selectedPublicSource}
        hasSelectedPublicContinuity={Boolean(selectedPublicContinuity)}
        selectedPublicImpact={selectedPublicImpact}
        hasSelectedPublicAssetPrivate={Boolean(selectedPublicAssetPrivate)}
        hasSelectedPublicAssetContinuity={Boolean(selectedPublicAssetContinuity)}
        selectedPublicAssetImpact={selectedPublicAssetImpact}
        creatorProfile={creatorProfile}
        creatorContinuityCount={creatorContinuityCount}
        publishableWorks={publishableWorks}
        publishableAssets={publishableAssets}
        keptWorks={keptWorks}
        onChangeCommunityLens={setCommunityLens}
        onOpenPublicResult={handleOpenPublicResult}
        onOpenPublicAsset={handleOpenPublicAsset}
        onOpenWork={handleOpenWork}
        onOpenAsset={handleOpenAsset}
        onSetResponseDirection={handleSetResponseDirection}
        onBringIntoMemory={handleBringIntoMemory}
        onOpenSourceKeep={handleOpenSourceKeep}
        onToggleVersioning={handleToggleVersioning}
        onToggleContinuation={handleToggleContinuation}
        onBringAssetIntoMemory={handleBringAssetIntoMemory}
        onOpenPublicAssetSource={handleOpenPublicAssetSource}
        onShareToCommunity={handleShareToCommunity}
        onShareAssetToCommunity={handleShareAssetToCommunity}
        onWithdrawPublicResult={handleWithdrawPublicResult}
        onWithdrawPublicAsset={handleWithdrawPublicAsset}
      />
    );
  }
  function renderContinuity() {
    return (
      <ContinuityView
        continuityBridgeMessage={continuityBridgeMessage}
        continuityEntities={continuityEntities}
        selectedContinuity={selectedContinuity}
        selectedContinuityImpact={selectedContinuityImpact}
        hasPublicTrace={Boolean(selectedContinuityPublic || selectedContinuityPublicAsset)}
        onOpenContinuityEntity={handleOpenContinuityEntity}
        onActivateContinuity={handleActivateContinuity}
        onOpenAppearanceInMemory={handleOpenAppearanceInMemory}
      />
    );
  }

  return (
    <div className="app-shell" data-realm={realm}>
      <div className="top-frame">
      <span className="top-frame-rail top-frame-rail-left" aria-hidden="true" />
      <span className="top-frame-rail top-frame-rail-right" aria-hidden="true" />
      <span className="shell-join-fragment shell-join-fragment-left" aria-hidden="true" />
      <span className="shell-join-fragment shell-join-fragment-right" aria-hidden="true" />
      <header className="top-shell">
        <div className="brand-block">
          <span className="brand-mark">MB</span>
          <span className="brand-thread" aria-hidden="true" />
          <span className="brand-asset-fragment" aria-hidden="true" />
          <div className="brand-copy">
            <strong>MorpBase V2</strong>
            <span>One creative engine, real return paths</span>
          </div>
        </div>

        <div className="shell-compass" aria-label="Current product reading">
          <span className="shell-compass-mark" aria-hidden="true" />
          <span className="eyebrow">Current Reading</span>
          <strong>{shellCompass.label}</strong>
          <p>{shellCompass.copy}</p>
        </div>

        <nav className="realm-nav" aria-label="Top level navigation">
          <div className="realm-group primary">
            <button
              className={realm === "workspace" ? "realm-link center-link active" : "realm-link center-link"}
              data-realm-link="workspace"
              onClick={() => setRealm("workspace")}
              type="button"
            >
              <span className="realm-link-mark" aria-hidden="true" />
              <span>Workspace</span>
            </button>
            <button
              className={realm === "memory" ? "realm-link anchor-link active" : "realm-link anchor-link"}
              data-realm-link="memory"
              onClick={() => setRealm("memory")}
              type="button"
            >
              <span className="realm-link-mark" aria-hidden="true" />
              <span>Memory</span>
            </button>
            <button
              className={realm === "community" ? "realm-link anchor-link active" : "realm-link anchor-link"}
              data-realm-link="community"
              onClick={() => setRealm("community")}
              type="button"
            >
              <span className="realm-link-mark" aria-hidden="true" />
              <span>Community</span>
            </button>
          </div>
          <div className="realm-group orbit">
            <button
              className={
                realm === "continuity"
                  ? "realm-link orbit-link active secondary"
                  : "realm-link orbit-link secondary"
              }
              data-realm-link="continuity"
              onClick={() => setRealm("continuity")}
              type="button"
            >
              <span className="realm-link-mark" aria-hidden="true" />
              <span>Continuity</span>
            </button>
            <span className="realm-link utility">Profile</span>
          </div>
        </nav>
      </header>

      <div className="shell-engine-join" aria-hidden="true">
        <span className="engine-join-fragment engine-join-fragment-left" />
        <span className="shell-engine-knot" />
        <span className="engine-join-fragment engine-join-fragment-right" />
      </div>

      <section className="engine-strip shell-integrated" aria-label="Whole product engine state">
        <article className="engine-card state-card">
          <span className="eyebrow">{engineSnapshot.tag}</span>
          <strong>{engineSnapshot.title}</strong>
          <p>{engineSnapshot.summary}</p>
        </article>

        <article className="engine-card engine-map-card">
          <span className="eyebrow">Return Engine</span>
          <div className="engine-map">
            {engineNodes.map((node, index) => (
              <div key={node.label} className="engine-map-step">
                {index > 0 ? <span className="engine-arrow">-&gt;</span> : null}
                <span className={`engine-node ${node.state}`}>{node.label}</span>
              </div>
            ))}
          </div>
          <p>{engineSnapshot.path}</p>
        </article>

        <article className="engine-card next-card">
          <span className="eyebrow">Best Next Move</span>
          <strong>{engineSnapshot.next}</strong>
          <p>{engineSnapshot.nextCopy}</p>
        </article>
      </section>
      </div>

      <main className="main-stage">
        {realm === "workspace"
          ? renderWorkspace()
          : realm === "memory"
            ? renderMemory()
            : realm === "community"
              ? renderCommunity()
              : renderContinuity()}
      </main>
    </div>
  );
}

export default App;




