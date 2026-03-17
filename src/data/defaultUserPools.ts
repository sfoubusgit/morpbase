import type { Pool } from '../types';

const now = Date.now();
const defaultFolderId = '__default_pools_folder__';

export const defaultUserPools: Pool[] = [
  {
    id: '__default_pool_cinematic_camera__',
    name: 'Cinematic Camera Moves',
    folderId: defaultFolderId,
    folderName: 'Default Pools',
    createdAt: now,
    updatedAt: now,
    initiativePhrases: [],
    items: [
      { id: '__default_pool_cinematic_camera_1__', text: 'low angle shot', tags: ['camera', 'cinematic'] },
      { id: '__default_pool_cinematic_camera_2__', text: 'dramatic close-up', tags: ['camera', 'portrait'] },
      { id: '__default_pool_cinematic_camera_3__', text: 'wide establishing shot', tags: ['camera', 'scene'] },
      { id: '__default_pool_cinematic_camera_4__', text: 'over-the-shoulder framing', tags: ['camera', 'composition'] },
      { id: '__default_pool_cinematic_camera_5__', text: 'dynamic tracking shot', tags: ['camera', 'motion'] },
      { id: '__default_pool_cinematic_camera_6__', text: 'shallow depth of field', tags: ['camera', 'focus'] },
    ],
  },
  {
    id: '__default_pool_atmosphere__',
    name: 'Atmosphere And Particles',
    folderId: defaultFolderId,
    folderName: 'Default Pools',
    createdAt: now,
    updatedAt: now,
    initiativePhrases: [],
    items: [
      { id: '__default_pool_atmosphere_1__', text: 'volumetric fog', tags: ['atmosphere', 'fog'] },
      { id: '__default_pool_atmosphere_2__', text: 'floating dust particles', tags: ['atmosphere', 'particles'] },
      { id: '__default_pool_atmosphere_3__', text: 'soft mist in the foreground', tags: ['atmosphere', 'depth'] },
      { id: '__default_pool_atmosphere_4__', text: 'embers drifting through the air', tags: ['atmosphere', 'particles'] },
      { id: '__default_pool_atmosphere_5__', text: 'subtle rain haze', tags: ['atmosphere', 'weather'] },
      { id: '__default_pool_atmosphere_6__', text: 'glowing ambient bloom', tags: ['atmosphere', 'light'] },
    ],
  },
  {
    id: '__default_pool_portrait__',
    name: 'Portrait Boosters',
    folderId: defaultFolderId,
    folderName: 'Default Pools',
    createdAt: now,
    updatedAt: now,
    initiativePhrases: [],
    items: [
      { id: '__default_pool_portrait_1__', text: 'highly detailed face', tags: ['portrait', 'detail'] },
      { id: '__default_pool_portrait_2__', text: 'natural skin texture', tags: ['portrait', 'realism'] },
      { id: '__default_pool_portrait_3__', text: 'sharp eyes in focus', tags: ['portrait', 'focus'] },
      { id: '__default_pool_portrait_4__', text: 'subtle expression', tags: ['portrait', 'emotion'] },
      { id: '__default_pool_portrait_5__', text: 'clean facial anatomy', tags: ['portrait', 'anatomy'] },
      { id: '__default_pool_portrait_6__', text: 'balanced facial lighting', tags: ['portrait', 'lighting'] },
    ],
  },
  {
    id: '__default_pool_quality__',
    name: 'Quality Finishers',
    folderId: defaultFolderId,
    folderName: 'Default Pools',
    createdAt: now,
    updatedAt: now,
    initiativePhrases: [],
    items: [
      { id: '__default_pool_quality_1__', text: 'ultra detailed', tags: ['quality'] },
      { id: '__default_pool_quality_2__', text: 'clean composition', tags: ['quality', 'composition'] },
      { id: '__default_pool_quality_3__', text: 'rich visual contrast', tags: ['quality', 'contrast'] },
      { id: '__default_pool_quality_4__', text: 'polished rendering', tags: ['quality', 'finish'] },
      { id: '__default_pool_quality_5__', text: 'crisp edges', tags: ['quality', 'detail'] },
      { id: '__default_pool_quality_6__', text: 'high visual clarity', tags: ['quality', 'clarity'] },
    ],
  },
  {
    id: '__default_pool_pixel_portrait__',
    name: 'Pixel Art Portrait Lab',
    folderId: defaultFolderId,
    folderName: 'Default Pools',
    createdAt: now,
    updatedAt: now,
    initiativePhrases: [
      { id: '__default_pool_pixel_portrait_init_1__', text: 'clean 32x32 pixel art portrait' },
      { id: '__default_pool_pixel_portrait_init_2__', text: 'limited palette portrait sprite' },
      { id: '__default_pool_pixel_portrait_init_3__', text: 'centered bust portrait framing' },
    ],
    items: [
      { id: '__default_pool_pixel_portrait_1__', text: 'young mage with short silver hair', section: 'Subjects', tags: ['pixel-art', 'portrait', 'mage'] },
      { id: '__default_pool_pixel_portrait_2__', text: 'cyberpunk mechanic with tired eyes', section: 'Subjects', tags: ['pixel-art', 'portrait', 'cyberpunk'] },
      { id: '__default_pool_pixel_portrait_3__', text: 'stern knight with a scar across one cheek', section: 'Subjects', tags: ['pixel-art', 'portrait', 'knight'] },
      { id: '__default_pool_pixel_portrait_4__', text: 'village girl with long braided hair', section: 'Subjects', tags: ['pixel-art', 'portrait', 'village'] },

      { id: '__default_pool_pixel_portrait_5__', text: 'clean 32x32 pixel art portrait', section: 'Style', tags: ['pixel-art', 'style', '32x32'] },
      { id: '__default_pool_pixel_portrait_6__', text: 'SNES-inspired character portrait', section: 'Style', tags: ['pixel-art', 'style', 'snes'] },
      { id: '__default_pool_pixel_portrait_7__', text: 'limited palette portrait sprite', section: 'Style', tags: ['pixel-art', 'style', 'palette'] },
      { id: '__default_pool_pixel_portrait_8__', text: 'crisp pixel clustering with readable face shapes', section: 'Style', tags: ['pixel-art', 'style', 'clustering'] },

      { id: '__default_pool_pixel_portrait_9__', text: 'warm side lighting with strong readable contrast', section: 'Lighting', tags: ['pixel-art', 'lighting', 'warm'] },
      { id: '__default_pool_pixel_portrait_10__', text: 'cool moonlit rim light', section: 'Lighting', tags: ['pixel-art', 'lighting', 'moonlight'] },
      { id: '__default_pool_pixel_portrait_11__', text: 'soft tavern candle glow', section: 'Lighting', tags: ['pixel-art', 'lighting', 'candle'] },
      { id: '__default_pool_pixel_portrait_12__', text: 'flat daylight with simplified sprite shading', section: 'Lighting', tags: ['pixel-art', 'lighting', 'daylight'] },

      { id: '__default_pool_pixel_portrait_13__', text: 'quiet melancholy', section: 'Mood', tags: ['pixel-art', 'mood', 'melancholy'] },
      { id: '__default_pool_pixel_portrait_14__', text: 'heroic resolve', section: 'Mood', tags: ['pixel-art', 'mood', 'heroic'] },
      { id: '__default_pool_pixel_portrait_15__', text: 'playful confidence', section: 'Mood', tags: ['pixel-art', 'mood', 'playful'] },
      { id: '__default_pool_pixel_portrait_16__', text: 'haunted stillness', section: 'Mood', tags: ['pixel-art', 'mood', 'haunted'] },

      { id: '__default_pool_pixel_portrait_17__', text: 'centered bust portrait framing', section: 'Composition', tags: ['pixel-art', 'composition', 'bust'] },
      { id: '__default_pool_pixel_portrait_18__', text: 'tight face close-up crop', section: 'Composition', tags: ['pixel-art', 'composition', 'close-up'] },
      { id: '__default_pool_pixel_portrait_19__', text: 'three-quarter portrait view', section: 'Composition', tags: ['pixel-art', 'composition', 'three-quarter'] },
      { id: '__default_pool_pixel_portrait_20__', text: 'dialogue-window portrait framing', section: 'Composition', tags: ['pixel-art', 'composition', 'dialogue'] },

      { id: '__default_pool_pixel_portrait_21__', text: 'faint ember particles', section: 'Effects', tags: ['pixel-art', 'effects', 'embers'] },
      { id: '__default_pool_pixel_portrait_22__', text: 'subtle rain overlay', section: 'Effects', tags: ['pixel-art', 'effects', 'rain'] },
      { id: '__default_pool_pixel_portrait_23__', text: 'tiny magical sparkles', section: 'Effects', tags: ['pixel-art', 'effects', 'magic'] },
      { id: '__default_pool_pixel_portrait_24__', text: 'soft CRT glow', section: 'Effects', tags: ['pixel-art', 'effects', 'crt'] },
    ],
  },
];
