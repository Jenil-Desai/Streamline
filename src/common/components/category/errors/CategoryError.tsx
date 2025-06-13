import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { ThemeColors } from '../../../context/ThemeContext';
import { COLORS } from '../../../constants/colors';

interface CategoryErrorProps {
  message: string;
  onRetry?: () => void;
  theme: ThemeColors;
}

/**
 * Error component displayed when category data fails to load
 */
const CategoryError: React.FC<CategoryErrorProps> = ({ message, onRetry, theme }) => {
  return (
    <View style={styles.container}>
      <AlertCircle
        color={theme.error}
        size={48}
        strokeWidth={1.5}
      />

      <Text style={[styles.errorMessage, { color: theme.text }]}>
        {message}
      </Text>

      <Text style={[styles.errorDescription, { color: theme.textSecondary }]}>
        There was a problem loading the content.
        Please check your connection and try again.
      </Text>

      {onRetry && (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.primary }]}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <RefreshCw color={COLORS.WHITE} size={16} />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  errorMessage: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
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
    paddingHorizontal: 24,
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

export default CategoryError;
