import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getCustomTheme = (mode: 'dark' | 'light', direction: 'rtl' | 'ltr') => {
  const isDark = mode === 'dark';

  const themeOptions: ThemeOptions = {
    direction,
    palette: {
      mode,
      primary: {
        main: '#0d9488', // Emerald Teal
        light: '#2dd4bf', 
        dark: '#0f766e',  
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#06b6d4', // Cyber Cyan
        light: '#38bdf8',
        dark: '#0891b2',
      },
      success: {
        main: '#10b981', // Emerald Green Active
        light: '#34d399',
      },
      warning: {
        main: '#f59e0b', // Amber Alert
      },
      error: {
        main: '#f43f5e', // Rose Red
      },
      background: {
        default: isDark ? '#080c14' : '#f8fafc',
        paper: isDark ? 'rgba(15, 23, 42, 0.75)' : 'rgba(255, 255, 255, 0.92)',
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
      borderRadius: 16,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-track': {
            background: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(241, 245, 249, 0.5)',
          },
          '*::-webkit-scrollbar-thumb': {
            background: isDark ? 'rgba(45, 212, 191, 0.2)' : 'rgba(13, 148, 136, 0.2)',
            borderRadius: '4px',
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: isDark ? 'rgba(45, 212, 191, 0.4)' : 'rgba(13, 148, 136, 0.4)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: isDark 
              ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)' 
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.85) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isDark ? '1px solid rgba(45, 212, 191, 0.12)' : '1px solid rgba(13, 148, 136, 0.12)',
            boxShadow: isDark 
              ? '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 1px inset rgba(45, 212, 191, 0.15)' 
              : '0 20px 40px -15px rgba(13, 148, 136, 0.06)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 24px',
            fontSize: '0.92rem',
            boxShadow: 'none',
            transition: 'all 0.25s ease',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(13, 148, 136, 0.35)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.8)',
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
            borderRadius: 8,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};
