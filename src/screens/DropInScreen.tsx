import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  GestureResponderEvent,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { AnimatedPressable } from '@/components/buttons/AnimatedPressable';
import { CrownDoodle, CentralStarburst, PointingHandSvg } from '@/components/illustrations/DoodlesSvg';
import { useSessionStore, PlayerSlot } from '@/features/session/sessionStore';
import { RootStackScreenProps } from '@/navigation/types';
import { colors, playerColors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { triggerHaptic } from '@/utils/haptics';

interface TouchBlob {
  id: string;
  x: number;
  y: number;
  colorHex: string;
  slotIndex: number;
}

const HOLD_DURATION_MS = 2000; // 2 seconds hold-to-lock

const DEFAULT_ALPHABET_NAMES = [
  'Player A',
  'Player B',
  'Player C',
  'Player D',
  'Player E',
  'Player F',
  'Player G',
  'Player H',
];

export const DropInScreen: React.FC<RootStackScreenProps<'DropIn'>> = ({ navigation }) => {
  const { setRegisteredSlots } = useSessionStore();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Active touch points for UI rendering
  const [activeTouches, setActiveTouches] = useState<TouchBlob[]>([]);
  // Hold progress (0 to 1)
  const [holdProgress, setHoldProgress] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Refs to prevent state update loops
  const touchesRef = useRef<TouchBlob[]>([]);
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const isLockedRef = useRef(false);

  // Reanimated shared values
  const pulseAnim = useSharedValue(1);
  const lockScaleAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withTiming(1.08, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    return () => {
      if (holdTimerRef.current) clearInterval(holdTimerRef.current);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [pulseAnim]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const lockStyle = useAnimatedStyle(() => ({
    transform: [{ scale: lockScaleAnim.value }],
  }));

  // Complete lock and transition to PlayerSetup
  const completeLock = useCallback(
    (touchesToRegister: TouchBlob[]) => {
      if (isLockedRef.current) return;
      isLockedRef.current = true;
      setIsLocked(true);

      lockScaleAnim.value = withSpring(1.25, {}, () => {
        lockScaleAnim.value = withTiming(1);
      });
      triggerHaptic('success');

      // If no touches were recorded (e.g. user tapped quick skip), register default 4 players
      const validTouches = touchesToRegister.length >= 2
        ? touchesToRegister
        : [
            { id: '1', x: 0, y: 0, colorHex: playerColors[0].main, slotIndex: 0 },
            { id: '2', x: 0, y: 0, colorHex: playerColors[1].main, slotIndex: 1 },
            { id: '3', x: 0, y: 0, colorHex: playerColors[4].main, slotIndex: 2 },
            { id: '4', x: 0, y: 0, colorHex: playerColors[6].main, slotIndex: 3 },
          ];

      const registered: PlayerSlot[] = validTouches.map((t, idx) => {
        const colorPalette = playerColors[idx % playerColors.length];
        const assignedName = DEFAULT_ALPHABET_NAMES[idx] || `Player ${String.fromCharCode(65 + idx)}`;
        const avatarKey = `AV-0${(idx % 12) + 1}`;

        return {
          id: `slot-${idx + 1}`,
          colorId: colorPalette.id,
          colorHex: colorPalette.main,
          contrastText: colorPalette.contrastText,
          name: assignedName,
          avatarKey,
          isActive: true,
        };
      });

      setRegisteredSlots(registered);

      setTimeout(() => {
        navigation.navigate('PlayerSetup');
      }, 350);
    },
    [lockScaleAnim, navigation, setRegisteredSlots]
  );

  // Stop hold timer
  const stopHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    holdStartTimeRef.current = null;
    setHoldProgress(0);
  }, []);

  // Start hold timer
  const startHoldTimer = useCallback(() => {
    if (holdTimerRef.current || isLockedRef.current) return;

    holdStartTimeRef.current = Date.now();
    triggerHaptic('medium');

    holdTimerRef.current = setInterval(() => {
      if (!holdStartTimeRef.current || isLockedRef.current) return;

      const elapsed = Date.now() - holdStartTimeRef.current;
      const progress = Math.min(1, elapsed / HOLD_DURATION_MS);
      setHoldProgress(progress);

      if (progress >= 1) {
        if (holdTimerRef.current) {
          clearInterval(holdTimerRef.current);
          holdTimerRef.current = null;
        }
        completeLock(touchesRef.current);
      }
    }, 40);
  }, [completeLock]);

  // Sync touch count to hold timer without causing render loops
  const syncTouchState = useCallback(
    (newTouches: TouchBlob[]) => {
      touchesRef.current = newTouches;

      // Throttle UI re-render to requestAnimationFrame
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          setActiveTouches([...touchesRef.current]);
          rafIdRef.current = null;
        });
      }

      // Timer logic
      const count = newTouches.length;
      if (count >= 2 && count <= 8 && !isLockedRef.current) {
        startHoldTimer();
      } else {
        stopHoldTimer();
      }
    },
    [startHoldTimer, stopHoldTimer]
  );

  // Native multi-touch handlers
  const handleTouch = (e: GestureResponderEvent) => {
    if (isLockedRef.current) return;
    const rawTouches = e.nativeEvent.touches;
    if (!rawTouches) return;

    const capped = rawTouches.slice(0, 8);
    const mapped: TouchBlob[] = capped.map((touch, index) => {
      const palette = playerColors[index % playerColors.length];
      return {
        id: String(touch.identifier ?? index),
        x: touch.locationX,
        y: touch.locationY,
        colorHex: palette.main,
        slotIndex: index,
      };
    });

    syncTouchState(mapped);
  };

  const handleTouchEnd = (e: GestureResponderEvent) => {
    if (isLockedRef.current) return;
    const rawTouches = e.nativeEvent.touches;

    if (!rawTouches || rawTouches.length === 0) {
      syncTouchState([]);
      return;
    }

    const capped = rawTouches.slice(0, 8);
    const mapped: TouchBlob[] = capped.map((touch, index) => {
      const palette = playerColors[index % playerColors.length];
      return {
        id: String(touch.identifier ?? index),
        x: touch.locationX,
        y: touch.locationY,
        colorHex: palette.main,
        slotIndex: index,
      };
    });

    syncTouchState(mapped);
  };

  // Web / Quick Testing: simulate fingers
  const simulateFingers = (count: number) => {
    const cx = windowWidth / 2;
    const cy = windowHeight / 2 - 30;
    const radius = 100;

    const simulated: TouchBlob[] = Array.from({ length: count }).map((_, idx) => {
      const angle = (idx * (360 / count) - 90) * (Math.PI / 180);
      const palette = playerColors[idx % playerColors.length];
      return {
        id: `sim-${idx}`,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        colorHex: palette.main,
        slotIndex: idx,
      };
    });

    syncTouchState(simulated);
  };

  const clearSimulation = () => {
    isLockedRef.current = false;
    setIsLocked(false);
    syncTouchState([]);
  };

  // Status prompt
  const renderStatusPrompt = () => {
    if (isLocked) {
      return (
        <ThemedText style={styles.lockedPromptText}>
          🎉 Group Locked! Moving to setup...
        </ThemedText>
      );
    }
    if (activeTouches.length === 0) {
      return (
        <ThemedText style={styles.waitingPromptText}>
          {"Let's decide together ✨"}
        </ThemedText>
      );
    }
    if (activeTouches.length === 1) {
      return (
        <ThemedText style={styles.warningPromptText}>
          👆 1 finger down. Place 1 more friend! (2–8)
        </ThemedText>
      );
    }
    const remainingSecs = Math.max(0, (HOLD_DURATION_MS * (1 - holdProgress)) / 1000).toFixed(1);
    return (
      <ThemedText style={styles.holdingPromptText}>
        🔥 HOLD TOGETHER! {remainingSecs}s
      </ThemedText>
    );
  };

  return (
    <ScreenContainer style={styles.container}>
      {/* Top Navigation Bar with Direct Skip Button */}
      <View style={styles.topNavbar}>
        <View style={styles.logoRow}>
          <CrownDoodle size={28} color="#FFB800" />
          <ThemedText style={styles.miniLogoText}>Who Pays?</ThemedText>
        </View>

        {/* Immediate navigation button so nobody is ever stuck */}
        <AnimatedPressable
          onPress={() => {
            triggerHaptic('light');
            completeLock(touchesRef.current);
          }}
          style={styles.skipButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ThemedText style={styles.skipButtonText}>
            Setup Players 👥 ›
          </ThemedText>
        </AnimatedPressable>
      </View>

      {/* Full-bleed Multi-Touch Canvas */}
      <View
        style={styles.touchCanvas}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleTouch}
        onResponderMove={handleTouch}
        onResponderRelease={handleTouchEnd}
        onResponderTerminate={handleTouchEnd}
      >
        {/* Header Title */}
        <View style={styles.titleSection} pointerEvents="none">
          <ThemedText variant="display" style={styles.touchTitle}>
            Everyone,
          </ThemedText>
          <ThemedText variant="display" style={styles.touchTitle}>
            touch the screen!
          </ThemedText>
        </View>

        {/* Center Starlight Vortex & Blobs */}
        <View style={styles.centerContainer} pointerEvents="none">
          <Animated.View style={[styles.starburstWrapper, pulseStyle, lockStyle]}>
            <CentralStarburst size={260} />
          </Animated.View>

          {/* When 0 touches: decorative cartoon hands pointing into center */}
          {activeTouches.length === 0 && (
            <View style={styles.handsContainer}>
              <View style={[styles.handWrapper, { top: -35, left: -15 }]}>
                <PointingHandSvg color="#FF4081" rotation={135} scale={1.05} />
              </View>
              <View style={[styles.handWrapper, { top: -25, right: -10 }]}>
                <PointingHandSvg color="#FFB300" rotation={-140} scale={1.05} />
              </View>
              <View style={[styles.handWrapper, { bottom: -25, left: -10 }]}>
                <PointingHandSvg color="#00E5FF" rotation={45} scale={1.05} />
              </View>
              <View style={[styles.handWrapper, { bottom: -30, right: -10 }]}>
                <PointingHandSvg color="#7C4DFF" rotation={-40} scale={1.05} />
              </View>
            </View>
          )}

          {/* Progress Hold Ring when 2+ fingers are placed */}
          {activeTouches.length >= 2 && (
            <View style={styles.progressRingWrapper}>
              <View style={styles.progressRingBackdrop}>
                <ThemedText style={styles.progressPercentText}>
                  {Math.round(holdProgress * 100)}%
                </ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Dynamic Registered Finger Blobs at touch coordinates */}
        {activeTouches.map((touch) => (
          <View
            key={touch.id}
            pointerEvents="none"
            style={[
              styles.touchBlob,
              {
                left: touch.x - 42,
                top: touch.y - 42,
                backgroundColor: touch.colorHex,
                shadowColor: touch.colorHex,
              },
            ]}
          >
            <View style={[styles.touchBlobOuterRing, { borderColor: touch.colorHex }]} />
            <ThemedText style={styles.touchBlobLabel}>
              {DEFAULT_ALPHABET_NAMES[touch.slotIndex] || `P${touch.slotIndex + 1}`}
            </ThemedText>
          </View>
        ))}

        {/* Status Prompt */}
        <View style={styles.statusPromptContainer} pointerEvents="none">
          {renderStatusPrompt()}
        </View>
      </View>

      {/* Simulator Toolbar & Bottom Stepper */}
      <View style={styles.bottomSection}>
        {/* Testing pills */}
        <View style={styles.simulatorToolbar}>
          <ThemedText variant="caption" style={styles.simLabel}>
            {Platform.OS === 'web' ? 'Simulator:' : 'Quick Add:'}
          </ThemedText>
          <AnimatedPressable
            onPress={() => simulateFingers(4)}
            style={styles.simChip}
          >
            <ThemedText variant="caption" style={styles.simChipText}>
              + 4 Friends
            </ThemedText>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => simulateFingers(6)}
            style={styles.simChip}
          >
            <ThemedText variant="caption" style={styles.simChipText}>
              + 6 Friends
            </ThemedText>
          </AnimatedPressable>
          {activeTouches.length > 0 && (
            <AnimatedPressable
              onPress={clearSimulation}
              style={[styles.simChip, styles.simClearChip]}
            >
              <ThemedText variant="caption" style={styles.simClearText}>
                Clear
              </ThemedText>
            </AnimatedPressable>
          )}
        </View>

        {/* Bottom Stepper Roadmap matching Reference */}
        <View style={styles.stepperFooter}>
          <ThemedText style={styles.stepperText}>
            1. Join → 2. Choose a Dilemma
          </ThemedText>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D0618',
    justifyContent: 'space-between',
  },
  topNavbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    zIndex: 30,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniLogoText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: -0.3,
  },
  skipButton: {
    backgroundColor: 'rgba(255, 64, 129, 0.2)',
    borderWidth: 1.5,
    borderColor: '#FF4081',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  skipButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  touchCanvas: {
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  titleSection: {
    alignItems: 'center',
    zIndex: 10,
    marginTop: spacing.xs,
  },
  touchTitle: {
    color: '#FFF9F0',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(255, 64, 129, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 280,
    position: 'relative',
  },
  starburstWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  handsContainer: {
    position: 'absolute',
    width: 260,
    height: 260,
  },
  handWrapper: {
    position: 'absolute',
  },
  progressRingWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingBackdrop: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(13, 6, 24, 0.9)',
    borderWidth: 3,
    borderColor: '#FF4081',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF4081',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 8,
  },
  progressPercentText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '900',
  },
  touchBlob: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 18,
    elevation: 12,
    zIndex: 20,
  },
  touchBlobOuterRing: {
    position: 'absolute',
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 2,
    borderStyle: 'dashed',
    opacity: 0.7,
  },
  touchBlobLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statusPromptContainer: {
    alignItems: 'center',
    marginBottom: spacing.xs,
    zIndex: 10,
  },
  waitingPromptText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  warningPromptText: {
    color: '#FFB800',
    fontSize: 13,
    fontWeight: '700',
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  holdingPromptText: {
    color: '#FF4081',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
    backgroundColor: 'rgba(255, 64, 129, 0.18)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#FF4081',
  },
  lockedPromptText: {
    color: '#00E5FF',
    fontSize: 15,
    fontWeight: '900',
  },
  bottomSection: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  simulatorToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(30, 18, 51, 0.85)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  simLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    marginRight: 4,
  },
  simChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  simChipText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  simClearChip: {
    backgroundColor: 'rgba(233, 75, 91, 0.25)',
  },
  simClearText: {
    color: '#FF6B6B',
    fontSize: 11,
    fontWeight: '700',
  },
  stepperFooter: {
    alignItems: 'center',
    marginTop: 2,
  },
  stepperText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
