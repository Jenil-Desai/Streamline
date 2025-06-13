import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { useTheme } from '../../../context/ThemeContext';

// Reusable skeleton item component for category list
const SkeletonItem: React.FC<{
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
  animatedOpacity: Animated.AnimatedInterpolation<string | number>;
  backgroundColor: string;
}> = ({ width, height, borderRadius = 4, style, animatedOpacity, backgroundColor }) => (
  <Animated.View
    style={[
      {
        width,
        height,
        borderRadius,
        opacity: animatedOpacity,
        backgroundColor,
      },
      style,
    ]}
  />
);

// Calculate grid dimensions
const { width } = Dimensions.get('window');
const COLUMNS = 2;
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - (CARD_MARGIN * (COLUMNS + 1) * 2)) / COLUMNS;
const CARD_HEIGHT = CARD_WIDTH * 1.5; // Standard 2:3 movie poster ratio

interface CategorySkeletonProps {
  itemCount?: number; // Number of skeleton items to show
}

const CategorySkeleton: React.FC<CategorySkeletonProps> = ({ itemCount = 8 }) => {
  const { isDark } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;

  // Start animation when component mounts
  useEffect(() => {
    const animatePulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        animatePulse();
      });
    };

    animatePulse();
    return () => pulseAnim.stopAnimation();
  }, [pulseAnim]);

  // Interpolate opacity for pulse effect
  const opacityInterpolate = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  // Determine skeleton colors based on theme
  const skeletonColor = isDark ? COLORS.GRAY_700 : COLORS.GRAY_300;

  // Generate skeleton items based on itemCount
  const skeletonItems = Array(itemCount).fill(0).map((_, index) => (
    <View key={`skeleton-${index}`} style={styles.cardWrapper}>
      {/* Poster skeleton */}
      <SkeletonItem
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        borderRadius={8}
        animatedOpacity={opacityInterpolate}
        backgroundColor={skeletonColor}
      />

      {/* Title skeleton */}
      <SkeletonItem
        width="80%"
        height={16}
        style={styles.titleSkeleton}
        animatedOpacity={opacityInterpolate}
        backgroundColor={skeletonColor}
      />

      {/* Date skeleton */}
      <SkeletonItem
        width="40%"
        height={12}
        style={styles.dateSkeleton}
        animatedOpacity={opacityInterpolate}
        backgroundColor={skeletonColor}
      />
    </View>
  ));

  // Create rows for the grid layout
  const rows = [];
  for (let i = 0; i < skeletonItems.length; i += COLUMNS) {
    rows.push(
      <View key={`row-${i}`} style={styles.row}>
        {skeletonItems.slice(i, i + COLUMNS)}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {rows}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: CARD_MARGIN,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN * 2,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
  },
  titleSkeleton: {
    marginTop: 8,
  },
  dateSkeleton: {
    marginTop: 4,
  },
});

export default CategorySkeleton;
