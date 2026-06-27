/**
 * v3 Mood lane — the emotional charge that colours the whole frame.
 * Content wiped to a clean slate (2026-06-27); defaults to be rebuilt.
 */
export type MoodItem = { id: string; name: string; summary: string; phrases: string[]; tint: number };

export const MOOD_ITEMS: MoodItem[] = [];
