/**
 * LeadBase — shared presenters (badges/pills) for the Lead Generation & CRM module.
 */
import React from 'react';
import type { Lead, LeadStatus, LeadPriority, RecommendedService } from '../../types';
import { scoreTone } from '../../lib/leads-api';

/** Normalise a recommended-service entry (string or object) to its display label. */
export function recommendedLabel(r: RecommendedService | string): string {
  return typeof r === 'string' ? r : (r?.name ?? '');
}

export interface PlacesMeta {
  placeId?: string | null;
  rating?: number | null;
  ratingCount?: number | null;
  category?: string | null;
  lat?: number | null;
  lng?: number | null;
}

/** Read Google Places metadata persisted on a lead's custom_fields. */
export function getPlacesMeta(lead: Lead): PlacesMeta {
  const cf = (lead.customFields && typeof lead.customFields === 'object' ? lead.customFields : {}) as Record<string, unknown>;
  return {
    placeId: (cf.placeId as string) ?? null,
    rating: typeof cf.rating === 'number' ? cf.rating : null,
    ratingCount: typeof cf.ratingCount === 'number' ? cf.ratingCount : null,
    category: (cf.category as string) ?? null,
    lat: typeof cf.lat === 'number' ? cf.lat : null,
    lng: typeof cf.lng === 'number' ? cf.lng : null,
  };
}

/** Compact "Google Places" badge with rating — shown when a lead has Places metadata. */
export const GooglePlaceBadge: React.FC<{ lead: Lead; className?: string }> = ({ lead, className = '' }) => {
  const meta = getPlacesMeta(lead);
  if (!meta.placeId) return null;
  return (
    <span
      title={`Discovered via Google Places${meta.category ? ` · ${meta.category}` : ''}`}
      className={`inline-flex items-center gap-1 rounded-lg bg-violet-50 dark:bg-violet-950/40 border border-violet-200/70 dark:border-violet-900/60 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700 dark:text-violet-300 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="w-3 h-3 shrink-0" aria-hidden="true">
        <path fill="#4285F4" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44-3.9 0-7.04-3.1-7.04-7s3.14-7 7.04-7c1.93 0 3.34.88 4.17 1.62l1.95-1.94C16.65 3.15 14.56 2.15 12.2 2.15c-5.11 0-9.2 4.09-9.2 9.2s4.09 9.2 9.2 9.2c4.81 0 8.79-3.18 8.79-8.53 0-.66-.08-1.15-.19-1.92z"/>
        <path fill="#34A853" d="M3.01 12c0-3.3 2.67-7.05 7.2-7.05 2 0 4.26.93 5.44 2.45l2.18-2.17C16.27 3.23 14.3 2.15 12.2 2.15 7.93 2.15 3.1 6.21 3.1 12s4.83 9.85 9.1 9.85c2.94 0 4.97-1.5 5.7-3.34l-2.28-1.53c-.54 1.39-1.95 2.1-3.42 2.1-3.02 0-5.19-2.4-5.19-5.08z"/>
        <path fill="#FBBC05" d="M3.01 12c-.13-.38-.19-.79-.19-1.2 0-.44.04-.88.13-1.3H12v2.4H5.87c.18.63.53 1.2 1 1.62l2.7-2.14z" transform="translate(0 .4)"/>
        <path fill="#EA4335" d="M12.2 15.05c2.96 0 4.8-1.85 4.8-4.05 0-.41-.04-.66-.09-1.15h-4.7V12h4.34c-.28 1.36-1.5 2.6-4.35 2.6-2.68 0-4.23-1.62-4.7-2.6l-1.79 1.3c.83 1.3 2.4 3.4 6.49 3.4z"/>
      </svg>
      {meta.rating != null && <span>{meta.rating.toFixed(1)}</span>}
      {(meta.ratingCount ?? 0) > 0 && <span className="text-[9px] opacity-70">({meta.ratingCount})</span>}
    </span>
  );
};

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