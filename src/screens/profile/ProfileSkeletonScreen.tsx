import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { Header } from '../../common/components/headers';
import { Settings } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';
import { COLORS } from '../../common/constants/colors';

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

// Skeleton card component
const SkeletonCard: React.FC<{
  width: number | string;
  height: number;
  children?: React.ReactNode;
  style?: object;
  borderColor: string;
}> = ({ width, height, children, style, borderColor }) => (
  <View
    style={[
      styles.skeletonCard,
      {
        width,
        height,
        borderColor,
      },
      style,
    ]}
  >
    {children}
  </View>
);

export default function ProfileSkeletonScreen() {
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
  const cardBorderColor = isDark ? COLORS.GRAY_700 : COLORS.GRAY_500;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Profile"
        rightIcon={<Settings color={theme.text} />}
        onRightPress={() => navigation.navigate('Settings')}
      />
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar and User Info Section */}
        <View style={styles.avatarContainer}>
          <SkeletonItem
            width={130}
            height={130}
            borderRadius={130 / 2}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
          />
          <View style={styles.primaryTextContainer}>
            <SkeletonItem
              width={200}
              height={22}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
            />
            <SkeletonItem
              width={150}
              height={16}
              style={styles.smallMarginTop}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
            />
            <SkeletonItem
              width={100}
              height={14}
              style={styles.smallMarginTop}
              animatedOpacity={opacityInterpolate}
              backgroundColor={skeletonColor}
            />
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.secondaryTextContainer}>
          <SkeletonItem
            width={50}
            height={23}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
          />
          <SkeletonItem
            width="100%"
            height={16}
            style={styles.mediumMarginTop}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
          />
          <SkeletonItem
            width="90%"
            height={16}
            style={styles.smallMarginTop}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
          />
          <SkeletonItem
            width="75%"
            height={16}
            style={styles.smallMarginTop}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
          />
        </View>

        {/* Stats Section */}
        <View style={styles.secondaryTextContainer}>
          <SkeletonItem
            width={50}
            height={23}
            animatedOpacity={opacityInterpolate}
            backgroundColor={skeletonColor}
          />

          <View style={styles.sectionContent}>
            {/* Movies and Shows Cards - Row */}
            <View style={styles.statCard}>
              {/* Movies Card */}
              <SkeletonCard
                width="47%"
                height={120}
                borderColor={cardBorderColor}
              >
                <SkeletonItem
                  width="70%"
                  height={18}
                  style={styles.cardMargin}
                  animatedOpacity={opacityInterpolate}
                  backgroundColor={skeletonColor}
                />
                <SkeletonItem
                  width="40%"
                  height={18}
                  style={styles.cardMargin}
                  animatedOpacity={opacityInterpolate}
                  backgroundColor={skeletonColor}
                />
              </SkeletonCard>

              {/* Shows Card */}
              <SkeletonCard
                width="47%"
                height={120}
                borderColor={cardBorderColor}
              >
                <SkeletonItem
                  width="70%"
                  height={18}
                  style={styles.cardMargin}
                  animatedOpacity={opacityInterpolate}
                  backgroundColor={skeletonColor}
                />
                <SkeletonItem
                  width="40%"
                  height={18}
                  style={styles.cardMargin}
                  animatedOpacity={opacityInterpolate}
                  backgroundColor={skeletonColor}
                />
              </SkeletonCard>
            </View>

            {/* Watch Time Card */}
            <SkeletonCard
              width="100%"
              height={120}
              style={styles.topMargin}
              borderColor={cardBorderColor}
            >
              <SkeletonItem
                width="50%"
                height={18}
                style={styles.cardMargin}
                animatedOpacity={opacityInterpolate}
                backgroundColor={skeletonColor}
              />
              <SkeletonItem
                width="30%"
                height={18}
                style={styles.cardMargin}
                animatedOpacity={opacityInterpolate}
                backgroundColor={skeletonColor}
              />
            </SkeletonCard>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 20,
    gap: 25,
  },
  avatarContainer: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 20,
    gap: 16,
  },
  primaryTextContainer: {
    gap: 5,
    alignItems: 'center',
  },
  secondaryTextContainer: {
    marginTop: 25,
    gap: 13,
  },
  sectionContent: {
    marginTop: 20,
    gap: 20,
  },
  statCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skeletonItem: {
    backgroundColor: COLORS.GRAY_300,
  },
  skeletonCard: {
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: COLORS.GRAY_500,
  },
  smallMarginTop: {
    marginTop: 5,
  },
  mediumMarginTop: {
    marginTop: 13,
  },
  cardMargin: {
    margin: 10,
  },
  topMargin: {
    marginTop: 20,
  },
});
