import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export const CookiesBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('grafix_cookies_dismissed');
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('grafix_cookies_dismissed', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="glass-strong rounded-2xl p-5 shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Cookies & Privacy</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We use cookies to enhance your experience, analyze site traffic, and personalize content. By continuing to use this site, you consent to our use of cookies.
            </p>
          </div>
          <button
            onClick={handleAccept}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={handleAccept}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors cursor-pointer"
          >
            Accept All
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Necessary Only
          </button>
        </div>
      </div>
    </div>
  );
};
