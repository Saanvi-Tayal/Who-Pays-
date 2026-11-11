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
  isDemo?: boolean;
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
  hasDemoData: boolean;

  // Actions
  setRegisteredSlots: (slots: PlayerSlot[]) => void;
  toggleSlotActive: (slotId: string) => void;
  updateSlotName: (slotId: string, name: string) => void;
  updateSlotAvatar: (slotId: string, avatarKey: string) => void;
  addPlayerToActiveCircle: (name?: string) => boolean;
  removePlayerFromActiveCircle: (slotId: string) => boolean;
  clearDemoData: () => void;
  removeDemoDataForCircle: (circleId: string) => void;
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
  SLOTS: '@who_pays_slots_v5',
  HISTORY: '@who_pays_history_v5',
  CIRCLES: '@who_pays_circles_v5',
  ACTIVE_CIRCLE: '@who_pays_active_circle_v5',
  CIRCLE_ROSTERS: '@who_pays_circle_rosters_v5',
};

export const TEST_CIRCLE_PRESETS: Record<string, string[]> = {
  '1': ['Gravit', 'Saanvi', 'Aman', 'Priya'],
  '2': ['Alex', 'Sam', 'Jordan', 'Taylor'],
  '3': ['Roomie 1', 'Roomie 2', 'Roomie 3', 'Roomie 4'],
};

