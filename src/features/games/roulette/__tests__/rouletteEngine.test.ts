import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createRouletteSegments,
  getSegmentAtAngle,
  createRouletteState,
  computeSpinTargetRotation,
  resolveRouletteStop,
} from '../rouletteEngine.ts';
import type { PlayerSlotReference } from '../rouletteEngine.ts';

const mockPlayers: PlayerSlotReference[] = [
  { id: 'p1', name: 'Gravit' },
  { id: 'p2', name: 'Saanvi' },
  { id: 'p3', name: 'Aman' },
  { id: 'p4', name: 'Priya' },
];

test('createRouletteSegments divides 360 deg evenly among 4 players', () => {
  const segments = createRouletteSegments(mockPlayers);
  assert.equal(segments.length, 4);
  assert.equal(segments[0].startAngle, 0);
  assert.equal(segments[0].endAngle, 90);
  assert.equal(segments[1].startAngle, 90);
  assert.equal(segments[1].endAngle, 180);
  assert.equal(segments[2].startAngle, 180);
  assert.equal(segments[2].endAngle, 270);
  assert.equal(segments[3].startAngle, 270);
  assert.equal(segments[3].endAngle, 360);
});

test('getSegmentAtAngle identifies the correct player under needle pointer', () => {
  const segments = createRouletteSegments(mockPlayers);
  // Pointer is at 270 deg (top). At 0 rotation, relative angle = 270 deg -> index 3 (Priya)
  const atZero = getSegmentAtAngle(segments, 0);
  assert.equal(atZero.player.id, 'p4');

  // Rotate wheel 90 degrees counter-clockwise
  const at90 = getSegmentAtAngle(segments, 90);
  assert.equal(at90.player.id, 'p3');
});

test('computeSpinTargetRotation produces at least 5 revolutions', () => {
  const { targetRotation, spinDurationMs } = computeSpinTargetRotation(0, 5, 8);
  assert.ok(targetRotation >= 5 * 360);
  assert.ok(spinDurationMs >= 4000);
});

test('resolveRouletteStop sets phase to stopped and registers loser', () => {
  const initial = createRouletteState(mockPlayers);
  assert.equal(initial.phase, 'ready');

  const stopped = resolveRouletteStop(initial, 1440); // 4 full revolutions
  assert.equal(stopped.phase, 'stopped');
  assert.equal(stopped.loserSlotId, 'p4');
  assert.equal(stopped.totalSpins, 1);
});
