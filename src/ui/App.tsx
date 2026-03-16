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

import { useState, useCallback, useEffect, useMemo } from 'react';
import { AttributeDefinition, AttributeSelection, Modifier, ModelProfile, Pool, PoolItem, Prompt, Territory, TerritorySourceInput, ValidationError, WorkingSet } from '../types';
import { generatePrompt, EngineInput } from '../engine';
import { loadAttributeDefinitions } from '../data/loadAttributeDefinitions';
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
import { UserPoolsPage } from './components/UserPoolsPage';
import { PoolHubPage } from './components/PoolHubPage';
import { PromptLibrary } from './components/PromptLibrary';
import { AuthModal } from './components/AuthModal';
import { AccountModal } from './components/AccountModal';
import { WorkingSetsPage } from './components/WorkingSetsPage';
import { PromptsPage } from './components/PromptsPage';
import { LandingPage } from './components/LandingPage';
import { AdminPage } from './components/AdminPage';
import { MyProfilePage } from './components/MyProfilePage';
import { PublicCreatorPage } from './components/PublicCreatorPage';
import { CATEGORY_MAP } from '../data/categoryMap';
import {
  changeUserPassword,
  deleteCurrentUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserName,
} from '../engine/authStore';
import {
  addWorkingSetItem,
  clearWorkingSetCategory,
  createWorkingSet,
  deleteWorkingSet,
  getActiveWorkingSetId,
  listWorkingSets,
  removeWorkingSetItem,
  setActiveWorkingSetId as persistActiveWorkingSetId,
  updateWorkingSet,
} from '../engine/workingSetStore';
import { isCurrentUserAdmin } from '../engine/adminStore';
import {
  createTerritory,
  deleteTerritory,
  getActiveTerritoryId,
  listTerritories,
  setActiveTerritoryId as persistActiveTerritoryId,
  updateTerritory,
} from '../engine/territoryStore';
import { listPools } from '../engine/poolStore';

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

const parseCreatorHash = (): { creatorId?: string | null; creatorName?: string | null } | null => {
  try {
    if (!window.location.hash.startsWith('#creator')) return null;
    const raw = window.location.hash.slice('#creator'.length);
    const params = new URLSearchParams(raw.startsWith('?') ? raw.slice(1) : raw);
    const creatorId = params.get('user');
    const creatorName = params.get('name');
    if (!creatorId && !creatorName) return null;
    return {
      creatorId: creatorId || null,
      creatorName: creatorName || null,
    };
  } catch {
    return null;
  }
};

