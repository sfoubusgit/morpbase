import { useCallback, useEffect, useMemo, useState } from 'react';
import { listCreators, type CreatorSummary } from '../../../engine/creatorFeedStore';
import { getFollowingAuthUids } from '../../../engine/followStore';
import { getXPMap } from '../../../engine/xpStore';
import { getReachScores } from '../../../engine/identityUsageStore';
import { getPublicProfilesByAuthUids } from '../../../engine/profileStore';
import type { PublicProfile } from '../../../types';
import { useOnlineAuthUids } from '../../hooks/useOnlineAuthUids';
import { CreatorCard } from './CreatorCard';
import './CreatorGrid.css';

type SortMode = 'online' | 'xp' | 'reach' | 'recent';

type CreatorGridProps = {
  authUid: string | null;
  onViewCreator?: (authUid: string, name: string) => void;
};

export function CreatorGrid({ authUid, onViewCreator }: CreatorGridProps) {
  const [creators, setCreators] = useState<CreatorSummary[]>([]);
  const [profileMap, setProfileMap] = useState<Map<string, PublicProfile>>(new Map());
  const [loading, setLoading] = useState(true);
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set());
  const [xpMap, setXpMap] = useState<Map<string, number>>(new Map());
  const [reachMap, setReachMap] = useState<Map<string, number>>(new Map());
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortMode>('online');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const onlineUids = useOnlineAuthUids();

  const load = useCallback(async () => {
    setLoading(true);
    const [creatorsData, followingUids] = await Promise.all([
      listCreators(),
      authUid ? getFollowingAuthUids(authUid) : Promise.resolve([] as string[]),
    ]);
    setCreators(creatorsData);
    setFollowingSet(new Set(followingUids));
    const uids = creatorsData.map(c => c.authUid);
    const [xp, reach, profiles] = await Promise.all([
      getXPMap(uids),
      getReachScores(uids),
      getPublicProfilesByAuthUids(uids),
    ]);
    setXpMap(xp);
    setReachMap(reach);
    setProfileMap(profiles);
    setLoading(false);
  }, [authUid]);

  useEffect(() => { void load(); }, [load]);

  const handleFollowChanged = (creatorAuthUid: string, nowFollowing: boolean) => {
    setFollowingSet(prev => {
      const next = new Set(prev);
      if (nowFollowing) next.add(creatorAuthUid);
      else next.delete(creatorAuthUid);
      return next;
    });
  };

  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of creators) {
      const tags = profileMap.get(c.authUid)?.tags;
      if (!tags) continue;
      for (const t of tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [creators, profileMap]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = creators.filter(c => {
      const profile = profileMap.get(c.authUid);
      if (activeTag && !(profile?.tags ?? []).includes(activeTag)) return false;
      if (!term) return true;
      if (c.name.toLowerCase().includes(term)) return true;
      const bio = profile?.bio?.toLowerCase() ?? '';
      if (bio.includes(term)) return true;
      if ((profile?.tags ?? []).some(t => t.toLowerCase().includes(term))) return true;
      return false;
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'online') {
        const aOn = onlineUids.has(a.authUid) ? 1 : 0;
        const bOn = onlineUids.has(b.authUid) ? 1 : 0;
        if (bOn !== aOn) return bOn - aOn;
        return (xpMap.get(b.authUid) ?? 0) - (xpMap.get(a.authUid) ?? 0);
      }
      if (sort === 'xp') return (xpMap.get(b.authUid) ?? 0) - (xpMap.get(a.authUid) ?? 0);
      if (sort === 'reach') return (reachMap.get(b.authUid) ?? 0) - (reachMap.get(a.authUid) ?? 0);
      // 'recent': use profile.updatedAt when present, fall back to 0
      const aT = profileMap.get(a.authUid)?.updatedAt ?? 0;
      const bT = profileMap.get(b.authUid)?.updatedAt ?? 0;
      return bT - aT;
    });
  }, [creators, profileMap, search, activeTag, sort, onlineUids, xpMap, reachMap]);

  const sortLabel = (s: SortMode) => {
    if (s === 'online') return 'Online first';
    if (s === 'xp')     return 'XP';
    if (s === 'reach')  return 'Reach';
    return 'Recently active';
  };

  return (
    <div className="creator-grid-wrap">
      <div className="creator-grid-toolbar">
        <input
          type="text"
          className="creator-grid-search"
          placeholder="Search name, bio, or tag…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="creator-grid-sorts">
          {(['online', 'xp', 'reach', 'recent'] as SortMode[]).map(s => (
            <button
              key={s}
              type="button"
              className={`creator-grid-sort${sort === s ? ' creator-grid-sort--active' : ''}`}
              onClick={() => setSort(s)}
            >
              {sortLabel(s)}
            </button>
          ))}
        </div>
      </div>

      {popularTags.length > 0 && (
        <div className="creator-grid-tagrow">
          <button
            type="button"
            className={`creator-grid-tagchip${activeTag === null ? ' creator-grid-tagchip--active' : ''}`}
            onClick={() => setActiveTag(null)}
          >
            All
          </button>
          {popularTags.map(tag => (
            <button
              key={tag}
              type="button"
              className={`creator-grid-tagchip${activeTag === tag ? ' creator-grid-tagchip--active' : ''}`}
              onClick={() => setActiveTag(prev => prev === tag ? null : tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="creator-grid-loading">Loading people…</div>
      ) : visible.length === 0 ? (
        <div className="creator-grid-empty">
          {search.trim() || activeTag
            ? 'No people match these filters.'
            : 'No people yet. Share an identity or post to the Wall to appear here.'}
        </div>
      ) : (
        <div className="creator-grid">
          {visible.map(creator => (
            <CreatorCard
              key={creator.authUid}
              creator={creator}
              profile={profileMap.get(creator.authUid)}
              authorXp={xpMap.get(creator.authUid)}
              reach={reachMap.get(creator.authUid) ?? 0}
              authUid={authUid}
              followingSet={followingSet}
              isOnline={onlineUids.has(creator.authUid)}
              onFollowChanged={handleFollowChanged}
              onViewCreator={onViewCreator}
            />
          ))}
        </div>
      )}
    </div>
  );
}
