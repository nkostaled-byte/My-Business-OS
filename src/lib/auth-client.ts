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
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const DEFAULT_AUTH_STATE: AuthState = {
  user: null,
  session: null,
  clientId: null,
  businessName: null,
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

// ─── Business Linking ─────────────────────────────────────────────

/**
 * Check if the authenticated user is already linked to a business.
 * Uses a lightweight GET endpoint — does NOT create anything.
 */
export async function checkClientLink(): Promise<{ linked: boolean; clientId: string | null; businessName: string | null }> {
  const result = await api.get<{ linked: boolean; clientId: string | null; businessName: string | null }>('/api/claim-account/status');
  if (result.success && result.data) {
    return result.data;
  }
  return { linked: false, clientId: null, businessName: null };
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

    try {
      const linkStatus = await checkClientLink();
      if (linkStatus.linked && linkStatus.clientId) {
        clientId = linkStatus.clientId;
        businessName = linkStatus.businessName;
      }
    } catch (linkErr) {
      // If the Worker is unreachable, user still needs to go through onboarding
      console.warn('[Auth] Failed to check business link from Worker:', linkErr);
    }

    const state: AuthState = {
      user: session.user,
      session,
      clientId,
      businessName,
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
      try {
        const linkStatus = await checkClientLink();
        if (linkStatus.linked && linkStatus.clientId) {
          newClientId = linkStatus.clientId;
          newBusinessName = linkStatus.businessName;
        }
      } catch {
        // Worker unreachable — user will be redirected to onboarding
      }

      const newState: AuthState = {
        user: session.user,
        session,
        clientId: newClientId,
        businessName: newBusinessName,
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
 */
export async function setClientInfo(clientId: string, businessName: string): Promise<void> {
  const newState: AuthState = {
    ...currentAuthState,
    clientId,
    businessName,
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
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  const supabase = getSupabaseClient();
  return supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string): Promise<AuthResponse> {
  const supabase = getSupabaseClient();
  return supabase.auth.signUp({ email, password });
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.auth.signOut();
  clearToken();
  const state: AuthState = {
    user: null,
    session: null,
    clientId: null,
    businessName: null,
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
        isAuthenticated: true,
        isLoading: false,
      }
    : {
        user: null,
        session: null,
        clientId: null,
        businessName: null,
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

