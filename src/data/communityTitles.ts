import type { UserTitle } from '../types/community';

export const TITLE_LADDER: UserTitle[] = [
  { slug: 'moth_apprentice', label: 'Moth Apprentice', minXp: 0    },
  { slug: 'ink_weaver',      label: 'Ink Weaver',      minXp: 150  },
  { slug: 'lore_keeper',     label: 'Lore Keeper',     minXp: 400  },
  { slug: 'world_architect', label: 'World Architect', minXp: 900  },
  { slug: 'the_unseen',      label: 'The Unseen',      minXp: 2000 },
];

export const getTitleForXp = (xp: number): UserTitle => {
  for (let i = TITLE_LADDER.length - 1; i >= 0; i--) {
    if (xp >= TITLE_LADDER[i].minXp) return TITLE_LADDER[i];
  }
  return TITLE_LADDER[0];
};

export const getNextTitle = (xp: number): UserTitle | null => {
  const current = getTitleForXp(xp);
  const idx = TITLE_LADDER.findIndex(t => t.slug === current.slug);
  return idx < TITLE_LADDER.length - 1 ? TITLE_LADDER[idx + 1] : null;
};

export const getXpToNextTitle = (xp: number): number | null => {
  const next = getNextTitle(xp);
  return next ? next.minXp - xp : null;
};

export const XP_PER_EVENT: Record<string, number> = {
  share_identity:          20,
  post_to_wall:            15,
  identity_added_by_other: 10,
  got_followed:             5,
  identity_remixed:        25,
  complete_challenge:      50,
};
