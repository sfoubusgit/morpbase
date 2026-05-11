export type Realm = "workspace" | "memory" | "community" | "continuity";

export type SubjectOption =
  | "Oracle"
  | "Archivist"
  | "Witness"
  | "Pilgrim"
  | "Wanderer"
  | "Drifter"
  | "Sovereign"
  | "Guardian"
  | "Heretic";

export type PresenceOption = "Regal" | "Weathered" | "Unshakable";
export type VisualOption = "Painterly" | "Illustrative" | "Luminous" | "Nocturne" | "Cinematic" | "Documentary";
export type MoodOption = "Quiet" | "Sacred" | "Electric";
export type FramingOption = "Close Portrait" | "Waist-Up Focus" | "Wide Presence";
export type ScenePressureOption = "Still" | "Charged" | "Ceremonial" | "Confronting";

export type WorkspaceDraft = {
  subject: SubjectOption | null;
  subjectClue: string;
  presence: PresenceOption | null;
  visual: VisualOption | null;
  mood: MoodOption | null;
  framing: FramingOption | null;
  scenePressure: ScenePressureOption | null;
  detail: string;
};

export type WorkspaceOriginKind =
  | "fresh"
  | "keep"
  | "asset"
  | "public-result"
  | "public-asset"
  | "continuity";

export type WorkspaceOriginMode = "new" | "continue" | "branch" | "use" | "import" | "activate";
export type ResponseDirectionKey = "somewhere-new" | "shift-mood" | "shift-look";

export type WorkspaceOrigin = {
  kind: WorkspaceOriginKind;
  mode: WorkspaceOriginMode;
  sourceId: number | null;
  label: string | null;
};

export type KeptWork = {
  id: number;
  title: string;
  summary: string;
  imageLabel: string;
  prompt: string;
  keptAt: string;
  draft: WorkspaceDraft;
  origin: WorkspaceOrigin;
};

export type PublicWorkflowResult = {
  id: number;
  title: string;
  summary: string;
  imageLabel: string;
  prompt: string;
  publicNote: string;
  publishedAt: string;
  openToContinuation: boolean;
  openToVersioning: boolean;
  responseDirection: ResponseDirectionKey;
  sourceKeepId: number | null;
  sourceDraft: WorkspaceDraft;
};

export type PublicReusableAsset = {
  id: number;
  title: string;
  summary: string;
  shapingReading: string;
  imageLabel: string;
  publicNote: string;
  publishedAt: string;
  sourceAssetId: number | null;
  sourceKeepId: number | null;
  sourceDraft: WorkspaceDraft;
};

export type ReusableAsset = {
  id: number;
  title: string;
  summary: string;
  shapingReading: string;
  imageLabel: string;
  createdAt: string;
  sourceKeepId: number | null;
  sourcePublicAssetId: number | null;
  sourceDraft: WorkspaceDraft;
};

export type ContinuityEntity = {
  key: string;
  name: string;
  identityReading: string;
  visualAnchorReading: string;
  carriedSignals: string[];
  activationReading: string;
  appearances: KeptWork[];
};

export type CreatorProfile = {
  id: string;
  name: string;
  initials: string;
  practiceReading: string;
  publicReading: string;
};

export type ResponseLineageEntry = {
  id: number;
  title: string;
  keptAt: string;
  mode: Extract<WorkspaceOriginMode, "import" | "continue" | "branch">;
  summary: string;
};

export type ResponseLineageSummary = {
  total: number;
  returns: number;
  continuations: number;
  versions: number;
  recent: ResponseLineageEntry[];
};

export type PersistedState = {
  realm: Realm;
  draft: WorkspaceDraft;
  draftOrigin: WorkspaceOrigin;
  keptWorks: KeptWork[];
  selectedKeepId: number | null;
  handoffMessage: string;
  workspaceBridgeMessage: string;
  reusableAssets: ReusableAsset[];
  selectedAssetId: number | null;
  publicResults: PublicWorkflowResult[];
  selectedPublicId: number | null;
  publicReusableAssets: PublicReusableAsset[];
  selectedPublicAssetId: number | null;
  communityLens: "results" | "assets";
  communityBridgeMessage: string;
  selectedContinuityKey: string | null;
  continuityBridgeMessage: string;
};

type OptionGroup<T extends string> = {
  label: string;
  options: T[];
};

export const subjectOptionGroups: OptionGroup<SubjectOption>[] = [
  {
    label: "Visionary Lines",
    options: ["Oracle", "Archivist", "Witness"],
  },
  {
    label: "Journey Lines",
    options: ["Pilgrim", "Wanderer", "Drifter"],
  },
  {
    label: "Force Lines",
    options: ["Sovereign", "Guardian", "Heretic"],
  },
];

export const subjectClueOptions: Record<SubjectOption, string[]> = {
  Oracle: ["veil of thin coins", "ink-dark fingertips", "star-burned gaze"],
  Archivist: ["dust-soft gloves", "ribboned record satchel", "index-marked sleeves"],
  Witness: ["candle-scorched collar", "watchful scar", "snow-still eyes"],
  Pilgrim: ["salt-worn cloak", "threaded charm cord", "road-bent staff"],
  Wanderer: ["wind-cut braid", "sun-faded coat", "map-creased hands"],
  Drifter: ["smoke-stained scarf", "broken compass charm", "half-buttoned coat"],
  Sovereign: ["cracked silver crown", "measured stare", "ceremonial clasp"],
  Guardian: ["weathered shoulder plate", "scarred gauntlet", "protective stance"],
  Heretic: ["burned sigil sash", "defiant half-smile", "broken halo wire"],
};

