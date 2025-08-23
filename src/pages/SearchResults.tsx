import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { searchApi } from '../services/api';
import { MediaItem, isMovie, isTVShow } from '../types';
import MovieCard from '../components/MovieCard';

const Container = styled.div`
  padding-top: 80px;
  min-height: 100vh;
  background: #000;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  padding: 0 4%;
`;

const Message = styled.div`
  text-align: center;
  margin-top: 3rem;
  color: #b3b3b3;
`;

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setResults([]);
    movieApi
      .searchMovies(query)
      .then((data) => setResults(data.results))
      .catch(() => setError('Failed to fetch search results.'))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <Container>
      <Title>Search Results for "{query}"</Title>
      {loading && <Message>Loading...</Message>}
      {error && <Message>{error}</Message>}
      {!loading && !error && results.length === 0 && (
        <Message>No results found.</Message>
      )}
      <ResultsGrid as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </ResultsGrid>
    </Container>
  );
};

export default SearchResults;
