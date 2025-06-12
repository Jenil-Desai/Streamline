import {
  fontFamilies,
  FontFamily,
  FontWeight,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_WEIGHT,
} from '../constants/fonts';

/**
 * Gets the appropriate font family name based on family and weight
 *
 * @param family - The font family to use (defaults to the default font family defined in constants)
 * @param weight - The weight of the font (defaults to the default weight defined in constants)
 * @returns The platform-specific font name
 */
export const getFontFamily = (
  family: FontFamily = DEFAULT_FONT_FAMILY,
  weight: FontWeight = DEFAULT_FONT_WEIGHT
): string => {
  // Check if family exists
  if (!fontFamilies[family]) {
    console.warn(`Font family ${family} not found, falling back to ${DEFAULT_FONT_FAMILY}`);
    family = DEFAULT_FONT_FAMILY;
  }

  // Check if weight exists for the selected family
  if (!fontFamilies[family][weight]) {
    console.warn(`Weight ${weight} not found for font family ${family}, falling back to ${DEFAULT_FONT_WEIGHT}`);
    weight = DEFAULT_FONT_WEIGHT;
  }

  return fontFamilies[family][weight] || fontFamilies[DEFAULT_FONT_FAMILY][DEFAULT_FONT_WEIGHT] || '';
};

/**
 * Utility functions for specific font weights
 */
export const font = {
  thin: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'thin'),
  extraLight: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'extraLight'),
  light: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'light'),
  regular: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'normal'),
  medium: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'medium'),
  semiBold: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'semiBold'),
  bold: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'bold'),
  extraBold: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'extraBold'),
  black: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'black'),

  // Italic variants
  thinItalic: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'thinItalic'),
  extraLightItalic: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'extraLightItalic'),
  lightItalic: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'lightItalic'),
  italic: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'italic'),
  mediumItalic: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'mediumItalic'),
  semiBoldItalic: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'semiBoldItalic'),
  boldItalic: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'boldItalic'),
  extraBoldItalic: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'extraBoldItalic'),
  blackItalic: (family: FontFamily = DEFAULT_FONT_FAMILY) => getFontFamily(family, 'blackItalic'),
};
