/**
 * Utility functions for handling category data
 */
import { CategoryTitleMap, CategoryPathMap } from '../../types/category';

/**
 * Maps category identifier to display titles with special cases
 * @param category - The category identifier
 * @returns Formatted category title
 */
export function getCategoryTitle(category: string): string {
  // Special case handling for specific categories that need different formatting
  const specialTitles: CategoryTitleMap = {
    'on_air_tv': 'On Air TV Shows',
    'top_rated_tv': 'Top Rated TV Shows',
    'top_rated_movies': 'Top Rated Movies',
  };

  if (specialTitles[category]) {
    return specialTitles[category];
  }

  // Default formatting: capitalize each word and join with spaces
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Maps category identifier to corresponding API path
 * @param category - The category identifier
 * @returns API path for the category
 */
export function getCategoryApiPath(category: string): string {
  // Map category identifier to API path
  const categoryPathMap: CategoryPathMap = {
    'trending_movies': '/home/trending/movies',
    'trending_tv': '/home/trending/tv',
    'popular_movies': '/home/popular/movies',
    'popular_tv': '/home/popular/tv',
    'upcoming_movies': '/home/upcoming/movies',
    'on_air_tv': '/home/on-air/tv',
    'top_rated_movies': '/home/top-rated/movies',
    'top_rated_tv': '/home/top-rated/tv',
  };

  // Check if the path exists in our map
  if (categoryPathMap[category]) {
    return categoryPathMap[category];
  }

  // For any other category format, try to convert underscore to path format
  // e.g. "some_category" becomes "/home/some/category"
  const parts = category.split('_');
  if (parts.length >= 2) {
    return `/home/${parts[0]}/${parts.slice(1).join('/')}`;
  }

  // Fallback
  return `/home/${category}`;
}
