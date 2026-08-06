import React from 'react';
import { motion } from 'motion/react';
import { Order } from '../../types';
import { Wallet, CreditCard, Landmark, Globe } from 'lucide-react';

const METHOD_META: Record<string, { label: string; icon: React.FC<{ className?: string }>; classes: string }> = {
  cash: { label: 'Cash', icon: Wallet, classes: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  card: { label: 'Card', icon: CreditCard, classes: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  eft: { label: 'EFT', icon: Landmark, classes: 'bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  online: { label: 'Online', icon: Globe, classes: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' },
};

interface PaymentMethodChartProps {
  orders: Order[];
}

export const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({ orders }) => {
  const counts: Record<string, number> = {};
  orders.forEach((o) => {
    if (o.status === 'cancelled' || o.status === 'refunded') return;
    const m = o.paymentMethod || 'cash';
    counts[m] = (counts[m] || 0) + 1;
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = entries.length ? entries[0][1] : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 rounded-xl glass-panel flex flex-col justify-between h-full"
    >
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Payment Methods</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          How your customers pay
        </p>
      </div>

      {total === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400">No payments recorded yet</div>
      ) : (
        <div className="space-y-4 my-auto py-4">
          {entries.map(([method, count]) => {
            const meta = METHOD_META[method] || { label: method, icon: Wallet, classes: 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300' };
            const Icon = meta.icon;
            const pct = Math.round((count / total) * 100);
            return (
              <div key={method} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${meta.classes}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{meta.label}</span>
                    <span className="text-slate-400">{count} · {pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / max) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="bg-indigo-500 h-1.5 rounded-full"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};