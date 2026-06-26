/** v3 Lighting lane — how the scene is lit, applied as a prompt layer. */
export type LightingItem = { id: string; name: string; summary: string; phrases: string[]; tint: number };

export const LIGHTING_ITEMS: LightingItem[] = [
  { id: 'lighting_rim_neon', name: 'Rim neon', summary: 'Coloured neon edge-light tracing the subject.', tint: 5,
    phrases: ['lit by coloured neon rim light tracing the edges of the subject', 'cyan and magenta highlights along the silhouette'] },
  { id: 'lighting_fogged_sodium', name: 'Fogged sodium', summary: 'Hazy amber streetlight through mist.', tint: 4,
    phrases: ['hazy amber sodium streetlight diffused through mist', 'warm fog softening every edge'] },
  { id: 'lighting_moon_wash', name: 'Moon wash', summary: 'Cool, even moonlight.', tint: 7,
    phrases: ['cool even moonlight washing the scene in pale blue', 'soft shadows, no harsh source'] },
  { id: 'lighting_hard_noir', name: 'Hard noir', summary: 'High-contrast shafts and deep shadow.', tint: 0,
    phrases: ['hard high-contrast noir lighting, sharp shafts of light', 'deep black shadow swallowing half the frame'] },
  { id: 'lighting_soft_dawn', name: 'Soft dawn', summary: 'Low warm light just after sunrise.', tint: 3,
    phrases: ['soft low warm dawn light just after sunrise', 'long gentle shadows, golden tone'] },
  { id: 'lighting_signage_glow', name: 'Signage glow', summary: 'Underlit by flickering shop signs.', tint: 8,
    phrases: ['underlit by the flickering glow of shop signage', 'shifting coloured light dancing across the face'] },
];
