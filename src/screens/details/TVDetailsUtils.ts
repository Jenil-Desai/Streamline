import { MediaItem } from '../../types/media';

/**
 * Types for TV Details Screen
 */
export type Season = {
  id: number;
  name: string;
  episode_count: number;
  season_number: number;
  poster_path: string;
  overview: string;
  air_date: string;
  vote_average: number;
};

export type Episode = {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  still_path: string;
  air_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  season_number: number;
  episode_type: string;
};

export type Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

export type Review = {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  url: string;
};

export type Genre = {
  id: number;
  name: string;
};

export type CreatedBy = {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
};

export type Network = {
  id: number;
  name: string;
  logo_path: string;
  origin_country: string;
};

export type TVDetails = {
  adult: boolean;
  backdrop_path: string;
  created_by: CreatedBy[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Episode;
  name: string;
  next_episode_to_air: Episode | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: any[];
  seasons: Season[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
  videos: {
    results: Video[];
  };
  similar: {
    results: MediaItem[];
  };
  recommendations: {
    results: MediaItem[];
  };
  reviews: {
    results: Review[];
  };
};

/**
 * Format runtime to hours and minutes
 */
export const formatRuntime = (minutes: number): string => {
  if (!minutes) { return 'N/A'; }
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs ? `${hrs}h ` : ''}${mins}m`;
};

/**
 * Format date string to readable format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
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
 * Convert API response to MediaItem format
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
