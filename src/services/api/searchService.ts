import { BASE_URL } from '../../common/constants/config';
import { MediaItem } from '../../types/media';

// Search parameters interface
export interface SearchParams {
  query: string;
  page?: number;
  include_adult?: boolean;
  language?: string;
  media_type?: 'movie' | 'tv' | '';
}

// Search response interface
export interface SearchResponse {
  success: boolean;
  data?: {
    page: number;
    total_pages: number;
    total_results: number;
    results: MediaItem[];
  };
  error?: string;
}

/**
 * Search for movies and TV shows based on provided parameters
 *
 * @param params - Search parameters
 * @returns Promise with search results
 */
export const searchMedia = async (params: SearchParams): Promise<SearchResponse> => {
  try {
    // Construct the query string
    const queryParams = new URLSearchParams();

    // Add required parameter
    if (!params.query) {
      return { success: false, error: 'Search query is required' };
    }
    queryParams.append('query', params.query);

    // Add optional parameters if they exist
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.include_adult !== undefined) queryParams.append('include_adult', params.include_adult.toString());
    if (params.language) queryParams.append('language', params.language);
    if (params.media_type) queryParams.append('media_type', params.media_type);

    // Make the API request
    const response = await fetch(`${BASE_URL}/search?${queryParams.toString()}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data as SearchResponse;
  } catch (error) {
    console.error('Search API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};
