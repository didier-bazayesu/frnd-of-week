import { participants as hardcoded } from '../data/participants';
import type { Participant } from '../types/participant';
import { STORAGE_KEYS } from '../config/admin';
import { normalizeName } from '../utils/validation';
import { phonesMatch } from '../utils/phone';

/**
 * Returns the active participant list.
 * Falls back to the hardcoded list when no imported data exists in localStorage.
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

/** Persists an imported participant list to localStorage. */
export function saveParticipants(list: Participant[]): void {
  localStorage.setItem(STORAGE_KEYS.participants, JSON.stringify(list));
}

/** Removes the imported list, reverting to the hardcoded participant data. */
export function clearImportedParticipants(): void {
  localStorage.removeItem(STORAGE_KEYS.participants);
}

/** Returns true when the app is using an admin-imported list rather than the built-in data. */
export function isUsingImportedData(): boolean {
  return localStorage.getItem(STORAGE_KEYS.participants) !== null;
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
