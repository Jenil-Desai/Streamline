import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../../../common/context/ThemeContext';
import { COLORS } from '../../../common/constants/colors';
import { Header } from '../../../common/components/header';

// Reusable skeleton item component
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
      styles.skeletonItem,
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

export default function Skeleton() {
  const { theme, isDark } = useTheme();

  const pulseAnim = useRef(new Animated.Value(0)).current;

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

  const opacityInterpolate = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  const skeletonColor = isDark ? COLORS.GRAY_700 : COLORS.GRAY_300;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="My Watchlists"
        rightIcon={<Plus color={theme.text} />}
      />
      <View style={styles.contentContainer}>
        {/* Watchlist Items */}
        {[...Array(5)].map((_, index) => (
          <View
            key={index}
            style={[styles.watchlistCard, { backgroundColor: isDark ? theme.secondary : COLORS.GRAY_100 }]}
          >
            <View style={styles.watchlistContent}>
              {/* Icon Container */}
              <SkeletonItem
                width={48}
                height={48}
                borderRadius={8}
                style={styles.iconContainer}
                animatedOpacity={opacityInterpolate}
                backgroundColor={skeletonColor}
              />

              <View style={styles.watchlistTextContainer}>
                {/* Watchlist Name */}
                <SkeletonItem
                  width="60%"
                  height={17}
                  style={styles.nameMargin}
                  animatedOpacity={opacityInterpolate}
                  backgroundColor={skeletonColor}
                />

                {/* Watchlist Date with Clock Icon Space */}
                <View style={styles.dateContainer}>
                  <SkeletonItem
                    width={12}
                    height={12}
                    style={styles.clockIcon}
                    animatedOpacity={opacityInterpolate}
                    backgroundColor={skeletonColor}
                  />
                  <SkeletonItem
                    width="30%"
                    height={14}
                    animatedOpacity={opacityInterpolate}
                    backgroundColor={skeletonColor}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  watchlistCard: {
    borderRadius: 8,
    marginBottom: 12,
  },
  watchlistContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  watchlistTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameMargin: {
    marginBottom: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: 4,
  },
  skeletonItem: {
    backgroundColor: COLORS.GRAY_300,
  },
  skeletonCard: {
    borderRadius: 8,
  },
});
