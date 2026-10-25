export interface BlindLevel {
  level: number;
  smallBlind: number;
  bigBlind: number;
  durationSeconds: number; // typically 420 (7 minutes)
}

export type PlayerStatus = 'active' | 'busted';

export interface Player {
  id: string;
  name: string;
  seat: number;
  status: PlayerStatus;
  bustedPosition?: number; // e.g. 8th, 7th, 6th... 2nd
  bustedAt?: number;
}

export type HeatStatus = 'waiting' | 'running' | 'paused' | 'finished';

export interface Heat {
  id: string;
  heatNumber: number;
  name: string;
  status: HeatStatus;
  currentLevelIndex: number;
  levelStartedAt: number | null; // epoch timestamp when current level unpaused
  remainingSecondsAtPause: number; // remaining seconds in the level
  startedAt: number | null;
  finishedAt: number | null;
  players: Player[];
  winnerName?: string;
  runnerUpName?: string;
}

export interface LeaderboardEntry {
  playerName: string;
  totalHeatsPlayed: number;
  wins: number; // Primary ranking metric
  runnerUps: number; // Secondary tie-breaker
  thirdPlaces: number;
  knockouts: number;
  lastPlayedAt: number;
}

export interface GameState {
  currentHeat: Heat;
  completedHeats: Heat[];
  leaderboard: LeaderboardEntry[];
  lastUpdated: number;
}
