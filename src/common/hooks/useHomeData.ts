import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/config';
import { HomeData } from '../../types/media';

interface UseHomeDataResult {
  homeData: HomeData | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
}

export const useHomeData = (token: string): UseHomeDataResult => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHomeData = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get<HomeData>(`${BASE_URL}/home`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHomeData(response.data);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setError('Unable to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchHomeData();
    } finally {
      setRefreshing(false);
    }
  }, [fetchHomeData]);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchHomeData();
    }, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [fetchHomeData]);

  return {
    homeData,
    loading,
    error,
    refreshing,
    onRefresh
  };
};