const buildCreatorHash = (input: { creatorId?: string | null; creatorName?: string | null }): string => {
  const params = new URLSearchParams();
  if (input.creatorId) params.set('user', input.creatorId);
  if (input.creatorName) params.set('name', input.creatorName);
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
    sourceType?: 'pool' | 'territory';
  };

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
  const [activePage, setActivePage] = useState<'generator' | 'prompts' | 'user-pools' | 'pool-hub' | 'my-profile' | 'creator-profile' | 'working-sets' | 'admin'>(() => {
    try {
      if (parseCreatorHash()) return 'creator-profile';
      const saved = window.localStorage.getItem('promptgen:active_page');
      if (saved === 'prompts') return 'prompts';
      if (saved === 'user-pools') return 'user-pools';
      if (saved === 'pool-hub') return 'pool-hub';
      if (saved === 'my-profile') return 'my-profile';
      if (saved === 'creator-profile') return 'creator-profile';
      if (saved === 'working-sets') return 'working-sets';
      if (saved === 'admin') return 'admin';
      return 'generator';
    } catch {
      return 'generator';
    }
  });
  // UI State: Selections
  const [selections, setSelections] = useState<Map<string, AttributeSelection>>(new Map());
  
  // UI State: Modifiers
  const [modifiers, setModifiers] = useState<Map<string, Modifier>>(new Map());
  
  // UI State: Global weight enabled/disabled
  const [weightsEnabledGlobal, setWeightsEnabledGlobal] = useState<boolean>(false);
  
  // UI State: User pool prompt additions
  const [poolPromptItems, setPoolPromptItems] = useState<PromptAdditionItem[]>([]);
  const [poolOutputOverrides, setPoolOutputOverrides] = useState<Map<string, string>>(new Map());

  // UI State: Freeform prompt text
  const [exportMode, setExportMode] = useState<'structured' | 'clean' | 'structured_with_negative'>('clean');
  const [editedPositiveOutput, setEditedPositiveOutput] = useState<string | null>(null);
  const [editedNegativeOutput, setEditedNegativeOutput] = useState<string | null>(null);
  const [selectionOutputOverrides, setSelectionOutputOverrides] = useState<Map<string, string>>(new Map());

  // UI State: Clear prompt undo (single step)
  const [clearUndoState, setClearUndoState] = useState<{
    selections: Map<string, AttributeSelection>;
    modifiers: Map<string, Modifier>;
    poolPromptItems: PromptAdditionItem[];
    poolOutputOverrides: Map<string, string>;
    selectionOutputOverrides: Map<string, string>;
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
- Any notable improvements when using Working Sets / User Pools:

7) Feature-Specific Feedback
- Working Sets:
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
  const [workingSets, setWorkingSets] = useState<WorkingSet[]>([]);
  const [workingSetsLoading, setWorkingSetsLoading] = useState(false);
  const [activeWorkingSetId, setActiveWorkingSet] = useState<string | null>(() => getActiveWorkingSetId());
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [territoriesLoading, setTerritoriesLoading] = useState(false);
  const [territoryPools, setTerritoryPools] = useState<Pool[]>([]);
  const [activeTerritoryId, setActiveTerritory] = useState<string | null>(() => getActiveTerritoryId());
  const [territoryEditTargetId, setTerritoryEditTargetId] = useState<string | null>(null);
  const [territoryNavigationMode, setTerritoryNavigationMode] = useState<'biased' | 'full'>('biased');
  const [builderTerritoryPickerId, setBuilderTerritoryPickerId] = useState<string>('');
  const [savePromptOpenSignal, setSavePromptOpenSignal] = useState(0);
  const [builderNotice, setBuilderNotice] = useState<string | null>(null);
  const [unavailableJumpNodeId, setUnavailableJumpNodeId] = useState<string | null>(null);
  const [selectedCreatorProfileTarget, setSelectedCreatorProfileTarget] = useState<{
    creatorId?: string | null;
    creatorName?: string | null;
  } | null>(() => parseCreatorHash());
  const handleOpenCreatorProfilePage = useCallback((input: {
    creatorId?: string | null;
    creatorName?: string | null;
  }) => {
    setSelectedCreatorProfileTarget({
      creatorId: input.creatorId ?? null,
      creatorName: input.creatorName ?? null,
    });
    setActivePage('creator-profile');
  }, []);

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
  const CATEGORY_ORDER: string[] = ['subject', 'style', 'lighting', 'camera', 'environment', 'quality', 'effects', 'post-processing', 'actions', 'anatomy-details'];
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

  
  const activeTerritory = territories.find(territory => territory.id === activeTerritoryId) ?? null;
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

  const baseSetTemplate = useMemo<WorkingSet>(() => {
    const categoryBuckets: WorkingSet['categoryBuckets'] = {};

    attributeDefinitions.forEach(definition => {
      const bucket = categoryBuckets[definition.category] ?? [];
      bucket.push({
        id: definition.id,
        poolId: 'base-set',
        poolItemId: definition.id,
        text: definition.baseText,
        addedAt: 0,
      });
      categoryBuckets[definition.category] = bucket;
    });

    return {
      id: '__base_set_template__',
      name: 'Base Set',
      categoryBuckets,
      createdAt: 0,
      updatedAt: 0,
    };
  }, [attributeDefinitions]);

  
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
    
    for (const categoryId of CATEGORY_ORDER) {
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
  }, []);

  /**
   * Get the next subcategory node ID in sequential order
   * Returns the next subcategory, or loops back to the first if at the end
   */
  const getNextSubcategoryNodeId = useCallback((currentNodeId: string | null, nodes: QuestionNode[]): string | null => {
    const allNodeIds = getAllSubcategoryNodeIds(nodes);
    
    if (allNodeIds.length === 0) {
      return null;
    }
    
    if (!currentNodeId) {
      // No current node - return first subcategory
      return allNodeIds[0];
    }
    
    // Find current node index
    const currentIndex = allNodeIds.indexOf(currentNodeId);
    
    if (currentIndex === -1) {
      // Current node not found in list - return first subcategory
      return allNodeIds[0];
    }
    
    // Get next index (loop back to 0 if at end)
    const nextIndex = (currentIndex + 1) % allNodeIds.length;
    return allNodeIds[nextIndex];
  }, [getAllSubcategoryNodeIds]);

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

  /**
   * Get the next category node ID in the interview order
   * Returns the root node ID for the next category, or null if no more categories
   * @deprecated - Use getNextSubcategoryNodeId instead for sequential navigation
   */
  const getNextCategoryNodeId = useCallback((currentCategoryId: string | null, nodes: QuestionNode[]): string | null => {
    if (!currentCategoryId) {
      // If no current category, return first category's first subcategory
      const firstCategory = CATEGORY_ORDER[0];
      return getFirstSubcategoryNodeId(firstCategory, nodes);
    }
    
    // Find current category index by checking if current node belongs to any category
    let currentIndex = -1;
    for (let i = 0; i < CATEGORY_ORDER.length; i++) {
      const cat = CATEGORY_ORDER[i];
      const categoryItems = CATEGORY_MAP[cat] || [];
      // Check if current node is in this category (including subcategories)
      const isInCategory = categoryItems.some(item => {
        if (item.nodeId === currentCategoryId) return true;
        if (item.subcategories) {
          return item.subcategories.some(sub => sub.nodeId === currentCategoryId);
        }
        return false;
      });
      if (isInCategory) {
        currentIndex = i;
        break;
      }
    }
    
    if (currentIndex === -1) {
      // Current node not in category order, return first category's first subcategory
      const firstCategory = CATEGORY_ORDER[0];
      return getFirstSubcategoryNodeId(firstCategory, nodes);
    }
    
    // Get next category
    const nextIndex = currentIndex + 1;
    if (nextIndex >= CATEGORY_ORDER.length) {
      // No more categories
      return null;
    }
    
    const nextCategory = CATEGORY_ORDER[nextIndex];
    return getFirstSubcategoryNodeId(nextCategory, nodes);
  }, []);
  
  // UI State: Navigation
  const [currentNodeId, setCurrentNodeId] = useState<string>('');
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

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

  const getTerritoryBiasedAdjacentNodeId = useCallback((nodeId: string | null, direction: 'next' | 'previous') => {
    const fallbackNodeId = getAdjacentUsableNodeId(nodeId, direction);
    if (territoryNavigationMode !== 'biased' || !activeTerritoryCategoryIds.length || usableNodeIds.length === 0) {
      return fallbackNodeId;
    }

    if (!nodeId) {
      return fallbackNodeId;
    }

    const currentIndex = usableNodeIds.indexOf(nodeId);
    if (currentIndex === -1) {
      return fallbackNodeId;
    }

    const preferredCategorySet = new Set(activeTerritoryCategoryIds);
    const step = direction === 'next' ? 1 : -1;

    for (
      let index = currentIndex + step;
      index >= 0 && index < usableNodeIds.length;
      index += step
    ) {
      const candidateNodeId = usableNodeIds[index];
      const categoryId = getCategoryForNode(candidateNodeId);
      if (categoryId && preferredCategorySet.has(categoryId)) {
        return candidateNodeId;
      }
    }

    return fallbackNodeId;
  }, [activeTerritoryCategoryIds, getAdjacentUsableNodeId, getCategoryForNode, territoryNavigationMode, usableNodeIds]);

  const getPreferredTerritoryStartNodeId = useCallback(() => {
    if (!activeTerritoryCategoryIds.length) return '';

    const preferredCategorySet = new Set(activeTerritoryCategoryIds);
    const preferredUsableNodeId = usableNodeIds.find(nodeId => {
      const categoryId = getCategoryForNode(nodeId);
      return categoryId ? preferredCategorySet.has(categoryId) : false;
    });

    if (preferredUsableNodeId) {
      return preferredUsableNodeId;
    }

    const preferredQuestionNode = questionNodes.find(node => {
      const categoryId = getCategoryForNode(node.id);
      return categoryId ? preferredCategorySet.has(categoryId) : false;
    });

    return preferredQuestionNode?.id ?? '';
  }, [activeTerritoryCategoryIds, getCategoryForNode, questionNodes, usableNodeIds]);

  const getInitialUsableNodeId = useCallback(() => usableNodeIds[0] ?? '', [usableNodeIds]);
  const isCurrentNodeUsable = isNodeUsable(currentNodeId, questionNodes, effectiveAttributeDefinitions);
  const hasNextUsableNode = useMemo(() => {
    if (!currentNodeId || !usableNodeIds.includes(currentNodeId)) {
      return false;
    }

    return getTerritoryBiasedAdjacentNodeId(currentNodeId, 'next') !== null;
  }, [currentNodeId, getTerritoryBiasedAdjacentNodeId, usableNodeIds]);
  
  // Track if user has explicitly clicked Next to reach the end
  // This ensures completion only happens after explicit Next click, not just from selections
  const [hasReachedEndViaNext, setHasReachedEndViaNext] = useState<boolean>(false);

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
  
  // Check if interview is complete
  // CRITICAL RULE: Completion ONLY happens after user explicitly clicks Next button
  // Completion requires ALL of:
  // 1. There's a current node
  // 2. There's no next node (reached the end)
  // 3. User has explicitly clicked Next to reach this end state (hasReachedEndViaNext)
  // 4. User has made at least one selection
  // 
  // This ensures:
  // - Completion NEVER happens just from making selections
  // - Completion ONLY happens after explicit Next button click
  // - Next button is ALWAYS required to proceed
  const isComplete = currentNode && 
                     isCurrentNodeUsable &&
                     !hasNextUsableNode &&
                     hasReachedEndViaNext &&
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
   * Does NOT automatically navigate - user must click Next button
   */
  const handleAttributeSelect = useCallback((attributeId: string) => {
    console.log('[App] Attribute selected:', attributeId);
    console.log('[App] Current node ID:', currentNodeId);
    console.log('[App] Will NOT navigate - user must click Next button');
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
    
    // EXPLICITLY DO NOT NAVIGATE - user must click Next button
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

  const refreshWorkingSets = useCallback(async () => {
    setWorkingSetsLoading(true);
    try {
      const next = await listWorkingSets();
      setWorkingSets(next);
    } catch {
      setWorkingSets([]);
    } finally {
      setWorkingSetsLoading(false);
    }
  }, []);

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

  const handleSetActiveWorkingSet = (id: string | null) => {
    setUnavailableJumpNodeId(null);
    setHasReachedEndViaNext(false);
    setActiveWorkingSet(id);
    persistActiveWorkingSetId(id);
  };

  const handleSetActiveTerritory = (id: string | null) => {
    setActiveTerritory(id);
    persistActiveTerritoryId(id);
  };

  const handleUseTerritoryInBuilder = (id: string | null) => {
    handleSetActiveTerritory(id);
    setTerritoryNavigationMode('biased');
    setActivePage('generator');
    const territory = territories.find(entry => entry.id === id) ?? null;
    const preferredStartNodeId = territory ? getPreferredTerritoryStartNodeId() : '';
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

  const handleOpenTerritoryEditor = (territoryId: string) => {
    setTerritoryEditTargetId(territoryId);
    setActivePage('user-pools');
  };

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

  const handleCreateWorkingSet = async (
    name: string,
    payload?: Partial<Omit<WorkingSet, 'id' | 'name' | 'createdAt' | 'updatedAt'>>
  ) => {
    try {
      const created = await createWorkingSet(name, payload);
      await refreshWorkingSets();
      setActiveWorkingSet(created.id);
      return created;
    } catch {
      return null;
    }
  };

  const handleRenameWorkingSet = async (id: string, name: string) => {
    await updateWorkingSet(id, { name });
    await refreshWorkingSets();
  };

  const handleDeleteWorkingSet = async (id: string) => {
    await deleteWorkingSet(id);
    await refreshWorkingSets();
    setActiveWorkingSet(getActiveWorkingSetId());
  };

  const handleAddWorkingSetItem = async (setId: string, categoryId: string, poolId: string, item: PoolItem) => {
    await addWorkingSetItem(setId, categoryId, {
      poolId,
      poolItemId: item.id,
      text: item.text,
    });
    await refreshWorkingSets();
  };

  const handleRemoveWorkingSetItem = async (setId: string, categoryId: string, itemId: string) => {
    await removeWorkingSetItem(setId, categoryId, itemId);
    await refreshWorkingSets();
  };

  const handleClearWorkingSetCategory = async (setId: string, categoryId: string) => {
    await clearWorkingSetCategory(setId, categoryId);
    await refreshWorkingSets();
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

  const handleAddPoolItem = useCallback((text: string) => {
    if (!text.trim()) return;
    const id = `pool_add_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setPoolPromptItems(prev => [...prev, { id, text: text.trim(), weight: 1.0, sourceType: 'pool' }]);
  }, []);

  const handleAppendPoolItem = useCallback((text: string, targetId?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setPoolPromptItems(prev => {
      if (prev.length === 0) {
        const id = `pool_add_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        return [...prev, { id, text: trimmed, weight: 1.0, sourceType: 'pool' }];
      }
      const next = [...prev];
      let targetIndex = targetId ? next.findIndex(item => item.id === targetId) : next.length - 1;
      if (targetIndex === -1) targetIndex = next.length - 1;
      const target = next[targetIndex];
      const override = poolOutputOverrides.get(target.id);
      if (override) {
        setPoolOutputOverrides(prevOverrides => {
          const updated = new Map(prevOverrides);
          updated.set(target.id, `${override} ${trimmed}`);
          return updated;
        });
        return next;
      }
      next[targetIndex] = { ...target, text: `${target.text} ${trimmed}` };
      return next;
    });
  }, [poolOutputOverrides]);

  const handleRandomizePoolItems = useCallback((items: string[]) => {
    const next = items
      .filter(Boolean)
      .map(text => ({
        id: `pool_add_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        text: text.trim(),
        weight: 1.0,
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

  const handleToggleTerritoryItem = useCallback((item: {
    id: string;
    text: string;
  }) => {
    setPoolPromptItems(prev => {
      const exists = prev.some(entry => entry.id === item.id);
      if (exists) {
        return prev.filter(entry => entry.id !== item.id);
      }
      return [...prev, { id: item.id, text: item.text.trim(), weight: 1.0, sourceType: 'territory' }];
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

  const handleClearPrompt = useCallback(() => {
    const hasSelections = selections.size > 0;
    const hasModifiers = modifiers.size > 0;
    const hasPoolItems = poolPromptItems.length > 0;
    if (!hasSelections && !hasModifiers && !hasPoolItems) {
      return;
    }
    setClearUndoState({
      selections: new Map(selections),
      modifiers: new Map(modifiers),
      poolPromptItems: [...poolPromptItems],
      poolOutputOverrides: new Map(poolOutputOverrides),
      selectionOutputOverrides: new Map(selectionOutputOverrides),
    });
    setSelections(new Map());
    setModifiers(new Map());
    setPoolPromptItems([]);
    setPoolOutputOverrides(new Map());
    setSelectionOutputOverrides(new Map());
  }, [selections, modifiers, poolPromptItems, poolOutputOverrides, selectionOutputOverrides]);

  const handleUndoClearPrompt = useCallback(() => {
    if (!clearUndoState) return;
    setSelections(new Map(clearUndoState.selections));
    setModifiers(new Map(clearUndoState.modifiers));
    setPoolPromptItems([...clearUndoState.poolPromptItems]);
    setPoolOutputOverrides(new Map(clearUndoState.poolOutputOverrides));
    setSelectionOutputOverrides(new Map(clearUndoState.selectionOutputOverrides));
    setClearUndoState(null);
  }, [clearUndoState]);

  const handleEditedOutputChange = useCallback((positive: string | null, negative: string | null) => {
    setEditedPositiveOutput(positive);
    setEditedNegativeOutput(negative);
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
  const poolAdditionItems = poolPromptItems.map((item, index) => {
    return { id: item.id, text: formatPromptAdditionText(item) };
  });

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

    activeTerritory.sources.forEach(source => {
      const mappedCategories = TERRITORY_SECTION_CATEGORY_MAP[source.section] ?? [];
      if (!mappedCategories.includes(categoryId)) return;

      const pool = territoryPools.find(entry => entry.id === source.poolId);
      const sectionItems = (pool?.items ?? [])
        .filter(item => item.section?.trim() === source.section)
        .slice(0, 6);

      sectionItems.forEach(item => {
        const normalizedText = item.text.trim().toLowerCase();
        if (!normalizedText || seenTexts.has(normalizedText)) return;
        seenTexts.add(normalizedText);
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
    });

    return items.slice(0, 10);
  }, [activeTerritory, currentNode?.id, getCategoryForNode, poolOutputOverrides, poolPromptItems, territoryPools]);

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
  

  // Persist active page
  useEffect(() => {
    try {
      window.localStorage.setItem('promptgen:active_page', activePage);
    } catch {
      // ignore
    }
  }, [activePage]);

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

    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => {
      window.removeEventListener('hashchange', syncFromHash);
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
    if (activePage === 'working-sets' || activePage === 'generator') {
      if (authUser) {
        refreshWorkingSets();
        setActiveWorkingSet(getActiveWorkingSetId());
      } else {
        setWorkingSets([]);
        setActiveWorkingSet(null);
        setWorkingSetsLoading(false);
      }
    }
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
  }, [activePage, authUser, refreshTerritories, refreshTerritoryPools, refreshWorkingSets]);

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
      refreshWorkingSets();
    } else {
      setWorkingSets([]);
      setActiveWorkingSet(null);
      setWorkingSetsLoading(false);
    }
  }, [authUser, refreshWorkingSets]);

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
      <div className="app-page-toggle">
        <div className="app-page-toggle-left">
          <button
            type="button"
            className="app-page-brand"
            aria-label="Go to builder start"
            onClick={handleGoToBuilderStart}
          >
            <span className="app-page-brand-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="app-page-brand-text">MORPBASE</span>
          </button>
          {authReady && authUser ? (
            <>
              <button
                type="button"
                className="app-page-toggle-action-button"
                title={authUser.email}
                onClick={handleOpenAccount}
              >
                {authUser.name}
              </button>
              <button
                type="button"
                className="app-page-toggle-action-button"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          ) : (
            <div className="app-page-toggle-auth-hint">
              {authReady ? (
                <>
                  <button
                    type="button"
                    className="app-page-toggle-action-button"
                    onClick={handleOpenAuth}
                  >
                    Beta login
                  </button>
                  <span>(beta)</span>
                </>
              ) : (
                <span>Checking session...</span>
              )}
            </div>
          )}
          <a
            className="app-page-toggle-action-button"
            href={manualLink('quick-start')}
            target="_blank"
            rel="noreferrer"
          >
            Manual
          </a>
          <button
            type="button"
            className="app-page-toggle-action-button"
            onClick={() => {
              setFeedbackCopied(false);
              setIsFeedbackModalOpen(true);
            }}
          >
            Feedback
          </button>
          <button
            type="button"
            className={`app-page-toggle-action-button ${activePage === 'working-sets' ? 'active' : ''}`}
            onClick={() => setActivePage('working-sets')}
          >
            Legacy Sets
          </button>
        </div>
        <div className="app-page-toggle-group" role="tablist" aria-label="App mode">
          <button
            type="button"
            className={`app-page-toggle-btn ${activePage === 'generator' ? 'active' : ''}`}
            onClick={() => setActivePage('generator')}
            role="tab"
            aria-selected={activePage === 'generator'}
          >
            Builder
          </button>
          <button
            type="button"
            className={`app-page-toggle-btn ${activePage === 'prompts' ? 'active' : ''}`}
            onClick={() => setActivePage('prompts')}
            role="tab"
            aria-selected={activePage === 'prompts'}
          >
            Prompts
          </button>
          <button
            type="button"
            className={`app-page-toggle-btn ${activePage === 'user-pools' ? 'active' : ''}`}
            onClick={() => setActivePage('user-pools')}
            role="tab"
            aria-selected={activePage === 'user-pools'}
          >
            User Pools
          </button>
          <button
            type="button"
            className={`app-page-toggle-btn ${activePage === 'my-profile' ? 'active' : ''}`}
            onClick={() => setActivePage('my-profile')}
            role="tab"
            aria-selected={activePage === 'my-profile'}
          >
            My Profile
          </button>
          <button
            type="button"
            className={`app-page-toggle-btn ${activePage === 'pool-hub' ? 'active' : ''}`}
            onClick={() => setActivePage('pool-hub')}
            role="tab"
            aria-selected={activePage === 'pool-hub'}
          >
            Pool Hub
          </button>
          {isAdmin && (
            <button
              type="button"
              className={`app-page-toggle-btn ${activePage === 'admin' ? 'active' : ''}`}
              onClick={() => setActivePage('admin')}
              role="tab"
              aria-selected={activePage === 'admin'}
            >
              Admin
            </button>
          )}
        </div>
      </div>
      {activePage === 'admin' ? (
        <AdminPage userName={authUser?.name ?? null} />
      ) : activePage === 'user-pools' ? (
        <UserPoolsPage
          manualUrl={manualUrl}
          onAddToPrompt={handleAddPoolItem}
          onAppendToPrompt={handleAppendPoolItem}
          onRandomizePoolItems={handleRandomizePoolItems}
          prompt={prompt}
          customAdditions={poolAdditionTexts}
          editedPositive={editedPositiveOutput}
          editedNegative={editedNegativeOutput}
          onEditedOutputChange={handleEditedOutputChange}
          additionItems={poolAdditionItems}
          onClearPrompt={handleClearPrompt}
          onUndoClearPrompt={handleUndoClearPrompt}
          canUndoClearPrompt={Boolean(clearUndoState)}
          authUser={authUser}
          authReady={authReady}
          isPro={isPro}
          territories={territories}
          territoriesLoading={territoriesLoading}
          activeTerritoryId={activeTerritoryId}
          territoryEditTargetId={territoryEditTargetId}
          onCreateTerritory={handleCreateTerritory}
          onUpdateTerritory={handleUpdateTerritory}
          onDeleteTerritory={handleDeleteTerritory}
          onUseTerritoryInBuilder={handleUseTerritoryInBuilder}
          onDeactivateTerritory={() => handleSetActiveTerritory(null)}
          onTerritoryEditTargetHandled={() => setTerritoryEditTargetId(null)}
        />
      ) : activePage === 'my-profile' ? (
        <MyProfilePage
          isLoggedIn={authReady && Boolean(authUser)}
          userName={authUser?.name ?? null}
          onRequestLogin={handleOpenAuth}
        />
      ) : activePage === 'creator-profile' ? (
        <PublicCreatorPage
          creatorId={selectedCreatorProfileTarget?.creatorId ?? null}
          creatorName={selectedCreatorProfileTarget?.creatorName ?? null}
          onBack={() => setActivePage('pool-hub')}
          onOpenPool={(entryId) => {
            setActivePage('pool-hub');
            window.setTimeout(() => {
              window.dispatchEvent(new CustomEvent('morpbase:open-hub-entry', { detail: { entryId } }));
            }, 0);
          }}
        />
      ) : activePage === 'pool-hub' ? (
        <PoolHubPage
          manualUrl={manualUrl}
          onGoToUserPools={() => setActivePage('user-pools')}
          onGoToProfile={() => setActivePage('my-profile')}
          onOpenCreatorProfile={handleOpenCreatorProfilePage}
          isLoggedIn={authReady && Boolean(authUser)}
          onRequestLogin={handleOpenAuth}
          userName={authUser?.name ?? null}
          userId={authUser?.id ?? null}
          isPro={isPro}
        />
      ) : activePage === 'prompts' ? (
        <PromptsPage
          manualUrl={manualUrl}
          prompt={prompt}
          customAdditions={poolAdditionTexts}
          editedPositive={editedPositiveOutput}
          editedNegative={editedNegativeOutput}
          onEditedOutputChange={handleEditedOutputChange}
          onClearPrompt={handleClearPrompt}
          onUndoClearPrompt={handleUndoClearPrompt}
          canUndoClearPrompt={Boolean(clearUndoState)}
          onAddToPrompt={handleAddPoolItem}
          authUser={authUser}
          isPro={isPro}
        />
      ) : activePage === 'working-sets' ? (
        <WorkingSetsPage
          manualUrl={manualUrl}
          workingSets={workingSets}
          baseSetTemplate={baseSetTemplate}
          workingSetsLoading={workingSetsLoading}
          activeWorkingSetId={activeWorkingSetId}
          categoryOrder={CATEGORY_ORDER}
          onCreateWorkingSet={handleCreateWorkingSet}
          onRenameWorkingSet={handleRenameWorkingSet}
          onDeleteWorkingSet={handleDeleteWorkingSet}
          onSetActiveWorkingSet={handleSetActiveWorkingSet}
          onAddWorkingSetItem={handleAddWorkingSetItem}
          onRemoveWorkingSetItem={handleRemoveWorkingSetItem}
          onClearWorkingSetCategory={handleClearWorkingSetCategory}
          authReady={authReady}
          authUser={authUser}
          isPro={isPro}
        />
      ) : (
        <>
        <div className="interview-layout">
              <CategorySidebar
                categoryMap={CATEGORY_MAP}
                currentNodeId={currentNodeId}
                selections={selectionsMap}
                onJumpToCategory={handleJumpToCategory}
                onOpenRandom={() => setIsRandomPromptModalOpen(true)}
                onOpenTutorial={() => setIsAppTutorialOpen(true)}
                activeTerritoryName={activeTerritory?.name ?? null}
                highlightedCategoryIds={activeTerritoryCategoryIds}
              />
          <div className="interview-container">
            <div className="app-main">
              {builderNotice && (
                <div className="builder-notice">
                  <span>{builderNotice}</span>
                  <button type="button" onClick={() => setBuilderNotice(null)}>
                    Dismiss
                  </button>
                </div>
              )}
              {isComplete ? (
                <CompletionState
                  totalSteps={navigationHistory.length}
                  onStartOver={handleStartOver}
                  onReview={handleReview}
                />
              ) : unavailableJumpNodeId === '__builder_empty__' ? (
                <div className="app-error-state">
                  <p>No Builder elements are currently available.</p>
                  <div className="builder-state-actions">
                    <button onClick={handleStartOver}>Restart Builder</button>
                  </div>
                </div>
              ) : unavailableJumpNode ? (
                <div className="app-error-state">
                  <p>This section is not currently available.</p>
                  <div className="builder-state-subtitle">{unavailableJumpNode.question}</div>
                  <div className="builder-state-actions">
                    <button
                      onClick={() => handleGoToUsableNode(getAdjacentUsableNodeId(unavailableJumpNode.id, 'next'))}
                    >
                      Go to Next Available Section
                    </button>
                  </div>
                </div>
              ) : currentNode && !isCurrentNodeUsable ? (
                <div className="app-error-state">
                  <p>This section is currently unavailable.</p>
                  <div className="builder-state-actions">
                    <button
                      onClick={() => handleGoToUsableNode(getAdjacentUsableNodeId(currentNode.id, 'next'))}
                    >
                      Go to Next Available Section
                    </button>
                  </div>
                </div>
              ) : currentNode ? (
                <QuestionCard
                  node={currentNode}
                  currentStep={navigationHistory.length}
                  selections={selectionsMap}
                  modifierValues={modifierValues}
                  attributeDefinitions={currentQuestionAttributesWithExtensions}
                  modifiers={currentQuestionModifiers}
                  onSelect={handleAttributeSelect}
                  onDeselect={handleAttributeDeselect}
                  onCustomExtensionChange={handleCustomExtensionChange}
                  onWeightChange={handleWeightChange}
                  weightsEnabledGlobal={weightsEnabledGlobal}
                  onToggleGlobalWeights={setWeightsEnabledGlobal}
                  selectionOutputOverrides={selectionOutputOverrides}
                  onSetSelectionOutputOverride={handleSetSelectionOutputOverride}
                  onNavigateBack={handleNavigateBack}
                  onNavigateNext={handleNavigateNext}
                  onNavigateSkip={handleNavigateSkip}
                  canGoBack={navigationHistory.length > 1}
                  canGoNext={true}
                  sectionTitle={currentBuilderAreaLabel}
                  territoryContext={currentTerritoryContext}
                  territoryItems={currentTerritoryItems}
                  onToggleTerritoryItem={itemId => {
                    const territoryItem = currentTerritoryItems.find(item => item.id === itemId);
                    if (!territoryItem) return;
                    handleToggleTerritoryItem({ id: territoryItem.id, text: territoryItem.outputText ?? territoryItem.text });
                  }}
                  onSetTerritoryItemOutputOverride={handleSetPoolOutputOverride}
                  onSetTerritoryItemWeight={handleSetPromptAdditionWeight}
                />
              ) : (
                <div className="app-error-state">
                  <p>Question not found. Please start over.</p>
                  <button onClick={handleStartOver}>Restart Builder</button>
                </div>
              )}
              {displayError && (
                <ErrorDisplay
                  error={displayError}
                  selections={selectionsMap}
                  onRemoveSelection={handleRemoveSelection}
                />
              )}
            </div>
            <div className="app-sidebar">
              <div className="builder-sidebar-quick-actions">
                <button
                  type="button"
                  className="builder-sidebar-primary-action"
                  onClick={() => setSavePromptOpenSignal(prev => prev + 1)}
                >
                  Save Prompt
                </button>
              </div>
              <div className="builder-sidebar-panel territory-sidebar-panel">
                <div className="builder-sidebar-panel-header">
                  <div>
                    <div className="builder-sidebar-panel-label">Territory</div>
                    <div className="builder-sidebar-panel-title">
                      {activeTerritory ? activeTerritory.name : 'No active Territory'}
                    </div>
                  </div>
                </div>
                {activeTerritory ? (
                  <>
                    <div className="territory-sidebar-sources">
                      {activeTerritory.sources.slice(0, 4).map(source => (
                        <span key={source.id} className="territory-banner-chip">
                          {source.section} from {source.poolName}
                        </span>
                      ))}
                      {activeTerritory.sources.length > 4 && (
                        <span className="territory-banner-more">
                          +{activeTerritory.sources.length - 4} more
                        </span>
                      )}
                    </div>
                    <label className="territory-banner-switch territory-sidebar-switch">
                      <span>Navigation</span>
                      <select
                        value={territoryNavigationMode}
                        onChange={event => setTerritoryNavigationMode(event.target.value as 'biased' | 'full')}
                      >
                        <option value="biased">Territory-biased</option>
                        <option value="full">Full Builder</option>
                      </select>
                    </label>
                    {(activeTerritory.description?.trim() || activeTerritoryMappings.length > 0) && (
                      <details className="territory-banner-details">
                        <summary>
                          Territory details
                          <span className="territory-banner-details-meta">
                            {activeTerritoryMappings.length} mapping{activeTerritoryMappings.length === 1 ? '' : 's'}
                          </span>
                        </summary>
                        {activeTerritory.description?.trim() && (
                          <div className="territory-banner-description">
                            {activeTerritory.description}
                          </div>
                        )}
                        {activeTerritoryMappings.length > 0 && (
                          <div className="territory-banner-mapping">
                            <div className="territory-banner-mapping-heading">
                              <span>Builder mapping</span>
                              <span className="territory-banner-mapping-summary">
                                {activeTerritoryMappings.length} source{activeTerritoryMappings.length === 1 ? '' : 's'}
                              </span>
                            </div>
                            <div className="territory-banner-mapping-list">
                              {activeTerritoryMappings.slice(0, 5).map(mapping => (
                                <div key={mapping.id} className="territory-banner-mapping-item">
                                  <span className="territory-banner-mapping-source">
                                    {mapping.section} from {mapping.poolName}
                                  </span>
                                  <span className="territory-banner-mapping-arrow">-&gt;</span>
                                  <span className="territory-banner-mapping-target">
                                    {mapping.categoryLabels.length > 0 ? mapping.categoryLabels.join(', ') : 'No Builder areas yet'}
                                  </span>
                                  <button
                                    type="button"
                                    className="territory-banner-mapping-remove"
                                    onClick={() => void handleRemoveActiveTerritorySource(mapping.id)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              {activeTerritoryMappings.length > 5 && (
                                <div className="territory-banner-mapping-more">
                                  +{activeTerritoryMappings.length - 5} more mappings
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </details>
                    )}
                    <div className="territory-sidebar-actions">
                      <button type="button" onClick={() => activeTerritory && handleOpenTerritoryEditor(activeTerritory.id)}>
                        Edit Territory
                      </button>
                      <button type="button" onClick={() => setActivePage('user-pools')}>
                        Manage Territories
                      </button>
                      <button type="button" onClick={() => handleSetActiveTerritory(null)}>
                        Turn Off Territory
                      </button>
                    </div>
                  </>
                ) : territories.length > 0 ? (
                  <div className="territory-reactivate-bar territory-reactivate-bar-sidebar">
                    <div className="territory-reactivate-copy">
                      <span className="territory-reactivate-text">Activate a saved Territory without leaving Builder.</span>
                    </div>
                    <div className="territory-reactivate-actions">
                      <select
                        value={builderTerritoryPickerId}
                        onChange={event => setBuilderTerritoryPickerId(event.target.value)}
                      >
                        {territories.map(territory => (
                          <option key={territory.id} value={territory.id}>
                            {territory.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => builderTerritoryPickerId && handleUseTerritoryInBuilder(builderTerritoryPickerId)}
                        disabled={!builderTerritoryPickerId}
                      >
                        Activate Territory
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="territory-reactivate-text">Create a Territory in User Pools to use Builder focus mode.</div>
                )}
              </div>
              <details className="builder-sidebar-panel builder-guidance-sidebar">
                <summary>
                  <span className="builder-sidebar-panel-label">Builder Guide</span>
                  <span className="builder-guidance-summary">Choose left, build center, copy right</span>
                </summary>
                <div className="builder-guidance-body">
                  <p className="builder-guidance-intro">
                    Select prompt elements by category and MorpBase assembles the final prompt for you. The product is gradually aligning around shared creative layers like subjects, environment, lighting, mood, style, and effects.
                  </p>
                  <div className="builder-guidance-steps">
                    <span className="builder-guidance-label">How it works:</span>
                    <span>1. Choose from the left</span>
                    <span>2. Build in the center</span>
                    <span>3. Edit text or adjust weight on selected elements</span>
                    <span>4. Copy on the right</span>
                  </div>
                  {activeTerritory && (
                    <div className="builder-guidance-territory-note">
                      Territory highlight is active. The sidebar is showing the Builder areas most relevant to this Territory first, without hiding the rest, and navigation mode is currently set to {territoryNavigationMode === 'biased' ? 'Territory-biased' : 'Full Builder'}.
                    </div>
                  )}
                </div>
              </details>
              <PromptPreview 
                prompt={prompt}
                customAdditions={poolAdditionTexts}
                exportMode={exportMode}
                onExportModeChange={setExportMode}
                onEditedOutputChange={handleEditedOutputChange}
                onClear={handleClearPrompt}
                onUndoClear={handleUndoClearPrompt}
                canUndoClear={Boolean(clearUndoState)}
              />
              <PromptLibrary
                prompt={prompt}
                customAdditions={poolAdditionTexts}
                editedPositive={editedPositiveOutput}
                editedNegative={editedNegativeOutput}
                onAddToPrompt={handleAddPoolItem}
                authUser={authUser}
                isPro={isPro}
                manualUrl={manualUrl}
                showCloudPrompts={false}
                showLocalPrompts={true}
                hideSaveBar={true}
                externalOpenSaveSignal={savePromptOpenSignal}
              />
            </div>
            
            {/* Random Prompt Generator Modal */}
            <Modal
              isOpen={isRandomPromptModalOpen}
              onClose={() => setIsRandomPromptModalOpen(false)}
              title="Random Prompt Generator"
              className="random-prompt-modal"
            >
              <div className="random-prompt-modal-body">
                {/* Description Section */}
                <div className="random-prompt-description">
                  <div className="random-prompt-description-content">
                    <h3 className="random-prompt-description-title">What is this tool?</h3>
                    <p className="random-prompt-description-text">
                      The <strong>Random Prompt Generator</strong> helps you quickly create diverse, well-structured prompts without manually selecting every detail. 
                      Simply choose which parts of the Builder interest you most, from defining the subject to refining lighting and finishing the look, and the tool will randomly combine attributes from those categories 
                      to generate a complete prompt ready to use in Stable Diffusion.
                    </p>
                    <p className="random-prompt-description-text">
                      You can also <strong>expand any category</strong> by clicking on it to see its subcategories (for example, expanding "Style" reveals "Illustration", "Realistic", "Painting", etc.). 
                      This allows you to be more specific—you can enable only the subcategories you want, giving you precise control over which types of attributes will be randomly selected.
                    </p>
                    <p className="random-prompt-description-text">
                      This is perfect for exploring new ideas, getting inspiration, or quickly generating variations of prompts to see what works best.
                    </p>
                  </div>
                </div>
                
                <RandomPromptGenerator
                  attributeDefinitions={attributeDefinitions}
                  questionNodes={questionNodes}
                  manualUrl={manualUrl}
                  onRandomize={(selections) => {
                    handleRandomize(selections);
                    setIsRandomPromptModalOpen(false);
                  }}
                />
              </div>
            </Modal>

            {/* App Tutorial Modal */}
            <Modal
              isOpen={isAppTutorialOpen}
              onClose={() => setIsAppTutorialOpen(false)}
              title="How to Use the Prompt Builder"
            >
              <div className="app-tutorial-body">
                <section className="app-tutorial-section">
                  <h3 className="app-tutorial-heading">What is This Tool?</h3>
                  <p>
                    This tool helps you build high-quality text prompts for image generation models such as Stable Diffusion.
                    Instead of writing a long, complex prompt from scratch, you answer a series of focused questions
                    about your image in three stages: define the main idea, refine the look, and finish the result only if needed.
                  </p>
                  <p>
                    Want the full guide? Open the manual section on the Builder.
                    {' '}
                    <a href={manualLink('builder')} target="_blank" rel="noreferrer">
                      Deep dive in the manual
                    </a>
                    .
                  </p>
                </section>

                <section className="app-tutorial-section">
                  <h3 className="app-tutorial-heading">How It Works</h3>
                  <p>
                    Start by defining the image with the core pillars: who or what is in the scene, where it exists, and what visual language it should follow.
                    Then refine the look with lighting, camera framing, and actions. Finish with extra polish only when you need it.
                  </p>
                  <p>
                    Each answer you choose adds structured pieces to your final prompt, and the prompt preview on the right updates as you go,
                    so you can see exactly what will be sent to the model.
                  </p>
                </section>

                <section className="app-tutorial-section">
                  <h3 className="app-tutorial-heading">Navigating the Interface</h3>
                  <p>
                    <strong>Next Button:</strong> Move through the Builder in order, starting with the main image definition and then moving into refinement.
                  </p>
                  <p>
                    <strong>Category Sidebar:</strong> Jump directly to any category or subcategory by clicking on it in the left sidebar.
                    The sidebar is grouped into Define, Refine, and Finish so it is easier to see what matters first.
                    Finish is intentionally optional and is mainly for extra polish, atmosphere, and final treatment.
                  </p>
                  <p>
                    <strong>Prompt Preview:</strong> Watch your prompt build in real-time on the right side as you make selections.
                  </p>
                </section>

                <section className="app-tutorial-section">
                  <h3 className="app-tutorial-heading">Building Your Prompt</h3>
                  <p>
                    Start by selecting attributes from the current question. You can select multiple options, and each selection
                    contributes to your final prompt. You can refine or remove choices at any time by navigating back to previous
                    questions or using the sidebar.
                  </p>
                  <p>
                    When you're happy with the result, copy the prompt text from the preview panel and paste it into your
                    image-generation interface (like Stable Diffusion, Midjourney, or similar tools).
                  </p>
                </section>

                <section className="app-tutorial-section">
                  <h3 className="app-tutorial-heading">Using the Random Prompt Generator</h3>
                  <p>
                    If you want quick inspiration instead of manually answering questions, use the <strong>Random Prompt Generator</strong>
                    button in the bottom-right corner. This opens a separate tool that creates prompts automatically based on
                    randomly selected attributes from categories you choose.
                  </p>
                  <p>
                    This is perfect for exploring new ideas, getting inspiration, or quickly generating variations to see what works best.
                  </p>
                  <p>
                    <a href={manualLink('random-prompt-generator')} target="_blank" rel="noreferrer">
                      See Random Prompt Generator in the manual
                    </a>
                    .
                  </p>
                </section>

                <section className="app-tutorial-section">
                  <h3 className="app-tutorial-heading">Tips for Best Results</h3>
                  <ul className="app-tutorial-list">
                    <li>Be specific with your selections—more detail often leads to better results</li>
                    <li>Use the sidebar to jump between categories and refine your choices</li>
                    <li>Check the prompt preview regularly to see how your selections combine</li>
                    <li>Experiment with different combinations to find what works best for your needs</li>
                    <li>Use the Random Generator to discover new prompt styles you might not have considered</li>
                  </ul>
                </section>
              </div>
            </Modal>
          </div>
        </div>
        </>
      )}
      </>
      )}
      </div>
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
