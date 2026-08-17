import React, { useState } from 'react';
import { Reply, Comment } from '../../types';
import { communityApi } from '../../api/community';
import { UserProfileModal } from './UserProfileModal';
import { Button } from '../ui';
import { Heart, CornerDownRight } from 'lucide-react';

interface CommentItemProps {
  comment: Comment;
  postId: number;
  onReplyAdded: (comment: Comment) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, postId, onReplyAdded }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(comment.is_liked);
  const [likesCount, setLikesCount] = useState(comment.likes_count);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleLike = async () => {
    try {
      const result = await communityApi.toggleCommentLike(postId, comment.id);
      setIsLiked(result.is_liked);
      setLikesCount(result.likes_count);
    } catch {/* silent */ }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setIsSubmitting(true);
    try {
      const newComment = await communityApi.addComment(postId, replyText.trim(), comment.id);
      onReplyAdded(newComment);
      setReplyText('');
      setShowReplyBox(false);
    } catch {/* silent */ } finally {
      setIsSubmitting(false);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="d-flex gap-3 mb-3">
      {/* Avatar */}
      <div 
        className="flex-shrink-0" 
        style={{ cursor: 'pointer' }}
        onClick={() => setSelectedUserId(comment.author.id)}
      >
        {comment.author.avatar ? (
          <img src={comment.author.avatar} alt={comment.author.display_name}
               className="rounded-circle" style={{ width: 36, height: 36, objectFit: 'cover' }} />
        ) : (
          <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white text-sm hover-orange-bg transition"
               style={{ width: 36, height: 36, background: 'rgba(243,97,0,0.3)', flexShrink: 0 }}>
            {comment.author.display_name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-grow-1">
        {/* Comment bubble */}
        <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span 
              className="text-white fw-bold text-sm hover-orange transition" 
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedUserId(comment.author.id)}
            >
              {comment.author.display_name}
            </span>
            <span className="text-secondary" style={{ fontSize: '11px' }}>{timeAgo(comment.created_at)}</span>
          </div>
          <p className="text-secondary mb-0" style={{ fontSize: '14px', lineHeight: 1.6 }}>{comment.content}</p>
        </div>

        {/* Actions row */}
        <div className="d-flex align-items-center gap-3 mt-2 ms-2">
          <button onClick={handleLike}
                  className={`btn btn-link p-0 text-decoration-none d-flex align-items-center gap-1 text-xs ${isLiked ? 'text-danger' : 'text-secondary'}`}
                  style={{ background: 'none', border: 'none' }}>
            <Heart size={13} fill={isLiked ? 'currentColor' : 'none'} /> {likesCount}
          </button>
          <button onClick={() => setShowReplyBox(!showReplyBox)}
                  className="btn btn-link p-0 text-decoration-none text-secondary text-xs d-flex align-items-center gap-1"
                  style={{ background: 'none', border: 'none' }}>
            <CornerDownRight size={13} /> Reply
          </button>
        </div>

        {/* Reply input */}
        {showReplyBox && (
          <form onSubmit={handleReply} className="d-flex gap-2 mt-2">
            <input value={replyText} onChange={(e) => setReplyText(e.target.value)}
                   placeholder={`Reply to @${comment.author.username}…`}
                   className="form-control text-white text-sm rounded-pill px-3"
                   style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', flex: 1 }} />
            <Button type="submit" variant="primary" size="sm" loading={isSubmitting} className="rounded-pill px-3">
              Reply
            </Button>
          </form>
        )}

        {/* Nested replies */}
        {comment.replies?.length > 0 && (
          <div className="mt-3 ms-4 border-start border-secondary border-opacity-25 ps-3">
            {comment.replies.map((reply: Reply) => (
              <div key={reply.id} className="d-flex gap-2 mb-2">
                <div 
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0 hover-orange-bg transition"
                  style={{ width: 28, height: 28, background: 'rgba(243,97,0,0.2)', fontSize: 11, cursor: 'pointer' }}
                  onClick={() => setSelectedUserId(reply.author.id)}
                >
                  {reply.author.avatar ? (
                    <img src={reply.author.avatar} alt={reply.author.display_name}
                         className="rounded-circle" style={{ width: 28, height: 28, objectFit: 'cover' }} />
                  ) : (
                    reply.author.display_name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="p-2 px-3 rounded-3 flex-grow-1" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span 
                      className="text-white fw-bold hover-orange transition" 
                      style={{ fontSize: 12, cursor: 'pointer' }}
                      onClick={() => setSelectedUserId(reply.author.id)}
                    >
                      {reply.author.display_name}
                    </span>
                    <span className="text-secondary" style={{ fontSize: 10 }}>{timeAgo(reply.created_at)}</span>
                  </div>
                  <p className="text-secondary mb-0" style={{ fontSize: 13 }}>{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      <UserProfileModal 
        userId={selectedUserId} 
        isOpen={!!selectedUserId} 
        onClose={() => setSelectedUserId(null)} 
      />
    </div>
  );
};

export default CommentItem;
