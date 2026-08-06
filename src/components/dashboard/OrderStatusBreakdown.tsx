import React from 'react';
import { motion } from 'motion/react';
import { Order } from '../../types';

const STATUS_META: Record<string, { label: string; dot: string; bar: string }> = {
  pending: { label: 'Pending', dot: 'bg-amber-500', bar: 'bg-amber-500' },
  processing: { label: 'Processing', dot: 'bg-sky-500', bar: 'bg-sky-500' },
  completed: { label: 'Completed', dot: 'bg-emerald-500', bar: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', dot: 'bg-rose-500', bar: 'bg-rose-500' },
  refunded: { label: 'Refunded', dot: 'bg-slate-400', bar: 'bg-slate-400' },
};

interface OrderStatusBreakdownProps {
  orders: Order[];
}

export const OrderStatusBreakdown: React.FC<OrderStatusBreakdownProps> = ({ orders }) => {
  const counts: Record<string, number> = {};
  orders.forEach((o) => (counts[o.status] = (counts[o.status] || 0) + 1));
  const total = orders.length;
  const max = Math.max(1, ...Object.values(counts));

  if (total === 0) {
    return (
      <div className="p-6 rounded-xl glass-panel flex flex-col justify-between h-full">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Order Status</h3>
        <div className="text-center py-8 text-xs text-slate-400">No orders recorded yet</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 rounded-xl glass-panel flex flex-col justify-between h-full"
    >
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Order Status</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Fulfillment pipeline at a glance
        </p>
      </div>

      <div className="space-y-4 my-auto py-4">
        {Object.entries(STATUS_META).map(([status, meta]) => {
          const count = counts[status] || 0;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={status} className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{meta.label}</span>
                  <span className="text-slate-400">{count} · {pct}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / max) * 100}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`${meta.bar} h-2 rounded-full`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};