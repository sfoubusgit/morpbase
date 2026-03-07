import type { Pool, PoolItem, PoolStore } from '../types';
import { supabase } from './supabaseClient';
import { getProfile } from './authStore';

const normalizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

const requireProfileId = async (): Promise<string> => {
  const profile = await getProfile();
  if (!profile) {
    throw new Error('You must be logged in.');
  }
  return profile.id;
};

const toPool = (poolRow: any, items: PoolItem[]): Pool => ({
  id: poolRow.id,
  name: poolRow.name,
  createdAt: new Date(poolRow.created_at).getTime(),
  updatedAt: new Date(poolRow.updated_at).getTime(),
  items,
});

const toPoolItem = (row: any): PoolItem => ({
  id: row.id,
  text: row.text,
  tags: row.tags ?? undefined,
  note: row.note ?? undefined,
});

export const listPools = async (): Promise<Pool[]> => {
  const userId = await requireProfileId();
  const { data: pools, error } = await supabase
    .from('pools')
    .select('*')
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  if (!pools || pools.length === 0) return [];

  const poolIds = pools.map(pool => pool.id);
  const { data: items, error: itemsError } = await supabase
    .from('pool_items')
    .select('*')
    .in('pool_id', poolIds)
    .order('created_at', { ascending: false });
  if (itemsError) throw itemsError;

  const itemsByPool = new Map<string, PoolItem[]>();
  (items ?? []).forEach(row => {
    const poolId = row.pool_id as string;
    const list = itemsByPool.get(poolId) ?? [];
    list.push(toPoolItem(row));
    itemsByPool.set(poolId, list);
  });

  return pools.map(pool => toPool(pool, itemsByPool.get(pool.id) ?? []));
};

export const getPool = async (poolId: string): Promise<Pool | null> => {
  const { data: pool, error } = await supabase
    .from('pools')
    .select('*')
    .eq('id', poolId)
    .single();
  if (error) throw error;
  if (!pool) return null;
  const { data: items, error: itemsError } = await supabase
    .from('pool_items')
    .select('*')
    .eq('pool_id', poolId)
    .order('created_at', { ascending: false });
  if (itemsError) throw itemsError;
  return toPool(pool, (items ?? []).map(toPoolItem));
};

export const createPool = async (name: string): Promise<Pool> => {
  const trimmed = normalizeText(name);
  if (!trimmed) {
    throw new Error('Pool name cannot be empty.');
  }
  const userId = await requireProfileId();
  const { data, error } = await supabase
    .from('pools')
    .insert({ user_id: userId, name: trimmed })
    .select('*')
    .single();
  if (error) throw error;
  return toPool(data, []);
};

export const renamePool = async (poolId: string, name: string): Promise<Pool | null> => {
  const trimmed = normalizeText(name);
  if (!trimmed) {
    throw new Error('Pool name cannot be empty.');
  }
  const { data, error } = await supabase
    .from('pools')
    .update({ name: trimmed })
    .eq('id', poolId)
    .select('*')
    .single();
  if (error) throw error;
  return data ? toPool(data, []) : null;
};

export const deletePool = async (poolId: string): Promise<void> => {
  const { error } = await supabase
    .from('pools')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', poolId);
  if (error) throw error;
};

export const addItemToPool = async (poolId: string, text: string, tags?: string[], note?: string): Promise<PoolItem> => {
  const normalizedText = normalizeText(text);
  if (!normalizedText) {
    throw new Error('Item text cannot be empty.');
  }
  const payload = {
    pool_id: poolId,
    text: normalizedText,
    tags: tags && tags.length > 0 ? tags.map(normalizeText).filter(Boolean) : null,
    note: note ? normalizeText(note) : null,
  };
  const { data, error } = await supabase
    .from('pool_items')
    .insert(payload)
    .select('*')
    .single();
  if (error) throw error;
  return toPoolItem(data);
};

export const updatePoolItem = async (poolId: string, updated: PoolItem): Promise<PoolItem | null> => {
  const payload = {
    text: normalizeText(updated.text),
    tags: updated.tags && updated.tags.length > 0 ? updated.tags.map(normalizeText).filter(Boolean) : null,
    note: updated.note ? normalizeText(updated.note) : null,
  };
  const { data, error } = await supabase
    .from('pool_items')
    .update(payload)
    .eq('id', updated.id)
    .eq('pool_id', poolId)
    .select('*')
    .single();
  if (error) throw error;
  return data ? toPoolItem(data) : null;
};

export const deletePoolItem = async (poolId: string, itemId: string): Promise<void> => {
  const { error } = await supabase
    .from('pool_items')
    .delete()
    .eq('id', itemId)
    .eq('pool_id', poolId);
  if (error) throw error;
};

