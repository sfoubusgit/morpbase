import {
  buildCreatorPracticeReading,
  cleanReadableText,
  getResponseDirectionLabel,
  hasDraftStarted,
  summarizeDraft,
} from "./morpbaseReadings";
import type {
  ContinuityEntity,
  CreatorProfile,
  KeptWork,
  PublicReusableAsset,
  PublicWorkflowResult,
  Realm,
  ReusableAsset,
  ResponseLineageSummary,
  WorkspaceDraft,
} from "./morpbaseModel";
import type { ImpactSignal } from "./morpbaseReadings";

type EngineNodeState = "active" | "reachable" | "idle";

export type EngineNode = {
  label: "Workspace" | "Memory" | "Community" | "Continuity";
  state: EngineNodeState;
};

export type EngineSnapshot = {
  tag: string;
  title: string;
  summary: string;
  path: string;
  next: string;
  nextCopy: string;
};

export type ShellCompass = {
  label: string;
  copy: string;
};

type DerivationArgs = {
  realm: Realm;
  communityLens: "results" | "assets";
  draft: WorkspaceDraft;
  keepReady: boolean;
  keptWorks: KeptWork[];
  reusableAssets: ReusableAsset[];
  publicResults: PublicWorkflowResult[];
  publicReusableAssets: PublicReusableAsset[];
  continuityEntities: ContinuityEntity[];
  publicResultLineage: Map<number, ResponseLineageSummary>;
  selectedWork: KeptWork | null;
  selectedAsset: ReusableAsset | null;
  selectedPublic: PublicWorkflowResult | null;
  selectedPublicAsset: PublicReusableAsset | null;
  selectedContinuity: ContinuityEntity | null;
};

export type SupportViewDerivations = {
  selectedWorkPublic: PublicWorkflowResult | null;
  selectedWorkAsset: ReusableAsset | null;
  selectedWorkContinuity: ContinuityEntity | null;
  selectedPublicSource: KeptWork | null;
  selectedAssetSource: KeptWork | null;
  selectedAssetPublic: PublicReusableAsset | null;
  selectedPublicContinuity: ContinuityEntity | null;
  selectedPublicAssetPrivate: ReusableAsset | null;
  selectedPublicAssetContinuity: ContinuityEntity | null;
  selectedContinuityPublic: PublicWorkflowResult | null;
  selectedContinuityPublicAsset: PublicReusableAsset | null;
  selectedWorkImpact: ImpactSignal[];
  selectedAssetImpact: ImpactSignal[];
  selectedPublicImpact: ImpactSignal[];
  selectedPublicLineage: ResponseLineageSummary | null;
  selectedPublicAssetImpact: ImpactSignal[];
  selectedContinuityImpact: ImpactSignal[];
  publishableWorks: KeptWork[];
  publishableAssets: ReusableAsset[];
  creatorContinuityCount: number;
  creatorProfile: CreatorProfile;
  engineNodes: readonly EngineNode[];
  engineSnapshot: EngineSnapshot;
  shellCompass: ShellCompass;
};

