import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Download,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Clock,
  Wand2,
  AlertTriangle,
  Check,
  ImagePlus,
  X,
} from 'lucide-react';
import api from '../lib/api-client';
import { prepareReferenceImage } from '../lib/image-utils';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import type { ImageStudioGeneration, ImageStudioUsage } from '../types';

const STYLES = [
  { id: 'photorealistic', label: 'Photorealistic' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'minimalist', label: 'Minimalist' },
  { id: '3d-render', label: '3D Render' },
  { id: 'illustration', label: 'Illustration' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'product-photography', label: 'Product Photography' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'abstract', label: 'Abstract' },
  { id: 'custom', label: 'Custom' },
];

const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1', hint: 'Square' },
  { id: '4:5', label: '4:5', hint: 'Portrait' },
  { id: '3:4', label: '3:4', hint: 'Portrait' },
  { id: '9:16', label: '9:16', hint: 'Vertical' },
  { id: '16:9', label: '16:9', hint: 'Landscape' },
];

const PROMPT_IDEAS = [
  'A sculptural ceramic vase on a travertine plinth, soft morning light',
  'Editorial portrait of a founder in a minimal studio, warm rim light',
  'A glass bottle of amber skincare serum on wet stone, cinematic reflections',
];

function styleLabel(id: string) {
  return STYLES.find((s) => s.id === id)?.label || id;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function createRequestId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export const ImageStudioPage: React.FC = () => {
  const { addToast } = useToast();

  const [usage, setUsage] = useState<ImageStudioUsage | null>(null);
  const [usageLoading, setUsageLoading] = useState(true);
  const [usageError, setUsageError] = useState<string | null>(null);

  const [history, setHistory] = useState<ImageStudioGeneration[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('photorealistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [referenceImage, setReferenceImage] = useState('');
  const [referenceError, setReferenceError] = useState<string | null>(null);
  const [referenceDragging, setReferenceDragging] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImageStudioGeneration | null>(null);
  const [viewing, setViewing] = useState<ImageStudioGeneration | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const promptRef = useRef<HTMLTextAreaElement | null>(null);
  const referenceInputRef = useRef<HTMLInputElement | null>(null);

  const loadUsage = useCallback(async () => {
    const result = await api.getImageStudioUsage();
    if (result.success && result.data) {
      setUsage(result.data);
      setUsageError(null);
    } else {
      setUsageError(result.error || 'Usage information is unavailable.');
    }
    setUsageLoading(false);
  }, []);

  const loadHistory = useCallback(async () => {
    const result = await api.getImageStudioHistory(24);
    if (result.success && result.data) {
      setHistory(result.data.items || []);
    }
    setHistoryLoading(false);
  }, []);

  useEffect(() => {
    loadUsage();
    loadHistory();
  }, [loadUsage, loadHistory]);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === 'visible') loadUsage();
    };
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [loadUsage]);

  const remaining = usage?.remaining ?? 0;
  const limit = usage?.limit ?? 10;
  const used = usage?.used ?? 0;
  const exhausted = !usageLoading && !!usage && remaining <= 0;
  const progress = limit > 0 ? Math.max(0, Math.min(100, (remaining / limit) * 100)) : 0;

  const handleReferenceFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.type && !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setReferenceError('Please select a PNG, JPG or WEBP image.');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setReferenceError('Reference images must be 15 MB or smaller.');
      return;
    }
    try {
      setReferenceError(null);
      setReferenceImage(await prepareReferenceImage(file));
    } catch (err: any) {
      setReferenceError(err?.message || 'Could not read the reference image.');
    }
  };

  const clearReference = () => {
    setReferenceImage('');
    setReferenceError(null);
    if (referenceInputRef.current) referenceInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (generating) return;
    if (exhausted) {
      setError(`You've used all ${limit} image generations for today. Your daily allowance resets at midnight.`);
      return;
    }
    if (prompt.trim().length < 3) {
      setError('Please describe the image you want to create.');
      promptRef.current?.focus();
      return;
    }

    setGenerating(true);
    setError(null);
    setPreview(null);

    const requestId = createRequestId();

    try {
      const result = await api.generateImageStudioImage({
        prompt: prompt.trim(),
        style,
        aspectRatio,
        requestId,
        referenceImageData: referenceImage || undefined,
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'The image could not be generated. Please try again.');
      }

      const generation = result.data.generation;
      setPreview(generation);
      setUsage(result.data.usage);
      setHistory((prev) => [generation, ...prev.filter((item) => item.id !== generation.id)].slice(0, 24));
      addToast({ title: 'Image created', message: 'Your image is ready to download.', type: 'success' });
      void loadUsage();
    } catch (err: any) {
      const message = err?.message || 'The image could not be generated. Please try again.';
      setError(message);
      const refreshed = await api.getImageStudioUsage();
      if (refreshed.success && refreshed.data) setUsage(refreshed.data);
    } finally {
      setGenerating(false);
    }
  };

  const downloadImage = async (item: ImageStudioGeneration) => {
    if (downloadingId) return;
    setDownloadingId(item.id);
    try {
      const response = await fetch(item.downloadUrl);
      if (!response.ok) {
        throw new Error('This download link has expired. Refresh the page and try again.');
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `my-business-os-${item.id.slice(0, 8)}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
      addToast({ title: 'Download started', message: 'Your image is saving to your device.', type: 'success' });
    } catch (err: any) {
      addToast({
        title: 'Download failed',
        message: err?.message || 'Please try again in a moment.',
        type: 'error',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const resetPreview = () => {
    setPreview(null);
    setError(null);
    promptRef.current?.focus();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Image Studio
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Create campaign-ready visuals for your business. Every account includes 10 generations a day.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          <span>Resets at midnight SAST</span>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
              Daily generations
            </p>
            {usageLoading && !usage ? (
              <div className="mt-2 h-8 w-40 animate-pulse rounded-lg bg-slate-200/70 dark:bg-white/10" />
            ) : (
              <p className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {remaining}{' '}
                <span className="text-sm font-medium text-slate-400 dark:text-slate-500">of {limit} remaining</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-200/70 dark:border-white/10 px-3 py-2 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Used today</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{used}</p>
            </div>
            <button
              type="button"
              onClick={loadUsage}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/70 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Refresh usage"
            >
              <RefreshCw className={`h-4 w-4 ${usageLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full rounded-full ${
              remaining === 0 ? 'bg-rose-500' : remaining <= 2 ? 'bg-amber-500' : 'bg-indigo-600'
            }`}
          />
        </div>

        {exhausted && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200/80 bg-amber-50/80 px-3.5 py-3 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              You've used all {limit} image generations for today. Your daily allowance resets at midnight.
            </p>
          </div>
        )}

        {usageError && !exhausted && (
          <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">{usageError}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <label htmlFor="image-studio-prompt" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Describe your image
              </label>
              <span className="text-[10px] font-medium text-slate-400">{prompt.length}/1200</span>
            </div>
            <textarea
              id="image-studio-prompt"
              ref={promptRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value.slice(0, 1200))}
              rows={6}
              placeholder="A premium skincare bottle on a sunlit stone ledge, soft shadows, editorial calm..."
              className="mt-3 w-full resize-y rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-white/[0.03] px-3.5 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            />

            <div className="mt-2 flex flex-wrap gap-1.5">
              {PROMPT_IDEAS.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => setPrompt(idea)}
                  className="rounded-full border border-slate-200/80 dark:border-white/10 px-2.5 py-1 text-[10px] font-medium text-slate-500 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  {idea.length > 42 ? `${idea.slice(0, 42)}…` : idea}
                </button>
              ))}
            </div>

            <div className="mt-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                    Reference image
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                    Optional — upload a product or logo to create a mockup.
                  </p>
                </div>
                {referenceImage && (
                  <button
                    type="button"
                    onClick={clearReference}
                    className="shrink-0 text-[10px] font-semibold text-rose-500 hover:text-rose-600 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                ref={referenceInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => {
                  void handleReferenceFile(event.target.files?.[0]);
                  event.target.value = '';
                }}
              />

              {referenceImage ? (
                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/40 dark:bg-white/[0.02] p-2.5">
                  <img
                    src={referenceImage}
                    alt="Reference preview"
                    className="h-16 w-16 shrink-0 rounded-xl border border-slate-200/80 dark:border-white/10 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Reference ready</p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-slate-400 dark:text-slate-500">
                      The subject will be placed into the scene you describe.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearReference}
                    aria-label="Remove reference image"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => referenceInputRef.current?.click()}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setReferenceDragging(true);
                  }}
                  onDragLeave={() => setReferenceDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setReferenceDragging(false);
                    void handleReferenceFile(event.dataTransfer.files?.[0]);
                  }}
                  className={`mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed px-3 py-3 text-left transition-colors cursor-pointer ${
                    referenceDragging
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-500/10'
                      : 'border-slate-200/80 dark:border-white/10 bg-white/40 dark:bg-white/[0.02] hover:border-indigo-300 dark:hover:border-indigo-500/60'
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <ImagePlus className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Click or drop an image
                    </span>
                    <span className="mt-0.5 block text-[10px] text-slate-400 dark:text-slate-500">
                      PNG, JPG or WEBP · resized automatically
                    </span>
                  </span>
                </button>
              )}

              {referenceError && (
                <p className="mt-2 text-[10px] font-medium text-rose-500 dark:text-rose-400">{referenceError}</p>
              )}
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                Style
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {STYLES.map((option) => {
                  const active = style === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setStyle(option.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                        active
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                          : 'border border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      {active && <Check className="h-3 w-3" />}
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                Aspect ratio
              </p>
              <div className="mt-2 grid grid-cols-5 gap-1.5">
                {ASPECT_RATIOS.map((ratio) => {
                  const active = aspectRatio === ratio.id;
                  return (
                    <button
                      key={ratio.id}
                      type="button"
                      onClick={() => setAspectRatio(ratio.id)}
                      className={`flex flex-col items-center gap-0.5 rounded-xl border px-1 py-2 text-center transition-all cursor-pointer ${
                        active
                          ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200/80 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'
                      }`}
                    >
                      <span className="text-[11px] font-bold">{ratio.label}</span>
                      <span className="text-[9px] font-medium opacity-70">{ratio.hint}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating || exhausted || prompt.trim().length < 3}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating your image…
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate image
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[10px] text-slate-400 dark:text-slate-500">
              Each successful generation uses one daily credit. Failed attempts are not charged.
            </p>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-200/80 bg-rose-50/80 px-3 py-2.5 text-[11px] font-medium text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-300">
                {error}
              </div>
            )}
          </div>
        </section>

        <section className="lg:col-span-7">
          <div className="glass-panel flex min-h-[420px] flex-col rounded-2xl p-3 sm:p-4">
            <div className="flex items-center justify-between px-2 pb-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                Preview
              </p>
              {preview && (
                <span className="text-[10px] font-medium text-slate-400">
                  {styleLabel(preview.style)} · {preview.aspectRatio}
                </span>
              )}
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-slate-100/80 dark:bg-black/30">
              <AnimatePresence mode="wait">
                {generating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex w-full flex-col items-center justify-center gap-4 px-6 py-20 text-center"
                  >
                    <div className="relative h-56 w-56 overflow-hidden rounded-2xl border border-white/40 bg-gradient-to-br from-indigo-100 via-white to-slate-100 dark:border-white/10 dark:from-indigo-950/40 dark:via-slate-900 dark:to-black">
                      <motion.div
                        initial={{ x: '-120%' }}
                        animate={{ x: '120%' }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/10"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-indigo-500/70" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Creating your image</p>
                      <p className="mt-1 max-w-sm text-[11px] text-slate-400">
                        {prompt.length > 90 ? `${prompt.slice(0, 90)}…` : prompt}
                      </p>
                    </div>
                  </motion.div>
                ) : preview ? (
                  <motion.div
                    key={preview.id}
                    initial={{ opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="flex h-full w-full flex-col"
                  >
                    <button
                      type="button"
                      onClick={() => setViewing(preview)}
                      className="flex flex-1 items-center justify-center p-2 cursor-zoom-in"
                      aria-label="View generated image"
                    >
                      <img
                        src={preview.fileUrl}
                        alt={preview.prompt}
                        className="max-h-[52dvh] w-auto max-w-full rounded-lg object-contain shadow-lg"
                      />
                    </button>
                    <div className="flex flex-col gap-2 border-t border-slate-200/60 p-3 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                      <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                        {preview.prompt}
                      </p>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={resetPreview}
                          className="rounded-lg px-3 py-2 text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
                        >
                          New image
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadImage(preview)}
                          disabled={downloadingId === preview.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-[11px] font-semibold text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors cursor-pointer"
                        >
                          {downloadingId === preview.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Download className="h-3.5 w-3.5" />
                          )}
                          Download
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full p-4"
                  >
                    <EmptyState
                      icon={ImageIcon}
                      title="Your canvas is ready"
                      description="Describe an image, choose a style and aspect ratio, then generate a polished visual for your business."
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">Recent generations</h2>
            <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
              Private to your account. Open an image to preview or download it again.
            </p>
          </div>
          <button
            type="button"
            onClick={loadHistory}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${historyLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {historyLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-square animate-pulse rounded-2xl bg-slate-200/60 dark:bg-white/5" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="glass-panel rounded-2xl p-6">
            <EmptyState
              icon={Sparkles}
              title="No generations yet"
              description="Your generated images will appear here, ready to preview and download."
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {history.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 dark:border-white/10 dark:bg-black/30"
              >
                <button
                  type="button"
                  onClick={() => setViewing(item)}
                  className="h-full w-full cursor-zoom-in"
                  aria-label={`Preview ${item.prompt}`}
                >
                  <img
                    src={item.fileUrl}
                    alt={item.prompt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </button>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent p-3 pt-10 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="line-clamp-2 text-[10px] font-medium leading-snug">{item.prompt}</p>
                  <p className="mt-1 text-[9px] text-slate-300">{formatDate(item.createdAt)}</p>
                </div>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    downloadImage(item);
                  }}
                  disabled={downloadingId === item.id}
                  className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/85 text-slate-700 opacity-100 shadow-sm backdrop-blur transition-all hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-60 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:bg-slate-900 cursor-pointer"
                  aria-label="Download image"
                >
                  {downloadingId === item.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Modal
        isOpen={!!viewing}
        onClose={() => setViewing(null)}
        title="Generated image"
        subtitle={viewing ? `${styleLabel(viewing.style)} · ${viewing.aspectRatio}` : undefined}
        maxWidth="max-w-3xl"
      >
        {viewing && (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 dark:border-white/10 dark:bg-black/40">
              <img
                src={viewing.fileUrl}
                alt={viewing.prompt}
                className="max-h-[62dvh] w-full object-contain"
              />
            </div>
            <div className="rounded-xl border border-slate-200/70 bg-white/60 p-3.5 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Prompt</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-700 dark:text-slate-200">{viewing.prompt}</p>
            </div>
            <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
              <p className="text-[11px] text-slate-400">
                Created {formatDate(viewing.createdAt)} at {formatTime(viewing.createdAt)}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewing(null)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => downloadImage(viewing)}
                  disabled={downloadingId === viewing.id}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  {downloadingId === viewing.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Download className="h-3.5 w-3.5" />
                  )}
                  Download image
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
