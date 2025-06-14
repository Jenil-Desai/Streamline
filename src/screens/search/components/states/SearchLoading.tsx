import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../common/context/ThemeContext';
import { LoadingIndicator } from '../../../../common/components/ui/feedback';

interface SearchLoadingProps {
  /**
   * Theme colors object
   */
  theme: ThemeColors;

  /**
   * Whether this is the initial load or a pagination load
   */
  isInitialLoad?: boolean;
}

/**
 * Loading component specific to the search screen
 */
const SearchLoading: React.FC<SearchLoadingProps> = ({
  theme,
  isInitialLoad = true
}) => {
  return (
    <LoadingIndicator
      theme={theme}
      fullscreen={isInitialLoad}
      size={isInitialLoad ? 'large' : 'small'}
      containerStyle={isInitialLoad ? styles.fullscreenLoader : styles.paginationLoader}
    />
  );
};

const styles = StyleSheet.create({
  fullscreenLoader: {
    flex: 1,
  },
  paginationLoader: {
    paddingVertical: 20,
  }
});

export default SearchLoading;
