import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, LucideIcon, Inbox } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { TableSkeleton } from './Skeleton';
import { ExportDropdown } from './ExportDropdown';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
  onAddClick?: () => void;
  addButtonLabel?: string;
  isLoading?: boolean;
  exportFilename?: string;
  exportTable?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search records...',
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records to display right now.',
  emptyIcon = Inbox,
  onAddClick,
  addButtonLabel = 'Add New',
  isLoading = false,
  exportFilename = 'records',
  exportTable,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');

  const filteredData = React.useMemo(() => {
    if (!searchKey || !search.trim()) return data;
    const lower = search.toLowerCase();
    return data.filter((item) => {
      const val = item[searchKey];
      return val ? String(val).toLowerCase().includes(lower) : false;
    });
  }, [data, searchKey, search]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
      {/* Table Action Bar */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500/30 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ExportDropdown filename={exportFilename} table={exportTable} />
          {onAddClick && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-md shadow-violet-500/20 cursor-pointer"
            >
              <span>+</span>
              <span>{addButtonLabel}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : filteredData.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={
              search
                ? `No records matching "${search}". Try searching for something else.`
                : emptyDescription
            }
            actionLabel={onAddClick ? addButtonLabel : undefined}
            onAction={onAddClick}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                {columns.map((col, idx) => (
                  <th key={idx} className={`py-3 px-4 sm:px-6 ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredData.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: index * 0.03 }}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {columns.map((col, idx) => (
                    <td key={idx} className={`py-3.5 px-4 sm:px-6 ${col.className || ''}`}>
                      {col.cell
                        ? col.cell(row)
                        : col.accessorKey
                        ? String(row[col.accessorKey] ?? '—')
                        : '—'}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

