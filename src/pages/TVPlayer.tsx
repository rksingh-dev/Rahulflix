import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaTv } from 'react-icons/fa';
import { TVShowDetail, Episode } from '../types';
import { tvApi, getTVShowStreamUrl } from '../services/api';

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

const Rating = styled.span`
  color: #46d369;
  font-weight: 600;
`;

const EpisodeOverview = styled.p`
  font-size: 0.9rem;
  line-height: 1.4;
  color: #e5e5e5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

const TVPlayer: React.FC = () => {
  const { id, season, episode } = useParams<{ 
    id: string; 
    season: string; 
    episode: string; 
  }>();
  const navigate = useNavigate();
  const [tvShow, setTVShow] = useState<TVShowDetail | null>(null);
  const [episodeDetail, setEpisodeDetail] = useState<Episode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [showEpisodeInfo, setShowEpisodeInfo] = useState(true);

  const seasonNum = parseInt(season || '1');
  const episodeNum = parseInt(episode || '1');

  useEffect(() => {
    const fetchTVShowAndEpisode = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch TV show details
        const tvShowData = await tvApi.getTVShowDetail(id);
        setTVShow(tvShowData);

        // Try to fetch episode details (optional, might not be available)
        try {
          const episodeData = await tvApi.getEpisodeDetail(id, seasonNum, episodeNum);
          setEpisodeDetail(episodeData);
        } catch (episodeErr) {
          console.warn('Episode details not available:', episodeErr);
          // Create a basic episode object
          setEpisodeDetail({
            id: episodeNum,
            name: `Episode ${episodeNum}`,
            overview: '',
            still_path: '',
            episode_number: episodeNum,
            season_number: seasonNum,
            air_date: '',
            vote_average: 0,
            vote_count: 0,
            runtime: 0
          });
        }

        // Generate stream URL using 111movies API
        const streamUrl = getTVShowStreamUrl(id, seasonNum, episodeNum);
        setStreamUrl(streamUrl);

        setLoading(false);
      } catch (err) {
        setError('Failed to load episode. Please try again later.');
        console.error('Error fetching TV show/episode:', err);
        setLoading(false);
      }
    };

    fetchTVShowAndEpisode();
  }, [id, season, episode, seasonNum, episodeNum]);

  // Auto-hide episode info after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEpisodeInfo(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [id, seasonNum, episodeNum]); // Reset timer when episode changes

  const handlePreviousEpisode = () => {
    if (episodeNum > 1) {
      navigate(`/tv/${id}/watch/${seasonNum}/${episodeNum - 1}`);
    } else if (seasonNum > 1) {
      // Go to last episode of previous season
      const prevSeason = tvShow?.seasons.find(s => s.season_number === seasonNum - 1);
      if (prevSeason) {
        navigate(`/tv/${id}/watch/${seasonNum - 1}/${prevSeason.episode_count}`);
      }
    }
  };

  const handleNextEpisode = () => {
    const currentSeason = tvShow?.seasons.find(s => s.season_number === seasonNum);
    if (currentSeason && episodeNum < currentSeason.episode_count) {
      navigate(`/tv/${id}/watch/${seasonNum}/${episodeNum + 1}`);
    } else {
      // Go to first episode of next season
      const nextSeason = tvShow?.seasons.find(s => s.season_number === seasonNum + 1);
      if (nextSeason) {
        navigate(`/tv/${id}/watch/${seasonNum + 1}/1`);
      }
    }
  };

  const canGoPrevious = () => {
    return episodeNum > 1 || (seasonNum > 1 && tvShow?.seasons.some(s => s.season_number === seasonNum - 1));
  };

  const canGoNext = () => {
    const currentSeason = tvShow?.seasons.find(s => s.season_number === seasonNum);
    return (currentSeason && episodeNum < currentSeason.episode_count) || 
           tvShow?.seasons.some(s => s.season_number === seasonNum + 1);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <PlayerContainer>
        <BackButton to={`/tv/${id}`}>
          <FaArrowLeft size={16} />
          Back to Show
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

  if (error || !tvShow || !episodeDetail) {
    return (
      <PlayerContainer>
        <BackButton to={`/tv/${id}`}>
          <FaArrowLeft size={16} />
          Back to Show
        </BackButton>
        
        <ErrorContainer>
          <ErrorTitle>Oops! Something went wrong</ErrorTitle>
          <ErrorMessage>{error || 'Episode not found'}</ErrorMessage>
          <RetryButton onClick={handleRetry}>Try Again</RetryButton>
        </ErrorContainer>
      </PlayerContainer>
    );
  }

  const rating = episodeDetail.vote_average > 0 ? episodeDetail.vote_average.toFixed(1) : 'N/A';

  return (
    <PlayerContainer>
      <BackButton to={`/tv/${id}`}>
        <FaArrowLeft size={16} />
        Back to Show
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
          disabled={!canGoNext()}
        >
          Next
          <FaChevronRight size={14} />
        </EpisodeButton>
      </EpisodeControls>

      <VideoContainer>
        <VideoFrame
          src={streamUrl}
          title={`${tvShow.name} - S${seasonNum}E${episodeNum}`}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </VideoContainer>

      {showEpisodeInfo && (
        <EpisodeInfo>
          <ShowTitle>
            <FaTv size={16} />
            {tvShow.name}
          </ShowTitle>
          <EpisodeTitle>
            S{seasonNum}E{episodeNum}: {episodeDetail.name}
          </EpisodeTitle>

          <EpisodeMeta>
            <Rating>★ {rating}</Rating>
            {episodeDetail.air_date && (
              <>
                <span>•</span>
                <span>{new Date(episodeDetail.air_date).getFullYear()}</span>
              </>
            )}
            {episodeDetail.runtime > 0 && (
              <>
                <span>•</span>
                <span>{episodeDetail.runtime}min</span>
              </>
            )}
          </EpisodeMeta>

          {episodeDetail.overview && (
            <EpisodeOverview>{episodeDetail.overview}</EpisodeOverview>
          )}
        </EpisodeInfo>
      )}
    </PlayerContainer>
  );
};

export default TVPlayer;
