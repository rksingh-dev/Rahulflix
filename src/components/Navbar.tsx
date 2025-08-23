import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSearch, FaBell, FaUser } from 'react-icons/fa';

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 4%;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.3s ease;
  background: ${({ scrolled }: { scrolled: boolean }) =>
    scrolled ? 'rgba(0, 0, 0, 0.9)' : 'transparent'};
`;

const Logo = styled(Link)`
  color: #e50914;
  font-size: 1.8rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: -0.5px;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 400;
  transition: color 0.3s ease;

  &:hover {
    color: #b3b3b3;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled(motion.input)`
  background: transparent;
  border: 1px solid #fff;
  border-radius: 4px;
  color: #fff;
  padding: 8px 12px;
  font-size: 0.9rem;
  width: 0;
  opacity: 0;
  transition: all 0.3s ease;

  &::placeholder {
    color: #b3b3b3;
  }

  &.expanded {
    width: 200px;
    opacity: 1;
  }
`;

const SearchButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #e50914;
  }
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  &:hover {
    color: #e50914;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #555;
  }
`;

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchExpanded(false);
    }
  };

  const toggleSearch = () => {
    setSearchExpanded(!searchExpanded);
    if (searchExpanded) {
      setSearchQuery('');
    }
  };

  const handleNavLinkClick = (e: React.MouseEvent, sectionId: string, path: string) => {
    e.preventDefault();
    navigate(path);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100); // Wait for navigation
  };

  return (
    <Nav
      scrolled={scrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Logo to="/">Rahulflix</Logo>

      <NavLinks>
        <NavLink to="/" onClick={e => handleNavLinkClick(e, 'hero-banner', '/')}>Home</NavLink>
        <NavLink to="/" onClick={e => handleNavLinkClick(e, 'trending', '/')}>Trending</NavLink>
        <NavLink to="/" onClick={e => handleNavLinkClick(e, 'popular', '/')}>Popular</NavLink>
        <NavLink to="/" onClick={e => handleNavLinkClick(e, 'top-rated', '/')}>Top Rated</NavLink>
        <NavLink to="/" onClick={e => handleNavLinkClick(e, 'upcoming', '/')}>Upcoming</NavLink>
      </NavLinks>

      <RightSection>
        <SearchContainer>
          <form onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={searchExpanded ? 'expanded' : ''}
              initial={false}
            />
          </form>
          <SearchButton onClick={toggleSearch}>
            <FaSearch size={16} />
          </SearchButton>
        </SearchContainer>

        <IconButton>
          <FaBell size={16} />
        </IconButton>

        <UserAvatar>
          <FaUser size={16} />
        </UserAvatar>
      </RightSection>
    </Nav>
  );
};

export default Navbar;
