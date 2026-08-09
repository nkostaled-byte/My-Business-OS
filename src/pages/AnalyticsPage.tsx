import React from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { SalesChannelChart } from '../components/dashboard/SalesChannelChart';
import { PaymentMethodChart } from '../components/dashboard/PaymentMethodChart';
import { OrderStatusBreakdown } from '../components/dashboard/OrderStatusBreakdown';
import { TopCustomersList } from '../components/dashboard/TopCustomersList';
import { RevenueComparison } from '../components/dashboard/RevenueComparison';
import { MotionCard } from '../components/common/MotionCard';
import { TrendingUp, UsersRoundRound, ShoppingBag } from 'lucide-react';
import { ExportDropdown } from '../components/common/ExportDropdown';

export const AnalyticsPage: React.FC = () => {
  const { revenueData, stats, orders, customers } = useData();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Business Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deep insights into revenue performance, sales channels, and customer value.
          </p>
        </div>
        <ExportDropdown filename="analytics_report" />
      </div>

      {/* Overview Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MotionCard delay={0.05} className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Avg Order Value
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {stats ? `R${Math.round(stats.totalRevenue / (stats.totalOrders || 1))}` : '—'}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium inline-flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +5.4% from last period
          </span>
        </MotionCard>

        <MotionCard delay={0.1} className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
            <UsersRound className="w-3.5 h-3.5" /> Repeat Customer Rate
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {customers.length ? `${Math.min(100, Math.round((customers.filter((c) => c.ordersCount > 1).length / customers.length) * 100))}%` : '—'}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium inline-flex items-center gap-1 mt-1">
            <UsersRound className="w-3 h-3" /> High client retention
          </span>
        </MotionCard>

        <MotionCard delay={0.15} className="p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5" /> Fulfillment Rate
          </span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {orders.length ? `${Math.round((orders.filter((o) => o.status === 'completed').length / orders.length) * 100)}%` : '—'}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium inline-flex items-center gap-1 mt-1">
            <ShoppingBag className="w-3 h-3" /> Completed orders
          </span>
        </MotionCard>
      </div>

      {/* Revenue Trend + Sales Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div>
          <SalesChannelChart orders={orders} />
        </div>
      </div>

      {/* Revenue Comparison + Payment Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <RevenueComparison data={revenueData} />
        </div>
        <div className="lg:col-span-2">
          <PaymentMethodChart orders={orders} />
        </div>
      </div>

      {/* Order Status + Top Customers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OrderStatusBreakdown orders={orders} />
        <TopCustomersList customers={customers} />
      </div>
    </div>
  );
};