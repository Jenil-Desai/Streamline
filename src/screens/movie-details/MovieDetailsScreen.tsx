import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ChevronLeft, Star, Users, Clock, Calendar, Globe, Bookmark } from 'lucide-react-native';
import { useTheme } from '../../common/context/ThemeContext';
import { MediaItem } from '../../types/media';
import { Video, WatchProviders } from '../../types/tv';
import {
  getVideoUrl,
  formatRuntime,
} from '../../common/utils/movie-details';
import { fetchMovieDetails } from '../../common/services/movieService';
import { NavigationProps, RootStackParamList } from '../../types/navigation';
import { VideoCard } from '../../common/components/media/VideoCard';
import { ReviewCard } from '../../common/components/media/ReviewCard';
import { MediaList } from '../../common/components/media/MediaList';
import { Badge, BadgeContainer } from '../../common/components/badge';
import { SectionHeader } from '../../common/components/sectionHeader';
import { useWatchlist } from '../../common/context/WatchlistContext';
import { MediaTypeEnum } from '../../types/user/watchlistItem';
import { WatchlistModal } from '../../common/components/watchlist';
import { WatchProviderSection } from '../tv-details/components';
import { Header } from '../../common/components/header';
import { ErrorScreen } from '../../common/components/errorScreen';
import { MovieDetailsSkeletonScreen } from './components';

// Interface for Movie Details
interface MovieDetails {
  id: number;
  title: string;
  homepage: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  release_date: string;
  runtime: number;
  original_language: string;
  genres: { id: number, name: string }[];
  videos: { results: Video[] };
  recommendations: { results: MediaItem[], page: number, total_pages: number, total_results: number };
  similar: { results: MediaItem[], page: number, total_pages: number, total_results: number };
  reviews: { results: any[], page: number, total_pages: number, total_results: number };
  production_companies: { id: number, name: string, logo_path: string | null, origin_country: string }[];
  production_countries: { iso_3166_1: string, name: string }[];
  spoken_languages: { english_name: string, iso_639_1: string, name: string }[];
  budget: number;
  revenue: number;
  status: string;
}

