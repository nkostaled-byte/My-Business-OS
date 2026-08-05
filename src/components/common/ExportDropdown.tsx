import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Check, Loader2 } from 'lucide-react';
import api from '../../lib/api-client';
import { useToast } from '../../context/ToastContext';

interface ExportDropdownProps {
  table?: string;
  filename?: string;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ table = 'customers', filename = 'export' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { error: showError, success: showSuccess } = useToast();

  const handleExportCsv = async () => {
    setExporting('CSV');
    setIsOpen(false);

    try {
      const result = await api.exportCsv(table);
      if (result.success && result.csvContent) {
        // Create a Blob and trigger download
        const blob = new Blob([result.csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.fileName || `${filename}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setSuccess('CSV');
        showSuccess('CSV downloaded successfully', `${filename}.csv`);
      } else {
        showError('Export failed', result.error || 'Could not export data. Please try again.');
      }
    } catch (err: any) {
      showError('Export error', err?.message || 'An unexpected error occurred during export.');
    } finally {
      setExporting(null);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleExportPdf = () => {
    // PDF export is not supported via Worker API yet
    setSuccess('PDF');
    setTimeout(() => setSuccess(null), 3000);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={!!exporting}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold glass-subtle text-slate-700 dark:text-slate-200 shadow-panel transition-colors cursor-pointer disabled:opacity-50"
      >
        {exporting ? (
          <Loader2 className="w-3.5 h-3.5 text-slate-500 animate-spin" />
        ) : (
          <Download className="w-3.5 h-3.5 text-slate-500" />
        )}
        <span>{exporting ? 'Exporting...' : 'Export'}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 rounded-xl glass-strong py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Download Format
            </div>
            <button
              onClick={handleExportCsv}
              disabled={!!exporting}
              className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                <span>Export CSV</span>
              </div>
              {exporting === 'CSV' && <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />}
            </button>
            <button
              onClick={handleExportPdf}
              disabled={!!exporting}
              className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-500" />
                <span>Export PDF</span>
              </div>
            </button>
          </div>
        </>
      )}

      {success && (
        <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{success === 'CSV' ? 'CSV downloaded successfully' : 'PDF export coming soon'}</span>
        </div>
      )}
    </div>
  );
};
