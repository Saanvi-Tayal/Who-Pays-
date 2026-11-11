import React from 'react';
import { Text, TextStyle, TextProps, StyleProp } from 'react-native';
import { typography } from '@/theme/typography';

type TypographyVariant = keyof typeof typography;

interface ThemedTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  variant = 'body',
  color,
  style,
  ...rest
}) => {
  const baseStyle = typography[variant] || typography.body;
  const customColor = color ? { color } : undefined;

  return (
    <Text style={[baseStyle, customColor, style]} {...rest}>
      {children}
    </Text>
  );
};
