import React from 'react';
import { motion } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { Customer } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { Users } from 'lucide-react';

interface TopCustomersListProps {
  customers: Customer[];
  currencyPrefix?: string;
}

export const TopCustomersList: React.FC<TopCustomersListProps> = ({
  customers,
  currencyPrefix = 'R',
}) => {
  const sorted = [...customers].sort((a, b) => (Number(b.totalSpent) || 0) - (Number(a.totalSpent) || 0));

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 rounded-xl glass-panel flex flex-col justify-between h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Top Customers
        </h3>
        <NavLink
          to="/app/customers"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View all
        </NavLink>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No customers yet"
          description="Your highest-value customers will appear here as sales grow."
          className="my-auto py-8"
        />
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-white/5 my-auto">
          {sorted.slice(0, 5).map((cust, index) => (
            <motion.div
              key={cust.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              className="py-3 flex items-center justify-between gap-3 group hover:bg-white/50 dark:hover:bg-white/5 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                  {cust.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                    {cust.name}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {Number(cust.ordersCount) || 0} orders · {cust.tier}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">
                  {currencyPrefix}{(Number(cust.totalSpent) || 0).toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};