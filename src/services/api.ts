import axios from 'axios';
import {
  Movie,
  MovieDetail,
  TVShow,
  TVShowDetail,
  Season,
  Episode,
  ApiResponse,
  MediaItem
} from '../types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = '82272030a69422d31949379569825735'; // Your TMDB API key
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getImageUrl = (path: string, size: string = 'w500') => {
  if (!path) return '';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string) => {
  return getImageUrl(path, 'w1280');
};

export const getPosterUrl = (path: string) => {
  return getImageUrl(path, 'w500');
};

export const getThumbnailUrl = (path: string) => {
  return getImageUrl(path, 'w300');
};

export const movieApi = {
  // Get trending movies
  getTrending: async (): Promise<Movie[]> => {
    const response = await api.get<ApiResponse<Movie>>('/trending/movie/week');
    return response.data.results;
  },

  // Get popular movies
  getPopular: async (): Promise<Movie[]> => {
    const response = await api.get<ApiResponse<Movie>>('/movie/popular');
    return response.data.results;
  },

  // Get top rated movies
  getTopRated: async (): Promise<Movie[]> => {
    const response = await api.get<ApiResponse<Movie>>('/movie/top_rated');
    return response.data.results;
  },

  // Get upcoming movies
  getUpcoming: async (): Promise<Movie[]> => {
    const response = await api.get<ApiResponse<Movie>>('/movie/upcoming');
    return response.data.results;
  },

  // Get movie details
  getMovieDetail: async (id: string): Promise<MovieDetail> => {
    const response = await api.get<MovieDetail>(`/movie/${id}`);
    return response.data;
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await api.get<ApiResponse<Movie>>('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId: number): Promise<Movie[]> => {
    const response = await api.get<ApiResponse<Movie>>('/discover/movie', {
      params: { with_genres: genreId },
    });
    return response.data.results;
  },
};

export const tvApi = {
  // Get trending TV shows
  getTrending: async (): Promise<TVShow[]> => {
    const response = await api.get<ApiResponse<TVShow>>('/trending/tv/week');
    return response.data.results;
  },

  // Get popular TV shows
  getPopular: async (): Promise<TVShow[]> => {
    const response = await api.get<ApiResponse<TVShow>>('/tv/popular');
    return response.data.results;
  },

  // Get top rated TV shows
  getTopRated: async (): Promise<TVShow[]> => {
    const response = await api.get<ApiResponse<TVShow>>('/tv/top_rated');
    return response.data.results;
  },

  // Get airing today TV shows
  getAiringToday: async (): Promise<TVShow[]> => {
    const response = await api.get<ApiResponse<TVShow>>('/tv/airing_today');
    return response.data.results;
  },

  // Get on the air TV shows
  getOnTheAir: async (): Promise<TVShow[]> => {
    const response = await api.get<ApiResponse<TVShow>>('/tv/on_the_air');
    return response.data.results;
  },

  // Get TV show details
  getTVShowDetail: async (id: string): Promise<TVShowDetail> => {
    const response = await api.get<TVShowDetail>(`/tv/${id}`);
    return response.data;
  },

  // Get season details
  getSeasonDetail: async (tvId: string, seasonNumber: number): Promise<Season> => {
    const response = await api.get<Season>(`/tv/${tvId}/season/${seasonNumber}`);
    return response.data;
  },

  // Get episode details
  getEpisodeDetail: async (tvId: string, seasonNumber: number, episodeNumber: number): Promise<Episode> => {
    const response = await api.get<Episode>(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`);
    return response.data;
  },

  // Search TV shows
  searchTVShows: async (query: string, page: number = 1): Promise<ApiResponse<TVShow>> => {
    const response = await api.get<ApiResponse<TVShow>>('/search/tv', {
      params: { query, page },
    });
    return response.data;
  },

  // Get TV shows by genre
  getTVShowsByGenre: async (genreId: number): Promise<TVShow[]> => {
    const response = await api.get<ApiResponse<TVShow>>('/discover/tv', {
      params: { with_genres: genreId },
    });
    return response.data.results;
  },
};

// Multi-search API for both movies and TV shows
export const searchApi = {
  searchMulti: async (query: string, page: number = 1): Promise<ApiResponse<MediaItem>> => {
    const response = await api.get<ApiResponse<MediaItem>>('/search/multi', {
      params: { query, page },
    });
    return response.data;
  },
};

// 111movies API integration with IMDB IDs
export const getMovieStreamUrl = (imdbId: string): string => {
  // Ensure IMDB ID format (add 'tt' prefix if not present)
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://111movies.com/movie/${formattedId}`;
};

export const getTVShowStreamUrl = (imdbId: string, season: number, episode: number): string => {
  // Ensure IMDB ID format (add 'tt' prefix if not present)
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://111movies.com/tv/${formattedId}/${season}/${episode}`;
};

// Helper function to get stream URL based on content type
export const getStreamUrl = (
  id: string,
  type: 'movie' | 'tv',
  season?: number,
  episode?: number
): string => {
  if (type === 'movie') {
    return getMovieStreamUrl(id);
  } else {
    if (season === undefined || episode === undefined) {
      throw new Error('Season and episode are required for TV shows');
    }
    return getTVShowStreamUrl(id, season, episode);
  }
};

export default api;
