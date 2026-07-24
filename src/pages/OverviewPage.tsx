import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/dashboard/StatCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { TopProductsList } from '../components/dashboard/TopProductsList';
import { RecentBookingsWidget } from '../components/dashboard/RecentBookingsWidget';
import { BusinessHealthCard } from '../components/dashboard/BusinessHealthCard';
import { DashboardUpgradeCard } from '../components/dashboard/DashboardUpgradeCard';
import {
  DollarSign,
  ShoppingBag,
  Calendar,
  Users,
  Database,
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const {
    bookings,
    stats,
    revenueData,
    bookingsOverview,
    activities,
    products,
    businessHealth,
    isLoading,
    demoMode,
    toggleDemoMode,
  } = useData();

  const [dateRange, setDateRange] = useState('This Month');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome back, Nkosinathi!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening with your business today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!demoMode && (
            <button
              onClick={toggleDemoMode}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-200/80 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Load Demo Data</span>
            </button>
          )}

          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs focus:outline-hidden cursor-pointer"
            >
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Row of 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={stats?.totalRevenue ?? null}
          changePercent={stats?.totalRevenueChangePercent ?? null}
          icon={DollarSign}
          isGradient={true}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders ?? null}
          changePercent={stats?.totalOrdersChangePercent ?? null}
          icon={ShoppingBag}
          currencyPrefix=""
          isLoading={isLoading}
        />
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings ?? null}
          changePercent={stats?.totalBookingsChangePercent ?? null}
          icon={Calendar}
          currencyPrefix=""
          isLoading={isLoading}
        />
        <StatCard
          title="New Customers"
          value={stats?.newCustomers ?? null}
          changePercent={stats?.newCustomersChangePercent ?? null}
          icon={Users}
          currencyPrefix=""
          isLoading={isLoading}
        />
      </div>

      {/* Middle Row: Revenue Chart (2 cols) & Recent Activity (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueData} />
        </div>
        <div>
          <RecentActivityFeed activities={activities} />
        </div>
      </div>

      {/* Dashboard Upgrade Card */}
      <DashboardUpgradeCard />

      {/* Bottom Row: Top Products, Bookings Overview, Business Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TopProductsList products={products} />
        <RecentBookingsWidget bookings={bookings} />
        <BusinessHealthCard health={businessHealth} />
      </div>
    </div>
  );
};
