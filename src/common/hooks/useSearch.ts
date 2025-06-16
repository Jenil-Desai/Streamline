import { useState, useCallback, useEffect, useRef } from 'react';
import { FlatList } from 'react-native';
import { MediaItem } from '../../types/media';
import useDebounce from './useDebounce';
import { SearchParams, searchMedia } from '../services/searchService';

export interface FilterOptions {
  mediaType: '' | 'movie' | 'tv';
  includeAdult: boolean;
  language: string;
}

interface UseSearchResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  results: MediaItem[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  handleLoadMore: () => void;
  handleClearSearch: () => void;
  handleRetry: () => void;
  flatListRef: React.RefObject<FlatList | null>;
}

export const useSearch = (): UseSearchResult => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({
    mediaType: '',
    includeAdult: false,
    language: 'en-US'
  });

  // Use custom debounce hook
  const debouncedQuery = useDebounce(searchQuery, 500);

  // Refs
  const flatListRef = useRef<FlatList>(null);

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
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setResults([]);
  }, []);

  // Handle retry on error
  const handleRetry = useCallback(() => {
    setPage(1);
    // Re-trigger the useEffect by forcing a state update
    setFilters({ ...filters });
  }, [filters]);

  return {
    searchQuery,
    setSearchQuery,
    results,
    loading,
    error,
    page,
    totalPages,
    filters,
    setFilters,
    handleLoadMore,
    handleClearSearch,
    handleRetry,
    flatListRef
  };
};
