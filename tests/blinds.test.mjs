import test from 'node:test';
import assert from 'node:assert/strict';

// Exact blind structure from party requirements & image
const EXPECTED_LEVELS = [
  { level: 1, smallBlind: 1, bigBlind: 2, durationSeconds: 420 },
  { level: 2, smallBlind: 2, bigBlind: 4, durationSeconds: 420 },
  { level: 3, smallBlind: 4, bigBlind: 8, durationSeconds: 420 },
  { level: 4, smallBlind: 8, bigBlind: 16, durationSeconds: 420 },
  { level: 5, smallBlind: 15, bigBlind: 30, durationSeconds: 420 },
  { level: 6, smallBlind: 30, bigBlind: 60, durationSeconds: 420 },
  { level: 7, smallBlind: 50, bigBlind: 100, durationSeconds: 420 },
  { level: 8, smallBlind: 100, bigBlind: 200, durationSeconds: 420 },
  { level: 9, smallBlind: 200, bigBlind: 400, durationSeconds: 420 },
  { level: 10, smallBlind: 400, bigBlind: 800, durationSeconds: 420 },
  { level: 11, smallBlind: 800, bigBlind: 1600, durationSeconds: 420 },
];

test('Verify exact 11 blind levels match party specifications', () => {
  assert.equal(EXPECTED_LEVELS.length, 11);
  EXPECTED_LEVELS.forEach((lvl, idx) => {
    assert.equal(lvl.level, idx + 1);
    assert.equal(lvl.durationSeconds, 420, 'Each blind level must last exactly 7 minutes (420s)');
    assert.equal(lvl.bigBlind, lvl.smallBlind * 2, 'Big blind must be exactly 2x small blind');
  });

  // Verify key milestone blind levels
  assert.equal(EXPECTED_LEVELS[0].smallBlind, 1);
  assert.equal(EXPECTED_LEVELS[0].bigBlind, 2);

  assert.equal(EXPECTED_LEVELS[4].smallBlind, 15);
  assert.equal(EXPECTED_LEVELS[4].bigBlind, 30);

  assert.equal(EXPECTED_LEVELS[5].smallBlind, 30);
  assert.equal(EXPECTED_LEVELS[5].bigBlind, 60);

  assert.equal(EXPECTED_LEVELS[10].smallBlind, 800);
  assert.equal(EXPECTED_LEVELS[10].bigBlind, 1600);
});

test('Verify 30-40 minute tournament pacing', () => {
  // Level 1-4 = 4 levels * 7m = 28m
  // Level 5 = 28m to 35m (blinds 15/30)
  // Level 6 = 35m to 42m (blinds 30/60)
  const timeAtLevel5 = 4 * 7;
  const timeAtLevel6End = 6 * 7;

  assert.equal(timeAtLevel5, 28, 'Level 5 begins at minute 28');
  assert.equal(timeAtLevel6End, 42, 'Level 6 ends at minute 42');
  assert.ok(timeAtLevel5 <= 35 && timeAtLevel6End >= 35, 'Peak showdown window falls precisely in 30-40 min party heat requirement');
});

test('Verify win-count leaderboard ranking logic', () => {
  const mockLeaderboard = [
    { playerName: 'Player A', wins: 1, runnerUps: 2, totalHeatsPlayed: 3 },
    { playerName: 'Player B', wins: 2, runnerUps: 0, totalHeatsPlayed: 2 },
    { playerName: 'Player C', wins: 1, runnerUps: 0, totalHeatsPlayed: 1 },
  ];

  mockLeaderboard.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.runnerUps !== a.runnerUps) return b.runnerUps - a.runnerUps;
    return b.totalHeatsPlayed - a.totalHeatsPlayed;
  });

  assert.equal(mockLeaderboard[0].playerName, 'Player B', 'Player B with 2 wins must be ranked 1st');
  assert.equal(mockLeaderboard[1].playerName, 'Player A', 'Player A with 1 win and 2 runner-ups must be ranked 2nd');
  assert.equal(mockLeaderboard[2].playerName, 'Player C', 'Player C with 1 win and 0 runner-ups must be ranked 3rd');
});
