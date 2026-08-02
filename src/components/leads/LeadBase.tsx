/**
 * LeadBase — shared presenters (badges/pills) for the Lead Generation & CRM module.
 */
import React from 'react';
import type { Lead, LeadStatus, LeadPriority } from '../../types';
import { scoreTone } from '../../lib/leads-api';

export const PRIORITY_LABEL: Record<LeadPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
};

export const PRIORITY_STYLE: Record<LeadPriority, string> = {
  low: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  medium: 'bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400',
  high: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  urgent: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
};

export const STATUS_STYLE: Record<LeadStatus, string> = {
  new: 'bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400',
  contacted: 'bg-sky-100 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400',
  qualified: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  proposal: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  won: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  lost: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
};

export const OPPORTUNITY_STYLE: Record<string, string> = {
  hot: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
  warm: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  cold: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
};

export const OPPORTUNITY_LABEL: Record<string, string> = { hot: 'Hot', warm: 'Warm', cold: 'Cold' };

/** Lead "grabber" name — company > contact > website > id. */
export function leadNameOf(lead: Lead): string {
  return lead.leadName || lead.companyName || lead.contactName || lead.domain || lead.website || 'Unnamed lead';
}

export const ScoreBadge: React.FC<{ score: number; size?: 'sm' | 'md' | 'lg' }> = ({ score, size = 'md' }) => {
  const tone = scoreTone(score);
  const pad = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center font-bold rounded-lg ${pad} ${tone.bg} ${tone.text}`}>
      {score}
    </span>
  );
};

export const PriorityPill: React.FC<{ priority: LeadPriority }> = ({ priority }) => (
  <span className={`inline-flex items-center font-semibold rounded-lg px-2 py-0.5 text-[10px] uppercase tracking-wide ${PRIORITY_STYLE[priority]}`}>
    {PRIORITY_LABEL[priority] || priority}
  </span>
);

export const StatusPill: React.FC<{ status: LeadStatus }> = ({ status }) => (
  <span className={`inline-flex items-center font-semibold rounded-lg px-2 py-0.5 text-[10px] uppercase tracking-wide ${STATUS_STYLE[status]}`}>
    {STATUS_LABEL[status] || status}
  </span>
);

export const OpportunityBadge: React.FC<{ level?: string | null }> = ({ level }) => {
  if (!level) return null;
  const style = OPPORTUNITY_STYLE[level] || OPPORTUNITY_STYLE.cold;
  return (
    <span className={`inline-flex items-center font-bold rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
      {OPPORTUNITY_LABEL[level] || level}
    </span>
  );
};

export const StageDot: React.FC<{ color?: string }> = ({ color = 'violet' }) => {
  const map: Record<string, string> = {
    slate: 'bg-slate-400',
    violet: 'bg-violet-500',
    blue: 'bg-sky-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    green: 'bg-emerald-500',
    rose: 'bg-rose-500',
  };
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${map[color] || 'bg-violet-500'}`} />;
};

export const getInitials = (name: string) =>
  (name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();