import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar, STAFF_RESTRICTED_PATHS } from './Sidebar';
import { Header } from './Header';
import { ToastProvider } from '../../context/ToastContext';
import { FloatingActionButton } from '../common/FloatingActionButton';
import { UpgradeRequired } from '../common/UpgradeRequired';
import { AppBackdrop } from '../common/AppBackdrop';
import { useData } from '../../context/DataContext';
import { getPageMinPlan, getPlanTier } from '../../config/plans';

export const DashboardLayout: React.FC<{ role?: 'owner' | 'admin' | 'staff' | null }> = ({ role }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { planTier } = useData();

  // Staff cannot access admin/settings areas — bounce them back to Overview
  if (role === 'staff' && STAFF_RESTRICTED_PATHS.includes(location.pathname)) {
    return <Navigate to="/app" replace />;
  }

  // Pages that must ALWAYS be accessible (so users can always reach Billing
  // to subscribe, Settings to manage the account, and the Overview dashboard).
  const ALWAYS_OPEN = ['/app', '/app/billing', '/app/settings'];

  // Feature locked by subscription plan — show upgrade prompt instead
  const requiredPlan = getPageMinPlan(location.pathname);
  const locked = !ALWAYS_OPEN.includes(location.pathname) && getPlanTier(requiredPlan) > planTier;
  const content = locked ? <UpgradeRequired requiredPlan={requiredPlan} /> : <Outlet />;

  return (
    <ToastProvider>
      <div className="relative min-h-screen bg-[#f7f8fa] dark:bg-[#0a0c0f] text-slate-900 dark:text-slate-100 transition-colors font-sans">
        <AppBackdrop />
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} role={role} />
        
        <div className="relative z-10 lg:pl-64 flex flex-col min-h-screen">
          <Header onOpenMobileMenu={() => setMobileOpen(true)} />
          
          <main className="flex-1 pt-14 sm:pt-16 px-3 sm:px-6 lg:px-8 pb-6 sm:pb-8 max-w-7xl w-full mx-auto overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {!locked && <FloatingActionButton />}
      </div>
    </ToastProvider>
  );
};

