import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BookMarked, Plus } from 'lucide-react-native';
import { ThemeColors } from '../../context/ThemeContext';
import { COLORS } from '../../constants/colors';
import { font } from '../../utils/font-family';

interface WatchlistEmptyProps {
  onCreateWatchlist: () => void;
  theme: ThemeColors;
  isDark: boolean;
}

/**
 * Empty state component for watchlist screen
 */
const WatchlistEmpty: React.FC<WatchlistEmptyProps> = ({ onCreateWatchlist, theme, isDark }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.primaryDark : theme.primaryLight }]}>
          <BookMarked size={40} color={theme.primary} strokeWidth={1.5} />
        </View>

        <Text style={[styles.emptyTitle, { color: theme.text }]}>
          No Watchlists Found
        </Text>

        <Text style={[styles.emptyMessage, { color: theme.textSecondary }]}>
          Create your first watchlist to start tracking content you want to watch.
        </Text>

        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.primary }]}
          onPress={onCreateWatchlist}
          activeOpacity={0.7}
        >
          <Plus color={COLORS.WHITE} size={18} />
          <Text style={styles.createButtonText}>Create New Watchlist</Text>
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
    paddingHorizontal: 20,
  },
  contentContainer: {
    width: '100%',
    maxWidth: Dimensions.get('window').width * 0.85,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: font.bold(),
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 16,
    fontFamily: font.regular(),
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 8,
    minWidth: 200,
  },
  createButtonText: {
    color: COLORS.WHITE,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: font.semiBold(),
  },
});

export default WatchlistEmpty;
