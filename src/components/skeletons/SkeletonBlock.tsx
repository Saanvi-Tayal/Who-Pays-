import React, { useEffect } from 'react';
import { ViewStyle, StyleSheet, AccessibilityInfo } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';

interface SkeletonBlockProps {
  width: number | `${number}%`;
  height: number;
  radius?: number;
  style?: ViewStyle;
}

export const SkeletonBlock: React.FC<SkeletonBlockProps> = ({
  width,
  height,
  radius = borderRadius.md,
  style,
}) => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    let isMounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((reducedMotion) => {
      if (!isMounted) return;
      if (!reducedMotion) {
        opacity.value = withRepeat(
          withTiming(0.85, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          -1,
          true
        );
      }
    });

    return () => {
      isMounted = false;
      cancelAnimation(opacity);
    };
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: radius,
        },
        animatedStyle,
        style,
      ]}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel="Loading placeholder"
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.skeletonHighlight,
  },
});
