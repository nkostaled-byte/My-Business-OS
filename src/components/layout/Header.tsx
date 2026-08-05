import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  ExternalLink,
  Settings,
  LogOut,
  Globe,
  Loader2,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import api from '../../lib/api-client';
import { signOut, getCurrentAuthState } from '../../lib/auth-client';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

interface SearchResult {
  result_type: 'customer' | 'product' | 'submission' | 'invoice' | 'booking' | 'order';
  id: string;
  title: string;
  subtitle: string;
  created_at: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { theme, toggleTheme } = useTheme();
  const { profileName, profileEmail, profileAvatar, refreshAll } = useData();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<{ id: number; title: string; time: string; read: boolean }[]>([]);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Global search with 300ms debounce
  const performSearch = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    setSearching(true);
    try {
      const result = await api.get<{ results: SearchResult[] }>('/api/search', { params: { q } });
      if (result.success && result.data?.results) {
        setSearchResults(result.data.results);
        setSearchOpen(result.data.results.length > 0);
      } else {
        setSearchResults([]);
        setSearchOpen(false);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleSearchResultClick = (result: SearchResult) => {
    setSearchOpen(false);
    setSearchQuery('');
    const resourceMap: Record<string, string> = {
      customer: '/app/customers',
      product: '/app/products',
      submission: '/app/forms',
      invoice: '/app/invoices',
      booking: '/app/bookings',
      order: '/app/orders',
    };
    const path = resourceMap[result.result_type] || '/app';
    navigate(path);
  };

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-[#0a0c0f]/85 backdrop-blur-md border-b border-slate-200/70 dark:border-white/5 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Side: Mobile Menu Button & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md" ref={searchRef}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setSearchOpen(true); }}
              className="w-full pl-9 pr-12 py-2 bg-white dark:bg-[#12161c] border border-slate-200/80 dark:border-white/10 rounded-lg text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-panel focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-mono font-medium text-slate-400 shadow-panel">
              ⌘K
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-1 rounded-lg bg-white dark:bg-[#12161c] shadow-popover border border-slate-200 dark:border-white/10 py-1.5 z-50 max-h-64 overflow-y-auto"
                >
                  {searching && (
                    <div className="flex items-center justify-center py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    </div>
                  )}
                  {!searching && searchResults.length === 0 && (
                    <div className="px-3 py-3 text-xs text-slate-400 text-center">
                      No results found
                    </div>
                  )}
                  {!searching && searchResults.map((result) => (
                    <button
                      key={`${result.result_type}-${result.id}`}
                      onClick={() => handleSearchResultClick(result)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                        {result.title}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="capitalize">{result.result_type}</span>
                        <span>·</span>
                        <span>{result.subtitle}</span>
                      </p>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Theme Toggle, Notifications, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.08, rotate: 15 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle light and dark mode"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.15 }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-600" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Notifications Bell Dropdown */}
          <div className="relative">
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
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setNotificationsOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-2 w-72 sm:w-80 rounded-lg bg-white dark:bg-[#12161c] shadow-popover border border-slate-200 dark:border-white/10 py-2 z-30"
                  >
                    <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                          className="text-[11px] font-medium text-violet-600 dark:text-violet-400 hover:underline cursor-pointer"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-2"
                        >
                          <div>
                            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
                              {n.title}
                            </p>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {n.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

          {/* User Profile Avatar & Menu */}
          <div className="relative">
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
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-2 w-52 rounded-lg bg-white dark:bg-[#12161c] shadow-popover border border-slate-200 dark:border-white/10 py-1.5 z-30"
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
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          navigate('/app/website');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
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
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
