import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback } from 'react';
import { useAuth } from '../../common/context/AuthContext';
import { useTheme } from '../../common/context/ThemeContext';
import { Search } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../../types/navigation';
import { MediaSection } from '../../common/components/media';
import { MediaItem } from '../../types/media';
import { Header } from '../../common/components/header';
import { HomeSkeleton } from './components';
import { ErrorScreen } from '../../common/components/errorScreen';
import { useHomeData } from '../../common/hooks/useHomeData';

export default function HomeScreen() {
  const { token } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProps>();
  const { homeData, loading, error, refreshing, onRefresh } = useHomeData(token!);

  const handleMediaPress = useCallback((item: MediaItem) => {
    if (item.media_type === 'movie') {
      navigation.navigate('MovieDetail', { id: item.id });
    } else if (item.media_type === 'tv') {
      navigation.navigate('TVShowDetail', { id: item.id });
    }
  }, [navigation]);

  const handleSeeMore = useCallback((category: string) => {
    navigation.navigate('CategoryList', { category });
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Home"
        rightIcon={<Search color={theme.text} />}
        onRightPress={() => navigation.navigate('Search')}
      />

      {loading || !homeData ? (
        <HomeSkeleton sectionCount={6} />
      ) : error ? (
        <ErrorScreen
          message={error}
          actionText='Refresh'
          onAction={onRefresh}
          theme={theme}
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.text}
            />
          }
        >
          <>
            <MediaSection
              title="Trending Movies"
              data={homeData.trending_movies}
              onSeeMore={() => handleSeeMore('trending_movies')}
              onPressItem={handleMediaPress}
              theme={theme}
            />

            <MediaSection
              title="Trending TV Shows"
              data={homeData.trending_tv}
              onSeeMore={() => handleSeeMore('trending_tv')}
              onPressItem={handleMediaPress}
              theme={theme}
            />

            <MediaSection
              title="Popular Movies"
              data={homeData.popular_movies}
              onSeeMore={() => handleSeeMore('popular_movies')}
              onPressItem={handleMediaPress}
              theme={theme}
            />

            <MediaSection
              title="Popular TV Shows"
              data={homeData.popular_tv}
              onSeeMore={() => handleSeeMore('popular_tv')}
              onPressItem={handleMediaPress}
              theme={theme}
            />

            <MediaSection
              title="Upcoming Movies"
              data={homeData.upcoming_movies}
              onSeeMore={() => handleSeeMore('upcoming_movies')}
              onPressItem={handleMediaPress}
              theme={theme}
            />

            <MediaSection
              title="On Air TV Shows"
              data={homeData.on_air_tv}
              onSeeMore={() => handleSeeMore('on_air_tv')}
              onPressItem={handleMediaPress}
              theme={theme}
            />

            <MediaSection
              title="Top Rated Movies"
              data={homeData.top_rated_movies}
              onSeeMore={() => handleSeeMore('top_rated_movies')}
              onPressItem={handleMediaPress}
              theme={theme}
            />

            <MediaSection
              title="Top Rated TV Shows"
              data={homeData.top_rated_tv}
              onSeeMore={() => handleSeeMore('top_rated_tv')}
              onPressItem={handleMediaPress}
              theme={theme}
            />
          </>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
});
