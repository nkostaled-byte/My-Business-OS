import React, { useState } from 'react';
import { Search, Filter, Inbox, Mail, Archive, Trash2, CheckCircle, Eye, X, Phone, User, Calendar, ExternalLink } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { FormSubmission } from '../types';

export const FormsPage: React.FC = () => {
  const { forms, isLoading, updateResource, refreshResource } = useData();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await updateResource('submissions', id, { status: 'read' });
    addToast('Submission marked as read', 'success');
  };

  const handleArchive = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await updateResource('submissions', id, { status: 'archived' });
    addToast('Submission archived', 'info');
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    await refreshResource('submissions');
    if (selectedSubmission?.id === id) setSelectedSubmission(null);
    addToast('Submission deleted', 'success');
  };

  const filteredSubmissions = forms.filter(sub => {
    const matchesSearch = 
      sub.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.senderEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.formName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.subject && sub.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'unread') return matchesSearch && sub.status === 'unread';
    if (statusFilter === 'read') return matchesSearch && sub.status === 'read';
    if (statusFilter === 'archived') return matchesSearch && sub.status === 'archived';
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Form Enquiries & Submissions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all incoming website enquiries routed from Cloudflare Worker & Resend.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or subject..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs glass-subtle text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500" 
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['all', 'unread', 'read', 'archived'] as const).map(f => (
            <button 
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                statusFilter === f 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f === 'unread' ? 'New Enquiries' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State / Skeleton */}
      {isLoading ? (
        <div className="glass-panel rounded-3xl p-6 space-y-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 animate-pulse">
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
              </div>
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
            </div>
          ))}
        </div>
      ) : (
        /* Submissions Table */
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/60 dark:bg-white/5 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Form / Subject</th>
                  <th className="p-4">Submitted Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                {filteredSubmissions.map(sub => (
                  <tr 
                    key={sub.id} 
                    onClick={() => setSelectedSubmission(sub)}
                    className="hover:bg-white/50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {sub.status === 'unread' && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                      )}
                      {sub.senderName}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{sub.senderEmail}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{sub.senderPhone || '—'}</td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{sub.formName}</p>
                      {sub.subject && <p className="text-[11px] text-slate-500 truncate max-w-xs">{sub.subject}</p>}
                    </td>
                    <td className="p-4 text-slate-500">{sub.submittedAt}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        sub.status === 'unread'
                          ? 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                          : sub.status === 'read'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => setSelectedSubmission(sub)}
                          title="View Submission"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {sub.status === 'unread' && (
                          <button 
                            onClick={(e) => handleMarkAsRead(sub.id, e)}
                            title="Mark as Read"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={(e) => handleArchive(sub.id, e)}
                          title="Archive"
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(sub.id, e)}
                          title="Delete"
                          className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="p-16 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No form submissions yet.</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                When customers submit enquiries through your website, they will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* View Detail Modal / Drawer */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg glass-strong h-full flex flex-col overflow-y-auto">
            <div className="p-6 border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between sticky top-0 glass-panel z-10">
              <div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                  {selectedSubmission.formName}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">{selectedSubmission.senderName}</h2>
              </div>
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Email Address</span>
                  <a href={`mailto:${selectedSubmission.senderEmail}`} className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                    {selectedSubmission.senderEmail}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Phone Number</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSubmission.senderPhone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Submission Date</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedSubmission.submittedAt}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Status</span>
                  <span className="font-bold uppercase text-indigo-600 dark:text-indigo-400">{selectedSubmission.status}</span>
                </div>
              </div>

              {selectedSubmission.subject && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Subject / Inquiry Title</h4>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {selectedSubmission.subject}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Message</h4>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedSubmission.message || 'No message body provided.'}
                </div>
              </div>

              {selectedSubmission.dataSummary && Object.keys(selectedSubmission.dataSummary).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Additional Form Fields</h4>
                  <div className="space-y-2 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                    {Object.entries(selectedSubmission.dataSummary).map(([k, v]) => (
                      <div key={k} className="flex justify-between py-1 border-b border-slate-200/50 dark:border-slate-800 last:border-0">
                        <span className="text-slate-500 font-medium">{k}:</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex gap-3">
              <a 
                href={`mailto:${selectedSubmission.senderEmail}?subject=Re: ${selectedSubmission.subject || selectedSubmission.formName}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
              >
                <Mail className="w-4 h-4" /> Reply via Email
              </a>
              <button 
                onClick={() => {
                  handleArchive(selectedSubmission.id);
                  setSelectedSubmission(null);
                }}
                className="py-3 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
