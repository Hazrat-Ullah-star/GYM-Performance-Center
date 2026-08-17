import { apiClient } from './apiClient';
import { User } from '../types';

/**
 * User API endpoints
 */
export const userApi = {
  /**
   * Get current user profile
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me/');
    return response.data;
  },

  /**
   * Update current user profile
   */
  updateMe: async (data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>('/users/me/', data);
    return response.data;
  },

  /**
   * Upload user avatar
   */
  uploadAvatar: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.patch<User>('/users/me/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUser: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}/`);
    return response.data;
  },
};
