import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { MY_GRAFIX_LOGO } from '../../constants';
import { Sun, Moon, Menu, X } from 'lucide-react';

const PLATFORM_NAME = 'My Business OS';

export const PublicHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Resources', path: '/resources' },
    { name: 'Company', path: '/company' },
  ];

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 glass-nav transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMobileOpen(false)}>
          <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
            <img src={MY_GRAFIX_LOGO} alt={PLATFORM_NAME} className="w-full h-full object-contain" />
          </div>
          <div className="leading-tight">
            <span className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-100 block">
              {PLATFORM_NAME}
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
              Enterprise Suite
            </span>
          </div>
        </NavLink>

        {/* Center Nav Links — Desktop */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative px-3.5 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50/60 dark:bg-indigo-950/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="relative w-14 h-7 sm:w-16 sm:h-8 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors cursor-pointer flex items-center p-0.5 sm:p-1 shrink-0"
            aria-label="Toggle dark mode"
          >
            <span className="absolute left-1 sm:left-1.5 text-slate-400">
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <span className="absolute right-1 sm:right-1.5 text-slate-400">
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <span
              className={`absolute top-0.5 sm:top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                theme === 'dark' ? 'translate-x-7 sm:translate-x-8' : 'translate-x-0'
              }`}
            />
          </button>

          <NavLink
            to="/login"
            className="hidden sm:inline-flex text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-2 py-1.5"
          >
            Sign in
          </NavLink>

          <NavLink
            to="/login"
            className="hidden sm:inline-flex px-4 py-2 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm shadow-indigo-500/20 active:scale-[0.98] transition-all"
          >
            Get Started
          </NavLink>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-16 sm:top-[72px] z-40 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-xl">
          <nav className="flex flex-col px-6 py-6 gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            <div className="h-px bg-slate-200 dark:bg-slate-800 my-3" />
            <NavLink
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              Sign in
            </NavLink>
            <NavLink
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-4 py-3.5 rounded-xl text-base font-bold text-center text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all shadow-sm shadow-indigo-500/20"
            >
              Get Started
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};
