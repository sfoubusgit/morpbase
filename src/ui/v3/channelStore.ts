/**
 * v3 Channel store — local, seeded stand-in for the per-item "Channel" backend.
 *
 * In the v3 model every lane item (a character, a scenery, …) has an "origin
 * channel": a gallery of community images, a rating, and a comment thread.
 * That is where the old Community surface now lives.
 *
 * Slice 1 keeps the whole thing client-side behind the small `ChannelBackend`
 * interface below, so the real Supabase-backed implementation (gallery Storage
 * bucket + comments/ratings tables) can drop in later without the UI changing.
 *
 * Numbers are REAL, never fabricated: a fresh channel starts empty (no likes,
 * no scenes, no rating, no gallery, no comments). Everything shown is something
 * that actually happened — an image saved from Generate, a real rating, a real
 * comment. Mutations persist to localStorage.
 */

export type GalleryImage = {
  id: string;
  author: string;
  /** index into the v3 tint palette — placeholder when there's no real image */
  tint: number;
  /** real generated-image url, when saved from Generate */
  url?: string;
};

export type ChannelComment = {
  id: string;
  author: string;
  body: string;
  likes: number;
  ago: string;
};

export type ChannelStats = {
  likes: number;
  scenesMade: number;
  followers: number;
  /** average 1–5 */
  rating: number;
  ratingCount: number;
};

export type ItemChannel = {
  subjectId: string;
  stats: ChannelStats;
  gallery: GalleryImage[];
  comments: ChannelComment[];
  myRating: number | null;
  following: boolean;
};

export interface ChannelBackend {
  getChannel(subjectId: string, seedName?: string): ItemChannel;
  rate(subjectId: string, rating: number): ItemChannel;
  toggleFollow(subjectId: string): ItemChannel;
  addComment(subjectId: string, author: string, body: string): ItemChannel;
  likeComment(subjectId: string, commentId: string): ItemChannel;
  /** Save a generated image into the channel gallery. */
  addGalleryImage(subjectId: string, author: string, url: string): ItemChannel;
}

// Bumped from v1 → v2 to discard the old fabricated (seeded) channels, so every
// channel re-materialises empty and only fills with real activity.
const STORAGE_KEY = 'morpbase:v3:channels:v2';

/** A fresh, real channel — empty until actual activity fills it. */
function emptyChannel(subjectId: string): ItemChannel {
  return {
    subjectId,
    stats: { likes: 0, scenesMade: 0, followers: 0, rating: 0, ratingCount: 0 },
    gallery: [],
    comments: [],
    myRating: null,
    following: false,
  };
}

type ChannelMap = Record<string, ItemChannel>;

function readAll(): ChannelMap {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChannelMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: ChannelMap): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* quota / unavailable — non-fatal for a local seam */
  }
}

class LocalChannelStore implements ChannelBackend {
  private cache: ChannelMap = readAll();

  private ensure(subjectId: string): ItemChannel {
    let ch = this.cache[subjectId];
    if (!ch) {
      ch = emptyChannel(subjectId);
      this.cache[subjectId] = ch;
      writeAll(this.cache);
    }
    return ch;
  }

  private commit(subjectId: string, next: ItemChannel): ItemChannel {
    this.cache[subjectId] = next;
    writeAll(this.cache);
    return next;
  }

  getChannel(subjectId: string): ItemChannel {
    return this.ensure(subjectId);
  }

  rate(subjectId: string, rating: number): ItemChannel {
    const ch = this.ensure(subjectId);
    const clamped = Math.max(1, Math.min(5, rating));
    // adjust the running average as if replacing/adding this viewer's vote
    const hadVote = ch.myRating != null;
    const total = ch.stats.rating * ch.stats.ratingCount;
    const newCount = hadVote ? ch.stats.ratingCount : ch.stats.ratingCount + 1;
    const newTotal = hadVote ? total - (ch.myRating as number) + clamped : total + clamped;
    return this.commit(subjectId, {
      ...ch,
      myRating: clamped,
      stats: { ...ch.stats, rating: Math.round((newTotal / newCount) * 10) / 10, ratingCount: newCount },
    });
  }

  toggleFollow(subjectId: string): ItemChannel {
    const ch = this.ensure(subjectId);
    const following = !ch.following;
    return this.commit(subjectId, {
      ...ch,
      following,
      stats: { ...ch.stats, followers: ch.stats.followers + (following ? 1 : -1) },
    });
  }

  addComment(subjectId: string, author: string, body: string): ItemChannel {
    const ch = this.ensure(subjectId);
    const trimmed = body.trim();
    if (!trimmed) return ch;
    const comment: ChannelComment = {
      id: `${subjectId}_c_${Date.now()}`,
      author,
      body: trimmed,
      likes: 0,
      ago: 'just now',
    };
    return this.commit(subjectId, { ...ch, comments: [comment, ...ch.comments] });
  }

  likeComment(subjectId: string, commentId: string): ItemChannel {
    const ch = this.ensure(subjectId);
    return this.commit(subjectId, {
      ...ch,
      comments: ch.comments.map(c => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c)),
    });
  }

  addGalleryImage(subjectId: string, author: string, url: string): ItemChannel {
    const ch = this.ensure(subjectId);
    const img: GalleryImage = { id: `${subjectId}_g_${Date.now()}_${ch.gallery.length}`, author, tint: 0, url };
    return this.commit(subjectId, {
      ...ch,
      gallery: [img, ...ch.gallery],
      stats: { ...ch.stats, scenesMade: ch.stats.scenesMade + 1 },
    });
  }
}

export const channelStore: ChannelBackend = new LocalChannelStore();
