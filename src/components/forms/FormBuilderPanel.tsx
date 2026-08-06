import React, { useState } from 'react';
import {
  Palette,
  Layout,
  CheckSquare,
  Type,
  Mail,
  Shield,
  Sliders,
  MoveUp,
  MoveDown,
  Eye,
  Check,
  HelpCircle,
  Zap,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export interface FormFieldConfig {
  id: string;
  label: string;
  type: string;
  enabled: boolean;
  required: boolean;
  placeholder: string;
}

export interface FormBuilderState {
  // Branding
  primaryColor: string;
  buttonColor: string;
  buttonHoverColor: string;
  backgroundColor: string;
  borderRadius: string;
  fontSize: string;
  previewTheme: 'light' | 'dark';

  // Fields
  fields: FormFieldConfig[];

  // Button
  buttonText: string;
  buttonTextColor: string;
  buttonWidth: 'full' | 'auto';

  // Success Message
  successHeading: string;
  successBody: string;

  // Settings
  requiredFieldsMark: boolean;
  spamProtection: boolean;
  fileAttachments: boolean;
  marketingConsent: boolean;
  autoReply: boolean;
}

interface FormBuilderPanelProps {
  config: FormBuilderState;
  onChange: (config: FormBuilderState) => void;
}

export const FormBuilderPanel: React.FC<FormBuilderPanelProps> = ({ config, onChange }) => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'branding' | 'fields' | 'button' | 'success' | 'settings'>('branding');

  const updateConfig = (updates: Partial<FormBuilderState>) => {
    onChange({ ...config, ...updates });
  };

  const handleFieldToggle = (id: string) => {
    const updated = config.fields.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f));
    updateConfig({ fields: updated });
  };

  const handleFieldRequiredToggle = (id: string) => {
    const updated = config.fields.map((f) => (f.id === id ? { ...f, required: !f.required } : f));
    updateConfig({ fields: updated });
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...config.fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;
    const temp = newFields[index];
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;
    updateConfig({ fields: newFields });
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-[750px]">
      {/* Sub-tabs for Builder */}
      <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-slate-950/55 border-b border-slate-200/50 dark:border-white/5 overflow-x-auto scrollbar-none">
        {[
          { id: 'branding', label: 'Branding', icon: Palette },
          { id: 'fields', label: 'Fields', icon: Layout },
          { id: 'button', label: 'Button', icon: Type },
          { id: 'success', label: 'Success', icon: CheckSquare },
          { id: 'settings', label: 'Settings', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'glass-subtle text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        {activeTab === 'branding' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Form Branding & Appearance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Customize colors, fonts, and container radius to match your website theme.
              </p>
            </div>

            {/* Preview Theme Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                  Preview Canvas Theme
                </span>
                <span className="text-[11px] text-slate-500">Test light or dark mode rendering</span>
              </div>
              <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => updateConfig({ previewTheme: 'light' })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    config.previewTheme === 'light'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => updateConfig({ previewTheme: 'dark' })}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    config.previewTheme === 'dark'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Primary Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl glass-subtle text-xs font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Button Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.buttonColor}
                    onChange={(e) => updateConfig({ buttonColor: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={config.buttonColor}
                    onChange={(e) => updateConfig({ buttonColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl glass-subtle text-xs font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Button Hover Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.buttonHoverColor}
                    onChange={(e) => updateConfig({ buttonHoverColor: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={config.buttonHoverColor}
                    onChange={(e) => updateConfig({ buttonHoverColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl glass-subtle text-xs font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Card Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={config.backgroundColor}
                    onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl glass-subtle text-xs font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>

            {/* Border Radius & Font Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Border Radius
                </label>
                <select
                  value={config.borderRadius}
                  onChange={(e) => updateConfig({ borderRadius: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl glass-subtle text-xs font-medium text-slate-900 dark:text-slate-100"
                >
                  <option value="rounded-lg">Subtle (8px)</option>
                  <option value="rounded-xl">Standard (12px)</option>
                  <option value="rounded-2xl">Modern (16px)</option>
                  <option value="rounded-3xl">Pill / Soft (24px)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Font Size Scale
                </label>
                <select
                  value={config.fontSize}
                  onChange={(e) => updateConfig({ fontSize: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl glass-subtle text-xs font-medium text-slate-900 dark:text-slate-100"
                >
                  <option value="text-xs">Compact</option>
                  <option value="text-sm">Standard (14px)</option>
                  <option value="text-base">Spacious (16px)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fields' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Form Fields & Ordering
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enable fields, set requirements, and reorder fields using the move arrows.
              </p>
            </div>

            <div className="space-y-2.5">
              {config.fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveField(idx, 'up')}
                        disabled={idx === 0}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveField(idx, 'down')}
                        disabled={idx === config.fields.length - 1}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                        {field.label}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {field.type} {field.required ? '• Required' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={() => handleFieldRequiredToggle(field.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                      <span>Req.</span>
                    </label>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.enabled}
                        onChange={() => handleFieldToggle(field.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'button' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Submit Button Customization
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure call-to-action button text, color, and dimensions.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Button Text
              </label>
              <input
                type="text"
                value={config.buttonText}
                onChange={(e) => updateConfig({ buttonText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-subtle text-xs font-medium text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Button Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.buttonTextColor}
                    onChange={(e) => updateConfig({ buttonTextColor: e.target.value })}
                    className="w-10 h-10 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={config.buttonTextColor}
                    onChange={(e) => updateConfig({ buttonTextColor: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl glass-subtle text-xs font-mono text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Button Width Style
                </label>
                <select
                  value={config.buttonWidth}
                  onChange={(e) => updateConfig({ buttonWidth: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl glass-subtle text-xs font-medium text-slate-900 dark:text-slate-100"
                >
                  <option value="full">Full Width (100%)</option>
                  <option value="auto">Auto Width</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'success' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Success State / Confirmation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Customize the message displayed to users immediately after successful form submission.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Success Heading
              </label>
              <input
                type="text"
                value={config.successHeading}
                onChange={(e) => updateConfig({ successHeading: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-subtle text-xs font-medium text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Success Body Message
              </label>
              <textarea
                rows={3}
                value={config.successBody}
                onChange={(e) => updateConfig({ successBody: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-subtle text-xs font-medium text-slate-900 dark:text-slate-100 resize-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Form Protection & Email Handlers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure security validation, spam defense, and Cloudflare Worker notification integrations.
              </p>
            </div>

            {/* Resend Integration Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-indigo-500/10 to-indigo-500/10 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    ✓
                  </div>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Powered by Resend
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  Worker Active
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Customer receives instant confirmation email & business owner receives high-priority notification email automatically via the Cloudflare Worker backend.
              </p>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              {[
                {
                  key: 'requiredFieldsMark',
                  label: 'Show Required Asterisk (*)',
                  desc: 'Display red or accent asterisk on required fields.',
                },
                {
                  key: 'spamProtection',
                  label: 'Enable Spam Protection (Turnstile / Honeypot)',
                  desc: 'Prevent bot submissions automatically.',
                },
                {
                  key: 'fileAttachments',
                  label: 'Allow File / Document Attachments',
                  desc: 'Enable users to upload reference files with enquiries.',
                },
                {
                  key: 'marketingConsent',
                  label: 'Collect Marketing Consent Checkbox',
                  desc: 'Add GDPR / POPIA compliance opt-in checkbox.',
                },
                {
                  key: 'autoReply',
                  label: 'Enable Automated Email Auto-Reply',
                  desc: 'Send custom auto-acknowledgement response to submitter.',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-slate-500">{item.desc}</span>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(config as any)[item.key]}
                      onChange={(e) => updateConfig({ [item.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
