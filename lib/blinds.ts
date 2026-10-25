import { BlindLevel, GameState, Heat } from './types';

export const LEVEL_DURATION_SECONDS = 7 * 60; // 7 minutes = 420s

export const BLIND_LEVELS: BlindLevel[] = [
  { level: 1, smallBlind: 1, bigBlind: 2, durationSeconds: LEVEL_DURATION_SECONDS },
  { level: 2, smallBlind: 2, bigBlind: 4, durationSeconds: LEVEL_DURATION_SECONDS },
  { level: 3, smallBlind: 4, bigBlind: 8, durationSeconds: LEVEL_DURATION_SECONDS },
  { level: 4, smallBlind: 8, bigBlind: 16, durationSeconds: LEVEL_DURATION_SECONDS },
  { level: 5, smallBlind: 15, bigBlind: 30, durationSeconds: LEVEL_DURATION_SECONDS },
  { level: 6, smallBlind: 30, bigBlind: 60, durationSeconds: LEVEL_DURATION_SECONDS },
  { level: 7, smallBlind: 50, bigBlind: 100, durationSeconds: LEVEL_DURATION_SECONDS },
  { level: 8, smallBlind: 100, bigBlind: 200, durationSeconds: LEVEL_DURATION_SECONDS },
  { level: 9, smallBlind: 200, bigBlind: 400, durationSeconds: LEVEL_DURATION_SECONDS },
  { level: 10, smallBlind: 400, bigBlind: 800, durationSeconds: LEVEL_DURATION_SECONDS },
  { level: 11, smallBlind: 800, bigBlind: 1600, durationSeconds: LEVEL_DURATION_SECONDS },
];

/**
 * Calculates current remaining seconds in level accurately using client-side high-resolution time
 * and authoritative server start timestamp.
 */
export function calculateRemainingSeconds(heat: Heat): number {
  if (heat.status === 'paused' || heat.status === 'waiting') {
    return Math.max(0, heat.remainingSecondsAtPause);
  }

  if (heat.status === 'finished') {
    return 0;
  }

  if (!heat.levelStartedAt) {
    return heat.remainingSecondsAtPause;
  }

  const elapsedSinceStart = (Date.now() - heat.levelStartedAt) / 1000;
  const remaining = heat.remainingSecondsAtPause - elapsedSinceStart;
  return Math.max(0, Math.floor(remaining));
}

export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function formatChips(amount: number): string {
  if (amount >= 1000) {
    const k = amount / 1000;
    return Number.isInteger(k) ? `${k}K` : `${k.toFixed(1)}K`;
  }
  return amount.toLocaleString();
}

export function createInitialHeat(heatNumber = 1): Heat {
  return {
    id: `heat-${heatNumber}-${Date.now().toString(36)}`,
    heatNumber,
    name: `Heat #${heatNumber}`,
    status: 'waiting',
    currentLevelIndex: 0,
    levelStartedAt: null,
    remainingSecondsAtPause: LEVEL_DURATION_SECONDS,
    startedAt: null,
    finishedAt: null,
    players: [],
  };
}

export function createInitialGameState(): GameState {
  return {
    currentHeat: createInitialHeat(1),
    completedHeats: [],
    leaderboard: [],
    lastUpdated: Date.now(),
  };
}
