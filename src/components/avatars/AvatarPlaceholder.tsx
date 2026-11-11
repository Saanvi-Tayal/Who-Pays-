import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText } from '../typography/ThemedText';
import { colors } from '@/theme/colors';

interface AvatarPlaceholderProps {
  label: string;
  size?: number;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

export const AvatarPlaceholder: React.FC<AvatarPlaceholderProps> = ({
  label,
  size = 56,
  backgroundColor = colors.surfaceSubtle,
  textColor = colors.textPrimary,
  style,
}) => {
  const initial = label.trim().charAt(0).toUpperCase() || '?';
  const fontSize = Math.floor(size * 0.42);

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={`Avatar for ${label}`}
    >
      <ThemedText
        variant="heading2"
        style={{ fontSize, color: textColor, fontWeight: '700' }}
      >
        {initial}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
});
