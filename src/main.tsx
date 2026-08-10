import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import { useTheme } from './hooks/useTheme';
import { GlobalStyle } from './theme/GlobalStyle';
import { themes } from './theme/theme';

// eslint-disable-next-line react-refresh/only-export-components -- entry-point root, not meant to be independently hot-reloaded
function Root() {
  // Single source of truth for the theme, shared between ThemeProvider
  // (drives every styled-component) and the Header's toggle button.
  const [themeName, setThemeName] = useTheme();

  return (
    <ThemeProvider theme={themes[themeName]}>
      <GlobalStyle />
      <App theme={themeName} onToggleTheme={() => setThemeName(themeName === 'dark' ? 'light' : 'dark')} />
      <Analytics />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
