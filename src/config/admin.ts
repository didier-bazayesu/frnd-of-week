/**
 * DEMO CREDENTIALS ONLY.
 *
 * These values are stored in plain text in the compiled JavaScript bundle and
 * are visible to anyone who inspects the page source or network requests.
 * This is NOT secure authentication. Do not store real credentials here.
 */
export const ADMIN_CONFIG = {
  email: 'didierbazayesu@gmail.com',
  password: 'didier123',
} as const;

export const STORAGE_KEYS = {
  adminSession: 'fotw_admin_session',
  participants: 'fotw_participants',
  weeklyMatches: 'fotw_weekly_matches',
} as const;
