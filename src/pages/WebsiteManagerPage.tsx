import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import api from '../lib/api-client';
import {
  Globe2,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Activity,
  Lock,
  ArrowUpRight,
  RefreshCw,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Save,
  AlertTriangle,
  FileText,
  Package,
  BriefcaseBusiness,
} from 'lucide-react';

interface ClientState {
  businessName: string;
  phone: string;
  address: string;
  openingHours: string;
  ownerEmail: string;
  websiteUrl: string;
}

interface ProbeResult {
  status: 'checking' | 'online' | 'offline';
  latency: number | null;
}

interface SiteMetrics {
  totalBookings?: number;
  totalOrders?: number;
  totalCustomers?: number;
  totalRevenue?: number;
  unreadSubmissions?: number;
  todayBookings?: unknown[];
}

function normalizeSiteUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const WebsiteManagerPage: React.FC = () => {
  const { 
    businessName: ctxBusinessName, 
    setBusinessName,
    websiteSettings,
    websiteSettingsLoading,
    refreshWebsiteSettings,
    updateWebsiteSettings,
  } = useData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<ClientState>({
    businessName: websiteSettings?.businessName || ctxBusinessName,
    phone: websiteSettings?.phone || '',
    address: websiteSettings?.address || '',
    openingHours: websiteSettings?.openingHours || '',
    ownerEmail: websiteSettings?.ownerEmail || '',
    websiteUrl: websiteSettings?.websiteUrl || '',
  });
  const [copied, setCopied] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState(normalizeSiteUrl(websiteSettings?.websiteUrl || ''));
  const [probe, setProbe] = useState<ProbeResult>({ status: 'checking', latency: null });
  const [metrics, setMetrics] = useState<SiteMetrics | null>(null);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Load metrics only (settings are cached in context)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      // If we don't have cached settings, load them
      if (!websiteSettings && !websiteSettingsLoading) {
        await refreshWebsiteSettings();
      }
      // Load metrics
      const res = await api.get<SiteMetrics>('/api/dashboard/metrics');
      if (!cancelled) {
        if (res.success && res.data) {
          setMetrics(res.data);
        } else {
          setMetrics(null);
          setMetricsError(res.error || 'Analytics unavailable for this plan.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Update local state when context settings change
  useEffect(() => {
    if (websiteSettings) {
      setSettings({
        businessName: websiteSettings.businessName || ctxBusinessName,
        phone: websiteSettings.phone || '',
        address: websiteSettings.address || '',
        openingHours: websiteSettings.openingHours || '',
        ownerEmail: websiteSettings.ownerEmail || '',
        websiteUrl: websiteSettings.websiteUrl || '',
      });
      setWebsiteUrl(normalizeSiteUrl(websiteSettings.websiteUrl || ''));
    }
  }, [websiteSettings, ctxBusinessName]);

  const probeSite = async (url: string) => {
    if (!url) {
      setProbe({ status: 'offline', latency: null });
      return;
    }
    setProbe((p) => ({ ...p, status: 'checking' }));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const start = performance.now();
    try {
      await fetch(url, { mode: 'no-cors', signal: controller.signal });
      setProbe({ status: 'online', latency: Math.round(performance.now() - start) });
    } catch {
      setProbe({ status: 'offline', latency: Math.round(performance.now() - start) });
    } finally {
      clearTimeout(timer);
    }
  };

  // Probe the live site whenever the linked URL changes.
  useEffect(() => {
    if (loading) return;
    probeSite(websiteUrl);
  }, [websiteUrl, loading]);

  const handleSave = async () => {
    setSaving(true);
    const normalized = normalizeSiteUrl(settings.websiteUrl);
    const payload = {
      businessName: settings.businessName,
      phone: settings.phone,
      address: settings.address,
      openingHours: settings.openingHours,
      websiteUrl: normalized,
    };
    const success = await updateWebsiteSettings(payload);
    setSaving(false);
    if (!success) {
      addToast({ title: 'Save Failed', message: 'Could not save.', type: 'error' });
      return;
    }
    if (settings.businessName) setBusinessName?.(settings.businessName);
    setWebsiteUrl(normalized);
    probeSite(normalized);
    addToast('Website content saved', 'success');
  };

  const handlePublish = async () => {
    await handleSave();
  };

  const handleCopyLink = async () => {
    if (!websiteUrl) {
      addToast('Set a website URL to copy a link', 'info');
      return;
    }
    try {
      await navigator.clipboard.writeText(websiteUrl);
      setCopied(true);
      addToast('Website link copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('Could not copy to clipboard', 'error');
    }
  };

  const set = (field: keyof ClientState, value: string) =>
    setSettings((prev) => ({ ...prev, [field]: value }));

  const siteOnline = probe.status === 'online';
  const siteConfigured = !!websiteUrl;

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-12">
      {/* Website Status Card */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-600 to-sky-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10 max-w-xl">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {!siteConfigured
              ? 'Add your website address to go live.'
              : probe.status === 'online'
                ? 'Your website is live and reachable by customers.'
                : probe.status === 'offline'
                  ? 'We could not reach your website.'
                  : 'Checking your website…'}
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/90 font-mono truncate">
            {websiteUrl || 'https://your-site.co.za'}
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
          {websiteUrl ? (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-950 hover:bg-indigo-50 text-xs font-extrabold shadow-lg transition-all cursor-pointer"
            >
              <span>Visit Website</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          ) : null}
        </div>
      </div>

      {/* Website Health KPI Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Website Health</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-3xl p-6 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</span>
            <div className="flex items-center justify-between">
              <p
                className={`text-lg font-extrabold flex items-center gap-2 ${
                  siteOnline
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : probe.status === 'offline'
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    siteOnline
                      ? 'bg-emerald-500 animate-pulse'
                      : probe.status === 'offline'
                        ? 'bg-rose-500'
                        : 'bg-slate-300 animate-pulse'
                  }`}
                />
                {probe.status === 'checking' ? 'Checking' : siteOnline ? 'Online' : 'Offline'}
              </p>
              <Activity className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-[11px] text-slate-500 block">
              {siteConfigured
                ? probe.status === 'offline'
                  ? 'Could not reach the site.'
                  : probe.latency != null
                    ? `Responded in ${probe.latency}ms`
                    : 'Verifying…'
                : 'No URL set yet'}
            </span>
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Connection</span>
            <div className="flex items-center justify-between">
              <p className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldCheck className="w-5 h-5 text-indigo-600" /> Secure
              </p>
              <Lock className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-[11px] text-slate-500 block">Served over HTTPS</span>
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Updates</span>
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">Instant</p>
              <RefreshCw className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-[11px] text-slate-500 block">Edits apply immediately</span>
          </div>

          <div className="glass-panel rounded-3xl p-6 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Last Checked</span>
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                {probe.status === 'checking' ? '—' : 'Just now'}
              </p>
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-[11px] text-slate-500 block">Live reachability probe</span>
          </div>
        </div>
      </div>

      {/* Business Information Section — inline editable, saves via client-settings */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Business Information</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Displayed on your website footer, contact page, and header. Saved directly to My Grafix OS — no need to leave this page.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" /> Live Website URL
            </span>
            <input
              type="text"
              value={settings.websiteUrl}
              onChange={(e) => set('websiteUrl', e.target.value)}
              placeholder="https://your-site.co.za"
              className="w-full px-3 py-2 rounded-xl glass-subtle text-sm font-bold text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-slate-400 font-medium">Business Name</span>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => set('businessName', e.target.value)}
              placeholder="Your business name"
              className="w-full px-3 py-2 rounded-xl glass-subtle text-sm font-bold text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </span>
            <input
              type="email"
              value={settings.ownerEmail}
              onChange={(e) => set('ownerEmail', e.target.value)}
              placeholder="Contact email"
              className="w-full px-3 py-2 rounded-xl glass-subtle text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Phone Number
            </span>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="+27 ..."
              className="w-full px-3 py-2 rounded-xl glass-subtle text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Physical Address
            </span>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="Street, City"
              className="w-full px-3 py-2 rounded-xl glass-subtle text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="space-y-1.5">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Opening Hours
            </span>
            <input
              type="text"
              value={settings.openingHours}
              onChange={(e) => set('openingHours', e.target.value)}
              placeholder="Mon-Fri 9am-6pm"
              className="w-full px-3 py-2 rounded-xl glass-subtle text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Website Content Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Website Content</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'Manage Services', desc: 'Add or edit services offered to clients', path: '/app/services', icon: BriefcaseBusiness },
            { label: 'Manage Products', desc: 'Update POS and online catalog items', path: '/app/products', icon: Package },
            { label: 'Update Gallery', desc: 'Upload portfolio photos and showcase work', path: '/app/gallery', icon: FileText },
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(action.path)}
                className="glass-panel p-6 rounded-3xl hover:border-indigo-500/50 cursor-pointer transition-all group space-y-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{action.label}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{action.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Website Analytics — real data derived from CRM sources */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Website Engagement</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real activity derived from your My Grafix data — bookings and enquiries your website drives.
            </p>
          </div>
          <NavLink to="/app/analytics" className="text-xs font-bold text-indigo-600 hover:underline">
            Detailed reports
          </NavLink>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
            ))}
          </div>
        ) : metricsError ? (
          <div className="flex items-center justify-center gap-2 py-12 text-slate-400 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            {metricsError}
          </div>
        ) : metrics ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Bookings</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{metrics.totalBookings ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">New Enquiries</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{metrics.unreadSubmissions ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{metrics.totalOrders ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Customers</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{metrics.totalCustomers ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Revenue</span>
              <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                R{Math.round(metrics.totalRevenue ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 text-slate-400 text-xs">
            No website activity recorded yet.
          </div>
        )}
      </div>

      {/* Publishing Status */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Website Status</span>
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">Changes published instantly</h4>
        </div>
        <button
          onClick={handlePublish}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? 'Publishing Changes...' : 'Publish Changes'}
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

      <div className="flex items-center justify-end gap-2 text-[11px] text-slate-400">
        <Edit3 className="w-3.5 h-3.5" />
        View the full business settings on the Settings page.
      </div>
    </div>
  );
};