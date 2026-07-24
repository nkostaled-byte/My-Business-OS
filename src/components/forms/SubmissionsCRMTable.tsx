import React, { useState, useMemo } from 'react';
import { FormSubmission } from '../../types';
import { Search, Filter, Download, RefreshCw, FileText, Eye, Send, Archive, Trash2, Calendar, Mail, Phone as PhoneIcon } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface SubmissionsCRMTableProps {
  submissions: FormSubmission[];
  isLoading: boolean;
  onSelectSubmission: (sub: FormSubmission) => void;
  onUpdateStatus: (id: string, status: FormSubmission['status']) => void;
  onDelete: (id: string) => void;
}

export const SubmissionsCRMTable: React.FC<SubmissionsCRMTableProps> = ({
  submissions,
  isLoading,
  onSelectSubmission,
  onUpdateStatus,
  onDelete,
}) => {
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast({
        title: 'Submissions Synced',
        message: 'Fetched latest enquiries from Cloudflare Worker.',
        type: 'success',
      });
    }, 600);
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Form', 'Customer', 'Email', 'Status', 'Submitted At'],
      ...submissions.map((s) => [s.id, s.formName, s.senderName, s.senderEmail, s.status, s.submittedAt]),
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `form_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Export Complete',
      message: 'Submissions downloaded successfully as CSV.',
      type: 'success',
    });
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      const matchesSearch =
        item.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.formName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchQuery, statusFilter]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search enquiries by name, email, form..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="unread">New (Unread)</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>

          {/* Refresh */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
            title="Refresh Submissions"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Export */}
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-6">Customer</th>
              <th className="py-3.5 px-6">Form Name</th>
              <th className="py-3.5 px-6">Subject / Summary</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Date</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  Loading submissions...
                </td>
              </tr>
            ) : filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    No enquiries yet.
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Submissions from your website contact forms or consultation widgets will appear here instantly.
                  </p>
                </td>
              </tr>
            ) : (
              filteredSubmissions.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelectSubmission(row)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 font-bold flex items-center justify-center text-xs shrink-0">
                        {row.senderName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">
                          {row.senderName}
                        </span>
                        <span className="text-[11px] text-slate-400">{row.senderEmail}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">
                    {row.formName}
                  </td>

                  <td className="py-4 px-6">
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs line-clamp-1">
                      {row.subject || JSON.stringify(row.dataSummary)}
                    </p>
                  </td>

                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        row.status === 'unread'
                          ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          : row.status === 'replied'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : row.status === 'archived'
                          ? 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                          : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                      }`}
                    >
                      {row.status === 'unread' ? 'New' : row.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-slate-500 font-medium">
                    {row.submittedAt}
                  </td>

                  <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectSubmission(row)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                        title="View Submission"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(row.id, 'replied')}
                        className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/50 hover:bg-violet-200 text-violet-700 dark:text-violet-300 transition-colors"
                        title="Quick Reply"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row.id)}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
