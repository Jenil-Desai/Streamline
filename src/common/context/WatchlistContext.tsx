import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getUserWatchlists, addToWatchlist, removeFromWatchlist, checkIfInWatchlist, createWatchlist } from '../services/watchlistService';
import { MediaItem } from '../../types/media';
import { useAuth } from './AuthContext';

interface WatchlistContextType {
  watchlists: any[];
  selectedWatchlistId: string | null;
  isLoading: boolean;
  error: string | null;
  isItemInWatchlist: (tmdbId: number, mediaType: 'MOVIE' | 'TV') => Promise<boolean>;
  addItemToWatchlist: (item: MediaItem, mediaType: 'MOVIE' | 'TV', watchlistId?: string) => Promise<boolean>;
  removeItemFromWatchlist: (item: MediaItem, mediaType: 'MOVIE' | 'TV', watchlistId?: string) => Promise<boolean>;
  selectWatchlist: (watchlistId: string) => void;
  refreshWatchlists: () => Promise<void>;
  createNewWatchlist: (name: string) => Promise<{ success: boolean; watchlist?: any; error?: string }>;
}

// Create the context
const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

interface WatchlistContextProviderProps {
  children: React.ReactNode;
}

// Create a map to cache the watchlist item IDs for quick lookup
interface WatchlistItemCache {
  [key: string]: string; // key format: "tmdbId:mediaType", value: itemId
}

export const WatchlistContextProvider: React.FC<WatchlistContextProviderProps> = ({ children }) => {
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [itemCache, setItemCache] = useState<WatchlistItemCache>({});

  const { token, isAuthenticated } = useAuth();

  const refreshWatchlists = useCallback(async () => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getUserWatchlists(token);

      if (response.success) {
        setWatchlists(response.watchlists || []);

        // Reset item cache with fresh data
        const newCache: WatchlistItemCache = {};
        if (response.watchlists && response.watchlists.length > 0) {
          response.watchlists.forEach((watchlist: any) => {
            if (watchlist.items) {
              watchlist.items.forEach((item: any) => {
                const cacheKey = `${item.tmdbId}:${item.mediaType}`;
                newCache[cacheKey] = item.id;
              });
            }
          });
        }
        setItemCache(newCache);
      } else {
        setError(response.error || 'Failed to load watchlists');
      }
    } catch (err) {
      setError('An error occurred while loading watchlists');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Load user's watchlists
  useEffect(() => {
    if (isAuthenticated && token) {
      refreshWatchlists();
    }
  }, [isAuthenticated, token, refreshWatchlists]);

  // Set the first watchlist as selected when watchlists load
  useEffect(() => {
    if (watchlists.length > 0 && !selectedWatchlistId) {
      setSelectedWatchlistId(watchlists[0].id);
    }
  }, [watchlists, selectedWatchlistId]);

  const selectWatchlist = (watchlistId: string) => {
    setSelectedWatchlistId(watchlistId);
  };

  const isItemInWatchlist = async (tmdbId: number, mediaType: 'MOVIE' | 'TV'): Promise<boolean> => {
    if (!token || !selectedWatchlistId) {
      return false;
    }

    // Check cache first
    const cacheKey = `${tmdbId}:${mediaType}`;
    if (cacheKey in itemCache) {
      return true;
    }

    // If not in cache, check with API
    try {
      const result = await checkIfInWatchlist(selectedWatchlistId, tmdbId, mediaType, token);

      // Update cache if found
      if (result.inWatchlist && result.itemId) {
        setItemCache(prev => ({
          ...prev,
          [cacheKey]: result.itemId as string,
        }));
      }

      return result.inWatchlist;
    } catch (err) {
      return false;
    }
  };

  const addItemToWatchlist = async (item: MediaItem, mediaType: 'MOVIE' | 'TV', watchlistId?: string): Promise<boolean> => {
    const targetWatchlistId = watchlistId || selectedWatchlistId;

    if (!token || !targetWatchlistId) {
      return false;
    }

    try {
      const response = await addToWatchlist(
        targetWatchlistId,
        item.id,
        mediaType,
        token
      );

      if (response.success && response.item) {
        // Update cache
        const cacheKey = `${item.id}:${mediaType}`;
        setItemCache(prev => ({
          ...prev,
          [cacheKey]: response.item!.id,
        }));

        // Refresh watchlists to get updated data
        await refreshWatchlists();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const removeItemFromWatchlist = async (item: MediaItem, mediaType: 'MOVIE' | 'TV', watchlistId?: string): Promise<boolean> => {
    const targetWatchlistId = watchlistId || selectedWatchlistId;

    if (!token || !targetWatchlistId) {
      return false;
    }

    const cacheKey = `${item.id}:${mediaType}`;
    const itemId = itemCache[cacheKey];

    if (!itemId) {
      return false;
    }

    try {
      const response = await removeFromWatchlist(
        targetWatchlistId,
        itemId,
        token
      );

      if (response.success) {
        // Update cache
        setItemCache(prev => {
          const newCache = { ...prev };
          delete newCache[cacheKey];
          return newCache;
        });

        // Refresh watchlists to get updated data
        await refreshWatchlists();
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  /**
   * Creates a new watchlist
   * @param name - Name of the watchlist to create
   * @returns Object containing success status and watchlist data or error message
   */
  const createNewWatchlist = async (name: string) => {
    if (!token) {
      return { success: false, error: 'You must be logged in to create a watchlist' };
    }

    try {
      const response = await createWatchlist(name, token);

      if (response.success && response.watchlist) {
        // Refresh the watchlists to include the newly created one
        await refreshWatchlists();

        // Optionally select the newly created watchlist
        if (response.watchlist.id) {
          selectWatchlist(response.watchlist.id);
        }
      }

      return response;
    } catch (err) {
      console.error('Error creating watchlist:', err);
      return { success: false, error: 'Failed to create watchlist' };
    }
  };

  const value = {
    watchlists,
    selectedWatchlistId,
    isLoading,
    error,
    isItemInWatchlist,
    addItemToWatchlist,
    removeItemFromWatchlist,
    selectWatchlist,
    refreshWatchlists,
    createNewWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

// Custom hook for using the Watchlist context
export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistContextProvider');
  }
  return context;
};
