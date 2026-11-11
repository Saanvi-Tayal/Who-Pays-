import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { playerColors } from '@/theme/colors';
import { syncMatchToSupabase, isSupabaseConfigured } from '@/services/supabase/supabaseClient';

export type StakesModeId =
  | 'who_pays'
  | 'awkward_duty'
  | 'ledger_vengeance'
  | 'aux_cord_dictator'
  | 'screen_time_penalty';

export type GameId = 'time_bomb' | 'roulette' | 'tap_frenzy' | 'reaction_standoff';

export interface PlayerSlot {
  id: string;
  colorId: string;
  colorHex: string;
  contrastText: string;
  name: string;
  avatarKey?: string;
  isActive: boolean;
  score?: number;
}

export interface MatchResult {
  id: string;
  circleId?: string;
  circleName?: string;
  gameId: GameId;
  stakesModeId: StakesModeId;
  dilemma?: string;
  loserSlotId: string | null;
  loserName?: string;
  winnerSlotIds: string[];
  winnerNames?: string[];
  metrics?: Record<string, unknown>;
  createdAt: number;
}

export interface CircleGroup {
  id: string;
  name: string;
  members: number;
  decisions: number;
  emoji: string;
}

interface SessionState {
  slots: PlayerSlot[];
  selectedMode: StakesModeId;
  selectedCategory: string;
  selectedGame: GameId | null;
  lastResult: MatchResult | null;
  history: MatchResult[];
  fairnessMode: boolean;
  activeCircle: CircleGroup;
  circles: CircleGroup[];
  circleRosters: Record<string, PlayerSlot[]>;
  isCloudConnected: boolean;

  // Actions
  setRegisteredSlots: (slots: PlayerSlot[]) => void;
  toggleSlotActive: (slotId: string) => void;
  updateSlotName: (slotId: string, name: string) => void;
  updateSlotAvatar: (slotId: string, avatarKey: string) => void;
  setStakesMode: (mode: StakesModeId) => void;
  setSelectedCategory: (category: string) => void;
  selectGame: (game: GameId) => void;
  recordMatchResult: (result: MatchResult) => void;
  addMatchToHistory: (result: MatchResult) => void;
  toggleFairnessMode: () => void;
  setActiveCircle: (circle: CircleGroup) => void;
  addCircle: (circle: CircleGroup) => void;
  applyGroupToSlots: (circleId: string) => void;
  resetRound: () => void;
  resetAll: () => void;
  loadPersistedData: () => Promise<void>;
}

const STORAGE_KEYS = {
  SLOTS: '@who_pays_slots_v3',
  HISTORY: '@who_pays_history_v3',
  CIRCLES: '@who_pays_circles_v3',
  ACTIVE_CIRCLE: '@who_pays_active_circle_v3',
  CIRCLE_ROSTERS: '@who_pays_circle_rosters_v3',
};

export const GROUP_ROSTER_PRESETS: Record<string, string[]> = {
  '1': ['Gravit', 'Saanvi', 'Aman', 'Priya'],
  '2': ['Alex', 'Sam', 'Jordan', 'Taylor'],
  '3': ['Roomie 1', 'Roomie 2', 'Roomie 3', 'Roomie 4'],
};

export function createRosterForCircle(circleId: string): PlayerSlot[] {
  const preset = GROUP_ROSTER_PRESETS[circleId];
  return [0, 1, 2, 3].map((idx) => {
    const color = playerColors[idx % playerColors.length];
    const defaultName = preset && preset[idx] ? preset[idx] : `Player ${String.fromCharCode(65 + idx)}`;
    return {
      id: `slot-${idx + 1}`,
      colorId: color.id,
      colorHex: color.main,
      contrastText: color.contrastText,
      name: defaultName,
      avatarKey: `AV-0${idx + 1}`,
      isActive: true,
    };
  });
}

const INITIAL_CIRCLES: CircleGroup[] = [
  { id: '1', name: 'College Gang', members: 4, decisions: 3, emoji: '🎓' },
  { id: '2', name: 'Office Friends', members: 4, decisions: 3, emoji: '💼' },
  { id: '3', name: 'Flatmates', members: 4, decisions: 2, emoji: '🏠' },
];

