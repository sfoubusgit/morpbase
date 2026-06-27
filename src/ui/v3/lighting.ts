/**
 * v3 Lighting lane — how the scene is lit, applied as a prompt layer.
 * Content wiped to a clean slate (2026-06-27); defaults to be rebuilt.
 */
export type LightingItem = { id: string; name: string; summary: string; phrases: string[]; tint: number };

export const LIGHTING_ITEMS: LightingItem[] = [];
