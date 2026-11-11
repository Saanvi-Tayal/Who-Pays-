import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { AnimatedPressable } from '@/components/buttons/AnimatedPressable';
import { CrownDoodle, SparkleDoodle } from '@/components/illustrations/DoodlesSvg';
import {
  MoneyBagSvg,
  AwkwardDutySvg,
  ScalesJusticeSvg,
  AuxHeadphonesSvg,
  ScreenTimeSvg,
} from '@/components/illustrations/GameArtSvg';
import { useSessionStore, StakesModeId } from '@/features/session/sessionStore';
import { RootStackScreenProps } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { triggerHaptic } from '@/utils/haptics';

interface ModeOption {
  id: StakesModeId;
  title: string;
  subtitle: string;
  accentColor: string;
  renderIllustration: (size?: number) => React.ReactNode;
}

const MODES: ModeOption[] = [
  {
    id: 'who_pays',
    title: 'Who\nPays?',
    subtitle: 'The classic bill-roulette for food, drinks & outings',
    accentColor: '#FF4081',
    renderIllustration: (size) => <MoneyBagSvg size={size} />,
  },
  {
    id: 'awkward_duty',
    title: 'Awkward\nDuty',
    subtitle: 'Ask waiter to fix order, take out the trash, or talk to landlord',
    accentColor: '#FF9800',
    renderIllustration: (size) => <AwkwardDutySvg size={size} />,
  },
  {
    id: 'ledger_vengeance',
    title: 'Ledger\nVengeance',
    subtitle: 'Sudden-death duel targeting the least-paying historical players',
    accentColor: '#7C4DFF',
    renderIllustration: (size) => <ScalesJusticeSvg size={size} />,
  },
  {
    id: 'aux_cord_dictator',
    title: 'Aux Cord\nDictator',
    subtitle: 'Winner takes absolute autocratic control of the car playlist',
    accentColor: '#00E5FF',
    renderIllustration: (size) => <AuxHeadphonesSvg size={size} />,
  },
  {
    id: 'screen_time_penalty',
    title: 'Screen Time\nPenalty',
    subtitle: 'Phones face-down on table — first person to touch theirs pays!',
    accentColor: '#FF5252',
    renderIllustration: (size) => <ScreenTimeSvg size={size} />,
  },
];

const CATEGORIES = [
  { id: 'eat', label: 'Where to Eat?', icon: '🍕' },
  { id: 'watch', label: 'What to Watch?', icon: '🎬' },
  { id: 'custom', label: 'Custom Game', icon: '⭐' },
];

