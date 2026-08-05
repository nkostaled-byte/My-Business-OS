import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { PLAN_NAMES } from '../../config/plans';

interface UpgradeRequiredProps {
  requiredPlan: string;
}

export const UpgradeRequired: React.FC<UpgradeRequiredProps> = ({ requiredPlan }) => {
  const { plan } = useData();
  const currentName = PLAN_NAMES[plan] || 'Free';
  const requiredName = PLAN_NAMES[requiredPlan] || requiredPlan;

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center px-4">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
          <Lock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
          This feature requires the {requiredName} plan
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          You're currently on the <span className="font-semibold text-slate-700 dark:text-slate-200">{currentName}</span> plan.
          Upgrade to unlock {requiredName === 'Business' ? 'Team management, invoices, gallery, reviews and website tools' : 'advanced features'} and more.
        </p>
        <Link
          to="/app/billing"
          className="mt-6 inline-block px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
        >
          View Plans &amp; Upgrade
        </Link>
      </div>
    </div>
  );
};
