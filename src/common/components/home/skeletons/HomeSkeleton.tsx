import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, ScrollView } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { useTheme } from '../../../context/ThemeContext';

// Reusable skeleton item component for home screen sections
interface SkeletonItemProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
  animatedOpacity: Animated.AnimatedInterpolation<string | number>;
  backgroundColor: string;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({
  width,
  height,
  borderRadius = 4,
  style,
  animatedOpacity,
  backgroundColor
}) => (
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

// Section header skeleton
interface SectionHeaderSkeletonProps {
  animatedOpacity: Animated.AnimatedInterpolation<string | number>;
  backgroundColor: string;
}

const SectionHeaderSkeleton: React.FC<SectionHeaderSkeletonProps> = ({
  animatedOpacity,
  backgroundColor
}) => (
  <View style={styles.sectionHeader}>
    <SkeletonItem
      width={120}
      height={20}
      animatedOpacity={animatedOpacity}
      backgroundColor={backgroundColor}
    />
    <SkeletonItem
      width={60}
      height={20}
      animatedOpacity={animatedOpacity}
      backgroundColor={backgroundColor}
    />
  </View>
);

// Media row skeleton with multiple items
interface MediaRowSkeletonProps {
  animatedOpacity: Animated.AnimatedInterpolation<string | number>;
  backgroundColor: string;
  itemCount?: number;
}

const MediaRowSkeleton: React.FC<MediaRowSkeletonProps> = ({
  animatedOpacity,
  backgroundColor,
  itemCount = 5
}) => (
  <View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.mediaRow}
    >
      {Array(itemCount).fill(0).map((_, index) => (
        <View key={`media-item-${index}`} style={styles.mediaItem}>
          <SkeletonItem
            width={120}
            height={180}
            borderRadius={8}
            animatedOpacity={animatedOpacity}
            backgroundColor={backgroundColor}
          />
          <SkeletonItem
            width={100}
            height={16}
            style={styles.mediaTitleSkeleton}
            animatedOpacity={animatedOpacity}
            backgroundColor={backgroundColor}
          />
          <SkeletonItem
            width={70}
            height={12}
            style={styles.mediaDateSkeleton}
            animatedOpacity={animatedOpacity}
            backgroundColor={backgroundColor}
          />
        </View>
      ))}
    </ScrollView>
  </View>
);

interface HomeSkeletonProps {
  sectionCount?: number; // Number of media sections to show
}

const HomeSkeleton: React.FC<HomeSkeletonProps> = ({ sectionCount = 5 }) => {
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

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Generate multiple skeleton sections */}
      {Array(sectionCount).fill(0).map((_, index) => (
        <View key={`section-${index}`} style={styles.section}>
          <SectionHeaderSkeleton
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
          />
          <MediaRowSkeleton
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
            itemCount={index === 0 ? 5 : 4}  // Vary the item count slightly
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  mediaRow: {
    paddingLeft: 16,
    flexDirection: 'row',
  },
  mediaItem: {
    marginRight: 12,
    width: 120,
  },
  mediaTitleSkeleton: {
    marginTop: 8,
  },
  mediaDateSkeleton: {
    marginTop: 4,
  }
});

export default HomeSkeleton;
