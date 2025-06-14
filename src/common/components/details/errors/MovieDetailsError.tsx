import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { ThemeColors } from '../../../context/ThemeContext';
import { COLORS } from '../../../constants/colors';
import Header from '../../headers/Header';
import { ChevronLeft } from 'lucide-react-native';

interface MovieDetailsErrorProps {
  message: string;
  onRetry: () => void;
  onBack: () => void;
  title?: string;
  theme: ThemeColors;
}

/**
 * Error component displayed when Movie details fail to load
 */
const MovieDetailsError: React.FC<MovieDetailsErrorProps> = ({
  message,
  onRetry,
  onBack,
  title = 'Movie Details',
  theme,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={title}
        leftIcon={<ChevronLeft size={24} color={theme.text} />}
        onLeftPress={onBack}
      />

      <View style={styles.contentContainer}>
        <AlertCircle
          color={theme.error}
          size={48}
          strokeWidth={1.5}
        />

        <Text style={[styles.errorTitle, { color: theme.text }]}>
          Failed to Load Details
        </Text>

        <Text style={[styles.errorMessage, { color: theme.textSecondary }]}>
          {message || "We couldn't load the information for this movie. Please check your connection and try again."}
        </Text>

        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.primary }]}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <RefreshCw color={COLORS.WHITE} size={18} />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 24,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.WHITE,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MovieDetailsError;
