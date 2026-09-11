/**
 * Centralized CIRCULA Frontend API Client
 * Configured via VITE_API_URL environment variable with automatic JWT token attachment
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  totalCount?: number;
  page?: number;
  totalPages?: number;
  errors?: Array<{ field?: string; message: string }>;
}

export class ApiError extends Error {
  statusCode?: number;
  errors?: Array<{ field?: string; message: string }>;

  constructor(message: string, statusCode?: number, errors?: any[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// Read API base URL from environment or default to /api
const API_BASE_URL = ((import.meta as any).env?.VITE_API_URL || '/api').replace(/\/$/, '');

// Storage key for client JWT
const TOKEN_STORAGE_KEY = 'circula_auth_token';

export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (e) {
      console.error('Failed to save auth token to localStorage', e);
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear auth token', e);
    }
  },
};

/**
 * Low-level request wrapper with automatic authentication headers, timeout & error parsing
 */
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs = 4000
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = tokenStorage.get();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Setup abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { success: response.ok, message: text };
    }

    if (!response.ok) {
      throw new ApiError(
        data?.message || `HTTP request failed with status ${response.status}`,
        response.status,
        data?.errors
      );
    }

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out while connecting to CIRCULA API', 408);
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || 'Network error occurred while reaching the backend API',
      500
    );
  }
}

export const apiClient = {
  get<T = any>(endpoint: string, options?: RequestInit, timeoutMs?: number) {
    return request<T>(endpoint, { ...options, method: 'GET' }, timeoutMs);
  },

  post<T = any>(endpoint: string, body?: any, options?: RequestInit, timeoutMs?: number) {
    return request<T>(
      endpoint,
      {
        ...options,
        method: 'POST',
        body: body instanceof FormData ? body : JSON.stringify(body),
      },
      timeoutMs
    );
  },

  put<T = any>(endpoint: string, body?: any, options?: RequestInit, timeoutMs?: number) {
    return request<T>(
      endpoint,
      {
        ...options,
        method: 'PUT',
        body: body instanceof FormData ? body : JSON.stringify(body),
      },
      timeoutMs
    );
  },

  patch<T = any>(endpoint: string, body?: any, options?: RequestInit, timeoutMs?: number) {
    return request<T>(
      endpoint,
      {
        ...options,
        method: 'PATCH',
        body: body instanceof FormData ? body : JSON.stringify(body),
      },
      timeoutMs
    );
  },

  delete<T = any>(endpoint: string, options?: RequestInit, timeoutMs?: number) {
    return request<T>(endpoint, { ...options, method: 'DELETE' }, timeoutMs);
  },

  getBaseUrl() {
    return API_BASE_URL;
  },

  token: tokenStorage,
};
