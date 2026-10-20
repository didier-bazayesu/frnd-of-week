import type { Participant } from '../types/participant';
import type { WeeklyMatches } from '../types/matching';
import { STORAGE_KEYS } from '../config/admin';
import { JSONBIN_CONFIG } from '../config/jsonbin';

export interface JsonBinConfig {
  binId: string;
  apiKey: string;
}

export interface CloudPayload {
  participants: Participant[];
  matches: WeeklyMatches | null;
  updatedAt: string;
}

const JSONBIN_CONFIG_KEY = 'fotw_jsonbin_config';

/**
 * Returns active JSONBin credentials from localStorage or fallback application Config.
 */
export function getJsonBinConfig(): JsonBinConfig | null {
  try {
    const saved = localStorage.getItem(JSONBIN_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as JsonBinConfig;
      if (parsed.binId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch {
    // Ignore parse error
  }

  // Fallback to application Config
  if (JSONBIN_CONFIG.binId && JSONBIN_CONFIG.apiKey) {
    return {
      binId: JSONBIN_CONFIG.binId,
      apiKey: JSONBIN_CONFIG.apiKey,
    };
  }

  return null;
}

/**
 * Saves JSONBin configuration to localStorage so admins can configure it directly in the UI.
 */
export function saveJsonBinConfig(config: JsonBinConfig): void {
  localStorage.setItem(JSONBIN_CONFIG_KEY, JSON.stringify(config));
}

/**
 * Removes custom JSONBin configuration from localStorage.
 */
export function clearJsonBinConfig(): void {
  localStorage.removeItem(JSONBIN_CONFIG_KEY);
}

/**
 * Pulls the latest participants and matches from JSONBin.
 */
export async function fetchCloudData(): Promise<CloudPayload | null> {
  const config = getJsonBinConfig();
  if (!config) return null;

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${config.binId}/latest`, {
      method: 'GET',
      headers: {
        'X-Master-Key': config.apiKey,
      },
    });

    if (!response.ok) {
      console.warn('JSONBin fetch returned status:', response.status);
      return null;
    }

    const json = (await response.json()) as { record: CloudPayload };
    return json.record ?? null;
  } catch (err) {
    console.error('Failed to fetch from JSONBin:', err);
    return null;
  }
}

/**
 * Synchronizes local state to JSONBin.
 */
export async function pushToCloud(
  participants: Participant[],
  matches: WeeklyMatches | null,
): Promise<boolean> {
  const config = getJsonBinConfig();
  if (!config) return false;

  const payload: CloudPayload = {
    participants,
    matches,
    updatedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${config.binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': config.apiKey,
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (err) {
    console.error('Failed to push to JSONBin:', err);
    return false;
  }
}

/**
 * Pulls cloud data and synchronizes it into local browser storage.
 * Returns true if successful and data was updated.
 */
export async function syncFromCloudToLocal(): Promise<boolean> {
  const cloudData = await fetchCloudData();
  if (!cloudData) return false;

  if (Array.isArray(cloudData.participants) && cloudData.participants.length > 0) {
    localStorage.setItem(STORAGE_KEYS.participants, JSON.stringify(cloudData.participants));
  }

  if (cloudData.matches) {
    localStorage.setItem(STORAGE_KEYS.weeklyMatches, JSON.stringify(cloudData.matches));
  }

  return true;
}
