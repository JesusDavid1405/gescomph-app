import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../styles/color';

export interface ThemeColors {
  // Colores principales del branding
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;

  // Gradientes para fondos
  gradientStart: string;
  gradientEnd: string;
  gradientAccent: string;

  // Fondos y superficies
  background: string;
  surface: string;
  surfaceSecondary: string;

  // Textos
  text: string;
  textSecondary: string;
  textMuted: string;
  textLight: string;

  // Estados
  success: string;
  warning: string;
  danger: string;
  info: string;

  // Bordes y sombras
  border: string;
  shadow: string;
}

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Load saved theme preference
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setIsDark(savedTheme === 'dark');
        } else {
          // Use system preference as default
          setIsDark(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme preference:', error);
        setIsDark(systemColorScheme === 'dark');
      }
    };

    loadThemePreference();
  }, [systemColorScheme]);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};