/**
 * LeadForm — add/edit lead modal. Optionally attaches a completed audit
 * (score, opportunity, recommended services, AI brief) when creating a lead
 * straight from the audit centre (e.g. off a scanned website).
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { leadsApi } from '../../lib/leads-api';
import { PRIORITY_LABEL } from './LeadBase';
import type { Lead, LeadPriority, AuditFullResponse } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (lead: Lead) => void;
  audit?: AuditFullResponse | null;
  /** Prefilled website from an audit scan. */
  website?: string;
}

const PRIORITIES: LeadPriority[] = ['low', 'medium', 'high', 'urgent'];

const inputCls =
  'w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500/30 transition-all';
const labelCls = 'block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1';

export const LeadForm: React.FC<Props> = ({ isOpen, onClose, onSaved, audit, website }) => {
  const { success, error } = useToast();
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState(audit?.audit.businessName || '');
  const [url, setUrl] = useState(website || audit?.audit.url || '');
  const [source, setSource] = useState('scan');
  const [priority, setPriority] = useState<LeadPriority>('medium');
  const [email, setEmail] = useState(audit?.audit.emails?.[0] || '');
  const [phone, setPhone] = useState(audit?.audit.phones?.[0] || '');
  const [notes, setNotes] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitted) return;
    setSubmitted(true);
    setSaving(true);

    let domain = '';
    try {
      domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    } catch {
      domain = url.replace(/^https?:\/\//i, '').split('/')[0].split('?')[0];
    }

    const payload: Record<string, unknown> = {
      companyName: name,
      websiteUrl: url,
      domain,
      email,
      phone,
      source: source || '',
      priority,
      notes,
    };
    if (audit) {
      payload.audit = {
        url,
        score: audit.score.score,
        opportunityLevel: audit.score.opportunityLevel,
        recommendedServices: audit.score.recommendedServices,
        deductions: audit.score.deductions,
        ai: audit.ai ? audit.ai.salesMessage : null,
      };
    }

    const res = await leadsApi.create(payload);
    setSaving(false);
    if (res.success && res.data) {
      success('Lead created', `${res.data.leadName || name} has been added to your pipeline.`);
      onSaved(res.data);
      onClose();
    } else {
      setSubmitted(false);
      error('Could not save lead', res.error || 'Please check the details and try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Lead" subtitle="Add a prospect to your pipeline" maxWidth="max-w-2xl">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Business / Lead name *</label>
            <input className={inputCls} required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sandton Coffee Co." />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Website</label>
            <input className={inputCls} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
          </div>
          <div>
            <label className={labelCls}>Source</label>
            <input className={inputCls} value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. website scan, referral" />
          </div>
          <div>
            <label className={labelCls}>Priority</label>
            <select className={inputCls} value={priority} onChange={(e) => setPriority(e.target.value as LeadPriority)}>
              {PRIORITIES.map((k) => (
                <option key={k} value={k}>{PRIORITY_LABEL[k]}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Contact email</label>
            <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@example.com" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Contact phone</label>
            <input className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 82 555 0192" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Notes</label>
            <textarea className={inputCls} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any context, pain points, or next steps..." />
          </div>
        </div>

        {audit && (
          <div className="rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900 p-3 text-xs text-slate-600 dark:text-slate-300">
            Attaching audit score <span className="font-bold text-violet-600 dark:text-violet-400">{audit.score.score}</span> ({audit.score.opportunityLevel}) and recommended services to this lead.
          </div>
        )}

        <div className="pt-3 flex justify-end gap-2 border-t border-slate-200/50 dark:border-white/5">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer">
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 cursor-pointer"
          >
            {saving ? 'Saving...' : 'Create Lead'}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
};