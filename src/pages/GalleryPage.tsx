import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { ImageUploadInput } from '../components/common/ImageUploadInput';
import { prepareReferenceImage } from '../lib/image-utils';
import api from '../lib/api-client';
import { Images as ImageIcon, Upload, Sparkles, Loader2 } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { gallery, addGalleryItem } = useData();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const uploadedKeyRef = useRef<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // AI generation state
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStyle, setAiStyle] = useState('Clean studio product photography');
  const [aiBackground, setAiBackground] = useState('White background');
  const [aiAspectRatio, setAiAspectRatio] = useState('1:1');
  const [aiReferenceImage, setAiReferenceImage] = useState('');
  const [aiPreview, setAiPreview] = useState<{ imageData: string; approvalToken: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setImageUrl('');
  };

  const closeUploadModal = () => {
    // Discard an uploaded-but-unsaved R2 file so nothing orphans in the bucket.
    if (uploadedKeyRef.current) {
      api.deleteUploadedImage(uploadedKeyRef.current).catch(() => {});
      uploadedKeyRef.current = null;
    }
    setIsUploadOpen(false);
    resetForm();
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    addGalleryItem({
      title,
      category,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
    });
    uploadedKeyRef.current = null;
    setIsUploadOpen(false);
    resetForm();
  };

  const openAiModal = () => {
    setAiPrompt('');
    setAiPreview(null);
    setAiReferenceImage('');
    setAiError('');
    setIsAiOpen(true);
  };

  const closeAiModal = () => {
    if (aiLoading) return;
    setIsAiOpen(false);
    setAiPreview(null);
    setAiReferenceImage('');
    setAiError('');
  };

  const generateGalleryImage = async () => {
    if (!aiPrompt.trim() || aiLoading) return;
    setAiLoading(true);
    setAiError('');
    try {
      const result = await api.generateProductImage({
        prompt: aiPrompt.trim(),
        style: aiStyle,
        background: aiBackground,
        aspectRatio: aiAspectRatio,
        referenceImageData: aiReferenceImage || undefined,
        purpose: 'gallery',
      });
      if (!result.success || !result.data) throw new Error(result.error || 'The image could not be generated.');
      setAiPreview({ imageData: result.data.imageData, approvalToken: result.data.approvalToken });
      setAiReferenceImage(result.data.imageData);
    } catch (err: any) {
      setAiError(err?.message || 'The image could not be generated. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const useGeneratedImage = async () => {
    if (!aiPreview || aiLoading) return;
    setAiLoading(true);
    setAiError('');
    try {
      const result = await api.saveProductImage({ ...aiPreview, purpose: 'gallery' });
      if (!result.success || !result.data?.url) throw new Error(result.error || 'The image could not be saved.');
      setImageUrl(result.data.url);
      uploadedKeyRef.current = result.data.key;
      setIsAiOpen(false);
      setAiPreview(null);
    } catch (err: any) {
      setAiError(err?.message || 'The image could not be saved. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Media & Portfolio Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Showcase salon transformations, interior photos, and product packaging.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Media</span>
        </button>
      </div>

      {gallery.length === 0 ? (
        <div className="glass-panel rounded-2xl p-6">
          <EmptyState
            icon={ImageIcon}
            title="Gallery is empty"
            description="Upload portfolio photos to display on your public storefront and client portal."
            actionLabel="Upload Media"
            onAction={() => setIsUploadOpen(true)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 shadow-xs border border-slate-200 dark:border-slate-800"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-4 flex flex-col justify-end text-white opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  {item.category}
                </span>
                <h4 className="text-xs font-bold leading-tight mt-0.5">{item.title}</h4>
                <span className="text-[10px] text-slate-300 mt-1">Uploaded {item.uploadedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={closeUploadModal}
        title="Upload Photo to Gallery"
        subtitle="Add image to portfolio or store showcase"
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title / Caption
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Studio Interior Showcase"
              className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Salon, Products, Before/After"
              className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <ImageUploadInput
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            onImageKeyChange={(key) => { uploadedKeyRef.current = key; }}
            label="Gallery Image"
            placeholder="Upload file or enter image link..."
            folder="gallery"
          />

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            <span className="text-[10px] uppercase tracking-wider text-slate-400">or</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
          </div>

          <button
            type="button"
            onClick={openAiModal}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900/50 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate Image with AI
          </button>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-200/50 dark:border-white/5">
            <button
              type="button"
              onClick={closeUploadModal}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              Upload Photo
            </button>
          </div>
        </form>
      </Modal>

      {/* AI Generation Modal */}
      <Modal
        isOpen={isAiOpen}
        onClose={closeAiModal}
        title="Generate Gallery Image"
        subtitle="Describe the image and AI will create it for your gallery."
        maxWidth="max-w-2xl"
      >
        {aiLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Creating your gallery image...</p>
            <p className="text-xs text-slate-400 mt-1">This can take a moment.</p>
          </div>
        ) : aiPreview ? (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              <img src={aiPreview.imageData} alt="Generated gallery preview" className="w-full max-h-[55dvh] object-contain" />
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
              <button type="button" onClick={closeAiModal} className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer">Cancel</button>
              <button type="button" onClick={generateGalleryImage} className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer">Generate Again</button>
              <button type="button" onClick={useGeneratedImage} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer">Use This Image</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div><p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Reference image <span className="font-normal text-slate-400">(optional)</span></p><p className="text-[10px] text-slate-400 mt-0.5">Upload an image or edit the generated image in the next round.</p></div>
                {aiReferenceImage && <button type="button" onClick={() => setAiReferenceImage('')} className="text-[10px] font-semibold text-rose-500 cursor-pointer">Remove</button>}
              </div>
              {aiReferenceImage ? <img src={aiReferenceImage} alt="Reference preview" className="h-20 w-20 rounded-lg object-cover border border-slate-200 dark:border-slate-700" /> : <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-slate-300 dark:border-slate-600 text-xs text-slate-500 cursor-pointer hover:border-indigo-400"><Sparkles className="w-3.5 h-3.5" /><span>Upload reference image</span><input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; try { setAiReferenceImage(await prepareReferenceImage(file)); setAiError(''); } catch (err: any) { setAiError(err?.message || 'Could not read the reference image.'); } }} /></label>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Image Description</label>
              <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} maxLength={1200} rows={5} placeholder="A modern barbershop interior with warm lighting and clean styling stations..." className="w-full px-3.5 py-2.5 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100 resize-y" />
              <p className="text-[10px] text-slate-400 text-right mt-1">{aiPrompt.length}/1200</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Style<select value={aiStyle} onChange={(e) => setAiStyle(e.target.value)} className="mt-1 w-full px-2.5 py-2 rounded-xl glass-subtle text-xs font-normal"><option>Clean studio product photography</option><option>Professional lifestyle photography</option><option>Luxury editorial photography</option><option>Natural lifestyle photography</option></select></label>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Background<select value={aiBackground} onChange={(e) => setAiBackground(e.target.value)} className="mt-1 w-full px-2.5 py-2 rounded-xl glass-subtle text-xs font-normal"><option>White background</option><option>Relevant real-world setting</option><option>Soft neutral background</option><option>Dark studio background</option></select></label>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Aspect ratio<select value={aiAspectRatio} onChange={(e) => setAiAspectRatio(e.target.value)} className="mt-1 w-full px-2.5 py-2 rounded-xl glass-subtle text-xs font-normal"><option value="1:1">Square (1:1)</option><option value="4:5">Portrait (4:5)</option><option value="16:9">Landscape (16:9)</option></select></label>
            </div>
            <button type="button" onClick={generateGalleryImage} disabled={!aiPrompt.trim()} className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">Generate Image</button>
          </div>
        )}
        {aiError && <p className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400">{aiError}</p>}
      </Modal>
    </div>
  );
};
