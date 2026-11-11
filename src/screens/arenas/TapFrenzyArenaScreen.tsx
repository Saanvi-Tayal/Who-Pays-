import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { AnimatedPressable } from '@/components/buttons/AnimatedPressable';
import { AvatarImage } from '@/components/avatars/AvatarImage';
import { CrownDoodle } from '@/components/illustrations/DoodlesSvg';
import {
  createTapFrenzyState,
  startTapFrenzy,
  registerPlayerTap,
  tickTapFrenzy,
  TapFrenzyState,
} from '@/features/games/tapFrenzy/tapFrenzyEngine';
import { useSessionStore } from '@/features/session/sessionStore';
import { RootStackScreenProps } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { triggerHaptic } from '@/utils/haptics';
import { playTouchSound, playBombExplosionSound } from '@/utils/soundEffects';

export const TapFrenzyArenaScreen: React.FC<RootStackScreenProps<'TapFrenzyArena'>> = ({
  navigation,
}) => {
  const { slots, recordMatchResult, selectedMode } = useSessionStore();
  const activeSlots = slots.filter((s) => s.isActive);
  const players = activeSlots.length >= 2 ? activeSlots : slots;

  const [gameState, setGameState] = useState<TapFrenzyState>(() =>
    createTapFrenzyState(players, 5000)
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasFinishedRef = useRef(false);

  // Reanimated bounce per quadrant
  const scaleAnim = useSharedValue(1);

  const formatSecs = (ms: number) => {
    return (ms / 1000).toFixed(1);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleFinishRound = useCallback(
    (finalState: TapFrenzyState) => {
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      triggerHaptic('error');
      playBombExplosionSound().catch(() => {});

      const loserId = finalState.loserSlotId || players[0].id;
      recordMatchResult({
        id: `tap-frenzy-${Date.now()}`,
        gameId: 'tap_frenzy',
        stakesModeId: selectedMode,
        loserSlotId: loserId,
        winnerSlotIds: players.filter((p) => p.id !== loserId).map((p) => p.id),
        metrics: {
          totalTaps: finalState.totalTaps,
          highestTaps: finalState.highestTaps,
          lowestTaps: finalState.lowestTaps,
          tapCounts: finalState.tapCounts,
        },
        createdAt: Date.now(),
      });

      setTimeout(() => {
        navigation.navigate('Verdict');
      }, 1600);
    },
    [navigation, players, recordMatchResult, selectedMode]
  );

  const handleStartGame = () => {
    triggerHaptic('medium');
    const started = startTapFrenzy(gameState);
    setGameState(started);

    timerRef.current = setInterval(() => {
      setGameState((prev) => {
        const next = tickTapFrenzy(prev, 100, players);
        if (next.phase === 'finished') {
          handleFinishRound(next);
        }
        return next;
      });
    }, 100);
  };

  const handleTapZone = (slotId: string) => {
    if (gameState.phase !== 'active') return;
    triggerHaptic('light');
    playTouchSound().catch(() => {});

    scaleAnim.value = withSequence(
      withSpring(1.08),
      withSpring(1)
    );

    setGameState((prev) => registerPlayerTap(prev, slotId));
  };

  return (
    <ScreenContainer style={styles.container}>
      {/* Top Header Bar */}
      {/* Top Header Bar with Stakes Back & Lobby Buttons */}
      <View style={styles.topNavRow}>
        <AnimatedPressable
          onPress={() => {
            triggerHaptic('light');
            if (timerRef.current) clearInterval(timerRef.current);
            navigation.navigate('Stakes');
          }}
          style={styles.exitButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Back to Stakes"
        >
          <ThemedText style={styles.exitButtonText}>‹ Stakes</ThemedText>
        </AnimatedPressable>

        {/* 5-second countdown pill */}
        <View style={styles.timerPill}>
          <ThemedText style={styles.timerIcon}>⚡</ThemedText>
          <ThemedText variant="heading2" style={styles.timerText}>
            {formatSecs(gameState.timeRemainingMs)}s
          </ThemedText>
          <ThemedText style={styles.timerIcon}>⚡</ThemedText>
        </View>

        <AnimatedPressable
          onPress={() => {
            triggerHaptic('light');
            if (timerRef.current) clearInterval(timerRef.current);
            navigation.navigate('GameLobby');
          }}
          style={styles.exitButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Exit Game to Lobby"
        >
          <ThemedText style={styles.exitButtonText}>Lobby 🎮</ThemedText>
        </AnimatedPressable>
      </View>

      <View style={styles.headerTitleWrap}>
        <View style={styles.titleRow}>
          <ThemedText variant="heading2" style={styles.screenTitle}>
            Tap Frenzy!
          </ThemedText>
          <CrownDoodle size={24} color="#FFEA00" />
        </View>
        <ThemedText variant="caption" style={styles.screenSubtitle}>
          {gameState.phase === 'ready'
            ? 'Everyone get ready on your zone • Fewest taps pays!'
            : gameState.phase === 'active'
            ? 'TAP FAST!! FEWEST TAPS LOSES!'
            : "TIME'S UP! TALLYING SCORES..."}
        </ThemedText>
      </View>

      {/* Multi-Player Tapping Arena Grid */}
      <View style={styles.zonesGrid}>
        {players.map((player) => {
          const count = gameState.tapCounts[player.id] || 0;
          const isLoser = gameState.phase === 'finished' && gameState.loserSlotId === player.id;

          return (
            <AnimatedPressable
              key={player.id}
              onPress={() => handleTapZone(player.id)}
              disabled={gameState.phase !== 'active'}
              style={[
                styles.playerZone,
                {
                  borderColor: player.colorHex || colors.accentPink,
                  backgroundColor: isLoser
                    ? 'rgba(255, 23, 68, 0.35)'
                    : 'rgba(26, 11, 46, 0.85)',
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Tap zone for ${player.name}`}
            >
              <View style={styles.zoneHeader}>
                <AvatarImage
                  avatarKey={player.avatarKey || 'AV-01'}
                  name={player.name}
                  size={40}
                  borderColor={player.colorHex}
                  borderWidth={2}
                />
                <ThemedText
                  variant="heading3"
                  style={[styles.zonePlayerName, { color: player.colorHex || '#FFF' }]}
                >
                  {player.name}
                </ThemedText>
              </View>

              <ThemedText
                style={[
                  styles.tapCountNumber,
                  { color: player.colorHex || colors.accentGold },
                ]}
              >
                {count}
              </ThemedText>

              <ThemedText variant="caption" style={styles.tapPromptText}>
                {gameState.phase === 'active' ? 'TAP HERE!' : 'Taps'}
              </ThemedText>
            </AnimatedPressable>
          );
        })}
      </View>

      {/* Bottom Start / Status Action */}
      <View style={styles.bottomArea}>
        {gameState.phase === 'ready' ? (
          <PrimaryButton
            label="Start 5s Frenzy! ⚡"
            onPress={handleStartGame}
            style={styles.startFrenzyButton}
          />
        ) : gameState.phase === 'active' ? (
          <ThemedText style={styles.frenzyActivePrompt}>
            ⚡ FRENZY ACTIVE! KEEP TAPPING! ⚡
          </ThemedText>
        ) : (
          <PrimaryButton
            label="See Verdict 👑 →"
            onPress={() => navigation.navigate('Verdict')}
            style={styles.verdictButton}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D0618',
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: spacing.xxl,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: spacing.md,
    zIndex: 20,
  },
  exitButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
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
  exitSpacer: {
    width: 65,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 234, 0, 0.2)',
    borderColor: '#FFEA00',
    borderWidth: 1.5,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  timerIcon: {
    fontSize: 16,
  },
  timerText: {
    color: '#FFEA00',
    fontWeight: '900',
    fontSize: 22,
    letterSpacing: 1,
  },
  headerTitleWrap: {
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  screenTitle: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 22,
  },
  screenSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  zonesGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'center',
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  playerZone: {
    width: '47.5%',
    height: 140,
    borderRadius: 22,
    borderWidth: 2.5,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    width: '100%',
  },
  zonePlayerName: {
    fontWeight: '800',
    fontSize: 14,
    flex: 1,
  },
  tapCountNumber: {
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 48,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  tapPromptText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bottomArea: {
    width: '100%',
    alignItems: 'center',
  },
  startFrenzyButton: {
    backgroundColor: '#FFD600',
  },
  frenzyActivePrompt: {
    color: '#FFEA00',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  verdictButton: {
    backgroundColor: '#FF2E93',
  },
});
