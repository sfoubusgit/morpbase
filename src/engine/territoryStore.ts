import type { Territory, TerritorySource, TerritorySourceInput, TerritoryStore } from '../types';
import { supabase } from './supabaseClient';
import { getProfile } from './authStore';

const ACTIVE_KEY = 'promptgen:territories:active_id';

const normalizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const requireProfileId = async (): Promise<string> => {
  const profile = await getProfile();
  if (!profile) {
    throw new Error('You must be logged in.');
  }
  return profile.id;
};

const toTerritorySource = (row: any): TerritorySource => ({
  id: row.id,
  poolId: row.pool_id ?? '',
  poolName: row.pool_name,
  section: row.section,
  sortOrder: row.sort_order ?? 0,
  addedAt: new Date(row.created_at).getTime(),
});

const toTerritory = (row: any, sources: TerritorySource[]): Territory => ({
  id: row.id,
  name: row.name,
  description: row.description ?? undefined,
  createdAt: new Date(row.created_at).getTime(),
  updatedAt: new Date(row.updated_at).getTime(),
  sources,
});

const sanitizeSources = (sources: TerritorySourceInput[]) =>
  sources
    .map((source, index) => ({
      pool_id: source.poolId,
      pool_name: normalizeText(source.poolName),
      section: normalizeText(source.section),
      sort_order: index,
    }))
    .filter(source => source.pool_id && source.pool_name && source.section);

export const listTerritories = async (): Promise<Territory[]> => {
  const userId = await requireProfileId();
  const { data: territories, error } = await supabase
    .from('territories')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  if (!territories || territories.length === 0) return [];

  const territoryIds = territories.map(territory => territory.id);
  const { data: sources, error: sourcesError } = await supabase
    .from('territory_sources')
    .select('*')
    .in('territory_id', territoryIds)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (sourcesError) throw sourcesError;

  const sourcesByTerritory = new Map<string, TerritorySource[]>();
  (sources ?? []).forEach(row => {
    const territoryId = row.territory_id as string;
    const next = sourcesByTerritory.get(territoryId) ?? [];
    next.push(toTerritorySource(row));
    sourcesByTerritory.set(territoryId, next);
  });

  return territories.map(row => toTerritory(row, sourcesByTerritory.get(row.id) ?? []));
};

export const getActiveTerritoryId = (): string | null => {
  try {
    return window.localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
};

export const setActiveTerritoryId = (id: string | null) => {
  try {
    if (!id) {
      window.localStorage.removeItem(ACTIVE_KEY);
      return;
    }
    window.localStorage.setItem(ACTIVE_KEY, id);
  } catch {
    // ignore
  }
};

export const createTerritory = async (
  name: string,
  description: string,
  sources: TerritorySourceInput[]
): Promise<Territory> => {
  const trimmedName = normalizeText(name);
  if (!trimmedName) {
    throw new Error('Territory name is required.');
  }

  const sanitizedSources = sanitizeSources(sources);
  if (sanitizedSources.length === 0) {
    throw new Error('Add at least one pool section to the Territory.');
  }

  const userId = await requireProfileId();
  const { data: territoryRow, error } = await supabase
    .from('territories')
    .insert({
      user_id: userId,
      name: trimmedName,
      description: normalizeText(description) || null,
    })
    .select('*')
    .single();
  if (error) throw error;

  const { error: sourceError } = await supabase
    .from('territory_sources')
    .insert(sanitizedSources.map(source => ({
      territory_id: territoryRow.id,
      ...source,
    })));
  if (sourceError) throw sourceError;

  const next = await listTerritories();
  const created = next.find(territory => territory.id === territoryRow.id);
  if (!created) {
    throw new Error('Failed to load created Territory.');
  }
  return created;
};

export const updateTerritory = async (
  id: string,
  patch: {
    name?: string;
    description?: string;
    sources?: TerritorySourceInput[];
  }
): Promise<Territory | null> => {
  const updates: { name?: string; description?: string | null } = {};
  if (typeof patch.name === 'string') {
    const trimmedName = normalizeText(patch.name);
    if (!trimmedName) {
      throw new Error('Territory name is required.');
    }
    updates.name = trimmedName;
  }
  if (typeof patch.description === 'string') {
    updates.description = normalizeText(patch.description) || null;
  }

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase
      .from('territories')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  }

  if (patch.sources) {
    const sanitizedSources = sanitizeSources(patch.sources);
    if (sanitizedSources.length === 0) {
      throw new Error('Add at least one pool section to the Territory.');
    }
    const { error: deleteError } = await supabase
      .from('territory_sources')
      .delete()
      .eq('territory_id', id);
    if (deleteError) throw deleteError;

    const { error: sourceError } = await supabase
      .from('territory_sources')
      .insert(sanitizedSources.map(source => ({
        territory_id: id,
        ...source,
      })));
    if (sourceError) throw sourceError;
  }

  const next = await listTerritories();
  return next.find(territory => territory.id === id) ?? null;
};

export const deleteTerritory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('territories')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
};

export const exportTerritoryStore = async (): Promise<TerritoryStore> => {
  const territories = await listTerritories();
  return {
    version: 1,
    activeId: getActiveTerritoryId(),
    territories,
  };
};
