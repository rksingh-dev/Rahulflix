import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaTv, FaFilm, FaSearch } from 'react-icons/fa';

const HomeContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: radial-gradient(circle at 50% 10%, #2a0b0d 0%, #050505 60%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  /* Abstract background shapes */
  &::before {
    content: '';
    position: absolute;
    top: -10%;
    left: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(229, 9, 20, 0.15) 0%, transparent 70%);
    filter: blur(80px);
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -10%;
    right: -10%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(229, 9, 20, 0.1) 0%, transparent 70%);
    filter: blur(80px);
    z-index: 0;
  }
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 800px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Badge = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #ccc;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  span {
    color: #e50914;
    font-weight: 700;
  }
`;

const Title = styled(motion.h1)`
  font-size: 4.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1rem;
  text-align: center;
  line-height: 1.1;
  letter-spacing: -2px;

  span {
    background: linear-gradient(to right, #e50914, #ff4b55);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #999;
  margin-bottom: 3rem;
  text-align: center;
  max-width: 500px;
  line-height: 1.6;
`;

const GlassCard = styled(motion.div)`
  width: 100%;
  background: rgba(22, 22, 22, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 6px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 18px;
  padding: 0.5rem 0.5rem 0.5rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: border-color 0.3s ease;

  &:focus-within {
    border-color: rgba(229, 9, 20, 0.5);
  }
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
  outline: none;
  width: 100%;
  font-family: 'Outfit', sans-serif;

  &::placeholder {
    color: #666;
  }
`;

const SearchButton = styled(motion.button)`
  background: #e50914;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);

  &:hover {
    background: #ff0a16;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(229, 9, 20, 0.4);
  }

  &:disabled {
    background: #333;
    color: #666;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const TypeSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const TypeButton = styled.button<{ active: boolean }>`
  position: relative;
  padding: 0.75rem 1.5rem;
  background: ${({ active }) => active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  border: 1px solid ${({ active }) => active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 12px;
  color: ${({ active }) => active ? '#fff' : '#888'};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 2rem;
`;

const Modal = styled(motion.div)`
  background: #181818;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #e50914, #ff4b55);
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #fff;
`;

const ServerOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ServerOption = styled(motion.button)`
  width: 100%;
  padding: 1.25rem;
  background: #222;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const Home: React.FC = () => {
  const [imdbId, setImdbId] = useState('');
  const [contentType, setContentType] = useState<'movie' | 'tv'>('movie');
  const [showServerSelection, setShowServerSelection] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imdbId.trim()) return;
    setShowServerSelection(true);
  };

  const handleServerSelect = (server: '111movies' | 'rivestream') => {
    const cleanId = imdbId.trim().replace(/^tt/, '');

    if (contentType === 'movie') {
      navigate(`/watch/${cleanId}`, { state: { server } });
    } else {
      navigate(`/tv/${cleanId}/watch/1/1`, { state: { server } });
    }
  };

  return (
    <HomeContainer>
      <ContentWrapper
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Badge
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
           Use Ad-Blocker or Brave Browser
        </Badge>

        <Title>
          Unlimited movies,<br />
          <span>TV shows, and more.</span>
        </Title>

        <Subtitle>
          Paste any IMDB ID to start streaming instantly.
          <br />No sign-up required. Completely free.
        </Subtitle>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <GlassCard>
            <InputGroup>
              <FaSearch color="#666" size={18} />
              <Input
                type="text"
                value={imdbId}
                onChange={(e) => setImdbId(e.target.value)}
                placeholder={contentType === 'movie' ? "Paste Movie IMDB ID (e.g. tt0111161)" : "Paste TV Show IMDB ID (e.g. tt0903747)"}
                autoFocus
              />
              <SearchButton
                type="submit"
                disabled={!imdbId.trim()}
                whileTap={{ scale: 0.95 }}
              >
                Watch Now <FaPlay size={12} />
              </SearchButton>
            </InputGroup>
          </GlassCard>

          <TypeSelector>
            <TypeButton
              type="button"
              active={contentType === 'movie'}
              onClick={() => setContentType('movie')}
            >
              <FaFilm className={contentType === 'movie' ? 'text-red-500' : ''} />
              Movies
            </TypeButton>
            <TypeButton
              type="button"
              active={contentType === 'tv'}
              onClick={() => setContentType('tv')}
            >
              <FaTv />
              TV Shows
            </TypeButton>
          </TypeSelector>
        </form>
      </ContentWrapper>

      <AnimatePresence>
        {showServerSelection && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowServerSelection(false)}
          >
            <Modal
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>Select Server</ModalTitle>
              <ServerOptions>
                <ServerOption
                  onClick={() => handleServerSelect('111movies')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPlay color="#e50914" /> Server 1
                </ServerOption>
                <ServerOption
                  onClick={() => handleServerSelect('rivestream')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPlay color="#e50914" /> Server 2
                </ServerOption>
              </ServerOptions>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </HomeContainer>
  );
};

export default Home;
