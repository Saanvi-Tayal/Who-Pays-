import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/typography/ThemedText';
import { colors } from '@/theme/colors';
import { borderRadius, spacing } from '@/theme/spacing';

export interface AssetSpec {
  id: string;
  expectedFilename: string;
  width: number;
  height: number;
  aspectRatio: number;
  visualBrief: string;
}

/**
 * Registry of known local assets required by the product reference.
 */
export const ASSET_CATALOG: Record<string, AssetSpec> = {
  // Modes
  'mode_who_pays': {
    id: 'MODE-01',
    expectedFilename: 'who_pays.png',
    width: 768,
    height: 768,
    aspectRatio: 1,
    visualBrief: 'Golden money bag with dollar sign, glowing neon outline',
  },
  // Mini-Games
  'game_time_bomb': {
    id: 'GAME-01',
    expectedFilename: 'time_bomb.png',
    width: 768,
    height: 768,
    aspectRatio: 1,
    visualBrief: 'Glossy purple round bomb with burning sparked wick and radial flame burst',
  },
  'game_roulette': {
    id: 'GAME-02',
    expectedFilename: 'haptic_roulette.png',
    width: 768,
    height: 768,
    aspectRatio: 1,
    visualBrief: 'Spinning multi-colored prize wheel with segmented sectors',
  },
  'game_tap_frenzy': {
    id: 'GAME-03',
    expectedFilename: 'tap_frenzy.png',
    width: 768,
    height: 768,
    aspectRatio: 1,
    visualBrief: 'Electric yellow lightning bolt with neon glow',
  },
  'game_reaction_standoff': {
    id: 'GAME-04',
    expectedFilename: 'reaction_standoff.png',
    width: 768,
    height: 768,
    aspectRatio: 1,
    visualBrief: 'Hand pointing finger with neon shockwaves',
  },
};

interface AssetPlaceholderBoxProps {
  assetKey: string;
  width?: number | `${number}%`;
  height?: number;
  style?: ViewStyle;
}

/**
 * Renders a calibrated placeholder box when a local image is pending handoff.
 */
export const AssetPlaceholderBox: React.FC<AssetPlaceholderBoxProps> = ({
  assetKey,
  width = 120,
  height = 120,
  style,
}) => {
  const spec = ASSET_CATALOG[assetKey];
  const displayLabel = spec ? spec.expectedFilename : assetKey;

  return (
    <View
      style={[
        styles.placeholderBox,
        {
          width,
          height,
          aspectRatio: spec?.aspectRatio,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={`Placeholder for ${displayLabel}`}
    >
      <ThemedText variant="caption" style={styles.badgeText}>
        ASSET MISSING
      </ThemedText>
      <ThemedText variant="caption" style={styles.filenameText} numberOfLines={1}>
        {displayLabel}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  placeholderBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
  },
  badgeText: {
    color: colors.accentGold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  filenameText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
