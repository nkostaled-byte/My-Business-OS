import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { MotionCard } from '../components/common/MotionCard';
import { ImageUploadInput } from '../components/common/ImageUploadInput';
import { Scissors, Clock, Plus } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, addService } = useData();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('30');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const servicePresets = [
    { label: 'Barber Trim', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format&fit=crop&q=80' },
    { label: 'Scalp Care', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&auto=format&fit=crop&q=80' },
    { label: 'Color & Blowout', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80' },
    { label: 'Beard Grooming', url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&auto=format&fit=crop&q=80' },
  ];

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addService({
      name,
      category,
      durationMinutes: parseInt(duration, 10) || 30,
      price: parseFloat(price) || 0,
      description,
      imageUrl: imageUrl || undefined,
    });
    if (result) {
      addToast({
        title: 'Service Created',
        message: `"${name}" is now live and bookable.`,
        type: 'success',
      });
      setIsModalOpen(false);
      setName('');
      setCategory('');
      setPrice('');
      setDescription('');
      setImageUrl('');
      setDuration('30');
    } else {
      addToast({
        title: 'Failed to Create Service',
        message: 'Could not save the service. Please check your connection and try again.',
        type: 'error',
      });
    }
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
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-md shadow-violet-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </motion.button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800">
          <EmptyState
            icon={Scissors}
            title="No services configured"
            description="Add services such as haircuts, scalp treatments, or styling for online booking."
            actionLabel="Add Service"
            onAction={() => setIsModalOpen(true)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, index) => (
            <MotionCard
              key={s.id}
              delay={index * 0.05}
              className="p-5 flex flex-col justify-between group"
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
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
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

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  R{s.price.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
            </MotionCard>
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Service Offering"
        subtitle="Define a service for online booking & POS checkout"
      >
        <form onSubmit={handleAddService} className="space-y-4">
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
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
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
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
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
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
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
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
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
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <ImageUploadInput
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            label="Service Photo / Cover Image"
            presets={servicePresets}
            placeholder="Upload file or enter service image link..."
          />

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 cursor-pointer"
            >
              Save Service
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

