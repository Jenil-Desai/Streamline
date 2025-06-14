import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  RefreshControl,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Film, Tv, Calendar, Clock, CheckCircle, Circle, Play } from 'lucide-react-native';
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
import { WatchlistItemsEmpty, WatchlistItemsError } from '../../common/components/watchlist';

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
  const [error, setError] = useState<string | null>(null);

  // Calculate grid dimensions
  const { width } = Dimensions.get('window');
  const numColumns = 2;
  const gap = 16;
  const cardWidth = (width - (gap * (numColumns + 1))) / numColumns;

  const fetchWatchlistItems = useCallback(async () => {
    try {
      setError(null);
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
    } catch (err) {
      console.error('Error fetching watchlist items:', err);
      setError('Failed to load watchlist items');
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
      case WatchlistItemStatus.PLANNED:
      default:
        return theme.warning;
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
        <View style={[
          styles.infoContainer,
          { backgroundColor: isDark ? theme.secondary : COLORS.GRAY_100, borderColor: theme.border }
        ]}>
          <View style={styles.infoRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {getStatusIcon(item.status)}
              <Text style={[styles.infoText, { color: getStatusColor(item.status), marginLeft: 4, marginRight: 10 }]}>
                {getStatusText(item.status)}
              </Text>
            </View>
            {item.mediaType === MediaTypeEnum.TV ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Tv size={13} color={theme.textSecondary} style={styles.infoIcon} />
                <Text style={[styles.infoText, { color: theme.textSecondary, marginRight: 10 }]}>TV Show</Text>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Film size={13} color={theme.textSecondary} style={styles.infoIcon} />
                <Text style={[styles.infoText, { color: theme.textSecondary, marginRight: 10 }]}>Movie</Text>
              </View>
            )}
            {item.scheduledAt && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Calendar size={13} color={theme.textSecondary} style={styles.infoIcon} />
                <Text style={[styles.infoText, { color: theme.textSecondary, marginRight: 10 }]}>
                  {moment(item.scheduledAt).format('MMM DD, YYYY')}
                </Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Clock size={13} color={theme.textSecondary} style={styles.infoIcon} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Added {moment(item.createdAt).format('MMM DD')}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyList = () => (
    <WatchlistItemsEmpty
      theme={theme}
      isDark={isDark}
    />
  );

  if (loading && !refreshing) {
    return <WatchlistItemsSkeletonScreen />;
  }

  if (error && items.length === 0 && !loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Header
          title={watchlistName || 'Watchlist Items'}
          leftIcon={<ChevronLeft color={theme.text} />}
          onLeftPress={handleBackPress}
        />
        <WatchlistItemsError
          message={error}
          onRetry={fetchWatchlistItems}
          theme={theme}
        />
      </SafeAreaView>
    );
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
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'column',
    gap: 10,
  },
  infoIcon: {
    marginRight: 3,
  },
  infoText: {
    fontSize: 11,
    fontFamily: font.medium(),
    lineHeight: 15,
  },

});
