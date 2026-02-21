import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import MainPage from './pages/MainPage';
import SplashScreen from './components/SplashScreen';
import { GlobalStyle, darkTheme } from './styles';
import '../i18n'; // 导入i18n配置

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <React.StrictMode>
        <GlobalStyle />
        {showSplash ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <MainPage />
        )}
      </React.StrictMode>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);
