import { useMemo, useState, useEffect } from 'react';
import { POOL_SECTION_OPTIONS } from '../../types';
import type { Pool, PoolFolder, PoolItem, Territory, TerritorySourceInput } from '../../types';
import {
  addItemToPool,
  createPool,
  createPoolFolder,
  deletePool,
  deletePoolItem,
  exportPoolPayload,
  importPoolPayload,
  listPoolFolders,
  listPools,
  movePoolToFolder,
  renamePool,
  updatePoolFolderOrder,
  updatePoolItem,
} from '../../engine/poolStore';
import { createPoolFromTemplate } from '../../engine/poolTemplates';
import { defaultUserPools } from '../../data/defaultUserPools';
import { Modal } from './Modal';
import './UserPoolsPage.css';

type UserPoolsPageProps = {
  onAddToPrompt?: (text: string) => void;
  onAppendToPrompt?: (text: string, targetId?: string) => void;
  onRandomizePoolItems?: (items: string[]) => void;
  prompt?: any | null;
  customAdditions?: string[];
  editedPositive?: string | null;
  editedNegative?: string | null;
  onEditedOutputChange?: (positive: string | null, negative: string | null) => void;
  additionItems?: Array<{ id: string; text: string }>;
  onClearPrompt?: () => void;
  onUndoClearPrompt?: () => void;
  canUndoClearPrompt?: boolean;
  authUser?: { id: string } | null;
  authReady?: boolean;
  isPro?: boolean;
  manualUrl?: string;
  territories?: Territory[];
  territoriesLoading?: boolean;
  activeTerritoryId?: string | null;
  territoryEditTargetId?: string | null;
  onCreateTerritory?: (
    name: string,
    description: string,
    sources: TerritorySourceInput[]
  ) => Promise<Territory | null>;
  onUpdateTerritory?: (
    id: string,
    patch: { name?: string; description?: string; sources?: TerritorySourceInput[] }
  ) => Promise<Territory | null>;
  onDeleteTerritory?: (id: string) => Promise<void>;
  onUseTerritoryInBuilder?: (id: string) => void;
  onDeactivateTerritory?: () => void;
  onTerritoryEditTargetHandled?: () => void;
};

