/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData } from '../types';
import { authApi } from '../api/auth';
import { apiClient } from '../api/apiClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  socialLogin: (provider: 'google' | 'github', token: string, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth Provider component
 * Manages authentication state and provides auth methods
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // 401 indicates no valid cookie, this is normal
        apiClient.clearTokens();
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const handleUnauthorized = () => setUser(null);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { user: loggedInUser } = await authApi.login(credentials);
    setUser(loggedInUser);
  };

  const socialLogin = async (provider: 'google' | 'github', token: string) => {
    const { user: loggedInUser } = await authApi.socialLogin(provider, token);
    setUser(loggedInUser);
  };

  const register = async (data: RegisterData) => {
    const { user: newUser } = await authApi.register(data);
    setUser(newUser);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    socialLogin,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth hook
 * Access authentication state and methods
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
