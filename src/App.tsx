import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import posthog from './lib/posthog';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';
import { AIProvider } from './context/AIContext';
import { ToastProvider } from './context/ToastContext';
import { initializeAuth, subscribeToAuth, AuthState, DEFAULT_AUTH_STATE } from './lib/auth-client';
import { PageViewTracker } from './components/analytics/PageViewTracker';

import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

import { MarketingPage } from './pages/MarketingPage';
import { PricingPage } from './pages/PricingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { CompanyPage } from './pages/CompanyPage';

import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { SecurityPage } from './pages/SecurityPage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { WebsiteManagerPage } from './pages/WebsiteManagerPage';

import { OverviewPage } from './pages/OverviewPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { OrdersPage } from './pages/OrdersPage';
import { POSPage } from './pages/POSPage';
import { ProductsPage } from './pages/ProductsPage';
import { ServicesPage } from './pages/ServicesPage';
import { BookingsPage } from './pages/BookingsPage';
import { CustomersPage } from './pages/CustomersPage';
import { LeadsPage } from './pages/LeadsPage';
import { InventoryPage } from './pages/InventoryPage';
import { StaffPage } from './pages/StaffPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { FormsPage } from './pages/FormsPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { BillingPage } from './pages/BillingPage';
import { SettingsPage } from './pages/SettingsPage';
import { PaystackCallbackPage } from './pages/PaystackCallbackPage';

// ─── User Identification ──────────────────────────────────────────

function UserIdentifier({ authState }: { authState: AuthState }) {
  useEffect(() => {
    if (!posthog.__loaded) return;
    if (authState.isAuthenticated && authState.user) {
      posthog.identify(authState.user.id, {
        email: authState.user.email || undefined,
      });
    } else {
      posthog.reset();
    }
  }, [authState.isAuthenticated, authState.user]);

  return null;
}

// ─── Loading Spinner ──────────────────────────────────────────────

function LoadingScreen({ message = 'Restoring session...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
      </div>
    </div>
  );
}

// ─── Auth Guard ───────────────────────────────────────────────────

function AuthGuard({ children, authState }: { children: React.ReactNode; authState: AuthState }) {
  if (authState.isLoading) {
    return <LoadingScreen />;
  }
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// ─── Business Guard ───────────────────────────────────────────────
// Ensures the user has a client_id before accessing the dashboard.
// If no client_id, redirect to onboarding.

function BusinessGuard({ children, authState }: { children: React.ReactNode; authState: AuthState }) {
  if (authState.isLoading) {
    return <LoadingScreen />;
  }
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  // If user is authenticated but has no client_id, send to onboarding
  if (!authState.clientId) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const [authState, setAuthState] = useState<AuthState>(DEFAULT_AUTH_STATE);

  useEffect(() => {
    console.log('[AUTH] App useEffect — starting auth initialization');

    initializeAuth().then((state) => {
      console.log('[AUTH] initializeAuth() resolved, setting state', {
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
        hasUser: !!state.user,
        hasClientId: !!state.clientId,
      });
      setAuthState(state);
    }).catch((err) => {
      console.error('[AUTH] initializeAuth() rejected:', err);
      setAuthState({
        user: null,
        session: null,
        clientId: null,
        businessName: null,
        role: null,
        isAuthenticated: false,
        isLoading: false,
      });
    });

    const unsubscribe = subscribeToAuth((state) => {
      console.log('[AUTH] Auth state changed via subscription', {
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
        hasUser: !!state.user,
      });
      setAuthState(state);
    });
    return unsubscribe;
  }, []);

  return (
    <ThemeProvider>
      <DataProvider>
        <NotificationProvider>
          <AIProvider>
            <ToastProvider>
              <BrowserRouter>
                <PageViewTracker />
                <UserIdentifier authState={authState} />
                <Routes>
                  {/* ─── Public Website Layout ─────────────────────────── */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<MarketingPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/resources" element={<ResourcesPage />} />
                    <Route path="/company" element={<CompanyPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/security" element={<SecurityPage />} />
                  </Route>

                  {/* ─── Standalone Public Pages ───────────────────────── */}
                  <Route path="/login" element={<LoginPage />} />

                  {/* ─── Onboarding (Authenticated, No Business) ───────── */}
                  <Route
                    path="/onboarding"
                    element={
                      <AuthGuard authState={authState}>
                        <OnboardingPage />
                      </AuthGuard>
                    }
                  />

                  {/* ── Paystack callback (Authenticated) ─────────────── */}
                  <Route
                    path="/app/paystack/callback"
                    element={
                      <BusinessGuard authState={authState}>
                        <PaystackCallbackPage />
                      </BusinessGuard>
                    }
                  />

                  {/* ─── Authenticated Dashboard Shell ─────────────────── */}
                  <Route
                    path="/app"
                    element={
                      <BusinessGuard authState={authState}>
                        <DashboardLayout role={authState.role} />
                      </BusinessGuard>
                    }
                  >
                    <Route index element={<OverviewPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="pos" element={<POSPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="services" element={<ServicesPage />} />
                    <Route path="bookings" element={<BookingsPage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="leads" element={<LeadsPage />} />
                    <Route path="inventory" element={<InventoryPage />} />
                    <Route path="staff" element={<StaffPage />} />
                    <Route path="gallery" element={<GalleryPage />} />
                    <Route path="reviews" element={<ReviewsPage />} />
                    <Route path="forms" element={<FormsPage />} />
                    <Route path="website" element={<WebsiteManagerPage />} />
                    <Route path="invoices" element={<InvoicesPage />} />
                    <Route path="billing" element={<BillingPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>

                  {/* ─── Fallback Catch-all ────────────────────────────── */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
            </ToastProvider>
          </AIProvider>
        </NotificationProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
