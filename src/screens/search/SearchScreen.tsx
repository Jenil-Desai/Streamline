import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import { Header } from '../../common/components/headers';
import { ListFilter, Search as SearchIcon, X } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import { MediaItem } from '../../types/media';
import { searchMedia, SearchParams } from '../../services/api/searchService';
import SearchFilterModal, { FilterOptions } from './components/SearchFilterModal';
import { useNavigation } from '@react-navigation/native';
import useDebounce from '../../hooks/useDebounce';
import { NavigationProps } from '../../types/navigation';
import { MediaCard } from '../../common/components/media/MediaCard';
import { SearchEmptyState, SearchError } from './components/states';
import { SearchSkeleton } from './components/skeletons';

// Get screen dimensions for responsive layouts
const { width } = Dimensions.get('window');

// Calculate number of columns based on screen width
const getNumColumns = () => {
  return width >= 600 ? 3 : 2;
};

export default function SearchScreen() {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProps>();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [layoutColumns, setLayoutColumns] = useState(getNumColumns());
  const [filters, setFilters] = useState<FilterOptions>({
    mediaType: '',
    includeAdult: false,
    language: 'en-US'
  });

  // Use custom debounce hook
  const debouncedQuery = useDebounce(searchQuery, 500);

  // Refs
  const flatListRef = useRef<FlatList>(null);

  // Handle dimension changes for responsive layout
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setLayoutColumns(getNumColumns());
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  // Reset page when search query changes
  useEffect(() => {
    setPage(1);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: false });
    }
  }, [debouncedQuery, filters]);

  // Fetch results whenever debounced query or filters change
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const searchParams: SearchParams = {
          query: debouncedQuery,
          page: page,
          include_adult: filters.includeAdult,
          language: filters.language,
          media_type: filters.mediaType,
        };

        const response = await searchMedia(searchParams);

        if (response.success && response.data) {
          if (page === 1) {
            setResults(response.data.results);
          } else {
            setResults(prev => [...prev, ...response!.data!.results]);
          }
          setTotalPages(response.data.total_pages);
        } else {
          setError(response.error || 'Failed to fetch results');
          setResults([]);
        }
      } catch (err) {
        setError('An error occurred while fetching results');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, page, filters]);

  // Handle load more results
  const handleLoadMore = useCallback(() => {
    if (!loading && page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  }, [loading, page, totalPages]);

  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };

  // Handle item press
  const handleItemPress = (item: MediaItem) => {
    if (item.media_type === 'movie') {
      navigation.navigate('MovieDetail', {
        id: item.id,
      });
    } else {
      navigation.navigate('TVShowDetail', {
        id: item.id,
      });
    }
  };

  // Apply filters
  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1);
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: false });
    }
  };

  // Handle retry on error
  const handleRetry = () => {
    setPage(1);
    // Re-trigger the useEffect by forcing a state update
    setFilters({ ...filters });
  };

  // Render item for FlatList
  const renderItem = ({ item }: { item: MediaItem }) => {
    const itemWidth = (width - (layoutColumns + 1) * 16) / layoutColumns;
    return (
      <MediaCard
        item={item}
        onPress={handleItemPress}
        theme={theme}
        style={{
          width: itemWidth,
          marginBottom: 20,
          marginHorizontal: 8
        }}
      />
    );
  };

  // Footer component with loading spinner or error message
  const ListFooterComponent = () => {
    if (loading && page > 1) {
      return (
        <View style={styles.footerLoaderContainer}>
          <SearchSkeleton itemCount={layoutColumns * 2} />
        </View>
      );
    }

    if (error && results.length === 0) {
      return <SearchError message={error} theme={theme} onRetry={handleRetry} />;
    }

    return null;
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
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}-${item.media_type}`}
          numColumns={layoutColumns}
          contentContainerStyle={styles.resultsContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={ListFooterComponent}
          ListEmptyComponent={
            <SearchEmptyState hasQuery={Boolean(debouncedQuery)} theme={theme} />
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
  footerLoaderContainer: {
    paddingTop: 8,
    paddingBottom: 16,
  },
});
