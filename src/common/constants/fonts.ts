import { isIOS } from '../utils/platform-utils';

/**
 * Available font weights
 */
export type FontWeight =
  'thin' | 'thinItalic' |
  'extraLight' | 'extraLightItalic' |
  'light' | 'lightItalic' |
  'normal' | 'italic' |
  'medium' | 'mediumItalic' |
  'semiBold' | 'semiBoldItalic' |
  'bold' | 'boldItalic' |
  'extraBold' | 'extraBoldItalic' |
  'black' | 'blackItalic';

/**
 * Font family names
 */
export type FontFamily = 'BE_VIETNAM_PRO';

/**
 * Structure for font family variants
 */
export interface FontVariants {
  readonly thin?: string;
  readonly thinItalic?: string;
  readonly extraLight?: string;
  readonly extraLightItalic?: string;
  readonly light?: string;
  readonly lightItalic?: string;
  readonly normal?: string;
  readonly italic?: string;
  readonly medium?: string;
  readonly mediumItalic?: string;
  readonly semiBold?: string;
  readonly semiBoldItalic?: string;
  readonly bold?: string;
  readonly boldItalic?: string;
  readonly extraBold?: string;
  readonly extraBoldItalic?: string;
  readonly black?: string;
  readonly blackItalic?: string;
}

/**
 * Font families configuration with platform-specific naming
 */
export const fontFamilies: Record<FontFamily, FontVariants> = {
  BE_VIETNAM_PRO: {
    thin: isIOS() ? 'BeVietnamPro-Thin' : 'BeVietnamProThin',
    thinItalic: isIOS() ? 'BeVietnamPro-ThinItalic' : 'BeVietnamProThinItalic',
    extraLight: isIOS() ? 'BeVietnamPro-ExtraLight' : 'BeVietnamProExtraLight',
    extraLightItalic: isIOS() ? 'BeVietnamPro-ExtraLightItalic' : 'BeVietnamProExtraLightItalic',
    light: isIOS() ? 'BeVietnamPro-Light' : 'BeVietnamProLight',
    lightItalic: isIOS() ? 'BeVietnamPro-LightItalic' : 'BeVietnamProLightItalic',
    normal: isIOS() ? 'BeVietnamPro-Regular' : 'BeVietnamProRegular',
    italic: isIOS() ? 'BeVietnamPro-Italic' : 'BeVietnamProItalic',
    medium: isIOS() ? 'BeVietnamPro-Medium' : 'BeVietnamProMedium',
    mediumItalic: isIOS() ? 'BeVietnamPro-MediumItalic' : 'BeVietnamProMediumItalic',
    semiBold: isIOS() ? 'BeVietnamPro-SemiBold' : 'BeVietnamProSemiBold',
    semiBoldItalic: isIOS() ? 'BeVietnamPro-SemiBoldItalic' : 'BeVietnamProSemiBoldItalic',
    bold: isIOS() ? 'BeVietnamPro-Bold' : 'BeVietnamProBold',
    boldItalic: isIOS() ? 'BeVietnamPro-BoldItalic' : 'BeVietnamProBoldItalic',
    extraBold: isIOS() ? 'BeVietnamPro-ExtraBold' : 'BeVietnamProExtraBold',
    extraBoldItalic: isIOS() ? 'BeVietnamPro-ExtraBoldItalic' : 'BeVietnamProExtraBoldItalic',
    black: isIOS() ? 'BeVietnamPro-Black' : 'BeVietnamProBlack',
    blackItalic: isIOS() ? 'BeVietnamPro-BlackItalic' : 'BeVietnamProBlackItalic',
  },
};

/**
 * Default font family used across the app
 */
export const DEFAULT_FONT_FAMILY: FontFamily = 'BE_VIETNAM_PRO';

/**
 * Default font weight used across the app
 */
export const DEFAULT_FONT_WEIGHT: FontWeight = 'normal';
