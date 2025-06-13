import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { ThemeColors } from '../../context/ThemeContext';
import { MediaItem } from '../../../types/media';

interface MediaCardProps {
  item: MediaItem;
  onPress: (item: MediaItem) => void;
  theme: ThemeColors;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onPress, theme }) => {
  return (
    <TouchableOpacity
      style={styles.mediaCard}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.poster_path }}
        style={styles.poster}
        resizeMode="cover"
      />
      <Text
        style={[styles.mediaTitle, { color: theme.text }]}
        numberOfLines={1}
      >
        {item.title}
      </Text>
      <Text
        style={[styles.mediaDate, { color: theme.textSecondary }]}
        numberOfLines={1}
      >
        {item.release_date}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mediaCard: {
    width: 120,
    marginRight: 12,
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  mediaTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
  },
  mediaDate: {
    fontSize: 12,
    marginTop: 2,
  },
});
