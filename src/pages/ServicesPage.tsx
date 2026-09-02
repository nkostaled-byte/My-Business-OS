import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { MotionCard } from '../components/common/MotionCard';
import { ImageUploadInput } from '../components/common/ImageUploadInput';
import { prepareReferenceImage } from '../lib/image-utils';
import api from '../lib/api-client';
import type { Service } from '../types';
import { BriefcaseBusiness, Clock, Plus, Edit3, Trash2, Sparkles, Loader2 } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, addService, updateResource, deleteResource } = useData();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const uploadedKeyRef = useRef<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('30');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOnWebsite, setDisplayOnWebsite] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiStyle, setAiStyle] = useState('Clean studio product photography');
  const [aiBackground, setAiBackground] = useState('White background');
  const [aiAspectRatio, setAiAspectRatio] = useState('1:1');
  const [aiPreview, setAiPreview] = useState<{ imageData: string; approvalToken: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiReferenceImage, setAiReferenceImage] = useState('');

  const resetForm = () => {
    setName('');
    setCategory('');
    setPrice('');
    setDescription('');
    setImageUrl('');
    setDuration('30');
    setDisplayOnWebsite(false);
  };

  const closeModal = () => {
    if (uploadedKeyRef.current) {
      api.deleteUploadedImage(uploadedKeyRef.current).catch(() => {});
      uploadedKeyRef.current = null;
    }
    setIsModalOpen(false);
    setEditingService(null);
    resetForm();
  };

  const openAddModal = () => {
    setEditingService(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openAiModal = () => {
    setAiPrompt(name ? `${name}. ` : '');
    setAiPreview(null);
    setAiReferenceImage('');
    setAiError('');
    setIsAiOpen(true);
  };

  const closeAiModal = () => {
    if (aiLoading) return;
    setIsAiOpen(false);
    setAiPreview(null);
    setAiError('');
  };

  const generateServiceImage = async () => {
    if (!aiPrompt.trim() || aiLoading) return;
    setAiLoading(true);
    setAiError('');
    try {
      const result = await api.generateProductImage({
        prompt: aiPrompt.trim(),
        productName: name.trim() || undefined,
        style: aiStyle,
        background: aiBackground,
        aspectRatio: aiAspectRatio,
        referenceImageData: aiReferenceImage || undefined,
        assetType: 'service',
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
      const result = await api.saveProductImage(aiPreview);
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

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setCategory(service.category);
    setDuration(String(service.durationMinutes));
    setPrice(String(service.price));
    setDescription(service.description || '');
    setImageUrl(service.imageUrl || '');
    setDisplayOnWebsite(service.displayOnWebsite || false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;

    if (editingService) {
      const success = await updateResource('services', editingService.id, {
        name,
        category,
        durationMinutes: parseInt(duration, 10) || 30,
        price: parseFloat(price) || 0,
        description,
        imageUrl: imageUrl || undefined,
        displayOnWebsite,
      } as Partial<Service>);
      if (success) {
        addToast({ title: 'Service Updated', message: `"${name}" has been updated.`, type: 'success' });
        uploadedKeyRef.current = null;
        closeModal();
      } else {
        addToast({ title: 'Update Failed', message: 'Could not update the service.', type: 'error' });
      }
    } else {
      const result = await addService({
        name,
        category,
        durationMinutes: parseInt(duration, 10) || 30,
        price: parseFloat(price) || 0,
        description,
        imageUrl: imageUrl || undefined,
        displayOnWebsite,
      });
      if (result) {
        addToast({
          title: 'Service Created',
          message: `"${name}" is now live and bookable.`,
          type: 'success',
        });
        uploadedKeyRef.current = null;
        closeModal();
      } else {
        addToast({
          title: 'Failed to Create Service',
          message: 'Could not save the service. Please check your connection and try again.',
          type: 'error',
        });
      }
    }
  };

  const handleDelete = async (id: string, serviceName: string) => {
    if (deleting === id) return;
    setDeleting(id);
    const success = await deleteResource('services', id);
    if (success) {
      addToast({ title: 'Service Deleted', message: `"${serviceName}" has been removed.`, type: 'success' });
    } else {
      addToast({ title: 'Delete Failed', message: 'Could not delete the service.', type: 'error' });
    }
    setDeleting(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Services & Treatments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure client services, durations, pricing, and bookable offerings.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </motion.button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="glass-panel rounded-2xl p-6">
          <EmptyState
            icon={BriefcaseBusiness}
            title="No services configured"
            description="Add services such as haircuts, scalp treatments, or styling for online booking."
            actionLabel="Add Service"
            onAction={openAddModal}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, index) => (
            <MotionCard
              key={s.id}
              delay={index * 0.05}
              onClick={() => setViewingService(s)}
              role="button"
              tabIndex={0}
              aria-label={`View details for ${s.name}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setViewingService(s); } }}
              className="p-5 flex flex-col justify-between group cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <div>
                {s.imageUrl && (
                  <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                    <img
                      src={s.imageUrl}
                      alt={s.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    {s.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {s.durationMinutes} mins
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                  {s.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {s.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
                <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  R{s.price.toLocaleString()}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                    Active
                  </span>
                  <div className="flex gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); openEditModal(s); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                      title="Edit service"
                      aria-label={`Edit ${s.name}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => { e.stopPropagation(); handleDelete(s.id, s.name); }}
                      disabled={deleting === s.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete service"
                      aria-label={`Delete ${s.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </MotionCard>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingService ? 'Edit Service' : 'Add Service Offering'}
        subtitle={editingService ? `Update ${editingService.name}` : 'Define a service for online booking & POS checkout'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Service Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Signature Haircut & Beard Trim"
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
              placeholder="e.g. Barber Services"
              className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="45"
                className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Price (ZAR)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="350"
                className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief overview of what is included in this service..."
              className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <ImageUploadInput
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            onImageKeyChange={(key) => { uploadedKeyRef.current = key; }}
            label="Service Photo / Cover Image"
            placeholder="Upload file or enter service image link..."
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

          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              id="displayOnWebsite"
              checked={displayOnWebsite}
              onChange={(e) => setDisplayOnWebsite(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
            />
            <label htmlFor="displayOnWebsite" className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              Display on website
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-200/50 dark:border-white/5">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              {editingService ? 'Save Changes' : 'Save Service'}
            </motion.button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isAiOpen}
        onClose={closeAiModal}
        title="Generate Service Image"
        subtitle="Describe your service and AI will create a professional image for you."
        maxWidth="max-w-2xl"
      >
        {aiLoading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-7 h-7 animate-spin text-indigo-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Creating your service image...</p>
            <p className="text-xs text-slate-400 mt-1">This can take a moment.</p>
          </div>
        ) : aiPreview ? (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              <img src={aiPreview.imageData} alt="Generated service preview" className="w-full max-h-[55dvh] object-contain" />
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
              <button type="button" onClick={closeAiModal} className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer">Cancel</button>
              <button type="button" onClick={generateServiceImage} className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer">Generate Again</button>
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
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Service Description</label>
              <textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} maxLength={1200} rows={5} placeholder="A relaxing hot stone massage in a calm, premium spa setting..." className="w-full px-3.5 py-2.5 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100 resize-y" />
              <p className="text-[10px] text-slate-400 text-right mt-1">{aiPrompt.length}/1200</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Style<select value={aiStyle} onChange={(e) => setAiStyle(e.target.value)} className="mt-1 w-full px-2.5 py-2 rounded-xl glass-subtle text-xs font-normal"><option>Professional lifestyle photography</option><option>Clean service showcase</option><option>Warm welcoming customer experience</option><option>Luxury editorial photography</option></select></label>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Background<select value={aiBackground} onChange={(e) => setAiBackground(e.target.value)} className="mt-1 w-full px-2.5 py-2 rounded-xl glass-subtle text-xs font-normal"><option>Relevant real-world setting</option><option>Clean neutral background</option><option>No background / isolated subject</option></select></label>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Aspect ratio<select value={aiAspectRatio} onChange={(e) => setAiAspectRatio(e.target.value)} className="mt-1 w-full px-2.5 py-2 rounded-xl glass-subtle text-xs font-normal"><option value="1:1">Square (1:1)</option><option value="4:5">Portrait (4:5)</option><option value="16:9">Landscape (16:9)</option></select></label>
            </div>
            <button type="button" onClick={generateServiceImage} disabled={!aiPrompt.trim()} className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">Generate Image</button>
          </div>
        )}
        {aiError && <p className="mt-3 text-xs font-semibold text-rose-600 dark:text-rose-400">{aiError}</p>}
      </Modal>

      {/* Service Details Modal */}
      <Modal
        isOpen={!!viewingService}
        onClose={() => setViewingService(null)}
        title={viewingService?.name || 'Service Details'}
        subtitle={viewingService?.category || undefined}
        maxWidth="max-w-lg"
      >
        {viewingService && (
          <div className="space-y-5">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              {viewingService.imageUrl ? (
                <img src={viewingService.imageUrl} alt={viewingService.name} className="w-full h-64 object-contain" />
              ) : (
                <div className="h-40 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <BriefcaseBusiness className="w-8 h-8" />
                  <span className="text-xs font-medium">No image yet</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Price</p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  R{viewingService.price.toLocaleString()}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5" />
                {viewingService.durationMinutes} mins
              </span>
            </div>

            {viewingService.description && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Description</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{viewingService.description}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                {viewingService.category}
              </span>
              {viewingService.displayOnWebsite && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  Displayed on website
                </span>
              )}
            </div>

            <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-2 border-t border-slate-200/50 dark:border-white/5">
              <button
                type="button"
                onClick={() => setViewingService(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => { const service = viewingService; setViewingService(null); if (service) openEditModal(service); }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Service
              </button>
            </div>
          </div>
        )}
      </Modal>
     </div>
   );
 };
