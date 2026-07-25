/**
 * Auth Client — Supabase Authentication & Session Management
 * ============================================================
 *
 * Manages Supabase Auth lifecycle for the dashboard:
 * - Google OAuth sign-in
 * - Email/password sign-in and sign-up
 * - Account claiming (POST /api/claim-account)
 * - Session persistence and auto-restore after refresh
 * - Logout
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

// ─── Account Claiming ─────────────────────────────────────────────

async function claimAccount(token: string, businessName?: string): Promise<{ status: string; client?: any }> {
  const result = await api.post('/api/claim-account', {
    businessName: businessName || 'My Business',
  });
  if (!result.success) {
    throw new Error(result.error || 'Failed to claim account.');
  }
  return result.data as { status: string; client?: any };
}

async function claimWithCode(claimCode: string): Promise<{ status: string; client?: any }> {
  const result = await api.post('/api/claim-account/relink', { claimCode });
  if (!result.success) {
    throw new Error(result.error || 'Failed to claim account with code.');
  }
  return result.data as { status: string; client?: any };
}

// ─── Core Auth Functions ──────────────────────────────────────────

// In-memory cache for current auth resolution
let resolvedClientId: string | null = null;
let resolvedBusinessName: string | null = null;

async function resolveAuth(session: Session | null): Promise<AuthState> {
  if (!session?.user) {
    resolvedClientId = null;
    resolvedBusinessName = null;
    return {
      user: null,
      session: null,
      clientId: null,
      businessName: null,
      isAuthenticated: false,
      isLoading: false,
    };
  }

  // Try to claim/link the account (idempotent — returns existing if already linked)
  try {
    const claimResult = await claimAccount(session.access_token);
    const client = claimResult?.client;
    resolvedClientId = client?.client_id || null;
    resolvedBusinessName = client?.business_name || null;
  } catch {
    // If claiming fails, user might be authenticated but not linked yet
    resolvedClientId = null;
    resolvedBusinessName = null;
  }

  return {
    user: session.user,
    session,
    clientId: resolvedClientId,
    businessName: resolvedBusinessName,
    isAuthenticated: true,
    isLoading: false,
  };
}

/**
 * Initialize auth — restore session on app mount
 */
export async function initializeAuth(): Promise<AuthState> {
  const supabase = getSupabaseClient();

  try {
    // Try to restore existing session
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      syncTokenFromSession(session);
    }

    const state = await resolveAuth(session);
    notifyListeners(state);

    // Listen for auth state changes (sign in, sign out, token refresh)
    supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
      syncTokenFromSession(session);
      const newState = await resolveAuth(session);
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
 * Claim account with invitation code (manual relink)
 */
export async function claimWithInviteCode(code: string): Promise<{ status: string; client?: any }> {
  const supabase = getSupabaseClient();
  const session = (await supabase.auth.getSession()).data.session;
  if (!session?.access_token) {
    throw new Error('You must be signed in first.');
  }
  storeToken(session.access_token);
  return claimWithCode(code);
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.auth.signOut();
  clearToken();
  resolvedClientId = null;
  resolvedBusinessName = null;
  const state: AuthState = {
    user: null,
    session: null,
    clientId: null,
    businessName: null,
    isAuthenticated: false,
    isLoading: false,
  };
  notifyListeners(state);
}

/**
 * Refresh auth state manually (e.g. after claim-account)
 */
export async function refreshAuthState(): Promise<AuthState> {
  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session) syncTokenFromSession(session);
  const state = await resolveAuth(session);
  notifyListeners(state);
  return state;
}

/**
 * Get current auth state synchronously
 */
export function getCurrentAuthState(): AuthState {
  return { ...currentAuthState };
}

/**
 * Get resolved client ID from auth state
 */
export function getClientId(): string | null {
  return resolvedClientId;
}

