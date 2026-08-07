import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getCustomTheme } from '../theme/theme';
import { useTranslation } from 'react-i18next';

interface ColorModeContextType {
  mode: 'dark' | 'light';
  toggleColorMode: () => void;
  lang: string;
  changeLanguage: (lng: string) => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<string>(i18n.language || 'ar');

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLang(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  const direction = lang === 'ar' ? 'rtl' : 'ltr';
  const theme = useMemo(() => getCustomTheme(mode, direction), [mode, direction]);

  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode, lang, changeLanguage }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context) throw new Error('useColorMode must be used within ColorModeProvider');
  return context;
};
