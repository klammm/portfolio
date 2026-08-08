export const palette = {
  bayBlue: '#1d428a',
  goldRush: '#ffc72c',
  missionOrange: '#fd5a1e',
  ninerCrimson: '#aa0000',
  fogWhite: '#f7f4ea',
  cableBlack: '#101820',
  bayTeal: '#1e7f83',
  presidioGreen: '#4b6b45',
} as const;

const fontBody =
  "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const shared = {
  palette,
  font: {
    body: fontBody,
  },
  radius: '8px',
};

export type ThemeName = 'light' | 'dark';

export const lightTheme = {
  ...shared,
  name: 'light' as ThemeName,
  colorScheme: 'light' as ThemeName,
  colors: {
    bg: '#fbfaf6',
    bgElevated: '#ffffff',
    bgMuted: '#f0ece1',
    text: '#151922',
    textMuted: '#5e6675',
    border: 'rgba(16, 24, 32, 0.13)',
    shadow: '0 12px 34px rgba(16, 24, 32, 0.08)',
    ring: 'rgba(29, 66, 138, 0.36)',
    heroOverlay:
      'linear-gradient(90deg, rgba(8, 14, 22, 0.92), rgba(8, 14, 22, 0.72) 38%, rgba(8, 14, 22, 0.3) 68%, rgba(8, 14, 22, 0.12))',
  },
};

export const darkTheme = {
  ...shared,
  name: 'dark' as ThemeName,
  colorScheme: 'dark' as ThemeName,
  colors: {
    bg: '#0d1117',
    bgElevated: '#141a23',
    bgMuted: '#1b232e',
    text: '#f7f4ea',
    textMuted: '#aeb7c5',
    border: 'rgba(247, 244, 234, 0.14)',
    shadow: '0 14px 44px rgba(0, 0, 0, 0.22)',
    ring: 'rgba(255, 199, 44, 0.42)',
    heroOverlay:
      'linear-gradient(90deg, rgba(6, 10, 16, 0.94), rgba(6, 10, 16, 0.72) 40%, rgba(6, 10, 16, 0.32) 70%, rgba(6, 10, 16, 0.14))',
  },
};

export type AppTheme = typeof lightTheme;

export const themes: Record<ThemeName, AppTheme> = {
  light: lightTheme,
  dark: darkTheme,
};
