import axios from 'axios';
import { BASE_URL } from '../constants/config';

/**
 * Interface for watchlist item request
 */
interface WatchlistItemRequest {
  tmdbId: number;
  mediaType: 'MOVIE' | 'TV';
  status?: string;
  scheduledAt?: string;
}

/**
 * Interface for watchlist item response
 */
interface WatchlistItemResponse {
  success: boolean;
  item?: {
    id: string;
    tmdbId: number;
    mediaType: string;
    status: string;
    scheduledAt: string | null;
    watchlistId: string;
    createdAt: string;
  };
  message?: string;
  error?: string;
}

/**
 * Adds a media item to a watchlist
 * @param watchlistId - The ID of the watchlist
 * @param tmdbId - The TMDB ID of the media item
 * @param mediaType - The type of media (MOVIE or TV)
 * @param token - Authentication token
 * @returns Promise with response from the API
 */
export const addToWatchlist = async (
  watchlistId: string,
  tmdbId: number,
  mediaType: 'MOVIE' | 'TV',
  token: string
): Promise<WatchlistItemResponse> => {
  try {
    const payload: WatchlistItemRequest = {
      tmdbId,
      mediaType,
    };

    const response = await axios.post<WatchlistItemResponse>(
      `${BASE_URL}/watchlists/${watchlistId}/items`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as WatchlistItemResponse;
    }
    return {
      success: false,
      error: 'Failed to add item to watchlist'
    };
  }
};

/**
 * Removes a media item from a watchlist
 * @param watchlistId - The ID of the watchlist
 * @param itemId - The ID of the watchlist item to remove
 * @param token - Authentication token
 * @returns Promise with response from the API
 */
export const removeFromWatchlist = async (
  watchlistId: string,
  itemId: string,
  token: string
): Promise<WatchlistItemResponse> => {
  try {
    const response = await axios.delete<WatchlistItemResponse>(
      `${BASE_URL}/watchlists/${watchlistId}/items/${itemId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as WatchlistItemResponse;
    }
    return {
      success: false,
      error: 'Failed to remove item from watchlist'
    };
  }
};

/**
 * Checks if a media item is in any of the user's watchlists
 * @param tmdbId - The TMDB ID of the media item
 * @param mediaType - The type of media (MOVIE or TV)
 * @param token - Authentication token
 * @returns Promise with the item ID if found, null otherwise
 */
export const checkIfInWatchlist = async (
  watchlistId: string,
  tmdbId: number,
  mediaType: 'MOVIE' | 'TV',
  token: string
): Promise<{ inWatchlist: boolean, itemId: string | null }> => {
  try {
    // This is a mock implementation - the actual API might have a different endpoint
    // such as /watchlists/{id}/check?tmdbId=123&mediaType=MOVIE
    const response = await axios.get(
      `${BASE_URL}/watchlists/${watchlistId}/items`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // Find the item in the response
    const items = response.data.items || [];
    const foundItem = items.find((item: any) =>
      item.tmdbId === tmdbId && item.mediaType === mediaType
    );

    return {
      inWatchlist: !!foundItem,
      itemId: foundItem ? foundItem.id : null
    };
  } catch (error) {
    return {
      inWatchlist: false,
      itemId: null
    };
  }
};

/**
 * Gets all watchlists for the current user
 * @param token - Authentication token
 * @returns Promise with list of watchlists
 */
export const getUserWatchlists = async (token: string): Promise<any> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/watchlists`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    return {
      success: false,
      error: 'Failed to fetch watchlists'
    };
  }
};

/**
 * Interface for watchlist creation request
 */
interface CreateWatchlistRequest {
  name: string;
}

/**
 * Interface for watchlist creation response
 */
interface CreateWatchlistResponse {
  success: boolean;
  watchlist?: {
    id: string;
    name: string;
    ownerId: string;
    createdAt: string;
  };
  error?: string;
}

/**
 * Creates a new watchlist for the current user
 * @param name - The name of the watchlist
 * @param token - Authentication token
 * @returns Promise with the created watchlist
 */
export const createWatchlist = async (
  name: string,
  token: string
): Promise<CreateWatchlistResponse> => {
  try {
    const payload: CreateWatchlistRequest = {
      name
    };

    const response = await axios.post<CreateWatchlistResponse>(
      `${BASE_URL}/watchlists`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as CreateWatchlistResponse;
    }
    return {
      success: false,
      error: 'Failed to create watchlist'
    };
  }
};
