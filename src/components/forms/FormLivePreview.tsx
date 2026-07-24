import React, { useState } from 'react';
import { FormBuilderState } from './FormBuilderPanel';
import { Send, CheckCircle2 } from 'lucide-react';

interface FormLivePreviewProps {
  config: FormBuilderState;
  businessName: string;
}

export const FormLivePreview: React.FC<FormLivePreviewProps> = ({ config, businessName }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const isDark = config.previewTheme === 'dark';

  return (
    <div
      className={`rounded-3xl border transition-all shadow-xl p-6 sm:p-8 flex flex-col justify-between h-[750px] overflow-y-auto ${
        isDark ? 'bg-slate-950 text-slate-100 border-slate-800' : 'bg-white text-slate-900 border-slate-200'
      }`}
      style={{ backgroundColor: isDark ? '#090d16' : config.backgroundColor }}
    >
      <div className="space-y-6">
        {/* Preview Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-200/20 dark:border-slate-800/80">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-500 block">
              Live Preview
            </span>
            <h4 className="text-sm font-extrabold tracking-tight mt-0.5">
              {businessName} Contact Form
            </h4>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4 animate-in zoom-in duration-200">
            <div
              className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-lg"
              style={{ backgroundColor: config.primaryColor, color: '#ffffff' }}
            >
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold">{config.successHeading}</h3>
            <p className="text-xs opacity-75 max-w-xs mx-auto leading-relaxed">{config.successBody}</p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setFormData({});
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              Submit Another Enquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {config.fields
              .filter((f) => f.enabled)
              .map((field) => {
                const isTextArea = field.type === 'textarea';
                const isSelect = field.type === 'select';
                const isDate = field.type === 'date';
                const isTime = field.type === 'time';

                return (
                  <div key={field.id} className="space-y-1">
                    <label className={`block text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {field.label} {field.required && config.requiredFieldsMark && <span className="text-rose-500">*</span>}
                    </label>

                    {isTextArea ? (
                      <textarea
                        rows={3}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                        className={`w-full px-3.5 py-2.5 ${config.borderRadius} ${config.fontSize} border transition-all focus:outline-none focus:ring-2 resize-none ${
                          isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-100 focus:ring-violet-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-violet-500'
                        }`}
                      />
                    ) : isSelect ? (
                      <select
                        required={field.required}
                        value={formData[field.id] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                        className={`w-full px-3.5 py-2.5 ${config.borderRadius} ${config.fontSize} border transition-all focus:outline-none focus:ring-2 ${
                          isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-100 focus:ring-violet-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-violet-500'
                        }`}
                      >
                        <option value="">Select option...</option>
                        <option value="Consultation">Consultation / Meeting</option>
                        <option value="Standard Package">Standard Package</option>
                        <option value="Custom Project">Custom Enterprise Project</option>
                      </select>
                    ) : (
                      <input
                        type={isDate ? 'date' : isTime ? 'time' : field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                        className={`w-full px-3.5 py-2.5 ${config.borderRadius} ${config.fontSize} border transition-all focus:outline-none focus:ring-2 ${
                          isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-100 focus:ring-violet-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-violet-500'
                        }`}
                      />
                    )}
                  </div>
                );
              })}

            {config.marketingConsent && (
              <div className="flex items-start gap-2 pt-1">
                <input type="checkbox" required id="consent" className="mt-0.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
                <label htmlFor="consent" className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  I agree to receive communications regarding my enquiry in accordance with privacy policies.
                </label>
              </div>
            )}

            <button
              type="submit"
              className={`mt-2 py-3 px-6 ${config.borderRadius} ${config.fontSize} font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                config.buttonWidth === 'full' ? 'w-full' : 'w-auto'
              }`}
              style={{
                backgroundColor: config.buttonColor,
                color: config.buttonTextColor,
              }}
            >
              <span>{config.buttonText}</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      <div className="pt-4 border-t border-slate-200/20 dark:border-slate-800/80 text-center">
        <span className="text-[10px] text-slate-400 font-medium">
          Secured by Cloudflare Worker & Resend API
        </span>
      </div>
    </div>
  );
};
