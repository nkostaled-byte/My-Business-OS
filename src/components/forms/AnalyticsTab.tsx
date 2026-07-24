import React from 'react';

export const AnalyticsTab: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['Total Forms', 'Total Views', 'Submissions', 'Conversion Rate'].map(metric => (
                <div key={metric} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
                    <p className="text-[11px] font-bold text-slate-500 uppercase">{metric}</p>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">0</p>
                </div>
            ))}
            {/* TODO: Implement charts and email usage section */}
        </div>
    );
};
