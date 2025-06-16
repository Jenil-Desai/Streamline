import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { ThemeColors } from '../../context/ThemeContext';

interface SectionDividerProps {
  theme: ThemeColors;
  style?: ViewStyle;
  thickness?: number;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  theme,
  style,
  thickness = 8,
}) => {
  return (
    <View
      style={[
        styles.divider,
        { height: thickness, backgroundColor: theme.secondary + '33' },
        style
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
    marginVertical: 8,
  },
});
