import { afterEach, describe, expect, it } from "vitest";
import type {
  KeptWork,
  PersistedState,
  PublicReusableAsset,
  PublicWorkflowResult,
  ReusableAsset,
} from "../src/morpbaseModel";
import { storageKey } from "../src/morpbaseModel";
import { readPersistedState, writePersistedState } from "../src/morpbasePersistence";

type MockStorage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  dump: () => Record<string, string>;
};

const originalWindowDescriptor = Object.getOwnPropertyDescriptor(globalThis, "window");

function createMockStorage(initial: Record<string, string> = {}): MockStorage {
  const store = { ...initial };

  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
    dump: () => ({ ...store }),
  };
}

function setMockWindow(storage: MockStorage) {
  Object.defineProperty(globalThis, "window", {
    value: { localStorage: storage },
    configurable: true,
    writable: true,
  });
}

function restoreWindow() {
  if (originalWindowDescriptor) {
    Object.defineProperty(globalThis, "window", originalWindowDescriptor);
    return;
  }

  Reflect.deleteProperty(globalThis, "window");
}

const draft = {
  subject: "Oracle",
  subjectClue: "moonlit veil",
  presence: "Regal",
  visual: "Painterly",
  mood: "Sacred",
  framing: "Close Portrait",
  scenePressure: "Charged",
  detail: "silver trim",
} as const;

const keptWork: KeptWork = {
  id: 101,
  title: "Oracle Study",
  summary:
    "Oracle / moonlit veil / regal presence / painterly look / close portrait framing / charged pressure / sacred tone",
  imageLabel: "Painterly / Close Portrait / Charged",
  prompt:
    "Oracle portrait, painterly treatment, regal presence, sacred atmosphere, close portrait framing, charged scene pressure, moonlit veil, silver trim",
  keptAt: "Mar 22, 6:00 PM",
  draft: { ...draft },
  origin: {
    kind: "fresh",
    mode: "new",
    sourceId: null,
    label: null,
  },
};

const reusableAsset: ReusableAsset = {
  id: 202,
  title: "Oracle shaping asset",
  summary: keptWork.summary,
  shapingReading:
    "moonlit veil / Regal presence / Painterly look / Sacred tone / Close Portrait framing / Charged pressure / silver trim",
  imageLabel: keptWork.imageLabel,
  createdAt: "Mar 22, 6:10 PM",
  sourceKeepId: keptWork.id,
  sourcePublicAssetId: null,
  sourceDraft: { ...draft },
};

const publicResult: PublicWorkflowResult = {
  id: 303,
  title: keptWork.title,
  summary: keptWork.summary,
  imageLabel: keptWork.imageLabel,
  prompt: keptWork.prompt,
  publicNote: "released publicly",
  publishedAt: "Mar 22, 6:20 PM",
  openToContinuation: true,
  openToVersioning: false,
  responseDirection: "somewhere-new",
  sourceKeepId: keptWork.id,
  sourceDraft: { ...draft },
};

const publicAsset: PublicReusableAsset = {
  id: 404,
  title: reusableAsset.title,
  summary: reusableAsset.summary,
  shapingReading: reusableAsset.shapingReading,
  imageLabel: reusableAsset.imageLabel,
  publicNote: "released publicly",
  publishedAt: "Mar 22, 6:30 PM",
  sourceAssetId: reusableAsset.id,
  sourceKeepId: keptWork.id,
  sourceDraft: { ...draft },
};

afterEach(() => {
  restoreWindow();
});

