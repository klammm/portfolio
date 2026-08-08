import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    color-scheme: ${({ theme }) => theme.colorScheme};
  }

  body {
    margin: 0;
    overflow-x: clip;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.font.body};
    line-height: 1.5;
    text-rendering: optimizeLegibility;
  }

  body::selection {
    background: ${({ theme }) => theme.palette.goldRush};
    color: ${({ theme }) => theme.palette.cableBlack};
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button,
  a {
    -webkit-tap-highlight-color: transparent;
  }

  button:focus-visible,
  a:focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.ring};
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
    }
  }
`;
