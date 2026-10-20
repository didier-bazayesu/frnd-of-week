/**
 * Normalises a Rwanda phone number to the canonical 10-digit form: 07XXXXXXXX.
 *
 * Supported input formats:
 *   07XXXXXXXX         → 07XXXXXXXX   (already canonical)
 *   +2507XXXXXXXX      → 07XXXXXXXX
 *   2507XXXXXXXX       → 07XXXXXXXX
 */
export function normalizePhone(raw: string): string {
  const cleaned = raw.replace(/\s+/g, '');
  if (cleaned.startsWith('+250')) {
    return '0' + cleaned.slice(4);
  }
  if (cleaned.startsWith('250') && cleaned.length === 12) {
    return '0' + cleaned.slice(3);
  }
  return cleaned;
}

/** Returns true when the phone normalises to a valid Rwanda mobile number (07XXXXXXXX). */
export function isValidPhone(raw: string): boolean {
  return /^07\d{8}$/.test(normalizePhone(raw));
}

/** Returns true when two phone strings refer to the same number after normalisation. */
export function phonesMatch(a: string, b: string): boolean {
  if (!a || !b) return false;
  return normalizePhone(a) === normalizePhone(b);
}
