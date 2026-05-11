import { useEffect } from "react";
import { writePersistedState } from "./morpbasePersistence";
import type {
  ContinuityEntity,
  PersistedState,
  PublicReusableAsset,
  Realm,
} from "./morpbaseModel";

type SelectedIdGuardArgs<T extends { id: number }> = {
  items: T[];
  selectedId: number | null;
  setSelectedId: (value: number | null) => void;
};

type SelectedKeyGuardArgs<T extends { key: string }> = {
  items: T[];
  selectedKey: string | null;
  setSelectedKey: (value: string | null) => void;
};

type CommunityLensGuardArgs = {
  communityLens: "results" | "assets";
  publicReusableAssets: PublicReusableAsset[];
  setCommunityLens: (value: "results" | "assets") => void;
};

type WorkspacePhaseResetGuardArgs = {
  realm: Realm;
  focusedWorkspacePhase: number | null;
  setFocusedWorkspacePhase: (value: number | null) => void;
};

function getNextSelectedId<T extends { id: number }>(
  items: T[],
  selectedId: number | null,
): number | null | undefined {
  if (selectedId) {
    const stillExists = items.some((item) => item.id === selectedId);
    return stillExists ? undefined : (items[0]?.id ?? null);
  }

  return items.length > 0 ? items[0].id : undefined;
}

function getNextSelectedKey<T extends { key: string }>(
  items: T[],
  selectedKey: string | null,
): string | null | undefined {
  if (selectedKey) {
    const stillExists = items.some((item) => item.key === selectedKey);
    return stillExists ? undefined : (items[0]?.key ?? null);
  }

  return items.length > 0 ? items[0].key : undefined;
}

export function usePersistenceWriteEffect({
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
}: PersistedState) {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    writePersistedState({
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
  }, [
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
  ]);
}

export function useSelectedIdGuardEffect<T extends { id: number }>({
  items,
  selectedId,
  setSelectedId,
}: SelectedIdGuardArgs<T>) {
  useEffect(() => {
    const nextSelectedId = getNextSelectedId(items, selectedId);

    if (nextSelectedId !== undefined && nextSelectedId !== selectedId) {
      setSelectedId(nextSelectedId);
    }
  }, [items, selectedId, setSelectedId]);
}

export function useCommunityLensGuardEffect({
  communityLens,
  publicReusableAssets,
  setCommunityLens,
}: CommunityLensGuardArgs) {
  useEffect(() => {
    if (communityLens === "assets" && publicReusableAssets.length === 0) {
      setCommunityLens("results");
    }
  }, [communityLens, publicReusableAssets.length, setCommunityLens]);
}

export function useSelectedContinuityGuardEffect({
  items,
  selectedKey,
  setSelectedKey,
}: SelectedKeyGuardArgs<ContinuityEntity>) {
  useEffect(() => {
    const nextSelectedKey = getNextSelectedKey(items, selectedKey);

    if (nextSelectedKey !== undefined && nextSelectedKey !== selectedKey) {
      setSelectedKey(nextSelectedKey);
    }
  }, [items, selectedKey, setSelectedKey]);
}

export function useWorkspacePhaseResetGuardEffect({
  realm,
  focusedWorkspacePhase,
  setFocusedWorkspacePhase,
}: WorkspacePhaseResetGuardArgs) {
  useEffect(() => {
    if (realm !== "workspace" && focusedWorkspacePhase !== null) {
      setFocusedWorkspacePhase(null);
    }
  }, [focusedWorkspacePhase, realm, setFocusedWorkspacePhase]);
}
