export interface PlayerSlotReference {
  id: string;
  name: string;
  colorHex?: string;
  avatarKey?: string;
}

export type TimeBombPhase = 'ready' | 'active' | 'warning' | 'exploded' | 'cancelled';

export interface TimeBombConfig {
  minFuseMs?: number; // default 9000 ms (9s)
  maxFuseMs?: number; // default 18000 ms (18s)
  warningThresholdMs?: number; // default 3500 ms (3.5s)
}

export interface TimeBombState {
  phase: TimeBombPhase;
  fuseDurationMs: number;
  timeRemainingMs: number;
  currentHolderIndex: number;
  passCount: number;
  startTime: number | null;
  timeHeldPerSlot: Record<string, number>;
  loserSlotId: string | null;
  warningThresholdMs: number;
}

/**
 * Initializes a new Time Bomb round state
 * Fuse duration dynamically scales with the number of players:
 * each player gets ~3.0s to 5.5s average window across passes,
 * and the exact fuse is 100% secret from players!
 */
export function createTimeBombState(
  players: PlayerSlotReference[],
  config: TimeBombConfig = {}
): TimeBombState {
  const count = Math.max(2, players.length);
  const min = config.minFuseMs ?? Math.round(count * 3000);
  const max = config.maxFuseMs ?? Math.round(count * 5500);
  const warningThreshold = config.warningThresholdMs ?? 3500;

  // Generate randomized secret fuse duration based on player count
  const randomDuration = Math.floor(min + Math.random() * (max - min));

  // Initialize time held mapping
  const timeHeld: Record<string, number> = {};
  players.forEach((p) => {
    timeHeld[p.id] = 0;
  });

  return {
    phase: 'ready',
    fuseDurationMs: randomDuration,
    timeRemainingMs: randomDuration,
    currentHolderIndex: 0,
    passCount: 0,
    startTime: null,
    timeHeldPerSlot: timeHeld,
    loserSlotId: null,
    warningThresholdMs: warningThreshold,
  };
}

/**
 * Starts the fuse countdown
 */
export function startTimeBomb(state: TimeBombState, now: number = Date.now()): TimeBombState {
  if (state.phase !== 'ready') return state;

  return {
    ...state,
    phase: 'active',
    startTime: now,
  };
}

/**
 * Passes the phone to the next player in the sequence
 */
export function passTimeBomb(
  state: TimeBombState,
  activePlayersCount: number
): TimeBombState {
  if (state.phase !== 'active' && state.phase !== 'warning') {
    return state;
  }

  const nextIndex = (state.currentHolderIndex + 1) % activePlayersCount;

  return {
    ...state,
    currentHolderIndex: nextIndex,
    passCount: state.passCount + 1,
  };
}

/**
 * Advances the fuse timer by deltaMs
 */
export function tickTimeBomb(
  state: TimeBombState,
  deltaMs: number,
  activePlayers: PlayerSlotReference[]
): TimeBombState {
  if (state.phase !== 'active' && state.phase !== 'warning') {
    return state;
  }

  const newTimeRemaining = Math.max(0, state.timeRemainingMs - deltaMs);
  const currentSlot = activePlayers[state.currentHolderIndex] || activePlayers[0];

  const updatedTimeHeld = {
    ...state.timeHeldPerSlot,
    [currentSlot.id]: (state.timeHeldPerSlot[currentSlot.id] || 0) + deltaMs,
  };

  // If time runs out -> Exploded!
  if (newTimeRemaining <= 0) {
    return {
      ...state,
      phase: 'exploded',
      timeRemainingMs: 0,
      timeHeldPerSlot: updatedTimeHeld,
      loserSlotId: currentSlot.id,
    };
  }

  // If below warning threshold -> Warning state
  const isWarning = newTimeRemaining <= state.warningThresholdMs;

  return {
    ...state,
    phase: isWarning ? 'warning' : 'active',
    timeRemainingMs: newTimeRemaining,
    timeHeldPerSlot: updatedTimeHeld,
  };
}

/**
 * Cancels the game round
 */
export function cancelTimeBomb(state: TimeBombState): TimeBombState {
  return {
    ...state,
    phase: 'cancelled',
  };
}
