/**
 * Top-level Application Component
 * 
 * Responsibilities:
 * - Owns all global UI state (selections, modifiers, navigation, model profile)
 * - Orchestrates engine calls (converts state to EngineInput, calls generatePrompt)
 * - Manages data loading (AttributeDefinitions, ModelProfiles)
 * - Coordinates component communication
 * 
 * Must NOT:
 * - Compute prompt strings
 * - Validate conflicts
 * - Format weights
 * - Store domain rules
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { AttributeDefinition, AttributeSelection, BuilderCategoryId, BuilderModeId, BUILDER_CATEGORY_IDS, CharacterIdentity, CharacterIdentityInput, CompositionFrame, CompositionFrameInput, EnvironmentIdentity, EnvironmentIdentityInput, LightingSetup, LightingSetupInput, Modifier, ModelProfile, MoodPreset, MoodPresetInput, NegativePreset, NegativePresetInput, OutfitIdentity, OutfitIdentityInput, Pool, Prompt, PromptAdditionEntry, SelectedPromptFragment, StylePreset, StylePresetInput, Territory, TerritorySourceInput, ValidationError } from '../types';
import { generatePrompt, EngineInput } from '../engine';
import { loadAttributeDefinitions } from '../data/loadAttributeDefinitions';
import { BUILDER_MODE_CONFIGS, BUILDER_MODE_ORDER, DEFAULT_BUILDER_MODE_ID } from '../data/builderModes';
import { loadQuestionNodes, QuestionNode } from '../data/loadQuestionNodes';
import { validateAllCategories } from '../data/validateCategoryIntegration';
import './App.css';
import { PromptPreview } from './components/PromptPreview';
import { QuestionCard } from './components/QuestionCard';
import { CompletionState } from './components/CompletionState';
import { ErrorDisplay } from './components/ErrorDisplay';
import { CategorySidebar } from './components/CategorySidebar';
import { RandomPromptGenerator } from './components/RandomPromptGenerator';
import { Modal } from './components/Modal';
import { WorldsPage } from './components/WorldsPage';
import { CommunityPage } from './components/CommunityPage';
import { PromptLibrary } from './components/PromptLibrary';
import { CharacterLibraryModal } from './components/CharacterLibraryModal';
import { EnvironmentLibraryModal } from './components/EnvironmentLibraryModal';
import { LexiconPage } from './components/LexiconPage';
import { FloatingPromptFragments } from './components/FloatingPromptFragments';
import { AuthModal } from './components/AuthModal';
import { AccountModal } from './components/AccountModal';
import { PromptsPage } from './components/PromptsPage';
import { LandingPage } from './components/LandingPage';
import { AdminPage } from './components/AdminPage';
import { MyProfilePage } from './components/MyProfilePage';
import { PublicCreatorPage } from './components/PublicCreatorPage';
import { NotificationBell } from './components/notifications/NotificationBell';
import { OnlinePresenceBadge } from './components/presence/OnlinePresenceBadge';
import { DMInbox } from './components/dm/DMInbox';
import { getUnreadDMCount, subscribeToIncomingDMs } from '../engine/dmStore';
import { PostDetailPage } from './components/wall/PostDetailPage';
import { IdentityDetailPage, type SharedIdentityData } from './components/community/IdentityDetailPage';
import type { Notification } from '../types/community';
import { CATEGORY_MAP } from '../data/categoryMap';
import { PROMPT_FRAGMENT_DEFINITIONS, type PromptFragmentDefinition } from '../data/promptFragments';
import {
  createCharacter,
  deleteCharacter as deleteStoredCharacter,
  listCharacters,
  updateCharacter,
} from '../engine/characterStore';
import {
  createEnvironment,
  deleteEnvironment as deleteStoredEnvironment,
  listEnvironments,
  updateEnvironment,
} from '../engine/environmentStore';
import {
  createOutfit,
  deleteOutfit as deleteStoredOutfit,
  listOutfits,
  updateOutfit,
} from '../engine/wardrobeStore';
import {
  createStylePreset,
  deleteStylePreset as deleteStoredStylePreset,
  listStylePresets,
  updateStylePreset,
} from '../engine/styleStore';
import {
  createLightingSetup,
  deleteLightingSetup as deleteStoredLightingSetup,
  listLightingSetups,
  updateLightingSetup,
} from '../engine/lightingStore';
import {
  createCompositionFrame,
  deleteCompositionFrame as deleteStoredCompositionFrame,
  listCompositionFrames,
  updateCompositionFrame,
} from '../engine/compositionStore';
import {
  createMoodPreset,
  deleteMoodPreset as deleteStoredMoodPreset,
  listMoodPresets,
  updateMoodPreset,
} from '../engine/moodStore';
import {
  createNegativePreset,
  deleteNegativePreset as deleteStoredNegativePreset,
  listNegativePresets,
  updateNegativePreset,
} from '../engine/negativeStore';
import { WardrobeModal } from './components/WardrobeModal';
import { WorkspacePage } from './components/WorkspacePage';
import { StyleModal } from './components/StyleModal';
import { LightingModal } from './components/LightingModal';
import { CompositionModal } from './components/CompositionModal';
import { MoodModal } from './components/MoodModal';
import { NegativeModal } from './components/NegativeModal';
import { WorldModal } from './components/WorldModal';
import { InteractionModal } from './components/InteractionModal';
import { LaneSetsModal } from './components/LaneSetsModal';
import { UniversesModal } from './components/UniversesModal';
import { INTERACTION_PHRASES } from '../data/interactionPhrases';
import { listWorlds } from '../engine/worldStore';
import { listLaneSets, createLaneSet, deleteLaneSet } from '../engine/laneSetStore';
import { listUniverses, createUniverse, updateUniversePools, deleteUniverse } from '../engine/universeStore';
import { initPresence, destroyPresence, updateStudioState } from '../engine/presenceStore';
import { getIdentityById } from '../engine/communityStore';
import type { LaneSet, LaneSetLanes } from '../types/laneSets';
import type { Universe, UniverseInput } from '../types/universe';
import {
  changeUserPassword,
  deleteCurrentUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserName,
} from '../engine/authStore';
import { isCurrentUserAdmin } from '../engine/adminStore';
import {
  trackAnalyticsEvent,
  trackAnalyticsPageView,
  trackAnalyticsSessionStart,
} from '../engine/analyticsStore';
import {
  createTerritory,
  deleteTerritory,
  getActiveTerritoryId,
  listTerritories,
  setActiveTerritoryId as persistActiveTerritoryId,
  updateTerritory,
} from '../engine/territoryStore';
import { listPools } from '../engine/poolStore';
import { listObjects, type ObjectIdentity } from '../engine/objectStore';
import { ObjectLibraryModal } from './components/ObjectLibraryModal';
import { getVariationPhrases } from '../data/worldStateOverlays';
import { buildAutoName } from './utils/buildAutoName';
import { saveCaptureSet } from '../engine/captureStore';

/**
 * Default model profile for Stable Diffusion
 * TODO: Load from config or allow user selection
 */
/**
 * Default model profile matching old generator behavior
 */
const DEFAULT_MODEL_PROFILE: ModelProfile = {
  tokenLimit: 77, // SD 1.5 default
  tokenSeparator: ', ', // Comma-separated tokens
  weightSyntax: 'attention', // Format: (text:value)
  defaultNegativePrompt: 'deformed, distorted, extra limbs, low detail, low quality, bad anatomy', // From old generator
};

const TERRITORY_SECTION_CATEGORY_MAP: Record<string, string[]> = {
  Subjects: ['subject'],
  Objects: ['subject'],
  Environment: ['environment'],
  Props: ['subject', 'environment'],
  Lighting: ['lighting'],
  Mood: ['lighting', 'style', 'actions'],
  Materials: ['quality', 'style'],
  Style: ['style'],
  Composition: ['camera'],
  Effects: ['effects', 'post-processing'],
};

const BUILDER_CATEGORY_LABELS: Record<string, string> = {
  subject: 'Subject',
  style: 'Style',
  lighting: 'Lighting',
  camera: 'Camera',
  environment: 'Environment',
  quality: 'Quality',
  effects: 'Effects',
  'post-processing': 'Post-Processing',
  actions: 'Actions',
  'anatomy-details': 'Anatomy Details',
};

const BUILDER_SESSION_STORAGE_KEY = 'morpbase:builder_session:v1';

type BuilderSessionPromptAdditionItem = {
  id: string;
  text: string;
  weight?: number;
  section?: string;
  sourceType?: 'pool' | 'territory' | 'pool-default' | 'idp-set';
};

type BuilderSessionSnapshot = {
  selections: AttributeSelection[];
  modifiers: Modifier[];
  weightsEnabledGlobal: boolean;
  poolPromptItems: BuilderSessionPromptAdditionItem[];
  poolOutputOverrides: Array<[string, string]>;
  selectionOutputOverrides: Array<[string, string]>;
  selectedPromptFragments: SelectedPromptFragment[];
  editedPositiveOutput: string | null;
  editedNegativeOutput: string | null;
  exportMode: 'structured' | 'clean' | 'structured_with_negative';
  currentNodeId: string;
  navigationHistory: string[];
  hasReachedEndViaNext: boolean;
  activeChipTexts: string[];
  activeIdpSetId: string | null;
  activeCharacterIds: string[];
  activeOutfitIds: string[];
  activeStyleIds: string[];
  activeLightingIds: string[];
  activeCompositionIds: string[];
  activeMoodIds: string[];
  activeNegativeIds: string[];
  activeObjectIds: string[];
  activeWorld: { id: string; name: string; phrases: string[] } | null;
  poseFraming: string | null;
  poseOrientation: string | null;
  poseEnergy: string | null;
  poseGaze: string | null;
  activeEnvironmentIds: string[];
  envTime: string | null;
  envWeather: string | null;
  envScale: string | null;
  envCondition: string | null;
  captureBuffer: string[];
  activeLaneSetId: string | null;
  activeUniverseId: string | null;
};

type CharacterPromptProjection = {
  characterId: string;
  displayName: string;
  summary?: string;
  corePhrases: string[];
};

function buildCharacterPromptProjection(
  character: CharacterIdentity | null
): CharacterPromptProjection | null {
  if (!character) return null;

  const displayName = character.name.trim() || character.name;
  const summary = character.summary?.trim() || undefined;
  const corePhrases = character.phraseBundle.core
    .map(text => text.trim())
    .filter(Boolean);

  // LoRA-backed characters lead with their trigger word so the LoRA activates.
  const trigger = character.loraTrigger?.trim();
  if (trigger) {
    corePhrases.unshift(trigger);
  }

  return {
    characterId: character.id,
    displayName,
    summary,
    corePhrases,
  };
}

function loadBuilderSessionSnapshot(): BuilderSessionSnapshot | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(BUILDER_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BuilderSessionSnapshot>;

    return {
      selections: Array.isArray(parsed.selections) ? parsed.selections : [],
      modifiers: Array.isArray(parsed.modifiers) ? parsed.modifiers : [],
      weightsEnabledGlobal: Boolean(parsed.weightsEnabledGlobal),
      poolPromptItems: Array.isArray(parsed.poolPromptItems) ? parsed.poolPromptItems : [],
      poolOutputOverrides: Array.isArray(parsed.poolOutputOverrides) ? parsed.poolOutputOverrides as Array<[string, string]> : [],
      selectionOutputOverrides: Array.isArray(parsed.selectionOutputOverrides) ? parsed.selectionOutputOverrides as Array<[string, string]> : [],
      selectedPromptFragments: Array.isArray(parsed.selectedPromptFragments) ? parsed.selectedPromptFragments : [],
      editedPositiveOutput: typeof parsed.editedPositiveOutput === 'string' ? parsed.editedPositiveOutput : null,
      editedNegativeOutput: typeof parsed.editedNegativeOutput === 'string' ? parsed.editedNegativeOutput : null,
      exportMode: parsed.exportMode === 'structured' || parsed.exportMode === 'structured_with_negative' ? parsed.exportMode : 'clean',
      currentNodeId: typeof parsed.currentNodeId === 'string' ? parsed.currentNodeId : '',
      navigationHistory: Array.isArray(parsed.navigationHistory) ? parsed.navigationHistory.filter((entry): entry is string => typeof entry === 'string') : [],
      hasReachedEndViaNext: Boolean(parsed.hasReachedEndViaNext),
      activeChipTexts: Array.isArray(parsed.activeChipTexts) ? (parsed.activeChipTexts as unknown[]).filter((t): t is string => typeof t === 'string') : [],
      activeIdpSetId: typeof parsed.activeIdpSetId === 'string' ? parsed.activeIdpSetId : null,
      activeCharacterIds: (() => {
        const p = parsed as any;
        if (Array.isArray(p.activeCharacterIds)) return (p.activeCharacterIds as unknown[]).filter((x): x is string => typeof x === 'string');
        if (typeof p.activeCharacterId === 'string') return [p.activeCharacterId];
        return [];
      })(),
      activeOutfitIds: (() => {
        const p = parsed as any;
        if (Array.isArray(p.activeOutfitIds)) return (p.activeOutfitIds as unknown[]).filter((x): x is string => typeof x === 'string');
        if (typeof p.activeOutfitId === 'string') return [p.activeOutfitId];
        return [];
      })(),
      activeStyleIds: (() => {
        const p = parsed as any;
        if (Array.isArray(p.activeStyleIds)) return (p.activeStyleIds as unknown[]).filter((x): x is string => typeof x === 'string');
        if (typeof p.activeStyleId === 'string') return [p.activeStyleId];
        return [];
      })(),
      activeLightingIds: (() => {
        const p = parsed as any;
        if (Array.isArray(p.activeLightingIds)) return (p.activeLightingIds as unknown[]).filter((x): x is string => typeof x === 'string');
        if (typeof p.activeLightingId === 'string') return [p.activeLightingId];
        return [];
      })(),
      activeCompositionIds: (() => {
        const p = parsed as any;
        if (Array.isArray(p.activeCompositionIds)) return (p.activeCompositionIds as unknown[]).filter((x): x is string => typeof x === 'string');
        if (typeof p.activeCompositionId === 'string') return [p.activeCompositionId];
        return [];
      })(),
      activeMoodIds: (() => {
        const p = parsed as any;
        if (Array.isArray(p.activeMoodIds)) return (p.activeMoodIds as unknown[]).filter((x): x is string => typeof x === 'string');
        if (typeof p.activeMoodId === 'string') return [p.activeMoodId];
        return [];
      })(),
      activeNegativeIds: Array.isArray(parsed.activeNegativeIds)
        ? (parsed.activeNegativeIds as unknown[]).filter((x): x is string => typeof x === 'string')
        : typeof (parsed as any).activeNegativeId === 'string' ? [(parsed as any).activeNegativeId] : [],
      activeObjectIds: Array.isArray(parsed.activeObjectIds)
        ? (parsed.activeObjectIds as unknown[]).filter((x): x is string => typeof x === 'string')
        : [],
      activeWorld: parsed.activeWorld && typeof parsed.activeWorld === 'object' && typeof (parsed.activeWorld as any).id === 'string'
        ? parsed.activeWorld as { id: string; name: string; phrases: string[] }
        : null,
      poseFraming: typeof parsed.poseFraming === 'string' ? parsed.poseFraming : null,
      poseOrientation: typeof parsed.poseOrientation === 'string' ? parsed.poseOrientation : null,
      poseEnergy: typeof parsed.poseEnergy === 'string' ? parsed.poseEnergy : null,
      poseGaze: typeof parsed.poseGaze === 'string' ? parsed.poseGaze : null,
      activeEnvironmentIds: (() => {
        const p = parsed as any;
        if (Array.isArray(p.activeEnvironmentIds)) return (p.activeEnvironmentIds as unknown[]).filter((x): x is string => typeof x === 'string');
        if (typeof p.activeEnvironmentId === 'string') return p.environmentInPrompt ? [p.activeEnvironmentId] : [];
        return [];
      })(),
      envTime: typeof parsed.envTime === 'string' ? parsed.envTime : null,
      envWeather: typeof parsed.envWeather === 'string' ? parsed.envWeather : null,
      envScale: typeof parsed.envScale === 'string' ? parsed.envScale : null,
      envCondition: typeof parsed.envCondition === 'string' ? parsed.envCondition : null,
      captureBuffer: Array.isArray(parsed.captureBuffer)
        ? (parsed.captureBuffer as unknown[]).filter((x): x is string => typeof x === 'string')
        : [],
      activeLaneSetId: typeof parsed.activeLaneSetId === 'string' ? parsed.activeLaneSetId : null,
      activeUniverseId: typeof parsed.activeUniverseId === 'string' ? parsed.activeUniverseId : null,
    };
  } catch {
    return null;
  }
}

type PageId = 'generator' | 'identity-systems' | 'prompts' | 'user-pools' | 'community' | 'messages' | 'my-profile' | 'creator-profile' | 'post-detail' | 'identity-detail' | 'admin';

const PAGE_TO_PARAM: Record<PageId, string> = {
  'generator': '',
  'identity-systems': 'lexicon',
  'prompts': 'memory',
  'user-pools': 'auras',
  'community': 'community',
  'messages': 'messages',
  'my-profile': 'profile',
  'creator-profile': '',
  'post-detail': '',
  'identity-detail': '',
  'admin': 'admin',
};

const PARAM_TO_PAGE: Record<string, PageId> = Object.fromEntries(
  Object.entries(PAGE_TO_PARAM).filter(([, v]) => v).map(([k, v]) => [v, k as PageId])
);

const getPageFromUrl = (): PageId | null => {
  try {
    const param = new URLSearchParams(window.location.search).get('page');
    return param && PARAM_TO_PAGE[param] ? PARAM_TO_PAGE[param] : null;
  } catch {
    return null;
  }
};

const parseCreatorHash = (): { creatorId?: string | null; creatorName?: string | null; creatorAuthUid?: string | null } | null => {
  try {
    if (!window.location.hash.startsWith('#creator')) return null;
    const raw = window.location.hash.slice('#creator'.length);
    const params = new URLSearchParams(raw.startsWith('?') ? raw.slice(1) : raw);
    const creatorId = params.get('user');
    const creatorName = params.get('name');
    const creatorAuthUid = params.get('authuid');
    if (!creatorId && !creatorName && !creatorAuthUid) return null;
    return {
      creatorId: creatorId || null,
      creatorName: creatorName || null,
      creatorAuthUid: creatorAuthUid || null,
    };
  } catch {
    return null;
  }
};

const buildCreatorHash = (input: { creatorId?: string | null; creatorName?: string | null; creatorAuthUid?: string | null }): string => {
  const params = new URLSearchParams();
  if (input.creatorId) params.set('user', input.creatorId);
  if (input.creatorName) params.set('name', input.creatorName);
  if (input.creatorAuthUid) params.set('authuid', input.creatorAuthUid);
  const query = params.toString();
  return query ? `#creator?${query}` : '';
};

/**
 * Attribute definitions will be loaded from external JSON files.
 * No data is loaded at this stage.
 */

