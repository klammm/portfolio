import { useEffect, useState } from 'react';
import type { ThemeName } from '../theme/theme';

const STORAGE_KEY = 'portfolio-theme';

function getInitialTheme(): ThemeName {
  // By the time React runs, index.html's inline script has already set
  // data-theme on <html>. Read that instead of
  // localStorage directly, so React's first render matches what's already
  // painted on screen — no flash of the wrong theme.
  const attr = document.documentElement.getAttribute('data-theme');
  return attr === 'dark' ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return [theme, setTheme] as const;
}
