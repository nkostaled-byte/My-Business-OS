import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Order, OrderStatus } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { ShoppingBag, Eye } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { orders, addOrder, updateResource, refreshResource } = useData();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Create Form State
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
    addToast({ title: 'Order Created', message: `Order for ${customerName} (R${totalAmount}) has been registered.`, type: 'success' });
    setIsModalOpen(false);
    setCustomerName('');
    setCustomerEmail('');
    setTotalAmount('');
  };

  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    const success = await updateResource('orders', order.id, { status: newStatus } as Partial<Order>);
    if (success) {
      addToast({ title: 'Status Updated', message: `Order ${order.orderNumber} is now ${newStatus}.`, type: 'success' });
      setSelectedOrder(null);
    } else {
      addToast({ title: 'Update Failed', message: 'Could not update order status.', type: 'error' });
    }
  };

  const nextStatuses = (s: OrderStatus): { label: string; status: OrderStatus; color: string }[] => {
    const all: { label: string; status: OrderStatus; color: string }[] = [
      { label: 'Pending', status: 'pending', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
      { label: 'Processing', status: 'processing', color: 'bg-amber-50 text-amber-600 hover:bg-amber-100' },
      { label: 'Completed', status: 'completed', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
      { label: 'Cancelled', status: 'cancelled', color: 'bg-rose-50 text-rose-600 hover:bg-rose-100' },
      { label: 'Refunded', status: 'refunded', color: 'bg-slate-50 text-slate-600 hover:bg-slate-100' },
    ];
    return all.filter((a) => a.status !== s);
  };

  const getStatusBadge = (s: OrderStatus) => {
    switch (s) {
      case 'completed': return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">Completed</span>;
      case 'processing': return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">Processing</span>;
      case 'pending': return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">Pending</span>;
      case 'cancelled': return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">Cancelled</span>;
      case 'refunded': return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Refunded</span>;
      default: return <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{s}</span>;
    }
  };

  const columns: Column<Order>[] = [
    {
      header: 'Order #',
      accessorKey: 'orderNumber',
      cell: (row) => <span className="font-bold text-slate-900 dark:text-slate-100">{row.orderNumber}</span>,
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      cell: (row) => (
        <div>
          <span className="font-semibold block text-slate-800 dark:text-slate-200">{row.customerName}</span>
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
      cell: (row) => <span className="font-extrabold text-slate-900 dark:text-slate-100">R{row.totalAmount.toLocaleString()}</span>,
    },
    {
      header: 'Items',
      cell: (row) => <span className="text-slate-500">{row.itemsCount} {row.itemsCount === 1 ? 'item' : 'items'}</span>,
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
    },
    {
      header: '',
      cell: (row) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => { e.stopPropagation(); setSelectedOrder(row); }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-colors cursor-pointer"
          title="View order details"
        >
          <Eye className="w-4 h-4" />
        </motion.button>
      ),
    },
  ];

  const statusFlow: Record<OrderStatus, OrderStatus[]> = {
    pending: ['processing', 'cancelled'],
    processing: ['completed', 'cancelled'],
    completed: ['refunded'],
    cancelled: ['pending'],
    refunded: [],
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Orders Management</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor order processing, update statuses, and manage fulfillment.</p>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        searchKey="customerName"
        searchPlaceholder="Search orders by customer..."
        emptyTitle="No orders yet"
        emptyDescription="When customers place orders, they will appear here."
        emptyIcon={ShoppingBag}
        onAddClick={() => setIsModalOpen(true)}
        addButtonLabel="Create Order"
        exportFilename="orders_export"
        exportTable="orders"
      />

      {/* Create Order Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Order" subtitle="Manually register a sales order">
        <form onSubmit={handleCreateOrder} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Name</label>
            <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Sipho Dlamini" className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Customer Email</label>
            <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="e.g. sipho@example.com" className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Amount (ZAR)</label>
            <input type="number" required step="0.01" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} placeholder="e.g. 1250" className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100">
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer">Cancel</button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 cursor-pointer">Save Order</motion.button>
          </div>
        </form>
      </Modal>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <Modal isOpen={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} title={`Order ${selectedOrder.orderNumber}`} subtitle={`Placed by ${selectedOrder.customerName}`} maxWidth="max-w-lg">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Customer</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedOrder.customerName}</span>
                {selectedOrder.customerEmail && <span className="text-slate-500 block">{selectedOrder.customerEmail}</span>}
              </div>
              <div className="text-right">
                <span className="text-slate-400 block font-medium">Current Status</span>
                <span className="mt-1 inline-block">{getStatusBadge(selectedOrder.status)}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Order Date</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedOrder.createdAt || '—'}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block font-medium">Total</span>
                <span className="font-extrabold text-lg text-slate-900 dark:text-slate-100">R{selectedOrder.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-slate-800 dark:text-slate-200">{item.name} <span className="text-slate-400">x{item.quantity}</span></span>
                      <span className="font-semibold">R{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedOrder.paymentMethod && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Payment Method</span>
                <span className="font-semibold uppercase">{selectedOrder.paymentMethod}</span>
              </div>
            )}

            {/* Status change */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Change Status</h4>
              <div className="flex flex-wrap gap-2">
                {statusFlow[selectedOrder.status]?.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No further status changes available.</span>
                ) : (
                  statusFlow[selectedOrder.status]?.map((ns) => {
                    const target = nextStatuses(selectedOrder.status).find((a) => a.status === ns);
                    return (
                      <button
                        key={ns}
                        onClick={() => handleStatusChange(selectedOrder, ns)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${target?.color || 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        Mark as {ns.charAt(0).toUpperCase() + ns.slice(1)}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
