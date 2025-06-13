/**
 * Colors.ts - Color constants and utilities for Streamline
 */

// Main Color Palette
export const COLORS = {
  PRIMARY: '#4747EB',
  PRIMARY_DARK: '#3535B2', // Darker version for hover/pressed states
  PRIMARY_LIGHT: '#E8E8F2', // Lighter version for highlights
  PRIMARY_ULTRALIGHT: '#E8E8FC', // Very light version for backgrounds

  // Secondary Colors
  SECONDARY: '#E8E8F2',
  SECONDARY_DARK: '#CACAD4', // Darker version for hover/pressed states
  SECONDARY_LIGHT: '#F4F4F9', // Lighter version for highlights
  SECONDARY_ULTRALIGHT: '#FAFAFD', // Very light version for backgrounds

  // Neutral Colors
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  GRAY_100: '#F7F7F7', // Lightest
  GRAY_200: '#E6E6E6',
  GRAY_300: '#D4D4D4',
  GRAY_400: '#B0B0B0',
  GRAY_500: '#8C8C8C',
  GRAY_600: '#6E6E6E',
  GRAY_700: '#4F4F4F',
  GRAY_800: '#333333',
  GRAY_900: '#1A1A1A', // Darkest

  // Semantic Colors
  SUCCESS: '#34C759',
  ERROR: '#FF3B30',
  WARNING: '#FF9500',
  INFO: '#007AFF',
};

// Opacity utilities
export const withOpacity = (color: string, opacity: number): string => {
  // Ensure opacity is between 0 and 1
  const validOpacity = Math.max(0, Math.min(1, opacity));

  // Convert opacity to hex
  const alphaHex = Math.round(validOpacity * 255).toString(16).padStart(2, '0');

  // Remove # if present and add alpha channel
  return `${color.replace('#', '')}${alphaHex}`;
};

// Color Utilities
export const Colors = {
  // Primary palette
  primary: COLORS.PRIMARY,
  primaryDark: COLORS.PRIMARY_DARK,
  primaryLight: COLORS.PRIMARY_LIGHT,
  primaryUltraLight: COLORS.PRIMARY_ULTRALIGHT,

  // Secondary palette
  secondary: COLORS.SECONDARY,
  secondaryDark: COLORS.SECONDARY_DARK,
  secondaryLight: COLORS.SECONDARY_LIGHT,
  secondaryUltraLight: COLORS.SECONDARY_ULTRALIGHT,

  // Text colors
  textPrimary: COLORS.GRAY_900,
  textSecondary: COLORS.GRAY_700,
  textTertiary: COLORS.GRAY_500,
  textInverted: COLORS.WHITE,

  // Background colors
  background: COLORS.WHITE,
  backgroundSecondary: COLORS.GRAY_100,
  backgroundTertiary: COLORS.GRAY_200,

  // Status colors
  success: COLORS.SUCCESS,
  error: COLORS.ERROR,
  warning: COLORS.WARNING,
  info: COLORS.INFO,

  // Helper functions
  withOpacity,
};

export default Colors;
