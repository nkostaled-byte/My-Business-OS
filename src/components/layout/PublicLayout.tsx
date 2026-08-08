import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { CookiesBanner } from './CookiesBanner';
import { AppBackdrop } from '../common/AppBackdrop';

export const PublicLayout: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors overflow-x-hidden flex flex-col justify-between">
      <AppBackdrop />
      <div className="relative z-10">
        <PublicHeader />
        <Outlet />
      </div>
      <PublicFooter />
      <CookiesBanner />
    </div>
  );
};
