import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Search, AlertCircle } from 'lucide-react';
import {
  validateParticipantForm,
  isFormValid,
  type ParticipantFormErrors,
} from '../utils/validation';

interface ParticipantFormProps {
  onSubmit: (firstName: string, lastName: string, phone: string) => void;
  isLoading?: boolean;
  globalError?: string;
}

export default function ParticipantForm({
  onSubmit,
  isLoading = false,
  globalError,
}: ParticipantFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<ParticipantFormErrors>({});
  const [touched, setTouched] = useState({ firstName: false, lastName: false, phone: false });

  function handleBlur(field: keyof typeof touched) {
    setTouched(prev => ({ ...prev, [field]: true }));
    const e = validateParticipantForm(firstName, lastName, phone);
    setErrors(e);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, phone: true });
    const e2 = validateParticipantForm(firstName, lastName, phone);
    setErrors(e2);
    if (!isFormValid(e2)) return;
    onSubmit(firstName, lastName, phone);
  }

  const fieldClass = (field: keyof ParticipantFormErrors) =>
    `w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-purple-400 ${
      touched[field] && errors[field]
        ? 'border-red-300 bg-red-50'
        : 'border-purple-200 bg-white/80 focus:border-purple-400'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* First Name */}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-purple-800 mb-1">
          First Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="e.g. Didier"
            value={firstName}
            onChange={e => { setFirstName(e.target.value); }}
            onBlur={() => handleBlur('firstName')}
            className={fieldClass('firstName')}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          />
        </div>
        {touched.firstName && errors.firstName && (
          <p id="firstName-error" role="alert" className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.firstName}
          </p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-purple-800 mb-1">
          Last Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="e.g. Bazayesu"
            value={lastName}
            onChange={e => { setLastName(e.target.value); }}
            onBlur={() => handleBlur('lastName')}
            className={fieldClass('lastName')}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
          />
        </div>
        {touched.lastName && errors.lastName && (
          <p id="lastName-error" role="alert" className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.lastName}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-purple-800 mb-1">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. 0790213746"
            value={phone}
            onChange={e => { setPhone(e.target.value); }}
            onBlur={() => handleBlur('phone')}
            className={fieldClass('phone')}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
        </div>
        {touched.phone && errors.phone && (
          <p id="phone-error" role="alert" className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.phone}
          </p>
        )}
      </div>

      {/* Global error */}
      {globalError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{globalError}</span>
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Search className="w-4 h-4" />
        {isLoading ? 'Searching…' : 'Discover My Friend'}
      </motion.button>
    </form>
  );
}
