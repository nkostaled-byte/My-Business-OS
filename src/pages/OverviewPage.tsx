import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { StatCard } from '../components/dashboard/StatCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { RecentActivityFeed } from '../components/dashboard/RecentActivityFeed';
import { TopProductsList } from '../components/dashboard/TopProductsList';
import { RecentBookingsWidget } from '../components/dashboard/RecentBookingsWidget';
import { BusinessHealthCard } from '../components/dashboard/BusinessHealthCard';
import { DashboardUpgradeCard } from '../components/dashboard/DashboardUpgradeCard';
import { CalendarDays, Plus, CircleDollarSign, ShoppingBag, UserRoundPlus } from 'lucide-react';
import { NewBookingModal } from '../components/dashboard/NewBookingModal';

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
    profileName,
    businessName,
  } = useData();

  const [dateRange, setDateRange] = useState('This Month');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const today = new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const displayName = profileName ? profileName.split(' ')[0] : businessName || 'there';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            {today}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {greeting}, {displayName}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Here's what's happening with {businessName || 'your business'} today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsBookingModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </motion.button>

          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3.5 py-2 rounded-lg text-xs font-medium bg-white dark:bg-[#0e1116] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 shadow-panel focus:outline-hidden cursor-pointer"
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
          icon={CircleDollarSign}
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
          icon={CalendarDays}
          currencyPrefix=""
          isLoading={isLoading}
        />
        <StatCard
          title="New Customers"
          value={stats?.newCustomers ?? null}
          changePercent={stats?.newCustomersChangePercent ?? null}
          icon={UserRoundPlus}
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

      <NewBookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </div>
  );
};