export function createRosterForCircle(circleId?: string): PlayerSlot[] {
  const preset = circleId && TEST_CIRCLE_PRESETS[circleId];
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

export const TEST_BASELINE_HISTORY: MatchResult[] = [
  // Circle 1: College Gang (id: '1')
  {
    id: 'test-college-1',
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
    isDemo: true,
  },
  {
    id: 'test-college-2',
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
    isDemo: true,
  },
  {
    id: 'test-college-3',
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
    isDemo: true,
  },

  // Circle 2: Office Friends (id: '2')
  {
    id: 'test-office-1',
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
    isDemo: true,
  },
  {
    id: 'test-office-2',
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
    isDemo: true,
  },
  {
    id: 'test-office-3',
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
    isDemo: true,
  },

  // Circle 3: Flatmates (id: '3')
  {
    id: 'test-flatmates-1',
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
    isDemo: true,
  },
  {
    id: 'test-flatmates-2',
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
    isDemo: true,
  },
];

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

export const useSessionStore = create<SessionState>((set, get) => ({
  slots: INITIAL_CIRCLE_ROSTERS['1'],
  selectedMode: 'who_pays',
  selectedCategory: 'Where to Eat?',
  selectedGame: 'time_bomb',
  lastResult: TEST_BASELINE_HISTORY[0],
  history: TEST_BASELINE_HISTORY,
  fairnessMode: true,
  activeCircle: INITIAL_CIRCLES[0],
  circles: INITIAL_CIRCLES,
  circleRosters: INITIAL_CIRCLE_ROSTERS,
  hasDemoData: true,
  isCloudConnected: isSupabaseConfigured(),

  setRegisteredSlots: (slots) => {
    const { activeCircle, circleRosters, history, circles } = get();

    // When real people register/touch screen, remove demo test data for this active circle
    const updatedHistory = history.filter(
      (m) => !(m.isDemo && (m.circleId === activeCircle.id || (!m.circleId && activeCircle.id === '1')))
    );
    const realDecisions = updatedHistory.filter((m) => m.circleId === activeCircle.id).length;
    const updatedCircle: CircleGroup = {
      ...activeCircle,
      members: slots.length,
      decisions: realDecisions,
    };
    const updatedCircles = circles.map((c) =>
      c.id === activeCircle.id ? updatedCircle : c
    );
    const updatedRosters = {
      ...circleRosters,
      [activeCircle.id]: slots,
    };

    set({
      slots,
      circleRosters: updatedRosters,
      history: updatedHistory,
      activeCircle: updatedCircle,
      circles: updatedCircles,
      hasDemoData: updatedHistory.some((m) => m.isDemo),
    });

    AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots)).catch(() => {});
    AsyncStorage.setItem(STORAGE_KEYS.CIRCLE_ROSTERS, JSON.stringify(updatedRosters)).catch(() => {});
    AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory)).catch(() => {});
    AsyncStorage.setItem(STORAGE_KEYS.CIRCLES, JSON.stringify(updatedCircles)).catch(() => {});
    AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_CIRCLE, JSON.stringify(updatedCircle)).catch(() => {});
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

      // User customizing player names removes demo test data for this circle
      const updatedHistory = state.history.filter(
        (m) => !(m.isDemo && (m.circleId === state.activeCircle.id || (!m.circleId && state.activeCircle.id === '1')))
      );
      const realDecisions = updatedHistory.filter((m) => m.circleId === state.activeCircle.id).length;
      const updatedCircle: CircleGroup = {
        ...state.activeCircle,
        decisions: realDecisions,
      };
      const updatedCircles = state.circles.map((c) =>
        c.id === state.activeCircle.id ? updatedCircle : c
      );

      AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(updated)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.CIRCLE_ROSTERS, JSON.stringify(updatedRosters)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.CIRCLES, JSON.stringify(updatedCircles)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_CIRCLE, JSON.stringify(updatedCircle)).catch(() => {});

      return {
        slots: updated,
        circleRosters: updatedRosters,
        history: updatedHistory,
        activeCircle: updatedCircle,
        circles: updatedCircles,
        hasDemoData: updatedHistory.some((m) => m.isDemo),
      };
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

  addPlayerToActiveCircle: (name?: string) => {
    const { slots, activeCircle, circleRosters, circles, history } = get();
    if (slots.length >= 8) return false;

    // Remove demo test data for this circle when user adds their own person!
    const updatedHistory = history.filter(
      (m) => !(m.isDemo && (m.circleId === activeCircle.id || (!m.circleId && activeCircle.id === '1')))
    );
    const realDecisions = updatedHistory.filter((m) => m.circleId === activeCircle.id).length;

    const nextIdx = slots.length;
    const color = playerColors[nextIdx % playerColors.length];
    const defaultName = name?.trim() || `Player ${String.fromCharCode(65 + nextIdx)}`;
    const avatarKey = `AV-0${(nextIdx % 12) + 1}`;

    const newSlot: PlayerSlot = {
      id: `slot-${Date.now()}-${nextIdx}`,
      colorId: color.id,
      colorHex: color.main,
      contrastText: color.contrastText,
      name: defaultName,
      avatarKey,
      isActive: true,
    };

    const updatedSlots = [...slots, newSlot];
    const updatedRosters = {
      ...circleRosters,
      [activeCircle.id]: updatedSlots,
    };
    const updatedCircle: CircleGroup = {
      ...activeCircle,
      members: updatedSlots.length,
      decisions: realDecisions,
    };
    const updatedCircles = circles.map((c) =>
      c.id === activeCircle.id ? updatedCircle : c
    );

    set({
      slots: updatedSlots,
      circleRosters: updatedRosters,
      activeCircle: updatedCircle,
      circles: updatedCircles,
      history: updatedHistory,
      hasDemoData: updatedHistory.some((m) => m.isDemo),
    });

    AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(updatedSlots)).catch(() => {});
    AsyncStorage.setItem(STORAGE_KEYS.CIRCLE_ROSTERS, JSON.stringify(updatedRosters)).catch(() => {});
    AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_CIRCLE, JSON.stringify(updatedCircle)).catch(() => {});
    AsyncStorage.setItem(STORAGE_KEYS.CIRCLES, JSON.stringify(updatedCircles)).catch(() => {});
    AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory)).catch(() => {});
    return true;
  },

  removePlayerFromActiveCircle: (slotId: string) => {
    const { slots, activeCircle, circleRosters, circles, history } = get();
    if (slots.length <= 2) return false;

    // Remove demo test data for this circle when user removes a person!
    const updatedHistory = history.filter(
      (m) => !(m.isDemo && (m.circleId === activeCircle.id || (!m.circleId && activeCircle.id === '1')))
    );
    const realDecisions = updatedHistory.filter((m) => m.circleId === activeCircle.id).length;

    const updatedSlots = slots.filter((s) => s.id !== slotId);
    const updatedRosters = {
      ...circleRosters,
      [activeCircle.id]: updatedSlots,
    };
    const updatedCircle: CircleGroup = {
      ...activeCircle,
      members: updatedSlots.length,
      decisions: realDecisions,
    };
    const updatedCircles = circles.map((c) =>
      c.id === activeCircle.id ? updatedCircle : c
    );

    set({
      slots: updatedSlots,
      circleRosters: updatedRosters,
      activeCircle: updatedCircle,
      circles: updatedCircles,
      history: updatedHistory,
      hasDemoData: updatedHistory.some((m) => m.isDemo),
    });

    AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(updatedSlots)).catch(() => {});
    AsyncStorage.setItem(STORAGE_KEYS.CIRCLE_ROSTERS, JSON.stringify(updatedRosters)).catch(() => {});
    AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_CIRCLE, JSON.stringify(updatedCircle)).catch(() => {});
    AsyncStorage.setItem(STORAGE_KEYS.CIRCLES, JSON.stringify(updatedCircles)).catch(() => {});
    AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory)).catch(() => {});
    return true;
  },

  clearDemoData: () => {
    set((state) => {
      const cleanHistory = state.history.filter((m) => !m.isDemo);
      const updatedCircles = state.circles.map((c) => ({
        ...c,
        decisions: cleanHistory.filter((m) => m.circleId === c.id).length,
      }));
      const updatedActiveCircle = {
        ...state.activeCircle,
        decisions: cleanHistory.filter((m) => m.circleId === state.activeCircle.id).length,
      };

      // Reset default slots to clean unopinionated Player A, B, C, D
      const cleanSlots = [0, 1, 2, 3].map((idx) => {
        const color = playerColors[idx % playerColors.length];
        return {
          id: `slot-${idx + 1}`,
          colorId: color.id,
          colorHex: color.main,
          contrastText: color.contrastText,
          name: `Player ${String.fromCharCode(65 + idx)}`,
          avatarKey: `AV-0${idx + 1}`,
          isActive: true,
        };
      });

      const updatedRosters = {
        ...state.circleRosters,
        [state.activeCircle.id]: cleanSlots,
      };

      AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(cleanHistory)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.CIRCLES, JSON.stringify(updatedCircles)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_CIRCLE, JSON.stringify(updatedActiveCircle)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(cleanSlots)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.CIRCLE_ROSTERS, JSON.stringify(updatedRosters)).catch(() => {});

      return {
        history: cleanHistory,
        circles: updatedCircles,
        activeCircle: updatedActiveCircle,
        slots: cleanSlots,
        circleRosters: updatedRosters,
        hasDemoData: false,
      };
    });
  },

  removeDemoDataForCircle: (circleId: string) => {
    set((state) => {
      const updatedHistory = state.history.filter(
        (m) => !(m.isDemo && (m.circleId === circleId || (!m.circleId && circleId === '1')))
      );
      const realDecisions = updatedHistory.filter((m) => m.circleId === circleId).length;
      const updatedCircles = state.circles.map((c) =>
        c.id === circleId ? { ...c, decisions: realDecisions } : c
      );
      const updatedActiveCircle =
        state.activeCircle.id === circleId
          ? { ...state.activeCircle, decisions: realDecisions }
          : state.activeCircle;

      AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.CIRCLES, JSON.stringify(updatedCircles)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_CIRCLE, JSON.stringify(updatedActiveCircle)).catch(() => {});

      return {
        history: updatedHistory,
        circles: updatedCircles,
        activeCircle: updatedActiveCircle,
        hasDemoData: updatedHistory.some((m) => m.isDemo),
      };
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
      isDemo: false,
    };

    set((state) => {
      // Remove demo test matches for this circle when a real live game is completed
      const cleanHistory = state.history.filter(
        (m) => !(m.isDemo && (m.circleId === activeCircle.id || (!m.circleId && activeCircle.id === '1')))
      );
      const updatedHistory = [enrichedResult, ...cleanHistory];
      AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory)).catch(() => {});

      const realCircleMatches = updatedHistory.filter((m) => m.circleId === activeCircle.id);
      const updatedCircles = state.circles.map((c) =>
        c.id === activeCircle.id ? { ...c, decisions: realCircleMatches.length } : c
      );
      const updatedActiveCircle = { ...activeCircle, decisions: realCircleMatches.length };

      AsyncStorage.setItem(STORAGE_KEYS.CIRCLES, JSON.stringify(updatedCircles)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_CIRCLE, JSON.stringify(updatedActiveCircle)).catch(() => {});

      return {
        lastResult: enrichedResult,
        history: updatedHistory,
        circles: updatedCircles,
        activeCircle: updatedActiveCircle,
        hasDemoData: updatedHistory.some((m) => m.isDemo),
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
    const newSlots = [0, 1, 2, 3].map((idx) => {
      const color = playerColors[idx % playerColors.length];
      return {
        id: `slot-${idx + 1}`,
        colorId: color.id,
        colorHex: color.main,
        contrastText: color.contrastText,
        name: `Player ${String.fromCharCode(65 + idx)}`,
        avatarKey: `AV-0${idx + 1}`,
        isActive: true,
      };
    });

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
    set((state) => {
      const existingRoster = state.circleRosters[circleId];
      if (existingRoster && existingRoster.length > 0) {
        AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(existingRoster)).catch(() => {});
        return { slots: existingRoster };
      }
      const freshRoster = createRosterForCircle(circleId);
      const updatedRosters = {
        ...state.circleRosters,
        [circleId]: freshRoster,
      };
      AsyncStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(freshRoster)).catch(() => {});
      AsyncStorage.setItem(STORAGE_KEYS.CIRCLE_ROSTERS, JSON.stringify(updatedRosters)).catch(() => {});
      return { slots: freshRoster, circleRosters: updatedRosters };
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
        ...(savedHistory
          ? {
              history: JSON.parse(savedHistory),
              hasDemoData: JSON.parse(savedHistory).some((m: MatchResult) => m.isDemo),
            }
          : {}),
        ...(savedCircles ? { circles: JSON.parse(savedCircles) } : {}),
        ...(savedActiveCircle ? { activeCircle: JSON.parse(savedActiveCircle) } : {}),
        ...(savedRosters ? { circleRosters: JSON.parse(savedRosters) } : {}),
      });
    } catch {
      // Graceful fallback to in-memory defaults
    }
  },
}));
