import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ── In-memory response cache ───────────────────────────────────────────────────
interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

class ResponseCache {
  private store = new Map<string, CacheEntry>();

  set(key: string, data: unknown, ttlMs: number): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  get(key: string): unknown | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data;
  }

  /** Invalidate all cache entries whose key starts with the given prefix */
  invalidatePrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }

  clear(): void {
    this.store.clear();
  }
}

const responseCache = new ResponseCache();

/** Endpoints whose GET responses are cached and their TTL in milliseconds */
const CACHE_CONFIG: Record<string, number> = {
  '/community/tags/trending':   5 * 60 * 1000,   // 5 min — tags change rarely
  '/community/posts/trending':  2 * 60 * 1000,   // 2 min — trending refreshes often
  '/community/users/suggested': 10 * 60 * 1000,  // 10 min — user suggestions are stable
  '/community/users/trainers':  10 * 60 * 1000,  // 10 min
};

function getCacheTtl(url: string): number | null {
  for (const [pattern, ttl] of Object.entries(CACHE_CONFIG)) {
    if (url.includes(pattern)) return ttl;
  }
  return null;
}
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Axios instance with pre-configured base URL and interceptors.
 * - Automatically attaches JWT access token to every request
 * - Handles transparent token refresh on 401 errors
 * - In-memory TTL cache for stable GET endpoints (no-dependency)
 */
class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRFToken',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // We no longer need a request interceptor for JWTs because cookies are sent automatically.
    
    // Response interceptor — handle token refresh on 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If we get a 401, try to refresh the token via the HttpOnly refresh cookie
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/token/refresh/') {
          originalRequest._retry = true;

          try {
            await this.refreshAccessToken();
            // Retry the original request
            return this.client(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            window.dispatchEvent(new Event('auth:unauthorized'));
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /** Refresh the access token — deduplicates concurrent refresh calls */
  private async refreshAccessToken(): Promise<void> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      try {
        // The refresh token is in the cookie, backend handles it automatically
        await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {}, { withCredentials: true });
      } catch (error) {
        this.clearTokens();
        throw error;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  // ── Token management ─────────────────────────────────────────────────────────

  public clearTokens() {
    // Only clear local cache, backend handles cookie deletion via logout endpoint
    responseCache.clear();
  }

  // ── HTTP methods with caching ────────────────────────────────────────────────

  /** GET with in-memory TTL cache for stable endpoints */
  public get<T>(url: string, config: Record<string, unknown> = {}) {
    const ttl = getCacheTtl(url);
    if (ttl !== null) {
      const cacheKey = url + (config.params ? JSON.stringify(config.params) : '');
      const cached = responseCache.get(cacheKey);
      if (cached !== null) {
        return Promise.resolve({ data: cached as T });
      }
      return this.client.get<T>(url, config).then((res) => {
        responseCache.set(cacheKey, res.data, ttl);
        return res;
      });
    }
    return this.client.get<T>(url, config);
  }

  /** POST — also invalidates related community caches */
  public post<T>(url: string, data?: unknown, config = {}) {
    responseCache.invalidatePrefix('/community');
    return this.client.post<T>(url, data, config);
  }

  public patch<T>(url: string, data?: unknown, config = {}) {
    responseCache.invalidatePrefix('/community');
    return this.client.patch<T>(url, data, config);
  }

  public put<T>(url: string, data?: unknown, config = {}) {
    responseCache.invalidatePrefix('/community');
    return this.client.put<T>(url, data, config);
  }

  public delete<T>(url: string, config = {}) {
    responseCache.invalidatePrefix('/community');
    return this.client.delete<T>(url, config);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

/**
 * Extract a human-readable error message from an Axios error or generic Error.
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data?.detail) return data.detail;

    if (data?.field_errors) {
      const firstField = Object.keys(data.field_errors)[0];
      return data.field_errors[firstField][0];
    }

    if (typeof data === 'object' && data !== null) {
      const firstKey = Object.keys(data)[0];
      if (Array.isArray(data[firstKey])) return data[firstKey][0];
      if (typeof data[firstKey] === 'string') return data[firstKey];
    }

    return error.message;
  }

  if (error instanceof Error) return error.message;

  return 'An unexpected error occurred';
};
