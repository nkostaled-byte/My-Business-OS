import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShoppingBag,
  Calendar,
  Calculator,
  Package,
  Boxes,
  Users,
  Receipt,
  UserCheck,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';

export const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: ShoppingBag,
      title: 'E-Commerce & Online Store',
      desc: 'Sell your products online through a website built and linked to your dashboard, with orders flowing straight into your business workspace.',
    },
    {
      icon: Calculator,
      title: 'Point of Sale (POS)',
      desc: 'Run in-person sales at the register with products and services, apply discounts, print thermal receipts, and keep a complete order and payment history.',
    },
    {
      icon: Calendar,
      title: 'Online Bookings & Appointments',
      desc: 'Let clients book services through your website, then manage appointments in calendar and list views, assign staff, and track every status.',
    },
    {
      icon: Package,
      title: 'Order Management & Fulfillment',
      desc: 'Track orders from your online store and register, update status workflows, and manage fulfillment and payment history from one dashboard.',
    },
    {
      icon: Boxes,
      title: 'Inventory Tracking',
      desc: 'Monitor stock levels, set reorder thresholds and unit costs, and get low-stock alerts, with quantities kept in sync as orders come in.',
    },
    {
      icon: Receipt,
      title: 'Invoicing with PDFs',
      desc: 'Create invoices with line items, tax, and due dates, then download branded PDFs and email them straight to clients.',
    },
    {
      icon: Users,
      title: 'Customers & CRM',
      desc: 'Keep a central customer list with contact details, last visit, and notes so you can stay on top of repeat business.',
    },
    {
      icon: UserCheck,
      title: 'Staff & Team Access',
      desc: 'Manage team members with roles and specialties, and invite staff with role-based dashboard access and clear permission limits.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      desc: 'Track revenue, orders, bookings, and customers at a glance, with trend charts, top products, and exportable reports.',
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