type MovieDetailsScreenRouteProp = RouteProp<RootStackParamList, 'MovieDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MovieDetailsScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<MovieDetailsScreenRouteProp>();
  const { id } = route.params;
  const { isItemInWatchlist, removeItemFromWatchlist } = useWatchlist();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [watchProviders, setWatchProviders] = useState<WatchProviders>({});
  const [selectedVideoType, setSelectedVideoType] = useState<string>('Trailer');
  const [availableVideoTypes, setAvailableVideoTypes] = useState<string[]>([]);
  const [selectedProviderType, setSelectedProviderType] = useState<string>('flatrate');
  const [availableProviderTypes, setAvailableProviderTypes] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('IN');
  const [countryOptions, setCountryOptions] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch movie details
  useEffect(() => {
    const loadDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchMovieDetails(id);

        if (response.success && response.data) {
          setMovieDetails(response.data.details);
          setWatchProviders(response.data.watchProviders);
        } else {
          setError('Failed to load movie details');
        }
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('An error occurred while loading movie details');
      } finally {
        setIsLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  // Handle video tap
  const handleVideoPress = useCallback((video: Video) => {
    const videoUrl = getVideoUrl(video);
    if (videoUrl) {
      Linking.openURL(videoUrl);
    }
  }, []);

  const handleMediaItemPress = useCallback((item: MediaItem) => {
    // Navigate to details screen for the selected item
    if (item.media_type === 'tv') {
      navigation.push('TVShowDetail', { id: item.id });
    } else {
      navigation.push('MovieDetail', { id: item.id });
    }
  }, [navigation]);

  // Handle review link press
  const handleReviewLinkPress = useCallback((url: string) => {
    Linking.openURL(url);
  }, []);

  // Get videos from movieDetails using useMemo to avoid unnecessary re-renders
  const videos = React.useMemo(() => movieDetails?.videos?.results || [], [movieDetails]);

  // Get filtered videos based on selected type
  const filteredVideos = React.useMemo(
    () => videos.filter(video => video.type === selectedVideoType),
    [videos, selectedVideoType]
  );

  // Update available video types when videos change
  useEffect(() => {
    if (videos.length > 0) {
      const types = Array.from(new Set(videos.map(video => video.type)));
      setAvailableVideoTypes(types);
      // Set default selected type if current isn't available
      if (types.length > 0 && !types.includes(selectedVideoType)) {
        setSelectedVideoType(types[0]);
      }
    }
  }, [videos, selectedVideoType]);

  // Setup watch provider data
  useEffect(() => {
    if (watchProviders) {
      // Get all available countries
      const countries = Object.keys(watchProviders);
      setCountryOptions(countries);

      // Set default country to IN (India) if available, otherwise use US or first available
      if (countries.includes('IN')) {
        setSelectedCountry('IN');
      } else if (countries.includes('US')) {
        setSelectedCountry('US');
      } else if (countries.length > 0 && !countries.includes(selectedCountry)) {
        setSelectedCountry(countries[0]);
      }

      // Get provider types for the selected country
      if (selectedCountry && watchProviders[selectedCountry]) {
        const providerTypes = Object.keys(watchProviders[selectedCountry])
          .filter(key => key !== 'link');
        setAvailableProviderTypes(providerTypes);

        // Set default provider type
        if (providerTypes.includes('flatrate')) {
          setSelectedProviderType('flatrate');
        } else if (providerTypes.length > 0) {
          setSelectedProviderType(providerTypes[0]);
        }
      }
    }
  }, [watchProviders, selectedCountry]);

  // Get similar and recommendation movies
  const similar = movieDetails?.similar?.results?.map(item => ({
    ...item,
    poster_path: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image',
  })) || [];

  const recommendations = movieDetails?.recommendations?.results?.map(item => ({
    ...item,
    poster_path: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image',
  })) || [];

  // Get reviews
  const reviews = movieDetails?.reviews?.results || [];

  // Render loading state
  if (isLoading) {
    return <MovieDetailsSkeletonScreen />;
  }

  // Render error state
  if (error || !movieDetails) {
    return (
      <ErrorScreen
        message={error || 'No information available for this movie'}
        actionText="Retry"
        onAction={() => navigation.replace('MovieDetail', { id })}
        theme={theme}
      />
    );
  }

  const isInWatchlist = isItemInWatchlist(movieDetails.id, MediaTypeEnum.MOVIE);

  async function handleBookmarkPress() {
    if (isInWatchlist) {
      await removeItemFromWatchlist({
        id: movieDetails!.id as number,
        media_type: "movie",
        poster_path: movieDetails!.poster_path as string,
        title: movieDetails!.title,
        release_date: movieDetails!.release_date,
      }, MediaTypeEnum.MOVIE);
    } else {
      setModalVisible(true);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        backgroundColor={theme.background}
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent={false}
      />
      <Header
        title={movieDetails.title}
        leftIcon={<ChevronLeft size={24} color={theme.text} />}
        onLeftPress={() => navigation.goBack()}
        rightIcon={<Bookmark size={24} color={theme.text} fill={isInWatchlist ? 'black' : 'none'} />}
        onRightPress={handleBookmarkPress}
      />

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Poster and basic info section */}
        <View style={styles.posterContainer}>
          <Image
            source={{
              uri: movieDetails.poster_path
                ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Image'
            }}
            style={styles.poster}
            resizeMode="cover"
          />
        </View>

        {/* Title, Rating and Popularity */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text }]}>{movieDetails.title}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.ratingContainer}>
              <Star size={18} color={theme.warning} fill={theme.warning} />
              <Text style={[styles.ratingText, { color: theme.text }]}>
                {movieDetails.vote_average?.toFixed(1)}
              </Text>
            </View>

            <Text style={{ color: theme.textSecondary }}>•</Text>

            <View style={styles.popularityContainer}>
              <Users size={16} color={theme.textSecondary} />
              <Text style={[styles.popularityText, { color: theme.textSecondary }]}>
                {Math.round(movieDetails.popularity)}
              </Text>
            </View>
          </View>
        </View>

        {/* Genres */}
        <BadgeContainer style={styles.genresContainer}>
          {movieDetails.genres?.map(genre => (
            <Badge
              key={genre.id}
              label={genre.name}
              backgroundColor={theme.secondary}
              textColor={theme.text}
            />
          ))}
        </BadgeContainer>

        {/* Language, Runtime, and Release Year */}
        <View style={styles.metadataContainer}>
          <View style={styles.metadataItem}>
            <Globe size={16} color={theme.textSecondary} />
            <Text style={[styles.metadataText, { color: theme.textSecondary }]}>
              {movieDetails.original_language?.toUpperCase()}
            </Text>
          </View>

          <View style={styles.metadataDivider} />

          <View style={styles.metadataItem}>
            <Clock size={16} color={theme.textSecondary} />
            <Text style={[styles.metadataText, { color: theme.textSecondary }]}>
              {formatRuntime(movieDetails.runtime)}
            </Text>
          </View>

          <View style={styles.metadataDivider} />

          <View style={styles.metadataItem}>
            <Calendar size={16} color={theme.textSecondary} />
            <Text style={[styles.metadataText, { color: theme.textSecondary }]}>
              {movieDetails.release_date?.substring(0, 4) || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Overview */}
        <View style={styles.overviewContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <SectionHeader title="Overview" theme={theme} />
            <TouchableOpacity onPress={() => Linking.openURL(movieDetails.homepage)}>
              <Badge
                key={'overview'}
                label={'Watch Now'}
                backgroundColor={theme.primary}
                textColor={'#ffffff'}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.overview, { color: theme.textSecondary, paddingHorizontal: 16 }]}>
            {movieDetails.overview || 'No overview available.'}
          </Text>
        </View>

        {/* Section spacing */}
        <View style={styles.sectionSpacer} />

        {/* Watch Providers Section */}
        {watchProviders && Object.keys(watchProviders).length > 0 && (
          <>
            <WatchProviderSection
              watchProviders={watchProviders}
              selectedCountry={selectedCountry}
              selectedProviderType={selectedProviderType}
              availableProviderTypes={availableProviderTypes}
              countryOptions={countryOptions}
              setSelectedCountry={setSelectedCountry}
              setSelectedProviderType={setSelectedProviderType}
              theme={theme}
            />

            <View style={styles.sectionSpacer} />
          </>
        )}

        {/* Videos section */}
        {videos.length > 0 && (
          <>
            <SectionHeader title="Videos" theme={theme} />

            {/* Video types selector */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.seasonsScrollView}
            >
              {availableVideoTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.seasonPill,
                    {
                      backgroundColor:
                        selectedVideoType === type
                          ? theme.primary
                          : theme.secondary,
                    }
                  ]}
                  onPress={() => setSelectedVideoType(type)}
                >
                  <Text
                    style={[
                      styles.seasonText,
                      {
                        color:
                          selectedVideoType === type
                            ? '#FFFFFF'
                            : theme.text,
                      }
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Videos display */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.videosScrollContainer}
            >
              {filteredVideos.length > 0 ? (
                filteredVideos.map(video => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    theme={theme}
                    onPress={handleVideoPress}
                  />
                ))
              ) : (
                <Text style={[styles.noContent, { color: theme.textSecondary }]}>
                  No {selectedVideoType}s available
                </Text>
              )}
            </ScrollView>

            <View style={styles.sectionSpacer} />
          </>
        )}

        {/* Reviews section */}
        <SectionHeader title="Reviews" theme={theme} />
        {reviews.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.reviewsScrollContainer}
          >
            {reviews.map(review => (
              <ReviewCard
                key={review.id}
                review={review}
                theme={theme}
                onReadMorePress={handleReviewLinkPress}
              />
            ))}
          </ScrollView>
        ) : (
          <Text style={[styles.noContent, { color: theme.textSecondary }]}>
            No reviews available yet.
          </Text>
        )}

        <View style={styles.sectionSpacer} />

        {/* Similar movies */}
        <MediaList
          title="Similar Movies"
          items={similar}
          theme={theme}
          onMediaPress={handleMediaItemPress}
          emptyMessage="No similar movies available"
        />

        <View style={styles.sectionSpacer} />

        {/* Recommended movies */}
        <MediaList
          title="Recommendations"
          items={recommendations}
          theme={theme}
          onMediaPress={handleMediaItemPress}
          emptyMessage="No recommendations available"
          style={styles.recommendationsSection}
        />
      </ScrollView>

      <WatchlistModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        item={{
          id: movieDetails.id,
          media_type: "movie",
          poster_path: movieDetails.poster_path as string,
          title: movieDetails.title,
          release_date: movieDetails.release_date,
        }}
        theme={theme}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  sectionSpacer: {
    height: 24,
  },

  // Poster section
  posterContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  poster: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.9,
    borderRadius: 12,
  },

  // Title section
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  popularityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularityText: {
    fontSize: 14,
    marginLeft: 4,
  },

  // Genres section
  genresContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginBottom: 16,
  },

  // Metadata section
  metadataContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metadataText: {
    marginLeft: 6,
    fontSize: 14,
  },
  metadataDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(150, 150, 150, 0.8)',
    marginHorizontal: 10,
  },

  // Overview section
  overviewContainer: {
    marginBottom: 24,
  },
  overview: {
    fontSize: 15,
    lineHeight: 22,
  },

  // Country selector
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 16,
    marginBottom: 16,
  },
  countrySelectorText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },

  // Seasons/Video types selection
  seasonsScrollView: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  seasonPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  seasonText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Horizontal scrollable content
  videosScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  reviewsScrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // Message components
  noContent: {
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },

  // Provider styles
  providersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  providerCard: {
    width: 80,
    marginRight: 16,
    alignItems: 'center',
  },
  providerLogo: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  providerName: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '500',
  },
  countryList: {
    padding: 8,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  countryItemText: {
    fontSize: 16,
  },

  // Media lists
  recommendationsSection: {
    marginBottom: 16,
  },
});

export default MovieDetailsScreen;
