import { apiClient } from './apiClient';
import { User, LoginCredentials, RegisterData } from '../types';

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<{ user: User; message: string }> => {
    const response = await apiClient.post<{ user: User; message: string }>(
      '/auth/register/',
      data
    );
    return response.data;
  },

  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<{ user: User }> => {
    // Hits the cookie-based token obtain pair view
    await apiClient.post(
      '/auth/token/',
      credentials
    );
    
    // Fetch user data (cookies are sent automatically)
    const userResponse = await apiClient.get<User>('/users/me/');
    
    return {
      user: userResponse.data,
    };
  },

  /**
   * Social Login
   */
  socialLogin: async (provider: 'google' | 'github', token: string): Promise<{ user: User; message: string }> => {
    const response = await apiClient.post<{ user: User; message: string }>(
      '/auth/social/',
      { provider, token }
    );
    return response.data;
  },

  /**
   * Logout - hit backend to clear cookies, then clear local cache
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout/');
    } catch {
      // Ignore network errors on logout
    } finally {
      apiClient.clearTokens();
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me/');
    return response.data;
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/auth/password-reset/',
      { email }
    );
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      '/auth/password-reset/confirm/',
      { token, password }
    );
    return response.data;
  },

  /**
   * Verify Email
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/verify-email/', { token });
    return response.data;
  },

  /**
   * Resend Verification Email
   */
  resendVerification: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/resend-verification/');
    return response.data;
  }
};
