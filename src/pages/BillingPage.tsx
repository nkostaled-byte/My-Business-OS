import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import { PRICING_PLANS, HOSTING_PLANS, type PricingPlan } from '../data/pricingData';
import { api, type SubscriptionStatus, type SubscriptionProduct } from '../lib/api-client';
import {
  Check,
  Minus,
  ChevronDown,
  ShieldCheck,
  Loader2,
  CreditCard,
  RefreshCw,
  Globe,
} from 'lucide-react';

export const BillingPage: React.FC = () => {
  const { addToast } = useToast();
  const { refreshSubscription } = useData();
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const loadStatus = useCallback(async () => {
    setStatusLoading(true);
    const res = await api.getSubscriptionStatus();
    if (res.success && res.data) {
      setStatus(res.data);
    } else {
      addToast({
        title: 'Could not load subscription',
        message: res.error || 'Please try again.',
        type: 'error',
      });
    }
    setStatusLoading(false);
  }, [addToast]);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleCheckout = async (plan: PricingPlan, product: SubscriptionProduct = 'os') => {
    setCheckoutLoading(plan.id);
    try {
      const res = await api.createCheckout(plan.id, isYearly ? 'yearly' : 'monthly', product);
      if (res.success && res.data?.authorization_url) {
        window.location.href = res.data.authorization_url;
      } else {
        addToast({
          title: 'Checkout failed',
          message: res.error || 'Could not start checkout.',
          type: 'error',
        });
      }
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleCancel = async (product: SubscriptionProduct = 'os') => {
    const label = product === 'hosting' ? 'your hosting subscription' : 'your Business OS subscription';
    const downgradeNote =
      product === 'hosting'
        ? ' Your hosted site will be suspended after the billing period ends.'
        : ' You will be downgraded to the Free plan and automatic renewals will stop.';
    const confirmed = window.confirm(`Cancel ${label}?${downgradeNote}`);
    if (!confirmed) return;

    setCancelLoading(true);
    try {
      const res = await api.cancelSubscription(product);
      if (res.success) {
        addToast({
          title: product === 'hosting' ? 'Hosting subscription cancelled' : 'Subscription cancelled',
          message:
            product === 'hosting'
              ? 'Your hosting subscription has been cancelled.'
              : 'Your workspace is now on the Starter plan.',
          type: 'success',
        });
        loadStatus();
        refreshSubscription();
      } else {
        addToast({
          title: 'Could not cancel',
          message: res.error || 'Please try again.',
          type: 'error',
        });
      }
    } finally {
      setCancelLoading(false);
    }
  };

  const currentPlan = status?.plan || 'free';
  const currentPlanName = status?.plan_name || 'Free';
  const hostingCurrentPlan = status?.hosting_plan || null;
  const hostingCurrentName = status?.hosting_plan_name || 'Hosting';

  const faqData = [
    {
      q: 'How does billing work?',
      a: 'Billing is straightforward and transparent. Choose between flexible monthly or discounted annual subscription plans. Payments are processed securely through Paystack, and every plan includes full access to core OS capabilities with zero hidden setup fees.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time from this page. Cancelling stops future renewals, and you keep access until the end of your current billing period.',
    },
    {
      q: 'Can I upgrade later?',
      a: 'Yes! As your business grows, you can switch plans anytime from this page. Upgrading starts your new subscription right away, and you keep access for the rest of your current billing period.',
    },
    {
      q: 'Can I have multiple businesses?',
      a: 'Each account is scoped to a single business workspace. If you run more than one business, you can create a separate account for each.',
    },
    {
      q: 'Do you offer annual billing?',
      a: 'Yes! Choosing annual billing unlocks an automatic 20% discount across all tiers. Use the billing toggle at the top of this page to view annual savings.',
    },
  ];

  const comparisonRows = [
    { feature: 'Orders', free: true, starter: true, business: true, professional: true },
    { feature: 'Customers (CRM)', free: true, starter: true, business: true, professional: true },
    { feature: 'Bookings & Appointments', free: true, starter: true, business: true, professional: true },
    { feature: 'Overview Dashboard', free: true, starter: true, business: true, professional: true },
    { feature: 'Products & Services Catalog', free: false, starter: true, business: true, professional: true },
    { feature: 'POS', free: false, starter: true, business: true, professional: true },
    { feature: 'Contact Forms & Basic Analytics', free: false, starter: true, business: true, professional: true },
    { feature: 'Online Bookings & E-Commerce', free: false, starter: false, business: true, professional: true },
    { feature: 'Team Members & Staff Access', free: false, starter: false, business: true, professional: true },
    { feature: 'Invoices & PDFs', free: false, starter: false, business: true, professional: true },
    { feature: 'Website Manager & Custom Branding', free: false, starter: false, business: true, professional: true },
    { feature: 'Gallery & Reviews', free: false, starter: false, business: true, professional: true },
    { feature: 'Reports & Exports', free: false, starter: false, business: true, professional: true },
    { feature: 'Inventory Tracking', free: false, starter: false, business: false, professional: true },
    { feature: 'Advanced Analytics', free: false, starter: false, business: false, professional: true },
    { feature: 'Priority Support', free: false, starter: false, business: false, professional: true },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Current Workspace Plan Banner */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-violet-700/50">
        <div className="flex items-start gap-4">
          {statusLoading ? (
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-violet-300" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-violet-300" />
            </div>
          )}

          <div>
            {statusLoading ? (
              <>
                <div className="h-4 w-40 bg-white/20 rounded animate-pulse" />
                <div className="h-3 w-64 bg-white/10 rounded animate-pulse mt-3" />
              </>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold border border-violet-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                  {status?.subscription_active
                    ? `Active Tier: ${currentPlanName} Plan`
                    : status?.has_subscription
                      ? `Plan: ${currentPlanName} (auto-renew off)`
                      : `Plan: ${currentPlanName} Plan`}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold mt-3">My Business OS Workspace</h2>
                <p className="text-xs sm:text-sm text-violet-200 mt-1 max-w-xl">
                  {status?.subscription_active
                    ? `Your plan renews automatically on ${status.plan_expires_at
                        ? new Date(status.plan_expires_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
                        : 'the next billing cycle'}. All plan features are fully active.`
                    : status?.has_subscription
                      ? `Your subscription is no longer renewing and access ends ${status.plan_expires_at
                          ? `on ${new Date(status.plan_expires_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}`
                          : 'soon'}. Reactivate below to keep your plan.`
                      : `You're on the ${currentPlanName} plan. Upgrade anytime to unlock more features.`}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {status?.subscription_active && (
            <button
              type="button"
              disabled={cancelLoading}
              onClick={() => handleCancel()}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-lg cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            >
              {cancelLoading ? 'Cancelling…' : 'Cancel Subscription'}
            </button>
          )}
          {!status?.subscription_active && (
            <button
              type="button"
              onClick={() => {
                const firstPaid = PRICING_PLANS.find((p) => p.monthlyPrice > 0);
                const target =
                  currentPlan === 'free'
                    ? firstPaid
                    : PRICING_PLANS.find((p) => p.id === currentPlan) ?? firstPaid;
                if (target) handleCheckout(target);
              }}
              className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-violet-500 hover:bg-violet-400 transition-colors shadow-lg cursor-pointer"
            >
              <span className="inline-flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                {status?.has_subscription ? 'Reactivate Plan' : 'Choose a Plan'}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/60 border border-violet-200/80 dark:border-violet-800/80 text-violet-700 dark:text-violet-300 text-xs font-bold shadow-xs">
          <span>Unified subscription plans</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Pricing for businesses of every size
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Everything you need to manage bookings, products, customers, invoices, inventory, staff and your website — all in one operating system.
        </p>

        {/* Billing Toggle */}
        <div className="pt-4 flex items-center justify-center">
          <div className="relative flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={`relative px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                !isYearly
                  ? 'text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {!isYearly && (
                <motion.div
                  layoutId="dashBillingToggle"
                  className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200/60 dark:border-slate-700"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">Monthly</span>
            </button>

            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={`relative px-5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                isYearly
                  ? 'text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {isYearly && (
                <motion.div
                  layoutId="dashBillingToggle"
                  className="absolute inset-0 bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200/60 dark:border-slate-700"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">Yearly</span>
              <span className="relative z-10 px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid (4 plans) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {PRICING_PLANS.map((plan) => {
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
          const billingText = isYearly ? plan.yearlyBillingText : plan.monthlyBillingText;
          const isCurrent = plan.id === currentPlan;

          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              className={`rounded-[28px] p-6 border flex flex-col justify-between transition-all relative ${
                plan.isPopular
                  ? 'border-2 border-violet-600 dark:border-violet-500 bg-white dark:bg-slate-900 shadow-2xl shadow-violet-500/20'
                  : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    {plan.name}
                  </h3>
                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium min-h-[32px]">
                  {plan.tagline}
                </p>

                  <div className="my-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                        {plan.monthlyPrice === 0 ? 'Free' : `R${price}`}
                      </span>
                      {plan.monthlyPrice > 0 && <span className="text-slate-500 text-xs">/month</span>}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{billingText}</p>
                  </div>

                <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-4" />

                {plan.includedFromPrevious && (
                  <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 block mb-2">
                    {plan.includedFromPrevious}
                  </span>
                )}

                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium mb-6">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {plan.id === 'free' ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-default"
                  >
                    {isCurrent
                      ? status?.subscription_active
                        ? 'Active Plan'
                        : 'Current Plan'
                      : 'Free forever'}
                  </button>
                ) : isCurrent ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 cursor-default"
                  >
                    {status?.subscription_active ? 'Active Plan' : 'Current Plan'}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={checkoutLoading !== null}
                    onClick={() => handleCheckout(plan)}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait ${
                      isCurrent
                        ? 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800'
                        : 'text-violet-600 dark:text-violet-400 border-2 border-violet-600 dark:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/40'
                    }`}
                  >
                    {checkoutLoading === plan.id ? 'Starting…' : `Switch to ${plan.name}`}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Web Hosting Section */}
      <div className="space-y-8">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-xs">
            <Globe className="w-3.5 h-3.5" />
            <span>Web hosting plans</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Host your website with us
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Separate from your Business OS subscription. Choose a hosting tier for your live website — each with its own billing and renewal.
          </p>
        </div>

        {/* Hosting status line */}
        <div className="max-w-3xl mx-auto">
          {status?.hosting_subscription_active ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 px-5 py-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="text-xs text-emerald-800 dark:text-emerald-200">
                  <span className="font-bold">{hostingCurrentName}</span> hosting is active and renews automatically on{' '}
                  {status.hosting_expires_at
                    ? new Date(status.hosting_expires_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
                    : 'the next billing cycle'}
                  .
                </p>
              </div>
              <button
                type="button"
                disabled={cancelLoading}
                onClick={() => handleCancel('hosting')}
                className="px-4 py-2 rounded-xl text-[11px] font-bold text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait shrink-0"
              >
                {cancelLoading ? 'Cancelling…' : 'Cancel Hosting'}
              </button>
            </div>
          ) : (
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              You don't have an active hosting subscription yet. Pick a tier below to get started.
            </p>
          )}
        </div>

        {/* Hosting plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
          {HOSTING_PLANS.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const billingText = isYearly ? plan.yearlyBillingText : plan.monthlyBillingText;
            const isCurrent = plan.id === hostingCurrentPlan;

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -4 }}
                className={`rounded-[28px] p-6 border flex flex-col justify-between transition-all relative ${
                  plan.isPopular
                    ? 'border-2 border-emerald-500 bg-white dark:bg-slate-900 shadow-2xl shadow-emerald-500/10'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {plan.tagline}
                  </p>

                  <div className="my-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">R{price}</span>
                      <span className="text-slate-500 text-xs">/month</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">{billingText}</p>
                  </div>

                  <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-4" />

                  <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium mb-6">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  {isCurrent && status?.hosting_subscription_active ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-3 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 cursor-default"
                    >
                      Active Plan
                    </button>
                  ) : isCurrent ? (
                    <button
                      type="button"
                      disabled={checkoutLoading !== null}
                      onClick={() => handleCheckout(plan, 'hosting')}
                      className="w-full py-3 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                    >
                      {checkoutLoading === plan.id ? 'Starting…' : 'Reactivate Hosting'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={checkoutLoading !== null}
                      onClick={() => handleCheckout(plan, 'hosting')}
                      className={`w-full py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait ${
                        plan.isPopular
                          ? 'text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500'
                          : 'text-emerald-600 dark:text-emerald-400 border-2 border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      }`}
                    >
                      {checkoutLoading === plan.id ? 'Starting…' : `Get ${plan.name}`}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Payment note */}
      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
        <CreditCard className="w-3.5 h-3.5" />
        Payments are processed securely through Paystack.
      </div>

      {/* Feature Comparison Table */}
      <div className="pt-8 space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Plan capability comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Capability comparison across Free, Starter, Business, and Professional tiers.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-xs font-bold text-slate-900 dark:text-white">
                    <th className="py-5 px-6 sm:px-8 w-2/5">Capability</th>
                    <th className="py-5 px-4 text-center w-[15%]">Free</th>
                    <th className="py-5 px-4 text-center w-[15%]">Starter</th>
                    <th className="py-5 px-4 text-center w-[15%] text-violet-600 bg-violet-50/50 dark:bg-violet-950/30">
                      Business
                    </th>
                    <th className="py-5 px-4 text-center w-[15%]">Professional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                  {comparisonRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-4 px-6 sm:px-8 font-semibold text-slate-800 dark:text-slate-200">
                        {row.feature}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.free ? (
                          <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 mx-auto" />
                        ) : (
                          <Minus className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.starter ? (
                          <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 mx-auto" />
                        ) : (
                          <Minus className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center bg-violet-50/20 dark:bg-violet-950/10">
                        {row.business ? (
                          <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 mx-auto" />
                        ) : (
                          <Minus className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.professional ? (
                          <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 mx-auto" />
                        ) : (
                          <Minus className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="pt-8 space-y-6 max-w-3xl mx-auto">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white text-center">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqData.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white cursor-pointer hover:text-violet-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-violet-600' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