export const exportPoolPayload = async (poolId: string): Promise<{ version: 1; pool: Pool }> => {
  const pool = await getPool(poolId);
  if (!pool) {
    throw new Error('Pool not found.');
  }
  return {
    version: 1,
    pool,
  };
};

export const importPoolPayload = async (
  payload: { version: number; pool: Pool },
  mode: 'merge' | 'replace'
): Promise<Pool> => {
  if (!payload || payload.version !== 1 || !payload.pool) {
    throw new Error('Invalid pool payload.');
  }
  const userId = await requireProfileId();
  const incoming = payload.pool;
  const existing = await listPools();
  const existingIndex = existing.findIndex(pool => pool.name === incoming.name);

  const sanitizeItems = (items: PoolItem[]) =>
    items.map(item => ({
      text: normalizeText(item.text),
      tags: item.tags?.map(normalizeText).filter(Boolean) ?? null,
      note: item.note ? normalizeText(item.note) : null,
    }));

  if (existingIndex === -1) {
    const { data: newPool, error } = await supabase
      .from('pools')
      .insert({ user_id: userId, name: normalizeText(incoming.name) })
      .select('*')
      .single();
    if (error) throw error;
    const items = sanitizeItems(incoming.items || []);
    if (items.length > 0) {
      const { error: itemsError } = await supabase
        .from('pool_items')
        .insert(items.map(item => ({ ...item, pool_id: newPool.id })));
      if (itemsError) throw itemsError;
    }
    return getPool(newPool.id) as Promise<Pool>;
  }

  const targetPool = existing[existingIndex];
  if (mode === 'replace') {
    await supabase.from('pool_items').delete().eq('pool_id', targetPool.id);
  }

  const items = sanitizeItems(incoming.items || []);
  if (items.length > 0) {
    const { error: itemsError } = await supabase
      .from('pool_items')
      .insert(items.map(item => ({ ...item, pool_id: targetPool.id })));
    if (itemsError) throw itemsError;
  }
  return getPool(targetPool.id) as Promise<Pool>;
};

export const exportAllPoolsPayload = async (): Promise<PoolStore> => {
  const pools = await listPools();
  return { version: 1, pools };
};

export const importAllPoolsPayload = async (payload: PoolStore, mode: 'merge' | 'replace') => {
  if (!payload || payload.version !== 1 || !Array.isArray(payload.pools)) {
    throw new Error('Invalid pools payload.');
  }
  if (mode === 'replace') {
    const pools = await listPools();
    const poolIds = pools.map(pool => pool.id);
    if (poolIds.length > 0) {
      await supabase.from('pool_items').delete().in('pool_id', poolIds);
      await supabase.from('pools').delete().in('id', poolIds);
    }
  }

  for (const pool of payload.pools) {
    await importPoolPayload({ version: 1, pool }, 'merge');
  }
};

export const exportPoolCsv = async (poolId: string): Promise<string> => {
  const pool = await getPool(poolId);
  if (!pool) {
    throw new Error('Pool not found.');
  }
  const rows = pool.items.map(item => {
    const tags = item.tags ? item.tags.join(', ') : '';
    const note = item.note ?? '';
    const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
    return [item.text, tags, note].map(escape).join(',');
  });
  return ['text,tags,note', ...rows].join('\n');
};

export const importPoolCsv = async (poolId: string, csv: string, mode: 'merge' | 'replace') => {
  const pool = await getPool(poolId);
  if (!pool) {
    throw new Error('Pool not found.');
  }
  const lines = csv.split('\n').map(line => line.trim()).filter(Boolean);
  if (lines.length === 0) {
    throw new Error('CSV is empty.');
  }
  const startIndex = lines[0].toLowerCase().startsWith('text') ? 1 : 0;
  const items: Array<{ text: string; tags?: string[]; note?: string }> = [];
  for (let i = startIndex; i < lines.length; i += 1) {
    const line = lines[i];
    const parts = line.split(',').map(part => part.replace(/^"|"$/g, '').trim());
    if (!parts[0]) continue;
    items.push({
      text: normalizeText(parts[0]),
      tags: parts[1] ? parseTagsCsv(parts[1]) : undefined,
      note: parts[2] ? normalizeText(parts[2]) : undefined,
    });
  }
  if (mode === 'replace') {
    await supabase.from('pool_items').delete().eq('pool_id', poolId);
  }
  if (items.length > 0) {
    const { error } = await supabase
      .from('pool_items')
      .insert(items.map(item => ({
        pool_id: poolId,
        text: item.text,
        tags: item.tags?.map(normalizeText).filter(Boolean) ?? null,
        note: item.note ? normalizeText(item.note) : null,
      })));
    if (error) throw error;
  }
};

const parseTagsCsv = (raw: string): string[] =>
  raw
    .split(',')
    .map(tag => normalizeText(tag))
    .filter(Boolean);
