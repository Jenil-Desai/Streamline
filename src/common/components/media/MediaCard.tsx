import React, { useState, useMemo } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, ViewStyle, LayoutChangeEvent, View } from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { ThemeColors } from '../../context/ThemeContext';
import { MediaItem } from '../../../types/media';
import { useWatchlist } from '../../context/WatchlistContext';
import WatchlistModal from '../watchlist/WatchlistModal';
import { MediaTypeEnum } from '../../../types/user/watchlistItem';

interface MediaCardProps {
  item: MediaItem;
  onPress: (item: MediaItem) => void;
  theme: ThemeColors;
  style?: ViewStyle;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onPress, theme, style }) => {
  const [width, setWidth] = useState(120);
  const posterHeight = useMemo(() => width * 1.5, [width]);
  const [modalVisible, setModalVisible] = useState(false);

  const { isItemInWatchlist, removeItemFromWatchlist } = useWatchlist();

  // Convert media type to enum
  const mediaType = item.media_type === 'movie' ? MediaTypeEnum.MOVIE : MediaTypeEnum.TV;
  const isInWatchlist = isItemInWatchlist(item.id, mediaType);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width: cardWidth } = event.nativeEvent.layout;
    if (cardWidth > 0 && cardWidth !== width) {
      setWidth(cardWidth);
    }
  };

  const handleBookmarkPress = async () => {
    if (isInWatchlist) {
      await removeItemFromWatchlist(item, mediaType);
    } else {
      setModalVisible(true);
    }
  };

  return (
    <View style={[styles.mediaCard, style]} onLayout={onLayout}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => onPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: item.poster_path }}
            style={[styles.poster, { width: width, height: posterHeight }]}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={[
              styles.bookmarkButton,
              { backgroundColor: isInWatchlist ? theme.primary : 'rgba(0, 0, 0, 0.5)' },
            ]}
            onPress={handleBookmarkPress}
            activeOpacity={0.7}
          >
            <Bookmark
              size={16}
              color='#FFFFFF'
              fill={isInWatchlist ? '#FFFFFF' : 'none'}
            />
          </TouchableOpacity>
        </View>
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

      <WatchlistModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        item={item}
        theme={theme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mediaCard: {
    width: 120,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  posterContainer: {
    position: 'relative',
  },
  poster: {
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
