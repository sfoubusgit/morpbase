import type {
  ContinuityEntity,
  KeptWork,
  PublicWorkflowResult,
  ResponseDirectionKey,
  ResponseLineageEntry,
  ResponseLineageSummary,
  ReusableAsset,
  WorkspaceDraft,
  WorkspaceOrigin,
  WorkspaceOriginMode,
} from "./morpbaseModel";

function buildDraftSummaryParts(draft: WorkspaceDraft) {
  const subjectClue = draft.subjectClue.trim();

  return [
    draft.subject ?? "Unshaped subject",
    subjectClue || null,
    draft.presence ? `${draft.presence.toLowerCase()} presence` : null,
    draft.visual ? `${draft.visual.toLowerCase()} look` : "visual direction still open",
    draft.framing ? `${draft.framing.toLowerCase()} framing` : "framing still open",
    draft.scenePressure ? `${draft.scenePressure.toLowerCase()} pressure` : null,
    draft.mood ? `${draft.mood.toLowerCase()} tone` : null,
  ].filter((part): part is string => Boolean(part));
}

export function buildPrompt(draft: WorkspaceDraft) {
  const subject = draft.subject ?? "subject";
  const subjectClue = draft.subjectClue.trim();
  const presence = draft.presence ? `${draft.presence.toLowerCase()} presence` : "recognizable presence";
  const visual = draft.visual ?? "visual direction";
  const mood = draft.mood ?? "mood";
  const framing = draft.framing ? `${draft.framing.toLowerCase()} framing` : "portrait framing";
  const scenePressure = draft.scenePressure ? `${draft.scenePressure.toLowerCase()} scene pressure` : null;
  const detail = draft.detail.trim();
  const carriedDetail = [subjectClue, detail].filter((part): part is string => Boolean(part)).join(", ");

  return [
    `${subject} portrait, ${visual.toLowerCase()} treatment`,
    presence,
    `${mood.toLowerCase()} atmosphere`,
    framing,
    scenePressure,
    carriedDetail || "focused face, strong silhouette, memorable presence",
  ]
    .filter((part): part is string => Boolean(part))
    .join(", ");
}

export function buildImageLabel(draft: WorkspaceDraft) {
  const left = draft.visual ?? "Soft";
  const rightParts = [draft.framing, draft.scenePressure ?? draft.mood].filter(Boolean);
  const right = rightParts.join(" / ") || "Glow";
  return `${left} / ${right}`;
}

export function cleanReadableText(value: string) {
  return value.split(" Ã¢â‚¬Â¢ ").join(" / ").split(" â€¢ ").join(" / ");
}

export function summarizeDraft(draft: WorkspaceDraft) {
  return buildDraftSummaryParts(draft).join(" / ");
}

export function summarizeReturned(summary: string) {
  return `${cleanReadableText(summary)} / returned from Community`;
}

export function summarizeContinued(summary: string) {
  return `${cleanReadableText(summary)} / continued from public work`;
}

export function summarizeVersioned(summary: string) {
  return `${cleanReadableText(summary)} / your own version`;
}

export type WorkspaceArrivalReading = {
  label: string;
  copy: string;
  recommendedPhase: number;
  recommendedLabel: string;
};

type CenterTraceTone = "memory" | "community" | "continuity";

export type CenterTraceReading = {
  tone: CenterTraceTone;
  arrivalLabel: string;
  arrivalTitle: string;
  arrivalCopy: string;
  previewTitle: string;
  previewCopy: string;
};

