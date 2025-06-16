import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Watchlist, WatchlistsResponse } from '../../types/user/watchlist';
import { useAuth } from '../context/AuthContext';
import { NavigationProps } from '../../types/navigation';
import { BASE_URL } from '../constants/config';

export const useWatchlists = () => {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const { token } = useAuth();
  const navigation = useNavigation<NavigationProps>();

  const fetchWatchlists = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get<WatchlistsResponse>(`${BASE_URL}/watchlists`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data;
      if (data.success) {
        setWatchlists(data.watchlists);
      }
    } catch (err) {
      console.error('Error fetching watchlists:', err);
      setError('Failed to load watchlists');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchWatchlists();
    setRefreshing(false);
  }, [fetchWatchlists]);

  const handleWatchlistPress = useCallback((watchlist: Watchlist) => {
    navigation.navigate('WatchlistItems', {
      id: watchlist.id,
      name: watchlist.name
    });
  }, [navigation]);

  const handleCreateWatchlist = useCallback(() => {
    setIsDialogVisible(true);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchWatchlists();

    const dataInterval = setInterval(() => fetchWatchlists(), 900000);

    return () => clearInterval(dataInterval);
  }, [fetchWatchlists]);

  return {
    watchlists,
    refreshing,
    loading,
    error,
    isDialogVisible,
    setIsDialogVisible,
    fetchWatchlists,
    onRefresh,
    handleWatchlistPress,
    handleCreateWatchlist
  };
};
