import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, GestureResponderEvent } from 'react-native';
import { font } from '../../../common/utils/font-family';
import { useTheme } from '../../../common/context/ThemeContext';

interface SettingsOptionProps {
  icon: React.ReactNode;
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
}

export const SettingsOption: React.FC<SettingsOptionProps> = ({ icon, title, onPress }) => {
  const { theme, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: isDark ? theme.primaryDark : theme.primaryLight }]}>
        {icon}
      </View>
      <Text style={[styles.title, { color: theme.text }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: font.regular(),
    fontSize: 16,
  },
});
