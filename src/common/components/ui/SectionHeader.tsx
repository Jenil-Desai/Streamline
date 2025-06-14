import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemeColors } from '../../context/ThemeContext';

interface SectionHeaderProps {
  title: string;
  theme: ThemeColors;
  style?: ViewStyle;
  textStyle?: TextStyle;
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  theme,
  style,
  textStyle,
  action
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: theme.text }, textStyle]}>
        {title}
      </Text>
      {action && <View style={styles.actionContainer}>{action}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
