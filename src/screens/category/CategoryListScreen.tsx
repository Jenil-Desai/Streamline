import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

import { Header } from '../../common/components/headers';
import { MediaGrid, CategorySkeleton, CategoryError } from '../../common/components/category';
import { useTheme } from '../../common/context/ThemeContext';
import { useAuth } from '../../common/context/AuthContext';
import { RootStackParamList, NavigationProps } from '../../types/navigation';
import { getCategoryTitle, getCategoryApiPath } from '../../common/utils/category-utils';
import { fetchCategoryData } from '../../common/services/categoryService';
import { CategoryMediaItem } from '../../types/category';

type CategoryListRouteProps = RouteProp<RootStackParamList, 'CategoryList'>;

export default function CategoryListScreen() {
  const route = useRoute<CategoryListRouteProps>();
  const { category } = route.params;
  const { theme } = useTheme();
  const { token } = useAuth();
  const navigation = useNavigation<NavigationProps>();

  const [data, setData] = useState<CategoryMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoryTitle = getCategoryTitle(category);
  const apiPath = getCategoryApiPath(category);

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

  useEffect(() => {
    loadCategoryData();
  }, [loadCategoryData]);

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

  const handleMediaPress = useCallback((item: CategoryMediaItem) => {
    navigation.navigate('MediaDetail', { id: item.id });
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={categoryTitle}
        leftIcon={<ChevronLeft color={theme.text} />}
        onLeftPress={() => navigation.goBack()}
      />

      {loading ? (
        <CategorySkeleton itemCount={12} />
      ) : error ? (
        <CategoryError
          message={error}
          onRetry={handleRefresh}
          theme={theme}
        />
      ) : (
        <MediaGrid
          data={data}
          loading={loading}
          refreshing={refreshing}
          loadingMore={loadingMore}
          error={error}
          theme={theme}
          categoryTitle={categoryTitle}
          onRefresh={handleRefresh}
          onLoadMore={handleLoadMore}
          onPressItem={handleMediaPress}
        />
      )}
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
