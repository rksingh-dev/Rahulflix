import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlay, FaTv, FaFilm } from 'react-icons/fa';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SearchContainer = styled(motion.div)`
  text-align: center;
  max-width: 600px;
  width: 100%;
`;

const Title = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 700;
  color: #e50914;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.3rem;
  color: #fff;
  margin-bottom: 3rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const SearchForm = styled(motion.form)`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid #333;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &::placeholder {
    color: #b3b3b3;
  }

  &:focus {
    outline: none;
    border-color: #e50914;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const TypeButtons = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const TypeButton = styled.button<{ active: boolean }>`
  padding: 1rem 1.5rem;
  border: 2px solid ${({ active }) => active ? '#e50914' : '#333'};
  border-radius: 8px;
  background: ${({ active }) => active ? '#e50914' : 'rgba(255, 255, 255, 0.1)'};
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    border-color: #e50914;
    background: ${({ active }) => active ? '#b2070f' : 'rgba(229, 9, 20, 0.2)'};
  }
`;

const WatchButton = styled(motion.button)`
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  background: #e50914;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 auto;

  &:hover {
    background: #b2070f;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Instructions = styled(motion.div)`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const InstructionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #e50914;
  margin-bottom: 1rem;
`;

const InstructionText = styled.p`
  color: #b3b3b3;
  line-height: 1.6;
  margin: 0.5rem 0;
`;

const Example = styled.span`
  color: #46d369;
  font-weight: 600;
`;

const Home: React.FC = () => {
  const [imdbId, setImdbId] = useState('');
  const [contentType, setContentType] = useState<'movie' | 'tv'>('movie');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imdbId.trim()) return;

    // Clean the IMDB ID (remove any extra characters)
    const cleanId = imdbId.trim().replace(/^tt/, ''); // Remove 'tt' prefix if present
    
    if (contentType === 'movie') {
      navigate(`/watch/${cleanId}`);
    } else {
      // For TV shows, default to Season 1, Episode 1
      navigate(`/tv/${cleanId}/watch/1/1`);
    }
  };

  return (
    <HomeContainer>
      <SearchContainer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Rahulflix
        </Title>

        <Subtitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Enter the IMDB ID of the movie or TV show you want to watch
        </Subtitle>

        <SearchForm
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <SearchInput
            type="text"
            value={imdbId}
            onChange={(e) => setImdbId(e.target.value)}
            placeholder="Enter IMDB ID (e.g., tt0111161 or just 0111161)"
            required
          />
          
          <TypeButtons>
            <TypeButton
              type="button"
              active={contentType === 'movie'}
              onClick={() => setContentType('movie')}
            >
              <FaFilm size={16} />
              Movie
            </TypeButton>
            <TypeButton
              type="button"
              active={contentType === 'tv'}
              onClick={() => setContentType('tv')}
            >
              <FaTv size={16} />
              TV Show
            </TypeButton>
          </TypeButtons>
        </SearchForm>

        <WatchButton
          type="submit"
          onClick={handleSubmit}
          disabled={!imdbId.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaPlay size={16} />
          Watch Now
        </WatchButton>

        <Instructions
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <InstructionTitle>How to use:</InstructionTitle>
          <InstructionText>
            1. Find the movie or TV show on IMDB (imdb.com)
          </InstructionText>
          <InstructionText>
            2. Copy the IMDB ID from the URL - Example: <Example>tt0111161</Example> (The Shawshank Redemption)
          </InstructionText>
          <InstructionText>
            3. Paste it above, select Movie or TV Show, and click Watch Now!
          </InstructionText>
          <InstructionText>
            Note: You can enter with or without the "tt" prefix
          </InstructionText>
        </Instructions>
      </SearchContainer>
    </HomeContainer>
  );
};

export default Home;
