import React, { useMemo } from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { AnimatedPressable } from '@/components/buttons/AnimatedPressable';
import { AvatarImage } from '@/components/avatars/AvatarImage';
import { CrownDoodle } from '@/components/illustrations/DoodlesSvg';
import { useSessionStore } from '@/features/session/sessionStore';
import { RootStackScreenProps } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { triggerHaptic } from '@/utils/haptics';

function formatTimeAgo(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return 'Just now';
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getGameEmoji(gameId: string): string {
  switch (gameId) {
    case 'time_bomb':
      return '💣';
    case 'roulette':
      return '🎡';
    case 'tap_frenzy':
      return '⚡';
    case 'reaction_standoff':
      return '🎯';
    default:
      return '🎲';
  }
}

export const GroupHistoryScreen: React.FC<RootStackScreenProps<'GroupHistory'>> = ({ navigation }) => {
  const { slots, history, circles, activeCircle, setActiveCircle, isCloudConnected } = useSessionStore();
  const activeSlots = slots.filter((s) => s.isActive);

  // Filter history strictly for the currently selected circle
  const circleHistory = useMemo(() => {
    return history.filter(
      (m) => m.circleId === activeCircle.id || (!m.circleId && activeCircle.id === '1')
    );
  }, [history, activeCircle.id]);

  // Dynamically compute real-time loss counts from this circle's match history
  const playerStats = useMemo(() => {
    const counts: Record<string, number> = {};
    activeSlots.forEach((p) => {
      counts[p.id] = 0;
    });

    circleHistory.forEach((match) => {
      if (match.loserSlotId && counts[match.loserSlotId] !== undefined) {
        counts[match.loserSlotId] += 1;
      } else {
        // Fallback by name match
        const matched = activeSlots.find(
          (p) => p.name.toLowerCase() === match.loserName?.toLowerCase()
        );
        if (matched) {
          counts[matched.id] += 1;
        }
      }
    });

    const maxLoss = Math.max(...Object.values(counts), 1);

    return activeSlots.map((player) => {
      const count = counts[player.id] || 0;
      const pct = count === 0 ? 0 : Math.max(8, Math.round((count / maxLoss) * 88));
      return {
        id: player.id,
        name: player.name,
        count,
        color: player.colorHex,
        barWidth: `${pct}%` as `${number}%`,
      };
    });
  }, [activeSlots, circleHistory]);

  // Find who currently has the most losses to give them the crown (only if at least 1 loss)
  const maxLossPlayerId = useMemo(() => {
    let topId: string | null = null;
    let topCount = 0;
    playerStats.forEach((p) => {
      if (p.count > topCount) {
        topCount = p.count;
        topId = p.id;
      }
    });
    return topId;
  }, [playerStats]);

  // Format real-time recent decisions
  const recentDecisions = useMemo(() => {
    return circleHistory.slice(0, 8).map((item) => ({
      id: item.id,
      dilemma: item.dilemma || 'Who Pays?',
      outcome: item.loserName || 'Unknown',
      icon: getGameEmoji(item.gameId),
      timeAgo: formatTimeAgo(item.createdAt),
    }));
  }, [circleHistory]);

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to Stakes"
            onPress={() => {
              triggerHaptic('light');
              navigation.navigate('Stakes');
            }}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <ThemedText style={styles.headerIcon}>‹</ThemedText>
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <ThemedText variant="heading1" style={styles.headerTitle}>
              Group History
            </ThemedText>
            <ThemedText variant="caption" style={styles.headerSubtitle}>
              {`${activeCircle.emoji} ${activeCircle.name}`}
            </ThemedText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Karma Meter"
            onPress={() => {
              triggerHaptic('selection');
              navigation.navigate('KarmaMeter');
            }}
            style={styles.karmaBtn}
          >
            <ThemedText style={styles.karmaBtnText}>Karma ✨</ThemedText>
          </Pressable>
        </View>

        {/* Group Selector Chips (Seamless Switch between Circles) */}
        <View style={styles.groupChipsContainer}>
          <ThemedText variant="caption" style={styles.groupChipsTitle}>
            SELECT GROUP TO VIEW HISTORY 👥
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

        {/* Cloud Sync Status Indicator */}
        {isCloudConnected && (
          <View style={styles.cloudBadgeRow}>
            <View style={styles.cloudDot} />
            <ThemedText variant="caption" style={styles.cloudBadgeText}>
              Supabase Ledger Synced
            </ThemedText>
          </View>
        )}

        {/* Dynamic Avatar Strip: Only Touched / Active Players */}
        <View style={styles.avatarStrip}>
          {activeSlots.map((player) => (
            <View key={player.id} style={styles.avatarWrap}>
              <AvatarImage
                avatarKey={player.avatarKey || 'AV-01'}
                name={player.name}
                size={52}
                borderColor={player.colorHex}
                borderWidth={2.5}
                showCrown={Boolean(maxLossPlayerId && player.id === maxLossPlayerId)}
              />
              <ThemedText variant="caption" style={styles.avatarName} numberOfLines={1}>
                {player.name}
              </ThemedText>
              {Boolean(maxLossPlayerId && player.id === maxLossPlayerId) && (
                <View style={styles.miniCrown}>
                  <CrownDoodle size={16} color="#FFEA00" />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Dynamic Loss Distribution Bar Graph for this Circle */}
        <View style={styles.barsCard}>
          <View style={styles.cardHeaderRow}>
            <ThemedText variant="caption" style={styles.cardHeaderCaption}>
              LOSS DISTRIBUTION 📊
            </ThemedText>
            <ThemedText variant="caption" style={styles.totalMatchesCaption}>
              {circleHistory.length} {circleHistory.length === 1 ? 'game' : 'games'} recorded
            </ThemedText>
          </View>

          {circleHistory.length === 0 ? (
            <View style={styles.emptyStateBox}>
              <ThemedText style={styles.emptyStateIcon}>🌱</ThemedText>
              <ThemedText variant="body" style={styles.emptyStateTitle}>
                0 Games Recorded Yet
              </ThemedText>
              <ThemedText variant="caption" style={styles.emptyStateSubtitle}>
                Play a match to start tracking who pays the bills in {activeCircle.name}!
              </ThemedText>
            </View>
          ) : (
            playerStats.map((player) => (
              <View key={player.id} style={styles.barRow}>
                <ThemedText variant="body" style={styles.playerName} numberOfLines={1}>
                  {player.name}
                </ThemedText>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: player.barWidth,
                        backgroundColor: player.color,
                        shadowColor: player.color,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.7,
                        shadowRadius: 8,
                      },
                    ]}
                  />
                </View>
                <ThemedText variant="caption" style={styles.countLabel}>
                  {player.count} {player.count === 1 ? 'time' : 'times'}
                </ThemedText>
              </View>
            ))
          )}
        </View>

        {/* Dynamic Recent Decisions Section */}
        <View style={styles.sectionHeader}>
          <ThemedText variant="heading2" style={styles.sectionTitle}>
            Recent Decisions
          </ThemedText>
        </View>

        <View style={styles.decisionsList}>
          {recentDecisions.length === 0 ? (
            <ThemedText style={styles.emptyText}>No games recorded yet for this group. Play a game to log history!</ThemedText>
          ) : (
            recentDecisions.map((item) => (
              <View key={item.id} style={styles.decisionItem}>
                <View style={styles.decisionLeft}>
                  <ThemedText style={styles.decisionIcon}>{item.icon}</ThemedText>
                  <View style={styles.decisionTitleWrap}>
                    <ThemedText variant="body" style={styles.decisionTitle} numberOfLines={1}>
                      {item.dilemma} —{' '}
                      <ThemedText style={{ color: colors.textPrimary, fontWeight: '800' }}>
                        {item.outcome}
                      </ThemedText>
                    </ThemedText>
                  </View>
                </View>
                <ThemedText variant="caption" style={styles.decisionTime}>
                  {item.timeAgo}
                </ThemedText>
              </View>
            ))
          )}
        </View>

        {/* Bottom Nav actions to Karma and Circles */}
        <View style={styles.bottomNavSection}>
          <PrimaryButton
            label="Check Karma Meter ✨"
            variant="primary"
            onPress={() => {
              triggerHaptic('selection');
              navigation.navigate('KarmaMeter');
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
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: colors.accentCyan,
    fontSize: 12,
    marginTop: 2,
    fontWeight: '700',
  },
  karmaBtn: {
    backgroundColor: 'rgba(0, 240, 255, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.accentCyan,
  },
  karmaBtnText: {
    color: colors.accentCyan,
    fontWeight: '800',
    fontSize: 12,
  },
  groupChipsContainer: {
    marginBottom: spacing.md,
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
  cloudBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    marginBottom: spacing.md,
  },
  cloudDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  cloudBadgeText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  avatarStrip: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  avatarWrap: {
    alignItems: 'center',
    position: 'relative',
  },
  avatarName: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: spacing.xs,
    maxWidth: 58,
    textAlign: 'center',
  },
  miniCrown: {
    position: 'absolute',
    top: -12,
    right: 4,
    transform: [{ rotate: '15deg' }],
  },
  barsCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderCaption: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  totalMatchesCaption: {
    color: colors.accentMint,
    fontSize: 11,
    fontWeight: '700',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  playerName: {
    width: 64,
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  barTrack: {
    flex: 1,
    height: 14,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 7,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 7,
  },
  countLabel: {
    width: 64,
    color: colors.textSecondary,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  decisionsList: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  decisionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  decisionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  decisionIcon: {
    fontSize: 20,
  },
  decisionTitleWrap: {
    flex: 1,
  },
  decisionTitle: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  decisionTime: {
    color: colors.textMuted,
    fontSize: 11,
    marginLeft: spacing.sm,
  },
  emptyText: {
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  emptyStateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  emptyStateIcon: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  emptyStateTitle: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 12,
  },
  bottomNavSection: {
    marginTop: spacing.xs,
  },
});
