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
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('[API Client] getStoredToken()', {
      found: token ? true : false,
      length: token ? token.length : 0,
      preview: token ? token.substring(0, 20) + '...' : null,
    });
    return token;
  } catch {
    console.warn('[API Client] localStorage unavailable for getStoredToken');
    return null;
  }
}

export function storeToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    console.log('[API Client] Token stored:', {
      length: token.length,
      preview: token.substring(0, 20) + '...',
    });
  } catch {
    console.warn('[API Client] localStorage unavailable for storeToken');
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    console.log('[API Client] Token cleared from localStorage');
  } catch {
    console.warn('[API Client] localStorage unavailable for clearToken');
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

export interface PlanInfo {
  id: string;
  name: string;
  tagline: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyBillingText: string;
  yearlyBillingText: string;
  badge?: string;
  isPopular?: boolean;
  isBestValue?: boolean;
  features: string[];
  includedFromPrevious?: string;
}

export interface SubscriptionStatus {
  plan: string;
  plan_name: string;
  plan_started_at: string | null;
  plan_expires_at: string | null;
  subscription_active: boolean;
  has_subscription: boolean;
  customer_code: string | null;
  hosting_plan: string | null;
  hosting_plan_name: string | null;
  hosting_started_at: string | null;
  hosting_expires_at: string | null;
  hosting_subscription_active: boolean;
  hosting_has_subscription: boolean;
}

export type SubscriptionProduct = 'os' | 'hosting';

export interface CheckoutResult {
  product?: SubscriptionProduct;
  authorization_url: string;
  reference: string;
  access_code?: string;
}

export interface VerifyResult {
  product?: SubscriptionProduct;
  plan: string;
  plan_name: string;
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
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      };
      console.log(`[API Client] GET ${url}`, {
        headersKeys: Object.keys(headers),
        hasAuth: !!headers.Authorization,
        authPreview: headers.Authorization ? headers.Authorization.substring(0, 30) + '...' : null,
      });
      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: options?.signal,
      });
      console.log(`[API Client] GET ${url} response:`, {
        status: response.status,
        statusText: response.statusText,
      });
      return handleResponse<T>(response);
    } catch (err: any) {
      console.error(`[API Client] GET ${url} error:`, err?.message);
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
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      };
      console.log(`[API Client] POST ${url}`, {
        headersKeys: Object.keys(headers),
        hasAuth: !!headers.Authorization,
        authPreview: headers.Authorization ? headers.Authorization.substring(0, 30) + '...' : null,
        bodyPreview: body ? JSON.stringify(body).substring(0, 100) : null,
      });
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: options?.signal,
      });
      console.log(`[API Client] POST ${url} response:`, {
        status: response.status,
        statusText: response.statusText,
      });
      return handleResponse<T>(response);
    } catch (err: any) {
      console.error(`[API Client] POST ${url} error:`, err?.message);
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
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      };
      console.log(`[API Client] PUT ${url}`, {
        headersKeys: Object.keys(headers),
        hasAuth: !!headers.Authorization,
        bodyPreview: body ? JSON.stringify(body).substring(0, 100) : null,
      });
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: options?.signal,
      });
      console.log(`[API Client] PUT ${url} response:`, {
        status: response.status,
        statusText: response.statusText,
      });
      const result = await handleResponse<T>(response);
      console.log(`[API Client] PUT ${url} result:`, result);
      return result;
    } catch (err: any) {
      console.error(`[API Client] PUT ${url} error:`, err?.message);
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
   * Delete an uploaded image from R2 by its key
   * DELETE /api/upload?key=<r2-key>
   */
  async deleteUploadedImage(key: string): Promise<ApiResponse<void>> {
    return this.del('/api/upload', { params: { key } });
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

  // ─── Paystack / Subscriptions ────────────────────────────────────

  /**
   * Fetch the plan catalog (public endpoint)
   * GET /api/pricing
   */
  async getPlans(): Promise<ApiResponse<PlanInfo[]>> {
    return this.get<PlanInfo[]>('/api/pricing');
  },

  /**
   * Fetch the web hosting plan catalog (public endpoint)
   * GET /api/pricing/hosting
   */
  async getHostingPlans(): Promise<ApiResponse<PlanInfo[]>> {
    return this.get<PlanInfo[]>('/api/pricing/hosting');
  },

  /**
   * Start a Paystack subscription checkout for a plan
   * POST /api/paystack/checkout
   */
  async createCheckout(
    planId: string,
    billing: 'monthly' | 'yearly' = 'monthly',
    product: SubscriptionProduct = 'os'
  ): Promise<ApiResponse<CheckoutResult>> {
    return this.post<CheckoutResult>('/api/paystack/checkout', { plan: planId, billing, product });
  },

  /**
   * Verify a Paystack transaction and activate the plan
   * GET /api/paystack/verify?reference=...
   */
  async verifyPayment(reference: string): Promise<ApiResponse<VerifyResult>> {
    return this.get<VerifyResult>('/api/paystack/verify', { params: { reference } });
  },

  /**
   * Get the workspace's current subscription status (OS + hosting)
   * GET /api/paystack/status
   */
  async getSubscriptionStatus(): Promise<ApiResponse<SubscriptionStatus>> {
    return this.get('/api/paystack/status');
  },

  /**
   * Cancel a product subscription (default: OS plan, which downgrades to Free)
   * POST /api/paystack/cancel
   */
  async cancelSubscription(
    product: SubscriptionProduct = 'os'
  ): Promise<ApiResponse<{ plan?: string; subscription_active?: boolean; hosting_plan?: string | null }>> {
    return this.post('/api/paystack/cancel', { product });
  },

  // ─── AI Chat ─────────────────────────────────────────────────────

  /**
   * Send a message to the AI assistant
   * POST /api/ai/chat
   */
  async aiChat(
    message: string,
    options?: { history?: { role: 'user' | 'assistant'; content: string }[] }
  ): Promise<ApiResponse<{
    reply: string;
    tools_used: string[];
    pending_action?: PendingAction;
    action_id?: string;
    action_type?: string;
    status?: string;
  }>> {
    return this.post('/api/ai/chat', {
      message,
      history: options?.history || [],
    });
  },

  /**
   * Confirm or cancel a pending AI write action
   * POST /api/ai/confirm
   */
  async confirmAiAction(
    actionId: string,
    confirmed: boolean = true
  ): Promise<ApiResponse<{ reply: string; action_type: string; status: string }>> {
    return this.post('/api/ai/confirm', { action_id: actionId, confirmed });
  },
};

export interface PendingAction {
  id: string;
  type: string;
  label: string;
  destructive: boolean;
  fields: Record<string, string | number>;
}

export default api;

