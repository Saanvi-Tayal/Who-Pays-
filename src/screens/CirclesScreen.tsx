import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ThemedText } from '@/components/typography/ThemedText';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { AnimatedPressable } from '@/components/buttons/AnimatedPressable';
import { useSessionStore } from '@/features/session/sessionStore';
import { RootStackScreenProps } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { triggerHaptic } from '@/utils/haptics';

export const CirclesScreen: React.FC<RootStackScreenProps<'Circles'>> = ({ navigation }) => {
  const { circles, activeCircle, setActiveCircle, addCircle, slots } = useSessionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎉');

  const EMOJI_OPTIONS = ['🎉', '🍕', '🍻', '🎮', '🏖️', '🚀', '⚡', '👑'];

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    triggerHaptic('medium');
    const newCircle = {
      id: `circle-${Date.now()}`,
      name: newGroupName.trim(),
      members: slots.filter((s) => s.isActive).length || 4,
      decisions: 0,
      emoji: selectedEmoji,
    };
    addCircle(newCircle);
    setNewGroupName('');
    setIsModalOpen(false);
  };

  const handleSelectCircle = (circle: typeof circles[0]) => {
    triggerHaptic('selection');
    setActiveCircle(circle);
    navigation.navigate('GroupHistory');
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header matching Screen 8 */}
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
          <ThemedText variant="heading1" style={styles.headerTitle}>
            Your Circles ✨
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add new circle"
            onPress={() => {
              triggerHaptic('light');
              setIsModalOpen(true);
            }}
            style={styles.plusButton}
          >
            <ThemedText style={styles.plusIcon}>+</ThemedText>
          </Pressable>
        </View>

        {/* List of Circle Cards matching reference Screen 8 */}
        <View style={styles.circlesList}>
          {circles.map((circle) => {
            const isActive = circle.id === activeCircle.id;

            return (
              <AnimatedPressable
                key={circle.id}
                style={[
                  styles.circleCard,
                  isActive && styles.circleCardActive,
                ]}
                onPress={() => handleSelectCircle(circle)}
                accessibilityRole="button"
                accessibilityLabel={`${circle.name}, ${circle.members} members, ${circle.decisions} decisions`}
              >
                <View style={styles.circleAvatarBubble}>
                  <ThemedText style={styles.circleEmoji}>{circle.emoji}</ThemedText>
                </View>

                <View style={styles.circleDetails}>
                  <View style={styles.titleWithActiveRow}>
                    <ThemedText variant="heading2" style={styles.circleName}>
                      {circle.name}
                    </ThemedText>
                    {isActive && (
                      <View style={styles.activeBadge}>
                        <ThemedText style={styles.activeBadgeText}>ACTIVE</ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText variant="caption" style={styles.circleStats}>
                    {circle.members} members · {circle.decisions} decisions
                  </ThemedText>
                </View>

                <ThemedText style={styles.chevron}>→</ThemedText>
              </AnimatedPressable>
            );
          })}

          {/* "+ Create New Group" Dashed Button */}
          <Pressable
            style={styles.createGroupDashedButton}
            onPress={() => {
              triggerHaptic('light');
              setIsModalOpen(true);
            }}
            accessibilityRole="button"
            accessibilityLabel="Create New Group"
          >
            <ThemedText style={styles.createGroupText}>
              + Create New Group
            </ThemedText>
          </Pressable>
        </View>

        {/* Bottom Slogan & New Game CTA */}
        <View style={styles.footerSection}>
          <ThemedText style={styles.sloganText}>
            Decide. Play. Repeat. 👑
          </ThemedText>
          <PrimaryButton
            label="Start Playing (Stakes) ⚡"
            variant="primary"
            onPress={() => {
              triggerHaptic('medium');
              navigation.navigate('Stakes');
            }}
            style={styles.newGameButton}
          />
        </View>
      </ScrollView>

      {/* Create New Group Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <ThemedText variant="heading2" style={styles.modalTitle}>
                Create New Group 👥
              </ThemedText>
              <Pressable
                onPress={() => setIsModalOpen(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <ThemedText style={styles.modalCloseText}>✕</ThemedText>
              </Pressable>
            </View>

            <ThemedText variant="caption" style={styles.modalInputLabel}>
              Group Name
            </ThemedText>
            <TextInput
              style={styles.modalInput}
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="e.g. Weekend Crew"
              placeholderTextColor={colors.textMuted}
              maxLength={24}
              autoFocus
            />

            <ThemedText variant="caption" style={styles.modalInputLabel}>
              Pick an Icon
            </ThemedText>
            <View style={styles.emojiRow}>
              {EMOJI_OPTIONS.map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => {
                    triggerHaptic('selection');
                    setSelectedEmoji(emoji);
                  }}
                  style={[
                    styles.emojiBubble,
                    selectedEmoji === emoji && styles.emojiBubbleSelected,
                  ]}
                >
                  <ThemedText style={styles.emojiText}>{emoji}</ThemedText>
                </Pressable>
              ))}
            </View>

            <PrimaryButton
              label="Save Group ✨"
              variant="primary"
              onPress={handleCreateGroup}
              style={{ marginTop: spacing.lg }}
            />
          </View>
        </View>
      </Modal>
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
    fontSize: 26,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontWeight: '800',
    fontSize: 22,
  },
  plusButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 46, 147, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    color: colors.accentPink,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },
  circlesList: {
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  circleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    gap: spacing.md,
  },
  circleCardActive: {
    borderColor: colors.accentMint,
    backgroundColor: 'rgba(0, 245, 160, 0.08)',
    shadowColor: colors.accentMint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  circleAvatarBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleEmoji: {
    fontSize: 24,
  },
  circleDetails: {
    flex: 1,
  },
  titleWithActiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  circleName: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
  activeBadge: {
    backgroundColor: colors.accentMint,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  activeBadgeText: {
    color: colors.textInverse,
    fontWeight: '900',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  circleStats: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  chevron: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: '700',
  },
  createGroupDashedButton: {
    height: 52,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  createGroupText: {
    color: colors.textSecondary,
    fontWeight: '700',
    fontSize: 14,
  },
  footerSection: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  sloganText: {
    color: colors.accentGold,
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: 0.5,
  },
  newGameButton: {
    width: '100%',
    backgroundColor: colors.accentPink,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  modalCloseText: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: '700',
  },
  modalInputLabel: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: '700',
  },
  modalInput: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emojiBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  emojiBubbleSelected: {
    borderColor: colors.accentPink,
    backgroundColor: 'rgba(255, 46, 147, 0.2)',
  },
  emojiText: {
    fontSize: 18,
  },
});
