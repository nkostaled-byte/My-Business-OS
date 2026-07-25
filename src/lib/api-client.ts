/**
 * API Client — Centralized Worker Communication
 * ===============================================
 *
 * Single reusable HTTP client for all Cloudflare Worker interactions.
 *
 * Rules:
 * - Reads VITE_WORKER_API_URL for the base URL
 * - Auto-attaches Supabase JWT from auth session
 * - Normalizes all Worker responses to { success, data, error }
 * - Handles loading/error callbacks
 * - Provides get, post, put, patch, del, upload helpers
 */

const BASE_URL = import.meta.env.VITE_WORKER_API_URL || '';

if (!BASE_URL) {
  console.warn('[API Client] VITE_WORKER_API_URL is not set. Worker calls will fail.');
}

// ─── Auth Token Management ────────────────────────────────────────

const TOKEN_KEY = 'grafix_auth_token';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function storeToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage may be unavailable
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // localStorage may be unavailable
  }
}

// ─── Response Types ───────────────────────────────────────────────

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiListResponse<T = any> {
  success: boolean;
  data: T[];
  error?: string;
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: any;
  params?: Record<string, string>;
  signal?: AbortSignal;
};

// ─── Helpers ──────────────────────────────────────────────────────

function buildUrl(path: string, params?: Record<string, string>): string {
  const base = BASE_URL.replace(/\/$/, '');
  const url = new URL(`${base}${path.startsWith('/') ? path : `/${path}`}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}

function getAuthHeaders(): Record<string, string> {
  const token = getStoredToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  // Handle 204 No Content
  if (response.status === 204) {
    return { success: true };
  }

  // Handle CSV/text downloads (export endpoint)
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('text/csv')) {
    const blob = await response.blob();
    return { success: true, data: blob as unknown as T };
  }

  let body: any;
  try {
    body = await response.json();
  } catch {
    const text = await response.text().catch(() => '');
    return {
      success: response.ok,
      error: response.ok ? undefined : text || `HTTP ${response.status}`,
    };
  }

  if (!response.ok) {
    return {
      success: false,
      error: body?.error || body?.message || `HTTP ${response.status}`,
    };
  }

  // Worker responses come in { success: true, data: ... } format
  if (body && typeof body === 'object' && 'success' in body) {
    return body as ApiResponse<T>;
  }

  // Fallback: treat the response body itself as the data
  return { success: true, data: body as T };
}

// ─── Main API Client ──────────────────────────────────────────────

export const api = {
  /**
   * GET request
   */
  async get<T = any>(
    path: string,
    options?: { params?: Record<string, string>; signal?: AbortSignal }
  ): Promise<ApiResponse<T>> {
    const url = buildUrl(path, options?.params);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        signal: options?.signal,
      });
      return handleResponse<T>(response);
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error',
      };
    }
  },

  /**
   * POST request
   */
  async post<T = any>(
    path: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = buildUrl(path, options?.params);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: options?.signal,
      });
      return handleResponse<T>(response);
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error',
      };
    }
  },

  /**
   * PUT request
   */
  async put<T = any>(
    path: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = buildUrl(path, options?.params);
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: options?.signal,
      });
      return handleResponse<T>(response);
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error',
      };
    }
  },

  /**
   * PATCH request
   */
  async patch<T = any>(
    path: string,
    body?: any,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.put(path, body, options);
  },

  /**
   * DELETE request
   */
  async del<T = any>(
    path: string,
    options?: { params?: Record<string, string>; signal?: AbortSignal }
  ): Promise<ApiResponse<T>> {
    const url = buildUrl(path, options?.params);
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        signal: options?.signal,
      });
      return handleResponse<T>(response);
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error',
      };
    }
  },

  /**
   * File upload via Worker upload endpoint
   * POST /api/upload?folder=xxx
   */
  async upload(
    file: File | Blob,
    folder: 'logos' | 'profile' | 'products' = 'products'
  ): Promise<ApiResponse<{ url: string; key: string }>> {
    const url = buildUrl('/api/upload', { folder });
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      });
      return handleResponse<{ url: string; key: string }>(response);
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Upload failed',
      };
    }
  },

  /**
   * Build full URL for an API path (for downloads, exports etc.)
   */
  getUrl(path: string, params?: Record<string, string>): string {
    return buildUrl(path, params);
  },

  /**
   * Export a table as CSV via the Worker export endpoint
   * GET /api/export/:table
   */
  async exportCsv(
    table: string
  ): Promise<{ success: boolean; csvContent: string; fileName: string; error?: string }> {
    const url = buildUrl(`/api/export/${encodeURIComponent(table)}`);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        return {
          success: false,
          csvContent: '',
          fileName: '',
          error: body?.error || `HTTP ${response.status}`,
        };
      }

      const csvContent = await response.text();
      const disposition = response.headers.get('Content-Disposition') || '';
      const fileNameMatch = disposition.match(/filename="?([^"]+)"?/);
      const fileName = fileNameMatch
        ? fileNameMatch[1]
        : `${table}-${new Date().toISOString().slice(0, 10)}.csv`;

      return { success: true, csvContent, fileName };
    } catch (err: any) {
      return {
        success: false,
        csvContent: '',
        fileName: '',
        error: err?.message || 'Export failed',
      };
    }
  },

  /**
   * Check if the API is reachable
   */
  async healthCheck(): Promise<boolean> {
    const result = await this.get('/api/health');
    return result.success === true && (result.data as { worker?: boolean })?.worker === true;
  },
};

export default api;

