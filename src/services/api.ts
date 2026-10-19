// 111movies API integration with IMDB / TMDB IDs
export const TMDB_API_KEY = '7a337bb13c46fcdccf8dcbf450733263';
export const TMDB_BASE_URL = '/tmdb-proxy';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const getMovieStreamUrl = (id: string): string => {
  // 111movies supports both IMDb IDs (e.g. tt6263850) and TMDB IDs (e.g. 533535)
  // If it's a numeric IMDb ID missing 'tt' (e.g. starts with '0'), prepend 'tt'
  const formattedId = id.startsWith('0') ? `tt${id}` : id;
  return `https://111movies.net/movie/${formattedId}`;
};

export const getTVShowStreamUrl = (id: string, season: number, episode: number): string => {
  // 111movies supports both IMDb IDs and TMDB IDs
  const formattedId = id.startsWith('0') ? `tt${id}` : id;
  return `https://111movies.net/tv/${formattedId}/${season}/${episode}`;
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

// StreamingNow (Server 3) - powered by VidSrc SU
export const getStreamingNowMovieUrl = (imdbId: string): string => {
  // Ensure IMDB ID format (add 'tt' prefix if not present)
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://vidsrc.su/embed/movie/${formattedId}`;
};

export const getStreamingNowTVUrl = (imdbId: string, season: number, episode: number): string => {
  // Ensure IMDB ID format (add 'tt' prefix if not present)
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://vidsrc.su/embed/tv/${formattedId}/${season}/${episode}`;
};

// VidBinge (Server 4) - powered by VidSrc PM
export const getVidBingeMovieUrl = (imdbId: string): string => {
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://vidsrc.pm/embed/movie/${formattedId}`;
};

export const getVidBingeTVUrl = (imdbId: string, season: number, episode: number): string => {
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://vidsrc.pm/embed/tv/${formattedId}/${season}/${episode}`;
};

// Vembed (Server 5) - powered by AutoEmbed
export const getVembedMovieUrl = (imdbId: string): string => {
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://autoembed.co/movie/imdb/${formattedId}`;
};

export const getVembedTVUrl = (imdbId: string, season: number, episode: number): string => {
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://autoembed.co/tv/imdb/${formattedId}-${season}-${episode}`;
};

// Server 6 - powered by 2Embed
export const getRiveStreamEmbedMovieUrl = (imdbId: string): string => {
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://www.2embed.cc/embed/${formattedId}`;
};

export const getRiveStreamEmbedTVUrl = (imdbId: string, season: number, episode: number): string => {
  const formattedId = imdbId.startsWith('tt') ? imdbId : `tt${imdbId}`;
  return `https://www.2embed.cc/embedtv/${formattedId}&s=${season}&e=${episode}`;
};

export type ServerType = '111movies' | 'rivestream' | 'streamingnow' | 'vidbinge' | 'vembed' | 'rivestreamembed';

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
  } else if (server === 'rivestreamembed') {
    if (type === 'movie') {
      return getRiveStreamEmbedMovieUrl(id);
    } else {
      if (season === undefined || episode === undefined) {
        throw new Error('Season and episode are required for TV shows');
      }
      return getRiveStreamEmbedTVUrl(id, season, episode);
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
