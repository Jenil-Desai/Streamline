import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../../../common/context/ThemeContext';
import { Header } from '../../../common/components/header';

const { width } = Dimensions.get('window');
const numColumns = 3;
const gap = 16;
const cardWidth = (width - (gap * (numColumns + 1))) / numColumns;

export default function Skeleton() {
  const { theme } = useTheme();

  const skeletonItems = Array(6).fill(null);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Watchlist Items"
        leftIcon={<ChevronLeft color={theme.text} />}
      />

      <View style={styles.skeletonGrid}>
        {skeletonItems.map((_, index) => (
          <View key={index} style={styles.skeletonItem}>
            <View
              style={[
                styles.skeletonPoster,
                { backgroundColor: theme.surface, width: cardWidth, height: cardWidth * 1.5 }
              ]}
            />
            <View
              style={[styles.skeletonTitle, { backgroundColor: theme.surface }]}
            />
            <View
              style={[styles.skeletonDate, { backgroundColor: theme.surface }]}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skeletonGrid: {
    padding: gap,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skeletonItem: {
    width: cardWidth,
    marginBottom: gap,
    marginRight: gap,
  },
  skeletonPoster: {
    borderRadius: 8,
  },
  skeletonTitle: {
    height: 14,
    width: '70%',
    marginTop: 8,
    borderRadius: 4,
  },
  skeletonDate: {
    height: 10,
    width: '50%',
    marginTop: 6,
    borderRadius: 4,
  },
});
