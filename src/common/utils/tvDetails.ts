/**
 * tvDetails.ts - Utility functions for TV details
 */

import { MediaItem } from '../../types/media';
import { Video } from '../../types/tv';

/**
 * Format runtime to hours and minutes
 */
export const formatRuntime = (minutes: number | null): string => {
  if (!minutes) return 'N/A';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs ? `${hrs}h ` : ''}${mins}m`;
};

/**
 * Format date string to readable format
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format year from date string
 */
export const formatYear = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear().toString();
};

/**
 * Get avatar URL from path
 */
export const getAvatarUrl = (path: string | null): string | null => {
  if (!path) return null;
  // If path starts with /, it's a TMDB path
  if (path.startsWith('/')) {
    // Check if it's a gravatar path
    if (path.includes('gravatar')) {
      return path.substring(1); // Remove first slash
    }
    return `https://image.tmdb.org/t/p/w200${path}`;
  }
  return path;
};

/**
 * Get initial letter for avatar placeholder
 */
export const getAvatarInitial = (username: string): string => {
  return username ? username[0].toUpperCase() : '?';
};

/**
 * Get YouTube video URL from video key
 */
export const getYouTubeUrl = (key: string): string => {
  return `https://www.youtube.com/watch?v=${key}`;
};

/**
 * Get YouTube thumbnail URL from video key
 */
export const getYouTubeThumbnail = (key: string): string => {
  return `https://img.youtube.com/vi/${key}/mqdefault.jpg`;
};

/**
 * Filter videos by type
 */
export const getVideosByType = (videos: Video[], type: string): Video[] => {
  return videos.filter(video => video.type === type);
};

/**
 * Convert API item to MediaItem format
 */
export const convertToMediaItem = (item: any): MediaItem => {
  return {
    id: item.id,
    title: item.name || item.title,
    poster_path: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image',
    release_date: item.first_air_date || item.release_date || '',
    media_type: item.media_type || 'tv',
  };
};

/**
 * Get platform-specific video URL based on site
 */
export const getVideoUrl = (video: Video): string => {
  if (video.site === 'YouTube') {
    return getYouTubeUrl(video.key);
  }
  // Add support for Vimeo or other platforms if needed
  return '';
};

/**
 * Open video URL
 */
export const openVideoUrl = (video: Video): void => {
  const url = getVideoUrl(video);
  if (url) {
    // You can use Linking from react-native to open the URL
    // Linking.openURL(url);
    console.log(`Opening video URL: ${url}`);
  }
};
