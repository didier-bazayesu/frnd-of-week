export interface ParticipantFormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

/** Validates the participant search form. Returns an object with field-level error messages. */
export function validateParticipantForm(
  firstName: string,
  lastName: string,
  phone: string,
): ParticipantFormErrors {
  const errors: ParticipantFormErrors = {};

  if (!firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (!phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[0-9+\s]+$/.test(phone.trim())) {
    errors.phone = 'Phone number must contain only digits, spaces, or a leading +.';
  }

  return errors;
}

/** Returns true when the errors object has no entries. */
export function isFormValid(errors: ParticipantFormErrors): boolean {
  return Object.keys(errors).length === 0;
}

/** Normalises a name for case-insensitive, whitespace-tolerant comparison. */
export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase();
}
