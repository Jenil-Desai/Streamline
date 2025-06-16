import React, { useRef, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { NavigationProps } from '../../../types/navigation';
import { useTheme } from '../../../common/context/ThemeContext';
import { COLORS } from '../../../common/constants/colors';
import { Header } from '../../../common/components/header';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Reusable skeleton item component
const SkeletonItem: React.FC<{
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
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

export default function Skeleton() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProps>();

  // Animation value for skeleton pulse effect
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="TV Show Details"
        leftIcon={<ChevronLeft size={24} color={theme.text} />}
        onLeftPress={() => navigation.goBack()}
      />

      {/* Content */}
      <View style={styles.scrollContent}>
        {/* Poster */}
        <View style={styles.posterContainer}>
          <SkeletonItem
            width={SCREEN_WIDTH * 0.6}
            height={SCREEN_WIDTH * 0.9}
            borderRadius={12}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
          />
        </View>

        {/* Title and Rating */}
        <View style={styles.titleContainer}>
          <SkeletonItem
            width="75%"
            height={28}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
            style={{ alignSelf: 'center' }}
          />

          <View style={styles.ratingContainer}>
            <SkeletonItem
              width={70}
              height={20}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
              style={{ marginTop: 12 }}
            />
          </View>
        </View>

        {/* Genres Pills */}
        <View style={styles.genresContainer}>
          <View style={styles.genresRow}>
            <SkeletonItem
              width={80}
              height={30}
              borderRadius={15}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
              style={{ marginRight: 8 }}
            />
            <SkeletonItem
              width={100}
              height={30}
              borderRadius={15}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
              style={{ marginRight: 8 }}
            />
            <SkeletonItem
              width={70}
              height={30}
              borderRadius={15}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
            />
          </View>
        </View>

        {/* Language, Runtime, Release Year */}
        <View style={styles.metadataContainer}>
          <View style={styles.metadataRow}>
            <SkeletonItem
              width={120}
              height={18}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
            />
          </View>
        </View>

        {/* Overview */}
        <View style={styles.overviewContainer}>
          <SkeletonItem
            width={100}
            height={24}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
            style={{ marginBottom: 8 }}
          />
          <SkeletonItem
            width="100%"
            height={16}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
            style={{ marginBottom: 6 }}
          />
          <SkeletonItem
            width="95%"
            height={16}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
            style={{ marginBottom: 6 }}
          />
          <SkeletonItem
            width="90%"
            height={16}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
            style={{ marginBottom: 6 }}
          />
          <SkeletonItem
            width="80%"
            height={16}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
          />
        </View>

        {/* Seasons */}
        <View style={styles.sectionContainer}>
          <SkeletonItem
            width={100}
            height={24}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
            style={{ marginBottom: 12 }}
          />

          <View style={styles.pillContainer}>
            <SkeletonItem
              width={90}
              height={36}
              borderRadius={18}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
              style={{ marginRight: 8 }}
            />
            <SkeletonItem
              width={100}
              height={36}
              borderRadius={18}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
              style={{ marginRight: 8 }}
            />
            <SkeletonItem
              width={95}
              height={36}
              borderRadius={18}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
            />
          </View>
        </View>

        {/* Episodes */}
        <View style={styles.episodesContainer}>
          <View style={styles.episodeCard}>
            <SkeletonItem
              width={280}
              height={160}
              borderRadius={8}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
            />
            <View style={styles.episodeDetailsContainer}>
              <SkeletonItem
                width={100}
                height={18}
                animatedOpacity={opacityInterpolate}
                backgroundColor={skeletonColor}
                style={{ marginBottom: 6, marginTop: 10 }}
              />
              <SkeletonItem
                width={160}
                height={14}
                animatedOpacity={opacityInterpolate}
                backgroundColor={skeletonColor}
                style={{ marginBottom: 6 }}
              />
              <SkeletonItem
                width={140}
                height={12}
                animatedOpacity={opacityInterpolate}
                backgroundColor={skeletonColor}
              />
            </View>
          </View>
        </View>

        {/* Videos Section */}
        <View style={styles.sectionContainer}>
          <SkeletonItem
            width={100}
            height={24}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
            style={{ marginBottom: 12 }}
          />

          <View style={styles.pillContainer}>
            <SkeletonItem
              width={90}
              height={36}
              borderRadius={18}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
              style={{ marginRight: 8 }}
            />
            <SkeletonItem
              width={90}
              height={36}
              borderRadius={18}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
              style={{ marginRight: 8 }}
            />
          </View>

          <View style={styles.videosContainer}>
            <SkeletonItem
              width={200}
              height={112}
              borderRadius={8}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
              style={{ marginRight: 12 }}
            />
            <SkeletonItem
              width={200}
              height={112}
              borderRadius={8}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
            />
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.sectionContainer}>
          <SkeletonItem
            width={100}
            height={24}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
            style={{ marginBottom: 12 }}
          />

          <View style={styles.reviewsContainer}>
            <SkeletonItem
              width={280}
              height={160}
              borderRadius={8}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
              style={{ marginRight: 12 }}
            />
            <SkeletonItem
              width={280}
              height={160}
              borderRadius={8}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
            />
          </View>
        </View>

        {/* Similar Shows */}
        <View style={styles.sectionContainer}>
          <SkeletonItem
            width={140}
            height={24}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
            style={{ marginBottom: 12 }}
          />

          <View style={styles.mediaCardsContainer}>
            <SkeletonItem
              width={120}
              height={180}
              borderRadius={8}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
              style={{ marginRight: 12 }}
            />
            <SkeletonItem
              width={120}
              height={180}
              borderRadius={8}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
              style={{ marginRight: 12 }}
            />
            <SkeletonItem
              width={120}
              height={180}
              borderRadius={8}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
            />
          </View>
        </View>

        {/* Bottom space */}
        <View style={{ height: 40 }} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  posterContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  titleContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  genresContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metadataContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  pillContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  episodesContainer: {
    paddingLeft: 16,
    marginBottom: 24,
  },
  episodeCard: {
    width: 280,
  },
  episodeDetailsContainer: {
    paddingVertical: 8,
  },
  videosContainer: {
    flexDirection: 'row',
    paddingTop: 16,
  },
  reviewsContainer: {
    flexDirection: 'row',
  },
  mediaCardsContainer: {
    flexDirection: 'row',
  },
});
