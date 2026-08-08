import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  Key, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Mail,
  ShieldAlert,
  Users
} from 'lucide-react';

export const SecurityPage: React.FC = () => {
  const securityCards = [
    {
      icon: Lock,
      title: 'SSL Encryption',
      desc: 'All traffic between your customers and your website is protected with 256-bit TLS encryption.'
    },
    {
      icon: ShieldCheck,
      title: 'Edge Threat Protection',
      desc: 'Advanced web application firewall (WAF) blocks malicious bots, DDoS attacks, and unauthorized access attempts.'
    },
    {
      icon: Key,
      title: 'Encrypted Authentication',
      desc: 'Secure password hashing and token-based session management protect user access.'
    },
    {
      icon: Users,
      title: 'Role-Based Permissions',
      desc: 'Granular access controls ensure staff members only view authorized dashboard modules.'
    },
    {
      icon: Database,
      title: 'Automatic Backups',
      desc: 'Continuous real-time data backups ensure your business records are safe and recoverable.'
    },
    {
      icon: Server,
      title: 'Modern Infrastructure',
      desc: 'Built on distributed, fault-tolerant cloud containers with 99.98% guaranteed uptime.'
    }
  ];

  const complianceCards = [
    { title: 'GDPR Ready', desc: 'Compliant with European data privacy and user consent regulations.' },
    { title: 'POPIA Ready', desc: 'Fully aligned with South Africa’s Protection of Personal Information Act.' },
    { title: 'Global Edge Network', desc: 'High-performance content delivery optimized for low latency across Africa and Europe.' },
    { title: 'Encrypted Storage', desc: 'Database records and media uploads are encrypted at rest.' }
  ];

  const bestPractices = [
    { title: 'Password Security', desc: 'Enforced strong password requirements with complexity checks.' },
    { title: 'Two-Factor Authentication', desc: 'Enhanced account verification protocols (Coming Soon).' },
    { title: 'Secure Infrastructure', desc: 'Automated vulnerability scanning and penetration testing.' },
    { title: 'Regular Updates', desc: 'Continuous security patches and dependency audits.' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-indigo-500/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto">
            Enterprise-grade <span className="text-indigo-600 dark:text-indigo-400">Security</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Keeping your business and customer data secure with state-of-the-art encryption, threat monitoring, and infrastructure redundancy.
          </p>
        </div>
      </section>

      {/* Security Cards */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Core Security Measures</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Built from the ground up to protect your sensitive operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityCards.map((c, idx) => {
              const Icon = c.icon;
              return (
                <div key={idx} className="glass-panel rounded-3xl p-8 space-y-4 hover:border-indigo-500/50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{c.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Compliance & Standards</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Meeting rigorous regulatory standards for peace of mind.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {complianceCards.map((comp, idx) => (
            <div key={idx} className="glass-panel rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{comp.title}</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{comp.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Security Best Practices</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Proactive measures ensuring continuous system integrity.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestPractices.map((bp, idx) => (
              <div key={idx} className="glass-panel rounded-3xl p-6 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{bp.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{bp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible Disclosure */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-300 text-[10px] font-bold uppercase">
              <ShieldAlert className="w-3.5 h-3.5" /> Responsible Disclosure
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Found a security vulnerability?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
              We take security research seriously. If you discover a vulnerability, please report it to our security team responsibly.
            </p>
          </div>
          <a
            href="mailto:security@mygrafixmedia.co.za"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md whitespace-nowrap transition-all"
          >
            Contact Security Team
          </a>
        </div>
      </section>
    </div>
  );
};
