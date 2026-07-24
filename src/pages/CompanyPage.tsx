import React from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react';

export const CompanyPage: React.FC = () => {
  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-200/80 dark:border-violet-800 text-xs font-bold text-violet-700 dark:text-violet-300">
          <span>About My Business Systems</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Empowering modern business operations
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Business OS was built with a simple mission: eliminate software fragmentation and equip growing businesses with enterprise-grade operational tools at an affordable price.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
          <ShieldCheck className="w-10 h-10 text-violet-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Security & Reliability</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Encrypted data storage, 99.9% uptime SLA, and automated daily backups for peace of mind.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
          <Heart className="w-10 h-10 text-violet-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Customer First</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Dedicated customer support team ready to assist with onboardings, training, and custom setups.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md">
          <Award className="w-10 h-10 text-violet-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Constant Innovation</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Bi-weekly feature updates driven by user feedback and business requirements.
          </p>
        </div>
      </div>
    </div>
  );
};
