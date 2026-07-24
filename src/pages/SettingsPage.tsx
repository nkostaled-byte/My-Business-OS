import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import { 
  Building2, 
  User, 
  Globe, 
  Users, 
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
  Clock
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
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

  const [activeTab, setActiveTab] = useState<'general' | 'business' | 'website' | 'team' | 'notifications' | 'billing' | 'account'>('general');

  // Form states
  const [draftBusinessName, setDraftBusinessName] = useState(businessName);
  const [draftProfileName, setDraftProfileName] = useState(profileName);
  const [draftProfileEmail, setDraftProfileEmail] = useState(profileEmail);
  const [phone, setPhone] = useState('+27 82 555 0192');
  const [address, setAddress] = useState('124 Long Street, Cape Town, South Africa');
  const [hours, setHours] = useState('Mon - Sat: 08:00 - 18:00');
  const [language, setLanguage] = useState('English (South Africa)');
  const [timezone, setTimezone] = useState('(GMT+02:00) Johannesburg / Cape Town');

  // Notification toggles
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [bookingNotifs, setBookingNotifs] = useState(true);
  const [formNotifs, setFormNotifs] = useState(true);
  const [invoiceNotifs, setInvoiceNotifs] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessName(draftBusinessName);
    setProfileName(draftProfileName);
    setProfileEmail(draftProfileEmail);

    addToast('Settings updated successfully', 'success');
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
      <div className="flex items-center gap-1 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none">
        {[
          { id: 'general', label: 'General', icon: User },
          { id: 'business', label: 'Business', icon: Building2 },
          { id: 'website', label: 'Website', icon: Globe },
          { id: 'team', label: 'Team', icon: Users },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'billing', label: 'Billing', icon: CreditCard },
          { id: 'account', label: 'Account', icon: ShieldAlert },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'text-violet-600 dark:text-violet-400 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 dark:bg-violet-400"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Content Form / Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs max-w-3xl">
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
                  <img src={profileAvatar} alt={profileName} className="w-16 h-16 rounded-full object-cover ring-2 ring-violet-500/30" />
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={draftProfileEmail} 
                      onChange={(e) => setDraftProfileEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Language</label>
                    <select 
                      value={language} 
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
                    <input 
                      type="email" 
                      value={draftProfileEmail} 
                      onChange={(e) => setDraftProfileEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Physical Address</label>
                  <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Opening Hours</label>
                  <input 
                    type="text" 
                    value={hours} 
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" 
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'website' && (
              <motion.div key="website" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Website & Domain Settings</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage your custom domain, SEO metadata, and social links.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-slate-400">Active Domain</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                    https://{businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.co.za
                  </p>
                  <span className="text-[11px] text-emerald-600 font-semibold block">SSL Secure & Online</span>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Default SEO Title</label>
                  <input 
                    type="text" 
                    defaultValue={`${businessName} — Professional Services & Online Bookings`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Social Media Links</label>
                  <input 
                    type="text" 
                    placeholder="Instagram profile URL"
                    defaultValue="https://instagram.com/mygrafixmedia"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100" 
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'team' && (
              <motion.div key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Team & Staff Permissions</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Manage staff members and access levels.</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => navigate('/app/staff')}
                    className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Manage Staff
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'David Khumalo', role: 'Senior Stylist / Manager', email: 'david@grafix.co.za' },
                    { name: 'Lerato Mokoena', role: 'Stylist / Consultant', email: 'lerato@grafix.co.za' },
                  ].map((staff, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100 text-xs">{staff.name}</p>
                        <p className="text-[11px] text-slate-500">{staff.role} • {staff.email}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">Active</span>
                    </div>
                  ))}
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
                        className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 accent-violet-600" 
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

                <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-900 to-indigo-900 text-white space-y-4 shadow-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-1 rounded-full">Current Plan</span>
                      <h4 className="text-xl font-extrabold mt-2">Professional Business OS</h4>
                    </div>
                    <span className="text-2xl font-black">R499 <span className="text-xs font-normal">/mo</span></span>
                  </div>
                  <p className="text-xs text-violet-200">Next billing date: August 24, 2026</p>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => navigate('/app/billing')}
                    className="flex-1 py-3 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    Upgrade Plan
                  </button>
                  <button 
                    type="button" 
                    onClick={() => addToast('Subscription management portal opened', 'info')}
                    className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                  >
                    Manage Subscription
                  </button>
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
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
