'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Heat, BlindLevel } from '@/lib/types';
import { BLIND_LEVELS, calculateRemainingSeconds, createInitialGameState } from '@/lib/blinds';
import { sounds } from '@/lib/sound';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [remainingSeconds, setRemainingSeconds] = useState<number>(BLIND_LEVELS[0].durationSeconds);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const prevLevelRef = useRef<number>(0);
  const warnedOneMinRef = useRef<boolean>(false);
  const prevStatusRef = useRef<string>('waiting');

  // Fetch latest state from API
  const refreshState = useCallback(async () => {
    try {
      const res = await fetch('/api/state', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: GameState = await res.json();
      setGameState(data);

      // Check audio cues on state change
      const currentLvl = data.currentHeat.currentLevelIndex;
      if (currentLvl > prevLevelRef.current && data.currentHeat.status === 'running') {
        sounds.playLevelUp();
        warnedOneMinRef.current = false;
      }
      prevLevelRef.current = currentLvl;

      if (data.currentHeat.status === 'finished' && prevStatusRef.current !== 'finished') {
        sounds.playVictory();
      }
      prevStatusRef.current = data.currentHeat.status;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch state';
      setError(msg);
    }
  }, []);

  // Post action to API
  const sendAction = useCallback(
    async (action: string, payload?: Record<string, unknown>) => {
      try {
        sounds.playClick();
        const res = await fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, payload }),
        });
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const updated: GameState = await res.json();
        setGameState(updated);
        return updated;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Action failed';
        setError(msg);
        return null;
      }
    },
    []
  );

  // Poll state every 1.5 seconds
  useEffect(() => {
    refreshState();
    const interval = setInterval(refreshState, 1500);
    return () => clearInterval(interval);
  }, [refreshState]);

  // High-precision local countdown timer (runs every 200ms)
  useEffect(() => {
    const tick = () => {
      const rem = calculateRemainingSeconds(gameState.currentHeat);
      setRemainingSeconds(rem);

      // 1-minute warning check
      if (gameState.currentHeat.status === 'running') {
        if (rem <= 60 && rem > 55 && !warnedOneMinRef.current) {
          sounds.playWarning();
          warnedOneMinRef.current = true;
        } else if (rem > 60) {
          warnedOneMinRef.current = false;
        }
      }
    };

    tick();
    const timerId = setInterval(tick, 200);
    return () => clearInterval(timerId);
  }, [gameState.currentHeat]);

  const toggleMute = () => {
    const isMuted = sounds.toggleMute();
    setIsAudioMuted(isMuted);
  };

  const currentLevel: BlindLevel =
    BLIND_LEVELS[gameState.currentHeat.currentLevelIndex] || BLIND_LEVELS[0];
  const nextLevel: BlindLevel | null =
    BLIND_LEVELS[gameState.currentHeat.currentLevelIndex + 1] || null;

  return {
    gameState,
    currentHeat: gameState.currentHeat,
    completedHeats: gameState.completedHeats,
    leaderboard: gameState.leaderboard,
    currentLevel,
    nextLevel,
    remainingSeconds,
    isAudioMuted,
    error,
    toggleMute,
    // Actions
    startTimer: () => sendAction('START'),
    pauseTimer: () => sendAction('PAUSE'),
    resumeTimer: () => sendAction('RESUME'),
    resetLevel: () => sendAction('RESET_LEVEL'),
    nextLevelAction: () => sendAction('NEXT_LEVEL'),
    prevLevelAction: () => sendAction('PREV_LEVEL'),
    adjustTime: (deltaSeconds: number) => sendAction('ADJUST_TIME', { deltaSeconds }),
    joinPlayer: (name: string, seat?: number) => sendAction('JOIN_PLAYER', { name, seat }),
    removePlayer: (playerId: string) => sendAction('REMOVE_PLAYER', { playerId }),
    knockoutPlayer: (playerId: string) => sendAction('KNOCKOUT_PLAYER', { playerId }),
    revivePlayer: (playerId: string) => sendAction('REVIVE_PLAYER', { playerId }),
    finishHeat: (winnerName: string, runnerUpName?: string) =>
      sendAction('FINISH_HEAT', { winnerName, runnerUpName }),
    startNewHeat: () => sendAction('NEW_HEAT'),
    resetAll: () => sendAction('RESET_ALL'),
    refreshState,
  };
}
