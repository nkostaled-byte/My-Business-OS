import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, CreditCard, Package, CalendarDays, ReceiptText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export const FloatingActionButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { canAccess } = useData();

  const actions = [
    {
      label: 'New POS Sale',
      icon: CreditCard,
      color: 'bg-emerald-500 text-white',
      onClick: () => navigate('/app/pos'),
      minPlan: 'starter',
    },
    {
      label: 'Add Product',
      icon: Package,
      color: 'bg-blue-500 text-white',
      onClick: () => navigate('/app/products'),
      minPlan: 'starter',
    },
    {
      label: 'New Booking',
      icon: CalendarDays,
      color: 'bg-indigo-500 text-white',
      onClick: () => navigate('/app/bookings'),
      minPlan: 'free',
    },
    {
      label: 'Create Invoice',
      icon: ReceiptText,
      color: 'bg-amber-500 text-white',
      onClick: () => navigate('/app/invoices'),
      minPlan: 'business',
    },
  ].filter((act) => canAccess(act.minPlan));

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Backdrop when opened */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-2xs"
          />
        )}
      </AnimatePresence>

      {/* Speed Dial Menu items */}
      <div className="relative z-40 flex flex-col items-end gap-2.5 mb-3">
        <AnimatePresence>
          {isOpen &&
            actions.map((act, index) => {
              const Icon = act.icon;
              return (
                <motion.button
                  key={act.label}
                  initial={{ opacity: 0, scale: 0.8, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{
                    duration: 0.2,
                    delay: (actions.length - 1 - index) * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    act.onClick();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl glass-strong text-slate-800 dark:text-slate-100 text-xs font-semibold cursor-pointer group"
                >
                  <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {act.label}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-xl ${act.color} flex items-center justify-center shadow-xs shrink-0`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </motion.button>
              );
            })}
        </AnimatePresence>
      </div>

      {/* Main Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative z-40 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 cursor-pointer transition-colors ${
          isOpen
            ? 'bg-slate-800 dark:bg-slate-700'
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
        title="Quick Actions"
      >
        <motion.div
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </motion.button>
    </div>
  );
};
