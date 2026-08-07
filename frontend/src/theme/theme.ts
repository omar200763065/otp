import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getCustomTheme = (mode: 'dark' | 'light', direction: 'rtl' | 'ltr') => {
  const isDark = mode === 'dark';

  const themeOptions: ThemeOptions = {
    direction,
    palette: {
      mode,
      primary: {
        main: '#0d9488', // Emerald Turquoise Teal (أخضر فيروزي)
        light: '#2dd4bf', // Light Turquoise Mint
        dark: '#0f766e',  // Deep Forest Teal
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#06b6d4', // Electric Cyan
        light: '#38bdf8',
        dark: '#0891b2',
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
        default: isDark ? '#041316' : '#f0fdfa',
        paper: isDark ? 'rgba(8, 36, 42, 0.75)' : 'rgba(255, 255, 255, 0.88)',
      },
      text: {
        primary: isDark ? '#f0fdfa' : '#0f172a',
        secondary: isDark ? '#99f6e4' : '#5eead4',
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
              ? 'linear-gradient(135deg, rgba(45, 212, 191, 0.04) 0%, rgba(6, 182, 212, 0.02) 100%)' 
              : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240, 253, 250, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isDark ? '1px solid rgba(45, 212, 191, 0.15)' : '1px solid rgba(13, 148, 136, 0.1)',
            boxShadow: isDark 
              ? '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 1px inset rgba(45, 212, 191, 0.2)' 
              : '0 20px 40px -15px rgba(13, 148, 136, 0.08)',
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
              boxShadow: '0 8px 20px rgba(13, 148, 136, 0.4)',
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
              backgroundColor: isDark ? 'rgba(4, 19, 22, 0.4)' : 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              '& fieldset': {
                borderColor: isDark ? 'rgba(45, 212, 191, 0.2)' : 'rgba(13, 148, 136, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: '#2dd4bf',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#0d9488',
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
