/**
 * Media item type interfaces for the app
 * These interfaces define the data structure for movies and TV shows
 */

/**
 * Base interface for media items (movies and TV shows)
 */
export interface MediaItem {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  media_type: 'movie' | 'tv';
}

/**
 * Homepage data structure returned from the API
 */
export interface HomeData {
  trending_movies: MediaItem[];
  trending_tv: MediaItem[];
  popular_movies: MediaItem[];
  popular_tv: MediaItem[];
  upcoming_movies: MediaItem[];
  on_air_tv: MediaItem[];
  top_rated_movies: MediaItem[];
  top_rated_tv: MediaItem[];
}

/**
 * Extended movie details interface
 */
export interface MovieDetails extends MediaItem {
  overview: string;
  runtime: number;
  vote_average: number;
  genres: Genre[];
  backdrop_path?: string;
}

/**
 * Extended TV show details interface
 */
export interface TVShowDetails extends MediaItem {
  overview: string;
  number_of_seasons: number;
  number_of_episodes: number;
  vote_average: number;
  genres: Genre[];
  backdrop_path?: string;
}

/**
 * Genre type for categorizing media
 */
export interface Genre {
  id: number;
  name: string;
}

/**
 * Media type enum
 */
export enum MediaType {
  MOVIE = 'movie',
  TV = 'tv'
}
