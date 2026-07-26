/**
 * OnboardingPage — Business Setup Wizard
 * =========================================
 *
 * After authentication, if the user has no linked business (client_id),
 * they are redirected here to either:
 *
 *   1. Create a New Business — Full setup form
 *   2. Claim Existing Business — Enter claim code to link
 *
 * Only after successful onboarding is the user redirected to the Dashboard.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  KeyRound,
  ArrowLeft,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle,
  Globe,
  Clock,
  Landmark,
  Mail,
  FileText,
  Smartphone,
} from 'lucide-react';
import {
  createBusiness,
  claimWithInviteCode,
  setClientInfo,
  getCurrentAuthState,
} from '../lib/auth-client';

// ─── Business Types ───────────────────────────────────────────────

const BUSINESS_TYPES = [
  { value: 'barbershop', label: 'Barbershop / Salon' },
  { value: 'gym', label: 'Gym / Fitness' },
  { value: 'restaurant', label: 'Restaurant / Cafe' },
  { value: 'retail', label: 'Retail / E-commerce' },
  { value: 'service', label: 'Service Business' },
  { value: 'freelancer', label: 'Freelancer / Solopreneur' },
  { value: 'other', label: 'Other' },
];

const COUNTRIES = [
  { code: 'ZA', name: 'South Africa' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'KE', name: 'Kenya' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'BW', name: 'Botswana' },
  { code: 'NA', name: 'Namibia' },
  { code: 'ZW', name: 'Zimbabwe' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'AO', name: 'Angola' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'MW', name: 'Malawi' },
];

const CURRENCIES = [
  { code: 'ZAR', label: 'ZAR (R)', symbol: 'R' },
  { code: 'USD', label: 'USD ($)', symbol: '$' },
  { code: 'EUR', label: 'EUR (€)', symbol: '€' },
  { code: 'GBP', label: 'GBP (£)', symbol: '£' },
  { code: 'KES', label: 'KES (KSh)', symbol: 'KSh' },
  { code: 'NGN', label: 'NGN (₦)', symbol: '₦' },
  { code: 'BWP', label: 'BWP (P)', symbol: 'P' },
  { code: 'AUD', label: 'AUD (A$)', symbol: 'A$' },
];

const TIMEZONES = [
  'Africa/Johannesburg',
  'Africa/Nairobi',
  'Africa/Lagos',
  'Africa/Gaborone',
  'Africa/Windhoek',
  'Africa/Harare',
  'Africa/Luanda',
  'Africa/Lusaka',
  'Africa/Blantyre',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Australia/Sydney',
  'Australia/Melbourne',
];

// ─── Color Palette Presets ────────────────────────────────────────

const COLOR_PRESETS = [
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Amber', value: '#d97706' },
  { label: 'Rose', value: '#e11d48' },
  { label: 'Cyan', value: '#0891b2' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Slate', value: '#475569' },
];

type OnboardingStep = 'choose' | 'create' | 'claim';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>('choose');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const auth = getCurrentAuthState();
    setUserEmail(auth.user?.email || '');

    // If already has a business link, skip onboarding
    if (auth.clientId) {
      navigate('/app', { replace: true });
    }
  }, [navigate]);

  // ─── Create Business Form State ─────────────────────────────────

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [country, setCountry] = useState('ZA');
  const [currency, setCurrency] = useState('ZAR');
  const [timezone, setTimezone] = useState('Africa/Johannesburg');
  const [businessEmail, setBusinessEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#7c3aed');

  // ─── Claim Business Form State ─────────────────────────────────

  const [claimCode, setClaimCode] = useState('');

  // ─── Handlers ──────────────────────────────────────────────────

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!businessName.trim()) {
      setError('Please enter a business name.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBusiness({
        businessName: businessName.trim(),
        businessType: businessType || undefined,
        country,
        currency,
        timezone,
        phone: phone || undefined,
        primaryColor: primaryColor || undefined,
        logoUrl: logoUrl || undefined,
      });

      const client = result.client;
      if (client?.client_id) {
        await setClientInfo(client.client_id, client.business_name || businessName);
        setSuccess('Business created successfully! Redirecting to your dashboard...');
        setTimeout(() => navigate('/app', { replace: true }), 1200);
      } else {
        setError('Business was created but no client ID was returned. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to create business. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!claimCode.trim()) {
      setError('Please enter your claim code.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await claimWithInviteCode(claimCode.trim().toUpperCase());

      if (result.status === 'already_linked' || result.status === 'linked' || result.status === 'created') {
        const client = result.client;
        if (client?.client_id) {
          await setClientInfo(client.client_id, client.business_name || 'My Business');
          setSuccess('Business claimed successfully! Redirecting to your dashboard...');
          setTimeout(() => navigate('/app', { replace: true }), 1200);
        } else {
          setError('Business was claimed but no client ID was returned. Please try again.');
        }
      } else {
        setSuccess('Account linked. Redirecting...');
        setTimeout(() => navigate('/app', { replace: true }), 1200);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to claim business. Please check your claim code and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Back to choose ────────────────────────────────────────────

  const goBack = () => {
    clearMessages();
    setStep('choose');
  };

  // ─── Render ────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 p-2 flex items-center justify-center shadow-lg shadow-violet-500/10 border border-slate-100 dark:border-slate-800"
          >
            <img
              src="https://res.cloudinary.com/dvvugpu04/image/upload/v1784904453/My_Grafix_Media_logo_160px_edlkgm.png"
              alt="My Grafix OS Logo"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {/* ─── STEP: Choose ──────────────────────────────────────── */}
          {step === 'choose' && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  Welcome to My Grafix OS
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
                  Let's get you set up. Choose how you'd like to get started.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('create')}
                  className="text-left p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 shadow-sm hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-950/60 flex items-center justify-center mb-4 group-hover:bg-violet-200 dark:group-hover:bg-violet-900/60 transition-colors">
                    <Building2 className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Create New Business
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Start using My Grafix OS immediately. You can connect a My Grafix Media website later.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 group-hover:gap-2 transition-all">
                    <span>Create Business</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('claim')}
                  className="text-left p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-200 cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60 transition-colors">
                    <KeyRound className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Claim Existing Business
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Already have a website built by My Grafix Media? Enter your Claim Code to link your existing business.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:gap-2 transition-all">
                    <span>Claim Business</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </div>
                </motion.button>
              </div>

              <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-8">
                You can switch between businesses later from your account settings.
              </p>
            </motion.div>
          )}

          {/* ─── STEP: Create Business ─────────────────────────────── */}
          {step === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800"
            >
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-4 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-1">
                Create Your Business
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
                Set up your business profile to get started with My Grafix OS.
              </p>

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

              <form onSubmit={handleCreateBusiness} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Premium Barbershop &amp; Spa"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Business Type
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <select
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-violet-500/30 transition-all appearance-none"
                    >
                      <option value="">Select your business type</option>
                      {BUSINESS_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Country
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-violet-500/30 transition-all appearance-none"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Currency
                    </label>
                    <div className="relative">
                      <Landmark className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-violet-500/30 transition-all appearance-none"
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c.code} value={c.code}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Timezone
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-violet-500/30 transition-all appearance-none"
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Business Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={businessEmail}
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        placeholder={userEmail || "business@example.com"}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500/30 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+27 82 123 4567"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500/30 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Logo / Profile Image
                  </label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Brand Colour
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COLOR_PRESETS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setPrimaryColor(c.value)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all cursor-pointer ${
                          primaryColor === c.value
                            ? 'border-slate-900 dark:border-slate-100 scale-110 shadow-md'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      >
                        {primaryColor === c.value && (
                          <Check className="w-4 h-4 text-white mx-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-violet-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Creating your business...</span>
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4" />
                        <span>Create Business &amp; Continue</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ─── STEP: Claim Business ──────────────────────────────── */}
          {step === 'claim' && (
            <motion.div
              key="claim"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-slate-800"
            >
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-4 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    Claim Your Business
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter your unique claim code provided by My Grafix Media.
                  </p>
                </div>
              </div>

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

              <form onSubmit={handleClaimBusiness} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Claim Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={claimCode}
                      onChange={(e) => setClaimCode(e.target.value)}
                      placeholder="e.g. ABC123XYZ"
                      className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 transition-all uppercase tracking-widest font-mono"
                      maxLength={20}
                    />
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
                    Enter the claim code you received when your website was built.
                  </p>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying claim code...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Claim Business</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
