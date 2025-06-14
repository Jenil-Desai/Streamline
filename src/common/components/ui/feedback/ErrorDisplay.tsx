import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { ThemeColors } from '../../../context/ThemeContext';

interface ErrorDisplayProps {
  /**
   * Error message to display
   */
  message: string;

  /**
   * Optional action button text
   */
  actionText?: string;

  /**
   * Optional action button callback
   */
  onAction?: () => void;

  /**
   * Theme colors object
   */
  theme: ThemeColors;

  /**
   * Custom style for the container
   */
  containerStyle?: object;
}

/**
 * A component to display error messages with an optional action button
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  actionText,
  onAction,
  theme,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <AlertTriangle size={40} color={theme.error} />
      <Text style={[styles.errorText, { color: theme.text }]}>{message}</Text>

      {actionText && onAction && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={onAction}
        >
          <Text style={[styles.actionText, { color: theme.background }]}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ErrorDisplay;
