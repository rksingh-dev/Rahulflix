import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaTv, FaStar, FaFilm } from "react-icons/fa";
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL, ServerType, serverManager } from "../services/api";

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

const ModalSubText = styled.p`
  margin: -1.25rem 0 1.75rem 0;
  color: #b3b3b3;
  font-size: 1.05rem;
  font-weight: 500;
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

interface SelectedMovieInfo {
  id: number | string;
  type: "movie" | "tv";
  title?: string;
  imdbId?: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [trending, setTrending] = useState<TMDBMovie | null>(null);
  const [loading, setLoading] = useState(true);
  const [showServerSelection, setShowServerSelection] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<SelectedMovieInfo | null>(null);

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

  // Sync URL search params with server selection modal
  useEffect(() => {
    const movieParam = searchParams.get("movie");
    const typeParam = (searchParams.get("type") as "movie" | "tv") || "movie";

    if (movieParam) {
      const numId = parseInt(movieParam, 10);
      const isNumeric = !isNaN(numId) && /^\d+$/.test(movieParam);

      const locState = location.state as { movieTitle?: string } | undefined;
      const foundInList = movies.find(m => m.id === numId) || (trending?.id === numId ? trending : null);
      const initialTitle =
        locState?.movieTitle || (foundInList ? (foundInList.title || foundInList.name) : undefined);

      setSelectedMovie({
        id: isNumeric ? numId : movieParam,
        type: typeParam,
        title: initialTitle,
      });
      setShowServerSelection(true);

      if (!initialTitle) {
        if (isNumeric) {
          fetch(`${TMDB_BASE_URL}/${typeParam}/${numId}?api_key=${TMDB_API_KEY}`)
            .then(res => res.json())
            .then(data => {
              if (data && (data.title || data.name)) {
                setSelectedMovie(prev =>
                  prev && String(prev.id) === movieParam
                    ? { ...prev, title: data.title || data.name }
                    : prev
                );
              }
            })
            .catch(() => {});
        } else if (movieParam.startsWith("tt")) {
          fetch(`${TMDB_BASE_URL}/find/${movieParam}?api_key=${TMDB_API_KEY}&external_source=imdb_id`)
            .then(res => res.json())
            .then(data => {
              const item =
                (data.movie_results && data.movie_results[0]) ||
                (data.tv_results && data.tv_results[0]);
              if (item) {
                setSelectedMovie(prev =>
                  prev && String(prev.id) === movieParam
                    ? { ...prev, title: item.title || item.name, id: item.id }
                    : prev
                );
              }
            })
            .catch(() => {});
        }
      }
    } else {
      setShowServerSelection(false);
      setSelectedMovie(null);
    }
  }, [searchParams, movies, trending, location.state]);

  const handleMovieClick = (id: number | string, type: "movie" | "tv", title?: string) => {
    setSelectedMovie({ id, type, title });
    setShowServerSelection(true);
    setSearchParams({ movie: String(id), type });
  };

  const handleCloseModal = () => {
    setShowServerSelection(false);
    setSelectedMovie(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("movie");
    newParams.delete("type");
    setSearchParams(newParams, { replace: true });
  };

  const handleServerSelect = async (server: ServerType) => {
    if (!selectedMovie) return;
    
    try {
      let imdbId = selectedMovie.imdbId;
      const tmdbId = typeof selectedMovie.id === "number" ? selectedMovie.id : undefined;

      if (!imdbId) {
        if (typeof selectedMovie.id === "string" && selectedMovie.id.startsWith("tt")) {
          imdbId = selectedMovie.id;
        } else {
          const response = await fetch(
            `${TMDB_BASE_URL}/${selectedMovie.type}/${selectedMovie.id}/external_ids?api_key=${TMDB_API_KEY}`
          );
          const data = await response.json();
          imdbId = data.imdb_id;
        }
      }

      if (!imdbId && !tmdbId) {
        alert("Stream not found for this content.");
        return;
      }

      // Use TMDB ID for Server 6 (rivestreamembed) if available, otherwise IMDb ID
      const navigateId = (server === "rivestreamembed" && tmdbId)
        ? tmdbId.toString()
        : (imdbId || String(selectedMovie.id));

      const navState = {
        server,
        movieId: selectedMovie.id,
        mediaType: selectedMovie.type,
        movieTitle: selectedMovie.title,
        imdbId
      };

      if (selectedMovie.type === "movie") {
        navigate(`/watch/${navigateId}`, { state: navState });
      } else {
        navigate(`/tv/${navigateId}/watch/1/1`, { state: navState });
      }
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
                onClick={() => handleMovieClick(trending.id, trending.title ? "movie" : "tv", trending.title || trending.name)}
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
              onClick={() => handleMovieClick(movie.id, movie.title ? "movie" : "tv", movie.title || movie.name)}
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
            onClick={handleCloseModal}
          >
            <Modal
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalTitle>Choose Server</ModalTitle>
              {selectedMovie?.title && <ModalSubText>{selectedMovie.title}</ModalSubText>}
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
                onClick={handleCloseModal}
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
