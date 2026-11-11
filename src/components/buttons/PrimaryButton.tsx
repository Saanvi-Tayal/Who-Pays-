import React from 'react';
import { StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { AnimatedPressable } from './AnimatedPressable';
import { ThemedText } from '../typography/ThemedText';
import { SkeletonBlock } from '../skeletons/SkeletonBlock';
import { colors } from '@/theme/colors';
import { borderRadius, spacing } from '@/theme/spacing';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'rematch' | 'outline';
  disabled?: boolean;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  isLoading = false,
  style,
  textStyle,
  icon,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return colors.surfaceSubtle;
    switch (variant) {
      case 'primary':
        return colors.accentPink;
      case 'secondary':
        return colors.surface;
      case 'rematch':
        return colors.accentOrange;
      case 'outline':
        return 'transparent';
      default:
        return colors.accentPink;
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') return colors.cardBorder;
    return 'transparent';
  };

  return (
    <AnimatedPressable
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      disabled={disabled || isLoading}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || isLoading }}
      accessibilityLabel={label}
    >
      {isLoading ? (
        <SkeletonBlock width={100} height={18} radius={borderRadius.sm} />
      ) : (
        <>
          {icon}
          <ThemedText
            variant="button"
            style={[
              styles.label,
              variant === 'outline' ? { color: colors.textSecondary } : undefined,
              textStyle,
            ]}
          >
            {label}
          </ThemedText>
        </>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: borderRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    borderWidth: 1,
  },
  label: {
    textAlign: 'center',
  },
});
