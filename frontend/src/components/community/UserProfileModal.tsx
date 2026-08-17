import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types';
import { communityApi } from '../../api/community';
import { Modal, Button, Badge, Skeleton } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Check, Calendar } from 'lucide-react';

interface UserProfileModalProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userId,
  isOpen,
  onClose,
}) => {
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await communityApi.getUserProfile(userId);
        setProfile(data);
        setIsFollowing(data.is_following);
        setFollowersCount(data.followers_count);
      } catch {/* silent */} finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId, isOpen]);

  const handleFollow = async () => {
    if (!profile || followLoading) return;
    setFollowLoading(true);
    try {
      const result = await communityApi.toggleFollow(profile.id);
      setIsFollowing(result.is_following);
      setFollowersCount(prev => result.is_following ? prev + 1 : prev - 1);
    } catch {/* silent */} finally {
      setFollowLoading(false);
    }
  };

  const isSelf = currentUser?.id === profile?.id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={profile ? (profile.display_name || profile.username) : ""}
    >
      {loading || !profile ? (
        <div className="d-flex flex-column gap-3 p-3">
          <div className="d-flex align-items-center gap-4 mb-3">
            <Skeleton width="80px" height="80px" rounded="50%" />
            <div className="flex-grow-1 d-flex flex-column gap-2">
              <Skeleton width="60%" height="24px" rounded="4px" />
              <Skeleton width="40%" height="16px" rounded="4px" />
            </div>
          </div>
          <Skeleton width="100%" height="60px" rounded="8px" />
          <div className="d-flex gap-4 mt-2">
            <Skeleton width="80px" height="20px" rounded="4px" />
            <Skeleton width="80px" height="20px" rounded="4px" />
            <Skeleton width="80px" height="20px" rounded="4px" />
          </div>
        </div>
      ) : (
        <div className="p-2">
          {/* Header Row: Avatar + Info */}
          <div className="d-flex align-items-start justify-content-between mb-4">
            <div className="d-flex align-items-center gap-4">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.display_name}
                     className="rounded-circle border border-2 border-dark shadow-sm" 
                     style={{ width: 80, height: 80, objectFit: 'cover' }} />
              ) : (
                <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                     style={{ width: 80, height: 80, background: 'linear-gradient(135deg,#f36100,#ff7a1a)', fontSize: 32 }}>
                  {profile.display_name.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="mt-1">
                <h4 className="text-white fw-bold mb-1 d-flex align-items-center gap-2">
                  {profile.display_name}
                  {profile.role === 'trainer' && (
                    <Badge variant="warning" style={{ fontSize: 11, padding: '2px 6px' }}>Trainer</Badge>
                  )}
                </h4>
                <div className="text-secondary text-sm">@{profile.username}</div>
              </div>
            </div>

            {/* Follow Button */}
            {!isSelf && currentUser && (
              <Button 
                variant={isFollowing ? 'ghost' : 'primary'} 
                size="sm" 
                className="rounded-pill px-4"
                onClick={handleFollow}
                loading={followLoading}
                style={isFollowing ? { border: '1px solid rgba(255,255,255,0.2)' } : {}}
              >
                {isFollowing ? (
                  <span className="d-flex align-items-center gap-2"><Check size={16} /> Following</span>
                ) : (
                  <span className="d-flex align-items-center gap-2"><UserPlus size={16} /> Follow</span>
                )}
              </Button>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-white text-sm mb-4" style={{ lineHeight: 1.6 }}>
              {profile.bio}
            </p>
          )}

          {/* Metadata */}
          <div className="d-flex flex-wrap gap-3 mb-4">
            {profile.joined_at && (
              <div className="d-flex align-items-center gap-1 text-secondary text-sm">
                <Calendar size={14} /> Joined {new Date(profile.joined_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
              </div>
            )}
          </div>

          {/* Stats Row */}
          <div className="d-flex align-items-center gap-4 pt-3 border-top border-white/10">
            <div className="d-flex flex-column align-items-center">
              <span className="text-white fw-bold fs-5">{profile.posts_count}</span>
              <span className="text-secondary text-xs text-uppercase tracking-wider">Posts</span>
            </div>
            <div className="d-flex flex-column align-items-center">
              <span className="text-white fw-bold fs-5">{followersCount}</span>
              <span className="text-secondary text-xs text-uppercase tracking-wider">Followers</span>
            </div>
            <div className="d-flex flex-column align-items-center">
              <span className="text-white fw-bold fs-5">{profile.following_count}</span>
              <span className="text-secondary text-xs text-uppercase tracking-wider">Following</span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UserProfileModal;
