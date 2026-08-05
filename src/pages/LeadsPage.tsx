/**
 * LeadsPage — Lead Generation & CRM dashboard.
 * Tabs: Pipeline (kanban) | Table | Overview. Includes the Website Audit
 * tool and the add-lead / detail modals, plus CSV export.
 */
import React, { useEffect, useCallback, useState } from 'react';
import { motion } from 'motion/react';
import { useToast } from '../context/ToastContext';
import { leadsApi, formatDate } from '../lib/leads-api';
import { LeadPipeline } from '../components/leads/LeadPipeline';
import { LeadAuditCenter } from '../components/leads/LeadAuditCenter';
import { LeadForm } from '../components/leads/LeadForm';
import { LeadDetailView } from '../components/leads/LeadDetailView';
import { LeadBusinessFinder } from '../components/leads/LeadBusinessFinder';
import { ScoreBadge, PriorityPill, StatusPill, GooglePlaceBadge } from '../components/leads/LeadBase';
import { EmptyState } from '../components/common/EmptyState';
import {
  Sparkles, LayoutGrid, Database, Users, ArrowDownToLine, Search, Globe, Trash2,
  BarChart3, PieChart, CircleDollarSign, Trophy, Plus, Compass,
} from 'lucide-react';
import type { Lead, LeadPipeline as PipelineData, LeadStatus } from '../types';

type Tab = 'pipeline' | 'table' | 'find' | 'overview';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
const STATUS_BAR: Record<LeadStatus, string> = {
  new: 'bg-violet-500',
  contacted: 'bg-sky-500',
  qualified: 'bg-emerald-500',
  proposal: 'bg-amber-500',
  won: 'bg-teal-500',
  lost: 'bg-rose-500',
};

const inputCls =
  'w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500/30 transition-all';

export const LeadsPage: React.FC = () => {
  const { success, error } = useToast();

  const [pipelineData, setPipelineData] = useState<PipelineData | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('find');

  const [auditOpen, setAuditOpen] = useState(false);
  const [auditInitialUrl, setAuditInitialUrl] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const loadPipeline = useCallback(async () => {
    const data = await leadsApi.pipeline();
    if (data) setPipelineData(data);
  }, []);

  const loadLeads = useCallback(async () => {
    const data = await leadsApi.list({ order: 'score', dir: 'desc', limit: 500 });
    setLeads(data);
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadPipeline(), loadLeads()]);
    setLoading(false);
  }, [loadPipeline, loadLeads]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleExport = async () => {
    setExporting(true);
    const res = await leadsApi.exportCsv();
    setExporting(false);
    if (!res.success) { error('Export failed', res.error); return; }
    const blob = new Blob([res.csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = res.fileName || 'leads.csv';
    a.click();
    URL.revokeObjectURL(url);
    success('Export ready', 'Your leads CSV is downloading.');
  };

  const stageColor = (name: string) => {
    const s = (pipelineData?.stages ?? []).find((s) => s.name === name);
    return s?.color || 'violet';
  };

  const totals = React.useMemo(() => {
    const byStatus: Record<string, number> = {};
    STATUSES.forEach((s) => (byStatus[s] = 0));
    let scoreSum = 0, won = 0, hot = 0, warm = 0;
    for (const l of leads) {
      byStatus[l.status] = (byStatus[l.status] || 0) + 1;
      scoreSum += l.score || 0;
      if (l.status === 'won') won++;
      if (l.opportunityLevel === 'hot') hot++;
      if (l.opportunityLevel === 'warm') warm++;
    }
    return {
      total: leads.length,
      byStatus,
      won,
      hot,
      warm,
      avg: leads.length ? Math.round(scoreSum / leads.length) : 0,
    };
  }, [leads]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Lead Generation & CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Find, audit and convert businesses that need your services.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setAuditInitialUrl(''); setAuditOpen(true); }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> New Audit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Lead
          </motion.button>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-50 cursor-pointer"
          >
            {exporting ? <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <ArrowDownToLine className="w-4 h-4" />}
            CSV
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={Users} label="Total leads" value={totals.total} tone="violet" />
        <StatCard icon={BarChart3} label="Hot + warm" value={totals.hot + totals.warm} tone="violet" />
        <StatCard icon={CircleDollarSign} label="Won" value={totals.won} tone="emerald" />
        <StatCard icon={PieChart} label="Avg score" value={totals.avg} tone="amber" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 w-fit rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
        {([
          ['find', 'Find', Compass],
          ['pipeline', 'Pipeline', LayoutGrid],
          ['table', 'Table', Database],
          ['overview', 'Overview', BarChartIcon],
        ] as [Tab, string, React.ComponentType<{ className?: string }>][]).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              key === 'find'
                ? tab === 'find'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-panel'
                  : 'text-indigo-600 dark:text-indigo-400 hover:bg-white dark:hover:bg-white/5'
                : tab === key
                  ? 'bg-white dark:bg-[#0e1116] text-slate-900 dark:text-slate-100 shadow-panel'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'pipeline' && (
        pipelineData && pipelineData.stages.length ? (
          <LeadPipeline stages={pipelineData.stages} total={pipelineData.total} onSelectLead={setDetailId} onChanged={loadAll} onOpenCreate={() => setCreateOpen(true)} />
        ) : (
          <EmptyState icon={LayoutGrid} title="No pipeline yet" description="Run an audit or add your first lead to start qualifying prospects." />
        )
      )}

      {tab === 'table' && <LeadsTable leads={leads} loading={loading} onSelect={setDetailId} onRefresh={loadAll} stageColor={stageColor} />}

      {tab === 'find' && (
        <LeadBusinessFinder
          onOpenAudit={(website) => { setAuditInitialUrl(website); setAuditOpen(true); }}
          onLeadSaved={loadAll}
        />
      )}

      {tab === 'overview' && <OverviewTab leads={leads} totals={totals} />}

      {/* Modals */}
      <LeadAuditCenter isOpen={auditOpen} onClose={() => setAuditOpen(false)} onLeadSaved={() => { loadAll(); }} initialUrl={auditInitialUrl} />
      <LeadForm isOpen={createOpen} onClose={() => setCreateOpen(false)} onSaved={() => { loadAll(); success('Lead created'); }} />
      <LeadDetailView leadId={detailId} onClose={() => setDetailId(null)} onUpdated={loadAll} />
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ComponentType<{ className?: string }>; label: string; value: number; tone: 'violet' | 'emerald' | 'amber' }> = ({ icon: Icon, label, value, tone }) => {
  const toneCls =
    tone === 'violet' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
    : tone === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
    : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400';
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#0e1116] border border-slate-200/70 dark:border-white/10 shadow-panel">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${toneCls}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">{value}</p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{label}</p>
      </div>
    </div>
  );
};

