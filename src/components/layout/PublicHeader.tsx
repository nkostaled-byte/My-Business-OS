import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { MY_GRAFIX_LOGO } from '../../constants';
import { Sun, Moon } from 'lucide-react';

export const PublicHeader: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { businessName, businessLogo } = useData();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Resources', path: '/resources' },
    { name: 'Company', path: '/company' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src={businessLogo || MY_GRAFIX_LOGO} alt={businessName} className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 block leading-none">
              {businessName}
            </span>
            <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 tracking-wider uppercase">
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
                `relative py-1 transition-colors hover:text-violet-600 dark:hover:text-violet-400 font-semibold ${
                  isActive
                    ? 'text-violet-600 dark:text-violet-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400 shadow-xs shadow-violet-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>

          <NavLink
            to="/login"
            className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-violet-600 transition-colors px-2"
          >
            Sign in
          </NavLink>

          <NavLink
            to="/login"
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-md shadow-violet-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            Get Started
          </NavLink>
        </div>
      </div>
    </header>
  );
};
