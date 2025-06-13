import axios from 'axios';
import { BASE_URL } from '../constants/config';
import { CategoryListResponse } from '../../types/category';

/**
 * Fetches category data from the API
 * @param apiPath - The API path for the category
 * @param page - Page number to fetch
 * @param token - Authentication token
 * @returns Promise with category list response
 */
export const fetchCategoryData = async (
  apiPath: string,
  page: number = 1,
  token: string | null
): Promise<CategoryListResponse> => {
  try {
    const response = await axios.get<CategoryListResponse>(
      `${BASE_URL}${apiPath}?page=${page}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error in fetchCategoryData:', error);
    throw error;
  }
};
