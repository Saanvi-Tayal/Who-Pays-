import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createReactionState,
  playerPressPad,
  playerReleasePad,
  tickReactionWait,
} from '../reactionEngine.ts';
import type { PlayerSlotReference } from '../reactionEngine.ts';

const mockPlayers: PlayerSlotReference[] = [
  { id: 'p1', name: 'Gravit' },
  { id: 'p2', name: 'Saanvi' },
  { id: 'p3', name: 'Aman' },
  { id: 'p4', name: 'Priya' },
];
const playerIds = mockPlayers.map((p) => p.id);

test('createReactionState initializes all players in ready phase', () => {
  const state = createReactionState(mockPlayers, 3000);
  assert.strictEqual(state.phase, 'ready');
  assert.strictEqual(state.signalDelayMs, 3000);
  assert.strictEqual(state.loserSlotId, null);
  assert.strictEqual(Object.keys(state.players).length, 4);
  assert.strictEqual(state.players['p1'].holding, false);
});

test('transitions from ready to waiting only when ALL players hold pad', () => {
  let state = createReactionState(mockPlayers, 2500);

  // First 3 players press
  state = playerPressPad(state, 'p1', playerIds);
  state = playerPressPad(state, 'p2', playerIds);
  state = playerPressPad(state, 'p3', playerIds);
  assert.strictEqual(state.phase, 'ready');

  // 4th player presses
  state = playerPressPad(state, 'p4', playerIds);
  assert.strictEqual(state.phase, 'waiting');
  assert.strictEqual(state.players['p4'].holding, true);
});

test('triggers FALSE START immediately if player lifts in waiting phase', () => {
  let state = createReactionState(mockPlayers, 3000);
  playerIds.forEach((id) => {
    state = playerPressPad(state, id, playerIds);
  });
  assert.strictEqual(state.phase, 'waiting');

  // p2 twitches and releases before signal!
  state = playerReleasePad(state, 'p2', 1000, playerIds);
  assert.strictEqual(state.phase, 'false_start');
  assert.strictEqual(state.loserSlotId, 'p2');
  assert.strictEqual(state.falseStartSlotId, 'p2');
  assert.strictEqual(state.players['p2'].isFalseStart, true);
  assert.deepStrictEqual(state.winnerSlotIds, ['p1', 'p3', 'p4']);
});

test('flashes signal when wait duration elapsed and determines slowest loser', () => {
  let state = createReactionState(mockPlayers, 2000);
  playerIds.forEach((id) => {
    state = playerPressPad(state, id, playerIds);
  });
  assert.strictEqual(state.phase, 'waiting');

  // Tick 1000ms -> still waiting
  state = tickReactionWait(state, 1000, playerIds, 1000);
  assert.strictEqual(state.phase, 'waiting');

  // Tick another 1000ms -> flashes!
  const flashTimestamp = 2000;
  state = tickReactionWait(state, 1000, playerIds, flashTimestamp);
  assert.strictEqual(state.phase, 'flashed');
  assert.strictEqual(state.signalTimestamp, flashTimestamp);

  // Players release with different reaction times:
  // p2 reacts in 180ms
  state = playerReleasePad(state, 'p2', flashTimestamp + 180, playerIds);
  assert.strictEqual(state.phase, 'flashed'); // not all released yet

  // p3 reacts in 220ms
  state = playerReleasePad(state, 'p3', flashTimestamp + 220, playerIds);

  // p4 reacts in 250ms
  state = playerReleasePad(state, 'p4', flashTimestamp + 250, playerIds);

  // p1 (Gravit) is slowest: reacts in 410ms
  state = playerReleasePad(state, 'p1', flashTimestamp + 410, playerIds);

  // All released -> finished!
  assert.strictEqual(state.phase, 'finished');
  assert.strictEqual(state.fastestSlotId, 'p2');
  assert.strictEqual(state.slowestSlotId, 'p1');
  assert.strictEqual(state.loserSlotId, 'p1');
  assert.strictEqual(state.players['p1'].reactionTimeMs, 410);
  assert.strictEqual(state.players['p2'].reactionTimeMs, 180);
});

test('handles timeout during flashed phase when player fails to release', () => {
  let state = createReactionState(mockPlayers, 2000);
  playerIds.forEach((id) => {
    state = playerPressPad(state, id, playerIds);
  });
  const flashTimestamp = 2000;
  state = tickReactionWait(state, 2000, playerIds, flashTimestamp);
  assert.strictEqual(state.phase, 'flashed');

  // p1, p2, p3 release quickly
  state = playerReleasePad(state, 'p1', flashTimestamp + 200, playerIds);
  state = playerReleasePad(state, 'p2', flashTimestamp + 220, playerIds);
  state = playerReleasePad(state, 'p3', flashTimestamp + 250, playerIds);

  // p4 fell asleep and does not release; 3500ms elapse
  state = tickReactionWait(state, 3500, playerIds, flashTimestamp + 3500, 3000);

  assert.strictEqual(state.phase, 'finished');
  assert.strictEqual(state.loserSlotId, 'p4');
  assert.strictEqual(state.players['p4'].isTimeout, true);
});
