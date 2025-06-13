/**
 * Category related type definitions
 */
import { MediaItem } from './media';

/**
 * Category API response structure
 */
export interface CategoryListResponse {
  results: MediaItem[];
  pagination: {
    page: number;
    total_pages: number;
    total_results: number;
  };
}

/**
 * Category mapping type
 */
export type CategoryPathMap = Record<string, string>;

/**
 * Special title mapping type
 */
export type CategoryTitleMap = Record<string, string>;
