/** Small shared helpers for v3 surfaces. */
import type { CharacterIdentity } from '../../types/characters';

/** The best available image for a character, or null to fall back to a tint. */
export function characterImage(c: CharacterIdentity): string | null {
  return c.coverImageUrl || c.avatar?.dataUrl || null;
}

/** Deterministic 0–9 tint index from any string (placeholder for a real image). */
export function tintIndex(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % 10;
}

/** The prompt element a character contributes — its core phrase bundle. */
export function promptElement(c: CharacterIdentity): string {
  const core = c.phraseBundle?.core ?? [];
  if (core.length) return core.join(' · ');
  return c.summary ?? '';
}

/** Compact like-count formatting (1234 → 1.2k). */
export function compact(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}
