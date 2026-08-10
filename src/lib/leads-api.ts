/**
 * Leads API — Typed Client for the Lead Generation & CRM Module
 * ===============================================================
 * Thin typed layer over the shared api-client for all /api/leads* calls.
 * Mirrors the worker routes in handlers/leads.js.
 */

import api, { ApiResponse } from './api-client';
import { API } from '../config/api';
import type {
  Lead,
  LeadCompany,
  LeadContact,
  LeadStage,
  LeadTag,
  LeadPipeline,
  LeadNote,
  LeadTask,
  LeadActivity,
  LeadFollowUp,
  AuditResult,
  ScoreResult,
  AiBrief,
  AuditFullResponse,
  LeadPriority,
  LeadStatus,
  PlaceBusiness,
} from '../types';

export interface LeadListParams {
  search?: string;
  status?: string;
  stage?: string;
  priority?: string;
  order?: string;
  dir?: 'asc' | 'desc';
  limit?: number;
}

export type LeadList = LeadListParams;

export interface BulkResult {
  success: boolean;
  deleted?: number;
  updated?: number;
}

export interface BusinessCandidate {
  name: string;
  domain: string;
  website: string;
  searchUrl: string;
  confident: boolean;
}

function params(filter: LeadList): Record<string, string> {
  const p: Record<string, string> = {};
  if (filter.search) p.search = filter.search;
  if (filter.status) p.status = filter.status;
  if (filter.stage) p.stage = filter.stage;
  if (filter.priority) p.priority = filter.priority;
  if (filter.order) p.order = filter.order;
  if (filter.dir) p.dir = filter.dir;
  if (filter.limit) p.limit = String(filter.limit);
  return p;
}