const INITIAL_CIRCLE_ROSTERS: Record<string, PlayerSlot[]> = {
  '1': createRosterForCircle('1'),
  '2': createRosterForCircle('2'),
  '3': createRosterForCircle('3'),
};

const INITIAL_BASELINE_HISTORY: MatchResult[] = [
  // Circle 1: College Gang (id: '1')
  {
    id: 'college-1',
    circleId: '1',
    circleName: 'College Gang',
    gameId: 'time_bomb',
    stakesModeId: 'who_pays',
    dilemma: 'Late Night Chai & Maggi ☕',
    loserSlotId: 'slot-3',
    loserName: 'Aman',
    winnerSlotIds: ['slot-1', 'slot-2', 'slot-4'],
    winnerNames: ['Gravit', 'Saanvi', 'Priya'],
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'college-2',
    circleId: '1',
    circleName: 'College Gang',
    gameId: 'roulette',
    stakesModeId: 'who_pays',
    dilemma: 'Who Pays for Biryani? 🍛',
    loserSlotId: 'slot-2',
    loserName: 'Saanvi',
    winnerSlotIds: ['slot-1', 'slot-3', 'slot-4'],
    winnerNames: ['Gravit', 'Aman', 'Priya'],
    createdAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'college-3',
    circleId: '1',
    circleName: 'College Gang',
    gameId: 'reaction_standoff',
    stakesModeId: 'who_pays',
    dilemma: 'Canteen Samosas 🥟',
    loserSlotId: 'slot-3',
    loserName: 'Aman',
    winnerSlotIds: ['slot-1', 'slot-2', 'slot-4'],
    winnerNames: ['Gravit', 'Saanvi', 'Priya'],
    createdAt: Date.now() - 3600000 * 48,
  },

  // Circle 2: Office Friends (id: '2')
  {
    id: 'office-1',
    circleId: '2',
    circleName: 'Office Friends',
    gameId: 'tap_frenzy',
    stakesModeId: 'who_pays',
    dilemma: 'Friday Coffee Run ☕',
    loserSlotId: 'slot-1',
    loserName: 'Alex',
    winnerSlotIds: ['slot-2', 'slot-3', 'slot-4'],
    winnerNames: ['Sam', 'Jordan', 'Taylor'],
    createdAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'office-2',
    circleId: '2',
    circleName: 'Office Friends',
    gameId: 'roulette',
    stakesModeId: 'awkward_duty',
    dilemma: 'Team Lunch Bill 🍕',
    loserSlotId: 'slot-3',
    loserName: 'Jordan',
    winnerSlotIds: ['slot-1', 'slot-2', 'slot-4'],
    winnerNames: ['Alex', 'Sam', 'Taylor'],
    createdAt: Date.now() - 3600000 * 28,
  },
  {
    id: 'office-3',
    circleId: '2',
    circleName: 'Office Friends',
    gameId: 'time_bomb',
    stakesModeId: 'who_pays',
    dilemma: 'Morning Donut Duty 🍩',
    loserSlotId: 'slot-1',
    loserName: 'Alex',
    winnerSlotIds: ['slot-2', 'slot-3', 'slot-4'],
    winnerNames: ['Sam', 'Jordan', 'Taylor'],
    createdAt: Date.now() - 3600000 * 52,
  },

  // Circle 3: Flatmates (id: '3')
  {
    id: 'flatmates-1',
    circleId: '3',
    circleName: 'Flatmates',
    gameId: 'time_bomb',
    stakesModeId: 'who_pays',
    dilemma: 'Grocery & Milk Run 🥛',
    loserSlotId: 'slot-2',
    loserName: 'Roomie 2',
    winnerSlotIds: ['slot-1', 'slot-3', 'slot-4'],
    winnerNames: ['Roomie 1', 'Roomie 3', 'Roomie 4'],
    createdAt: Date.now() - 3600000 * 6,
  },
  {
    id: 'flatmates-2',
    circleId: '3',
    circleName: 'Flatmates',
    gameId: 'roulette',
    stakesModeId: 'who_pays',
    dilemma: 'Who Pays Wi-Fi Bill? 📶',
    loserSlotId: 'slot-3',
    loserName: 'Roomie 3',
    winnerSlotIds: ['slot-1', 'slot-2', 'slot-4'],
    winnerNames: ['Roomie 1', 'Roomie 2', 'Roomie 4'],
    createdAt: Date.now() - 3600000 * 30,
  },
];

