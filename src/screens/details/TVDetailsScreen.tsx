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
import Header from '../../common/components/headers/Header';
import { TVDetailsSkeletonScreen } from './skeleton';
import { TVDetailsError } from '../../common/components/details/errors';
import {
  TVDetails,
  Season,
  Episode,
  Video,
  WatchProviders,
} from '../../types/tv';
import {
  formatRuntime,
  formatDate,
  getVideoUrl,
} from '../../common/utils/tvDetails';
import { fetchTVDetails } from '../../common/services/tvService';
import { NavigationProps, RootStackParamList } from '../../types/navigation';
import { VideoCard } from '../../common/components/media/VideoCard';
import { ReviewCard } from '../../common/components/media/ReviewCard';
import { MediaList } from '../../common/components/media/MediaList';
import { Badge, BadgeContainer } from '../../common/components/ui/Badge';
import { SectionHeader } from '../../common/components/ui/SectionHeader';
import { useWatchlist } from '../../common/context/WatchlistContext';
import { MediaTypeEnum } from '../../types/user/watchlistItem';
import { WatchlistModal } from '../../common/components/watchlist';
import WatchProviderSection from '../../components/WatchProviders/WatchProviderSection';

type TVDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TVShowDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TVDetailsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<TVDetailsScreenRouteProp>();
  const { id } = route.params;
  const { isItemInWatchlist, removeItemFromWatchlist } = useWatchlist();


  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tvDetails, setTvDetails] = useState<TVDetails | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [watchProviders, setWatchProviders] = useState<WatchProviders>({});
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [currentSeasonEpisodes, setCurrentSeasonEpisodes] = useState<Episode[]>([]);
  const [selectedVideoType, setSelectedVideoType] = useState<string>('Trailer');
  const [availableVideoTypes, setAvailableVideoTypes] = useState<string[]>([]);
  const [selectedProviderType, setSelectedProviderType] = useState<string>('flatrate');
  const [availableProviderTypes, setAvailableProviderTypes] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('IN');
  const [countryOptions, setCountryOptions] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch TV details
  useEffect(() => {
    const loadDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetchTVDetails(id);

        if (response.success && response.data) {
          setTvDetails(response.data.details);
          setSeasons(response.data.seasons || []);
          setWatchProviders(response.data.watchProviders);

          // Set default season
          if (response.data.seasons && response.data.seasons.length > 0) {
            const firstSeason = response.data.seasons.find(s => s.season_number > 0);
            if (firstSeason) {
              setSelectedSeason(firstSeason.season_number);
            }
          }
        } else {
          setError('Failed to load TV show details');
        }
      } catch (err) {
        console.error('Error fetching TV details:', err);
        setError('An error occurred while loading TV show details');
      } finally {
        setIsLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  // Load episodes for the selected season
  useEffect(() => {
    if (tvDetails && seasons && seasons.length > 0) {
      const season = seasons.find(s => s.season_number === selectedSeason);
      setCurrentSeasonEpisodes(season?.episodes || []);
    }
  }, [selectedSeason, seasons, tvDetails]);

  // Handle video tap
  const handleVideoPress = useCallback((video: Video) => {
    const videoUrl = getVideoUrl(video);
    if (videoUrl) {
      Linking.canOpenURL(videoUrl).then(supported => {
        if (supported) {
          Linking.openURL(videoUrl);
        } else {
          Alert.alert("Cannot open video", "Your device cannot open this video URL.");
        }
      });
    }
  }, []);

  const handleMediaItemPress = useCallback((item: MediaItem) => {
    // Navigate to details screen for the selected item
    if (item.media_type === 'tv') {
      navigation.push('TVShowDetail', { id: item.id });
    } else {
      console.log("Navigate to movie details for:", item.id);
    }
  }, [navigation]);

  // Handle review link press
  const handleReviewLinkPress = useCallback((url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Cannot open URL", "Your device cannot open this web page.");
      }
    });
  }, []);

  // Get videos from tvDetails using useMemo to avoid unnecessary re-renders
  const videos = React.useMemo(() => tvDetails?.videos?.results || [], [tvDetails]);

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

  // Get similar and recommendation shows
  const similar = tvDetails?.similar?.results?.map(item => ({
    ...item,
    poster_path: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image',
  })) || [];

  const recommendations = tvDetails?.recommendations?.results?.map(item => ({
    ...item,
    poster_path: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image',
  })) || [];

  // Get reviews
  const reviews = tvDetails?.reviews?.results || [];


  // Render loading state
  if (isLoading) {
    return <TVDetailsSkeletonScreen />;
  }

  // Render error state
  if (error) {
    return (
      <TVDetailsError
        message={error}
        onRetry={() => navigation.replace('TVShowDetail', { id })}
        onBack={() => navigation.goBack()}
        theme={theme}
      />
    );
  }

  if (!tvDetails) {
    return (
      <TVDetailsError
        message="No information available for this TV show"
        onRetry={() => navigation.replace('TVShowDetail', { id })}
        onBack={() => navigation.goBack()}
        theme={theme}
      />
    );
  }

  const isInWatchlist = isItemInWatchlist(tvDetails.id, MediaTypeEnum.TV);
  async function handleBookmarkPress() {
    if (isInWatchlist) {
      await removeItemFromWatchlist({
        id: tvDetails!.id as number,
        media_type: "tv",
        poster_path: tvDetails!.poster_path as string,
        title: tvDetails!.name,
        release_date: tvDetails!.first_air_date,
      }, MediaTypeEnum.TV);
    } else {
      setModalVisible(true);
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={tvDetails.name}
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
              uri: `https://image.tmdb.org/t/p/w500${tvDetails.poster_path}`
            }}
            style={styles.poster}
            resizeMode="cover"
          />
        </View>

        {/* Title, Rating and Popularity */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.text }]}>{tvDetails.name}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.ratingContainer}>
              <Star size={18} color={theme.warning} fill={theme.warning} />
              <Text style={[styles.ratingText, { color: theme.text }]}>
                {tvDetails.vote_average?.toFixed(1)}
              </Text>
            </View>

            <Text style={{ color: theme.textSecondary }}>•</Text>

            <View style={styles.popularityContainer}>
              <Users size={16} color={theme.textSecondary} />
              <Text style={[styles.popularityText, { color: theme.textSecondary }]}>
                {Math.round(tvDetails.popularity)}
              </Text>
            </View>
          </View>
        </View>

        {/* Genres */}
        <BadgeContainer style={styles.genresContainer}>
          {tvDetails.genres?.map(genre => (
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
              {tvDetails.original_language?.toUpperCase()}
            </Text>
          </View>

          <View style={styles.metadataDivider} />

          <View style={styles.metadataItem}>
            <Clock size={16} color={theme.textSecondary} />
            <Text style={[styles.metadataText, { color: theme.textSecondary }]}>
              {tvDetails.episode_run_time?.length > 0
                ? `${tvDetails.episode_run_time[0]} min/ep`
                : 'Runtime N/A'}
            </Text>
          </View>

          <View style={styles.metadataDivider} />

          <View style={styles.metadataItem}>
            <Calendar size={16} color={theme.textSecondary} />
            <Text style={[styles.metadataText, { color: theme.textSecondary }]}>
              {tvDetails.first_air_date?.substring(0, 4) || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Overview */}
        <View style={styles.overviewContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <SectionHeader title="Overview" theme={theme} />
            <TouchableOpacity onPress={() => Linking.openURL(tvDetails.homepage)}>
              <Badge
                key={'overview'}
                label={'Watch Now'}
                backgroundColor={theme.primary}
                textColor={'#ffffff'}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.overview, { color: theme.textSecondary, paddingHorizontal: 16 }]}>
            {tvDetails.overview || 'No overview available.'}
          </Text>
        </View>

        {/* Section spacing */}
        <View style={styles.sectionSpacer} />

        {/* Seasons section */}
        {seasons.length > 0 && (
          <>
            <SectionHeader title="Seasons" theme={theme} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.seasonsScrollView}
            >
              {seasons
                .filter(season => season.season_number > 0)
                .map(season => (
                  <TouchableOpacity
                    key={season.id}
                    style={[
                      styles.seasonPill,
                      {
                        backgroundColor:
                          selectedSeason === season.season_number
                            ? theme.primary
                            : theme.secondary,
                      }
                    ]}
                    onPress={() => setSelectedSeason(season.season_number)}
                  >
                    <Text
                      style={[
                        styles.seasonText,
                        {
                          color:
                            selectedSeason === season.season_number
                              ? '#FFFFFF'
                              : theme.text,
                        }
                      ]}
                    >
                      {season.name} ({season.episodes?.length})
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Episodes for selected season */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.episodesContainer}
            >
              {currentSeasonEpisodes.length > 0 ? (
                currentSeasonEpisodes.map(episode => (
                  <View key={episode.id} style={styles.episodeCard}>
                    <Image
                      source={{
                        uri: episode.still_path
                          ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                          : `https://image.tmdb.org/t/p/w500${tvDetails.poster_path}`
                      }}
                      style={styles.episodeImage}
                      resizeMode="cover"
                    />
                    <View style={styles.episodeDetails}>
                      <Text style={[styles.episodeNumber, { color: theme.primary }]}>
                        Episode {episode.episode_number}
                      </Text>
                      <Text style={[styles.episodeTitle, { color: theme.text }]} numberOfLines={1}>
                        {episode.name}
                      </Text>
                      <View style={styles.episodeInfoRow}>
                        <Text style={[styles.episodeMeta, { color: theme.textSecondary }]}>
                          {formatRuntime(episode.runtime)} • {formatDate(episode.air_date)}
                        </Text>
                      </View>
                      <Text style={[styles.episodeOverview, { color: theme.textSecondary }]} numberOfLines={2}>
                        {episode.overview || 'No description available.'}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={[styles.noContent, { color: theme.textSecondary }]}>
                  No episodes available for this season.
                </Text>
              )}
            </ScrollView>

            <View style={styles.sectionSpacer} />
          </>
        )}

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

        {/* Similar shows */}
        <MediaList
          title="Similar Shows"
          items={similar}
          theme={theme}
          onMediaPress={handleMediaItemPress}
          emptyMessage="No similar shows available"
        />

        <View style={styles.sectionSpacer} />

        {/* Recommended shows */}
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
          id: tvDetails.id,
          media_type: "tv",
          poster_path: tvDetails.poster_path as string,
          title: tvDetails.name,
          release_date: tvDetails.first_air_date,
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

  // Episodes section
  episodesContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  episodeCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  episodeImage: {
    width: 280,
    height: 157,
    backgroundColor: '#e0e0e0',
  },
  episodeDetails: {
    padding: 10,
  },
  episodeNumber: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  episodeTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  episodeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  episodeMeta: {
    fontSize: 12,
  },
  episodeOverview: {
    fontSize: 13,
    lineHeight: 18,
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

export default TVDetailsScreen;
