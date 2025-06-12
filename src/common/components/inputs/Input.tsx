import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputProps,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/colors';
import { font } from '../../utils/font-family';

export type InputVariant = 'outlined' | 'filled' | 'underlined';

export interface InputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  variant?: InputVariant;
  error?: string;
  helper?: string;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

export default function Input({
  label,
  value,
  onChangeText,
  variant = 'outlined',
  error,
  helper,
  disabled = false,
  containerStyle,
  inputStyle,
  labelStyle,
  rightIcon,
  leftIcon,
  ...rest
}: InputProps) {
  const { theme, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const animatedLabelValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    animateLabelToTop();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      animateLabelToCenter();
    }
  };

  const animateLabelToTop = () => {
    Animated.timing(animatedLabelValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const animateLabelToCenter = () => {
    Animated.timing(animatedLabelValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  // Use different top positions based on variant
  const getLabelTopPosition = () => {
    if (variant === 'filled') {
      return animatedLabelValue.interpolate({
        inputRange: [0, 1],
        outputRange: [12, -10], // Move higher for filled variant
      });
    }
    return animatedLabelValue.interpolate({
      inputRange: [0, 1],
      outputRange: [12, -8],
    });
  };

  const labelTop = getLabelTopPosition();

  const labelFontSize = animatedLabelValue.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 12],
  });

  const getContainerStyle = (): StyleProp<ViewStyle> => {
    const baseStyle: ViewStyle = {
      ...styles.container,
      borderColor: error
        ? theme.error
        : isFocused
          ? theme.primary
          : theme.border,
    };

    if (disabled) {
      return {
        ...baseStyle,
        backgroundColor: isDark ? COLORS.GRAY_800 : COLORS.GRAY_200,
        opacity: 0.7,
      };
    }

    switch (variant) {
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: isDark ? COLORS.GRAY_800 : COLORS.GRAY_100,
          borderWidth: isFocused || error ? 1 : 0,
          paddingTop: 16, // Add extra padding at top for the label
        };
      case 'underlined':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 0,
          borderBottomWidth: 1,
          borderRadius: 0,
        };
      default:
        return baseStyle;
    }
  };

  const getInputStyle = (): StyleProp<TextStyle> => {
    const baseStyle: TextStyle = {
      ...styles.input,
      color: disabled
        ? isDark ? COLORS.GRAY_500 : COLORS.GRAY_600
        : theme.text,
      paddingLeft: leftIcon ? 8 : 0,
    };

    return baseStyle;
  };

  const getLabelColor = (): string => {
    if (error) return theme.error;
    if (disabled) return isDark ? COLORS.GRAY_500 : COLORS.GRAY_600;
    if (isFocused) return theme.primary;
    return theme.textSecondary;
  };

  const getLabelBackground = () => {
    if (variant === 'filled') {
      return 'transparent';
    }
    if (variant === 'outlined') {
      return theme.background;
    }
    return 'transparent';
  };

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={styles.wrapper}>
      <TouchableWithoutFeedback onPress={handleContainerPress}>
        <View>
          <View style={[getContainerStyle(), containerStyle]}>
            <Animated.Text
              style={[
                styles.label,
                {
                  top: labelTop,
                  fontSize: labelFontSize,
                  color: getLabelColor(),
                  backgroundColor: getLabelBackground(),
                  paddingHorizontal: variant === 'outlined' ? 4 : 0,
                  left: leftIcon ? (variant === 'outlined' ? 40 : 36) : 16,
                  zIndex: 1,
                },
                labelStyle,
              ]}
              numberOfLines={1}
            >
              {label}
            </Animated.Text>
            <View style={styles.inputContainer}>
              {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
              <TextInput
                ref={inputRef}
                style={[getInputStyle(), inputStyle]}
                value={value}
                onChangeText={onChangeText}
                onFocus={handleFocus}
                onBlur={handleBlur}
                editable={!disabled}
                placeholderTextColor={
                  isDark ? COLORS.GRAY_500 : COLORS.GRAY_400
                }
                {...rest}
              />
              {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {(error || helper) && (
        <Text
          style={[
            styles.helperText,
            {
              color: error ? theme.error : theme.textSecondary,
            },
          ]}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    width: '100%',
  },
  container: {
    borderRadius: 8,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    paddingVertical: 8,
    fontSize: 16,
    fontFamily: font.regular(),
  },
  label: {
    position: 'absolute',
    fontFamily: font.medium(),
  },
  helperText: {
    marginTop: 4,
    marginLeft: 16,
    fontSize: 12,
    fontFamily: font.regular(),
  },
  leftIconContainer: {
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    width: 24,
  },
  rightIconContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    width: 24,
  },
});
