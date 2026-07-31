import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Invoice, InvoiceStatus } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { FileSpreadsheet, Eye, Download, FileText, Calendar, Mail, DollarSign } from 'lucide-react';
import api from '../lib/api-client';

export const InvoicesPage: React.FC = () => {
  const { invoices, addInvoice, isLoading } = useData();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<InvoiceStatus>('sent');
  const [dueDate, setDueDate] = useState('');

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addInvoice({
      clientName,
      clientEmail,
      amount: parseFloat(amount) || 0,
      status,
      dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
    });
    if (result) {
      addToast({
        title: 'Invoice Issued',
        message: `Invoice created for ${clientName} (R${amount}).`,
        type: 'success',
      });
      setIsModalOpen(false);
      setClientName('');
      setClientEmail('');
      setAmount('');
      setDueDate('');
      setStatus('sent');
    } else {
      addToast({
        title: 'Failed to Create Invoice',
        message: 'Could not save the invoice. Please check your connection and try again.',
        type: 'error',
      });
    }
  };

  const handleDownloadPdf = async (invoice: Invoice) => {
    const id = invoice.id;
    if (downloading === id) return;
    setDownloading(id);
    try {
      const token = localStorage.getItem('grafix_auth_token');
      const response = await fetch(
        api.getUrl(`/api/invoices/${id}/pdf`),
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (!response.ok) {
        addToast({ title: 'Download Failed', message: 'Could not generate PDF.', type: 'error' });
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoice.invoiceNumber || 'invoice'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast({ title: 'PDF Downloaded', message: `${invoice.invoiceNumber || 'Invoice'} PDF saved.`, type: 'success' });
    } catch {
      addToast({ title: 'Download Failed', message: 'Network error while downloading PDF.', type: 'error' });
    }
    setDownloading(null);
  };

  const getStatusBadge = (s: InvoiceStatus) => {
    switch (s) {
      case 'paid':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200">
            Paid
          </span>
        );
      case 'sent':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200">
            Sent
          </span>
        );
      case 'overdue':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200">
            Overdue
          </span>
        );
      case 'draft':
        return (
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Draft
          </span>
        );
      default:
        return null;
    }
  };

  const columns: Column<Invoice>[] = [
    {
      header: 'Invoice #',
      accessorKey: 'invoiceNumber',
      cell: (row) => (
        <span className="font-bold text-slate-900 dark:text-slate-100">
          {row.invoiceNumber}
        </span>
      ),
    },
    {
      header: 'Client',
      cell: (row) => (
        <div>
          <span className="font-semibold block text-slate-800 dark:text-slate-200">
            {row.clientName || '—'}
          </span>
          <span className="text-[11px] text-slate-400">{row.clientEmail || '—'}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: 'Amount',
      cell: (row) => (
        <span className="font-extrabold text-slate-900 dark:text-slate-100">
          R{(row.total ?? row.amount ?? 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Due Date',
      cell: (row) => <span>{row.dueDate || row.dueAt || '—'}</span>,
    },
    {
      header: '',
      cell: (row) => (
        <div className="flex gap-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); setSelectedInvoice(row); }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-colors cursor-pointer"
            title="View invoice details"
          >
            <Eye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); handleDownloadPdf(row); }}
            disabled={downloading === row.id}
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors cursor-pointer disabled:opacity-50"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
  ];

  const formatDate = (d: string | undefined) => {
    if (!d) return '—';
    try { return new Date(d).toLocaleDateString(); } catch { return d; }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Invoicing & Billing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Issue digital invoices to B2B clients, wholesale stockists, or custom bookings.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        searchKey="clientName"
        searchPlaceholder="Search invoices by client..."
        emptyTitle="No invoices created"
        emptyDescription="Create invoices for client services or wholesale orders."
        emptyIcon={FileSpreadsheet}
        onAddClick={() => setIsModalOpen(true)}
        addButtonLabel="Create Invoice"
        isLoading={isLoading}
        exportFilename="invoices_export"
        exportTable="invoices"
      />

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Invoice"
        subtitle="Generate digital billing statement"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Client / Company Name
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Apex Beauty Suppliers"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Client Email
            </label>
            <input
              type="email"
              required
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="billing@apexbeauty.co.za"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount (ZAR)
              </label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="4200"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="sent">Sent</option>
                <option value="draft">Draft</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Due Date
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
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
              Save Invoice
            </motion.button>
          </div>
        </form>
      </Modal>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <Modal
          isOpen={Boolean(selectedInvoice)}
          onClose={() => setSelectedInvoice(null)}
          title={`Invoice ${selectedInvoice.invoiceNumber}`}
          subtitle={selectedInvoice.clientName || 'Invoice details'}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> Invoice #
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block mb-1">Status</span>
                <span>{getStatusBadge(selectedInvoice.status)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Client
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedInvoice.clientName || '—'}</span>
                {selectedInvoice.clientEmail && <span className="text-slate-500 block">{selectedInvoice.clientEmail}</span>}
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5" /> Amount
                </span>
                <span className="font-extrabold text-lg text-violet-600 dark:text-violet-400">
                  R{(selectedInvoice.total ?? selectedInvoice.amount ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Due Date
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatDate(selectedInvoice.dueDate || selectedInvoice.dueAt)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Issued Date
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatDate(selectedInvoice.issuedDate || selectedInvoice.issuedAt)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleDownloadPdf(selectedInvoice)}
                disabled={downloading === selectedInvoice.id}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-md shadow-violet-500/20 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloading === selectedInvoice.id ? 'Generating PDF...' : 'Download PDF'}</span>
              </motion.button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
