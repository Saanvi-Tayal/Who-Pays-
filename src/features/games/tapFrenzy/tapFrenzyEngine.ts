export interface PlayerSlotReference {
  id: string;
  name: string;
  colorHex?: string;
  avatarKey?: string;
}

export type TapFrenzyPhase = 'ready' | 'active' | 'finished' | 'cancelled';

export interface TapFrenzyState {
  phase: TapFrenzyPhase;
  durationMs: number;
  timeRemainingMs: number;
  tapCounts: Record<string, number>;
  loserSlotId: string | null;
  highestTaps: number;
  lowestTaps: number;
  totalTaps: number;
}

/**
 * Initializes a new Tap Frenzy game state
 */
export function createTapFrenzyState(
  players: PlayerSlotReference[],
  durationMs: number = 5000
): TapFrenzyState {
  const initialCounts: Record<string, number> = {};
  players.forEach((p) => {
    initialCounts[p.id] = 0;
  });

  return {
    phase: 'ready',
    durationMs,
    timeRemainingMs: durationMs,
    tapCounts: initialCounts,
    loserSlotId: null,
    highestTaps: 0,
    lowestTaps: 0,
    totalTaps: 0,
  };
}

/**
 * Starts the countdown timer
 */
export function startTapFrenzy(state: TapFrenzyState): TapFrenzyState {
  if (state.phase !== 'ready') return state;

  return {
    ...state,
    phase: 'active',
  };
}

/**
 * Registers a tap for a specific player slot
 */
export function registerPlayerTap(
  state: TapFrenzyState,
  slotId: string
): TapFrenzyState {
  if (state.phase !== 'active') return state;

  const currentCount = state.tapCounts[slotId] || 0;
  const updatedCounts = {
    ...state.tapCounts,
    [slotId]: currentCount + 1,
  };

  const countsArray = Object.values(updatedCounts);
  const highest = Math.max(...countsArray);
  const lowest = Math.min(...countsArray);
  const total = countsArray.reduce((acc, c) => acc + c, 0);

  return {
    ...state,
    tapCounts: updatedCounts,
    highestTaps: highest,
    lowestTaps: lowest,
    totalTaps: total,
  };
}

/**
 * Ticks the countdown clock and resolves when time reaches 0
 */
export function tickTapFrenzy(
  state: TapFrenzyState,
  deltaMs: number,
  players: PlayerSlotReference[]
): TapFrenzyState {
  if (state.phase !== 'active') return state;

  const newTimeRemaining = Math.max(0, state.timeRemainingMs - deltaMs);

  if (newTimeRemaining <= 0) {
    // Find player with the fewest taps
    let minTaps = Infinity;
    let loserId = players[0]?.id || null;

    players.forEach((p) => {
      const count = state.tapCounts[p.id] || 0;
      if (count < minTaps) {
        minTaps = count;
        loserId = p.id;
      }
    });

    const countsArray = Object.values(state.tapCounts);
    return {
      ...state,
      phase: 'finished',
      timeRemainingMs: 0,
      loserSlotId: loserId,
      highestTaps: countsArray.length > 0 ? Math.max(...countsArray) : 0,
      lowestTaps: countsArray.length > 0 ? Math.min(...countsArray) : 0,
    };
  }

  return {
    ...state,
    timeRemainingMs: newTimeRemaining,
  };
}
