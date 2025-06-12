import React from 'react';
import { StyleSheet, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle, TouchableOpacityProps, DimensionValue } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/colors';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export interface ButtonProps extends TouchableOpacityProps {
  text: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onClick: () => void;
}

export default function Button({
  text,
  variant = 'primary',
  disabled = false,
  fullWidth = true,
  style,
  textStyle,
  onClick,
  ...rest
}: ButtonProps) {
  const { theme, isDark } = useTheme();

  const getContainerStyle = (): StyleProp<ViewStyle> => {
    const baseStyle: ViewStyle = {
      ...styles.container,
      width: fullWidth ? '100%' as DimensionValue : 'auto' as DimensionValue,
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: isDark ? COLORS.GRAY_700 : COLORS.GRAY_300,
        opacity: 0.7,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const baseStyle = styles.text;

    if (disabled) {
      return {
        ...baseStyle,
        color: isDark ? COLORS.GRAY_400 : COLORS.GRAY_600,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          color: COLORS.WHITE,
        };
      case 'secondary':
        return {
          ...baseStyle,
          color: theme.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          color: theme.primary,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getContainerStyle(), style]}
      disabled={disabled}
      activeOpacity={0.8}
      onPress={onClick}
      {...rest}
    >
      <Text style={[getTextStyle(), textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 20,
    paddingVertical: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