describe("morpbasePersistence", () => {
  it("returns the fallback persisted state when no window exists", () => {
    restoreWindow();

    const state = readPersistedState();

    expect(state.realm).toBe("workspace");
    expect(state.communityLens).toBe("results");
    expect(state.keptWorks).toEqual([]);
    expect(state.reusableAssets).toEqual([]);
    expect(state.publicResults).toEqual([]);
    expect(state.publicReusableAssets).toEqual([]);
    expect(state.handoffMessage).toBe("Shape something worth keeping.");
  });

  it("falls back safely when stored JSON is invalid", () => {
    const storage = createMockStorage({ [storageKey]: "{not-valid-json" });
    setMockWindow(storage);

    const state = readPersistedState();

    expect(state.realm).toBe("workspace");
    expect(state.selectedKeepId).toBeNull();
    expect(state.communityLens).toBe("results");
  });

  it("normalizes malformed persisted state and collapses invalid ids to safe defaults", () => {
    const malformedState = {
      realm: "community",
      draft: {
        subject: "Oracle",
        subjectClue: 77,
        detail: null,
      },
      draftOrigin: {
        kind: "weird-kind",
        mode: "weird-mode",
        sourceId: "bad",
        label: 55,
      },
      keptWorks: [keptWork],
      selectedKeepId: 999,
      handoffMessage: "",
      workspaceBridgeMessage: "",
      reusableAssets: [reusableAsset],
      selectedAssetId: 999,
      publicResults: [publicResult],
      selectedPublicId: 999,
      publicReusableAssets: [publicAsset],
      selectedPublicAssetId: 999,
      communityLens: "assets",
      communityBridgeMessage: "",
      selectedContinuityKey: "missing-key",
      continuityBridgeMessage: "",
    };

    const storage = createMockStorage({
      [storageKey]: JSON.stringify(malformedState),
    });
    setMockWindow(storage);

    const state = readPersistedState();

    expect(state.realm).toBe("community");
    expect(state.selectedKeepId).toBe(keptWork.id);
    expect(state.selectedAssetId).toBe(reusableAsset.id);
    expect(state.selectedPublicId).toBe(publicResult.id);
    expect(state.selectedPublicAssetId).toBe(publicAsset.id);
    expect(state.selectedContinuityKey).toBeNull();
    expect(state.communityLens).toBe("assets");
    expect(state.draft.subjectClue).toBe("");
    expect(state.draft.detail).toBe("");
    expect(state.draftOrigin).toEqual({
      kind: "fresh",
      mode: "new",
      sourceId: null,
      label: null,
    });
    expect(state.handoffMessage).toBe("Shape something worth keeping.");
    expect(state.workspaceBridgeMessage).toContain("Start with the subject and look");
  });

  it("collapses unsupported realm and lens states safely when supporting objects do not exist", () => {
    const storage = createMockStorage({
      [storageKey]: JSON.stringify({
        realm: "continuity",
        draft: {},
        draftOrigin: {},
        keptWorks: [],
        selectedKeepId: null,
        handoffMessage: "custom",
        workspaceBridgeMessage: "custom",
        reusableAssets: [],
        selectedAssetId: null,
        publicResults: [],
        selectedPublicId: null,
        publicReusableAssets: [],
        selectedPublicAssetId: null,
        communityLens: "assets",
        communityBridgeMessage: "custom",
        selectedContinuityKey: "oracle",
        continuityBridgeMessage: "custom",
      }),
    });
    setMockWindow(storage);

    const state = readPersistedState();

    expect(state.realm).toBe("workspace");
    expect(state.communityLens).toBe("results");
    expect(state.selectedContinuityKey).toBeNull();
  });

  it("writes persisted state back into local storage", () => {
    const storage = createMockStorage();
    setMockWindow(storage);

    const payload: PersistedState = {
      realm: "memory",
      draft: { ...draft },
      draftOrigin: {
        kind: "keep",
        mode: "continue",
        sourceId: keptWork.id,
        label: keptWork.title,
      },
      keptWorks: [keptWork],
      selectedKeepId: keptWork.id,
      handoffMessage: "saved",
      workspaceBridgeMessage: "bridge",
      reusableAssets: [reusableAsset],
      selectedAssetId: reusableAsset.id,
      publicResults: [publicResult],
      selectedPublicId: publicResult.id,
      publicReusableAssets: [publicAsset],
      selectedPublicAssetId: publicAsset.id,
      communityLens: "assets",
      communityBridgeMessage: "community",
      selectedContinuityKey: "oracle",
      continuityBridgeMessage: "continuity",
    };

    writePersistedState(payload);

    expect(storage.dump()[storageKey]).toBe(JSON.stringify(payload));
  });
});
