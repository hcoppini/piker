import { NextRequest, NextResponse } from 'next/server';
import { GameState, Heat, LeaderboardEntry, Player } from '@/lib/types';
import { BLIND_LEVELS, LEVEL_DURATION_SECONDS, calculateRemainingSeconds, createInitialGameState, createInitialHeat } from '@/lib/blinds';

// Server-side in-memory state
// Note: In serverless environments, module scope persists across warm invocations.
let serverState: GameState = createInitialGameState();

// Optional Upstash Redis persistence if env vars are provided
async function saveToRemoteStore(state: GameState): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return;

  try {
    await fetch(`${url}/set/poker_game_state`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(state),
    });
  } catch (err) {
    console.error('Failed to save to Upstash Redis:', err);
  }
}

async function loadFromRemoteStore(): Promise<GameState | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  try {
    const res = await fetch(`${url}/get/poker_game_state`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const data = await res.json();
    if (data && data.result) {
      return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
    }
  } catch (err) {
    console.error('Failed to load from Upstash Redis:', err);
  }
  return null;
}

export async function GET() {
  const remote = await loadFromRemoteStore();
  if (remote && remote.lastUpdated > serverState.lastUpdated) {
    serverState = remote;
  }

  // Check if current running level has naturally expired
  if (serverState.currentHeat.status === 'running') {
    const rem = calculateRemainingSeconds(serverState.currentHeat);
    if (rem <= 0) {
      // Transition to next level automatically
      if (serverState.currentHeat.currentLevelIndex < BLIND_LEVELS.length - 1) {
        serverState.currentHeat.currentLevelIndex++;
        serverState.currentHeat.levelStartedAt = Date.now();
        serverState.currentHeat.remainingSecondsAtPause = LEVEL_DURATION_SECONDS;
      } else {
        serverState.currentHeat.status = 'finished';
        serverState.currentHeat.levelStartedAt = null;
        serverState.currentHeat.remainingSecondsAtPause = 0;
      }
      serverState.lastUpdated = Date.now();
      await saveToRemoteStore(serverState);
    }
  }

  return NextResponse.json(serverState, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, payload } = body;
    const now = Date.now();

    const heat = serverState.currentHeat;

    switch (action) {
      case 'START':
      case 'RESUME': {
        if (heat.status !== 'running') {
          heat.status = 'running';
          heat.levelStartedAt = now;
          if (!heat.startedAt) {
            heat.startedAt = now;
          }
        }
        break;
      }

      case 'PAUSE': {
        if (heat.status === 'running') {
          heat.remainingSecondsAtPause = calculateRemainingSeconds(heat);
          heat.status = 'paused';
          heat.levelStartedAt = null;
        }
        break;
      }

      case 'RESET_LEVEL': {
        heat.remainingSecondsAtPause = LEVEL_DURATION_SECONDS;
        if (heat.status === 'running') {
          heat.levelStartedAt = now;
        }
        break;
      }

      case 'NEXT_LEVEL': {
        if (heat.currentLevelIndex < BLIND_LEVELS.length - 1) {
          heat.currentLevelIndex++;
          heat.remainingSecondsAtPause = LEVEL_DURATION_SECONDS;
          if (heat.status === 'running') {
            heat.levelStartedAt = now;
          }
        }
        break;
      }

      case 'PREV_LEVEL': {
        if (heat.currentLevelIndex > 0) {
          heat.currentLevelIndex--;
          heat.remainingSecondsAtPause = LEVEL_DURATION_SECONDS;
          if (heat.status === 'running') {
            heat.levelStartedAt = now;
          }
        }
        break;
      }

      case 'ADJUST_TIME': {
        const delta = Number(payload?.deltaSeconds || 0);
        const currentRem = calculateRemainingSeconds(heat);
        const newRem = Math.max(5, currentRem + delta);
        heat.remainingSecondsAtPause = newRem;
        if (heat.status === 'running') {
          heat.levelStartedAt = now;
        }
        break;
      }

      case 'JOIN_PLAYER': {
        const name = (payload?.name || '').trim();
        if (name) {
          // Check if already in heat
          const existing = heat.players.find(
            (p) => p.name.toLowerCase() === name.toLowerCase()
          );
          if (!existing) {
            // Find next open seat 1-10
            const takenSeats = new Set(heat.players.map((p) => p.seat));
            let seat = payload?.seat || 1;
            while (takenSeats.has(seat) && seat <= 10) {
              seat++;
            }
            if (seat > 10) seat = heat.players.length + 1;

            const newPlayer: Player = {
              id: `p-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
              name,
              seat,
              status: 'active',
            };
            heat.players.push(newPlayer);
          }
        }
        break;
      }

      case 'REMOVE_PLAYER': {
        const playerId = payload?.playerId;
        heat.players = heat.players.filter((p) => p.id !== playerId);
        break;
      }

      case 'KNOCKOUT_PLAYER': {
        const playerId = payload?.playerId;
        const target = heat.players.find((p) => p.id === playerId);
        if (target && target.status === 'active') {
          // Count active players left
          const activeCount = heat.players.filter((p) => p.status === 'active').length;
          target.status = 'busted';
          target.bustedPosition = activeCount; // e.g. 5th place
          target.bustedAt = now;

          // If only 1 player remains active, they are automatically the champion!
          const remainingActive = heat.players.filter((p) => p.status === 'active');
          if (remainingActive.length === 1) {
            const winner = remainingActive[0];
            winner.bustedPosition = 1;
            heat.status = 'finished';
            heat.winnerName = winner.name;
            heat.runnerUpName = target.name;
            heat.finishedAt = now;
            updateLeaderboardOnHeatFinish(serverState, heat, winner.name, target.name);
          }
        }
        break;
      }

      case 'REVIVE_PLAYER': {
        const playerId = payload?.playerId;
        const target = heat.players.find((p) => p.id === playerId);
        if (target && target.status === 'busted') {
          target.status = 'active';
          target.bustedPosition = undefined;
          target.bustedAt = undefined;
        }
        break;
      }

      case 'FINISH_HEAT': {
        const winnerName = (payload?.winnerName || '').trim();
        const runnerUpName = (payload?.runnerUpName || '').trim();
        heat.status = 'finished';
        heat.winnerName = winnerName || heat.winnerName || 'Winner';
        heat.runnerUpName = runnerUpName || heat.runnerUpName;
        heat.finishedAt = now;
        updateLeaderboardOnHeatFinish(serverState, heat, heat.winnerName, heat.runnerUpName);
        break;
      }

      case 'NEW_HEAT': {
        // Archive current heat if not already archived
        if (heat.status === 'finished' && !serverState.completedHeats.find((h) => h.id === heat.id)) {
          serverState.completedHeats.push({ ...heat });
        }
        const nextNum = serverState.completedHeats.length + 1;
        serverState.currentHeat = createInitialHeat(nextNum);
        break;
      }

      case 'RESET_ALL': {
        serverState = createInitialGameState();
        break;
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }

    serverState.lastUpdated = now;
    await saveToRemoteStore(serverState);

    return NextResponse.json(serverState);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function updateLeaderboardOnHeatFinish(
  state: GameState,
  heat: Heat,
  winnerName?: string,
  runnerUpName?: string
) {
  if (!winnerName) return;

  // Add or update winner
  let winnerEntry = state.leaderboard.find(
    (e) => e.playerName.toLowerCase() === winnerName.toLowerCase()
  );
  if (!winnerEntry) {
    winnerEntry = {
      playerName: winnerName,
      totalHeatsPlayed: 1,
      wins: 1,
      runnerUps: 0,
      thirdPlaces: 0,
      knockouts: 0,
      lastPlayedAt: Date.now(),
    };
    state.leaderboard.push(winnerEntry);
  } else {
    winnerEntry.totalHeatsPlayed += 1;
    winnerEntry.wins += 1;
    winnerEntry.lastPlayedAt = Date.now();
  }

  // Add or update runner-up if present
  if (runnerUpName) {
    let runnerEntry = state.leaderboard.find(
      (e) => e.playerName.toLowerCase() === runnerUpName.toLowerCase()
    );
    if (!runnerEntry) {
      runnerEntry = {
        playerName: runnerUpName,
        totalHeatsPlayed: 1,
        wins: 0,
        runnerUps: 1,
        thirdPlaces: 0,
        knockouts: 0,
        lastPlayedAt: Date.now(),
      };
      state.leaderboard.push(runnerEntry);
    } else {
      runnerEntry.totalHeatsPlayed += 1;
      runnerEntry.runnerUps += 1;
      runnerEntry.lastPlayedAt = Date.now();
    }
  }

  // Update other players' totalHeatsPlayed
  heat.players.forEach((p) => {
    if (
      p.name.toLowerCase() !== winnerName.toLowerCase() &&
      (!runnerUpName || p.name.toLowerCase() !== runnerUpName.toLowerCase())
    ) {
      let entry = state.leaderboard.find((e) => e.playerName.toLowerCase() === p.name.toLowerCase());
      if (!entry) {
        entry = {
          playerName: p.name,
          totalHeatsPlayed: 1,
          wins: 0,
          runnerUps: 0,
          thirdPlaces: p.bustedPosition === 3 ? 1 : 0,
          knockouts: 0,
          lastPlayedAt: Date.now(),
        };
        state.leaderboard.push(entry);
      } else {
        entry.totalHeatsPlayed += 1;
        if (p.bustedPosition === 3) entry.thirdPlaces += 1;
        entry.lastPlayedAt = Date.now();
      }
    }
  });

  // Sort leaderboard: Wins descending, then Runner-ups descending, then Total heats played
  state.leaderboard.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.runnerUps !== a.runnerUps) return b.runnerUps - a.runnerUps;
    return b.totalHeatsPlayed - a.totalHeatsPlayed;
  });
}
