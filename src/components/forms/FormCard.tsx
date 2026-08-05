import React from 'react';
import { Settings, Code, BarChart3, Trash2, Copy, FileText } from 'lucide-react';

export const FormCard: React.FC<{ form: any }> = ({ form }) => (
    <div className="glass-panel rounded-3xl p-6 space-y-4">
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-slate-900 dark:text-slate-100">{form.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${form.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {form.status}
            </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
            <div>Views: <span className="font-bold text-slate-900 dark:text-slate-100">{form.views}</span></div>
            <div>Submissions: <span className="font-bold text-slate-900 dark:text-slate-100">{form.submissions}</span></div>
        </div>
        <div className="flex gap-2 pt-2">
            <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"><Settings className="w-4 h-4" /></button>
            <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"><Code className="w-4 h-4" /></button>
            <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"><BarChart3 className="w-4 h-4" /></button>
            <button className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 ml-auto"><Trash2 className="w-4 h-4" /></button>
        </div>
    </div>
);