export function UserPoolsPage({
  onAddToPrompt,
  onAppendToPrompt,
  onRandomizePoolItems,
  customAdditions = [],
  additionItems = [],
  authUser,
  authReady = false,
  isPro = false,
  manualUrl,
  territories = [],
  territoriesLoading = false,
  activeTerritoryId = null,
  territoryEditTargetId = null,
  onCreateTerritory,
  onUpdateTerritory,
  onDeleteTerritory,
  onUseTerritoryInBuilder,
  onDeactivateTerritory,
  onTerritoryEditTargetHandled,
}: UserPoolsPageProps) {
  const defaultFolderId = '__default_pools_folder__';
  const [pools, setPools] = useState<Pool[]>([]);
  const [folders, setFolders] = useState<PoolFolder[]>([]);
  const [poolsLoading, setPoolsLoading] = useState(false);
  const [activePoolId, setActivePoolId] = useState<string | null>(null);
  const [newPoolName, setNewPoolName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [editingPoolId, setEditingPoolId] = useState<string | null>(null);
  const [editingPoolName, setEditingPoolName] = useState('');
  const [poolError, setPoolError] = useState<string | null>(null);
  const [newItemText, setNewItemText] = useState('');
  const [newItemSection, setNewItemSection] = useState('');
  const [newItemTags, setNewItemTags] = useState('');
  const [newItemNote, setNewItemNote] = useState('');
  const [itemError, setItemError] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemText, setEditingItemText] = useState('');
  const [editingItemSection, setEditingItemSection] = useState('');
  const [editingItemTags, setEditingItemTags] = useState('');
  const [editingItemNote, setEditingItemNote] = useState('');
  const [editingAddItemId, setEditingAddItemId] = useState<string | null>(null);
  const [editingAddItemText, setEditingAddItemText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [bulkSection, setBulkSection] = useState('');
  const [bulkText, setBulkText] = useState('');
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [poolJson, setPoolJson] = useState('');
  const [poolJsonMessage, setPoolJsonMessage] = useState<string | null>(null);
  const [poolJsonError, setPoolJsonError] = useState<string | null>(null);
  const [isRandomizerOpen, setIsRandomizerOpen] = useState(false);
  const [randomizerError, setRandomizerError] = useState<string | null>(null);
  const [randomizerPoolSelection, setRandomizerPoolSelection] = useState<Map<string, boolean>>(new Map());
  const [randomizerCountPerPool, setRandomizerCountPerPool] = useState(2);
  const [randomizerPoolCounts, setRandomizerPoolCounts] = useState<Map<string, number>>(new Map());
  const [randomizerPoolOverrides, setRandomizerPoolOverrides] = useState<Map<string, boolean>>(new Map());
  const [randomizerAllowDuplicates, setRandomizerAllowDuplicates] = useState(false);
  const [randomizerTagMode, setRandomizerTagMode] = useState<'any' | 'only' | 'prefer'>('any');
  const [randomizerTagInput, setRandomizerTagInput] = useState('');
  const [randomizerAppendMode, setRandomizerAppendMode] = useState<'replace' | 'append'>('replace');
  const [appendTargetId, setAppendTargetId] = useState<string>('last');
  const [collapsedFolderIds, setCollapsedFolderIds] = useState<Set<string>>(new Set());
  const [draggedFolderId, setDraggedFolderId] = useState<string | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [territoryDraftId, setTerritoryDraftId] = useState<string | null>(null);
  const [territoryName, setTerritoryName] = useState('');
  const [territoryDescription, setTerritoryDescription] = useState('');
  const [territorySources, setTerritorySources] = useState<Array<{ poolId: string; section: string }>>([]);
  const [territoryError, setTerritoryError] = useState<string | null>(null);
  const [territoryMessage, setTerritoryMessage] = useState<string | null>(null);
  const gateMessage = !authReady
    ? 'Loading your pools...'
    : !authUser
      ? 'Log in to view and manage your pools.'
      : !isPro
        ? 'Upgrade to Pro to use User Pools.'
        : null;

  const defaultPools = useMemo(() => defaultUserPools, []);
  const availablePools = useMemo(() => [...defaultPools, ...pools], [defaultPools, pools]);
  const activePool = useMemo(
    () => availablePools.find(pool => pool.id === activePoolId) ?? null,
    [availablePools, activePoolId]
  );
  const isDefaultPoolSelected = useMemo(
    () => Boolean(activePool && defaultPools.some(pool => pool.id === activePool.id)),
    [activePool, defaultPools]
  );
  const groupedPools = useMemo(() => {
    const groups = new Map<string, { id: string; name: string; pools: Pool[] }>();
    const orderedGroupIds: string[] = [defaultFolderId, '__ungrouped__'];

    groups.set(defaultFolderId, { id: defaultFolderId, name: 'Default Pools', pools: [] });
    groups.set('__ungrouped__', { id: '__ungrouped__', name: 'Ungrouped', pools: [] });
    folders.forEach(folder => {
      groups.set(folder.id, { id: folder.id, name: folder.name, pools: [] });
      orderedGroupIds.push(folder.id);
    });

    availablePools.forEach(pool => {
      const key = pool.folderId ?? '__ungrouped__';
      const group = groups.get(key);
      if (group) group.pools.push(pool);
    });

    return orderedGroupIds
      .map(groupId => groups.get(groupId))
      .filter((group): group is { id: string; name: string; pools: Pool[] } => Boolean(group))
      .filter(group => group.pools.length > 0);
  }, [availablePools, defaultFolderId, folders]);

  const filteredItems = useMemo(() => {
    if (!activePool) return [];
    const term = searchTerm.trim().toLowerCase();
    const tagTerm = tagFilter.trim().toLowerCase();
    return activePool.items.filter(item => {
      const textMatch = term ? item.text.toLowerCase().includes(term) : true;
      const tags = item.tags || [];
      const tagMatch = tagTerm ? tags.some(tag => tag.toLowerCase().includes(tagTerm)) : true;
      return textMatch && tagMatch;
    });
  }, [activePool, searchTerm, tagFilter]);

  const sectionedPools = useMemo(() => {
    return pools
      .map(pool => {
        const sections = Array.from(
          new Set(
            pool.items
              .map(item => item.section?.trim())
              .filter((section): section is string => Boolean(section))
          )
        );
        const knownSections = POOL_SECTION_OPTIONS.filter(section => sections.includes(section));
        const customSections = sections
          .filter(section => !POOL_SECTION_OPTIONS.includes(section as (typeof POOL_SECTION_OPTIONS)[number]))
          .sort((a, b) => a.localeCompare(b));
        return {
          ...pool,
          availableSections: [...knownSections, ...customSections],
        };
      })
      .filter(pool => pool.availableSections.length > 0);
  }, [pools]);

  const territoryDraftSummary = useMemo(() => {
    const normalizedSources = territorySources
      .map(source => {
        const pool = sectionedPools.find(entry => entry.id === source.poolId);
        if (!pool) return null;
        const section = source.section.trim();
        if (!section) return null;
        const itemCount = pool.items.filter(item => item.section?.trim() === section).length;
        return {
          poolId: pool.id,
          poolName: pool.name,
          section,
          itemCount,
          duplicateKey: `${pool.id}::${section}`,
        };
      })
      .filter((source): source is { poolId: string; poolName: string; section: string; itemCount: number; duplicateKey: string } => Boolean(source));

    const duplicateCounts = new Map<string, number>();
    normalizedSources.forEach(source => {
      duplicateCounts.set(source.duplicateKey, (duplicateCounts.get(source.duplicateKey) ?? 0) + 1);
    });

    const uniqueSourceCount = new Set(normalizedSources.map(source => source.duplicateKey)).size;

    const sectionCounts = new Map<string, number>();
    normalizedSources.forEach(source => {
      sectionCounts.set(source.section, (sectionCounts.get(source.section) ?? 0) + 1);
    });

    const sections = [...sectionCounts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([section, count]) => ({ section, count }));

    const estimatedItems = normalizedSources.reduce((sum, source) => sum + source.itemCount, 0);
    const duplicateSourceCount = [...duplicateCounts.values()].filter(count => count > 1).length;
    const emptySourceCount = normalizedSources.filter(source => source.itemCount === 0).length;

    const warnings: string[] = [];
    if (duplicateSourceCount > 0) {
      warnings.push(`${duplicateSourceCount} duplicate source ${duplicateSourceCount === 1 ? 'pair is' : 'pairs are'} selected.`);
    }
    if (emptySourceCount > 0) {
      warnings.push(`${emptySourceCount} selected source ${emptySourceCount === 1 ? 'has' : 'have'} no items in that section.`);
    }

    return {
      sources: normalizedSources,
      uniqueSourceCount,
      sections,
      estimatedItems,
      duplicateSourceCount,
      emptySourceCount,
      warnings,
      duplicateCounts,
    };
  }, [sectionedPools, territorySources]);

  const filteredItemGroups = useMemo(() => {
    const hasSectionedItems = filteredItems.some(item => item.section);
    if (!hasSectionedItems) return [];

    const grouped = new Map<string, PoolItem[]>();
    filteredItems.forEach(item => {
      const key = item.section?.trim() || 'General';
      const list = grouped.get(key) ?? [];
      list.push(item);
      grouped.set(key, list);
    });

    const knownGroups = POOL_SECTION_OPTIONS
      .filter(section => grouped.has(section))
      .map(section => ({ name: section, items: grouped.get(section) ?? [] }));

    const customGroups = [...grouped.entries()]
      .filter(([name]) => !POOL_SECTION_OPTIONS.includes(name as (typeof POOL_SECTION_OPTIONS)[number]))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, items]) => ({ name, items }));

    return [...knownGroups, ...customGroups];
  }, [filteredItems]);

  const toggleFolderCollapsed = (folderId: string) => {
    setCollapsedFolderIds(previous => {
      const next = new Set(previous);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const buildInitialTerritorySources = () => {
    const fallbackPool = sectionedPools[0];
    if (!fallbackPool) return [];
    return [{ poolId: fallbackPool.id, section: fallbackPool.availableSections[0] ?? '' }];
  };

  const getPoolSections = (poolId: string) =>
    sectionedPools.find(pool => pool.id === poolId)?.availableSections ?? [];

  const resetTerritoryDraft = () => {
    setTerritoryDraftId(null);
    setTerritoryName('');
    setTerritoryDescription('');
    setTerritorySources(buildInitialTerritorySources());
    setTerritoryError(null);
  };

  const refreshPools = async () => {
    setPoolsLoading(true);
    try {
      const [nextFolders, next] = await Promise.all([listPoolFolders(), listPools()]);
      setFolders(nextFolders);
      setPools(next);
      if (next.length === 0) {
        if (!defaultPools.find(pool => pool.id === activePoolId)) {
          setActivePoolId(defaultPools[0]?.id ?? null);
        }
      } else if (!next.find(pool => pool.id === activePoolId) && !defaultPools.find(pool => pool.id === activePoolId)) {
        setActivePoolId(next[0].id);
      }
    } catch (err: any) {
      setPoolError(err?.message ?? 'Failed to load pools.');
    } finally {
      setPoolsLoading(false);
    }
  };

  useEffect(() => {
    setRandomizerPoolSelection(prev => {
      const next = new Map(prev);
      pools.forEach(pool => {
        if (!next.has(pool.id)) {
          next.set(pool.id, true);
        }
      });
      return next;
    });
  }, [pools]);

  useEffect(() => {
    if (authUser) {
      refreshPools();
    } else {
      setPools([]);
      setFolders([]);
      setActivePoolId(defaultPools[0]?.id ?? null);
      setPoolsLoading(false);
    }
  }, [authUser, defaultPools]);

  useEffect(() => {
    if (territorySources.length > 0) return;
    if (sectionedPools.length === 0) return;
    setTerritorySources(buildInitialTerritorySources());
  }, [sectionedPools, territorySources.length]);

  useEffect(() => {
    if (!territoryEditTargetId) return;
    const target = territories.find(territory => territory.id === territoryEditTargetId);
    if (!target) return;
    handleEditTerritory(target);
    setTerritoryMessage(`Editing "${target.name}".`);
    onTerritoryEditTargetHandled?.();
  }, [territories, territoryEditTargetId, onTerritoryEditTargetHandled]);

  const handleCreatePool = async () => {
    if (!authUser || !isPro) {
      setPoolError('Upgrade to Pro to create pools.');
      return;
    }
    setPoolError(null);
    try {
      const created = await createPool(newPoolName, selectedFolderId || null);
      setNewPoolName('');
      setSelectedFolderId('');
      await refreshPools();
      setActivePoolId(created.id);
    } catch (err: any) {
      setPoolError(err?.message ?? 'Failed to create pool.');
    }
  };

  const handleCreateFolder = async () => {
    if (!authUser || !isPro) {
      setPoolError('Upgrade to Pro to create folders.');
      return;
    }
    setPoolError(null);
    try {
      const created = await createPoolFolder(newFolderName);
      setNewFolderName('');
      await refreshPools();
      setSelectedFolderId(created.id);
    } catch (err: any) {
      setPoolError(err?.message ?? 'Failed to create folder.');
    }
  };

  const handleDuplicateDefaultPool = async (template: Pool) => {
    if (!authUser || !isPro) {
      setPoolError('Log in with Pro access to copy default pools into your own library.');
      return;
    }
    setPoolError(null);
    try {
      const existingNames = new Set(pools.map(pool => pool.name.toLowerCase()));
      let nextName = template.name;
      let copyIndex = 1;
      while (existingNames.has(nextName.toLowerCase())) {
        copyIndex += 1;
        nextName = `${template.name} Copy ${copyIndex}`;
      }
      const created = await createPoolFromTemplate(template, nextName);
      await refreshPools();
      setActivePoolId(created.id);
      setPoolJsonMessage(`Copied default pool "${created.name}" into your library.`);
      setPoolJsonError(null);
    } catch (err: any) {
      setPoolError(err?.message ?? 'Failed to copy default pool.');
    }
  };

  const handleDeletePool = async (poolId: string) => {
    if (!authUser || !isPro) {
      setPoolError('Upgrade to Pro to manage pools.');
      return;
    }
    await deletePool(poolId);
    await refreshPools();
  };

  const handleStartRename = (pool: Pool) => {
    setEditingPoolId(pool.id);
    setEditingPoolName(pool.name);
  };

  const handleRenamePool = async (poolId: string) => {
    if (!authUser || !isPro) {
      setPoolError('Upgrade to Pro to manage pools.');
      return;
    }
    setPoolError(null);
    try {
      await renamePool(poolId, editingPoolName);
      setEditingPoolId(null);
      setEditingPoolName('');
      await refreshPools();
    } catch (err: any) {
      setPoolError(err?.message ?? 'Failed to rename pool.');
    }
  };

  const handleMovePool = async (poolId: string, folderId: string) => {
    if (!authUser || !isPro) {
      setPoolError('Upgrade to Pro to organize pools.');
      return;
    }
    setPoolError(null);
    try {
      await movePoolToFolder(poolId, folderId || null);
      await refreshPools();
    } catch (err: any) {
      setPoolError(err?.message ?? 'Failed to move pool.');
    }
  };

  const handleFolderReorder = async (sourceFolderId: string, targetFolderId: string) => {
    if (sourceFolderId === targetFolderId) return;

    const sourceIndex = folders.findIndex(folder => folder.id === sourceFolderId);
    const targetIndex = folders.findIndex(folder => folder.id === targetFolderId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    const nextFolders = [...folders];
    const [movedFolder] = nextFolders.splice(sourceIndex, 1);
    nextFolders.splice(targetIndex, 0, movedFolder);

    setFolders(nextFolders.map((folder, index) => ({ ...folder, sortOrder: index })));

    try {
      await updatePoolFolderOrder(nextFolders.map(folder => folder.id));
    } catch (err: any) {
      setPoolError(err?.message ?? 'Failed to reorder folders.');
      await refreshPools();
    }
  };

  const parseTags = (raw: string) =>
    raw
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

  const handleAddTerritorySource = () => {
    const fallbackPool = sectionedPools[0];
    if (!fallbackPool) return;
    setTerritorySources(prev => [
      ...prev,
      {
        poolId: fallbackPool.id,
        section: fallbackPool.availableSections[0] ?? '',
      },
    ]);
  };

  const handleQuickAddSectionToTerritory = (poolId: string, section: string) => {
    const pool = sectionedPools.find(entry => entry.id === poolId);
    if (!pool || !section.trim()) return;

    setTerritorySources(prev => {
      const alreadyIncluded = prev.some(source => source.poolId === poolId && source.section === section);
      if (alreadyIncluded) return prev;
      return [...prev, { poolId, section }];
    });

    if (!territoryName.trim()) {
      setTerritoryName(`${pool.name} Territory`);
    }

    setTerritoryError(null);
    setTerritoryMessage(`Added ${section} from ${pool.name} to the Territory draft.`);
  };

  const handleChangeTerritorySource = (
    index: number,
    field: 'poolId' | 'section',
    value: string
  ) => {
    setTerritorySources(prev =>
      prev.map((source, sourceIndex) => {
        if (sourceIndex !== index) return source;
        if (field === 'poolId') {
          const nextSections = getPoolSections(value);
          return {
            poolId: value,
            section: nextSections.includes(source.section) ? source.section : (nextSections[0] ?? ''),
          };
        }
        return {
          ...source,
          section: value,
        };
      })
    );
  };

  const handleRemoveTerritorySource = (index: number) => {
    setTerritorySources(prev => prev.filter((_, sourceIndex) => sourceIndex !== index));
  };

  const handleMoveTerritorySource = (index: number, direction: 'up' | 'down') => {
    setTerritorySources(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) {
        return prev;
      }

      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const handleEditTerritory = (territory: Territory) => {
    setTerritoryDraftId(territory.id);
    setTerritoryName(territory.name);
    setTerritoryDescription(territory.description ?? '');
    setTerritorySources(
      territory.sources.map(source => ({
        poolId: source.poolId,
        section: source.section,
      }))
    );
    setTerritoryError(null);
    setTerritoryMessage(null);
  };

  const handleSaveTerritory = async () => {
    if (!authUser || !isPro) {
      setTerritoryError('Upgrade to Pro to create Territories.');
      return;
    }

    const trimmedName = territoryName.trim();
    if (!trimmedName) {
      setTerritoryError('Territory name is required.');
      return;
    }

    const normalizedSources = territorySources
      .map(source => {
        const pool = sectionedPools.find(entry => entry.id === source.poolId);
        if (!pool) return null;
        const section = source.section.trim();
        if (!section) return null;
        return {
          poolId: pool.id,
          poolName: pool.name,
          section,
        };
      })
      .filter((source): source is TerritorySourceInput => Boolean(source));

    if (normalizedSources.length === 0) {
      setTerritoryError('Add at least one pool section to the Territory.');
      return;
    }

    const dedupedSources = normalizedSources.filter((source, index, list) => {
      return list.findIndex(entry => entry.poolId === source.poolId && entry.section === source.section) === index;
    });

    setTerritoryError(null);

    const result = territoryDraftId
      ? await onUpdateTerritory?.(territoryDraftId, {
        name: trimmedName,
        description: territoryDescription,
        sources: dedupedSources,
      })
      : await onCreateTerritory?.(trimmedName, territoryDescription, dedupedSources);

    if (!result) {
      setTerritoryError(territoryDraftId ? 'Failed to update Territory.' : 'Failed to create Territory.');
      return;
    }

    setTerritoryMessage(
      territoryDraftId
        ? `Updated "${result.name}".`
        : `Created "${result.name}".`
    );
    resetTerritoryDraft();
  };

  const handleAddItem = async () => {
    if (!authUser || !isPro) {
      setItemError('Upgrade to Pro to add items.');
      return;
    }
    if (!activePool) {
      setItemError('Select a pool first.');
      return;
    }
    setItemError(null);
    try {
      await addItemToPool(
        activePool.id,
        newItemText,
        parseTags(newItemTags),
        newItemNote,
        newItemSection || undefined
      );
      setNewItemText('');
      setNewItemSection('');
      setNewItemTags('');
      setNewItemNote('');
      await refreshPools();
    } catch (err: any) {
      setItemError(err?.message ?? 'Failed to add item.');
    }
  };

  const parseBulkLine = (
    line: string,
    defaultSection?: string
  ): { text: string; tags?: string[]; section?: string } | null => {
    const trimmed = line.trim();
    if (!trimmed) return null;
    const [textPart, tagPart, sectionPart] = trimmed.split('|').map(part => part.trim());
    if (!textPart) return null;
    const tags = tagPart ? parseTags(tagPart) : undefined;
    return { text: textPart, tags, section: sectionPart || defaultSection || undefined };
  };

  const handleBulkAdd = async () => {
    if (!authUser || !isPro) {
      setBulkError('Upgrade to Pro to bulk add items.');
      return;
    }
    if (!activePool) {
      setBulkError('Select a pool first.');
      return;
    }
    setBulkError(null);
    const lines = bulkText.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length === 0) {
      setBulkError('Bulk input is empty.');
      return;
    }
    try {
      for (const line of lines) {
        const parsed = parseBulkLine(line, bulkSection || undefined);
        if (parsed) {
          await addItemToPool(activePool.id, parsed.text, parsed.tags, undefined, parsed.section);
        }
      }
      setBulkSection('');
      setBulkText('');
      await refreshPools();
    } catch (err: any) {
      setBulkError(err?.message ?? 'Failed to bulk add items.');
    }
  };

  const handleExportPoolJson = async () => {
    if (!authUser || !isPro) {
      setPoolJsonError('Upgrade to Pro to export pools.');
      return;
    }
    if (!activePool) {
      setPoolJsonError('Select a pool first.');
      return;
    }
    try {
      const payload = await exportPoolPayload(activePool.id);
      setPoolJson(JSON.stringify(payload, null, 2));
      setPoolJsonMessage('Exported pool JSON.');
      setPoolJsonError(null);
    } catch (err: any) {
      setPoolJsonError(err?.message ?? 'Failed to export pool.');
    }
  };

  const handleImportPoolJson = async () => {
    if (!authUser || !isPro) {
      setPoolJsonError('Upgrade to Pro to import pools.');
      return;
    }
    try {
      const parsed = JSON.parse(poolJson);
      const imported = await importPoolPayload(parsed, 'replace');
      setPoolJsonMessage(`Imported pool "${imported.name}".`);
      setPoolJsonError(null);
      await refreshPools();
      setActivePoolId(imported.id);
    } catch (err: any) {
      setPoolJsonError(err?.message ?? 'Invalid pool JSON.');
    }
  };

  const handleDownloadPoolJson = async () => {
    if (!authUser || !isPro) {
      setPoolJsonError('Upgrade to Pro to download pools.');
      return;
    }
    if (!activePool) {
      setPoolJsonError('Select a pool first.');
      return;
    }
    try {
      const payload = await exportPoolPayload(activePool.id);
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = activePool.name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      link.download = `${safeName || 'pool'}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setPoolJsonMessage('Downloaded pool JSON.');
      setPoolJsonError(null);
    } catch (err: any) {
      setPoolJsonError(err?.message ?? 'Failed to download pool.');
    }
  };

  const handleStartEditItem = (item: PoolItem) => {
    setEditingAddItemId(null);
    setEditingAddItemText('');
    setEditingItemId(item.id);
    setEditingItemText(item.text);
    setEditingItemSection(item.section ?? '');
    setEditingItemTags((item.tags || []).join(', '));
    setEditingItemNote(item.note ?? '');
  };

  const handleStartAddEditItem = (item: PoolItem) => {
    setEditingAddItemId(item.id);
    setEditingAddItemText(item.text);
  };

  const handleSaveAddEditItem = () => {
    const trimmed = editingAddItemText.trim();
    if (!trimmed) return;
    onAddToPrompt?.(trimmed);
    setEditingAddItemId(null);
    setEditingAddItemText('');
  };

  const handleAppendAddEditItem = () => {
    const trimmed = editingAddItemText.trim();
    if (!trimmed) return;
    const targetId = appendTargetId === 'last' ? undefined : appendTargetId;
    onAppendToPrompt?.(trimmed, targetId);
    setEditingAddItemId(null);
    setEditingAddItemText('');
  };

  const handleSaveItem = async (poolId: string, item: PoolItem) => {
    if (!authUser || !isPro) {
      setItemError('Upgrade to Pro to edit items.');
      return;
    }
    setItemError(null);
    try {
      const updated: PoolItem = {
        ...item,
        text: editingItemText.trim(),
        section: editingItemSection.trim() || undefined,
        tags: parseTags(editingItemTags),
        note: editingItemNote.trim() || undefined,
      };
      await updatePoolItem(poolId, updated);
      setEditingItemId(null);
      setEditingItemText('');
      setEditingItemSection('');
      setEditingItemTags('');
      setEditingItemNote('');
      await refreshPools();
    } catch (err: any) {
      setItemError(err?.message ?? 'Failed to update item.');
    }
  };

  const toggleRandomizerPool = (poolId: string) => {
    setRandomizerPoolSelection(prev => {
      const next = new Map(prev);
      next.set(poolId, !(prev.get(poolId) ?? true));
      return next;
    });
  };

  const updateRandomizerPoolCount = (poolId: string, value: number) => {
    setRandomizerPoolCounts(prev => {
      const next = new Map(prev);
      const normalized = Math.max(0, Math.min(50, value));
      if (normalized === 0) {
        next.delete(poolId);
      } else {
        next.set(poolId, normalized);
      }
      return next;
    });
  };

  const toggleRandomizerPoolOverride = (poolId: string, enabled: boolean) => {
    setRandomizerPoolOverrides(prev => {
      const next = new Map(prev);
      next.set(poolId, enabled);
      return next;
    });
  };

  const parseRandomizerTags = () =>
    randomizerTagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

  const pickRandomItems = () => {
    if (!onRandomizePoolItems) return;
    setRandomizerError(null);

    const selectedPools = pools.filter(pool => randomizerPoolSelection.get(pool.id));
    if (selectedPools.length === 0) {
      setRandomizerError('Select at least one pool.');
      return;
    }

    const defaultCount = Math.max(1, Math.min(50, randomizerCountPerPool));
    const filterTags = parseRandomizerTags().map(tag => tag.toLowerCase());
    const hasTagFilter = filterTags.length > 0 && randomizerTagMode !== 'any';
    const usedItemIds = new Set<string>();
    const output: string[] = [];

    const matchesTags = (item: PoolItem) => {
      const tags = item.tags || [];
      if (filterTags.length === 0) return true;
      return tags.some(tag => filterTags.includes(tag.toLowerCase()));
    };

    const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

    selectedPools.forEach(pool => {
      const overrideEnabled = randomizerPoolOverrides.get(pool.id) ?? false;
      const overrideValue = randomizerPoolCounts.get(pool.id);
      const requestedCount = Math.max(
        1,
        Math.min(50, overrideEnabled && overrideValue ? overrideValue : defaultCount)
      );
      let candidates = pool.items;
      if (hasTagFilter && randomizerTagMode === 'only') {
        candidates = candidates.filter(matchesTags);
      }

      if (candidates.length === 0) {
        return;
      }

      let tagged: PoolItem[] = [];
      let fallback: PoolItem[] = [];
      if (hasTagFilter && randomizerTagMode === 'prefer') {
        tagged = candidates.filter(matchesTags);
        fallback = candidates.filter(item => !matchesTags(item));
      } else {
        tagged = candidates;
      }

      const selection: PoolItem[] = [];
      const takeFrom = (source: PoolItem[]) => {
        const shuffled = shuffle(source);
        for (const item of shuffled) {
          if (selection.length >= requestedCount) break;
          if (!randomizerAllowDuplicates && usedItemIds.has(item.id)) {
            continue;
          }
          selection.push(item);
          usedItemIds.add(item.id);
        }
      };

      takeFrom(tagged);
      if (selection.length < requestedCount && hasTagFilter && randomizerTagMode === 'prefer') {
        takeFrom(fallback);
      }

      selection.forEach(item => output.push(item.text));
    });

    if (output.length === 0) {
      setRandomizerError('No items matched the current settings.');
      return;
    }

    const nextItems =
      randomizerAppendMode === 'append' ? [...customAdditions, ...output] : output;
    onRandomizePoolItems(nextItems);
    setIsRandomizerOpen(false);
  };

  const handleClearRandomizerOutput = () => {
    if (!onRandomizePoolItems) return;
    onRandomizePoolItems([]);
  };

  const renderPoolItem = (item: PoolItem) => (
    <div key={item.id} className="user-pools-item">
      <div className="user-pools-item-content">
        {editingItemId === item.id ? (
          <>
            <input
              type="text"
              value={editingItemText}
              onChange={event => setEditingItemText(event.target.value)}
            />
            <select
              value={editingItemSection}
              onChange={event => setEditingItemSection(event.target.value)}
            >
              <option value="">No section</option>
              {POOL_SECTION_OPTIONS.map(section => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={editingItemTags}
              onChange={event => setEditingItemTags(event.target.value)}
            />
            <input
              type="text"
              value={editingItemNote}
              onChange={event => setEditingItemNote(event.target.value)}
            />
          </>
        ) : editingAddItemId === item.id ? (
          <input
            type="text"
            value={editingAddItemText}
            onChange={event => setEditingAddItemText(event.target.value)}
          />
        ) : (
          <>
            <div className="user-pools-item-text">{item.text}</div>
            {item.section && <div className="user-pools-item-section">{item.section}</div>}
            {item.tags && item.tags.length > 0 && (
              <div className="user-pools-item-tags">{item.tags.join(', ')}</div>
            )}
            {item.note && <div className="user-pools-item-note">{item.note}</div>}
          </>
        )}
      </div>
      <div className="user-pools-item-actions">
        {editingItemId === item.id ? (
          <>
            <button type="button" onClick={() => handleSaveItem(activePool!.id, item)}>
              Save
            </button>
            <button type="button" onClick={() => setEditingItemId(null)}>
              Cancel
            </button>
          </>
        ) : editingAddItemId === item.id ? (
          <>
            <button type="button" onClick={handleSaveAddEditItem}>
              Add
            </button>
            <button type="button" onClick={handleAppendAddEditItem}>
              Append
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingAddItemId(null);
                setEditingAddItemText('');
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => onAddToPrompt?.(item.text)}>
              Add to Prompt
            </button>
            <button
              type="button"
              onClick={() => {
                const targetId = appendTargetId === 'last' ? undefined : appendTargetId;
                onAppendToPrompt?.(item.text, targetId);
              }}
            >
              Append
            </button>
            <button type="button" onClick={() => handleStartAddEditItem(item)}>
              Add + Edit
            </button>
            <button type="button" onClick={() => handleStartEditItem(item)}>
              Edit
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!authUser || !isPro || !activePool) {
                  setItemError('Upgrade to Pro to delete items.');
                  return;
                }
                await deletePoolItem(activePool.id, item.id);
                await refreshPools();
              }}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="user-pools-page">
      <header className="user-pools-header">
        <div>
          <h2>User Pools</h2>
          <p>Save prompt fragments you want to reuse later and add them to prompts when needed.</p>
        </div>
        {manualUrl && (
          <a
            className="user-pools-manual-link"
            href={`${manualUrl}#user-pools`}
            target="_blank"
            rel="noreferrer"
          >
            See the full User Pools guide
          </a>
        )}
      </header>

      <div className="user-pools-guide">
        <div>
          <strong>Quick start:</strong> Create a folder, add a pool, then build it with reusable items grouped into shared sections.
        </div>
        <div className="user-pools-section-legend">
          {POOL_SECTION_OPTIONS.map(section => (
            <span key={section} className="user-pools-section-chip">
              {section}
            </span>
          ))}
        </div>
      </div>

      {gateMessage && <div className="user-pools-empty">{gateMessage}</div>}
      {!gateMessage && poolError && <div className="user-pools-error">{poolError}</div>}

      <div className="user-pools-layout">
        <section className="user-pools-panel user-pools-panel-pools">
          <div className="user-pools-panel-header">
            <h3>
              Pools
              <span className="user-pools-title-icon" aria-hidden="true" />
            </h3>
            <button type="button" onClick={() => setIsRandomizerOpen(true)} disabled={poolsLoading || !!gateMessage}>
              Randomize
            </button>
          </div>
          {!gateMessage && (
            <>
              <div className="user-pools-folder-create">
                <input
                  type="text"
                  placeholder="Folder name"
                  value={newFolderName}
                  onChange={event => setNewFolderName(event.target.value)}
                />
                <button type="button" onClick={handleCreateFolder}>
                  Create Folder
                </button>
              </div>
              <div className="user-pools-create">
                <input
                  type="text"
                  placeholder="Pool name"
                  value={newPoolName}
                  onChange={event => setNewPoolName(event.target.value)}
                />
                <select value={selectedFolderId} onChange={event => setSelectedFolderId(event.target.value)}>
                  <option value="">No folder</option>
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleCreatePool}>
                  Create
                </button>
              </div>
            </>
          )}
          <div className="user-pools-list">
            {poolsLoading ? (
              <div className="user-pools-empty">Loading pools...</div>
            ) : groupedPools.length === 0 ? (
              <div className="user-pools-empty">No pools yet. Create one above.</div>
            ) : (
              groupedPools.map(group => {
                const isCustomFolder = folders.some(folder => folder.id === group.id);

                return (
                <div
                  key={group.id}
                  className={`user-pools-folder-group ${isCustomFolder ? 'draggable' : ''} ${dragOverFolderId === group.id ? 'drag-over' : ''}`}
                  onDragOver={event => {
                    if (!isCustomFolder || !draggedFolderId || draggedFolderId === group.id) return;
                    event.preventDefault();
                    event.dataTransfer.dropEffect = 'move';
                    setDragOverFolderId(group.id);
                  }}
                  onDragEnter={event => {
                    if (!isCustomFolder || !draggedFolderId || draggedFolderId === group.id) return;
                    event.preventDefault();
                    setDragOverFolderId(group.id);
                  }}
                  onDragLeave={() => {
                    if (dragOverFolderId === group.id) {
                      setDragOverFolderId(null);
                    }
                  }}
                  onDrop={async event => {
                    if (!isCustomFolder) return;
                    event.preventDefault();
                    const sourceFolderId = draggedFolderId ?? event.dataTransfer.getData('text/plain');
                    setDragOverFolderId(null);
                    setDraggedFolderId(null);
                    if (!sourceFolderId || sourceFolderId === group.id) return;
                    await handleFolderReorder(sourceFolderId, group.id);
                  }}
                  onDragEnd={() => {
                    setDraggedFolderId(null);
                    setDragOverFolderId(null);
                  }}
                >
                  <div className="user-pools-folder-heading">
                    {isCustomFolder && (
                      <span
                        className="user-pools-folder-drag-handle"
                        draggable
                        onDragStart={event => {
                          event.dataTransfer.effectAllowed = 'move';
                          event.dataTransfer.setData('text/plain', group.id);
                          setDraggedFolderId(group.id);
                        }}
                        onDragEnd={() => {
                          setDraggedFolderId(null);
                          setDragOverFolderId(null);
                        }}
                        title="Drag to reorder folder"
                      >
                        ::
                      </span>
                    )}
                    <button
                      type="button"
                      className="user-pools-folder-toggle"
                      onClick={() => toggleFolderCollapsed(group.id)}
                      aria-expanded={!collapsedFolderIds.has(group.id)}
                    >
                      <span className="user-pools-folder-title">
                      <span className="user-pools-folder-caret">
                        {collapsedFolderIds.has(group.id) ? '+' : '-'}
                      </span>
                      <span>{group.name}</span>
                      </span>
                      <span className="user-pools-folder-count">{group.pools.length}</span>
                    </button>
                  </div>
                  {!collapsedFolderIds.has(group.id) && (
                    <div className="user-pools-folder-items">
                      {group.pools.map(pool => {
                        const isDefaultPool = defaultPools.some(defaultPool => defaultPool.id === pool.id);
                        return (
                          <div
                            key={pool.id}
                            className={`user-pools-row ${pool.id === activePoolId ? 'active' : ''}`}
                          >
                            <button
                              type="button"
                              className="user-pools-row-main"
                              onClick={() => setActivePoolId(pool.id)}
                            >
                              <div className="user-pools-row-name">{pool.name}</div>
                              {isDefaultPool && <span className="user-pools-default-inline-pill">Default</span>}
                              <div className="user-pools-row-meta">
                                {pool.items.length} items • {new Date(pool.updatedAt).toLocaleDateString()}
                              </div>
                            </button>
                            <div className="user-pools-row-actions">
                              {isDefaultPool ? (
                                <button type="button" onClick={() => handleDuplicateDefaultPool(pool)}>
                                  Copy
                                </button>
                              ) : editingPoolId === pool.id ? (
                                <>
                                  <input
                                    type="text"
                                    value={editingPoolName}
                                    onChange={event => setEditingPoolName(event.target.value)}
                                  />
                                  <button type="button" onClick={() => handleRenamePool(pool.id)}>
                                    Save
                                  </button>
                                  <button type="button" onClick={() => setEditingPoolId(null)}>
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button type="button" onClick={() => handleStartRename(pool)}>
                                    Rename
                                  </button>
                                  <button type="button" onClick={() => handleDeletePool(pool.id)}>
                                    Delete
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )})
            )}
          </div>
        </section>

        <section className="user-pools-panel user-pools-panel-main">
          <div className="user-pools-panel-header">
            <h3>
              Pool Items
              <span className="user-pools-element-icon" aria-hidden="true" />
            </h3>
            {activePool && <span className="user-pools-active-name">{activePool.name}</span>}
          </div>
          {!activePool ? (
            <div className="user-pools-empty">Select a pool to view and add items.</div>
          ) : isDefaultPoolSelected ? (
            <>
              <div className="user-pools-helper">
                This is a default read-only pool inside the Default Pools folder. Copy it into your own library to edit or reuse it freely.
              </div>
              <div className="user-pools-filters">
                <input
                  type="text"
                  placeholder="Search items"
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                />
                <input
                  type="text"
                  placeholder="Filter by tag"
                  value={tagFilter}
                  onChange={event => setTagFilter(event.target.value)}
                />
              </div>
              <div className="user-pools-default-detail-actions">
                <button type="button" onClick={() => handleDuplicateDefaultPool(activePool)}>
                  Copy To My Pools
                </button>
              </div>
              <div className="user-pools-items">
                {filteredItems.length === 0 ? (
                  <div className="user-pools-empty">No items match your search or tag filter.</div>
                ) : filteredItemGroups.length > 0 ? (
                  filteredItemGroups.map(group => (
                    <div key={group.name} className="user-pools-section-group">
                      <div className="user-pools-section-heading">{group.name}</div>
                      <div className="user-pools-section-items">
                        {group.items.map(item => (
                          <div key={item.id} className="user-pools-item">
                            <div className="user-pools-item-content">
                              <div className="user-pools-item-text">{item.text}</div>
                              {item.section && <div className="user-pools-item-section">{item.section}</div>}
                              {item.tags && item.tags.length > 0 && (
                                <div className="user-pools-item-tags">{item.tags.join(', ')}</div>
                              )}
                              {item.note && <div className="user-pools-item-note">{item.note}</div>}
                            </div>
                            <div className="user-pools-item-actions">
                              <button type="button" onClick={() => onAddToPrompt?.(item.text)}>
                                Add to Prompt
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const targetId = appendTargetId === 'last' ? undefined : appendTargetId;
                                  onAppendToPrompt?.(item.text, targetId);
                                }}
                              >
                                Append
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  filteredItems.map(item => (
                    <div key={item.id} className="user-pools-item">
                      <div className="user-pools-item-content">
                        <div className="user-pools-item-text">{item.text}</div>
                        {item.section && <div className="user-pools-item-section">{item.section}</div>}
                        {item.tags && item.tags.length > 0 && (
                          <div className="user-pools-item-tags">{item.tags.join(', ')}</div>
                        )}
                        {item.note && <div className="user-pools-item-note">{item.note}</div>}
                      </div>
                      <div className="user-pools-item-actions">
                        <button type="button" onClick={() => onAddToPrompt?.(item.text)}>
                          Add to Prompt
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const targetId = appendTargetId === 'last' ? undefined : appendTargetId;
                            onAppendToPrompt?.(item.text, targetId);
                          }}
                        >
                          Append
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="user-pools-helper">
                Add reusable prompt fragments here, then organize them into shared sections, tags, and notes.
              </div>
              <div className="user-pools-filters">
                <input
                  type="text"
                  placeholder="Search items"
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                />
                <input
                  type="text"
                  placeholder="Filter by tag"
                  value={tagFilter}
                  onChange={event => setTagFilter(event.target.value)}
                />
              </div>
              <div className="user-pools-browse-toolbar">
                <div className="user-pools-browse-stat">
                  <strong>{filteredItems.length}</strong>
                  <span>{filteredItems.length === 1 ? 'visible item' : 'visible items'}</span>
                </div>
                <div className="user-pools-append-target">
                  <label>
                    Append target
                    <select
                      value={appendTargetId}
                      onChange={event => setAppendTargetId(event.target.value)}
                    >
                      <option value="last">Last addition</option>
                      {additionItems.map(item => (
                        <option key={item.id} value={item.id}>
                          {item.text.length > 48 ? `${item.text.slice(0, 48)}...` : item.text}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              {itemError && <div className="user-pools-error">{itemError}</div>}
              <div className="user-pools-items">
                {activePool.items.length === 0 ? (
                  <div className="user-pools-empty">No items yet.</div>
                ) : filteredItems.length === 0 ? (
                  <div className="user-pools-empty">No items match your search or tag filter.</div>
                ) : filteredItemGroups.length > 0 ? (
                  filteredItemGroups.map(group => (
                    <div key={group.name} className="user-pools-section-group">
                      <div className="user-pools-section-heading-row">
                        <div className="user-pools-section-heading">{group.name}</div>
                        <button
                          type="button"
                          className="user-pools-section-action"
                          onClick={() => activePool && handleQuickAddSectionToTerritory(activePool.id, group.name)}
                        >
                          Add Section To Territory
                        </button>
                      </div>
                      <div className="user-pools-section-items">
                        {group.items.map(renderPoolItem)}
                      </div>
                    </div>
                  ))
                ) : (
                  filteredItems.map(renderPoolItem)
                )}
              </div>

              <details className="user-pools-collapsible">
                <summary>Add Content</summary>
                <div className="user-pools-collapsible-body">
                  <div className="user-pools-items-create">
                    <input
                      type="text"
                      placeholder="Item text"
                      value={newItemText}
                      onChange={event => setNewItemText(event.target.value)}
                    />
                    <select value={newItemSection} onChange={event => setNewItemSection(event.target.value)}>
                      <option value="">No section</option>
                      {POOL_SECTION_OPTIONS.map(section => (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Tags (comma)"
                      value={newItemTags}
                      onChange={event => setNewItemTags(event.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Note (optional)"
                      value={newItemNote}
                      onChange={event => setNewItemNote(event.target.value)}
                    />
                    <button type="button" onClick={handleAddItem}>
                      Add Item
                    </button>
                  </div>

                  <div className="user-pools-bulk">
                    <div className="user-pools-helper">
                      Bulk add one item per line. Choose one section once for the whole batch, or override it per line with a second “|”.
                    </div>
                    <select value={bulkSection} onChange={event => setBulkSection(event.target.value)}>
                      <option value="">No section</option>
                      {POOL_SECTION_OPTIONS.map(section => (
                        <option key={section} value={section}>
                          {section}
                        </option>
                      ))}
                    </select>
                    <textarea
                      rows={4}
                      placeholder="Bulk add: one item per line. Optional tags after first |. Optional per-line section after second | (e.g., big tree | nature, forest | Environment)"
                      value={bulkText}
                      onChange={event => setBulkText(event.target.value)}
                    />
                    <button type="button" onClick={handleBulkAdd}>
                      Bulk Add
                    </button>
                    {bulkError && <div className="user-pools-error">{bulkError}</div>}
                  </div>
                </div>
              </details>

              <details className="user-pools-collapsible user-pools-advanced">
                <summary>Advanced</summary>
                <div className="user-pools-collapsible-body">
                  <div className="user-pools-folder-assignment">
                    <label>
                      Folder
                      <select
                        value={activePool.folderId ?? ''}
                        onChange={event => {
                          void handleMovePool(activePool.id, event.target.value);
                        }}
                      >
                        <option value="">No folder</option>
                        {folders.map(folder => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="user-pools-json">
                    <textarea
                      rows={5}
                      placeholder="Pool JSON import/export"
                      value={poolJson}
                      onChange={event => setPoolJson(event.target.value)}
                    />
                    <div className="user-pools-json-actions">
                      <button type="button" onClick={handleExportPoolJson}>
                        Export Pool
                      </button>
                      <button type="button" onClick={handleImportPoolJson}>
                        Import Pool
                      </button>
                      <button type="button" onClick={handleDownloadPoolJson}>
                        Download Pool
                      </button>
                    </div>
                    {poolJsonError && <div className="user-pools-error">{poolJsonError}</div>}
                    {poolJsonMessage && <div className="user-pools-message">{poolJsonMessage}</div>}
                  </div>
                </div>
              </details>
            </>
          )}
        </section>
        <aside className="user-pools-panel user-pools-panel-territories">
          <div className="user-pools-panel-header">
            <h3>
              Territories
              <span className="user-pools-title-icon" aria-hidden="true" />
            </h3>
            {territoriesLoading && <span className="user-pools-subsection-meta">Loading...</span>}
          </div>
          <div className="user-pools-territory-overview">
            <div className="user-pools-helper">
              Compose a creative territory from selected pool sections, then open it in Builder.
            </div>
            <div className="user-pools-territory-stat-row">
              <div className="user-pools-territory-stat">
                <strong>{territories.length}</strong>
                <span>saved territories</span>
              </div>
              <div className="user-pools-territory-stat">
                <strong>{sectionedPools.length}</strong>
                <span>sectioned pools</span>
              </div>
            </div>
            {activeTerritoryId && (
              <div className="user-pools-territory-active-summary">
                Active Territory:{' '}
                <strong>{territories.find(territory => territory.id === activeTerritoryId)?.name ?? 'Unknown'}</strong>
              </div>
            )}
          </div>
          <div className="user-pools-territories">
            <details className="user-pools-territory-section" open>
              <summary>Compose Territory</summary>
              <div className="user-pools-territory-section-body">
                <div className="user-pools-territory-form">
                  <div className="user-pools-territory-editor-block">
                    <div className="user-pools-subsection-header">
                      <h4>{territoryDraftId ? 'Edit Territory' : 'New Territory'}</h4>
                    </div>
                    <input
                      type="text"
                      placeholder="Territory name"
                      value={territoryName}
                      onChange={event => setTerritoryName(event.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Short description (optional)"
                      value={territoryDescription}
                      onChange={event => setTerritoryDescription(event.target.value)}
                    />
                  </div>
                  <div className="user-pools-territory-editor-block">
                    <div className="user-pools-subsection-header">
                      <h4>Sources</h4>
                      <span className="user-pools-subsection-meta">{territorySources.length}</span>
                    </div>
                    <div className="user-pools-territory-sources">
                      {territorySources.length === 0 ? (
                        <div className="user-pools-empty">Add a sectioned pool first to compose a Territory.</div>
                      ) : (
                        territorySources.map((source, index) => (
                          <div key={`${source.poolId}_${index}`} className="user-pools-territory-source-row">
                            <div className="user-pools-territory-source-order">
                              <button
                                type="button"
                                className="user-pools-inline-secondary"
                                onClick={() => handleMoveTerritorySource(index, 'up')}
                                disabled={index === 0}
                                title="Move source up"
                              >
                                Up
                              </button>
                              <button
                                type="button"
                                className="user-pools-inline-secondary"
                                onClick={() => handleMoveTerritorySource(index, 'down')}
                                disabled={index === territorySources.length - 1}
                                title="Move source down"
                              >
                                Down
                              </button>
                            </div>
                            <select
                              value={source.poolId}
                              onChange={event => handleChangeTerritorySource(index, 'poolId', event.target.value)}
                            >
                              {sectionedPools.map(pool => (
                                <option key={pool.id} value={pool.id}>
                                  {pool.name}
                                </option>
                              ))}
                            </select>
                            <select
                              value={source.section}
                              onChange={event => handleChangeTerritorySource(index, 'section', event.target.value)}
                            >
                              {getPoolSections(source.poolId).map(section => (
                                <option key={section} value={section}>
                                  {section}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              className="user-pools-inline-danger"
                              onClick={() => handleRemoveTerritorySource(index)}
                              disabled={territorySources.length === 1}
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="user-pools-territory-form-actions">
                      <button type="button" onClick={handleAddTerritorySource} disabled={sectionedPools.length === 0}>
                        Add Source
                      </button>
                      <button type="button" onClick={handleSaveTerritory} disabled={sectionedPools.length === 0}>
                        {territoryDraftId ? 'Save Territory' : 'Create Territory'}
                      </button>
                      {territoryDraftId && (
                        <button type="button" onClick={resetTerritoryDraft}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                  {territoryError && <div className="user-pools-error">{territoryError}</div>}
                  {territoryMessage && <div className="user-pools-message">{territoryMessage}</div>}
                </div>
              </div>
            </details>

            <details className="user-pools-territory-section" open={territoryDraftSummary.sources.length > 0}>
              <summary>
                Draft Summary
                <span className="user-pools-subsection-meta">{territoryDraftSummary.uniqueSourceCount} sources</span>
              </summary>
              <div className="user-pools-territory-section-body">
                <div className="user-pools-territory-summary">
                  {territoryDraftSummary.sources.length === 0 ? (
                    <div className="user-pools-empty">Choose at least one pool section to define the Territory.</div>
                  ) : (
                    <>
                      {territoryDraftSummary.warnings.length > 0 && (
                        <div className="user-pools-territory-warning-list">
                          {territoryDraftSummary.warnings.map(warning => (
                            <div key={warning} className="user-pools-territory-warning">
                              {warning}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="user-pools-territory-stat-row">
                        <div className="user-pools-territory-stat">
                          <strong>{territoryDraftSummary.sections.length}</strong>
                          <span>shared sections</span>
                        </div>
                        <div className="user-pools-territory-stat">
                          <strong>{territoryDraftSummary.estimatedItems}</strong>
                          <span>source items</span>
                        </div>
                      </div>
                      <div className="user-pools-territory-chip-row">
                        {territoryDraftSummary.sections.map(entry => (
                          <span key={entry.section} className="user-pools-territory-chip">
                            {entry.section} x{entry.count}
                          </span>
                        ))}
                      </div>
                      <div className="user-pools-territory-review-list">
                        {territoryDraftSummary.sources.map((source, index) => (
                          <div
                            key={`${source.poolId}_${source.section}_${index}`}
                            className={`user-pools-territory-review-item ${territoryDraftSummary.duplicateCounts.get(source.duplicateKey)! > 1 ? 'warning' : ''} ${source.itemCount === 0 ? 'empty' : ''}`}
                          >
                            <div>
                              <div className="user-pools-territory-review-title">
                                {source.section} from {source.poolName}
                              </div>
                              <div className="user-pools-territory-review-meta">
                                {source.itemCount} pool items available in this section
                              </div>
                              {territoryDraftSummary.duplicateCounts.get(source.duplicateKey)! > 1 && (
                                <div className="user-pools-territory-review-note">
                                  Duplicate source selection
                                </div>
                              )}
                              {source.itemCount === 0 && (
                                <div className="user-pools-territory-review-note">
                                  Empty section source
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </details>

            <details className="user-pools-territory-section" open>
              <summary>
                Saved Territories
                <span className="user-pools-subsection-meta">{territories.length}</span>
              </summary>
              <div className="user-pools-territory-section-body">
                <div className="user-pools-territory-list">
                  {territories.length === 0 ? (
                    <div className="user-pools-empty">No Territories yet.</div>
                  ) : (
                    territories.map(territory => (
                      <div
                        key={territory.id}
                        className={`user-pools-territory-card ${territory.id === activeTerritoryId ? 'active' : ''}`}
                      >
                        <div className="user-pools-territory-card-header">
                          <div>
                            <div className="user-pools-territory-name">{territory.name}</div>
                            {territory.description && (
                              <div className="user-pools-territory-description">{territory.description}</div>
                            )}
                          </div>
                          {territory.id === activeTerritoryId && (
                            <span className="user-pools-territory-active-pill">Active</span>
                          )}
                        </div>
                        <div className="user-pools-territory-chip-row">
                          {territory.sources.map(source => (
                            <span key={source.id} className="user-pools-territory-chip">
                              {source.section} from {source.poolName}
                            </span>
                          ))}
                        </div>
                        <div className="user-pools-row-actions">
                          <button type="button" onClick={() => onUseTerritoryInBuilder?.(territory.id)}>
                            Use in Builder
                          </button>
                          <button type="button" onClick={() => handleEditTerritory(territory)}>
                            Edit
                          </button>
                          <button type="button" onClick={() => void onDeleteTerritory?.(territory.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {activeTerritoryId && (
                  <button
                    type="button"
                    className="user-pools-territory-deactivate"
                    onClick={onDeactivateTerritory}
                  >
                    Turn Off Active Territory
                  </button>
                )}
              </div>
            </details>
          </div>
        </aside>
      </div>

      <Modal
        isOpen={isRandomizerOpen}
        onClose={() => setIsRandomizerOpen(false)}
        title="Randomize From User Pools"
        className="user-pools-randomizer-modal"
      >
        <div className="user-pools-randomizer">
          <div className="user-pools-randomizer-section">
            <div className="user-pools-randomizer-label">Pools to include</div>
            {poolsLoading ? (
              <div className="user-pools-empty">Loading pools...</div>
            ) : pools.length === 0 ? (
              <div className="user-pools-empty">No pools available.</div>
            ) : (
              <div className="user-pools-randomizer-pools">
                {pools.map(pool => (
                  <label key={pool.id} className="user-pools-randomizer-pool">
                    <input
                      type="checkbox"
                      checked={randomizerPoolSelection.get(pool.id) ?? false}
                      onChange={() => toggleRandomizerPool(pool.id)}
                    />
                    <span>{pool.name}</span>
                    <span className="user-pools-randomizer-pool-count">{pool.items.length}</span>
                    <label className="user-pools-randomizer-override">
                      <input
                        type="checkbox"
                        checked={randomizerPoolOverrides.get(pool.id) ?? false}
                        onChange={event => toggleRandomizerPoolOverride(pool.id, event.target.checked)}
                      />
                      Override
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={randomizerPoolCounts.get(pool.id) ?? ''}
                      onChange={event => updateRandomizerPoolCount(pool.id, parseInt(event.target.value) || 0)}
                      placeholder={randomizerCountPerPool.toString()}
                      className="user-pools-randomizer-count-input"
                      title="Override items per pool (0 = default)"
                      disabled={!(randomizerPoolOverrides.get(pool.id) ?? false)}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="user-pools-randomizer-row">
            <label className="user-pools-randomizer-field">
              Items per pool
              <input
                type="number"
                min="1"
                max="50"
                value={randomizerCountPerPool}
                onChange={event => setRandomizerCountPerPool(parseInt(event.target.value) || 1)}
              />
            </label>
            <label className="user-pools-randomizer-toggle">
              <input
                type="checkbox"
                checked={randomizerAllowDuplicates}
                onChange={event => setRandomizerAllowDuplicates(event.target.checked)}
              />
              Allow duplicates across pools
            </label>
          </div>

          <div className="user-pools-randomizer-row">
            <label className="user-pools-randomizer-field">
              Apply mode
              <select
                value={randomizerAppendMode}
                onChange={event => setRandomizerAppendMode(event.target.value as 'replace' | 'append')}
              >
                <option value="replace">Replace current items</option>
                <option value="append">Append to current items</option>
              </select>
            </label>
            <div />
          </div>

          <div className="user-pools-randomizer-section">
            <div className="user-pools-randomizer-label">Tag filter</div>
            <div className="user-pools-randomizer-row">
              <label className="user-pools-randomizer-field">
                Mode
                <select
                  value={randomizerTagMode}
                  onChange={event => setRandomizerTagMode(event.target.value as 'any' | 'only' | 'prefer')}
                >
                  <option value="any">Any tags</option>
                  <option value="only">Only tagged</option>
                  <option value="prefer">Prefer tagged</option>
                </select>
              </label>
              <label className="user-pools-randomizer-field">
                Tags (comma)
                <input
                  type="text"
                  placeholder="portrait, cinematic"
                  value={randomizerTagInput}
                  onChange={event => setRandomizerTagInput(event.target.value)}
                />
              </label>
            </div>
          </div>

          {randomizerError && <div className="user-pools-error">{randomizerError}</div>}

          <div className="user-pools-randomizer-actions">
            <button type="button" onClick={pickRandomItems}>
              Generate Random Prompt
            </button>
            <button type="button" onClick={pickRandomItems}>
              Re-roll
            </button>
            <button type="button" onClick={handleClearRandomizerOutput}>
              Clear Random Selections
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}





