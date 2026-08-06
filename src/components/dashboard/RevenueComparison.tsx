import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { RevenueDataPoint } from '../../types';

interface RevenueComparisonProps {
  data: RevenueDataPoint[];
  currencyPrefix?: string;
}

export const RevenueComparison: React.FC<RevenueComparisonProps> = ({ data, currencyPrefix = 'R' }) => {
  const { total, avg, best, prevTotal, changePct } = useMemo(() => {
    if (!data.length) return { total: 0, avg: 0, best: null as RevenueDataPoint | null, prevTotal: 0, changePct: 0 };
    const total = data.reduce((s, d) => s + (Number(d.revenue) || 0), 0);
    const avg = total / data.length;
    const half = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, half).reduce((s, d) => s + (Number(d.revenue) || 0), 0);
    const secondHalf = data.slice(half).reduce((s, d) => s + (Number(d.revenue) || 0), 0);
    const current = secondHalf;
    const prevTotal = firstHalf;
    const changePct = prevTotal > 0 ? Math.round(((current - prevTotal) / prevTotal) * 100) : 0;
    const best = data.reduce((b, d) => (d.revenue > (b?.revenue ?? 0) ? d : b), null as RevenueDataPoint | null);
    return { total, avg, best, prevTotal, changePct };
  }, [data]);

  const up = changePct >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 rounded-xl glass-panel flex flex-col justify-between h-full"
    >
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Revenue Performance</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Period-over-period breakdown
        </p>
      </div>

      <div className="my-auto py-4 space-y-4">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase">Total</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            {currencyPrefix}{Math.round(total).toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold ${
            up ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
          }`}>
            {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(changePct)}%
          </span>
          <span className="text-slate-400">vs prior period</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
            <span className="text-[10px] font-semibold uppercase text-slate-400">Avg / period</span>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {currencyPrefix}{Math.round(avg).toLocaleString()}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
            <span className="text-[10px] font-semibold uppercase text-slate-400">Best day</span>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {best ? `${currencyPrefix}${Math.round(best.revenue).toLocaleString()}` : '—'}
            </div>
          </div>
        </div>

        {best && (
          <p className="text-[11px] text-slate-400">
            Best performing period: <span className="font-semibold text-slate-600 dark:text-slate-300">{best.date}</span>
          </p>
        )}
      </div>
    </motion.div>
  );
};