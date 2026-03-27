import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaTv } from 'react-icons/fa';
import { getStreamUrl, ServerType } from '../services/api';
import { injectAdBlocker } from '../utils/adBlocker';

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

const EpisodeControls = styled.div`
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  gap: 0.5rem;
  z-index: 1000;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

const EpisodeButton = styled.button`
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EpisodeInfo = styled.div`
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

const ShowTitle = styled.h1`
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EpisodeTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const EpisodeMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #b3b3b3;
  margin-bottom: 0.5rem;
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
  display: block;
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

const TVPlayer: React.FC = () => {
  const { id, season, episode } = useParams<{
    id: string;
    season: string;
    episode: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();
  const server = (location.state as { server: ServerType })?.server || 'rivestream';
  const videoFrameRef = useRef<HTMLIFrameElement>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');

  const seasonNum = parseInt(season || '1');
  const episodeNum = parseInt(episode || '1');

  // Ad blocker injection
  useEffect(() => {
    if (videoFrameRef.current && streamUrl) {
      const timer = setTimeout(() => {
        if (videoFrameRef.current) {
          injectAdBlocker(videoFrameRef.current);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [streamUrl]);

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

        // Generate stream URL using selected server
        const streamUrl = getStreamUrl(id, 'tv', seasonNum, episodeNum, server);
        setStreamUrl(streamUrl);

        setLoading(false);
      } catch (err) {
        setError('Failed to load episode. Please check the IMDB ID and try again.');
        console.error('Error generating stream URL:', err);
        setLoading(false);
      }
    };

    loadStream();
  }, [id, season, episode, seasonNum, episodeNum, server]);

  const handlePreviousEpisode = () => {
    if (episodeNum > 1) {
      navigate(`/tv/${id}/watch/${seasonNum}/${episodeNum - 1}`, { state: { server } });
    } else if (seasonNum > 1) {
      // Go to last episode of previous season (assuming 20 episodes max per season)
      navigate(`/tv/${id}/watch/${seasonNum - 1}/20`, { state: { server } });
    }
  };

  const handleNextEpisode = () => {
    // Go to next episode (assuming unlimited episodes for simplicity)
    navigate(`/tv/${id}/watch/${seasonNum}/${episodeNum + 1}`, { state: { server } });
  };

  const canGoPrevious = () => {
    return episodeNum > 1 || seasonNum > 1;
  };

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
          <LoadingText>Loading episode...</LoadingText>
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

      <EpisodeControls>
        <EpisodeButton
          onClick={handlePreviousEpisode}
          disabled={!canGoPrevious()}
        >
          <FaChevronLeft size={14} />
          Previous
        </EpisodeButton>
        <EpisodeButton
          onClick={handleNextEpisode}
        >
          Next
          <FaChevronRight size={14} />
        </EpisodeButton>
      </EpisodeControls>

      <VideoContainer>
        {server === 'rivestream' ? (
          <VideoFrame
            ref={videoFrameRef}
            src={streamUrl}
            title={`TV Show: ${formattedId} - S${seasonNum}E${episodeNum}`}
            allowFullScreen
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => {
              if (videoFrameRef.current) {
                injectAdBlocker(videoFrameRef.current);
              }
            }}
          />
        ) : (
          <VideoFrame
            ref={videoFrameRef}
            src={streamUrl}
            title={`TV Show: ${formattedId} - S${seasonNum}E${episodeNum}`}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => {
              if (videoFrameRef.current) {
                injectAdBlocker(videoFrameRef.current);
              }
            }}
          />
        )}
      </VideoContainer>

      <EpisodeInfo>
        <ShowTitle>
          <FaTv size={16} />
          TV Show Player
        </ShowTitle>
        <EpisodeTitle>
          S{seasonNum}E{episodeNum}
        </EpisodeTitle>

        <EpisodeMeta>
          <span>IMDB ID: {formattedId}</span>
        </EpisodeMeta>
      </EpisodeInfo>
    </PlayerContainer>
  );
};

export default TVPlayer;
