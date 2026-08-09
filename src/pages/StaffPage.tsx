import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { StaffMember } from '../types';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { UserRoundCog, Plus, Mail, Phone, Edit3, Trash2, Briefcase } from 'lucide-react';

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const StaffPage: React.FC = () => {
  const { staff, addStaff, updateResource, deleteResource, isLoading } = useData();
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialtiesStr, setSpecialtiesStr] = useState('');

  const resetForm = () => {
    setName('');
    setRole('');
    setEmail('');
    setPhone('');
    setSpecialtiesStr('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    resetForm();
  };

  const openAddModal = () => {
    setEditingMember(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (member: StaffMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role || '');
    setEmail(member.email || '');
    setPhone(member.phone || '');
    setSpecialtiesStr((member.specialties || []).join(', '));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const payload = {
      name,
      role,
      email,
      phone,
      specialties: specialtiesStr ? specialtiesStr.split(',').map((s) => s.trim()).filter(Boolean) : ['General'],
    };

    if (editingMember) {
      const success = await updateResource('staff', editingMember.id, payload as Partial<StaffMember>);
      if (success) {
        addToast({ title: 'Staff Updated', message: `${name}'s profile has been updated.`, type: 'success' });
      } else {
        addToast({ title: 'Update Failed', message: 'Could not update the staff member.', type: 'error' });
      }
    } else {
      const result = await addStaff(payload);
      if (result) {
        addToast({ title: 'Staff Added', message: `${name} is now on your team.`, type: 'success' });
      } else {
        addToast({ title: 'Failed to Add Staff', message: 'Could not save the staff member.', type: 'error' });
      }
    }
    closeModal();
  };

  const handleDelete = async (member: StaffMember) => {
    if (deleting === member.id) return;
    setDeleting(member.id);
    const success = await deleteResource('staff', member.id);
    if (success) {
      addToast({ title: 'Staff Removed', message: `${member.name} has been removed from the team.`, type: 'success' });
    } else {
      addToast({ title: 'Delete Failed', message: 'Could not delete the staff member.', type: 'error' });
    }
    setDeleting(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Team & Staff Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Barbers, stylists, technicians, and salon staff profiles.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-52 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
      ) : staff.length === 0 ? (
        <div className="glass-panel rounded-2xl p-6">
          <EmptyState
            icon={UserRoundCog}
            title="No staff members listed"
            description="Add your team members to enable staff assignment for client bookings."
            actionLabel="Add Staff Member"
            onAction={openAddModal}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <div
              key={member.id}
              className="p-5 rounded-2xl glass-panel space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold text-sm flex items-center justify-center">
                    {getInitials(member.name)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {member.name}
                    </h3>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {member.role || 'Team Member'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                    {member.active === false ? 'Inactive' : 'Active'}
                  </span>
                  <div className="flex gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditModal(member)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors cursor-pointer"
                      title="Edit staff member"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(member)}
                      disabled={deleting === member.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer disabled:opacity-50"
                      title="Delete staff member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {(member.email || member.phone) && (
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                  {member.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {(member.specialties || []).length > 0 && (
                <div className="pt-3 border-t border-slate-200/50 dark:border-white/5 flex flex-wrap gap-1.5">
                  {(member.specialties || []).map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingMember ? 'Edit Staff Member' : 'Add Staff Member'}
        subtitle={editingMember ? `Update ${editingMember.name}` : 'Create a new team member profile'}
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
              placeholder="e.g. David Khumalo"
              className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Job Title / Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Master Barber"
              className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="david@grafixos.com"
                className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+27 81 222 3344"
                className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Specialties (comma separated)
            </label>
            <input
              type="text"
              value={specialtiesStr}
              onChange={(e) => setSpecialtiesStr(e.target.value)}
              placeholder="Beard Sculpting, Fades, Hot Towel"
              className="w-full px-3.5 py-2 rounded-xl glass-subtle text-xs sm:text-sm text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-200/50 dark:border-white/5">
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
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              {editingMember ? 'Save Changes' : 'Save Staff Member'}
            </motion.button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
