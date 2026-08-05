import React, { useState } from 'react';
import { PRICING_PLANS } from '../../data/pricingData';
import { Zap, ArrowRight } from 'lucide-react';
import { UpgradeModal } from '../modals/UpgradeModal';

export const DashboardUpgradeCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Current plan is Business, next available is Professional
  const currentPlan = PRICING_PLANS.find((p) => p.id === 'business') || PRICING_PLANS[1];
  const nextPlan = PRICING_PLANS.find((p) => p.id === 'professional') || PRICING_PLANS[2];

  return (
    <>
      <div className="rounded-xl bg-slate-900 dark:bg-[#12161c] text-white p-6 sm:p-8 shadow-panel relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5">
        {/* Background Decorative Glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold border border-white/10">
            <Zap className="w-3.5 h-3.5 text-indigo-300" />
            <span>Upgrade recommendation</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            Unlock {nextPlan.name} capabilities
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            You are currently on the <strong className="text-white">{currentPlan.name}</strong> plan (R{currentPlan.monthlyPrice}/mo). Upgrade to <strong className="text-white">{nextPlan.name}</strong> (R{nextPlan.monthlyPrice}/mo) to unlock {nextPlan.features.slice(0, 3).join(', ')}, and more!
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            <span>Upgrade (R{nextPlan.monthlyPrice}/mo)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <UpgradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentPlanName={currentPlan.name}
      />
    </>
  );
};
