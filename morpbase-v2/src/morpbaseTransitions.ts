import type {
  KeptWork,
  PublicReusableAsset,
  PublicWorkflowResult,
  ReusableAsset,
  WorkspaceDraft,
  WorkspaceOrigin,
} from "./morpbaseModel";
import {
  buildAssetReading,
  buildAssetTitle,
  buildImageLabel,
  buildPrompt,
  buildPublicAssetNote,
  cleanReadableText,
  summarizeContinued,
  summarizeDraft,
  summarizeReturned,
  summarizeVersioned,
} from "./morpbaseReadings";

type CreateKeptWorkFromDraftArgs = {
  id: number;
  keptAt: string;
  draft: WorkspaceDraft;
  draftOrigin: WorkspaceOrigin;
};

type CreateReusableAssetFromKeptWorkArgs = {
  id: number;
  createdAt: string;
  work: KeptWork;
};

type CreatePublicReusableAssetFromReusableAssetArgs = {
  id: number;
  publishedAt: string;
  asset: ReusableAsset;
};

type CreateReusableAssetFromPublicAssetArgs = {
  id: number;
  createdAt: string;
  asset: PublicReusableAsset;
};

type CreatePublicWorkflowResultFromKeptWorkArgs = {
  id: number;
  publishedAt: string;
  work: KeptWork;
};

type CreateKeptWorkFromPublicResultArgs = {
  id: number;
  keptAt: string;
  result: PublicWorkflowResult;
  mode?: "import" | "continue" | "branch";
};

export function createKeptWorkFromDraft({
  id,
  keptAt,
  draft,
  draftOrigin,
}: CreateKeptWorkFromDraftArgs): KeptWork {
  return {
    id,
    title: `${draft.subject} Study`,
    summary: summarizeDraft(draft),
    imageLabel: buildImageLabel(draft),
    prompt: buildPrompt(draft),
    keptAt,
    draft: { ...draft },
    origin: { ...draftOrigin },
  };
}

export function createReusableAssetFromKeptWork({
  id,
  createdAt,
  work,
}: CreateReusableAssetFromKeptWorkArgs): ReusableAsset {
  return {
    id,
    title: buildAssetTitle(work),
    summary: cleanReadableText(work.summary),
    shapingReading: buildAssetReading(work),
    imageLabel: work.imageLabel,
    createdAt,
    sourceKeepId: work.id,
    sourcePublicAssetId: null,
    sourceDraft: { ...work.draft },
  };
}

export function createPublicReusableAssetFromReusableAsset({
  id,
  publishedAt,
  asset,
}: CreatePublicReusableAssetFromReusableAssetArgs): PublicReusableAsset {
  return {
    id,
    title: asset.title,
    summary: asset.summary,
    shapingReading: asset.shapingReading,
    imageLabel: asset.imageLabel,
    publicNote: buildPublicAssetNote(asset),
    publishedAt,
    sourceAssetId: asset.id,
    sourceKeepId: asset.sourceKeepId,
    sourceDraft: { ...asset.sourceDraft },
  };
}

export function createReusableAssetFromPublicAsset({
  id,
  createdAt,
  asset,
}: CreateReusableAssetFromPublicAssetArgs): ReusableAsset {
  return {
    id,
    title: `${asset.title} Return`,
    summary: cleanReadableText(asset.summary),
    shapingReading: asset.shapingReading,
    imageLabel: asset.imageLabel,
    createdAt,
    sourceKeepId: asset.sourceKeepId,
    sourcePublicAssetId: asset.id,
    sourceDraft: { ...asset.sourceDraft },
  };
}

export function createPublicWorkflowResultFromKeptWork({
  id,
  publishedAt,
  work,
}: CreatePublicWorkflowResultFromKeptWorkArgs): PublicWorkflowResult {
  return {
    id,
    title: work.title,
    summary: work.summary,
    imageLabel: work.imageLabel,
    prompt: work.prompt,
    publicNote: `Released from Memory as a reusable ${work.summary.toLowerCase()} line.`,
    publishedAt,
    openToContinuation: false,
    openToVersioning: false,
    responseDirection: "somewhere-new",
    sourceKeepId: work.id,
    sourceDraft: { ...work.draft },
  };
}

export function createKeptWorkFromPublicResult({
  id,
  keptAt,
  result,
  mode = "import",
}: CreateKeptWorkFromPublicResultArgs): KeptWork {
  const nextDraft =
    mode === "branch"
      ? {
          ...result.sourceDraft,
          subjectClue: result.sourceDraft.subjectClue
            ? `${result.sourceDraft.subjectClue} with your own version`
            : "Take this line in a more recognizable direction.",
        }
      : { ...result.sourceDraft };

  return {
    id,
    title:
      mode === "continue"
        ? `${result.title} Continuation`
        : mode === "branch"
          ? `${result.title} Version`
          : `${result.title} Return`,
    summary:
      mode === "continue"
        ? summarizeContinued(result.summary)
        : mode === "branch"
          ? summarizeVersioned(result.summary)
          : summarizeReturned(result.summary),
    imageLabel: result.imageLabel,
    prompt: result.prompt,
    keptAt,
    draft: nextDraft,
    origin: {
      kind: "public-result",
      mode,
      sourceId: result.id,
      label: result.title,
    },
  };
}
