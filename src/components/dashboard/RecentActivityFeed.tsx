import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { ActivityItem } from '../../types';
import { EmptyState } from '../common/EmptyState';
import {
  ShoppingBag,
  Calendar,
  CreditCard,
  User,
  Package,
  BellRing,
  Activity,
} from 'lucide-react';

interface RecentActivityFeedProps {
  activities: ActivityItem[];
}

export const RecentActivityFeed: React.FC<RecentActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'booking':
        return <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'customer':
        return <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'product':
        return <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <BellRing className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 rounded-xl bg-white dark:bg-[#0e1116] border border-slate-200/70 dark:border-white/10 shadow-panel flex flex-col justify-between h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Recent Activity
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Latest customer actions and system events
          </p>
        </div>
        <NavLink
          to="/app/orders"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all
        </NavLink>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No recent activity"
          description="Activity logs will populate here as bookings, orders, and sales occur."
          className="my-auto py-8"
        />
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-white/5 my-auto">
          {activities.slice(0, 5).map((act, index) => (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="py-3 flex items-start justify-between gap-3 group hover:bg-slate-50/60 dark:hover:bg-white/5 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  {getActivityIcon(act.type)}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {act.description}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-medium text-slate-400 shrink-0">
                {act.timestamp}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

