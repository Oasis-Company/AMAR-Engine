import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import MainPage from './pages/MainPage';
import SplashScreen from './components/SplashScreen';
import { createGlobalStyle } from 'styled-components';
import '../i18n'; // 导入i18n配置

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #121212;
    color: #e0e0e0;
    overflow: hidden;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  button {
    cursor: pointer;
    background: transparent;
    color: inherit;
  }

  input, button {
    font-family: inherit;
  }

  /* 毛玻璃效果 */
  .acrylic {
    background: rgba(24, 24, 24, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* 统一线条样式 */
  .border {
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* 动画定义 */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }

  .slide-in {
    animation: slideIn 0.3s ease-in-out;
  }

  .pulse {
    animation: pulse 0.6s ease-in-out;
  }

  .spin {
    animation: spin 1s linear infinite;
  }
`;

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <React.StrictMode>
      <GlobalStyle />
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <MainPage />
      )}
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);
