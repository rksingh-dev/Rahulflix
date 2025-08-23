import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import MoviePlayer from './pages/MoviePlayer';
import TVDetail from './pages/TVDetail';
import TVPlayer from './pages/TVPlayer';
import SearchResults from './pages/SearchResults';
import { GlobalStyles } from './styles/GlobalStyles';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
`;

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith('/watch/') ||
                     (location.pathname.includes('/tv/') && location.pathname.includes('/watch/'));

  return (
    <AppContainer>
      <GlobalStyles />
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/tv/:id" element={<TVDetail />} />
        <Route path="/watch/:id" element={<MoviePlayer />} />
        <Route path="/tv/:id/watch/:season/:episode" element={<TVPlayer />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
