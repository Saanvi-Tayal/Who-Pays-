import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography: Record<string, TextStyle> = {
  hero: {
    fontSize: 38,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  display: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  heading1: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  heading2: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
  button: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accentGold,
  },
};
