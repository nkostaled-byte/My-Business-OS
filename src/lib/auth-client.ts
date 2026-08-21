import { createClient, SupabaseClient, Session, AuthResponse, User } from '@supabase/supabase-js';
import { storeToken, clearToken, api } from './api-client';
import posthog from './posthog';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }
    console.log('[AUTH] Creating Supabase client', { url: SUPABASE_URL, hasAnonKey: !!SUPABASE_ANON_KEY });
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
  authError?: string | null;
}

export const DEFAULT_AUTH_STATE: AuthState = {
  user: null,
  session: null,
  clientId: null,
  businessName: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null,
};

// ─── Auth Event Callbacks ─────────────────────────────────────────

type AuthListener = (state: AuthState) => void;
let authListeners: AuthListener[] = [];
let currentAuthState: AuthState = { ...DEFAULT_AUTH_STATE };
let supabaseAuthListenerRegistered = false;

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

export async function checkClientLink(accessToken?: string): Promise<{ linked: boolean; clientId: string | null; businessName: string | null; role: 'owner' | 'admin' | 'staff' | null }> {
  console.log('[AUTH] Checking client link...');
  const startTime = Date.now();
  const result = await api.get<any>('/api/claim-account/status', { authToken: accessToken, timeoutMs: 30_000 });
  const elapsed = Date.now() - startTime;
  console.log('[AUTH] Client link response received', {
    elapsedMs: elapsed,
    success: result.success,
    hasAuthError: !!result.error,
    hasDirectLinked: 'linked' in result,
    hasDirectClientId: 'clientId' in result,
    hasDataPayload: !!result.data,
  });

  if (result.success) {
    const payload = result.data && typeof result.data === 'object' ? result.data : result;
    const linked = payload.linked === true;
    const clientId = payload.clientId || null;
    const businessName = payload.businessName || null;
    const role = payload.role || null;
    console.log('[AUTH] Client link success:', true, {
      clientIdReturned: !!clientId,
      businessNameReturned: !!businessName,
    });
    if (linked && clientId) {
      persistClientLink(clientId, businessName);
    }
    return { linked, clientId, businessName, role };
  }

  console.warn('[AUTH] Client link request failed', { error: result.error });
  throw new Error(result.error || 'Unable to verify business association.');
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

const AUTH_INIT_TIMEOUT_MS = 40_000;

function makeUnauthenticatedState(): AuthState {
  return {
    user: null,
    session: null,
    clientId: null,
    businessName: null,
    role: null,
    isAuthenticated: false,
    isLoading: false,
    authError: null,
  };
}

function makeAuthErrorState(message: string): AuthState {
  return {
    user: null,
    session: null,
    clientId: null,
    businessName: null,
    role: null,
    isAuthenticated: false,
    isLoading: false,
    authError: message,
  };
}

function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function registerSupabaseAuthListener(supabase: SupabaseClient): void {
  if (supabaseAuthListenerRegistered) return;
  supabaseAuthListenerRegistered = true;

  supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
    console.log('[AUTH] onAuthStateChange fired', { event: _event, hasSession: !!session });

    if (_event === 'INITIAL_SESSION') {
      console.log('[AUTH] Skipping INITIAL_SESSION — handled by initializeAuth()');
      return;
    }

    syncTokenFromSession(session);

    if (!session?.user) {
      const newState = makeUnauthenticatedState();
      currentAuthState = newState;
      notifyListeners(newState);
      return;
    }

    const existingClientId = currentAuthState.clientId;
    if (existingClientId) {
      const newState: AuthState = {
        user: session.user,
        session,
        clientId: existingClientId,
        businessName: currentAuthState.businessName,
        role: currentAuthState.role,
        isAuthenticated: true,
        isLoading: false,
        authError: null,
      };
      currentAuthState = newState;
      notifyListeners(newState);
      return;
    }

    let clientId: string | null = null;
    let businessName: string | null = null;
    let role: AuthState['role'] = null;
    let authError: string | null = null;
    try {
      const linkStatus = await checkClientLink(session.access_token);
      if (linkStatus.linked && linkStatus.clientId) {
        clientId = linkStatus.clientId;
        businessName = linkStatus.businessName;
        role = linkStatus.role;
      }
    } catch (err) {
      console.warn('[AUTH] Auth event client-link lookup failed:', err);
      authError = err instanceof Error ? err.message : 'Unable to verify business association.';
    }

    const newState: AuthState = {
      user: session.user,
      session,
      clientId,
      businessName,
      role,
      isAuthenticated: true,
      isLoading: false,
      authError,
    };
    currentAuthState = newState;
    notifyListeners(newState);
  });
}

