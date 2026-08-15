import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Star,
  ShoppingBag,
  CalendarDays,
  CreditCard,
  Boxes,
  ReceiptText,
  ChartNoAxesCombined,
} from 'lucide-react';

export const MarketingPage: React.FC = () => {

  return (
    <div className="selection:bg-indigo-100 selection:text-indigo-900 relative">
      {/* ─ Hero Section ─────────────────────────────────────── */}
      <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Refined background atmosphere */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-indigo-50/80 via-indigo-100/40 to-transparent dark:from-indigo-950/40 dark:via-indigo-950/20 dark:to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-20 right-0 w-72 h-72 bg-sky-200/30 dark:bg-sky-900/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/20 dark:bg-indigo-900/15 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Copy & CTA */}
            <div className="lg:col-span-6 space-y-6 lg:space-y-7 text-left">
              <h1 className="text-[2rem] leading-[1.15] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Smart solutions for{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                  modern teams
                </span>
              </h1>

              <p className="text-[0.95rem] sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
                My Business OS helps you manage bookings, orders, point of sale, inventory, and analytics — all in one beautiful platform designed for growth.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <NavLink
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </NavLink>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-medium text-slate-500 dark:text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Simple monthly pricing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Easy setup in 2 minutes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dashboard Preview */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Dashboard frame */}
                <div className="relative rounded-2xl sm:rounded-[20px] overflow-hidden bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 ring-1 ring-slate-200/60 dark:ring-slate-700/50">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-700/60">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    <span className="ml-2 text-[10px] text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 px-2.5 py-0.5 rounded font-mono border border-slate-200/60 dark:border-slate-700/40">
                      app.grafixos.com/dashboard
                    </span>
                  </div>

                  {/* Dashboard content */}
                  <div className="p-4 sm:p-5 bg-slate-50/80 dark:bg-slate-950/80 space-y-3.5 sm:space-y-4">
                    {/* Welcome bar */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          Welcome back, Sarah
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Here's what's happening with your business today.
                        </p>
                      </div>
                      <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/40">
                        This Month
                      </span>
                    </div>

                    {/* Stat cards */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white">
                        <span className="text-[9px] sm:text-[10px] opacity-80 block">Total Revenue</span>
                        <span className="text-sm sm:text-base font-extrabold block mt-0.5">R42,680</span>
                        <span className="text-[8px] sm:text-[9px] opacity-90">+18% vs last month</span>
                      </div>
                      <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-800/80 ring-1 ring-slate-200/60 dark:ring-slate-700/50">
                        <span className="text-[9px] sm:text-[10px] text-slate-400 block">Orders</span>
                        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 block mt-0.5">128</span>
                        <span className="text-[8px] sm:text-[9px] text-emerald-500 font-medium">+12%</span>
                      </div>
                      <div className="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-800/80 ring-1 ring-slate-200/60 dark:ring-slate-700/50">
                        <span className="text-[9px] sm:text-[10px] text-slate-400 block">Bookings</span>
                        <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 block mt-0.5">64</span>
                        <span className="text-[8px] sm:text-[9px] text-emerald-500 font-medium">+8%</span>
                      </div>
                    </div>

                    {/* Revenue chart */}
                    <div className="rounded-xl bg-white dark:bg-slate-800/80 ring-1 ring-slate-200/60 dark:ring-slate-700/50 p-3 sm:p-3.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2.5">
                        Revenue Trend
                      </span>
                      <div className="h-16 sm:h-20 bg-slate-50 dark:bg-slate-900/60 rounded-lg flex items-end p-2 gap-1.5">
                        <div className="w-full bg-indigo-200 dark:bg-indigo-800 h-[30%] rounded-sm" />
                        <div className="w-full bg-indigo-300 dark:bg-indigo-700 h-[50%] rounded-sm" />
                        <div className="w-full bg-indigo-400 dark:bg-indigo-600 h-[65%] rounded-sm" />
                        <div className="w-full bg-indigo-500 dark:bg-indigo-500 h-[85%] rounded-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating insight card — top right */}
                <div className="hidden sm:flex absolute -top-4 -right-6 lg:-right-10 bg-white dark:bg-slate-800 rounded-xl p-2.5 lg:p-3 shadow-lg shadow-slate-900/8 dark:shadow-black/30 ring-1 ring-slate-200/60 dark:ring-slate-700/50 items-center gap-2.5 lg:gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <ChartNoAxesCombined className="w-4 h-4" />
                  </div>
                  <div className="leading-tight">
                    <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                      Real-time Insights
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Instant sync across POS & Web
                    </span>
                  </div>
                </div>

                {/* Floating review card — bottom left */}
                <div className="hidden sm:flex absolute -bottom-4 -left-4 lg:-left-8 bg-white dark:bg-slate-800 rounded-xl p-2.5 lg:p-3 shadow-lg shadow-slate-900/8 dark:shadow-black/30 ring-1 ring-slate-200/60 dark:ring-slate-700/50 items-center gap-2.5 lg:gap-3">
                  <div className="flex items-center -space-x-1.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                      className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-800"
                      alt=""
                    />
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80"
                      className="w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-800"
                      alt=""
                    />
                  </div>
                  <div className="leading-tight">
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-bold text-slate-900 dark:text-slate-100">4.9 / 5</span>
                    </div>
                    <span className="text-[10px] text-slate-400">From 2,500+ business owners</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ───────────────────────────────────── */}
      <section id="features" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-slate-900/50 border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2.5">
              Everything in one OS
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Designed specifically for service & product businesses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                icon: ShoppingBag,
                title: 'Order Management',
                desc: 'Track online store and in-person orders, status workflows, and payment history from a single dashboard.',
              },
              {
                icon: CalendarDays,
                title: 'Online Appointments',
                desc: 'Clients book through your website, then you manage appointments, assign staff, and track statuses.',
              },
              {
                icon: CreditCard,
                title: 'Point of Sale (POS)',
                desc: 'Fast touch checkout for in-person sales, cart calculation, cash, card, and EFT receipts.',
              },
              {
                icon: Boxes,
                title: 'Inventory & Stock Control',
                desc: 'Real-time stock level monitoring, low stock thresholds, and automatic restock indicators.',
              },
              {
                icon: ReceiptText,
                title: 'Invoicing & Billing',
                desc: 'Professional client invoices with draft, sent, paid, and overdue status tracking.',
              },
              {
                icon: ChartNoAxesCombined,
                title: 'Revenue Analytics',
                desc: 'Clear revenue charts, sales reports, customer growth metrics, and business health scores.',
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="group p-6 rounded-2xl bg-white dark:bg-slate-800/50 ring-1 ring-slate-200/60 dark:ring-slate-700/40 hover:ring-indigo-300/60 dark:hover:ring-indigo-700/40 hover:shadow-lg hover:shadow-slate-900/5 dark:hover:shadow-black/20 transition-all duration-200"
                >
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-[0.95rem] font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Band ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-indigo-600 via-indigo-600 to-indigo-700 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Ready to streamline your business operations?
          </h2>
          <p className="text-sm sm:text-base text-indigo-200 max-w-xl mx-auto leading-relaxed">
            Join thousands of salons, barber shops, boutique stores, and service brands on My Business OS.
          </p>
          <NavLink
            to="/login"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-indigo-700 bg-white hover:bg-indigo-50 shadow-lg shadow-indigo-900/20 active:scale-[0.98] transition-all"
          >
            <span>Launch Dashboard Now</span>
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      </section>
    </div>
  );
};
