import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Product } from '../../types';
import { EmptyState } from '../common/EmptyState';
import { Package, TrendingUp } from 'lucide-react';

interface TopProductsListProps {
  products: Product[];
  currencyPrefix?: string;
}

export const TopProductsList: React.FC<TopProductsListProps> = ({
  products,
  currencyPrefix = 'R',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Top Products
        </h3>
        <NavLink
          to="/app/products"
          className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
        >
          View all
        </NavLink>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No product sales yet"
          description="Top selling products will be listed here after catalog sales."
          className="my-auto py-8"
        />
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 my-auto">
          {products.slice(0, 3).map((prod, index) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    prod.imageUrl ||
                    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=150&auto=format&fit=crop&q=80'
                  }
                  alt={prod.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {prod.name}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {prod.soldCount} sold
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 block">
                  {currencyPrefix}
                  {(prod.price * prod.soldCount).toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>Popular</span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

