import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser } from 'react-icons/fa';

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
    scrolled ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0.5)'};
`;

const Logo = styled(Link)`
  color: #e50914;
  font-size: 1.8rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;

  &:hover {
    color: #b2070f;
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Nav
      scrolled={scrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Logo to="/">Rahulflix</Logo>

      <UserAvatar as="a" href="https://www.linkedin.com/in/rahul-kumar-singh-1a14401ba/" target="_blank" rel="noopener noreferrer">
        <FaUser size={16} />
      </UserAvatar>
    </Nav>
  );
};

export default Navbar;
