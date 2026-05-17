import { useCallback, useEffect, useMemo, useState } from 'react';
import { listCreators, type CreatorSummary } from '../../../engine/creatorFeedStore';
import { getFollowingAuthUids } from '../../../engine/followStore';
import { getXPMap } from '../../../engine/xpStore';
import { getReachScores } from '../../../engine/identityUsageStore';
import { useOnlineAuthUids } from '../../hooks/useOnlineAuthUids';
import { CreatorCard } from './CreatorCard';
import './CreatorGrid.css';

type SortMode = 'online' | 'xp' | 'reach';

type CreatorGridProps = {
  authUid: string | null;
  onViewCreator?: (authUid: string, name: string) => void;
};

export function CreatorGrid({ authUid, onViewCreator }: CreatorGridProps) {
  const [creators, setCreators] = useState<CreatorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set());
  const [xpMap, setXpMap] = useState<Map<string, number>>(new Map());
  const [reachMap, setReachMap] = useState<Map<string, number>>(new Map());
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortMode>('online');
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
    const [xp, reach] = await Promise.all([getXPMap(uids), getReachScores(uids)]);
    setXpMap(xp);
    setReachMap(reach);
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

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = term
      ? creators.filter(c => c.name.toLowerCase().includes(term))
      : creators;

    return [...filtered].sort((a, b) => {
      if (sort === 'online') {
        const aOn = onlineUids.has(a.authUid) ? 1 : 0;
        const bOn = onlineUids.has(b.authUid) ? 1 : 0;
        if (bOn !== aOn) return bOn - aOn;
        return (xpMap.get(b.authUid) ?? 0) - (xpMap.get(a.authUid) ?? 0);
      }
      if (sort === 'xp') return (xpMap.get(b.authUid) ?? 0) - (xpMap.get(a.authUid) ?? 0);
      return (reachMap.get(b.authUid) ?? 0) - (reachMap.get(a.authUid) ?? 0);
    });
  }, [creators, search, sort, onlineUids, xpMap, reachMap]);

  return (
    <div className="creator-grid-wrap">
      <div className="creator-grid-toolbar">
        <input
          type="text"
          className="creator-grid-search"
          placeholder="Search by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="creator-grid-sorts">
          {(['online', 'xp', 'reach'] as SortMode[]).map(s => (
            <button
              key={s}
              type="button"
              className={`creator-grid-sort${sort === s ? ' creator-grid-sort--active' : ''}`}
              onClick={() => setSort(s)}
            >
              {s === 'online' ? 'Online first' : s === 'xp' ? 'XP' : 'Reach'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="creator-grid-loading">Loading users…</div>
      ) : visible.length === 0 ? (
        <div className="creator-grid-empty">
          {search.trim()
            ? `No users matching "${search.trim()}".`
            : 'No users yet. Share an identity or post to the Wall to appear here.'}
        </div>
      ) : (
        <div className="creator-grid">
          {visible.map(creator => (
            <CreatorCard
              key={creator.authUid}
              creator={creator}
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
