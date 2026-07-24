import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { InventoryItem } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { Boxes, AlertTriangle } from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { inventory, isLoading } = useData();

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
    </div>
  );
};
