import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Video, FileText, HelpCircle, ArrowRight } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const articles = [
    {
      type: 'Guide',
      title: 'How to scale your appointment & booking workflow in 2026',
      desc: 'Practical scheduling habits that cut no-shows and keep your team calendar organized.',
    },
    {
      type: 'Case Study',
      title: 'How Apex Salon grew revenue by 42% using Business OS POS',
      desc: 'A deep dive into integrated inventory, POS sales, and online store orders.',
    },
    {
      type: 'Documentation',
      title: 'Setting up custom PDF invoice templates',
      desc: 'Step-by-step tutorial on customizing invoice designs and currency.',
    },
  ];

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
          <span>Knowledge & Guides</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Resources & Guides
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
          Everything you need to master your operations and grow your business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((art, idx) => (
          <div
            key={idx}
            className="glass-panel p-8 rounded-3xl transition-all flex flex-col justify-between"
          >
            <div>
              <span className="inline-block text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                {art.type}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                {art.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {art.desc}
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
            >
              <span>Read article</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
