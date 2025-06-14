import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Video } from '../../../types/tv';
import { ThemeColors } from '../../context/ThemeContext';

interface VideoCardProps {
  video: Video;
  theme: ThemeColors;
  onPress: (video: Video) => void;
  style?: any;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  theme,
  onPress,
  style
}) => {
  const getYouTubeThumbnail = (videoKey: string): string => {
    return `https://img.youtube.com/vi/${videoKey}/mqdefault.jpg`;
  };

  return (
    <TouchableOpacity
      style={[styles.videoCard, style]}
      onPress={() => onPress(video)}
      activeOpacity={0.7}
    >
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: getYouTubeThumbnail(video.key) }}
          style={styles.videoThumbnail}
          resizeMode="cover"
        />
      </View>
      <Text
        style={[styles.videoTitle, { color: theme.text }]}
        numberOfLines={2}
      >
        {video.name}
      </Text>
      <Text
        style={[styles.videoType, { color: theme.textSecondary }]}
        numberOfLines={1}
      >
        {video.type} • {video.site}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  videoCard: {
    width: 200,
    marginRight: 12,
    marginBottom: 12,
  },
  thumbnailContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: 112,
    backgroundColor: '#e0e0e0',
  },

  videoTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
  },
  videoType: {
    fontSize: 12,
    marginTop: 2,
  }
});
