import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getUserWatchlists, addToWatchlist, removeFromWatchlist, checkIfInWatchlist, createWatchlist, updateWatchlist as updateWatchlistService, deleteWatchlist as deleteWatchlistService } from '../services/watchlistService';
import { MediaItem } from '../../types/media';
import { useAuth } from './AuthContext';
import { MediaTypeEnum, WatchlistItemStatus } from '../../types/user/watchlistItem';

interface WatchlistContextType {
  watchlists: any[];
  selectedWatchlistId: string | null;
  isLoading: boolean;
  error: string | null;
  isItemInWatchlist: (tmdbId: number, mediaType: MediaTypeEnum) => Promise<boolean>;
  isItemInWatchlistLocal: (tmdbId: number, mediaType: MediaTypeEnum) => boolean;
  addItemToWatchlist: (
    item: MediaItem,
    mediaType: MediaTypeEnum,
    watchlistId?: string,
    status?: WatchlistItemStatus,
    scheduledAt?: string | null
  ) => Promise<boolean>;
  removeItemFromWatchlist: (item: MediaItem, mediaType: MediaTypeEnum, watchlistId?: string) => Promise<boolean>;
  selectWatchlist: (watchlistId: string) => void;
  refreshWatchlists: () => Promise<void>;
  createNewWatchlist: (name: string) => Promise<{ success: boolean; watchlist?: any; error?: string }>;
  updateWatchlist: (id: string, name: string) => Promise<{ success: boolean; watchlist?: any; error?: string }>;
  deleteWatchlist: (id: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

interface WatchlistContextProviderProps {
  children: React.ReactNode;
}

export const WatchlistContextProvider: React.FC<WatchlistContextProviderProps> = ({ children }) => {
  const [watchlists, setWatchlists] = useState<any[]>([]);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlistItemsSet, setWatchlistItemsSet] = useState<Set<string>>(new Set());

  const { token } = useAuth();

  const refreshWatchlists = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await getUserWatchlists(token);

      if (response.success) {
        setWatchlists(response.watchlists || []);
        setError(null);
      } else {
        setError('Failed to load watchlists');
      }
    } catch (err) {
      setError('An error occurred while loading watchlists');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshWatchlists();
  }, [refreshWatchlists]);

  // Build a Set of all watchlist items for fast lookup
  useEffect(() => {
    const items = new Set<string>();
    watchlists.forEach(wl => {
      if (wl.items && Array.isArray(wl.items)) {
        wl.items.forEach((item: any) => {
          items.add(`${item.tmdbId}-${item.mediaType}`);
        });
      }
    });
    setWatchlistItemsSet(items);
  }, [watchlists]);

  // Set the first watchlist as selected when watchlists load
  useEffect(() => {
    if (watchlists.length > 0 && !selectedWatchlistId) {
      setSelectedWatchlistId(watchlists[0].id);
    }
  }, [watchlists, selectedWatchlistId]);

  const selectWatchlist = (watchlistId: string) => {
    setSelectedWatchlistId(watchlistId);
  };

  // Local, synchronous lookup for watchlist status
  const isItemInWatchlistLocal = (tmdbId: number, mediaType: MediaTypeEnum) => {
    return watchlistItemsSet.has(`${tmdbId}-${mediaType}`);
  };

  const isItemInWatchlist = async (tmdbId: number, mediaType: MediaTypeEnum): Promise<boolean> => {
    if (!token || !selectedWatchlistId) {
      return false;
    }

    try {
      const result = await checkIfInWatchlist(selectedWatchlistId, tmdbId, mediaType, token);
      return result.inWatchlist;
    } catch (err) {
      return false;
    }
  };

  const addItemToWatchlist = async (
    item: MediaItem,
    mediaType: MediaTypeEnum,
    watchlistId?: string,
    status: WatchlistItemStatus = WatchlistItemStatus.PLANNED,
    scheduledAt: string | null = null
  ): Promise<boolean> => {
    const targetWatchlistId = watchlistId || selectedWatchlistId;

    if (!token || !targetWatchlistId) {
      return false;
    }

    try {
      const response = await addToWatchlist(
        targetWatchlistId,
        item.id,
        mediaType,
        token,
        status,
        scheduledAt
      );

      return response.success && !!response.item;
    } catch (err) {
      return false;
    }
  };

  const removeItemFromWatchlist = async (item: MediaItem, mediaType: MediaTypeEnum, watchlistId?: string): Promise<boolean> => {
    const targetWatchlistId = watchlistId || selectedWatchlistId;

    if (!token || !targetWatchlistId) {
      return false;
    }

    try {
      // First get the item ID
      const result = await checkIfInWatchlist(targetWatchlistId, item.id, mediaType, token);

      if (!result.inWatchlist || !result.itemId) {
        return false;
      }

      const response = await removeFromWatchlist(
        targetWatchlistId,
        result.itemId,
        token
      );

      return response.success;
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

  /**
   * Updates an existing watchlist
   * @param id - ID of the watchlist to update
   * @param name - New name for the watchlist
   * @returns Object containing success status and watchlist data or error message
   */
  const updateWatchlist = async (id: string, name: string) => {
    if (!token) {
      return { success: false, error: 'You must be logged in to update a watchlist' };
    }

    try {
      const response = await updateWatchlistService(id, name, token);

      if (response.success) {
        // Refresh the watchlists to reflect changes
        await refreshWatchlists();
      }
      return response;
    } catch (err) {
      console.error('Error updating watchlist:', err);
      return { success: false, error: 'Failed to update watchlist' };
    }
  };

  /**
   * Deletes a watchlist and all its items
   * @param id - ID of the watchlist to delete
   * @returns Object containing success status and message or error
   */
  const deleteWatchlist = async (id: string) => {
    if (!token) {
      return { success: false, error: 'You must be logged in to delete a watchlist' };
    }

    try {
      const response = await deleteWatchlistService(id, token);

      if (response.success) {
        // If the deleted watchlist was selected, clear the selection
        if (selectedWatchlistId === id) {
          setSelectedWatchlistId(null);
        }
        // Refresh the watchlists to reflect changes
        await refreshWatchlists();
      }
      return response;
    } catch (err) {
      console.error('Error deleting watchlist:', err);
      return { success: false, error: 'Failed to delete watchlist' };
    }
  };

  const value = {
    watchlists,
    selectedWatchlistId,
    isLoading,
    error,
    isItemInWatchlist,
    isItemInWatchlistLocal,
    addItemToWatchlist,
    removeItemFromWatchlist,
    selectWatchlist,
    refreshWatchlists,
    createNewWatchlist,
    updateWatchlist,
    deleteWatchlist,
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
