import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Customer } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { Users, Mail, Phone, Calendar, Edit3, Trash2 } from 'lucide-react';

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const CustomersPage: React.FC = () => {
  const { customers, addCustomer, updateResource, deleteResource, isLoading } = useData();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    resetForm();
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setName(customer.name);
    setEmail(customer.email || '');
    setPhone(customer.phone || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingCustomer) {
      const success = await updateResource('customers', editingCustomer.id, {
        name,
        email,
        phone,
      } as Partial<Customer>);
      if (success) {
        addToast({ title: 'Customer Updated', message: `Profile updated for ${name}.`, type: 'success' });
      } else {
        addToast({ title: 'Update Failed', message: 'Could not update the customer.', type: 'error' });
      }
    } else {
      await addCustomer({ name, email, phone });
      addToast({ title: 'Customer Added', message: `Profile created for ${name}.`, type: 'success' });
    }
    closeModal();
  };

  const handleDelete = async (customer: Customer) => {
    if (deleting === customer.id) return;
    setDeleting(customer.id);
    const success = await deleteResource('customers', customer.id);
    if (success) {
      addToast({ title: 'Customer Deleted', message: `${customer.name} has been removed.`, type: 'success' });
      if (selectedCustomer?.id === customer.id) setSelectedCustomer(null);
    } else {
      addToast({ title: 'Delete Failed', message: 'Could not delete the customer.', type: 'error' });
    }
    setDeleting(null);
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
          <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 font-bold text-xs flex items-center justify-center ring-2 ring-slate-100 dark:ring-slate-800">
            {getInitials(row.name)}
          </div>
          <div>
            <span className="font-bold block text-slate-900 dark:text-slate-100 group-hover:text-violet-600 transition-colors">
              {row.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: (row) => (
        <span className="text-slate-600 dark:text-slate-300">{row.email || '—'}</span>
      ),
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openEditModal(row)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-colors cursor-pointer"
            title="Edit customer"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDelete(row)}
            disabled={deleting === row.id}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer disabled:opacity-50"
            title="Delete customer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
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
        onAddClick={openAddModal}
        addButtonLabel="New Customer"
        isLoading={isLoading}
        exportFilename="customers_export"
        exportTable="customers"
      />

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCustomer ? 'Edit Customer Profile' : 'Add Customer Profile'}
        subtitle={editingCustomer ? `Update ${editingCustomer.name}` : 'Create a new client record'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
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
              onClick={closeModal}
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
              {editingCustomer ? 'Save Changes' : 'Save Customer'}
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
              <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 font-bold text-base flex items-center justify-center ring-2 ring-violet-500">
                {getInitials(selectedCustomer.name)}
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {selectedCustomer.name}
                </h4>
                <span className="text-violet-600 font-semibold">{selectedCustomer.email || 'No email'}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openEditModal(selectedCustomer)}
                className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-colors cursor-pointer"
                title="Edit customer"
              >
                <Edit3 className="w-4 h-4" />
              </motion.button>
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
                  <Calendar className="w-3.5 h-3.5" /> Last Visit
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedCustomer.lastVisit || '—'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 col-span-2">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Notes
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedCustomer.notes || '—'}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
