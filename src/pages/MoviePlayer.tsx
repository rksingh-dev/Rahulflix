import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { MovieDetail } from '../types';
import { movieApi, getMovieStreamUrl } from '../services/api';

const PlayerContainer = styled.div`
  min-height: 100vh;
  background: #000;
  position: relative;
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
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 4px;

  &:hover {
    color: #e50914;
  }
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VideoFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  background: #000;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #fff;
  gap: 2rem;
`;

const LoadingSpinner = styled(motion.div)`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #e50914;
  border-radius: 50%;
`;

const LoadingText = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #e50914;
  text-align: center;
  padding: 0 2rem;
  gap: 1rem;
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: #fff;
  margin: 0;
`;

const RetryButton = styled.button`
  background: #e50914;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #b2070f;
  }
`;

const MovieInfo = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  color: #fff;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 8px;
  max-width: 400px;
`;

const MovieTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const MovieMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #b3b3b3;
  margin-bottom: 0.5rem;
`;

const Rating = styled.span`
  color: #46d369;
  font-weight: 600;
`;

const MovieOverview = styled.p`
  font-size: 0.9rem;
  line-height: 1.4;
  color: #e5e5e5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MoviePlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');

  useEffect(() => {
    const fetchMovieAndStream = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch movie details
        const movieData = await movieApi.getMovieDetail(id);
        setMovie(movieData);

        // Generate stream URL using 111movies API
        const streamUrl = getMovieStreamUrl(id);
        setStreamUrl(streamUrl);

        setLoading(false);
      } catch (err) {
        setError('Failed to load movie. Please try again later.');
        console.error('Error fetching movie:', err);
        setLoading(false);
      }
    };

    fetchMovieAndStream();
  }, [id]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <PlayerContainer>
        <BackButton to="/">
          <FaArrowLeft size={16} />
          Back to Browse
        </BackButton>
        
        <LoadingContainer>
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <LoadingText>Loading your movie...</LoadingText>
        </LoadingContainer>
      </PlayerContainer>
    );
  }

  if (error || !movie) {
    return (
      <PlayerContainer>
        <BackButton to="/">
          <FaArrowLeft size={16} />
          Back to Browse
        </BackButton>
        
        <ErrorContainer>
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>{error || 'Movie not found'}</ErrorMessage>
          <RetryButton onClick={handleRetry}>Try Again</RetryButton>
        </ErrorContainer>
      </PlayerContainer>
    );
  }

  const year = new Date(movie.release_date).getFullYear();
  const rating = movie.vote_average.toFixed(1);

  return (
    <PlayerContainer>
      <BackButton to="/">
        <FaArrowLeft size={16} />
        Back to Browse
      </BackButton>

      <VideoContainer>
        <VideoFrame
          src={streamUrl}
          title={movie.title}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </VideoContainer>
    </PlayerContainer>
  );
};

export default MoviePlayer;
