import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Container className={animationComplete ? 'fade-out' : ''}>
      <LogoContainer className={animationComplete ? 'scale-out' : 'scale-in'}>
        <Logo src="/assets/logos/logo.jpg" alt="AME" />
      </LogoContainer>
      <TextContainer className={animationComplete ? 'slide-up' : 'slide-down'}>
        <Title>AMAR Engine</Title>
        <Subtitle>Next-generation 3D virtual world generator</Subtitle>
      </TextContainer>
      <ProgressBarContainer>
        <ProgressBar className={animationComplete ? 'complete' : 'loading'} />
      </ProgressBarContainer>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #121212;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.5s ease-in-out;

  &.fade-out {
    opacity: 0;
  }
`;

const LogoContainer = styled.div`
  margin-bottom: 30px;
  transition: transform 1s ease-in-out;

  &.scale-in {
    animation: scaleIn 1s ease-in-out;
  }

  &.scale-out {
    transform: scale(0.8);
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.5);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const Logo = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 16px;
  border: 2px solid rgba(0, 122, 204, 0.5);
`;

const TextContainer = styled.div`
  text-align: center;
  margin-bottom: 40px;
  transition: transform 0.5s ease-in-out;

  &.slide-down {
    animation: slideDown 0.8s ease-in-out 0.5s both;
  }

  &.slide-up {
    transform: translateY(-20px);
    opacity: 0;
  }

  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #007acc;
  margin: 0 0 10px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #888888;
  margin: 0;
`;

const ProgressBarContainer = styled.div`
  width: 200px;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background-color: #007acc;
  border-radius: 2px;
  transition: width 1.5s ease-in-out;

  &.loading {
    width: 70%;
  }

  &.complete {
    width: 100%;
  }
`;

export default SplashScreen;