import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Link, X, Check, Loader2 } from 'lucide-react';
import api from '../../lib/api-client';

interface ImagePreset {
  label: string;
  url: string;
}

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  presets?: ImagePreset[];
  placeholder?: string;
  folder?: 'logos' | 'profile' | 'products';
  onImageKeyChange?: (key: string | null) => void;
}

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  label = 'Product / Service Image',
  presets = [],
  placeholder = 'Upload image or enter image URL...',
  folder = 'products',
  onImageKeyChange,
}) => {
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const uploadedKeyRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP, etc.).');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await api.upload(file, folder);
      // Worker returns { success: true, url: "...", key: "..." } — url is at top level, not nested under data
      const uploadedUrl = (result as any).url || result.data?.url;
      const uploadedKey = (result as any).key || result.data?.key;
      if (result.success && uploadedUrl) {
        // Delete previous uploaded image if replacing
        if (uploadedKeyRef.current) {
          api.deleteUploadedImage(uploadedKeyRef.current).catch(() => {});
        }
        onChange(uploadedUrl);
        setUrlInput(uploadedUrl);
        uploadedKeyRef.current = uploadedKey || null;
        onImageKeyChange?.(uploadedKey || null);
      } else {
        setUploadError(result.error || 'Upload failed. Please try again or use a URL instead.');
      }
    } catch (err: any) {
      setUploadError(err?.message || 'Upload failed. Please try again or use a URL instead.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    // Delete uploaded image from R2
    if (uploadedKeyRef.current) {
      api.deleteUploadedImage(uploadedKeyRef.current).catch(() => {});
      uploadedKeyRef.current = null;
    }
    onImageKeyChange?.(null);
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    onChange(urlInput);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-medium">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              tab === 'upload'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              tab === 'url'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-2xs font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Image Link
          </button>
        </div>
      </div>

      {/* Preview Box if Image Selected */}
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 p-2 flex items-center gap-3">
          <img
            src={value}
            alt="Uploaded Preview"
            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
          />
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md mb-1">
              <Check className="w-3 h-3" /> Image Selected
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {value.startsWith('data:') ? 'Local Image File (Data URL)' : value}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/80 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Remove Image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {tab === 'upload' ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                isUploading
                  ? 'border-violet-300 bg-violet-50/50 dark:bg-violet-950/20 cursor-wait'
                  : isDragging
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40'
                  : 'border-slate-200 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-600 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0])}
                className="hidden"
                disabled={isUploading}
              />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                isUploading
                  ? 'bg-violet-100 dark:bg-violet-900/60 text-violet-500 dark:text-violet-300'
                  : 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400'
              }`}>
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              {isUploading ? (
                <>
                  <p className="text-xs font-bold text-violet-600 dark:text-violet-400">
                    Uploading to server...
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Please wait while your image is uploaded
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Click or Drag & Drop photo here
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    Supports PNG, JPG, WEBP or GIF
                  </p>
                </>
              )}
              {uploadError && (
                <p className="text-[11px] text-rose-500 dark:text-rose-400 mt-2">
                  {uploadError}
                </p>
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Link className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white cursor-pointer"
              >
                Apply
              </button>
            </div>
          )}
        </>
      )}

      {/* Preset Quick Picks */}
      {presets.length > 0 && (
        <div className="pt-1">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5">
            <ImageIcon className="w-3 h-3 text-amber-500" /> Sample Stock Photos:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setUrlInput(preset.url);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium border transition-colors cursor-pointer flex items-center gap-1 ${
                  value === preset.url
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <ImageIcon className="w-3 h-3 text-slate-400" />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
