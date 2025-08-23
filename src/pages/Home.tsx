import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import { Movie, TVShow, MediaItem } from '../types';
import { movieApi, tvApi } from '../services/api';

const HomeContainer = styled.div`
  padding-top: 80px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #fff;
  font-size: 1.2rem;
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #e50914;
  font-size: 1.2rem;
  text-align: center;
  padding: 0 2rem;
`;

const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [trendingTVShows, setTrendingTVShows] = useState<TVShow[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TVShow[]>([]);
  const [topRatedTVShows, setTopRatedTVShows] = useState<TVShow[]>([]);
  const [airingTodayTVShows, setAiringTodayTVShows] = useState<TVShow[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = searchParams.get('category');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          trendingMovies, popularMovies, topRatedMovies, upcomingMovies,
          trendingTV, popularTV, topRatedTV, airingTodayTV
        ] = await Promise.all([
          movieApi.getTrending(),
          movieApi.getPopular(),
          movieApi.getTopRated(),
          movieApi.getUpcoming(),
          tvApi.getTrending(),
          tvApi.getPopular(),
          tvApi.getTopRated(),
          tvApi.getAiringToday(),
        ]);

        setTrendingMovies(trendingMovies);
        setPopularMovies(popularMovies);
        setTopRatedMovies(topRatedMovies);
        setUpcomingMovies(upcomingMovies);
        setTrendingTVShows(trendingTV);
        setPopularTVShows(popularTV);
        setTopRatedTVShows(topRatedTV);
        setAiringTodayTVShows(airingTodayTV);
      } catch (err) {
        setError('Failed to load content. Please try again later.');
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleAddToList = (item: MediaItem) => {
    setWatchlist(prev => {
      if (prev.includes(item.id)) {
        return prev.filter(id => id !== item.id);
      } else {
        return [...prev, item.id];
      }
    });
  };

  const getFeaturedMovie = () => {
    if (category === 'trending') return trendingMovies[0];
    if (category === 'popular') return popularMovies[0];
    if (category === 'top-rated') return topRatedMovies[0];
    if (category === 'upcoming') return upcomingMovies[0];
    return trendingMovies[0];
  };

  const getMoviesByCategory = () => {
    if (category === 'trending') return trendingMovies;
    if (category === 'popular') return popularMovies;
    if (category === 'top-rated') return topRatedMovies;
    if (category === 'upcoming') return upcomingMovies;
    return trendingMovies;
  };

  if (loading) {
    return (
      <HomeContainer>
        <LoadingContainer>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            Loading...
          </motion.div>
        </LoadingContainer>
      </HomeContainer>
    );
  }

  if (error) {
    return (
      <HomeContainer>
        <ErrorContainer>
          <div>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
          </div>
        </ErrorContainer>
      </HomeContainer>
    );
  }

  const featuredMovie = getFeaturedMovie();

  return (
    <HomeContainer>
      {featuredMovie && (
        <div id="hero-banner">
          <HeroBanner movie={featuredMovie} />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {!category && (
          <>
            <div id="trending">
              <MovieRow
                title="Trending Now"
                movies={trendingMovies.slice(1, 7)}
                onAddToList={handleAddToList}
                watchlist={watchlist}
              />
            </div>
            <div id="movies">
              <MovieRow
                title="Popular Movies"
                movies={popularMovies.slice(0, 6)}
                onAddToList={handleAddToList}
                watchlist={watchlist}
              />
            </div>
            <div id="tv-shows">
              <MovieRow
                title="Popular TV Shows"
                tvShows={popularTVShows.slice(0, 6)}
                onAddToList={handleAddToList}
                watchlist={watchlist}
              />
            </div>
            <div id="popular">
              <MovieRow
                title="Top Rated Movies"
                movies={topRatedMovies.slice(0, 6)}
                onAddToList={handleAddToList}
                watchlist={watchlist}
              />
            </div>
            <MovieRow
              title="Top Rated TV Shows"
              tvShows={topRatedTVShows.slice(0, 6)}
              onAddToList={handleAddToList}
              watchlist={watchlist}
            />
            <MovieRow
              title="Trending TV Shows"
              tvShows={trendingTVShows.slice(0, 6)}
              onAddToList={handleAddToList}
              watchlist={watchlist}
            />
            <MovieRow
              title="Airing Today"
              tvShows={airingTodayTVShows.slice(0, 6)}
              onAddToList={handleAddToList}
              watchlist={watchlist}
            />
            <MovieRow
              title="Coming Soon"
              movies={upcomingMovies.slice(0, 6)}
              onAddToList={handleAddToList}
              watchlist={watchlist}
            />
          </>
        )}

        {category && (
          <MovieRow
            title={`${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')} Movies`}
            movies={getMoviesByCategory()}
            onAddToList={handleAddToList}
            watchlist={watchlist}
          />
        )}
      </motion.div>
    </HomeContainer>
  );
};

export default Home;
