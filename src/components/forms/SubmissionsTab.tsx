import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { FormSubmission } from '../../types';

interface SubmissionsTabProps {
  submissions: FormSubmission[];
}

export const SubmissionsTab: React.FC<SubmissionsTabProps> = ({ submissions }) => {
  const [search, setSearch] = useState('');

  const filteredSubmissions = submissions.filter(sub => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      sub.senderName.toLowerCase().includes(q) ||
      sub.senderEmail.toLowerCase().includes(q) ||
      sub.formName.toLowerCase().includes(q) ||
      (sub.subject && sub.subject.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search submissions..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs glass-subtle"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-100">Export CSV</button>
        </div>
      </div>
      
      {filteredSubmissions.length === 0 ? (
        <div className="w-full border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-xs">
          {search ? `No submissions matching "${search}".` : 'Submissions will appear here when you have data.'}
        </div>
      ) : (
        <div className="w-full border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-medium text-slate-500">Sender</th>
                <th className="py-3 px-4 font-medium text-slate-500">Form</th>
                <th className="py-3 px-4 font-medium text-slate-500">Subject</th>
                <th className="py-3 px-4 font-medium text-slate-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredSubmissions.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900 dark:text-slate-100">{sub.senderName}</div>
                    <div className="text-slate-400">{sub.senderEmail}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{sub.formName}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">{sub.subject || '—'}</td>
                  <td className="py-3 px-4 text-slate-500">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
