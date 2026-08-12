import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Booking, BookingStatus } from '../types';
import { CalendarDays as CalendarIcon, List, CheckCircle, XCircle, Eye, X, Phone, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { NewBookingModal } from '../components/dashboard/NewBookingModal';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

function formatDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export const BookingsPage: React.FC = () => {
  const { bookings, isLoading, updateResource } = useData();
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const now = new Date();
  const [calendarYear, setCalendarYear] = useState(now.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(now.getMonth());

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const handleMarkComplete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await updateResource('bookings', id, { status: 'completed' });
    addToast('Booking marked as completed', 'success');
  };

  const handleMarkUpcoming = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await updateResource('bookings', id, { status: 'upcoming' });
    addToast('Booking marked as upcoming', 'success');
  };

  const handleCancelBooking = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await updateResource('bookings', id, { status: 'cancelled' });
    addToast('Booking cancelled', 'info');
  };

  const getStatusBadge = (s: BookingStatus) => {
    switch (s) {
      case 'completed':
        return <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400">Completed</span>;
      case 'upcoming':
        return <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">Upcoming</span>;
      case 'confirmed':
        return <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400">Confirmed</span>;
      case 'in-progress':
        return <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">In Progress</span>;
      case 'cancelled':
        return <span className="text-[10px] font-extrabold uppercase text-rose-600 dark:text-rose-400">Cancelled</span>;
      default:
        return <span className="text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400">{s}</span>;
    }
  };

  const filteredBookings = bookings.filter(b => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      (b.clientName || '').toLowerCase().includes(q) ||
      (b.serviceName || '').toLowerCase().includes(q) ||
      ((b.staffName || '').toLowerCase().includes(q)) ||
      (b.bookingCode || '').toLowerCase().includes(q);

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && b.status === statusFilter;
  });

  const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
  const firstDayOffset = getFirstDayOfMonth(calendarYear, calendarMonth);
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === calendarYear && today.getMonth() === calendarMonth;
  const todayDate = today.getDate();

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Bookings & Appointments</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Manage client appointments and schedules across your team.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsBookingModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </motion.button>

          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setViewMode('calendar')} 
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                viewMode === 'calendar' 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Calendar</span><span className="sm:hidden">Cal</span>
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all ${
                viewMode === 'list' 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> List
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client, service, or staff..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs glass-subtle text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500" 
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
                  ? 'bg-indigo-600 text-white shadow-sm' 
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
        <div className="glass-panel rounded-3xl p-6 space-y-4">
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
        <div className="glass-panel rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead className="bg-slate-50/60 dark:bg-white/5 text-slate-500 uppercase tracking-wider font-semibold">
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
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                {filteredBookings.map(b => (
                  <tr 
                    key={b.id} 
                    onClick={() => setSelectedBooking(b)}
                    className="hover:bg-white/50 dark:hover:bg-white/5 cursor-pointer transition-colors"
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
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {b.status === 'confirmed' && (
                          <button 
                            onClick={(e) => handleMarkUpcoming(b.id, e)}
                            title="Mark as Upcoming"
                            className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors"
                          >
                            <CalendarIcon className="w-4 h-4" />
                          </button>
                        )}
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
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
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
        /* Calendar View */
        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                {MONTH_NAMES[calendarMonth]} {calendarYear}
              </h3>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 hidden sm:inline">Monthly Calendar Overview</span>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs font-bold text-slate-400 py-2 border-b border-slate-100 dark:border-slate-800">
            {DAY_NAMES.map(d => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarCells.map((dayNum, idx) => {
              if (dayNum === null) {
                return <div key={idx} className="min-h-[50px] sm:min-h-[100px]" />;
              }

              const dateStr = formatDateStr(calendarYear, calendarMonth, dayNum);
              const dayBookings = filteredBookings.filter(b => b.date === dateStr);
              const isToday = isCurrentMonth && dayNum === todayDate;

              return (
                <div 
                  key={idx} 
                  className={`min-h-[50px] sm:min-h-[100px] p-1 sm:p-2 rounded-xl sm:rounded-2xl border transition-all ${
                    isToday 
                      ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20' 
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1.5">
                    <span className={`text-[10px] sm:text-xs font-extrabold ${isToday ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900 px-1 sm:px-1.5 py-0.5 rounded-md' : 'text-slate-700 dark:text-slate-300'}`}>
                      {dayNum}
                    </span>
                    {dayBookings.length > 0 && (
                      <span className="text-[8px] sm:text-[10px] font-bold bg-indigo-600 text-white px-1 sm:px-1.5 py-0.2 rounded-full">
                        {dayBookings.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-0.5 sm:space-y-1 overflow-y-auto max-h-[40px] sm:max-h-[70px]">
                    {dayBookings.map(b => (
                      <div 
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className={`p-0.5 sm:p-1.5 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold truncate cursor-pointer transition-transform hover:scale-[1.02] shadow-2xs ${
                          b.status === 'completed' 
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300' 
                            : b.status === 'cancelled'
                            ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                            : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                        }`}
                        title={`${b.clientName} - ${b.serviceName} (${b.time})`}
                      >
                        <span className="opacity-75 hidden sm:inline">{b.time}</span> {b.clientName}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md glass-strong rounded-2xl sm:rounded-3xl overflow-hidden max-h-[calc(100dvh-1.5rem)] flex flex-col">
            <div className="p-4 sm:p-6 border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40 shrink-0">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{selectedBooking.bookingCode}</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedBooking.clientName}</h3>
              </div>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto flex-1 min-h-0">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl glass-subtle">
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

              <div className="flex items-center justify-between p-4 rounded-2xl glass-subtle">
                <span className="text-slate-500 font-medium">Current Status</span>
                {getStatusBadge(selectedBooking.status)}
              </div>

              {selectedBooking.clientPhone && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium">
                  <Phone className="w-4 h-4" />
                  <span>Phone: {selectedBooking.clientPhone}</span>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 border-t border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3 shrink-0">
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

      <NewBookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </div>
  );
};
