import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../../../common/context/ThemeContext';

// Reusable skeleton item component for search results
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

// Calculate grid dimensions based on screen width
const { width } = Dimensions.get('window');
const getNumColumns = () => {
  return width >= 600 ? 3 : 2;
};
const calculateDimensions = () => {
  const columns = getNumColumns();
  const horizontalPadding = 16;
  const spacing = 16;
  const cardWidth = (width - (horizontalPadding * 2) - (spacing * (columns - 1))) / columns;
  const cardHeight = cardWidth * 1.5; // Standard 2:3 movie poster ratio

  return { columns, cardWidth, cardHeight, spacing };
};

interface SearchSkeletonProps {
  itemCount?: number; // Number of skeleton items to show
}

export default function Skeleton({ itemCount = 10 }: SearchSkeletonProps) {
  const { theme, isDark } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const { columns, cardWidth, cardHeight, spacing } = calculateDimensions();

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
    outputRange: [0.3, 0.7],
  });

  // Determine skeleton colors based on theme
  const skeletonColor = isDark ? theme.secondaryDark : theme.secondaryLight;

  // Generate skeleton items based on itemCount
  const skeletonItems = Array(itemCount).fill(0).map((_, index) => (
    <View
      key={`search-skeleton-${index}`}
      style={[
        styles.cardWrapper,
        {
          width: cardWidth,
          marginRight: (index + 1) % columns === 0 ? 0 : spacing
        }
      ]}
    >
      {/* Poster skeleton */}
      <View style={styles.posterContainer}>
        <SkeletonItem
          width="100%"
          height={cardHeight}
          borderRadius={8}
          animatedOpacity={opacityInterpolate}
          backgroundColor={skeletonColor}
        />
        {/* Bookmark icon skeleton */}
        <View style={styles.bookmarkContainer}>
          <SkeletonItem
            width={32}
            height={32}
            borderRadius={16}
            animatedOpacity={opacityInterpolate}
            backgroundColor={theme.primary}
          />
        </View>
      </View>

      {/* Title skeleton */}
      <SkeletonItem
        width="85%"
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
  for (let i = 0; i < skeletonItems.length; i += columns) {
    rows.push(
      <View key={`row-${i}`} style={styles.row}>
        {skeletonItems.slice(i, i + columns)}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.resultsContainer}>
        {rows}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  cardWrapper: {
    marginBottom: 4,
  },
  posterContainer: {
    position: 'relative',
  },
  bookmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  titleSkeleton: {
    marginTop: 8,
  },
  dateSkeleton: {
    marginTop: 4,
  },
});
