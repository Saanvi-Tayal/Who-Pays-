import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { AnimatedPressable } from '@/components/buttons/AnimatedPressable';
import { AvatarImage } from '@/components/avatars/AvatarImage';
import { SparkleDoodle } from '@/components/illustrations/DoodlesSvg';
import {
  BombSvg,
  RouletteWheelSvg,
  LightningSvg,
  ReactionHandSvg,
} from '@/components/illustrations/GameArtSvg';
import { useSessionStore, GameId } from '@/features/session/sessionStore';
import { RootStackScreenProps } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { triggerHaptic } from '@/utils/haptics';

interface GameOption {
  id: GameId;
  title: string;
  subtitle: string;
  accentColor: string;
  targetScreen: 'TimeBombArena' | 'RouletteArena' | 'TapFrenzyArena' | 'ReactionStandoffArena';
  renderIllustration: (size?: number) => React.ReactNode;
}

const GAMES: GameOption[] = [
  {
    id: 'time_bomb',
    title: 'Hot Potato',
    subtitle: '(Pass it!)',
    accentColor: '#FF4081',
    targetScreen: 'TimeBombArena',
    renderIllustration: (size) => <BombSvg size={size} />,
  },
  {
    id: 'roulette',
    title: 'Haptic Roulette',
    subtitle: '(Spin it!)',
    accentColor: '#7C4DFF',
    targetScreen: 'RouletteArena',
    renderIllustration: (size) => <RouletteWheelSvg size={size} />,
  },
  {
    id: 'tap_frenzy',
    title: 'Tap Frenzy',
    subtitle: '(Tap Fast!)',
    accentColor: '#FFD600',
    targetScreen: 'TapFrenzyArena',
    renderIllustration: (size) => <LightningSvg size={size} />,
  },
  {
    id: 'reaction_standoff',
    title: 'Reaction Standoff',
    subtitle: '(Quick Reflex!)',
    accentColor: '#00E5FF',
    targetScreen: 'ReactionStandoffArena',
    renderIllustration: (size) => <ReactionHandSvg size={size} />,
  },
];

