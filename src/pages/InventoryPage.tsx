import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { InventoryItem } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { Boxes, AlertTriangle, Edit3 } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { inventory, updateResource, isLoading } = useData();
  const { addToast } = useToast();
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [stock, setStock] = useState('');
  const [minThreshold, setMinThreshold] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [saving, setSaving] = useState(false);

  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'normal':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200">
            Sufficient
          </span>
        );
      case 'low':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Low Stock
          </span>
        );
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 inline-flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Reorder Now
          </span>
        );
    }
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setStock(String(item.currentStock));
    setMinThreshold(String(item.minThreshold));
    setUnitCost(String(item.unitCost));
  };

  const closeModal = () => {
    setEditingItem(null);
    setStock('');
    setMinThreshold('');
    setUnitCost('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);

    const success = await updateResource('products', editingItem.id, {
      stock: parseInt(stock, 10) || 0,
      costPrice: parseFloat(unitCost) || 0,
      lowStockWarning: parseInt(minThreshold, 10) || 0,
    } as any);

    setSaving(false);
    if (success) {
      addToast({ title: 'Stock Updated', message: `Stock levels updated for ${editingItem.productName}.`, type: 'success' });
      closeModal();
    } else {
      addToast({ title: 'Update Failed', message: 'Could not update the stock level.', type: 'error' });
    }
  };

  const columns: Column<InventoryItem>[] = [
    {
      header: 'SKU',
      accessorKey: 'sku',
      cell: (row) => <span className="font-mono text-xs font-semibold">{row.sku}</span>,
    },
    {
      header: 'Product Name',
      accessorKey: 'productName',
      cell: (row) => (
        <span className="font-bold text-slate-900 dark:text-slate-100">{row.productName}</span>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
    },
    {
      header: 'Current Stock',
      cell: (row) => (
        <span className="font-extrabold text-slate-900 dark:text-slate-100">
          {row.currentStock} {row.unit}
        </span>
      ),
    },
    {
      header: 'Min Threshold',
      cell: (row) => <span className="text-slate-400">{row.minThreshold} {row.unit}</span>,
    },
    {
      header: 'Status',
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Unit Cost',
      cell: (row) => <span>R{row.unitCost}</span>,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openEditModal(row)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-colors cursor-pointer"
          title="Edit stock"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </motion.button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Inventory Control
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor raw material supplies, retail stock, reorder levels, and unit costs.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={inventory}
        searchKey="productName"
        searchPlaceholder="Search inventory by product..."
        emptyTitle="No inventory records"
        emptyDescription="Stock quantities will sync when product stock levels are configured."
        emptyIcon={Boxes}
        isLoading={isLoading}
        exportFilename="inventory_export"
      />

      {/* Edit Stock Modal */}
      <Modal
        isOpen={Boolean(editingItem)}
        onClose={closeModal}
        title={editingItem ? `Edit Stock: ${editingItem.productName}` : 'Edit Stock'}
        subtitle="Update stock quantity, reorder threshold, and unit cost"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Current Stock (units)
            </label>
            <input
              type="number"
              min={0}
              required
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="0"
              className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Min Threshold
              </label>
              <input
                type="number"
                min={0}
                value={minThreshold}
                onChange={(e) => setMinThreshold(e.target.value)}
                placeholder="10"
                className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Unit Cost (ZAR)
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
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
              disabled={saving}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Stock'}
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
