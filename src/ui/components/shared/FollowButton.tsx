import { useState } from 'react';
import { followUser, unfollowUser } from '../../../engine/followStore';
import './FollowButton.css';

type FollowButtonProps = {
  followerAuthUid: string;
  followingAuthUid: string;
  initialIsFollowing: boolean;
  onChanged?: (nowFollowing: boolean) => void;
  size?: 'sm' | 'md';
};

export function FollowButton({
  followerAuthUid,
  followingAuthUid,
  initialIsFollowing,
  onChanged,
  size = 'md',
}: FollowButtonProps) {
  const [following, setFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (following) {
        await unfollowUser(followerAuthUid, followingAuthUid);
        setFollowing(false);
        onChanged?.(false);
      } else {
        await followUser(followerAuthUid, followingAuthUid);
        setFollowing(true);
        onChanged?.(true);
      }
    } catch {
      // silently revert
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`follow-btn follow-btn--${size}${following ? ' follow-btn--following' : ''}`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? '…' : following ? 'Following' : 'Follow'}
    </button>
  );
}