export function deriveSupportViewDerivations(args: DerivationArgs): SupportViewDerivations {
  const {
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
  } = args;

  const selectedWorkPublic = selectedWork
    ? publicResults.find((result) => result.sourceKeepId === selectedWork.id) ?? null
    : null;
  const selectedWorkAsset = selectedWork
    ? reusableAssets.find((asset) => asset.sourceKeepId === selectedWork.id) ?? null
    : null;
  const selectedWorkSubject = selectedWork?.draft.subject;
  const selectedWorkContinuity = selectedWorkSubject
    ? continuityEntities.find((entity) => entity.key === selectedWorkSubject.toLowerCase()) ?? null
    : null;

  const selectedPublicSource =
    selectedPublic?.sourceKeepId ? keptWorks.find((work) => work.id === selectedPublic.sourceKeepId) ?? null : null;
  const selectedAssetSource =
    selectedAsset?.sourceKeepId ? keptWorks.find((work) => work.id === selectedAsset.sourceKeepId) ?? null : null;
  const selectedAssetPublic = selectedAsset
    ? publicReusableAssets.find((publicAsset) => publicAsset.sourceAssetId === selectedAsset.id) ?? null
    : null;

  const selectedPublicContinuity = selectedPublic?.sourceDraft.subject
    ? continuityEntities.find((entity) => entity.key === selectedPublic.sourceDraft.subject?.toLowerCase()) ?? null
    : null;
  const selectedPublicAssetPrivate =
    selectedPublicAsset?.sourceAssetId
      ? reusableAssets.find((asset) => asset.id === selectedPublicAsset.sourceAssetId) ?? null
      : null;
  const selectedPublicAssetContinuity = selectedPublicAsset?.sourceDraft.subject
    ? continuityEntities.find((entity) => entity.key === selectedPublicAsset.sourceDraft.subject?.toLowerCase()) ?? null
    : null;

  const selectedContinuityPublic = selectedContinuity
    ? publicResults.find((result) => result.sourceDraft.subject?.toLowerCase() === selectedContinuity.key) ?? null
    : null;
  const selectedContinuityPublicAsset = selectedContinuity
    ? publicReusableAssets.find((asset) => asset.sourceDraft.subject?.toLowerCase() === selectedContinuity.key) ?? null
    : null;

  const selectedWorkBranches = selectedWork
    ? keptWorks.filter((work) => work.origin.kind === "keep" && work.origin.sourceId === selectedWork.id)
    : [];

  const selectedWorkImpact: ImpactSignal[] = selectedWork
    ? [
        { label: "Kept in Memory", tone: "memory" },
        ...(selectedWork.origin.kind === "public-result"
          ? [
              {
                label:
                  selectedWork.origin.mode === "continue"
                    ? "Continued from public line"
                    : selectedWork.origin.mode === "branch"
                      ? "Made as your own version"
                      : "Returned from Community",
                tone:
                  selectedWork.origin.mode === "continue"
                    ? ("workspace" as const)
                    : selectedWork.origin.mode === "branch"
                      ? ("playful" as const)
                      : ("community" as const),
              },
            ]
          : []),
        ...(selectedWork.origin.kind === "keep"
          ? [
              {
                label:
                  selectedWork.origin.mode === "branch"
                    ? "Branched from kept work"
                    : "Continued from kept work",
                tone: "workspace" as const,
              },
            ]
          : []),
        ...(selectedWork.origin.kind === "asset"
          ? [{ label: "Started from reusable asset", tone: "workspace" as const }]
          : []),
        ...(selectedWork.origin.kind === "continuity"
          ? [{ label: "Activated from Continuity", tone: "continuity" as const }]
          : []),
        ...(selectedWorkAsset ? [{ label: "Distilled into reusable asset", tone: "memory" as const }] : []),
        ...(selectedWorkPublic ? [{ label: "Released publicly", tone: "community" as const }] : []),
        ...(selectedWorkBranches.length > 0 ? [{ label: "Continued forward", tone: "workspace" as const }] : []),
        ...(selectedWorkContinuity && selectedWorkContinuity.appearances.length > 1
          ? [{ label: "Carried through continuity", tone: "continuity" as const }]
          : []),
      ]
    : [];

  const selectedAssetUseExists = selectedAsset
    ? keptWorks.some((work) => work.origin.kind === "asset" && work.origin.sourceId === selectedAsset.id)
    : false;
  const selectedAssetImpact: ImpactSignal[] = selectedAsset
    ? [
        { label: "Lives in Memory", tone: "memory" },
        ...(selectedAsset.sourceKeepId ? [{ label: "Distilled from kept work", tone: "memory" as const }] : []),
        ...(selectedAsset.sourcePublicAssetId
          ? [{ label: "Imported from Community", tone: "community" as const }]
          : []),
        ...(selectedAssetUseExists ? [{ label: "Used in kept work", tone: "workspace" as const }] : []),
        ...(selectedAssetPublic ? [{ label: "Released publicly", tone: "community" as const }] : []),
      ]
    : [];

  const selectedPublicReturnedInward = selectedPublic
    ? keptWorks.some((work) => work.origin.kind === "public-result" && work.origin.sourceId === selectedPublic.id)
    : false;
  const selectedPublicContinuedInward = selectedPublic
    ? keptWorks.some(
        (work) =>
          work.origin.kind === "public-result" &&
          work.origin.sourceId === selectedPublic.id &&
          work.origin.mode === "continue",
      )
    : false;
  const selectedPublicVersionedInward = selectedPublic
    ? keptWorks.some(
        (work) =>
          work.origin.kind === "public-result" &&
          work.origin.sourceId === selectedPublic.id &&
          work.origin.mode === "branch",
      )
    : false;
  const selectedPublicImpact: ImpactSignal[] = selectedPublic
    ? [
        { label: "Live in Community", tone: "community" },
        ...(selectedPublic.sourceKeepId ? [{ label: "Released from kept work", tone: "memory" as const }] : []),
        ...(selectedPublic.openToContinuation ? [{ label: "Open to continuation", tone: "workspace" as const }] : []),
        ...(selectedPublic.openToVersioning ? [{ label: "Invites versions", tone: "playful" as const }] : []),
        ...(selectedPublicContinuedInward ? [{ label: "Continued inward", tone: "workspace" as const }] : []),
        ...(selectedPublicVersionedInward ? [{ label: "Versioned inward", tone: "playful" as const }] : []),
        ...(selectedPublicReturnedInward ? [{ label: "Brought back inward", tone: "memory" as const }] : []),
        ...(selectedPublicContinuity ? [{ label: "Readable in continuity", tone: "continuity" as const }] : []),
      ]
    : [];

  const selectedPublicAssetImported = selectedPublicAsset
    ? reusableAssets.some((asset) => asset.sourcePublicAssetId === selectedPublicAsset.id)
    : false;
  const selectedPublicLineage = selectedPublic ? publicResultLineage.get(selectedPublic.id) ?? null : null;
  const selectedPublicAssetImpact: ImpactSignal[] = selectedPublicAsset
    ? [
        { label: "Live in Community", tone: "community" },
        ...(selectedPublicAsset.sourceAssetId
          ? [{ label: "Released from reusable asset", tone: "memory" as const }]
          : []),
        ...(selectedPublicAssetImported ? [{ label: "Imported inward", tone: "memory" as const }] : []),
        ...(selectedPublicAssetContinuity
          ? [{ label: "Readable in continuity", tone: "continuity" as const }]
          : []),
      ]
    : [];

  const selectedContinuityActivatedForward = selectedContinuity
    ? keptWorks.some((work) => work.origin.kind === "continuity" && work.origin.label === selectedContinuity.name)
    : false;
  const selectedContinuityImpact: ImpactSignal[] = selectedContinuity
    ? [
        { label: "Built from Memory", tone: "memory" },
        ...(selectedContinuity.appearances.length > 1
          ? [{ label: "Carried across works", tone: "continuity" as const }]
          : []),
        ...(selectedContinuityPublic || selectedContinuityPublicAsset
          ? [{ label: "Public trace exists", tone: "community" as const }]
          : []),
        ...(selectedContinuityActivatedForward
          ? [{ label: "Activated into new work", tone: "workspace" as const }]
          : []),
      ]
    : [];

  const publishableWorks = keptWorks.filter(
    (work) => !publicResults.some((result) => result.sourceKeepId === work.id),
  );
  const publishableAssets = reusableAssets.filter(
    (asset) => !publicReusableAssets.some((publicAsset) => publicAsset.sourceAssetId === asset.id),
  );
  const creatorContinuityCount = continuityEntities.filter(
    (entity) =>
      publicResults.some((result) => result.sourceDraft.subject?.toLowerCase() === entity.key) ||
      publicReusableAssets.some((asset) => asset.sourceDraft.subject?.toLowerCase() === entity.key),
  ).length;
  const creatorProfile: CreatorProfile = {
    id: "local-practice",
    name: "Your Practice",
    initials: "YP",
    practiceReading: buildCreatorPracticeReading(
      publicResults.length,
      publicReusableAssets.length,
      creatorContinuityCount,
    ),
    publicReading:
      publicResults.length > 0 || publicReusableAssets.length > 0
        ? "The public side now reads as one creative practice rather than a set of anonymous objects."
        : "Release real work from Memory to let a public practice become visible here.",
  };

  const engineNodes = [
    {
      label: "Workspace",
      state:
        realm === "workspace"
          ? "active"
          : hasDraftStarted(draft) || keptWorks.length > 0
            ? "reachable"
            : "idle",
    },
    {
      label: "Memory",
      state: realm === "memory" ? "active" : keptWorks.length > 0 ? "reachable" : "idle",
    },
    {
      label: "Community",
      state: realm === "community" ? "active" : publicResults.length > 0 ? "reachable" : "idle",
    },
    {
      label: "Continuity",
      state: realm === "continuity" ? "active" : continuityEntities.length > 0 ? "reachable" : "idle",
    },
  ] as const;

  const engineSnapshot: EngineSnapshot = (() => {
    if (realm === "workspace") {
      return {
        tag: "Current Line",
        title: draft.subject ? `${draft.subject} line in progress` : "New workspace line",
        summary: hasDraftStarted(draft)
          ? summarizeDraft(draft)
          : "Shape the subject, look, and framing, then let the line become worth keeping.",
        path: "Creation starts in Workspace, then gains a second home in Memory.",
        next: keepReady ? "Keep this line to Memory" : "Finish the core so Keep can emerge",
        nextCopy: keepReady
          ? "This line now has enough shape to become a living return point."
          : "The subject, visual direction, and framing are the threshold that makes the loop real.",
      };
    }

    if (realm === "memory") {
      return {
        tag: reusableAssets.length > 0 ? "Bridge Layer" : "Active Return Point",
        title: selectedWork ? selectedWork.title : "Memory is waiting for its first real keep",
        summary: selectedWork
          ? cleanReadableText(selectedWork.summary)
          : "Memory becomes real once kept work can lead back into creation.",
        path:
          reusableAssets.length > 0
            ? "Memory now holds both kept work and reusable shaping material."
            : "Memory is the bridge: continue, branch, release, or read into continuity.",
        next:
          selectedAsset && !selectedWork
            ? "Use reusable shaping material in Workspace"
            : selectedWork
              ? "Send value back into creation"
              : "Keep something worth returning to",
        nextCopy:
          reusableAssets.length > 0
            ? "Reusable assets now make Memory more than a return point. They make it a reuse layer."
            : selectedWork
              ? "This is the current bridge object for the rest of the product."
              : "The first meaningful keep makes the rest of MorpBase start to connect.",
      };
    }

    if (realm === "community") {
      return {
        tag: communityLens === "assets" ? "Public Asset" : "Public Line",
        title:
          communityLens === "assets"
            ? selectedPublicAsset
              ? selectedPublicAsset.title
              : "No public reusable asset is active yet"
            : selectedPublic
              ? selectedPublic.title
              : "No public result is active yet",
        summary:
          communityLens === "assets"
            ? selectedPublicAsset
              ? selectedPublicAsset.publicNote
              : "Public reusable assets should still guide future work, not drift into library clutter."
            : selectedPublic
              ? selectedPublic.publicNote
              : "Community should grow from real kept work, not from detached posting.",
        path:
          communityLens === "assets"
            ? "Community now circulates both results and reusable shaping material."
            : "Community gives kept work public life, then sends value back inward.",
        next:
          communityLens === "assets"
            ? selectedPublicAsset
              ? "Bring reusable shaping material back into Memory"
              : "Release a reusable asset from Memory"
            : selectedPublic
              ? selectedPublic.openToVersioning
                ? "Make your own version inward"
                : selectedPublic.openToContinuation
                  ? "Continue this line inward"
                  : "Bring value back into Memory"
              : "Release a real keep from Memory",
        nextCopy:
          communityLens === "assets"
            ? selectedPublicAsset
              ? "A public reusable asset should still strengthen future private work."
              : "Public reusable assets matter only if they remain shaping material."
            : selectedPublic
              ? selectedPublic.openToVersioning
                ? `${getResponseDirectionLabel(selectedPublic.responseDirection)} only matters if it still turns into another real line of work.`
                : selectedPublic.openToContinuation
                  ? "Shared continuation should still stay anchored in real inward work."
                  : "A public result should still feel reusable and return-worthy."
              : "Public circulation matters only if it begins with real work.",
      };
    }

    return {
      tag: "Recurring Line",
      title: selectedContinuity ? selectedContinuity.name : "No recurring line is active yet",
      summary: selectedContinuity
        ? selectedContinuity.identityReading
        : "Continuity becomes real when recurring sameness can be read through kept work.",
      path: "Continuity reads recurrence through Memory, then reactivates it in Workspace.",
      next: selectedContinuity ? "Activate this line back into Workspace" : "Build repetition through kept work",
      nextCopy: selectedContinuity
        ? "The payoff of continuity is not explanation. It is live reuse."
        : "One kept work is not enough. Recurrence needs a visible line across multiple works.",
    };
  })();

  const shellCompass: ShellCompass = (() => {
    if (realm === "workspace") {
      return {
        label: "Creation Center",
        copy: "The live line starts here and becomes worth keeping here.",
      };
    }

    if (realm === "memory") {
      return {
        label: "Bridge Layer",
        copy: "This is where work stays alive long enough to return, branch, and matter again.",
      };
    }

    if (realm === "community") {
      return {
        label: "Public Life",
        copy: "Released work should still feel useful, answerable, and capable of coming back inward.",
      };
    }

    return {
      label: "Recurring Line",
      copy: "Continuity stays lighter, but it proves that recurring sameness can still reactivate creation.",
    };
  })();

  return {
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
  };
}
