import React from 'react';
import { motion } from 'motion/react';
import { FileText, Shield } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Last Updated: July 24, 2026</p>
        </div>
      </section>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Table of Contents */}
        <div className="hidden lg:block lg:col-span-1 space-y-3 sticky top-24 self-start">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">Table of Contents</h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <li><a href="#acceptance" className="hover:text-indigo-600">1. Acceptance of Terms</a></li>
            <li><a href="#accounts" className="hover:text-indigo-600">2. Accounts & Security</a></li>
            <li><a href="#subscriptions" className="hover:text-indigo-600">3. Subscriptions & Billing</a></li>
            <li><a href="#cancellations" className="hover:text-indigo-600">4. Cancellations & Refunds</a></li>
            <li><a href="#acceptable" className="hover:text-indigo-600">5. Acceptable Use</a></li>
            <li><a href="#ip" className="hover:text-indigo-600">6. Intellectual Property</a></li>
            <li><a href="#liability" className="hover:text-indigo-600">7. Limitation of Liability</a></li>
            <li><a href="#termination" className="hover:text-indigo-600">8. Termination</a></li>
          </ul>
        </div>

        {/* Main Body */}
        <div className="lg:col-span-3 space-y-12 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section id="acceptance" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">1. Acceptance of Terms</h2>
            <p>By accessing or using My Grafix OS, you agree to be bound by these Terms of Service. If you do not agree to all terms, you may not access our platform or publish websites through our service.</p>
          </section>

          <section id="accounts" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">2. Accounts & Security</h2>
            <p>You must provide accurate information when creating your business account. You are responsible for maintaining the confidentiality of your login credentials and for all activities conducted under your account.</p>
          </section>

          <section id="subscriptions" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">3. Subscriptions & Billing</h2>
            <p>Paid plans are billed in advance on a monthly or annual basis. Subscriptions automatically renew unless canceled prior to the billing renewal date.</p>
          </section>

          <section id="cancellations" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">4. Cancellations & Refund Policy</h2>
            <p>You may cancel your subscription at any time from your account billing settings. Refunds are evaluated on a case-by-case basis within 14 days of initial purchase.</p>
          </section>

          <section id="acceptable" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">5. Acceptable Use</h2>
            <p>You agree not to use My Grafix OS to transmit malicious code, spam, fraudulent material, or infringe upon the intellectual property rights of others.</p>
          </section>

          <section id="ip" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">6. Intellectual Property</h2>
            <p>All software, design templates, and platform branding remain the intellectual property of My Grafix Media. Your custom business content and website text remain entirely yours.</p>
          </section>

          <section id="liability" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">7. Limitation of Liability</h2>
            <p>My Grafix Media shall not be liable for any indirect, incidental, or consequential damages resulting from service interruptions or data loss beyond our reasonable control.</p>
          </section>

          <section id="termination" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">8. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these Terms of Service without prior notice.</p>
          </section>
        </div>
      </div>
    </div>
  );
};