export async function initializeAuth(): Promise<AuthState> {
  console.log('[AUTH] App initialization started');

  let safetyTimer: ReturnType<typeof setTimeout>;
  const safetyTimeout = new Promise<AuthState>((resolve) => {
    safetyTimer = setTimeout(() => {
      console.error('[AUTH] SAFETY TIMEOUT: initializeAuth did not complete within', AUTH_INIT_TIMEOUT_MS, 'ms');
      resolve(makeAuthErrorState('Unable to restore your session. Check your connection and try again.'));
    }, AUTH_INIT_TIMEOUT_MS);
  });

  const authInit = _initializeAuthInner();

  try {
    const result = await Promise.race([authInit, safetyTimeout]);
    clearTimeout(safetyTimer!);
    console.log('[AUTH] Auth initialization completed', {
      isAuthenticated: result.isAuthenticated,
      isLoading: result.isLoading,
      hasUser: !!result.user,
      hasClientId: !!result.clientId,
    });
    return result;
  } catch (err) {
    clearTimeout(safetyTimer!);
    console.error('[AUTH] Unexpected error in initializeAuth race:', err);
    const errorState = makeAuthErrorState(getAuthErrorMessage(err, 'Unable to restore your session. Check your connection and try again.'));
    currentAuthState = errorState;
    notifyListeners(errorState);
    return errorState;
  }
}

async function _initializeAuthInner(): Promise<AuthState> {
  const supabase = getSupabaseClient();
  registerSupabaseAuthListener(supabase);

  try {
    console.log('[AUTH] Calling Supabase getSession()');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('[AUTH] getSession() returned error:', sessionError.message);
      throw sessionError;
    }

    console.log('[AUTH] getSession() resolved', {
      sessionFound: !!session,
      accessTokenAvailable: !!session?.access_token,
      refreshTokenAvailable: !!session?.refresh_token,
      userId: session?.user?.id || null,
    });

    if (session) {
      syncTokenFromSession(session);
    }

    if (!session?.user) {
      console.log('[AUTH] No valid session found — showing login');
      const state = makeUnauthenticatedState();
      currentAuthState = state;
      notifyListeners(state);
      return state;
    }

    console.log('[AUTH] Session found — calling checkClientLink()');

    let clientId: string | null = null;
    let businessName: string | null = null;
    let role: AuthState['role'] = null;
    let authError: string | null = null;

    try {
      const linkStatus = await checkClientLink(session.access_token);
      if (linkStatus.linked && linkStatus.clientId) {
        clientId = linkStatus.clientId;
        businessName = linkStatus.businessName;
        role = linkStatus.role;
      }
      console.log('[AUTH] Client ID resolved', { clientId, businessName, role });
    } catch (linkErr) {
      console.warn('[AUTH] checkClientLink() failed:', linkErr);
      authError = linkErr instanceof Error ? linkErr.message : 'Unable to verify business association.';
      const persisted = getPersistedClientLink();
      if (persisted.clientId) {
        console.log('[AUTH] Using persisted client link as fallback:', persisted);
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
      authError,
    };

    currentAuthState = state;
    notifyListeners(state);

    return state;
  } catch (err) {
    console.error('[AUTH] Error in _initializeAuthInner:', err);
    const errorState = makeAuthErrorState(getAuthErrorMessage(err, 'Unable to restore your session. Check your connection and try again.'));
    currentAuthState = errorState;
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
  if (posthog.__loaded) posthog.capture('user_signed_in', { method: 'google' });
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResponse> {
  const supabase = getSupabaseClient();
  const response = await supabase.auth.signInWithPassword({ email, password });
  if (response.data.user && posthog.__loaded) {
    posthog.capture('user_signed_in', { method: 'email' });
  }
  return response;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string): Promise<AuthResponse> {
  const supabase = getSupabaseClient();
  const response = await supabase.auth.signUp({ email, password });
  if (response.data.user && posthog.__loaded) {
    posthog.capture('user_signed_up', { method: 'email' });
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

