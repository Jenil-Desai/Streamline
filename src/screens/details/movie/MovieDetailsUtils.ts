import { MediaItem } from '../../../types/media';

/**
 * Types for Movie Details Screen
 */
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

export type ProductionCompany = {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
};

export type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

export type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

export type MovieDetails = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: any | null;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
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
 * Format number as currency with $ symbol
 */
export const formatCurrency = (amount: number): string => {
  if (!amount) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
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
    title: item.title || item.name,
    poster_path: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image',
    release_date: item.release_date || item.first_air_date || '',
    media_type: item.media_type || 'movie',
  };
};