export const GameLobbyScreen: React.FC<RootStackScreenProps<'GameLobby'>> = ({
  navigation,
}) => {
  const {
    selectedGame,
    selectGame,
    slots,
    selectedCategory,
  } = useSessionStore();

  const activeSlots = slots.filter((s) => s.isActive);
  const activeGameId = selectedGame || 'time_bomb';
  const currentGame = GAMES.find((g) => g.id === activeGameId) || GAMES[0];

  const handleSelectGame = (gameId: GameId) => {
    triggerHaptic('selection');
    selectGame(gameId);
  };

  const handleLaunchGame = () => {
    triggerHaptic('medium');
    navigation.navigate(currentGame.targetScreen);
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View style={styles.topNavRow}>
            <AnimatedPressable
              onPress={() => {
                triggerHaptic('light');
                navigation.goBack();
              }}
              style={styles.navBackButton}
              accessibilityRole="button"
              accessibilityLabel="Back to Stakes"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ThemedText style={styles.navBackIcon}>‹</ThemedText>
              <ThemedText style={styles.navBackLabel}>Stakes</ThemedText>
            </AnimatedPressable>

            <View style={styles.titleRow}>
              <ThemedText variant="display" style={styles.title}>
                Pick a Game!
              </ThemedText>
              <SparkleDoodle size={22} color="#FFB800" />
            </View>

            <View style={styles.navSpacer} />
          </View>

          <ThemedText variant="body" style={styles.subtitle}>
            Let the chaos begin ✨
          </ThemedText>
        </View>

        {/* Selected Stakes & Dilemma Badge */}
        <View style={styles.contextBadgeBar}>
          <View style={styles.dilemmaPill}>
            <ThemedText style={styles.dilemmaIcon}>🎯</ThemedText>
            <ThemedText style={styles.dilemmaText} numberOfLines={1}>
              {selectedCategory}
            </ThemedText>
          </View>

          {/* Active Players Avatars Row */}
          <View style={styles.playersPreviewRow}>
            {activeSlots.slice(0, 4).map((slot, idx) => (
              <View
                key={slot.id}
                style={[styles.miniAvatarWrapper, { marginLeft: idx > 0 ? -10 : 0 }]}
              >
                <AvatarImage
                  avatarKey={slot.avatarKey || `AV-0${idx + 1}`}
                  name={slot.name}
                  size={28}
                  borderColor={slot.colorHex}
                  borderWidth={2}
                />
              </View>
            ))}
            {activeSlots.length > 4 && (
              <View style={[styles.miniAvatarWrapper, styles.extraCountCircle, { marginLeft: -10 }]}>
                <ThemedText style={styles.extraCountText}>
                  +{activeSlots.length - 4}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* 2x2 Grid of Game Cards matching reference Screen 3 */}
        <View style={styles.gridContainer}>
          {GAMES.map((game) => {
            const isSelected = game.id === activeGameId;

            return (
              <AnimatedPressable
                key={game.id}
                onPress={() => handleSelectGame(game.id)}
                style={[
                  styles.gameCard,
                  {
                    borderColor: isSelected ? game.accentColor : 'rgba(255, 255, 255, 0.1)',
                    backgroundColor: isSelected
                      ? 'rgba(32, 14, 58, 0.95)'
                      : 'rgba(24, 10, 44, 0.75)',
                  },
                  isSelected && styles.gameCardSelected,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${game.title} ${game.subtitle}`}
              >
                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <View
                    style={[
                      styles.selectedCheckBadge,
                      { backgroundColor: game.accentColor },
                    ]}
                  >
                    <ThemedText style={styles.selectedCheckText}>✓</ThemedText>
                  </View>
                )}

                <View style={styles.iconWrapper}>
                  {game.renderIllustration(74)}
                </View>

                <ThemedText variant="heading3" style={styles.cardTitle}>
                  {game.title}
                </ThemedText>

                <ThemedText variant="caption" style={styles.cardSubtitle}>
                  {game.subtitle}
                </ThemedText>
              </AnimatedPressable>
            );
          })}
        </View>

        {/* Bottom CTA & Stepper */}
        <View style={styles.footerSection}>
          <ThemedText variant="caption" style={styles.stepperText}>
            3. Play the Game → 4. See the Result
          </ThemedText>
          <PrimaryButton
            label={`Play ${currentGame.title}! →`}
            onPress={handleLaunchGame}
            style={[styles.launchButton, { backgroundColor: currentGame.accentColor }]}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D0618',
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  navBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    gap: 4,
  },
  navBackIcon: {
    color: '#FFF',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '800',
  },
  navBackLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  navSpacer: {
    width: 65,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    color: '#FFF9F0',
    fontWeight: '900',
    fontSize: 32,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 4,
  },
  contextBadgeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 16, 54, 0.85)',
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: spacing.md,
  },
  dilemmaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  dilemmaIcon: {
    fontSize: 16,
  },
  dilemmaText: {
    color: '#FFE082',
    fontWeight: '800',
    fontSize: 13,
  },
  playersPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatarWrapper: {
    zIndex: 1,
  },
  extraCountCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#371B58',
    borderWidth: 1.5,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraCountText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginVertical: spacing.sm,
  },
  gameCard: {
    width: '47.5%',
    height: 195,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  gameCardSelected: {
    shadowOpacity: 0.65,
    shadowRadius: 16,
    elevation: 10,
  },
  selectedCheckBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  selectedCheckText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },
  iconWrapper: {
    marginBottom: spacing.xs,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#FFF9F0',
    fontWeight: '900',
    fontSize: 17,
    textAlign: 'center',
  },
  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '600',
  },
  footerSection: {
    width: '100%',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  stepperText: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  launchButton: {
    borderRadius: borderRadius.full,
  },
});
