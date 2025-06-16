import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

import { CategoryListSkeleton, MediaGrid } from './components';
import { useTheme } from '../../common/context/ThemeContext';
import { RootStackParamList, NavigationProps } from '../../types/navigation';
import { getCategoryTitle, getCategoryApiPath } from '../../common/utils/category-utils';
import { Header } from '../../common/components/header';
import { useCategoryList } from '../../common/hooks/useCategoryList';
import { ErrorScreen } from '../../common/components/errorScreen';

type CategoryListRouteProps = RouteProp<RootStackParamList, 'CategoryList'>;

export default function CategoryListScreen() {
  const route = useRoute<CategoryListRouteProps>();
  const { category } = route.params;
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProps>();

  const categoryTitle = getCategoryTitle(category);
  const apiPath = getCategoryApiPath(category);

  const {
    data,
    loading,
    refreshing,
    loadingMore,
    error,
    handleRefresh,
    handleLoadMore,
    handleMediaPress,
  } = useCategoryList({
    category,
    apiPath,
    categoryTitle,
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={categoryTitle}
        leftIcon={<ChevronLeft color={theme.text} />}
        onLeftPress={() => navigation.goBack()}
      />

      {loading ? (
        <CategoryListSkeleton itemCount={12} />
      ) : error ? (
        <ErrorScreen theme={theme} message={error} onAction={handleRefresh} actionText="Retry" />
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
