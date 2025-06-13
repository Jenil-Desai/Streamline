import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, ViewStyle, LayoutChangeEvent, View, ActivityIndicator } from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { ThemeColors } from '../../context/ThemeContext';
import { MediaItem, MediaType } from '../../../types/media';
import { useWatchlist } from '../../context/WatchlistContext';
import WatchlistSelectionDialog from '../dialogs/WatchlistSelectionDialog';

interface MediaCardProps {
  item: MediaItem;
  onPress: (item: MediaItem) => void;
  theme: ThemeColors;
  style?: ViewStyle;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onPress, theme, style }) => {
  const [width, setWidth] = useState(120);
  const posterHeight = useMemo(() => width * 1.5, [width]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const { isItemInWatchlist, removeItemFromWatchlist } = useWatchlist();

  // Determine if the item is a movie or TV show based on properties
  const getMediaType = (mediaItem: MediaItem): MediaType => {
    // Some streaming services use different ID ranges for movies and TV shows
    // Or you can determine based on presence of specific properties
    // This is a simplified example - adjust based on your actual data structure
    if ('number_of_seasons' in mediaItem || 'number_of_episodes' in mediaItem) {
      return MediaType.TV;
    }
    return MediaType.MOVIE;
  };

  const mediaType = useMemo(() => getMediaType(item), [item]);

  const checkWatchlistStatus = useCallback(async () => {
    const result = await isItemInWatchlist(item.id, mediaType);
    setIsInWatchlist(result);
  }, [item.id, mediaType, isItemInWatchlist]);

  useEffect(() => {
    checkWatchlistStatus();
  }, [checkWatchlistStatus]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width: cardWidth } = event.nativeEvent.layout;
    if (cardWidth > 0 && cardWidth !== width) {
      setWidth(cardWidth);
    }
  };

  const toggleWatchlist = async (e: any) => {
    e.stopPropagation();

    if (isLoading) {
      return;
    }

    if (isInWatchlist) {
      setIsLoading(true);
      try {
        await removeItemFromWatchlist(item, mediaType);
        setIsInWatchlist(false);
      } catch (error) {
        console.error('Error removing from watchlist:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Show dialog for adding to watchlist
      setDialogVisible(true);
    }
  };

  const handleDialogClose = () => {
    setDialogVisible(false);
    // Check watchlist status again after dialog is closed
    checkWatchlistStatus();
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.mediaCard, style]}
        onPress={() => onPress(item)}
        activeOpacity={0.7}
        onLayout={onLayout}
      >
        <View style={styles.posterContainer}>
          <Image
            source={{ uri: item.poster_path }}
            style={[styles.poster, { width: width, height: posterHeight }]}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={toggleWatchlist}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Bookmark
                size={24}
                color={theme.background}
                fill={isInWatchlist ? theme.primary : 'transparent'}
                stroke={isInWatchlist ? theme.primary : theme.background}
                strokeWidth={2}
              />
            )}
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

      <WatchlistSelectionDialog
        visible={dialogVisible}
        onClose={handleDialogClose}
        item={item}
        mediaType={mediaType}
        theme={theme}
      />
    </>
  );
};

const styles = StyleSheet.create({
  mediaCard: {
    width: 120,
    marginRight: 12,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    width: 36,
    height: 36,
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
