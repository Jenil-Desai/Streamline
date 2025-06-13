import React, { JSX } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Header } from '../../common/components/headers';
import { ArrowLeft, Moon, Sun, Smartphone, Check } from 'lucide-react-native';
import { useTheme, ThemeType } from '../../common/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';
import { font } from '../../common/utils/font-family';

export default function ThemeSelectionScreen() {
  const { theme, themeType, setThemeType, isDark, isLoading } = useTheme();
  const navigation = useNavigation<NavigationProps>();

  const themeOptions: { type: ThemeType; label: string; icon: JSX.Element; description: string }[] = [
    {
      type: 'light',
      label: 'Light',
      icon: <Sun size={24} color={theme.text} />,
      description: 'Light background with dark text',
    },
    {
      type: 'dark',
      label: 'Dark',
      icon: <Moon size={24} color={theme.text} />,
      description: 'Dark background with light text',
    },
    {
      type: 'system',
      label: 'System Default',
      icon: <Smartphone size={24} color={theme.text} />,
      description: `Follow your device settings (Currently: ${isDark ? 'Dark' : 'Light'})`,
    },
  ];

  const handleThemeChange = (newThemeType: ThemeType) => {
    setThemeType(newThemeType);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="App Theme"
        leftIcon={<ArrowLeft color={theme.text} />}
        onLeftPress={() => navigation.goBack()}
      />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading theme preferences...
          </Text>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
            Choose how Streamline appears to you
          </Text>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.type}
              style={[
                styles.themeOption,
                {
                  backgroundColor: themeType === option.type ? theme.primaryLight : theme.surface,
                  borderColor: themeType === option.type ? theme.primary : theme.border,
                },
              ]}
              onPress={() => handleThemeChange(option.type)}
            >
              <View style={styles.optionContent}>
                <View style={styles.iconContainer}>{option.icon}</View>
                <View style={styles.textContainer}>
                  <Text style={[styles.optionLabel, { color: theme.text }]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
                    {option.description}
                  </Text>
                </View>
              </View>
              {themeType === option.type && (
                <View style={styles.checkContainer}>
                  <Check size={20} color={theme.primary} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  loadingText: {
    fontFamily: font.medium(),
    fontSize: 16,
  },
  sectionDescription: {
    fontFamily: font.regular(),
    fontSize: 14,
    marginBottom: 12,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: font.medium(),
    fontSize: 16,
    marginBottom: 4,
  },
  optionDescription: {
    fontFamily: font.regular(),
    fontSize: 13,
  },
  checkContainer: {
    marginLeft: 16,
  },
});
