import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS, Colors } from '../constants/colors';

// Define theme colors
export type ThemeColors = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
};

// Create light and dark theme objects
const lightTheme: ThemeColors = {
  primary: Colors.primary,
  primaryDark: Colors.primaryDark,
  primaryLight: Colors.primaryLight,
  secondary: Colors.secondary,
  secondaryDark: Colors.secondaryDark,
  secondaryLight: Colors.secondaryLight,
  background: Colors.background,
  surface: Colors.backgroundSecondary,
  text: Colors.textPrimary,
  textSecondary: Colors.textSecondary,
  border: COLORS.GRAY_300,
  error: Colors.error,
  success: Colors.success,
  warning: Colors.warning,
  info: Colors.info,
};

const darkTheme: ThemeColors = {
  primary: Colors.primary,
  primaryDark: Colors.primaryDark,
  primaryLight: Colors.primaryLight,
  secondary: COLORS.GRAY_800,
  secondaryDark: COLORS.GRAY_900,
  secondaryLight: COLORS.GRAY_700,
  background: COLORS.GRAY_900,
  surface: COLORS.GRAY_800,
  text: COLORS.WHITE,
  textSecondary: COLORS.GRAY_300,
  border: COLORS.GRAY_700,
  error: Colors.error,
  success: Colors.success,
  warning: Colors.warning,
  info: Colors.info,
};

export type ThemeType = 'light' | 'dark' | 'system';

type ThemeContextType = {
  theme: ThemeColors;
  themeType: ThemeType;
  isDark: boolean;
  setThemeType: (type: ThemeType) => void;
};

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
type ThemeProviderProps = {
  children: ReactNode;
  initialTheme?: ThemeType;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme = 'system',
}) => {
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>(initialTheme);

  // Determine if we're in dark mode
  const isDark =
    themeType === 'system'
      ? systemColorScheme === 'dark'
      : themeType === 'dark';

  // Get the current theme object
  const theme = isDark ? darkTheme : lightTheme;

  const value = {
    theme,
    themeType,
    isDark,
    setThemeType,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default ThemeContext;
