import { MediaItem } from "../media";

export enum WatchlistItemStatus {
  PLANNED = 'PLANNED',
  WATCHED = 'WATCHED',
  IN_PROGRESS = 'IN_PROGRESS',
}

export enum MediaTypeEnum {
  MOVIE = 'MOVIE',
  TV = 'TV'
}

export interface WatchlistItem {
  id: string;
  tmdbId: number;
  mediaType: MediaTypeEnum;
  status: WatchlistItemStatus;
  scheduledAt: string | null;
  watchlistId: string;
  createdAt: string;
  media_details: MediaItem;
}

export interface WatchlistItemsResponse {
  success: boolean;
  items: WatchlistItem[];
}