export const visualOptionGroups: OptionGroup<VisualOption>[] = [
  {
    label: "Crafted Lines",
    options: ["Painterly", "Illustrative"],
  },
  {
    label: "Light Lines",
    options: ["Luminous", "Nocturne"],
  },
  {
    label: "Screen Lines",
    options: ["Cinematic", "Documentary"],
  },
];

export const presenceOptions: PresenceOption[] = ["Regal", "Weathered", "Unshakable"];
export const moodOptions: MoodOption[] = ["Quiet", "Sacred", "Electric"];
export const framingOptions: FramingOption[] = ["Close Portrait", "Waist-Up Focus", "Wide Presence"];
export const scenePressureOptions: ScenePressureOption[] = ["Still", "Charged", "Ceremonial", "Confronting"];
export const storageKey = "morpbase-v2-slice-3";

export const defaultDraft = (): WorkspaceDraft => ({
  subject: null,
  subjectClue: "",
  presence: null,
  visual: null,
  mood: null,
  framing: null,
  scenePressure: null,
  detail: "",
});

export function normalizeWorkspaceDraft(value: unknown): WorkspaceDraft {
  if (!value || typeof value !== "object") {
    return defaultDraft();
  }

  const raw = value as Partial<WorkspaceDraft>;

  return {
    ...defaultDraft(),
    ...raw,
    subjectClue: typeof raw.subjectClue === "string" ? raw.subjectClue : "",
    detail: typeof raw.detail === "string" ? raw.detail : "",
  };
}

export function freshWorkspaceOrigin(): WorkspaceOrigin {
  return {
    kind: "fresh",
    mode: "new",
    sourceId: null,
    label: null,
  };
}

export function normalizeWorkspaceOrigin(value: unknown): WorkspaceOrigin {
  if (!value || typeof value !== "object") {
    return freshWorkspaceOrigin();
  }

  const raw = value as Partial<WorkspaceOrigin>;
  const validKinds: WorkspaceOriginKind[] = [
    "fresh",
    "keep",
    "asset",
    "public-result",
    "public-asset",
    "continuity",
  ];
  const validModes: WorkspaceOriginMode[] = [
    "new",
    "continue",
    "branch",
    "use",
    "import",
    "activate",
  ];

  return {
    kind: validKinds.includes(raw.kind as WorkspaceOriginKind) ? (raw.kind as WorkspaceOriginKind) : "fresh",
    mode: validModes.includes(raw.mode as WorkspaceOriginMode) ? (raw.mode as WorkspaceOriginMode) : "new",
    sourceId: typeof raw.sourceId === "number" ? raw.sourceId : null,
    label: typeof raw.label === "string" ? raw.label : null,
  };
}

export function normalizeKeptWork(work: KeptWork): KeptWork {
  return {
    ...work,
    draft: normalizeWorkspaceDraft((work as Partial<KeptWork>).draft),
    origin: normalizeWorkspaceOrigin((work as Partial<KeptWork>).origin),
  };
}

export function normalizeReusableAsset(asset: ReusableAsset): ReusableAsset {
  return {
    ...asset,
    sourceDraft: normalizeWorkspaceDraft((asset as Partial<ReusableAsset>).sourceDraft),
    sourcePublicAssetId:
      typeof (asset as Partial<ReusableAsset>).sourcePublicAssetId === "number"
        ? (asset as Partial<ReusableAsset>).sourcePublicAssetId ?? null
        : null,
  };
}

export function normalizePublicWorkflowResult(result: PublicWorkflowResult): PublicWorkflowResult {
  const validDirections: ResponseDirectionKey[] = ["somewhere-new", "shift-mood", "shift-look"];

  return {
    ...result,
    sourceDraft: normalizeWorkspaceDraft((result as Partial<PublicWorkflowResult>).sourceDraft),
    openToContinuation:
      typeof (result as Partial<PublicWorkflowResult>).openToContinuation === "boolean"
        ? (result as Partial<PublicWorkflowResult>).openToContinuation ?? false
        : false,
    openToVersioning:
      typeof (result as Partial<PublicWorkflowResult>).openToVersioning === "boolean"
        ? (result as Partial<PublicWorkflowResult>).openToVersioning ?? false
        : false,
    responseDirection: validDirections.includes(
      (result as Partial<PublicWorkflowResult>).responseDirection as ResponseDirectionKey,
    )
      ? ((result as Partial<PublicWorkflowResult>).responseDirection as ResponseDirectionKey)
      : "somewhere-new",
  };
}

export function normalizePublicReusableAsset(asset: PublicReusableAsset): PublicReusableAsset {
  return {
    ...asset,
    sourceDraft: normalizeWorkspaceDraft((asset as Partial<PublicReusableAsset>).sourceDraft),
  };
}
