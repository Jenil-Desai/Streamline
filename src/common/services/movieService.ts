
import { BASE_URL } from "../constants/config";

/**
 * Fetch movie details including videos, reviews, similar, and recommendations
 * @param id The movie ID to fetch
 * @returns Movie details with related data
 */
export const fetchMovieDetails = async (id: number): Promise<any> => {
  try {
    const url = `${BASE_URL}/search/movie/${id}`;

    const response = await fetch(url);
    const data = await response.json();

    if (response.ok) {

      return {
        success: true,
        data: {
          details: data.data.details,
          watchProviders: data.data.watchProviders,
        }
      };
    } else {
      return {
        success: false,
        error: data.status_message || 'Failed to fetch movie details'
      };
    }
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return {
      success: false,
      error: 'An error occurred while fetching movie details'
    };
  }
};
