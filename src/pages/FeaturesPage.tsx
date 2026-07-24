import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Calendar,
  ShoppingBag,
  Calculator,
  Boxes,
  Users,
  Receipt,
  BarChart3,
  ShieldCheck,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Point of Sale (POS) & E-Commerce',
      desc: 'Seamlessly process transactions, accept payments, track inventory, and sync product stock across online and offline sales.',
    },
    {
      icon: Calendar,
      title: 'Online Bookings & Calendar',
      desc: 'Let clients book services, select team members, schedule appointments, and receive automated SMS/Email reminders.',
    },
    {
      icon: Boxes,
      title: 'Smart Inventory Management',
      desc: 'Track low-stock alerts, supplier purchase orders, product variations, barcode scanning, and multi-location quantities.',
    },
    {
      icon: Receipt,
      title: 'Invoicing & Estimates',
      desc: 'Generate branded PDF invoices, send automated payment links, handle tax calculations, and manage recurring billing.',
    },
    {
      icon: Users,
      title: 'Staff & Team Scheduling',
      desc: 'Manage staff rosters, assign service permissions, calculate commissions, and track individual performance.',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics & Reports',
      desc: 'Gain instant clarity on revenue, net margins, top customers, popular services, and sales trends with exportable reports.',
    },
  ];

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-200/80 dark:border-violet-800 text-xs font-bold text-violet-700 dark:text-violet-300">
          <span>Core Capabilities</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Everything you need to power your business
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
          A single unified platform replacing 5+ separate software subscriptions with automated efficiency.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg hover:border-violet-500/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              {feat.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {feat.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-purple-600 text-white p-10 text-center space-y-6 shadow-xl">
        <h2 className="text-3xl font-extrabold">Ready to explore Business OS?</h2>
        <p className="text-violet-100 max-w-xl mx-auto">
          Start your 14-day free trial today. No credit card required.
        </p>
        <NavLink
          to="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-violet-900 font-bold hover:bg-violet-50 transition-colors shadow-md"
        >
          <span>View Plans & Pricing</span>
          <ArrowRight className="w-4 h-4" />
        </NavLink>
      </div>
    </div>
  );
};
