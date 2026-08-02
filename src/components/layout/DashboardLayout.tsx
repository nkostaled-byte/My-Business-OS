import React, { useState } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar, STAFF_RESTRICTED_PATHS } from './Sidebar';
import { Header } from './Header';
import { ToastProvider } from '../../context/ToastContext';
import { FloatingActionButton } from '../common/FloatingActionButton';

export const DashboardLayout: React.FC<{ role?: 'owner' | 'admin' | 'staff' | null }> = ({ role }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Staff cannot access admin/settings areas — bounce them back to Overview
  if (role === 'staff' && STAFF_RESTRICTED_PATHS.includes(location.pathname)) {
    return <Navigate to="/app" replace />;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans">
        <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} role={role} />
        
        <div className="lg:pl-64 flex flex-col min-h-screen">
          <Header onOpenMobileMenu={() => setMobileOpen(true)} />
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <FloatingActionButton />
      </div>
    </ToastProvider>
  );
};

