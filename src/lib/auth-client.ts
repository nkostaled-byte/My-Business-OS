/**
 * Auth Client — Supabase Authentication & Session Management
 * ============================================================
 *
 * Manages Supabase Auth lifecycle for the dashboard:
 * - Google OAuth sign-in
 * - Email/password sign-in and sign-up
 * - Business linking (create or claim)
 * - Session persistence and auto-restore after refresh
 * - Logout
 *
 * Important: Authentication and business-linking are DECOUPLED.
 * A user can be authenticated without having a business (client_id).
 * The onboarding flow handles business creation/claiming.
 */

import { createClient, SupabaseClient, Session, AuthResponse, User } from '@supabase/supabase-js';
import { storeToken, clearToken, api } from './api-client';
import { getPostHog } from './posthog';

// ─── Supabase Client ──────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'grafix_supabase_session',
      },
    });
  }
  return supabaseClient;
}

// ─── Auth State ───────────────────────────────────────────────────

export interface AuthState {
  user: User | null;
  session: Session | null;
  clientId: string | null;
  businessName: string | null;
  role: 'owner' | 'admin' | 'staff' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const DEFAULT_AUTH_STATE: AuthState = {
  user: null,
  session: null,
  clientId: null,
  businessName: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
};

// ─── Auth Event Callbacks ─────────────────────────────────────────

type AuthListener = (state: AuthState) => void;
let authListeners: AuthListener[] = [];
let currentAuthState: AuthState = { ...DEFAULT_AUTH_STATE };

export function subscribeToAuth(listener: AuthListener): () => void {
  authListeners.push(listener);
  // Immediately notify with current state
  listener(currentAuthState);
  return () => {
    authListeners = authListeners.filter((l) => l !== listener);
  };
}

function notifyListeners(state: AuthState) {
  currentAuthState = state;
  authListeners.forEach((l) => l(state));
}

// ─── Token Sync ───────────────────────────────────────────────────

function syncTokenFromSession(session: Session | null) {
  if (session?.access_token) {
    storeToken(session.access_token);
  } else {
    clearToken();
  }
}

// ─── Business Link Persistence ────────────────────────────────────
// Persist clientId and businessName in localStorage so they survive
// tab switches, browser refreshes, and Worker cold starts.

const CLIENT_ID_KEY = 'grafix_client_id';
const BUSINESS_NAME_KEY = 'grafix_business_name';

function persistClientLink(clientId: string | null, businessName: string | null): void {
  try {
    if (clientId) {
      localStorage.setItem(CLIENT_ID_KEY, clientId);
      localStorage.setItem(BUSINESS_NAME_KEY, businessName || '');
    } else {
      localStorage.removeItem(CLIENT_ID_KEY);
      localStorage.removeItem(BUSINESS_NAME_KEY);
    }
  } catch {
    // localStorage unavailable
  }
}

function getPersistedClientLink(): { clientId: string | null; businessName: string | null } {
  try {
    const clientId = localStorage.getItem(CLIENT_ID_KEY);
    const businessName = localStorage.getItem(BUSINESS_NAME_KEY);
    return {
      clientId: clientId || null,
      businessName: businessName || null,
    };
  } catch {
    return { clientId: null, businessName: null };
  }
}

// ─── Business Linking ─────────────────────────────────────────────

/**
 * Check if the authenticated user is already linked to a business.
 * Uses a lightweight GET endpoint — does NOT create anything.
 */
export async function checkClientLink(): Promise<{ linked: boolean; clientId: string | null; businessName: string | null; role: 'owner' | 'admin' | 'staff' | null }> {
  const result = await api.get<any>('/api/claim-account/status');
  if (result.success) {
    // Worker returns { success: true, linked: true, clientId: "...", businessName: "...", role: "..." }
    // The api client returns the entire body as `result`, so properties are on `result` directly
    const linked = result.linked === true;
    const clientId = result.clientId || null;
    const businessName = result.businessName || null;
    const role = result.role || null;
    // Persist to localStorage for tab-switch resilience
    if (linked && clientId) {
      persistClientLink(clientId, businessName);
    }
    return { linked, clientId, businessName, role };
  }
  return { linked: false, clientId: null, businessName: null, role: null };
}

/**
 * Create a new business (client) and link it to the authenticated user.
 * POST /api/claim-account with full business details.
 */
export async function createBusiness(data: {
  businessName: string;
  businessType?: string;
  country?: string;
  currency?: string;
  timezone?: string;
  phone?: string;
  primaryColor?: string;
  logoUrl?: string;
}): Promise<{ status: string; client?: any }> {
  const result = await api.post<any>('/api/claim-account', data);
  if (!result.success) {
    throw new Error(result.error || 'Failed to create business.');
  }
  // Worker returns { success: true, status: "created", client: {...} }
  // The api client returns the entire body as `result`, so `result` itself
  // has the status and client properties directly
  return result as unknown as { status: string; client?: any };
}

/**
 * Claim an existing business by claim code.
 * POST /api/claim-account/relink
 */
export async function claimWithInviteCode(claimCode: string): Promise<{ status: string; client?: any }> {
  const result = await api.post<any>('/api/claim-account/relink', { claimCode });
  if (!result.success) {
    throw new Error(result.error || 'Failed to claim account with code.');
  }
  // Worker returns { success: true, status: "linked", client: {...} }
  // The api client returns the entire body as `result`, so `result` itself
  // has the status and client properties directly
  return result as unknown as { status: string; client?: any };
}

// ─── Core Auth Functions ──────────────────────────────────────────

/**
 * Initialize auth — restore session on app mount.
 * Resolves business ownership from the Worker (database), NOT localStorage.
 * The Worker is the source of truth for business linking.
 */
export async function initializeAuth(): Promise<AuthState> {
  const supabase = getSupabaseClient();

  try {
    // Try to restore existing session
    const { data: { session } } = await supabase.auth.getSession();

    // ─── DIAGNOSTIC: Log session details ───────────────────────────
    console.log('[Auth] initializeAuth session check:', {
      hasSession: !!session,
      userId: session?.user?.id || null,
      email: session?.user?.email || null,
      accessTokenExists: !!session?.access_token,
      accessTokenLength: session?.access_token?.length || 0,
      accessTokenPreview: session?.access_token ? session.access_token.substring(0, 20) + '...' : null,
      refreshTokenExists: !!session?.refresh_token,
    });
    // ───────────────────────────────────────────────────────────────

    if (session) {
      syncTokenFromSession(session);
    }

    if (!session?.user) {
      const state: AuthState = {
        user: null,
        session: null,
        clientId: null,
        businessName: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      };
      currentAuthState = state;
      notifyListeners(state);
      return state;
    }

    // User is authenticated — resolve business ownership from the Worker (database)
    let clientId: string | null = null;
    let businessName: string | null = null;
    let role: AuthState['role'] = null;

    try {
      const linkStatus = await checkClientLink();
      if (linkStatus.linked && linkStatus.clientId) {
        clientId = linkStatus.clientId;
        businessName = linkStatus.businessName;
        role = linkStatus.role;
      }
    } catch (linkErr) {
      // If the Worker is unreachable (e.g. cold start, tab switch), fall back
      // to persisted client link from localStorage so the user isn't
      // incorrectly redirected to onboarding.
      console.warn('[Auth] Failed to check business link from Worker:', linkErr);
      const persisted = getPersistedClientLink();
      if (persisted.clientId) {
        console.log('[Auth] Using persisted client link as fallback:', persisted);
        clientId = persisted.clientId;
        businessName = persisted.businessName;
      }
    }

    const state: AuthState = {
      user: session.user,
      session,
      clientId,
      businessName,
      role,
      isAuthenticated: true,
      isLoading: false,
    };

    // Store in-memory for synchronous access
    currentAuthState = state;
    notifyListeners(state);

    // Listen for auth state changes (sign in, sign out, token refresh)
    supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
      syncTokenFromSession(session);

      if (!session?.user) {
        const newState: AuthState = {
          user: null,
          session: null,
          clientId: null,
          businessName: null,
          role: null,
          isAuthenticated: false,
          isLoading: false,
        };
        currentAuthState = newState;
        notifyListeners(newState);
        return;
      }

      // Re-resolve business link from Worker on auth change
      let newClientId: string | null = null;
      let newBusinessName: string | null = null;
      let newRole: AuthState['role'] = null;
      try {
        const linkStatus = await checkClientLink();
        if (linkStatus.linked && linkStatus.clientId) {
          newClientId = linkStatus.clientId;
          newBusinessName = linkStatus.businessName;
          newRole = linkStatus.role;
        }
      } catch {
        // Worker unreachable — user will be redirected to onboarding
      }

      const newState: AuthState = {
        user: session.user,
        session,
        clientId: newClientId,
        businessName: newBusinessName,
        role: newRole,
        isAuthenticated: true,
        isLoading: false,
      };

      currentAuthState = newState;
      notifyListeners(newState);
    });

