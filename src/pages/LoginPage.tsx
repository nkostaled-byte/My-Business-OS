import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, KeyRound, UserPlus, Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  claimWithInviteCode,
  getCurrentAuthState,
  refreshAuthState,
} from '../lib/auth-client';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isClaimMode, setIsClaimMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [claimCode, setClaimCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if already authenticated
  useEffect(() => {
    const auth = getCurrentAuthState();
    if (auth.isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [navigate]);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);

    try {
      const { error: authError } = await signInWithEmail(email, password);
      if (authError) {
        setError(authError.message || 'Failed to sign in.');
        return;
      }
      // Auth state listener will trigger navigation
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearMessages();
    setIsLoading(true);

    try {
      await signInWithGoogle();
      // Google OAuth redirects; no further action needed here
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed.');
      setIsLoading(false);
    }
  };

  const handleClaimAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);

    try {
      if (!claimCode.trim()) {
        setError('Please enter your claim code.');
        setIsLoading(false);
        return;
      }

      if (!email.trim()) {
        setError('Please enter your work email.');
        setIsLoading(false);
        return;
      }

      // First sign in with email & password (or use existing session)
      const auth = getCurrentAuthState();
      if (!auth.isAuthenticated) {
        // Try to sign in; if fails, try to sign up
        const { error: signInError } = await signInWithEmail(email, password);
        if (signInError) {
          const { error: signUpError } = await signUpWithEmail(email, password);
          if (signUpError) {
            setError(signUpError.message || 'Failed to create account.');
            setIsLoading(false);
            return;
          }
        }
      }

      // Now claim with invite code
      const result = await claimWithInviteCode(claimCode.trim().toUpperCase());
      await refreshAuthState();

      if (result.status === 'already_linked' || result.status === 'linked' || result.status === 'created') {
        setSuccess('Account claimed successfully! Redirecting...');
        setTimeout(() => navigate('/app', { replace: true }), 1000);
      } else {
        setSuccess('Account linked. Redirecting...');
        setTimeout(() => navigate('/app', { replace: true }), 1000);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to claim account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <NavLink
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </NavLink>

        {/* Auth Card */}
        <div className="glass-strong rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 p-2 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/10 border border-slate-100 dark:border-slate-800">
              <img
                src="https://res.cloudinary.com/dvvugpu04/image/upload/v1784904453/My_Grafix_Media_logo_160px_edlkgm.png"
                alt="My Grafix OS Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {isClaimMode ? 'Claim Your Account' : 'Welcome to My Business OS'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isClaimMode
                ? 'Enter your invite code to claim your business account.'
                : 'Sign in to manage your business operations.'}
            </p>
          </div>

          {/* Error / Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
              <p className="text-xs text-rose-700 dark:text-rose-300">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5"
            >
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-700 dark:text-emerald-300">{success}</p>
            </motion.div>
          )}

          {/* Sign In Form (default mode) */}
          {!isClaimMode && (
            <>
              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-semibold text-slate-400">OR</span>
                </div>
              </div>

              {/* Email + Password Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourbusiness.com"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Claim Account Form */}
          {isClaimMode && (
            <form onSubmit={handleClaimAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Claim Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={claimCode}
                    onChange={(e) => setClaimCode(e.target.value)}
                    placeholder="e.g. GRAFIX-8842-CLAIM"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 transition-all uppercase tracking-wider"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@yourbusiness.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Password (create or enter existing)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password for your account"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Claiming account...</span>
                  </>
                ) : (
                  <span>Claim Account & Access</span>
                )}
              </button>
            </form>
          )}

          {/* Toggle Claim Mode Link */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => {
                setIsClaimMode(!isClaimMode);
                clearMessages();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>
                {isClaimMode
                  ? 'Already claimed? Sign in instead'
                  : 'Have an invite code? Claim your account'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
