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
  isItemInWatchlist: (tmdbId: number, mediaType: MediaTypeEnum) => boolean;
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

  // Set the first watchlist as selected when watchlists load
  useEffect(() => {
    if (watchlists.length > 0 && !selectedWatchlistId) {
      setSelectedWatchlistId(watchlists[0].id);
    }
  }, [watchlists, selectedWatchlistId]);

  const selectWatchlist = (watchlistId: string) => {
    setSelectedWatchlistId(watchlistId);
  };

  // Check if item is in any watchlist
  const isItemInWatchlist = (tmdbId: number, mediaType: MediaTypeEnum): boolean => {
    return watchlists.some(watchlist =>
      watchlist.WatchlistItem && watchlist.WatchlistItem.some((item: any) =>
        item.tmdbId === tmdbId && item.mediaType === mediaType
      )
    );
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

      if (response.success && response.item) {
        // Update local state immediately
        setWatchlists(prevWatchlists =>
          prevWatchlists.map(wl =>
            wl.id === targetWatchlistId
              ? { ...wl, WatchlistItem: [...(wl.WatchlistItem || []), response.item] }
              : wl
          )
        );
        return true;
      }
      return false;
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

      if (response.success) {
        // Update local state immediately
        setWatchlists(prevWatchlists =>
          prevWatchlists.map(wl =>
            wl.id === targetWatchlistId
              ? { ...wl, WatchlistItem: (wl.WatchlistItem || []).filter((i: any) => i.id !== result.itemId) }
              : wl
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const createNewWatchlist = async (name: string) => {
    if (!token) {
      return { success: false, error: 'You must be logged in to create a watchlist' };
    }

    try {
      const response = await createWatchlist(name, token);

      if (response.success && response.watchlist) {
        // Add to local state
        setWatchlists(prev => [...prev, response.watchlist]);

        // Select the newly created watchlist
        if (response.watchlist.id) {
          selectWatchlist(response.watchlist.id);
        }
      }
      return response;
    } catch (err) {
      return { success: false, error: 'Failed to create watchlist' };
    }
  };

  const updateWatchlist = async (id: string, name: string) => {
    if (!token) {
      return { success: false, error: 'You must be logged in to update a watchlist' };
    }

    try {
      const response = await updateWatchlistService(id, name, token);

      if (response.success && response.watchlist) {
        // Update local state
        setWatchlists(prev =>
          prev.map(wl => wl.id === id ? { ...wl, name } : wl)
        );
      }
      return response;
    } catch (err) {
      return { success: false, error: 'Failed to update watchlist' };
    }
  };

  const deleteWatchlist = async (id: string) => {
    if (!token) {
      return { success: false, error: 'You must be logged in to delete a watchlist' };
    }

    try {
      const response = await deleteWatchlistService(id, token);

      if (response.success) {
        // Remove from local state
        setWatchlists(prev => prev.filter(wl => wl.id !== id));

        // Clear selection if deleted watchlist was selected
        if (selectedWatchlistId === id) {
          setSelectedWatchlistId(null);
        }
      }
      return response;
    } catch (err) {
      return { success: false, error: 'Failed to delete watchlist' };
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
    updateWatchlist,
    deleteWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = (): WatchlistContextType => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistContextProvider');
  }
  return context;
};
