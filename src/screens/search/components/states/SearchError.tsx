import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemeColors } from '../../../../common/context/ThemeContext';
import { ErrorDisplay } from '../../../../common/components/ui/feedback';

interface SearchErrorProps {
  /**
   * Error message to display
   */
  message: string;

  /**
   * Theme colors object
   */
  theme: ThemeColors;

  /**
   * Optional retry callback
   */
  onRetry?: () => void;
}

/**
 * Error component specific to the search screen
 */
const SearchError: React.FC<SearchErrorProps> = ({
  message,
  theme,
  onRetry
}) => {
  return (
    <ErrorDisplay
      message={message}
      theme={theme}
      actionText={onRetry ? "Try Again" : undefined}
      onAction={onRetry}
      containerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  }
});

export default SearchError;
