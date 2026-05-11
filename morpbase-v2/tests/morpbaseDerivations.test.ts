import { describe, expect, it } from "vitest";
import type {
  ContinuityEntity,
  KeptWork,
  PublicReusableAsset,
  PublicWorkflowResult,
  ReusableAsset,
  WorkspaceDraft,
  WorkspaceOrigin,
} from "../src/morpbaseModel";
import { deriveSupportViewDerivations } from "../src/morpbaseDerivations";
import {
  deriveContinuityEntities,
  derivePublicResultLineage,
} from "../src/morpbaseReadings";
import {
  createKeptWorkFromDraft,
  createKeptWorkFromPublicResult,
  createPublicReusableAssetFromReusableAsset,
  createPublicWorkflowResultFromKeptWork,
  createReusableAssetFromKeptWork,
  createReusableAssetFromPublicAsset,
} from "../src/morpbaseTransitions";

function buildFixture() {
  const draftOracle: WorkspaceDraft = {
    subject: "Oracle",
    subjectClue: "moonlit veil",
    presence: "Regal",
    visual: "Painterly",
    mood: "Sacred",
    framing: "Close Portrait",
    scenePressure: "Charged",
    detail: "silver trim",
  };

  const freshOrigin: WorkspaceOrigin = {
    kind: "fresh",
    mode: "new",
    sourceId: null,
    label: null,
  };

  const keep = createKeptWorkFromDraft({
    id: 101,
    keptAt: "Mar 22, 6:00 PM",
    draft: draftOracle,
    draftOrigin: freshOrigin,
  });

  const branch = createKeptWorkFromDraft({
    id: 102,
    keptAt: "Mar 22, 6:05 PM",
    draft: {
      ...draftOracle,
      subjectClue: "moonlit veil with a new variation",
      detail: "glass-thread trim",
    },
    draftOrigin: {
      kind: "keep",
      mode: "branch",
      sourceId: keep.id,
      label: keep.title,
    },
  });

  const asset = createReusableAssetFromKeptWork({
    id: 201,
    createdAt: "Mar 22, 6:10 PM",
    work: keep,
  });

  const publicResult: PublicWorkflowResult = {
    ...createPublicWorkflowResultFromKeptWork({
      id: 301,
      publishedAt: "Mar 22, 6:15 PM",
      work: keep,
    }),
    openToContinuation: true,
    openToVersioning: true,
    responseDirection: "shift-look",
  };

  const keepImport = createKeptWorkFromPublicResult({
    id: 401,
    keptAt: "Mar 22, 6:20 PM",
    result: publicResult,
    mode: "import",
  });
  const keepContinue = createKeptWorkFromPublicResult({
    id: 402,
    keptAt: "Mar 22, 6:21 PM",
    result: publicResult,
    mode: "continue",
  });
  const keepVersion = createKeptWorkFromPublicResult({
    id: 403,
    keptAt: "Mar 22, 6:22 PM",
    result: publicResult,
    mode: "branch",
  });

  const publicAsset = createPublicReusableAssetFromReusableAsset({
    id: 501,
    publishedAt: "Mar 22, 6:25 PM",
    asset,
  });
  const importedAsset = createReusableAssetFromPublicAsset({
    id: 601,
    createdAt: "Mar 22, 6:30 PM",
    asset: publicAsset,
  });

  const keptWorks: KeptWork[] = [keep, branch, keepImport, keepContinue, keepVersion];
  const reusableAssets: ReusableAsset[] = [asset, importedAsset];
  const publicResults: PublicWorkflowResult[] = [publicResult];
  const publicReusableAssets: PublicReusableAsset[] = [publicAsset];
  const continuityEntities = deriveContinuityEntities(keptWorks);
  const publicResultLineage = derivePublicResultLineage(publicResults, keptWorks);
  const selectedContinuity =
    continuityEntities.find((entity) => entity.key === "oracle") ?? null;

  return {
    draftOracle,
    keep,
    asset,
    publicResult,
    publicAsset,
    keptWorks,
    reusableAssets,
    publicResults,
    publicReusableAssets,
    continuityEntities,
    publicResultLineage,
    selectedContinuity,
  };
}

