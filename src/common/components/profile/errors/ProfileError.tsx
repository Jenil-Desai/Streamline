import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import { ThemeColors } from '../../../context/ThemeContext';
import { COLORS } from '../../../constants/colors';

interface ProfileErrorProps {
  message: string;
  onRetry: () => void;
  theme: ThemeColors;
}

/**
 * Error component displayed when profile data fails to load
 */
const ProfileError: React.FC<ProfileErrorProps> = ({ message, onRetry, theme }) => {
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.contentContainer}>
        <AlertCircle
          color={theme.error}
          size={48}
          strokeWidth={1.5}
        />

        <Text style={[styles.errorTitle, { color: theme.text }]}>
          Unable to Load Profile
        </Text>

        <Text style={[styles.errorMessage, { color: theme.textSecondary }]}>
          {message || "We couldn't fetch your profile information. Please check your connection and try again."}
        </Text>

        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.primary }]}
          onPress={onRetry}
          activeOpacity={0.7}
        >
          <RefreshCw color={COLORS.WHITE} size={18} />
          <Text style={styles.retryText}>Refresh Profile</Text>
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  errorIconOverlay: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 2,
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
    marginBottom: 8,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryText: {
    color: COLORS.WHITE,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileError;
