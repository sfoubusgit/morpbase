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
    items: [
      { id: '__default_pool_quality_1__', text: 'ultra detailed', tags: ['quality'] },
      { id: '__default_pool_quality_2__', text: 'clean composition', tags: ['quality', 'composition'] },
      { id: '__default_pool_quality_3__', text: 'rich visual contrast', tags: ['quality', 'contrast'] },
      { id: '__default_pool_quality_4__', text: 'polished rendering', tags: ['quality', 'finish'] },
      { id: '__default_pool_quality_5__', text: 'crisp edges', tags: ['quality', 'detail'] },
      { id: '__default_pool_quality_6__', text: 'high visual clarity', tags: ['quality', 'clarity'] },
    ],
  },
];
