import { describe, expect, it } from "vitest";
import type {
  PublicReusableAsset,
  PublicWorkflowResult,
  ReusableAsset,
  WorkspaceDraft,
  WorkspaceOrigin,
} from "../src/morpbaseModel";
import {
  createKeptWorkFromDraft,
  createKeptWorkFromPublicResult,
  createPublicReusableAssetFromReusableAsset,
  createPublicWorkflowResultFromKeptWork,
  createReusableAssetFromKeptWork,
  createReusableAssetFromPublicAsset,
} from "../src/morpbaseTransitions";

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

const freshOrigin: WorkspaceOrigin = {
  kind: "fresh",
  mode: "new",
  sourceId: null,
  label: null,
};

describe("morpbaseTransitions", () => {
  it("creates kept work from the current draft", () => {
    const keep = createKeptWorkFromDraft({
      id: 101,
      keptAt: "Mar 22, 6:00 PM",
      draft,
      draftOrigin: freshOrigin,
    });

    expect(keep).toMatchObject({
      id: 101,
      title: "Oracle Study",
      summary:
        "Oracle / moonlit veil / regal presence / painterly look / close portrait framing / charged pressure / sacred tone",
      imageLabel: "Painterly / Close Portrait / Charged",
      keptAt: "Mar 22, 6:00 PM",
      origin: freshOrigin,
    });
    expect(keep.prompt).toContain("Oracle portrait, painterly treatment");
    expect(keep.draft).not.toBe(draft);
  });

  it("creates a reusable asset from kept work", () => {
    const keep = createKeptWorkFromDraft({
      id: 101,
      keptAt: "Mar 22, 6:00 PM",
      draft,
      draftOrigin: freshOrigin,
    });

    const asset = createReusableAssetFromKeptWork({
      id: 202,
      createdAt: "Mar 22, 6:10 PM",
      work: keep,
    });

    expect(asset).toMatchObject({
      id: 202,
      title: "Oracle shaping asset",
      summary: keep.summary,
      imageLabel: keep.imageLabel,
      createdAt: "Mar 22, 6:10 PM",
      sourceKeepId: keep.id,
      sourcePublicAssetId: null,
    });
    expect(asset.shapingReading).toBe(
      "moonlit veil / Regal presence / Painterly look / Sacred tone / Close Portrait framing / Charged pressure / silver trim",
    );
  });

  it("creates a public reusable asset from a reusable asset", () => {
    const sourceAsset: ReusableAsset = {
      id: 202,
      title: "Oracle shaping asset",
      summary:
        "Oracle / moonlit veil / regal presence / painterly look / close portrait framing / charged pressure / sacred tone",
      shapingReading:
        "moonlit veil / Regal presence / Painterly look / Sacred tone / Close Portrait framing / Charged pressure / silver trim",
      imageLabel: "Painterly / Close Portrait / Charged",
      createdAt: "Mar 22, 6:10 PM",
      sourceKeepId: 101,
      sourcePublicAssetId: null,
      sourceDraft: { ...draft },
    };

    const publicAsset = createPublicReusableAssetFromReusableAsset({
      id: 303,
      publishedAt: "Mar 22, 6:20 PM",
      asset: sourceAsset,
    });

    expect(publicAsset).toMatchObject({
      id: 303,
      title: sourceAsset.title,
      sourceAssetId: sourceAsset.id,
      sourceKeepId: sourceAsset.sourceKeepId,
      publishedAt: "Mar 22, 6:20 PM",
    });
    expect(publicAsset.publicNote).toBe(
      "Released from Memory as reusable shaping material: moonlit veil / regal presence / painterly look / sacred tone / close portrait framing / charged pressure / silver trim.",
    );
  });

  it("creates a public workflow result from kept work", () => {
    const keep = createKeptWorkFromDraft({
      id: 101,
      keptAt: "Mar 22, 6:00 PM",
      draft,
      draftOrigin: freshOrigin,
    });

    const result = createPublicWorkflowResultFromKeptWork({
      id: 404,
      publishedAt: "Mar 22, 6:30 PM",
      work: keep,
    });

    expect(result).toMatchObject({
      id: 404,
      title: "Oracle Study",
      publishedAt: "Mar 22, 6:30 PM",
      openToContinuation: false,
      openToVersioning: false,
      responseDirection: "somewhere-new",
      sourceKeepId: 101,
    });
    expect(result.publicNote).toBe(
      "Released from Memory as a reusable oracle / moonlit veil / regal presence / painterly look / close portrait framing / charged pressure / sacred tone line.",
    );
  });

  it("creates an inward versioned kept work from a public result", () => {
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
      openToContinuation: false,
      openToVersioning: true,
      responseDirection: "somewhere-new",
      sourceKeepId: 101,
      sourceDraft: { ...draft },
    };

    const keep = createKeptWorkFromPublicResult({
      id: 505,
      keptAt: "Mar 22, 6:40 PM",
      result,
      mode: "branch",
    });

    expect(keep).toMatchObject({
      id: 505,
      title: "Oracle Study Version",
      keptAt: "Mar 22, 6:40 PM",
      imageLabel: result.imageLabel,
      origin: {
        kind: "public-result",
        mode: "branch",
        sourceId: result.id,
        label: result.title,
      },
    });
    expect(keep.summary).toContain("your own version");
    expect(keep.draft.subjectClue).toBe("moonlit veil with your own version");
  });

  it("creates an inward reusable asset from a public reusable asset", () => {
    const publicAsset: PublicReusableAsset = {
      id: 303,
      title: "Oracle shaping asset",
      summary:
        "Oracle / moonlit veil / regal presence / painterly look / close portrait framing / charged pressure / sacred tone",
      shapingReading:
        "moonlit veil / Regal presence / Painterly look / Sacred tone / Close Portrait framing / Charged pressure / silver trim",
      imageLabel: "Painterly / Close Portrait / Charged",
      publicNote: "released publicly",
      publishedAt: "Mar 22, 6:20 PM",
      sourceAssetId: 202,
      sourceKeepId: 101,
      sourceDraft: { ...draft },
    };

    const asset = createReusableAssetFromPublicAsset({
      id: 606,
      createdAt: "Mar 22, 6:50 PM",
      asset: publicAsset,
    });

    expect(asset).toMatchObject({
      id: 606,
      title: "Oracle shaping asset Return",
      sourceKeepId: 101,
      sourcePublicAssetId: 303,
      createdAt: "Mar 22, 6:50 PM",
    });
    expect(asset.summary).toBe(publicAsset.summary);
  });
});
