import { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';
import { useAuth } from '../context/AuthContext';
import { MediaItem } from '../../types/media';
import { fetchCategoryData } from '../services/categoryService';

interface UseCategoryListProps {
  category: string;
  apiPath: string;
  categoryTitle: string;
}

export const useCategoryList = ({
  category,
  apiPath,
  categoryTitle,
}: UseCategoryListProps) => {
  const navigation = useNavigation<NavigationProps>();
  const { token } = useAuth();

  const [data, setData] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategoryData = useCallback(async (pageNumber = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const responseData = await fetchCategoryData(apiPath, pageNumber, token);
      const { results, pagination } = responseData;

      if (refresh || pageNumber === 1) {
        setData(results);
      } else {
        setData(prevData => [...prevData, ...results]);
      }

      setTotalPages(pagination.total_pages);
      setError(null);
    } catch (error) {
      console.error(`Error fetching ${category} data:`, error);
      setError(`Failed to load ${categoryTitle}. Please try again.`);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [category, apiPath, token, categoryTitle]);

  const handleRefresh = useCallback(() => {
    setPage(1);
    loadCategoryData(1, true);
  }, [loadCategoryData]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadCategoryData(nextPage);
    }
  }, [loadingMore, page, totalPages, loadCategoryData]);

  const handleMediaPress = useCallback((item: MediaItem) => {
    if (item.media_type === 'movie') {
      navigation.navigate('MovieDetail', { id: item.id });
    } else {
      navigation.navigate('TVShowDetail', { id: item.id });
    }
  }, [navigation]);

  // Load initial data
  useEffect(() => {
    loadCategoryData();
  }, [loadCategoryData]);

  return {
    data,
    loading,
    refreshing,
    loadingMore,
    error,
    handleRefresh,
    handleLoadMore,
    handleMediaPress,
  };
};
