import React from 'react';
import { motion } from 'motion/react';
import { BusinessHealth } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { ShieldCheck } from 'lucide-react';

interface BusinessHealthCardProps {
  health: BusinessHealth | null;
}

export const BusinessHealthCard: React.FC<BusinessHealthCardProps> = ({ health }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Business Health
        </h3>
        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          Operational
        </span>
      </div>

      {!health ? (
        <EmptyState
          icon={ShieldCheck}
          title="Health metrics offline"
          description="Business setup and health indicators will calculate once profile details are initialized."
          className="my-auto py-8"
        />
      ) : (
        <div className="space-y-4 my-auto">
          {/* Profile Completeness */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">Profile Completeness</span>
              <span className="text-slate-900 dark:text-slate-100">{health.profileCompleteness}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${health.profileCompleteness}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-violet-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Setup Checklist */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">Setup Checklist</span>
              <span className="text-slate-900 dark:text-slate-100">{health.setupChecklist}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${health.setupChecklist}%` }}
                transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                className="bg-purple-500 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Customer Satisfaction */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">Customer Satisfaction</span>
              <span className="text-slate-900 dark:text-slate-100">{health.customerSatisfaction}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${health.customerSatisfaction}%` }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="bg-indigo-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Response Rate */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
              <span className="text-slate-700 dark:text-slate-300">Response Rate</span>
              <span className="text-slate-900 dark:text-slate-100">{health.responseRate}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${health.responseRate}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                className="bg-purple-600 h-2 rounded-full"
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

