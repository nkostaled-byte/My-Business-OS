import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Order, OrderStatus } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { ShoppingBag } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { orders, addOrder, isLoading } = useData();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [status, setStatus] = useState<OrderStatus>('completed');

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    addOrder({
      customerName,
      customerEmail,
      totalAmount: parseFloat(totalAmount) || 0,
      status,
      itemsCount: 1,
    });
    addToast({
      title: 'Order Created',
      message: `Order for ${customerName} (R${totalAmount}) has been registered.`,
      type: 'success',
    });
    setIsModalOpen(false);
    setCustomerName('');
    setCustomerEmail('');
    setTotalAmount('');
  };


  const getStatusBadge = (s: OrderStatus) => {
    switch (s) {
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Completed
          </span>
        );
      case 'processing':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            Processing
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            Pending
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {s}
          </span>
        );
    }
  };

  const columns: Column<Order>[] = [
    {
      header: 'Order #',
      accessorKey: 'orderNumber',
      cell: (row) => (
        <span className="font-bold text-slate-900 dark:text-slate-100">
          {row.orderNumber}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      cell: (row) => (
        <div>
          <span className="font-semibold block text-slate-800 dark:text-slate-200">
            {row.customerName}
          </span>
          <span className="text-[11px] text-slate-400">{row.customerEmail || '—'}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Total',
      cell: (row) => (
        <span className="font-extrabold text-slate-900 dark:text-slate-100">
          R{row.totalAmount.toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Orders Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor online and store order processing, status updates, and fulfillment.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        searchKey="customerName"
        searchPlaceholder="Search orders by customer..."
        emptyTitle="No orders yet"
        emptyDescription="When customers place orders online or in store, they will appear here."
        emptyIcon={ShoppingBag}
        onAddClick={() => setIsModalOpen(true)}
        addButtonLabel="Create Order"
        isLoading={isLoading}
        exportFilename="orders_export"
      />

      {/* Create Order Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Order"
        subtitle="Manually create a new sales order"
      >
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Sipho Dlamini"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Customer Email
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="e.g. sipho@example.com"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Total Amount (ZAR)
            </label>
            <input
              type="number"
              required
              step="0.01"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              placeholder="e.g. 1250"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            >
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
            </select>
          </div>

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
              Save Order
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
