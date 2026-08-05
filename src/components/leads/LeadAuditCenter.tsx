/**
 * LeadAuditCenter — runs a website audit, shows the score, deductions,
 * recommended services and an AI sales brief, then lets the user save the
 * business as a lead (carrying the audit over).
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { leadsApi } from '../../lib/leads-api';
import { ScoreBadge, OpportunityBadge, recommendedLabel } from './LeadBase';
import { LeadForm } from './LeadForm';
import { BrainCircuit, AlertTriangle, Shield, ShieldCheck, ExternalLink, Mail, Phone, Building2, Target, ClipboardCheck } from 'lucide-react';
import type { AuditFullResponse, Lead } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLeadSaved: (lead: Lead) => void;
  /** Prefill the audit URL field (e.g. from Google Places). */
  initialUrl?: string;
}

const inputCls =
  'w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500/30 transition-all';

export const LeadAuditCenter: React.FC<Props> = ({ isOpen, onClose, onLeadSaved, initialUrl }) => {
  const { error } = useToast();
  const [url, setUrl] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AuditFullResponse | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);

  useEffect(() => {
    if (isOpen && initialUrl && !url) setUrl(initialUrl);
  }, [isOpen, initialUrl, url]);

  const reset = () => {
    setResult(null);
    setShowLeadForm(false);
    setRunning(false);
    setUrl('');
    setBusinessName('');
  };

  const close = () => {
    reset();
    onClose();
  };

  const runAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) return;
    setRunning(true);
    setResult(null);
    const data = await leadsApi.audit(cleanUrl, businessName || undefined);
    setRunning(false);
    if (data) setResult(data);
    else error('Audit failed', 'The URL could not be audited. Check that the site is reachable and try again.');
  };

  const handleSaved = (lead: Lead) => {
    reset();
    onLeadSaved(lead);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={close} title="Website Audit" subtitle="Score a prospect's website and surface sellable opportunities" maxWidth="max-w-2xl">
        {!result ? (
          <form onSubmit={runAudit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Business website URL *</label>
              <input
                autoFocus
                className={inputCls}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                disabled={running}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Business name (optional)</label>
              <input className={inputCls} value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Sandton Coffee Co." disabled={running} />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              The audit checks SEO, lead capture, trust signals, tech stack and more — and scores the opportunity (0–100).
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button type="button" onClick={close} className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer">Cancel</button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={running || !url.trim()} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 cursor-pointer">
                {running ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Auditing…</>
                ) : (
                  <><ShieldCheck className="w-4 h-4" /> Run Audit</>
                )}
              </motion.button>
            </div>
          </form>
        ) : (
          <AuditResultView result={result} onCreateLead={() => setShowLeadForm(true)} onNew={reset} onClose={close} businessName={businessName || result.audit.businessName} />
        )}
      </Modal>

      <LeadForm isOpen={showLeadForm} onClose={() => setShowLeadForm(false)} onSaved={handleSaved} audit={result} website={url} />
    </>
  );
};

const AuditResultView = ({ result, onCreateLead, onNew, onClose, businessName }: {
  result: AuditFullResponse;
  onCreateLead: () => void;
  onNew: () => void;
  onClose: () => void;
  businessName: string;
}) => {
  const { audit, score, ai } = result;
  const findings: { label: string; present?: boolean }[] = [
    { label: 'Mobile-responsive / modern design', present: true },
    { label: 'SSL / HTTPS in place', present: audit.hasSsl },
    { label: 'HTTPS redirect enforced', present: audit.hasHttpsRedirect },
    { label: 'Site search', present: audit.hasSearch },
    { label: 'Enquiry / contact form', present: audit.hasContactForm },
    { label: 'Testimonials & reviews', present: audit.hasTestimonials },
    { label: 'Blog / content hub', present: audit.hasBlog },
    { label: 'Product / service pages', present: true },
  ];

  const positives: { label: string; present?: boolean }[] = [
    { label: 'Meta description present', present: !audit.missingMetaDescription },
    { label: 'Social sharing tags present', present: !audit.missingOgTags },
    { label: 'Email capture on site', present: !audit.noEmailCapture },
    { label: 'Live chat available', present: !audit.noLiveChat },
    { label: 'Online service & pricing on site', present: !audit.noContentProposal },
    { label: 'Module menu online (not just PDF)', present: !audit.menuOnlyPdf },
    { label: 'SSL certificate active', present: audit.hasSsl },
    { label: 'Custom domain', present: true },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <div className="text-center shrink-0">
          <div className="text-5xl font-extrabold text-slate-900 dark:text-white">{score.score}</div>
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mt-0.5">Score</div>
        </div>
        <div className="flex-1">
          <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{businessName || audit.businessName || audit.domain || audit.url}</h4>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <ScoreBadge score={score.score} size="lg" />
            <OpportunityBadge level={score.opportunityLevel} />
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 capitalize">{score.opportunityLevel} opportunity · recommended priority {score.priority}</p>
        </div>
      </div>

      {ai && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/30 border border-violet-200/60 dark:border-violet-900">
          <div className="flex items-center gap-2 mb-1.5">
            <BrainCircuit className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI sales angle</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">{ai.salesMessage}</p>
        </div>
      )}

      {score.recommendedServices.length > 0 && (
        <div>
          <h5 className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5"><ClipboardCheck className="w-3.5 h-3.5" /> Recommended services</h5>
          <div className="flex flex-wrap gap-1.5">
            {score.recommendedServices.map((s, i) => <span key={typeof s === 'string' ? s : (s.id || i)} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">{recommendedLabel(s)}</span>)}
          </div>
        </div>
      )}

      {score.deductions.length > 0 && (
        <div>
          <h5 className="text-[10px] font-semibold uppercase tracking-wide text-rose-500 mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Score deductions</h5>
          <div className="space-y-1.5">
            {score.deductions.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="flex-1 text-slate-600 dark:text-slate-300">{d.label}</span>
                <span className="text-rose-600 font-bold">-{d.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
          <h6 className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Strengths</h6>
          <ul className="space-y-1.5">
            {positives.map((pos) => (
              <li key={pos.label} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                <span className={`w-1.5 h-1.5 rounded-full ${pos.present ? 'bg-emerald-500' : 'bg-rose-400'}`} />
                <span className={pos.present ? '' : 'line-through text-slate-400'}>{pos.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
          <h6 className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> On-site findings</h6>
          <ul className="space-y-1.5">
            {findings.map((f) => (
              <li key={f.label} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                <span className={`w-1.5 h-1.5 rounded-full ${f.present ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <InfoTile icon={Mail} label="Emails" value={audit.emails?.length ? audit.emails.join(', ') : '—'} />
        <InfoTile icon={Phone} label="Phone" value={audit.phones?.join(', ') || '—'} />
        <InfoTile icon={Building2} label="Address" value={audit.address || '—'} />
      </div>

      <div className="pt-2 flex flex-col sm:flex-row justify-between gap-2 border-t border-slate-200/50 dark:border-white/5">
        <div className="flex gap-2">
          <button onClick={onNew} className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer">New audit</button>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 cursor-pointer">Close</button>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onCreateLead} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-200 cursor-pointer">
          <ExternalLink className="w-4 h-4" /> Save as lead
        </motion.button>
      </div>
    </div>
  );
};

function InfoTile({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 block mb-1 flex items-center gap-1"><Icon className="w-3 h-3" /> {label}</span>
      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 break-words">{value}</span>
    </div>
  );
}