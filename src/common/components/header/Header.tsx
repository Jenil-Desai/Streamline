import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  /**
   * Title text to display in the center of the header (required)
   */
  title: string;

  /**
   * Optional left icon/component
   */
  leftIcon?: ReactNode;

  /**
   * Optional right icon/component
   */
  rightIcon?: ReactNode;

  /**
   * Optional callback for when the left icon is pressed
   */
  onLeftPress?: () => void;

  /**
   * Optional callback for when the right icon is pressed
   */
  onRightPress?: () => void;

  /**
   * Optional custom style for the header container
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Optional custom style for the title text
   */
  titleStyle?: object;
}

/**
 * A flexible header component that can show a title with optional left and right icons
 */
const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  containerStyle,
  titleStyle,
}) => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }, containerStyle]}>
      {/* Left icon area */}
      <View style={styles.leftContainer}>
        {leftIcon ? (
          <TouchableOpacity
            onPress={onLeftPress}
            disabled={!onLeftPress}
            style={styles.iconContainer}
          >
            {leftIcon}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>

      {/* Title area */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.text }, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Right icon area */}
      <View style={styles.rightContainer}>
        {rightIcon ? (
          <TouchableOpacity
            onPress={onRightPress}
            disabled={!onRightPress}
            style={styles.iconContainer}
          >
            {rightIcon}
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 2,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  iconContainer: {
    minWidth: 24,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Header;