export const leadsApi = {
  // ── Leads ────────────────────────────────────────────────────────
  async list(filter: LeadList = {}): Promise<Lead[]> {
    const res = await api.get<Lead[]>(API.leads.list, { params: params(filter) });
    return res.success && res.data ? res.data : [];
  },

  async create(payload: Record<string, unknown>): Promise<ApiResponse<Lead>> {
    return api.post<Lead>(API.leads.create, payload);
  },

  async detail(id: string): Promise<Lead | null> {
    const res = await api.get<Lead>(API.leads.byId(id));
    return res.success && res.data ? res.data : null;
  },

  async update(id: string, payload: Partial<Lead>): Promise<ApiResponse<Lead>> {
    return api.put<Lead>(API.leads.byId(id), payload);
  },

  async updateStatus(id: string, status: LeadStatus): Promise<ApiResponse<Lead>> {
    return api.put<Lead>(API.leads.status(id), { status });
  },

  async convert(id: string): Promise<ApiResponse<Lead>> {
    return api.post<Lead>(API.leads.convert(id));
  },

  async remove(id: string): Promise<ApiResponse<void>> {
    return api.del<void>(API.leads.byId(id));
  },

  // ── Pipeline / Stages / Tags ─────────────────────────────────────
  async pipeline(): Promise<LeadPipeline | null> {
    const res = await api.get<LeadPipeline>(API.leads.pipeline);
    return res.success && res.data ? res.data : null;
  },

  async listStages(): Promise<LeadStage[]> {
    const res = await api.get<LeadStage[]>(API.leads.stages);
    return res.success && res.data ? res.data : [];
  },

  async createStage(payload: Partial<LeadStage>): Promise<ApiResponse<LeadStage>> {
    return api.post<LeadStage>(API.leads.stages, payload);
  },

  async updateStage(id: string, payload: Partial<LeadStage>): Promise<ApiResponse<void>> {
    return api.put<void>(API.leads.stageById(id), payload);
  },

  async deleteStage(id: string): Promise<ApiResponse<void>> {
    return api.del<void>(API.leads.stageById(id));
  },

  async listTags(): Promise<LeadTag[]> {
    const res = await api.get<LeadTag[]>(API.leads.tags);
    return res.success && res.data ? res.data : [];
  },

  async createTag(payload: Partial<LeadTag>): Promise<ApiResponse<LeadTag>> {
    return api.post<LeadTag>(API.leads.tags, payload);
  },

  async deleteTag(id: string): Promise<ApiResponse<void>> {
    return api.del<void>(API.leads.tagById(id));
  },

  // ── Companies ────────────────────────────────────────────────────
  async listCompanies(search?: string): Promise<LeadCompany[]> {
    const res = await api.get<LeadCompany[]>(API.leads.companies, { params: search ? { search } : undefined });
    return res.success && res.data ? res.data : [];
  },

  async companyDetail(id: string): Promise<(LeadCompany & { contacts?: LeadContact[]; leads?: Lead[] }) | null> {
    const res = await api.get(API.leads.companyById(id));
    return res.success && res.data ? res.data : null;
  },

  async createCompany(payload: Partial<LeadCompany>): Promise<ApiResponse<LeadCompany>> {
    return api.post<LeadCompany>(API.leads.companies, payload);
  },

  async updateCompany(id: string, payload: Partial<LeadCompany>): Promise<ApiResponse<void>> {
    return api.put<void>(API.leads.companyById(id), payload);
  },

  async deleteCompany(id: string): Promise<ApiResponse<void>> {
    return api.del<void>(API.leads.companyById(id));
  },

  // ── Contacts ─────────────────────────────────────────────────────
  async listContacts(params?: { search?: string; companyId?: string }): Promise<LeadContact[]> {
    const res = await api.get<LeadContact[]>(API.leads.contacts, { params });
    return res.success && res.data ? res.data : [];
  },

  async createContact(payload: Partial<LeadContact>): Promise<ApiResponse<LeadContact>> {
    return api.post<LeadContact>(API.leads.contacts, payload);
  },

  async updateContact(id: string, payload: Partial<LeadContact>): Promise<ApiResponse<void>> {
    return api.put<void>(API.leads.contactById(id), payload);
  },

  async deleteContact(id: string): Promise<ApiResponse<void>> {
    return api.del<void>(API.leads.contactById(id));
  },

  // ── Notes / Activities / Tasks / Follow-ups ──────────────────────
  async addNote(id: string, body: string, author?: string): Promise<ApiResponse<LeadNote>> {
    return api.post<LeadNote>(API.leads.notes(id), { body, author });
  },

  async updateNote(id: string, noteId: string, payload: { body?: string; author?: string }): Promise<ApiResponse<void>> {
    return api.put<void>(API.leads.noteById(id, noteId), payload);
  },

  async deleteNote(id: string, noteId: string): Promise<ApiResponse<void>> {
    return api.del<void>(API.leads.noteById(id, noteId));
  },

  async addActivity(id: string, payload: { type?: string; title: string; description?: string; metadata?: Record<string, unknown> }): Promise<ApiResponse<LeadActivity>> {
    return api.post<LeadActivity>(API.leads.activities(id), payload);
  },

  async listTasks(id: string): Promise<LeadTask[]> {
    const res = await api.get<LeadTask[]>(API.leads.tasks(id));
    return res.success && res.data ? res.data : [];
  },

  async addTask(id: string, payload: { title: string; description?: string; dueDate?: string; assignedTo?: string }): Promise<ApiResponse<LeadTask>> {
    return api.post<LeadTask>(API.leads.tasks(id), payload);
  },

  async updateTask(id: string, taskId: string, payload: Partial<LeadTask>): Promise<ApiResponse<void>> {
    return api.put<void>(API.leads.taskById(id, taskId), payload);
  },

  async deleteTask(id: string, taskId: string): Promise<ApiResponse<void>> {
    return api.del<void>(API.leads.taskById(id, taskId));
  },

  async addFollowup(id: string, payload: { dueAt: string; note?: string }): Promise<ApiResponse<LeadFollowUp>> {
    return api.post<LeadFollowUp>(API.leads.followups(id), payload);
  },

  async listFollowups(id: string): Promise<LeadFollowUp[]> {
    const res = await api.get<LeadFollowUp[]>(API.leads.followups(id));
    return res.success && res.data ? res.data : [];
  },

  async updateFollowup(id: string, followId: string, payload: { status?: 'pending' | 'completed'; note?: string; dueAt?: string }): Promise<ApiResponse<void>> {
    return api.put<void>(API.leads.followupById(id, followId), payload);
  },

  async deleteFollowup(id: string, followId: string): Promise<ApiResponse<void>> {
    return api.del<void>(API.leads.followupById(id, followId));
  },

  // ── Scan / Audit / Search ────────────────────────────────────────
  async scan(url: string): Promise<AuditResult | null> {
    const res = await api.post<{ audit: AuditResult }>(API.leads.scan, { url });
    return res.success && res.data ? res.data.audit : null;
  },

  async audit(url: string, businessName?: string): Promise<AuditFullResponse | null> {
    const res = await api.post<AuditFullResponse>(API.leads.audit, { url, businessName });
    return res.success && res.data ? res.data : null;
  },

  async searchBusinesses(query: string): Promise<BusinessCandidate[]> {
    const res = await api.get<{ candidates?: BusinessCandidate[] }>(API.leads.searchBusinesses, { params: { q: query } });
    return (res.success && res.data?.candidates) ? res.data.candidates : [];
  },

  // ── Find businesses (Google Places) ─────────────────────────────
  async findBusinesses(params?: { q?: string; location?: string; limit?: number }): Promise<PlaceBusiness[]> {
    const res = await api.get<PlaceBusiness[]>(API.leads.findBusinesses, { params: params as Record<string, string> | undefined });
    return res.success && res.data ? res.data : [];
  },

  // ── Bulk ─────────────────────────────────────────────────────────
  async bulk(ids: string[], action: 'delete' | 'status' | 'stage' | 'priority', value?: string): Promise<ApiResponse<BulkResult>> {
    return api.post<BulkResult>(API.leads.bulk, { ids, action, value });
  },

  // ── Export ───────────────────────────────────────────────────────
  async exportCsv(filter: Partial<Pick<LeadList, 'status' | 'stage'>> = {}): Promise<{ success: boolean; csvContent: string; fileName: string; error?: string }> {
    const url = api.getUrl(API.leads.export, { ...params(filter as LeadList), status: filter.status || '', stage: filter.stage || '' });
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        return { success: false, csvContent: '', fileName: '', error: body?.error || `HTTP ${res.status}` };
      }
      const csvContent = await res.text();
      const disposition = res.headers.get('Content-Disposition') || '';
      const m = disposition.match(/filename="?([^"]+)"?/);
      return { success: true, csvContent, fileName: m ? m[1] : `leads-${new Date().toISOString().slice(0, 10)}.csv` };
    } catch (err: unknown) {
      return { success: false, csvContent: '', fileName: '', error: err instanceof Error ? err.message : 'Export failed' };
    }
  },
};

function getToken(): string {
  try {
    return localStorage.getItem('grafix_auth_token') || '';
  } catch {
    return '';
  }
}

export function formatCurrency(n: number | null | undefined): string {
  const v = Number(n || 0);
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(v);
}

export function formatDate(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function scoreTone(score: number): { text: string; ring: string; bg: string } {
  if (score >= 80) return { text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-500/30', bg: 'bg-emerald-100 dark:bg-emerald-950/50' };
  if (score >= 60) return { text: 'text-sky-600 dark:text-sky-400', ring: 'ring-sky-500/30', bg: 'bg-sky-100 dark:bg-sky-950/50' };
  if (score >= 40) return { text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-500/30', bg: 'bg-amber-100 dark:bg-amber-950/50' };
  return { text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-500/30', bg: 'bg-rose-100 dark:bg-rose-950/50' };
}

export const STAGE_COLORS: Record<string, string> = {
  slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ring-slate-300/40',
  indigo: 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 ring-indigo-500/30',
  blue: 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 ring-sky-500/30',
  emerald: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30',
  amber: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 ring-amber-500/30',
  green: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30',
  rose: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 ring-rose-500/30',
} as any;