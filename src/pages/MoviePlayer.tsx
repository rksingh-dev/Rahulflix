import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { getMovieStreamUrl } from '../services/api';

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
`;

const MovieTitle = styled.h1`
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
`;

const MovieId = styled.p`
  font-size: 0.9rem;
  color: #b3b3b3;
  margin: 0.25rem 0 0 0;
`;

const MoviePlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');

  useEffect(() => {
    const loadStream = () => {
      if (!id) {
        setError('No IMDB ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Generate stream URL using 111movies API with IMDB ID
        const streamUrl = getMovieStreamUrl(id);
        setStreamUrl(streamUrl);

        setLoading(false);
      } catch (err) {
        setError('Failed to load movie. Please check the IMDB ID and try again.');
        console.error('Error generating stream URL:', err);
        setLoading(false);
      }
    };

    loadStream();
  }, [id]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <PlayerContainer>
        <BackButton to="/">
          <FaArrowLeft size={16} />
          Back to Search
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

  if (error) {
    return (
      <PlayerContainer>
        <BackButton to="/">
          <FaArrowLeft size={16} />
          Back to Search
        </BackButton>
        
        <ErrorContainer>
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={handleRetry}>Try Again</RetryButton>
        </ErrorContainer>
      </PlayerContainer>
    );
  }

  const formattedId = id?.startsWith('tt') ? id : `tt${id}`;

  return (
    <PlayerContainer>
      <BackButton to="/">
        <FaArrowLeft size={16} />
        Back to Search
      </BackButton>

      <VideoContainer>
        <VideoFrame
          src={streamUrl}
          title={`Movie: ${formattedId}`}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </VideoContainer>

      <MovieInfo>
        <MovieTitle>Movie Player</MovieTitle>
        <MovieId>IMDB ID: {formattedId}</MovieId>
      </MovieInfo>
    </PlayerContainer>
  );
};

export default MoviePlayer;
