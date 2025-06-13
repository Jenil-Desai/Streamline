export interface Watchlist {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
}

export interface WatchlistsResponse {
  success: boolean;
  watchlists: Watchlist[];
}