export function getWorkspaceArrivalReading(origin: WorkspaceOrigin): WorkspaceArrivalReading | null {
  if (origin.kind === "fresh") {
    return null;
  }

  if (origin.kind === "keep" && origin.mode === "continue") {
    return {
      label: "Continuing a kept line",
      copy: "This line came back from Memory to keep living, so the best next move is usually light refinement before you keep it again.",
      recommendedPhase: 3,
      recommendedLabel: "Refine And Keep",
    };
  }

  if (origin.kind === "keep" && origin.mode === "branch") {
    return {
      label: "Branching from a kept line",
      copy: "This is a new variation from a known base, so the best next move is usually to reshape the look before deciding what changes further.",
      recommendedPhase: 1,
      recommendedLabel: "Shape The Look",
    };
  }

  if (origin.kind === "asset") {
    return {
      label: "Starting from reusable material",
      copy: "This line began from shaping material in Memory, so the best next move is to let the look take hold before you tighten anything else.",
      recommendedPhase: 1,
      recommendedLabel: "Shape The Look",
    };
  }

  if (origin.kind === "continuity") {
    return {
      label: "Carrying a continuity line forward",
      copy: "This line came in through Continuity, so the best next move is to re-anchor the subject and presence before deciding how far to change it.",
      recommendedPhase: 0,
      recommendedLabel: "Define The Subject",
    };
  }

  if (origin.kind === "public-result" && origin.mode === "continue") {
    return {
      label: "Continuing a public line inward",
      copy: "This line entered from Community as a continuation, so the best next move is usually to restage it and decide how the viewer should meet it now.",
      recommendedPhase: 2,
      recommendedLabel: "Stage The Image",
    };
  }

  if (origin.kind === "public-result" && origin.mode === "branch") {
    return {
      label: "Making your own version",
      copy: "This line began as your own version of public work, so the best next move is usually to reshape the look and tone until it feels like yours.",
      recommendedPhase: 1,
      recommendedLabel: "Shape The Look",
    };
  }

  if (origin.kind === "public-result") {
    return {
      label: "Returning public work inward",
      copy: "This line came back from Community, so the best next move is to stage and tighten it until it feels worth keeping privately.",
      recommendedPhase: 2,
      recommendedLabel: "Stage The Image",
    };
  }

  if (origin.kind === "public-asset") {
    return {
      label: "Using public shaping material inward",
      copy: "This line began with public shaping material, so the best next move is to shape the look and make the line feel like yours.",
      recommendedPhase: 1,
      recommendedLabel: "Shape The Look",
    };
  }

  return null;
}

export function getCenterTraceReading(origin: WorkspaceOrigin): CenterTraceReading | null {
  if (origin.kind === "fresh") {
    return null;
  }

  if (origin.kind === "keep" && origin.mode === "continue") {
    return {
      tone: "memory",
      arrivalLabel: "Carried Arrival",
      arrivalTitle: "Memory is handing a known line back into live creation",
      arrivalCopy:
        "This return already carries a readable base, so the next move is to guide it forward instead of starting over.",
      previewTitle: "Preview is testing what returned from Memory",
      previewCopy:
        "The proof surface now judges whether the carried line still holds as it changes again.",
    };
  }

  if (origin.kind === "keep" && origin.mode === "branch") {
    return {
      tone: "memory",
      arrivalLabel: "Carried Arrival",
      arrivalTitle: "Memory is handing a known base into a new variation",
      arrivalCopy:
        "The line arrives with recognizable value attached, but this session still has to earn a different shape.",
      previewTitle: "Preview is testing the branch, not the original",
      previewCopy:
        "The proof surface should show whether the new variation now stands on its own instead of leaning on the kept source.",
    };
  }

  if (origin.kind === "asset") {
    return {
      tone: "memory",
      arrivalLabel: "Carried Arrival",
      arrivalTitle: "Memory is handing shaping material back into live work",
      arrivalCopy:
        "Usable material arrived with the line, but the center still has to turn it into something keep-worthy.",
      previewTitle: "Preview is testing whether reused material becomes a real line",
      previewCopy:
        "The proof surface now has to show whether the carried material becomes an authored result instead of a reused fragment.",
    };
  }

  if (origin.kind === "public-result" && origin.mode === "branch") {
    return {
      tone: "community",
      arrivalLabel: "Carried Arrival",
      arrivalTitle: "A public line has crossed inward to become your own version",
      arrivalCopy:
        "This line arrived carrying outward value, but the center still has to make it feel personally shaped and worth keeping.",
      previewTitle: "Preview is testing whether the public line became yours",
      previewCopy:
        "The proof surface should now show the change from public invitation to private authored line.",
    };
  }

  if (origin.kind === "public-result") {
    return {
      tone: "community",
      arrivalLabel: "Carried Arrival",
      arrivalTitle: "Community has handed public work back into active creation",
      arrivalCopy:
        "The line returned inward with readable public consequence, but the center still has to decide what form it takes now.",
      previewTitle: "Preview is testing what public work becomes inward",
      previewCopy:
        "The proof surface now has to justify the inward return as real creation instead of simple reuse.",
    };
  }

  if (origin.kind === "public-asset") {
    return {
      tone: "community",
      arrivalLabel: "Carried Arrival",
      arrivalTitle: "Public shaping material has crossed into live work",
      arrivalCopy:
        "The line arrived with outward shaping value attached, but the center still has to make the result feel authored here.",
      previewTitle: "Preview is testing whether public material becomes a real line",
      previewCopy:
        "The proof surface should show the shift from public material to active authored work.",
    };
  }

  if (origin.kind === "continuity") {
    return {
      tone: "continuity",
      arrivalLabel: "Carried Arrival",
      arrivalTitle: "Recurrence has crossed back into the center",
      arrivalCopy:
        "This line arrived carrying recognizable sameness, but the center still has to decide how that continuity lives now.",
      previewTitle: "Preview is testing whether recurrence stays readable",
      previewCopy:
        "The proof surface now has to show that the line still feels like itself while becoming active again.",
    };
  }

  return null;
}

