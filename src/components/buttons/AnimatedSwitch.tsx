import React, { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { triggerHaptic } from '@/utils/haptics';

interface AnimatedSwitchProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
}

export const AnimatedSwitch: React.FC<AnimatedSwitchProps> = ({
  value,
  onValueChange,
  activeColor = colors.accentMint,
  inactiveColor = 'rgba(255, 255, 255, 0.16)',
  thumbColor = '#FFFFFF',
}) => {
  // 0 = off, 1 = on
  const progress = useSharedValue(value ? 1 : 0);
  const scale = useSharedValue(1);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      damping: 16,
      stiffness: 220,
    });
  }, [value, progress]);

  const handlePress = () => {
    triggerHaptic('medium');
    scale.value = withTiming(0.92, { duration: 60 }, () => {
      scale.value = withSpring(1, { damping: 12 });
    });
    onValueChange(!value);
  };

  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [inactiveColor, activeColor]
    );

    return {
      backgroundColor,
      transform: [{ scale: scale.value }],
    };
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    // Track width 52, thumb width 24, padding 3 -> translation from 0 to 22
    const translateX = progress.value * 22;

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      style={styles.pressableArea}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Animated.View style={[styles.track, animatedTrackStyle]}>
        <Animated.View style={[styles.thumb, { backgroundColor: thumbColor }, animatedThumbStyle]} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressableArea: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    width: 52,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
  },
});
