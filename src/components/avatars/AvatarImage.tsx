import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { RenderAvatarByKey } from '@/components/illustrations/AvatarsSvg';
import { AvatarPlaceholder } from './AvatarPlaceholder';
import { colors } from '@/theme/colors';

interface AvatarImageProps {
  avatarKey?: string;
  name?: string;
  size?: number;
  showCrown?: boolean;
  borderColor?: string;
  borderWidth?: number;
  style?: ViewStyle;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({
  avatarKey = 'AV-01',
  name = 'Player',
  size = 56,
  showCrown = false,
  borderColor = colors.cardBorder,
  borderWidth = 2,
  style,
}) => {
  // If no avatar key, fall back to placeholder
  if (!avatarKey) {
    return (
      <AvatarPlaceholder
        label={name}
        size={size}
        style={style}
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
          borderWidth,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={`Avatar for ${name}`}
    >
      <RenderAvatarByKey avatarKey={avatarKey} size={size - borderWidth * 2} showCrown={showCrown} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#1E1233',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
});
