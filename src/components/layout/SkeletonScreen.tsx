import React, { useEffect } from 'react';
import { StyleSheet, View, Image, ImageSourcePropType } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { ScreenContainer } from './ScreenContainer';
import { ThemedText } from '../typography/ThemedText';
import { colors } from '@/theme/colors';
import { spacing, borderRadius } from '@/theme/spacing';

interface SkeletonScreenProps {
  customImage?: ImageSourcePropType;
  title?: string;
}

export const SkeletonScreen: React.FC<SkeletonScreenProps> = ({
  customImage,
  title = 'Loading...',
}) => {
  const shimmerOpacity = useSharedValue(0.35);

  useEffect(() => {
    shimmerOpacity.value = withRepeat(
      withTiming(0.85, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [shimmerOpacity]);

  const animatedShimmerStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  return (
    <ScreenContainer style={styles.container}>
      {customImage ? (
        // Custom Skeleton JPG provided by user in assets/images/skeleton.jpg
        <View style={styles.imageWrapper}>
          <Image
            source={customImage}
            style={styles.skeletonImage}
            resizeMode="cover"
          />
          {/* Shimmering highlight overlay */}
          <Animated.View style={[styles.shimmerOverlay, animatedShimmerStyle]} />
        </View>
      ) : (
        // Content-shaped vector skeleton matching design rules (No ActivityIndicator!)
        <View style={styles.skeletonContent}>
          {/* Header Skeleton */}
          <View style={styles.headerRow}>
            <Animated.View style={[styles.block, styles.backBtnBlock, animatedShimmerStyle]} />
            <Animated.View style={[styles.block, styles.titleBlock, animatedShimmerStyle]} />
            <Animated.View style={[styles.block, styles.iconBlock, animatedShimmerStyle]} />
          </View>

          {/* Subtitle pill */}
          <Animated.View style={[styles.block, styles.pillBlock, animatedShimmerStyle]} />

          {/* Main Hero Card Skeleton */}
          <Animated.View style={[styles.block, styles.heroCardBlock, animatedShimmerStyle]}>
            <View style={styles.avatarCircleBlock} />
            <View style={styles.lineMedium} />
            <View style={styles.lineShort} />
          </Animated.View>

          {/* Secondary Cards Skeleton Grid */}
          <View style={styles.gridRow}>
            <Animated.View style={[styles.block, styles.gridCard, animatedShimmerStyle]} />
            <Animated.View style={[styles.block, styles.gridCard, animatedShimmerStyle]} />
          </View>

          {/* Bottom Action Button Skeleton */}
          <Animated.View style={[styles.block, styles.buttonBlock, animatedShimmerStyle]} />

          <ThemedText variant="caption" style={styles.loadingCaption}>
            {title}
          </ThemedText>
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    justifyContent: 'space-between',
  },
  imageWrapper: {
    flex: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.card,
  },
  skeletonImage: {
    width: '100%',
    height: '100%',
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  skeletonContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  block: {
    backgroundColor: colors.skeletonBase,
    borderRadius: borderRadius.md,
  },
  backBtnBlock: {
    width: 60,
    height: 32,
    borderRadius: borderRadius.full,
  },
  titleBlock: {
    width: 140,
    height: 28,
  },
  iconBlock: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  pillBlock: {
    width: 180,
    height: 20,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  heroCardBlock: {
    width: '100%',
    height: 220,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginVertical: spacing.lg,
  },
  avatarCircleBlock: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.skeletonHighlight,
  },
  lineMedium: {
    width: '60%',
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.skeletonHighlight,
  },
  lineShort: {
    width: '40%',
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.skeletonHighlight,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  gridCard: {
    flex: 1,
    height: 110,
    borderRadius: borderRadius.lg,
  },
  buttonBlock: {
    width: '100%',
    height: 56,
    borderRadius: borderRadius.lg,
  },
  loadingCaption: {
    textAlign: 'center',
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
