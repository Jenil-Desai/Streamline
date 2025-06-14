import axios from 'axios';
import { BASE_URL } from '../constants/config';
import { TVDetailsResponse } from '../../types/tv';

/**
 * Fetches detailed information about a TV show
 * @param id - TMDB ID of the TV show
 * @param token - Authentication token (optional)
 * @returns Promise with TV details response
 */
export const fetchTVDetails = async (
  id: number,
  token?: string | null
): Promise<TVDetailsResponse> => {
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get<TVDetailsResponse>(
      `${BASE_URL}/search/tv/${id}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error('Error in fetchTVDetails:', error);
    throw error;
  }
};
