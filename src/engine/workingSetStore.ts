import type { WorkingSet, WorkingSetItemRef, WorkingSetStore } from '../types';
import { supabase } from './supabaseClient';
import { getProfile } from './authStore';

const ACTIVE_KEY = 'promptgen:working_sets:active_id';

const normalizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const normalizeUuidRef = (value?: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return UUID_PATTERN.test(trimmed) ? trimmed : null;
};

const requireProfileId = async (): Promise<string> => {
  const profile = await getProfile();
  if (!profile) {
    throw new Error('You must be logged in.');
  }
  return profile.id;
};

type WorkingSetItemRow = WorkingSetItemRef & { categoryId: string };

const toWorkingSet = (row: any, items: WorkingSetItemRow[]): WorkingSet => {
  const categoryBuckets: WorkingSet['categoryBuckets'] = {};
  items.forEach(item => {
    const bucket = categoryBuckets[item.categoryId] ?? [];
    bucket.push({
      id: item.id,
      poolId: item.poolId,
      poolItemId: item.poolItemId,
      text: item.text,
      addedAt: item.addedAt,
    });
    categoryBuckets[item.categoryId] = bucket;
  });
  return {
    id: row.id,
    name: row.name,
    createdAt: new Date(row.created_at).getTime(),
    updatedAt: new Date(row.updated_at).getTime(),
    categoryBuckets,
  };
};

const toWorkingSetItem = (row: any): WorkingSetItemRow => ({
  id: row.id,
  poolId: row.pool_id ?? '',
  poolItemId: row.pool_item_id ?? '',
  text: row.text,
  addedAt: new Date(row.created_at).getTime(),
  categoryId: row.category_id,
});

export const listWorkingSets = async (): Promise<WorkingSet[]> => {
  const userId = await requireProfileId();
  const { data: sets, error } = await supabase
    .from('working_sets')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  if (!sets || sets.length === 0) return [];

  const setIds = sets.map(set => set.id);
  const { data: items, error: itemsError } = await supabase
    .from('working_set_items')
    .select('*')
    .in('working_set_id', setIds)
    .order('created_at', { ascending: false });
  if (itemsError) throw itemsError;

  const itemsBySet = new Map<string, WorkingSetItemRow[]>();
  (items ?? []).forEach(row => {
    const setId = row.working_set_id as string;
    const list = itemsBySet.get(setId) ?? [];
    list.push(toWorkingSetItem(row));
    itemsBySet.set(setId, list);
  });

  return sets.map(set => {
    const mapped = itemsBySet.get(set.id) ?? [];
    return toWorkingSet(set, mapped);
  });
};

