import { useEffect, useMemo, useState } from 'react';
import type { CreatorStats, Pool, PoolHubEntry, WorkingSet, WorkingSetHubEntry, PublicProfile } from '../../types';
import {
  addHubEntry,
  addHubComment,
  getUserRating,
  listHubComments,
  listHubEntries,
  setUserRating,
  updateHubComment,
  deleteHubComment,
  flagHubEntry,
  exportHubStore,
  importHubStore,
  resetHubStore,
  removeHubEntry,
} from '../../engine/poolHubStore';
import { exportPoolPayload, importPoolPayload, listPools } from '../../engine/poolStore';
import {
  addWorkingSetHubComment,
  addWorkingSetHubEntry,
  deleteWorkingSetHubComment,
  exportWorkingSetHubStore,
  flagWorkingSetHubEntry,
  getWorkingSetUserRating,
  importWorkingSetHubStore,
  listWorkingSetHubComments,
  listWorkingSetHubEntries,
  removeWorkingSetHubEntry,
  resetWorkingSetHubStore,
  setWorkingSetUserRating,
  updateWorkingSetHubComment,
} from '../../engine/workingSetHubStore';
import {
  exportWorkingSetPayload,
  importWorkingSetPayload,
  listWorkingSets,
  setActiveWorkingSetId,
} from '../../engine/workingSetStore';
import {
  getMyPublicProfile,
  listPublicProfiles,
} from '../../engine/profileStore';
import { listCreatorStatsByUserIds } from '../../engine/creatorStatsStore';
import { getCreatorSummaryFromPoolEntries, mergeCreatorSummaryWithStats } from '../../engine/creatorSummary';
import { trackAnalyticsEvent } from '../../engine/analyticsStore';
import { Modal } from './Modal';
import './PoolHubPage.css';

type SortMode = 'trending' | 'newest' | 'top' | 'downloads';
type HubMode = 'pools' | 'working-sets';

type UploadFormState = {
  creator: string;
  title: string;
  summary: string;
  description: string;
  tags: string;
  category: string;
  language: string;
  license: string;
  heroImageUrl: string;
  jsonInput: string;
};

type WorkingSetUploadState = {
  creator: string;
  title: string;
  summary: string;
  description: string;
  tags: string;
  category: string;
  language: string;
  license: string;
  heroImageUrl: string;
  jsonInput: string;
};

const OFFICIAL_CREATOR_NAMES = new Set(['morpbase', 'morpbase official']);

const DEFAULT_UPLOAD_STATE: UploadFormState = {
  creator: '',
  title: '',
  summary: '',
  description: '',
  tags: '',
  category: 'Photography',
  language: 'en',
  license: 'CC-BY',
  heroImageUrl: '',
  jsonInput: '',
};

const DEFAULT_WS_UPLOAD_STATE: WorkingSetUploadState = {
  creator: '',
  title: '',
  summary: '',
  description: '',
  tags: '',
  category: 'Concept',
  language: 'en',
  license: 'CC-BY',
  heroImageUrl: '',
  jsonInput: '',
};

const scoreTrending = (entry: { downloads: number; ratingAvg: number; ratingCount: number }) =>
  entry.downloads * 0.7 + entry.ratingAvg * 200 + entry.ratingCount * 2;

const createId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const parsePoolPayload = (raw: string, fallbackName: string): Pool => {
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error('Invalid JSON.');
  }

  const candidate = parsed?.pool ?? parsed;
  if (!candidate || !Array.isArray(candidate.items)) {
    throw new Error('Pool JSON must include an items array.');
  }

  const name = typeof candidate.name === 'string' && candidate.name.trim()
    ? candidate.name.trim()
    : fallbackName.trim();

  if (!name) {
    throw new Error('Pool name is required.');
  }

  const now = Date.now();
  const poolId = createId('hub_pool');
  const items = candidate.items
    .map((item: any, index: number) => {
      if (!item || typeof item.text !== 'string') return null;
      const text = item.text.trim();
      if (!text) return null;
      return {
        id: item.id && typeof item.id === 'string' ? item.id : `${poolId}_item_${index + 1}`,
        text,
        tags: Array.isArray(item.tags) ? item.tags.filter((tag: any) => typeof tag === 'string') : undefined,
      };
    })
    .filter(Boolean) as Pool['items'];

  if (items.length === 0) {
    throw new Error('Pool items cannot be empty.');
  }

  const initiativePhrases = Array.isArray(candidate.initiativePhrases)
    ? candidate.initiativePhrases
        .map((entry: any, index: number) => {
          if (!entry || typeof entry.text !== 'string') return null;
          const text = entry.text.trim();
          if (!text) return null;
          return {
            id: entry.id && typeof entry.id === 'string' ? entry.id : `${poolId}_initiative_${index + 1}`,
            text,
            autoApplyOnActivate: entry.autoApplyOnActivate === true,
          };
        })
        .filter(Boolean) as Pool['initiativePhrases']
    : [];

  const idpSets = Array.isArray(candidate.idpSets)
    ? candidate.idpSets
        .map((set: any, setIndex: number) => {
          const name = typeof set?.name === 'string' ? set.name.trim() : '';
          if (!name) return null;
          const phrases = Array.isArray(set?.phrases)
            ? set.phrases
                .map((entry: any, phraseIndex: number) => {
                  if (!entry || typeof entry.text !== 'string') return null;
                  const text = entry.text.trim();
                  if (!text) return null;
                  return {
                    id: entry.id && typeof entry.id === 'string' ? entry.id : `${poolId}_idp_${setIndex + 1}_${phraseIndex + 1}`,
                    text,
                  };
                })
                .filter(Boolean)
            : [];
          if (phrases.length === 0) return null;
          return {
            id: set.id && typeof set.id === 'string' ? set.id : `${poolId}_set_${setIndex + 1}`,
            name,
            phrases,
          };
        })
        .filter(Boolean) as Pool['idpSets']
    : [];

  return {
    id: poolId,
    name,
    createdAt: typeof candidate.createdAt === 'number' ? candidate.createdAt : now,
    updatedAt: typeof candidate.updatedAt === 'number' ? candidate.updatedAt : now,
    initiativePhrases,
    idpSets,
    items,
  };
};

const parseWorkingSetPayload = (raw: string, fallbackName: string): WorkingSet => {
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error('Invalid JSON.');
  }

  const candidate = parsed?.workingSet ?? parsed;
  if (!candidate || typeof candidate !== 'object') {
    throw new Error('Working Set JSON is invalid.');
  }

  const name = typeof candidate.name === 'string' && candidate.name.trim()
    ? candidate.name.trim()
    : fallbackName.trim();

  if (!name) {
    throw new Error('Working Set name is required.');
  }

  const buckets = candidate.categoryBuckets;
  if (!buckets || typeof buckets !== 'object') {
    throw new Error('Working Set JSON must include categoryBuckets.');
  }

  const now = Date.now();
  const workingSetId = createId('hub_working_set');
  const categoryBuckets: WorkingSet['categoryBuckets'] = {};
  Object.entries(buckets).forEach(([categoryId, items]) => {
    if (!Array.isArray(items)) return;
    categoryBuckets[categoryId] = items
      .map((item: any, index: number) => {
        if (!item || typeof item.text !== 'string') return null;
        const text = item.text.trim();
        if (!text) return null;
        return {
          id: item.id && typeof item.id === 'string' ? item.id : `${workingSetId}_${categoryId}_${index + 1}`,
          poolId: item.poolId && typeof item.poolId === 'string' ? item.poolId : `${workingSetId}_pool_${categoryId}`,
          poolItemId: item.poolItemId && typeof item.poolItemId === 'string' ? item.poolItemId : `${workingSetId}_item_${index + 1}`,
          text,
          addedAt: typeof item.addedAt === 'number' ? item.addedAt : now,
        };
      })
      .filter(Boolean) as WorkingSet['categoryBuckets'][string];
  });

  return {
    id: workingSetId,
    name,
    createdAt: typeof candidate.createdAt === 'number' ? candidate.createdAt : now,
    updatedAt: typeof candidate.updatedAt === 'number' ? candidate.updatedAt : now,
    categoryBuckets,
  };
};

const isOfficialPoolEntry = (entry: { creator?: string; creatorId?: string }) => {
  const creatorName = entry.creator?.trim().toLowerCase() ?? '';
  return entry.creatorId === 'morpbase-official' || OFFICIAL_CREATOR_NAMES.has(creatorName);
};

type PoolHubPageProps = {
  onGoToUserPools?: () => void;
  onGoToProfile?: () => void;
  onOpenCreatorProfile?: (input: { creatorId?: string | null; creatorName?: string | null }) => void;
  isLoggedIn?: boolean;
  onRequestLogin?: () => void;
  userName?: string | null;
  userId?: string | null;
  isPro?: boolean;
  manualUrl?: string;
};

