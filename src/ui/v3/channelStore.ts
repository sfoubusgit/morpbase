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
 * Data is seeded deterministically from the subject id so channels look lived-in,
 * and mutations persist to localStorage.
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

const STORAGE_KEY = 'morpbase:v3:channels:v1';

const SEED_AUTHORS = ['atlas', 'mei', 'kuro', 'ren', 'iyo', 'nox', 'soraya', 'dust', 'vela', 'kite'];
const SEED_COMMENTS = [
  'the rim lighting on this one is unreal',
  'added to my Deep Signal world, fits perfectly',
  'this is exactly the energy i was missing',
  'the coat detail holds up so well across scenes',
  'rendered four variations, every one usable',
  'best base character in this universe imo',
];
const SEED_AGOS = ['just now', '2h', '5h', '1d', '3d', '1w'];

/** small deterministic string hash → uint32 */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** seeded PRNG (mulberry32) so a given subject always seeds the same channel */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedChannel(subjectId: string): ItemChannel {
  const r = rng(hash(subjectId));
  const pick = <T,>(arr: T[]) => arr[Math.floor(r() * arr.length)] as T;

  const galleryCount = 6 + Math.floor(r() * 13); // 6–18
  const gallery: GalleryImage[] = Array.from({ length: galleryCount }, (_, i) => ({
    id: `${subjectId}_g${i}`,
    author: pick(SEED_AUTHORS),
    tint: Math.floor(r() * 10),
  }));

  const commentCount = 2 + Math.floor(r() * 4); // 2–5
  const comments: ChannelComment[] = Array.from({ length: commentCount }, (_, i) => ({
    id: `${subjectId}_c${i}`,
    author: pick(SEED_AUTHORS),
    body: pick(SEED_COMMENTS),
    likes: Math.floor(r() * 18),
    ago: pick(SEED_AGOS),
  }));

  const ratingCount = 20 + Math.floor(r() * 400);
  const rating = Math.round((3.8 + r() * 1.1) * 10) / 10; // 3.8–4.9

  return {
    subjectId,
    stats: {
      likes: 200 + Math.floor(r() * 2200),
      scenesMade: galleryCount + Math.floor(r() * 380),
      followers: 20 + Math.floor(r() * 300),
      rating,
      ratingCount,
    },
    gallery,
    comments,
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
      ch = seedChannel(subjectId);
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
