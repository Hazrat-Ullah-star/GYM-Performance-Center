import React, { useState, useEffect, useCallback, memo } from 'react';
import { Tag, UserProfile } from '../../types';
import { communityApi } from '../../api/community';
import { UserProfileModal } from './UserProfileModal';
import { Badge } from '../ui';
import { TrendingUp, Users, UserPlus, Check, Star } from 'lucide-react';

interface TrendingSidebarProps {
  activeTag?: string;
  onTagSelect: (slug: string) => void;
}

export const TrendingSidebarInner: React.FC<TrendingSidebarProps> = ({
  activeTag,
  onTagSelect,
}) => {
  const [trendingTags, setTrendingTags] = useState<Tag[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<UserProfile[]>([]);
  const [popularTrainers, setPopularTrainers] = useState<UserProfile[]>([]);
  const [followingState, setFollowingState] = useState<Record<number, boolean>>({});
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [tags, users, trainers] = await Promise.all([
          communityApi.getTrendingTags(),
          communityApi.getSuggestedUsers(),
          communityApi.getPopularTrainers(),
        ]);
        setTrendingTags(tags);
        setSuggestedUsers(users.slice(0, 5));
        setPopularTrainers(trainers.slice(0, 4));
      } catch {/* silent */}
    };
    load();
  }, []);

  const handleFollow = useCallback(async (userId: number) => {
    try {
      const result = await communityApi.toggleFollow(userId);
      setFollowingState((prev) => ({ ...prev, [userId]: result.is_following }));
    } catch {/* silent */}
  }, []);

  const isFollowing = (userId: number, profile: UserProfile) =>
    followingState[userId] !== undefined ? followingState[userId] : profile.is_following;

  return (
    <aside className="d-flex flex-column gap-4">
      {/* Trending Tags */}
      <div className="g-glass-card p-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <TrendingUp size={18} className="text-warning" />
          <h5 className="text-white fw-bold mb-0" style={{ fontSize: 16 }}>Trending Tags</h5>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <button key={tag.id} onClick={() => onTagSelect(tag.slug)}
                    className={`btn btn-sm rounded-pill px-3 py-1 text-xs fw-semibold transition-all ${
                      activeTag === tag.slug
                        ? 'text-white'
                        : 'text-warning'
                    }`}
                    style={{
                      background: activeTag === tag.slug ? '#f36100' : 'rgba(243,97,0,0.12)',
                      border: 'none',
                    }}>
              #{tag.name}
              <span className="ms-1 opacity-75">({tag.post_count})</span>
            </button>
          ))}
          {trendingTags.length === 0 && (
            <p className="text-secondary text-xs mb-0">No trending tags yet.</p>
          )}
        </div>
      </div>

      {/* Popular Trainers */}
      {popularTrainers.length > 0 && (
        <div className="g-glass-card p-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Star size={18} className="text-warning" />
            <h5 className="text-white fw-bold mb-0" style={{ fontSize: 16 }}>Popular Trainers</h5>
          </div>
          <div className="d-flex flex-column gap-3">
            {popularTrainers.map((trainer) => (
              <div key={trainer.id} className="d-flex align-items-center justify-content-between">
                <div 
                  className="d-flex align-items-center gap-2" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedUserId(trainer.id)}
                >
                  {trainer.avatar ? (
                    <img src={trainer.avatar} alt={trainer.display_name}
                         className="rounded-circle" style={{ width: 36, height: 36, objectFit: 'cover' }} />
                  ) : (
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white hover-orange-bg transition"
                         style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#f36100,#ff7a1a)', fontSize: 15 }}>
                      {trainer.display_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h6 className="text-white fw-bold mb-0 hover-orange transition" style={{ fontSize: 13 }}>{trainer.display_name}</h6>
                    <div className="d-flex align-items-center gap-1">
                      <Badge variant="warning" style={{ fontSize: 9, padding: '1px 5px' }}>Coach</Badge>
                      <span className="text-secondary" style={{ fontSize: 11 }}>{trainer.followers_count} followers</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => handleFollow(trainer.id)}
                        className={`btn btn-sm rounded-pill px-3 py-1 d-flex align-items-center gap-1 ${
                          isFollowing(trainer.id, trainer)
                            ? 'text-secondary'
                            : 'text-white'
                        }`}
                        style={{
                          background: isFollowing(trainer.id, trainer)
                            ? 'rgba(255,255,255,0.06)'
                            : '#f36100',
                          border: 'none',
                          fontSize: 11,
                        }}>
                  {isFollowing(trainer.id, trainer)
                    ? <><Check size={12} /> Following</>
                    : <><UserPlus size={12} /> Follow</>}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Members */}
      {suggestedUsers.length > 0 && (
        <div className="g-glass-card p-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Users size={18} className="text-info" />
            <h5 className="text-white fw-bold mb-0" style={{ fontSize: 16 }}>Suggested Members</h5>
          </div>
          <div className="d-flex flex-column gap-3">
            {suggestedUsers.map((member) => (
              <div key={member.id} className="d-flex align-items-center justify-content-between">
                <div 
                  className="d-flex align-items-center gap-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedUserId(member.id)}
                >
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.display_name}
                         className="rounded-circle" style={{ width: 32, height: 32, objectFit: 'cover' }} />
                  ) : (
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white hover-orange-bg transition"
                         style={{ width: 32, height: 32, background: 'rgba(59,130,246,0.3)', fontSize: 13 }}>
                      {member.display_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h6 className="text-white fw-bold mb-0 hover-orange transition" style={{ fontSize: 13 }}>{member.display_name}</h6>
                    <span className="text-secondary" style={{ fontSize: 11 }}>@{member.username}</span>
                  </div>
                </div>
                <button onClick={() => handleFollow(member.id)}
                        className={`btn btn-sm rounded-pill px-3 py-1 ${
                          isFollowing(member.id, member) ? 'text-secondary' : 'text-white'
                        }`}
                        style={{
                          background: isFollowing(member.id, member)
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(243,97,0,0.2)',
                          border: isFollowing(member.id, member)
                            ? '1px solid rgba(255,255,255,0.1)'
                            : '1px solid rgba(243,97,0,0.4)',
                          fontSize: 11,
                        }}>
                  {isFollowing(member.id, member) ? 'Following' : '+ Follow'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal 
        userId={selectedUserId} 
        isOpen={!!selectedUserId} 
        onClose={() => setSelectedUserId(null)} 
      />
    </aside>
  );
};

/**
 * Memoized TrendingSidebar — only re-renders when activeTag changes.
 * Sidebar data (tags, trainers, users) is stable after initial load.
 */
export const TrendingSidebar = memo(TrendingSidebarInner, (prev, next) =>
  prev.activeTag === next.activeTag && prev.onTagSelect === next.onTagSelect
);

export default TrendingSidebar;
