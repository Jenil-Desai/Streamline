import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { ListFilter, Search as SearchIcon, SearchX, X } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import SearchFilterModal from './components/SearchFilterModal';
import { SearchSkeleton } from './components';
import { Header } from '../../common/components/header';
import { EmptyScreen } from '../../common/components/emptyScreen';
import { useSearch, FilterOptions } from '../../common/hooks/useSearch';
import SearchResultRender from './components/SearchResultRender';
import SearchFooter from './components/SearchFooter';

const { width } = Dimensions.get('window');

const getNumColumns = () => {
  return width >= 600 ? 3 : 2;
};

export default function SearchScreen() {
  const { theme, isDark } = useTheme();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [layoutColumns, setLayoutColumns] = useState(getNumColumns());

  const {
    searchQuery,
    setSearchQuery,
    results,
    loading,
    error,
    page,
    filters,
    setFilters,
    handleLoadMore,
    handleClearSearch,
    handleRetry,
    flatListRef
  } = useSearch();

  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setLayoutColumns(getNumColumns());
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent={false}
      />
      <Header
        title="Search"
        rightIcon={<ListFilter color={theme.text} />}
        onRightPress={() => setFilterModalVisible(true)}
      />

      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.secondary }]}>
          <SearchIcon size={20} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search movies & TV shows"
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
              <X size={18} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && page === 1 ? (
        <SearchSkeleton itemCount={layoutColumns * 3} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={results}
          renderItem={({ item }) => <SearchResultRender item={item} width={width} layoutColumns={layoutColumns} />}
          keyExtractor={(item) => `${item.id}-${item.media_type}`}
          numColumns={layoutColumns}
          contentContainerStyle={styles.resultsContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<SearchFooter loading={loading} error={error} results={results} page={page} layoutColumns={layoutColumns} handleRetry={handleRetry} />}
          ListEmptyComponent={
            <EmptyScreen
              icon={<SearchX size={40} color={theme.primary} />}
              title="No Search Results"
              subtitle="Try a different query or adjust your filters."
              theme={theme}
            />
          }
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}

      <SearchFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        theme={theme}
        currentFilters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  resultsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 24,
    minHeight: '100%',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});
