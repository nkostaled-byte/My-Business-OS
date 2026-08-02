/**
 * LeadPipeline — kanban board of pipeline stages. Cards can be dragged
 * between stages (persists via PUT /api/leads/:id { stage }) and clicked
 * to open the detail view.
 */
import React, { useState, useCallback, Fragment } from 'react';
import { motion } from 'motion/react';
import { useToast } from '../../context/ToastContext';
import { leadsApi, formatDate } from '../../lib/leads-api';
import { ScoreBadge, PriorityPill, StageDot, leadNameOf } from './LeadBase';
import { Plus, GripVertical } from 'lucide-react';
import type { LeadStage, Lead } from '../../types';

interface Props {
  stages: LeadStage[];
  total: number;
  onSelectLead: (id: string) => void;
  onChanged: () => void;
  onOpenCreate: () => void;
}

export const LeadPipeline: React.FC<Props> = ({ stages, total, onSelectLead, onChanged, onOpenCreate }) => {
  const { error } = useToast();
  const [dragging, setDragging] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<string | null>(null);

  const moveToStage = useCallback(async (leadId: string, stageName: string) => {
    setDragging(null);
    setOverStage(null);
    const res = await leadsApi.update(leadId, { stage: stageName });
    if (res.success) onChanged();
    else error('Could not move lead', res.error);
  }, [error, onChanged]);

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1 items-stretch">
      {stages.map((stage) => (
        <div
          key={stage.id}
          onDragOver={(e) => { e.preventDefault(); setOverStage(stage.name); }}
          onDragLeave={() => setOverStage(null)}
          onDrop={(e) => {
            e.preventDefault();
            if (dragging) moveToStage(dragging, stage.name);
          }}
          className={`w-72 shrink-0 flex flex-col bg-slate-100/70 dark:bg-slate-900/40 rounded-2xl border ${
            overStage === stage.name ? 'border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-950/40' : 'border-slate-200/80 dark:border-slate-800'
          } transition-colors`}
        >
          <div className="flex items-center gap-2 px-3 py-2.5">
            <StageDot color={stage.color} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{stage.name}</span>
            <span className="text-[10px] font-semibold text-slate-400">{stage.count}</span>
          </div>

          <div className="flex-1 px-2 pb-2 space-y-2 min-h-[120px]">
            {(stage.leads ?? []).map((lead) => (
              <Fragment key={lead.id}>
                <PipelineCard
                  lead={lead}
                  draggable
                  dragging={dragging === lead.id}
                  onDragStart={() => setDragging(lead.id)}
                  onDragEnd={() => { setDragging(null); setOverStage(null); }}
                  onClick={() => onSelectLead(lead.id)}
                />
              </Fragment>
            ))}
            {!stage.leads?.length && (
              <div className="border border-dashed border-slate-200 dark:border-slate-700 rounded-xl py-6 text-center text-[11px] text-slate-400">
                Drop leads here
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add stage / create lead pad */}
      <div className="w-72 shrink-0 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-4 gap-2">
        <p className="text-[11px] text-slate-400">{total} lead{total === 1 ? '' : 's'} in pipeline</p>
        <button onClick={onOpenCreate} className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer">+ New lead</button>
      </div>
    </div>
  );
};

const PipelineCard = ({ lead, draggable, dragging, onDragStart, onDragEnd, onClick }: {
  lead: Lead;
  draggable: boolean;
  dragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onClick: () => void;
}) => (
  <motion.div
    layout
    draggable={draggable}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    className={`cursor-grab select-none bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow ${
      dragging ? 'opacity-50 rotate-1' : ''
    }`}
  >
    <div className="flex items-start justify-between gap-2">
      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight flex items-center gap-1">
        <GripVertical className="w-3 h-3 text-slate-300 shrink-0" />
        {leadNameOf(lead)}
      </span>
      <ScoreBadge score={lead.score} size="sm" />
    </div>
    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
      {lead.domain || lead.website || '—'}
    </p>
    <div className="mt-2 flex items-center gap-1.5">
      <PriorityPill priority={lead.priority} />
      {lead.nextFollowupAt && (
        <span className="text-[10px] text-slate-400 ml-auto">Due {formatDate(lead.nextFollowupAt)}</span>
      )}
    </div>
  </motion.div>
);