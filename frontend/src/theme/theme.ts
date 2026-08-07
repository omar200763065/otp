import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getCustomTheme = (mode: 'dark' | 'light', direction: 'rtl' | 'ltr') => {
  const isDark = mode === 'dark';

  const themeOptions: ThemeOptions = {
    direction,
    palette: {
      mode,
      primary: {
        main: '#6366f1', // Vibrant Indigo
        light: '#818cf8',
        dark: '#4f46e5',
      },
      secondary: {
        main: '#10b981', // Emerald Emerald Green
      },
      background: {
        default: isDark ? '#0b0f17' : '#f8fafc',
        paper: isDark ? 'rgba(17, 24, 39, 0.75)' : 'rgba(255, 255, 255, 0.85)',
      },
      text: {
        primary: isDark ? '#f3f4f6' : '#1e293b',
        secondary: isDark ? '#9ca3af' : '#64748b',
      },
    },
    typography: {
      fontFamily: ['Cairo', 'Inter', 'sans-serif'].join(','),
      h4: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(16px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: isDark 
              ? '0 10px 30px -10px rgba(0,0,0,0.5)' 
              : '0 10px 30px -10px rgba(0,0,0,0.05)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            padding: '10px 22px',
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};
