import React, { useEffect } from 'react';
import { Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MoviePlayer from './pages/MoviePlayer';
import TVPlayer from './pages/TVPlayer';
import { GlobalStyles } from './styles/GlobalStyles';
import { serverManager } from './services/api';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
`;

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Automatically fetch updated server URLs from remote config on startup
    serverManager.init();
  }, []);

  const hideNavbar = location.pathname.startsWith('/watch/') ||
                     (location.pathname.includes('/tv/') && location.pathname.includes('/watch/'));

  return (
    <AppContainer>
      <GlobalStyles />
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:id" element={<MoviePlayer />} />
        <Route path="/tv/:id/watch/:season/:episode" element={<TVPlayer />} />
      </Routes>
    </AppContainer>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
