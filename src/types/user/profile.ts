export interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  watchTime: number;
  movies_watched: number;
  shows_watched: number;
  created_at: Date;
  country: string;
}

export interface ProfileResponse {
  success: boolean;
  error?: string;
  profile?: Profile;
}
