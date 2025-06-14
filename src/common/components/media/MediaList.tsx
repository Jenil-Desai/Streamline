import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MediaItem } from '../../../types/media';
import { ThemeColors } from '../../context/ThemeContext';
import { MediaCard } from './MediaCard';
import { SectionHeader } from '../ui/SectionHeader';

interface MediaListProps {
  title: string;
  items: MediaItem[];
  theme: ThemeColors;
  onMediaPress: (item: MediaItem) => void;
  emptyMessage?: string;
  showHeader?: boolean;
  style?: any;
}

export const MediaList: React.FC<MediaListProps> = ({
  title,
  items,
  theme,
  onMediaPress,
  emptyMessage = 'No items available',
  showHeader = true,
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      {showHeader && (
        <SectionHeader title={title} theme={theme} />
      )}

      {items.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {items.map(item => (
            <MediaCard
              key={item.id}
              item={item}
              onPress={onMediaPress}
              theme={theme}
              style={styles.mediaCard}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {emptyMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scrollContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  mediaCard: {
    marginBottom: 8,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  }
});
