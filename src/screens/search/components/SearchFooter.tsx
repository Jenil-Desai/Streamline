import { StyleSheet, View } from "react-native";
import { SearchSkeleton } from ".";
import { MediaItem } from "../../../types/media";
import { useTheme } from "../../../common/context/ThemeContext";
import { ErrorScreen } from "../../../common/components/errorScreen";

interface SearchFooterProps {
  loading: boolean;
  error: string | null;
  page: number;
  results: MediaItem[];
  layoutColumns: number;
  handleRetry: () => void;
}

export default function SearchFooter({ loading, results, error, page, handleRetry, layoutColumns }: SearchFooterProps) {
  const { theme } = useTheme();

  if (loading && page > 1) {
    return (
      <View style={styles.footerLoaderContainer}>
        <SearchSkeleton itemCount={layoutColumns * 2} />
      </View>
    );
  }

  if (error && results.length === 0) {
    return (
      <ErrorScreen
        message={error}
        actionText="Retry"
        onAction={handleRetry}
        theme={theme}
      />
    );
  }

  return null;
}

const styles = StyleSheet.create({
  footerLoaderContainer: {
    paddingTop: 8,
    paddingBottom: 16,
  },
})
