import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Customer } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { Users, Mail, Phone, Calendar, ShoppingBag } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { customers, addCustomer, isLoading } = useData();
  const { addToast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer({ name, email, phone });
    addToast({
      title: 'Customer Added',
      message: `Profile created for ${name}.`,
      type: 'success',
    });
    setIsAddOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };


  const columns: Column<Customer>[] = [
    {
      header: 'Customer',
      accessorKey: 'name',
      cell: (row) => (
        <div
          onClick={() => setSelectedCustomer(row)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={
              row.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
            }
            alt={row.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
          />
          <div>
            <span className="font-bold block text-slate-900 dark:text-slate-100 group-hover:text-violet-600 transition-colors">
              {row.name}
            </span>
            <span className="text-[11px] text-slate-400">{row.email || 'No email'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
    {
      header: 'Tier',
      cell: (row) => (
        <span
          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
            row.tier === 'VIP'
              ? 'bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400'
              : row.tier === 'Regular'
              ? 'bg-violet-50 text-violet-600 border border-violet-200 dark:bg-violet-950/60 dark:text-violet-400'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          }`}
        >
          {row.tier}
        </span>
      ),
    },
    {
      header: 'Total Spent',
      cell: (row) => (
        <span className="font-extrabold text-slate-900 dark:text-slate-100">
          R{(row.totalSpent || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Orders',
      cell: (row) => (
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {row.ordersCount ?? 0} orders
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Customer Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage client profiles, spend history, and communication preferences.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        searchKey="name"
        searchPlaceholder="Search customers..."
        emptyTitle="No customers registered"
        emptyDescription="Customer records will accumulate as orders and bookings are created."
        emptyIcon={Users}
        onAddClick={() => setIsAddOpen(true)}
        addButtonLabel="New Customer"
        isLoading={isLoading}
        exportFilename="customers_export"
        exportTable="customers"
      />

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Customer Profile"
        subtitle="Create a new client record"
      >
        <form onSubmit={handleAddCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sipho Dlamini"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sipho@example.com"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+27 82 555 0192"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
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
              Save Customer
            </motion.button>
          </div>
        </form>
      </Modal>

      {/* Customer Detail Drawer Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={Boolean(selectedCustomer)}
          onClose={() => setSelectedCustomer(null)}
          title={`Client Details: ${selectedCustomer.name}`}
          subtitle={`Profile & Purchase Summary`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <img
                src={
                  selectedCustomer.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                }
                alt={selectedCustomer.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-violet-500"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {selectedCustomer.name}
                </h4>
                <span className="text-violet-600 font-semibold">{selectedCustomer.tier} Tier</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Email
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedCustomer.email}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Phone
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedCustomer.phone}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5" /> Lifetime Spend
                </span>
                <span className="font-extrabold text-violet-600 dark:text-violet-400 text-sm">
                  R{(selectedCustomer.totalSpent || 0).toLocaleString()}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Last Visit
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedCustomer.lastVisit || '—'}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
