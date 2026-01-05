// 111movies API integration with IMDB IDs
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
  return `https://rivestream.net/embed?type=movie&id=${formattedId}`;
};

export const getRiveStreamTVUrl = (imdbId: string, season: number, episode: number): string => {
  // Ensure IMDB ID format (add 'tt' prefix if not present)
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://rivestream.net/embed?type=tv&id=${formattedId}&season=${season}&episode=${episode}`;
};

export type ServerType = '111movies' | 'rivestream';

// Helper function to get stream URL based on content type and server
export const getStreamUrl = (
  id: string,
  type: 'movie' | 'tv',
  season?: number,
  episode?: number,
  server: ServerType = '111movies'
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
  } else {
    // Default to 111movies
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
