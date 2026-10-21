import { serverManager, ServerType, ServerDefinition } from './serverManager';

export const TMDB_API_KEY = '7a337bb13c46fcdccf8dcbf450733263';
export const TMDB_BASE_URL = '/tmdb-proxy';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export type { ServerType, ServerDefinition };
export { serverManager };

// Dynamic stream URL generator
export const getStreamUrl = (
  id: string,
  type: 'movie' | 'tv',
  season?: number,
  episode?: number,
  server: ServerType = '111movies'
): string => {
  return serverManager.getStreamUrl(id, type, season, episode, server);
};

// Legacy helper functions routed through dynamic serverManager
export const getMovieStreamUrl = (id: string): string => {
  return serverManager.getStreamUrl(id, 'movie', undefined, undefined, '111movies');
};

export const getTVShowStreamUrl = (id: string, season: number, episode: number): string => {
  return serverManager.getStreamUrl(id, 'tv', season, episode, '111movies');
};

export const getRiveStreamMovieUrl = (imdbId: string): string => {
  return serverManager.getStreamUrl(imdbId, 'movie', undefined, undefined, 'rivestream');
};

export const getRiveStreamTVUrl = (imdbId: string, season: number, episode: number): string => {
  return serverManager.getStreamUrl(imdbId, 'tv', season, episode, 'rivestream');
};

export const getStreamingNowMovieUrl = (imdbId: string): string => {
  return serverManager.getStreamUrl(imdbId, 'movie', undefined, undefined, 'streamingnow');
};

export const getStreamingNowTVUrl = (imdbId: string, season: number, episode: number): string => {
  return serverManager.getStreamUrl(imdbId, 'tv', season, episode, 'streamingnow');
};

export const getVidBingeMovieUrl = (imdbId: string): string => {
  return serverManager.getStreamUrl(imdbId, 'movie', undefined, undefined, 'vidbinge');
};

export const getVidBingeTVUrl = (imdbId: string, season: number, episode: number): string => {
  return serverManager.getStreamUrl(imdbId, 'tv', season, episode, 'vidbinge');
};

export const getVembedMovieUrl = (imdbId: string): string => {
  return serverManager.getStreamUrl(imdbId, 'movie', undefined, undefined, 'vembed');
};

export const getVembedTVUrl = (imdbId: string, season: number, episode: number): string => {
  return serverManager.getStreamUrl(imdbId, 'tv', season, episode, 'vembed');
};

export const getRiveStreamEmbedMovieUrl = (imdbId: string): string => {
  return serverManager.getStreamUrl(imdbId, 'movie', undefined, undefined, 'rivestreamembed');
};

export const getRiveStreamEmbedTVUrl = (imdbId: string, season: number, episode: number): string => {
  return serverManager.getStreamUrl(imdbId, 'tv', season, episode, 'rivestreamembed');
};
