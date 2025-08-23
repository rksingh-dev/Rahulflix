export interface Movie {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetail extends Movie {
  genres: Genre[];
  runtime: number;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
}

export interface TVShow {
  id: string;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_name: string;
  popularity: number;
  origin_country: string[];
}

export interface TVShowDetail extends TVShow {
  genres: Genre[];
  episode_run_time: number[];
  status: string;
  tagline: string;
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
  seasons: Season[];
  number_of_seasons: number;
  number_of_episodes: number;
  networks: Network[];
  created_by: Creator[];
  last_air_date: string;
  next_episode_to_air: Episode | null;
  last_episode_to_air: Episode | null;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  episode_count: number;
  air_date: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Creator {
  id: number;
  name: string;
  gender: number;
  profile_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface SearchParams {
  query: string;
  page?: number;
  type?: 'movie' | 'tv' | 'multi';
}

// Union types for handling both movies and TV shows
export type MediaItem = Movie | TVShow;
export type MediaDetail = MovieDetail | TVShowDetail;

// Content type enum
export enum ContentType {
  MOVIE = 'movie',
  TV = 'tv'
}

// Helper type guards
export const isMovie = (item: MediaItem): item is Movie => {
  return 'title' in item && 'release_date' in item;
};

export const isTVShow = (item: MediaItem): item is TVShow => {
  return 'name' in item && 'first_air_date' in item;
};

export const isMovieDetail = (item: MediaDetail): item is MovieDetail => {
  return 'title' in item && 'runtime' in item;
};

export const isTVShowDetail = (item: MediaDetail): item is TVShowDetail => {
  return 'name' in item && 'seasons' in item;
};
