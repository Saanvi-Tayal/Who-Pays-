import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, Vibration } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { AnimatedPressable } from '@/components/buttons/AnimatedPressable';
import { AvatarImage } from '@/components/avatars/AvatarImage';
import { BombSvg } from '@/components/illustrations/GameArtSvg';
import {
  createTimeBombState,
  startTimeBomb,
  passTimeBomb,
  tickTimeBomb,
  TimeBombState,
} from '@/features/games/timeBomb/timeBombEngine';
import { useSessionStore } from '@/features/session/sessionStore';
import { RootStackScreenProps } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { triggerHaptic } from '@/utils/haptics';

export const TimeBombArenaScreen: React.FC<RootStackScreenProps<'TimeBombArena'>> = ({
  navigation,
}) => {
  const { slots, recordMatchResult, selectedMode, selectedCategory } = useSessionStore();
  const activeSlots = slots.filter((s) => s.isActive);
  const players = activeSlots.length >= 2 ? activeSlots : slots;

  // Initialize engine state with player-count scaled randomized fuse
  const [gameState, setGameState] = useState<TimeBombState>(() =>
    createTimeBombState(players)
  );

  // Reanimated shared values
  const bombScale = useSharedValue(1);
  const bombShake = useSharedValue(0);
  const flashOpacity = useSharedValue(0);

  // Ref for tick timer
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasFinishedRef = useRef(false);

  const currentHolder = players[gameState.currentHolderIndex] || players[0];
  const nextHolder = players[(gameState.currentHolderIndex + 1) % players.length];

  // Animated styles
  const animatedBombStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: bombScale.value },
      { translateX: bombShake.value },
    ],
  }));

  const animatedFlashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  useEffect(() => {
    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    };
  }, []);

  // Handle Explosion
  const handleExplode = useCallback(
    (finalState: TimeBombState) => {
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;

      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }

      // Dramatic explosion animations
      bombScale.value = withSequence(
        withTiming(1.4, { duration: 150 }),
        withTiming(0, { duration: 300 })
      );
      flashOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 500 })
      );

      triggerHaptic('error');
      Vibration.vibrate([0, 100, 80, 200]);

      // Record match outcome
      const loserId = finalState.loserSlotId || currentHolder.id;
      recordMatchResult({
        id: `time-bomb-${Date.now()}`,
        gameId: 'time_bomb',
        stakesModeId: selectedMode,
        dilemma: selectedCategory || 'Who Pays?',
        loserSlotId: loserId,
        winnerSlotIds: players.filter((p) => p.id !== loserId).map((p) => p.id),
        metrics: {
          fuseDurationSecs: Math.round(finalState.fuseDurationMs / 1000),
          totalPasses: finalState.passCount,
          timeHeldPerSlot: finalState.timeHeldPerSlot,
        },
        createdAt: Date.now(),
      });

      // Navigate to verdict after dramatic explosion beat
      setTimeout(() => {
        navigation.navigate('Verdict');
      }, 1600);
    },
    [bombScale, currentHolder.id, flashOpacity, navigation, players, recordMatchResult, selectedCategory, selectedMode]
  );

  // Start the fuse
  const handleStartFuse = () => {
    triggerHaptic('medium');
    const started = startTimeBomb(gameState);
    setGameState(started);

    // Initial bomb pulse
    bombScale.value = withRepeat(
      withTiming(1.06, { duration: 500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Run active game loop every 100ms
    tickIntervalRef.current = setInterval(() => {
      setGameState((prev) => {
        const next = tickTimeBomb(prev, 100, players);

        // Warning phase vibration & accelerated shake
        if (next.phase === 'warning') {
          bombShake.value = withSequence(
            withTiming(-8, { duration: 40 }),
            withTiming(8, { duration: 40 }),
            withTiming(0, { duration: 40 })
          );
          if (next.timeRemainingMs % 600 < 100) {
            triggerHaptic('heavy');
          }
        }

        // Exploded
        if (next.phase === 'exploded') {
          handleExplode(next);
        }

        return next;
      });
    }, 100);
  };

  // Pass bomb to next player
  const handlePass = () => {
    if (gameState.phase !== 'active' && gameState.phase !== 'warning') return;

    triggerHaptic('selection');
    const passed = passTimeBomb(gameState, players.length);
    setGameState(passed);

    // Bounce on pass
    bombScale.value = withSequence(
      withSpring(1.18),
      withTiming(1.06)
    );
  };

  const getStatusPillText = () => {
    if (gameState.phase === 'ready') return '💣 READY TO START';
    if (gameState.phase === 'warning') return '💥 FUSE CRITICAL! PASS! 💥';
    if (gameState.phase === 'exploded') return '💀 BOOM! EXPLODED!';
    return '🔥 SECRET FUSE TICKING...';
  };

  return (
    <ScreenContainer style={styles.container}>
      {/* Fullscreen Flash overlay for explosion */}
      <Animated.View
        pointerEvents="none"
        style={[styles.fullscreenFlash, animatedFlashStyle]}
      />

      {/* Top Header Bar with Stakes Back & Lobby Buttons */}
      <View style={styles.topArea}>
        <AnimatedPressable
          onPress={() => {
            triggerHaptic('light');
            if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
            navigation.navigate('Stakes');
          }}
          style={styles.navButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Back to Stakes"
        >
          <ThemedText style={styles.navButtonText}>‹ Stakes</ThemedText>
        </AnimatedPressable>

        {/* Secret Suspense Status Pill (NO numerical countdown, 100% secret) */}
        <View
          style={[
            styles.timerPill,
            gameState.phase === 'warning' && styles.timerPillWarning,
          ]}
        >
          <ThemedText
            variant="caption"
            style={[
              styles.timerText,
              gameState.phase === 'warning' && { color: colors.danger, fontWeight: '900' },
            ]}
          >
            {getStatusPillText()}
          </ThemedText>
        </View>

        <AnimatedPressable
          onPress={() => {
            triggerHaptic('light');
            if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
            navigation.navigate('GameLobby');
          }}
          style={styles.navButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Exit to Lobby"
        >
          <ThemedText style={styles.navButtonText}>Lobby 🎮</ThemedText>
        </AnimatedPressable>
      </View>

      {/* Center Giant Bomb Arena Area */}
      <View style={styles.bombContainer}>
        {/* Ambient Blast Rays Glow */}
        <View
          style={[
            styles.blastRaysGlow,
            gameState.phase === 'warning' && styles.blastRaysGlowWarning,
          ]}
        />

        {/* Animated Giant Bomb Illustration */}
        <Animated.View style={[styles.bombWrapper, animatedBombStyle]}>
          <BombSvg size={210} />
        </Animated.View>

        {/* Current Holder Card */}
        <View
          style={[
            styles.holderCard,
            { borderColor: currentHolder.colorHex },
            gameState.phase === 'warning' && styles.holderCardWarning,
          ]}
        >
          <AvatarImage
            avatarKey={currentHolder.avatarKey || 'AV-01'}
            name={currentHolder.name}
            size={46}
            borderColor={currentHolder.colorHex}
            borderWidth={2}
          />
          <View style={styles.holderInfo}>
            <ThemedText variant="caption" style={styles.holderLabel}>
              HOLDING THE PHONE:
            </ThemedText>
            <ThemedText
              variant="heading2"
              style={[styles.holderName, { color: currentHolder.colorHex }]}
            >
              {currentHolder.name}
            </ThemedText>
          </View>

          {/* Pass counter badge */}
          <View style={styles.passCountBadge}>
            <ThemedText style={styles.passCountText}>
              {gameState.passCount} {gameState.passCount === 1 ? 'pass' : 'passes'}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Bottom Action Area */}
      <View style={styles.bottomArea}>
        {gameState.phase === 'ready' && (
          <PrimaryButton
            label="Light Secret Fuse! 🔥"
            variant="primary"
            onPress={handleStartFuse}
            style={styles.actionButton}
          />
        )}

        {(gameState.phase === 'active' || gameState.phase === 'warning') && (
          <PrimaryButton
            label={`Pass to ${nextHolder.name} ➡️`}
            variant="primary"
            onPress={handlePass}
            style={[
              styles.actionButton,
              gameState.phase === 'warning' && { backgroundColor: colors.danger },
            ]}
          />
        )}

        {gameState.phase === 'exploded' && (
          <ThemedText variant="heading2" style={styles.explodedNotice}>
            💥 {currentHolder.name} WAS CAUGHT! 💥
          </ThemedText>
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: spacing.xxl,
  },
  fullscreenFlash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFFFF',
    zIndex: 99,
  },
  topArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: spacing.md,
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  navButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  timerPill: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    shadowColor: colors.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  timerPillWarning: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(255, 23, 68, 0.2)',
    shadowColor: colors.danger,
    shadowOpacity: 0.8,
  },
  timerText: {
    color: colors.textPrimary,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  bombContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  blastRaysGlow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 46, 147, 0.15)',
    shadowColor: colors.accentPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 50,
  },
  blastRaysGlowWarning: {
    backgroundColor: 'rgba(255, 23, 68, 0.3)',
    shadowColor: colors.danger,
    shadowRadius: 70,
  },
  bombWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  holderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
    width: '100%',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  holderCardWarning: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(255, 23, 68, 0.15)',
  },
  holderInfo: {
    flex: 1,
  },
  holderLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  holderName: {
    fontWeight: '900',
    fontSize: 18,
    marginTop: 2,
  },
  passCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  passCountText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  bottomArea: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionButton: {
    width: '100%',
    height: 56,
  },
  explodedNotice: {
    color: colors.danger,
    fontWeight: '900',
    fontSize: 20,
    textAlign: 'center',
  },
});
