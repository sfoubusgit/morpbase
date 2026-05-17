import type { CommunityIdentityType } from '../data/communityIdentities';

// ── Wall ──────────────────────────────────────────────────────────────────────

export type WallPostIdentityTag = {
  name: string;
  type: CommunityIdentityType;
};

export type WallPostType = 'standard' | 'share_event' | 'response';

export type WallPost = {
  id: string;
  authUid: string;
  authorId: string;
  authorName: string;
  caption: string | null;
  promptText: string;
  identityTags: WallPostIdentityTag[];
  postType: WallPostType;
  likeCount: number;
  createdAt: number;
  isLikedByMe?: boolean;
};

export type CreateWallPostInput = {
  caption?: string | null;
  promptText: string;
  identityTags: WallPostIdentityTag[];
  postType?: WallPostType;
};

// ── Follows ───────────────────────────────────────────────────────────────────

export type FollowCounts = {
  followers: number;
  following: number;
};

// ── XP & Titles ───────────────────────────────────────────────────────────────

export type UserTitle = {
  slug: string;
  label: string;
  minXp: number;
};

export type UserXP = {
  authUid: string;
  totalXp: number;
  title: UserTitle;
  nextTitle: UserTitle | null;
  xpToNextTitle: number | null;
};

export type XPEventType =
  | 'share_identity'
  | 'post_to_wall'
  | 'identity_added_by_other'
  | 'got_followed'
  | 'identity_remixed'
  | 'complete_challenge';

// ── Badges ────────────────────────────────────────────────────────────────────

export type BadgeId =
  | 'first_wall_post'
  | 'first_share'
  | 'first_follower'
  | 'first_remix_given'
  | 'first_remix_received'
  | 'first_challenge_entry'
  | 'founding_moth'
  | 'challenge_pioneer'
  | 'challenge_faithful'
  | 'lore_weaver'
  | 'lineage_root'
  | 'generous'
  | 'discovered'
  | 'connector';

export type BadgeRarity = 'common' | 'rare' | 'legendary';

export type BadgeDefinition = {
  id: BadgeId;
  label: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
};

export type EarnedBadge = {
  badgeId: BadgeId;
  earnedAt: number;
};

// ── Challenges ────────────────────────────────────────────────────────────────

export type ChallengeType = 'weekly' | 'monthly' | 'flash';

export type Challenge = {
  id: string;
  number: number;
  title: string;
  constraintText: string;
  description: string | null;
  type: ChallengeType;
  startsAt: number;
  endsAt: number;
  createdAt: number;
};

export type ChallengeEntry = {
  id: string;
  challengeId: string;
  authUid: string;
  authorId: string;
  wallPostId: string | null;
  createdAt: number;
};

// ── DMs ───────────────────────────────────────────────────────────────────────

export type DirectMessage = {
  id: string;
  senderAuthUid: string;
  recipientAuthUid: string;
  body: string;
  promptSnapshot: string | null;
  readAt: number | null;
  createdAt: number;
};

export type DMThread = {
  otherAuthUid: string;
  otherName: string;
  lastMessage: DirectMessage;
  unreadCount: number;
};

export type SendDMInput = {
  recipientAuthUid: string;
  body: string;
  promptSnapshot?: string | null;
};

// ── Notifications ─────────────────────────────────────────────────────────────

export type NotificationType =
  | 'new_follower'
  | 'identity_remixed'
  | 'wall_post_liked'
  | 'dm_received'
  | 'challenge_deadline'
  | 'xp_milestone'
  | 'badge_earned';

export type Notification = {
  id: string;
  authUid: string;
  type: NotificationType;
  payload: Record<string, unknown>;
  readAt: number | null;
  createdAt: number;
};

// ── Creator (for Creators tab) ────────────────────────────────────────────────

export type CommunityCreator = {
  authUid: string;
  userId: string;
  name: string;
  title: UserTitle | null;
  followerCount: number;
  identityCount: number;
  wallPostCount: number;
};
