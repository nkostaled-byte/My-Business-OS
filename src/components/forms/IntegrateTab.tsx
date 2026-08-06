import React from 'react';
import { Copy, QrCode, ExternalLink } from 'lucide-react';

export const IntegrateTab: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Hosted Link</h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-between text-xs font-mono text-indigo-600">
                    https://forms.mygrafixmedia.online/f/form-123
                    <Copy className="w-4 h-4 cursor-pointer" />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold">
                    <ExternalLink className="w-4 h-4" /> Open Form
                </button>
            </div>
            <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-100">QR Code</h3>
                <div className="w-32 h-32 bg-slate-200 dark:bg-slate-800 flex items-center justify-center rounded-2xl">
                    <QrCode className="w-16 h-16 text-slate-400" />
                </div>
                <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100">Download QR</button>
            </div>
            {/* TODO: Implement embed codes, JS embed, and usage monitoring UI */}
        </div>
    );
};
