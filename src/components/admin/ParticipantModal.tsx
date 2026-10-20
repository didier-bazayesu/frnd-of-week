import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react';
import { isValidPhone } from '../../utils/phone';
import type { Participant } from '../../types/participant';

interface ParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    firstName: string;
    lastName: string;
    year: string;
    phone: string;
    adminNote?: string;
  }) => void;
  participant?: Participant | null;
}

const YEAR_OPTIONS = ['Y1', 'Y2', 'Y3', 'Btech'];

export default function ParticipantModal({
  isOpen,
  onClose,
  onSave,
  participant,
}: ParticipantModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [year, setYear] = useState('Y1');
  const [phone, setPhone] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [error, setError] = useState('');

  const isEditing = Boolean(participant);

  useEffect(() => {
    if (participant) {
      setFirstName(participant.firstName);
      setLastName(participant.lastName);
      setYear(participant.year || 'Y1');
      setPhone(participant.phone || '');
      setAdminNote(participant.adminNote || '');
    } else {
      setFirstName('');
      setLastName('');
      setYear('Y1');
      setPhone('');
      setAdminNote('');
    }
    setError('');
  }, [participant, isOpen]);

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('First name is required.');
      return;
    }
    if (!lastName.trim()) {
      setError('Last name is required.');
      return;
    }
    if (!phone.trim()) {
      setError('Phone number is required.');
      return;
    }

    onSave({
      id: participant?.id,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      year: year.trim(),
      phone: phone.trim(),
      adminNote: adminNote.trim() || undefined,
    });
    onClose();
  }

  const phoneValid = isValidPhone(phone);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl shadow-2xl border border-purple-100 w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-700 to-pink-600 px-6 py-4 flex items-center justify-between text-white">
            <h3 className="font-bold text-lg">
              {isEditing ? 'Edit Participant Details' : 'Add New Participant'}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-purple-900 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="e.g. Didier"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-900 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="e.g. Bazayesu"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-900 mb-1">
                Academic Year
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <select
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                >
                  {YEAR_OPTIONS.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-purple-900">
                  Phone Number
                </label>
                {phone && (
                  <span
                    className={`text-[10px] flex items-center gap-1 ${
                      phoneValid ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {phoneValid ? (
                      <>
                        <CheckCircle className="w-3 h-3" /> Valid Rwanda number
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" /> Needs 07XXXXXXXX format
                      </>
                    )}
                  </span>
                )}
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. 0790213746 or +250790213746"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-purple-900 mb-1">
                Admin Note (Optional)
              </label>
              <input
                type="text"
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
                placeholder="Optional notes or data issues..."
                className="w-full px-3 py-2 rounded-xl border border-purple-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-xl transition-all shadow-sm"
              >
                {isEditing ? 'Save Changes' : 'Add Participant'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
