import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlay, FaPlus, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { MovieDetail as MovieDetailType, Movie } from '../types';
import { movieApi, getBackdropUrl, getPosterUrl } from '../services/api';
import MovieRow from '../components/MovieRow';

const DetailContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
`;

const BackdropSection = styled.div<{ imageUrl: string }>`
  position: relative;
  height: 70vh;
  min-height: 500px;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.9) 100%
  ),
  url(${({ imageUrl }) => imageUrl}) center/cover no-repeat;
  display: flex;
  align-items: flex-end;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  color: #fff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  transition: color 0.3s ease;
  z-index: 1001;

  &:hover {
    color: #e50914;
  }
`;

const MovieInfo = styled.div`
  padding: 0 4% 4rem;
  display: flex;
  gap: 2rem;
  align-items: flex-end;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Poster = styled.img`
  width: 300px;
  height: 450px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    width: 200px;
    height: 300px;
  }
`;

const InfoContent = styled.div`
  flex: 1;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #b3b3b3;
  flex-wrap: wrap;
`;

const Rating = styled.span`
  color: #46d369;
  font-weight: 600;
`;

const Year = styled.span``;

const Runtime = styled.span``;

const Genres = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const Genre = styled.span`
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const Tagline = styled.p`
  font-style: italic;
  color: #b3b3b3;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const Overview = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #e5e5e5;
  max-width: 600px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  outline: none;

  &.play {
    background: #fff;
    color: #000;

    &:hover {
      background: rgba(255, 255, 255, 0.8);
    }
  }

  &.add {
    background: rgba(109, 109, 110, 0.7);
    color: #fff;

    &:hover {
      background: rgba(109, 109, 110, 0.4);
    }
  }
`;

const ContentSection = styled.div`
  padding: 4rem 4% 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 2rem;
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

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetailType | null>(null);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const movieData = await movieApi.getMovieDetail(id);
        setMovie(movieData);

        // For demo purposes, we'll use trending movies as related movies
        // In a real app, you'd fetch actual related movies
        const trending = await movieApi.getTrending();
        setRelatedMovies(trending.slice(0, 6));
      } catch (err) {
        setError('Failed to load movie details. Please try again later.');
        console.error('Error fetching movie detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  const handleAddToList = () => {
    setIsInWatchlist(!isInWatchlist);
  };

  if (loading) {
    return (
      <DetailContainer>
        <LoadingContainer>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            Loading...
          </motion.div>
        </LoadingContainer>
      </DetailContainer>
    );
  }

  if (error || !movie) {
    return (
      <DetailContainer>
        <ErrorContainer>
          <div>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
          </div>
        </ErrorContainer>
      </DetailContainer>
    );
  }

  const year = new Date(movie.release_date).getFullYear();
  const rating = movie.vote_average.toFixed(1);
  const runtime = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;

  return (
    <DetailContainer>
      <BackdropSection imageUrl={getBackdropUrl(movie.backdrop_path)}>
        <BackButton to="/">
          <FaArrowLeft size={16} />
          Back
        </BackButton>

        <MovieInfo>
          <Poster src={getPosterUrl(movie.poster_path)} alt={movie.title} />
          
          <InfoContent>
            <Title>{movie.title}</Title>
            
            <MetaInfo>
              <Rating>★ {rating}</Rating>
              <Year>• {year}</Year>
              <Runtime>• {runtime}</Runtime>
            </MetaInfo>

            <Genres>
              {movie.genres.map(genre => (
                <Genre key={genre.id}>{genre.name}</Genre>
              ))}
            </Genres>

            {movie.tagline && <Tagline>"{movie.tagline}"</Tagline>}

            <Overview>{movie.overview}</Overview>

            <ButtonGroup>
              <Button to={`/watch/${movie.id}`} className="play">
                <FaPlay size={16} />
                Play
              </Button>
              <Button to="#" className="add" onClick={handleAddToList}>
                {isInWatchlist ? <FaCheck size={16} /> : <FaPlus size={16} />}
                {isInWatchlist ? 'Added to List' : 'Add to List'}
              </Button>
            </ButtonGroup>
          </InfoContent>
        </MovieInfo>
      </BackdropSection>

      <ContentSection>
        <SectionTitle>More Like This</SectionTitle>
        <MovieRow
          title=""
          movies={relatedMovies}
          watchlist={isInWatchlist ? [movie.id] : []}
        />
      </ContentSection>
    </DetailContainer>
  );
};

export default MovieDetail;
