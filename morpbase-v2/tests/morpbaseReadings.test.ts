import { describe, expect, it } from "vitest";
import type {
  KeptWork,
  PublicWorkflowResult,
  WorkspaceDraft,
  WorkspaceOrigin,
} from "../src/morpbaseModel";
import {
  buildImageLabel,
  buildPrompt,
  describeResponseLineage,
  derivePublicResultLineage,
  getCenterTraceReading,
  getResponseDirectionLabel,
  getVersionActionLabel,
  getWorkspaceArrivalReading,
  summarizeDraft,
} from "../src/morpbaseReadings";
import { createKeptWorkFromPublicResult } from "../src/morpbaseTransitions";

const draft: WorkspaceDraft = {
  subject: "Oracle",
  subjectClue: "moonlit veil",
  presence: "Regal",
  visual: "Painterly",
  mood: "Sacred",
  framing: "Close Portrait",
  scenePressure: "Charged",
  detail: "silver trim",
};

describe("morpbaseReadings", () => {
  it("builds a full prompt from a shaped draft", () => {
    expect(buildPrompt(draft)).toBe(
      "Oracle portrait, painterly treatment, regal presence, sacred atmosphere, close portrait framing, charged scene pressure, moonlit veil, silver trim",
    );
  });

  it("builds the preview image label from look and staging", () => {
    expect(buildImageLabel(draft)).toBe("Painterly / Close Portrait / Charged");
  });

  it("summarizes the draft in the expected MorpBase order", () => {
    expect(summarizeDraft(draft)).toBe(
      "Oracle / moonlit veil / regal presence / painterly look / close portrait framing / charged pressure / sacred tone",
    );
  });

  it("chooses the right arrival reading for a branched public line", () => {
    const origin: WorkspaceOrigin = {
      kind: "public-result",
      mode: "branch",
      sourceId: 404,
      label: "Oracle Study",
    };

    expect(getWorkspaceArrivalReading(origin)).toEqual({
      label: "Making your own version",
      copy: "This line began as your own version of public work, so the best next move is usually to reshape the look and tone until it feels like yours.",
      recommendedPhase: 1,
      recommendedLabel: "Shape The Look",
    });
  });

  it("chooses the right center trace for continuity activation", () => {
    const origin: WorkspaceOrigin = {
      kind: "continuity",
      mode: "activate",
      sourceId: null,
      label: "Oracle",
    };

    expect(getCenterTraceReading(origin)).toEqual({
      tone: "continuity",
      arrivalLabel: "Carried Arrival",
      arrivalTitle: "Recurrence has crossed back into the center",
      arrivalCopy:
        "This line arrived carrying recognizable sameness, but the center still has to decide how that continuity lives now.",
      previewTitle: "Preview is testing whether recurrence stays readable",
      previewCopy:
        "The proof surface now has to show that the line still feels like itself while becoming active again.",
    });
  });

  it("derives response lineage from inward returns, continuations, and versions", () => {
    const result: PublicWorkflowResult = {
      id: 404,
      title: "Oracle Study",
      summary:
        "Oracle / moonlit veil / regal presence / painterly look / close portrait framing / charged pressure / sacred tone",
      imageLabel: "Painterly / Close Portrait / Charged",
      prompt:
        "Oracle portrait, painterly treatment, regal presence, sacred atmosphere, close portrait framing, charged scene pressure, moonlit veil, silver trim",
      publicNote: "released publicly",
      publishedAt: "Mar 22, 6:30 PM",
      openToContinuation: true,
      openToVersioning: true,
      responseDirection: "shift-look",
      sourceKeepId: 101,
      sourceDraft: { ...draft },
    };

    const keptWorks: KeptWork[] = [
      createKeptWorkFromPublicResult({
        id: 1,
        keptAt: "Mar 22, 6:40 PM",
        result,
        mode: "import",
      }),
      createKeptWorkFromPublicResult({
        id: 2,
        keptAt: "Mar 22, 6:41 PM",
        result,
        mode: "continue",
      }),
      createKeptWorkFromPublicResult({
        id: 3,
        keptAt: "Mar 22, 6:42 PM",
        result,
        mode: "branch",
      }),
    ];

    const lineage = derivePublicResultLineage([result], keptWorks).get(result.id);

    expect(lineage).toMatchObject({
      total: 3,
      returns: 1,
      continuations: 1,
      versions: 1,
    });
    expect(describeResponseLineage(lineage!)).toBe("1 return / 1 continuation / 1 version");
  });

  it("keeps response-direction language human and specific", () => {
    expect(getResponseDirectionLabel("shift-look")).toBe("Change the look");
    expect(getVersionActionLabel("shift-look")).toBe("Make a look-shift version");
  });
});