export const useSessionStore = create<SessionState>((set, get) => ({
  slots: INITIAL_CIRCLE_ROSTERS['1'],
  selectedMode: 'who_pays',
  selectedCategory: 'Where to Eat?',
  selectedGame: 'time_bomb',
  lastResult: INITIAL_BASELINE_HISTORY[0],
  history: INITIAL_BASELINE_HISTORY,
  fairnessMode: true,
  activeCircle: INITIAL_CIRCLES[0],
  circles: INITIAL_CIRCLES,
  circleRosters: INITIAL_CIRCLE_ROSTERS,
  isCloudConnected: isSupabaseConfigured(),

  setRegisteredSlots: (slots) => {
    const { activeCircle, circleRosters } = get();
    const updatedRosters = {
      ...circleRosters,
      [activeCircle.id]: slots,
    };
    set({ slots, circleRosters: updatedRosters });
    AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots)).catch(() => {});
    AsyncStorage.setItem(STORAGE_KEYS.CIRCLE_ROSTERS, JSON.stringify(updatedRosters)).catch(() => {});
  },

  toggleSlotActive: (slotId) => {
    set((state) => {
      const updated = state.slots.map((s) =>
        s.id === slotId ? { ...s, isActive: !s.isActive } : s
      );
      const updatedRosters = {
        ...state.circleRosters,
        [state.activeCircle.id]: updated,
      };
      AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(updated)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.CIRCLE_ROSTERS, JSON.stringify(updatedRosters)).catch(() => {});
      return { slots: updated, circleRosters: updatedRosters };
    });
  },

  updateSlotName: (slotId, name) => {
    set((state) => {
      const updated = state.slots.map((s) =>
        s.id === slotId ? { ...s, name } : s
      );
      const updatedRosters = {
        ...state.circleRosters,
        [state.activeCircle.id]: updated,
      };
      AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(updated)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.CIRCLE_ROSTERS, JSON.stringify(updatedRosters)).catch(() => {});
      return { slots: updated, circleRosters: updatedRosters };
    });
  },

  updateSlotAvatar: (slotId, avatarKey) => {
    set((state) => {
      const updated = state.slots.map((s) =>
        s.id === slotId ? { ...s, avatarKey } : s
      );
      const updatedRosters = {
        ...state.circleRosters,
        [state.activeCircle.id]: updated,
      };
      AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(updated)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.CIRCLE_ROSTERS, JSON.stringify(updatedRosters)).catch(() => {});
      return { slots: updated, circleRosters: updatedRosters };
    });
  },

  setStakesMode: (selectedMode) => set({ selectedMode }),

  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

  selectGame: (selectedGame) => set({ selectedGame }),

  recordMatchResult: (result) => {
    const { slots, selectedCategory, activeCircle } = get();

    // Attach real names & circle metadata to match record
    const loserSlot = slots.find((s) => s.id === result.loserSlotId);
    const loserName = loserSlot ? loserSlot.name : 'Unknown';
    const winnerNames = slots
      .filter((s) => result.winnerSlotIds.includes(s.id))
      .map((s) => s.name);

    const enrichedResult: MatchResult = {
      ...result,
      circleId: activeCircle.id,
      circleName: activeCircle.name,
      loserName,
      winnerNames,
      dilemma: result.dilemma || selectedCategory || 'Who Pays?',
    };

    set((state) => {
      const updatedHistory = [enrichedResult, ...state.history];
      AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory)).catch(() => {});

      // Increment active circle decisions
      const updatedCircles = state.circles.map((c) =>
        c.id === activeCircle.id ? { ...c, decisions: c.decisions + 1 } : c
      );
      AsyncStorage.setItem(STORAGE_KEYS.CIRCLES, JSON.stringify(updatedCircles)).catch(() => {});

      return {
        lastResult: enrichedResult,
        history: updatedHistory,
        circles: updatedCircles,
      };
    });

    // Cloud background sync to Supabase (graceful non-blocking)
    syncMatchToSupabase({
      game_id: enrichedResult.gameId,
      stakes_mode_id: enrichedResult.stakesModeId,
      dilemma: enrichedResult.dilemma,
      loser_slot_id: enrichedResult.loserSlotId,
      loser_player_name: loserName,
      winner_player_names: winnerNames,
      circle_id: activeCircle.id,
      circle_name: activeCircle.name,
      metrics: enrichedResult.metrics,
    }).catch(() => {});
  },

  addMatchToHistory: (result) => {
    set((state) => {
      const updated = [result, ...state.history];
      AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated)).catch(() => {});
      return { history: updated };
    });
  },

  toggleFairnessMode: () =>
    set((state) => ({ fairnessMode: !state.fairnessMode })),

  setActiveCircle: (targetCircle) => {
    set((state) => {
      // 1. Save current slots into active circle roster
      const updatedRosters = {
        ...state.circleRosters,
        [state.activeCircle.id]: state.slots,
      };

      // 2. Fetch or create slots for the target circle
      const targetSlots =
        updatedRosters[targetCircle.id] || createRosterForCircle(targetCircle.id);
      updatedRosters[targetCircle.id] = targetSlots;

      AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_CIRCLE, JSON.stringify(targetCircle)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.CIRCLE_ROSTERS, JSON.stringify(updatedRosters)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(targetSlots)).catch(() => {});

      return {
        activeCircle: targetCircle,
        circleRosters: updatedRosters,
        slots: targetSlots,
      };
    });
  },

  addCircle: (circle) => {
    const newSlots = createRosterForCircle(circle.id);
    set((state) => {
      const updatedCircles = [...state.circles, circle];
      const updatedRosters = {
        ...state.circleRosters,
        [circle.id]: newSlots,
      };
      AsyncStorage.setItem(STORAGE_KEYS.CIRCLES, JSON.stringify(updatedCircles)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.CIRCLE_ROSTERS, JSON.stringify(updatedRosters)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_CIRCLE, JSON.stringify(circle)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(newSlots)).catch(() => {});
      return {
        circles: updatedCircles,
        activeCircle: circle,
        circleRosters: updatedRosters,
        slots: newSlots,
      };
    });
  },

  applyGroupToSlots: (circleId) => {
    const preset = GROUP_ROSTER_PRESETS[circleId];
    set((state) => {
      const updated = state.slots.map((s, idx) => {
        const assigned = preset && preset[idx] ? preset[idx] : `Player ${String.fromCharCode(65 + idx)}`;
        return {
          ...s,
          name: assigned,
        };
      });
      const updatedRosters = {
        ...state.circleRosters,
        [state.activeCircle.id]: updated,
      };
      AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(updated)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.CIRCLE_ROSTERS, JSON.stringify(updatedRosters)).catch(() => {});
      return { slots: updated, circleRosters: updatedRosters };
    });
  },

  resetRound: () =>
    set((state) => ({
      slots: state.slots.map((s) => ({ ...s, score: 0 })),
    })),

  resetAll: () => {
    const defaultRoster = createRosterForCircle('1');
    set({
      slots: defaultRoster,
      selectedMode: 'who_pays',
      selectedCategory: 'Where to Eat?',
      selectedGame: 'time_bomb',
      lastResult: null,
      activeCircle: INITIAL_CIRCLES[0],
    });
  },

  loadPersistedData: async () => {
    try {
      const [savedSlots, savedHistory, savedCircles, savedActiveCircle, savedRosters] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.SLOTS),
          AsyncStorage.getItem(STORAGE_KEYS.HISTORY),
          AsyncStorage.getItem(STORAGE_KEYS.CIRCLES),
          AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_CIRCLE),
          AsyncStorage.getItem(STORAGE_KEYS.CIRCLE_ROSTERS),
        ]);

      set({
        isCloudConnected: isSupabaseConfigured(),
        ...(savedSlots ? { slots: JSON.parse(savedSlots) } : {}),
        ...(savedHistory ? { history: JSON.parse(savedHistory) } : {}),
        ...(savedCircles ? { circles: JSON.parse(savedCircles) } : {}),
        ...(savedActiveCircle ? { activeCircle: JSON.parse(savedActiveCircle) } : {}),
        ...(savedRosters ? { circleRosters: JSON.parse(savedRosters) } : {}),
      });
    } catch {
      // Graceful fallback to in-memory defaults
    }
  },
}));
