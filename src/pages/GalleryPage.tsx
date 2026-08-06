import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { Image as ImageIcon, Upload, Plus, Trash2 } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { gallery, addGalleryItem } = useData();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    addGalleryItem({
      title,
      category,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
    });
    setIsUploadOpen(false);
    setTitle('');
    setCategory('');
    setImageUrl('');
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
        onClose={() => setIsUploadOpen(false)}
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Image URL / Unsplash Link
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-200/50 dark:border-white/5">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
            >
              Upload Photo
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
