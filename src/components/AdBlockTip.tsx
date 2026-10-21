import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { SiBrave } from 'react-icons/si';
import { FaShieldAlt, FaExternalLinkAlt, FaTimes, FaCheckCircle } from 'react-icons/fa';

interface AdBlockTipProps {
  variant?: 'navbar' | 'player';
}

const TipWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  z-index: 10001;
`;

const BadgeButton = styled(motion.button)<{ $variant?: 'navbar' | 'player' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: ${({ $variant }) => ($variant === 'player' ? '0.45rem 0.9rem' : '0.4rem 0.85rem')};
  background: ${({ $variant }) =>
    $variant === 'player' ? 'rgba(15, 15, 15, 0.85)' : 'rgba(251, 84, 43, 0.12)'};
  border: 1px solid rgba(251, 84, 43, 0.45);
  border-radius: 20px;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  transition: all 0.25s ease;
  user-select: none;
  font-family: inherit;

  &:hover {
    background: rgba(251, 84, 43, 0.22);
    border-color: rgba(251, 84, 43, 0.85);
    box-shadow: 0 0 16px rgba(251, 84, 43, 0.35);
  }

  @media (max-width: 600px) {
    padding: 0.35rem 0.65rem;
    font-size: 0.75rem;
  }
`;

const PulseDot = styled.span`
  width: 7px;
  height: 7px;
  background-color: #2ed573;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 8px #2ed573;
  animation: pulse 1.8s infinite;

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(46, 213, 115, 0.7);
    }
    70% {
      transform: scale(1.15);
      box-shadow: 0 0 0 6px rgba(46, 213, 115, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(46, 213, 115, 0);
    }
  }
`;

const BadgeText = styled.span`
  display: flex;
  align-items: center;
  gap: 0.35rem;

  @media (max-width: 768px) {
    .full-text {
      display: none;
    }
    .short-text {
      display: inline;
    }
  }

  @media (min-width: 769px) {
    .short-text {
      display: none;
    }
  }
`;

const PopoverCard = styled(motion.div)<{ $variant?: 'navbar' | 'player' }>`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 320px;
  background: rgba(18, 18, 18, 0.98);
  border: 1px solid rgba(251, 84, 43, 0.4);
  border-radius: 12px;
  padding: 1.1rem;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), 0 0 20px rgba(251, 84, 43, 0.15);
  backdrop-filter: blur(14px);
  z-index: 10002;
  color: #fff;

  @media (max-width: 400px) {
    width: 280px;
    right: -40px;
  }
`;

const PopoverHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const PopoverTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 0.95rem;
  color: #fff;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.2rem;
  border-radius: 4px;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }
`;

const PopoverDesc = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.4;
  margin: 0 0 0.9rem 0;
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 0.85rem;
`;

const OptionItem = styled.a`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  text-decoration: none;
  color: #fff;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(251, 84, 43, 0.12);
    border-color: rgba(251, 84, 43, 0.4);
    transform: translateY(-1px);
  }
`;

const OptionContent = styled.div`
  flex: 1;
`;

const OptionName = styled.div`
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
`;

const OptionSub = styled.div`
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.15rem;
  line-height: 1.3;
`;

const DismissBtn = styled.button`
  width: 100%;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  color: #ddd;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e50914;
    border-color: #e50914;
    color: #fff;
  }
`;

export const AdBlockTip: React.FC<AdBlockTipProps> = ({ variant = 'navbar' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <TipWrapper ref={wrapperRef}>
      <BadgeButton
        $variant={variant}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Use Brave or AdBlocker"
        title="For ad-free streaming, use Brave or an ad blocker"
      >
        <SiBrave size={14} color="#fb542b" />
        <FaShieldAlt size={12} color="#fb542b" />
        <BadgeText>
          <span className="full-text">Use Brave / AdBlocker</span>
          <span className="short-text">AdBlocker</span>
        </BadgeText>
        <PulseDot />
      </BadgeButton>

      <AnimatePresence>
        {isOpen && (
          <PopoverCard
            $variant={variant}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
          >
            <PopoverHeader>
              <PopoverTitle>
                <SiBrave color="#fb542b" size={16} />
                <span>Ad-Free Streaming Tip</span>
              </PopoverTitle>
              <CloseButton onClick={() => setIsOpen(false)} aria-label="Close">
                <FaTimes size={13} />
              </CloseButton>
            </PopoverHeader>

            <PopoverDesc>
              Stream servers often inject popups and redirects. For a smooth 100% ad-free experience,
              we recommend using:
            </PopoverDesc>

            <OptionList>
              <OptionItem
                href="https://brave.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiBrave size={18} color="#fb542b" style={{ marginTop: '2px' }} />
                <OptionContent>
                  <OptionName>
                    <span>Brave Browser</span>
                    <FaExternalLinkAlt size={10} color="rgba(255,255,255,0.5)" />
                  </OptionName>
                  <OptionSub>
                    Built-in Shields block all video popups & tracker ads automatically.
                  </OptionSub>
                </OptionContent>
              </OptionItem>

              <OptionItem
                href="https://ublockorigin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaShieldAlt size={16} color="#2ed573" style={{ marginTop: '2px' }} />
                <OptionContent>
                  <OptionName>
                    <span>uBlock Origin</span>
                    <FaExternalLinkAlt size={10} color="rgba(255,255,255,0.5)" />
                  </OptionName>
                  <OptionSub>
                    Free, lightweight ad-blocker extension for Chrome, Firefox, and Edge.
                  </OptionSub>
                </OptionContent>
              </OptionItem>
            </OptionList>

            <DismissBtn onClick={() => setIsOpen(false)}>
              <FaCheckCircle size={11} style={{ marginRight: '6px' }} />
              Got It, Enjoy Watching!
            </DismissBtn>
          </PopoverCard>
        )}
      </AnimatePresence>
    </TipWrapper>
  );
};

export default AdBlockTip;