export type ImpactTone = "memory" | "community" | "workspace" | "continuity" | "playful";

export type ImpactSignal = {
  label: string;
  tone: ImpactTone;
};

export function hasDraftStarted(draft: WorkspaceDraft) {
  return Boolean(
    draft.subject ||
      draft.subjectClue.trim() ||
      draft.presence ||
      draft.visual ||
      draft.mood ||
      draft.framing ||
      draft.scenePressure ||
      draft.detail.trim(),
  );
}

export function buildAssetTitle(work: KeptWork) {
  const subject = work.draft.subject ?? "Portrait";
  return `${subject} shaping asset`;
}

export function buildAssetReading(work: KeptWork) {
  const pieces = [
    work.draft.subjectClue.trim() || null,
    work.draft.presence ? `${work.draft.presence} presence` : null,
    work.draft.visual ? `${work.draft.visual} look` : null,
    work.draft.mood ? `${work.draft.mood} tone` : null,
    work.draft.framing ? `${work.draft.framing} framing` : null,
    work.draft.scenePressure ? `${work.draft.scenePressure} pressure` : null,
    work.draft.detail.trim() || null,
  ].filter((piece): piece is string => Boolean(piece));

  if (pieces.length > 0) {
    return pieces.join(" / ");
  }

  return cleanReadableText(work.summary);
}

export function buildPublicAssetNote(asset: ReusableAsset) {
  return `Released from Memory as reusable shaping material: ${asset.shapingReading.toLowerCase()}.`;
}

export function buildCreatorPracticeReading(resultCount: number, assetCount: number, continuityCount: number) {
  if (resultCount > 0 && assetCount > 0) {
    return continuityCount > 0
      ? "A public practice releasing both workflow lines and reusable shaping material, with continuity beginning to show through the work."
      : "A public practice releasing both workflow lines and reusable shaping material.";
  }

  if (resultCount > 0) {
    return "A public practice currently centered on workflow lines that are worth continuing inward.";
  }

  if (assetCount > 0) {
    return "A public practice currently centered on reusable shaping material for future work.";
  }

  return "A public practice will appear here once real work is released into Community.";
}

