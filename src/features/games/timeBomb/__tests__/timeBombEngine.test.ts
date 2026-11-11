import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createTimeBombState,
  startTimeBomb,
  passTimeBomb,
  tickTimeBomb,
  cancelTimeBomb,
} from '../timeBombEngine.ts';
import type { PlayerSlotReference } from '../timeBombEngine.ts';

const mockPlayers: PlayerSlotReference[] = [
  { id: 'p1', colorHex: '#FF0000', name: 'Gravit' },
  { id: 'p2', colorHex: '#0000FF', name: 'Saanvi' },
  { id: 'p3', colorHex: '#00FF00', name: 'Aman' },
];

test('createTimeBombState initializes in ready phase with bounded fuse', () => {
  const state = createTimeBombState(mockPlayers, { minFuseMs: 10000, maxFuseMs: 12000 });
  assert.equal(state.phase, 'ready');
  assert.equal(state.currentHolderIndex, 0);
  assert.equal(state.passCount, 0);
  assert.equal(state.loserSlotId, null);
  assert.ok(state.fuseDurationMs >= 10000 && state.fuseDurationMs <= 12000);
  assert.equal(state.timeRemainingMs, state.fuseDurationMs);
});

test('startTimeBomb transitions from ready to active', () => {
  const initial = createTimeBombState(mockPlayers);
  const started = startTimeBomb(initial, 1000);
  assert.equal(started.phase, 'active');
  assert.equal(started.startTime, 1000);
});

test('passTimeBomb cycles current holder and tracks pass count', () => {
  const initial = createTimeBombState(mockPlayers);
  const started = startTimeBomb(initial, 1000);

  const pass1 = passTimeBomb(started, mockPlayers.length);
  assert.equal(pass1.currentHolderIndex, 1);
  assert.equal(pass1.passCount, 1);

  const pass2 = passTimeBomb(pass1, mockPlayers.length);
  assert.equal(pass2.currentHolderIndex, 2);
  assert.equal(pass2.passCount, 2);

  const pass3 = passTimeBomb(pass2, mockPlayers.length);
  assert.equal(pass3.currentHolderIndex, 0);
  assert.equal(pass3.passCount, 3);
});

test('tickTimeBomb enters warning phase and triggers explosion on current holder at 0', () => {
  const initial = createTimeBombState(mockPlayers, {
    minFuseMs: 5000,
    maxFuseMs: 5000,
    warningThresholdMs: 3000,
  });
  const started = startTimeBomb(initial, 1000);

  // Pass to Saanvi (index 1)
  const passed = passTimeBomb(started, mockPlayers.length);
  assert.equal(passed.currentHolderIndex, 1);

  // Tick 1500ms -> remaining 3500ms (still active)
  const tick1 = tickTimeBomb(passed, 1500, mockPlayers);
  assert.equal(tick1.phase, 'active');
  assert.equal(tick1.timeRemainingMs, 3500);

  // Tick another 1000ms -> remaining 2500ms <= 3000ms warning threshold
  const tick2 = tickTimeBomb(tick1, 1000, mockPlayers);
  assert.equal(tick2.phase, 'warning');
  assert.equal(tick2.timeRemainingMs, 2500);

  // Tick remaining 2500ms -> remaining 0ms -> EXPLODED!
  const exploded = tickTimeBomb(tick2, 2500, mockPlayers);
  assert.equal(exploded.phase, 'exploded');
  assert.equal(exploded.timeRemainingMs, 0);
  // Saanvi (p2) was holding when it exploded
  assert.equal(exploded.loserSlotId, 'p2');
  assert.equal(exploded.timeHeldPerSlot['p2'], 5000);
});

test('cancelTimeBomb sets phase to cancelled', () => {
  const initial = createTimeBombState(mockPlayers);
  const cancelled = cancelTimeBomb(initial);
  assert.equal(cancelled.phase, 'cancelled');
});
