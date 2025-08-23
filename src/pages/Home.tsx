import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import { Movie } from '../types';
import { movieApi } from '../services/api';

const HomeContainer = styled.div`
  padding-top: 68px;
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
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const category = searchParams.get('category');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        const [trending, popular, topRated, upcoming] = await Promise.all([
          movieApi.getTrending(),
          movieApi.getPopular(),
          movieApi.getTopRated(),
          movieApi.getUpcoming(),
        ]);

        setTrendingMovies(trending);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setUpcomingMovies(upcoming);
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        console.error('Error fetching movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleAddToList = (movie: Movie) => {
    setWatchlist(prev => {
      if (prev.includes(movie.id)) {
        return prev.filter(id => id !== movie.id);
      } else {
        return [...prev, movie.id];
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
            <div id="popular">
              <MovieRow
                title="Popular on RahulGram"
                movies={popularMovies.slice(0, 6)}
                onAddToList={handleAddToList}
                watchlist={watchlist}
              />
            </div>
            <div id="top-rated">
              <MovieRow
                title="Top Rated"
                movies={topRatedMovies.slice(0, 6)}
                onAddToList={handleAddToList}
                watchlist={watchlist}
              />
            </div>
            <div id="upcoming">
              <MovieRow
                title="Coming Soon"
                movies={upcomingMovies.slice(0, 6)}
                onAddToList={handleAddToList}
                watchlist={watchlist}
              />
            </div>
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