export const getActiveWorkingSetId = (): string | null => {
  try {
    return window.localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
};

export const setActiveWorkingSetId = (id: string | null) => {
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

export const createWorkingSet = async (
  name: string,
  payload?: Partial<Omit<WorkingSet, 'id' | 'name' | 'createdAt' | 'updatedAt'>>
): Promise<WorkingSet> => {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Working Set name is required.');
  const userId = await requireProfileId();
  const { data, error } = await supabase
    .from('working_sets')
    .insert({ user_id: userId, name: trimmed })
    .select('*')
    .single();
  if (error) throw error;

  const categoryBuckets = payload?.categoryBuckets ?? {};
  const itemRows: Array<{
    working_set_id: string;
    pool_id: string | null;
    pool_item_id: string | null;
    category_id: string;
    text: string;
  }> = [];

  Object.entries(categoryBuckets).forEach(([categoryId, items]) => {
    items.forEach(item => {
      itemRows.push({
        working_set_id: data.id,
        pool_id: normalizeUuidRef(item.poolId),
        pool_item_id: normalizeUuidRef(item.poolItemId),
        category_id: categoryId,
        text: normalizeText(item.text),
      });
    });
  });

  if (itemRows.length > 0) {
    const { error: itemsError } = await supabase.from('working_set_items').insert(itemRows);
    if (itemsError) throw itemsError;
  }

  return {
    id: data.id,
    name: data.name,
    createdAt: new Date(data.created_at).getTime(),
    updatedAt: new Date(data.updated_at).getTime(),
    categoryBuckets,
  };
};

export const updateWorkingSet = async (
  id: string,
  patch: Partial<Omit<WorkingSet, 'id' | 'createdAt'>>
): Promise<WorkingSet | null> => {
  const updates: { name?: string } = {};
  if (typeof patch.name === 'string') {
    const trimmed = patch.name.trim();
    if (!trimmed) throw new Error('Working Set name is required.');
    updates.name = trimmed;
  }
  const { data, error } = await supabase
    .from('working_sets')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  if (!data) return null;

  const workingSet = await exportWorkingSetPayload(id);
  return workingSet.workingSet;
};

export const deleteWorkingSet = async (id: string) => {
  const { error } = await supabase
    .from('working_sets')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
};

export const exportWorkingSetPayload = async (id: string): Promise<{ version: 2; workingSet: WorkingSet }> => {
  const { data: setRow, error } = await supabase
    .from('working_sets')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  if (!setRow) {
    throw new Error('Working Set not found.');
  }
  const { data: items, error: itemsError } = await supabase
    .from('working_set_items')
    .select('*')
    .eq('working_set_id', id);
  if (itemsError) throw itemsError;

  const mapped = (items ?? []).map(toWorkingSetItem);
  const workingSet = toWorkingSet(setRow, mapped);
  return { version: 2, workingSet };
};

export const importWorkingSetPayload = async (
  payload: { version: number; workingSet: WorkingSet },
  mode: 'merge' | 'replace'
) => {
  if (!payload || payload.version !== 2 || !payload.workingSet) {
    throw new Error('Invalid Working Set payload.');
  }

  const incoming = payload.workingSet;
  const existing = await listWorkingSets();
  const existingIndex = existing.findIndex(set => set.name === incoming.name);

  const sanitizeBuckets = (buckets: WorkingSet['categoryBuckets']) => {
    const next: WorkingSet['categoryBuckets'] = {};
    Object.entries(buckets).forEach(([categoryId, items]) => {
      next[categoryId] = items.map(item => ({
        ...item,
        id: item.id,
        text: normalizeText(item.text),
      }));
    });
    return next;
  };

  if (existingIndex === -1) {
    const created = await createWorkingSet(incoming.name, {
      categoryBuckets: sanitizeBuckets(incoming.categoryBuckets || {}),
    });
    setActiveWorkingSetId(created.id);
    return created;
  }

  const target = existing[existingIndex];
  if (mode === 'replace') {
    await supabase.from('working_set_items').delete().eq('working_set_id', target.id);
  }

  const buckets = sanitizeBuckets(incoming.categoryBuckets || {});
  const itemRows: Array<{
    working_set_id: string;
    pool_id: string | null;
    pool_item_id: string | null;
    category_id: string;
    text: string;
  }> = [];

  Object.entries(buckets).forEach(([categoryId, items]) => {
    items.forEach(item => {
      itemRows.push({
        working_set_id: target.id,
        pool_id: normalizeUuidRef(item.poolId),
        pool_item_id: normalizeUuidRef(item.poolItemId),
        category_id: categoryId,
        text: normalizeText(item.text),
      });
    });
  });

  if (itemRows.length > 0) {
    const { error } = await supabase.from('working_set_items').insert(itemRows);
    if (error) throw error;
  }

  setActiveWorkingSetId(target.id);
  return exportWorkingSetPayload(target.id).then(result => result.workingSet);
};

export const addWorkingSetItem = async (
  setId: string,
  categoryId: string,
  item: Omit<WorkingSetItemRef, 'id' | 'addedAt'>
) => {
  const { data: existing, error } = await supabase
    .from('working_set_items')
    .select('id')
    .eq('working_set_id', setId)
    .eq('category_id', categoryId)
    .eq('pool_id', item.poolId)
    .eq('pool_item_id', item.poolItemId)
    .maybeSingle();
  if (error) throw error;
  if (existing) {
    return null;
  }

  const { data, error: insertError } = await supabase
    .from('working_set_items')
    .insert({
      working_set_id: setId,
      category_id: categoryId,
      pool_id: item.poolId,
      pool_item_id: item.poolItemId,
      text: normalizeText(item.text),
    })
    .select('*')
    .single();
  if (insertError) throw insertError;

  await supabase.from('working_sets').update({ updated_at: new Date().toISOString() }).eq('id', setId);
  return data ? toWorkingSetItem(data) : null;
};

export const removeWorkingSetItem = async (setId: string, categoryId: string, itemId: string) => {
  const { error } = await supabase
    .from('working_set_items')
    .delete()
    .eq('id', itemId)
    .eq('working_set_id', setId)
    .eq('category_id', categoryId);
  if (error) throw error;
  await supabase.from('working_sets').update({ updated_at: new Date().toISOString() }).eq('id', setId);
};

export const clearWorkingSetCategory = async (setId: string, categoryId: string) => {
  const { error } = await supabase
    .from('working_set_items')
    .delete()
    .eq('working_set_id', setId)
    .eq('category_id', categoryId);
  if (error) throw error;
  await supabase.from('working_sets').update({ updated_at: new Date().toISOString() }).eq('id', setId);
};

export const exportWorkingSetStore = async (): Promise<WorkingSetStore> => {
  const sets = await listWorkingSets();
  return { version: 2, activeId: getActiveWorkingSetId(), sets };
};
