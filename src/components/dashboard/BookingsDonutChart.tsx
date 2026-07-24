import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BookingOverviewData } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { Calendar } from 'lucide-react';

interface BookingsDonutChartProps {
  overview: BookingOverviewData | null;
}

export const BookingsDonutChart: React.FC<BookingsDonutChartProps> = ({ overview }) => {
  const hasData = overview && overview.total > 0;

  const chartData = hasData
    ? [
        { name: 'Completed', value: overview.completed, color: '#7C3AED' },
        { name: 'Upcoming', value: overview.upcoming, color: '#8B5CF6' },
        { name: 'Cancelled', value: overview.cancelled, color: '#F43F5E' },
      ]
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Bookings Overview
        </h3>
        <NavLink
          to="/app/bookings"
          className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
        >
          View all
        </NavLink>
      </div>

      {!hasData ? (
        <EmptyState
          icon={Calendar}
          title="No bookings recorded"
          description="Appointment statistics will display here as clients book services."
          className="my-auto py-8"
        />
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
          {/* Donut Chart Container */}
          <div className="relative w-36 h-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={58}
                  paddingAngle={3}
                  dataKey="value"
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-none">
                {overview.total}
              </span>
              <span className="text-[10px] font-medium text-slate-400 mt-0.5">
                Total Bookings
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs flex-1 w-full sm:w-auto">
            {chartData.map((item) => {
              const percent = ((item.value / overview.total) * 100).toFixed(1);
              return (
                <div key={item.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-slate-400 font-medium">
                    {item.value} ({percent}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

