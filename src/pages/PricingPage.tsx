import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../context/ToastContext';
import { PRICING_PLANS } from '../data/pricingData';
import {
  Check,
  Minus,
  ChevronDown,
  Zap,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  Globe,
  Headphones,
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleAction = (planName: string, isEnterprise?: boolean) => {
    addToast({
      title: isEnterprise ? 'Sales Team Notified' : `${planName} Plan Selected`,
      message: isEnterprise
        ? 'Our enterprise account executive will contact you shortly.'
        : `Redirecting to signup for ${planName} (${isYearly ? 'Yearly' : 'Monthly'} billing)...`,
      type: 'success',
    });
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const sideFeaturesLeft = [
    {
      icon: Zap,
      title: 'No Setup Fees',
      desc: 'Get started in minutes. No hidden fees.',
    },
    {
      icon: ShieldCheck,
      title: 'Cancel Anytime',
      desc: "You're in control. Cancel or change plans anytime.",
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      desc: 'Your payments are secure and encrypted.',
    },
  ];

  const sideFeaturesRight = [
    {
      icon: TrendingUp,
      title: 'Scale With You',
      desc: 'Upgrade your plan as your business grows.',
    },
    {
      icon: Globe,
      title: 'Access Anywhere',
      desc: 'Manage your business from any device, anytime.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      desc: "We're here to help you succeed, every step of the way.",
    },
  ];

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
      a: 'Each account is scoped to a single business workspace. If you run more than one business, you can create a separate account for each.',
    },
    {
      q: 'Do you offer annual billing?',
      a: 'Yes! Choosing annual billing unlocks an automatic 20% discount across all tiers. Use the billing toggle at the top of this page to view annual savings.',
    },
  ];

  const comparisonRows = [
    { feature: 'Website Dashboard & CRM', starter: true, business: true, professional: true, enterprise: true },
    { feature: 'Products & Services Catalog', starter: true, business: true, professional: true, enterprise: true },
    { feature: 'POS & Orders', starter: true, business: true, professional: true, enterprise: true },
    { feature: 'Bookings & Appointments', starter: true, business: true, professional: true, enterprise: true },
    { feature: 'Contact Forms & Basic Analytics', starter: true, business: true, professional: true, enterprise: true },
    { feature: 'Online Bookings & E-Commerce', starter: false, business: true, professional: true, enterprise: true },
    { feature: 'Team Members & Staff Access', starter: false, business: true, professional: true, enterprise: true },
    { feature: 'Invoices & PDFs', starter: false, business: true, professional: true, enterprise: true },
    { feature: 'Website Manager & Custom Branding', starter: false, business: true, professional: true, enterprise: true },
    { feature: 'Gallery & Reviews', starter: false, business: true, professional: true, enterprise: true },
    { feature: 'Reports & Exports', starter: false, business: true, professional: true, enterprise: true },
    { feature: 'Inventory Tracking', starter: false, business: false, professional: true, enterprise: true },
    { feature: 'Advanced Analytics', starter: false, business: false, professional: true, enterprise: true },
    { feature: 'Priority Support', starter: false, business: false, professional: true, enterprise: true },
    { feature: 'API Access', starter: false, business: false, professional: false, enterprise: true },
    { feature: 'Unlimited Staff', starter: false, business: false, professional: false, enterprise: true },
    { feature: 'Dedicated Support', starter: false, business: false, professional: false, enterprise: true },
  ];

  return (
    <div className="py-12 sm:py-16 selection:bg-violet-100 selection:text-violet-900 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-200/40 via-purple-100/20 dark:from-violet-900/20 dark:via-purple-900/10 to-transparent blur-3xl opacity-70 -z-10" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-100/80 dark:bg-violet-950/80 border border-violet-200/80 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-wider"
          >
            <span>Unified Pricing Plans</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]"
          >
            Simple, transparent pricing built for{' '}
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
              your growth
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Choose the perfect plan for your business. Upgrade, downgrade, or cancel anytime.
          </motion.p>

          {/* Monthly / Yearly Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex items-center justify-center gap-3"
          >
            <span
              className={`text-xs sm:text-sm font-semibold cursor-pointer ${
                !isYearly ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'
              }`}
              onClick={() => setIsYearly(false)}
            >
              Pay monthly
            </span>

            <button
              type="button"
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isYearly ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isYearly ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>

            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setIsYearly(true)}
            >
              <span
                className={`text-xs sm:text-sm font-semibold ${
                  isYearly ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Pay yearly
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[11px] font-extrabold border border-emerald-300/80 dark:border-emerald-800">
                Save 20%
              </span>
            </div>
          </motion.div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const billingText = isYearly ? plan.yearlyBillingText : plan.monthlyBillingText;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all relative ${
                  plan.isPopular
                    ? 'border-2 border-violet-600 dark:border-violet-500 bg-white dark:bg-slate-900 shadow-2xl shadow-violet-500/20 lg:-translate-y-2'
                    : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-md">
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

                  <div className="my-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        R{price}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/month</span>
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
                        <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />
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
                        onClick={() => handleAction(plan.name)}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                      >
                        Start Free Trial
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(plan.name, true)}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-all shadow-sm cursor-pointer"
                      >
                        Contact Sales
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAction(plan.name)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                        plan.isPopular
                          ? 'text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-violet-500/20'
                          : 'text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      Start Free Trial
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Highlights Grid Under Prices */}
        <div className="pt-8 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...sideFeaturesLeft, ...sideFeaturesRight].map((feat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                  <feat.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{feat.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="pt-12 space-y-8 max-w-5xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Compare plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Complete capability breakdown across all Business OS tiers.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 text-xs font-bold text-slate-900 dark:text-white">
                    <th className="py-5 px-6 sm:px-8 w-2/5">Features</th>
                    <th className="py-5 px-4 text-center w-[15%]">Starter</th>
                    <th className="py-5 px-4 text-center w-[15%]">Business</th>
                    <th className="py-5 px-4 text-center w-[15%] text-violet-600 bg-violet-50/50 dark:bg-violet-950/30">
                      Professional
                    </th>
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
                      <td className="py-4 px-4 text-center">
                        {row.business ? (
                          <Check className="w-4 h-4 text-violet-600 dark:text-violet-400 mx-auto" />
                        ) : (
                          <Minus className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center bg-violet-50/20 dark:bg-violet-950/10">
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

        {/* FAQ Accordion Section */}
        <div className="pt-8 space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Everything you need to know about plans, billing, and accounts.
            </p>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-violet-600 dark:text-violet-400' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
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

        {/* Final CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to grow your business?
            </h2>
            <p className="text-xs sm:text-base text-violet-100 leading-relaxed">
              Start your 14-day free trial today and experience the future of business operations.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleAction('Business')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-violet-950 bg-white hover:bg-violet-50 transition-colors shadow-xl cursor-pointer"
              >
                Start Free Trial
              </button>

              <button
                type="button"
                onClick={() => {
                  addToast({
                    title: 'Demo Scheduled',
                    message: 'Our product team will reach out shortly!',
                    type: 'info',
                  });
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-white border border-white/40 hover:bg-white/10 backdrop-blur-xs transition-colors cursor-pointer"
              >
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