export function formatNow() {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

export function deriveContinuityEntities(keptWorks: KeptWork[]): ContinuityEntity[] {
  const groups = new Map<string, KeptWork[]>();

  keptWorks.forEach((work) => {
    const subject = work.draft.subject;
    if (!subject) {
      return;
    }

    const key = subject.toLowerCase();
    const current = groups.get(key) ?? [];
    current.push(work);
    groups.set(key, current);
  });

  return Array.from(groups.entries()).map(([key, appearances]) => {
    const lead = appearances[0];
    const subject = lead.draft.subject ?? "Character";
    const subjectClue = lead.draft.subjectClue.trim();
    const detail = lead.draft.detail.trim();
    const visual = lead.draft.visual ?? "unfixed visual direction";
    const mood = lead.draft.mood ?? "open tone";
    const scenePressure = lead.draft.scenePressure;
    const repeatedVisual =
      appearances.every((appearance) => appearance.draft.visual === lead.draft.visual) &&
      lead.draft.visual
        ? `${lead.draft.visual} look`
        : null;
    const repeatedMood =
      appearances.every((appearance) => appearance.draft.mood === lead.draft.mood) &&
      lead.draft.mood
        ? `${lead.draft.mood} tone`
        : null;
    const repeatedPressure =
      appearances.every((appearance) => appearance.draft.scenePressure === lead.draft.scenePressure) &&
      scenePressure
        ? `${scenePressure} pressure`
        : null;
    const carriedSignals = [
      `${appearances.length} appearance${appearances.length === 1 ? "" : "s"}`,
      repeatedVisual,
      repeatedMood,
      repeatedPressure,
    ].filter((signal): signal is string => Boolean(signal));

    return {
      key,
      name: `${subject} Line`,
      identityReading:
        subjectClue || detail || `${subject} stays recognizable across ${appearances.length} kept work lines.`,
      visualAnchorReading:
        repeatedVisual || repeatedMood
          ? [repeatedVisual, repeatedMood].filter(Boolean).join(" / ")
          : `${visual} / ${mood} recurrence`,
      carriedSignals,
      activationReading: `Use this line when you want ${subject.toLowerCase()} continuity without starting from zero.`,
      appearances,
    };
  });
}

export function derivePublicResultLineage(
  publicResults: PublicWorkflowResult[],
  keptWorks: KeptWork[],
) {
  const lineage = new Map<number, ResponseLineageSummary>();

  publicResults.forEach((result) => {
    const responses = keptWorks
      .filter(
        (work) =>
          work.origin.kind === "public-result" &&
          work.origin.sourceId === result.id &&
          (work.origin.mode === "import" ||
            work.origin.mode === "continue" ||
            work.origin.mode === "branch"),
      )
      .map((work) => ({
        id: work.id,
        title: work.title,
        keptAt: work.keptAt,
        mode: work.origin.mode as Extract<WorkspaceOriginMode, "import" | "continue" | "branch">,
        summary: cleanReadableText(work.summary),
      }));

    lineage.set(result.id, {
      total: responses.length,
      returns: responses.filter((response) => response.mode === "import").length,
      continuations: responses.filter((response) => response.mode === "continue").length,
      versions: responses.filter((response) => response.mode === "branch").length,
      recent: responses.slice(0, 3),
    });
  });

  return lineage;
}

export function describeResponseLineage(summary: ResponseLineageSummary) {
  if (summary.total === 0) {
    return "No inward responses yet.";
  }

  const parts = [
    summary.returns > 0 ? `${summary.returns} return${summary.returns === 1 ? "" : "s"}` : null,
    summary.continuations > 0
      ? `${summary.continuations} continuation${summary.continuations === 1 ? "" : "s"}`
      : null,
    summary.versions > 0 ? `${summary.versions} version${summary.versions === 1 ? "" : "s"}` : null,
  ].filter((part): part is string => Boolean(part));

  return parts.join(" / ");
}

export function getResponseLineageLabel(mode: ResponseLineageEntry["mode"]) {
  if (mode === "continue") {
    return "Continued line";
  }

  if (mode === "branch") {
    return "Own version";
  }

  return "Returned inward";
}

export function getResponseDirectionLabel(direction: ResponseDirectionKey) {
  if (direction === "shift-mood") {
    return "Change the mood";
  }

  if (direction === "shift-look") {
    return "Change the look";
  }

  return "Take it somewhere new";
}

export function getResponseDirectionCopy(result: PublicWorkflowResult) {
  if (result.responseDirection === "shift-mood") {
    return result.sourceDraft.mood
      ? `Keep the line, but answer it with a different mood than ${result.sourceDraft.mood.toLowerCase()}.`
      : "Keep the line, but answer it with a different mood.";
  }

  if (result.responseDirection === "shift-look") {
    return result.sourceDraft.visual
      ? `Keep the line, but answer it through a different look than ${result.sourceDraft.visual.toLowerCase()}.`
      : "Keep the line, but answer it through a different look.";
  }

  return "Keep the core recognizable, but take the line somewhere new.";
}

export function getVersionActionLabel(direction: ResponseDirectionKey) {
  if (direction === "shift-mood") {
    return "Make a mood-shift version";
  }

  if (direction === "shift-look") {
    return "Make a look-shift version";
  }

  return "Make your own version";
}

export function describePublicLineFamily(hasSource: boolean, summary: ResponseLineageSummary | null) {
  const parts = [
    hasSource ? "original line" : null,
    summary && summary.total > 0
      ? `${summary.total} connected response${summary.total === 1 ? "" : "s"}`
      : null,
  ].filter((part): part is string => Boolean(part));

  return parts.length > 0 ? parts.join(" + ") : "Public release only";
}
