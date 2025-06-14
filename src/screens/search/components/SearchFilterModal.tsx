import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';
import { X } from 'lucide-react-native';
import { ThemeColors } from '../../../common/context/ThemeContext';

export interface FilterOptions {
  mediaType: 'movie' | 'tv' | '';
  includeAdult: boolean;
  language: string;
}

interface SearchFilterModalProps {
  visible: boolean;
  onClose: () => void;
  theme: ThemeColors;
  currentFilters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
}

const languages = [
  { code: 'en-US', name: 'English' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'it-IT', name: 'Italian' },
  { code: 'ja-JP', name: 'Japanese' },
  { code: 'ko-KR', name: 'Korean' },
];

const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
  visible,
  onClose,
  theme,
  currentFilters,
  onApplyFilters
}) => {
  const [filters, setFilters] = useState<FilterOptions>({ ...currentFilters });

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      mediaType: '',
      includeAdult: false,
      language: 'en-US'
    };
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Filter Results</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Media Type Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Media Type</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  filters.mediaType === '' && { backgroundColor: theme.primary }
                ]}
                onPress={() => setFilters({ ...filters, mediaType: '' })}
              >
                <Text style={[
                  styles.optionText,
                  { color: filters.mediaType === '' ? theme.background : theme.text }
                ]}>
                  All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  filters.mediaType === 'movie' && { backgroundColor: theme.primary }
                ]}
                onPress={() => setFilters({ ...filters, mediaType: 'movie' })}
              >
                <Text style={[
                  styles.optionText,
                  { color: filters.mediaType === 'movie' ? theme.background : theme.text }
                ]}>
                  Movies
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  filters.mediaType === 'tv' && { backgroundColor: theme.primary }
                ]}
                onPress={() => setFilters({ ...filters, mediaType: 'tv' })}
              >
                <Text style={[
                  styles.optionText,
                  { color: filters.mediaType === 'tv' ? theme.background : theme.text }
                ]}>
                  TV Shows
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Include Adult Content */}
          <View style={styles.filterSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Include Adult Content</Text>
            <Switch
              trackColor={{ false: "#767577", true: theme.primary }}
              thumbColor={filters.includeAdult ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) => setFilters({ ...filters, includeAdult: value })}
              value={filters.includeAdult}
            />
          </View>

          {/* Language Filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Language</Text>
            <View style={styles.languageOptions}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    filters.language === lang.code && { backgroundColor: theme.primary }
                  ]}
                  onPress={() => setFilters({ ...filters, language: lang.code })}
                >
                  <Text style={[
                    styles.languageText,
                    { color: filters.language === lang.code ? theme.background : theme.text }
                  ]}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.resetButton, { borderColor: theme.text }]}
            onPress={handleReset}
          >
            <Text style={[styles.buttonText, { color: theme.text }]}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: theme.primary }]}
            onPress={handleApply}
          >
            <Text style={[styles.buttonText, { color: theme.background }]}>Apply</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  languageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 8,
  },
  applyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SearchFilterModal;
