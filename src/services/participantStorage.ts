import { participants as hardcoded } from '../data/participants';
import type { Participant, IncompleteReason } from '../types/participant';
import { STORAGE_KEYS } from '../config/admin';
import { normalizeName } from '../utils/validation';
import { phonesMatch, isValidPhone } from '../utils/phone';

/**
 * Returns the active participant list.
 * Falls back to the hardcoded list when no stored data exists in localStorage.
 */
export function getParticipants(): Participant[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.participants);
    if (stored) {
      const parsed = JSON.parse(stored) as Participant[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // Silently fall back to hardcoded data on parse errors.
  }
  return hardcoded;
}

/** Persists the participant list to localStorage. */
export function saveParticipants(list: Participant[]): void {
  localStorage.setItem(STORAGE_KEYS.participants, JSON.stringify(list));
}

/** Removes custom stored list, reverting to the built-in participant data. */
export function clearImportedParticipants(): void {
  localStorage.removeItem(STORAGE_KEYS.participants);
}

/** Returns true when the app is using custom stored data rather than the built-in data. */
export function isUsingImportedData(): boolean {
  return localStorage.getItem(STORAGE_KEYS.participants) !== null;
}

/**
 * Validates a participant's phone number and returns the appropriate incomplete flags.
 */
function evaluateIncomplete(phone: string): {
  incomplete: boolean;
  incompleteReasons?: IncompleteReason[];
} {
  const trimmed = phone.trim();
  const reasons: IncompleteReason[] = [];
  if (!trimmed) {
    reasons.push('missing_phone');
  } else if (!isValidPhone(trimmed)) {
    reasons.push('invalid_phone');
  }

  return reasons.length > 0
    ? { incomplete: true, incompleteReasons: reasons }
    : { incomplete: false, incompleteReasons: [] };
}

/**
 * Adds a new participant to the list and saves to storage.
 */
export function addParticipant(data: {
  firstName: string;
  lastName: string;
  year: string;
  phone: string;
  adminNote?: string;
}): Participant {
  const current = getParticipants();
  const newId = `p${Date.now()}`;
  const status = evaluateIncomplete(data.phone);

  const newParticipant: Participant = {
    id: newId,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    year: data.year.trim(),
    phone: data.phone.trim(),
    adminNote: data.adminNote?.trim() || undefined,
    ...status,
  };

  const updated = [newParticipant, ...current];
  saveParticipants(updated);
  return newParticipant;
}

/**
 * Updates an existing participant's information and persists changes.
 */
export function updateParticipant(
  id: string,
  updates: Partial<Omit<Participant, 'id'>>,
): Participant | null {
  const current = getParticipants();
  const index = current.findIndex(p => p.id === id);
  if (index === -1) return null;

  const target = current[index];
  const mergedPhone = updates.phone !== undefined ? updates.phone.trim() : target.phone;
  const status = evaluateIncomplete(mergedPhone);

  const updatedParticipant: Participant = {
    ...target,
    ...updates,
    firstName: updates.firstName !== undefined ? updates.firstName.trim() : target.firstName,
    lastName: updates.lastName !== undefined ? updates.lastName.trim() : target.lastName,
    year: updates.year !== undefined ? updates.year.trim() : target.year,
    phone: mergedPhone,
    adminNote:
      updates.adminNote !== undefined
        ? updates.adminNote.trim() || undefined
        : target.adminNote,
    ...status,
  };

  // If phone is now valid, clear any stale admin note about incomplete phone
  if (!updatedParticipant.incomplete && updatedParticipant.adminNote?.toLowerCase().includes('phone')) {
    delete updatedParticipant.adminNote;
  }

  const updatedList = [...current];
  updatedList[index] = updatedParticipant;
  saveParticipants(updatedList);
  return updatedParticipant;
}

/**
 * Finds a participant by full name (case-insensitive, whitespace-tolerant) and phone number.
 * Returns undefined when no match is found or when name and phone do not agree.
 */
export function findParticipant(
  firstName: string,
  lastName: string,
  phone: string,
): Participant | undefined {
  const fn = normalizeName(firstName);
  const ln = normalizeName(lastName);

  return getParticipants().find(
    (p) =>
      normalizeName(p.firstName) === fn &&
      normalizeName(p.lastName) === ln &&
      phonesMatch(p.phone, phone),
  );
}
