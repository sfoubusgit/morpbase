import { describe, expect, it } from "vitest";
import type {
  PublicReusableAsset,
  PublicWorkflowResult,
  ReusableAsset,
} from "../src/morpbaseModel";
import {
  defaultDraft,
  normalizePublicReusableAsset,
  normalizePublicWorkflowResult,
  normalizeReusableAsset,
  normalizeWorkspaceDraft,
  normalizeWorkspaceOrigin,
} from "../src/morpbaseModel";

describe("morpbaseModel normalization", () => {
  it("normalizes workspace drafts safely from malformed input", () => {
    expect(normalizeWorkspaceDraft(null)).toEqual(defaultDraft());

    expect(
      normalizeWorkspaceDraft({
        subject: "Oracle",
        subjectClue: 42,
        visual: "Painterly",
        detail: ["wrong"],
      }),
    ).toEqual({
      subject: "Oracle",
      subjectClue: "",
      presence: null,
      visual: "Painterly",
      mood: null,
      framing: null,
      scenePressure: null,
      detail: "",
    });
  });

  it("normalizes workspace origins back to a safe fresh origin when values are unsupported", () => {
    expect(
      normalizeWorkspaceOrigin({
        kind: "mystery-kind",
        mode: "mystery-mode",
        sourceId: "bad",
        label: 99,
      }),
    ).toEqual({
      kind: "fresh",
      mode: "new",
      sourceId: null,
      label: null,
    });
  });

  it("normalizes public workflow results to safe booleans and response direction", () => {
    const result = normalizePublicWorkflowResult({
      id: 1,
      title: "Oracle Study",
      summary: "summary",
      imageLabel: "Painterly / Close Portrait / Charged",
      prompt: "prompt",
      publicNote: "note",
      publishedAt: "Mar 22, 6:00 PM",
      openToContinuation: "yes",
      openToVersioning: "no",
      responseDirection: "unknown",
      sourceKeepId: 101,
      sourceDraft: {
        subject: "Oracle",
        subjectClue: 22,
        presence: "Regal",
        visual: "Painterly",
        mood: "Sacred",
        framing: "Close Portrait",
        scenePressure: "Charged",
        detail: null,
      },
    } as unknown as PublicWorkflowResult);

    expect(result.openToContinuation).toBe(false);
    expect(result.openToVersioning).toBe(false);
    expect(result.responseDirection).toBe("somewhere-new");
    expect(result.sourceDraft.subjectClue).toBe("");
    expect(result.sourceDraft.detail).toBe("");
  });

  it("normalizes reusable assets and public reusable assets with safe nested drafts", () => {
    const asset = normalizeReusableAsset({
      id: 2,
      title: "Oracle shaping asset",
      summary: "summary",
      shapingReading: "reading",
      imageLabel: "Painterly / Close Portrait / Charged",
      createdAt: "Mar 22, 6:10 PM",
      sourceKeepId: 101,
      sourcePublicAssetId: "bad",
      sourceDraft: {
        subject: "Oracle",
        subjectClue: "moonlit veil",
        presence: "Regal",
        visual: "Painterly",
        mood: "Sacred",
        framing: "Close Portrait",
        scenePressure: "Charged",
        detail: 5,
      },
    } as unknown as ReusableAsset);

    const publicAsset = normalizePublicReusableAsset({
      id: 3,
      title: "Oracle shaping asset",
      summary: "summary",
      shapingReading: "reading",
      imageLabel: "Painterly / Close Portrait / Charged",
      publicNote: "note",
      publishedAt: "Mar 22, 6:20 PM",
      sourceAssetId: 2,
      sourceKeepId: 101,
      sourceDraft: {
        subject: "Oracle",
        subjectClue: null,
        presence: "Regal",
        visual: "Painterly",
        mood: "Sacred",
        framing: "Close Portrait",
        scenePressure: "Charged",
        detail: "silver trim",
      },
    } as unknown as PublicReusableAsset);

    expect(asset.sourcePublicAssetId).toBeNull();
    expect(asset.sourceDraft.detail).toBe("");
    expect(publicAsset.sourceDraft.subjectClue).toBe("");
    expect(publicAsset.sourceDraft.detail).toBe("silver trim");
  });
});
