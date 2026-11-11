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
import { AnimatedPressable } from '@/components/buttons/AnimatedPressable';
import { PrimaryButton } from '@/components/buttons/PrimaryButton';
import { AnimatedSwitch } from '@/components/buttons/AnimatedSwitch';
import { AvatarImage } from '@/components/avatars/AvatarImage';
import { AVATAR_METADATA } from '@/components/illustrations/AvatarsSvg';
import { SparkleDoodle } from '@/components/illustrations/DoodlesSvg';
import { useSessionStore, PlayerSlot } from '@/features/session/sessionStore';
import { RootStackScreenProps } from '@/navigation/types';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';
import { triggerHaptic } from '@/utils/haptics';

export const PlayerSetupScreen: React.FC<RootStackScreenProps<'PlayerSetup'>> = ({
  navigation,
}) => {
  const {
    slots,
    toggleSlotActive,
    updateSlotName,
    updateSlotAvatar,
    fairnessMode,
    toggleFairnessMode,
    circles,
    activeCircle,
    setActiveCircle,
    applyGroupToSlots,
    addCircle,
    addPlayerToActiveCircle,
    removePlayerFromActiveCircle,
  } = useSessionStore();

  // Avatar picker modal state
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);

  // Add group modal state
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎉');

  const EMOJI_OPTIONS = ['🎉', '🍕', '🍻', '🎮', '🏖️', '🚀', '⚡', '👑', '🎓', '💼', '🏠', '🔥'];

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    triggerHaptic('medium');
    const newCircle = {
      id: `circle-${Date.now()}`,
      name: newGroupName.trim(),
      members: 4,
      decisions: 0,
      emoji: selectedEmoji,
    };
    addCircle(newCircle);
    setNewGroupName('');
    setIsAddGroupModalOpen(false);
  };

  // Active players count
  const activeCount = slots.filter((s) => s.isActive).length;
  const canProceed = activeCount >= 2 && activeCount <= 8;

  const handleOpenAvatarPicker = (slotId: string) => {
    triggerHaptic('light');
    setEditingSlotId(slotId);
  };

  const handleSelectAvatar = (avatarKey: string) => {
    if (editingSlotId) {
      triggerHaptic('selection');
      updateSlotAvatar(editingSlotId, avatarKey);
      setEditingSlotId(null);
    }
  };

  const handleProceed = () => {
    if (!canProceed) return;
    triggerHaptic('medium');
    navigation.navigate('Stakes');
  };

  return (
    <ScreenContainer style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <AnimatedPressable
          onPress={() => {
            triggerHaptic('light');
            navigation.goBack();
          }}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Back to Drop In"
        >
          <ThemedText style={styles.backButtonIcon}>‹</ThemedText>
          <ThemedText style={styles.backButtonLabel}>Back</ThemedText>
        </AnimatedPressable>

        <View style={styles.headerCenter}>
          <View style={styles.titleBadgeRow}>
            <ThemedText variant="heading2" style={styles.screenTitle}>
              Player Setup
            </ThemedText>
            <SparkleDoodle size={18} color="#FF4081" />
          </View>
          <ThemedText variant="caption" style={styles.screenSubtitle}>
            Tap avatars to edit • 2–8 players
          </ThemedText>
        </View>

        {/* Counter Badge */}
        <View
          style={[
            styles.countBadge,
            { backgroundColor: canProceed ? 'rgba(0, 230, 118, 0.2)' : 'rgba(255, 64, 129, 0.2)' },
          ]}
        >
          <ThemedText
            style={[
              styles.countBadgeText,
              { color: canProceed ? '#00E676' : '#FF4081' },
            ]}
          >
            {activeCount}/{slots.length}
          </ThemedText>
        </View>
      </View>

      {/* Scrollable Player List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Which Group is this? */}
        <View style={styles.groupSection}>
          <ThemedText variant="caption" style={styles.groupSectionTitle}>
            WHICH GROUP IS PLAYING? 👥
          </ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.groupChipsRow}
          >
            {circles.map((c) => {
              const isSelected = c.id === activeCircle.id;
              return (
                <AnimatedPressable
                  key={c.id}
                  onPress={() => {
                    triggerHaptic('selection');
                    setActiveCircle(c);
                    applyGroupToSlots(c.id);
                  }}
                  style={[
                    styles.groupChip,
                    isSelected && styles.groupChipSelected,
                  ]}
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

            {/* + Add Group Chip */}
            <AnimatedPressable
              onPress={() => {
                triggerHaptic('light');
                setIsAddGroupModalOpen(true);
              }}
              style={styles.addGroupChip}
              accessibilityRole="button"
              accessibilityLabel="Add New Group"
            >
              <ThemedText style={styles.addGroupChipPlus}>+</ThemedText>
              <ThemedText style={styles.addGroupChipText}>Add Group</ThemedText>
            </AnimatedPressable>
          </ScrollView>
        </View>

        <ThemedText variant="caption" style={styles.playersSectionTitle}>
          PLAYERS ({activeCount}) • NAMES OPTIONAL
        </ThemedText>

        {slots.map((slot: PlayerSlot, idx: number) => {
          const isSlotActive = slot.isActive;
          const defaultAlphaName = `Player ${String.fromCharCode(65 + idx)}`;

          return (
            <View
              key={slot.id}
              style={[
                styles.playerCard,
                {
                  borderColor: isSlotActive ? slot.colorHex : 'rgba(255,255,255,0.1)',
                  opacity: isSlotActive ? 1 : 0.45,
                },
              ]}
            >
              {/* Avatar with tap-to-change overlay */}
              <AnimatedPressable
                onPress={() => handleOpenAvatarPicker(slot.id)}
                style={styles.avatarButton}
              >
                <AvatarImage
                  avatarKey={slot.avatarKey || `AV-0${(idx % 12) + 1}`}
                  name={slot.name}
                  size={58}
                  borderColor={slot.colorHex}
                  borderWidth={2.5}
                />
                <View style={styles.editBadge}>
                  <ThemedText style={styles.editBadgeText}>✎</ThemedText>
                </View>
              </AnimatedPressable>

              {/* Player Info & Name Input */}
              <View style={styles.playerInfo}>
                <View style={styles.slotTagRow}>
                  <View style={[styles.colorDot, { backgroundColor: slot.colorHex }]} />
                  <ThemedText variant="caption" style={styles.slotLabel}>
                    SLOT #{idx + 1}
                  </ThemedText>
                </View>
                <TextInput
                  value={slot.name}
                  onChangeText={(text) => updateSlotName(slot.id, text)}
                  placeholder={`${defaultAlphaName} (Optional)`}
                  placeholderTextColor={colors.textMuted}
                  style={styles.nameInput}
                  maxLength={16}
                  editable={isSlotActive}
                />
              </View>

              {/* Card Actions (IN/OUT & Remove) */}
              <View style={styles.cardActionsCol}>
                <AnimatedPressable
                  onPress={() => {
                    triggerHaptic('selection');
                    toggleSlotActive(slot.id);
                  }}
                  style={[
                    styles.toggleButton,
                    isSlotActive ? styles.toggleActive : styles.toggleInactive,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.toggleText,
                      isSlotActive ? styles.toggleTextActive : styles.toggleTextInactive,
                    ]}
                  >
                    {isSlotActive ? 'IN' : 'OUT'}
                  </ThemedText>
                </AnimatedPressable>

                <AnimatedPressable
                  onPress={() => {
                    if (slots.length <= 2) {
                      triggerHaptic('warning');
                      return;
                    }
                    triggerHaptic('medium');
                    removePlayerFromActiveCircle(slot.id);
                  }}
                  style={[
                    styles.removePlayerBtn,
                    slots.length <= 2 && styles.removePlayerBtnDisabled,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${slot.name}`}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <ThemedText style={styles.removePlayerIcon}>✕</ThemedText>
                </AnimatedPressable>
              </View>
            </View>
          );
        })}

        {/* + Add Player Button */}
        {slots.length < 8 ? (
          <AnimatedPressable
            onPress={() => {
              triggerHaptic('success');
              addPlayerToActiveCircle();
            }}
            style={styles.addPlayerButton}
            accessibilityRole="button"
            accessibilityLabel="Add Person to Group"
          >
            <ThemedText style={styles.addPlayerPlus}>+</ThemedText>
            <ThemedText style={styles.addPlayerText}>
              Add Person to {activeCircle.name} ({slots.length}/8)
            </ThemedText>
          </AnimatedPressable>
        ) : (
          <View style={styles.maxPlayersNote}>
            <ThemedText variant="caption" style={styles.maxPlayersText}>
              Maximum 8 players reached for this party
            </ThemedText>
          </View>
        )}

        {/* Validation Warning when < 2 players */}
        {!canProceed && (
          <View style={styles.warningBox}>
            <ThemedText style={styles.warningText}>
              ⚠️ Need at least 2 active players to start!
            </ThemedText>
          </View>
        )}

        {/* Fairness Mode Toggle Card */}
        <AnimatedPressable
          onPress={() => {
            triggerHaptic('light');
            toggleFairnessMode();
          }}
          style={styles.fairnessCard}
        >
          <ThemedText style={styles.fairnessEmoji}>🎉</ThemedText>
          <View style={styles.fairnessTextCol}>
            <ThemedText variant="heading3" style={styles.fairnessTitle}>
              Fairness Mode: {fairnessMode ? 'ON' : 'OFF'}
            </ThemedText>
            <ThemedText variant="caption" style={styles.fairnessSubtitle}>
              {fairnessMode
                ? 'Balances chaos across rounds — no one picked twice too soon!'
                : 'Pure chaotic randomness — anyone can get picked anytime.'}
            </ThemedText>
          </View>
          <AnimatedSwitch
            value={fairnessMode}
            onValueChange={toggleFairnessMode}
          />
        </AnimatedPressable>
      </ScrollView>

      {/* Bottom CTA Button */}
      <View style={styles.footerSection}>
        <PrimaryButton
          label="Proceed to Stakes →"
          onPress={handleProceed}
          disabled={!canProceed}
          style={styles.proceedButton}
        />
      </View>

      {/* Avatar Picker Modal */}
      <Modal
        visible={editingSlotId !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingSlotId(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText variant="heading2" style={styles.modalTitle}>
                Choose Anime Avatar
              </ThemedText>
              <AnimatedPressable
                onPress={() => setEditingSlotId(null)}
                style={styles.modalCloseButton}
              >
                <ThemedText style={styles.modalCloseText}>✕</ThemedText>
              </AnimatedPressable>
            </View>

            <ScrollView
              contentContainerStyle={styles.avatarGrid}
              showsVerticalScrollIndicator={false}
            >
              {AVATAR_METADATA.map((item) => (
                <AnimatedPressable
                  key={item.key}
                  onPress={() => handleSelectAvatar(item.key)}
                  style={styles.avatarChoiceCard}
                >
                  <AvatarImage
                    avatarKey={item.key}
                    name={item.name}
                    size={64}
                    showCrown={item.key === 'AV-01'}
                  />
                  <ThemedText variant="caption" style={styles.avatarChoiceName}>
                    {item.name}
                  </ThemedText>
                  <ThemedText variant="caption" style={styles.avatarChoiceStyle}>
                    {item.style}
                  </ThemedText>
                </AnimatedPressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Create New Group Modal */}
      <Modal
        visible={isAddGroupModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsAddGroupModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.createGroupCard}>
            <View style={styles.modalHeaderRow}>
              <ThemedText variant="heading2" style={styles.modalTitle}>
                Create New Group 👥
              </ThemedText>
              <Pressable
                onPress={() => setIsAddGroupModalOpen(false)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <ThemedText style={styles.modalCloseText}>✕</ThemedText>
              </Pressable>
            </View>

            <ThemedText variant="caption" style={styles.modalInputLabel}>
              GROUP NAME
            </ThemedText>
            <TextInput
              style={styles.modalTextInput}
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="e.g. Trip to Goa, Friday Poker..."
              placeholderTextColor={colors.textMuted}
              maxLength={24}
            />

            <ThemedText variant="caption" style={styles.modalInputLabel}>
              CHOOSE AN EMOJI
            </ThemedText>
            <View style={styles.emojiPickerRow}>
              {EMOJI_OPTIONS.map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => {
                    triggerHaptic('selection');
                    setSelectedEmoji(emoji);
                  }}
                  style={[
                    styles.emojiOption,
                    selectedEmoji === emoji && styles.emojiOptionSelected,
                  ]}
                >
                  <ThemedText style={styles.emojiText}>{emoji}</ThemedText>
                </Pressable>
              ))}
            </View>

            <PrimaryButton
              label="Create & Select Group ✨"
              variant="primary"
              onPress={handleCreateGroup}
              style={{ marginTop: spacing.md }}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D0618',
    paddingHorizontal: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
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
  backButtonIcon: {
    color: '#FFF',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '800',
  },
  backButtonLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '800',
  },
  headerCenter: {
    alignItems: 'center',
  },
  titleBadgeRow: {
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
  },
  countBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  countBadgeText: {
    fontWeight: '800',
    fontSize: 13,
  },
  scrollContent: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  groupSection: {
    marginBottom: spacing.xs,
  },
  groupSectionTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  groupChipsRow: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  groupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    gap: 6,
  },
  groupChipSelected: {
    borderColor: colors.accentMint,
    backgroundColor: 'rgba(0, 245, 160, 0.12)',
    shadowColor: colors.accentMint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  groupChipEmoji: {
    fontSize: 14,
  },
  groupChipText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  groupChipTextSelected: {
    color: '#FFF',
    fontWeight: '900',
  },
  addGroupChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 64, 129, 0.12)',
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: '#FF4081',
    borderStyle: 'dashed',
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    gap: 6,
  },
  addGroupChipPlus: {
    color: '#FF4081',
    fontSize: 16,
    fontWeight: '900',
  },
  addGroupChipText: {
    color: '#FF4081',
    fontSize: 13,
    fontWeight: '800',
  },
  playersSectionTitle: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 11, 46, 0.7)',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1.5,
    gap: spacing.md,
  },
  avatarButton: {
    position: 'relative',
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FF4081',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0D0618',
  },
  editBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  playerInfo: {
    flex: 1,
  },
  slotTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  slotLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  nameInput: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
  },
  toggleButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  toggleActive: {
    backgroundColor: 'rgba(0, 230, 118, 0.2)',
    borderWidth: 1,
    borderColor: '#00E676',
  },
  toggleInactive: {
    backgroundColor: 'rgba(255, 64, 129, 0.2)',
    borderWidth: 1,
    borderColor: '#FF4081',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '800',
  },
  toggleTextActive: {
    color: '#00E676',
  },
  toggleTextInactive: {
    color: '#FF4081',
  },
  cardActionsCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  removePlayerBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 64, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 64, 129, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePlayerBtnDisabled: {
    opacity: 0.25,
  },
  removePlayerIcon: {
    color: '#FF4081',
    fontSize: 13,
    fontWeight: '900',
  },
  addPlayerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 245, 160, 0.08)',
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.accentMint,
    borderStyle: 'dashed',
    paddingVertical: spacing.md,
    gap: spacing.xs,
    marginVertical: spacing.xs,
  },
  addPlayerPlus: {
    color: colors.accentMint,
    fontSize: 18,
    fontWeight: '900',
  },
  addPlayerText: {
    color: colors.accentMint,
    fontSize: 14,
    fontWeight: '800',
  },
  maxPlayersNote: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  maxPlayersText: {
    color: colors.textMuted,
    fontStyle: 'italic',
    fontSize: 12,
  },
  createGroupCard: {
    backgroundColor: '#190C2E',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  modalInputLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  modalTextInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  emojiPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  emojiOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  emojiOptionSelected: {
    borderColor: '#FF4081',
    backgroundColor: 'rgba(255, 64, 129, 0.2)',
  },
  emojiText: {
    fontSize: 22,
  },
  warningBox: {
    backgroundColor: 'rgba(255, 64, 129, 0.15)',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: '#FF4081',
    alignItems: 'center',
  },
  warningText: {
    color: '#FF4081',
    fontWeight: '700',
    fontSize: 13,
  },
  fairnessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(32, 17, 56, 0.9)',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.3)',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  fairnessEmoji: {
    fontSize: 26,
  },
  fairnessTextCol: {
    flex: 1,
  },
  fairnessTitle: {
    color: '#FFE082',
    fontWeight: '800',
    fontSize: 15,
  },
  fairnessSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  fairnessTogglePill: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  fairnessToggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
  },
  footerSection: {
    paddingVertical: spacing.md,
  },
  proceedButton: {
    backgroundColor: colors.accentPink,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#190C2E',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  modalTitle: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 18,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  avatarChoiceCard: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: 'rgba(38, 20, 68, 0.7)',
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  avatarChoiceName: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
    marginTop: 6,
  },
  avatarChoiceStyle: {
    color: colors.textMuted,
    fontSize: 10,
  },
});
