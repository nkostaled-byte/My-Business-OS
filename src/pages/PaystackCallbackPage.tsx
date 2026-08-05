import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, CreditCard } from 'lucide-react';
import { api, type SubscriptionProduct } from '../lib/api-client';
import { useData } from '../context/DataContext';

type CallbackState =
  | { status: 'loading' }
  | { status: 'success'; product: SubscriptionProduct; plan: string; planName: string }
  | { status: 'error'; error: string };

export const PaystackCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || '';
  const [state, setState] = useState<CallbackState>({ status: 'loading' });
  const verified = useRef(false);
  const { refreshSubscription } = useData();

  useEffect(() => {
    if (verified.current) return;
    if (!reference) {
      setState({ status: 'error', error: 'Missing payment reference. Please return to your Billing page.' });
      return;
    }
    verified.current = true;

    api.verifyPayment(reference).then((res) => {
      if (res.success && res.data) {
        // Refresh plan gating immediately so the dashboard unlocks right away
        refreshSubscription();
        setState({
          status: 'success',
          product: res.data.product || 'os',
          plan: res.data.plan,
          planName: res.data.plan_name,
        });
      } else {
        setState({ status: 'error', error: res.error || 'Could not verify payment.' });
      }
    });
  }, [reference, refreshSubscription]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="w-full max-w-md glass-strong rounded-3xl p-8 sm:p-10 text-center">
        {state.status === 'loading' && (
          <>
            <div className="mx-auto w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-5">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Confirming your payment…
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Verifying your subscription with Paystack. Please wait a moment.
            </p>
          </>
        )}

        {state.status === 'success' && (
          <>
            <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Payment successful!
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {state.product === 'hosting' ? (
                <>
                  Your{' '}
                  <span className="font-bold text-slate-900 dark:text-white">{state.planName}</span>{' '}
                  subscription is now active.
                </>
              ) : (
                <>
                  Your workspace is now on the{' '}
                  <span className="font-bold text-slate-900 dark:text-white">{state.planName}</span> plan.
                </>
              )}
            </p>
            <button
              type="button"
              onClick={() => navigate('/app/billing')}
              className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors cursor-pointer"
            >
              Go to Billing
            </button>
          </>
        )}

        {state.status === 'error' && (
          <>
            <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5">
              <XCircle className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Payment could not be confirmed
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{state.error}</p>
            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={() => navigate('/app/billing')}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors cursor-pointer"
              >
                Go to Billing
              </button>
              <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                Need help? Check your Paystack dashboard for the transaction status.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
