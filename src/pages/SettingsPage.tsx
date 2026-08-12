import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import api from '../lib/api-client';
import { PRICING_PLANS } from '../data/pricingData';
import { Modal } from '../components/common/Modal';
import {
  Building2, 
  User, 
  UsersRound, 
  Bell, 
  CreditCard, 
  ShieldAlert, 
  Save, 
  Upload, 
  Check, 
  LogOut, 
  Trash2, 
  Lock,
  Mail,
  Phone,
  MapPin,
  Clock,
  FileText,
  Banknote,
  DollarSign,
  Palette,
  PenLine,
  Copy
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const {
    businessName,
    setBusinessName,
    profileName,
    setProfileName,
    profileEmail,
    setProfileEmail,
    profileAvatar,
    setProfileAvatar,
  } = useData();

  const [activeTab, setActiveTab] = useState<'general' | 'business' | 'website' | 'team' | 'notifications' | 'billing' | 'account' | 'invoice'>('general');

  // Live subscription state for the billing tab
  const [billingStatus, setBillingStatus] = useState<{
    plan: string;
    plan_name: string;
    plan_expires_at: string | null;
    subscription_active: boolean;
  } | null>(null);

  useEffect(() => {
    api.getSubscriptionStatus().then((res) => {
      if (res.success && res.data) {
        setBillingStatus(res.data);
      }
    });
  }, []);

  // Form states
  const [draftBusinessName, setDraftBusinessName] = useState(businessName);
  const [draftProfileName, setDraftProfileName] = useState(profileName);
  const [draftProfileEmail, setDraftProfileEmail] = useState(profileEmail);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [hours, setHours] = useState('');
  const [language, setLanguage] = useState('English (South Africa)');
  const [timezone, setTimezone] = useState('(GMT+02:00) Johannesburg / Cape Town');

  // Notification toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [bookingNotifs, setBookingNotifs] = useState(true);
  const [formNotifs, setFormNotifs] = useState(true);
  const [invoiceNotifs, setInvoiceNotifs] = useState(true);

  // Invoice / Banking settings
  const [bankName, setBankName] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankBranchCode, setBankBranchCode] = useState('');
  const [bankAccountType, setBankAccountType] = useState('');
  const [bankReference, setBankReference] = useState('');
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [vatPercent, setVatPercent] = useState(15);
  const [primaryColor, setPrimaryColor] = useState('#111111');
  const [secondaryColor, setSecondaryColor] = useState('#f5f5f5');
  const [logoUrl, setLogoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Team members state
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'staff' | 'admin'>('staff');
  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState<{ member: any; tempPassword: string } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Load persisted settings on mount so saved values are shown.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await api.get('/api/client-settings');
        if (!cancelled && result.success && result.data) {
          const s = result.data as any;
          if (s.businessName) setDraftBusinessName(s.businessName);
          if (s.phone) setPhone(s.phone);
          if (s.address) setAddress(s.address);
          if (s.openingHours) setHours(s.openingHours);
          if (s.bankName) setBankName(s.bankName);
          if (s.bankAccountName) setBankAccountName(s.bankAccountName);
          if (s.bankAccountNumber) setBankAccountNumber(s.bankAccountNumber);
          if (s.bankBranchCode) setBankBranchCode(s.bankBranchCode);
          if (s.bankAccountType) setBankAccountType(s.bankAccountType);
          if (s.bankReference) setBankReference(s.bankReference);
          if (s.paymentInstructions) setPaymentInstructions(s.paymentInstructions);
          if (s.vatPercent !== undefined) setVatPercent(Number(s.vatPercent));
          if (s.primaryColor) setPrimaryColor(s.primaryColor);
          if (s.secondaryColor) setSecondaryColor(s.secondaryColor);
          if (s.logoUrl) setLogoUrl(s.logoUrl);
          if (s.ownerEmail) setDraftProfileEmail(s.ownerEmail);
        }
      } catch {
        // Silent — fields just stay at defaults if the fetch fails.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Load team members on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await api.get<any>('/api/dashboard/team_members');
        if (!cancelled && result.success && Array.isArray(result.data)) {
          setTeamMembers(result.data);
        }
      } catch {
        // Silent — team list stays empty if the fetch fails.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const loadTeam = async () => {
    const result = await api.get<any>('/api/dashboard/team_members');
    if (result.success && Array.isArray(result.data)) {
      setTeamMembers(result.data);
    }
  };

  const handleInvite = async () => {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    setInviting(true);
    const result = await api.post<any>('/api/dashboard/team_members/invite', {
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
    });
    setInviting(false);
    if (result.success && result.data) {
      setInviteResult(result.data);
      setInviteName('');
      setInviteEmail('');
      setInviteRole('staff');
      await loadTeam();
      addToast({ title: 'Team Member Added', message: `${result.data.member.name} can now sign in.`, type: 'success' });
    } else {
      addToast({ title: 'Invite Failed', message: result.error || 'Could not invite the team member.', type: 'error' });
    }
  };

  const handleRemoveMember = async (member: any) => {
    setRemovingId(member.id);
    const result = await api.del(`/api/dashboard/team_members/${member.id}`);
    setRemovingId(null);
    if (result.success) {
      setTeamMembers((prev) => prev.filter((m) => m.id !== member.id));
      addToast({ title: 'Member Removed', message: `${member.name} no longer has dashboard access.`, type: 'success' });
    } else {
      addToast({ title: 'Remove Failed', message: result.error || 'Could not remove the team member.', type: 'error' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      setBusinessName(draftBusinessName);
      setProfileName(draftProfileName);
      setProfileEmail(draftProfileEmail);

      // Persist business/invoice settings to backend
      const payload: Record<string, any> = {
        businessName: draftBusinessName,
        phone,
        address,
        openingHours: hours,
        bankName,
        bankAccountName,
        bankAccountNumber,
        bankBranchCode,
        bankAccountType,
        bankReference,
        paymentInstructions,
        vatPercent,
        primaryColor,
        secondaryColor,
        logoUrl,
      };

      const result = await api.put('/api/client-settings', payload);
      if (!result.success) {
        addToast({ title: 'Save Failed', message: result.error || 'Could not save settings.', type: 'error' });
        setSaving(false);
        return;
      }

      addToast('Settings updated successfully', 'success');
    } catch (err: any) {
      console.error('[Settings] Save error:', err);
      addToast({ title: 'Network Error', message: err?.message || 'Could not reach the server.', type: 'error' });
    }
    setSaving(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileAvatar(result);
        addToast('Profile picture updated', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await api.upload(file, 'logos');
    const url = result.data?.url || (result as any).url;
    if (!result.success || !url) {
      addToast({ title: 'Upload Failed', message: result.error || 'Could not upload logo.', type: 'error' });
      return;
    }
    setLogoUrl(url);
    addToast({ title: 'Logo uploaded', message: 'Click Save to persist.', type: 'success' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Settings & Account
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account preferences, business details, website integration, and notifications.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none -webkit-overflow-scrolling-touch">
        {[
          { id: 'general', label: 'General', icon: User },
          { id: 'business', label: 'Business', icon: Building2 },
          { id: 'team', label: 'Team', icon: UsersRound },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'billing', label: 'Billing', icon: CreditCard },
          { id: 'invoice', label: 'Invoice', icon: FileText },
          { id: 'account', label: 'Account', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 text-[11px] sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Form / Panel */}
      <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div key="general" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">General Profile</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Update your personal account details, avatar, and language.</p>
                </div>

                {/* Profile Photo */}
                <div className="flex items-center gap-4">
                  <img src={profileAvatar} alt={profileName} className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/30" />
                  <div>
                    <label className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer inline-flex items-center gap-2 transition-colors">
                      <Upload className="w-3.5 h-3.5" /> Upload Photo
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-1">Recommended: Square JPG or PNG, at least 400x400px.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={draftProfileName} 
                      onChange={(e) => setDraftProfileName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={draftProfileEmail} 
                      onChange={(e) => setDraftProfileEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Language</label>
                    <select 
                      value={language} 
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100"
                    >
                      <option>English (South Africa)</option>
                      <option>English (US)</option>
                      <option>Afrikaans</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Timezone</label>
                    <select 
                      value={timezone} 
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100"
                    >
                      <option>(GMT+02:00) Johannesburg / Cape Town</option>
                      <option>(GMT+00:00) London</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'business' && (
              <motion.div key="business" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Business Details</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Configure your business name, contact info, and opening hours.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Business Name</label>
                  <input 
                    type="text" 
                    value={draftBusinessName} 
                    onChange={(e) => setDraftBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Business Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Business logo" className="w-full h-full object-contain" />
                      ) : (
                        <Building2 className="w-7 h-7 text-slate-400" />
                      )}
                    </div>
                    <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" /> Upload Logo
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                    </label>
                    {logoUrl && (
                      <button type="button" onClick={() => setLogoUrl('')} className="text-xs font-semibold text-rose-500 hover:text-rose-600 cursor-pointer">
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">PNG or JPEG. Used on your invoices and website. Save to persist.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
                    <input 
                      type="email" 
                      value={draftProfileEmail} 
                      onChange={(e) => setDraftProfileEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Physical Address</label>
                  <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Opening Hours</label>
                  <input 
                    type="text" 
                    value={hours} 
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100" 
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'team' && (
              <motion.div key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Team & Staff Permissions</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Invite staff and admins to log into the same dashboard. Staff are limited to operational pages (POS, inventory, orders) and cannot access settings or billing.
                  </p>
                </div>

                {/* Invite Form */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Invite a Team Member</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="Full name"
                      className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100"
                    />
                    <div className="flex gap-2">
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as 'staff' | 'admin')}
                        className="flex-1 px-3 py-2 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100 cursor-pointer"
                      >
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleInvite}
                        disabled={inviting || !inviteName.trim() || !inviteEmail.trim()}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md disabled:opacity-50 cursor-pointer"
                      >
                        {inviting ? 'Inviting...' : 'Invite'}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Team List */}
                <div className="space-y-3">
                  {teamMembers.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
                      No team members yet. Invite someone above to share dashboard access.
                    </p>
                  ) : (
                    teamMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{member.name}</p>
                          <p className="text-[11px] text-slate-500">{member.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
<span className={`text-[10px] font-bold uppercase ${
                          member.role === 'admin'
                            ? 'text-amber-700 dark:text-amber-300'
                            : 'text-indigo-700 dark:text-indigo-300'
                        }`}>
                          {member.role}
                        </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member)}
                            disabled={removingId === member.id}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer disabled:opacity-50"
                            title="Remove access"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Notification Preferences</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Choose which alerts and notifications you receive via email.</p>
                </div>

                <div className="space-y-4 text-xs">
                  {[
                    { title: 'Email Notifications', desc: 'Receive daily summary and system alerts', state: emailNotifs, setState: setEmailNotifs },
                    { title: 'Booking Notifications', desc: 'Get notified immediately when a client books online', state: bookingNotifs, setState: setBookingNotifs },
                    { title: 'Form Enquiries', desc: 'Alert when a customer submits a website form', state: formNotifs, setState: setFormNotifs },
                    { title: 'Invoice & Payment Alerts', desc: 'Notify when invoices are paid by customers', state: invoiceNotifs, setState: setInvoiceNotifs },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{item.title}</p>
                        <p className="text-[11px] text-slate-500">{item.desc}</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={item.state} 
                        onChange={(e) => item.setState(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600" 
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'billing' && (
              <motion.div key="billing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Subscription & Billing</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage your My Grafix OS plan and payment methods.</p>
                </div>

                <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-sky-600 text-white space-y-4 shadow-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">
                        {billingStatus?.subscription_active ? 'Current Plan' : 'Current Plan (not renewing)'}
                      </span>
                      <h4 className="text-xl font-extrabold mt-2">
                        {billingStatus ? `${billingStatus.plan_name} Business OS` : 'Loading plan…'}
                      </h4>
                    </div>
                    {billingStatus && (
                      <span className="text-2xl font-black">
                        R{PRICING_PLANS.find((p) => p.id === billingStatus.plan)?.monthlyPrice ?? ''}{' '}
                        <span className="text-xs font-normal">/mo</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-indigo-200">
                    {billingStatus?.subscription_active
                      ? billingStatus.plan_expires_at
                        ? `Next billing date: ${new Date(billingStatus.plan_expires_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}`
                        : 'Automatic renewals are active.'
                      : billingStatus
                        ? 'Automatic renewals are paused.'
                        : 'Subscription status unavailable.'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => navigate('/app/billing')}
                    className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Upgrade Plan
                  </button>
                  <button 
                    type="button" 
                    onClick={() => navigate('/app/billing')}
                    className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                  >
                    Manage Subscription
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'invoice' && (
              <motion.div key="invoice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Invoice Template Settings</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Banking details, VAT, and payment instructions will appear on every PDF invoice.</p>
                </div>

                {/* VAT Settings */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" /> Tax / VAT
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">VAT Rate (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.5}
                        value={vatPercent}
                        onChange={(e) => setVatPercent(parseFloat(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                        placeholder="15"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">VAT Amount on R100</label>
                      <div className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100">
                        R{(100 * vatPercent / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400">Default VAT rate applied when creating invoices. Can be overridden per invoice.</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5" /> Banking Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bank Name</label>
                      <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)}
                        placeholder="e.g. First National Bank"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Name</label>
                      <input type="text" value={bankAccountName} onChange={(e) => setBankAccountName(e.target.value)}
                        placeholder="e.g. My Business (Pty) Ltd"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Number</label>
                      <input type="text" value={bankAccountNumber} onChange={(e) => setBankAccountNumber(e.target.value)}
                        placeholder="e.g. 62819283746"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Branch Code</label>
                      <input type="text" value={bankBranchCode} onChange={(e) => setBankBranchCode(e.target.value)}
                        placeholder="e.g. 255005"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Account Type</label>
                      <input type="text" value={bankAccountType} onChange={(e) => setBankAccountType(e.target.value)}
                        placeholder="e.g. Cheque / Savings"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Reference</label>
                      <input type="text" value={bankReference} onChange={(e) => setBankReference(e.target.value)}
                        placeholder="e.g. My Business Invoice"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" /> Template Colors
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Used for headers, headings and accents on your invoices.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer" />
                        <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                          placeholder="#111111"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Secondary Color</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer" />
                        <input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)}
                          placeholder="#f5f5f5"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <PenLine className="w-3.5 h-3.5" /> Payment Instructions
                  </h4>
                  <textarea value={paymentInstructions} onChange={(e) => setPaymentInstructions(e.target.value)}
                    placeholder="e.g. Please use the invoice number as reference when making payment. EFT payments may take 2-3 business days to reflect."
                    rows={4}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 resize-none" />
                </div>
              </motion.div>
            )}

            {activeTab === 'account' && (
              <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Account Security & Access</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Logout or manage account deletion.</p>
                </div>

                <div className="space-y-4">
                  <button 
                    type="button"
                    onClick={() => navigate('/login')}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><LogOut className="w-4 h-4 text-amber-600" /> Log Out of Account</span>
                    <span>→</span>
                  </button>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600">Danger Zone</h4>
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-rose-900 dark:text-rose-200 text-xs">Delete Business Account</p>
                      <p className="text-[11px] text-rose-600 dark:text-rose-400">Permanently remove your account, data, and website.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => addToast('Please contact support to delete your account', 'error')}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Temporary password modal after inviting a team member */}
      <Modal
        isOpen={Boolean(inviteResult)}
        onClose={() => setInviteResult(null)}
        title="Team Member Invited"
        subtitle="Share this temporary password so they can sign in. Ask them to change it after first login."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Email</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{inviteResult?.member.email}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Role</span>
              <span className="font-semibold uppercase text-slate-800 dark:text-slate-200">{inviteResult?.member.role}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 text-xs">Temporary password</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{inviteResult?.tempPassword}</span>
                <button
                  type="button"
                  onClick={() => {
                    if (inviteResult) {
                      navigator.clipboard?.writeText(inviteResult.tempPassword);
                      addToast({ title: 'Copied', message: 'Temporary password copied to clipboard.', type: 'success' });
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            This password is shown only once. If lost, remove the member and invite them again.
          </p>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setInviteResult(null)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
