import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { MotionCard } from '../components/common/MotionCard';
import { ImageUploadInput } from '../components/common/ImageUploadInput';
import { Package, Plus, Search } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const { products, addProduct } = useData();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const productPresets = [
    { label: 'Hair Oil', url: 'https://images.unsplash.com/photo-1608248597261-83325e6ba713?w=300&auto=format&fit=crop&q=80' },
    { label: 'Beard Balm', url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&auto=format&fit=crop&q=80' },
    { label: 'Shampoo', url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=80' },
    { label: 'Silk Wrap', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80' },
  ];

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const sku = generateSku(name);
    const result = await addProduct({
      name,
      sku,
      category,
      price: parseFloat(price) || 0,
      stock: parseInt(stock, 10) || 0,
      imageUrl: imageUrl || undefined,
    });
    if (result) {
      addToast({
        title: 'Product Added',
        message: `"${name}" has been added to your catalog. (SKU: ${sku})`,
        type: 'success',
      });
      setIsModalOpen(false);
      setName('');
      setCategory('');
      setPrice('');
      setStock('');
      setImageUrl('');
    } else {
      addToast({
        title: 'Failed to Add Product',
        message: 'Could not save the product. Please check your connection and try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Products Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage product inventory, pricing, and retail items.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-md shadow-violet-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-violet-500 transition-colors"
        />
      </div>

      {/* Grid of Product Cards */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800">
          <EmptyState
            icon={Package}
            title="No products found"
            description={
              search
                ? `No products matching "${search}"`
                : "There are no products in your store catalog yet."
            }
            actionLabel="Add Product"
            onAction={() => setIsModalOpen(true)}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p, index) => (
            <MotionCard key={p.id} delay={index * 0.05} className="flex flex-col justify-between">
              <div>
                <img
                  src={
                    p.imageUrl ||
                    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&auto=format&fit=crop&q=80'
                  }
                  alt={p.name}
                  className="w-full h-36 object-cover rounded-xl mb-3 border border-slate-100 dark:border-slate-800"
                />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                  {p.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {p.name}
                </h3>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 block">
                    R{p.price.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400">{p.stock} in stock</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    p.stock > 10
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : p.stock > 0
                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                      : 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                  }`}
                >
                  {p.stock > 10 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                </span>
              </div>
            </MotionCard>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Product"
        subtitle="Enter product details for inventory & sales catalog"
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
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
              placeholder="e.g. Haircare"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Price (ZAR)
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="380"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Initial Stock
              </label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="25"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <ImageUploadInput
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            label="Product Photo / Image"
            presets={productPresets}
            placeholder="Upload file or enter product image link..."
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
              Save Product
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

