import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* CSS Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: ${({ theme }) => theme.typography.body1.fontSize};
    font-weight: ${({ theme }) => theme.typography.body1.fontWeight};
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.primary};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.body1.fontWeight};
    line-height: 1.2;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.h1.fontSize};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.h2.fontSize};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.h3.fontSize};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.h4.fontSize};
    font-weight: ${({ theme }) => theme.typography.h4.fontWeight};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 2px;
      border-radius: ${({ theme }) => theme.radius.sm};
    }
  }

  /* Buttons */
  button {
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    transition: all 0.2s ease;

    &:focus {
      outline: 2px solid ${({ theme }) => theme.colors.primary};
      outline-offset: 2px;
      border-radius: ${({ theme }) => theme.radius.sm};
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* Forms */
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(0, 122, 204, 0.1);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
      background-color: ${({ theme }) => theme.colors.background.tertiary};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.quaternary};
    }
  }

  /* Lists */
  ul, ol {
    list-style: none;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  /* Scrollbars */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.background.tertiary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.quaternary};
  }

  /* Selection */
  ::selection {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  /* Utility classes */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .mb-0 {
    margin-bottom: 0;
  }

  .mt-0 {
    margin-top: 0;
  }

  /* Animation classes */
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
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }

  .animate-slide-in {
    animation: slideIn 0.5s ease-in-out;
  }

  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Container */
  .container {
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 ${({ theme }) => theme.spacing.md};
  }

  /* Flex utilities */
  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-sm {
    gap: ${({ theme }) => theme.spacing.sm};
  }

  .gap-md {
    gap: ${({ theme }) => theme.spacing.md};
  }

  .gap-lg {
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

export default GlobalStyle;