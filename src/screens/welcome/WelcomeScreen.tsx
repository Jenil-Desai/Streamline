import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { font } from '../../common/utils/font-family';
import { useTheme } from '../../common/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';
import { useAuth } from '../../common/context/AuthContext';
import Button from '../../common/components/buttons/Button';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProps>();
  const { isAuthenticated, isUserOnboarded } = useAuth();
  const { theme } = useTheme();

  // Simple animation
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    // Check authentication
    if (isAuthenticated && isUserOnboarded()) {
      navigation.replace('Onboard');
    } else if (isAuthenticated) {
      navigation.replace('Home');
    }

    // Simple animation
    opacity.value = withTiming(1, { duration: 1000 });
    translateY.value = withSpring(0);
  });

  // Create animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image
        source={require('../../assets/images/welcome-image.png')}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Animated.View style={animatedStyle}>
          <Text style={[styles.title, { color: theme.text }]}>
            Streamline
          </Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Your Ultimate Movie Companion
          </Text>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <Button
            text="Sign In"
            variant="primary"
            onClick={() => navigation.replace('Login')}
          />
          <Button
            text="Create Account"
            variant="secondary"
            onClick={() => navigation.replace('Register')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '50%',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 36,
    fontFamily: font.bold(),
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: font.medium(),
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 12,
  },
  skipText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    fontFamily: font.medium(),
  },
});
