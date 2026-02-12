import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress(prev => {
        const newProgress = prev + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          setAnimationComplete(true);
          setTimeout(() => {
            onComplete();
          }, 800);
          return 100;
        }
        return newProgress;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <Container className={animationComplete ? 'fade-out' : ''}>
      <AnimationContainer className={animationComplete ? 'exit' : 'enter'}>
        <LogoContainer className={animationComplete ? 'scale-out' : 'scale-in'}>
          <LogoWrapper>
            <LogoCircle className="pulse">
              <LogoText>AME</LogoText>
            </LogoCircle>
            <Ring className="spin" />
          </LogoWrapper>
        </LogoContainer>
        <TextContainer className={animationComplete ? 'slide-up' : 'slide-in'}>
          <Title>AMAR Engine</Title>
          <Subtitle>Next-generation 3D virtual world generator</Subtitle>
        </TextContainer>
        <ProgressContainer>
          <ProgressBarContainer>
            <ProgressBar style={{ width: `${animationProgress}%` }} />
          </ProgressBarContainer>
          <ProgressText>{animationProgress}%</ProgressText>
        </ProgressContainer>
        <StatusContainer className="fade-in">
          <StatusText>Initializing components...</StatusText>
        </StatusContainer>
      </AnimationContainer>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.8s ease-in-out;

  &.fade-out {
    opacity: 0;
  }
`;

const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  &.enter {
    transform: translateY(0);
    opacity: 1;
  }

  &.exit {
    transform: translateY(-20px);
    opacity: 0;
  }
`;

const LogoContainer = styled.div`
  margin-bottom: 40px;
  transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);

  &.scale-in {
    animation: scaleIn 1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &.scale-out {
    transform: scale(0.9);
  }

  @keyframes scaleIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const LogoWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoCircle = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007acc 0%, #005a9e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(0, 122, 204, 0.6);
  position: relative;
  z-index: 2;

  &.pulse {
    animation: pulse 2s infinite ease-in-out;
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 30px rgba(0, 122, 204, 0.6);
    }
    50% {
      box-shadow: 0 0 50px rgba(0, 122, 204, 0.8);
    }
  }
`;

const LogoText = styled.div`
  font-size: 48px;
  font-weight: bold;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Ring = styled.div`
  position: absolute;
  width: 160px;
  height: 160px;
  border: 2px solid rgba(0, 122, 204, 0.3);
  border-radius: 50%;
  z-index: 1;

  &.spin {
    animation: spin 3s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const TextContainer = styled.div`
  text-align: center;
  margin-bottom: 40px;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  &.slide-in {
    animation: slideIn 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
  }

  &.slide-up {
    transform: translateY(-20px);
    opacity: 0;
  }

  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Title = styled.h1`
  font-size: 42px;
  font-weight: 300;
  color: white;
  margin: 0 0 12px 0;
  letter-spacing: 1px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Subtitle = styled.p`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-weight: 300;
  letter-spacing: 0.5px;
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  margin-bottom: 30px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 1.5px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #007acc 0%, #64b5f6 100%);
  border-radius: 1.5px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 122, 204, 0.6);
`;

const ProgressText = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 300;
`;

const StatusContainer = styled.div`
  margin-top: 10px;
  animation: fadeIn 1s ease-in-out 1s both;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const StatusText = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 300;
  font-style: italic;
`;

export default SplashScreen;