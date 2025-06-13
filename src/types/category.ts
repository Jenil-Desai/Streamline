/**
 * Category related type definitions
 */
import { MediaItem, MediaType } from './media';

/**
 * Extended MediaItem with optional media_type field
 */
export interface CategoryMediaItem extends MediaItem {
  media_type?: MediaType;
}

/**
 * Category API response structure
 */
export interface CategoryListResponse {
  results: CategoryMediaItem[];
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
