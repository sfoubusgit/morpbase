import { FollowButton } from '../shared/FollowButton';
import type { CreatorSummary } from '../../../engine/creatorFeedStore';
import './CreatorCard.css';

type CreatorCardProps = {
  creator: CreatorSummary;
  authUid: string | null;
  followingSet: Set<string>;
  onFollowChanged: (creatorAuthUid: string, nowFollowing: boolean) => void;
  onViewCreator?: (authUid: string, name: string) => void;
};

export function CreatorCard({
  creator,
  authUid,
  followingSet,
  onFollowChanged,
  onViewCreator,
}: CreatorCardProps) {
  const isOwnCard = authUid === creator.authUid;
  const isFollowing = followingSet.has(creator.authUid);

  return (
    <div className="creator-card">
      <div className="creator-card-avatar">
        {creator.name.charAt(0).toUpperCase()}
      </div>

      <div className="creator-card-body">
        <button
          type="button"
          className="creator-card-name"
          onClick={() => onViewCreator?.(creator.authUid, creator.name)}
          disabled={!onViewCreator}
        >
          {creator.name}
        </button>

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
