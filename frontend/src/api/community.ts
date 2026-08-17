import { apiClient } from './apiClient';
import {
  Post,
  Comment,
  Tag,
  UserProfile,
  Notification,
  PaginatedResponse,
} from '../types';

/** Shape of the feed query params */
export interface FeedParams {
  cursor?: string;
  page_size?: number;
  search?: string;
  tag?: string;
  filter?: 'trending' | 'following' | 'bookmarked' | 'latest';
}

export interface CreatePostData {
  title?: string;
  content: string;
  image?: File;
  tag_names?: string[];
}

/**
 * Community / Social API endpoints
 * All methods return typed promises — no raw `any`.
 */
export const communityApi = {
  // -----------------------------------------------------------------------
  // Posts
  // -----------------------------------------------------------------------

  /** Get paginated feed. Supports infinite scroll via `page`. */
  getPosts: async (params: FeedParams = {}): Promise<PaginatedResponse<Post>> => {
    const response = await apiClient.get<PaginatedResponse<Post>>(
      '/community/posts/',
      { params }
    );
    return response.data;
  },

  /** Get single post by ID */
  getPost: async (id: number): Promise<Post> => {
    const response = await apiClient.get<Post>(`/community/posts/${id}/`);
    return response.data;
  },

  /** Create a new post (multipart if image attached) */
  createPost: async (data: CreatePostData): Promise<Post> => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    formData.append('content', data.content);
    if (data.image) formData.append('image', data.image);
    if (data.tag_names?.length) {
      data.tag_names.forEach((t) => formData.append('tag_names', t));
    }
    const response = await apiClient.post<Post>('/community/posts/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /** Update an existing post */
  updatePost: async (id: number, data: Partial<CreatePostData>): Promise<Post> => {
    const formData = new FormData();
    if (data.title !== undefined) formData.append('title', data.title);
    if (data.content !== undefined) formData.append('content', data.content);
    if (data.image) formData.append('image', data.image);
    if (data.tag_names?.length) {
      data.tag_names.forEach((t) => formData.append('tag_names', t));
    }
    const response = await apiClient.patch<Post>(`/community/posts/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /** Delete own post */
  deletePost: async (id: number): Promise<void> => {
    await apiClient.delete(`/community/posts/${id}/`);
  },

  // -----------------------------------------------------------------------
  // Like / Bookmark / Share
  // -----------------------------------------------------------------------

  toggleLike: async (postId: number): Promise<{ is_liked: boolean; likes_count: number }> => {
    const response = await apiClient.post<{ is_liked: boolean; likes_count: number }>(
      `/community/posts/${postId}/like/`
    );
    return response.data;
  },

  toggleBookmark: async (
    postId: number
  ): Promise<{ is_bookmarked: boolean; bookmarks_count: number }> => {
    const response = await apiClient.post<{
      is_bookmarked: boolean;
      bookmarks_count: number;
    }>(`/community/posts/${postId}/bookmark/`);
    return response.data;
  },

  sharePost: async (postId: number): Promise<{ shares_count: number }> => {
    const response = await apiClient.post<{ shares_count: number }>(
      `/community/posts/${postId}/share/`
    );
    return response.data;
  },

  // -----------------------------------------------------------------------
  // Comments & Replies
  // -----------------------------------------------------------------------

  /** Get top-level comments for a post (with nested replies) */
  getComments: async (postId: number): Promise<Comment[]> => {
    const response = await apiClient.get<Comment[]>(
      `/community/posts/${postId}/comments/`
    );
    return response.data;
  },

  /** Add a top-level comment or a reply (pass `parent` id for replies) */
  addComment: async (
    postId: number,
    content: string,
    parent?: number
  ): Promise<Comment> => {
    const response = await apiClient.post<Comment>(
      `/community/posts/${postId}/comments/`,
      { content, parent: parent ?? null }
    );
    return response.data;
  },

  /** Like / unlike a specific comment */
  toggleCommentLike: async (
    postId: number,
    commentId: number
  ): Promise<{ is_liked: boolean; likes_count: number }> => {
    const response = await apiClient.post<{ is_liked: boolean; likes_count: number }>(
      `/community/posts/${postId}/comments/${commentId}/like/`
    );
    return response.data;
  },

  // -----------------------------------------------------------------------
  // Trending
  // -----------------------------------------------------------------------

  getTrendingTags: async (): Promise<Tag[]> => {
    const response = await apiClient.get<Tag[]>('/community/trending/tags/');
    return response.data;
  },

  getTrendingPosts: async (
    page = 1
  ): Promise<PaginatedResponse<Post>> => {
    const response = await apiClient.get<PaginatedResponse<Post>>(
      '/community/trending/posts/',
      { params: { page } }
    );
    return response.data;
  },

  // -----------------------------------------------------------------------
  // User / Follow
  // -----------------------------------------------------------------------

  getUserProfile: async (userId: number): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>(
      `/community/users/${userId}/profile/`
    );
    return response.data;
  },

  toggleFollow: async (
    userId: number
  ): Promise<{ is_following: boolean }> => {
    const response = await apiClient.post<{ is_following: boolean }>(
      `/community/users/${userId}/follow/`
    );
    return response.data;
  },

  getSuggestedUsers: async (): Promise<UserProfile[]> => {
    const response = await apiClient.get<UserProfile[]>(
      '/community/users/suggested/'
    );
    return response.data;
  },

  getPopularTrainers: async (): Promise<UserProfile[]> => {
    const response = await apiClient.get<UserProfile[]>(
      '/community/trainers/popular/'
    );
    return response.data;
  },

  // -----------------------------------------------------------------------
  // Notifications
  // -----------------------------------------------------------------------

  getNotifications: async (
    params: { page?: number; unread?: boolean } = {}
  ): Promise<PaginatedResponse<Notification>> => {
    const response = await apiClient.get<PaginatedResponse<Notification>>(
      '/community/notifications/',
      { params }
    );
    return response.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<{ unread_count: number }>(
      '/community/notifications/unread_count/'
    );
    return response.data.unread_count;
  },

  markNotificationRead: async (id: number): Promise<void> => {
    await apiClient.post(`/community/notifications/${id}/mark_read/`);
  },

  markAllNotificationsRead: async (): Promise<void> => {
    await apiClient.post('/community/notifications/mark_all_read/');
  },
};
