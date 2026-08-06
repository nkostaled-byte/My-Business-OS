import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../common/Modal';
import { Booking } from '../../types';
import { CalendarPlus, User, Phone, Clock, Banknote, Scissors } from 'lucide-react';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({ isOpen, onClose }) => {
  const { createResource, services, staff } = useData();
  const { addToast } = useToast();

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [staffId, setStaffId] = useState('');
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('09:00');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);

  const selectedService = services.find((s) => s.id === serviceId);

  useEffect(() => {
    if (isOpen) {
      setClientName('');
      setClientPhone('');
      setServiceId('');
      setStaffId('');
      setDate(today);
      setTime('09:00');
      setAmount('');
      setSaving(false);
    }
  }, [isOpen, today]);

  const handleServiceChange = (id: string) => {
    setServiceId(id);
    const svc = services.find((s) => s.id === id);
    if (svc) setAmount(String(svc.price));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !date || !time) return;
    setSaving(true);

    const booking = await createResource<Partial<Booking>>('bookings', {
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim() || undefined,
      serviceName: selectedService?.name || 'General Appointment',
      staffName: staff.find((s) => s.id === staffId)?.name || undefined,
      date,
      time,
      status: 'upcoming',
      amount: parseFloat(amount) || 0,
    });

    setSaving(false);
    if (booking) {
      addToast('Booking created successfully', 'success');
      onClose();
    } else {
      addToast('Failed to create booking', 'error');
    }
  };

  const inputClass =
    'w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Booking"
      subtitle="Schedule an appointment for a client"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <User className="w-3.5 h-3.5" /> Client Name
          </label>
          <input
            type="text"
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="e.g. John Smith"
            className={inputClass}
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <Phone className="w-3.5 h-3.5" /> Client Phone
          </label>
          <input
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            placeholder="e.g. 081 234 5678"
            className={inputClass}
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <Scissors className="w-3.5 h-3.5" /> Service
          </label>
          <select
            value={serviceId}
            onChange={(e) => handleServiceChange(e.target.value)}
            className={inputClass}
          >
            <option value="">General Appointment</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — R{s.price}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <CalendarPlus className="w-3.5 h-3.5" /> Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <Clock className="w-3.5 h-3.5" /> Time
            </label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {staff.length > 0 && (
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <User className="w-3.5 h-3.5" /> Assign Staff
            </label>
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className={inputClass}
            >
              <option value="">Unassigned</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.role}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <Banknote className="w-3.5 h-3.5" /> Amount (ZAR)
          </label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={inputClass}
          />
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-slate-200/50 dark:border-white/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 cursor-pointer disabled:opacity-60"
          >
            {saving ? 'Creating...' : 'Create Booking'}
          </motion.button>
        </div>
      </form>
    </Modal>
  );
};