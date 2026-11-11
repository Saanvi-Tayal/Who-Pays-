export interface PlayerSlotReference {
  id: string;
  name: string;
  colorHex?: string;
  avatarKey?: string;
}

export interface RouletteSegment {
  index: number;
  player: PlayerSlotReference;
  startAngle: number;
  endAngle: number;
  centerAngle: number;
}

export type RoulettePhase = 'ready' | 'spinning' | 'decelerating' | 'stopped';

export interface RouletteState {
  phase: RoulettePhase;
  segments: RouletteSegment[];
  currentRotationDeg: number;
  selectedSegmentIndex: number;
  loserSlotId: string | null;
  totalSpins: number;
}

/**
 * Creates the wheel segments partitioned evenly among active players
 */
export function createRouletteSegments(players: PlayerSlotReference[]): RouletteSegment[] {
  const count = Math.max(1, players.length);
  const segmentSpan = 360 / count;

  return players.map((player, idx) => {
    const start = idx * segmentSpan;
    const end = (idx + 1) * segmentSpan;
    return {
      index: idx,
      player,
      startAngle: start,
      endAngle: end,
      centerAngle: start + segmentSpan / 2,
    };
  });
}

/**
 * Calculates which segment is directly under the top needle pointer (at 270 deg / top of circle)
 */
export function getSegmentAtAngle(
  segments: RouletteSegment[],
  rotationDeg: number,
  needleAngle: number = 270
): RouletteSegment {
  if (segments.length === 0) {
    throw new Error('Cannot calculate segment on empty wheel');
  }

  const segmentSpan = 360 / segments.length;
  // Normalize rotation to [0, 360)
  const normRot = ((rotationDeg % 360) + 360) % 360;
  // Calculate relative angle under needle
  const relativeAngle = ((needleAngle - normRot) % 360 + 360) % 360;

  const index = Math.floor(relativeAngle / segmentSpan) % segments.length;
  return segments[index];
}

/**
 * Initializes a new Roulette round
 */
export function createRouletteState(players: PlayerSlotReference[]): RouletteState {
  const segments = createRouletteSegments(players);
  const initialSegment = getSegmentAtAngle(segments, 0);

  return {
    phase: 'ready',
    segments,
    currentRotationDeg: 0,
    selectedSegmentIndex: initialSegment.index,
    loserSlotId: null,
    totalSpins: 0,
  };
}

/**
 * Computes a random target spin rotation between 5 and 9 full revolutions
 */
export function computeSpinTargetRotation(
  currentRotation: number,
  minRevolutions: number = 5,
  maxRevolutions: number = 8
): { targetRotation: number; spinDurationMs: number } {
  const revolutions = minRevolutions + Math.random() * (maxRevolutions - minRevolutions);
  const randomOffset = Math.random() * 360;
  const targetRotation = currentRotation + revolutions * 360 + randomOffset;
  const spinDurationMs = Math.floor(4000 + Math.random() * 1500);

  return { targetRotation, spinDurationMs };
}

/**
 * Resolves the final outcome when the wheel stops
 */
export function resolveRouletteStop(
  state: RouletteState,
  finalRotationDeg: number
): RouletteState {
  const selected = getSegmentAtAngle(state.segments, finalRotationDeg);

  return {
    ...state,
    phase: 'stopped',
    currentRotationDeg: finalRotationDeg,
    selectedSegmentIndex: selected.index,
    loserSlotId: selected.player.id,
    totalSpins: state.totalSpins + 1,
  };
}
