import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeColors } from '../../context/ThemeContext';

interface EmptyScreenProps {
  /**
   * Icon to display
   */
  icon: React.ReactNode;

  /**
   * Primary text to display
   */
  title: string;

  /**
   * Secondary text to display (optional)
   */
  subtitle?: string;

  /**
   * Theme colors object
   */
  theme: ThemeColors;

  /**
   * Custom style for the container
   */
  containerStyle?: object;

  /**
   * Custom style for the title
   */
  titleStyle?: object;

  /**
   * Custom style for the subtitle
   */
  subtitleStyle?: object;
}

/**
 * A component to display an empty state with icon and text
 */
const EmptyScreen: React.FC<EmptyScreenProps> = ({
  icon,
  title,
  subtitle,
  theme,
  containerStyle,
  titleStyle,
  subtitleStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={[styles.title, { color: theme.text }, titleStyle]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: theme.textSecondary }, subtitleStyle]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default EmptyScreen;
