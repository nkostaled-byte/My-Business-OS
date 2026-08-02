import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';
import { initializeAuth, subscribeToAuth, AuthState, DEFAULT_AUTH_STATE } from './lib/auth-client';

import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';

import { MarketingPage } from './pages/MarketingPage';
import { PricingPage } from './pages/PricingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { CompanyPage } from './pages/CompanyPage';
import { CareersPage } from './pages/CareersPage';
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
import { InventoryPage } from './pages/InventoryPage';
import { StaffPage } from './pages/StaffPage';
import { GalleryPage } from './pages/GalleryPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { FormsPage } from './pages/FormsPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { BillingPage } from './pages/BillingPage';
import { SettingsPage } from './pages/SettingsPage';

// ─── Loading Spinner ──────────────────────────────────────────────

function LoadingScreen({ message = 'Restoring session...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
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
    // Initialize auth session restore
    initializeAuth().then(setAuthState);

    // Subscribe to auth changes
    const unsubscribe = subscribeToAuth(setAuthState);
    return unsubscribe;
  }, []);

  return (
    <ThemeProvider>
      <DataProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* ─── Public Website Layout ─────────────────────────── */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<MarketingPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/company" element={<CompanyPage />} />
                <Route path="/careers" element={<CareersPage />} />
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
      </DataProvider>
    </ThemeProvider>
  );
}
