import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../context/ToastContext';
import { PRICING_PLANS } from '../data/pricingData';
import {
  Check,
  Minus,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';

export const BillingPage: React.FC = () => {
  const { addToast } = useToast();
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSelectPlan = (planName: string, isEnterprise?: boolean) => {
    addToast({
      title: isEnterprise ? 'Enterprise Sales Notified' : `${planName} Selected`,
      message: isEnterprise
        ? 'Our enterprise account executive will contact you shortly.'
        : `Your workspace subscription update request for ${planName} (${isYearly ? 'Yearly' : 'Monthly'}) was processed.`,
      type: 'success',
    });
  };

  const faqData = [
    {
      q: 'How does billing work?',
      a: 'Billing is straightforward and transparent. Choose between flexible monthly or discounted annual subscription plans. All plans include full access to core OS capabilities with zero hidden setup fees or surprise charges.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly from your account settings with no cancellation penalties or long-term contracts.',
    },
    {
      q: 'Can I upgrade later?',
      a: 'Yes! As your business grows, you can seamlessly switch plans with a single click. Any unused balance on your previous plan is automatically credited toward your upgrade.',
    },
    {
      q: 'Can I have multiple businesses?',
      a: 'Our Professional and Enterprise plans natively support multi-branch and multi-location setups, allowing you to manage multiple locations or sub-accounts under one primary admin workspace.',
    },
    {
      q: 'Do you offer annual billing?',
      a: 'Yes! Choosing annual billing unlocks an automatic 20% discount across all tiers. Use the billing toggle at the top of this page to view annual savings.',
    },
  ];

  const comparisonRows = [
    { feature: 'Website Dashboard & CRM', starter: true, business: true, professional: true, enterprise: true },
    { feature: 'Products, Services & Bookings', starter: true, business: true, professional: true, enterprise: true },
    { feature: 'Contact Forms & Basic Analytics', starter: true, business: true, professional: true, enterprise: true },
    { feature: 'Team Members & Staff Management', starter: false, business: true, professional: true, enterprise: true },
    { feature: 'Quotes, Invoices & Website Manager', starter: false, business: true, professional: true, enterprise: true },
    { feature: 'Marketing Tools & Custom Branding', starter: false, business: true, professional: true, enterprise: true },
    { feature: 'Inventory Management & Advanced Analytics', starter: false, business: false, professional: true, enterprise: true },
    { feature: 'Automations & AI Insights', starter: false, business: false, professional: true, enterprise: true },
    { feature: 'Priority Support', starter: false, business: false, professional: true, enterprise: true },
    { feature: 'Multiple Businesses & Locations', starter: false, business: false, professional: false, enterprise: true },
    { feature: 'White Label & API Access', starter: false, business: false, professional: false, enterprise: true },
    { feature: 'Dedicated Support & Unlimited Staff', starter: false, business: false, professional: false, enterprise: true },
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Current Workspace Plan Banner */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-violet-700/50">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold border border-violet-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
            Active Tier: Business Plan (R49/mo)
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold mt-3">My Business OS Pro Workspace</h2>
          <p className="text-xs sm:text-sm text-violet-200 mt-1 max-w-xl">
            Your next auto-renewal date is August 15, 2026. All features including orders, POS, inventory, staff, and website integration are fully active.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            addToast({
              title: 'Billing Portal Active',
              message: 'Workspace account is in good standing with active card on file.',
              type: 'info',
            })
          }
          className="px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-lg cursor-pointer shrink-0"
        >
          Manage Payment Methods
        </button>
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
          const isCurrent = plan.name === 'Business';

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
                      R{price}
                    </span>
                    <span className="text-slate-500 text-xs">/month</span>
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
                {plan.id === 'enterprise' ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan.name)}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      Start Free Trial
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan.name, true)}
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all shadow-sm cursor-pointer"
                    >
                      Contact Sales
                    </button>
                  </div>
                ) : isCurrent ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 cursor-default"
                  >
                    Active Plan
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSelectPlan(plan.name)}
                    className="w-full py-3 rounded-xl text-xs font-bold text-violet-600 dark:text-violet-400 border-2 border-violet-600 dark:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-colors cursor-pointer"
                  >
                    Switch to {plan.name}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="pt-8 space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Plan capability comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Capability comparison across Starter, Business, Professional, and Enterprise tiers.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-xs font-bold text-slate-900 dark:text-white">
                  <th className="py-5 px-6 sm:px-8 w-2/5">Capability</th>
                  <th className="py-5 px-4 text-center w-[15%]">Starter</th>
                  <th className="py-5 px-4 text-center w-[15%] text-violet-600 bg-violet-50/50 dark:bg-violet-950/30">
                    Business
                  </th>
                  <th className="py-5 px-4 text-center w-[15%]">Professional</th>
                  <th className="py-5 px-4 text-center w-[15%]">Enterprise</th>
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
                    <td className="py-4 px-4 text-center">
                      {row.enterprise ? (
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
