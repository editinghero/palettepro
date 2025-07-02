
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
}

interface ThemeContextType {
  currentTheme: string;
  themeColors: ThemeColors;
  setTheme: (theme: string) => void;
  availableThemes: { [key: string]: ThemeColors };
}

const defaultThemes = {
  purple: {
    primary: '#8B5CF6',
    secondary: '#A855F7',
    accent: '#EC4899',
    background: '#111827',
    surface: '#1F2937',
    text: '#F9FAFB'
  },
  blue: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#06B6D4',
    background: '#0F172A',
    surface: '#1E293B',
    text: '#F1F5F9'
  },
  green: {
    primary: '#10B981',
    secondary: '#34D399',
    accent: '#059669',
    background: '#064E3B',
    surface: '#065F46',
    text: '#ECFDF5'
  },
  orange: {
    primary: '#F59E0B',
    secondary: '#FBBF24',
    accent: '#DC2626',
    background: '#92400E',
    surface: '#B45309',
    text: '#FEF3C7'
  },
  red: {
    primary: '#EF4444',
    secondary: '#F87171',
    accent: '#DC2626',
    background: '#7F1D1D',
    surface: '#991B1B',
    text: '#FEE2E2'
  },
  pink: {
    primary: '#EC4899',
    secondary: '#F472B6',
    accent: '#BE185D',
    background: '#831843',
    surface: '#9D174D',
    text: '#FCE7F3'
  },
  teal: {
    primary: '#14B8A6',
    secondary: '#2DD4BF',
    accent: '#0891B2',
    background: '#134E4A',
    surface: '#115E59',
    text: '#F0FDFA'
  },
  indigo: {
    primary: '#6366F1',
    secondary: '#818CF8',
    accent: '#4F46E5',
    background: '#312E81',
    surface: '#3730A3',
    text: '#E0E7FF'
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('purple');
  const [themeColors, setThemeColors] = useState(defaultThemes.purple);

  useEffect(() => {
    const savedTheme = localStorage.getItem('colorpro-theme');
    if (savedTheme && defaultThemes[savedTheme as keyof typeof defaultThemes]) {
      setCurrentTheme(savedTheme);
      setThemeColors(defaultThemes[savedTheme as keyof typeof defaultThemes]);
    }
  }, []);

  useEffect(() => {
    // Apply theme colors to CSS variables
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', themeColors.primary);
    root.style.setProperty('--theme-secondary', themeColors.secondary);
    root.style.setProperty('--theme-accent', themeColors.accent);
    root.style.setProperty('--theme-background', themeColors.background);
    root.style.setProperty('--theme-surface', themeColors.surface);
    root.style.setProperty('--theme-text', themeColors.text);
  }, [themeColors]);

  const setTheme = (theme: string) => {
    if (defaultThemes[theme as keyof typeof defaultThemes]) {
      setCurrentTheme(theme);
      setThemeColors(defaultThemes[theme as keyof typeof defaultThemes]);
      localStorage.setItem('colorpro-theme', theme);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themeColors, setTheme, availableThemes: defaultThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
