import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { MotionCard } from '../components/common/MotionCard';
import { ImageUploadInput } from '../components/common/ImageUploadInput';
import { Package, Plus, Edit3, Trash2, Search, Hash } from 'lucide-react';
import api from '../lib/api-client';
import type { Product } from '../types';

export const ProductsPage: React.FC = () => {
  const { products, addProduct, updateResource, deleteResource } = useData();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const uploadedKeyRef = useRef<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOnWebsite, setDisplayOnWebsite] = useState(false);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const generateSku = (productName: string): string => {
    const clean = productName
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '-')
      .slice(0, 12);
    const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${clean}-${suffix}`;
  };

  const resetForm = () => {
    setName('');
    setCategory('');
    setSku('');
    setPrice('');
    setStock('');
    setImageUrl('');
    setDisplayOnWebsite(false);
  };

  const closeModal = () => {
    // Clean up unsaved uploaded image from R2
    if (uploadedKeyRef.current) {
      api.deleteUploadedImage(uploadedKeyRef.current).catch(() => {});
      uploadedKeyRef.current = null;
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    resetForm();
  };

  const openAddModal = () => {
    setEditingProduct(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category);
    setSku(product.sku);
    setPrice(String(product.price));
    setStock(String(product.stock));
    setImageUrl(product.imageUrl || '');
    setDisplayOnWebsite(product.displayOnWebsite || false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category) return;

    if (editingProduct) {
      const success = await updateResource('products', editingProduct.id, {
        name,
        category,
        sku,
        price: parseFloat(price) || 0,
        stock: parseInt(stock, 10) || 0,
        imageUrl: imageUrl || undefined,
        displayOnWebsite,
      } as Partial<Product>);
      if (success) {
        addToast({ title: 'Product Updated', message: `"${name}" has been updated.`, type: 'success' });
        uploadedKeyRef.current = null;
        closeModal();
      } else {
        addToast({ title: 'Update Failed', message: 'Could not update the product.', type: 'error' });
      }
    } else {
      const newSku = sku || generateSku(name);
      const result = await addProduct({
        name,
        sku: newSku,
        category,
        price: parseFloat(price) || 0,
        stock: parseInt(stock, 10) || 0,
        imageUrl: imageUrl || undefined,
        displayOnWebsite,
      });
      if (result) {
        addToast({ title: 'Product Added', message: `"${name}" is now in your catalog.`, type: 'success' });
        uploadedKeyRef.current = null;
        closeModal();
      } else {
        addToast({ title: 'Failed to Add Product', message: 'Could not save the product.', type: 'error' });
      }
    }
  };

  const handleDelete = async (id: string, productName: string) => {
    if (deleting === id) return;
    setDeleting(id);
    const success = await deleteResource('products', id);
    if (success) {
      addToast({ title: 'Product Deleted', message: `"${productName}" has been removed.`, type: 'success' });
    } else {
      addToast({ title: 'Delete Failed', message: 'Could not delete the product.', type: 'error' });
    }
    setDeleting(null);
  };

  const getStockLabel = (stock: number) => {
    if (stock <= 0) return { label: 'Out of Stock', class: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400' };
    if (stock <= 10) return { label: `${stock} left`, class: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400' };
    return { label: `${stock} in stock`, class: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400' };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage retail products, stock levels, and pricing.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </motion.button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, category, or SKU..."
          className="w-full pl-9 pr-4 py-2 glass-subtle rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-indigo-500 transition-colors"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="glass-panel rounded-2xl p-6">
          <EmptyState
            icon={Package}
            title={search ? 'No products found' : 'No products yet'}
            description={
              search
                ? `No products matching "${search}"`
                : 'Add your first retail product to start tracking inventory and sales.'
            }
            actionLabel="Add Product"
            onAction={openAddModal}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p, index) => {
            const stockInfo = getStockLabel(p.stock);
            return (
              <MotionCard
                key={p.id}
                delay={index * 0.05}
                className="p-5 flex flex-col justify-between group"
              >
                <div>
                  {p.imageUrl && (
                    <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {p.category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {p.sku}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {p.name}
                  </h3>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    R{p.price.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${stockInfo.class}`}>
                      {stockInfo.label}
                    </span>
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                        title="Edit product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deleting === p.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer disabled:opacity-50"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </MotionCard>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        subtitle={editingProduct ? `Update ${editingProduct.name}` : 'Add a new retail product to your catalog'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Product Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Premium Hair Oil"
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
              placeholder="e.g. Haircare"
              className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              SKU
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder={editingProduct ? undefined : 'Auto-generated if left empty'}
              className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Price (ZAR)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="380"
                className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="25"
                className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <ImageUploadInput
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            onImageKeyChange={(key) => { uploadedKeyRef.current = key; }}
            label="Product Image"
            placeholder="Upload file or enter product image link..."
          />

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
              {editingProduct ? 'Save Changes' : 'Save Product'}
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
