/** v3 Environment lane — where it happens: the setting/place of the image. */
export type EnvironmentItem = { id: string; name: string; summary: string; phrases: string[]; tint: number };

export const ENVIRONMENT_ITEMS: EnvironmentItem[] = [
  { id: 'env_neon_district', name: 'Neon district', summary: 'A dense canyon of glowing signage.', tint: 5,
    phrases: ['a dense neon district, a canyon of glowing signage', 'wet streets mirroring pink and cyan light'] },
  { id: 'env_flooded_subway', name: 'Flooded subway', summary: 'A half-submerged, dripping station.', tint: 7,
    phrases: ['a half-flooded subway station, ankle-deep still water', 'dripping tiles and dead fluorescents reflected below'] },
  { id: 'env_rooftop_garden', name: 'Rooftop garden', summary: 'Overgrown planters high above the city.', tint: 6,
    phrases: ['an overgrown rooftop garden high above the city', 'tangled planters and string lights against the skyline'] },
  { id: 'env_capsule_hotel', name: 'Capsule hotel', summary: 'A wall of glowing sleeping pods.', tint: 8,
    phrases: ['a capsule hotel corridor, a wall of glowing sleeping pods', 'low warm light, tight cramped geometry'] },
  { id: 'env_backstreet_shrine', name: 'Backstreet shrine', summary: 'A tiny shrine tucked between buildings.', tint: 3,
    phrases: ['a tiny backstreet shrine tucked between tall buildings', 'red torii and lanterns, incense smoke, quiet stillness'] },
  { id: 'env_elevated_expressway', name: 'Elevated expressway', summary: 'Under the pillars of a raised highway.', tint: 0,
    phrases: ['beneath the concrete pillars of an elevated expressway', 'sodium light, passing headlights, graffiti and grime'] },
  { id: 'env_arcade_basement', name: 'Arcade basement', summary: 'A loud, screen-lit underground arcade.', tint: 4,
    phrases: ['a loud underground arcade, rows of glowing screens', 'saturated coloured light, smoke, and motion'] },
  { id: 'env_harbor_docks', name: 'Harbor docks', summary: 'Container stacks and dark water.', tint: 2,
    phrases: ['the harbor docks at night, stacked containers and cranes', 'dark water, distant city glow, cold open air'] },
];
