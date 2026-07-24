import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Booking, BookingStatus } from '../types';
import { Calendar as CalendarIcon, List, CheckCircle, XCircle, Eye, X, Phone, User, Clock, Plus, Search } from 'lucide-react';

export const BookingsPage: React.FC = () => {
  const { bookings, isLoading } = useData();
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Local state for bookings management (TODO: Cloudflare Worker sync)
  const [bookingsList, setBookingsList] = useState<Booking[]>(bookings.length > 0 ? bookings : [
    {
      id: 'bk-101',
      bookingCode: '#BK-101',
      clientName: 'John Smith',
      clientPhone: '+27 82 123 4567',
      serviceName: 'Signature Haircut & Beard Trim',
      staffName: 'David K.',
      date: '2026-07-24',
      time: '14:30',
      status: 'upcoming',
      amount: 350,
    },
    {
      id: 'bk-102',
      bookingCode: '#BK-102',
      clientName: 'Thabo Molefe',
      clientPhone: '+27 71 987 6543',
      serviceName: 'Hydrating Scalp Treatment',
      staffName: 'Lerato M.',
      date: '2026-07-24',
      time: '11:00',
      status: 'completed',
      amount: 520,
    },
    {
      id: 'bk-103',
      bookingCode: '#BK-103',
      clientName: 'Chloe Bennett',
      clientPhone: '+27 83 444 5555',
      serviceName: 'Color Gloss & Blowout',
      staffName: 'Lerato M.',
      date: '2026-07-25',
      time: '09:00',
      status: 'upcoming',
      amount: 850,
    },
    {
      id: 'bk-104',
      bookingCode: '#BK-104',
      clientName: 'Sipho Dlamini',
      clientPhone: '+27 82 555 0192',
      serviceName: 'Express Beard Grooming',
      staffName: 'David K.',
      date: '2026-07-22',
      time: '15:00',
      status: 'cancelled',
      amount: 180,
    }
  ]);

  const handleMarkComplete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    // TODO: Cloudflare Worker API call PATCH /api/bookings/:id/complete
    setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status: 'completed' as BookingStatus } : b));
    addToast('Booking marked as completed', 'success');
  };

  const handleCancelBooking = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    // TODO: Cloudflare Worker API call PATCH /api/bookings/:id/cancel
    setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as BookingStatus } : b));
    addToast('Booking cancelled', 'info');
  };

  const getStatusBadge = (s: BookingStatus) => {
    switch (s) {
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Completed</span>;
      case 'upcoming':
      case 'in-progress':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">Upcoming</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{s}</span>;
    }
  };

  const filteredBookings = bookingsList.filter(b => {
    const matchesSearch = 
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.staffName && b.staffName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && b.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Bookings & Appointments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage client appointments and schedules across your team.</p>
        </div>

        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setViewMode('calendar')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'calendar' 
                ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <CalendarIcon className="w-4 h-4" /> Calendar View
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'list' 
                ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-sm' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <List className="w-4 h-4" /> List View
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client, service, or staff..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-violet-500" 
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'upcoming', 'completed', 'cancelled'] as const).map(f => (
            <button 
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                statusFilter === f 
                  ? 'bg-violet-600 text-white shadow-sm' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 animate-pulse">
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
              </div>
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : viewMode === 'list' ? (
        /* List View Table */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Staff</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredBookings.map(b => (
                  <tr 
                    key={b.id} 
                    onClick={() => setSelectedBooking(b)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{b.clientName}</p>
                      <p className="text-[11px] text-slate-500">{b.clientPhone || b.bookingCode}</p>
                    </td>
                    <td className="p-4 font-semibold text-slate-800 dark:text-slate-200">{b.serviceName}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{b.staffName || 'Unassigned'}</td>
                    <td className="p-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{b.date}</p>
                      <p className="text-[11px] text-slate-500">{b.time}</p>
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">R{b.amount}</td>
                    <td className="p-4">{getStatusBadge(b.status)}</td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => setSelectedBooking(b)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-violet-50 hover:text-violet-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {b.status !== 'completed' && (
                          <button 
                            onClick={(e) => handleMarkComplete(b.id, e)}
                            title="Mark Complete"
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button 
                            onClick={(e) => handleCancelBooking(b.id, e)}
                            title="Cancel Booking"
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="p-16 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-violet-600 dark:text-violet-400">
                <CalendarIcon className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No bookings found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                No appointments match your current filter or search criteria.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Calendar View (Monthly Grid Simulation for July 2026) */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">July 2026 Schedule</h3>
            <span className="text-xs font-semibold text-slate-500">Monthly Calendar Overview</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 py-2 border-b border-slate-100 dark:border-slate-800">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 31 }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `2026-07-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
              const dayBookings = filteredBookings.filter(b => b.date === dateStr);
              const isToday = dayNum === 24;

              return (
                <div 
                  key={idx} 
                  className={`min-h-[100px] p-2 rounded-2xl border transition-all ${
                    isToday 
                      ? 'border-violet-500 bg-violet-50/20 dark:bg-violet-950/20' 
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs font-extrabold ${isToday ? 'text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900 px-1.5 py-0.5 rounded-md' : 'text-slate-700 dark:text-slate-300'}`}>
                      {dayNum}
                    </span>
                    {dayBookings.length > 0 && (
                      <span className="text-[10px] font-bold bg-violet-600 text-white px-1.5 py-0.2 rounded-full">
                        {dayBookings.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-[70px]">
                    {dayBookings.map(b => (
                      <div 
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className={`p-1.5 rounded-xl text-[10px] font-bold truncate cursor-pointer transition-transform hover:scale-[1.02] shadow-2xs ${
                          b.status === 'completed' 
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300' 
                            : b.status === 'cancelled'
                            ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                            : 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300'
                        }`}
                        title={`${b.clientName} - ${b.serviceName} (${b.time})`}
                      >
                        <span className="opacity-75">{b.time}</span> {b.clientName}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div>
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{selectedBooking.bookingCode}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedBooking.clientName}</h3>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block font-medium">Service</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{selectedBooking.serviceName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Staff Member</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{selectedBooking.staffName || 'Unassigned'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Date & Time</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{selectedBooking.date} at {selectedBooking.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Amount Due</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">R{selectedBooking.amount}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-medium">Current Status</span>
                {getStatusBadge(selectedBooking.status)}
              </div>

              {selectedBooking.clientPhone && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-medium">
                  <Phone className="w-4 h-4" />
                  <span>Phone: {selectedBooking.clientPhone}</span>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3">
              {selectedBooking.status !== 'completed' && (
                <button 
                  onClick={(e) => {
                    handleMarkComplete(selectedBooking.id, e);
                    setSelectedBooking(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <CheckCircle className="w-4 h-4" /> Mark Complete
                </button>
              )}
              {selectedBooking.status !== 'cancelled' && (
                <button 
                  onClick={(e) => {
                    handleCancelBooking(selectedBooking.id, e);
                    setSelectedBooking(null);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <XCircle className="w-4 h-4" /> Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TODO: Cloudflare Worker Backend Integration Note
          - GET /api/bookings: Fetch calendar bookings list
          - PATCH /api/bookings/:id: Update booking details or status
          - POST /api/bookings/:id/complete: Mark booking as completed
          - POST /api/bookings/:id/cancel: Cancel booking
      */}
    </div>
  );
};
