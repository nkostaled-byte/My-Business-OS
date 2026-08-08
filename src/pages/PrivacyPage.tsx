import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Last Updated: July 24, 2026</p>
        </div>
      </section>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Table of Contents (Desktop Sidebar) */}
        <div className="hidden lg:block lg:col-span-1 space-y-3 sticky top-24 self-start">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4">Table of Contents</h4>
          <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <li><a href="#collection" className="hover:text-indigo-600">1. Information We Collect</a></li>
            <li><a href="#usage" className="hover:text-indigo-600">2. How We Use Your Data</a></li>
            <li><a href="#cookies" className="hover:text-indigo-600">3. Cookies & Tracking</a></li>
            <li><a href="#thirdparty" className="hover:text-indigo-600">4. Third-Party Services</a></li>
            <li><a href="#retention" className="hover:text-indigo-600">5. Data Retention</a></li>
            <li><a href="#rights" className="hover:text-indigo-600">6. User Rights & POPIA</a></li>
            <li><a href="#contact" className="hover:text-indigo-600">7. Contact Information</a></li>
          </ul>
        </div>

        {/* Main Legal Body */}
        <div className="lg:col-span-3 space-y-12 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <div className="p-6 rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 space-y-2">
            <p className="font-bold">Overview</p>
            <p>At My Grafix Media ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use My Grafix OS and our web services.</p>
          </div>

          <section id="collection" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">1. Information We Collect</h2>
            <p>We collect information you provide directly when creating an account, publishing a website, or configuring business settings:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Account Information:</strong> Name, business name, email address, and phone number.</li>
              <li><strong>Business Content:</strong> Product catalogs, service listings, booking schedules, and gallery images.</li>
              <li><strong>Transaction Data:</strong> Invoice records and POS sales summaries.</li>
            </ul>
          </section>

          <section id="usage" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">2. How We Use Your Data</h2>
            <p>We use the collected data to provide, maintain, and improve our services:</p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>Generating and hosting your business website.</li>
              <li>Processing online bookings and form submissions.</li>
              <li>Sending essential transactional notifications and system alerts.</li>
            </ul>
          </section>

          <section id="cookies" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">3. Cookies & Tracking</h2>
            <p>We use session cookies and local storage tokens strictly required for authentication and dashboard preferences. We do not track users across third-party advertising networks.</p>
          </section>

          <section id="thirdparty" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">4. Third-Party Services</h2>
            <p>We integrate with secure cloud infrastructure and payment processors. All third-party partners adhere to strict data protection standards and encryption protocols.</p>
          </section>

          <section id="retention" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">5. Data Retention</h2>
            <p>We retain your business data for as long as your account is active. Upon account deletion, all personal data and website files are securely purged within 30 days.</p>
          </section>

          <section id="rights" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">6. User Rights & POPIA Compliance</h2>
            <p>In accordance with the Protection of Personal Information Act (POPIA) and GDPR, you have the right to access, correct, or request deletion of your personal data at any time by contacting our privacy team.</p>
          </section>

          <section id="contact" className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">7. Contact Information</h2>
            <p>If you have questions regarding this Privacy Policy, please contact our Data Protection Officer at <span className="font-mono text-indigo-600">privacy@mygrafixmedia.co.za</span>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};
