import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import { Review } from '../../../types/tv';
import { ThemeColors } from '../../context/ThemeContext';

interface ReviewCardProps {
  review: Review;
  theme: ThemeColors;
  onReadMorePress: (url: string) => void;
  style?: any;
}

const getAvatarUrl = (avatarPath: string | null): string => {
  if (!avatarPath) return '';
  if (avatarPath.startsWith('/https://')) {
    return avatarPath.substring(1);
  }
  return `https://image.tmdb.org/t/p/w200${avatarPath}`;
};

const getAvatarInitial = (username: string): string => {
  return username && username.length > 0 ? username[0].toUpperCase() : 'U';
};

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  theme,
  onReadMorePress,
  style
}) => {
  return (
    <View style={[styles.reviewCard, { backgroundColor: theme.surface }, style]}>
      <View style={styles.reviewHeader}>
        {review.author_details.avatar_path ? (
          <Image
            source={{ uri: getAvatarUrl(review.author_details.avatar_path) }}
            style={styles.reviewAvatar}
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarLetter}>
              {getAvatarInitial(review.author_details.username || review.author)}
            </Text>
          </View>
        )}

        <View style={styles.reviewAuthorContainer}>
          <Text style={[styles.reviewAuthor, { color: theme.text }]}>
            {review.author}
          </Text>
          <Text style={[styles.reviewUsername, { color: theme.textSecondary }]}>
            @{review.author_details.username || 'anonymous'}
          </Text>
        </View>

        {review.author_details.rating && (
          <View style={[styles.reviewRating, { backgroundColor: 'rgba(255, 149, 0, 0.1)' }]}>
            <Star size={14} color={theme.warning} fill={theme.warning} />
            <Text style={[styles.reviewRatingText, { color: theme.text }]}>
              {review.author_details.rating}/10
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.reviewContent, { color: theme.textSecondary }]} numberOfLines={3}>
        {review.content}
      </Text>

      <TouchableOpacity
        style={[styles.reviewLink, { borderColor: theme.border }]}
        onPress={() => onReadMorePress(review.url)}
      >
        <Text style={[styles.reviewLinkText, { color: theme.primary }]}>
          Read full review
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewCard: {
    padding: 12,
    borderRadius: 8,
    marginRight: 16,
    marginBottom: 12,
    width: 280,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  reviewAuthorContainer: {
    flex: 1,
    marginLeft: 12,
  },
  reviewAuthor: {
    fontSize: 15,
    fontWeight: '600',
  },
  reviewUsername: {
    fontSize: 13,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  reviewRatingText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewLink: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 16,
  },
  reviewLinkText: {
    fontSize: 13,
    fontWeight: '500',
  }
});
