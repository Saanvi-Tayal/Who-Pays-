import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { AnimatedPressable } from '@/components/buttons/AnimatedPressable';
import { AvatarImage } from '@/components/avatars/AvatarImage';
import { useSessionStore } from '@/features/session/sessionStore';
import { RootStackScreenProps } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { triggerHaptic } from '@/utils/haptics';
import {
  createReactionState,
  playerPressPad,
  playerReleasePad,
  tickReactionWait,
} from '@/features/games/reactionStandoff/reactionEngine';
import type { ReactionStandoffState } from '@/features/games/reactionStandoff/reactionEngine';

export const ReactionStandoffArenaScreen: React.FC<RootStackScreenProps<'ReactionStandoffArena'>> = ({
  navigation,
}) => {
  const { slots, selectedMode, recordMatchResult } = useSessionStore();
  const activePlayers = slots.filter((s) => s.isActive);
  const activeIds = activePlayers.map((p) => p.id);

  // Engine state
  const [gameState, setGameState] = useState<ReactionStandoffState>(() =>
    createReactionState(activePlayers)
  );

  // Reanimated values for pulse & radar
  const pulseScale = useSharedValue(1);
  const flashOpacity = useSharedValue(0);

  // Timer reference
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animate center radar depending on phase
  useEffect(() => {
    if (gameState.phase === 'waiting') {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.96, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else if (gameState.phase === 'flashed') {
      flashOpacity.value = withSequence(
        withTiming(1, { duration: 80 }),
        withTiming(0.35, { duration: 200 })
      );
    }
  }, [gameState.phase, pulseScale, flashOpacity]);

  // Interval loop for ticking waiting and flash timeout
  useEffect(() => {
    if (gameState.phase === 'waiting' || gameState.phase === 'flashed') {
      timerRef.current = setInterval(() => {
        setGameState((prev) => {
          const next = tickReactionWait(prev, 50, activeIds, Date.now());
          if (next.phase === 'flashed' && prev.phase === 'waiting') {
            triggerHaptic('heavy');
          }
          return next;
        });
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.phase, activeIds]);

  // Handle pad touch press down
  const handlePressIn = useCallback(
    (slotId: string) => {
      if (gameState.phase !== 'ready' && gameState.phase !== 'waiting') return;
      triggerHaptic('light');
      setGameState((prev) => playerPressPad(prev, slotId, activeIds));
    },
    [gameState.phase, activeIds]
  );

  // Handle pad touch release
  const handlePressOut = useCallback(
    (slotId: string) => {
      if (gameState.phase === 'ready') {
        setGameState((prev) => playerReleasePad(prev, slotId, Date.now(), activeIds));
        return;
      }
      if (gameState.phase === 'waiting') {
        // FALSE START!
        triggerHaptic('heavy');
        setGameState((prev) => playerReleasePad(prev, slotId, Date.now(), activeIds));
        return;
      }
      if (gameState.phase === 'flashed') {
        triggerHaptic('medium');
        setGameState((prev) => playerReleasePad(prev, slotId, Date.now(), activeIds));
      }
    },
    [gameState.phase, activeIds]
  );

  // Simulator helper: press all pads at once
  const handleSimulateHoldAll = () => {
    triggerHaptic('medium');
    let s = gameState;
    activeIds.forEach((id) => {
      s = playerPressPad(s, id, activeIds);
    });
    setGameState(s);
  };

  // Simulator helper: staggered realistic reaction release
  const handleSimulateReleases = () => {
    if (gameState.phase !== 'flashed') return;
    const now = Date.now();
    let s = gameState;
    // Release in staggered reaction times: e.g. 185ms, 230ms, 290ms, 430ms
    activeIds.forEach((id, index) => {
      const staggerDelta = 180 + index * 85;
      s = playerReleasePad(s, id, now + staggerDelta, activeIds);
    });
    setGameState(s);
  };

  // Transition to Verdict screen with structured result
  const handleGoToVerdict = () => {
    const loserId = gameState.loserSlotId || activeIds[0];
    const winnerIds = activeIds.filter((id) => id !== loserId);

    recordMatchResult({
      id: `reaction-${Date.now()}`,
      gameId: 'reaction_standoff',
      stakesModeId: selectedMode,
      loserSlotId: loserId,
      winnerSlotIds: winnerIds,
      createdAt: Date.now(),
    });

    triggerHaptic('selection');
    navigation.navigate('Verdict');
  };

  // Animated styles
  const radarAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const flashOverlayStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  const getStatusText = () => {
    switch (gameState.phase) {
      case 'ready':
        return 'Hold your corner pad to begin!';
      case 'waiting':
        return 'READY... WAIT FOR THE GREEN FLASH!';
      case 'flashed':
        return '⚡ RELEASE NOW! ⚡';
      case 'false_start': {
        const falseStarter = activePlayers.find((p) => p.id === gameState.falseStartSlotId);
        return `💥 FALSE START! ${falseStarter?.name || 'Player'} released too early!`;
      }
      case 'finished': {
        const loser = activePlayers.find((p) => p.id === gameState.loserSlotId);
        return `💀 ${loser?.name || 'Player'} was the slowest!`;
      }
      default:
        return 'Hold your corner!';
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      {/* Green Flash Visual Overlay */}
      <Animated.View
        pointerEvents="none"
        style={[styles.flashFullScreen, flashOverlayStyle]}
      />

      {/* Top Header with Stakes Back & Lobby Buttons */}
      <View style={styles.topNavRow}>
        <AnimatedPressable
          onPress={() => {
            triggerHaptic('light');
            navigation.navigate('Stakes');
          }}
          style={styles.exitButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Back to Stakes"
        >
          <ThemedText style={styles.exitButtonText}>‹ Stakes</ThemedText>
        </AnimatedPressable>

        <ThemedText variant="heading2" style={styles.title}>
          Reaction Standoff
        </ThemedText>

        <AnimatedPressable
          onPress={() => {
            triggerHaptic('light');
            navigation.navigate('GameLobby');
          }}
          style={styles.exitButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Exit to Lobby"
        >
          <ThemedText style={styles.exitButtonText}>Lobby 🎮</ThemedText>
        </AnimatedPressable>
      </View>

      {/* Subtitle Status */}
      <View style={styles.statusPill}>
        <ThemedText
          variant="caption"
          style={[
            styles.statusText,
            gameState.phase === 'flashed' && { color: colors.accentMint, fontWeight: '900' },
            gameState.phase === 'false_start' && { color: colors.danger, fontWeight: '900' },
          ]}
        >
          {getStatusText()}
        </ThemedText>
      </View>

      {/* Radar Center Signal */}
      <View style={styles.radarContainer}>
        <Animated.View
          style={[
            styles.radarCore,
            radarAnimStyle,
            gameState.phase === 'waiting' && styles.radarWaiting,
            gameState.phase === 'flashed' && styles.radarFlashed,
            gameState.phase === 'false_start' && styles.radarFalseStart,
          ]}
        >
          {gameState.phase === 'ready' && <ThemedText style={styles.radarIcon}>🎯</ThemedText>}
          {gameState.phase === 'waiting' && <ThemedText style={styles.radarIcon}>⏳</ThemedText>}
          {gameState.phase === 'flashed' && <ThemedText style={styles.radarIcon}>⚡</ThemedText>}
          {gameState.phase === 'false_start' && <ThemedText style={styles.radarIcon}>💥</ThemedText>}
          {gameState.phase === 'finished' && <ThemedText style={styles.radarIcon}>🏁</ThemedText>}
          <ThemedText style={styles.radarLabel}>
            {gameState.phase === 'flashed'
              ? 'RELEASE!'
              : gameState.phase === 'waiting'
              ? 'HOLD...'
              : gameState.phase === 'false_start'
              ? 'BUSTED'
              : 'READY'}
          </ThemedText>
        </Animated.View>
      </View>

      {/* Interactive Corner Touch Pads */}
      <View style={styles.padsGrid}>
        {activePlayers.map((player) => {
          const info = gameState.players[player.id];
          const isHolding = info?.holding;
          const isReleased = info?.released;
          const isFalseStart = info?.isFalseStart;
          const reactionMs = info?.reactionTimeMs;
          const isSlowest = gameState.slowestSlotId === player.id;
          const isFastest = gameState.fastestSlotId === player.id;

          return (
            <Pressable
              key={player.id}
              onPressIn={() => handlePressIn(player.id)}
              onPressOut={() => handlePressOut(player.id)}
              style={({ pressed }) => [
                styles.playerPad,
                { borderColor: player.colorHex },
                isHolding && styles.playerPadHolding,
                pressed && { transform: [{ scale: 0.97 }] },
                isFalseStart && styles.playerPadFalseStart,
                isSlowest && gameState.phase === 'finished' && styles.playerPadSlowest,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Touch zone for ${player.name}`}
            >
              <View style={styles.padHeader}>
                <AvatarImage
                  avatarKey={player.avatarKey || 'AV-01'}
                  name={player.name}
                  size={42}
                  borderColor={player.colorHex}
                  borderWidth={2}
                />
                <View style={styles.padNameWrap}>
                  <ThemedText variant="body" style={styles.padPlayerName}>
                    {player.name}
                  </ThemedText>
                  <ThemedText variant="caption" style={{ color: player.colorHex, fontSize: 11 }}>
                    {player.colorId.toUpperCase()}
                  </ThemedText>
                </View>
              </View>

              {/* Status Indicator */}
              <View style={styles.padStatusWrap}>
                {isFalseStart ? (
                  <ThemedText style={styles.falseStartBadge}>FALSE START! 💥</ThemedText>
                ) : isReleased && reactionMs !== null ? (
                  <View style={styles.timeBadgeWrap}>
                    <ThemedText style={styles.timeBadgeText}>{reactionMs} ms</ThemedText>
                    {isFastest && <ThemedText style={styles.fastestTag}>🚀 Fastest</ThemedText>}
                    {isSlowest && <ThemedText style={styles.slowestTag}>💀 Slowest</ThemedText>}
                  </View>
                ) : isHolding ? (
                  <ThemedText style={styles.holdingBadge}>HOLDING... 🔒</ThemedText>
                ) : (
                  <ThemedText style={styles.promptBadge}>TOUCH & HOLD</ThemedText>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Simulator Toolbar for Web Testing */}
      <View style={styles.simulatorToolbar}>
        {gameState.phase === 'ready' && (
          <PrimaryButton
            label="Hold All Pads (Simulate) 🔒"
            onPress={handleSimulateHoldAll}
            style={styles.simButton}
            textStyle={{ fontSize: 13 }}
          />
        )}
        {gameState.phase === 'flashed' && (
          <PrimaryButton
            label="Release All (Simulate) ⚡"
            onPress={handleSimulateReleases}
            style={[styles.simButton, { backgroundColor: colors.accentMint }]}
            textStyle={{ color: colors.textInverse, fontSize: 13 }}
          />
        )}
      </View>

      {/* Bottom Action when Finished */}
      {(gameState.phase === 'finished' || gameState.phase === 'false_start') && (
        <View style={styles.bottomArea}>
          <PrimaryButton
            label="See Verdict 👑"
            onPress={handleGoToVerdict}
            style={styles.verdictButton}
          />
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: spacing.xl,
  },
  flashFullScreen: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 245, 160, 0.4)',
    zIndex: 99,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: spacing.md,
  },
  exitButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  exitButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: colors.textPrimary,
    fontWeight: '800',
    fontSize: 18,
  },
  exitSpacer: {
    width: 60,
  },
  statusPill: {
    alignSelf: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  radarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  radarCore: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 3,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarWaiting: {
    borderColor: colors.warning,
    backgroundColor: 'rgba(255, 196, 0, 0.15)',
    shadowColor: colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  radarFlashed: {
    borderColor: colors.accentMint,
    backgroundColor: 'rgba(0, 245, 160, 0.3)',
    shadowColor: colors.accentMint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
  },
  radarFalseStart: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(255, 23, 68, 0.25)',
  },
  radarIcon: {
    fontSize: 34,
  },
  radarLabel: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 14,
    marginTop: 4,
    letterSpacing: 1,
  },
  padsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  playerPad: {
    width: '48%',
    height: 120,
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  playerPadHolding: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 3,
  },
  playerPadFalseStart: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(255, 23, 68, 0.2)',
  },
  playerPadSlowest: {
    borderColor: colors.danger,
    borderWidth: 3,
    backgroundColor: 'rgba(255, 23, 68, 0.2)',
  },
  padHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  padNameWrap: {
    flex: 1,
  },
  padPlayerName: {
    color: colors.textPrimary,
    fontWeight: '800',
    fontSize: 14,
  },
  padStatusWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptBadge: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  holdingBadge: {
    color: colors.accentGold,
    fontSize: 12,
    fontWeight: '800',
  },
  falseStartBadge: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '900',
  },
  timeBadgeWrap: {
    alignItems: 'center',
  },
  timeBadgeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  fastestTag: {
    color: colors.accentMint,
    fontSize: 11,
    fontWeight: '800',
  },
  slowestTag: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: '800',
  },
  simulatorToolbar: {
    marginVertical: spacing.xs,
    alignItems: 'center',
  },
  simButton: {
    height: 38,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  bottomArea: {
    marginTop: spacing.xs,
  },
  verdictButton: {
    backgroundColor: colors.accentPink,
    height: 52,
  },
});
