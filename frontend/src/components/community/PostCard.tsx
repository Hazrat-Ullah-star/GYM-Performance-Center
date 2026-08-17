import React, { useState, useCallback, memo } from 'react';
import { Post, Comment } from '../../types';
import { communityApi } from '../../api/community';
import { CommentItem } from './CommentItem';
import { UserProfileModal } from './UserProfileModal';
import { Badge, OptimizedImage } from '../ui';
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PostCardProps {
  post: Post;
  onDelete?: (id: number) => void;
}

const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const PostCardInner: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked || false);
  const [sharesCount, setSharesCount] = useState(post.shares_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const isOwner = user?.id === post.author.id;

  const handleLike = useCallback(async () => {
    try {
      const result = await communityApi.toggleLike(post.id);
      setIsLiked(result.is_liked);
      setLikesCount(result.likes_count);
    } catch {/* silent */}
  }, [post.id]);

  const handleBookmark = useCallback(async () => {
    try {
      const result = await communityApi.toggleBookmark(post.id);
      setIsBookmarked(result.is_bookmarked);
    } catch {/* silent */}
  }, [post.id]);

  const handleShare = useCallback(async () => {
    try {
      const result = await communityApi.sharePost(post.id);
      setSharesCount(result.shares_count);
      if (navigator.share) {
        navigator.share({ title: post.title || 'Check this out!', text: post.content });
      }
    } catch {/* silent */}
  }, [post.id, post.title, post.content]);

  const handleToggleComments = useCallback(async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const data = await communityApi.getComments(post.id);
        setComments(data);
      } catch {/* silent */} finally { setLoadingComments(false); }
    }
    setShowComments((v) => !v);
  }, [showComments, comments.length, post.id]);

  const handleAddComment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const newComment = await communityApi.addComment(post.id, commentText.trim());
      setComments((prev) => [...prev, newComment]);
      setCommentText('');
    } catch {/* silent */} finally { setSubmitting(false); }
  }, [commentText, post.id]);

  const handleReplyAdded = useCallback((newComment: Comment) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === newComment.parent
          ? { ...c, replies: [...(c.replies || []), newComment] }
          : c
      )
    );
  }, []);

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await communityApi.deletePost(post.id);
      onDelete?.(post.id);
    } catch {/* silent */}
  }, [post.id, onDelete]);

  return (
    <article className="g-glass-card mb-4 overflow-hidden">
      {/* Post header */}
      <div className="d-flex justify-content-between align-items-start p-4 pb-0">
        <div 
          className="d-flex align-items-center gap-3" 
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedUserId(post.author.id)}
        >
          {post.author.avatar ? (
            <img src={post.author.avatar} alt={post.author.display_name}
                 className="rounded-circle" style={{ width: 44, height: 44, objectFit: 'cover' }} />
          ) : (
            <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white hover-orange-bg transition"
                 style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#f36100,#ff7a1a)', fontSize: 18 }}>
              {post.author.display_name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h6 className="text-white fw-bold mb-0 hover-orange transition">{post.author.display_name}</h6>
            <div className="d-flex align-items-center gap-2">
              <span className="text-secondary" style={{ fontSize: 12 }}>@{post.author.username}</span>
              {post.author.role === 'trainer' && (
                <Badge variant="warning" style={{ fontSize: 10, padding: '1px 6px' }}>Trainer</Badge>
              )}
              <span className="text-secondary" style={{ fontSize: 11 }}>· {timeAgo(post.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Context menu */}
        {isOwner && (
          <div className="position-relative">
            <button onClick={() => setMenuOpen((v) => !v)}
                    className="btn btn-link text-secondary p-1" style={{ lineHeight: 1 }}>
              <MoreHorizontal size={18} />
            </button>
            {menuOpen && (
              <div className="position-absolute end-0 rounded-3 py-1 shadow-lg" style={{ background: '#1a2332', border: '1px solid rgba(255,255,255,0.1)', minWidth: 140, zIndex: 50 }}>
                <button onClick={handleDelete}
                        className="d-flex align-items-center gap-2 w-100 px-3 py-2 text-danger text-sm border-0 bg-transparent hover-orange">
                  <Trash2 size={14} /> Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 pt-3">
        {post.title && (
          <h5 className="text-white fw-bold mb-2" style={{ fontFamily: 'Oswald' }}>{post.title}</h5>
        )}
        <p className="text-secondary mb-3" style={{ lineHeight: 1.7 }}>{post.content}</p>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag) => (
              <span key={tag.id} className="badge text-warning px-2 py-1 rounded-pill"
                    style={{ background: 'rgba(243,97,0,0.12)', fontSize: 11, cursor: 'pointer' }}>
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Image */}
      {post.image && (
        <div className="px-4 mb-3">
          <OptimizedImage
            src={post.image}
            alt="post image"
            className="w-100 rounded-3"
            blur={true}
            style={{ maxHeight: 380, objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* Stats row */}
      <div className="d-flex px-4 py-2 border-top border-bottom border-white/5 gap-3">
        <span className="text-secondary" style={{ fontSize: 12 }}>{likesCount} likes</span>
        <span className="text-secondary" style={{ fontSize: 12 }}>{post.comments_count} comments</span>
        <span className="text-secondary" style={{ fontSize: 12 }}>{sharesCount} shares</span>
      </div>

      {/* Action buttons */}
      <div className="d-flex px-3 py-2 gap-1">
        <button onClick={handleLike}
                className={`btn btn-link d-flex align-items-center gap-2 text-sm text-decoration-none flex-fill justify-content-center py-2 rounded-3 hover-orange ${isLiked ? 'text-danger' : 'text-secondary'}`}
                style={{ background: 'none', border: 'none' }}>
          <Heart size={17} fill={isLiked ? 'currentColor' : 'none'} /> Like
        </button>
        <button onClick={handleToggleComments}
                className="btn btn-link d-flex align-items-center gap-2 text-sm text-secondary text-decoration-none flex-fill justify-content-center py-2 rounded-3 hover-orange"
                style={{ background: 'none', border: 'none' }}>
          <MessageCircle size={17} /> Comment
        </button>
        <button onClick={handleShare}
                className="btn btn-link d-flex align-items-center gap-2 text-sm text-secondary text-decoration-none flex-fill justify-content-center py-2 rounded-3 hover-orange"
                style={{ background: 'none', border: 'none' }}>
          <Share2 size={17} /> Share
        </button>
        <button onClick={handleBookmark}
                className={`btn btn-link d-flex align-items-center gap-2 text-sm text-decoration-none flex-fill justify-content-center py-2 rounded-3 hover-orange ${isBookmarked ? 'text-warning' : 'text-secondary'}`}
                style={{ background: 'none', border: 'none' }}>
          <Bookmark size={17} fill={isBookmarked ? 'currentColor' : 'none'} /> Save
        </button>
      </div>

      {/* Comment thread */}
      {showComments && (
        <div className="px-4 pb-4 border-top border-white/5 pt-3">
          {loadingComments ? (
            <div className="text-secondary text-sm text-center py-3">Loading comments…</div>
          ) : (
            comments.map((c) => (
              <CommentItem key={c.id} comment={c} postId={post.id} onReplyAdded={handleReplyAdded} />
            ))
          )}

          {/* New comment input */}
          {user && (
            <form onSubmit={handleAddComment} className="d-flex gap-2 mt-3">
              <input value={commentText} onChange={(e) => setCommentText(e.target.value)}
                     placeholder="Write a comment…"
                     className="form-control text-white text-sm rounded-pill px-4"
                     style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', flex: 1 }} />
              <button type="submit" disabled={submitting || !commentText.trim()}
                      className="btn btn-sm rounded-pill px-4 fw-semibold text-white"
                      style={{ background: '#f36100', border: 'none', whiteSpace: 'nowrap' }}>
                {submitting ? '…' : 'Post'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal 
        userId={selectedUserId} 
        isOpen={!!selectedUserId} 
        onClose={() => setSelectedUserId(null)} 
      />
    </article>
  );
};

/**
 * Memoized PostCard — only re-renders when the post data or onDelete reference changes.
 * Custom equality prevents full re-render on parent feed state updates.
 */
export const PostCard = memo(PostCardInner, (prev, next) => {
  return (
    prev.post.id === next.post.id &&
    prev.post.likes_count === next.post.likes_count &&
    prev.post.comments_count === next.post.comments_count &&
    prev.post.shares_count === next.post.shares_count &&
    prev.post.bookmarks_count === next.post.bookmarks_count &&
    prev.post.is_liked === next.post.is_liked &&
    prev.post.is_bookmarked === next.post.is_bookmarked &&
    prev.onDelete === next.onDelete
  );
});

export default PostCard;
