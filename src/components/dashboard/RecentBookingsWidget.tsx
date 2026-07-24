import React from 'react';
import { NavLink } from 'react-router-dom';
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
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs h-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Recent Bookings</h3>
        <NavLink to="/app/bookings" className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">View all</NavLink>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {recentBookings.map(b => (
            <div key={b.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{b.clientName}</p>
                    <p className="text-slate-500 text-[11px]">{b.serviceName} • {b.time}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                  b.status === 'completed' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
                    : b.status === 'upcoming' || b.status === 'in-progress'
                    ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800' 
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                }`}>
                    {b.status}
                </span>
            </div>
        ))}
      </div>
    </div>
  );
};
