/**
 * Returns the ISO 8601 week identifier for the current date, e.g. "2024-W42".
 *
 * Weeks start on Monday per ISO 8601. The identifier is stable throughout an
 * entire week, so it can be used as the localStorage key for weekly matches.
 */
export function getCurrentWeekId(): string {
  const now = new Date();
  // Work in UTC to ensure consistency across timezones.
  const utc = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  // ISO week: shift Sunday (0) to 7 so Monday is 1.
  const dayOfWeek = utc.getUTCDay() || 7;
  // Nearest Thursday (used by ISO 8601 to determine the year).
  utc.setUTCDate(utc.getUTCDate() + 4 - dayOfWeek);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${utc.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}
