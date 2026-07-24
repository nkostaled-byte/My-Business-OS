import React from 'react';
import { Search } from 'lucide-react';

export const SubmissionsTab: React.FC = () => {
    // TODO: Implement submission loading/empty states
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search submissions..." className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200" />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100">Export CSV</button>
                </div>
            </div>
            
            {/* Table placeholder */}
            <div className="w-full border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-xs">
                Submissions will appear here when you have data.
                {/* TODO: Implement CRM-style table */}
            </div>
        </div>
    );
};
