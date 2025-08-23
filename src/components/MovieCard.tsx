import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlay, FaPlus, FaCheck, FaTv, FaFilm } from 'react-icons/fa';
import { Movie, TVShow, MediaItem, isMovie, isTVShow } from '../types';
import { getPosterUrl } from '../services/api';

const CardContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  background: #333;
`;

const PosterImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const HoverOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.9) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;

  &:hover {
    background: #fff;
    color: #000;
  }
`;

const BottomSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h3`
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #b3b3b3;
`;

const Rating = styled.span`
  color: #46d369;
  font-weight: 600;
`;

const PlayButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 16px;
  background: #fff;
  color: #000;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.8);
  }
`;


interface MovieCardProps {
  movie?: Movie;
  tvShow?: TVShow;
  media?: MediaItem;
  onAddToList?: (item: MediaItem) => void;
  isInList?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  tvShow,
  media,
  onAddToList,
  isInList = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine the media item to work with
  const mediaItem = media || movie || tvShow;
  if (!mediaItem) return null;

  const isMovieItem = isMovie(mediaItem);
  const isTVItem = isTVShow(mediaItem);

  const title = isMovieItem ? mediaItem.title : mediaItem.name;
  const releaseDate = isMovieItem ? mediaItem.release_date : mediaItem.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const rating = mediaItem.vote_average.toFixed(1);
  const posterPath = mediaItem.poster_path;

  const handleAddToList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToList) {
      onAddToList(mediaItem);
    }
  };

  return (
    <CardContainer
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <PosterImage
        src={getPosterUrl(posterPath)}
        alt={title}
        loading="lazy"
      />

      <HoverOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <TopSection>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <ActionButton style={{ background: isMovieItem ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 100, 255, 0.3)' }}>
              {isMovieItem ? <FaFilm size={10} /> : <FaTv size={10} />}
            </ActionButton>
            <ActionButton onClick={handleAddToList}>
              {isInList ? <FaCheck size={12} /> : <FaPlus size={12} />}
            </ActionButton>
          </div>
        </TopSection>

        <BottomSection>
          <Title>{title}</Title>

          <MetaInfo>
            <Rating>★ {rating}</Rating>
            <span>•</span>
            <span>{year}</span>
            <span>•</span>
            <span>{isMovieItem ? 'Movie' : 'TV Show'}</span>
          </MetaInfo>

          <PlayButton to={isMovieItem ? `/watch/${mediaItem.id}` : `/tv/${mediaItem.id}`}>
            <FaPlay size={12} />
            {isMovieItem ? 'Play' : 'Watch'}
          </PlayButton>
        </BottomSection>
      </HoverOverlay>
    </CardContainer>
  );
};

export default MovieCard;
