import React, { useMemo } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, ViewStyle, LayoutChangeEvent } from 'react-native';
import { ThemeColors } from '../../context/ThemeContext';
import { MediaItem } from '../../../types/media';

interface MediaCardProps {
  item: MediaItem;
  onPress: (item: MediaItem) => void;
  theme: ThemeColors;
  style?: ViewStyle;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onPress, theme, style }) => {
  const [width, setWidth] = React.useState(120);
  const posterHeight = useMemo(() => width * 1.5, [width]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width: cardWidth } = event.nativeEvent.layout;
    if (cardWidth > 0 && cardWidth !== width) {
      setWidth(cardWidth);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.mediaCard, style]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
      onLayout={onLayout}
    >
      <Image
        source={{ uri: item.poster_path }}
        style={[styles.poster, { width: width, height: posterHeight }]}
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
