import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemeColors } from '../../context/ThemeContext';

interface LoadingIndicatorProps {
  /**
   * Size of the loading indicator
   * @default "large"
   */
  size?: 'small' | 'large';

  /**
   * Theme colors object
   */
  theme: ThemeColors;

  /**
   * Full screen loading or inline
   * @default false
   */
  fullscreen?: boolean;

  /**
   * Custom style for the container
   */
  containerStyle?: object;
}

/**
 * A loading indicator component that can be used in fullscreen or inline mode
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  size = 'large',
  theme,
  fullscreen = false,
  containerStyle,
}) => {
  return (
    <View style={[
      fullscreen ? styles.fullscreenContainer : styles.container,
      containerStyle
    ]}>
      <ActivityIndicator size={size} color={theme.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingIndicator;
