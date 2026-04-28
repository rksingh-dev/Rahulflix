// 111movies API integration with IMDB IDs
export const TMDB_API_KEY = '7a337bb13c46fcdccf8dcbf450733263';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const getMovieStreamUrl = (imdbId: string): string => {
  // Ensure IMDB ID format (add 'tt' prefix if not present)
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://111movies.com/movie/${formattedId}`;
};

export const getTVShowStreamUrl = (imdbId: string, season: number, episode: number): string => {
  // Ensure IMDB ID format (add 'tt' prefix if not present)
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://111movies.com/tv/${formattedId}//${season}/${episode}`;
};

// RiveStream API integration with IMDB IDs
export const getRiveStreamMovieUrl = (imdbId: string): string => {
  // Ensure IMDB ID format (add 'tt' prefix if not present)
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://multiembed.mov/?video_id=${formattedId}`;
};

export const getRiveStreamTVUrl = (imdbId: string, season: number, episode: number): string => {
  // Ensure IMDB ID format (add 'tt' prefix if not present)
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://multiembed.mov/?video_id=${formattedId}&season=${season}&episode=${episode}`;
};

// StreamingNow integration with IMDB IDs
export const getStreamingNowMovieUrl = (imdbId: string): string => {
  // Ensure IMDB ID format (add 'tt' prefix if not present)
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://streamimdb.ru/embed/movie/${formattedId}`;
};

export const getStreamingNowTVUrl = (imdbId: string, season: number, episode: number): string => {
  // Ensure IMDB ID format (add 'tt' prefix if not present)
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://streamimdb.ru/embed/tv/${formattedId}/${season}/${episode}`;
};

// VidBinge integration with IMDB IDs
export const getVidBingeMovieUrl = (imdbId: string): string => {
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://vidbinge.to/movie/${formattedId}`;
};

export const getVidBingeTVUrl = (imdbId: string, season: number, episode: number): string => {
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://vidbinge.to/series/${formattedId}.${season}.${episode}`;
};

// Vembed integration with IMDB IDs
export const getVembedMovieUrl = (imdbId: string): string => {
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://vembed.click/play/${formattedId}`;
};

export const getVembedTVUrl = (imdbId: string, season: number, episode: number): string => {
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://vembed.click/embedtv/${formattedId}?season=${season}&episode=${episode}`;
};

export type ServerType = '111movies' | 'rivestream' | 'streamingnow' | 'vidbinge' | 'vembed';

// Helper function to get stream URL based on content type and server
export const getStreamUrl = (
  id: string,
  type: 'movie' | 'tv',
  season?: number,
  episode?: number,
  server: ServerType = 'rivestream'
): string => {
  if (server === 'rivestream') {
    if (type === 'movie') {
      return getRiveStreamMovieUrl(id);
    } else {
      if (season === undefined || episode === undefined) {
        throw new Error('Season and episode are required for TV shows');
      }
      return getRiveStreamTVUrl(id, season, episode);
    }
  } else if (server === 'streamingnow') {
    if (type === 'movie') {
      return getStreamingNowMovieUrl(id);
    } else {
      if (season === undefined || episode === undefined) {
        throw new Error('Season and episode are required for TV shows');
      }
      return getStreamingNowTVUrl(id, season, episode);
    }
  } else if (server === 'vidbinge') {
    if (type === 'movie') {
      return getVidBingeMovieUrl(id);
    } else {
      if (season === undefined || episode === undefined) {
        throw new Error('Season and episode are required for TV shows');
      }
      return getVidBingeTVUrl(id, season, episode);
    }
  } else if (server === 'vembed') {
    if (type === 'movie') {
      return getVembedMovieUrl(id);
    } else {
      if (season === undefined || episode === undefined) {
        throw new Error('Season and episode are required for TV shows');
      }
      return getVembedTVUrl(id, season, episode);
    }
  } else {
    // 111movies
    if (type === 'movie') {
      return getMovieStreamUrl(id);
    } else {
      if (season === undefined || episode === undefined) {
        throw new Error('Season and episode are required for TV shows');
      }
      return getTVShowStreamUrl(id, season, episode);
    }
  }
};
