import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../../context/DataContext';
import { getPageMinPlan, getPlanTier, PLAN_NAMES } from '../../config/plans';
import {
  LayoutDashboard,
  BarChart3,
  ShoppingBag,
  Package,
  Scissors,
  Calendar,
  Users,
  Boxes,
  UserCheck,
  Image,
  Star,
  FileText,
  Receipt,
  CreditCard,
  Settings,
  Calculator,
  Globe,
  Lock,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  role?: 'owner' | 'admin' | 'staff' | null;
}

/** Paths hidden from `staff`-role users (admin/settings areas). */
export const STAFF_RESTRICTED_PATHS = ['/app/website', '/app/invoices', '/app/billing', '/app/settings'];

export const navItems = [
  { label: 'Overview', path: '/app', icon: LayoutDashboard },
  { label: 'Analytics', path: '/app/analytics', icon: BarChart3 },
  { label: 'Website', path: '/app/website', icon: Globe },
  { label: 'Orders', path: '/app/orders', icon: ShoppingBag },
  { label: 'POS', path: '/app/pos', icon: Calculator },
  { label: 'Products', path: '/app/products', icon: Package },
  { label: 'Services', path: '/app/services', icon: Scissors },
  { label: 'Bookings', path: '/app/bookings', icon: Calendar },
  { label: 'Customers', path: '/app/customers', icon: Users },
  { label: 'Inventory', path: '/app/inventory', icon: Boxes },
  { label: 'Staff', path: '/app/staff', icon: UserCheck },
  { label: 'Gallery', path: '/app/gallery', icon: Image },
  { label: 'Reviews', path: '/app/reviews', icon: Star },
  { label: 'Forms', path: '/app/forms', icon: FileText },
  { label: 'Invoices', path: '/app/invoices', icon: Receipt },
  { label: 'Billing', path: '/app/billing', icon: CreditCard },
  { label: 'Settings', path: '/app/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile, role }) => {
  const { businessName, businessLogo, plan, planTier } = useData();
  const [upgradePlan, setUpgradePlan] = useState<string | null>(null);

  // Items that are hidden entirely (role-based) vs. visible-but-locked (plan-based).
  const visibleNav: typeof navItems = [];
  const lockedNav: typeof navItems = [];
  navItems.forEach((item) => {
    // Hide admin/settings areas from staff
    if (role === 'staff' && STAFF_RESTRICTED_PATHS.includes(item.path)) return;
    // Features above the current plan stay visible but are locked behind an upgrade prompt
    if (getPlanTier(getPageMinPlan(item.path)) > planTier) {
      lockedNav.push(item);
      return;
    }
    visibleNav.push(item);
  });

  const openUpgrade = (item: (typeof navItems)[number]) => {
    setUpgradePlan(getPageMinPlan(item.path));
    onCloseMobile();
  };

  const upgradeRequiredName = upgradePlan ? PLAN_NAMES[upgradePlan] || upgradePlan : '';

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
            onClick={onCloseMobile}
          />
        )}
      </AnimatePresence>

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Logo */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center">
                <img src="https://res.cloudinary.com/dvvugpu04/image/upload/v1784904453/My_Grafix_Media_logo_160px_edlkgm.png" alt={businessName} className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                {businessName}
              </h1>
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">
                Business Dashboard
              </p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-4 h-4 shrink-0 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="absolute inset-0 bg-violet-50 dark:bg-violet-950/60 rounded-xl"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          {lockedNav.length > 0 && (
            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Locked features
              </p>
              {lockedNav.map((item) => {
                const Icon = item.icon;
                const required = PLAN_NAMES[getPageMinPlan(item.path)] || getPageMinPlan(item.path);
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => openUpgrade(item)}
                    title={`Requires the ${required} plan`}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-600 w-full text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    <Lock className="w-3 h-3 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Upgrade Button */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Current plan
            </span>
            <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400">
              {PLAN_NAMES[plan] || 'Free'}
            </span>
          </div>
          <NavLink
            to="/app/billing"
            onClick={onCloseMobile}
            className="block w-full py-2.5 text-center text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl shadow-md shadow-violet-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            Upgrade Now
          </NavLink>
        </div>
      </aside>

      {/* Upgrade prompt modal */}
      <AnimatePresence>
        {upgradePlan && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setUpgradePlan(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl px-6 py-8 pointer-events-auto">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  This feature requires the {upgradeRequiredName} plan
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  You're currently on the{' '}
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {PLAN_NAMES[plan] || 'Free'}
                  </span>{' '}
                  plan. Upgrade to unlock {upgradeRequiredName === 'Business' ? 'team management, invoices, gallery, reviews and website tools' : 'advanced features'} and more.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <Link
                    to="/app/billing"
                    onClick={() => setUpgradePlan(null)}
                    className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-md shadow-violet-500/20 transition-all cursor-pointer"
                  >
                    View Plans &amp; Upgrade
                  </Link>
                  <button
                    type="button"
                    onClick={() => setUpgradePlan(null)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Not now
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

