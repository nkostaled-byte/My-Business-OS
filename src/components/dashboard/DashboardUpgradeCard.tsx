import React, { useState } from 'react';
import { PRICING_PLANS } from '../../data/pricingData';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { UpgradeModal } from '../modals/UpgradeModal';

export const DashboardUpgradeCard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Current plan is Business, next available is Professional
  const currentPlan = PRICING_PLANS.find((p) => p.id === 'business') || PRICING_PLANS[1];
  const nextPlan = PRICING_PLANS.find((p) => p.id === 'professional') || PRICING_PLANS[2];

  return (
    <>
      <div className="rounded-3xl bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-violet-700/40">
        {/* Background Decorative Glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold border border-violet-400/30">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Workspace Upgrade Recommendation</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Unlock {nextPlan.name} Capabilities
          </h3>
          <p className="text-xs sm:text-sm text-violet-200 max-w-xl leading-relaxed">
            You are currently on the <strong className="text-white">{currentPlan.name}</strong> plan (R{currentPlan.monthlyPrice}/mo). Upgrade to <strong className="text-white">{nextPlan.name}</strong> (R{nextPlan.monthlyPrice}/mo) to unlock {nextPlan.features.slice(0, 3).join(', ')}, and more!
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-violet-950 bg-white hover:bg-violet-50 shadow-xl transition-all cursor-pointer"
          >
            <span>Upgrade to {nextPlan.name} (R{nextPlan.monthlyPrice}/mo)</span>
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
