import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Movie, TVShow, MediaItem } from '../types';
import MovieCard from './MovieCard';

const RowContainer = styled.div`
  margin: 2rem 0;
  padding: 0 4%;
`;

const RowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const RowTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.8;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    border-color: rgba(255, 255, 255, 0.6);
    opacity: 1;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const MoviesContainer = styled.div`
  position: relative;
  overflow: hidden;
`;

const MoviesWrapper = styled(motion.div)`
  display: flex;
  gap: 0.5rem;
  transition: transform 0.3s ease;
`;

const MovieCardWrapper = styled.div`
  flex: 0 0 auto;
  width: calc(16.666% - 0.42rem);
  min-width: 150px;

  @media (max-width: 1400px) {
    width: calc(20% - 0.4rem);
  }

  @media (max-width: 1100px) {
    width: calc(25% - 0.375rem);
  }

  @media (max-width: 900px) {
    width: calc(33.333% - 0.33rem);
  }

  @media (max-width: 600px) {
    width: calc(50% - 0.25rem);
  }

  @media (max-width: 400px) {
    width: calc(100% - 0.5rem);
  }
`;

interface MovieRowProps {
  title: string;
  movies?: Movie[];
  tvShows?: TVShow[];
  mediaItems?: MediaItem[];
  onAddToList?: (item: MediaItem) => void;
  watchlist?: string[];
}

const MovieRow: React.FC<MovieRowProps> = ({
  title,
  movies,
  tvShows,
  mediaItems,
  onAddToList,
  watchlist = []
}) => {
  // React hooks must be called before any conditional logic
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Determine which items to display
  const items = React.useMemo(() => mediaItems || movies || tvShows || [], [mediaItems, movies, tvShows]);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      const newScrollLeft = scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [items]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <RowContainer>
      <RowHeader>
        <RowTitle>{title}</RowTitle>
        <NavigationButtons>
          <NavButton
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
          >
            <FaChevronLeft size={16} />
          </NavButton>
          <NavButton
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
          >
            <FaChevronRight size={16} />
          </NavButton>
        </NavigationButtons>
      </RowHeader>

      <MoviesContainer>
        <MoviesWrapper
          ref={scrollContainerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {items.map((item) => (
            <MovieCardWrapper key={item.id}>
              <MovieCard
                media={item}
                onAddToList={onAddToList}
                isInList={watchlist.includes(item.id)}
              />
            </MovieCardWrapper>
          ))}
        </MoviesWrapper>
      </MoviesContainer>
    </RowContainer>
  );
};

export default MovieRow;
