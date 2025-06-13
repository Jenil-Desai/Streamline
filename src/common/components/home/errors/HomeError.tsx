import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { ThemeColors } from '../../../context/ThemeContext';
import { COLORS } from '../../../constants/colors';

interface HomeErrorProps {
  message: string;
  onRetry: () => void;
  theme: ThemeColors;
}

/**
 * Error component displayed when home screen data fails to load
 */
const HomeError: React.FC<HomeErrorProps> = ({ message, onRetry, theme }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.contentContainer}>
        <AlertCircle
          color={theme.error}
          size={48}
          strokeWidth={1.5}
        />

        <Text style={[styles.errorTitle, { color: theme.text }]}>
          Oops! Something went wrong
        </Text>

        <Text style={[styles.errorMessage, { color: theme.textSecondary }]}>
          {message || "We're having trouble loading your content right now."}
        </Text>

        <Text style={[styles.errorDescription, { color: theme.textSecondary }]}>
          Please check your connection and try again.
        </Text>

        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.primary }]}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <RefreshCw color={COLORS.WHITE} size={18} />
          <Text style={styles.retryText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  illustration: {
    width: 200,
    height: 180,
    marginBottom: 24,
    opacity: 0.9,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryText: {
    color: COLORS.WHITE,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeError;
