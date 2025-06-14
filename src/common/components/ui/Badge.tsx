import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ThemeColors } from '../../context/ThemeContext';

interface BadgeProps {
  label: string;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium' | 'large';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  backgroundColor,
  textColor,
  style,
  textStyle,
  size = 'medium'
}) => {
  const badgeStyle = {
    ...styles.badge,
    backgroundColor,
    ...(size === 'small' ? styles.badgeSmall : {}),
    ...(size === 'large' ? styles.badgeLarge : {}),
    ...style
  };

  const labelStyle = {
    ...styles.label,
    color: textColor,
    ...(size === 'small' ? styles.labelSmall : {}),
    ...(size === 'large' ? styles.labelLarge : {}),
    ...textStyle
  };

  return (
    <View style={badgeStyle}>
      <Text style={labelStyle} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

interface BadgeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const BadgeContainer: React.FC<BadgeContainerProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

// Helper function to create genre badges from an array
export const createGenreBadges = (
  genres: { id: number; name: string }[],
  theme: ThemeColors,
  size: 'small' | 'medium' | 'large' = 'medium'
) => {
  return genres.map(genre => (
    <Badge
      key={genre.id}
      label={genre.name}
      backgroundColor={theme.secondary}
      textColor={theme.text}
      size={size}
    />
  ));
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  labelSmall: {
    fontSize: 11,
  },
  labelLarge: {
    fontSize: 15,
  }
});
