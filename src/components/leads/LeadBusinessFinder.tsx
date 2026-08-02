/**
 * LeadBusinessFinder — Google Places-backed business discovery.
 * User enters a keyword (+ optional location), results render as cards with
 * rating/phone/website. Each card can be (a) audited (opens the audit tool
 * prefilled) or (b) saved straight to the pipeline as a lead.
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useToast } from '../../context/ToastContext';
import { leadsApi } from '../../lib/leads-api';
import { EmptyState } from '../common/EmptyState';
import {
  Search, MapPin, Star, Phone, Globe, Sparkles, Plus, Loader, Building2,
} from 'lucide-react';
import type { PlaceBusiness } from '../../types';

interface Props {
  onOpenAudit: (website: string) => void;
  onLeadSaved: () => void;
}

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500/30 transition-all';

export const LeadBusinessFinder: React.FC<Props> = ({ onOpenAudit, onLeadSaved }) => {
  const { success, error } = useToast();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<PlaceBusiness[] | null>(null);
  const [searchedOnce, setSearchedOnce] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [noWebsiteOnly, setNoWebsiteOnly] = useState(true);

  const visible = result ? (noWebsiteOnly ? result.filter((b) => !b.website) : result) : result;

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || searching) return;
    setSearching(true);
    const data = await leadsApi.findBusinesses({ q, location: location.trim() || undefined, limit: 15 });
    setSearching(false);
    setResult(data);
    setSearchedOnce(true);
  };

  const saveAsLead = async (b: PlaceBusiness) => {
    if (savingId === b.placeId) return;
    setSavingId(b.placeId);
    const domain = b.website ? b.website.replace(/^https?:\/\//i, '').split('/')[0].split('?')[0] : '';
    const res = await leadsApi.create({
      companyName: b.name,
      websiteUrl: b.website || undefined,
      domain: domain || undefined,
      address: b.address,
      phone: b.phone || '',
      source: 'google-places',
      priority: 'medium' as const,
      tags: b.types?.[0] ? [b.types[0]] : [],
      customFields: {
        placeId: b.placeId,
        rating: b.rating ?? null,
        ratingCount: b.ratingCount ?? null,
        category: b.category ?? null,
        lat: b.latitude ?? null,
        lng: b.longitude ?? null,
      },
    });
    setSavingId(null);
    if (res.success) {
      // Discard the saved entry from the list so it's clear it was captured.
      setResult((prev) => prev ? prev.filter((x) => x.placeId !== b.placeId) : prev);
      success('Lead saved', `${b.name} added to your pipeline.`);
      onLeadSaved();
    } else {
      error('Could not save lead', res.error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <form onSubmit={search} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_240px_auto] gap-2">
          <input
            autoFocus
            className={inputCls}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='e.g. "graphic design studios" or "coffee shops"'
            disabled={searching}
          />
          <input
            className={inputCls}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (e.g. Johannesburg) — optional"
            disabled={searching}
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={searching || !query.trim()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-md shadow-violet-500/20 disabled:opacity-60 cursor-pointer"
          >
            {searching ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {searching ? 'Searching…' : 'Find Businesses'}
          </motion.button>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={noWebsiteOnly}
              onChange={(e) => setNoWebsiteOnly(e.target.checked)}
              className="w-3.5 h-3.5 accent-violet-600 cursor-pointer"
            />
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            Only businesses without a website
          </label>
          {result && (
            <span className="text-[11px] text-slate-400 ml-auto">
              {visible.length} of {result.length} shown
            </span>
          )}
        </div>
      </form>

      {/* Results */}
      {searching ? (
        <div className="p-16 flex flex-col items-center gap-3 text-slate-400">
          <Loader className="w-8 h-8 animate-spin" />
          <p className="text-xs">Searching Google Places…</p>
        </div>
      ) : result && result.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visible.map((b) => (
            <motion.div
              key={b.placeId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-4 flex flex-col"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{b.name}</h4>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    {b.rating != null && (
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {b.rating.toFixed(1)}
                        {b.ratingCount != null && <span className="text-slate-400 font-normal">({b.ratingCount})</span>}
                      </span>
                    )}
                    {b.category && <span className="truncate">{b.category}</span>}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />{b.address || '—'}
                  </p>
                  {b.phone && (
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
                      <Phone className="w-3 h-3 shrink-0" />{b.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                {b.website ? (
                  <button
                    onClick={() => onOpenAudit(b.website!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-sm shadow-violet-500/20 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Audit site
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 inline-flex items-center gap-1">
                    <Globe className="w-3 h-3" /> No website on profile
                  </span>
                )}
                <button
                  onClick={() => saveAsLead(b)}
                  disabled={savingId === b.placeId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 disabled:opacity-60 cursor-pointer"
                >
                  {savingId === b.placeId ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Save as lead
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : searchedOnce && visible && visible.length === 0 && result && result.length > 0 ? (
        <EmptyState icon={Globe} title="No leads without a website" description="Every result in this search already has a website. Turn off the filter to see all businesses." />
      ) : searchedOnce ? (
        <EmptyState icon={MapPin} title="No businesses found" description="Try a different keyword or a more specific location." />
      ) : (
        <div className="py-12">
          <EmptyState icon={Globe} title="Find B2B prospects" description="Search Google Maps/Places by keyword and location, then audit their website and save them as leads." />
        </div>
      )}
    </div>
  );
};