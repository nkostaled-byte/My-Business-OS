import React, { useState } from 'react';
import { Copy, Check, Code, Globe2, Terminal } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const FormEmbedSection: React.FC = () => {
  const { addToast } = useToast();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const embedCode = `<div id="my-business-form-root" data-form-id="contact-main"></div>\n<script src="https://mybusinessos.workers.dev/embed.js" async></script>`;
  const jsSnippet = `import { mountForm } from '@mybusinessos/embed';\nmountForm({\n  elementId: 'contact-main',\n  theme: 'auto',\n  endpoint: 'https://api.mybusinessos.workers.dev/submit'\n});`;
  const iframeSnippet = `<iframe src="https://mybusinessos.workers.dev/embed/contact-main" width="100%" height="650" frameborder="0" style="border:none;border-radius:16px;"></iframe>`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    addToast({
      title: 'Copied to Clipboard',
      message: `The ${type} snippet has been successfully copied.`,
      type: 'success',
    });
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Form Embed & Integration Code
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Embed your contact form on any website, landing page, or React application with zero friction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Embed Code */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
              Copy Embed Code
            </span>
            <button
              type="button"
              onClick={() => handleCopy(embedCode, 'HTML Embed Code')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copiedType === 'HTML Embed Code' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'HTML Embed Code' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto">
            <code>{embedCode}</code>
          </pre>
        </div>

        {/* Copy JavaScript */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-600" />
              Copy JavaScript SDK
            </span>
            <button
              type="button"
              onClick={() => handleCopy(jsSnippet, 'JavaScript SDK')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copiedType === 'JavaScript SDK' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'JavaScript SDK' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto">
            <code>{jsSnippet}</code>
          </pre>
        </div>

        {/* Copy iFrame */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-indigo-600" />
              Copy iFrame
            </span>
            <button
              type="button"
              onClick={() => handleCopy(iframeSnippet, 'iFrame Tag')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copiedType === 'iFrame Tag' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedType === 'iFrame Tag' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto">
            <code>{iframeSnippet}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
