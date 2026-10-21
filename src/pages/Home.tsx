import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaTv, FaStar, FaFilm } from "react-icons/fa";
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, ServerType, getStreamUrl, serverManager } from "../services/api";

const MainContainer = styled.div`
  min-height: 100vh;
  background: #050505;
  color: #fff;
  padding-top: 68px;
  padding-bottom: 5rem;
  position: relative;
  z-index: 1;
`;

const HeroSection = styled.div<{ backdrop: string }>`
  height: 85vh;
  width: 100%;
  position: relative;
  background: linear-gradient(to bottom, rgba(5, 5, 5, 0.4) 0%, rgba(5, 5, 5, 1) 100%),
    url(${props => props.backdrop});
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  padding: 0 4rem;

  @media (max-width: 768px) {
    padding: 0 2rem;
    height: 70vh;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  z-index: 2;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 4px 10px rgba(0,0,0,0.5);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroOverview = styled.p`
  font-size: 1.2rem;
  color: #ccc;
  margin-bottom: 2rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

const WatchButton = styled(motion.button)`
  background: #e50914;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);

  &:hover {
    background: #ff0a16;
  }
`;

const MovieGridSection = styled.div`
  padding: 2rem 4rem;

  @media (max-width: 768px) {
    padding: 1rem 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #fff;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }
`;

const MovieCard = styled(motion.div)`
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 2/3;
  background: #181818;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover .overlay {
    opacity: 1;
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${MovieCard}:hover & {
    transform: scale(1.1);
  }
`;

const CardOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  margin: 0;
  color: #fff;
`;

const CardMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #e50914;
  margin-top: 0.25rem;
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
  z-index: 1000;
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

  &::before {
    content: "";
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

  &:hover {
    background: #333;
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  media_type?: "movie" | "tv";
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [trending, setTrending] = useState<TMDBMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showServerSelection, setShowServerSelection] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<{ id: number; type: "movie" | "tv" } | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `${TMDB_BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        const filtered = data.results.filter((m: TMDBMovie) => m.poster_path && m.backdrop_path);
        setMovies(filtered);
        setTrending(filtered[0] || null);
      } catch (err) {
        console.error("Failed to fetch movies", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieClick = (id: number, type: "movie" | "tv") => {
    setSelectedMovie({ id, type });
    setShowServerSelection(true);
  };

  const handleServerSelect = async (server: ServerType) => {
    if (!selectedMovie) return;
    
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/${selectedMovie.type}/${selectedMovie.id}/external_ids?api_key=${TMDB_API_KEY}`
      );
      const data = await response.json();
      const imdbId = data.imdb_id;

      if (!imdbId) {
        alert("Stream not found for this content.");
        return;
      }

      // Use TMDB ID for Server 6 (rivestreamembed), otherwise use IMDb ID
      const idForServer = server === 'rivestreamembed' ? selectedMovie.id.toString() : imdbId;
      const streamUrl =
        selectedMovie.type === "movie"
          ? getStreamUrl(idForServer, "movie", undefined, undefined, server)
          : getStreamUrl(idForServer, "tv", 1, 1, server);

      if (server === "rivestream") {
        window.open(streamUrl, "_blank", "noopener,noreferrer");
      } else {
        const navigateId = server === 'rivestreamembed' ? selectedMovie.id.toString() : imdbId;
        if (selectedMovie.type === "movie") {
          navigate(`/watch/${navigateId}`, { state: { server } });
        } else {
          navigate(`/tv/${navigateId}/watch/1/1`, { state: { server } });
        }
      }
      setShowServerSelection(false);
    } catch (err) {
      console.error(err);
      alert("Error finding stream.");
    }
  };

  if (loading && movies.length === 0) {
    return (
      <MainContainer style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h2 style={{ color: "#e50914" }}>Loading...</h2>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      {trending && (
        <HeroSection backdrop={`${TMDB_IMAGE_BASE_URL.replace("w500", "original")}${trending.backdrop_path}`}>
          <HeroContent>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <HeroTitle>{trending.title || trending.name}</HeroTitle>
              <HeroOverview>{trending.overview}</HeroOverview>
              <WatchButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleMovieClick(trending.id, trending.title ? "movie" : "tv")}
              >
                <FaPlay size={14} /> Watch Now
              </WatchButton>
            </motion.div>
          </HeroContent>
        </HeroSection>
      )}

      <MovieGridSection>
        <SectionTitle><FaFilm color="#e50914" /> Trending Now</SectionTitle>
        <Grid>
          {movies.map((movie, index) => (
            <MovieCard
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -10 }}
              onClick={() => handleMovieClick(movie.id, movie.title ? "movie" : "tv")}
            >
              <Poster src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title || movie.name} />
              <CardOverlay className="overlay">
                <CardTitle>{movie.title || movie.name}</CardTitle>
                <CardMeta>
                  <FaStar size={12} /> {movie.vote_average.toFixed(1)}  {movie.title ? "Movie" : "TV"}
                </CardMeta>
              </CardOverlay>
            </MovieCard>
          ))}
        </Grid>
      </MovieGridSection>

      <AnimatePresence>
        {showServerSelection && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowServerSelection(false)}
          >
            <Modal
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalTitle>Choose Server</ModalTitle>
              <ServerOptions>
                {serverManager.getServerList().map((srv, idx) => (
                  <ServerOption
                    key={srv.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleServerSelect(srv.id)}
                  >
                    {idx === 0 ? (
                      <FaPlay color="#e50914" />
                    ) : idx === 1 ? (
                      <FaTv color="#e50914" />
                    ) : (
                      <FaFilm color="#e50914" />
                    )}
                    {srv.label}
                  </ServerOption>
                ))}
              </ServerOptions>
              
              <button
                style={{
                  marginTop: "2rem",
                  background: "transparent",
                  border: "none",
                  color: "#666",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
                onClick={() => setShowServerSelection(false)}
              >
                Cancel
              </button>
            </Modal>
          </Overlay>
        )}
      </AnimatePresence>
    </MainContainer>
  );
};

export default Home;
