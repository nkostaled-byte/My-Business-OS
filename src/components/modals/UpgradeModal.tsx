import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { PRICING_PLANS } from '../../data/pricingData';
import { Check, Zap, Shield } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api-client';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanName?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentPlanName = 'Free',
}) => {
  const { addToast } = useToast();
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    setLoadingPlanId(planId);
    try {
      const res = await api.createCheckout(planId, isYearly ? 'yearly' : 'monthly');
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
      setLoadingPlanId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade Your Subscription">
      <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-1">
        {/* Header & Toggle */}
        <div className="text-center space-y-3 pb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold border border-indigo-200 dark:border-indigo-800">
            <Zap className="w-3.5 h-3.5" />
            <span>Unlock Advanced My Grafix OS Capabilities</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Choose a plan that matches your business scale. Switch between monthly and annual billing to save 20%.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span
              className={`text-xs font-semibold cursor-pointer ${
                !isYearly ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'
              }`}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </span>
            <button
              type="button"
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                isYearly ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isYearly ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={() => setIsYearly(true)}
            >
              <span
                className={`text-xs font-semibold ${
                  isYearly ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'
                }`}
              >
                Yearly
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold uppercase tracking-wide">
                Save 20%
              </span>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRICING_PLANS.map((plan) => {
            const isCurrent = currentPlanName.toLowerCase() === plan.name.toLowerCase();
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const billingText = isYearly ? plan.yearlyBillingText : plan.monthlyBillingText;

            return (
              <div
                key={plan.id}
                className={`glass-panel rounded-2xl p-5 flex flex-col justify-between transition-all relative ${
                  plan.isPopular
                    ? 'border-2 border-indigo-500 shadow-indigo-500/10'
                    : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-xs">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                        {plan.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{plan.tagline}</p>
                    </div>
                    {isCurrent && (
                      <span className="px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        Current
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                        {plan.monthlyPrice === 0 ? 'Free' : `R${price}`}
                      </span>
                      {plan.monthlyPrice > 0 && <span className="text-slate-400 text-xs">/month</span>}
                    </div>
                    <span className="text-[10px] text-slate-400">{billingText}</span>
                  </div>

                  <div className="w-full h-px bg-slate-200/60 dark:bg-slate-800" />

                  {plan.includedFromPrevious && (
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 block">
                      {plan.includedFromPrevious}
                    </span>
                  )}

                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                  {plan.id === 'free' ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                    >
                      Free forever
                    </button>
                  ) : isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                    >
                      Active Plan
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={loadingPlanId !== null}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-wait ${
                        plan.isPopular
                          ? 'text-white bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                          : 'text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {loadingPlanId === plan.id ? 'Starting…' : `Switch to ${plan.name}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security / Guarantee Footer */}
        <div className="glass-subtle p-4 rounded-2xl flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Secure 256-bit SSL checkout powered by Cloudflare</span>
          </div>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Cancel anytime</span>
        </div>
      </div>
    </Modal>
  );
};
