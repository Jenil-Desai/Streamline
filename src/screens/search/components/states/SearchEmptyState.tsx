import React from 'react';
import { StyleSheet } from 'react-native';
import { Search as SearchIcon } from 'lucide-react-native';
import { ThemeColors } from '../../../../common/context/ThemeContext';
import { EmptyState } from '../../../../common/components/ui/feedback';

interface SearchEmptyStateProps {
  /**
   * Whether the user has entered a search query
   */
  hasQuery: boolean;

  /**
   * Theme colors object
   */
  theme: ThemeColors;
}

/**
 * Empty state component specific to the search screen
 */
const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ hasQuery, theme }) => {
  if (hasQuery) {
    return (
      <EmptyState
        icon={<SearchIcon size={50} color={theme.textSecondary} />}
        title="No results found"
        subtitle="Try adjusting your search or filters"
        theme={theme}
        containerStyle={styles.container}
      />
    );
  }

  return (
    <EmptyState
      icon={<SearchIcon size={50} color={theme.textSecondary} />}
      title="Search for movies & TV shows"
      subtitle="Discover your next favorite"
      theme={theme}
      containerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 120,
  },
});

export default SearchEmptyState;
