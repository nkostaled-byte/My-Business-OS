import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import {
  Globe,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Activity,
  Calendar,
  FileText,
  Package,
  Scissors,
  Server,
  Lock,
  ArrowUpRight,
  RefreshCw,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Users,
  Eye,
  BarChart3,
  Share2,
  Send,
  Building,
} from 'lucide-react';

export const WebsiteManagerPage: React.FC = () => {
  const { businessName, profileEmail, isLoading } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const websiteUrl = `https://${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.za`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(websiteUrl);
    setCopied(true);
    addToast('Website link copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      addToast('Website published', 'success');
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Website Manager
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your business website, monitor its health, and keep your online presence up to date.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 cursor-pointer transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPublishing ? 'animate-spin' : ''}`} />
            <span>{isPublishing ? 'Publishing...' : 'Publish Changes'}</span>
          </button>
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs cursor-pointer transition-all"
          >
            <span>Visit Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Website Status Card */}
      <div className="relative bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-3 relative z-10 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Website Live
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Your website is online and available to customers.
          </h2>
          <p className="text-xs sm:text-sm text-violet-200/90 font-mono">
            {websiteUrl}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 w-full md:w-auto">
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white backdrop-blur-md transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Link' : 'Copy Website Link'}</span>
          </button>
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-violet-950 hover:bg-violet-50 text-xs font-extrabold shadow-lg transition-all cursor-pointer"
          >
            <span>Visit Website</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Website Health KPI Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Website Health</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Website Status</span>
            <div className="flex items-center justify-between">
              <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </p>
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-[11px] text-slate-500 block">100% operational</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">SSL Active</span>
            <div className="flex items-center justify-between">
              <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-violet-600" /> Secure
              </p>
              <Lock className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-[11px] text-slate-500 block">Valid TLS Certificate</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Last Published</span>
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">—</p>
              <Calendar className="w-5 h-5 text-violet-600" />
            </div>
            <span className="text-[11px] text-slate-500 block">Not published yet</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Uptime</span>
            <div className="flex items-center justify-between">
              <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100">—</p>
              <Server className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-[11px] text-slate-500 block">Monitoring inactive</span>
          </div>
        </div>
      </div>

      {/* Business Information Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Business Information</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Displayed in your website footer, contact page, and header.</p>
          </div>
          <button 
            onClick={() => navigate('/app/settings')}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Information
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Business Name</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{businessName}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Business Type</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">—</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Phone Number</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">—</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Email Address</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{profileEmail}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Physical Address</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">—</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Opening Hours</span>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">—</p>
          </div>
        </div>
      </div>

      {/* Website Content Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Website Content</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Manage Services', desc: 'Add or edit services offered to clients', path: '/app/services', icon: Scissors },
            { label: 'Manage Products', desc: 'Update POS and online catalog items', path: '/app/products', icon: Package },
            { label: 'Update Gallery', desc: 'Upload portfolio photos and showcase work', path: '/app/gallery', icon: FileText },
            { label: 'Preview Website', desc: 'View live responsive website layout', path: '/app', icon: Eye },
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <div 
                key={idx}
                onClick={() => navigate(action.path)}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-violet-500/50 cursor-pointer transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-600 transition-colors">{action.label}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{action.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Website Analytics */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Website Analytics</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Visitor engagement and conversion metrics over the last 30 days.</p>
          </div>
          <NavLink to="/app/analytics" className="text-xs font-bold text-violet-600 hover:underline">
            Detailed reports
          </NavLink>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-slate-400 text-xs">
            Connect a supported analytics service to view visitor metrics.
          </div>
        )}
      </div>

      {/* Publishing Status */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Website Status</span>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">Changes published instantly</h4>
        </div>
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-500/20 transition-all cursor-pointer"
        >
          {isPublishing ? 'Publishing Changes...' : 'Publish Changes'}
        </button>
      </div>

      {/* Hosted & Managed Card */}
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Hosted & Managed by My Grafix Media</h4>
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Secure SSL</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Automatic Backups</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Global Performance</span>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Automatic Updates</span>
        </div>
      </div>

    </div>
  );
};
