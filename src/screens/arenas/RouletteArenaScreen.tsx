import React, { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { AnimatedPressable } from '@/components/buttons/AnimatedPressable';
import { AvatarImage } from '@/components/avatars/AvatarImage';
import { CrownDoodle } from '@/components/illustrations/DoodlesSvg';
import {
  createRouletteState,
  computeSpinTargetRotation,
  resolveRouletteStop,
  RouletteSegment,
} from '@/features/games/roulette/rouletteEngine';
import { useSessionStore } from '@/features/session/sessionStore';
import { RootStackScreenProps } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { triggerHaptic } from '@/utils/haptics';

export const RouletteArenaScreen: React.FC<RootStackScreenProps<'RouletteArena'>> = ({
  navigation,
}) => {
  const { slots, recordMatchResult, selectedMode, selectedCategory } = useSessionStore();
  const activeSlots = slots.filter((s) => s.isActive);
  const players = activeSlots.length >= 2 ? activeSlots : slots;

  const [gameState, setGameState] = useState(() => createRouletteState(players));
  const [isSpinning, setIsSpinning] = useState(false);

  // Wheel rotation shared value
  const wheelRotation = useSharedValue(0);
  const needleWiggle = useSharedValue(0);
  const currentRotationRef = useRef(0);

  const animatedWheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${wheelRotation.value}deg` }],
  }));

  const animatedNeedleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${needleWiggle.value}deg` }],
  }));

  const handleFinishSpin = (finalRotation: number) => {
    const resolved = resolveRouletteStop(gameState, finalRotation);
    setGameState(resolved);
    setIsSpinning(false);
    triggerHaptic('error');

    // Record outcome into store
    if (resolved.loserSlotId) {
      recordMatchResult({
        id: `roulette-${Date.now()}`,
        gameId: 'roulette',
        stakesModeId: selectedMode,
        loserSlotId: resolved.loserSlotId,
        winnerSlotIds: players.filter((p) => p.id !== resolved.loserSlotId).map((p) => p.id),
        metrics: {
          finalRotationDeg: Math.round(finalRotation),
          totalSpins: resolved.totalSpins,
        },
        createdAt: Date.now(),
      });
    }

    // Auto navigate to verdict
    setTimeout(() => {
      navigation.navigate('Verdict');
    }, 1700);
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    triggerHaptic('medium');

    const { targetRotation, spinDurationMs } = computeSpinTargetRotation(
      currentRotationRef.current,
      5,
      8
    );
    currentRotationRef.current = targetRotation;

    // Needle wiggle while spinning
    needleWiggle.value = withSequence(
      withTiming(-12, { duration: 100 }),
      withTiming(12, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );

    wheelRotation.value = withTiming(
      targetRotation,
      {
        duration: spinDurationMs,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(handleFinishSpin)(targetRotation);
        }
      }
    );
  };

  // Helper to render pie slice path in SVG
  const renderSlicePath = (segment: RouletteSegment, radius: number) => {
    const startRad = (segment.startAngle * Math.PI) / 180;
    const endRad = (segment.endAngle * Math.PI) / 180;

    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);

    const largeArc = segment.endAngle - segment.startAngle > 180 ? 1 : 0;
    return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const selectedSegment = gameState.segments[gameState.selectedSegmentIndex];
  const chosenPlayer = selectedSegment?.player || players[0];

  return (
    <ScreenContainer style={styles.container}>
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

        <View style={styles.titleWrap}>
          <View style={styles.titleRow}>
            <ThemedText variant="heading2" style={styles.screenTitle}>
              Haptic Roulette
            </ThemedText>
            <CrownDoodle size={24} color="#FFEA00" />
          </View>
          <ThemedText variant="caption" style={styles.screenSubtitle}>
            {selectedCategory}
          </ThemedText>
        </View>

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

      {/* Center Wheel Stage */}
      <View style={styles.wheelStage}>
        {/* Needle Pointer at 12 o'clock */}
        <Animated.View style={[styles.needleWrapper, animatedNeedleStyle]}>
          <Svg width={36} height={44} viewBox="0 0 36 44">
            <Path
              d="M18 40 L6 8 C6 4, 30 4, 30 8 Z"
              fill="#FF1744"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <Circle cx="18" cy="10" r="4" fill="#FFFFFF" />
          </Svg>
        </Animated.View>

        {/* Ambient Wheel Aura */}
        <View style={styles.wheelAuraGlow} />

        {/* The Animated Rotating Wheel */}
        <Animated.View style={[styles.wheelContainer, animatedWheelStyle]}>
          <Svg width={300} height={300} viewBox="0 0 300 300">
            {/* Outer Border Rim */}
            <Circle cx="150" cy="150" r="148" fill="#1A0A33" stroke="#FF2E93" strokeWidth="4" />

            {/* Individual Colored Slices */}
            <G>
              {gameState.segments.map((seg) => {
                const pColor = seg.player.colorHex || colors.accentPink;
                return (
                  <Path
                    key={seg.index}
                    d={renderSlicePath(seg, 146)}
                    fill={pColor}
                    stroke="#0D0618"
                    strokeWidth="2"
                    transform="translate(4, 4)"
                    opacity={0.92}
                  />
                );
              })}
            </G>

            {/* Decorative Pegs along perimeter */}
            {gameState.segments.map((seg, idx) => {
              const rad = (seg.startAngle * Math.PI) / 180;
              const px = 150 + 138 * Math.cos(rad);
              const py = 150 + 138 * Math.sin(rad);
              return <Circle key={idx} cx={px} cy={py} r="3.5" fill="#FFFFFF" />;
            })}

            {/* Center Hub */}
            <Circle cx="150" cy="150" r="32" fill="#FFEA00" stroke="#FF9100" strokeWidth="3" />
            <Circle cx="150" cy="150" r="12" fill="#0D0618" />
          </Svg>
        </Animated.View>

        {/* Result Callout when stopped */}
        {gameState.phase === 'stopped' && (
          <View style={[styles.resultCallout, { borderColor: chosenPlayer.colorHex || colors.accentPink }]}>
            <AvatarImage
              avatarKey={chosenPlayer.avatarKey || 'AV-01'}
              name={chosenPlayer.name}
              size={44}
              borderColor={chosenPlayer.colorHex}
              borderWidth={2}
            />
            <View>
              <ThemedText variant="caption" style={styles.resultLabel}>
                POINTER LANDED ON:
              </ThemedText>
              <ThemedText
                variant="heading2"
                style={[styles.resultName, { color: chosenPlayer.colorHex || '#FFF' }]}
              >
                {chosenPlayer.name}
              </ThemedText>
            </View>
          </View>
        )}
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomArea}>
        <ThemedText variant="caption" style={styles.instructionText}>
          {isSpinning ? 'Spinning... decelerating...' : 'Swipe or tap to spin the wheel!'}
        </ThemedText>
        <PrimaryButton
          label={isSpinning ? 'Wheel is Spinning! 🎡' : 'Spin The Wheel! 🎯'}
          onPress={handleSpin}
          disabled={isSpinning}
          style={styles.spinButton}
        />
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
  titleWrap: {
    alignItems: 'center',
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
    color: '#FFEA00',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  wheelStage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
    position: 'relative',
  },
  wheelAuraGlow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(168, 85, 247, 0.22)',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 50,
  },
  needleWrapper: {
    position: 'absolute',
    top: -20,
    zIndex: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  wheelContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCallout: {
    position: 'absolute',
    bottom: -50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 11, 46, 0.95)',
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderWidth: 2,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    zIndex: 40,
  },
  resultLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  resultName: {
    fontWeight: '900',
    fontSize: 18,
    lineHeight: 22,
  },
  bottomArea: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.sm,
  },
  instructionText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  spinButton: {
    backgroundColor: '#8B5CF6',
  },
});
