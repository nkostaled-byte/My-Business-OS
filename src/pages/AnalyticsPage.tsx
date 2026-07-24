import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { BookingsDonutChart } from '../components/dashboard/BookingsDonutChart';
import { MotionCard } from '../components/common/MotionCard';
import { TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { ExportDropdown } from '../components/common/ExportDropdown';

export const AnalyticsPage: React.FC = () => {
  const { revenueData, bookingsOverview, stats } = useData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Business Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deep insights into revenue performance, orders, and customer acquisition.
          </p>
        </div>
        <ExportDropdown filename="analytics_report" />
      </div>

      {/* Overview Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MotionCard delay={0.05} className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase">Avg Order Value</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {stats ? `R${Math.round(stats.totalRevenue / (stats.totalOrders || 1))}` : '—'}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium inline-flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +5.4% from last period
          </span>
        </MotionCard>

        <MotionCard delay={0.1} className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase">Repeat Customer Rate</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {stats ? '42.8%' : '—'}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium inline-flex items-center gap-1 mt-1">
            <Users className="w-3 h-3" /> High client retention
          </span>
        </MotionCard>

        <MotionCard delay={0.15} className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase">Fulfillment Rate</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {stats ? '98.2%' : '—'}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium inline-flex items-center gap-1 mt-1">
            <ShoppingBag className="w-3 h-3" /> On-time delivery
          </span>
        </MotionCard>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div>
          <BookingsDonutChart overview={bookingsOverview} />
        </div>
      </div>
    </div>
  );
};

