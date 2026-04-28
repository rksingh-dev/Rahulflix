import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaSearch, FaPlay, FaTv, FaFilm } from 'react-icons/fa';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, ServerType, getStreamUrl } from '../services/api';

const Nav = styled(motion.nav).withConfig({
  shouldForwardProp: (prop: PropertyKey) => prop !== 'scrolled',
})<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  padding: 0 4%;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  background: ${({ scrolled }) =>
    scrolled ? 'rgba(0, 0, 0, 0.95)' : 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)'};
  backdrop-filter: ${({ scrolled }) => (scrolled ? 'blur(10px)' : 'none')};
  border-bottom: ${({ scrolled }) => (scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none')};
`;

const Logo = styled(Link)`
  color: #e50914;
  font-size: 1.8rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
  min-width: 140px;

  &:hover {
    color: #b2070f;
  }
`;

const NavCenter = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  padding-right: 2rem;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
  transition: all 0.3s ease;
  width: 250px;
  margin-left: auto;

  &:focus-within {
    width: 350px;
    border-color: #fff;
    background: #000;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  outline: none;
  font-size: 0.95rem;
  padding: 0 0.75rem;
  font-family: 'Inter', sans-serif;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const SearchIcon = styled.div`
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ResultsDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(25, 25, 25, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-top: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
  backdrop-filter: blur(10px);
  z-index: 1000;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const ResultItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    background: rgba(229, 9, 20, 0.2);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ResultPoster = styled.img`
  width: 40px;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 1rem;
  background: #333;
`;

const ResultInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ResultTitle = styled.h4`
  margin: 0;
  font-size: 0.95rem;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ResultMeta = styled.p`
  margin: 0.25rem 0 0 0;
  font-size: 0.8rem;
  color: #999;
`;

const NoResults = styled.div`
  padding: 1rem;
  text-align: center;
  color: #999;
  font-size: 0.9rem;
`;

const UserAvatar = styled.a`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: #fff;
  text-decoration: none;

  &:hover {
    background: #555;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10020;
`;

const Modal = styled(motion.div)`
  background: #181818;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  width: 100%;
  max-width: 380px;
  padding: 1.5rem;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: #fff;
  font-size: 1.2rem;
`;

const ModalSubText = styled.p`
  margin: 0.5rem 0 1rem 0;
  color: #b3b3b3;
  font-size: 0.9rem;
`;

const ServerOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ServerOption = styled(motion.button)`
  width: 100%;
  padding: 0.9rem 1rem;
  background: #232323;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;

  &:hover {
    background: #2d2d2d;
  }
`;

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showServerSelection, setShowServerSelection] = useState(false);
  const [pendingResult, setPendingResult] = useState<SearchResult | null>(null);
  const [pendingImdbId, setPendingImdbId] = useState<string | null>(null);
  const [isLoadingServerOptions, setIsLoadingServerOptions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
        );
        const data = await response.json();
        const filtered = data.results
          .filter(
            (item: any) =>
              (item.media_type === 'movie' || item.media_type === 'tv') &&
              item.poster_path
          )
          .slice(0, 8);
        setSearchResults(filtered);
        setShowResults(true);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleResultClick = async (result: SearchResult) => {
    try {
      setIsLoadingServerOptions(true);
      const response = await fetch(
        `${TMDB_BASE_URL}/${result.media_type}/${result.id}/external_ids?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      const imdbId = data.imdb_id;

      if (!imdbId) {
        alert('Stream not found for this content.');
        return;
      }

      setPendingImdbId(imdbId.replace(/^tt/, ''));
      setPendingResult(result);
      setShowServerSelection(true);
      setShowResults(false);
    } catch (err) {
      console.error(err);
      alert('Error loading stream.');
    } finally {
      setIsLoadingServerOptions(false);
    }
  };

  const handleServerSelect = (server: ServerType) => {
    if (!pendingResult || !pendingImdbId) return;

    const streamUrl =
      pendingResult.media_type === 'movie'
        ? getStreamUrl(pendingImdbId, 'movie', undefined, undefined, server)
        : getStreamUrl(pendingImdbId, 'tv', 1, 1, server);

    if (server === 'rivestream') {
      window.open(streamUrl, '_blank', 'noopener,noreferrer');
    } else {
      if (pendingResult.media_type === 'movie') {
        navigate(`/watch/${pendingImdbId}`, { state: { server } });
      } else {
        navigate(`/tv/${pendingImdbId}/watch/1/1`, { state: { server } });
      }
    }

    setSearchQuery('');
    setSearchResults([]);
    setPendingResult(null);
    setPendingImdbId(null);
    setShowServerSelection(false);
  };

  return (
    <Nav
      scrolled={scrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Logo to="/">RahulFlix</Logo>

      <NavCenter>
        <SearchContainer>
          <SearchWrapper>
            <SearchIcon>
              <FaSearch size={14} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search movies & shows..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
            />
          </SearchWrapper>

          <AnimatePresence>
            {showResults && (
              <ResultsDropdown
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {isSearching ? (
                  <NoResults>Searching...</NoResults>
                ) : searchResults.length > 0 ? (
                  searchResults.map((result, idx) => (
                    <ResultItem
                      key={`${result.media_type}-${result.id}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleResultClick(result)}
                    >
                      {result.poster_path && (
                        <ResultPoster
                          src={`${TMDB_IMAGE_BASE_URL}${result.poster_path}`}
                          alt={result.title || result.name}
                        />
                      )}
                      <ResultInfo>
                        <ResultTitle>{result.title || result.name}</ResultTitle>
                        <ResultMeta>
                          {result.media_type === 'movie'
                            ? new Date(result.release_date || '').getFullYear() || 'N/A'
                            : new Date(result.first_air_date || '').getFullYear() || 'N/A'}{' '}
                          • {result.media_type === 'movie' ? 'Movie' : 'TV'}
                        </ResultMeta>
                      </ResultInfo>
                    </ResultItem>
                  ))
                ) : (
                  <NoResults>No results found</NoResults>
                )}
              </ResultsDropdown>
            )}
          </AnimatePresence>
        </SearchContainer>
      </NavCenter>

      <UserAvatar href="https://www.linkedin.com/in/rahul-kumar-singh-1a14401ba/" target="_blank" rel="noopener noreferrer">
        <FaUser size={16} />
      </UserAvatar>

      <AnimatePresence>
        {showServerSelection && pendingResult && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowServerSelection(false)}
          >
            <Modal
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>Choose Server</ModalTitle>
              <ModalSubText>
                {pendingResult.title || pendingResult.name}
              </ModalSubText>
              <ServerOptions>
                <ServerOption
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleServerSelect('111movies')}
                  disabled={isLoadingServerOptions}
                >
                  <FaPlay color="#e50914" /> Server 1
                </ServerOption>
                <ServerOption
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleServerSelect('rivestream')}
                  disabled={isLoadingServerOptions}
                >
                  <FaTv color="#e50914" /> Server 2
                </ServerOption>
                <ServerOption
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleServerSelect('streamingnow')}
                  disabled={isLoadingServerOptions}
                >
                  <FaFilm color="#e50914" /> Server 3
                </ServerOption>
                <ServerOption
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleServerSelect('vidbinge')}
                  disabled={isLoadingServerOptions}
                >
                  <FaFilm color="#e50914" /> Server 4
                </ServerOption>
                <ServerOption
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleServerSelect('vembed')}
                  disabled={isLoadingServerOptions}
                >
                  <FaFilm color="#e50914" /> Server 5
                </ServerOption>
              </ServerOptions>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </Nav>
  );
};

export default Navbar;