describe("morpbaseDerivations", () => {
  it("derives memory relationships, impact, and engine state from one kept line", () => {
    const fixture = buildFixture();

    const result = deriveSupportViewDerivations({
      realm: "memory",
      communityLens: "results",
      draft: fixture.draftOracle,
      keepReady: true,
      keptWorks: fixture.keptWorks,
      reusableAssets: fixture.reusableAssets,
      publicResults: fixture.publicResults,
      publicReusableAssets: fixture.publicReusableAssets,
      continuityEntities: fixture.continuityEntities,
      publicResultLineage: fixture.publicResultLineage,
      selectedWork: fixture.keep,
      selectedAsset: fixture.asset,
      selectedPublic: fixture.publicResult,
      selectedPublicAsset: fixture.publicAsset,
      selectedContinuity: fixture.selectedContinuity,
    });

    expect(result.selectedWorkPublic?.id).toBe(fixture.publicResult.id);
    expect(result.selectedWorkAsset?.id).toBe(fixture.asset.id);
    expect(result.selectedWorkContinuity?.key).toBe("oracle");
    expect(result.publishableWorks.map((work) => work.id)).not.toContain(fixture.keep.id);
    expect(result.publishableAssets.map((asset) => asset.id)).not.toContain(fixture.asset.id);
    expect(result.creatorContinuityCount).toBe(1);
    expect(result.creatorProfile.practiceReading).toContain(
      "both workflow lines and reusable shaping material",
    );
    expect(result.engineSnapshot.tag).toBe("Bridge Layer");
    expect(result.shellCompass.label).toBe("Bridge Layer");
    expect(result.engineNodes).toEqual([
      { label: "Workspace", state: "reachable" },
      { label: "Memory", state: "active" },
      { label: "Community", state: "reachable" },
      { label: "Continuity", state: "reachable" },
    ]);
    expect(result.selectedWorkImpact.map((signal) => signal.label)).toEqual(
      expect.arrayContaining([
        "Kept in Memory",
        "Distilled into reusable asset",
        "Released publicly",
        "Continued forward",
        "Carried through continuity",
      ]),
    );
  });

  it("derives public result relationships, lineage, and invitations correctly", () => {
    const fixture = buildFixture();

    const result = deriveSupportViewDerivations({
      realm: "community",
      communityLens: "results",
      draft: fixture.draftOracle,
      keepReady: true,
      keptWorks: fixture.keptWorks,
      reusableAssets: fixture.reusableAssets,
      publicResults: fixture.publicResults,
      publicReusableAssets: fixture.publicReusableAssets,
      continuityEntities: fixture.continuityEntities,
      publicResultLineage: fixture.publicResultLineage,
      selectedWork: fixture.keep,
      selectedAsset: fixture.asset,
      selectedPublic: fixture.publicResult,
      selectedPublicAsset: fixture.publicAsset,
      selectedContinuity: fixture.selectedContinuity,
    });

    expect(result.selectedPublicSource?.id).toBe(fixture.keep.id);
    expect(result.selectedPublicContinuity?.key).toBe("oracle");
    expect(result.selectedPublicLineage).toMatchObject({
      total: 3,
      returns: 1,
      continuations: 1,
      versions: 1,
    });
    expect(result.engineSnapshot.next).toBe("Make your own version inward");
    expect(result.shellCompass.label).toBe("Public Life");
    expect(result.selectedPublicImpact.map((signal) => signal.label)).toEqual(
      expect.arrayContaining([
        "Live in Community",
        "Released from kept work",
        "Open to continuation",
        "Invites versions",
        "Continued inward",
        "Versioned inward",
        "Brought back inward",
        "Readable in continuity",
      ]),
    );
  });

  it("derives public asset and continuity relationships from the same cross-realm line", () => {
    const fixture = buildFixture();
    const continuity = fixture.selectedContinuity as ContinuityEntity;

    const result = deriveSupportViewDerivations({
      realm: "community",
      communityLens: "assets",
      draft: fixture.draftOracle,
      keepReady: true,
      keptWorks: fixture.keptWorks,
      reusableAssets: fixture.reusableAssets,
      publicResults: fixture.publicResults,
      publicReusableAssets: fixture.publicReusableAssets,
      continuityEntities: fixture.continuityEntities,
      publicResultLineage: fixture.publicResultLineage,
      selectedWork: fixture.keep,
      selectedAsset: fixture.asset,
      selectedPublic: fixture.publicResult,
      selectedPublicAsset: fixture.publicAsset,
      selectedContinuity: continuity,
    });

    expect(result.selectedAssetPublic?.id).toBe(fixture.publicAsset.id);
    expect(result.selectedPublicAssetPrivate?.id).toBe(fixture.asset.id);
    expect(result.selectedPublicAssetContinuity?.key).toBe("oracle");
    expect(result.selectedContinuityPublic?.id).toBe(fixture.publicResult.id);
    expect(result.selectedContinuityPublicAsset?.id).toBe(fixture.publicAsset.id);
    expect(result.selectedPublicAssetImpact.map((signal) => signal.label)).toEqual(
      expect.arrayContaining([
        "Live in Community",
        "Released from reusable asset",
        "Imported inward",
        "Readable in continuity",
      ]),
    );
    expect(result.selectedContinuityImpact.map((signal) => signal.label)).toEqual(
      expect.arrayContaining([
        "Built from Memory",
        "Carried across works",
        "Public trace exists",
      ]),
    );
    expect(result.engineSnapshot.tag).toBe("Public Asset");
    expect(result.engineSnapshot.next).toBe("Bring reusable shaping material back into Memory");
  });

  it("keeps the workspace engine snapshot stable when the line is not ready yet", () => {
    const emptyDraft: WorkspaceDraft = {
      subject: null,
      subjectClue: "",
      presence: null,
      visual: null,
      mood: null,
      framing: null,
      scenePressure: null,
      detail: "",
    };

    const result = deriveSupportViewDerivations({
      realm: "workspace",
      communityLens: "results",
      draft: emptyDraft,
      keepReady: false,
      keptWorks: [],
      reusableAssets: [],
      publicResults: [],
      publicReusableAssets: [],
      continuityEntities: [],
      publicResultLineage: new Map(),
      selectedWork: null,
      selectedAsset: null,
      selectedPublic: null,
      selectedPublicAsset: null,
      selectedContinuity: null,
    });

    expect(result.engineSnapshot.tag).toBe("Current Line");
    expect(result.engineSnapshot.title).toBe("New workspace line");
    expect(result.engineSnapshot.next).toBe("Finish the core so Keep can emerge");
    expect(result.shellCompass).toEqual({
      label: "Creation Center",
      copy: "The live line starts here and becomes worth keeping here.",
    });
    expect(result.engineNodes).toEqual([
      { label: "Workspace", state: "active" },
      { label: "Memory", state: "idle" },
      { label: "Community", state: "idle" },
      { label: "Continuity", state: "idle" },
    ]);
  });
});
