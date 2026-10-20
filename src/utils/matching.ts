import type { Participant } from '../types/participant';
import type { MatchPair } from '../types/matching';

/**
 * Deterministic seeded Fisher-Yates shuffle.
 * Given the same array and seed it always returns the same order,
 * so weekly matches are stable across page reloads.
 */
function seededShuffle<T>(array: T[], seed: string): T[] {
  const arr = [...array];
  // Build a 32-bit integer hash from the seed string.
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }

  // LCG-based PRNG from the seed.
  let state = h >>> 0;
  function next(): number {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  }

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates reciprocal match pairs for the given participant list.
 *
 * - Even count  → simple pairs (A↔B, C↔D, …)
 * - Odd count   → pairs except the last three, which form a rotating trio
 *                 (A→B, B→C, C→A) so nobody is left without a friend.
 *
 * Throws if fewer than 2 participants are supplied or if a self-match
 * would occur (should never happen with a valid unique list).
 */
export function generateMatches(participants: Participant[], seed?: string): MatchPair[] {
  if (participants.length < 2) {
    throw new Error('At least 2 eligible participants are required to generate matches.');
  }

  const shuffleSeed = seed ?? (Date.now().toString() + '-' + Math.random().toString());
  const shuffled = seededShuffle(participants, shuffleSeed);
  const pairs: MatchPair[] = [];

  if (shuffled.length % 2 === 0) {
    // Even: clean pairwise
    for (let i = 0; i < shuffled.length; i += 2) {
      const a = shuffled[i];
      const b = shuffled[i + 1];
      pairs.push({ participantId: a.id, friendId: b.id });
      pairs.push({ participantId: b.id, friendId: a.id });
    }
  } else {
    // Odd: pair all but the last three, then form a trio.
    for (let i = 0; i < shuffled.length - 3; i += 2) {
      const a = shuffled[i];
      const b = shuffled[i + 1];
      pairs.push({ participantId: a.id, friendId: b.id });
      pairs.push({ participantId: b.id, friendId: a.id });
    }
    const a = shuffled[shuffled.length - 3];
    const b = shuffled[shuffled.length - 2];
    const c = shuffled[shuffled.length - 1];
    // Rotating: A → B → C → A
    pairs.push({ participantId: a.id, friendId: b.id });
    pairs.push({ participantId: b.id, friendId: c.id });
    pairs.push({ participantId: c.id, friendId: a.id });
  }

  // Validate: no self-matches
  for (const pair of pairs) {
    if (pair.participantId === pair.friendId) {
      throw new Error(`Self-match detected for participant ${pair.participantId}`);
    }
  }

  // Validate: every participant appears exactly once as the left-hand side
  const seen = new Set<string>();
  for (const pair of pairs) {
    if (seen.has(pair.participantId)) {
      throw new Error(`Duplicate entry for participant ${pair.participantId}`);
    }
    seen.add(pair.participantId);
  }

  return pairs;
}

/**
 * Picks a consistent friendship message index for a given participant + week.
 * Returns a number in [0, count).
 */
export function messageIndexForParticipant(participantId: string, weekId: string, count: number): number {
  const key = participantId + weekId;
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return Math.abs(h >>> 0) % count;
}
