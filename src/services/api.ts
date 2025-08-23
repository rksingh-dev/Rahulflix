import axios from 'axios';
import { Movie, MovieDetail, ApiResponse } from '../types';

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

// 111movies API integration
export const getMovieStreamUrl = (movieId: string): string => {
  // Convert TMDB ID to IMDB ID format if needed
  // For demo purposes, we'll use the TMDB ID directly
  // In a real implementation, you'd need to map TMDB IDs to IMDB IDs
  return `https://111movies.com/movie/${movieId}`;
};

export default api;
