import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  Settings2,
  LogOut,
  Globe2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { signOut } from '../../lib/auth-client';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  route: string;
  type: 'order' | 'booking' | 'form' | 'invoice';
}

interface NotificationPreferences {
  emailNotifs: boolean;
  bookingNotifs: boolean;
  formNotifs: boolean;
  invoiceNotifs: boolean;
}

const NOTIF_PREFS_KEY = 'notif_preferences';
const NOTIF_READ_KEY = 'notif_read_ids';

const defaultPrefs: NotificationPreferences = {
  emailNotifs: true,
  bookingNotifs: true,
  formNotifs: true,
  invoiceNotifs: true,
};

function loadNotifPrefs(): NotificationPreferences {
  try {
    const raw = localStorage.getItem(NOTIF_PREFS_KEY);
    if (raw) return { ...defaultPrefs, ...JSON.parse(raw) };
  } catch {}
  return defaultPrefs;
}

function loadReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(NOTIF_READ_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function saveReadIds(ids: Set<string>) {
  try {
    localStorage.setItem(NOTIF_READ_KEY, JSON.stringify([...ids]));
  } catch {}
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const { 
    profileName, 
    profileEmail, 
    profileAvatar, 
    orders,
    bookings,
    invoices,
    forms,
  } = useData();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>(loadNotifPrefs);
  const readIdsRef = useRef<Set<string>>(loadReadIds());
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsOpen && notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notificationsOpen]);

  // Close profile on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileOpen && profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  // Generate notifications from local data, respecting preferences and persisting read state
  useEffect(() => {
    const notifs: NotificationItem[] = [];
    const readIds = readIdsRef.current;

    // Recent orders (last 3) - shown when emailNotifs is enabled
    if (notifPrefs.emailNotifs) {
      orders.slice(0, 3).forEach(o => {
        const id = `order-${o.id}`;
        notifs.push({
          id,
          title: `New order ${o.orderNumber} - R${o.totalAmount}`,
          time: new Date(o.createdAt).toLocaleDateString(),
          read: readIds.has(id),
          route: '/app/orders',
          type: 'order',
        });
      });
    }

    // Upcoming bookings (next 3) - shown when bookingNotifs is enabled
    if (notifPrefs.bookingNotifs) {
      bookings.filter(b => b.status === 'upcoming').slice(0, 3).forEach(b => {
        const id = `booking-${b.id}`;
        notifs.push({
          id,
          title: `Booking ${b.bookingCode} with ${b.clientName}`,
          time: `${b.date} at ${b.time}`,
          read: readIds.has(id),
          route: '/app/bookings',
          type: 'booking',
        });
      });
    }

    // Unread form submissions (last 2) - shown when formNotifs is enabled
    if (notifPrefs.formNotifs) {
      forms.filter(f => f.status === 'unread').slice(0, 2).forEach(f => {
        const id = `form-${f.id}`;
        notifs.push({
          id,
          title: `New form submission from ${f.senderName}`,
          time: new Date(f.submittedAt).toLocaleDateString(),
          read: readIds.has(id),
          route: '/app/forms',
          type: 'form',
        });
      });
    }

    // Paid invoices (last 2) - shown when invoiceNotifs is enabled
    if (notifPrefs.invoiceNotifs) {
      invoices.filter(inv => inv.status === 'paid').slice(0, 2).forEach(inv => {
        const id = `invoice-${inv.id}`;
        notifs.push({
          id,
          title: `Invoice ${inv.invoiceNumber} paid - R${inv.total || 0}`,
          time: inv.issuedAt ? new Date(inv.issuedAt).toLocaleDateString() : 'Recently',
          read: readIds.has(id),
          route: '/app/invoices',
          type: 'invoice',
        });
      });
    }

    setNotifications(notifs);
  }, [orders, bookings, forms, invoices, notifPrefs]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const handleNotificationClick = (n: { id: string; route: string }) => {
    setNotificationsOpen(false);
    // Mark as read and persist
    readIdsRef.current.add(n.id);
    saveReadIds(readIdsRef.current);
    setNotifications((prev) => prev.map((notif) => notif.id === n.id ? { ...notif, read: true } : notif));
    navigate(n.route);
  };

  const markAllAsRead = () => {
    const newReadIds = new Set(readIdsRef.current);
    notifications.forEach(n => newReadIds.add(n.id));
    readIdsRef.current = newReadIds;
    saveReadIds(newReadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-20 glass-nav px-3 sm:px-6 py-2.5 sm:py-3 transition-colors border-b border-slate-200/60 dark:border-slate-800/60">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Side: Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Right Side: Theme Toggle, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="relative w-16 h-8 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors cursor-pointer flex items-center p-1"
            aria-label="Toggle light and dark mode"
          >
            <span className="absolute left-1.5 text-slate-400">
              <Sun className="w-4 h-4" />
            </span>
            <span className="absolute right-1.5 text-slate-400">
              <Moon className="w-4 h-4" />
            </span>
            <span
              className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                theme === 'dark' ? 'translate-x-8' : 'translate-x-0'
              }`}
            />
          </button>

          {/* Notifications Bell Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-[#0a0c0f] animate-pulse" />
              )}
            </motion.button>

            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-0 mt-2 w-72 sm:w-80 rounded-lg glass-strong py-2 z-30"
                >
                    <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-2 cursor-pointer"
                        >
                          <div className="flex items-center pt-1">
                            {!n.read && (
                              <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
                              {n.title}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {n.time}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

          {/* User Profile Avatar & Menu */}
          <div className="relative" ref={profileRef}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
                <img
                src={profileAvatar}
                alt={profileName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-white/10"
              />
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-semibold text-slate-900 dark:text-slate-100 leading-none">
                  {profileName}
                </span>
                <span className="block text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                  Owner
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </motion.button>

            <AnimatePresence>
              {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-2 w-52 rounded-lg glass-strong py-1.5 z-30"
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {profileName}
                      </p>
                      <p className="text-[11px] text-slate-400">{profileEmail}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/app/settings');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Settings2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/app/website');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>Website Manager</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log out</span>
                      </button>
                    </div>
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
