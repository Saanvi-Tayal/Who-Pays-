export interface PlayerSlotReference {
  id: string;
  name: string;
  colorHex?: string;
  avatarKey?: string;
}

export type ReactionPhase =
  | 'ready'
  | 'waiting'
  | 'flashed'
  | 'finished'
  | 'false_start'
  | 'cancelled';

export interface PlayerReactionInfo {
  holding: boolean;
  released: boolean;
  reactionTimeMs: number | null;
  isFalseStart: boolean;
  isTimeout: boolean;
}

export interface ReactionStandoffState {
  phase: ReactionPhase;
  players: Record<string, PlayerReactionInfo>;
  signalDelayMs: number;
  elapsedWaitMs: number;
  signalTimestamp: number | null;
  loserSlotId: string | null;
  winnerSlotIds: string[];
  fastestSlotId: string | null;
  slowestSlotId: string | null;
  falseStartSlotId: string | null;
}

/**
 * Initializes a new Reaction Standoff game state.
 * @param players List of active player slots
 * @param signalDelayMs Secret delay before signal flash (default: 2500 - 5000 ms)
 */
export function createReactionState(
  players: PlayerSlotReference[],
  signalDelayMs?: number
): ReactionStandoffState {
  const initialPlayers: Record<string, PlayerReactionInfo> = {};
  players.forEach((p) => {
    initialPlayers[p.id] = {
      holding: false,
      released: false,
      reactionTimeMs: null,
      isFalseStart: false,
      isTimeout: false,
    };
  });

  const delay = signalDelayMs ?? Math.floor(2200 + Math.random() * 2600);

  return {
    phase: 'ready',
    players: initialPlayers,
    signalDelayMs: delay,
    elapsedWaitMs: 0,
    signalTimestamp: null,
    loserSlotId: null,
    winnerSlotIds: [],
    fastestSlotId: null,
    slowestSlotId: null,
    falseStartSlotId: null,
  };
}

/**
 * Handles a player placing their finger down on their corner pad.
 */
export function playerPressPad(
  state: ReactionStandoffState,
  slotId: string,
  playerIds: string[]
): ReactionStandoffState {
  if (state.phase !== 'ready' && state.phase !== 'waiting') return state;

  const currentInfo = state.players[slotId];
  if (!currentInfo) return state;

  const updatedPlayers = {
    ...state.players,
    [slotId]: {
      ...currentInfo,
      holding: true,
      released: false,
    },
  };

  // If we were ready, check if ALL players are now holding down
  if (state.phase === 'ready') {
    const allHolding = playerIds.every((id) => updatedPlayers[id]?.holding);
    if (allHolding) {
      return {
        ...state,
        phase: 'waiting',
        players: updatedPlayers,
        elapsedWaitMs: 0,
      };
    }
  }

  return {
    ...state,
    players: updatedPlayers,
  };
}

/**
 * Handles a player releasing their pad.
 * - In 'waiting' -> FALSE START! That player immediately loses.
 * - In 'flashed' -> Valid reaction timestamp calculated.
 */
export function playerReleasePad(
  state: ReactionStandoffState,
  slotId: string,
  timestamp: number = Date.now(),
  playerIds: string[]
): ReactionStandoffState {
  const currentInfo = state.players[slotId];
  if (!currentInfo) return state;

  // 1. Release in 'ready' phase: just mark holding false
  if (state.phase === 'ready') {
    return {
      ...state,
      players: {
        ...state.players,
        [slotId]: {
          ...currentInfo,
          holding: false,
        },
      },
    };
  }

  // 2. Release in 'waiting' phase: FALSE START!
  if (state.phase === 'waiting') {
    const updatedPlayers = {
      ...state.players,
      [slotId]: {
        ...currentInfo,
        holding: false,
        released: true,
        isFalseStart: true,
      },
    };

    return {
      ...state,
      phase: 'false_start',
      players: updatedPlayers,
      falseStartSlotId: slotId,
      loserSlotId: slotId,
      winnerSlotIds: playerIds.filter((id) => id !== slotId),
    };
  }

  // 3. Release in 'flashed' phase: Record reaction time
  if (state.phase === 'flashed') {
    if (currentInfo.released) return state; // Already recorded

    const signalTime = state.signalTimestamp || timestamp;
    const deltaMs = Math.max(1, timestamp - signalTime);

    const updatedPlayers = {
      ...state.players,
      [slotId]: {
        ...currentInfo,
        holding: false,
        released: true,
        reactionTimeMs: deltaMs,
      },
    };

    // Check if all players have released
    const allReleased = playerIds.every((id) => updatedPlayers[id]?.released);

    if (allReleased) {
      return resolveFinishedRound(state, updatedPlayers, playerIds);
    }

    return {
      ...state,
      players: updatedPlayers,
    };
  }

  return state;
}

/**
 * Evaluates winners and slowest loser once all players release or time out
 */
function resolveFinishedRound(
  state: ReactionStandoffState,
  updatedPlayers: Record<string, PlayerReactionInfo>,
  playerIds: string[]
): ReactionStandoffState {
  let slowestSlot: string = playerIds[0];
  let slowestTime: number = -Infinity;
  let fastestSlot: string = playerIds[0];
  let fastestTime: number = Infinity;

  playerIds.forEach((id) => {
    const info = updatedPlayers[id];
    const time = info?.reactionTimeMs ?? 9999;
    if (time > slowestTime) {
      slowestTime = time;
      slowestSlot = id;
    }
    if (time < fastestTime) {
      fastestTime = time;
      fastestSlot = id;
    }
  });

  return {
    ...state,
    phase: 'finished',
    players: updatedPlayers,
    loserSlotId: slowestSlot,
    slowestSlotId: slowestSlot,
    fastestSlotId: fastestSlot,
    winnerSlotIds: playerIds.filter((id) => id !== slowestSlot),
  };
}

/**
 * Ticks the reaction clock during 'waiting' or 'flashed' phase
 */
export function tickReactionWait(
  state: ReactionStandoffState,
  deltaMs: number,
  playerIds: string[],
  currentTimestamp: number = Date.now(),
  timeoutLimitMs: number = 3000
): ReactionStandoffState {
  if (state.phase === 'waiting') {
    const nextWait = state.elapsedWaitMs + deltaMs;
    if (nextWait >= state.signalDelayMs) {
      // Flash the signal!
      return {
        ...state,
        phase: 'flashed',
        elapsedWaitMs: state.signalDelayMs,
        signalTimestamp: currentTimestamp,
      };
    }
    return {
      ...state,
      elapsedWaitMs: nextWait,
    };
  }

  if (state.phase === 'flashed') {
    const elapsedSinceFlash = state.signalTimestamp ? currentTimestamp - state.signalTimestamp : 0;
    if (elapsedSinceFlash >= timeoutLimitMs) {
      // Force timeout for any player still holding
      const updatedPlayers: Record<string, PlayerReactionInfo> = { ...state.players };
      playerIds.forEach((id) => {
        const info = updatedPlayers[id];
        if (info && !info.released) {
          updatedPlayers[id] = {
            ...info,
            holding: false,
            released: true,
            isTimeout: true,
            reactionTimeMs: timeoutLimitMs,
          };
        }
      });
      return resolveFinishedRound(state, updatedPlayers, playerIds);
    }
  }

  return state;
}
