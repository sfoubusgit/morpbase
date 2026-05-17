import { FollowButton } from '../shared/FollowButton';
import { TitleBadge } from '../shared/TitleBadge';
import { OnlineIndicator } from '../shared/OnlineIndicator';
import { getTitleForXp } from '../../../data/communityTitles';
import type { CreatorSummary } from '../../../engine/creatorFeedStore';
import './CreatorCard.css';

type CreatorCardProps = {
  creator: CreatorSummary;
  authorXp?: number;
  reach?: number;
  authUid: string | null;
  followingSet: Set<string>;
  isOnline?: boolean;
  onFollowChanged: (creatorAuthUid: string, nowFollowing: boolean) => void;
  onViewCreator?: (authUid: string, name: string) => void;
};

export function CreatorCard({
  creator,
  authorXp,
  reach = 0,
  authUid,
  followingSet,
  isOnline,
  onFollowChanged,
  onViewCreator,
}: CreatorCardProps) {
  const isOwnCard = authUid === creator.authUid;
  const isFollowing = followingSet.has(creator.authUid);
  const title = authorXp !== undefined ? getTitleForXp(authorXp) : null;

  return (
    <div className="creator-card">
      <div className="creator-card-avatar">
        {creator.name.charAt(0).toUpperCase()}
        <OnlineIndicator isOnline={!!isOnline} />
      </div>

      <div className="creator-card-body">
        <div className="creator-card-name-row">
          <button
            type="button"
            className="creator-card-name"
            onClick={() => onViewCreator?.(creator.authUid, creator.name)}
            disabled={!onViewCreator}
          >
            {creator.name}
          </button>
          {title && <TitleBadge title={title} size="sm" />}
        </div>

        <div className="creator-card-stats">
          {creator.wallPostCount > 0 && (
            <span className="creator-card-stat">
              {creator.wallPostCount} {creator.wallPostCount === 1 ? 'post' : 'posts'}
            </span>
          )}
          {creator.identityCount > 0 && (
            <span className="creator-card-stat">
              {creator.identityCount} {creator.identityCount === 1 ? 'identity' : 'identities'}
            </span>
          )}
          {reach > 0 && (
            <span className="creator-card-stat creator-card-stat--reach" title="Reach — number of creators who added one of their identities">
              👁 {reach}
            </span>
          )}
        </div>
      </div>

      {authUid && !isOwnCard && (
        <FollowButton
          followerAuthUid={authUid}
          followingAuthUid={creator.authUid}
          initialIsFollowing={isFollowing}
          onChanged={(nowFollowing) => onFollowChanged(creator.authUid, nowFollowing)}
          size="sm"
        />
      )}
    </div>
  );
}