export function PoolHubPage({
  onGoToUserPools,
  onGoToProfile,
  onOpenCreatorProfile,
  isLoggedIn = false,
  onRequestLogin,
  userName,
  userId,
  isPro = false,
  manualUrl,
}: PoolHubPageProps) {
  const canInteract = isLoggedIn && isPro;
  const hubMode: HubMode = 'pools';
  const [entries, setEntries] = useState<PoolHubEntry[]>(() => listHubEntries());
  const [workingSetEntries, setWorkingSetEntries] = useState<WorkingSetHubEntry[]>(() => listWorkingSetHubEntries());
  const [selectedId, setSelectedId] = useState<string>(entries[0]?.id ?? '');
  const [selectedWorkingSetId, setSelectedWorkingSetId] = useState<string>(workingSetEntries[0]?.id ?? '');
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [sortMode, setSortMode] = useState<SortMode>('trending');
  const [minRating, setMinRating] = useState(0);
  const [expandedItemGroups, setExpandedItemGroups] = useState<Record<string, boolean>>({});
  const [addMessage, setAddMessage] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isWorkingSetUploadOpen, setIsWorkingSetUploadOpen] = useState(false);
  const [showMyUploads, setShowMyUploads] = useState(false);
  const [uploadState, setUploadState] = useState<UploadFormState>(DEFAULT_UPLOAD_STATE);
  const [workingSetUploadState, setWorkingSetUploadState] = useState<WorkingSetUploadState>(DEFAULT_WS_UPLOAD_STATE);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<Pool | null>(null);
  const [workingSetUploadPreview, setWorkingSetUploadPreview] = useState<WorkingSet | null>(null);
  const [adminJson, setAdminJson] = useState('');
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [userPools, setUserPools] = useState<Pool[]>([]);
  const [userWorkingSets, setUserWorkingSets] = useState<WorkingSet[]>([]);
  const [selectedUserPoolId, setSelectedUserPoolId] = useState<string>('');
  const [selectedUserWorkingSetId, setSelectedUserWorkingSetId] = useState<string>('');
  const [userRating, setUserRatingState] = useState<number | null>(null);
  const [workingSetUserRating, setWorkingSetUserRatingState] = useState<number | null>(null);
  const [comments, setComments] = useState(() =>
    entries[0]?.id ? listHubComments(entries[0].id) : []
  );
  const [workingSetComments, setWorkingSetComments] = useState(() =>
    workingSetEntries[0]?.id ? listWorkingSetHubComments(workingSetEntries[0].id) : []
  );
  const [creatorStats, setCreatorStats] = useState({ uploads: 0, totalDownloads: 0, avgRating: 0, promptCount: 0, topTags: [] as string[] });
  const [workingSetCreatorStats, setWorkingSetCreatorStats] = useState({ uploads: 0, totalDownloads: 0, avgRating: 0 });
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [commentError, setCommentError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentBody, setEditingCommentBody] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [creatorSearchTerm, setCreatorSearchTerm] = useState('');
  const [publicProfiles, setPublicProfiles] = useState<PublicProfile[]>([]);
  const [myProfile, setMyProfile] = useState<PublicProfile | null>(null);
  const [creatorStatsByUserId, setCreatorStatsByUserId] = useState<Record<string, CreatorStats>>({});
  const [detailActionMessage, setDetailActionMessage] = useState<string | null>(null);

  const refreshUserPools = async () => {
    try {
      const pools = await listPools();
      setUserPools(pools);
      setSelectedUserPoolId(pools[0]?.id ?? '');
    } catch {
      setUserPools([]);
      setSelectedUserPoolId('');
    }
  };

  useEffect(() => {
    let isActive = true;
    const loadProfiles = async () => {
      try {
        const profiles = await listPublicProfiles();
        if (isActive) {
          setPublicProfiles(profiles);
        }
      } catch {
        // keep creator browse usable even if profiles fail
      }
    };
    loadProfiles();
    return () => {
      isActive = false;
    };
  }, [isLoggedIn]);

  useEffect(() => {
    let isActive = true;
    const creatorUserIds = [...new Set(publicProfiles.map(profile => profile.userId).filter(Boolean))];
    if (creatorUserIds.length === 0) {
      setCreatorStatsByUserId({});
      return () => {
        isActive = false;
      };
    }

    const loadCreatorStats = async () => {
      try {
        const stats = await listCreatorStatsByUserIds(creatorUserIds);
        if (!isActive) return;
        setCreatorStatsByUserId(
          stats.reduce<Record<string, CreatorStats>>((acc, item) => {
            acc[item.userId] = item;
            return acc;
          }, {})
        );
      } catch {
        if (isActive) {
          setCreatorStatsByUserId({});
        }
      }
    };

    void loadCreatorStats();
    return () => {
      isActive = false;
    };
  }, [publicProfiles]);

  useEffect(() => {
    let isActive = true;
    if (!isLoggedIn) {
      setMyProfile(null);
      return () => {
        isActive = false;
      };
    }
    const loadMyProfile = async () => {
      try {
        const profile = await getMyPublicProfile();
        if (isActive) {
          setMyProfile(profile);
        }
      } catch {
        // keep hub usable even if own public profile fails
      }
    };
    loadMyProfile();
    return () => {
      isActive = false;
    };
  }, [isLoggedIn]);

  const publicProfileByUserId = useMemo(() => {
    const map = new Map<string, PublicProfile>();
    publicProfiles.forEach(profile => {
      map.set(profile.userId, profile);
    });
    return map;
  }, [publicProfiles]);

  const publicProfileByName = useMemo(() => {
    const map = new Map<string, PublicProfile>();
    publicProfiles.forEach(profile => {
      map.set(profile.displayName.toLowerCase(), profile);
    });
    return map;
  }, [publicProfiles]);

  const resolveCreatorProfile = (entry: { creator?: string; creatorId?: string }) => {
    if (entry.creatorId) {
      return publicProfileByUserId.get(entry.creatorId) ?? null;
    }
    if (entry.creator) {
      return publicProfileByName.get(entry.creator.toLowerCase()) ?? null;
    }
    return null;
  };

  const resolveCreatorName = (entry: { creator?: string; creatorId?: string }) => {
    const profile = resolveCreatorProfile(entry);
    return profile?.displayName ?? entry.creator ?? 'Unknown creator';
  };

  const handleOpenProfileEditor = () => {
    if (!isLoggedIn) {
      setAuthNotice('Log in to create your public profile.');
      onRequestLogin?.();
      return;
    }
    onGoToProfile?.();
  };

  useEffect(() => {
    setSelectedId(entries[0]?.id ?? '');
    refreshUserPools();
    setExpandedItemGroups({});
    setAddMessage(null);
  }, [entries]);

  useEffect(() => {
    const handleOpenHubEntry = (event: Event) => {
      const customEvent = event as CustomEvent<{ entryId?: string }>;
      const entryId = customEvent.detail?.entryId;
      if (!entryId) return;
      const match = entries.find(entry => entry.id === entryId);
      if (!match) return;
      setSelectedId(entryId);
      setIsDetailOpen(true);
    };

    window.addEventListener('morpbase:open-hub-entry', handleOpenHubEntry as EventListener);
    return () => {
      window.removeEventListener('morpbase:open-hub-entry', handleOpenHubEntry as EventListener);
    };
  }, [entries]);

  const categories = useMemo(() => {
    const source = entries;
    return Array.from(new Set(source.map(entry => entry.category))).sort();
  }, [entries]);

  const languages = useMemo(() => {
    const source = entries;
    return Array.from(new Set(source.flatMap(entry => entry.languages))).sort();
  }, [entries]);

  const creatorProfiles = useMemo(() => {
    const source = entries;
    const profiles = new Map<string, {
      id: string;
      name: string;
      userId?: string;
      profile?: PublicProfile | null;
      uploads: number;
      totalDownloads: number;
      avgRating: number;
      promptCount: number;
      entries: typeof source;
      tags: Record<string, number>;
      topTags: string[];
    }>();

    publicProfiles.forEach(profile => {
      if (profile.discoverableInSearch === false) {
        return;
      }
      const id = `id:${profile.userId}`;
      profiles.set(id, {
        id,
        name: profile.displayName,
        userId: profile.userId,
        profile,
        uploads: 0,
        totalDownloads: 0,
        avgRating: 0,
        promptCount: 0,
        entries: [] as typeof source,
        tags: {},
        topTags: [],
      });
    });

    source.forEach(entry => {
      const profile = resolveCreatorProfile(entry);
      if (profile?.discoverableInSearch === false) {
        return;
      }
      const name = profile?.displayName ?? entry.creator;
      if (!name) return;
      const id = entry.creatorId ? `id:${entry.creatorId}` : `name:${name}`;
      const existing = profiles.get(id);
      const next = existing ?? {
        id,
        name,
        userId: entry.creatorId,
        profile,
        uploads: 0,
        totalDownloads: 0,
        avgRating: 0,
        promptCount: 0,
        entries: [] as typeof source,
        tags: {},
        topTags: [],
      };
      next.entries.push(entry);
      entry.tags.forEach(tag => {
        next.tags[tag] = (next.tags[tag] ?? 0) + 1;
      });
      const summary = mergeCreatorSummaryWithStats(
        getCreatorSummaryFromPoolEntries(next.entries, next.promptCount),
        next.userId ? creatorStatsByUserId[next.userId] : null
      );
      next.uploads = summary.uploads;
      next.totalDownloads = summary.totalDownloads;
      next.avgRating = summary.avgRating;
      next.promptCount = summary.promptCount;
      next.topTags = summary.topTags;
      profiles.set(id, next);
    });

    return Array.from(profiles.values()).sort((a, b) => {
      if (b.uploads !== a.uploads) return b.uploads - a.uploads;
      return a.name.localeCompare(b.name);
    });
  }, [entries, publicProfiles, publicProfileByUserId, publicProfileByName, creatorStatsByUserId]);

  const filteredCreators = useMemo(() => {
    const term = creatorSearchTerm.trim().toLowerCase();
    if (!term) return creatorProfiles;
    return creatorProfiles.filter(profile => {
      if (profile.name.toLowerCase().includes(term)) return true;
      const bio = profile.profile?.bio?.toLowerCase() ?? '';
      if (bio.includes(term)) return true;
      const tags = profile.profile?.tags ?? [];
      return tags.some(tag => tag.toLowerCase().includes(term));
    });
  }, [creatorProfiles, creatorSearchTerm]);

  const openCreatorProfile = (creatorId: string) => {
    const target = creatorProfiles.find(profile => profile.id === creatorId) ?? null;
    if (!target || !onOpenCreatorProfile) return;
    onOpenCreatorProfile({
      creatorId: target.userId ?? null,
      creatorName: target.name,
    });
  };

  const openCreatorProfileFromEntry = (entry: { creator?: string; creatorId?: string }) => {
    const profile = resolveCreatorProfile(entry);
    const creatorName = profile?.displayName ?? entry.creator ?? null;
    if (!creatorName && !entry.creatorId) return;
    if (!onOpenCreatorProfile) return;
    onOpenCreatorProfile({
      creatorId: entry.creatorId ?? null,
      creatorName,
    });
  };

  const filteredEntries = useMemo(() => {
    const activeEntries = entries;
    const term = searchTerm.trim().toLowerCase();
    const tagTerm = tagFilter.trim().toLowerCase();
    const tagParts = tagTerm
      ? tagTerm.split(',').map(part => part.trim()).filter(Boolean)
      : [];

    const filtered = activeEntries.filter(entry => {
      const matchesTerm = term
        ? [entry.title, entry.summary, entry.description, entry.tags.join(' ')]
            .join(' ')
            .toLowerCase()
            .includes(term)
        : true;
      const matchesTag = tagParts.length > 0
        ? tagParts.every(part => entry.tags.some(tag => tag.toLowerCase().includes(part)))
        : true;
      const matchesCategory = categoryFilter === 'all' || entry.category === categoryFilter;
      const matchesLanguage =
        languageFilter === 'all' || entry.languages.includes(languageFilter);
      const matchesRating = entry.ratingAvg >= minRating;
      const matchesOwnership = !showMyUploads || (Boolean(userId)
        ? entry.creatorId === userId
        : Boolean(userName) && entry.creator === userName);
      return (
        matchesTerm &&
        matchesTag &&
        matchesCategory &&
        matchesLanguage &&
        matchesRating &&
        matchesOwnership
      );
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sortMode === 'newest') return b.updatedAt - a.updatedAt;
      if (sortMode === 'top') {
        if (b.ratingAvg !== a.ratingAvg) return b.ratingAvg - a.ratingAvg;
        return b.ratingCount - a.ratingCount;
      }
      if (sortMode === 'downloads') return b.downloads - a.downloads;
      return scoreTrending(b) - scoreTrending(a);
    });

    return sorted;
  }, [entries, searchTerm, tagFilter, categoryFilter, languageFilter, sortMode, showMyUploads, userName, userId, minRating]);

  const officialPoolEntries = useMemo(() => {
    return filteredEntries.filter(entry => isOfficialPoolEntry(entry));
  }, [filteredEntries]);

  const communityPoolEntries = useMemo(() => {
    return filteredEntries.filter(entry => !isOfficialPoolEntry(entry));
  }, [filteredEntries]);

  const selectedEntry = useMemo(() => {
    const match = filteredEntries.find(entry => entry.id === selectedId);
    if (match) return match;
    return filteredEntries[0] ?? null;
  }, [filteredEntries, selectedId]);

  useEffect(() => {
    if (!selectedEntry) {
      setUserRatingState(null);
      setComments([]);
      setCreatorStats(getCreatorSummaryFromPoolEntries([]));
      return;
    }
    if (userId) {
      setUserRatingState(getUserRating(selectedEntry.id, userId));
    } else {
      setUserRatingState(null);
    }
    setComments(listHubComments(selectedEntry.id));
    if (selectedEntry.creator) {
      const creatorEntries = entries.filter(entry =>
        entry.creatorId ? entry.creatorId === selectedEntry.creatorId : entry.creator === selectedEntry.creator
      );
      setCreatorStats(
        mergeCreatorSummaryWithStats(
          getCreatorSummaryFromPoolEntries(creatorEntries),
          selectedEntry.creatorId ? creatorStatsByUserId[selectedEntry.creatorId] : null
        )
      );
    } else {
      setCreatorStats(getCreatorSummaryFromPoolEntries([]));
    }
    setCommentError(null);
    setCommentBody('');
    setDetailActionMessage(null);
  }, [selectedEntry?.id, selectedEntry?.creatorId, userId, entries, creatorStatsByUserId]);

  const handleAddToActive = async () => {
    if (!isLoggedIn) {
      setAuthNotice('Log in to add pools to User Pools.');
      onRequestLogin?.();
      return;
    }
    if (!isPro) {
      setAuthNotice('Upgrade to Pro to add Hub content.');
      return;
    }
    if (!selectedEntry) return;
    const confirmed = window.confirm('Add this pool to User Pools? Existing pools with the same name will merge.');
    if (!confirmed) return;
    await importPoolPayload({ version: 1, pool: selectedEntry.payload as Pool }, 'merge');
    setAddMessage('Added to User Pools (merged).');
    setDetailActionMessage('Added to User Pools.');
    refreshUserPools();
  };

  const handleRate = (rating: number) => {
    if (!isLoggedIn) {
      setAuthNotice('Log in to rate pools.');
      onRequestLogin?.();
      return;
    }
    if (!isPro) {
      setAuthNotice('Upgrade to Pro to rate Hub content.');
      return;
    }
    if (!selectedEntry) return;
    if (!userId) return;
    const next = setUserRating(selectedEntry.id, userId, rating);
    setEntries(next);
    setUserRatingState(rating);
  };

  const handleAddComment = () => {
    if (!isLoggedIn) {
      setAuthNotice('Log in to comment.');
      onRequestLogin?.();
      return;
    }
    if (!isPro) {
      setAuthNotice('Upgrade to Pro to comment.');
      return;
    }
    if (!selectedEntry) return;
    const trimmed = commentBody.trim();
    if (!trimmed) {
      setCommentError('Comment cannot be empty.');
      return;
    }
    const authorLabel = commentAuthor.trim() || userName || 'Anonymous';
    addHubComment(selectedEntry.id, authorLabel, trimmed, userId ?? undefined);
    setComments(listHubComments(selectedEntry.id));
    setCommentBody('');
    setCommentError(null);
  };

  const handleEditComment = (commentId: string, body: string) => {
    if (!userId) return;
    updateHubComment(commentId, userId, body);
    setComments(listHubComments(selectedEntry?.id ?? ''));
    setEditingCommentId(null);
    setEditingCommentBody('');
  };

  const handleDeleteComment = (commentId: string) => {
    if (!userId) return;
    deleteHubComment(commentId, userId);
    setComments(listHubComments(selectedEntry?.id ?? ''));
  };

  const handleReport = () => {
    if (!selectedEntry) return;
    const reason = reportReason.trim() || 'Report';
    flagHubEntry(selectedEntry.id, reason);
    setReportReason('');
  };

  const handleDeletePool = () => {
    if (!selectedEntry || !userId) return;
    if (selectedEntry.creatorId !== userId) return;
    const confirmed = window.confirm('Delete this pool from the Hub? This cannot be undone.');
    if (!confirmed) return;
    const next = removeHubEntry(selectedEntry.id);
    setEntries(next);
    setSelectedId(next[0]?.id ?? '');
    setIsDetailOpen(false);
    setAddMessage('Pool removed from Hub.');
  };

  const handleExportHub = () => {
    try {
      const payload = exportHubStore();
      setAdminJson(JSON.stringify(payload, null, 2));
      setAdminMessage('Exported Hub data.');
      setAdminError(null);
    } catch (err: any) {
      setAdminError(err?.message ?? 'Failed to export Hub data.');
    }
  };

  const handleImportHub = () => {
    try {
      const parsed = JSON.parse(adminJson);
      importHubStore(parsed);
      setEntries(listHubEntries());
      setAdminMessage('Imported Hub data.');
      setAdminError(null);
    } catch (err: any) {
      setAdminError(err?.message ?? 'Failed to import Hub data.');
    }
  };

  const handleResetHub = () => {
    const confirmed = window.confirm('Reset Hub data to defaults? This will erase local Hub edits.');
    if (!confirmed) return;
    const next = resetHubStore();
    setEntries(next);
    setAdminMessage('Hub data reset.');
    setAdminError(null);
  };

  const handleDownloadPool = () => {
    if (!selectedEntry) return;
    const payload = { version: 1, pool: selectedEntry.payload };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = selectedEntry.title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    link.download = `${safeName || 'pool'}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setDetailActionMessage('Pool JSON downloaded.');
  };

  const handleUpload = () => {
    setUploadError(null);
    setUploadSuccess(null);
    try {
      const pool = parsePoolPayload(uploadState.jsonInput, uploadState.title);
      if (!uploadState.title.trim()) {
        throw new Error('Title is required.');
      }
      const trimmedTitle = uploadState.title.trim() || pool.name;
      const existing = entries.some(entry => entry.title.toLowerCase() === trimmedTitle.toLowerCase());
      if (existing) {
        throw new Error('A pool with this title already exists.');
      }
      const now = Date.now();
      const creatorName = myProfile?.displayName?.trim()
        || uploadState.creator.trim()
        || userName
        || '';
      if (!creatorName) {
        throw new Error('Creator name is required. Create a public profile or enter a creator name.');
      }
      const entry: PoolHubEntry = {
        id: createId('hub_entry'),
        creator: creatorName,
        creatorId: userId || undefined,
        title: trimmedTitle,
        summary: uploadState.summary.trim() || 'New community pool upload.',
        description: uploadState.description.trim() || 'No description provided.',
        tags: uploadState.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean),
        category: uploadState.category || 'General',
        languages: [uploadState.language || 'en'],
        license: uploadState.license || 'CC-BY',
        heroImageUrl: uploadState.heroImageUrl.trim() || null,
        ratingAvg: 0,
        ratingCount: 0,
        downloads: 0,
        createdAt: now,
        updatedAt: now,
        payload: pool,
      };

      const next = addHubEntry(entry);
      setEntries(next);
      setSelectedId(entry.id);
      setIsDetailOpen(true);
      setUploadSuccess('Pool uploaded to the Hub (saved locally).');
      setUploadState(DEFAULT_UPLOAD_STATE);
      setUploadPreview(null);
      setIsUploadOpen(false);
    } catch (err: any) {
      setUploadError(err?.message ?? 'Failed to upload pool.');
    }
  };

  const handleUploadFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setUploadState(prev => ({ ...prev, jsonInput: result }));
      try {
        const previewPool = parsePoolPayload(result, uploadState.title);
        setUploadPreview(previewPool);
      } catch {
        setUploadPreview(null);
      }
    };
    reader.readAsText(file);
  };

  const handleImportFromUserPools = async () => {
    setUploadError(null);
    if (!selectedUserPoolId) {
      setUploadError('Select a User Pool first.');
      return;
    }
    try {
      const payload = await exportPoolPayload(selectedUserPoolId);
      const poolName = payload.pool.name;
      setUploadState(prev => ({
        ...prev,
        title: prev.title.trim() ? prev.title : poolName,
        summary: prev.summary.trim() ? prev.summary : 'Imported from User Pools.',
        jsonInput: JSON.stringify(payload, null, 2),
      }));
      setUploadPreview(payload.pool);
    } catch (err: any) {
      setUploadError(err?.message ?? 'Failed to import from User Pools.');
    }
  };

  const visibleItems = useMemo(() => {
    if (!selectedEntry) return [];
    const items = (selectedEntry.payload as Pool).items;
    return items.slice(0, 8);
  }, [selectedEntry]);

  const selectedPoolItems = useMemo(() => {
    if (!selectedEntry) return [];
    return (selectedEntry.payload as Pool).items;
  }, [selectedEntry]);

  const selectedPoolSections = useMemo(() => {
    const grouped = new Map<string, Pool['items']>();
    selectedPoolItems.forEach(item => {
      const key = item.section?.trim() || 'Unsectioned';
      grouped.set(key, [...(grouped.get(key) ?? []), item]);
    });
    return [...grouped.entries()];
  }, [selectedPoolItems]);

  const selectedPoolSectionCount = useMemo(() => {
    return selectedPoolSections.some(([section]) => section !== 'Unsectioned')
      ? selectedPoolSections.length
      : 0;
  }, [selectedPoolSections]);

  const selectedCreatorProfile = useMemo(() => {
    if (!selectedEntry) return null;
    return resolveCreatorProfile(selectedEntry);
  }, [selectedEntry, publicProfileByName, publicProfileByUserId]);

  const detailStatusChips = useMemo(() => {
    if (!selectedEntry) return [];
    const chips = [
      isOfficialPoolEntry(selectedEntry) ? 'MorpBase' : 'Community',
      selectedEntry.category,
      ...selectedEntry.languages.map(language => language.toUpperCase()),
    ];
    if (selectedPoolSectionCount > 0) {
      chips.push('Sectioned');
    }
    return chips;
  }, [selectedEntry, selectedPoolSectionCount]);

  const detailStatChips = useMemo(() => {
    if (!selectedEntry) return [];
    return [
      `${selectedEntry.downloads} downloads`,
      `${selectedEntry.ratingAvg.toFixed(1)} rating`,
      `${selectedPoolItems.length} items`,
      selectedPoolSectionCount > 0 ? `${selectedPoolSectionCount} sections` : null,
    ].filter(Boolean) as string[];
  }, [selectedEntry, selectedPoolItems.length, selectedPoolSectionCount]);

  const detailInfoRows = useMemo(() => {
    if (!selectedEntry) return [];
    return [
      ['Type', 'Pool'],
      ['Category', selectedEntry.category],
      ['Language', selectedEntry.languages.join(', ').toUpperCase()],
      ['License', selectedEntry.license],
      ['Published', new Date(selectedEntry.createdAt).toLocaleDateString()],
      ['Updated', new Date(selectedEntry.updatedAt).toLocaleDateString()],
    ] as Array<[string, string]>;
  }, [selectedEntry]);

  const detailStructureRows = useMemo(() => {
    if (!selectedEntry) return [];
    return [
      ['Items', String(selectedPoolItems.length)],
      ['Sections', selectedPoolSectionCount > 0 ? String(selectedPoolSectionCount) : 'Flat pool'],
      [
        'Layout',
        selectedPoolSectionCount > 0
          ? selectedPoolSections
              .map(([section]) => section)
              .slice(0, 5)
              .join(', ')
          : 'Unsectioned',
      ],
      ['Creator', resolveCreatorName(selectedEntry)],
    ] as Array<[string, string]>;
  }, [selectedEntry, selectedPoolItems.length, selectedPoolSectionCount, selectedPoolSections]);

  const previewSections = useMemo(() => {
    if (selectedPoolSectionCount > 0) {
      return selectedPoolSections.slice(0, 3).map(([section, items]) => ({
        label: section,
        items: items.slice(0, 3).map(item => item.text),
      }));
    }

    return [{
      label: 'Highlights',
      items: selectedPoolItems.slice(0, 5).map(item => item.text),
    }];
  }, [selectedPoolItems, selectedPoolSectionCount, selectedPoolSections]);

  const isItemGroupExpanded = (groupKey: string) => expandedItemGroups[groupKey] === true;

  const toggleItemGroupExpanded = (groupKey: string) => {
    setExpandedItemGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const creatorDisplayName = myProfile?.displayName ?? userName ?? '';

  const renderHubCard = (entry: PoolHubEntry) => (
    (() => {
      const entryItems = (entry.payload as Pool).items;
      const sectionNames = [...new Set(entryItems.map(item => item.section?.trim()).filter(Boolean))];
      const heroStyle = entry.heroImageUrl
        ? { backgroundImage: `linear-gradient(180deg, rgba(10, 12, 20, 0.08), rgba(10, 12, 20, 0.5)), url(${entry.heroImageUrl})` }
        : undefined;

      return (
        <button
          key={entry.id}
          type="button"
          className={`pool-hub-card ${entry.id === selectedEntry?.id ? 'active' : ''}`}
          onClick={() => {
            setSelectedId(entry.id);
            setIsDetailOpen(true);
            setAddMessage(null);
            setExpandedItemGroups({});
            void trackAnalyticsEvent({
              eventType: 'pool_open',
              pageKey: 'pool-hub',
              userId: userId ?? null,
              metadata: {
                entryId: entry.id,
                title: entry.title,
                creatorId: entry.creatorId ?? null,
                creatorName: resolveCreatorName(entry),
                official: isOfficialPoolEntry(entry),
                category: entry.category,
                itemCount: entryItems.length,
                sectionCount: sectionNames.length,
              },
            });
          }}
        >
          <div className="pool-hub-card-hero" style={heroStyle}>
            <div className="pool-hub-card-hero-top">
              <div className="pool-hub-card-badges">
                <span className={`pool-hub-card-badge ${isOfficialPoolEntry(entry) ? 'pool-hub-card-badge-official' : ''}`}>
                  {isOfficialPoolEntry(entry) ? 'MorpBase' : 'Community'}
                </span>
                {sectionNames.length > 0 && (
                  <span className="pool-hub-card-badge">{sectionNames.length} sections</span>
                )}
              </div>
              <div className="pool-hub-card-stat">{entry.downloads} dl</div>
            </div>
            <div className="pool-hub-card-hero-bottom">
              <div className="pool-hub-card-hero-title">{entry.title}</div>
              <div className="pool-hub-card-hero-meta">
                <span>{entry.ratingAvg.toFixed(1)} rating</span>
                <span>{entryItems.length} items</span>
              </div>
            </div>
          </div>
          <div className="pool-hub-card-body">
            <div className="pool-hub-card-summary">{entry.summary}</div>
            {(entry.creator || entry.creatorId) && (
              <div className="pool-hub-card-creator">
                <button
                  type="button"
                  className="pool-hub-link-button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openCreatorProfileFromEntry(entry);
                  }}
                >
                  by {resolveCreatorName(entry)}
                </button>
                {((userId && entry.creatorId === userId) || (!userId && userName && entry.creator === userName)) && (
                  <span className="pool-hub-owner-badge">Your upload</span>
                )}
              </div>
            )}
            <div className="pool-hub-card-meta">
              <span>{entry.category}</span>
              <span>{entry.languages.join(', ').toUpperCase()}</span>
              <span>{entry.license}</span>
            </div>
            <div className="pool-hub-card-tags">
              {(sectionNames.length > 0 ? sectionNames : entry.tags).slice(0, 4).map(tag => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </button>
      );
    })()
  );

  const detailComments = comments;
  const hubOverviewStats = useMemo(() => ([
    { label: 'Official Pools', value: officialPoolEntries.length },
    { label: 'Community Pools', value: communityPoolEntries.length },
    { label: 'Visible Creators', value: creatorProfiles.length },
  ]), [officialPoolEntries.length, communityPoolEntries.length, creatorProfiles.length]);

  return (
    <div className="pool-hub-page">
      <div className="pool-hub-top">
        <header className="pool-hub-header">
          <div className="pool-hub-hero">
            <div className="pool-hub-hero-main">
              <div className="pool-hub-mode-label">Pool Library</div>
              <div>
                <h2>Pool Hub</h2>
                <p>Discover curated MorpBase libraries and community-made downloads in one place.</p>
              </div>
              <div className="pool-hub-hero-stats">
                {hubOverviewStats.map(stat => (
                  <div key={stat.label} className="pool-hub-hero-stat">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
              <div className="pool-hub-hero-badges">
                {isLoggedIn && userName ? (
                  <div className="pool-hub-user-badge">Logged in as {userName}</div>
                ) : (
                  <div className="pool-hub-user-badge">Browse mode</div>
                )}
                <div className="pool-hub-user-badge pool-hub-preview-badge">Preview</div>
                {isLoggedIn && !isPro && (
                  <div className="pool-hub-user-badge">Upgrade to Pro to upload, rate, or comment</div>
                )}
              </div>
            </div>
            <div className="pool-hub-hero-side">
              {manualUrl && (
                <a
                  className="pool-hub-manual-link"
                  href={`${manualUrl}#pool-hub`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Community manual
                </a>
              )}
              <button
                type="button"
                className="pool-hub-primary"
                onClick={() => {
                  if (!isLoggedIn) {
                    setAuthNotice('Log in to upload pools.');
                    onRequestLogin?.();
                    return;
                  }
                  if (!isPro) {
                    setAuthNotice('Upgrade to Pro to upload Hub content.');
                    return;
                  }
                  setUploadError(null);
                  setUploadSuccess(null);
                  setUploadState({
                    ...DEFAULT_UPLOAD_STATE,
                    creator: creatorDisplayName,
                  });
                  setIsUploadOpen(true);
                }}
                disabled={!canInteract}
              >
                Upload Pool
              </button>
            </div>
          </div>
        </header>

        {authNotice && <div className="pool-hub-auth-notice">{authNotice}</div>}
        {uploadSuccess && <div className="pool-hub-message">{uploadSuccess}</div>}

        <div className="pool-hub-toolbar-card">
          <div className="pool-hub-toolbar-header">
            <div>
              <div className="pool-hub-section-title">Browse and filter</div>
              <div className="pool-hub-muted">Search by theme, creator language, rating, category, and upload ownership.</div>
            </div>
            <div className="pool-hub-toolbar-summary">
              <span>{filteredEntries.length} results</span>
              <span>{sortMode === 'downloads' ? 'Sorted by downloads' : sortMode === 'top' ? 'Sorted by rating' : sortMode === 'newest' ? 'Sorted by newest' : 'Sorted by trending'}</span>
            </div>
          </div>
          <div className="pool-hub-toolbar">
            <input
              type="text"
              placeholder="Search pools"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
            />
            <input
              type="text"
              placeholder="Filter by tag"
              value={tagFilter}
              onChange={event => setTagFilter(event.target.value)}
            />
            <select
              value={categoryFilter}
              onChange={event => setCategoryFilter(event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={languageFilter}
              onChange={event => setLanguageFilter(event.target.value)}
            >
              <option value="all">All languages</option>
              {languages.map(language => (
                <option key={language} value={language}>
                  {language.toUpperCase()}
                </option>
              ))}
            </select>
            <select value={sortMode} onChange={event => setSortMode(event.target.value as SortMode)}>
              <option value="trending">Trending</option>
              <option value="newest">Newest</option>
              <option value="top">Top Rated</option>
              <option value="downloads">Most Downloads</option>
            </select>
            <label className="pool-hub-range">
              <span>Min rating</span>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={minRating}
                onChange={event => setMinRating(parseFloat(event.target.value))}
              />
              <span>{minRating.toFixed(1)}</span>
            </label>
            <label className="pool-hub-toggle">
              <input
                type="checkbox"
                checked={showMyUploads}
                onChange={event => setShowMyUploads(event.target.checked)}
                disabled={!userName}
              />
              My uploads
            </label>
          </div>
        </div>

        <div className="pool-hub-support-grid">
          <div className="pool-hub-profile-panel">
            <div className="pool-hub-profile-info">
              <div className="pool-hub-profile-title">Public creator profile</div>
              <div className="pool-hub-profile-subtitle">Identity and visibility</div>
              <div className="pool-hub-profile-hint">
                Your public profile can appear in creator search even before you publish anything, unless you disable discovery in My Profile.
              </div>
              {isLoggedIn && myProfile && (
                <div className="pool-hub-profile-hint">
                  {myProfile.showPublicPools
                    ? 'Pool uploads are currently visible on your public creator page.'
                    : 'Pool uploads are currently hidden from your public creator page until you enable Show public pools in My Profile.'}
                </div>
              )}
            </div>
            <div className="pool-hub-profile-actions">
              {isLoggedIn ? (
                <>
                  <div className="pool-hub-profile-name">
                    {myProfile?.displayName ?? userName ?? 'Unnamed'}
                  </div>
                  <button
                    type="button"
                    className="pool-hub-secondary"
                    onClick={handleOpenProfileEditor}
                  >
                    Edit profile
                  </button>
                </>
              ) : (
                <>
                  <div className="pool-hub-profile-name">Log in to create a profile</div>
                  <button type="button" className="pool-hub-secondary" onClick={onRequestLogin}>
                    Log in
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="pool-hub-creator-search">
            <div className="pool-hub-creator-search-head">
              <div>
                <div className="pool-hub-profile-title">Creator search</div>
                <div className="pool-hub-profile-subtitle">Find public MorpBase creators</div>
              </div>
              {creatorSearchTerm.trim() && (
                <div className="pool-hub-muted">{filteredCreators.length} matches</div>
              )}
            </div>
            <label>
              Search users
              <input
                type="text"
                placeholder="User or creator name"
                value={creatorSearchTerm}
                onChange={event => setCreatorSearchTerm(event.target.value)}
              />
            </label>
            {creatorSearchTerm.trim() && (
              <div className="pool-hub-creator-results">
                {filteredCreators.length === 0 ? (
                  <div className="pool-hub-empty">No users match that search.</div>
                ) : (
                  filteredCreators.slice(0, 8).map(profile => (
                    <button
                      key={profile.id}
                      type="button"
                      className="pool-hub-creator-result"
                      onClick={() => openCreatorProfile(profile.id)}
                    >
                      <div className="pool-hub-creator-result-top">
                        <span className="pool-hub-creator-result-name">
                          {profile.profile?.avatarUrl ? (
                            <img
                              src={profile.profile.avatarUrl}
                              alt={profile.name}
                              className="pool-hub-creator-avatar"
                            />
                          ) : (
                            <span className="pool-hub-creator-avatar-fallback">
                              {profile.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span className="pool-hub-creator-result-identity">
                            <span className="pool-hub-creator-result-title">{profile.name}</span>
                            <span className="pool-hub-creator-result-subtitle">Public creator</span>
                          </span>
                        </span>
                        <span className="pool-hub-creator-result-count">{profile.uploads} uploads</span>
                      </div>
                      {profile.profile?.bio && (
                        <div className="pool-hub-creator-result-bio">
                          {profile.profile.bio}
                        </div>
                      )}
                      <div className="pool-hub-creator-result-meta">
                        <span>{profile.totalDownloads} downloads</span>
                        <span>{profile.avgRating.toFixed(1)} avg rating</span>
                      </div>
                      {((profile.profile?.tags && profile.profile.tags.length > 0
                        ? profile.profile.tags
                        : Object.entries(profile.tags)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 3)
                          .map(([tag]) => tag)
                      ).length > 0) && (
                        <div className="pool-hub-creator-result-tags">
                          {(profile.profile?.tags && profile.profile.tags.length > 0
                            ? profile.profile.tags
                            : Object.entries(profile.tags)
                              .sort((a, b) => b[1] - a[1])
                              .slice(0, 3)
                              .map(([tag]) => tag)
                          ).slice(0, 3).map(tag => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pool-hub-layout">
        <section className="pool-hub-panel pool-hub-panel-grid">
          {filteredEntries.length === 0 ? (
            <div className="pool-hub-empty">
              {showMyUploads
                ? `No uploads yet. Upload a ${hubMode === 'working-sets' ? 'working set' : 'pool'} to see it here.`
                : `No ${hubMode === 'working-sets' ? 'working sets' : 'pools'} match your filters.`}
            </div>
          ) : hubMode === 'pools' ? (
            <div className="pool-hub-source-sections">
              <div className="pool-hub-source-section">
                <div className="pool-hub-source-section-header">
                  <div>
                    <div className="pool-hub-section-title">MorpBase Pools</div>
                    <div className="pool-hub-muted">Official curated pools provided by MorpBase.</div>
                  </div>
                  <span className="pool-hub-source-count">{officialPoolEntries.length}</span>
                </div>
                {officialPoolEntries.length === 0 ? (
                  <div className="pool-hub-empty pool-hub-source-empty">
                    No official MorpBase pools are published here yet.
                  </div>
                ) : (
                  <div className="pool-hub-grid">
                    {officialPoolEntries.map(entry => renderHubCard(entry))}
                  </div>
                )}
              </div>

              <div className="pool-hub-source-section">
                <div className="pool-hub-source-section-header">
                  <div>
                    <div className="pool-hub-section-title">Community Pools</div>
                    <div className="pool-hub-muted">Downloadable pools uploaded by MorpBase users.</div>
                  </div>
                  <span className="pool-hub-source-count">{communityPoolEntries.length}</span>
                </div>
                {communityPoolEntries.length === 0 ? (
                  <div className="pool-hub-empty pool-hub-source-empty">
                    No community pools match your current filters.
                  </div>
                ) : (
                  <div className="pool-hub-grid">
                    {communityPoolEntries.map(entry => renderHubCard(entry))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="pool-hub-grid">
              {filteredEntries.map(entry => renderHubCard(entry))}
            </div>
          )}
        </section>

        {false && (
        <aside className="pool-hub-panel pool-hub-panel-detail">
          {!selectedEntry ? (
            <div className="pool-hub-empty">
              Select a {hubMode === 'working-sets' ? 'working set' : 'pool'} to view details.
            </div>
          ) : (
            <>
              <div className="pool-hub-detail-hero">
                <div>
                  <div className="pool-hub-detail-title">{selectedEntry.title}</div>
                  <div className="pool-hub-detail-summary">{selectedEntry.summary}</div>
                </div>
                <div className="pool-hub-detail-actions">
                  <button
                    type="button"
                    className="pool-hub-primary"
                    onClick={handleAddToActive}
                    disabled={!canInteract}
                    title={canInteract ? 'Add to your library' : 'Upgrade to Pro to add'}
                  >
                    Add to Active
                  </button>
                  <button type="button" className="pool-hub-secondary" onClick={handleDownloadPool}>
                    Download JSON
                  </button>
                  {hubMode === 'pools' && onGoToUserPools && (
                    <button type="button" className="pool-hub-secondary" onClick={onGoToUserPools}>
                      View in User Pools
                    </button>
                  )}
                  {userId && selectedEntry.creatorId === userId && (
                    <button type="button" className="pool-hub-danger" onClick={handleDeletePool}>
                      Delete from Hub
                    </button>
                  )}
                </div>
              </div>
              {addMessage && (
                <div className="pool-hub-message">
                  <span>{addMessage}</span>
                  {hubMode === 'pools' && onGoToUserPools && (
                    <button
                      type="button"
                      className="pool-hub-message-link"
                      onClick={onGoToUserPools}
                    >
                      Open User Pools
                    </button>
                  )}
                </div>
              )}
              <div className="pool-hub-detail-meta">
                {(selectedEntry.creator || selectedEntry.creatorId) && (
                  <button
                    type="button"
                    className="pool-hub-link-button"
                    onClick={() => {
                      openCreatorProfileFromEntry(selectedEntry);
                    }}
                  >
                    By {resolveCreatorName(selectedEntry)}
                  </button>
                )}
                {((userId && selectedEntry.creatorId === userId) || (!userId && userName && selectedEntry.creator === userName)) && (
                  <span className="pool-hub-owner-badge">Your upload</span>
                )}
                <span>{selectedEntry.category}</span>
                <span>{selectedEntry.languages.join(', ').toUpperCase()}</span>
                <span>{selectedEntry.license}</span>
                <span>{selectedEntry.ratingAvg.toFixed(1)} ({selectedEntry.ratingCount})</span>
              </div>
              <p className="pool-hub-detail-description">{selectedEntry.description}</p>
              {(selectedEntry.creator || selectedEntry.creatorId) && (
                <div className="pool-hub-creator-card">
                  <div className="pool-hub-creator-title">{resolveCreatorName(selectedEntry)}</div>
                  <div className="pool-hub-creator-meta">
                    <span>{(hubMode === 'working-sets' ? workingSetCreatorStats : creatorStats).uploads} uploads</span>
                    <span>{(hubMode === 'working-sets' ? workingSetCreatorStats : creatorStats).totalDownloads} downloads</span>
                    <span>Avg {(hubMode === 'working-sets' ? workingSetCreatorStats : creatorStats).avgRating.toFixed(1)} rating</span>
                  </div>
                </div>
              )}
              <div className="pool-hub-detail-split">
                <div className="pool-hub-version-card">
                  <div className="pool-hub-section-title">Version & Changelog</div>
                  <div className="pool-hub-muted">v1.0.0 • Initial release</div>
                  <div className="pool-hub-muted">Next: add variants and prompt sets.</div>
                </div>
                <div className="pool-hub-report-card">
                  <div className="pool-hub-section-title">Report</div>
                  <div className="pool-hub-muted">
                    See something off? Flag this {hubMode === 'working-sets' ? 'working set' : 'pool'}.
                  </div>
                  <input
                    type="text"
                    value={reportReason}
                    onChange={event => setReportReason(event.target.value)}
                    placeholder="Reason (optional)"
                  />
                  <button type="button" className="pool-hub-secondary" onClick={handleReport}>
                    {hubMode === 'working-sets' ? 'Report working set' : 'Report pool'}
                  </button>
                </div>
              </div>
              <div className="pool-hub-rating">
                <div className="pool-hub-rating-label">Your rating</div>
                <div className="pool-hub-rating-stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className={`pool-hub-star ${
                        (hubMode === 'working-sets' ? workingSetUserRating : userRating) &&
                        (hubMode === 'working-sets' ? workingSetUserRating : userRating)! >= star
                          ? 'active'
                          : ''
                      }`}
                      onClick={() => handleRate(star)}
                      disabled={!canInteract}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="pool-hub-rating-meta">
                  Avg {selectedEntry.ratingAvg.toFixed(1)} ({selectedEntry.ratingCount})
                </div>
              </div>
              <div className="pool-hub-comments">
                <div className="pool-hub-comments-header">
                  Comments ({hubMode === 'working-sets' ? workingSetComments.length : comments.length})
                </div>
                <div className="pool-hub-comments-form">
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={commentAuthor}
                    onChange={event => setCommentAuthor(event.target.value)}
                    disabled={!canInteract}
                  />
                  <textarea
                    rows={3}
                    placeholder="Write a comment"
                    value={commentBody}
                    onChange={event => setCommentBody(event.target.value)}
                    disabled={!canInteract}
                  />
                  {commentError && <div className="pool-hub-error">{commentError}</div>}
                  <div className="pool-hub-comments-actions">
                    <button type="button" className="pool-hub-secondary" onClick={() => {
                      setCommentBody('');
                      setCommentError(null);
                    }} disabled={!canInteract}>
                      Clear
                    </button>
                    <button
                      type="button"
                      className="pool-hub-primary"
                      onClick={handleAddComment}
                      disabled={!canInteract}
                    >
                      Post Comment
                    </button>
                  </div>
                  {!isLoggedIn && (
                    <div className="pool-hub-auth-hint">
                      Log in to post comments and ratings.
                    </div>
                  )}
                  {isLoggedIn && !isPro && (
                    <div className="pool-hub-auth-hint">
                      Upgrade to Pro to post comments and ratings.
                    </div>
                  )}
                </div>
                <div className="pool-hub-comments-list">
                  {(hubMode === 'working-sets' ? workingSetComments : comments).length === 0 ? (
                    <div className="pool-hub-empty">No comments yet.</div>
                  ) : (
                    (hubMode === 'working-sets' ? workingSetComments : comments).map(comment => (
                      <div key={comment.id} className="pool-hub-comment">
                        <div className="pool-hub-comment-head">
                          <span className="pool-hub-comment-author">
                            {comment.authorId && comment.authorId === userId ? 'You' : comment.author}
                          </span>
                          <span className="pool-hub-comment-date">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {editingCommentId === comment.id ? (
                          <>
                            <textarea
                              rows={3}
                              value={editingCommentBody}
                              onChange={event => setEditingCommentBody(event.target.value)}
                            />
                            <div className="pool-hub-comments-actions">
                              <button
                                type="button"
                                className="pool-hub-secondary"
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditingCommentBody('');
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="pool-hub-primary"
                                onClick={() => handleEditComment(comment.id, editingCommentBody)}
                              >
                                Save
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="pool-hub-comment-body">{comment.body}</div>
                        )}
                        {comment.authorId && comment.authorId === userId && editingCommentId !== comment.id && (
                          <div className="pool-hub-comments-actions">
                            <button
                              type="button"
                              className="pool-hub-secondary"
                              onClick={() => {
                                setEditingCommentId(comment.id);
                                setEditingCommentBody(comment.body);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="pool-hub-secondary"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="pool-hub-detail-items">
                <div className="pool-hub-detail-items-header">
                  <span>
                    Items (
                    {hubMode === 'working-sets'
                      ? Object.values((selectedEntry.payload as WorkingSet).categoryBuckets ?? {}).reduce(
                          (sum, list) => sum + list.length,
                          0
                        )
                      : (selectedEntry.payload as Pool).items.length}
                    )
                  </span>
                </div>
                {hubMode === 'working-sets' ? (
                  <div className="pool-hub-detail-items-grouped">
                    {Object.entries((selectedEntry.payload as WorkingSet).categoryBuckets ?? {}).map(
                      ([categoryId, items]) => {
                        const groupKey = `sidebar-working-set:${selectedEntry.id}:${categoryId}`;
                        const isExpanded = isItemGroupExpanded(groupKey);
                        const shownItems = isExpanded ? items : items.slice(0, 4);
                        return (
                          <div key={categoryId} className="pool-hub-item-group">
                            <div className="pool-hub-item-group-title">
                              <div>
                                {categoryId.replace(/-/g, ' ')}
                                <span>{items.length}</span>
                              </div>
                              {items.length > 4 && (
                                <button
                                  type="button"
                                  className="pool-hub-link"
                                  onClick={() => toggleItemGroupExpanded(groupKey)}
                                >
                                  {isExpanded ? 'Show less' : 'Show all'}
                                </button>
                              )}
                            </div>
                            <div className="pool-hub-detail-items-list">
                              {shownItems.map(item => (
                                <div key={item.id} className="pool-hub-item">
                                  <div className="pool-hub-item-text">{item.text}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <div className="pool-hub-detail-items-list">
                    {visibleItems.map(item => (
                      <div key={item.id} className="pool-hub-item">
                        <div className="pool-hub-item-text">{item.text}</div>
                        {'tags' in item && item.tags && item.tags.length > 0 && (
                          <div className="pool-hub-item-tags">{item.tags.join(', ')}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </aside>
        )}

      </div>

      <Modal
        isOpen={isDetailOpen && Boolean(selectedEntry)}
        onClose={() => setIsDetailOpen(false)}
        title={selectedEntry?.title ?? 'Pool details'}
        className="pool-hub-detail-modal"
      >
        {!selectedEntry ? null : (
          <div className="pool-hub-detail-modal-body">
            <div className="pool-hub-detail-shell">
              <div className="pool-hub-detail-main">
                <div className="pool-hub-detail-title-block">
                  <div className="pool-hub-detail-title">{selectedEntry.title}</div>
                  <div className="pool-hub-detail-summary">{selectedEntry.summary}</div>
                  <div className="pool-hub-detail-chip-row pool-hub-detail-chip-row-stats">
                    {detailStatChips.map(chip => (
                      <span key={chip} className="pool-hub-detail-chip pool-hub-detail-chip-stat">{chip}</span>
                    ))}
                  </div>
                  <div className="pool-hub-detail-chip-row">
                    {(selectedEntry.creator || selectedEntry.creatorId) && (
                      <button
                        type="button"
                        className="pool-hub-link-button pool-hub-detail-chip pool-hub-detail-chip-link"
                        onClick={() => {
                          openCreatorProfileFromEntry(selectedEntry);
                        }}
                      >
                        By {resolveCreatorName(selectedEntry)}
                      </button>
                    )}
                    {detailStatusChips.map(chip => (
                      <span key={chip} className="pool-hub-detail-chip">{chip}</span>
                    ))}
                    {((userId && selectedEntry.creatorId === userId) || (!userId && userName && selectedEntry.creator === userName)) && (
                      <span className="pool-hub-owner-badge">Your upload</span>
                    )}
                  </div>
                  <p className="pool-hub-detail-description">{selectedEntry.description}</p>
                </div>

                <div className="pool-hub-detail-preview-card">
                  {selectedEntry.heroImageUrl ? (
                    <div className="pool-hub-detail-preview-media">
                      <img
                        src={selectedEntry.heroImageUrl}
                        alt={selectedEntry.title}
                        className="pool-hub-detail-preview-image"
                      />
                    </div>
                  ) : (
                    <div className="pool-hub-detail-preview-surface">
                      <div className="pool-hub-detail-preview-head">
                        <div>
                          <div className="pool-hub-section-title">Preview</div>
                          <div className="pool-hub-muted">
                            {selectedPoolSectionCount > 0
                              ? 'A quick look at the pool structure and representative sections.'
                              : 'A quick look at representative items from this pool.'}
                          </div>
                        </div>
                        <div className="pool-hub-detail-preview-counts">
                          <span>{selectedPoolItems.length} items</span>
                          <span>{selectedPoolSectionCount > 0 ? `${selectedPoolSectionCount} sections` : 'Flat pool'}</span>
                        </div>
                      </div>
                      <div className="pool-hub-detail-preview-grid">
                        {previewSections.map(section => (
                          <div key={section.label} className="pool-hub-detail-preview-panel">
                            <div className="pool-hub-detail-preview-label">{section.label}</div>
                            <div className="pool-hub-detail-preview-list">
                              {section.items.map(item => (
                                <div key={item} className="pool-hub-detail-preview-item">{item}</div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pool-hub-detail-items">
                  <div className="pool-hub-detail-items-header">
                    <span>
                      {selectedPoolSectionCount > 0 ? 'Sample Items' : 'Items'} ({selectedPoolItems.length})
                    </span>
                  </div>
                  {selectedPoolSectionCount > 0 ? (
                    <div className="pool-hub-detail-items-grouped">
                      {selectedPoolSections.map(([section, items]) => {
                        const groupKey = `modal-pool:${selectedEntry.id}:${section}`;
                        const isExpanded = isItemGroupExpanded(groupKey);
                        const shownItems = isExpanded ? items : items.slice(0, 4);
                        return (
                          <div key={section} className="pool-hub-item-group">
                            <div className="pool-hub-item-group-title">
                              <div>
                                {section}
                                <span>{items.length}</span>
                              </div>
                              {items.length > 4 && (
                                <button
                                  type="button"
                                  className="pool-hub-link"
                                  onClick={() => toggleItemGroupExpanded(groupKey)}
                                >
                                  {isExpanded ? 'Show less' : 'Show all'}
                                </button>
                              )}
                            </div>
                            <div className="pool-hub-detail-items-list">
                              {shownItems.map(item => (
                                <div key={item.id} className="pool-hub-item">
                                  <div className="pool-hub-item-text">{item.text}</div>
                                  {item.tags && item.tags.length > 0 && (
                                    <div className="pool-hub-item-tags">{item.tags.join(', ')}</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="pool-hub-detail-items-list">
                      {visibleItems.map(item => (
                        <div key={item.id} className="pool-hub-item">
                          <div className="pool-hub-item-text">{item.text}</div>
                          {'tags' in item && item.tags && item.tags.length > 0 && (
                            <div className="pool-hub-item-tags">{item.tags.join(', ')}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <aside className="pool-hub-detail-rail">
                <div className="pool-hub-detail-rail-card pool-hub-detail-action-card">
                  <div className="pool-hub-section-title">Actions</div>
                  <div className="pool-hub-detail-actions">
                    <button
                      type="button"
                      className="pool-hub-primary"
                      onClick={handleAddToActive}
                      disabled={!canInteract}
                      title={canInteract ? 'Add to your library' : 'Upgrade to Pro to add'}
                    >
                      Add to User Pools
                    </button>
                    {onGoToUserPools && (
                      <button type="button" className="pool-hub-secondary" onClick={onGoToUserPools}>
                        Open User Pools
                      </button>
                    )}
                    <button type="button" className="pool-hub-secondary" onClick={handleDownloadPool}>
                      Download JSON
                    </button>
                    {userId && selectedEntry.creatorId === userId && (
                      <button type="button" className="pool-hub-danger" onClick={handleDeletePool}>
                        Delete from Hub
                      </button>
                    )}
                  </div>
                  {(detailActionMessage || addMessage) && (
                    <div className="pool-hub-message">
                      <span>{detailActionMessage ?? addMessage}</span>
                    </div>
                  )}
                </div>

                {(selectedEntry.creator || selectedEntry.creatorId) && (
                  <div className="pool-hub-detail-rail-card pool-hub-creator-card pool-hub-detail-creator-card">
                    <div className="pool-hub-detail-creator-head">
                      {selectedCreatorProfile?.avatarUrl ? (
                        <img
                          src={selectedCreatorProfile.avatarUrl}
                          alt={resolveCreatorName(selectedEntry)}
                          className="pool-hub-creator-avatar"
                        />
                      ) : (
                        <span className="pool-hub-creator-avatar-fallback">
                          {resolveCreatorName(selectedEntry).charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div>
                        <div className="pool-hub-creator-title">{resolveCreatorName(selectedEntry)}</div>
                        <div className="pool-hub-muted">
                          {isOfficialPoolEntry(selectedEntry) ? 'MorpBase Creator' : 'Community Creator'}
                        </div>
                      </div>
                    </div>
                    <div className="pool-hub-creator-meta">
                      <span>{creatorStats.uploads} uploads</span>
                      <span>{creatorStats.totalDownloads} downloads</span>
                      <span>Avg {creatorStats.avgRating.toFixed(1)} rating</span>
                    </div>
                    <button
                      type="button"
                      className="pool-hub-secondary"
                      onClick={() => {
                        openCreatorProfileFromEntry(selectedEntry);
                      }}
                    >
                      View Creator
                    </button>
                  </div>
                )}

                <div className="pool-hub-detail-rail-card pool-hub-rating">
                  <div className="pool-hub-rating-label">Your rating</div>
                  <div className="pool-hub-rating-stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className={`pool-hub-star ${userRating && userRating >= star ? 'active' : ''}`}
                        onClick={() => handleRate(star)}
                        disabled={!canInteract}
                      >
                        *
                      </button>
                    ))}
                  </div>
                  <div className="pool-hub-rating-meta">
                    Avg {selectedEntry.ratingAvg.toFixed(1)} ({selectedEntry.ratingCount})
                  </div>
                </div>

                <details className="pool-hub-detail-rail-card pool-hub-detail-panel" open>
                  <summary className="pool-hub-detail-panel-summary">Details</summary>
                  <div className="pool-hub-detail-panel-body">
                    {detailInfoRows.map(([label, value]) => (
                      <div key={label} className="pool-hub-detail-row">
                        <span className="pool-hub-detail-row-label">{label}</span>
                        <span className="pool-hub-detail-row-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </details>

                <details className="pool-hub-detail-rail-card pool-hub-detail-panel">
                  <summary className="pool-hub-detail-panel-summary">Structure</summary>
                  <div className="pool-hub-detail-panel-body">
                    {detailStructureRows.map(([label, value]) => (
                      <div key={label} className="pool-hub-detail-row">
                        <span className="pool-hub-detail-row-label">{label}</span>
                        <span className="pool-hub-detail-row-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </details>

                <details className="pool-hub-detail-rail-card pool-hub-detail-panel pool-hub-report-panel">
                  <summary className="pool-hub-detail-panel-summary">Report</summary>
                  <div className="pool-hub-detail-panel-body">
                    <div className="pool-hub-muted">Flag this pool if something looks off.</div>
                    <input
                      type="text"
                      value={reportReason}
                      onChange={event => setReportReason(event.target.value)}
                      placeholder="Reason (optional)"
                    />
                    <button type="button" className="pool-hub-secondary" onClick={handleReport}>
                      Report pool
                    </button>
                  </div>
                </details>
              </aside>
            </div>
            <div className="pool-hub-comments">
              <div className="pool-hub-comments-header">
                <div>
                  <div className="pool-hub-comments-title">Comments</div>
                  <div className="pool-hub-muted">
                    {detailComments.length === 0
                      ? 'No discussion yet.'
                      : `${detailComments.length} comment${detailComments.length === 1 ? '' : 's'} on this pool.`}
                  </div>
                </div>
                {!isLoggedIn && (
                  <div className="pool-hub-auth-hint">Log in to join the discussion.</div>
                )}
                {isLoggedIn && !isPro && (
                  <div className="pool-hub-auth-hint">Upgrade to Pro to comment and rate.</div>
                )}
              </div>
              <div className="pool-hub-comments-layout">
                <div className="pool-hub-comments-composer">
                  <div className="pool-hub-comments-composer-title">Add a comment</div>
                  <div className="pool-hub-comments-form">
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      value={commentAuthor}
                      onChange={event => setCommentAuthor(event.target.value)}
                      disabled={!canInteract}
                    />
                    <textarea
                      rows={4}
                      placeholder="Write a comment"
                      value={commentBody}
                      onChange={event => setCommentBody(event.target.value)}
                      disabled={!canInteract}
                    />
                    {commentError && <div className="pool-hub-error">{commentError}</div>}
                    <div className="pool-hub-comments-actions">
                      <button
                        type="button"
                        className="pool-hub-secondary"
                        onClick={() => {
                          setCommentBody('');
                          setCommentError(null);
                        }}
                        disabled={!canInteract}
                      >
                        Clear
                      </button>
                      <button type="button" className="pool-hub-primary" onClick={handleAddComment} disabled={!canInteract}>
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
                <div className="pool-hub-comments-thread">
                  <div className="pool-hub-comments-list">
                    {detailComments.length === 0 ? (
                      <div className="pool-hub-empty">No comments yet.</div>
                    ) : (
                      detailComments.map(comment => (
                        <div key={comment.id} className="pool-hub-comment">
                          <div className="pool-hub-comment-head">
                            <span className="pool-hub-comment-author">
                              {comment.authorId && comment.authorId === userId ? 'You' : comment.author}
                            </span>
                            <span className="pool-hub-comment-date">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {editingCommentId === comment.id ? (
                            <>
                              <textarea
                                rows={3}
                                value={editingCommentBody}
                                onChange={event => setEditingCommentBody(event.target.value)}
                              />
                              <div className="pool-hub-comments-actions">
                                <button
                                  type="button"
                                  className="pool-hub-secondary"
                                  onClick={() => {
                                    setEditingCommentId(null);
                                    setEditingCommentBody('');
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="pool-hub-primary"
                                  onClick={() => handleEditComment(comment.id, editingCommentBody)}
                                >
                                  Save
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="pool-hub-comment-body">{comment.body}</div>
                          )}
                          {comment.authorId && comment.authorId === userId && editingCommentId !== comment.id && (
                            <div className="pool-hub-comments-actions">
                              <button
                                type="button"
                                className="pool-hub-secondary"
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditingCommentBody(comment.body);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="pool-hub-secondary"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Pool to Hub"
        className="pool-hub-upload-modal"
      >
        <div className="pool-hub-upload-form">
          <div className="pool-hub-upload-grid">
            <label>
              Creator
              <input
                type="text"
                value={uploadState.creator}
                onChange={event => setUploadState(prev => ({ ...prev, creator: event.target.value }))}
                placeholder={creatorDisplayName || 'Studio Name'}
              />
              {myProfile?.displayName && (
                <span className="pool-hub-muted">Using your public profile name.</span>
              )}
            </label>
            <label>
              Title
              <input
                type="text"
                value={uploadState.title}
                onChange={event => setUploadState(prev => ({ ...prev, title: event.target.value }))}
                placeholder="Cinematic Portrait Studio"
              />
            </label>
            <label>
              Summary
              <input
                type="text"
                value={uploadState.summary}
                onChange={event => setUploadState(prev => ({ ...prev, summary: event.target.value }))}
                placeholder="Short one-liner"
              />
            </label>
            <label>
              Category
              <input
                type="text"
                value={uploadState.category}
                onChange={event => setUploadState(prev => ({ ...prev, category: event.target.value }))}
                placeholder="Photography"
              />
            </label>
            <label>
              Language
              <input
                type="text"
                value={uploadState.language}
                onChange={event => setUploadState(prev => ({ ...prev, language: event.target.value }))}
                placeholder="en"
              />
            </label>
            <label>
              License
              <input
                type="text"
                value={uploadState.license}
                onChange={event => setUploadState(prev => ({ ...prev, license: event.target.value }))}
                placeholder="CC-BY"
              />
            </label>
            <label>
              Tags (comma)
              <input
                type="text"
                value={uploadState.tags}
                onChange={event => setUploadState(prev => ({ ...prev, tags: event.target.value }))}
                placeholder="portrait, cinematic"
              />
            </label>
          </div>
          <label>
            Description
            <textarea
              rows={4}
              value={uploadState.description}
              onChange={event => setUploadState(prev => ({ ...prev, description: event.target.value }))}
              placeholder="Describe the pool and best use cases"
            />
          </label>
          {isLoggedIn && (
            <div className="pool-hub-upload-visibility-note">
              {myProfile?.showPublicPools
                ? 'This upload can appear on your public creator page because Show public pools is enabled in My Profile.'
                : 'This upload will still appear in Pool Hub, but it will stay hidden from your public creator page until you enable Show public pools in My Profile.'}
            </div>
          )}
          <label>
            Hero Image URL (optional)
            <input
              type="text"
              value={uploadState.heroImageUrl}
              onChange={event => setUploadState(prev => ({ ...prev, heroImageUrl: event.target.value }))}
              placeholder="https://..."
            />
          </label>
          <label>
            Upload Hero Image
            <input
              type="file"
              accept="image/*"
              onChange={event => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const result = typeof reader.result === 'string' ? reader.result : '';
                  setUploadState(prev => ({ ...prev, heroImageUrl: result }));
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
          <label>
            Pool JSON
            <textarea
              rows={6}
              value={uploadState.jsonInput}
              onChange={event => {
                const next = event.target.value;
                setUploadState(prev => ({ ...prev, jsonInput: next }));
                if (!next.trim()) {
                  setUploadPreview(null);
                  return;
                }
                try {
                  const previewPool = parsePoolPayload(next, uploadState.title);
                  setUploadPreview(previewPool);
                } catch {
                  setUploadPreview(null);
                }
              }}
              placeholder="Paste the exported pool JSON here"
            />
          </label>
          {uploadPreview && (
            <div className="pool-hub-upload-preview">
              <div className="pool-hub-section-title">Preview</div>
              <div className="pool-hub-muted">{uploadPreview.name}</div>
              <div className="pool-hub-muted">{uploadPreview.items.length} items</div>
            </div>
          )}
          <div className="pool-hub-upload-file">
            <input
              type="file"
              accept="application/json"
              onChange={event => handleUploadFile(event.target.files?.[0] ?? null)}
            />
            <span>Upload a .json file from disk.</span>
          </div>
          <div className="pool-hub-upload-import">
            <label>
              Import from User Pools
              <div className="pool-hub-upload-import-row">
                <select
                  value={selectedUserPoolId}
                  onChange={event => setSelectedUserPoolId(event.target.value)}
                >
                  {userPools.length === 0 ? (
                    <option value="">No user pools available</option>
                  ) : (
                    userPools.map(pool => (
                      <option key={pool.id} value={pool.id}>
                        {pool.name}
                      </option>
                    ))
                  )}
                </select>
                <button
                  type="button"
                  className="pool-hub-secondary"
                  onClick={handleImportFromUserPools}
                  disabled={userPools.length === 0}
                >
                  Load Pool
                </button>
              </div>
            </label>
          </div>
          {uploadError && <div className="pool-hub-error">{uploadError}</div>}
          <div className="pool-hub-upload-actions">
            <button type="button" className="pool-hub-secondary" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </button>
            <button type="button" className="pool-hub-primary" onClick={handleUpload}>
              Upload to Hub
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isWorkingSetUploadOpen}
        onClose={() => setIsWorkingSetUploadOpen(false)}
        title="Upload Working Set to Hub"
        className="pool-hub-upload-modal"
      >
        <div className="pool-hub-upload-form">
          <div className="pool-hub-upload-grid">
            <label>
              Creator
              <input
                type="text"
                value={workingSetUploadState.creator}
                onChange={event => setWorkingSetUploadState(prev => ({ ...prev, creator: event.target.value }))}
                placeholder={creatorDisplayName || 'Studio Name'}
              />
              {myProfile?.displayName && (
                <span className="pool-hub-muted">Using your public profile name.</span>
              )}
            </label>
            <label>
              Title
              <input
                type="text"
                value={workingSetUploadState.title}
                onChange={event => setWorkingSetUploadState(prev => ({ ...prev, title: event.target.value }))}
                placeholder="Cinematic Portrait Set"
              />
            </label>
            <label>
              Summary
              <input
                type="text"
                value={workingSetUploadState.summary}
                onChange={event => setWorkingSetUploadState(prev => ({ ...prev, summary: event.target.value }))}
                placeholder="Short one-liner"
              />
            </label>
            <label>
              Category
              <input
                type="text"
                value={workingSetUploadState.category}
                onChange={event => setWorkingSetUploadState(prev => ({ ...prev, category: event.target.value }))}
                placeholder="Concept"
              />
            </label>
            <label>
              Language
              <input
                type="text"
                value={workingSetUploadState.language}
                onChange={event => setWorkingSetUploadState(prev => ({ ...prev, language: event.target.value }))}
                placeholder="en"
              />
            </label>
            <label>
              License
              <input
                type="text"
                value={workingSetUploadState.license}
                onChange={event => setWorkingSetUploadState(prev => ({ ...prev, license: event.target.value }))}
                placeholder="CC-BY"
              />
            </label>
            <label>
              Tags (comma)
              <input
                type="text"
                value={workingSetUploadState.tags}
                onChange={event => setWorkingSetUploadState(prev => ({ ...prev, tags: event.target.value }))}
                placeholder="portrait, cinematic"
              />
            </label>
          </div>
          <label>
            Description
            <textarea
              rows={4}
              value={workingSetUploadState.description}
              onChange={event => setWorkingSetUploadState(prev => ({ ...prev, description: event.target.value }))}
              placeholder="Describe the working set and best use cases"
            />
          </label>
          <label>
            Hero Image URL (optional)
            <input
              type="text"
              value={workingSetUploadState.heroImageUrl}
              onChange={event => setWorkingSetUploadState(prev => ({ ...prev, heroImageUrl: event.target.value }))}
              placeholder="https://..."
            />
          </label>
          <label>
            Upload Hero Image
            <input
              type="file"
              accept="image/*"
              onChange={event => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const result = typeof reader.result === 'string' ? reader.result : '';
                  setWorkingSetUploadState(prev => ({ ...prev, heroImageUrl: result }));
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
          <label>
            Working Set JSON
            <textarea
              rows={6}
              value={workingSetUploadState.jsonInput}
              onChange={event => {
                const next = event.target.value;
                setWorkingSetUploadState(prev => ({ ...prev, jsonInput: next }));
                if (!next.trim()) {
                  setWorkingSetUploadPreview(null);
                  return;
                }
                try {
                  const previewSet = parseWorkingSetPayload(next, workingSetUploadState.title);
                  setWorkingSetUploadPreview(previewSet);
                } catch {
                  setWorkingSetUploadPreview(null);
                }
              }}
              placeholder="Paste the exported working set JSON here"
            />
          </label>
          {workingSetUploadPreview && (
            <div className="pool-hub-upload-preview">
              <div className="pool-hub-section-title">Preview</div>
              <div className="pool-hub-muted">{workingSetUploadPreview.name}</div>
              <div className="pool-hub-muted">
                {Object.values(workingSetUploadPreview.categoryBuckets).reduce((sum, list) => sum + list.length, 0)} items
              </div>
            </div>
          )}
          <div className="pool-hub-upload-file">
            <input
              type="file"
              accept="application/json"
              onChange={event => handleUploadFile(event.target.files?.[0] ?? null)}
            />
            <span>Upload a .json file from disk.</span>
          </div>
          <div className="pool-hub-upload-import">
            <label>
              Import from Working Sets
              <div className="pool-hub-upload-import-row">
                <select
                  value={selectedUserWorkingSetId}
                  onChange={event => setSelectedUserWorkingSetId(event.target.value)}
                >
                  {userWorkingSets.length === 0 ? (
                    <option value="">No working sets available</option>
                  ) : (
                    userWorkingSets.map(set => (
                      <option key={set.id} value={set.id}>
                        {set.name}
                      </option>
                    ))
                  )}
                </select>
                <button
                  type="button"
                  className="pool-hub-secondary"
                  onClick={handleImportFromUserPools}
                  disabled={userWorkingSets.length === 0}
                >
                  Load Working Set
                </button>
              </div>
            </label>
          </div>
          {uploadError && <div className="pool-hub-error">{uploadError}</div>}
          <div className="pool-hub-upload-actions">
            <button type="button" className="pool-hub-secondary" onClick={() => setIsWorkingSetUploadOpen(false)}>
              Cancel
            </button>
            <button type="button" className="pool-hub-primary" onClick={handleUpload}>
              Upload to Hub
            </button>
          </div>
        </div>
      </Modal>

      <details className="pool-hub-admin">
        <summary>Hub Data Tools</summary>
        <div className="pool-hub-admin-body">
          <textarea
            rows={6}
            placeholder="Hub store JSON"
            value={adminJson}
            onChange={event => setAdminJson(event.target.value)}
          />
          <div className="pool-hub-admin-actions">
            <button type="button" className="pool-hub-secondary" onClick={handleExportHub}>
              Export Hub
            </button>
            <button type="button" className="pool-hub-secondary" onClick={handleImportHub}>
              Import Hub
            </button>
            <button type="button" className="pool-hub-secondary" onClick={handleResetHub}>
              Reset Hub
            </button>
          </div>
          {adminMessage && <div className="pool-hub-message">{adminMessage}</div>}
          {adminError && <div className="pool-hub-error">{adminError}</div>}
        </div>
      </details>
    </div>
  );
}
