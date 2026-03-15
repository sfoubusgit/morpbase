import type { Pool } from '../types';
import { createPool } from './poolStore';
import { supabase } from './supabaseClient';

const normalizeText = (value: string): string =>
  value.replace(/\s+/g, ' ').trim();

export const createPoolFromTemplate = async (template: Pool, name: string): Promise<Pool> => {
  const created = await createPool(name);
  const items = template.items
    .map(item => ({
      pool_id: created.id,
      text: normalizeText(item.text),
      section: item.section ? normalizeText(item.section) : null,
      tags: item.tags?.map(normalizeText).filter(Boolean) ?? null,
      note: item.note ? normalizeText(item.note) : null,
    }))
    .filter(item => item.text);

  if (items.length > 0) {
    const { error } = await supabase
      .from('pool_items')
      .insert(items);
    if (error) throw error;
  }

  return {
    ...created,
    items: template.items.map(item => ({
      ...item,
      text: normalizeText(item.text),
      section: item.section ? normalizeText(item.section) : undefined,
      tags: item.tags?.map(normalizeText).filter(Boolean) ?? undefined,
      note: item.note ? normalizeText(item.note) : undefined,
    })),
    updatedAt: Date.now(),
  };
};