export const StakesScreen: React.FC<RootStackScreenProps<'Stakes'>> = ({ navigation }) => {
  const {
    selectedMode,
    setStakesMode,
    selectedCategory,
    setSelectedCategory,
    history,
  } = useSessionStore();

  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customInputText, setCustomInputText] = useState('');

  const currentIdx = MODES.findIndex((m) => m.id === selectedMode);
  const activeMode = MODES[currentIdx] || MODES[0];

  const hasHistory = history.length > 0;
  const isLedgerVengeance = activeMode.id === 'ledger_vengeance';

  const handlePrev = () => {
    triggerHaptic('light');
    const prevIdx = (currentIdx - 1 + MODES.length) % MODES.length;
    setStakesMode(MODES[prevIdx].id);
  };

  const handleNext = () => {
    triggerHaptic('light');
    const nextIdx = (currentIdx + 1) % MODES.length;
    setStakesMode(MODES[nextIdx].id);
  };

  const handleCategoryPress = (cat: typeof CATEGORIES[0]) => {
    triggerHaptic('selection');
    if (cat.id === 'custom') {
      setCustomModalVisible(true);
    } else {
      setSelectedCategory(cat.label);
    }
  };

  const handleSaveCustomCategory = () => {
    if (customInputText.trim().length > 0) {
      setSelectedCategory(customInputText.trim());
    } else {
      setSelectedCategory('Custom Dilemma');
    }
    setCustomModalVisible(false);
    triggerHaptic('success');
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header matching reference */}
        <View style={styles.header}>
          <View style={styles.topNavRow}>
            <AnimatedPressable
              onPress={() => {
                triggerHaptic('light');
                navigation.navigate('DropIn');
              }}
              style={styles.navBackButton}
              accessibilityRole="button"
              accessibilityLabel="Back to Touch Screen"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ThemedText style={styles.navBackIcon}>‹</ThemedText>
              <ThemedText style={styles.navBackLabel}>Touch In 👆</ThemedText>
            </AnimatedPressable>

            <View style={styles.titleRow}>
              <ThemedText variant="display" style={styles.title}>
                The Stakes
              </ThemedText>
              <CrownDoodle size={30} color="#FFB800" />
            </View>

            <AnimatedPressable
              onPress={() => {
                triggerHaptic('light');
                navigation.navigate('PlayerSetup');
              }}
              style={styles.navRightButton}
              accessibilityRole="button"
              accessibilityLabel="Player Setup"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <ThemedText style={styles.navRightLabel}>Players 👥</ThemedText>
            </AnimatedPressable>
          </View>

          <View style={styles.subtitleRow}>
            <ThemedText variant="body" style={styles.subtitle}>
              What are we deciding today?
            </ThemedText>
            <SparkleDoodle size={16} color="#FFE082" />
          </View>
        </View>

        {/* Big Central Carousel Card matching reference Screen 2 */}
        <View style={styles.carouselContainer}>
          <AnimatedPressable
            accessibilityRole="button"
            accessibilityLabel="Previous mode"
            style={styles.arrowButton}
            onPress={handlePrev}
          >
            <ThemedText style={styles.arrowText}>‹</ThemedText>
          </AnimatedPressable>

          <View style={[styles.bigCard, { borderColor: activeMode.accentColor }]}>
            {/* Ambient Top Glow */}
            <View
              style={[
                styles.cardTopGlow,
                { backgroundColor: activeMode.accentColor },
              ]}
            />

            <View style={styles.illustrationWrapper}>
              {activeMode.renderIllustration(100)}
            </View>

            <ThemedText variant="display" style={styles.cardTitle}>
              {activeMode.title}
            </ThemedText>

            <ThemedText variant="caption" style={styles.cardSubtitle}>
              {activeMode.subtitle}
            </ThemedText>

            {/* Empty History Warning for Ledger Vengeance */}
            {isLedgerVengeance && !hasHistory && (
              <View style={styles.historyWarningBox}>
                <ThemedText style={styles.historyWarningText}>
                  ⚖️ Requires Past Match History
                </ThemedText>
                <ThemedText style={styles.historyWarningSub}>
                  No recorded matches yet in this group. You can play a standard round first to record karma!
                </ThemedText>
              </View>
            )}
          </View>

          <AnimatedPressable
            accessibilityRole="button"
            accessibilityLabel="Next mode"
            style={styles.arrowButton}
            onPress={handleNext}
          >
            <ThemedText style={styles.arrowText}>›</ThemedText>
          </AnimatedPressable>
        </View>

        {/* Carousel Indicator Dots */}
        <View style={styles.dotRow}>
          {MODES.map((m, idx) => {
            const isSelected = idx === currentIdx;
            return (
              <Pressable
                key={m.id}
                onPress={() => {
                  triggerHaptic('light');
                  setStakesMode(m.id);
                }}
                style={[
                  styles.dot,
                  isSelected && [
                    styles.activeDot,
                    { backgroundColor: activeMode.accentColor, width: 22 },
                  ],
                ]}
              />
            );
          })}
        </View>

        {/* Quick Dilemma Chips Row matching reference Screen 2 */}
        <View style={styles.categorySection}>
          <View style={styles.chipRow}>
            {CATEGORIES.map((cat) => {
              const isSelected =
                (cat.id === 'custom' &&
                  selectedCategory !== 'Where to Eat?' &&
                  selectedCategory !== 'What to Watch?') ||
                selectedCategory === cat.label;

              return (
                <AnimatedPressable
                  key={cat.id}
                  style={[
                    styles.pillButton,
                    isSelected && [
                      styles.pillButtonActive,
                      { borderColor: activeMode.accentColor },
                    ],
                  ]}
                  onPress={() => handleCategoryPress(cat)}
                >
                  <ThemedText style={styles.pillIcon}>{cat.icon}</ThemedText>
                  <ThemedText
                    variant="caption"
                    style={[
                      styles.pillLabel,
                      isSelected && { color: '#FFF', fontWeight: '800' },
                    ]}
                  >
                    {cat.id === 'custom' && selectedCategory !== 'Where to Eat?' && selectedCategory !== 'What to Watch?'
                      ? selectedCategory
                      : cat.label}
                  </ThemedText>
                </AnimatedPressable>
              );
            })}
          </View>
        </View>

        {/* Stepper Roadmap & Bottom Next Action */}
        <View style={styles.bottomBar}>
          <ThemedText variant="caption" style={styles.stepperNote}>
            2. Choose a Dilemma → 3. Play the Game
          </ThemedText>
          <PrimaryButton
            label="Next →"
            onPress={() => {
              triggerHaptic('medium');
              navigation.navigate('GameLobby');
            }}
            style={styles.nextButton}
          />
        </View>
      </ScrollView>

      {/* Custom Dilemma Input Modal */}
      <Modal
        visible={customModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCustomModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <ThemedText variant="heading2" style={styles.modalTitle}>
              Custom Dilemma ⭐
            </ThemedText>
            <ThemedText variant="caption" style={styles.modalSubtitle}>
              What dispute are you settling? (e.g. Who washes dishes, Who drives)
            </ThemedText>

            <TextInput
              value={customInputText}
              onChangeText={setCustomInputText}
              placeholder="e.g. Who pays for Uber?"
              placeholderTextColor={colors.textMuted}
              style={styles.modalInput}
              autoFocus
              maxLength={40}
            />

            <View style={styles.modalBtnRow}>
              <AnimatedPressable
                onPress={() => setCustomModalVisible(false)}
                style={styles.modalCancelBtn}
              >
                <ThemedText style={styles.modalCancelText}>Cancel</ThemedText>
              </AnimatedPressable>
              <AnimatedPressable
                onPress={handleSaveCustomCategory}
                style={styles.modalSaveBtn}
              >
                <ThemedText style={styles.modalSaveText}>Set Dilemma</ThemedText>
              </AnimatedPressable>
            </View>
          </View>
        </View>
      </Modal>
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
  navRightButton: {
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
  navRightLabel: {
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
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: spacing.lg,
    gap: spacing.sm,
  },
  arrowButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 30,
    marginTop: -2,
  },
  bigCard: {
    flex: 1,
    backgroundColor: 'rgba(26, 11, 46, 0.85)',
    borderRadius: 28,
    borderWidth: 2,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
    shadowColor: '#FF4081',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  cardTopGlow: {
    position: 'absolute',
    top: -50,
    width: 140,
    height: 80,
    borderRadius: 40,
    opacity: 0.2,
  },
  illustrationWrapper: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    color: '#FFF9F0',
    fontWeight: '900',
    fontSize: 32,
    textAlign: 'center',
    lineHeight: 36,
  },
  cardSubtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 18,
    paddingHorizontal: spacing.sm,
  },
  historyWarningBox: {
    backgroundColor: 'rgba(124, 77, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#7C4DFF',
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  historyWarningText: {
    color: '#B388FF',
    fontWeight: '800',
    fontSize: 12,
  },
  historyWarningSub: {
    color: colors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeDot: {
    height: 8,
    borderRadius: 4,
  },
  categorySection: {
    width: '100%',
    marginVertical: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  pillButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(26, 11, 46, 0.7)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 4,
  },
  pillButtonActive: {
    backgroundColor: 'rgba(255, 64, 129, 0.15)',
  },
  pillIcon: {
    fontSize: 22,
  },
  pillLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  bottomBar: {
    width: '100%',
    gap: spacing.sm,
    paddingTop: spacing.md,
  },
  stepperNote: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: colors.accentPink,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalBox: {
    backgroundColor: '#1E1233',
    borderRadius: 24,
    padding: spacing.xl,
    width: '100%',
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
  },
  modalTitle: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 20,
  },
  modalSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: '#FFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.accentPink,
    marginBottom: spacing.lg,
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
  },
  modalCancelBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  modalCancelText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  modalSaveBtn: {
    backgroundColor: colors.accentPink,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  modalSaveText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