    return state;
  } catch (err) {
    const errorState: AuthState = {
      user: null,
      session: null,
      clientId: null,
      businessName: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
    };
    notifyListeners(errorState);
    return errorState;
  }
}

/**
 * Set client ID and business name in auth state after successful onboarding.
 * Called by the onboarding page after create/claim.
 * Persists to localStorage for tab-switch resilience.
 */
export async function setClientInfo(clientId: string, businessName: string): Promise<void> {
  // Persist to localStorage immediately
  persistClientLink(clientId, businessName);
  const newState: AuthState = {
    ...currentAuthState,
    clientId,
    businessName,
    role: 'owner',
  };
  currentAuthState = newState;
  notifyListeners(newState);
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle(): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/app`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  if (error) throw error;
  const ph = getPostHog();
  if (ph) ph.capture('user_signed_in', { method: 'google' });
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  const supabase = getSupabaseClient();
  const response = await supabase.auth.signInWithPassword({ email, password });
  if (response.data.user) {
    const ph = getPostHog();
    if (ph) ph.capture('user_signed_in', { method: 'email' });
  }
  return response;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string): Promise<AuthResponse> {
  const supabase = getSupabaseClient();
  const response = await supabase.auth.signUp({ email, password });
  if (response.data.user) {
    const ph = getPostHog();
    if (ph) ph.capture('user_signed_up', { method: 'email' });
  }
  return response;
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.auth.signOut();
  clearToken();
  // Clear persisted business link
  persistClientLink(null, null);
  const state: AuthState = {
    user: null,
    session: null,
    clientId: null,
    businessName: null,
    role: null,
    isAuthenticated: false,
    isLoading: false,
  };
  currentAuthState = state;
  notifyListeners(state);
}

/**
 * Refresh auth state manually (e.g. after business create/claim)
 */
export async function refreshAuthState(): Promise<AuthState> {
  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session) syncTokenFromSession(session);

  const state: AuthState = session?.user
    ? {
        user: session.user,
        session,
        clientId: null,
        businessName: null,
        role: null,
        isAuthenticated: true,
        isLoading: false,
      }
    : {
        user: null,
        session: null,
        clientId: null,
        businessName: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      };

  currentAuthState = state;
  notifyListeners(state);
  return state;
}

/**
 * Get current auth state synchronously
 */
export function getCurrentAuthState(): AuthState {
  return { ...currentAuthState };
}

