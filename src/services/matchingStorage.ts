import type { WeeklyMatches, MatchPair } from '../types/matching';
import type { Participant } from '../types/participant';
import { STORAGE_KEYS } from '../config/admin';
import { getCurrentWeekId } from '../utils/week';
import { generateMatches } from '../utils/matching';

/** Loads the persisted weekly matches from localStorage, or null when none exist. */
export function getWeeklyMatches(): WeeklyMatches | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.weeklyMatches);
    if (stored) return JSON.parse(stored) as WeeklyMatches;
  } catch {
    // Ignore malformed data.
  }
  return null;
}

/** Persists a new set of weekly matches. */
export function saveWeeklyMatches(weekId: string, pairs: MatchPair[]): WeeklyMatches {
  const data: WeeklyMatches = { weekId, pairs, generatedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEYS.weeklyMatches, JSON.stringify(data));
  return data;
}

/** Removes all stored weekly matches. */
export function clearWeeklyMatches(): void {
  localStorage.removeItem(STORAGE_KEYS.weeklyMatches);
}

/**
 * Returns the ID of the matched friend for a given participant, or null when
 * no match is found.
 */
export function getMatchForParticipant(participantId: string): string | null {
  const matches = getWeeklyMatches();
  if (!matches) return null;
  return matches.pairs.find(p => p.participantId === participantId)?.friendId ?? null;
}

/**
 * Ensures valid weekly matches exist for the current week.
 *
 * - Returns existing matches when the week has not changed.
 * - Generates and persists new matches when a new week begins or no matches exist.
 * - Throws when fewer than 2 eligible participants are available.
 */
export function ensureMatchesForCurrentWeek(eligibleParticipants: Participant[]): WeeklyMatches {
  const weekId = getCurrentWeekId();
  const existing = getWeeklyMatches();

  if (existing && existing.weekId === weekId) {
    return existing;
  }

  const pairs = generateMatches(eligibleParticipants, weekId);
  return saveWeeklyMatches(weekId, pairs);
}
