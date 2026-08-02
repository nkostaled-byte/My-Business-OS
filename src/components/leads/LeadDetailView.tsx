/**
 * LeadDetailView — full lead detail modal, loads the enriched lead (with
 * notes, tasks, activities, follow-ups) and offers quick actions (change
 * status/stage/priority, mark won) plus tabs for the audit report and the
 * CRM sub-resources.
 */
import React, { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { leadsApi, formatDateTime } from '../../lib/leads-api';
import { EmptyState } from '../common/EmptyState';
import { ScoreBadge, StatusPill, PriorityPill, OpportunityBadge, STATUS_LABEL, getInitials, GooglePlaceBadge, getPlacesMeta } from './LeadBase';
import {
  Globe, Mail, Phone, Target, MessageSquare, CheckSquare, Bell, FileText,
  ClipboardCheck, Sparkles, AlertTriangle, TrendingUp, Check, Tag, Star, MapPin,
} from 'lucide-react';
import type { Lead, LeadPriority, LeadStatus, ScoreDeduction } from '../../types';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
const PRIORITIES: LeadPriority[] = ['low', 'medium', 'high', 'urgent'];

interface Props {
  leadId: string | null;
  onClose: () => void;
  onUpdated: (lead: Lead) => void;
}

type Tab = 'overview' | 'audit' | 'notes' | 'tasks' | 'followups';

export const LeadDetailView: React.FC<Props> = ({ leadId, onClose, onUpdated }) => {
  const { success, error } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');
  const [noteBody, setNoteBody] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [followDue, setFollowDue] = useState('');
  const [followNote, setFollowNote] = useState('');

  const load = async (id: string) => {
    setLoading(true);
    const data = await leadsApi.detail(id);
    setLead(data);
    setLoading(false);
  };

  useEffect(() => {
    if (leadId) {
      setTab('overview');
      setNoteBody('');
      setTaskTitle('');
      setFollowDue('');
      setFollowNote('');
      load(leadId);
    } else {
      setLead(null);
    }
  }, [leadId]);

  const patchLead = (next: Lead) => {
    setLead(next);
    onUpdated(next);
  };

  const updateBasic = async (payload: Partial<Lead>) => {
    if (!lead) return;
    const res = await leadsApi.update(lead.id, payload);
    if (res.success && res.data) patchLead(res.data);
    else error('Update failed', res.error);
  };

  const convert = async () => {
    if (!lead) return;
    const res = await leadsApi.convert(lead.id);
    if (res.success && res.data) {
      success('Lead won', 'Converted to a customer.');
      patchLead(res.data);
    } else error('Convert failed', res.error);
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !noteBody.trim()) return;
    const res = await leadsApi.addNote(lead.id, noteBody);
    if (res.success) { success('Note added'); setNoteBody(''); load(lead.id); }
    else error('Failed', res.error);
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !taskTitle.trim()) return;
    const res = await leadsApi.addTask(lead.id, { title: taskTitle });
    if (res.success) { success('Task added'); setTaskTitle(''); load(lead.id); }
    else error('Failed', res.error);
  };

  const toggleTask = async (taskId: string, currentStatus: string) => {
    if (!lead) return;
    const res = await leadsApi.updateTask(lead.id, taskId, { status: currentStatus === 'completed' ? 'pending' : 'completed' });
    if (res.success) load(lead.id); else error('Update failed', res.error);
  };

  const addFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !followDue) return;
    const res = await leadsApi.addFollowup(lead.id, { dueAt: new Date(followDue).toISOString(), note: followNote });
    if (res.success) { success('Follow-up scheduled'); setFollowDue(''); setFollowNote(''); load(lead.id); }
    else error('Failed', res.error);
  };

  const deductions = (lead?.scoreBreakdown as { deductions?: ScoreDeduction[] } | null)?.deductions || [];

  if (!leadId) return null;

  return (
    <Modal isOpen={Boolean(leadId)} onClose={onClose} title="Lead Details" subtitle={lead?.companyName || lead?.leadName} maxWidth="max-w-3xl">
      {loading && !lead ? (
        <div className="py-16 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : !lead ? (
        <div className="py-10 text-center text-sm text-slate-500">Lead not found.</div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 font-bold text-base flex items-center justify-center ring-2 ring-violet-500 shrink-0">
              {getInitials(lead.companyName || lead.contactName)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">{lead.leadName}</h4>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <StatusPill status={lead.status} />
                <PriorityPill priority={lead.priority} />
                <OpportunityBadge level={lead.opportunityLevel} />
                <ScoreBadge score={lead.score} />
                <GooglePlaceBadge lead={lead} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1"><Globe className="w-3 h-3" />{lead.domain || lead.website || '—'}</span>
                {lead.contact?.email && <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{lead.contact.email}</span>}
                {lead.contact?.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{lead.contact.phone}</span>}
                {lead.estimatedValue ? <span className="inline-flex items-center gap-1"><Target className="w-3 h-3" />{formatCurrency(lead.estimatedValue)}</span> : null}
              </div>
            </div>
            {lead.status !== 'won' && (
              <button onClick={convert} className="shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
                Mark Won
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="block">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Status</span>
              <select value={lead.status} onChange={(e) => updateBasic({ status: e.target.value as LeadStatus })} className={selCls}>
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Stage</span>
              <input value={lead.stage} onChange={(e) => updateBasic({ stage: e.target.value })} className={selCls} />
            </label>
            <label className="block">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Priority</span>
              <select value={lead.priority} onChange={(e) => updateBasic({ priority: e.target.value as LeadPriority })} className={selCls}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
          </div>

          <div className="flex gap-1 text-xs font-semibold border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
            {([
              ['overview', 'Overview', FileText],
              ['audit', 'Audit', ClipboardCheck],
              ['notes', 'Notes', MessageSquare],
              ['tasks', 'Tasks', CheckSquare],
              ['followups', 'Follow-ups', Bell],
            ] as [Tab, string, React.ComponentType<{ className?: string }>][]).map(([key, label, Icon]) => (
              <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg border-b-2 -mb-px cursor-pointer ${tab === key ? 'border-violet-500 text-violet-600 dark:text-violet-400' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {tab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    ['Domain', lead.domain || '—'],
                    ['Contact', [lead.contactName, lead.contact?.email, lead.contact?.phone].filter(Boolean).join(' · ') || '—'],
                    ['Address', lead.address || '—'],
                    ['Assigned', lead.assignedName || '—'],
                    ['Created', formatDateTime(lead.createdAt)],
                    ['Next follow-up', lead.nextFollowupAt ? formatDateTime(lead.nextFollowupAt) : '—'],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div key={k} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 block mb-0.5">{k}</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 break-words">{v}</span>
                  </div>
                ))}
              </div>
              {(() => {
                const p = getPlacesMeta(lead);
                if (!p.placeId) return null;
                return (
                  <div className="mt-3 p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/60">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-violet-500 dark:text-violet-400 block mb-1.5">Google Places</span>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700 dark:text-slate-200">
                      {p.category && <span className="inline-flex items-center gap-1"><Tag className="w-3 h-3 text-violet-500" />{p.category}</span>}
                      {p.rating != null && <span className="inline-flex items-center gap-1"><Star className="w-3 h-3 text-amber-500 fill-amber-500" />{p.rating.toFixed(1)}{(p.ratingCount ?? 0) > 0 && <span className="text-slate-400">({p.ratingCount} reviews)</span>}</span>}
                      {p.lat != null && p.lng != null && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3 text-violet-500" />{p.lat.toFixed(4)}, {p.lng.toFixed(4)}</span>}
                    </div>
                  </div>
                );
              })()}
              {lead.notes && (
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 block mb-1">Notes</span>
                  <p className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{lead.notes}</p>
                </div>
              )}
            </div>
          )}

          {tab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-center shrink-0">
                  <div className="text-4xl font-extrabold text-slate-900 dark:text-white">{lead.score}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mt-0.5">Score</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-violet-500" />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 capitalize">Opportunity: {lead.opportunityLevel || 'Not assessed'}</span>
                  </div>
                  {lead.recommendedServices && lead.recommendedServices.length ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {lead.recommendedServices.map((s) => <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-400">{s}</span>)}
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-xs text-slate-500">Run a website audit to see what this business needs.</span>
                    </div>
                  )}
                </div>
              </div>

              {lead.aiSummary && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/30 border border-violet-200/60 dark:border-violet-900">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-violet-500" />
                    <span className="text-xs font-bold text-violet-700 dark:text-violet-300">Sales angle</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">{lead.aiSummary}</p>
                </div>
              )}

              {deductions.length ? (
                <div>
                  <h5 className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-2 flex items-center gap-1.5">
                    <ClipboardCheck className="w-3.5 h-3.5" /> Score deductions
                  </h5>
                  <div className="space-y-2">
                    {deductions.map((d, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900">
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{d.label}</p>
                          <p className="text-[10px] text-slate-500 capitalize">{d.impact}</p>
                        </div>
                        <span className="text-xs font-bold text-rose-600">-{d.points}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No audit data yet. Run an audit in the Audit tab / New Audit tool to score this website.</p>
              )}
            </div>
          )}

          {tab === 'notes' && (
            <div>
              <form onSubmit={addNote} className="flex gap-2 mb-3">
                <input value={noteBody} onChange={(e) => setNoteBody(e.target.value)} placeholder="Add a note..." className={inputCls} />
                <button type="submit" className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 cursor-pointer">Add</button>
              </form>
              <div className="space-y-2">
                {(lead.notesList ?? []).map((n, i) => (
                  <div key={n.id ?? i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                    <p className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{n.body}</p>
                    <span className="text-[10px] text-slate-400">{n.author || 'Me'} · {formatDateTime(n.createdAt)}</span>
                  </div>
                ))}
                {!lead.notesList?.length && <EmptyState icon={MessageSquare} title="No notes yet" description="Add a note to capture context or next steps." />}
              </div>
            </div>
          )}

          {tab === 'tasks' && (
            <div>
              <form onSubmit={addTask} className="flex gap-2 mb-3">
                <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Add a task..." className={inputCls} />
                <button type="submit" className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 cursor-pointer">Add</button>
              </form>
              <div className="space-y-2">
                {(lead.tasks ?? []).map((t) => (
                  <div key={t.id} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                    <button onClick={() => toggleTask(t.id, t.status)} className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${t.status === 'completed' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                      {t.status === 'completed' && <Check className="w-3 h-3" />}
                    </button>
                    <span className={`flex-1 text-xs ${t.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{t.title}</span>
                    {t.dueDate && <span className="text-[10px] text-slate-400">{formatDateTime(t.dueDate)}</span>}
                  </div>
                ))}
                {!lead.tasks?.length && <EmptyState icon={CheckSquare} title="No tasks" description="Break this lead into actionable follow-up tasks." />}
              </div>
            </div>
          )}

          {tab === 'followups' && (
            <div>
              <form onSubmit={addFollowup} className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <input type="datetime-local" value={followDue} onChange={(e) => setFollowDue(e.target.value)} className={inputCls} />
                <div className="flex gap-2">
                  <input value={followNote} onChange={(e) => setFollowNote(e.target.value)} placeholder="Note" className={inputCls} />
                  <button type="submit" className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 cursor-pointer">Add</button>
                </div>
              </form>
              <div className="space-y-2">
                {(lead.followups ?? []).map((f) => (
                  <div key={f.id} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                    <Bell className="w-3.5 h-3.5 text-slate-400" />
                    <span className="flex-1 text-xs text-slate-700 dark:text-slate-200">{f.note || 'Follow-up'}</span>
                    <span className="text-[10px] text-slate-400">{formatDateTime(f.dueAt)}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${f.status === 'completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50' : 'bg-amber-100 text-amber-600 dark:bg-amber-950/50'}`}>{f.status}</span>
                  </div>
                ))}
                {!lead.followups?.length && <EmptyState icon={Bell} title="No follow-ups" description="Schedule a follow-up to stay on top of this lead." />}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

function formatCurrency(n: number | null | undefined) {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(Number(n || 0));
}

const selCls = 'w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-violet-500/30';
const inputCls = selCls + ' placeholder:text-slate-400';