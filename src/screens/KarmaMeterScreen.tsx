import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { AnimatedSwitch } from '@/components/buttons/AnimatedSwitch';
import { AnimatedPressable } from '@/components/buttons/AnimatedPressable';
import { AvatarImage } from '@/components/avatars/AvatarImage';
import { CrownDoodle } from '@/components/illustrations/DoodlesSvg';
import { useSessionStore } from '@/features/session/sessionStore';
import { RootStackScreenProps } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { triggerHaptic } from '@/utils/haptics';

interface DynamicKarmaArchetype {
  id: string;
  name: string;
  avatarKey: string;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  hasCrown: boolean;
}

const PALETTE = [
  { color: '#FFEA00', bg: 'rgba(255, 234, 0, 0.12)' },
  { color: '#C084FC', bg: 'rgba(192, 132, 252, 0.14)' },
  { color: '#00F0FF', bg: 'rgba(0, 240, 255, 0.12)' },
  { color: '#FF2E93', bg: 'rgba(255, 46, 147, 0.14)' },
  { color: '#00F5A0', bg: 'rgba(0, 245, 160, 0.12)' },
  { color: '#FF9100', bg: 'rgba(255, 145, 0, 0.14)' },
];

export const KarmaMeterScreen: React.FC<RootStackScreenProps<'KarmaMeter'>> = ({ navigation }) => {
  const {
    slots,
    history,
    circles,
    activeCircle,
    setActiveCircle,
    fairnessMode,
    toggleFairnessMode,
    clearDemoData,
  } = useSessionStore();

  const activeSlots = slots.filter((s) => s.isActive);

  // Filter history strictly for the currently selected circle
  const circleHistory = useMemo(() => {
    return history.filter(
      (m) => m.circleId === activeCircle.id || (!m.circleId && activeCircle.id === '1')
    );
  }, [history, activeCircle.id]);

  const isCircleDemo = useMemo(() => {
    return circleHistory.some((m) => m.isDemo);
  }, [circleHistory]);

  // Dynamically assign personality archetypes based on this circle's match history
  const archetypes = useMemo<DynamicKarmaArchetype[]>(() => {
    const statsMap: Record<string, { losses: number; wins: number }> = {};
    activeSlots.forEach((p) => {
      statsMap[p.id] = { losses: 0, wins: 0 };
    });

    circleHistory.forEach((m) => {
      // Find loser by slot id or player name match
      const loser = activeSlots.find(
        (p) =>
          p.id === m.loserSlotId ||
          (m.loserName && p.name.toLowerCase() === m.loserName.toLowerCase())
      );
      if (loser && statsMap[loser.id]) {
        statsMap[loser.id].losses += 1;
      }

      // Find winners
      activeSlots.forEach((p) => {
        if (
          m.winnerSlotIds?.includes(p.id) ||
          m.winnerNames?.some((w) => w.toLowerCase() === p.name.toLowerCase())
        ) {
          statsMap[p.id].wins += 1;
        }
      });
    });

    // Sort by losses descending
    const sorted = [...activeSlots].sort((a, b) => {
      const aLoss = statsMap[a.id]?.losses || 0;
      const bLoss = statsMap[b.id]?.losses || 0;
      return bLoss - aLoss;
    });

    return sorted.map((player, idx) => {
      const stats = statsMap[player.id] || { losses: 0, wins: 0 };
      const paletteItem = PALETTE[idx % PALETTE.length];

      if (circleHistory.length === 0) {
        return {
          id: player.id,
          name: player.name,
          avatarKey: player.avatarKey || 'AV-01',
          title: 'The Contender',
          subtitle: '(0 pays • Ready)',
          color: paletteItem.color,
          bgColor: paletteItem.bg,
          hasCrown: false,
        };
      }

      let title = 'The Contender';
      let subtitle = `(${stats.losses} pays)`;
      let hasCrown = false;

      if (idx === 0 && stats.losses > 0) {
        // Highest loser in this group
        title = 'The ATM';
        subtitle = `(${stats.losses} pays)`;
        hasCrown = true;
      } else if (idx === sorted.length - 1 && stats.losses === 0) {
        // Has not paid yet
        title = 'The Lucky One';
        subtitle = `(0 pays • 🍀)`;
      } else if (idx === 1 || stats.wins > 1) {
        title = 'The Chooser';
        subtitle = `(${stats.wins} wins)`;
      } else {
        title = 'The Foodie';
        subtitle = `(${stats.losses + stats.wins} games)`;
      }

      return {
        id: player.id,
        name: player.name,
        avatarKey: player.avatarKey || 'AV-01',
        title,
        subtitle,
        color: paletteItem.color,
        bgColor: paletteItem.bg,
        hasCrown,
      };
    });
  }, [activeSlots, circleHistory]);

  const handleToggleFairness = () => {
    triggerHaptic('medium');
    toggleFairnessMode();
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => {
              triggerHaptic('light');
              navigation.goBack();
            }}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ThemedText style={styles.headerIcon}>‹</ThemedText>
          </Pressable>
          <View style={styles.headerCenter}>
            <ThemedText variant="heading1" style={styles.headerTitle}>
              Karma Meter ✨
            </ThemedText>
            <ThemedText variant="caption" style={styles.headerSubtitle}>
              {`${activeCircle.name}'s balance of chaos`}
            </ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to Stakes"
            onPress={() => {
              triggerHaptic('light');
              navigation.navigate('Stakes');
            }}
            style={styles.homeBtn}
          >
            <ThemedText style={styles.homeBtnText}>Stakes ⚡</ThemedText>
          </Pressable>
        </View>

        {/* Group Selector Chips (Direct Switch between Circles) */}
        <View style={styles.groupChipsContainer}>
          <ThemedText variant="caption" style={styles.groupChipsTitle}>
            SELECT GROUP TO VIEW KARMA 👥
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsScroll}
          >
            {circles.map((c) => {
              const isSelected = c.id === activeCircle.id;
              return (
                <AnimatedPressable
                  key={c.id}
                  onPress={() => {
                    triggerHaptic('selection');
                    setActiveCircle(c);
                  }}
                  style={[
                    styles.groupChip,
                    isSelected && styles.groupChipSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch to ${c.name}`}
                >
                  <ThemedText style={styles.groupChipEmoji}>{c.emoji}</ThemedText>
                  <ThemedText
                    style={[
                      styles.groupChipText,
                      isSelected && styles.groupChipTextSelected,
                    ]}
                  >
                    {c.name}
                  </ThemedText>
                </AnimatedPressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Test Data Notification for Judges */}
        {isCircleDemo && (
          <View style={styles.demoBanner}>
            <View style={styles.demoTextWrap}>
              <View style={styles.demoBadgeRow}>
                <ThemedText style={styles.demoTag}>TEST DATA</ThemedText>
                <ThemedText style={styles.demoHeading}>Judge Evaluation Mode</ThemedText>
              </View>
              <ThemedText variant="caption" style={styles.demoSubtitle}>
                Sample match records loaded for review. Adding people or playing a match automatically clears this!
              </ThemedText>
            </View>
            <Pressable
              onPress={() => {
                triggerHaptic('medium');
                clearDemoData();
              }}
              style={styles.clearDemoButton}
              accessibilityRole="button"
              accessibilityLabel="Clear Test Data"
            >
              <ThemedText style={styles.clearDemoText}>Clear Test Data ✕</ThemedText>
            </Pressable>
          </View>
        )}

        {/* Fresh Slate Banner if 0 games recorded */}
        {circleHistory.length === 0 && (
          <View style={styles.freshSlateBanner}>
            <ThemedText style={styles.freshSlateEmoji}>🌟</ThemedText>
            <View style={styles.freshSlateTextWrap}>
              <ThemedText variant="body" style={styles.freshSlateTitle}>
                Fresh Karma Slate!
              </ThemedText>
              <ThemedText variant="caption" style={styles.freshSlateSubtitle}>
                No games played yet in {activeCircle.name}. Play matches to unlock ATM, Lucky One, and Chooser badges!
              </ThemedText>
            </View>
          </View>
        )}

        {/* Dynamic Player Archetype Cards */}
        <View style={styles.cardsGrid}>
          {archetypes.map((item) => (
            <View
              key={item.id}
              style={[
                styles.archetypeCard,
                {
                  borderColor: item.color,
                  backgroundColor: item.bgColor,
                  shadowColor: item.color,
                },
              ]}
            >
              {item.hasCrown && (
                <View style={styles.cardCrownWrap}>
                  <CrownDoodle size={28} color="#FFEA00" />
                </View>
              )}

              <AvatarImage
                avatarKey={item.avatarKey}
                name={item.name}
                size={58}
                borderColor={item.color}
                borderWidth={2.5}
                showCrown={false}
              />

              <ThemedText variant="heading2" style={styles.playerName} numberOfLines={1}>
                {item.name}
              </ThemedText>
              <ThemedText variant="caption" style={[styles.archetypeTitle, { color: item.color }]}>
                {item.title}
              </ThemedText>
              <ThemedText variant="caption" style={styles.statsSubtitle}>
                {item.subtitle}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Interactive Fairness Algorithm Toggle Card */}
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: fairnessMode }}
          accessibilityLabel="Toggle Fairness Algorithm"
          onPress={handleToggleFairness}
          style={[styles.fairnessCard, fairnessMode && styles.fairnessCardActive]}
        >
          <ThemedText style={styles.partyPopperIcon}>🎉</ThemedText>
          <View style={styles.fairnessTextWrap}>
            <ThemedText variant="body" style={styles.fairnessTitle}>
              Fairness Algorithm
            </ThemedText>
            <ThemedText variant="caption" style={styles.fairnessDesc}>
              {fairnessMode
                ? 'Active — Boosts probability for lucky players to pay next!'
                : 'Pure Chaos — All outcomes 100% equally random.'}
            </ThemedText>
          </View>
          <AnimatedSwitch
            value={fairnessMode}
            onValueChange={handleToggleFairness}
            activeColor={colors.accentMint}
            inactiveColor={colors.surfaceSubtle}
          />
        </Pressable>

        {/* Bottom Actions to Group History & Manage Circles */}
        <View style={styles.bottomNavSection}>
          <PrimaryButton
            label="View Group History 📜"
            variant="primary"
            onPress={() => {
              triggerHaptic('selection');
              navigation.navigate('GroupHistory');
            }}
          />
          <View style={{ height: spacing.sm }} />
          <PrimaryButton
            label="Manage Circles 👥"
            variant="secondary"
            onPress={() => {
              triggerHaptic('selection');
              navigation.navigate('Circles');
            }}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerIcon: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginTop: -2,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  homeBtn: {
    backgroundColor: 'rgba(255, 234, 0, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.accentGold,
  },
  homeBtnText: {
    color: colors.accentGold,
    fontWeight: '800',
    fontSize: 12,
  },
  groupChipsContainer: {
    marginBottom: spacing.lg,
  },
  groupChipsTitle: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: spacing.xs,
  },
  chipsScroll: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  groupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    gap: spacing.xs,
  },
  groupChipSelected: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    borderColor: colors.accentCyan,
  },
  groupChipEmoji: {
    fontSize: 15,
  },
  groupChipText: {
    color: colors.textSecondary,
    fontWeight: '700',
    fontSize: 13,
  },
  groupChipTextSelected: {
    color: colors.accentCyan,
    fontWeight: '800',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  archetypeCard: {
    width: '47.5%',
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 5,
  },
  cardCrownWrap: {
    position: 'absolute',
    top: 6,
    zIndex: 10,
    transform: [{ rotate: '12deg' }],
  },
  playerName: {
    color: colors.textPrimary,
    fontWeight: '800',
    fontSize: 15,
    marginTop: spacing.xs,
  },
  archetypeTitle: {
    fontWeight: '800',
    fontSize: 13,
    marginTop: 2,
  },
  statsSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 1,
  },
  fairnessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  fairnessCardActive: {
    borderColor: colors.accentMint,
    backgroundColor: 'rgba(0, 245, 160, 0.08)',
    shadowColor: colors.accentMint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  partyPopperIcon: {
    fontSize: 32,
  },
  fairnessTextWrap: {
    flex: 1,
  },
  fairnessTitle: {
    color: colors.textPrimary,
    fontWeight: '800',
    fontSize: 15,
  },
  fairnessDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  bottomNavSection: {
    marginTop: spacing.xs,
  },
  demoBanner: {
    backgroundColor: 'rgba(255, 64, 129, 0.1)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.35)',
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  demoTextWrap: {
    gap: 4,
  },
  demoBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  demoTag: {
    backgroundColor: '#FF4081',
    color: '#FFF',
    fontSize: 9,
    fontWeight: '900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    letterSpacing: 0.5,
  },
  demoHeading: {
    color: '#FF80AB',
    fontSize: 13,
    fontWeight: '800',
  },
  demoSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  clearDemoButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 64, 129, 0.18)',
    borderWidth: 1,
    borderColor: '#FF4081',
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: borderRadius.full,
  },
  clearDemoText: {
    color: '#FF4081',
    fontSize: 11,
    fontWeight: '800',
  },
  freshSlateBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 234, 0, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 234, 0, 0.25)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  freshSlateEmoji: {
    fontSize: 24,
  },
  freshSlateTextWrap: {
    flex: 1,
  },
  freshSlateTitle: {
    color: '#FFEA00',
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 2,
  },
  freshSlateSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
