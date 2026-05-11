import {
  defaultDraft,
  freshWorkspaceOrigin,
  normalizeKeptWork,
  normalizePublicReusableAsset,
  normalizePublicWorkflowResult,
  normalizeReusableAsset,
  normalizeWorkspaceDraft,
  normalizeWorkspaceOrigin,
  storageKey,
} from "./morpbaseModel";
import { deriveContinuityEntities } from "./morpbaseReadings";
import type { PersistedState } from "./morpbaseModel";

function fallbackPersistedState(): PersistedState {
  return {
    realm: "workspace",
    draft: defaultDraft(),
    draftOrigin: freshWorkspaceOrigin(),
    keptWorks: [],
    selectedKeepId: null,
    handoffMessage: "Shape something worth keeping.",
    workspaceBridgeMessage:
      "Start with the subject and look. Memory becomes meaningful once something is worth keeping.",
    reusableAssets: [],
    selectedAssetId: null,
    publicResults: [],
    selectedPublicId: null,
    publicReusableAssets: [],
    selectedPublicAssetId: null,
    communityLens: "results",
    communityBridgeMessage:
      "Community should grow from real kept work, not from generic posting.",
    selectedContinuityKey: null,
    continuityBridgeMessage:
      "Continuity should explain recurring sameness through real kept work.",
  };
}

export function readPersistedState(): PersistedState {
  const fallback = fallbackPersistedState();

  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    const keptWorks = Array.isArray(parsed.keptWorks)
      ? parsed.keptWorks.map((work) => normalizeKeptWork(work))
      : [];
    const reusableAssets = Array.isArray(parsed.reusableAssets)
      ? parsed.reusableAssets.map((asset) => normalizeReusableAsset(asset))
      : [];
    const publicResults = Array.isArray(parsed.publicResults)
      ? parsed.publicResults.map((result) => normalizePublicWorkflowResult(result))
      : [];
    const publicReusableAssets = Array.isArray(parsed.publicReusableAssets)
      ? parsed.publicReusableAssets.map((asset) => normalizePublicReusableAsset(asset))
      : [];
    const continuityKeys = new Set(deriveContinuityEntities(keptWorks).map((entity) => entity.key));

    const selectedKeepId =
      typeof parsed.selectedKeepId === "number" &&
      keptWorks.some((work) => work.id === parsed.selectedKeepId)
        ? parsed.selectedKeepId
        : keptWorks[0]?.id ?? null;
    const selectedPublicId =
      typeof parsed.selectedPublicId === "number" &&
      publicResults.some((result) => result.id === parsed.selectedPublicId)
        ? parsed.selectedPublicId
        : publicResults[0]?.id ?? null;
    const selectedAssetId =
      typeof parsed.selectedAssetId === "number" &&
      reusableAssets.some((asset) => asset.id === parsed.selectedAssetId)
        ? parsed.selectedAssetId
        : reusableAssets[0]?.id ?? null;
    const selectedPublicAssetId =
      typeof parsed.selectedPublicAssetId === "number" &&
      publicReusableAssets.some((asset) => asset.id === parsed.selectedPublicAssetId)
        ? parsed.selectedPublicAssetId
        : publicReusableAssets[0]?.id ?? null;
    const communityLens =
      parsed.communityLens === "assets" && publicReusableAssets.length > 0 ? "assets" : "results";
    const selectedContinuityKey =
      typeof parsed.selectedContinuityKey === "string" && continuityKeys.has(parsed.selectedContinuityKey)
        ? parsed.selectedContinuityKey
        : null;

    const realm =
      parsed.realm === "continuity" && continuityKeys.size > 0
        ? "continuity"
        : parsed.realm === "community" && publicResults.length > 0
          ? "community"
          : parsed.realm === "memory" && keptWorks.length > 0
            ? "memory"
            : "workspace";

    return {
      realm,
      draft: normalizeWorkspaceDraft(parsed.draft),
      draftOrigin: normalizeWorkspaceOrigin(parsed.draftOrigin),
      keptWorks,
      selectedKeepId,
      handoffMessage: parsed.handoffMessage || fallback.handoffMessage,
      workspaceBridgeMessage: parsed.workspaceBridgeMessage || fallback.workspaceBridgeMessage,
      reusableAssets,
      selectedAssetId,
      publicResults,
      selectedPublicId,
      publicReusableAssets,
      selectedPublicAssetId,
      communityLens,
      communityBridgeMessage: parsed.communityBridgeMessage || fallback.communityBridgeMessage,
      selectedContinuityKey,
      continuityBridgeMessage: parsed.continuityBridgeMessage || fallback.continuityBridgeMessage,
    };
  } catch {
    return fallback;
  }
}

export function writePersistedState(payload: PersistedState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(payload));
}
