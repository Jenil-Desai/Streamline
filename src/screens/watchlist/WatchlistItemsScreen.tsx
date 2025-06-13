import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Film, Tv, Calendar, Clock, CheckCircle, Circle, Play, XCircle } from 'lucide-react-native';
import axios from 'axios';
import moment from 'moment';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';

import { Header } from '../../common/components/headers';
import { MediaCard } from '../../common/components/media/MediaCard';
import { useTheme } from '../../common/context/ThemeContext';
import { useAuth } from '../../common/context/AuthContext';
import { BASE_URL } from '../../common/constants/config';
import { font } from '../../common/utils/font-family';
import { MediaItem } from '../../types/media';
import { WatchlistItem, WatchlistItemStatus, MediaTypeEnum, WatchlistItemsResponse } from '../../types/user/watchlistItem';
import { COLORS } from '../../common/constants/colors';
import WatchlistItemsSkeletonScreen from './WatchlistItemsSkeletonScreen';

// Define the route params type
type WatchlistItemsParamList = {
  WatchlistItems: {
    id: string;
    name: string;
  };
};

export default function WatchlistItemsScreen() {
  const { theme, isDark } = useTheme();
  const { token } = useAuth();
  const route = useRoute<RouteProp<WatchlistItemsParamList, 'WatchlistItems'>>();
  const navigation = useNavigation();
  const { id: watchlistId, name: watchlistName } = route.params;

  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Calculate grid dimensions
  const { width } = Dimensions.get('window');
  const numColumns = 3;
  const gap = 16;
  const cardWidth = (width - (gap * (numColumns + 1))) / numColumns;

  const fetchWatchlistItems = useCallback(async () => {
    try {
      const response = await axios.get<WatchlistItemsResponse>(
        `${BASE_URL}/watchlists/${watchlistId}/items`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = response.data;
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching watchlist items:', error);
    } finally {
      setLoading(false);
    }
  }, [token, watchlistId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchWatchlistItems();
    setRefreshing(false);
  }, [fetchWatchlistItems]);

  useEffect(() => {
    setLoading(true);
    fetchWatchlistItems();

    // Auto-refresh every 15 minutes
    const dataInterval = setInterval(() => fetchWatchlistItems(), 900000);

    return () => clearInterval(dataInterval);
  }, [fetchWatchlistItems]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleItemPress = (item: MediaItem) => {
    console.log('Navigate to media details:', item.id);
  };

  const getStatusIcon = (status: WatchlistItemStatus) => {
    switch (status) {
      case WatchlistItemStatus.WATCHED:
        return <CheckCircle size={14} color={theme.success} />;
      case WatchlistItemStatus.IN_PROGRESS:
        return <Play size={14} color={theme.info} />;
      case WatchlistItemStatus.DROPPED:
        return <XCircle size={14} color={theme.error} />;
      case WatchlistItemStatus.PLANNED:
      default:
        return <Circle size={14} color={theme.warning} />;
    }
  };

  const getStatusText = (status: WatchlistItemStatus): string => {
    switch (status) {
      case WatchlistItemStatus.WATCHED:
        return 'Watched';
      case WatchlistItemStatus.IN_PROGRESS:
        return 'In Progress';
      case WatchlistItemStatus.DROPPED:
        return 'Dropped';
      case WatchlistItemStatus.PLANNED:
      default:
        return 'Planned';
    }
  };

  const getStatusColor = (status: WatchlistItemStatus): string => {
    switch (status) {
      case WatchlistItemStatus.WATCHED:
        return theme.success;
      case WatchlistItemStatus.IN_PROGRESS:
        return theme.info;
      case WatchlistItemStatus.DROPPED:
        return theme.error;
      case WatchlistItemStatus.PLANNED:
      default:
        return theme.warning;
    }
  };

  const getMediaTypeIcon = (mediaType: MediaTypeEnum) => {
    switch (mediaType) {
      case MediaTypeEnum.TV:
        return <Tv size={14} color={theme.textSecondary} />;
      case MediaTypeEnum.MOVIE:
      default:
        return <Film size={14} color={theme.textSecondary} />;
    }
  };

  const renderItem = ({ item }: { item: WatchlistItem }) => {
    return (
      <View style={[styles.itemContainer, { width: cardWidth }]}>
        <MediaCard
          item={item.media_details}
          onPress={() => handleItemPress(item.media_details)}
          theme={theme}
          style={styles.mediaCard}
        />

        {/* Additional info container */}
        <View style={[styles.infoContainer, { backgroundColor: isDark ? theme.secondary : COLORS.GRAY_100 }]}>
          {/* Status and media type row */}
          <View style={styles.infoRow}>
            <View style={styles.infoChip}>
              {getStatusIcon(item.status)}
              <Text style={[styles.infoText, { color: getStatusColor(item.status), marginLeft: 4 }]}>
                {getStatusText(item.status)}
              </Text>
            </View>

            <View style={styles.infoChip}>
              {getMediaTypeIcon(item.mediaType)}
              <Text style={[styles.infoText, { color: theme.textSecondary, marginLeft: 4 }]}>
                {item.mediaType === MediaTypeEnum.TV ? 'TV Show' : 'Movie'}
              </Text>
            </View>
          </View>

          {/* Scheduled at */}
          {item.scheduledAt && (
            <View style={styles.infoRow}>
              <Calendar size={14} color={theme.textSecondary} style={styles.infoIcon} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                {moment(item.scheduledAt).format('MMM DD, YYYY')}
              </Text>
            </View>
          )}

          {/* Added date */}
          <View style={styles.infoRow}>
            <Clock size={14} color={theme.textSecondary} style={styles.infoIcon} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Added {moment(item.createdAt).format('MMM DD')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconContainer, { backgroundColor: isDark ? theme.primaryDark : theme.primaryLight }]}>
        <Film size={40} color={theme.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        No Items Found
      </Text>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        This watchlist is empty. Add movies or TV shows to start tracking.
      </Text>
      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: theme.primary }]}
        activeOpacity={0.8}
        onPress={() => console.log('Add item to watchlist')}
      >
        <Text style={[styles.addButtonText, { color: COLORS.WHITE }]}>Add Media</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return <WatchlistItemsSkeletonScreen />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={watchlistName || 'Watchlist Items'}
        leftIcon={<ChevronLeft color={theme.text} />}
        onLeftPress={handleBackPress}
      />

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={[
          styles.listContainer,
          items.length === 0 ? styles.emptyListContainer : null
        ]}
        columnWrapperStyle={items.length > 0 ? styles.columnWrapper : undefined}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemContainer: {
    marginBottom: 24,
    marginRight: 16,
  },
  mediaCard: {
    width: '100%',
  },
  infoContainer: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  infoIcon: {
    marginRight: 4,
  },
  infoText: {
    fontSize: 12,
    fontFamily: font.medium(),
    lineHeight: 16,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    maxWidth: Dimensions.get('window').width * 0.9,
    alignSelf: 'center',
  },
  emptyIconContainer: {
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
  emptyText: {
    fontSize: 16,
    fontFamily: font.regular(),
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  addButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: font.semiBold(),
  },
});
