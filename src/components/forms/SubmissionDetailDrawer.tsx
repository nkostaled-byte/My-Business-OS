import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FormSubmission } from '../../types';
import { X, Mail, Phone, Building, CalendarDays, Globe2, Send, Archive, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface SubmissionDetailDrawerProps {
  submission: FormSubmission | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: FormSubmission['status']) => void;
  onDelete: (id: string) => void;
}

export const SubmissionDetailDrawer: React.FC<SubmissionDetailDrawerProps> = ({
  submission,
  onClose,
  onUpdateStatus,
  onDelete,
}) => {
  const { addToast } = useToast();

  if (!submission) return null;

  const handleReplyClick = () => {
    onUpdateStatus(submission.id, 'replied');
    addToast({
      title: 'Reply Dispatched via Resend',
      message: `Email reply sent to ${submission.senderEmail} successfully.`,
      type: 'success',
    });
  };

  const handleArchiveClick = () => {
    onUpdateStatus(submission.id, 'archived');
    addToast({
      title: 'Submission Archived',
      message: 'The submission has been moved to archive.',
      type: 'info',
    });
    onClose();
  };

  const handleDeleteClick = () => {
    onDelete(submission.id);
    addToast({
      title: 'Submission Deleted',
      message: 'The record was permanently removed.',
      type: 'success',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="w-full max-w-lg glass-strong h-full flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {submission.formName}
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">
                {submission.senderName}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Status & Date */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                    submission.status === 'unread'
                      ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      : submission.status === 'replied'
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : submission.status === 'archived'
                      ? 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                      : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                  }`}
                >
                  {submission.status}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {submission.submittedAt}
                </span>
              </div>

              <span className="text-xs font-mono text-slate-400">
                Source: {submission.source || 'Website Contact'}
              </span>
            </div>

            {/* Customer Contact Card */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Customer Information
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <a href={`mailto:${submission.senderEmail}`} className="font-semibold hover:underline">
                    {submission.senderEmail}
                  </a>
                </div>
                {submission.senderPhone && (
                  <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold">{submission.senderPhone}</span>
                  </div>
                )}
                {submission.senderCompany && (
                  <div className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300">
                    <Building className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold">{submission.senderCompany}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Full Message / Data Summary */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Enquiry Details & Message
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                {submission.message && (
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {submission.message}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
                  {Object.entries(submission.dataSummary).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-500">{key}:</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resend Notice */}
            <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                i
              </div>
              <p className="text-[11px] text-indigo-800 dark:text-indigo-200 leading-relaxed">
                Replies are sent through Resend. The Cloudflare Worker backend automatically handles email dispatch and logs delivery status.
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950/40">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleArchiveClick}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer transition-colors"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive</span>
              </button>
              <button
                type="button"
                onClick={handleDeleteClick}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-xs cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleReplyClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 cursor-pointer transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reply via Resend</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
