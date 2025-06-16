import { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import axios from 'axios';
import { NavigationProps } from '../../types/navigation';
import { useAuth } from '../context/AuthContext';
import { WatchlistItem, WatchlistItemStatus, WatchlistItemsResponse } from '../../types/user/watchlistItem';
import { MediaItem } from '../../types/media';
import { BASE_URL } from '../constants/config';

interface UseWatchlistItemsProps {
  watchlistId: string;
}

export const useWatchlistItems = ({ watchlistId }: UseWatchlistItemsProps) => {
  const navigation = useNavigation<NavigationProps>();
  const { token } = useAuth();

  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate grid dimensions
  const { width } = Dimensions.get('window');
  const numColumns = 2;
  const gap = 16;
  const cardWidth = useMemo(() => (width - (gap * (numColumns + 1))) / numColumns, [width]);

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

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleItemPress = useCallback((item: MediaItem) => {
    if (item.media_type === "movie") {
      navigation.navigate('MovieDetail', { id: item.id });
    } else {
      navigation.navigate('TVShowDetail', { id: item.id });
    }
  }, [navigation]);

  const getStatusIcon = useCallback((status: WatchlistItemStatus) => {
    return status;
  }, []);

  const getStatusText = useCallback((status: WatchlistItemStatus): string => {
    switch (status) {
      case WatchlistItemStatus.WATCHED:
        return 'Watched';
      case WatchlistItemStatus.IN_PROGRESS:
        return 'In Progress';
      case WatchlistItemStatus.PLANNED:
        return 'Planned';
      case WatchlistItemStatus.DROPPED:
        return 'Dropped';
      default:
        return 'Planned';
    }
  }, []);

  const getStatusColor = useCallback((status: WatchlistItemStatus, theme: any): string => {
    switch (status) {
      case WatchlistItemStatus.WATCHED:
        return theme.success;
      case WatchlistItemStatus.IN_PROGRESS:
        return theme.info;
      case WatchlistItemStatus.PLANNED:
        return theme.primary;
      case WatchlistItemStatus.DROPPED:
        return theme.error;
      default:
        return theme.warning;
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchWatchlistItems();

    // Auto-refresh every 15 minutes
    const dataInterval = setInterval(() => fetchWatchlistItems(), 900000);

    return () => clearInterval(dataInterval);
  }, [fetchWatchlistItems]);

  return {
    items,
    loading,
    refreshing,
    error,
    numColumns,
    cardWidth,
    fetchWatchlistItems,
    onRefresh,
    handleBackPress,
    handleItemPress,
    getStatusIcon,
    getStatusText,
    getStatusColor
  };
};
