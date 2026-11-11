import React from 'react';
import { Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface AnimatedPressableProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleActive?: number;
}

const AnimatedComponent = Animated.createAnimatedComponent(Pressable);

export const AnimatedPressable: React.FC<AnimatedPressableProps> = ({
  children,
  style,
  scaleActive = 0.96,
  disabled,
  onPressIn,
  onPressOut,
  ...rest
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn: PressableProps['onPressIn'] = (e) => {
    if (!disabled) {
      scale.value = withSpring(scaleActive, { damping: 15, stiffness: 300 });
    }
    onPressIn?.(e);
  };

  const handlePressOut: PressableProps['onPressOut'] = (e) => {
    if (!disabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
    onPressOut?.(e);
  };

  return (
    <AnimatedComponent
      style={[style, animatedStyle]}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...rest}
    >
      {children}
    </AnimatedComponent>
  );
};
