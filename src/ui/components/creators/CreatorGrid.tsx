import { useCallback, useEffect, useState } from 'react';
import { listCreators, type CreatorSummary } from '../../../engine/creatorFeedStore';
import { getFollowingAuthUids } from '../../../engine/followStore';
import { getXPMap } from '../../../engine/xpStore';
import { getBadgeMap } from '../../../engine/badgeStore';
import type { EarnedBadge } from '../../../types/community';
import { CreatorCard } from './CreatorCard';
import './CreatorGrid.css';

type CreatorGridProps = {
  authUid: string | null;
  onViewCreator?: (authUid: string, name: string) => void;
};

export function CreatorGrid({ authUid, onViewCreator }: CreatorGridProps) {
  const [creators, setCreators] = useState<CreatorSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set());
  const [xpMap, setXpMap] = useState<Map<string, number>>(new Map());
  const [badgeMap, setBadgeMap] = useState<Map<string, EarnedBadge[]>>(new Map());

  const load = useCallback(async () => {
    setLoading(true);
    const [creatorsData, followingUids] = await Promise.all([
      listCreators(),
      authUid ? getFollowingAuthUids(authUid) : Promise.resolve([] as string[]),
    ]);
    setCreators(creatorsData);
    setFollowingSet(new Set(followingUids));
    const uids = creatorsData.map(c => c.authUid);
    const [map, badges] = await Promise.all([getXPMap(uids), getBadgeMap(uids)]);
    setXpMap(map);
    setBadgeMap(badges);
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

  if (loading) {
    return <div className="creator-grid-loading">Loading creators…</div>;
  }

  if (creators.length === 0) {
    return (
      <div className="creator-grid-empty">
        No creators yet. Share an identity or post to the Wall to appear here.
      </div>
    );
  }

  return (
    <div className="creator-grid">
      {creators.map(creator => (
        <CreatorCard
          key={creator.authUid}
          creator={creator}
          authorXp={xpMap.get(creator.authUid)}
          authorBadges={badgeMap.get(creator.authUid) ?? []}
          authUid={authUid}
          followingSet={followingSet}
          onFollowChanged={handleFollowChanged}
          onViewCreator={onViewCreator}
        />
      ))}
    </div>
  );
}
