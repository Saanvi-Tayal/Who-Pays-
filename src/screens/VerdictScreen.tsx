import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { AnimatedPressable } from '@/components/buttons/AnimatedPressable';
import { AvatarImage } from '@/components/avatars/AvatarImage';
import { CrownDoodle, SparkleDoodle } from '@/components/illustrations/DoodlesSvg';
import { useSessionStore } from '@/features/session/sessionStore';
import { RootStackScreenProps } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { triggerHaptic } from '@/utils/haptics';
import { playVerdictFanfareSound } from '@/utils/soundEffects';

export const VerdictScreen: React.FC<RootStackScreenProps<'Verdict'>> = ({ navigation }) => {
  const { slots, lastResult, selectedGame, selectedMode, resetRound } = useSessionStore();

  React.useEffect(() => {
    playVerdictFanfareSound().catch(() => {});
  }, []);

  // Find loser slot
  const loserSlot = slots.find((s) => s.id === lastResult?.loserSlotId) || slots[0];

  const getConsequenceTitle = () => {
    const colorName = loserSlot.colorId.toUpperCase();
    switch (selectedMode) {
      case 'who_pays':
        return `${colorName} PAYS!`;
      case 'awkward_duty':
        return `${colorName} BUYS!`;
      case 'ledger_vengeance':
        return `VENGEANCE!`;
      case 'aux_cord_dictator':
        return `NO AUX FOR ${colorName}!`;
      case 'screen_time_penalty':
        return `${colorName} PENALTY!`;
      default:
        return `${colorName} PAYS!`;
    }
  };

  const getConsequenceSubtitle = () => {
    switch (selectedMode) {
      case 'who_pays':
        return `${loserSlot.name} has been chosen to pay the bill (again...)`;
      case 'awkward_duty':
        return `${loserSlot.name} must do the awkward social duty!`;
      case 'ledger_vengeance':
        return `The Ledger strikes! ${loserSlot.name} suffers defeat.`;
      case 'aux_cord_dictator':
        return `${loserSlot.name} loses control of the music playlist.`;
      case 'screen_time_penalty':
        return `${loserSlot.name} must keep their phone face-down!`;
      default:
        return `${loserSlot.name} has been chosen by the gods of chaos!`;
    }
  };

  const handleRematch = () => {
    triggerHaptic('medium');
    resetRound();
    if (selectedGame === 'time_bomb') {
      navigation.navigate('TimeBombArena');
    } else if (selectedGame === 'roulette') {
      navigation.navigate('RouletteArena');
    } else if (selectedGame === 'tap_frenzy') {
      navigation.navigate('TapFrenzyArena');
    } else {
      navigation.navigate('ReactionStandoffArena');
    }
  };

  const handleLogIt = () => {
    triggerHaptic('selection');
    navigation.navigate('GroupHistory');
  };

  return (
    <ScreenContainer style={styles.container}>
      {/* Top Navigation Bar with Direct Stakes & Lobby Access */}
      <View style={styles.topNavRow}>
        <AnimatedPressable
          onPress={() => {
            triggerHaptic('light');
            navigation.navigate('Stakes');
          }}
          style={styles.navBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Back to Stakes"
        >
          <ThemedText style={styles.navBtnText}>‹ Stakes</ThemedText>
        </AnimatedPressable>

        <View style={styles.navCenterRow}>
          <ThemedText variant="heading2" style={styles.navCenterLabel}>
            Verdict
          </ThemedText>
          <SparkleDoodle size={16} color="#FFEA00" />
        </View>

        <AnimatedPressable
          onPress={() => {
            triggerHaptic('light');
            navigation.navigate('GameLobby');
          }}
          style={styles.navBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Go to Lobby"
        >
          <ThemedText style={styles.navBtnText}>Lobby 🎮</ThemedText>
        </AnimatedPressable>
      </View>

      {/* Loser Highlight Section - Clean, Focused Presentation matching Screen 5 */}
      <View style={styles.loserCard}>
        {/* Crown tilted atop the avatar */}
        <View style={styles.crownWrapper}>
          <CrownDoodle size={48} color="#FFEA00" />
        </View>

        {/* Large Prominent Loser Avatar */}
        <AvatarImage
          avatarKey={loserSlot.avatarKey || 'AV-01'}
          name={loserSlot.name}
          size={140}
          borderColor={loserSlot.colorHex}
          borderWidth={4}
          showCrown={false}
        />

        {/* Player Name and Color Badge */}
        <View
          style={[
            styles.playerColorTag,
            { borderColor: loserSlot.colorHex, backgroundColor: 'rgba(255,255,255,0.08)' },
          ]}
        >
          <ThemedText style={[styles.playerColorTagText, { color: loserSlot.colorHex }]}>
            {loserSlot.colorId.toUpperCase()} • {loserSlot.name}
          </ThemedText>
        </View>
      </View>

      {/* Giant Fiery Verdict Text */}
      <View style={styles.verdictSection}>
        <ThemedText style={[styles.verdictHero, { color: loserSlot.colorHex }]}>
          {getConsequenceTitle()}
        </ThemedText>
        <ThemedText variant="body" style={styles.verdictSubtitle}>
          {getConsequenceSubtitle()}
        </ThemedText>
      </View>

      {/* Two Action Buttons matching reference Screen 5 */}
      <View style={styles.actionsSection}>
        <PrimaryButton
          label="Rematch 🔄"
          variant="rematch"
          onPress={handleRematch}
          style={styles.rematchButton}
        />
        <PrimaryButton
          label="Log It 📊"
          variant="secondary"
          onPress={handleLogIt}
          style={styles.logItButton}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: spacing.md,
    zIndex: 20,
  },
  navBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  navBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  navCenterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navCenterLabel: {
    color: colors.textPrimary,
    fontWeight: '900',
    fontSize: 18,
  },
  loserCard: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  crownWrapper: {
    marginBottom: -16,
    zIndex: 10,
    transform: [{ rotate: '12deg' }, { translateX: 14 }],
  },
  playerColorTag: {
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    marginTop: spacing.md,
  },
  playerColorTagText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  verdictSection: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  verdictHero: {
    fontWeight: '900',
    fontSize: 42,
    letterSpacing: -1,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  verdictSubtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: spacing.xs,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  actionsSection: {
    width: '100%',
    gap: spacing.md,
  },
  rematchButton: {
    backgroundColor: '#FF6433',
    height: 56,
  },
  logItButton: {
    backgroundColor: '#26183B',
    borderColor: '#4D2A72',
    borderWidth: 1.5,
    height: 56,
  },
});