export function App() {
  type PromptAdditionItem = {
    id: string;
    text: string;
    weight?: number;
    section?: string;
    sourceType?: 'pool' | 'territory' | 'pool-default' | 'idp-set';
  };
  const CUSTOM_PROMPT_FRAGMENTS_STORAGE_KEY = 'morpbase:custom_global_phrases';
  const initialBuilderSession = loadBuilderSessionSnapshot();

  const [hasSeenLanding, setHasSeenLanding] = useState<boolean>(() => {
    try {
      if (parseCreatorHash()) {
        return true;
      }
      return window.localStorage.getItem('morpbase:seen_landing') === '1';
    } catch {
      return false;
    }
  });
  const [activePage, setActivePage] = useState<PageId>(() => {
    try {
      if (parseCreatorHash()) return 'creator-profile';
      const fromUrl = getPageFromUrl();
      if (fromUrl) return fromUrl;
      const saved = window.localStorage.getItem('promptgen:active_page');
      if (saved === 'identity-systems') return 'identity-systems';
      if (saved === 'prompts') return 'prompts';
      if (saved === 'user-pools') return 'user-pools';
      if (saved === 'pool-hub' || saved === 'community') return 'community';
      if (saved === 'my-profile') return 'my-profile';
      if (saved === 'creator-profile') return 'creator-profile';
      if (saved === 'admin') return 'admin';
      return 'generator';
    } catch {
      return 'generator';
    }
  });
  // UI State: Selections
  const [selections, setSelections] = useState<Map<string, AttributeSelection>>(
    () => new Map((initialBuilderSession?.selections ?? []).map(selection => [selection.attributeId, selection]))
  );
  
  // UI State: Modifiers
  const [modifiers, setModifiers] = useState<Map<string, Modifier>>(
    () => new Map((initialBuilderSession?.modifiers ?? []).map(modifier => [modifier.targetAttributeId, modifier]))
  );
  
  // UI State: Global weight enabled/disabled
  const [weightsEnabledGlobal, setWeightsEnabledGlobal] = useState<boolean>(initialBuilderSession?.weightsEnabledGlobal ?? false);
  const [activeBuilderMode, setActiveBuilderMode] = useState<BuilderModeId>(() => {
    try {
      const saved = window.localStorage.getItem('morpbase:builder_mode');
      if (saved && saved in BUILDER_MODE_CONFIGS) {
        return saved as BuilderModeId;
      }
    } catch {
      // ignore
    }
    return DEFAULT_BUILDER_MODE_ID;
  });
  const lastModeRepositionRef = useRef<BuilderModeId | null>(null);
  
  // UI State: User pool prompt additions
  const [poolPromptItems, setPoolPromptItems] = useState<PromptAdditionItem[]>(initialBuilderSession?.poolPromptItems ?? []);
  const [activeChipTexts, setActiveChipTexts] = useState<string[]>(initialBuilderSession?.activeChipTexts ?? []);

  const handleChipToggle = (text: string) => {
    setActiveChipTexts(prev =>
      prev.includes(text) ? prev.filter(t => t !== text) : [...prev, text]
    );
  };
  const [activeIdpPool, setActiveIdpPool] = useState<Pool | null>(null);
  const [activeIdpSetId, setActiveIdpSetId] = useState<string | null>(initialBuilderSession?.activeIdpSetId ?? null);
  const [activeCharacterIds, setActiveCharacterIds] = useState<string[]>(initialBuilderSession?.activeCharacterIds ?? []);
  const [activeOutfitIds, setActiveOutfitIds] = useState<string[]>(initialBuilderSession?.activeOutfitIds ?? []);
  const [outfits, setOutfits] = useState<OutfitIdentity[]>([]);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [activeStyleIds, setActiveStyleIds] = useState<string[]>(initialBuilderSession?.activeStyleIds ?? []);
  const [stylePresets, setStylePresets] = useState<StylePreset[]>([]);
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [activeLightingIds, setActiveLightingIds] = useState<string[]>(initialBuilderSession?.activeLightingIds ?? []);
  const [lightingSetups, setLightingSetups] = useState<LightingSetup[]>([]);
  const [isLightingOpen, setIsLightingOpen] = useState(false);
  const [activeCompositionIds, setActiveCompositionIds] = useState<string[]>(initialBuilderSession?.activeCompositionIds ?? []);
  const [compositionFrames, setCompositionFrames] = useState<CompositionFrame[]>([]);
  const [isCompositionOpen, setIsCompositionOpen] = useState(false);
  const [activeMoodIds, setActiveMoodIds] = useState<string[]>(initialBuilderSession?.activeMoodIds ?? []);
  const [moodPresets, setMoodPresets] = useState<MoodPreset[]>([]);
  const [isMoodOpen, setIsMoodOpen] = useState(false);
  const [lockedLanes, setLockedLanes] = useState<Set<string>>(new Set());
  const [pinnedItems, setPinnedItems] = useState<Set<string>>(new Set());
  const [activeNegativeIds, setActiveNegativeIds] = useState<string[]>(initialBuilderSession?.activeNegativeIds ?? []);
  const [negativePresets, setNegativePresets] = useState<NegativePreset[]>([]);
  const [isNegativeOpen, setIsNegativeOpen] = useState(false);
  const [activeObjectIds, setActiveObjectIds] = useState<string[]>(initialBuilderSession?.activeObjectIds ?? []);
  const [objects, setObjects] = useState<ObjectIdentity[]>([]);
  const [isObjectOpen, setIsObjectOpen] = useState(false);
  const [activeWorld, setActiveWorld] = useState<{ id: string; name: string; phrases: string[] } | null>(initialBuilderSession?.activeWorld ?? null);
  const [isWorldOpen, setIsWorldOpen] = useState(false);
  const [worlds, setWorlds] = useState<{ id: string; name: string; phrases: string[] }[]>(() =>
    listWorlds().map(w => ({ id: w.id, name: w.name, phrases: w.phrases.map(p => p.text) }))
  );
  const [laneSets, setLaneSets] = useState<LaneSet[]>(() => listLaneSets());
  const [isLaneSetsOpen, setIsLaneSetsOpen] = useState(false);
  const [poseFraming, setPoseFraming] = useState<string | null>(initialBuilderSession?.poseFraming ?? null);
  const [poseOrientation, setPoseOrientation] = useState<string | null>(initialBuilderSession?.poseOrientation ?? null);
  const [poseEnergy, setPoseEnergy] = useState<string | null>(initialBuilderSession?.poseEnergy ?? null);
  const [poseGaze, setPoseGaze] = useState<string | null>(initialBuilderSession?.poseGaze ?? null);
  const [environments, setEnvironments] = useState<EnvironmentIdentity[]>([]);
  const [activeEnvironmentIds, setActiveEnvironmentIds] = useState<string[]>(initialBuilderSession?.activeEnvironmentIds ?? []);
  const [envTime, setEnvTime] = useState<string | null>(initialBuilderSession?.envTime ?? null);
  const [envWeather, setEnvWeather] = useState<string | null>(initialBuilderSession?.envWeather ?? null);
  const [envScale, setEnvScale] = useState<string | null>(initialBuilderSession?.envScale ?? null);
  const [envCondition, setEnvCondition] = useState<string | null>(initialBuilderSession?.envCondition ?? null);
  const [worldVariationEnabled, setWorldVariationEnabled] = useState(false);
  const [worldVariationPhrases, setWorldVariationPhrases] = useState<string[]>([]);
  const [auraVariationEnabled, setAuraVariationEnabled] = useState(false);
  const [auraVariationMin, setAuraVariationMin] = useState(1);
  const [auraVariationMax, setAuraVariationMax] = useState(3);
  const [captureBuffer, setCaptureBuffer] = useState<string[]>(initialBuilderSession?.captureBuffer ?? []);
  const [activeLaneSetId, setActiveLaneSetId] = useState<string | null>(initialBuilderSession?.activeLaneSetId ?? null);
  const [universes, setUniverses] = useState<Universe[]>(() => listUniverses());
  const [activeUniverseId, setActiveUniverseId] = useState<string | null>(initialBuilderSession?.activeUniverseId ?? null);
  const [isUniversesOpen, setIsUniversesOpen] = useState(false);
  const [isEnvironmentLibraryOpen, setIsEnvironmentLibraryOpen] = useState(false);
  const [poolOutputOverrides, setPoolOutputOverrides] = useState<Map<string, string>>(
    () => new Map(initialBuilderSession?.poolOutputOverrides ?? [])
  );

  // UI State: Freeform prompt text
  const [exportMode, setExportMode] = useState<'structured' | 'clean' | 'structured_with_negative'>(initialBuilderSession?.exportMode ?? 'clean');
  const [editedPositiveOutput, setEditedPositiveOutput] = useState<string | null>(initialBuilderSession?.editedPositiveOutput ?? null);
  const [editedNegativeOutput, setEditedNegativeOutput] = useState<string | null>(initialBuilderSession?.editedNegativeOutput ?? null);
  const [selectionOutputOverrides, setSelectionOutputOverrides] = useState<Map<string, string>>(
    () => new Map(initialBuilderSession?.selectionOutputOverrides ?? [])
  );
  const [selectedPromptFragments, setSelectedPromptFragments] = useState<SelectedPromptFragment[]>(initialBuilderSession?.selectedPromptFragments ?? []);
  const [customPromptFragments, setCustomPromptFragments] = useState<PromptFragmentDefinition[]>(() => {
    try {
      const raw = window.localStorage.getItem(CUSTOM_PROMPT_FRAGMENTS_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item): item is PromptFragmentDefinition => (
        item
        && typeof item.id === 'string'
        && typeof item.label === 'string'
        && typeof item.outputText === 'string'
      ));
    } catch {
      return [];
    }
  });

  // UI State: Clear prompt undo (single step)
  const [clearUndoState, setClearUndoState] = useState<{
    selections: Map<string, AttributeSelection>;
    modifiers: Map<string, Modifier>;
    poolPromptItems: PromptAdditionItem[];
    poolOutputOverrides: Map<string, string>;
    selectionOutputOverrides: Map<string, string>;
    selectedPromptFragments: SelectedPromptFragment[];
    activeCharacterIds: string[];
    activeOutfitIds: string[];
    activeStyleIds: string[];
    activeLightingIds: string[];
    activeCompositionIds: string[];
    activeMoodIds: string[];
    poseFraming: string | null;
    poseOrientation: string | null;
    poseEnergy: string | null;
    poseGaze: string | null;
    activeEnvironmentIds: string[];
    envTime: string | null;
    envWeather: string | null;
    envScale: string | null;
    envCondition: string | null;
  } | null>(null);
  
  // UI State: Model Profile
  const [modelProfile, setModelProfile] = useState<ModelProfile>(DEFAULT_MODEL_PROFILE);
  const [authUser, setAuthUser] = useState<Awaited<ReturnType<typeof getCurrentUser>>>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const isPro = true;
  const manualUrl = `${import.meta.env.BASE_URL}manual.html`;
  const manualLink = (anchor: string) => `${manualUrl}#${anchor}`;
  const feedbackSchema = `Feedback Schema (v1)

1) Tester Context
- Name / handle:
- Experience level (Beginner / Intermediate / Advanced):
- Primary use case (IMG / VIDEO / Both):
- Tools/models used (e.g., SDXL, ComfyUI, A1111, Runway):
- Device + OS + Browser:

2) Session Overview
- Date:
- Time spent:
- Goals for this session:

3) What Worked Well
- Feature(s) used:
- What felt smooth or valuable:
- Any standout moments:

4) Issues / Bugs
- Summary (short title):
- Steps to reproduce:
- Expected result:
- Actual result:
- Severity (Low / Medium / High / Blocker):
- Frequency (Once / Sometimes / Always):
- Screenshots / clips (if available):

5) Usability / UX Feedback
- Confusing flows or labels:
- Friction points:
- Missing guidance or clarity:

6) Prompt Quality
- Did outputs match intent? (Yes / Partially / No)
- Where it fell short:
- Any notable improvements when using Territories / User Pools:

7) Feature-Specific Feedback
- Territories:
- Builder:
- User Pools:
- Random Prompt Generator:
- Prompt Library (save/import/export):

8) Suggestions / Requests
- Top 3 improvements you want:
1.
2.
3.

9) Overall
- Satisfaction (1–10):
- Would you continue using it? (Yes / Maybe / No)
- Would you recommend it? (Yes / Maybe / No)
- Any final notes:`;
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackCopied, setFeedbackCopied] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountMessage, setAccountMessage] = useState<string | null>(null);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [territoriesLoading, setTerritoriesLoading] = useState(false);
  const [territoryPools, setTerritoryPools] = useState<Pool[]>([]);
  const [characters, setCharacters] = useState<CharacterIdentity[]>([]);
  const [charactersLoading, setCharactersLoading] = useState(true);
  const [activeTerritoryId, setActiveTerritory] = useState<string | null>(() => getActiveTerritoryId());
  const [territoryEditTargetId, setTerritoryEditTargetId] = useState<string | null>(null);
  const [territoryNavigationMode, setTerritoryNavigationMode] = useState<'biased' | 'full'>('biased');
  const [builderTerritoryPickerId, setBuilderTerritoryPickerId] = useState<string>('');
  const [savePromptOpenSignal, setSavePromptOpenSignal] = useState(0);
  const [isSavedPromptsDrawerOpen, setIsSavedPromptsDrawerOpen] = useState(false);
  const [isCharacterLibraryOpen, setIsCharacterLibraryOpen] = useState(false);
  const [isInteractionOpen, setIsInteractionOpen] = useState(false);
  const [activeInteractionPhraseId, setActiveInteractionPhraseId] = useState<string | null>(null);
  const [builderNotice, setBuilderNotice] = useState<string | null>(null);
  const [dismissedTerritoryRecommendation, setDismissedTerritoryRecommendation] = useState(false);
  const [topToastMessage, setTopToastMessage] = useState<string | null>(null);
  const [unavailableJumpNodeId, setUnavailableJumpNodeId] = useState<string | null>(null);
  const lastTerritoryRepositionKeyRef = useRef<string>('');
  const [selectedCreatorProfileTarget, setSelectedCreatorProfileTarget] = useState<{
    creatorId?: string | null;
    creatorName?: string | null;
    creatorAuthUid?: string | null;
  } | null>(() => parseCreatorHash());
  // UI State: Engine Result
  const [engineResult, setEngineResult] = useState<Prompt | ValidationError | null>(null);
  
  // Attribute definitions will be loaded from external JSON files.
  // No data is loaded at this stage.
  const [attributeDefinitions] = useState<AttributeDefinition[]>(() => {
    try {
      const loaded = loadAttributeDefinitions();
      console.log(`[App] Loaded ${loaded.length} attribute definitions`);
      
      // CRITICAL VALIDATION: Verify categories in CATEGORY_MAP have attribute data
      Object.keys(CATEGORY_MAP).forEach(categoryId => {
        const categoryAttributes = loaded.filter(def => def.category === categoryId);
        if (categoryAttributes.length === 0) {
          console.error(`[App] ⚠️ VALIDATION ERROR: Category "${categoryId}" is in CATEGORY_MAP but has 0 attributes loaded!`);
          console.error(`[App] SOLUTION: Check that src/data/${categoryId}.json exists and is properly formatted.`);
          console.error(`[App] File must have structure: { "category": "${categoryId}", "attributes": [...] }`);
        } else {
          console.log(`[App] ✓ Category "${categoryId}" has ${categoryAttributes.length} attributes loaded`);
        }
      });
      
      return loaded;
    } catch (error) {
      console.error('Failed to load attribute definitions:', error);
      return [];
    }
  });
  
  // Question nodes will be loaded from external JSON files.
  // No data is loaded at this stage.
  const [questionNodes, setQuestionNodes] = useState<QuestionNode[]>([]);
  
  // Category order for interview flow (based on semantic priority)
  // This defines the sequence in which categories are presented when clicking Next
  // 
  // IMPORTANT: When adding new categories, add them to this array in the desired order
  // The order determines the interview flow: subject -> style -> lighting -> [future categories]
  // 
  // Categories must also exist in CATEGORY_MAP with their root nodeId
  const CATEGORY_ORDER: BuilderCategoryId[] = [...BUILDER_CATEGORY_IDS];
  const activeBuilderModeConfig = useMemo(() => BUILDER_MODE_CONFIGS[activeBuilderMode], [activeBuilderMode]);
  const activeCategoryOrder = activeBuilderModeConfig.categoryOrder;
  const activeStageDefinitions = activeBuilderModeConfig.stages;
  const builderModeOptions = useMemo(
    () => BUILDER_MODE_ORDER.map(modeId => ({
      id: modeId,
      label: BUILDER_MODE_CONFIGS[modeId].label,
    })),
    []
  );
  const collectNodeIds = (items: Array<{ nodeId?: string; subcategories?: any[] }>): string[] => {
    const nodeIds: string[] = [];
    items.forEach(item => {
      if (item.nodeId) nodeIds.push(item.nodeId);
      if (item.subcategories) {
        nodeIds.push(...collectNodeIds(item.subcategories));
      }
    });
    return nodeIds;
  };

  const getCategoryForNode = useCallback((nodeId: string | null) => {
    if (!nodeId) return null;
    for (const [categoryId, items] of Object.entries(CATEGORY_MAP)) {
      const nodeIds = collectNodeIds(items);
      if (nodeIds.includes(nodeId)) {
        return categoryId;
      }
    }
    return null;
  }, []);

  const activeCharacter = useMemo(
    () => characters.find(c => activeCharacterIds.includes(c.id)) ?? null,
    [characters, activeCharacterIds]
  );
  const activeCharacterProjection = useMemo(
    () => activeCharacterIds.length > 0 ? buildCharacterPromptProjection(activeCharacter) : null,
    [activeCharacterIds, activeCharacter]
  );
  const activeCharacterProjections = useMemo(
    () => activeCharacterIds
      .map(id => characters.find(c => c.id === id) ?? null)
      .filter((c): c is CharacterIdentity => c !== null)
      .map(buildCharacterPromptProjection)
      .filter((p): p is CharacterPromptProjection => p !== null),
    [activeCharacterIds, characters]
  );
  const activeCharacterDisplayName = activeCharacterProjection?.displayName ?? activeCharacter?.name ?? null;

  const activeInteractionPhrase = useMemo(
    () => INTERACTION_PHRASES.find(p => p.id === activeInteractionPhraseId) ?? null,
    [activeInteractionPhraseId]
  );

  const handleRandomizeInteraction = () => {
    const others = INTERACTION_PHRASES.filter(p => p.id !== activeInteractionPhraseId);
    const pool = others.length > 0 ? others : INTERACTION_PHRASES;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setActiveInteractionPhraseId(picked.id);
  };

  const characterCountPhrase = useMemo(() => {
    if (activeCharacterIds.length < 2) return null;
    const activeChars = activeCharacterIds
      .map(id => characters.find(c => c.id === id))
      .filter((c): c is CharacterIdentity => Boolean(c));
    if (activeChars.length < 2) return null;
    const archetypes = activeChars
      .map(c => c.identity.archetype)
      .filter((a): a is string => Boolean(a) && a !== 'duo');
    if (archetypes.length < 2) return null;
    const allSame = archetypes.every(a => a === archetypes[0]);
    if (!allSame) return null;
    return `two ${archetypes[0]}s`;
  }, [activeCharacterIds, characters]);

  const activeTerritory = territories.find(territory => territory.id === activeTerritoryId) ?? null;
  const canManageTerritories = Boolean(authUser && isPro);
  const activeTerritoryCategoryIds = useMemo(() => {
    if (!activeTerritory) return [];
    const categoryIds = new Set<string>();
    activeTerritory.sources.forEach(source => {
      const mappedCategories = TERRITORY_SECTION_CATEGORY_MAP[source.section] ?? [];
      mappedCategories.forEach(categoryId => categoryIds.add(categoryId));
    });
    return [...categoryIds];
  }, [activeTerritory]);
  const activeTerritoryMappings = useMemo(() => {
    if (!activeTerritory) return [];
    return activeTerritory.sources.map(source => ({
      id: source.id,
      section: source.section,
      poolName: source.poolName,
      categoryLabels: (TERRITORY_SECTION_CATEGORY_MAP[source.section] ?? []).map(
        categoryId => BUILDER_CATEGORY_LABELS[categoryId] ?? categoryId
      ),
    }));
  }, [activeTerritory]);

  useEffect(() => {
    if (activeTerritoryId) {
      setBuilderTerritoryPickerId(activeTerritoryId);
      return;
    }
    if (!builderTerritoryPickerId && territories.length > 0) {
      setBuilderTerritoryPickerId(territories[0].id);
    }
  }, [activeTerritoryId, builderTerritoryPickerId, territories]);

  useEffect(() => {
    if (activeTerritoryId) {
      setDismissedTerritoryRecommendation(false);
    }
  }, [activeTerritoryId]);

  useEffect(() => {
    void updateStudioState(activeTerritory?.name);
  }, [activeTerritory]);

  // Helper: Get first subcategory node ID for a category, or the category root if no subcategories
  const getFirstSubcategoryNodeId = (categoryId: string, nodes: QuestionNode[]): string | null => {
    const categoryItems = CATEGORY_MAP[categoryId];
    if (!categoryItems || categoryItems.length === 0) return null;
    
    const mainItem = categoryItems[0];
    // If there are subcategories, get the first one's nodeId
    if (mainItem.subcategories && mainItem.subcategories.length > 0) {
      const firstSubcategory = mainItem.subcategories[0];
      if (firstSubcategory.nodeId && nodes.find(n => n.id === firstSubcategory.nodeId)) {
        return firstSubcategory.nodeId;
      }
    }
    // Otherwise, use the main category's nodeId
    if (mainItem.nodeId && nodes.find(n => n.id === mainItem.nodeId)) {
      return mainItem.nodeId;
    }
    return null;
  };
  
  /**
   * Build a flat list of all subcategory node IDs in order
   * This creates a sequential list: Subject->People, Subject->Animals, ..., Anatomy Details->Breasts, etc.
   */
  const getAllSubcategoryNodeIds = useCallback((nodes: QuestionNode[]): string[] => {
    const allNodeIds: string[] = [];
    
    for (const categoryId of activeCategoryOrder) {
      const categoryItems = CATEGORY_MAP[categoryId] || [];
      
      // For each subcategory in this category
      for (const item of categoryItems) {
        // If item has subcategories (nested structure), add them
        if (item.subcategories && item.subcategories.length > 0) {
          for (const subItem of item.subcategories) {
            if (subItem.nodeId && nodes.find(n => n.id === subItem.nodeId)) {
              allNodeIds.push(subItem.nodeId);
            }
          }
        } else if (item.nodeId && nodes.find(n => n.id === item.nodeId)) {
          // Direct subcategory (no nesting)
          allNodeIds.push(item.nodeId);
        }
      }
    }
    
    return allNodeIds;
  }, [activeCategoryOrder]);

  // Determine initial node ID
  const getInitialNodeId = useCallback((nodes: QuestionNode[]): string => {
    // Get the first subcategory in sequential order
    const allNodeIds = getAllSubcategoryNodeIds(nodes);
    if (allNodeIds.length > 0) {
      return allNodeIds[0];
    }
    
    // Fallback to subject-root or first node
    return nodes.find(n => n.id === 'subject-root')?.id || 
           nodes.find(n => n.id === 'root')?.id ||
           nodes[0]?.id || 
           '';
  }, [getAllSubcategoryNodeIds]);

  // UI State: Navigation
  const [currentNodeId, setCurrentNodeId] = useState<string>(initialBuilderSession?.currentNodeId ?? '');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(initialBuilderSession?.navigationHistory ?? []);

  const effectiveAttributeDefinitions = attributeDefinitions;
  const effectiveDefinitionIds = useMemo(() => new Set(effectiveAttributeDefinitions.map(def => def.id)), [effectiveAttributeDefinitions]);

  const isNodeUsable = useCallback((nodeId: string | null, nodes: QuestionNode[], definitions: AttributeDefinition[]) => {
    if (!nodeId) return false;
    const node = nodes.find(item => item.id === nodeId);
    if (!node) return false;

    return node.attributeIds.some(attributeId => definitions.some(def => def.id === attributeId));
  }, []);

  const usableNodeIds = useMemo(() => {
    if (questionNodes.length === 0) return [];
    const orderedNodeIds = getAllSubcategoryNodeIds(questionNodes);
    return orderedNodeIds.filter(nodeId => isNodeUsable(nodeId, questionNodes, effectiveAttributeDefinitions));
  }, [questionNodes, getAllSubcategoryNodeIds, isNodeUsable, effectiveAttributeDefinitions]);

  const getAdjacentUsableNodeId = useCallback((nodeId: string | null, direction: 'next' | 'previous') => {
    if (usableNodeIds.length === 0) return null;
    if (!nodeId) {
      return direction === 'next' ? usableNodeIds[0] : usableNodeIds[usableNodeIds.length - 1];
    }

    const currentIndex = usableNodeIds.indexOf(nodeId);
    if (currentIndex === -1) {
      return direction === 'next' ? usableNodeIds[0] : usableNodeIds[usableNodeIds.length - 1];
    }

    if (direction === 'next') {
      return usableNodeIds[currentIndex + 1] ?? null;
    }

    return usableNodeIds[currentIndex - 1] ?? null;
  }, [usableNodeIds]);

  const getFirstUsableNodeIdForCategory = useCallback((categoryId: string): string | null => {
    return usableNodeIds.find(nodeId => getCategoryForNode(nodeId) === categoryId) ?? null;
  }, [getCategoryForNode, usableNodeIds]);

  const getTerritoryBiasedAdjacentNodeId = useCallback((nodeId: string | null, direction: 'next' | 'previous') => {
    const fallbackNodeId = getAdjacentUsableNodeId(nodeId, direction);
    if (territoryNavigationMode !== 'biased' || !activeTerritoryCategoryIds.length || usableNodeIds.length === 0) {
      return fallbackNodeId;
    }

    if (!nodeId) {
      return fallbackNodeId;
    }

    const currentCategoryId = getCategoryForNode(nodeId);
    if (!currentCategoryId) {
      return fallbackNodeId;
    }

    const orderedPreferredCategories = activeCategoryOrder.filter(categoryId => (
      activeTerritoryCategoryIds.includes(categoryId)
      && getFirstUsableNodeIdForCategory(categoryId)
    ));

    if (orderedPreferredCategories.length === 0) {
      return fallbackNodeId;
    }

    const currentCategoryIndex = orderedPreferredCategories.indexOf(currentCategoryId);
    if (currentCategoryIndex === -1) {
      return fallbackNodeId;
    }

    const nextCategoryIndex = direction === 'next' ? currentCategoryIndex + 1 : currentCategoryIndex - 1;
    if (nextCategoryIndex < 0 || nextCategoryIndex >= orderedPreferredCategories.length) {
      return null;
    }

    return getFirstUsableNodeIdForCategory(orderedPreferredCategories[nextCategoryIndex]);
  }, [activeCategoryOrder, activeTerritoryCategoryIds, getAdjacentUsableNodeId, getCategoryForNode, getFirstUsableNodeIdForCategory, territoryNavigationMode, usableNodeIds.length]);

  const getPreferredTerritoryStartNodeId = useCallback(() => {
    if (!activeTerritoryCategoryIds.length) return '';

    for (const categoryId of activeCategoryOrder) {
      if (!activeTerritoryCategoryIds.includes(categoryId)) continue;
      const preferredNodeId = getFirstUsableNodeIdForCategory(categoryId);
      if (preferredNodeId) return preferredNodeId;
    }

    return '';
  }, [activeCategoryOrder, activeTerritoryCategoryIds, getFirstUsableNodeIdForCategory]);

  const getPreferredStartNodeIdForCategoryIds = useCallback((categoryIds: string[]) => {
    if (categoryIds.length === 0) return '';

    for (const categoryId of activeCategoryOrder) {
      if (!categoryIds.includes(categoryId)) continue;
      const preferredNodeId = getFirstUsableNodeIdForCategory(categoryId);
      if (preferredNodeId) return preferredNodeId;
    }

    return '';
  }, [activeCategoryOrder, getFirstUsableNodeIdForCategory]);

  const getInitialUsableNodeId = useCallback(() => usableNodeIds[0] ?? '', [usableNodeIds]);
  const isCurrentNodeUsable = isNodeUsable(currentNodeId, questionNodes, effectiveAttributeDefinitions);
  const hasNextUsableNode = useMemo(() => {
    if (!currentNodeId || !usableNodeIds.includes(currentNodeId)) {
      return false;
    }

    return getTerritoryBiasedAdjacentNodeId(currentNodeId, 'next') !== null;
  }, [currentNodeId, getTerritoryBiasedAdjacentNodeId, usableNodeIds]);
  
  const [hasReachedEndViaNext, setHasReachedEndViaNext] = useState<boolean>(initialBuilderSession?.hasReachedEndViaNext ?? false);

  // UI State: Random Prompt Generator Modal
  const [isRandomPromptModalOpen, setIsRandomPromptModalOpen] = useState<boolean>(false);

  // UI State: App Tutorial Modal
  const [isAppTutorialOpen, setIsAppTutorialOpen] = useState<boolean>(false);
  
  // Load question nodes
  useEffect(() => {
    try {
      const loaded = loadQuestionNodes();
      console.log(`[App] Loaded ${loaded.length} question nodes:`, loaded.map(n => n.id));
      
      // COMPREHENSIVE VALIDATION: Validate all categories using the validation system
      const validationResults = validateAllCategories(
        attributeDefinitions,
        loaded,
        CATEGORY_ORDER
      );

      // Log validation results
      validationResults.forEach(result => {
        if (result.isValid) {
          console.log(`[App] ✓ Category "${result.categoryId}" is fully integrated`);
          if (result.warnings.length > 0) {
            result.warnings.forEach(warning => {
              console.warn(`[App] ⚠️ ${warning}`);
            });
          }
        } else {
          console.error(`[App] ❌ Category "${result.categoryId}" has integration errors:`);
          result.errors.forEach(error => {
            console.error(`[App]   - ${error}`);
          });
          if (result.warnings.length > 0) {
            result.warnings.forEach(warning => {
              console.warn(`[App] ⚠️ ${warning}`);
            });
          }
        }
      });

      // Count valid vs invalid categories
      const validCount = validationResults.filter(r => r.isValid).length;
      const invalidCount = validationResults.filter(r => !r.isValid).length;
      console.log(`[App] Category Integration Summary: ${validCount} valid, ${invalidCount} invalid out of ${validationResults.length} total`);
      
        if (loaded.length > 0) {
          setQuestionNodes(loaded);
          // Always set initial node when question nodes first load
          const initialId = getInitialNodeId(loaded);
          console.log(`[App] Setting initial node ID: ${initialId}`);
          if (initialId) {
            setCurrentNodeId(initialId);
          setNavigationHistory([initialId]);
          setHasReachedEndViaNext(false); // Reset completion flag on initial load
        }
      } else {
        console.warn('[App] No question nodes loaded');
      }
    } catch (err) {
      console.error('[App] Failed to load question nodes:', err);
    }
  }, [attributeDefinitions, getInitialNodeId]);

  useEffect(() => {
    try {
      window.localStorage.setItem('morpbase:builder_mode', activeBuilderMode);
    } catch {
      // ignore
    }
  }, [activeBuilderMode]);

  // Get current question node
  const currentNode: QuestionNode | undefined = questionNodes.find(n => n.id === currentNodeId);
  
  // Debug logging
  useEffect(() => {
    console.log('[App] Current state:', {
      questionNodesCount: questionNodes.length,
      currentNodeId,
      currentNode: currentNode?.id,
      attributeDefinitionsCount: attributeDefinitions.length,
    });
  }, [questionNodes.length, currentNodeId, currentNode?.id, attributeDefinitions.length]);
  
  const isComplete = currentNode && 
                     isCurrentNodeUsable &&
                     !hasNextUsableNode &&
                     selections.size > 0;
  
  // Get attribute definitions for current question
  const currentQuestionAttributes = attributeDefinitions.filter(attr => currentNode?.attributeIds.includes(attr.id));
  
  // CRITICAL VALIDATION: Detect missing attributes for current question
  useEffect(() => {
    if (currentNode && currentNode.attributeIds) {
      const missingAttributes = currentNode.attributeIds.filter(
        attrId => !attributeDefinitions.find(def => def.id === attrId)
      );
      
      if (missingAttributes.length > 0) {
        console.error(`[App] ⚠️ VALIDATION ERROR: Question node "${currentNode.id}" references ${missingAttributes.length} missing attributes:`, missingAttributes);
        console.error(`[App] Available attribute IDs (first 20):`, attributeDefinitions.map(def => def.id).slice(0, 20));
        console.error(`[App] Question node expects:`, currentNode.attributeIds);
        console.error(`[App] SOLUTION: Ensure src/data/${currentNode.id.split('-')[0]}.json exists and contains these attribute IDs.`);
        console.error(`[App] Also verify: 1) Dev server was restarted, 2) File is valid JSON, 3) Attribute IDs match exactly`);
      }
      
      if (currentQuestionAttributes.length === 0 && currentNode.attributeIds.length > 0) {
        console.error(`[App] ⚠️ VALIDATION ERROR: Question node "${currentNode.id}" has ${currentNode.attributeIds.length} attribute IDs but 0 matching attributes found!`);
        console.error(`[App] This indicates a data loading or matching issue.`);
        console.error(`[App] DIAGNOSIS: Check browser console for earlier errors about missing data files.`);
      }
      
      // Success logging for debugging
      if (currentQuestionAttributes.length > 0 && currentNode.attributeIds.length > 0) {
        console.log(`[App] ✓ Question "${currentNode.id}" has ${currentQuestionAttributes.length}/${currentNode.attributeIds.length} attributes available`);
      }
    }
  }, [currentNode?.id, currentNode?.attributeIds, attributeDefinitions.length, currentQuestionAttributes.length]);
  
  // Get modifiers for current question (empty for now, can be enhanced later)
  const currentQuestionModifiers: Modifier[] = [];

  /**
   * Core UI ↔ Engine Integration Point
   * 
   * This function bridges UI state (selections, modifiers) with the prompt engine.
   * It converts React state into engine input format and calls generatePrompt().
   * 
   * TODO: Future enhancements could be added here:
   * - Category filtering before engine call
   * - Selection persistence (localStorage, API)
   * - Undo/redo history
   * - Batch operations
   * - Optimistic updates
   */
  const callEngine = useCallback(() => {
    // Convert Map state to arrays for engine
    const selectionsArray: AttributeSelection[] = Array.from(selections.values()).filter(selection => effectiveDefinitionIds.has(selection.attributeId));
    const outputDefinitions = selectionOutputOverrides.size === 0
      ? effectiveAttributeDefinitions
      : effectiveAttributeDefinitions.map(def => {
          const override = selectionOutputOverrides.get(def.id);
          if (!override || !override.trim()) return def;
          return { ...def, baseText: override.trim() };
        });
    
    // Only include modifiers that are enabled (checkbox checked)
    const modifiersArray: Modifier[] = weightsEnabledGlobal ? Array.from(modifiers.values()) : [];

    // Build engine input
    const input: EngineInput = {
      attributeDefinitions: outputDefinitions,
      selections: selectionsArray,
      modifiers: modifiersArray,
      modelProfile,
    };

    // Call engine
    const result = generatePrompt(input);
    setEngineResult(result);
  }, [selections, modifiers, weightsEnabledGlobal, modelProfile, effectiveAttributeDefinitions, selectionOutputOverrides, effectiveDefinitionIds]);

  // Call engine whenever selections, modifiers, or modelProfile changes
  useEffect(() => {
    callEngine();
  }, [callEngine]);

  /**
   * Event Handler: Select an attribute
   * 
   * GLOBAL BEHAVIOR: When ANY attribute is selected:
   * - Selection is added to state
   * - Default weight of 1.0 is automatically set (GLOBAL RULE - NO EXCEPTIONS)
   * - Inline weight slider appears in AttributeSelector (GLOBAL RULE - NO EXCEPTIONS)
   * 
   */
  const handleAttributeSelect = useCallback((attributeId: string) => {
    console.log('[App] Attribute selected:', attributeId);
    console.log('[App] Current node ID:', currentNodeId);
    setSelections(prev => {
      const next = new Map(prev);
      next.set(attributeId, {
        attributeId,
        isEnabled: true,
        customExtension: null,
      });
      return next;
    });
    
    // GLOBAL RULE: Set default weight of 1.0 when ANY attribute is selected
    // This applies to ALL attributes without exception:
    // - subject attributes
    // - style attributes  
    // - lighting attributes
    // - positive and negative attributes
    // - ALL current and future attributes
    setModifiers(prev => {
      const next = new Map(prev);
      if (!next.has(attributeId)) {
        next.set(attributeId, {
          targetAttributeId: attributeId,
          value: 1.0,
        });
      }
      return next;
    });
  }, [currentNodeId]);

  /**
   * Event Handler: Deselect an attribute
   * 
   * GLOBAL BEHAVIOR: When ANY attribute is deselected:
   * - Selection is removed from state
   * - Weight modifier is removed (GLOBAL RULE - NO EXCEPTIONS)
   * - Inline weight slider disappears (GLOBAL RULE - NO EXCEPTIONS)
   * - Weight resets to default (no persistence, no memory)
   * 
   * This applies to ALL attributes without exception.
   */
  const handleAttributeDeselect = useCallback((attributeId: string) => {
    setSelections(prev => {
      const next = new Map(prev);
      next.delete(attributeId);
      return next;
    });
    
    // GLOBAL RULE: Remove weight modifier when attribute is deselected
    // This applies to ALL attributes - no exceptions, no persistence
    setModifiers(prev => {
      const next = new Map(prev);
      next.delete(attributeId);
      return next;
    });
    
  }, []);


  /**
   * Event Handler: Change custom extension text
   * Updates selection's customExtension and triggers engine call
   */
  const handleCustomExtensionChange = useCallback((attributeId: string, extension: string) => {
    setSelections(prev => {
      const next = new Map(prev);
      const existing = next.get(attributeId);
      if (existing) {
        next.set(attributeId, {
          ...existing,
          customExtension: extension || null,
        });
      }
      return next;
    });
  }, []);

  /**
   * Event Handler: Change weight value
   * Updates modifier value and triggers engine call
   */
  const handleWeightChange = useCallback((attributeId: string, value: number) => {
    setModifiers(prev => {
      const next = new Map(prev);
      next.set(attributeId, {
        targetAttributeId: attributeId,
        value,
      });
      return next;
    });
  }, []);

  /**
   * Event Handler: Navigate back
   * Moves to previous node in history
   */
  const handleNavigateBack = useCallback(() => {
    setHasReachedEndViaNext(false); // Reset completion flag when going back
    setUnavailableJumpNodeId(null);
    setNavigationHistory(prev => {
      if (prev.length > 1) {
        let newHistory = prev.slice(0, -1);
        while (newHistory.length > 0 && !usableNodeIds.includes(newHistory[newHistory.length - 1])) {
          newHistory = newHistory.slice(0, -1);
        }
        const fallbackNodeId = newHistory[newHistory.length - 1] ?? getAdjacentUsableNodeId(currentNodeId, 'previous');
        if (fallbackNodeId) {
          setCurrentNodeId(fallbackNodeId);
        }
        return newHistory;
      }
      return prev;
    });
  }, [currentNodeId, getAdjacentUsableNodeId, usableNodeIds]);

  /**
   * Event Handler: Navigate next
   * Moves to next node if available, or to next category in order
   * ONLY called when user explicitly clicks Next button
   * 
   * CRITICAL: This is the ONLY way to proceed to next question or mark as complete
   * 
   * Flow:
   * 1. If current node has nextNodeId -> navigate to that node
   * 2. Else, check if there's a next category in order -> navigate to that category
   * 3. Else, no more categories -> mark as complete
   */
  const handleNavigateNext = useCallback(() => {
    console.log('[App] Navigate Next clicked');
    console.log('[App] Current node:', currentNode?.id);
    console.log('[App] Next node ID:', currentNode?.nextNodeId);

    setUnavailableJumpNodeId(null);
    const nextNodeId = getTerritoryBiasedAdjacentNodeId(currentNode?.id || null, 'next');

    if (nextNodeId) {
      console.log('[App] Navigating to next usable subcategory:', nextNodeId);
      setCurrentNodeId(nextNodeId);
      setNavigationHistory(prev => prev[prev.length - 1] === nextNodeId ? prev : [...prev, nextNodeId]);
      setHasReachedEndViaNext(false); // Reset completion flag when moving forward
    } else {
      console.log('[App] No more usable subcategories available - marking as complete via Next button');
      setHasReachedEndViaNext(true);
    }
  }, [currentNode, getTerritoryBiasedAdjacentNodeId]);

  /**
   * Event Handler: Navigate skip
   * Skips current question and moves to next
   */
  const handleNavigateSkip = useCallback(() => {
    setUnavailableJumpNodeId(null);
    const nextNodeId = getTerritoryBiasedAdjacentNodeId(currentNode?.id || null, 'next');
    if (nextNodeId) {
      setCurrentNodeId(nextNodeId);
      setNavigationHistory(prev => prev[prev.length - 1] === nextNodeId ? prev : [...prev, nextNodeId]);
    }
  }, [currentNode, getTerritoryBiasedAdjacentNodeId]);

  const handleGoToUsableNode = useCallback((nodeId: string | null) => {
    if (!nodeId) return;

    setUnavailableJumpNodeId(null);
    setHasReachedEndViaNext(false);
    setCurrentNodeId(nodeId);
    setNavigationHistory(prev => {
      const filtered = prev.filter(historyNodeId => usableNodeIds.includes(historyNodeId));
      return filtered[filtered.length - 1] === nodeId ? filtered : [...filtered, nodeId];
    });
  }, [usableNodeIds]);

  /**
   * Event Handler: Start over
   * Resets all state and returns to first question
   */
  const handleStartOver = useCallback(() => {
    setSelections(new Map());
    setModifiers(new Map());
    setSelectionOutputOverrides(new Map());
    setUnavailableJumpNodeId(null);
    setBuilderNotice(null);
    setHasReachedEndViaNext(false); // Reset completion flag
    const initialId = getPreferredTerritoryStartNodeId() || getInitialUsableNodeId() || getInitialNodeId(questionNodes);
    setCurrentNodeId(initialId);
    setNavigationHistory([initialId]);
  }, [questionNodes, getInitialNodeId, getInitialUsableNodeId, getPreferredTerritoryStartNodeId]);

  const handleGoToBuilderStart = useCallback(() => {
    setHasSeenLanding(true);
    setActivePage('generator');
    handleStartOver();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [handleStartOver]);

  /**
   * Event Handler: Review selections
   * Goes back to first question to review
   */
  const handleReview = useCallback(() => {
    setHasReachedEndViaNext(false); // Reset completion flag when reviewing
    setUnavailableJumpNodeId(null);
    const initialId = getInitialUsableNodeId() || getInitialNodeId(questionNodes);
    setCurrentNodeId(initialId);
    setNavigationHistory([initialId]);
  }, [questionNodes, getInitialNodeId, getInitialUsableNodeId]);

  /**
   * Event Handler: Jump to category
   * Navigates to a specific question node
   * 
   * CRITICAL: When jumping to a category, reset completion state
   * This ensures completion doesn't persist when switching categories
   */
  const handleJumpToCategory = useCallback((nodeId: string) => {
    console.log('[App] handleJumpToCategory called with nodeId:', nodeId);
    console.log('[App] Available question nodes:', questionNodes.map(n => n.id));
    // Check if node exists in question nodes
    const targetNode = questionNodes.find(n => n.id === nodeId);
    if (targetNode) {
      console.log('[App] Target node found, navigating to:', nodeId);
      const targetUsable = isNodeUsable(nodeId, questionNodes, effectiveAttributeDefinitions);
      setCurrentNodeId(nodeId);
      setUnavailableJumpNodeId(targetUsable ? null : nodeId);
      setHasReachedEndViaNext(false); // Reset completion flag when jumping
      setNavigationHistory(prev => {
        const filtered = prev.filter(historyNodeId => usableNodeIds.includes(historyNodeId));
        if (!targetUsable) {
          return filtered;
        }

        const nodeIndex = filtered.indexOf(nodeId);
        if (nodeIndex !== -1) {
          return filtered.slice(0, nodeIndex + 1);
        }

        return [...filtered, nodeId];
      });
      setBuilderNotice(null);
    } else {
      console.error('[App] Target node not found:', nodeId);
      console.error('[App] Available nodes:', questionNodes.map(n => n.id));
    }
  }, [questionNodes, isNodeUsable, effectiveAttributeDefinitions, usableNodeIds]);

  /**
   * Event Handler: Remove selection
   * Removes selection and triggers engine call
   */
  const handleRemoveSelection = useCallback((attributeId: string) => {
    handleAttributeDeselect(attributeId);
  }, [handleAttributeDeselect]);

  /**
   * Event Handler: Change model profile
   * Updates model profile and triggers engine call
   */
  const handleModelProfileChange = useCallback((profile: ModelProfile) => {
    setModelProfile(profile);
  }, []);

  const handleOpenAuth = () => {
    setAuthError(null);
    setIsAuthModalOpen(true);
  };

  const handleOpenAccount = () => {
    setAccountError(null);
    setAccountMessage(null);
    setIsAccountModalOpen(true);
  };

  useEffect(() => {
    let isMounted = true;
    getCurrentUser()
      .then(user => {
        if (!isMounted) return;
        setAuthUser(user);
        if (user) void initPresence(user.authUid, user.id, user.name);
        setAuthReady(true);
      })
      .catch(() => {
        if (!isMounted) return;
        setAuthUser(null);
        setAuthReady(true);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await loginUser(email, password);
      setAuthUser(user);
      void initPresence(user.authUid, user.id, user.name);
      setAuthError(null);
      setIsAuthModalOpen(false);
      return true;
    } catch (err: any) {
      setAuthError(err?.message ?? 'Login failed.');
      return false;
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const user = await registerUser(name, email, password);
      setAuthUser(user);
      void initPresence(user.authUid, user.id, user.name);
      setAuthError(null);
      setIsAuthModalOpen(false);
      return true;
    } catch (err: any) {
      setAuthError(err?.message ?? 'Registration failed.');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      destroyPresence();
      setAuthUser(null);
    }
  };

  const handleUpdateName = async (name: string) => {
    try {
      const user = await updateUserName(name);
      setAuthUser(user);
      setAccountError(null);
      setAccountMessage('Profile updated.');
    } catch (err: any) {
      setAccountError(err?.message ?? 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (currentPassword: string, nextPassword: string) => {
    try {
      await changeUserPassword(currentPassword, nextPassword);
      setAccountError(null);
      setAccountMessage('Password updated.');
    } catch (err: any) {
      setAccountError(err?.message ?? 'Failed to update password.');
    }
  };

  const handleDeleteAccount = async (currentPassword: string) => {
    try {
      await deleteCurrentUser(currentPassword);
      setAuthUser(null);
      setAccountError(null);
      setAccountMessage(null);
      setIsAccountModalOpen(false);
    } catch (err: any) {
      setAccountError(err?.message ?? 'Failed to delete account.');
    }
  };

  const refreshTerritories = useCallback(async () => {
    setTerritoriesLoading(true);
    try {
      const next = await listTerritories();
      setTerritories(next);
    } catch {
      setTerritories([]);
    } finally {
      setTerritoriesLoading(false);
    }
  }, []);

  const refreshTerritoryPools = useCallback(async () => {
    try {
      const next = await listPools();
      setTerritoryPools(next);
    } catch {
      setTerritoryPools([]);
    }
  }, []);

  const refreshCharacters = useCallback(async () => {
    setCharactersLoading(true);
    try {
      const next = await listCharacters();
      setCharacters(next);
      setActiveCharacterIds(prev => prev.filter(id => next.some(c => c.id === id)));
    } catch {
      setCharacters([]);
      setActiveCharacterIds([]);
    } finally {
      setCharactersLoading(false);
    }
  }, []);

  const refreshEnvironments = useCallback(async () => {
    try {
      const next = await listEnvironments();
      setEnvironments(next);
      setActiveEnvironmentIds(prev => prev.filter(id => next.some(e => e.id === id)));
    } catch {
      setEnvironments([]);
    }
  }, []);

  const refreshOutfits = useCallback(async () => {
    try {
      const next = await listOutfits();
      setOutfits(next);
      setActiveOutfitIds(prev => prev.filter(id => next.some(o => o.id === id)));
    } catch {
      setOutfits([]);
    }
  }, []);

  const handleCreateCharacter = useCallback(async (input: CharacterIdentityInput) => {
    const created = await createCharacter(input);
    await refreshCharacters();
    return created;
  }, [refreshCharacters]);

  const handleUpdateCharacter = useCallback(async (id: string, input: CharacterIdentityInput) => {
    const updated = await updateCharacter(id, input);
    await refreshCharacters();
    return updated;
  }, [refreshCharacters]);

  const handleDeleteCharacter = useCallback(async (id: string) => {
    const deletedCharacter = characters.find(character => character.id === id) ?? null;
    await deleteStoredCharacter(id);
    await refreshCharacters();
    if (activeCharacterIds.includes(id)) {
      setActiveCharacterIds(prev => prev.filter(i => i !== id));
      if (deletedCharacter) {
        setBuilderNotice(`Removed "${deletedCharacter.name}" from the current workflow because it was deleted.`);
      }
    }
  }, [activeCharacterIds, characters, refreshCharacters]);

  const handleSelectCharacter = useCallback((id: string) => {
    setActiveCharacterIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    const char = characters.find(c => c.id === id);
    if (char) setBuilderNotice(`"${char.name}" toggled.`);
  }, [characters]);

  const handleRemoveCharacter = useCallback((id: string) => {
    setActiveCharacterIds(prev => prev.filter(i => i !== id));
  }, []);

  const handlePoseChange = useCallback((dimension: 'framing' | 'orientation' | 'energy' | 'gaze', value: string | null) => {
    switch (dimension) {
      case 'framing': setPoseFraming(value); break;
      case 'orientation': setPoseOrientation(value); break;
      case 'energy': setPoseEnergy(value); break;
      case 'gaze': setPoseGaze(value); break;
    }
  }, []);


  const handleCreateEnvironment = useCallback(async (input: EnvironmentIdentityInput) => {
    const created = await createEnvironment(input);
    await refreshEnvironments();
    return created;
  }, [refreshEnvironments]);

  const handleUpdateEnvironment = useCallback(async (id: string, input: EnvironmentIdentityInput) => {
    const updated = await updateEnvironment(id, input);
    await refreshEnvironments();
    return updated;
  }, [refreshEnvironments]);

  const handleDeleteEnvironment = useCallback(async (id: string) => {
    const deletedEnv = environments.find(e => e.id === id) ?? null;
    await deleteStoredEnvironment(id);
    await refreshEnvironments();
    if (activeEnvironmentIds.includes(id)) {
      setActiveEnvironmentIds(prev => prev.filter(i => i !== id));
      if (deletedEnv) {
        setBuilderNotice(`Removed "${deletedEnv.name}" from the current workflow because it was deleted.`);
      }
    }
  }, [activeEnvironmentIds, environments, refreshEnvironments]);

  const handleSelectEnvironment = useCallback((id: string) => {
    setActiveEnvironmentIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const handleRemoveEnvironment = useCallback((id: string) => {
    setActiveEnvironmentIds(prev => prev.filter(i => i !== id));
  }, []);

  const handleWorldVariationToggle = useCallback(() => {
    setWorldVariationEnabled(prev => {
      const next = !prev;
      if (next) setWorldVariationPhrases(getVariationPhrases());
      else setWorldVariationPhrases([]);
      return next;
    });
  }, []);

  const handleWorldVariationNext = useCallback(() => {
    setWorldVariationPhrases(prev => getVariationPhrases(prev));
  }, []);

  const pickAuraPhrases = useCallback((phrases: string[], min: number, max: number): string[] => {
    if (phrases.length === 0) return [];
    const lo = Math.max(1, Math.min(min, phrases.length));
    const hi = Math.max(lo, Math.min(max, phrases.length));
    const count = lo === hi ? lo : lo + Math.floor(Math.random() * (hi - lo + 1));
    return [...phrases].sort(() => Math.random() - 0.5).slice(0, count);
  }, []);

  const handleAuraVariationToggle = useCallback(() => {
    const willEnable = !auraVariationEnabled;
    setAuraVariationEnabled(willEnable);
    if (willEnable) {
      const phrases = activeWorld?.phrases ?? [];
      const sampled = pickAuraPhrases(phrases, auraVariationMin, auraVariationMax);
      setActiveChipTexts(prev => [
        ...prev.filter(t => !phrases.includes(t)),
        ...sampled,
      ]);
    }
  }, [auraVariationEnabled, activeWorld, auraVariationMin, auraVariationMax, pickAuraPhrases]);

  const handleAuraVariationNext = useCallback(() => {
    const phrases = activeWorld?.phrases ?? [];
    if (phrases.length === 0) return;
    const sampled = pickAuraPhrases(phrases, auraVariationMin, auraVariationMax);
    setActiveChipTexts(prev => [
      ...prev.filter(t => !phrases.includes(t)),
      ...sampled,
    ]);
  }, [activeWorld, auraVariationMin, auraVariationMax, pickAuraPhrases]);

  const handleAuraVariationMinChange = useCallback((val: number) => {
    setAuraVariationMin(val);
    setAuraVariationMax(prev => Math.max(prev, val));
  }, []);

  const handleAuraVariationMaxChange = useCallback((val: number) => {
    setAuraVariationMax(val);
    setAuraVariationMin(prev => Math.min(prev, val));
  }, []);

  const handleEnvironmentLightChange = useCallback((dimension: 'time' | 'weather' | 'scale' | 'condition', value: string | null) => {
    switch (dimension) {
      case 'time': setEnvTime(value); break;
      case 'weather': setEnvWeather(value); break;
      case 'scale': setEnvScale(value); break;
      case 'condition': setEnvCondition(value); break;
    }
  }, []);

  const handleCreateOutfit = useCallback(async (input: OutfitIdentityInput) => {
    const created = await createOutfit(input);
    await refreshOutfits();
    return created;
  }, [refreshOutfits]);

  const handleUpdateOutfit = useCallback(async (id: string, input: OutfitIdentityInput) => {
    const updated = await updateOutfit(id, input);
    await refreshOutfits();
    return updated;
  }, [refreshOutfits]);

  const handleDeleteOutfit = useCallback(async (id: string) => {
    await deleteStoredOutfit(id);
    await refreshOutfits();
    if (activeOutfitIds.includes(id)) {
      setActiveOutfitIds(prev => prev.filter(i => i !== id));
    }
  }, [activeOutfitIds, refreshOutfits]);

  const handleSelectOutfit = useCallback((id: string) => {
    setActiveOutfitIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const handleRemoveOutfit = useCallback((id: string) => {
    setActiveOutfitIds(prev => prev.filter(i => i !== id));
  }, []);

  const refreshStylePresets = useCallback(async () => {
    try {
      const next = await listStylePresets();
      setStylePresets(next);
      setActiveStyleIds(prev => prev.filter(id => next.some(i => i.id === id)));
    } catch {
      setStylePresets([]);
    }
  }, []);

  const handleCreateStylePreset = useCallback(async (input: StylePresetInput) => {
    const created = await createStylePreset(input);
    await refreshStylePresets();
    return created;
  }, [refreshStylePresets]);

  const handleUpdateStylePreset = useCallback(async (id: string, input: StylePresetInput) => {
    const updated = await updateStylePreset(id, input);
    await refreshStylePresets();
    return updated;
  }, [refreshStylePresets]);

  const handleDeleteStylePreset = useCallback(async (id: string) => {
    await deleteStoredStylePreset(id);
    await refreshStylePresets();
    if (activeStyleIds.includes(id)) setActiveStyleIds(prev => prev.filter(i => i !== id));
  }, [activeStyleIds, refreshStylePresets]);

  const handleSelectStylePreset = useCallback((id: string) => {
    setActiveStyleIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const handleRemoveStyle = useCallback((id: string) => {
    setActiveStyleIds(prev => prev.filter(i => i !== id));
  }, []);

  const refreshLightingSetups = useCallback(async () => {
    try {
      const next = await listLightingSetups();
      setLightingSetups(next);
      setActiveLightingIds(prev => prev.filter(id => next.some(i => i.id === id)));
    } catch {
      setLightingSetups([]);
    }
  }, []);

  const handleCreateLightingSetup = useCallback(async (input: LightingSetupInput) => {
    const created = await createLightingSetup(input);
    await refreshLightingSetups();
    return created;
  }, [refreshLightingSetups]);

  const handleUpdateLightingSetup = useCallback(async (id: string, input: LightingSetupInput) => {
    const updated = await updateLightingSetup(id, input);
    await refreshLightingSetups();
    return updated;
  }, [refreshLightingSetups]);

  const handleDeleteLightingSetup = useCallback(async (id: string) => {
    await deleteStoredLightingSetup(id);
    await refreshLightingSetups();
    if (activeLightingIds.includes(id)) setActiveLightingIds(prev => prev.filter(i => i !== id));
  }, [activeLightingIds, refreshLightingSetups]);

  const handleSelectLightingSetup = useCallback((id: string) => {
    setActiveLightingIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const handleRemoveLighting = useCallback((id: string) => {
    setActiveLightingIds(prev => prev.filter(i => i !== id));
  }, []);

  const refreshCompositionFrames = useCallback(async () => {
    try {
      const next = await listCompositionFrames();
      setCompositionFrames(next);
      setActiveCompositionIds(prev => prev.filter(id => next.some(i => i.id === id)));
    } catch {
      setCompositionFrames([]);
    }
  }, []);

  const handleCreateCompositionFrame = useCallback(async (input: CompositionFrameInput) => {
    const created = await createCompositionFrame(input);
    await refreshCompositionFrames();
    return created;
  }, [refreshCompositionFrames]);

  const handleUpdateCompositionFrame = useCallback(async (id: string, input: CompositionFrameInput) => {
    const updated = await updateCompositionFrame(id, input);
    await refreshCompositionFrames();
    return updated;
  }, [refreshCompositionFrames]);

  const handleDeleteCompositionFrame = useCallback(async (id: string) => {
    await deleteStoredCompositionFrame(id);
    await refreshCompositionFrames();
    if (activeCompositionIds.includes(id)) setActiveCompositionIds(prev => prev.filter(i => i !== id));
  }, [activeCompositionIds, refreshCompositionFrames]);

  const handleSelectCompositionFrame = useCallback((id: string) => {
    setActiveCompositionIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const handleRemoveComposition = useCallback((id: string) => {
    setActiveCompositionIds(prev => prev.filter(i => i !== id));
  }, []);

  const refreshMoodPresets = useCallback(async () => {
    try {
      const next = await listMoodPresets();
      setMoodPresets(next);
      setActiveMoodIds(prev => prev.filter(id => next.some(i => i.id === id)));
    } catch {
      setMoodPresets([]);
    }
  }, []);

  const handleCreateMoodPreset = useCallback(async (input: MoodPresetInput) => {
    const created = await createMoodPreset(input);
    await refreshMoodPresets();
    return created;
  }, [refreshMoodPresets]);

  const handleUpdateMoodPreset = useCallback(async (id: string, input: MoodPresetInput) => {
    const updated = await updateMoodPreset(id, input);
    await refreshMoodPresets();
    return updated;
  }, [refreshMoodPresets]);

  const handleDeleteMoodPreset = useCallback(async (id: string) => {
    await deleteStoredMoodPreset(id);
    await refreshMoodPresets();
    if (activeMoodIds.includes(id)) setActiveMoodIds(prev => prev.filter(i => i !== id));
  }, [activeMoodIds, refreshMoodPresets]);

  const handleSelectMoodPreset = useCallback((id: string) => {
    setActiveMoodIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const handleRemoveMood = useCallback((id: string) => {
    setActiveMoodIds(prev => prev.filter(i => i !== id));
  }, []);

  const handleToggleLaneLock = useCallback((lane: string) => {
    setLockedLanes(prev => {
      const next = new Set(prev);
      if (next.has(lane)) next.delete(lane); else next.add(lane);
      return next;
    });
  }, []);

  const handleTogglePin = useCallback((id: string) => {
    setPinnedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleRandomizeLanes = useCallback(() => {
    const pickN = <T extends { id: string }>(arr: T[], n: number): string[] => {
      if (arr.length === 0) return [];
      const shuffled = [...arr].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(n, arr.length)).map(i => i.id);
    };
    const locked = lockedLanes;
    const rollAll = locked.size === 0;
    const activeUniverse = activeUniverseId ? universes.find(u => u.id === activeUniverseId)?.pools : undefined;

    const scopeMulti = <T extends { id: string }>(full: T[], uids?: string[]): T[] =>
      uids && uids.length > 0 ? full.filter(x => uids.includes(x.id)) : full;

    // Keep pinned active items and only re-roll the remaining slots so the lane size is preserved.
    const rollMulti = <T extends { id: string }>(full: T[], activeIds: string[], uids?: string[]): string[] => {
      const pool = scopeMulti(full, uids);
      const pinnedActive = activeIds.filter(id => pinnedItems.has(id));
      const need = Math.max(1, activeIds.length) - pinnedActive.length;
      if (need <= 0) return pinnedActive;
      const candidates = pool.filter(x => !pinnedActive.includes(x.id));
      return [...pinnedActive, ...pickN(candidates, need)];
    };

    if (rollAll || locked.has('character')) {
      setActiveCharacterIds(rollMulti(characters, activeCharacterIds, activeUniverse?.character));
    }

    if (rollAll || locked.has('environment')) {
      setActiveEnvironmentIds(rollMulti(environments, activeEnvironmentIds, activeUniverse?.environment));
    }

    if (rollAll || locked.has('wardrobe')) {
      setActiveOutfitIds(rollMulti(outfits, activeOutfitIds, activeUniverse?.wardrobe));
    }

    if (rollAll || locked.has('style')) {
      setActiveStyleIds(rollMulti(stylePresets, activeStyleIds, activeUniverse?.style));
    }

    if (rollAll || locked.has('lighting')) {
      setActiveLightingIds(rollMulti(lightingSetups, activeLightingIds, activeUniverse?.lighting));
    }

    if (rollAll || locked.has('composition')) {
      setActiveCompositionIds(rollMulti(compositionFrames, activeCompositionIds, activeUniverse?.composition));
    }

    if (rollAll || locked.has('mood')) {
      setActiveMoodIds(rollMulti(moodPresets, activeMoodIds, activeUniverse?.mood));
    }

    if (rollAll || locked.has('object')) {
      setActiveObjectIds(rollMulti(objects, activeObjectIds, activeUniverse?.object));
    }

    if (rollAll || locked.has('dynamics')) {
      const others = INTERACTION_PHRASES.filter(p => p.id !== activeInteractionPhraseId);
      const pool = others.length > 0 ? others : INTERACTION_PHRASES;
      const picked = pool[Math.floor(Math.random() * pool.length)];
      setActiveInteractionPhraseId(picked.id);
    }

    if (rollAll || locked.has('aura')) {
      const auraPool = scopeMulti(worlds, activeUniverse?.aura);
      const pool = auraPool.length > 0 ? auraPool : worlds;
      if (pool.length > 0) {
        const picked = pool[Math.floor(Math.random() * pool.length)];
        setActiveWorld({ id: picked.id, name: picked.name, phrases: picked.phrases });
        setActiveChipTexts([]);
        setAuraVariationEnabled(false);
      }
    }
  }, [lockedLanes, pinnedItems, characters, environments, outfits, stylePresets, lightingSetups, compositionFrames, moodPresets, objects, activeCharacterIds, activeEnvironmentIds, activeOutfitIds, activeStyleIds, activeLightingIds, activeCompositionIds, activeMoodIds, activeObjectIds, activeInteractionPhraseId, worlds, activeUniverseId, universes]);

  const handleApplyLaneSet = useCallback((set: LaneSet) => {
    const { lanes } = set;
    const pickN = <T extends { id: string }>(pool: T[], n: number): string[] => {
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(n, shuffled.length)).map(x => x.id);
    };

    if (lanes.character.mode === 'fixed') setActiveCharacterIds(lanes.character.ids);
    else if (lanes.character.mode === 'random') setActiveCharacterIds(pickN(characters, lanes.character.count));
    else setActiveCharacterIds([]);

    if (lanes.dynamics.mode === 'fixed') setActiveInteractionPhraseId(lanes.dynamics.id);
    else if (lanes.dynamics.mode === 'random') {
      const picked = INTERACTION_PHRASES[Math.floor(Math.random() * INTERACTION_PHRASES.length)];
      setActiveInteractionPhraseId(picked.id);
    } else setActiveInteractionPhraseId(null);

    if (lanes.wardrobe.mode === 'fixed') setActiveOutfitIds(lanes.wardrobe.ids);
    else if (lanes.wardrobe.mode === 'random') setActiveOutfitIds(pickN(outfits, lanes.wardrobe.count));
    else setActiveOutfitIds([]);

    if (lanes.style.mode === 'fixed') setActiveStyleIds(lanes.style.ids);
    else if (lanes.style.mode === 'random') setActiveStyleIds(pickN(stylePresets, lanes.style.count));
    else setActiveStyleIds([]);

    if (lanes.lighting.mode === 'fixed') setActiveLightingIds(lanes.lighting.ids);
    else if (lanes.lighting.mode === 'random') setActiveLightingIds(pickN(lightingSetups, lanes.lighting.count));
    else setActiveLightingIds([]);

    if (lanes.composition.mode === 'fixed') setActiveCompositionIds(lanes.composition.ids);
    else if (lanes.composition.mode === 'random') setActiveCompositionIds(pickN(compositionFrames, lanes.composition.count));
    else setActiveCompositionIds([]);

    if (lanes.mood.mode === 'fixed') setActiveMoodIds(lanes.mood.ids);
    else if (lanes.mood.mode === 'random') setActiveMoodIds(pickN(moodPresets, lanes.mood.count));
    else setActiveMoodIds([]);

    if (lanes.environment.mode === 'fixed') setActiveEnvironmentIds(lanes.environment.ids);
    else if (lanes.environment.mode === 'random') setActiveEnvironmentIds(pickN(environments, lanes.environment.count));
    else setActiveEnvironmentIds([]);

    if (lanes.aura.mode === 'fixed') {
      const auraId = lanes.aura.id;
      const world = auraId ? worlds.find(w => w.id === auraId) : null;
      if (world) {
        setActiveWorld({ id: world.id, name: world.name, phrases: world.phrases });
      } else {
        setActiveWorld(null);
      }
      setActiveChipTexts([]);
      setAuraVariationEnabled(false);
    } else if (lanes.aura.mode === 'random') {
      if (worlds.length > 0) {
        const picked = worlds[Math.floor(Math.random() * worlds.length)];
        setActiveWorld({ id: picked.id, name: picked.name, phrases: picked.phrases });
        setActiveChipTexts([]);
        setAuraVariationEnabled(false);
      }
    } else {
      setActiveWorld(null);
      setActiveChipTexts([]);
      setAuraVariationEnabled(false);
    }
    setActiveLaneSetId(set.id);
  }, [characters, outfits, stylePresets, lightingSetups, compositionFrames, moodPresets, environments, worlds]);

  const handleClearAllLanes = useCallback(() => {
    setActiveCharacterIds([]);
    setActiveOutfitIds([]);
    setActiveStyleIds([]);
    setActiveLightingIds([]);
    setActiveCompositionIds([]);
    setActiveMoodIds([]);
    setActiveNegativeIds([]);
    setActiveObjectIds([]);
    setActiveEnvironmentIds([]);
    setActiveInteractionPhraseId(null);
    setActiveWorld(null);
    setActiveChipTexts([]);
    setWorldVariationEnabled(false);
    setWorldVariationPhrases([]);
    setAuraVariationEnabled(false);
    setActiveLaneSetId(null);
  }, []);

  const handleSaveCurrentAsLaneSet = useCallback((name: string, description?: string) => {
    const lanes: LaneSetLanes = {
      character: activeCharacterIds.length > 0 ? { mode: 'fixed', ids: activeCharacterIds } : { mode: 'off' },
      dynamics: activeInteractionPhraseId ? { mode: 'fixed', id: activeInteractionPhraseId } : { mode: 'off' },
      wardrobe: activeOutfitIds.length > 0 ? { mode: 'fixed', ids: activeOutfitIds } : { mode: 'off' },
      style: activeStyleIds.length > 0 ? { mode: 'fixed', ids: activeStyleIds } : { mode: 'off' },
      lighting: activeLightingIds.length > 0 ? { mode: 'fixed', ids: activeLightingIds } : { mode: 'off' },
      composition: activeCompositionIds.length > 0 ? { mode: 'fixed', ids: activeCompositionIds } : { mode: 'off' },
      mood: activeMoodIds.length > 0 ? { mode: 'fixed', ids: activeMoodIds } : { mode: 'off' },
      environment: activeEnvironmentIds.length > 0 ? { mode: 'fixed', ids: activeEnvironmentIds } : { mode: 'off' },
      aura: activeWorld ? { mode: 'fixed', id: activeWorld.id } : { mode: 'off' },
    };
    const created = createLaneSet({ name, description, lanes });
    setLaneSets(prev => [...prev, created]);
  }, [activeCharacterIds, activeInteractionPhraseId, activeOutfitIds, activeStyleIds, activeLightingIds, activeCompositionIds, activeMoodIds, activeEnvironmentIds, activeWorld]);

  const handleDeleteLaneSet = useCallback((id: string) => {
    deleteLaneSet(id);
    setLaneSets(prev => prev.filter(s => s.id !== id));
  }, []);

  const handleCreateUniverse = useCallback((input: UniverseInput) => {
    const created = createUniverse(input);
    setUniverses(prev => [...prev, created]);
  }, []);

  const handleUpdateUniversePools = useCallback((id: string, pools: Universe['pools']) => {
    const updated = updateUniversePools(id, pools);
    if (updated) setUniverses(prev => prev.map(u => u.id === id ? updated : u));
  }, []);

  const handleDeleteUniverse = useCallback((id: string) => {
    deleteUniverse(id);
    setUniverses(prev => prev.filter(u => u.id !== id));
    setActiveUniverseId(prev => prev === id ? null : prev);
  }, []);

  const handleActivateUniverse = useCallback((id: string) => {
    setActiveUniverseId(id);
  }, []);

  const handleDeactivateUniverse = useCallback(() => {
    setActiveUniverseId(null);
  }, []);

  const refreshNegativePresets = useCallback(async () => {
    try {
      const next = await listNegativePresets();
      setNegativePresets(next);
    } catch {
      setNegativePresets([]);
    }
  }, []);

  const handleCreateNegativePreset = useCallback(async (input: NegativePresetInput) => {
    const created = await createNegativePreset(input);
    await refreshNegativePresets();
    return created;
  }, [refreshNegativePresets]);

  const handleUpdateNegativePreset = useCallback(async (id: string, input: NegativePresetInput) => {
    const updated = await updateNegativePreset(id, input);
    await refreshNegativePresets();
    return updated;
  }, [refreshNegativePresets]);

  const handleDeleteNegativePreset = useCallback(async (id: string) => {
    await deleteStoredNegativePreset(id);
    await refreshNegativePresets();
    setActiveNegativeIds(prev => prev.filter(eid => eid !== id));
  }, [refreshNegativePresets]);

  const handleAddNegativePreset = useCallback((id: string) => {
    setActiveNegativeIds(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const handleRemoveNegativePreset = useCallback((id: string) => {
    setActiveNegativeIds(prev => prev.filter(eid => eid !== id));
  }, []);

  const handleAddObject = useCallback((id: string) => {
    setActiveObjectIds(prev => prev.includes(id) ? prev : [...prev, id]);
    setObjects(listObjects());
  }, []);

  const handleRemoveObject = useCallback((id: string) => {
    setActiveObjectIds(prev => prev.filter(eid => eid !== id));
  }, []);

  useEffect(() => {
    setObjects(listObjects());
  }, []);

  useEffect(() => {
    void refreshCharacters();
  }, [refreshCharacters]);

  useEffect(() => {
    void refreshEnvironments();
  }, [refreshEnvironments]);

  useEffect(() => {
    void refreshOutfits();
  }, [refreshOutfits]);

  useEffect(() => {
    void refreshStylePresets();
  }, [refreshStylePresets]);

  useEffect(() => {
    void refreshLightingSetups();
  }, [refreshLightingSetups]);

  useEffect(() => {
    void refreshCompositionFrames();
  }, [refreshCompositionFrames]);

  useEffect(() => {
    void refreshMoodPresets();
  }, [refreshMoodPresets]);

  useEffect(() => {
    void refreshNegativePresets();
  }, [refreshNegativePresets]);

  const handleCommunityIdentityAdded = useCallback(async () => {
    await Promise.all([
      refreshCharacters(),
      refreshEnvironments(),
      refreshOutfits(),
      refreshStylePresets(),
      refreshLightingSetups(),
      refreshCompositionFrames(),
      refreshMoodPresets(),
      refreshNegativePresets(),
    ]);
  }, [refreshCharacters, refreshEnvironments, refreshOutfits, refreshStylePresets, refreshLightingSetups, refreshCompositionFrames, refreshMoodPresets, refreshNegativePresets]);

  const handleViewCreator = useCallback((creatorAuthUid: string, name: string) => {
    setSelectedCreatorProfileTarget({ creatorAuthUid, creatorName: name });
    setActivePage('creator-profile');
  }, []);

  const [dmInitialRecipient, setDmInitialRecipient] = useState<{ authUid: string; name: string } | null>(null);
  const [dmUnreadCount, setDmUnreadCount] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedIdentity, setSelectedIdentity] = useState<SharedIdentityData | null>(null);

  const handleOpenPost = useCallback((postId: string) => {
    setSelectedPostId(postId);
    setActivePage('post-detail');
  }, []);

  const handleOpenIdentity = useCallback((identity: SharedIdentityData) => {
    setSelectedIdentity(identity);
    setActivePage('identity-detail');
  }, []);

  const handleStartDM = useCallback((recipientAuthUid: string, recipientName: string) => {
    setDmInitialRecipient({ authUid: recipientAuthUid, name: recipientName });
    setDmUnreadCount(0);
    setActivePage('messages');
  }, []);

  useEffect(() => {
    if (!authUser) { setDmUnreadCount(0); return; }
    if (activePage === 'messages') { setDmUnreadCount(0); return; }
    const uid = authUser.authUid;
    void getUnreadDMCount(uid).then(setDmUnreadCount);
    const unsubscribe = subscribeToIncomingDMs(uid, () => {
      setDmUnreadCount(prev => prev + 1);
    });
    return unsubscribe;
  }, [authUser, activePage]);

  const handleNotificationNavigate = useCallback((n: Notification) => {
    const p = n.payload;
    switch (n.type) {
      case 'dm_received':
        if (typeof p.senderAuthUid === 'string' && typeof p.senderName === 'string') {
          handleStartDM(p.senderAuthUid, p.senderName);
        } else {
          setActivePage('messages');
        }
        break;
      case 'new_follower':
        if (typeof p.followerAuthUid === 'string' && typeof p.followerName === 'string') {
          handleViewCreator(p.followerAuthUid, p.followerName);
        } else {
          setActivePage('community');
        }
        break;
      case 'wall_post_liked':
        if (typeof p.postId === 'string') {
          handleOpenPost(p.postId);
        } else {
          setActivePage('community');
        }
        break;
      case 'wall_post_replied':
        if (typeof p.parentPostId === 'string') {
          handleOpenPost(p.parentPostId);
        } else {
          setActivePage('community');
        }
        break;
      case 'identity_remixed':
        if (typeof p.remixIdentityId === 'string') {
          void getIdentityById(p.remixIdentityId).then(identity => {
            if (identity) {
              handleOpenIdentity({
                id: identity.id,
                name: identity.name,
                type: identity.type,
                phrases: identity.phrases,
                summary: identity.summary,
                authorName: identity.authorName,
                authorId: identity.authorId,
                remixCount: identity.remixCount,
                parentId: identity.parentId,
                createdAt: identity.createdAt,
              });
            } else {
              setActivePage('community');
            }
          });
        } else {
          setActivePage('community');
        }
        break;
      case 'badge_earned':
      case 'xp_milestone':
        setActivePage('my-profile');
        break;
      case 'challenge_won':
        setActivePage('community');
        break;
      default:
        setActivePage('community');
    }
  }, [handleStartDM, handleViewCreator, handleOpenPost, handleOpenIdentity]);

  const handleSetActiveTerritory = (id: string | null) => {
    setActiveTerritory(id);
    persistActiveTerritoryId(id);
  };

  const handleUseTerritoryInBuilder = (id: string | null) => {
    handleSetActiveTerritory(id);
    setTerritoryNavigationMode('biased');
    setActivePage('generator');
    const territory = territories.find(entry => entry.id === id) ?? null;
    void trackAnalyticsEvent({
      eventType: territory ? 'territory_activate' : 'territory_deactivate',
      pageKey: 'generator',
      userId: authUser?.id ?? null,
      metadata: territory
        ? {
            territoryId: territory.id,
            territoryName: territory.name,
            sourceCount: territory.sources.length,
          }
        : null,
    });
    const preferredStartNodeId = territory
      ? getPreferredStartNodeIdForCategoryIds(
          [...new Set(
            territory.sources.flatMap(source => TERRITORY_SECTION_CATEGORY_MAP[source.section] ?? [])
          )]
        )
      : '';
    if (preferredStartNodeId) {
      setCurrentNodeId(preferredStartNodeId);
      setNavigationHistory([preferredStartNodeId]);
      setHasReachedEndViaNext(false);
      setUnavailableJumpNodeId(null);
    }
    setBuilderNotice(
      territory
        ? `"${territory.name}" is now active and Builder is starting from a matching area first.`
        : 'Territory mode is off.'
    );
  };

  useEffect(() => {
    if (territoryNavigationMode !== 'biased' || !activeTerritoryId || activeTerritoryCategoryIds.length === 0) {
      return;
    }

    const key = `${activeTerritoryId}:${territoryNavigationMode}`;
    if (lastTerritoryRepositionKeyRef.current === key) {
      return;
    }

    const currentCategoryId = getCategoryForNode(currentNodeId);
    const currentInsideTerritory = currentCategoryId ? activeTerritoryCategoryIds.includes(currentCategoryId) : false;
    if (currentInsideTerritory) {
      lastTerritoryRepositionKeyRef.current = key;
      return;
    }

    const preferredStartNodeId = getPreferredTerritoryStartNodeId();
    if (!preferredStartNodeId || preferredStartNodeId === currentNodeId) {
      lastTerritoryRepositionKeyRef.current = key;
      return;
    }

    setCurrentNodeId(preferredStartNodeId);
    setNavigationHistory([preferredStartNodeId]);
    setHasReachedEndViaNext(false);
    setUnavailableJumpNodeId(null);
    lastTerritoryRepositionKeyRef.current = key;
  }, [activeTerritoryCategoryIds, activeTerritoryId, currentNodeId, getCategoryForNode, getPreferredTerritoryStartNodeId, territoryNavigationMode]);

  const handleOpenTerritoryEditor = (territoryId: string) => {
    setTerritoryEditTargetId(territoryId);
    setActivePage('user-pools');
  };

  const handleOpenTerritoryWorkspaceSources = useCallback(() => {
    setTerritoryEditTargetId(null);
    setActivePage('user-pools');
  }, []);

  const handleCreateTerritory = async (
    name: string,
    description: string,
    sources: TerritorySourceInput[]
  ) => {
    try {
      const created = await createTerritory(name, description, sources);
      await refreshTerritories();
      return created;
    } catch {
      return null;
    }
  };

  const handleUpdateTerritory = async (
    id: string,
    patch: { name?: string; description?: string; sources?: TerritorySourceInput[] }
  ) => {
    try {
      const updated = await updateTerritory(id, patch);
      await refreshTerritories();
      return updated;
    } catch {
      return null;
    }
  };

  const handleDeleteTerritory = async (id: string) => {
    await deleteTerritory(id);
    await refreshTerritories();
    if (activeTerritoryId === id) {
      handleSetActiveTerritory(null);
    }
  };

  const handleRemoveActiveTerritorySource = async (sourceId: string) => {
    if (!activeTerritory) return;
    if (activeTerritory.sources.length <= 1) {
      setBuilderNotice('A Territory needs at least one source. Remove the Territory instead if you want to clear it.');
      return;
    }

    const nextSources = activeTerritory.sources
      .filter(source => source.id !== sourceId)
      .map(source => ({
        poolId: source.poolId,
        poolName: source.poolName,
        section: source.section,
      }));

    const updated = await handleUpdateTerritory(activeTerritory.id, {
      name: activeTerritory.name,
      description: activeTerritory.description ?? '',
      sources: nextSources,
    });

    if (updated) {
      setBuilderNotice(`Removed one source from "${updated.name}".`);
    } else {
      setBuilderNotice('Failed to update the active Territory.');
    }
  };

  useEffect(() => {
    if (questionNodes.length === 0) return;
    const initialId = getPreferredTerritoryStartNodeId() || getInitialUsableNodeId() || getInitialNodeId(questionNodes);
    if (initialId) {
      setCurrentNodeId(prev => prev || initialId);
      setNavigationHistory(prev => prev.length > 0 ? prev : [initialId]);
      setHasReachedEndViaNext(false);
    }
  }, [questionNodes.length, getInitialNodeId, getInitialUsableNodeId, getPreferredTerritoryStartNodeId]);

  useEffect(() => {
    setSelections(prev => {
      const next = new Map<string, AttributeSelection>();
      prev.forEach((selection, id) => {
        if (effectiveDefinitionIds.has(id)) {
          next.set(id, selection);
        }
      });
      if (next.size !== prev.size) {
        setBuilderNotice('Some selections were removed because they are not available in this set.');
      }
      return next.size === prev.size ? prev : next;
    });

    setModifiers(prev => {
      const next = new Map<string, Modifier>();
      prev.forEach((modifier, id) => {
        if (effectiveDefinitionIds.has(id)) {
          next.set(id, modifier);
        }
      });
      return next.size === prev.size ? prev : next;
    });

    setSelectionOutputOverrides(prev => {
      const next = new Map<string, string>();
      prev.forEach((value, id) => {
        if (effectiveDefinitionIds.has(id)) {
          next.set(id, value);
        }
      });
      return next.size === prev.size ? prev : next;
    });
  }, [effectiveDefinitionIds]);

  useEffect(() => {
    if (!builderNotice) return;

    const timeoutId = window.setTimeout(() => {
      setBuilderNotice(null);
    }, 4500);

    return () => window.clearTimeout(timeoutId);
  }, [builderNotice]);

  useEffect(() => {
    if (!topToastMessage) return;

    const timeoutId = window.setTimeout(() => {
      setTopToastMessage(null);
    }, 3200);

    return () => window.clearTimeout(timeoutId);
  }, [topToastMessage]);

  useEffect(() => {
    if (questionNodes.length === 0) return;
    if (usableNodeIds.length === 0) {
      setUnavailableJumpNodeId('__builder_empty__');
      return;
    }

    if (unavailableJumpNodeId && unavailableJumpNodeId !== '__builder_empty__') {
      return;
    }

    if (currentNodeId && usableNodeIds.includes(currentNodeId)) {
      if (unavailableJumpNodeId === '__builder_empty__') {
        setUnavailableJumpNodeId(null);
      }
      return;
    }

    const nextNodeId = getAdjacentUsableNodeId(currentNodeId, 'next')
      ?? getAdjacentUsableNodeId(currentNodeId, 'previous')
      ?? usableNodeIds[0];

    if (nextNodeId) {
      setCurrentNodeId(nextNodeId);
      setNavigationHistory(prev => {
        const filtered = prev.filter(nodeId => usableNodeIds.includes(nodeId));
        if (filtered[filtered.length - 1] === nextNodeId) return filtered;
        return [...filtered, nextNodeId];
      });
      if (unavailableJumpNodeId === '__builder_empty__') {
        setUnavailableJumpNodeId(null);
      }
    }
  }, [questionNodes.length, usableNodeIds, currentNodeId, getAdjacentUsableNodeId, unavailableJumpNodeId]);

  /**
   * Event Handler: Randomize prompt
   * Applies random selections from the Random Prompt Generator
   */
  const handleRandomize = useCallback((randomSelections: AttributeSelection[]) => {
    // Clear existing selections
    setSelections(new Map());
    setModifiers(new Map());
    // Keep weights off by default after randomize unless the user enables them
    setWeightsEnabledGlobal(false);
    setSelectionOutputOverrides(new Map());

    // Apply random selections
    const newSelections = new Map<string, AttributeSelection>();
    randomSelections.forEach(selection => {
      newSelections.set(selection.attributeId, selection);
    });
    setSelections(newSelections);
  }, []);

  const handleAddPoolItem = useCallback((text: string, section?: string) => {
    if (!text.trim()) return;
    const id = `pool_add_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setPoolPromptItems(prev => [...prev, { id, text: text.trim(), weight: 1.0, section, sourceType: 'pool' }]);
  }, []);

  const handleAppendPoolItem = useCallback((text: string, targetId?: string, section?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setPoolPromptItems(prev => {
      if (prev.length === 0) {
        const id = `pool_add_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        return [...prev, { id, text: trimmed, weight: 1.0, section, sourceType: 'pool' }];
      }
      const next = [...prev];
      let targetIndex = targetId ? next.findIndex(item => item.id === targetId) : next.length - 1;
      if (targetIndex === -1) targetIndex = next.length - 1;
      const target = next[targetIndex];
      const mergedSection =
        target.section && section && target.section !== section
          ? undefined
          : target.section ?? section;
      const override = poolOutputOverrides.get(target.id);
      if (override) {
        next[targetIndex] = { ...target, section: mergedSection };
        setPoolOutputOverrides(prevOverrides => {
          const updated = new Map(prevOverrides);
          updated.set(target.id, `${override} ${trimmed}`);
          return updated;
        });
        return next;
      }
      next[targetIndex] = { ...target, text: `${target.text} ${trimmed}`, section: mergedSection };
      return next;
    });
  }, [poolOutputOverrides]);

  const handleRandomizePoolItems = useCallback((items: Array<{ text: string; section?: string }>) => {
    const next = items
      .map(item => ({
        id: `pool_add_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        text: item.text.trim(),
        weight: 1.0,
        section: item.section,
        sourceType: 'pool' as const,
      }))
      .filter(item => item.text);
    setPoolPromptItems(next);
    setPoolOutputOverrides(new Map());
  }, []);

  const handleSetPoolOutputOverride = useCallback((itemId: string, value: string | null) => {
    setPoolOutputOverrides(prev => {
      const next = new Map(prev);
      if (!value || !value.trim()) {
        next.delete(itemId);
      } else {
        next.set(itemId, value.trim());
      }
      return next;
    });
  }, []);

  const applyIdpSetToSession = useCallback((pool: Pool, setId?: string | null) => {
    if (!pool.idpSets || pool.idpSets.length === 0) {
      setActiveIdpPool(null);
      setActiveIdpSetId(null);
      return;
    }
    const nextSet = pool.idpSets.find(set => set.id === setId) ?? pool.idpSets[0];
    if (!nextSet) return;
    const nextItems = nextSet.phrases
      .map(phrase => ({
        id: `pool_idp_${pool.id}_${nextSet.id}_${phrase.id}`,
        text: phrase.text.trim(),
        weight: 1.0,
        sourceType: 'idp-set' as const,
      }))
      .filter(item => item.text);

    setPoolPromptItems(prev => {
      const preserved = prev.filter(item => {
        if (item.sourceType === 'idp-set' && item.id.startsWith(`pool_idp_${pool.id}_`)) {
          return false;
        }
        return true;
      });
      return [...preserved, ...nextItems];
    });
    setPoolOutputOverrides(prev => {
      const updated = new Map(prev);
      [...updated.keys()].forEach(key => {
        if (key.startsWith(`pool_idp_${pool.id}_`)) {
          updated.delete(key);
        }
      });
      return updated;
    });
    setActiveIdpPool(pool);
    setActiveIdpSetId(nextSet.id);
  }, []);

  const handleApplyPoolInitiativePhrases = useCallback((phrases: Array<{ id: string; text: string }>, pool: Pool) => {
    const next = phrases
      .map(phrase => ({
        id: `pool_default_${pool.id}_${phrase.id}`,
        text: phrase.text.trim(),
        weight: 1.0,
        sourceType: 'pool-default' as const,
      }))
      .filter(entry => entry.text);
    if (next.length === 0) return;
    setPoolPromptItems(prev => {
      const nextIds = new Set(next.map(entry => entry.id));
      const preserved = prev.filter(entry => !nextIds.has(entry.id));
      return [...preserved, ...next];
    });
    if (pool.idpSets && pool.idpSets.length > 0) {
      applyIdpSetToSession(pool, pool.idpSets[0]?.id ?? null);
      setPoolPromptItems(prev => {
        const withoutDuplicates = prev.filter(item => !next.some(entry => entry.id === item.id));
        return [...withoutDuplicates, ...next];
      });
      setPoolOutputOverrides(prev => {
        const updated = new Map(prev);
        [...updated.keys()].forEach(key => {
          if (key.startsWith(`pool_default_${pool.id}_`)) {
            updated.delete(key);
          }
        });
        return updated;
      });
    } else {
      setActiveIdpPool(null);
      setActiveIdpSetId(null);
    }
    setBuilderNotice(`Applied ${next.length} default phrase${next.length === 1 ? '' : 's'} from "${pool.name}".`);
  }, [applyIdpSetToSession]);

  const handleSelectActiveIdpSet = useCallback((setId: string) => {
    if (!activeIdpPool?.idpSets || activeIdpPool.idpSets.length === 0) return;
    const nextSet = activeIdpPool.idpSets.find(set => set.id === setId);
    if (!nextSet) return;
    applyIdpSetToSession(activeIdpPool, nextSet.id);
    setBuilderNotice(`Active IDP set changed to "${nextSet.name}".`);
  }, [activeIdpPool, applyIdpSetToSession]);

  const handleToggleTerritoryItem = useCallback((item: {
    id: string;
    text: string;
    section?: string;
  }) => {
    setPoolPromptItems(prev => {
      const exists = prev.some(entry => entry.id === item.id);
      if (exists) {
        return prev.filter(entry => entry.id !== item.id);
      }
      return [...prev, { id: item.id, text: item.text.trim(), weight: 1.0, section: item.section, sourceType: 'territory' }];
    });
    setPoolOutputOverrides(prev => {
      const next = new Map(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      }
      return next;
    });
  }, []);

  const handleSetPromptAdditionWeight = useCallback((itemId: string, value: number) => {
    setPoolPromptItems(prev => prev.map(item => (
      item.id === itemId ? { ...item, weight: Math.max(0, Math.min(2, value)) } : item
    )));
  }, []);

  const handleSetSelectionOutputOverride = useCallback((attributeId: string, value: string | null) => {
    setSelectionOutputOverrides(prev => {
      const next = new Map(prev);
      if (!value || !value.trim()) {
        next.delete(attributeId);
      } else {
        next.set(attributeId, value.trim());
      }
      return next;
    });
  }, []);

  const replaceIdentityBaselineForPool = useCallback((pool: Pool | null, setId?: string | null) => {
    const autoInitiativeEntries = pool
      ? (pool.initiativePhrases ?? [])
          .filter(phrase => phrase.autoApplyOnActivate)
          .map(phrase => ({
            id: `pool_default_${pool.id}_${phrase.id}`,
            text: phrase.text.trim(),
            weight: 1.0,
            sourceType: 'pool-default' as const,
          }))
          .filter(entry => entry.text)
      : [];

    const resolvedSet = pool?.idpSets?.find(set => set.id === setId)
      ?? pool?.idpSets?.[0]
      ?? null;

    const idpEntries = pool && resolvedSet
      ? resolvedSet.phrases
          .map(phrase => ({
            id: `pool_idp_${pool.id}_${resolvedSet.id}_${phrase.id}`,
            text: phrase.text.trim(),
            weight: 1.0,
            sourceType: 'idp-set' as const,
          }))
          .filter(entry => entry.text)
      : [];

    setPoolPromptItems(prev => {
      const preserved = prev.filter(item => item.sourceType !== 'pool-default' && item.sourceType !== 'idp-set');
      return [...preserved, ...idpEntries, ...autoInitiativeEntries];
    });

    setPoolOutputOverrides(prev => {
      const next = new Map(prev);
      poolPromptItems.forEach(item => {
        if (item.sourceType === 'pool-default' || item.sourceType === 'idp-set') {
          next.delete(item.id);
        }
      });
      return next;
    });

    if (pool && resolvedSet) {
      setActiveIdpPool(pool);
      setActiveIdpSetId(resolvedSet.id);
    } else {
      setActiveIdpPool(null);
      setActiveIdpSetId(null);
    }
  }, [poolPromptItems]);

  useEffect(() => {
    if (!activeTerritory) return;

    const activeTerritoryPoolIds = new Set(activeTerritory.sources.map(source => source.poolId));
    if (activeIdpPool && activeTerritoryPoolIds.has(activeIdpPool.id)) {
      return;
    }

    const candidatePool = activeTerritory.sources
      .map(source => territoryPools.find(pool => pool.id === source.poolId))
      .find((pool): pool is Pool => Boolean(
        pool && (
          (pool.idpSets && pool.idpSets.length > 0)
          || (pool.initiativePhrases ?? []).some(phrase => phrase.autoApplyOnActivate)
        )
      ));

    if (!candidatePool) {
      replaceIdentityBaselineForPool(null, null);
      return;
    }

    replaceIdentityBaselineForPool(candidatePool, candidatePool.idpSets?.[0]?.id ?? null);
  }, [activeTerritory, activeIdpPool, replaceIdentityBaselineForPool, territoryPools]);

  const handleClearPrompt = useCallback(() => {
    const hasSelections = selections.size > 0;
    const hasModifiers = modifiers.size > 0;
    const hasPoolItems = poolPromptItems.length > 0;
    const hasPromptFragments = selectedPromptFragments.length > 0;
    const hasCharacter = activeCharacterIds.length > 0;
    if (!hasSelections && !hasModifiers && !hasPoolItems && !hasPromptFragments && !hasCharacter) {
      return;
    }
    setClearUndoState({
      selections: new Map(selections),
      modifiers: new Map(modifiers),
      poolPromptItems: [...poolPromptItems],
      poolOutputOverrides: new Map(poolOutputOverrides),
      selectionOutputOverrides: new Map(selectionOutputOverrides),
      selectedPromptFragments: [...selectedPromptFragments],
      activeCharacterIds: [...activeCharacterIds],
      activeOutfitIds: [...activeOutfitIds],
      activeStyleIds: [...activeStyleIds],
      activeLightingIds: [...activeLightingIds],
      activeCompositionIds: [...activeCompositionIds],
      activeMoodIds: [...activeMoodIds],
      poseFraming,
      poseOrientation,
      poseEnergy,
      poseGaze,
      activeEnvironmentIds: [...activeEnvironmentIds],
      envTime,
      envWeather,
      envScale,
      envCondition,
    });
    setSelections(new Map());
    setModifiers(new Map());
    setPoolPromptItems(poolPromptItems.filter(item => item.sourceType === 'pool-default' || item.sourceType === 'idp-set'));
    setPoolOutputOverrides(prev => {
      const preservedIds = new Set(
        poolPromptItems
          .filter(item => item.sourceType === 'pool-default' || item.sourceType === 'idp-set')
          .map(item => item.id)
      );
      const next = new Map<string, string>();
      prev.forEach((value, key) => {
        if (preservedIds.has(key)) next.set(key, value);
      });
      return next;
    });
    setSelectionOutputOverrides(new Map());
    setSelectedPromptFragments([]);
    setActiveCharacterIds([]);
    setPoseFraming(null);
    setPoseOrientation(null);
    setPoseEnergy(null);
    setPoseGaze(null);
    setActiveEnvironmentIds([]);
    setEnvTime(null);
    setEnvWeather(null);
    setEnvScale(null);
    setEnvCondition(null);
  }, [selections, modifiers, poolPromptItems, poolOutputOverrides, selectionOutputOverrides, selectedPromptFragments, activeCharacterIds, activeOutfitIds, activeStyleIds, activeLightingIds, activeCompositionIds, activeMoodIds, poseFraming, poseOrientation, poseEnergy, poseGaze, activeEnvironmentIds, envTime, envWeather, envScale, envCondition]);

  const handleUndoClearPrompt = useCallback(() => {
    if (!clearUndoState) return;
    setSelections(new Map(clearUndoState.selections));
    setModifiers(new Map(clearUndoState.modifiers));
    setPoolPromptItems([...clearUndoState.poolPromptItems]);
    setPoolOutputOverrides(new Map(clearUndoState.poolOutputOverrides));
    setSelectionOutputOverrides(new Map(clearUndoState.selectionOutputOverrides));
    setSelectedPromptFragments([...clearUndoState.selectedPromptFragments]);
    setActiveCharacterIds([...clearUndoState.activeCharacterIds]);
    setActiveOutfitIds([...clearUndoState.activeOutfitIds]);
    setActiveStyleIds([...clearUndoState.activeStyleIds]);
    setActiveLightingIds([...clearUndoState.activeLightingIds]);
    setActiveCompositionIds([...clearUndoState.activeCompositionIds]);
    setActiveMoodIds([...clearUndoState.activeMoodIds]);
    setPoseFraming(clearUndoState.poseFraming);
    setPoseOrientation(clearUndoState.poseOrientation);
    setPoseEnergy(clearUndoState.poseEnergy);
    setPoseGaze(clearUndoState.poseGaze);
    setActiveEnvironmentIds([...clearUndoState.activeEnvironmentIds]);
    setEnvTime(clearUndoState.envTime);
    setEnvWeather(clearUndoState.envWeather);
    setEnvScale(clearUndoState.envScale);
    setEnvCondition(clearUndoState.envCondition);
    setClearUndoState(null);
  }, [clearUndoState]);

  const handleEditedOutputChange = useCallback((positive: string | null, negative: string | null) => {
    setEditedPositiveOutput(positive);
    setEditedNegativeOutput(negative);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        CUSTOM_PROMPT_FRAGMENTS_STORAGE_KEY,
        JSON.stringify(customPromptFragments)
      );
    } catch {
      // Ignore persistence errors and keep the session usable.
    }
  }, [customPromptFragments]);

  useEffect(() => {
    try {
      const snapshot: BuilderSessionSnapshot = {
        selections: Array.from(selections.values()),
        modifiers: Array.from(modifiers.values()),
        weightsEnabledGlobal,
        poolPromptItems,
        poolOutputOverrides: Array.from(poolOutputOverrides.entries()),
        selectionOutputOverrides: Array.from(selectionOutputOverrides.entries()),
        selectedPromptFragments,
        editedPositiveOutput,
        editedNegativeOutput,
        exportMode,
        currentNodeId,
        navigationHistory,
        hasReachedEndViaNext,
        activeChipTexts,
        activeIdpSetId,
        activeCharacterIds,
        activeOutfitIds,
        activeStyleIds,
        activeLightingIds,
        activeCompositionIds,
        activeMoodIds,
        activeNegativeIds,
        activeObjectIds,
        activeWorld,
        poseFraming,
        poseOrientation,
        poseEnergy,
        poseGaze,
        activeEnvironmentIds,
        envTime,
        envWeather,
        envScale,
        envCondition,
        captureBuffer,
        activeLaneSetId,
        activeUniverseId,
      };
      window.localStorage.setItem(BUILDER_SESSION_STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // Ignore persistence errors and keep the session usable.
    }
  }, [
    selections,
    modifiers,
    weightsEnabledGlobal,
    poolPromptItems,
    poolOutputOverrides,
    selectionOutputOverrides,
    selectedPromptFragments,
    editedPositiveOutput,
    editedNegativeOutput,
    exportMode,
    currentNodeId,
    navigationHistory,
    hasReachedEndViaNext,
    activeChipTexts,
    activeIdpSetId,
    activeCharacterIds,
    activeOutfitIds,
    activeStyleIds,
    activeLightingIds,
    activeCompositionIds,
    activeMoodIds,
    activeNegativeIds,
    activeObjectIds,
    poseFraming,
    poseOrientation,
    poseEnergy,
    poseGaze,
    activeEnvironmentIds,
    envTime,
    envWeather,
    envScale,
    envCondition,
    captureBuffer,
    activeLaneSetId,
    activeUniverseId,
  ]);

  const handleTogglePromptFragment = useCallback((fragmentId: string) => {
    setSelectedPromptFragments(prev => (
      prev.some(item => item.id === fragmentId)
        ? prev.filter(item => item.id !== fragmentId)
        : [...prev, { id: fragmentId }]
    ));
  }, []);

  const handleAddCustomPromptFragment = useCallback((text: string) => {
    const normalized = text.trim().replace(/\s+/g, ' ');
    if (!normalized) return;

    setCustomPromptFragments(prev => {
      const duplicate = prev.some(item => item.outputText.toLowerCase() === normalized.toLowerCase());
      if (duplicate) return prev;

      return [
        ...prev,
        {
          id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          label: normalized,
          outputText: normalized,
          tags: ['custom'],
        },
      ];
    });
  }, []);

  const handleRemoveCustomPromptFragment = useCallback((fragmentId: string) => {
    setCustomPromptFragments(prev => prev.filter(item => item.id !== fragmentId));
    setSelectedPromptFragments(prev => prev.filter(item => item.id !== fragmentId));
  }, []);

  // Convert Map state to props format for children
  const selectionsMap = new Map<string, { isEnabled: boolean; customExtension: string | null }>();
  selections.forEach((selection, id) => {
    selectionsMap.set(id, {
      isEnabled: selection.isEnabled,
      customExtension: selection.customExtension,
    });
  });

  const modifierValues = new Map<string, number>();
  modifiers.forEach((modifier, id) => {
    modifierValues.set(id, modifier.value);
  });

  

  const formatPromptAdditionText = useCallback((item: PromptAdditionItem) => {
    const override = poolOutputOverrides.get(item.id);
    const baseText = override ? override : item.text;
    const weight = item.weight ?? 1.0;
    if (weightsEnabledGlobal && Math.abs(weight - 1.0) > 0.001) {
      return `(${baseText}:${weight.toFixed(2)})`;
    }
    return baseText;
  }, [poolOutputOverrides, weightsEnabledGlobal]);

  const poolAdditionTexts = poolPromptItems.map(formatPromptAdditionText);
  const poolAdditionItems = poolPromptItems.map(item => {
    return { id: item.id, text: formatPromptAdditionText(item), section: item.section };
  });
  const availablePromptFragments = useMemo(
    () => [...PROMPT_FRAGMENT_DEFINITIONS, ...customPromptFragments],
    [customPromptFragments]
  );
  const promptAdditionEntries = useMemo<PromptAdditionEntry[]>(() => {
    const characterEntries: PromptAdditionEntry[] = activeCharacterProjections.flatMap(proj =>
      proj.corePhrases
        .map((text, index) => ({
          id: `character:${proj.characterId}:${index}`,
          text,
          position: 'start' as const,
          section: 'Character',
          sourceType: 'character' as const,
        }))
        .filter(entry => Boolean(entry.text))
    );

    const fragmentEntries = selectedPromptFragments
      .map(fragment => {
        const definition = availablePromptFragments.find(item => item.id === fragment.id);
        if (!definition) return null;
        return {
          id: `fragment:${fragment.id}`,
          text: definition.outputText,
          position: 'start',
          sourceType: 'fragment' as const,
        };
      })
      .filter(Boolean) as PromptAdditionEntry[];

    const poolEntries: PromptAdditionEntry[] = poolPromptItems.map(item => ({
      id: item.id,
      text: formatPromptAdditionText(item),
      position:
        item.sourceType === 'idp-set'
          ? 'start'
          : item.sourceType === 'pool-default'
            ? 'start'
            : 'end',
      section: item.section,
      sourceType: item.sourceType ?? 'pool',
    }));

    const posePhrases = [poseFraming, poseOrientation, poseEnergy, poseGaze].filter(Boolean) as string[];
    const poseEntries: PromptAdditionEntry[] = posePhrases.length > 0 && activeCharacterProjections.length > 0
      ? [{
          id: `character:${activeCharacterProjections[0].characterId}:pose`,
          text: posePhrases.join(', '),
          position: 'start' as const,
          section: 'Character',
          sourceType: 'character' as const,
        }]
      : [];

    const environmentEntries: PromptAdditionEntry[] = activeEnvironmentIds.flatMap(envId => {
      const env = environments.find(e => e.id === envId);
      return env ? env.phraseBundle.core
        .map((text, index) => ({
          id: `environment:${env.id}:${index}`,
          text,
          position: 'end' as const,
          section: 'Environment',
          sourceType: 'environment' as const,
        }))
        .filter(entry => Boolean(entry.text)) : [];
    });

    const lightPhrases = [envTime, envWeather, envScale, envCondition].filter(Boolean) as string[];
    const firstActiveEnvId = activeEnvironmentIds[0] ?? null;
    const lightEntries: PromptAdditionEntry[] = lightPhrases.length > 0 && firstActiveEnvId
      ? [{
          id: `environment:${firstActiveEnvId}:light`,
          text: lightPhrases.join(', '),
          position: 'end' as const,
          section: 'Environment',
          sourceType: 'environment' as const,
        }]
      : [];

    const worldStateEntries: PromptAdditionEntry[] = firstActiveEnvId && worldVariationEnabled
      ? worldVariationPhrases.map((text, index) => ({
          id: `environment:${firstActiveEnvId}:ws:${index}`,
          text,
          position: 'start' as const,
          section: 'Environment',
          sourceType: 'environment' as const,
        }))
      : [];

    const outfitEntries: PromptAdditionEntry[] = activeOutfitIds.flatMap(id => {
      const item = outfits.find(o => o.id === id);
      return item ? item.phrases.map((text, index) => ({
        id: `outfit:${item.id}:${index}`,
        text,
        position: 'start' as const,
        section: 'Wardrobe',
        sourceType: 'outfit' as const,
      })).filter(e => Boolean(e.text)) : [];
    });

    const styleEntries: PromptAdditionEntry[] = activeStyleIds.flatMap(id => {
      const item = stylePresets.find(s => s.id === id);
      return item ? item.phrases.map((text, index) => ({
        id: `style:${item.id}:${index}`,
        text,
        position: 'end' as const,
        section: 'Style',
        sourceType: 'style' as const,
      })).filter(e => Boolean(e.text)) : [];
    });

    const lightingEntries: PromptAdditionEntry[] = activeLightingIds.flatMap(id => {
      const item = lightingSetups.find(l => l.id === id);
      return item ? item.phrases.map((text, index) => ({
        id: `lighting:${item.id}:${index}`,
        text,
        position: 'end' as const,
        section: 'Lighting',
        sourceType: 'lighting' as const,
      })).filter(e => Boolean(e.text)) : [];
    });

    const compositionEntries: PromptAdditionEntry[] = activeCompositionIds.flatMap(id => {
      const item = compositionFrames.find(c => c.id === id);
      return item ? item.phrases.map((text, index) => ({
        id: `composition:${item.id}:${index}`,
        text,
        position: 'end' as const,
        section: 'Composition',
        sourceType: 'composition' as const,
      })).filter(e => Boolean(e.text)) : [];
    });

    const moodEntries: PromptAdditionEntry[] = activeMoodIds.flatMap(id => {
      const item = moodPresets.find(m => m.id === id);
      return item ? item.phrases.map((text, index) => ({
        id: `mood:${item.id}:${index}`,
        text,
        position: 'end' as const,
        section: 'Mood',
        sourceType: 'mood' as const,
      })).filter(e => Boolean(e.text)) : [];
    });

    const objectEntries: PromptAdditionEntry[] = activeObjectIds.flatMap(id => {
      const obj = objects.find(o => o.id === id);
      return obj ? obj.phrases.map((text, index) => ({
        id: `object:${obj.id}:${index}`,
        text,
        position: 'start' as const,
        section: 'Object',
        sourceType: 'object' as const,
      })).filter(e => Boolean(e.text)) : [];
    });

    const countEntries: PromptAdditionEntry[] = characterCountPhrase
      ? [{
          id: 'interaction:count',
          text: characterCountPhrase,
          position: 'start' as const,
          section: 'Character',
          sourceType: 'interaction' as const,
        }]
      : [];

    const interactionEntries: PromptAdditionEntry[] = activeCharacterIds.length >= 2 && activeInteractionPhrase
      ? [{
          id: `interaction:${activeInteractionPhrase.id}`,
          text: activeInteractionPhrase.text,
          position: 'start' as const,
          section: 'Character',
          sourceType: 'interaction' as const,
        }]
      : [];

    return [...countEntries, ...interactionEntries, ...worldStateEntries, ...characterEntries, ...poseEntries, ...outfitEntries, ...objectEntries, ...poolEntries, ...fragmentEntries, ...environmentEntries, ...lightEntries, ...styleEntries, ...lightingEntries, ...compositionEntries, ...moodEntries];
  }, [activeCharacterProjections, activeCharacterIds, activeInteractionPhrase, characterCountPhrase, availablePromptFragments, selectedPromptFragments, poolPromptItems, formatPromptAdditionText, poseFraming, poseOrientation, poseEnergy, poseGaze, activeEnvironmentIds, environments, envTime, envWeather, envScale, envCondition, worldVariationEnabled, worldVariationPhrases, activeOutfitIds, outfits, activeObjectIds, objects, activeStyleIds, stylePresets, activeLightingIds, lightingSetups, activeCompositionIds, compositionFrames, activeMoodIds, moodPresets]);

  const workspacePrompt = useMemo(() => {
    const startParts = promptAdditionEntries
      .filter(e => e.position === 'start')
      .map(e => e.text)
      .filter(Boolean);
    const endParts = promptAdditionEntries
      .filter(e => e.position === 'end')
      .map(e => e.text)
      .filter(Boolean);
    const subject = activeChipTexts.join(', ');
    return [...startParts, ...(subject ? [subject] : []), ...endParts]
      .filter(Boolean)
      .join(', ');
  }, [promptAdditionEntries, activeChipTexts]);

  // When the generated prompt changes (lane/aura/chip edits), discard any
  // manual free-edit so the new content is visible instead of being hidden
  // behind a stale override. Skip the very first render so a persisted edit
  // survives a page reload.
  const isFirstWorkspaceRender = useRef(true);
  useEffect(() => {
    if (isFirstWorkspaceRender.current) {
      isFirstWorkspaceRender.current = false;
      return;
    }
    setEditedPositiveOutput(null);
  }, [workspacePrompt]);

  const workspaceNegativePrompt = useMemo(() => {
    const phrases = activeNegativeIds.flatMap(id => {
      const preset = negativePresets.find(n => n.id === id);
      return preset ? preset.phrases.filter(Boolean) : [];
    });
    return phrases.join(', ');
  }, [activeNegativeIds, negativePresets]);

  const activeUniverseEntity = useMemo(
    () => activeUniverseId ? universes.find(u => u.id === activeUniverseId) : undefined,
    [activeUniverseId, universes]
  );
  const activeUniverse = activeUniverseEntity?.pools;
  const activeUniverseName = activeUniverseEntity?.name;

  const captureAutoName = useMemo(() => buildAutoName(
    activeCharacterDisplayName,
    environments.find(e => activeEnvironmentIds.includes(e.id))?.name ?? null,
    activeMoodIds.length > 0 ? (moodPresets.find(m => m.id === activeMoodIds[0])?.name ?? null) : null,
    activeStyleIds.length > 0 ? (stylePresets.find(s => s.id === activeStyleIds[0])?.name ?? null) : null,
  ), [activeCharacterDisplayName, activeEnvironmentIds, environments, activeMoodIds, moodPresets, activeStyleIds, stylePresets]);

  const handleCapture = useCallback(() => {
    if (!workspacePrompt) return;
    setCaptureBuffer(prev => [...prev, workspacePrompt]);
  }, [workspacePrompt]);

  const handleSaveSet = useCallback((name: string) => {
    if (captureBuffer.length === 0) return;
    saveCaptureSet(name || captureAutoName, captureBuffer);
    setCaptureBuffer([]);
  }, [captureBuffer, captureAutoName]);

  const handleClearCapture = useCallback(() => {
    setCaptureBuffer([]);
  }, []);

  const activeIdentityTags = useMemo(() => [
    ...activeCharacterIds.map(id => ({ name: characters.find(c => c.id === id)?.name ?? id, type: 'character' as const })),
    ...activeStyleIds.map(id => ({ name: stylePresets.find(s => s.id === id)?.name ?? '', type: 'style' as const })).filter(t => t.name),
    ...activeLightingIds.map(id => ({ name: lightingSetups.find(l => l.id === id)?.name ?? '', type: 'lighting' as const })).filter(t => t.name),
    ...activeEnvironmentIds.map(id => ({ name: environments.find(e => e.id === id)?.name ?? '', type: 'environment' as const })).filter(t => t.name),
    ...activeOutfitIds.map(id => ({ name: outfits.find(o => o.id === id)?.name ?? '', type: 'wardrobe' as const })).filter(t => t.name),
    ...activeCompositionIds.map(id => ({ name: compositionFrames.find(c => c.id === id)?.name ?? '', type: 'composition' as const })).filter(t => t.name),
    ...activeMoodIds.map(id => ({ name: moodPresets.find(m => m.id === id)?.name ?? '', type: 'mood' as const })).filter(t => t.name),
    ...(activeWorld ? [{ name: activeWorld.name, type: 'aura' as const }] : []),
    ...activeObjectIds.map(id => ({ name: objects.find(o => o.id === id)?.name ?? '', type: 'object' as const })).filter(t => t.name),
  ], [activeCharacterIds, characters, activeStyleIds, stylePresets, activeLightingIds, lightingSetups, activeEnvironmentIds, environments, activeOutfitIds, outfits, activeCompositionIds, compositionFrames, activeMoodIds, moodPresets, activeWorld, activeObjectIds, objects]);

  // Add allowCustomExtension to attribute definitions for current question
  const currentQuestionAttributesWithExtensions = currentQuestionAttributes.map(attr => ({
    ...attr,
    allowCustomExtension: currentNode?.allowCustomExtension?.includes(attr.id) ?? false,
  }));
  const currentTerritoryContext = useMemo(() => {
    if (!activeTerritory) return null;
    const categoryId = getCategoryForNode(currentNode?.id ?? null);
    if (!categoryId) {
      return {
        territoryName: activeTerritory.name,
        isRelevant: false,
        matchingSections: [],
      };
    }

    const matchingSections = activeTerritory.sources
      .map(source => source.section)
      .filter((section, index, list) => {
        const mappedCategories = TERRITORY_SECTION_CATEGORY_MAP[section] ?? [];
        const matchesCategory = mappedCategories.includes(categoryId);
        const isFirst = list.indexOf(section) === index;
        return matchesCategory && isFirst;
      });

    return {
      territoryName: activeTerritory.name,
      isRelevant: matchingSections.length > 0,
      matchingSections,
    };
  }, [activeTerritory, currentNode?.id, getCategoryForNode]);
  const currentBuilderAreaLabel = useMemo(() => {
    const categoryId = getCategoryForNode(currentNode?.id ?? null);
    if (!categoryId) return 'Builder';
    return BUILDER_CATEGORY_LABELS[categoryId] ?? 'Builder';
  }, [currentNode?.id, getCategoryForNode]);
  const territoryOrderedCategoryIds = useMemo(() => (
    activeCategoryOrder.filter(categoryId => (
      activeTerritoryCategoryIds.includes(categoryId)
      && usableNodeIds.some(nodeId => getCategoryForNode(nodeId) === categoryId)
    ))
  ), [activeCategoryOrder, activeTerritoryCategoryIds, getCategoryForNode, usableNodeIds]);
  const currentBuilderFlowHint = useMemo(() => {
    if (activeTerritory && territoryNavigationMode === 'biased') {
      return `Territory-biased navigation is active. Next will jump between the Builder areas mapped to ${activeTerritory.name}.`;
    }

    if (activeTerritory) {
      return `Full Builder navigation is active while ${activeTerritory.name} continues to highlight relevant areas.`;
    }

    return `${activeBuilderModeConfig.label} is shaping the order and suggestions in Builder.`;
  }, [activeBuilderModeConfig.label, activeTerritory, territoryNavigationMode]);
  const committedBuilderCategoryIds = useMemo(() => {
    const committed = new Set<BuilderCategoryId>();
    selections.forEach((selection, attributeId) => {
      if (!selection.isEnabled) return;
      const definition = effectiveAttributeDefinitions.find(def => def.id === attributeId);
      if (!definition) return;
      if ((BUILDER_CATEGORY_IDS as readonly string[]).includes(definition.category)) {
        committed.add(definition.category as BuilderCategoryId);
      }
    });
    return committed;
  }, [selections, effectiveAttributeDefinitions]);
  const suggestedBuilderCategoryId = useMemo<BuilderCategoryId | null>(() => {
    const currentCategoryId = getCategoryForNode(currentNode?.id ?? null);
    if (territoryNavigationMode === 'biased' && territoryOrderedCategoryIds.length > 0) {
      if (!currentCategoryId) {
        return territoryOrderedCategoryIds[0] ?? null;
      }

      const currentIndex = territoryOrderedCategoryIds.indexOf(currentCategoryId);
      if (currentIndex === -1) {
        return territoryOrderedCategoryIds[0] ?? null;
      }

      return territoryOrderedCategoryIds[currentIndex + 1] ?? null;
    }

    for (const categoryId of activeBuilderModeConfig.suggestedNextOrder) {
      if (
        territoryNavigationMode === 'biased'
        && activeTerritoryCategoryIds.length > 0
        && !activeTerritoryCategoryIds.includes(categoryId)
      ) {
        continue;
      }
      if (categoryId === currentCategoryId) continue;
      if (!committedBuilderCategoryIds.has(categoryId)) {
        return categoryId;
      }
    }

    for (const categoryId of activeBuilderModeConfig.suggestedNextOrder) {
      if (
        territoryNavigationMode === 'biased'
        && activeTerritoryCategoryIds.length > 0
        && !activeTerritoryCategoryIds.includes(categoryId)
      ) {
        continue;
      }
      if (categoryId !== currentCategoryId) {
        return categoryId;
      }
    }

    return null;
  }, [activeBuilderModeConfig.suggestedNextOrder, activeTerritoryCategoryIds, committedBuilderCategoryIds, currentNode?.id, getCategoryForNode, territoryNavigationMode, territoryOrderedCategoryIds]);

  const handleChangeBuilderMode = useCallback((modeId: BuilderModeId) => {
    setActiveBuilderMode(modeId);
    setHasReachedEndViaNext(false);
    setBuilderNotice(`${BUILDER_MODE_CONFIGS[modeId].label} is now guiding Builder flow.`);
  }, []);

  useEffect(() => {
    if (questionNodes.length === 0 || usableNodeIds.length === 0) return;
    if (lastModeRepositionRef.current === activeBuilderMode) return;

    const currentCategoryId = getCategoryForNode(currentNodeId);
    const nextModeStartCategory = activeBuilderModeConfig.startCategoryId;
    const shouldRepositionToModeStart =
      !currentCategoryId
      || currentCategoryId === nextModeStartCategory
      || committedBuilderCategoryIds.size === 0;

    if (!shouldRepositionToModeStart) {
      lastModeRepositionRef.current = activeBuilderMode;
      return;
    }

    const preferredNodeId = usableNodeIds.find(nodeId => getCategoryForNode(nodeId) === nextModeStartCategory)
      ?? getPreferredTerritoryStartNodeId()
      ?? getInitialUsableNodeId()
      ?? getInitialNodeId(questionNodes);

    if (!preferredNodeId || preferredNodeId === currentNodeId) {
      lastModeRepositionRef.current = activeBuilderMode;
      return;
    }

    setCurrentNodeId(preferredNodeId);
    setNavigationHistory(prev => (prev[prev.length - 1] === preferredNodeId ? prev : [...prev, preferredNodeId]));
    lastModeRepositionRef.current = activeBuilderMode;
  }, [activeBuilderMode, activeBuilderModeConfig.startCategoryId, committedBuilderCategoryIds.size, currentNodeId, getCategoryForNode, getInitialNodeId, getInitialUsableNodeId, getPreferredTerritoryStartNodeId, questionNodes, usableNodeIds]);

  const currentTerritoryItems = useMemo(() => {
    if (!activeTerritory) return [];
    const categoryId = getCategoryForNode(currentNode?.id ?? null);
    if (!categoryId) return [];

    const selectedItems = new Map(poolPromptItems.map(item => [item.id, item]));
    const seenTexts = new Set<string>();
    const items: Array<{
      id: string;
      text: string;
      poolName: string;
      section: string;
      note?: string;
      tags?: string[];
      isSelected?: boolean;
      weight?: number;
      outputText?: string;
    }> = [];

    const relevantSources = activeTerritory.sources
      .filter(source => {
        const mappedCategories = TERRITORY_SECTION_CATEGORY_MAP[source.section] ?? [];
        return mappedCategories.includes(categoryId);
      })
      .map(source => {
        const pool = territoryPools.find(entry => entry.id === source.poolId);
        const sectionItems = (pool?.items ?? [])
          .filter(item => item.section?.trim() === source.section)
          .slice(0, 6);

        return {
          source,
          sectionItems,
        };
      })
      .filter(entry => entry.sectionItems.length > 0);

    let itemIndex = 0;

    while (true) {
      let addedThisPass = false;

      relevantSources.forEach(({ source, sectionItems }) => {
        const item = sectionItems[itemIndex];
        if (!item) return;

        const normalizedText = item.text.trim().toLowerCase();
        if (!normalizedText || seenTexts.has(normalizedText)) return;

        seenTexts.add(normalizedText);
        addedThisPass = true;

        const runtimeId = `territory:${source.poolId}:${source.section}:${item.id}`;
        const selectedEntry = selectedItems.get(runtimeId);
        items.push({
          id: runtimeId,
          text: item.text,
          poolName: source.poolName,
          section: source.section,
          note: item.note,
          tags: item.tags,
          isSelected: Boolean(selectedEntry),
          weight: selectedEntry?.weight ?? 1.0,
          outputText: poolOutputOverrides.get(runtimeId) ?? item.text,
        });
      });

      if (!addedThisPass) break;
      itemIndex += 1;
    }

    return items;
  }, [activeTerritory, currentNode?.id, getCategoryForNode, poolOutputOverrides, poolPromptItems, territoryPools]);
  const activeWorkflowPoolNames = useMemo(() => {
    if (activeTerritory) {
      const names = activeTerritory.sources
        .map(source => territoryPools.find(pool => pool.id === source.poolId)?.name ?? null)
        .filter((name): name is string => Boolean(name));
      return [...new Set(names)];
    }
    return activeIdpPool?.name ? [activeIdpPool.name] : [];
  }, [activeIdpPool, activeTerritory, territoryPools]);

  // Extract prompt and error from engine result
  const prompt: Prompt | null = engineResult && 'positiveTokens' in engineResult ? engineResult : null;
  const error: ValidationError | null = engineResult && 'type' in engineResult ? engineResult : null;
  const displayError: ValidationError | null = error?.type === 'INVALID_ATTRIBUTE'
    ? {
        type: 'INVALID_ATTRIBUTE',
        message: 'Some prompt elements are no longer available in the Builder.',
        details: {},
      }
    : error;
  const unavailableJumpNode = unavailableJumpNodeId && unavailableJumpNodeId !== '__builder_empty__'
    ? questionNodes.find(node => node.id === unavailableJumpNodeId)
    : null;
  

  // Persist active page + sync URL
  useEffect(() => {
    try {
      window.localStorage.setItem('promptgen:active_page', activePage);
    } catch {
      // ignore
    }
    if (activePage === 'creator-profile') return; // hash system handles this
    const param = PAGE_TO_PARAM[activePage];
    const next = param ? `?page=${param}` : window.location.pathname;
    const current = window.location.search || window.location.pathname;
    if (current !== next) {
      window.history.pushState({ page: activePage }, '', param ? `?page=${param}` : '/');
    }
  }, [activePage]);

  const analyticsPageKey = useMemo(() => {
    if (!hasSeenLanding) {
      return 'landing';
    }
    return activePage;
  }, [activePage, hasSeenLanding]);

  useEffect(() => {
    if (!authReady) return;

    void trackAnalyticsSessionStart({
      pageKey: analyticsPageKey,
      userId: authUser?.id ?? null,
      metadata: {
        appVersion: 'internal-v1',
      },
    });
  }, [analyticsPageKey, authReady, authUser?.id]);

  useEffect(() => {
    if (!authReady) return;

    void trackAnalyticsPageView({
      pageKey: analyticsPageKey,
      userId: authUser?.id ?? null,
      metadata:
        activePage === 'creator-profile'
          ? {
              creatorId: selectedCreatorProfileTarget?.creatorId ?? null,
              creatorName: selectedCreatorProfileTarget?.creatorName ?? null,
            }
          : null,
    });
  }, [
    activePage,
    analyticsPageKey,
    authReady,
    authUser?.id,
    selectedCreatorProfileTarget?.creatorId,
    selectedCreatorProfileTarget?.creatorName,
  ]);

  useEffect(() => {
    const syncFromHash = () => {
      const target = parseCreatorHash();
      if (!target) return;
      setSelectedCreatorProfileTarget(target);
      setActivePage('creator-profile');
      setHasSeenLanding(true);
      try {
        window.localStorage.setItem('morpbase:seen_landing', '1');
      } catch {
        // ignore
      }
    };

    const syncFromPopState = () => {
      const creatorTarget = parseCreatorHash();
      if (creatorTarget) {
        setSelectedCreatorProfileTarget(creatorTarget);
        setActivePage('creator-profile');
        return;
      }
      const page = getPageFromUrl();
      setActivePage(page ?? 'generator');
    };

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    window.addEventListener('popstate', syncFromPopState);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
      window.removeEventListener('popstate', syncFromPopState);
    };
  }, []);

  useEffect(() => {
    const currentHash = window.location.hash;
    const nextHash = activePage === 'creator-profile' && selectedCreatorProfileTarget
      ? buildCreatorHash(selectedCreatorProfileTarget)
      : '';

    if (currentHash === nextHash) return;

    const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
    window.history.replaceState(null, '', nextUrl);
  }, [activePage, selectedCreatorProfileTarget]);

  const handleEnterApp = () => {
    setHasSeenLanding(true);
    try {
      window.localStorage.setItem('morpbase:seen_landing', '1');
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (activePage === 'user-pools' || activePage === 'generator') {
      if (authUser) {
        refreshTerritories();
        refreshTerritoryPools();
        setActiveTerritory(getActiveTerritoryId());
      } else {
        setTerritories([]);
        setTerritoryPools([]);
        setActiveTerritory(null);
        setTerritoriesLoading(false);
      }
    }
  }, [activePage, authUser, refreshTerritories, refreshTerritoryPools]);

  useEffect(() => {
    let isActive = true;

    if (!authReady || !authUser) {
      setIsAdmin(false);
      return () => {
        isActive = false;
      };
    }

    const loadAdminState = async () => {
      try {
        const next = await isCurrentUserAdmin();
        if (isActive) {
          setIsAdmin(next);
        }
      } catch {
        if (isActive) {
          setIsAdmin(false);
        }
      }
    };

    loadAdminState();
    return () => {
      isActive = false;
    };
  }, [authReady, authUser?.id]);

  useEffect(() => {
    if (activePage === 'admin' && !isAdmin) {
      setActivePage('generator');
    }
  }, [activePage, isAdmin]);

  useEffect(() => {
    if (authUser) {
      refreshTerritories();
      refreshTerritoryPools();
    } else {
      setTerritories([]);
      setTerritoryPools([]);
      setActiveTerritory(null);
      setTerritoriesLoading(false);
    }
  }, [authUser, refreshTerritories, refreshTerritoryPools]);

  return (
    <>
      <div className="app-root">
      {!hasSeenLanding ? (
        <LandingPage manualUrl={manualUrl} onEnter={handleEnterApp} />
      ) : (
      <>
      <nav className="nav" aria-label="Main navigation">

        {/* Brand */}
        <button
          type="button"
          className="nav-brand"
          aria-label="Go to builder start"
          onClick={handleGoToBuilderStart}
        >
          <span className="nav-brand-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="nav-brand-text">MORPBASE</span>
        </button>

        {/* Center navigation */}
        <div className="nav-center">
          <div className="nav-tabs">
            <button type="button" className={`nav-tab${activePage === 'generator' ? ' active' : ''}`} onClick={() => setActivePage('generator')}>Workspace</button>
            <button type="button" className={`nav-tab${activePage === 'identity-systems' ? ' active' : ''}`} onClick={() => setActivePage('identity-systems')}>Lexicon</button>
            <button type="button" className={`nav-tab${activePage === 'prompts' ? ' active' : ''}`} onClick={() => setActivePage('prompts')}>Memory</button>
            <button type="button" className={`nav-tab${activePage === 'user-pools' ? ' active' : ''}`} onClick={() => setActivePage('user-pools')}>Auras</button>
            <button type="button" className={`nav-tab${activePage === 'community' ? ' active' : ''}`} onClick={() => setActivePage('community')}>Community</button>
            <button type="button" className={`nav-tab${activePage === 'my-profile' ? ' active' : ''}`} onClick={() => setActivePage('my-profile')}>Profile</button>
            {isAdmin && (
              <button type="button" className={`nav-tab${activePage === 'admin' ? ' active' : ''}`} onClick={() => setActivePage('admin')}>Admin</button>
            )}
          </div>
        </div>

        {/* Right zone */}
        <div className="nav-right">
          <a className="nav-action-link" href={manualLink('quick-start')} target="_blank" rel="noreferrer">Manual</a>
          <button
            type="button"
            className="nav-action-link"
            onClick={() => { setFeedbackCopied(false); setIsFeedbackModalOpen(true); }}
          >
            Feedback
          </button>
          <div className="nav-divider" aria-hidden="true" />
          {authReady && authUser ? (
            <>
              <OnlinePresenceBadge selfAuthUid={authUser.authUid} onViewUser={handleViewCreator} />
              <NotificationBell authUid={authUser.authUid} onNavigate={handleNotificationNavigate} />
              <button
                type="button"
                className={`nav-icon-btn nav-icon-btn--badge${activePage === 'messages' ? ' active' : ''}`}
                title="Messages"
                onClick={() => { setDmUnreadCount(0); setActivePage('messages'); }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {dmUnreadCount > 0 && (
                  <span className="nav-icon-badge">{dmUnreadCount > 9 ? '9+' : dmUnreadCount}</span>
                )}
              </button>
              <button
                type="button"
                className="nav-user-chip"
                title={authUser.email}
                onClick={handleOpenAccount}
              >
                {authUser.avatarUrl ? (
                  <img src={authUser.avatarUrl} alt={authUser.name} className="nav-user-avatar nav-user-avatar--img" />
                ) : (
                  <span className="nav-user-avatar">{authUser.name[0]?.toUpperCase() ?? '?'}</span>
                )}
                <span className="nav-user-name">{authUser.name}</span>
              </button>
              <button type="button" className="nav-logout-btn" onClick={handleLogout}>Log out</button>
            </>
          ) : authReady ? (
            <button type="button" className="nav-login-btn" onClick={handleOpenAuth}>Beta Login</button>
          ) : (
            <span className="nav-checking">Checking…</span>
          )}
        </div>

      </nav>
      {activePage === 'admin' ? (
        <AdminPage userName={authUser?.name ?? null} />
      ) : activePage === 'identity-systems' ? (
        <LexiconPage />
      ) : activePage === 'user-pools' ? (
        <WorldsPage
          isLoggedIn={true}
        />
      ) : activePage === 'my-profile' ? (
        <MyProfilePage
          isLoggedIn={true}
          authUid={authUser?.authUid ?? null}
          userName={authUser?.name ?? null}
          onRequestLogin={handleOpenAuth}
        />
      ) : activePage === 'creator-profile' ? (
        <PublicCreatorPage
          creatorId={selectedCreatorProfileTarget?.creatorId ?? null}
          creatorName={selectedCreatorProfileTarget?.creatorName ?? null}
          creatorAuthUid={selectedCreatorProfileTarget?.creatorAuthUid ?? null}
          viewerAuthUid={authUser?.authUid ?? null}
          onBack={() => setActivePage('community')}
          onOpenPool={(entryId) => {
            setActivePage('community');
            window.setTimeout(() => {
              window.dispatchEvent(new CustomEvent('morpbase:open-hub-entry', { detail: { entryId } }));
            }, 0);
          }}
          onMessage={handleStartDM}
        />
      ) : activePage === 'identity-detail' && selectedIdentity ? (
        <IdentityDetailPage
          identity={selectedIdentity}
          authUid={authUser?.authUid ?? null}
          userId={authUser?.id ?? null}
          userName={authUser?.name ?? null}
          activeIdentityTags={activeIdentityTags}
          onBack={() => setActivePage('community')}
          onViewAuthor={handleViewCreator}
        />
      ) : activePage === 'post-detail' && selectedPostId ? (
        <PostDetailPage
          postId={selectedPostId}
          authUid={authUser?.authUid ?? null}
          userId={authUser?.id ?? null}
          userName={authUser?.name ?? null}
          onBack={() => setActivePage('community')}
          onViewAuthor={handleViewCreator}
        />
      ) : activePage === 'messages' ? (
        authUser ? (
          <DMInbox
            authUid={authUser.authUid}
            authName={authUser.name}
            initialRecipient={dmInitialRecipient}
            currentPrompt={workspacePrompt || null}
          />
        ) : (
          <div className="app-messages-login">Log in to send and receive messages.</div>
        )
      ) : activePage === 'community' ? (
        <CommunityPage
          userId={authUser?.id ?? null}
          authUid={authUser?.authUid ?? null}
          userName={authUser?.name ?? null}
          onIdentityAdded={handleCommunityIdentityAdded}
          onViewCreator={handleViewCreator}
          onOpenPost={handleOpenPost}
          onOpenIdentity={handleOpenIdentity}
          currentPromptText={workspacePrompt}
          activeIdentityTags={activeIdentityTags}
        />
      ) : activePage === 'prompts' ? (
        <PromptsPage
          manualUrl={manualUrl}
          prompt={prompt}
          customAdditions={poolAdditionTexts}
          positionedAdditions={promptAdditionEntries}
          editedPositive={editedPositiveOutput}
          editedNegative={editedNegativeOutput}
          onAddToPrompt={handleAddPoolItem}
          authUser={authUser}
          isPro={isPro}
          activeCharacterId={activeCharacterIds[0] ?? null}
          activeCharacterName={activeCharacterDisplayName}
          externalOpenSaveSignal={savePromptOpenSignal}
          defaultSaveName={captureAutoName}
        />
      ) : (
        <WorkspacePage
          activeChipTexts={activeChipTexts}
          onChipToggle={handleChipToggle}
          assembledPrompt={workspacePrompt}
          onSavePrompt={() => { setSavePromptOpenSignal(s => s + 1); setActivePage('prompts'); }}
          activeCharacterItems={activeCharacterIds.map(id => ({ id, name: characters.find(c => c.id === id)?.name ?? id }))}
          onChooseCharacter={() => setIsCharacterLibraryOpen(true)}
          onRemoveCharacter={handleRemoveCharacter}
          activeInteractionPhrase={activeInteractionPhrase}
          onChooseInteraction={() => setIsInteractionOpen(true)}
          onRemoveInteraction={() => setActiveInteractionPhraseId(null)}
          onRandomizeInteraction={handleRandomizeInteraction}
          activeEnvironmentItems={activeEnvironmentIds.map(id => ({ id, name: environments.find(e => e.id === id)?.name ?? id }))}
          onChooseEnvironment={() => setIsEnvironmentLibraryOpen(true)}
          onRemoveEnvironment={handleRemoveEnvironment}
          worldVariationEnabled={worldVariationEnabled}
          onWorldVariationToggle={handleWorldVariationToggle}
          onWorldVariationNext={handleWorldVariationNext}
          activeOutfitItems={activeOutfitIds.map(id => ({ id, name: outfits.find(o => o.id === id)?.name ?? id }))}
          onChooseWardrobe={() => setIsWardrobeOpen(true)}
          onRemoveWardrobe={handleRemoveOutfit}
          activeStyleItems={activeStyleIds.map(id => ({ id, name: stylePresets.find(s => s.id === id)?.name ?? id }))}
          onChooseStyle={() => setIsStyleOpen(true)}
          onRemoveStyle={handleRemoveStyle}
          activeLightingItems={activeLightingIds.map(id => ({ id, name: lightingSetups.find(l => l.id === id)?.name ?? id }))}
          onChooseLighting={() => setIsLightingOpen(true)}
          onRemoveLighting={handleRemoveLighting}
          activeCompositionItems={activeCompositionIds.map(id => ({ id, name: compositionFrames.find(c => c.id === id)?.name ?? id }))}
          onChooseComposition={() => setIsCompositionOpen(true)}
          onRemoveComposition={handleRemoveComposition}
          activeMoodItems={activeMoodIds.map(id => ({ id, name: moodPresets.find(m => m.id === id)?.name ?? id }))}
          onChooseMood={() => setIsMoodOpen(true)}
          onRemoveMood={handleRemoveMood}
          activeNegativeItems={activeNegativeIds.map(id => ({ id, name: negativePresets.find(n => n.id === id)?.name ?? id }))}
          assembledNegativePrompt={workspaceNegativePrompt}
          onChooseNegative={() => setIsNegativeOpen(true)}
          onRemoveNegative={handleRemoveNegativePreset}
          activeObjectItems={activeObjectIds.map(id => ({ id, name: objects.find(o => o.id === id)?.name ?? id }))}
          onChooseObject={() => setIsObjectOpen(true)}
          onRemoveObject={handleRemoveObject}
          activeWorldName={activeWorld?.name ?? null}
          activeWorldPhrases={activeWorld?.phrases ?? []}
          activeWorldPhraseCount={activeWorld?.phrases.length ?? 0}
          onChooseWorld={() => setIsWorldOpen(true)}
          onDeactivateWorld={activeWorld ? () => { setActiveWorld(null); setActiveChipTexts([]); setAuraVariationEnabled(false); } : undefined}
          auraVariationEnabled={auraVariationEnabled}
          auraVariationMin={auraVariationMin}
          auraVariationMax={auraVariationMax}
          onAuraVariationToggle={handleAuraVariationToggle}
          onAuraVariationNext={handleAuraVariationNext}
          onAuraVariationMinChange={handleAuraVariationMinChange}
          onAuraVariationMaxChange={handleAuraVariationMaxChange}
          authUid={authUser?.authUid ?? null}
          userId={authUser?.id ?? null}
          userName={authUser?.name ?? null}
          activeIdentityTags={activeIdentityTags}
          onRandomize={handleRandomizeLanes}
          onOpenLaneSets={() => setIsLaneSetsOpen(true)}
          onOpenUniverses={() => setIsUniversesOpen(true)}
          activeUniverseName={activeUniverseName}
          onDeactivateUniverse={handleDeactivateUniverse}
          lockedLanes={lockedLanes}
          onToggleLaneLock={handleToggleLaneLock}
          pinnedItems={pinnedItems}
          onTogglePin={handleTogglePin}
          captureCount={captureBuffer.length}
          captureAutoName={captureAutoName}
          onCapture={handleCapture}
          onSaveSet={handleSaveSet}
          onClearCapture={handleClearCapture}
          editedPrompt={editedPositiveOutput}
          onEditPrompt={setEditedPositiveOutput}
          onClearAllLanes={handleClearAllLanes}
        />
      )}
      </>
      )}
      </div>
      <CharacterLibraryModal
        isOpen={isCharacterLibraryOpen}
        onClose={() => setIsCharacterLibraryOpen(false)}
        characters={characters}
        activeCharacterIds={activeCharacterIds}
        isLoading={charactersLoading}
        onSelectCharacter={handleSelectCharacter}
        onCreateCharacter={handleCreateCharacter}
        onUpdateCharacter={handleUpdateCharacter}
        onDeleteCharacter={handleDeleteCharacter}
        universeFilter={activeUniverse?.character}
        universeName={activeUniverseName}
      />
      <InteractionModal
        isOpen={isInteractionOpen}
        onClose={() => setIsInteractionOpen(false)}
        activeId={activeInteractionPhraseId}
        onSelect={setActiveInteractionPhraseId}
      />
      <LaneSetsModal
        isOpen={isLaneSetsOpen}
        onClose={() => setIsLaneSetsOpen(false)}
        laneSets={laneSets}
        onApply={handleApplyLaneSet}
        onDelete={handleDeleteLaneSet}
        onSaveCurrent={handleSaveCurrentAsLaneSet}
      />
      <UniversesModal
        isOpen={isUniversesOpen}
        onClose={() => setIsUniversesOpen(false)}
        universes={universes}
        activeUniverseId={activeUniverseId}
        onActivate={handleActivateUniverse}
        onDeactivate={handleDeactivateUniverse}
        onCreateUniverse={handleCreateUniverse}
        onUpdatePools={handleUpdateUniversePools}
        onDeleteUniverse={handleDeleteUniverse}
        libraryData={{
          characters,
          environments,
          wardrobe: outfits,
          styles: stylePresets,
          lighting: lightingSetups,
          composition: compositionFrames,
          mood: moodPresets,
          negative: negativePresets,
        }}
      />
      <EnvironmentLibraryModal
        isOpen={isEnvironmentLibraryOpen}
        onClose={() => setIsEnvironmentLibraryOpen(false)}
        environments={environments}
        activeEnvironmentIds={activeEnvironmentIds}
        onSelectEnvironment={handleSelectEnvironment}
        onCreateEnvironment={handleCreateEnvironment}
        onUpdateEnvironment={handleUpdateEnvironment}
        onDeleteEnvironment={handleDeleteEnvironment}
        universeFilter={activeUniverse?.environment}
        universeName={activeUniverseName}
      />
      <WardrobeModal
        isOpen={isWardrobeOpen}
        onClose={() => setIsWardrobeOpen(false)}
        outfits={outfits}
        activeOutfitIds={activeOutfitIds}
        onSelectOutfit={handleSelectOutfit}
        onCreateOutfit={handleCreateOutfit}
        onUpdateOutfit={handleUpdateOutfit}
        onDeleteOutfit={handleDeleteOutfit}
        universeFilter={activeUniverse?.wardrobe}
        universeName={activeUniverseName}
      />
      <StyleModal
        isOpen={isStyleOpen}
        onClose={() => setIsStyleOpen(false)}
        items={stylePresets}
        activeItemIds={activeStyleIds}
        onSelectItem={handleSelectStylePreset}
        onCreateItem={handleCreateStylePreset}
        onUpdateItem={handleUpdateStylePreset}
        onDeleteItem={handleDeleteStylePreset}
        universeFilter={activeUniverse?.style}
        universeName={activeUniverseName}
      />
      <LightingModal
        isOpen={isLightingOpen}
        onClose={() => setIsLightingOpen(false)}
        items={lightingSetups}
        activeItemIds={activeLightingIds}
        onSelectItem={handleSelectLightingSetup}
        onCreateItem={handleCreateLightingSetup}
        onUpdateItem={handleUpdateLightingSetup}
        onDeleteItem={handleDeleteLightingSetup}
        universeFilter={activeUniverse?.lighting}
        universeName={activeUniverseName}
      />
      <CompositionModal
        isOpen={isCompositionOpen}
        onClose={() => setIsCompositionOpen(false)}
        items={compositionFrames}
        activeItemIds={activeCompositionIds}
        onSelectItem={handleSelectCompositionFrame}
        onCreateItem={handleCreateCompositionFrame}
        onUpdateItem={handleUpdateCompositionFrame}
        onDeleteItem={handleDeleteCompositionFrame}
        universeFilter={activeUniverse?.composition}
        universeName={activeUniverseName}
      />
      <MoodModal
        isOpen={isMoodOpen}
        onClose={() => setIsMoodOpen(false)}
        items={moodPresets}
        activeItemIds={activeMoodIds}
        onSelectItem={handleSelectMoodPreset}
        onCreateItem={handleCreateMoodPreset}
        onUpdateItem={handleUpdateMoodPreset}
        onDeleteItem={handleDeleteMoodPreset}
        universeFilter={activeUniverse?.mood}
        universeName={activeUniverseName}
      />
      <NegativeModal
        isOpen={isNegativeOpen}
        onClose={() => setIsNegativeOpen(false)}
        items={negativePresets}
        activeItemIds={activeNegativeIds}
        onAddItem={handleAddNegativePreset}
        onRemoveItem={handleRemoveNegativePreset}
        onCreateItem={handleCreateNegativePreset}
        onUpdateItem={handleUpdateNegativePreset}
        onDeleteItem={handleDeleteNegativePreset}
        universeFilter={activeUniverse?.negative}
        universeName={activeUniverseName}
      />
      <ObjectLibraryModal
        isOpen={isObjectOpen}
        onClose={() => setIsObjectOpen(false)}
        activeObjectIds={activeObjectIds}
        onAdd={handleAddObject}
        onRemove={handleRemoveObject}
        universeFilter={activeUniverse?.object}
        universeName={activeUniverseName}
      />
      <WorldModal
        isOpen={isWorldOpen}
        onClose={() => setIsWorldOpen(false)}
        activeWorldId={activeWorld?.id ?? null}
        onSelectWorld={(id, name, phrases) => { setActiveWorld({ id, name, phrases }); setActiveChipTexts([]); setAuraVariationEnabled(false); }}
        onDeactivate={() => { setActiveWorld(null); setActiveChipTexts([]); setAuraVariationEnabled(false); }}
        universeFilter={activeUniverse?.aura}
        universeName={activeUniverseName}
      />
      <Modal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        title="Beta Feedback"
        className="app-feedback-modal"
      >
        <div className="app-feedback">
          <p className="app-feedback-text">
            Use this template to send high-signal feedback. Paste it into Discord or your preferred channel.
          </p>
          <textarea
            className="app-feedback-textarea"
            rows={18}
            readOnly
            value={feedbackSchema}
          />
          <div className="app-feedback-actions">
            <button
              type="button"
              className="app-feedback-secondary"
              onClick={() => setIsFeedbackModalOpen(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="app-feedback-primary"
              onClick={() => {
                navigator.clipboard.writeText(feedbackSchema).then(() => {
                  setFeedbackCopied(true);
                }).catch(() => {
                  setFeedbackCopied(false);
                });
              }}
            >
              {feedbackCopied ? 'Copied' : 'Copy Template'}
            </button>
          </div>
          <div className="app-feedback-hint">
            Need full guidance?{' '}
            <a href={manualLink('support-notes')} target="_blank" rel="noreferrer">
              Open the manual
            </a>
            .
          </div>
        </div>
      </Modal>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        error={authError}
      />
      {authUser && (
        <AccountModal
          isOpen={isAccountModalOpen}
          user={authUser}
          onClose={() => setIsAccountModalOpen(false)}
          onUpdateName={handleUpdateName}
          onChangePassword={handleChangePassword}
          onDeleteAccount={handleDeleteAccount}
          error={accountError}
          message={accountMessage}
        />
      )}
    </>
  );
}