const LeadsTable: React.FC<{ leads: Lead[]; loading: boolean; onSelect: (id: string) => void; onRefresh: () => void; stageColor: (name: string) => string }> = ({ leads, loading, onSelect, onRefresh, stageColor }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const { success, error } = useToast();

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter((l) => {
      if (status && l.status !== status) return false;
      if (!q) return true;
      return [l.leadName, l.companyName, l.contactName, l.domain, l.website].filter(Boolean).some((v) => String(v).toLowerCase().includes(q));
    });
  }, [leads, search, status]);

  const remove = async (l: Lead) => {
    if (deleting === l.id) return;
    setDeleting(l.id);
    const res = await leadsApi.remove(l.id);
    setDeleting(null);
    if (res.success) { success('Lead deleted'); onRefresh(); }
    else error('Delete failed', res.error);
  };

  const colorOf = (name: string) => {
    const map: Record<string, string> = { slate: 'bg-slate-400', violet: 'bg-violet-500', blue: 'bg-sky-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', green: 'bg-emerald-500', rose: 'bg-rose-500' };
    return map[stageColor(name)] || 'bg-violet-500';
  };

  return (
    <div className="bg-white dark:bg-[#0e1116] rounded-xl border border-slate-200/70 dark:border-white/10 shadow-panel overflow-hidden">
      <div className="p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..." className={inputCls + ' pl-9'} />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="self-end sm:self-auto px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 cursor-pointer">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="p-16 flex items-center justify-center"><div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="p-6"><EmptyState icon={Database} title="No leads found" description="Try a different search, add a lead, or run an audit." /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                <th className="py-3 px-4 sm:px-6">Lead</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Next follow-up</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.map((l, i) => (
                <motion.tr key={l.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, delay: Math.min(i, 20) * 0.02 }} onClick={() => onSelect(l.id)} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors cursor-pointer">
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">{l.leadName}<GooglePlaceBadge lead={l} /></div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1"><Globe className="w-3 h-3" />{l.domain || l.website || '—'}</div>
                  </td>
                  <td className="py-3.5 px-4"><StatusPill status={l.status} /></td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${colorOf(l.stage)}`} />{l.stage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4"><PriorityPill priority={l.priority} /></td>
                  <td className="py-3.5 px-4"><ScoreBadge score={l.score} /></td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-300">{l.estimatedValue ? formatCurrency(l.estimatedValue) : '—'}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{l.nextFollowupAt ? formatDate(l.nextFollowupAt) : '—'}</td>
                  <td className="py-3.5 px-4">
                    <button onClick={(e) => { e.stopPropagation(); remove(l); }} disabled={deleting === l.id} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 disabled:opacity-50 cursor-pointer" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const OverviewTab: React.FC<{ leads: Lead[]; totals: { total: number; byStatus: Record<string, number>; hot: number; warm: number; won: number; avg: number } }> = ({ leads, totals }) => {
  const recent = leads.slice(0, 5);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white dark:bg-[#0e1116] rounded-xl border border-slate-200/70 dark:border-white/10 shadow-panel p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-indigo-500" /> Pipeline breakdown</h3>
        {totals.total === 0 ? (
          <p className="text-xs text-slate-400">No leads yet.</p>
        ) : (
          <div className="space-y-3">
            {STATUSES.map((s) => {
              const count = totals.byStatus[s] || 0;
              const pct = totals.total ? Math.round((count / totals.total) * 100) : 0;
              return (
                <div key={s}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-600 dark:text-slate-300 capitalize">{s}</span>
                    <span className="text-slate-500">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${STATUS_BAR[s]}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#0e1116] rounded-xl border border-slate-200/70 dark:border-white/10 shadow-panel p-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> Recent leads</h3>
        {recent.length === 0 ? (
          <p className="text-xs text-slate-400">Run an audit to qualify your first lead.</p>
        ) : (
          <div className="space-y-3">
            {recent.map((l) => (
              <div key={l.id} className="flex items-center gap-3">
                <ScoreBadge score={l.score} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{l.leadName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{l.domain || l.website || ''}</p>
                </div>
                <span className="text-[10px] text-slate-400">{l.createdAt ? formatDate(l.createdAt) : ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function formatCurrency(n: number | null | undefined) {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(Number(n || 0));
}

// Re-exported icon alias to avoid name shadowing with statistic components.
const BarChartIcon = BarChart3;