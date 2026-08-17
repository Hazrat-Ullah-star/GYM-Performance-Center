import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { communityApi, FeedParams } from '../api/community';
import { PostCard } from '../components/community/PostCard';
import { CreatePostModal } from '../components/community/CreatePostModal';
import { TrendingSidebar } from '../components/community/TrendingSidebar';
import { Badge, SearchBar, Skeleton, EmptyState } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { Users, PlusCircle, Flame, Bookmark, UserCheck, Globe, Sparkles } from 'lucide-react';

type FeedTab = 'latest' | 'trending' | 'following' | 'bookmarked';

const Community: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState<FeedTab>('latest');
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Fetch posts
  const fetchPosts = useCallback(async (reset = false) => {
    if (reset) {
      setLoading(true);
      setPosts([]);
      setCursor(null);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    const currentCursor = reset ? null : cursor;

    const params: FeedParams = {
      cursor: currentCursor || undefined,
      page_size: 10,
      filter: activeTab === 'latest' ? undefined : activeTab,
    };
    if (search) params.search = search;
    if (activeTag) params.tag = activeTag;

    try {
      const data = await communityApi.getPosts(params);
      const newPosts = data.results;
      setPosts((prev) => (reset ? newPosts : [...prev, ...newPosts]));
      
      let nextCursor = null;
      if (data.next) {
        try {
          // Extract cursor parameter from the next URL
          const url = new URL(data.next);
          nextCursor = url.searchParams.get('cursor');
        } catch {
          // handle relative or invalid URL gracefully if needed
        }
      }
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } catch {/* silent */} finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [activeTab, search, activeTag, cursor]);

  // Re-fetch when tab/search/tag changes
  useEffect(() => {
    fetchPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, search, activeTag]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
          fetchPosts(false);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, fetchPosts]);

  const handlePostCreated = useCallback((post: Post) => {
    setPosts((prev) => [post, ...prev]);
  }, []);

  const handlePostDeleted = useCallback((id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleTagSelect = useCallback((slug: string) => {
    setActiveTag((prev) => (prev === slug ? '' : slug));
  }, []);

  // Tabs with memoised icons
  const tabs = useMemo(() => [
    { id: 'latest' as FeedTab, label: 'Latest', icon: <Globe size={15} /> },
    { id: 'trending' as FeedTab, label: 'Trending', icon: <Flame size={15} /> },
    { id: 'following' as FeedTab, label: 'Following', icon: <UserCheck size={15} /> },
    { id: 'bookmarked' as FeedTab, label: 'Saved', icon: <Bookmark size={15} /> },
  ], []);

  return (
    <>
      {/* Page Hero */}
      <section
        className="position-relative py-5 d-flex align-items-center"
        style={{ background: 'radial-gradient(circle at 50% 30%, rgba(243,97,0,0.12) 0%, rgba(8,12,16,1) 80%)', minHeight: '28vh' }}
      >
        <div className="container text-center">
          <Badge variant="primary" className="mb-3 px-3 py-2 inline-flex items-center gap-2">
            <Sparkles size={14} /> ATHLETE COMMUNITY
          </Badge>
          <h1 className="display-4 text-white fw-bold text-uppercase" style={{ fontFamily: 'Oswald' }}>
            Community Hub
          </h1>
          <p className="text-secondary">
            Share your journey, motivate each other, and connect with coaches.
          </p>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-lg mt-3 px-5 rounded-pill text-white fw-bold d-inline-flex align-items-center gap-2"
              style={{ background: '#f36100', border: 'none' }}
            >
              <PlusCircle size={20} /> Create Post
            </button>
          )}
          {!user && (
            <p className="text-secondary text-sm mt-3">
              <Link to="/login" className="text-warning text-decoration-none">Sign in</Link> to post and interact.
            </p>
          )}
        </div>
      </section>

      <section className="spad pt-4">
        <div className="container">
          <div className="row g-4">
            {/* Main Feed */}
            <div className="col-lg-8">
              {/* Feed Controls */}
              <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
                {/* Tabs */}
                <div className="d-flex gap-1 p-1 rounded-pill flex-wrap" style={{ background: '#141b24', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="btn btn-sm rounded-pill px-3 py-1.5 text-xs fw-semibold d-inline-flex align-items-center gap-1.5 transition-all"
                      style={{
                        background: activeTab === tab.id ? '#f36100' : 'transparent',
                        color: activeTab === tab.id ? '#fff' : '#8899aa',
                        border: 'none',
                      }}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="flex-grow-1">
                  <SearchBar
                    placeholder="Search posts…"
                    value={search}
                    onChange={setSearch}
                    debounceMs={400}
                  />
                </div>
              </div>

              {/* Active tag filter pill */}
              {activeTag && (
                <div className="mb-3 d-flex align-items-center gap-2">
                  <span className="text-secondary text-xs">Filtered by:</span>
                  <button
                    onClick={() => setActiveTag('')}
                    className="btn btn-sm rounded-pill text-warning px-3 py-1 d-flex align-items-center gap-1"
                    style={{ background: 'rgba(243,97,0,0.15)', border: 'none', fontSize: 12 }}
                  >
                    #{activeTag} ×
                  </button>
                </div>
              )}

              {/* Skeleton loading */}
              {loading && (
                <div className="d-flex flex-column gap-4">
                  {[1, 2, 3].map((i) => <Skeleton key={i} height="200px" rounded="16px" />)}
                </div>
              )}

              {/* Empty state */}
              {!loading && posts.length === 0 && (
                <EmptyState
                  icon={<Users size={40} />}
                  title="No posts yet"
                  description={
                    activeTab === 'following'
                      ? 'Follow some members or trainers to see their posts here.'
                      : 'Be the first to share something with the community!'
                  }
                  action={
                    user
                      ? <button className="btn btn-warning rounded-pill px-4 py-2" onClick={() => setShowCreateModal(true)}>Create First Post</button>
                      : undefined
                  }
                />
              )}

              {/* Feed */}
              {!loading && posts.map((post) => (
                <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />
              ))}

              {/* Infinite scroll sentinel */}
              <div ref={loaderRef} className="py-3 text-center">
                {loadingMore && (
                  <div className="text-secondary text-sm d-flex align-items-center justify-content-center gap-2">
                    <div className="spinner-border spinner-border-sm text-warning" role="status" />
                    Loading more…
                  </div>
                )}
                {!loadingMore && !hasMore && posts.length > 0 && (
                  <p className="text-secondary text-xs mb-0">You've reached the end of the feed.</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="position-sticky" style={{ top: '90px' }}>
                <TrendingSidebar activeTag={activeTag} onTagSelect={handleTagSelect} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handlePostCreated}
      />
    </>
  );
};

export default Community;
