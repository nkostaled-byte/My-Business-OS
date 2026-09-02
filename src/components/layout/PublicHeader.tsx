import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { MY_GRAFIX_LOGO } from '../../constants';
import { Sun, Moon } from 'lucide-react';

const PLATFORM_NAME = 'My Business OS';

export const PublicHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Resources', path: '/resources' },
    { name: 'Company', path: '/company' },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Logo */}
        <NavLink to="/" className="flex min-w-0 items-center gap-2 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
            <img src={MY_GRAFIX_LOGO} alt={PLATFORM_NAME} className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0">
            <span className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 block leading-none truncate">
              {PLATFORM_NAME}
            </span>
            <span className="hidden sm:block text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase">
              Enterprise Suite
            </span>
          </div>
        </NavLink>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative py-1 transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-xs shadow-indigo-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="relative w-11 h-7 sm:w-16 sm:h-8 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors cursor-pointer flex items-center p-1"
            aria-label="Toggle dark mode"
          >
            <span className="absolute left-1.5 text-slate-400">
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <span className="absolute right-1.5 text-slate-400">
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <span
              className={`absolute top-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
                theme === 'dark' ? 'translate-x-5 sm:translate-x-8' : 'translate-x-0'
              }`}
            />
          </button>

          <NavLink
            to="/login"
            className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 transition-colors px-1 sm:px-2 whitespace-nowrap"
          >
            Sign in
          </NavLink>

          <NavLink
            to="/login"
            className="hidden sm:inline-block px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            Get Started
          </NavLink>
        </div>
      </div>
    </header>
  );
};
