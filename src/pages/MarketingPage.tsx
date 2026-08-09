import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { PRICING_PLANS } from '../data/pricingData';
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
  ShieldCheck,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const MarketingPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { businessName, businessLogo } = useData();

  return (
    <div className="selection:bg-indigo-100 selection:text-indigo-900 relative">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/15 rounded-full blur-3xl -z-10" />
        <div className="absolute top-10 left-10 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Hero Text & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1]">
                Smart solutions for{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                  modern teams
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                My Business OS helps you manage bookings, orders, point of sale, inventory, and analytics — all in one beautiful platform designed for growth.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <NavLink
                  to="/app"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/25 active:scale-[0.98] transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </NavLink>
              </div>

              {/* Reassurance Checkmarks */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Simple monthly pricing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Easy setup in 2 minutes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Right Column: Framed Screenshot / Mockup Composition */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none transform lg:rotate-1 lg:hover:rotate-0 transition-transform duration-500">
                {/* Browser frame container */}
                <div className="glass-panel rounded-3xl p-2 sm:p-3 relative">
                  {/* Fake browser bar */}
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                    <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                    <span className="ml-2 text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-0.5 rounded-md font-mono">
                      https://app.grafixos.com/dashboard
                    </span>
                  </div>

                  {/* Simulated Overview Dashboard UI */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          Welcome back, Sarah
                        </span>
                        <p className="text-[10px] text-slate-400">
                          Here's what's happening with your business today.
                        </p>
                      </div>
                      <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold px-2 py-0.5 rounded-md">
                        This Month
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-600 text-white">
                        <span className="text-[10px] opacity-80 block">Total Revenue</span>
                        <span className="text-base font-extrabold block mt-0.5">R42,680</span>
                        <span className="text-[9px] opacity-90">+18% vs last month</span>
                      </div>
                      <div className="glass-panel rounded-xl p-3">
                        <span className="text-[10px] text-slate-400 block">Orders</span>
                        <span className="text-base font-bold text-slate-900 dark:text-slate-100 block mt-0.5">128</span>
                        <span className="text-[9px] text-emerald-500 font-medium">+12%</span>
                      </div>
                      <div className="glass-panel rounded-xl p-3">
                        <span className="text-[10px] text-slate-400 block">Bookings</span>
                        <span className="text-base font-bold text-slate-900 dark:text-slate-100 block mt-0.5">64</span>
                        <span className="text-[9px] text-emerald-500 font-medium">+8%</span>
                      </div>
                    </div>

                    <div className="glass-panel rounded-xl p-3">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                        Revenue Trend
                      </span>
                      <div className="h-20 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-lg flex items-end p-2 gap-1.5">
                        <div className="w-full bg-indigo-300 dark:bg-indigo-700 h-1/3 rounded-sm" />
                        <div className="w-full bg-indigo-400 dark:bg-indigo-600 h-1/2 rounded-sm" />
                        <div className="w-full bg-indigo-500 dark:bg-indigo-500 h-2/3 rounded-sm" />
                        <div className="w-full bg-indigo-600 dark:bg-indigo-400 h-full rounded-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Annotation Cards */}
                <div className="absolute -top-6 -right-4 sm:-right-8 glass-panel rounded-2xl p-3 animate-bounce duration-1000 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 flex items-center justify-center">
                    <ChartNoAxesCombined className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">
                      Real-time Insights
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Instant sync across POS & Web
                    </span>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-4 sm:-left-8 glass-panel rounded-2xl p-3 flex items-center gap-3">
                  <div className="flex items-center -space-x-1.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                      className="w-6 h-6 rounded-full ring-2 ring-white"
                      alt="User"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80"
                      className="w-6 h-6 rounded-full ring-2 ring-white"
                      alt="User"
                    />
                  </div>
                  <div>
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

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900/50 border-t border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Everything in one OS
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Designed specifically for service & product businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  className="glass-panel p-6 rounded-3xl hover:border-indigo-400/50 transition-all hover:-translate-y-1 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Simple & Transparent Plans
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Invest in your business growth
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              All plans include core OS capabilities with zero setup fees. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`glass-panel rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
                  plan.isPopular
                    ? 'border-2 border-indigo-500 shadow-indigo-500/15'
                    : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-wider">
                    {plan.badge}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                    {plan.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 min-h-[28px]">
                    {plan.tagline}
                  </p>

                  <div className="my-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        R{plan.monthlyPrice}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/month</span>
                    </div>
                    <p className="text-[10px] text-slate-400">{plan.monthlyBillingText}</p>
                  </div>

                  <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-4" />

                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium mb-6">
                    {plan.features.slice(0, 5).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <NavLink
                  to="/pricing"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-center text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white transition-all block shadow-xs"
                >
                  View Plan Details
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to streamline your business operations?
          </h2>
          <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto">
            Join thousands of salons, barber shops, boutique stores, and service brands on My Business OS.
          </p>
          <NavLink
            to="/app"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-slate-900 bg-white hover:bg-indigo-50 shadow-2xl transition-all"
          >
            <span>Launch Dashboard Now</span>
            <ArrowRight className="w-4 h-4" />
          </NavLink>
        </div>
      </section>


    </div>
  );
};
