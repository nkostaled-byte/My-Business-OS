import React, { useState } from 'react';
import { motion } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { 
  Briefcase, 
  Globe, 
  Clock, 
  Cpu, 
  TrendingUp, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Send,
  MapPin,
  Building
} from 'lucide-react';

export const CareersPage: React.FC = () => {
  const { addToast } = useToast();
  const [cvSubmitted, setCvSubmitted] = useState(false);
  const [cvEmail, setCvEmail] = useState('');

  const handleCvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvEmail) return;
    setCvSubmitted(true);
    addToast('CV application received! Our talent team will be in touch.', 'success');
  };

  const openPositions = [
    {
      title: 'Senior Full-Stack React Engineer',
      department: 'Engineering',
      location: 'Remote (Africa / Europe)',
      type: 'Full-time',
      desc: 'Build high-performance web applications and cloud infrastructure for thousands of African business owners.',
    },
    {
      title: 'Customer Success Lead',
      department: 'Operations',
      location: 'Cape Town, South Africa',
      type: 'Full-time',
      desc: 'Guide business owners through onboarding, website publishing, and point-of-sale integration.',
    },
    {
      title: 'Product Designer (UI/UX)',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
      desc: 'Craft world-class, human-centric interfaces that make running a business simple and delightful.',
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: 'Remote-First Culture',
      desc: 'Work from where you feel most creative and productive, with flexible asynchronous collaboration.'
    },
    {
      icon: Clock,
      title: 'Flexible Working Hours',
      desc: 'We value deep work and results over rigid clock-watching schedules.'
    },
    {
      icon: Cpu,
      title: 'Modern Technology',
      desc: 'Build with cutting-edge tools including React, TypeScript, Tailwind, and advanced cloud systems.'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth & Equity',
      desc: 'Generous learning stipends, mentorship programs, and competitive performance incentives.'
    },
    {
      icon: Users,
      title: 'Creative & Diverse Team',
      desc: 'Collaborate with passionate builders across multiple countries dedicated to empowering entrepreneurs.'
    },
    {
      icon: BookOpen,
      title: 'Continuous Learning',
      desc: 'Annual book allowances, conference passes, and dedicated time for professional experimentation.'
    }
  ];

  const hiringSteps = [
    { step: '01', title: 'Application', desc: 'Submit your resume and portfolio showcasing your craft.' },
    { step: '02', title: 'Introductory Chat', desc: 'A casual 30-minute conversation with our team leads.' },
    { step: '03', title: 'Technical Discussion', desc: 'A collaborative walkthrough of real-world problem solving.' },
    { step: '04', title: 'Offer', desc: 'Welcome aboard with competitive compensation and onboarding.' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-28 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-indigo-500/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-bold"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Careers at My Grafix Media</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto"
          >
            Join us in empowering <span className="text-indigo-600 dark:text-indigo-400">African businesses</span> to thrive online
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            We build intuitive websites, point-of-sale systems, and business software that help entrepreneurs scale effortlessly. Come build the future with us.
          </motion.p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Why Work With Us</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">We foster an environment of ownership, craftsmanship, and continuous personal growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div key={idx} className="glass-panel rounded-3xl p-8 space-y-4 hover:border-indigo-400/50 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold">{b.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Open Positions</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Explore our current openings and find where your expertise shines.</p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {openPositions.length > 0 ? (
            openPositions.map((job, idx) => (
              <div key={idx} className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider">
                      {job.department}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                      {job.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{job.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">{job.desc}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" /> {job.location}
                  </p>
                </div>

                <button
                  onClick={() => addToast(`Application modal opened for ${job.title}`, 'info')}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all whitespace-nowrap cursor-pointer"
                >
                  Apply Now
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-16 glass-panel rounded-3xl space-y-4">
              <Building className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold">No current openings</h3>
              <p className="text-xs text-slate-500">Check back soon or send us a general application below.</p>
            </div>
          )}
        </div>
      </section>

      {/* Hiring Process */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Our Hiring Process</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Simple, respectful, and designed to let your talents shine.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hiringSteps.map((s, idx) => (
              <div key={idx} className="glass-panel rounded-3xl p-6 space-y-3 relative">
                <span className="text-3xl font-black text-indigo-600/30">{s.step}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{s.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Send CV Section */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-sky-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight relative z-10">
            Don't see your exact role?
          </h2>
          <p className="text-sm text-indigo-200 max-w-xl mx-auto relative z-10">
            We are always looking for exceptional engineers, designers, and customer champions. Send us your CV and tell us how you can contribute.
          </p>

          {!cvSubmitted ? (
            <form onSubmit={handleCvSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={cvEmail}
                onChange={(e) => setCvEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 text-xs focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition-colors shadow-lg cursor-pointer"
              >
                Send CV
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold inline-flex items-center gap-2 relative z-10">
              <CheckCircle2 className="w-4 h-4" /> CV application successfully received!
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
