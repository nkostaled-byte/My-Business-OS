import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  CalendarDays,
  CreditCard,
  Boxes,
  ReceiptText,
  ChartNoAxesCombined,
  ChevronRight,
  CircleDollarSign,
  Plus,
  TrendingUp,
  UserRoundPlus,
  Sparkles,
  ImagePlus,
  Wand2,
  Download,
} from 'lucide-react';

export const MarketingPage: React.FC = () => {
  const now = new Date();
  const hour = now.getHours();
  const heroGreeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const heroDate = now.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="selection:bg-indigo-100 selection:text-indigo-900 relative mt-px">
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
                      dashboard.mygrafixmedia.com
                    </span>
                  </div>

                  {/* Overview dashboard — faithful replica of the real Overview page */}
                  <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl space-y-3 text-left">
                    {/* Overview header */}
                    <div className="flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[9px] font-medium text-slate-400 flex items-center gap-1">
                          <CalendarDays className="w-2.5 h-2.5" />
                          {heroDate}
                        </p>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                          {heroGreeting}, Sarah
                        </p>
                        <p className="text-[9px] text-slate-400 truncate">
                          Here's what's happening with your business today.
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-semibold text-white bg-indigo-600">
                          <Plus className="w-2.5 h-2.5" />
                          New Booking
                        </span>
                        <span className="px-2 py-1 rounded-lg text-[9px] font-medium bg-white dark:bg-[#0e1116] border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">
                          This Month
                        </span>
                      </div>
                    </div>

                    {/* Stat cards — mirrors the real StatCard component */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative overflow-hidden rounded-lg bg-slate-900 dark:bg-[#12161c] p-2.5 text-white">
                        <div className="absolute right-2 bottom-1 opacity-20 pointer-events-none">
                          <svg width="70" height="26" viewBox="0 0 120 50" fill="none" aria-hidden="true">
                            <path d="M0 40 Q 30 10, 60 30 T 120 10" stroke="currentColor" strokeWidth="3" fill="none" />
                          </svg>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-semibold text-slate-300 uppercase tracking-wider">Total Revenue</span>
                          <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center">
                            <CircleDollarSign className="w-3 h-3 text-slate-200" />
                          </span>
                        </div>
                        <p className="text-base font-bold mt-1.5">R42,680</p>
                        <p className="text-[8px] text-slate-300 flex items-center gap-0.5 mt-0.5">
                          <TrendingUp className="w-2.5 h-2.5" /> ↑ 18% from last month
                        </p>
                      </div>

                      <div className="glass-panel rounded-lg p-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider">Total Orders</span>
                          <span className="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <ShoppingBag className="w-3 h-3" />
                          </span>
                        </div>
                        <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1.5">128</p>
                        <p className="text-[8px] text-emerald-500 font-medium flex items-center gap-0.5 mt-0.5">
                          <TrendingUp className="w-2.5 h-2.5" /> ↑ 12% from last month
                        </p>
                      </div>

                      <div className="glass-panel rounded-lg p-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</span>
                          <span className="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <CalendarDays className="w-3 h-3" />
                          </span>
                        </div>
                        <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1.5">64</p>
                        <p className="text-[8px] text-emerald-500 font-medium flex items-center gap-0.5 mt-0.5">
                          <TrendingUp className="w-2.5 h-2.5" /> ↑ 8% from last month
                        </p>
                      </div>

                      <div className="glass-panel rounded-lg p-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider">New Customers</span>
                          <span className="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                            <UserRoundPlus className="w-3 h-3" />
                          </span>
                        </div>
                        <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1.5">32</p>
                        <p className="text-[8px] text-emerald-500 font-medium flex items-center gap-0.5 mt-0.5">
                          <TrendingUp className="w-2.5 h-2.5" /> ↑ 15% from last month
                        </p>
                      </div>
                    </div>

                    {/* Revenue chart — mirrors the real RevenueChart card */}
                    <div className="glass-panel rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <div>
                          <p className="text-[11px] font-bold text-slate-900 dark:text-slate-100">Revenue Overview</p>
                          <p className="text-[8px] text-slate-400">Track business earnings over time</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-lg text-[8px] font-medium glass-subtle text-slate-600 dark:text-slate-300">
                          This Month
                        </span>
                      </div>
                      <svg viewBox="0 0 400 130" className="w-full h-24" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                          <linearGradient id="heroRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity="0.28" />
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <line x1="0" x2="400" y1="30" y2="30" stroke="#94A3B8" strokeOpacity="0.25" strokeDasharray="3 4" />
                        <line x1="0" x2="400" y1="60" y2="60" stroke="#94A3B8" strokeOpacity="0.25" strokeDasharray="3 4" />
                        <line x1="0" x2="400" y1="90" y2="90" stroke="#94A3B8" strokeOpacity="0.25" strokeDasharray="3 4" />
                        <path
                          d="M0 96 C 40 88, 70 62, 110 68 S 180 40, 220 50 S 320 16, 400 24 L 400 130 L 0 130 Z"
                          fill="url(#heroRevenueGradient)"
                        />
                        <path
                          d="M0 96 C 40 88, 70 62, 110 68 S 180 40, 220 50 S 320 16, 400 24"
                          fill="none"
                          stroke="#4F46E5"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="flex justify-between text-[7px] text-slate-400 px-0.5">
                        <span>Week 1</span>
                        <span>Week 2</span>
                        <span>Week 3</span>
                        <span>Week 4</span>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900/50 border-t border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Designed specifically for service &amp; product businesses
            </h2>
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

      {/* AI Image Studio Section */}
      <section id="image-studio" className="relative py-20 lg:py-24 overflow-hidden border-t border-slate-200/60 dark:border-slate-800">
        <div className="absolute top-1/3 left-0 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-400/15 blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 rounded-full bg-sky-400/15 blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 dark:border-indigo-500/30 bg-indigo-50/80 dark:bg-indigo-500/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-indigo-700 dark:text-indigo-300">
                <Sparkles className="h-3 w-3" />
                New · AI Image Studio
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.1]">
                Campaign visuals{' '}
                <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
                  without the photoshoot
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Describe the shot you need, or upload a product photo as a reference. Image Studio turns it into polished product imagery and mockups in seconds.
              </p>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {[
                  '10 free generations every day',
                  'Reference images for product mockups',
                  'Private history and instant downloads',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <NavLink
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 transition-all hover:bg-indigo-500 active:scale-[0.98]"
                >
                  <Wand2 className="h-4 w-4" />
                  <span>Generate Image</span>
                  <ArrowRight className="h-4 w-4" />
                </NavLink>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Sign in or claim your account to start.
                </span>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative mx-auto max-w-xl lg:max-w-none transform lg:-rotate-1 lg:hover:rotate-0 transition-transform duration-500">
                <div className="glass-panel rounded-3xl p-2.5 sm:p-3">
                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-3 sm:p-4">
                    <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                          <Sparkles className="h-3.5 w-3.5" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Image Studio</p>
                          <p className="text-[9px] text-slate-400">Prompt to campaign-ready visual</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[8px] font-bold text-emerald-600 dark:text-emerald-400">
                        10 free / day
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-5 gap-3">
                      <div className="sm:col-span-2 space-y-2.5 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] p-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-400">Prompt</span>
                          <span className="text-[8px] text-slate-300">1200</span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-slate-600 dark:text-slate-300">
                          A matte black skincare bottle on a sunlit travertine plinth, soft shadows, luxury editorial calm.
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <span className="rounded-full bg-slate-900 px-2 py-1 text-[8px] font-semibold text-white dark:bg-white dark:text-slate-900">Photorealistic</span>
                          <span className="rounded-full border border-slate-200/80 dark:border-white/10 px-2 py-1 text-[8px] font-medium text-slate-500 dark:text-slate-400">Product</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {['1:1', '4:5', '16:9'].map((ratio) => (
                            <span
                              key={ratio}
                              className={`rounded-md border py-1 text-center text-[8px] font-semibold ${
                                ratio === '4:5'
                                  ? 'border-indigo-400 bg-indigo-50 text-indigo-600 dark:border-indigo-500/50 dark:bg-indigo-500/10 dark:text-indigo-300'
                                  : 'border-slate-200/80 text-slate-400 dark:border-white/10'
                              }`}
                            >
                              {ratio}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border border-dashed border-slate-300/80 dark:border-white/15 p-1.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-indigo-100 to-sky-100 text-indigo-500 dark:from-indigo-500/20 dark:to-sky-500/20 dark:text-indigo-300">
                            <ImagePlus className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[8px] font-semibold text-slate-700 dark:text-slate-300">Reference image</p>
                            <p className="text-[7px] text-slate-400">Product or logo</p>
                          </div>
                        </div>
                        <NavLink
                          to="/login"
                          aria-label="Generate an image — sign in or claim your account"
                          className="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-1.5 text-[9px] font-bold text-white transition-colors hover:bg-indigo-500"
                        >
                          <Wand2 className="h-3 w-3" />
                          Generate image
                        </NavLink>
                      </div>

                      <div className="sm:col-span-3 grid grid-cols-2 gap-2">
                        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-[#f3e9df] via-[#e4d0bd] to-[#cfb49b]">
                          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-white/25 blur-xl" />
                          <div className="absolute left-1/2 top-1/2 h-16 w-9 -translate-x-1/2 -translate-y-1/2 rounded-t-2xl rounded-b-md bg-slate-900/85 shadow-2xl" />
                          <div className="absolute left-1/2 top-[calc(50%-2.5rem)] h-2.5 w-5 -translate-x-1/2 rounded-full bg-slate-700" />
                          <span className="absolute left-1.5 top-1.5 rounded-full bg-white/70 px-1.5 py-0.5 text-[7px] font-bold text-slate-700">Product</span>
                        </div>
                        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(129,140,248,0.35),transparent_55%)]" />
                          <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm" />
                          <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-indigo-300 to-sky-400" />
                          <span className="absolute left-1.5 top-1.5 rounded-full bg-white/15 px-1.5 py-0.5 text-[7px] font-bold text-white">Mockup</span>
                        </div>
                        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100">
                          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-white/50 blur-md" />
                          <div className="absolute left-1/2 top-1/2 h-16 w-11 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/80 shadow-lg" />
                          <div className="absolute left-1/2 top-[calc(50%-0.25rem)] h-1 w-6 -translate-x-1/2 rounded-full bg-emerald-600/60" />
                          <div className="absolute left-1/2 top-1/2 mt-2 h-1 w-5 -translate-x-1/2 rounded-full bg-slate-300" />
                          <span className="absolute left-1.5 top-1.5 rounded-full bg-white/70 px-1.5 py-0.5 text-[7px] font-bold text-emerald-700">Editorial</span>
                        </div>
                        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br from-rose-100 via-orange-100 to-amber-100">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),transparent_55%)]" />
                          <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 shadow-xl" />
                          <div className="absolute left-1/2 top-[calc(50%+1.75rem)] h-1.5 w-10 -translate-x-1/2 rounded-full bg-white/60" />
                          <span className="absolute left-1.5 top-1.5 rounded-full bg-white/70 px-1.5 py-0.5 text-[7px] font-bold text-rose-700">Social</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200/70 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] px-3 py-2">
                      <span className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500 dark:text-slate-400">
                        <Download className="h-3 w-3" />
                        Download in one click
                      </span>
                      <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400">Ready in seconds</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
