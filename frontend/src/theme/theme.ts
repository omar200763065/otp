import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getCustomTheme = (mode: 'dark' | 'light', direction: 'rtl' | 'ltr') => {
  const isDark = mode === 'dark';

  const themeOptions: ThemeOptions = {
    direction,
    palette: {
      mode,
      primary: {
        main: '#6366f1', // Electric Indigo
        light: '#818cf8',
        dark: '#4f46e5',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#a855f7', // Purple Neon
        light: '#c084fc',
        dark: '#9333ea',
      },
      success: {
        main: '#10b981', // Emerald Active
        light: '#34d399',
      },
      warning: {
        main: '#f59e0b', // Amber Alert
      },
      error: {
        main: '#ef4444',
      },
      background: {
        default: isDark ? '#090d16' : '#f1f5f9',
        paper: isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.85)',
      },
      text: {
        primary: isDark ? '#f8fafc' : '#0f172a',
        secondary: isDark ? '#94a3b8' : '#64748b',
      },
    },
    typography: {
      fontFamily: ['Cairo', 'Inter', 'sans-serif'].join(','),
      h4: { fontWeight: 800, letterSpacing: '-0.02em' },
      h5: { fontWeight: 800, letterSpacing: '-0.01em' },
      h6: { fontWeight: 700 },
      subtitle1: { fontWeight: 600 },
      button: { fontWeight: 700, textTransform: 'none' },
    },
    shape: {
      borderRadius: 18,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: isDark 
              ? 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' 
              : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: isDark 
              ? '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 1px inset rgba(255,255,255,0.1)' 
              : '0 20px 40px -15px rgba(0, 0, 0, 0.06)',
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            padding: '10px 24px',
            fontSize: '0.92rem',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
              transform: 'translateY(-1px)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 14,
              backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(8px)',
              '& fieldset': {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
              },
              '&:hover fieldset': {
                borderColor: '#818cf8',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6366f1',
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 700,
            borderRadius: 10,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};
