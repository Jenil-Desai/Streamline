import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { ThemeColors } from '../../context/ThemeContext';
import { MediaItem } from '../../../types/media';
import { MediaCard } from './MediaCard';

interface MediaSectionProps {
  title: string;
  data: MediaItem[];
  onSeeMore: () => void;
  onPressItem: (item: MediaItem) => void;
  theme: ThemeColors;
}

export const MediaSection: React.FC<MediaSectionProps> = ({
  title,
  data,
  onSeeMore,
  onPressItem,
  theme
}) => {
  if (!data || data.length === 0) { return null; }

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
        <TouchableOpacity onPress={onSeeMore} style={styles.seeMore}>
          <ChevronRight size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map(item => (
          <MediaCard
            key={item.id}
            item={item}
            onPress={onPressItem}
            theme={theme}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeMore: {
    padding: 4,
  },
  scrollContent: {
    paddingRight: 16,
  },
});
