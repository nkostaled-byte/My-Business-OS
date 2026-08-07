import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Invoice, InvoiceStatus } from '../types';
import { DataTable, Column } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { FileSpreadsheet, Eye, Download, FileText, Calendar, Mail, DollarSign, Package, Scissors, Type } from 'lucide-react';
import api from '../lib/api-client';

export const InvoicesPage: React.FC = () => {
  const { invoices, setInvoices, isLoading, products, services } = useData();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [lineItems, setLineItems] = useState<{
    description: string;
    quantity: number;
    price: number;
    source: 'manual' | 'product' | 'service';
    sourceId?: string;
  }[]>([
    { description: '', quantity: 1, price: 0, source: 'manual' },
  ]);
  const [tax, setTax] = useState(0);
  const [status, setStatus] = useState<InvoiceStatus>('sent');
  const [dueDate, setDueDate] = useState('');

  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const total = subtotal + tax;

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, price: 0, source: 'manual' }]);
  };

  const removeLineItem = (idx: number) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((_, i) => i !== idx));
  };

  const updateLineItem = (idx: number, field: 'description' | 'quantity' | 'price' | 'source' | 'sourceId', value: string | number) => {
    const updated = [...lineItems];
    (updated[idx] as any)[field] = value;
    setLineItems(updated);
  };

  const pickProduct = (idx: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const updated = [...lineItems];
    updated[idx] = {
      description: product.name,
      quantity: 1,
      price: product.price,
      source: 'product',
      sourceId: productId,
    };
    setLineItems(updated);
  };

  const pickService = (idx: number, serviceId: string) => {
    const svc = services.find((s) => s.id === serviceId);
    if (!svc) return;
    const updated = [...lineItems];
    updated[idx] = {
      description: svc.name,
      quantity: 1,
      price: svc.price,
      source: 'service',
      sourceId: serviceId,
    };
    setLineItems(updated);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const validItems = lineItems.filter((item) => item.description.trim() && item.quantity > 0);
      if (validItems.length === 0) {
        addToast({ title: 'Validation Error', message: 'Add at least one item with a description.', type: 'error' });
        setCreating(false);
        return;
      }

      const result = await api.post<any>('/api/invoices', {
        customer: { name: clientName, email: clientEmail },
        items: validItems.map((item) => ({
          productId: item.source === 'product' ? item.sourceId : undefined,
          serviceId: item.source === 'service' ? item.sourceId : undefined,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
        })),
        tax,
        status,
        dueDate: dueDate || new Date(Date.now() + 14 * 86400000).toISOString().substring(0, 10),
      });

      if (result.success && result.data) {
        // Refresh invoices list from dashboard
        const refresh = await api.get<Invoice[]>('/api/dashboard/invoices?order=created_at.desc&limit=50');
        if (refresh.success && refresh.data) {
          setInvoices(refresh.data);
        }
        addToast({
          title: 'Invoice Issued',
          message: `Invoice created for ${clientName} — PDF generated.`,
          type: 'success',
        });
        setIsModalOpen(false);
        setClientName('');
        setClientEmail('');
        setLineItems([{ description: '', quantity: 1, price: 0, source: 'manual' }]);
        setTax(0);
        setDueDate('');
        setStatus('sent');
      } else {
        addToast({
          title: 'Failed to Create Invoice',
          message: result.error || 'Could not save the invoice.',
          type: 'error',
        });
      }
    } catch (err: any) {
      addToast({
        title: 'Network Error',
        message: err?.message || 'Could not reach the server.',
        type: 'error',
      });
    }
    setCreating(false);
  };

  const handleDownloadPdf = async (invoice: Invoice) => {
    const id = invoice.id;
    if (downloading === id) return;
    setDownloading(id);
    try {
      const token = localStorage.getItem('grafix_auth_token');
      const pdfUrl = api.getUrl(`/api/invoices/${id}/pdf`);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS) {
        window.open(pdfUrl, '_blank');
        addToast({ title: 'PDF Opened', message: `${invoice.invoiceNumber || 'Invoice'} PDF opened in new tab.`, type: 'success' });
      } else {
        const response = await fetch(pdfUrl, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
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
      }
    } catch {
      addToast({ title: 'Download Failed', message: 'Network error while downloading PDF.', type: 'error' });
    }
    setDownloading(null);
  };

  const handleUpdateStatus = async (invoice: Invoice, newStatus: InvoiceStatus) => {
    if (newStatus === invoice.status) return;
    setUpdatingStatus(true);
    try {
      const result = await api.put<any>(`/api/dashboard/invoices/${invoice.id}`, { status: newStatus });
      if (result.success) {
        const updated = { ...invoice, status: newStatus };
        setSelectedInvoice(updated);
        setInvoices(invoices.map((inv) => (inv.id === invoice.id ? updated : inv)));
        addToast({ title: 'Status Updated', message: `Invoice marked as ${newStatus}.`, type: 'success' });
      } else {
        addToast({ title: 'Update Failed', message: result.error || 'Could not update status.', type: 'error' });
      }
    } catch {
      addToast({ title: 'Update Failed', message: 'Network error while updating status.', type: 'error' });
    }
    setUpdatingStatus(false);
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
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
        subtitle="Generate digital billing statement with line items"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateInvoice} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100"
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
                className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Line Items
              </label>
              <button
                type="button"
                onClick={addLineItem}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 cursor-pointer"
              >
                + Add Item
              </button>
            </div>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {lineItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  {/* Source type toggle */}
                  <div className="flex gap-px border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => updateLineItem(idx, 'source', 'manual')}
                      className={`px-1.5 py-1.5 text-[10px] font-bold cursor-pointer ${item.source === 'manual' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}
                      title="Manual entry"
                    >
                      <Type className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateLineItem(idx, 'source', 'product')}
                      className={`px-1.5 py-1.5 text-[10px] font-bold cursor-pointer ${item.source === 'product' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}
                      title="Pick from inventory"
                    >
                      <Package className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateLineItem(idx, 'source', 'service')}
                      className={`px-1.5 py-1.5 text-[10px] font-bold cursor-pointer ${item.source === 'service' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}
                      title="Pick a service"
                    >
                      <Scissors className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Description field or picker */}
                  {item.source === 'manual' ? (
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(idx, 'description', e.target.value)}
                      placeholder="Item description"
                      className="flex-1 min-w-0 px-3 py-1.5 rounded-lg glass-subtle text-xs text-slate-900 dark:text-slate-100"
                    />
                  ) : item.source === 'product' ? (
                    <select
                      value={item.sourceId || ''}
                      onChange={(e) => pickProduct(idx, e.target.value)}
                      className="flex-1 min-w-0 px-3 py-1.5 rounded-lg glass-subtle text-xs text-slate-900 dark:text-slate-100"
                    >
                      <option value="">Select product...</option>
                      {products
                        .filter((p) => p.status !== 'out-of-stock')
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} — R{p.price.toFixed(2)} ({p.stock} in stock)
                          </option>
                        ))}
                    </select>
                  ) : (
                    <select
                      value={item.sourceId || ''}
                      onChange={(e) => pickService(idx, e.target.value)}
                      className="flex-1 min-w-0 px-3 py-1.5 rounded-lg glass-subtle text-xs text-slate-900 dark:text-slate-100"
                    >
                      <option value="">Select service...</option>
                      {services
                        .filter((s) => s.isActive)
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name} — R{s.price.toFixed(2)} ({s.durationMinutes}min)
                          </option>
                        ))}
                    </select>
                  )}

                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateLineItem(idx, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 px-2 py-1.5 rounded-lg glass-subtle text-xs text-center text-slate-900 dark:text-slate-100"
                    title="Qty"
                  />
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.price}
                    onChange={(e) => updateLineItem(idx, 'price', parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1.5 rounded-lg glass-subtle text-xs text-right text-slate-900 dark:text-slate-100"
                    title="Price"
                  />
                  <span className="text-[11px] font-semibold text-slate-500 w-14 text-right flex-shrink-0">
                    R{(item.quantity * item.price).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLineItem(idx)}
                    disabled={lineItems.length <= 1}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 disabled:opacity-30 cursor-pointer flex-shrink-0"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 space-y-1 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>R{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Tax (ZAR)</span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={tax}
                onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                className="w-28 px-2 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs text-right text-slate-900 dark:text-slate-100"
              />
            </div>
            <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100 pt-1 border-t border-slate-200 dark:border-slate-700">
              <span>Total</span>
              <span>R{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100"
              >
                <option value="sent">Sent</option>
                <option value="draft">Draft</option>
                <option value="paid">Paid</option>
              </select>
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
                className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs text-slate-900 dark:text-slate-100"
              />
            </div>
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
              disabled={creating}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
            >
              {creating ? 'Generating...' : 'Issue Invoice'}
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
                <div className="flex items-center gap-2">
                  <select
                    value={selectedInvoice.status}
                    disabled={updatingStatus}
                    onChange={(e) => handleUpdateStatus(selectedInvoice, e.target.value as InvoiceStatus)}
                    className="px-2 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-900 dark:text-slate-100 disabled:opacity-50"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
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
                <span className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400">
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
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-50"
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
