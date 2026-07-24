import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { RevenueDataPoint } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { BarChart3 } from 'lucide-react';

interface RevenueChartProps {
  data: RevenueDataPoint[];
  currencyPrefix?: string;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  data,
  currencyPrefix = 'R',
}) => {
  const [period, setPeriod] = useState('This Month');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Revenue Overview
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track business earnings over time
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer"
        >
          <option>This Month</option>
          <option>Last Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      {data.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No revenue data"
          description="Revenue analytics will appear here once orders or sales are processed."
          className="my-auto py-12"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="w-full h-64 mt-2"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
                tickFormatter={(val) => `${currencyPrefix}${val / 1000}k`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as RevenueDataPoint;
                    return (
                      <div className="bg-slate-900 text-white dark:bg-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1">
                        <p className="font-bold border-b border-slate-700 pb-1">{item.date}</p>
                        <p className="text-violet-300 font-semibold">
                          Revenue: {currencyPrefix}
                          {item.revenue.toLocaleString()}
                        </p>
                        {item.orders && (
                          <p className="text-slate-300">Orders: {item.orders}</p>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7C3AED"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                activeDot={{ r: 6, fill: '#7C3AED', stroke: '#FFF', strokeWidth: 2 }}
                isAnimationActive={true}
                animationDuration={1200}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </motion.div>
  );
};

