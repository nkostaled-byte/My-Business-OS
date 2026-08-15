import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { StatCardSkeleton } from '../common/Skeleton';

interface StatCardProps {
  title: string;
  value: number | string | null;
  changePercent?: number | null;
  changeLabel?: string;
  icon: LucideIcon;
  isGradient?: boolean;
  currencyPrefix?: string;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  changePercent,
  changeLabel = 'from last month',
  icon: Icon,
  isGradient = false,
  currencyPrefix = 'R',
  isLoading = false,
}) => {
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  const formattedValue =
    value === null || value === undefined
      ? '—'
      : typeof value === 'number'
      ? `${currencyPrefix}${value.toLocaleString()}`
      : value;

  const isPositive = (changePercent ?? 0) >= 0;

  if (isGradient) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          y: -2,
          boxShadow: '0 2px 4px rgba(15,23,42,0.05), 0 14px 32px -8px rgba(15,23,42,0.25)',
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-xl bg-slate-900 dark:bg-[#12161c] p-4 sm:p-6 text-white shadow-panel flex flex-col justify-between h-28 sm:h-38"
      >
        {/* Background decorative sparkline pattern */}
        <div className="absolute right-4 bottom-2 opacity-20 pointer-events-none">
          <svg width="120" height="50" viewBox="0 0 120 50" fill="none">
            <path
              d="M0 40 Q 30 10, 60 30 T 120 10"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </div>

        <div className="flex items-center justify-between z-10">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {title}
          </span>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-200">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="z-10 mt-3">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            {formattedValue}
          </div>
          {changePercent !== null && changePercent !== undefined ? (
            <div className="flex items-center gap-1 mt-1 text-[10px] sm:text-xs text-slate-300 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                ↑ {Math.abs(changePercent)}% {changeLabel}
              </span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 mt-1 block">No change data</span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -2,
        boxShadow: '0 2px 4px rgba(15,23,42,0.04), 0 12px 28px -6px rgba(15,23,42,0.12)',
      }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="p-4 sm:p-6 rounded-xl glass-panel flex flex-col justify-between h-28 sm:h-38"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {formattedValue}
        </div>
        {changePercent !== null && changePercent !== undefined ? (
          <div
            className={`flex items-center gap-1 mt-1 text-[10px] sm:text-xs font-medium ${
              isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>
              {isPositive ? '↑' : '↓'} {Math.abs(changePercent)}% {changeLabel}
            </span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
            No change data
          </span>
        )}
      </div>
    </motion.div>
  );
};

