import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  RefreshControl
} from 'react-native';
import { MediaCard } from '../media';
import { ThemeColors } from '../../context/ThemeContext';
import { CategoryMediaItem } from '../../../types/category';

interface MediaGridProps {
  data: CategoryMediaItem[];
  loading: boolean;
  refreshing: boolean;
  loadingMore: boolean;
  error: string | null;
  theme: ThemeColors;
  categoryTitle: string;
  onRefresh: () => void;
  onLoadMore: () => void;
  onPressItem: (item: CategoryMediaItem) => void;
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const COLUMN_COUNT = 2;
const CARD_WIDTH = (width - (CARD_MARGIN * (COLUMN_COUNT + 1) * 2)) / COLUMN_COUNT;

export const MediaGrid: React.FC<MediaGridProps> = ({
  data,
  loading,
  refreshing,
  loadingMore,
  error,
  theme,
  categoryTitle,
  onRefresh,
  onLoadMore,
  onPressItem
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: CategoryMediaItem }) => (
    <View style={styles.cardWrapper}>
      <MediaCard
        item={item}
        onPress={() => onPressItem(item)}
        theme={theme}
        style={styles.mediaCard}
      />
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) { return null; }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      numColumns={2}
      contentContainerStyle={styles.contentContainer}
      columnWrapperStyle={styles.columnWrapper}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No {categoryTitle.toLowerCase()} available
          </Text>
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.text}
          colors={[theme.primary]}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: CARD_MARGIN,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: CARD_MARGIN,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  cardWrapper: {
    marginBottom: CARD_MARGIN * 2,
    width: CARD_WIDTH,
  },
  mediaCard: {
    width: '100%',
  }
});
