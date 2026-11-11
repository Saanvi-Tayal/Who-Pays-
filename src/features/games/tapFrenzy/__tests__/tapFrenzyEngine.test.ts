import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createTapFrenzyState,
  startTapFrenzy,
  registerPlayerTap,
  tickTapFrenzy,
} from '../tapFrenzyEngine.ts';
import type { PlayerSlotReference } from '../tapFrenzyEngine.ts';

const mockPlayers: PlayerSlotReference[] = [
  { id: 'p1', name: 'Gravit' },
  { id: 'p2', name: 'Saanvi' },
  { id: 'p3', name: 'Aman' },
];

test('createTapFrenzyState initializes with ready phase and 0 taps', () => {
  const state = createTapFrenzyState(mockPlayers, 5000);
  assert.equal(state.phase, 'ready');
  assert.equal(state.durationMs, 5000);
  assert.equal(state.timeRemainingMs, 5000);
  assert.equal(state.tapCounts['p1'], 0);
  assert.equal(state.totalTaps, 0);
});

test('startTapFrenzy enables tapping and increments count', () => {
  const initial = createTapFrenzyState(mockPlayers, 5000);
  const started = startTapFrenzy(initial);
  assert.equal(started.phase, 'active');

  const tapped1 = registerPlayerTap(started, 'p1');
  const tapped2 = registerPlayerTap(tapped1, 'p1');
  const tapped3 = registerPlayerTap(tapped2, 'p2');

  assert.equal(tapped3.tapCounts['p1'], 2);
  assert.equal(tapped3.tapCounts['p2'], 1);
  assert.equal(tapped3.tapCounts['p3'], 0);
  assert.equal(tapped3.highestTaps, 2);
  assert.equal(tapped3.lowestTaps, 0);
  assert.equal(tapped3.totalTaps, 3);
});

test('tickTapFrenzy resolves loser with fewest taps at 0s', () => {
  const initial = createTapFrenzyState(mockPlayers, 5000);
  const started = startTapFrenzy(initial);

  // Saanvi taps 10 times, Aman taps 6 times, Gravit taps 2 times
  let s = started;
  for (let i = 0; i < 10; i++) s = registerPlayerTap(s, 'p2');
  for (let i = 0; i < 6; i++) s = registerPlayerTap(s, 'p3');
  for (let i = 0; i < 2; i++) s = registerPlayerTap(s, 'p1');

  // Tick 5000ms
  const finished = tickTapFrenzy(s, 5000, mockPlayers);
  assert.equal(finished.phase, 'finished');
  assert.equal(finished.timeRemainingMs, 0);
  assert.equal(finished.loserSlotId, 'p1'); // Gravit had fewest taps (2)
  assert.equal(finished.highestTaps, 10);
  assert.equal(finished.lowestTaps, 2);
});
