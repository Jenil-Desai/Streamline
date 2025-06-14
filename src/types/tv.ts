/**
 * TV show type interfaces for the app
 * These interfaces define the data structure for TV show details
 */

import { MediaItem, Genre } from './media';

/**
 * Watch Provider information
 */
export interface Provider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

/**
 * Country-specific watch provider options
 */
export interface CountryProviders {
  link: string;
  flatrate?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
}

/**
 * Watch providers by country
 */
export interface WatchProviders {
  [countryCode: string]: CountryProviders;
}

/**
 * TV show creator type
 */
export interface CreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string | null;
}

/**
 * TV show episode type
 */
export interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number | null;
  season_number: number;
  show_id: number;
  still_path: string | null;
}

/**
 * TV show season type
 */
export interface Season {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
  episodes?: Episode[];
}

/**
 * Network information for TV shows
 */
export interface Network {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

/**
 * Video content for TV shows
 */
export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

/**
 * Video results container
 */
export interface VideoResults {
  results: Video[];
}

/**
 * Review author details
 */
export interface ReviewAuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

/**
 * TV show review
 */
export interface Review {
  id: string;
  author: string;
  author_details: ReviewAuthorDetails;
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

/**
 * Review results container
 */
export interface ReviewResults {
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
}

/**
 * Similar/Recommendations results container
 */
export interface MediaResults {
  page: number;
  results: MediaItem[];
  total_pages: number;
  total_results: number;
}

/**
 * Complete TV show details
 */
export interface TVDetails {
  adult: boolean;
  backdrop_path: string | null;
  created_by: CreatedBy[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Episode | null;
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
  poster_path: string | null;
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
  seasons: Season[];
  videos: VideoResults;
  reviews: ReviewResults;
  similar: MediaResults;
  recommendations: MediaResults;
  watchProviders?: WatchProviders;
}

/**
 * TV details response from API
 */
export interface TVDetailsResponse {
  success: boolean;
  data: {
    details: TVDetails;
    watchProviders: WatchProviders;
    seasons: Season[];
  };
}
