import axios from 'axios';
import { BASE_URL } from '../constants/config';
import { Watchlist, WatchlistsResponse } from '../../types/user/watchlist';
import { MediaTypeEnum, WatchlistItem, WatchlistItemStatus, WatchlistItemsResponse } from '../../types/user/watchlistItem';

/**
 * Fetches all watchlists for the current user
 * @param token - Authentication token
 * @returns Promise with watchlists response
 */
export const getUserWatchlists = async (
  token: string | null
): Promise<WatchlistsResponse> => {
  try {
    if (!token) {
      return { success: false, watchlists: [] };
    }

    const response = await axios.get<WatchlistsResponse>(
      `${BASE_URL}/watchlists`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error in getUserWatchlists:', error);
    return { success: false, watchlists: [] };
  }
};

/**
 * Creates a new watchlist
 * @param name - Name of the watchlist
 * @param token - Authentication token
 * @returns Promise with watchlist creation response
 */
export const createWatchlist = async (
  name: string,
  token: string | null
): Promise<{ success: boolean; watchlist?: Watchlist; error?: string }> => {
  try {
    if (!token) {
      return { success: false, error: 'Authentication required' };
    }

    const response = await axios.post(
      `${BASE_URL}/watchlists`,
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error in createWatchlist:', error);
    return { success: false, error: 'Failed to create watchlist' };
  }
};

/**
 * Adds an item to a watchlist
 * @param watchlistId - ID of the watchlist
 * @param tmdbId - TMDB ID of the media item
 * @param mediaType - Type of media (MOVIE or TV)
 * @param token - Authentication token
 * @param status - Status of the item (optional)
 * @param scheduledAt - Scheduled time for the item (optional)
 * @returns Promise with watchlist addition response
 */
export const addToWatchlist = async (
  watchlistId: string,
  tmdbId: number,
  mediaType: MediaTypeEnum,
  token: string | null,
  status: WatchlistItemStatus = WatchlistItemStatus.PLANNED,
  scheduledAt: string | null = null
): Promise<{ success: boolean; item?: WatchlistItem; error?: string }> => {
  try {
    if (!token) {
      return { success: false, error: 'Authentication required' };
    }

    const payload = {
      tmdbId,
      mediaType,
      status,
      ...(scheduledAt && { scheduledAt }),
    };

    const response = await axios.post(
      `${BASE_URL}/watchlists/${watchlistId}/items`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error in addToWatchlist:', error);
    return { success: false, error: 'Failed to add item to watchlist' };
  }
};

/**
 * Removes an item from a watchlist
 * @param watchlistId - ID of the watchlist
 * @param itemId - ID of the watchlist item
 * @param token - Authentication token
 * @returns Promise with watchlist removal response
 */
export const removeFromWatchlist = async (
  watchlistId: string,
  itemId: string,
  token: string | null
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    if (!token) {
      return { success: false, error: 'Authentication required' };
    }

    const response = await axios.delete(
      `${BASE_URL}/watchlists/${watchlistId}/items/${itemId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error in removeFromWatchlist:', error);
    return { success: false, error: 'Failed to remove item from watchlist' };
  }
};

/**
 * Checks if a media item is in a watchlist
 * @param watchlistId - ID of the watchlist
 * @param tmdbId - TMDB ID of the media item
 * @param mediaType - Type of media (MOVIE or TV)
 * @param token - Authentication token
 * @returns Promise with check result
 */
export const checkIfInWatchlist = async (
  watchlistId: string,
  tmdbId: number,
  mediaType: MediaTypeEnum,
  token: string | null
): Promise<{ inWatchlist: boolean; itemId?: string }> => {
  try {
    if (!token) {
      return { inWatchlist: false };
    }

    const response = await axios.get<WatchlistItemsResponse>(
      `${BASE_URL}/watchlists/${watchlistId}/items`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success && response.data.items) {
      const matchingItem = response.data.items.find(
        item => item.tmdbId === tmdbId && item.mediaType === mediaType
      );

      if (matchingItem) {
        return { inWatchlist: true, itemId: matchingItem.id };
      }
    }

    return { inWatchlist: false };
  } catch (error) {
    console.error('Error in checkIfInWatchlist:', error);
    return { inWatchlist: false };
  }
};
