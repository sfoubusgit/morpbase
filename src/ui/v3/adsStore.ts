/**
 * v3 ads — self-served house ads shown as native cards inside the lane browser.
 * Read-only from the client (public reads active rows); ads are authored via the
 * Supabase dashboard / SQL. Swap this provider for a real ad network later
 * without touching the wall or the AdCard.
 */
import { supabase } from '../../engine/supabaseClient';

export type AdItem = {
  id: string;
  imageUrl: string;
  linkUrl: string;
  label: string;
  headline: string;
};

type Row = { id: string; image_url: string; link_url: string; label: string | null; headline: string | null; weight: number | null };

export async function listAds(): Promise<AdItem[]> {
  const { data, error } = await supabase
    .from('v3_ads')
    .select('id, image_url, link_url, label, headline, weight')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error || !data) return [];
  // Expand by weight so heavier ads appear more often in the rotation.
  const out: AdItem[] = [];
  for (const r of data as Row[]) {
    const item: AdItem = {
      id: r.id,
      imageUrl: r.image_url,
      linkUrl: r.link_url,
      label: r.label || 'Sponsored',
      headline: r.headline || '',
    };
    const reps = Math.max(1, Math.min(5, r.weight ?? 1));
    for (let i = 0; i < reps; i++) out.push(item);
  }
  return out;
}
