import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Booking } from '../../types';

interface RecentBookingsWidgetProps {
  bookings: Booking[];
}

export const RecentBookingsWidget: React.FC<RecentBookingsWidgetProps> = ({ bookings }) => {
  const recentBookings = bookings.length > 0 ? bookings.slice(0, 5) : [
    { id: 'bk-1', bookingCode: '#BK-101', clientName: 'John Smith', serviceName: 'Signature Haircut & Beard Trim', date: '2026-07-24', time: '14:30', status: 'upcoming', amount: 350 },
    { id: 'bk-2', bookingCode: '#BK-102', clientName: 'Thabo Molefe', serviceName: 'Hydrating Scalp Treatment', date: '2026-07-24', time: '11:00', status: 'completed', amount: 520 },
    { id: 'bk-3', bookingCode: '#BK-103', clientName: 'Sipho Dlamini', serviceName: 'Express Beard Grooming', date: '2026-07-22', time: '15:00', status: 'cancelled', amount: 180 },
  ] as Booking[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 rounded-xl glass-panel h-full space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Bookings</h3>
        <NavLink to="/app/bookings" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">View all</NavLink>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {recentBookings.map(b => (
            <div key={b.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{b.clientName}</p>
                    <p className="text-slate-500 text-[11px]">{b.serviceName} • {b.time}</p>
                </div>
                <span className={`text-[10px] font-extrabold uppercase ${
                  b.status === 'completed' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : b.status === 'upcoming' || b.status === 'in-progress'
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-rose-600 dark:text-rose-400'
                }`}>
                    {b.status}
                </span>
            </div>
        ))}
      </div>
    </motion.div>
  );
};
